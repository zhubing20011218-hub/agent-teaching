<script setup lang="ts">
// 学创 AI：全站右下角的机器人向导。
//
// 能做的事：
//   1. 边打字边搜：输入框里每打一个字，就在全站知识库里找，下面直接列出可以跳过去的小节
//   2. 直接问：按回车，交给服务器上的 AI，只根据本站内容回答，附上参考链接
//      (服务器没配钥匙或连不上时，自动改成"本地搜索"回答，网站照样能用)
//   3. 收集反馈，但不放"反馈按钮"：
//      - 划词：在正文里选中一段字，旁边冒出「问学创 / 这段有问题」
//      - 读完一页：机器人探头问一句"哪里卡住了吗？"，点表情或直接说
//      - 聊着聊着：读者说"这里写错了""希望多讲点……"，AI 自己认出来是反馈，转给作者
//      - 读者问了教程里没有的东西：服务器记下来(得分低 = 教程缺这块)
//
// 9 个动作见 XcRobot.vue。

import { computed, nextTick, onBeforeUnmount, onMounted, ref, watch } from 'vue'
import { useData, useRoute, useRouter, withBase } from 'vitepress'
import XcRobot from './XcRobot.vue'
import { createSearcher, snippet, THIS_PAGE } from '../../../elf/search.mjs'

type Mood = 'idle' | 'wave' | 'listen' | 'search' | 'think' | 'talk' | 'cheer' | 'confused' | 'sleep'
interface Source {
  u: string
  h: string
  p: string
}
interface Hit {
  u: string
  h: string
  p: string
  s: string
}
interface Msg {
  role: 'user' | 'elf'
  text: string
  quote?: string
  sources?: Source[]
  hits?: Hit[]
  filed?: string // 已转给作者的反馈类别
  local?: boolean // 本地搜索回答的(不是 AI)
  pending?: boolean
}

const NAME = '学创 AI'
const LS = 'agent-teaching:elf:'
const store = {
  get(k: string) {
    try {
      return localStorage.getItem(LS + k)
    } catch {
      return null
    }
  },
  set(k: string, v: string) {
    try {
      localStorage.setItem(LS + k, v)
    } catch {}
  },
}

const route = useRoute()
const router = useRouter()
const { page, frontmatter } = useData()

const ready = ref(false) // 只在浏览器里显示(服务器端渲染时不出现)
const hidden = ref(false) // 读者让它"先休息"
const open = ref(false)
const input = ref('')
const quote = ref('')
const mode = ref<'ask' | 'feedback'>('ask')
const feedbackVia = ref<'selection' | 'chapter-end' | 'chat'>('chat')
const msgs = ref<Msg[]>([])
const busy = ref(false)
const streaming = ref(false)
const serverDown = ref(false)
const bubble = ref<{ text: string; kind: 'hello' | 'end' | 'note' } | null>(null)
const sel = ref<{ text: string; x: number; y: number } | null>(null)
const transient = ref<Mood | null>(null)
const asleep = ref(false)
const hovering = ref(false)
const isMobile = ref(false)

const inputEl = ref<HTMLTextAreaElement>()
const listEl = ref<HTMLElement>()

const pageTitle = computed(() => String(frontmatter.value.title || page.value.title || ''))
const pathNow = computed(() => route.path.replace(/\.html$/, ''))

// ---------- 知识库(第一次用到时才下载，约 130KB) ----------
let searcher: ReturnType<typeof createSearcher> | null = null
let loading: Promise<void> | null = null
const kbReady = ref(false)
function loadKb() {
  if (!loading) {
    loading = fetch(withBase('/elf/index.json'))
      .then((r) => r.json())
      .then((d) => {
        searcher = createSearcher(d.chunks)
        kbReady.value = true
      })
      .catch(() => {
        loading = null
      })
  }
  return loading
}

function findLocal(q: string, limit = 4): Hit[] {
  if (!searcher) return []
  const pages = new Set<string>()
  const out: Hit[] = []
  const samePage = THIS_PAGE.test(q) // 问"这一页"时，结果本来就都在同一页，不按页面去重
  for (const r of searcher.search(q, { limit: limit * 3, path: pathNow.value })) {
    const p = r.chunk.u.split('#')[0]
    if (!samePage && pages.has(p) && !p.startsWith('/skill-hub')) continue
    pages.add(p)
    out.push({ u: r.chunk.u, h: r.chunk.h, p: r.chunk.p, s: snippet(r.chunk.t, q, 54) })
    if (out.length >= limit) break
  }
  return out
}

// 边打字边搜
const live = computed<Hit[]>(() => {
  const q = input.value.trim()
  if (!kbReady.value || mode.value !== 'ask' || busy.value || q.length < 2) return []
  return findLocal(q, 4)
})

// ---------- 动作：先看有没有临时动作(打招呼、开心、疑惑)，没有就按当前在做的事 ----------
const mood = computed<Mood>(() => {
  if (transient.value) return transient.value
  if (streaming.value) return 'talk'
  if (busy.value) return 'think'
  if (open.value && live.value.length) return 'search'
  if (open.value && input.value.trim()) return 'listen'
  if (asleep.value && !open.value) return 'sleep'
  if (hovering.value) return 'wave'
  return 'idle'
})
let moodTimer: ReturnType<typeof setTimeout> | undefined
function flash(m: Mood, ms = 1600) {
  transient.value = m
  clearTimeout(moodTimer)
  moodTimer = setTimeout(() => (transient.value = null), ms)
}
const status = computed(
  () =>
    ({
      idle: '在线 · 网站里的内容都能问我',
      wave: '你好呀 👋',
      listen: '在听……',
      search: '边听边翻书……',
      think: '想一想……',
      talk: '正在回答……',
      cheer: '收到啦！',
      confused: '嗯？没太找到……',
      sleep: '打盹中 · 点我叫醒',
    })[mood.value],
)

// ---------- 一分钟没人理就打盹 ----------
let idleTimer: ReturnType<typeof setTimeout> | undefined
function poke() {
  if (asleep.value) {
    asleep.value = false
    flash('wave', 1200)
  }
  clearTimeout(idleTimer)
  idleTimer = setTimeout(() => {
    if (!open.value && !busy.value) asleep.value = true
  }, 60_000)
}

// ---------- 打开 / 关闭 ----------
function toggle() {
  if (open.value) return close()
  openPanel()
}
function openPanel() {
  open.value = true
  bubble.value = null
  asleep.value = false
  loadKb()
  if (!msgs.value.length) flash('wave', 1200)
  nextTick(() => inputEl.value?.focus())
}
function close() {
  open.value = false
  if (mode.value === 'feedback' && !input.value.trim()) {
    mode.value = 'ask'
    quote.value = ''
  }
}
function rest() {
  hidden.value = true
  open.value = false
  store.set('hidden', '1')
}
function wake() {
  hidden.value = false
  store.set('hidden', '0')
  flash('wave', 1400)
}

function go(u: string) {
  router.go(withBase(u))
  if (isMobile.value) open.value = false
}

// ---------- 发消息 ----------
function scrollDown() {
  nextTick(() => listEl.value?.scrollTo({ top: listEl.value.scrollHeight, behavior: 'smooth' }))
}

function onKey(e: KeyboardEvent) {
  if (e.key === 'Enter' && !e.shiftKey && !e.isComposing) {
    e.preventDefault()
    send()
  }
}

async function send(text?: string) {
  const q = (text ?? input.value).trim()
  if (!q || busy.value) return
  input.value = ''
  const q2 = quote.value
  msgs.value.push({ role: 'user', text: q, quote: q2 || undefined })
  scrollDown()
  if (mode.value === 'feedback') {
    await fileFeedback(q, q2)
  } else {
    await ask(q, q2)
  }
  quote.value = ''
  mode.value = 'ask'
  scrollDown()
}

async function postFeedback(body: Record<string, unknown>) {
  const r = await fetch('/api/elf/feedback', {
    method: 'POST',
    headers: { 'content-type': 'application/json' },
    body: JSON.stringify({ path: pathNow.value, title: pageTitle.value, ...body }),
  })
  if (!r.ok) throw new Error(String(r.status))
  return (await r.json()) as { kind: string }
}

async function fileFeedback(text: string, q: string) {
  busy.value = true
  try {
    const r = await postFeedback({ text, quote: q || undefined, via: feedbackVia.value })
    const confused = r.kind === '看不懂'
    msgs.value.push({
      role: 'elf',
      text: confused
        ? '收到，已经转给作者，让他把这里讲得更清楚 🙌 我先试着给你讲讲：'
        : '收到！我已经原样转给作者了，谢谢你帮这份教程变得更好 🙌 还有别的想说、想问的，继续告诉我就行。',
      filed: r.kind,
    })
    busy.value = false
    flash('cheer', 1400)
    // 看不懂的地方，别光记下来，马上试着讲一遍
    if (confused) {
      scrollDown()
      await new Promise((ok) => setTimeout(ok, 900))
      await ask(text, q)
    }
  } catch {
    msgs.value.push({ role: 'elf', text: '哎呀，这条没发出去（服务器没连上）。过一会儿再跟我说一次好吗？' })
    busy.value = false
    flash('confused', 2000)
  }
}

/** 没有 AI 时，按关键词判断读者是不是在提意见 */
const FEEDBACK_HINT = /写错|错了|不对|有误|过时|打不开|看不懂|不明白|没懂|太难|讲清|建议|希望|能不能加|可不可以加|多讲|谢谢|感谢|太好了|好用|赞/

async function ask(q: string, q2: string) {
  busy.value = true
  const history = msgs.value
    .slice(0, -1)
    .filter((m) => !m.pending && m.text)
    .slice(-6)
    .map((m) => ({ role: m.role === 'user' ? 'user' : 'assistant', content: m.text }))

  if (!serverDown.value) {
    try {
      const res = await fetch('/api/elf/chat', {
        method: 'POST',
        headers: { 'content-type': 'application/json' },
        body: JSON.stringify({ q, quote: q2 || undefined, path: pathNow.value, title: pageTitle.value, history }),
      })
      const type = res.headers.get('content-type') || ''
      if (res.ok && type.includes('ndjson') && res.body) {
        await readStream(res.body)
        return
      }
      // 404 / 不是我们的接口 = 这台服务器上没有学创 AI 的接口(比如只开了静态网页)
      if (res.status === 404 || !type.includes('json')) serverDown.value = true
      if (res.status === 429) await localAnswer(q, q2, '今天问我的人太多啦，AI 先歇一会儿，我用搜索帮你找：')
      else await localAnswer(q, q2)
    } catch {
      serverDown.value = true
      await localAnswer(q, q2)
    }
  } else {
    await localAnswer(q, q2)
  }
}

async function readStream(body: ReadableStream<Uint8Array>) {
  msgs.value.push({ role: 'elf', text: '', pending: true })
  const m = msgs.value[msgs.value.length - 1] // 取回响应式的那一份，改它界面才会跟着变
  const reader = body.getReader()
  const dec = new TextDecoder()
  let buf = ''
  try {
    for (;;) {
      const { value, done } = await reader.read()
      if (done) break
      buf += dec.decode(value, { stream: true })
      let nl
      while ((nl = buf.indexOf('\n')) >= 0) {
        const line = buf.slice(0, nl).trim()
        buf = buf.slice(nl + 1)
        if (!line) continue
        let ev: any
        try {
          ev = JSON.parse(line)
        } catch {
          continue
        }
        if (ev.type === 'sources') m.sources = ev.items
        else if (ev.type === 'delta') {
          if (!streaming.value) streaming.value = true
          m.text += ev.text
          scrollDown()
        } else if (ev.type === 'feedback') m.filed = ev.kind
      }
    }
  } catch {}
  m.pending = false
  streaming.value = false
  busy.value = false
  if (!m.text.trim()) {
    m.text = '这次没想出来……换个问法试试？'
    flash('confused', 1800)
  } else if (m.filed) flash('cheer', 1800)
}

async function localAnswer(q: string, q2: string, lead?: string) {
  await loadKb()
  // 先装作在翻书，让读者看到它在找
  await new Promise((r) => setTimeout(r, 450))
  const hits = findLocal(`${q} ${q2}`, 3)
  let filed: string | undefined
  if (FEEDBACK_HINT.test(q)) {
    try {
      filed = (await postFeedback({ text: q, quote: q2 || undefined, via: 'chat' })).kind
    } catch {}
  }
  busy.value = false
  if (hits.length) {
    msgs.value.push({
      role: 'elf',
      local: true,
      hits,
      filed,
      text: filed
        ? '你说的我已经转给作者了，谢谢！另外，网站里这几节可能和你说的有关：'
        : lead || '我在网站里翻到这几节，最可能有你要的答案：',
    })
    flash(filed ? 'cheer' : 'wave', 1400)
  } else {
    msgs.value.push({
      role: 'elf',
      local: true,
      filed,
      text: filed
        ? '收到，已经转给作者了，谢谢你！'
        : '我把整个网站翻了一遍，没找到相关的内容 😵 换个说法试试？如果是教程里没讲到的，直接告诉我你想学什么，我转给作者。',
    })
    flash(filed ? 'cheer' : 'confused', 2000)
  }
}

// ---------- 回答里的简单 Markdown：链接、加粗、行内代码、列表 ----------
function esc(s: string) {
  return s.replace(/[&<>"']/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' })[c]!)
}
function md(text: string) {
  return text
    .split(/\n+/)
    .map((line) => {
      let h = esc(line.trim())
      h = h.replace(/\[([^\]]+)\]\(((?:\/|https:\/\/)[^)\s]*)\)/g, (_, t, u) => {
        const ext = u.startsWith('https://')
        return `<a href="${ext ? u : withBase(u)}"${ext ? ' target="_blank" rel="noopener"' : ''}>${t}</a>`
      })
      h = h.replace(/\*\*([^*]+)\*\*/g, '<strong>$1</strong>').replace(/`([^`]+)`/g, '<code>$1</code>')
      if (/^[-*•]\s+/.test(h)) return `<p class="li">• ${h.replace(/^[-*•]\s+/, '')}</p>`
      if (/^\d+[.、]\s*/.test(h)) return `<p class="li">${h}</p>`
      return h ? `<p>${h}</p>` : ''
    })
    .join('')
}

// 回答里的站内链接：用网站自己的路由跳转(不刷新页面)
function onAnswerClick(e: MouseEvent) {
  const a = (e.target as HTMLElement).closest('a')
  if (!a || a.target === '_blank') return
  const href = a.getAttribute('href') || ''
  if (href.startsWith('/')) {
    e.preventDefault()
    router.go(href)
    if (isMobile.value) open.value = false
  }
}

// ---------- 推荐问题：在章节页面问"这一章"，其他页面问常见问题 ----------
const suggestions = computed(() => {
  const p = pathNow.value
  if (p.startsWith('/chapters/') && pageTitle.value)
    return ['这一页讲了什么？用三句话告诉我', '这一页最容易卡在哪一步？', '学完这一页，下一步该看什么？']
  if (p.startsWith('/skill-hub')) return ['新手先装哪几个 skill？', '装 skill 之前要注意什么？', '怎么做 PPT？']
  if (p.startsWith('/roles')) return ['我是大学生，从哪里开始学？', '电商运营能用 AI 做什么？', 'AI 能帮宠物主人做什么？']
  return ['Agent 和聊天机器人有什么区别？', '钥匙填在 DSH 的哪里？', '中转站安全吗？']
})

// ---------- 划词：选中正文里的一段字 ----------
function onSelectEnd(e: Event) {
  if ((e.target as HTMLElement | null)?.closest?.('.xc-root')) return
  setTimeout(() => {
    const s = window.getSelection()
    const text = s?.toString().trim() || ''
    if (!s || s.rangeCount === 0 || text.length < 2 || text.length > 600) return (sel.value = null)
    const node = s.anchorNode instanceof Element ? s.anchorNode : s.anchorNode?.parentElement
    if (!node?.closest('.vp-doc') || node.closest('.xc-root')) return (sel.value = null)
    const r = s.getRangeAt(0).getBoundingClientRect()
    const x = Math.min(Math.max(r.left + r.width / 2, 120), window.innerWidth - 120)
    const y = r.top > 64 ? r.top - 46 : r.bottom + 10
    sel.value = { text, x, y }
  }, 10)
}
function clearSel() {
  sel.value = null
}
function askAboutSelection() {
  if (!sel.value) return
  quote.value = sel.value.text
  sel.value = null
  window.getSelection()?.removeAllRanges()
  openPanel()
  send('这段是什么意思？请用大白话给我讲讲')
}
function reportSelection() {
  if (!sel.value) return
  quote.value = sel.value.text
  sel.value = null
  window.getSelection()?.removeAllRanges()
  startFeedback('selection', '这段哪里不对，或者哪里看不懂？直接说就行，我原样转给作者。')
}

function startFeedback(via: 'selection' | 'chapter-end' | 'chat', prompt: string) {
  mode.value = 'feedback'
  feedbackVia.value = via
  openPanel()
  msgs.value.push({ role: 'elf', text: prompt })
  flash('listen', 1500)
  scrollDown()
}

// ---------- 读完一页：探头问一句 ----------
// 条件：章节 / 身份 / 作品页面，在这一页至少待了 20 秒(一路滑到底的不问)，页面底部出现在屏幕上，这一页以前没问过
let enteredAt = 0
let endPath = ''
let endTimer: ReturnType<typeof setTimeout> | undefined
function watchPageEnd() {
  enteredAt = Date.now()
  const p = pathNow.value
  endPath = /^\/(chapters|roles|showcase)\/./.test(p) && !store.get('end:' + p) ? p : ''
  clearTimeout(endTimer)
  if (endPath) endTimer = setTimeout(checkEnd, 20_500) // 已经停在页面底部读的，到 20 秒时也问
}
function checkEnd() {
  if (!endPath || endPath !== pathNow.value) return
  if (Date.now() - enteredAt < 20_000 || open.value || hidden.value || busy.value) return
  const footer = document.querySelector('.VPDocFooter') || document.querySelector('.vp-doc')
  if (!footer) return
  const r = footer.getBoundingClientRect()
  const atEnd = footer.classList.contains('vp-doc') ? r.bottom < window.innerHeight + 40 : r.top < window.innerHeight
  if (!atEnd) return
  store.set('end:' + endPath, '1')
  endPath = ''
  asleep.value = false
  bubble.value = { text: '读完啦 🎉 这一页你看懂了吗？', kind: 'end' }
  flash('wave', 1800)
}
let lastCheck = 0
function onScrollEnd() {
  if (!endPath) return
  const now = Date.now()
  if (now - lastCheck < 150) return // 滚动时最多每 0.15 秒看一次
  lastCheck = now
  checkEnd()
}

async function react(good: boolean) {
  const p = pathNow.value
  bubble.value = null
  if (good) {
    flash('cheer', 1800)
    bubble.value = { text: '太棒了！继续加油 💪', kind: 'note' }
    setTimeout(() => bubble.value?.kind === 'note' && (bubble.value = null), 2600)
    postFeedback({ text: '读完了，看懂了', kind: '夸奖', via: 'reaction', path: p }).catch(() => {})
  } else {
    startFeedback('chapter-end', '卡在哪一步了？说说你看到了什么、哪里不明白。我能解答的马上解答，解答不了的转给作者改进。')
    feedbackVia.value = 'chapter-end'
  }
}

// ---------- 生命周期 ----------
function onResize() {
  isMobile.value = window.innerWidth < 640
}
function onEsc(e: KeyboardEvent) {
  if (e.key === 'Escape') {
    if (sel.value) sel.value = null
    else if (open.value) close()
  }
}
const activity = () => poke()
const onShiftKey = (e: KeyboardEvent) => e.shiftKey && onSelectEnd(e) // 用键盘(Shift + 方向键)选字

onMounted(() => {
  ready.value = true
  hidden.value = store.get('hidden') === '1'
  onResize()
  window.addEventListener('resize', onResize)
  window.addEventListener('keydown', onEsc)
  document.addEventListener('mouseup', onSelectEnd)
  document.addEventListener('touchend', onSelectEnd)
  document.addEventListener('keyup', onShiftKey)
  window.addEventListener('scroll', clearSel, { passive: true })
  window.addEventListener('scroll', onScrollEnd, { passive: true })
  for (const ev of ['mousemove', 'keydown', 'scroll', 'touchstart']) window.addEventListener(ev, activity, { passive: true })
  poke()
  watchPageEnd()
  // 第一次来：打个招呼
  if (!store.get('greeted') && !hidden.value) {
    setTimeout(() => {
      if (open.value) return
      bubble.value = { text: `你好，我是${NAME} 👋 网站里的内容都可以问我`, kind: 'hello' }
      flash('wave', 2200)
      store.set('greeted', '1')
      setTimeout(() => bubble.value?.kind === 'hello' && (bubble.value = null), 8000)
    }, 2500)
  }
})
onBeforeUnmount(() => {
  window.removeEventListener('resize', onResize)
  window.removeEventListener('keydown', onEsc)
  document.removeEventListener('mouseup', onSelectEnd)
  document.removeEventListener('touchend', onSelectEnd)
  document.removeEventListener('keyup', onShiftKey)
  window.removeEventListener('scroll', clearSel)
  window.removeEventListener('scroll', onScrollEnd)
  for (const ev of ['mousemove', 'keydown', 'scroll', 'touchstart']) window.removeEventListener(ev, activity)
  clearTimeout(endTimer)
})

watch(pathNow, () => {
  sel.value = null
  if (bubble.value?.kind === 'end') bubble.value = null
  watchPageEnd()
})

// 输入框跟着内容长高(最多 4 行)
watch(input, () =>
  nextTick(() => {
    const el = inputEl.value
    if (!el) return
    if (!input.value) {
      el.style.height = '' // 清空后回到一行高
      el.style.overflowY = 'hidden'
      return
    }
    el.style.height = 'auto'
    el.style.height = Math.min(el.scrollHeight, 104) + 'px'
    el.style.overflowY = el.scrollHeight > 104 ? 'auto' : 'hidden'
  }),
)
watch(input, (v) => {
  if (v) loadKb()
})

function kindIcon(k: string) {
  return ({ 写错了: '🛠️', 看不懂: '🤔', 建议: '💡', 夸奖: '💖' } as Record<string, string>)[k] || '📮'
}
</script>

<template>
  <div v-if="ready" class="xc-root" :class="{ 'is-open': open, 'is-mobile': isMobile }">
    <!-- 划词后冒出来的小气泡 -->
    <div v-if="sel" class="xc-sel" :style="{ left: sel.x + 'px', top: sel.y + 'px' }" @mousedown.prevent>
      <span class="xc-sel-face" aria-hidden="true"><XcRobot state="wave" :size="22" /></span>
      <button type="button" @click="askAboutSelection">问学创</button>
      <span class="xc-sel-sep" />
      <button type="button" @click="reportSelection">这段有问题</button>
    </div>

    <!-- 先休息了：右边缘只露出一个小脑袋 -->
    <button v-if="hidden" type="button" class="xc-peek" :aria-label="`叫醒${NAME}`" @click="wake">
      <XcRobot state="sleep" :size="34" />
    </button>

    <template v-else>
      <!-- 对话框 -->
      <Transition name="xc-pop">
        <section v-if="open" class="xc-panel" role="dialog" :aria-label="NAME">
          <header class="xc-head">
            <span class="xc-head-bot"><XcRobot :state="mood" :size="38" /></span>
            <div class="xc-head-text">
              <strong>{{ NAME }}</strong>
              <span>{{ status }}</span>
            </div>
            <button type="button" class="xc-icon" aria-label="关闭" @click="close">
              <svg viewBox="0 0 24 24" width="18" height="18"><path d="M6 6l12 12M18 6L6 18" stroke="currentColor" stroke-width="2" stroke-linecap="round" /></svg>
            </button>
          </header>

          <div ref="listEl" class="xc-list" aria-live="polite" @click="onAnswerClick">
            <div v-if="!msgs.length" class="xc-hello">
              <p>你好，我是<strong>{{ NAME }}</strong>。这个网站里的每一章、每个 skill、每个作品，我都读过。</p>
              <p>边打字我边帮你找；按回车，我来回答。</p>
              <div class="xc-chips">
                <button v-for="s in suggestions" :key="s" type="button" @click="send(s)">{{ s }}</button>
              </div>
              <p class="xc-soft">哪里写错了、看不懂、想多学点什么，也直接跟我说，我会转给作者。</p>
            </div>

            <div v-for="(m, i) in msgs" :key="i" class="xc-msg" :class="m.role">
              <blockquote v-if="m.quote" class="xc-quote">{{ m.quote }}</blockquote>
              <div v-if="m.role === 'user'" class="xc-bubble">{{ m.text }}</div>
              <div v-else class="xc-bubble">
                <div v-if="m.text" class="xc-md" v-html="md(m.text)" />
                <span v-if="m.pending" class="xc-cursor" />
                <ul v-if="m.hits?.length" class="xc-hits">
                  <li v-for="h in m.hits" :key="h.u">
                    <a :href="withBase(h.u)" @click.prevent="go(h.u)">
                      <strong>{{ h.h }}</strong>
                      <small>{{ h.p }}</small>
                      <span>{{ h.s }}</span>
                    </a>
                  </li>
                </ul>
                <p v-if="m.sources?.length && !m.pending" class="xc-src">
                  📖 参考：
                  <a v-for="s in m.sources" :key="s.u" :href="withBase(s.u)" @click.prevent="go(s.u)">{{ s.p === s.h ? s.h : `${s.p} › ${s.h}` }}</a>
                </p>
                <p v-if="m.filed" class="xc-filed">{{ kindIcon(m.filed) }} 已转给作者 · {{ m.filed }}</p>
                <p v-if="m.local && !m.filed" class="xc-tag">🔎 网站内搜索结果</p>
              </div>
            </div>
            <div v-if="busy && !streaming" class="xc-msg elf">
              <div class="xc-bubble xc-typing"><i /><i /><i /></div>
            </div>
          </div>

          <!-- 边打字边搜 -->
          <div v-if="live.length" class="xc-live">
            <p>直接跳过去：</p>
            <a v-for="h in live" :key="h.u" :href="withBase(h.u)" @click.prevent="go(h.u)">
              <strong>{{ h.h }}</strong><small>{{ h.p }}</small>
            </a>
          </div>

          <footer class="xc-foot">
            <div v-if="quote" class="xc-quote-chip">
              <span>📌 「{{ quote.length > 40 ? quote.slice(0, 40) + '…' : quote }}」</span>
              <button type="button" aria-label="不引用这段" @click="quote = ''">×</button>
            </div>
            <div class="xc-input" :class="{ fb: mode === 'feedback' }">
              <textarea
                ref="inputEl"
                v-model="input"
                rows="1"
                maxlength="400"
                :placeholder="mode === 'feedback' ? '直接说：哪里不对、哪里看不懂、想加什么……' : '问我网站里的任何内容，或者说说哪里没看懂'"
                @keydown="onKey"
              />
              <button type="button" class="xc-send" :disabled="!input.trim() || busy" aria-label="发送" @click="send()">
                <svg viewBox="0 0 24 24" width="18" height="18"><path d="M4 12l16-8-6 16-2.5-6.5L4 12z" fill="currentColor" /></svg>
              </button>
            </div>
            <p class="xc-note">
              AI 根据本站内容回答，可能出错；别发钥匙和密码。问题和反馈会匿名保存，用来改进教程。
              <a href="#" @click.prevent="rest">让学创先休息</a>
            </p>
          </footer>
        </section>
      </Transition>

      <!-- 机器人本体 + 说话气泡 -->
      <Transition name="xc-fade">
        <div v-if="bubble && !open" class="xc-say" :class="bubble.kind">
          <button type="button" class="xc-say-x" aria-label="关掉" @click="bubble = null">×</button>
          <p @click="bubble.kind === 'hello' && openPanel()">{{ bubble.text }}</p>
          <div v-if="bubble.kind === 'end'" class="xc-react">
            <button type="button" @click="react(true)">👍 看懂了</button>
            <button type="button" @click="react(false)">🤔 有地方卡住</button>
          </div>
        </div>
      </Transition>
      <button
        type="button"
        class="xc-launch"
        :aria-label="open ? `收起${NAME}` : `打开${NAME}：搜索或提问`"
        :aria-expanded="open"
        @click="toggle"
        @mouseenter="hovering = true"
        @mouseleave="hovering = false"
      >
        <XcRobot :state="mood" :size="isMobile ? 62 : 80" />
      </button>
    </template>
  </div>
</template>

<style scoped>
.xc-root {
  --xc-bg: var(--vp-c-bg);
  --xc-soft: var(--vp-c-bg-soft);
  --xc-line: var(--vp-c-divider);
  --xc-text: var(--vp-c-text-1);
  --xc-text-2: var(--vp-c-text-2);
  --xc-brand: var(--vp-c-brand-1);
  --xc-brand-soft: var(--vp-c-brand-soft);
  --xc-user: #4d6bfe;
  --xc-shadow: 0 12px 40px rgba(30, 40, 90, 0.18), 0 2px 8px rgba(30, 40, 90, 0.08);
  font-size: 14px;
  line-height: 1.7;
  color: var(--xc-text);
}
:global(.dark) .xc-root {
  --xc-shadow: 0 12px 40px rgba(0, 0, 0, 0.55), 0 0 0 1px rgba(255, 255, 255, 0.06);
}
.xc-root button {
  font: inherit;
  color: inherit;
  cursor: pointer;
}

/* ---------- 机器人按钮 ---------- */
.xc-launch {
  position: fixed;
  right: 18px;
  bottom: 14px;
  z-index: 60;
  padding: 0;
  border: 0;
  background: none;
  filter: drop-shadow(0 6px 10px rgba(30, 40, 90, 0.18));
  transition: transform 0.2s;
}
.xc-launch:hover {
  transform: translateY(-2px);
}
.xc-launch:focus-visible {
  outline: 2px solid var(--xc-brand);
  outline-offset: 2px;
  border-radius: 16px;
}
.xc-peek {
  position: fixed;
  right: -6px;
  bottom: 90px;
  z-index: 60;
  padding: 4px 10px 2px 6px;
  border: 1px solid var(--xc-line);
  border-radius: 14px 0 0 14px;
  background: var(--xc-bg);
  box-shadow: var(--xc-shadow);
  transition: right 0.2s;
}
.xc-peek:hover {
  right: 0;
}

/* ---------- 说话气泡 ---------- */
.xc-say {
  position: fixed;
  right: 104px;
  bottom: 62px;
  z-index: 60;
  max-width: 250px;
  padding: 10px 26px 10px 14px;
  border: 1px solid var(--xc-line);
  border-radius: 16px 16px 4px 16px;
  background: var(--xc-bg);
  box-shadow: var(--xc-shadow);
}
.xc-say p {
  margin: 0;
  cursor: pointer;
}
.xc-say-x {
  position: absolute;
  top: 2px;
  right: 4px;
  width: 22px;
  height: 22px;
  border: 0;
  background: none;
  color: var(--xc-text-2) !important;
  line-height: 1;
}
.xc-react {
  display: flex;
  gap: 6px;
  margin-top: 8px;
}
.xc-react button {
  padding: 3px 10px;
  border: 1px solid var(--xc-line);
  border-radius: 999px;
  background: var(--xc-soft);
  font-size: 13px !important;
  white-space: nowrap;
}
.xc-react button:hover {
  border-color: var(--xc-brand);
  color: var(--xc-brand) !important;
}

/* ---------- 划词气泡 ---------- */
.xc-sel {
  position: fixed;
  z-index: 70;
  display: flex;
  align-items: center;
  gap: 2px;
  padding: 3px 6px 3px 4px;
  transform: translateX(-50%);
  border: 1px solid var(--xc-line);
  border-radius: 999px;
  background: var(--xc-bg);
  box-shadow: var(--xc-shadow);
  animation: xc-in 0.15s ease-out;
}
.xc-sel-face {
  display: grid;
  place-items: center;
  width: 26px;
  height: 26px;
  border-radius: 50%;
  background: var(--xc-brand-soft);
}
.xc-sel button {
  padding: 2px 8px;
  border: 0;
  border-radius: 999px;
  background: none;
  font-size: 13px !important;
  white-space: nowrap;
}
.xc-sel button:hover {
  background: var(--xc-brand-soft);
  color: var(--xc-brand) !important;
}
.xc-sel-sep {
  width: 1px;
  height: 14px;
  background: var(--xc-line);
}

/* ---------- 对话框 ---------- */
.xc-panel {
  position: fixed;
  right: 20px;
  bottom: 112px;
  z-index: 60;
  display: flex;
  flex-direction: column;
  width: 384px;
  height: min(600px, calc(100vh - 140px));
  border: 1px solid var(--xc-line);
  border-radius: 20px;
  background: var(--xc-bg);
  box-shadow: var(--xc-shadow);
  overflow: hidden;
}
.xc-head {
  display: flex;
  align-items: center;
  gap: 10px;
  padding: 10px 10px 10px 16px;
  border-bottom: 1px solid var(--xc-line);
  background: linear-gradient(120deg, var(--xc-brand-soft), transparent 70%);
}
.xc-head-bot {
  display: none;
}
.xc-head-text {
  flex: 1;
  display: flex;
  flex-direction: column;
  line-height: 1.35;
}
.xc-head-text span {
  font-size: 12px;
  color: var(--xc-text-2);
}
.xc-icon {
  display: grid;
  place-items: center;
  width: 32px;
  height: 32px;
  border: 0;
  border-radius: 10px;
  background: none;
  color: var(--xc-text-2) !important;
}
.xc-icon:hover {
  background: var(--xc-soft);
}

.xc-list {
  flex: 1;
  overflow-y: auto;
  padding: 14px 14px 6px;
  overscroll-behavior: contain;
}
.xc-hello p {
  margin: 0 0 8px;
}
.xc-soft {
  color: var(--xc-text-2);
  font-size: 13px;
}
.xc-chips {
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  gap: 6px;
  margin: 10px 0 14px;
}
.xc-chips button {
  padding: 5px 12px;
  border: 1px solid var(--xc-line);
  border-radius: 14px;
  background: var(--xc-soft);
  font-size: 13px !important;
  text-align: left;
}
.xc-chips button:hover {
  border-color: var(--xc-brand);
  color: var(--xc-brand) !important;
}

.xc-msg {
  display: flex;
  flex-direction: column;
  margin-bottom: 12px;
}
.xc-msg.user {
  align-items: flex-end;
}
.xc-msg.elf {
  align-items: flex-start;
}
.xc-bubble {
  max-width: 92%;
  padding: 8px 12px;
  border-radius: 16px;
  word-break: break-word;
}
.xc-msg.user .xc-bubble {
  border-bottom-right-radius: 4px;
  background: var(--xc-user);
  color: #fff;
  white-space: pre-wrap;
}
.xc-msg.elf .xc-bubble {
  border-bottom-left-radius: 4px;
  background: var(--xc-soft);
}
.xc-md :deep(p) {
  margin: 0 0 6px;
}
.xc-md :deep(p:last-child) {
  margin-bottom: 0;
}
.xc-md :deep(.li) {
  margin: 0 0 2px;
}
.xc-md :deep(a),
.xc-src a {
  color: var(--xc-brand);
  text-decoration: underline;
  text-underline-offset: 2px;
}
.xc-md :deep(code) {
  padding: 1px 5px;
  border-radius: 4px;
  background: var(--vp-code-bg);
  font-size: 0.9em;
}
.xc-quote {
  max-width: 92%;
  margin: 0 0 4px;
  padding: 4px 10px;
  border-left: 3px solid var(--xc-brand);
  border-radius: 4px;
  background: var(--xc-brand-soft);
  color: var(--xc-text-2);
  font-size: 12px;
  display: -webkit-box;
  -webkit-line-clamp: 3;
  -webkit-box-orient: vertical;
  overflow: hidden;
}
.xc-src,
.xc-filed,
.xc-tag {
  margin: 8px 0 0;
  font-size: 12px;
  color: var(--xc-text-2);
}
.xc-src a {
  margin-right: 8px;
}
.xc-filed {
  display: inline-block;
  padding: 1px 8px;
  border-radius: 999px;
  background: var(--at-main-soft, rgba(15, 138, 95, 0.1));
  color: var(--at-main, #0f8a5f);
}
.xc-hits {
  list-style: none;
  margin: 8px 0 0;
  padding: 0;
}
.xc-hits li + li {
  margin-top: 6px;
}
.xc-hits a,
.xc-live a {
  display: block;
  padding: 7px 10px;
  border: 1px solid var(--xc-line);
  border-radius: 10px;
  background: var(--xc-bg);
  color: inherit;
  text-decoration: none;
  line-height: 1.5;
}
.xc-hits a:hover,
.xc-live a:hover {
  border-color: var(--xc-brand);
}
.xc-hits strong,
.xc-live strong {
  display: block;
  font-size: 13px;
  color: var(--xc-brand);
}
.xc-hits small,
.xc-live small {
  display: block;
  font-size: 11px;
  color: var(--xc-text-2);
}
.xc-hits span {
  display: block;
  margin-top: 2px;
  font-size: 12px;
  color: var(--xc-text-2);
}
.xc-cursor {
  display: inline-block;
  width: 7px;
  height: 14px;
  margin-left: 2px;
  vertical-align: -2px;
  background: var(--xc-brand);
  animation: xc-blink-c 0.8s steps(2) infinite;
}
.xc-typing {
  display: flex;
  gap: 4px;
  padding: 12px 14px !important;
}
.xc-typing i {
  width: 6px;
  height: 6px;
  border-radius: 50%;
  background: var(--xc-text-2);
  animation: xc-dots 1s ease-in-out infinite;
}
.xc-typing i:nth-child(2) {
  animation-delay: 0.15s;
}
.xc-typing i:nth-child(3) {
  animation-delay: 0.3s;
}

.xc-live {
  padding: 8px 14px;
  border-top: 1px dashed var(--xc-line);
  max-height: 210px;
  overflow-y: auto;
}
.xc-live p {
  margin: 0 0 6px;
  font-size: 12px;
  color: var(--xc-text-2);
}
.xc-live a + a {
  margin-top: 5px;
}

.xc-foot {
  padding: 8px 12px 10px;
  border-top: 1px solid var(--xc-line);
}
.xc-quote-chip {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 6px;
  margin-bottom: 6px;
  padding: 2px 4px 2px 10px;
  border-radius: 8px;
  background: var(--xc-brand-soft);
  font-size: 12px;
  color: var(--xc-text-2);
}
.xc-quote-chip button {
  border: 0;
  background: none;
  font-size: 16px !important;
  line-height: 1;
  padding: 2px 6px;
}
.xc-input {
  display: flex;
  align-items: flex-end;
  gap: 6px;
  padding: 6px 6px 6px 12px;
  border: 1.5px solid var(--xc-line);
  border-radius: 14px;
  background: var(--xc-bg);
  transition: border-color 0.2s;
}
.xc-input:focus-within {
  border-color: var(--xc-brand);
}
.xc-input.fb {
  border-color: var(--at-optional, #b7791f);
}
.xc-input textarea {
  flex: 1;
  min-height: 24px;
  max-height: 104px;
  padding: 3px 0;
  border: 0;
  outline: 0;
  resize: none;
  overflow-y: hidden;
  background: none;
  font: inherit;
  color: inherit;
  line-height: 1.6;
}
.xc-send {
  display: grid;
  place-items: center;
  width: 34px;
  height: 34px;
  flex: none;
  border: 0;
  border-radius: 10px;
  background: var(--xc-user);
  color: #fff !important;
}
.xc-send:disabled {
  opacity: 0.35;
  cursor: default;
}
.xc-note {
  margin: 6px 2px 0;
  font-size: 11px;
  line-height: 1.5;
  color: var(--xc-text-2);
}
.xc-note a {
  color: var(--xc-text-2);
  text-decoration: underline;
}

/* ---------- 手机：对话框从底部弹起，铺满宽度 ---------- */
.is-mobile .xc-launch {
  right: 10px;
  bottom: 10px;
}
.is-mobile.is-open .xc-launch {
  display: none;
}
.is-mobile .xc-panel {
  right: 0;
  left: 0;
  bottom: 0;
  width: auto;
  height: 82vh;
  height: 82dvh;
  border-radius: 20px 20px 0 0;
}
.is-mobile .xc-head-bot {
  display: block;
  margin: -6px 0 -10px -6px;
}
.is-mobile .xc-say {
  right: 80px;
  bottom: 52px;
  max-width: calc(100vw - 100px);
}

/* ---------- 动画 ---------- */
.xc-pop-enter-active,
.xc-pop-leave-active {
  transition: opacity 0.2s ease, transform 0.25s cubic-bezier(0.3, 0.7, 0.4, 1);
  transform-origin: bottom right;
}
.xc-pop-enter-from,
.xc-pop-leave-to {
  opacity: 0;
  transform: translateY(12px) scale(0.96);
}
.xc-fade-enter-active,
.xc-fade-leave-active {
  transition: opacity 0.2s, transform 0.2s;
}
.xc-fade-enter-from,
.xc-fade-leave-to {
  opacity: 0;
  transform: translateY(6px);
}
@keyframes xc-in {
  from {
    opacity: 0;
    transform: translate(-50%, 4px);
  }
}
@keyframes xc-dots {
  0%,
  100% {
    opacity: 0.3;
    transform: translateY(0);
  }
  40% {
    opacity: 1;
    transform: translateY(-3px);
  }
}
@keyframes xc-blink-c {
  50% {
    opacity: 0;
  }
}

@media print {
  .xc-root {
    display: none;
  }
}
</style>
