<script setup lang="ts">
// 学创 AI 后台：登录后查看读者的反馈和提问。
// 数据全部来自服务器接口 /api/elf/admin/*(elf/admin.mjs)，这个页面本身不带任何数据。
import { computed, onMounted, ref } from 'vue'
import { withBase } from 'vitepress'

interface Fb {
  id: string
  t: string
  via: string
  kind: string
  text: string
  quote?: string
  summary?: string
  path?: string
  title?: string
  done: boolean
}
interface Q {
  t: string
  q: string
  quote?: string
  path?: string
  top: number
  ai: boolean
}

const GAP = 5 // 知识库最高分低于这个数：教程里多半没讲到
const KINDS = ['写错了', '看不懂', '建议', '夸奖', '其他']
const KIND_ICON: Record<string, string> = { 写错了: '🛠️', 看不懂: '🤔', 建议: '💡', 夸奖: '💖', 其他: '📮' }
const VIA: Record<string, string> = { selection: '划词', 'chapter-end': '读完一页', chat: '聊天里', reaction: '点表情' }

const phase = ref<'loading' | 'login' | 'off' | 'down' | 'in'>('loading')
const user = ref('admin')
const password = ref('')
const loginError = ref('')
const loggingIn = ref(false)

const days = ref(30)
const feedback = ref<Fb[]>([])
const questions = ref<Q[]>([])
const tab = ref<'fb' | 'q' | 'pages'>('fb')
const kindFilter = ref('')
const onlyOpen = ref(true)
const onlyGaps = ref(false)
const keyword = ref('')
const loadingData = ref(false)

async function api(path: string, init?: RequestInit) {
  const r = await fetch('/api/elf/admin/' + path, {
    credentials: 'same-origin',
    ...init,
    headers: { 'content-type': 'application/json', ...(init?.headers || {}) },
  })
  let body: any = {}
  try {
    body = await r.json()
  } catch {}
  return { status: r.status, body }
}

async function check() {
  try {
    const { status, body } = await api('status')
    if (status !== 200) return (phase.value = 'down')
    if (!body.enabled) return (phase.value = 'off')
    if (body.loggedIn) {
      phase.value = 'in'
      load()
    } else phase.value = 'login'
  } catch {
    phase.value = 'down'
  }
}

async function login() {
  if (!password.value || loggingIn.value) return
  loggingIn.value = true
  loginError.value = ''
  try {
    const { status, body } = await api('login', { method: 'POST', body: JSON.stringify({ user: user.value, password: password.value }) })
    if (status === 200) {
      password.value = ''
      phase.value = 'in'
      load()
    } else if (status === 429) loginError.value = '试错太多次，已锁定 15 分钟，请稍后再试'
    else if (status === 401) loginError.value = `账号或密码不对${body.left !== undefined ? `，还能试 ${body.left} 次` : ''}`
    else if (status === 503) phase.value = 'off'
    else loginError.value = '登录失败，请稍后再试'
  } catch {
    loginError.value = '连不上服务器'
  }
  loggingIn.value = false
}

async function logout() {
  await api('logout', { method: 'POST' }).catch(() => {})
  feedback.value = []
  questions.value = []
  phase.value = 'login'
}

async function load() {
  loadingData.value = true
  const { status, body } = await api('data?days=' + days.value).catch(() => ({ status: 0, body: {} as any }))
  loadingData.value = false
  if (status === 401) return (phase.value = 'login')
  if (status !== 200) return
  feedback.value = body.feedback
  questions.value = body.questions
}

async function toggleDone(f: Fb) {
  const next = !f.done
  f.done = next
  const { status } = await api('mark', { method: 'POST', body: JSON.stringify({ id: f.id, done: next }) }).catch(() => ({ status: 0 }))
  if (status !== 200) f.done = !next
}

// ---------- 统计 ----------
const written = computed(() => feedback.value.filter((f) => f.via !== 'reaction'))
const likes = computed(() => feedback.value.filter((f) => f.via === 'reaction'))
const gaps = computed(() => questions.value.filter((q) => q.top < GAP))
const countKind = (k: string) => written.value.filter((f) => f.kind === k).length
const tiles = computed(() => [
  { label: '待处理反馈', value: written.value.filter((f) => !f.done).length, sub: `共 ${written.value.length} 条` },
  { label: '🤔 看不懂', value: countKind('看不懂') },
  { label: '🛠️ 写错了', value: countKind('写错了') },
  { label: '💡 建议', value: countKind('建议') },
  { label: '👍 看懂了', value: likes.value.length + countKind('夸奖'), sub: '点表情 + 夸奖' },
  { label: '❓ 提问', value: questions.value.length, sub: `AI 回答 ${questions.value.filter((q) => q.ai).length}` },
  { label: '🕳️ 可能缺的内容', value: gaps.value.length, sub: '教程里没找到' },
])

const shownFb = computed(() => {
  const kw = keyword.value.trim().toLowerCase()
  return written.value.filter(
    (f) =>
      (!kindFilter.value || f.kind === kindFilter.value) &&
      (!onlyOpen.value || !f.done) &&
      (!kw || [f.text, f.quote, f.summary, f.path, f.title].join(' ').toLowerCase().includes(kw)),
  )
})
const shownQ = computed(() => {
  const kw = keyword.value.trim().toLowerCase()
  return questions.value.filter((q) => (!onlyGaps.value || q.top < GAP) && (!kw || [q.q, q.path].join(' ').toLowerCase().includes(kw)))
})

const pages = computed(() => {
  const m = new Map<string, { path: string; title: string; asks: number; fb: number; confused: number; wrong: number; likes: number }>()
  const row = (p?: string, title?: string) => {
    const key = p || '(未知页面)'
    if (!m.has(key)) m.set(key, { path: key, title: '', asks: 0, fb: 0, confused: 0, wrong: 0, likes: 0 })
    const r = m.get(key)!
    if (title && !r.title) r.title = title
    return r
  }
  for (const q of questions.value) row(q.path).asks++
  for (const f of feedback.value) {
    const r = row(f.path, f.title)
    if (f.via === 'reaction') r.likes++
    else {
      r.fb++
      if (f.kind === '看不懂') r.confused++
      if (f.kind === '写错了') r.wrong++
    }
  }
  return [...m.values()].sort((a, b) => b.confused + b.wrong - (a.confused + a.wrong) || b.asks - a.asks)
})

const time = (t: string) =>
  new Date(t).toLocaleString('zh-CN', { hour12: false, month: '2-digit', day: '2-digit', hour: '2-digit', minute: '2-digit' })
const link = (p?: string) => (p && p.startsWith('/') ? withBase(p) : '')

onMounted(check)
</script>

<template>
  <div class="xa">
    <!-- 登录 -->
    <div v-if="phase !== 'in'" class="xa-center">
      <form class="xa-login" @submit.prevent="login">
        <h1>学创 AI · 反馈后台</h1>
        <p v-if="phase === 'loading'" class="xa-muted">正在连接服务器……</p>
        <p v-else-if="phase === 'down'" class="xa-warn">连不上学创 AI 的接口。本机预览要先启动 elf-api；线上请检查容器 prismice-teach-api。</p>
        <p v-else-if="phase === 'off'" class="xa-warn">后台还没开启：还没设置管理员密码。见 docs/elf.md「管理后台」。</p>
        <template v-else>
          <label>账号<input v-model="user" autocomplete="username" required /></label>
          <label>密码<input v-model="password" type="password" autocomplete="current-password" required /></label>
          <p v-if="loginError" class="xa-err">{{ loginError }}</p>
          <button type="submit" :disabled="loggingIn">{{ loggingIn ? '登录中……' : '登录' }}</button>
          <p class="xa-muted small">连续输错 5 次会锁定 15 分钟。登录 12 小时后自动退出。</p>
        </template>
      </form>
    </div>

    <!-- 后台 -->
    <template v-else>
      <header class="xa-bar">
        <h1>学创 AI · 反馈后台</h1>
        <div class="xa-bar-right">
          <select v-model.number="days" @change="load">
            <option :value="7">最近 7 天</option>
            <option :value="30">最近 30 天</option>
            <option :value="90">最近 90 天</option>
            <option :value="365">最近一年</option>
          </select>
          <button type="button" class="ghost" :disabled="loadingData" @click="load">{{ loadingData ? '刷新中…' : '刷新' }}</button>
          <button type="button" class="ghost" @click="logout">退出</button>
        </div>
      </header>

      <div class="xa-tiles">
        <div v-for="t in tiles" :key="t.label" class="xa-tile">
          <span>{{ t.label }}</span>
          <strong>{{ t.value }}</strong>
          <small v-if="t.sub">{{ t.sub }}</small>
        </div>
      </div>

      <div class="xa-tabs">
        <button type="button" :class="{ on: tab === 'fb' }" @click="tab = 'fb'">反馈 {{ written.length }}</button>
        <button type="button" :class="{ on: tab === 'q' }" @click="tab = 'q'">提问 {{ questions.length }}</button>
        <button type="button" :class="{ on: tab === 'pages' }" @click="tab = 'pages'">按页面看</button>
        <input v-if="tab !== 'pages'" v-model="keyword" class="xa-search" placeholder="搜索内容或页面……" />
      </div>

      <!-- 反馈 -->
      <section v-if="tab === 'fb'">
        <div class="xa-filters">
          <button type="button" :class="{ on: !kindFilter }" @click="kindFilter = ''">全部</button>
          <button v-for="k in KINDS" :key="k" type="button" :class="{ on: kindFilter === k }" @click="kindFilter = k">
            {{ KIND_ICON[k] }} {{ k }} {{ countKind(k) }}
          </button>
          <label class="xa-check"><input v-model="onlyOpen" type="checkbox" /> 只看待处理</label>
        </div>
        <p v-if="!shownFb.length" class="xa-empty">{{ written.length ? '没有符合条件的反馈' : '这段时间还没有反馈' }}</p>
        <article v-for="f in shownFb" :key="f.id" class="xa-card" :class="{ done: f.done }">
          <div class="xa-card-head">
            <span class="xa-kind" :data-k="f.kind">{{ KIND_ICON[f.kind] || '📮' }} {{ f.kind }}</span>
            <span class="xa-muted">{{ time(f.t) }} · {{ VIA[f.via] || f.via }}</span>
            <a v-if="link(f.path)" :href="link(f.path)" target="_blank" class="xa-page">{{ f.title || f.path }}</a>
            <button type="button" class="xa-done" @click="toggleDone(f)">{{ f.done ? '↩ 改回待处理' : '✓ 已处理' }}</button>
          </div>
          <blockquote v-if="f.quote">{{ f.quote }}</blockquote>
          <p class="xa-text">{{ f.text }}</p>
          <p v-if="f.summary" class="xa-muted small">AI 概括：{{ f.summary }}</p>
        </article>
      </section>

      <!-- 提问 -->
      <section v-else-if="tab === 'q'">
        <div class="xa-filters">
          <label class="xa-check"><input v-model="onlyGaps" type="checkbox" /> 只看“教程里可能没讲到”的(得分 &lt; {{ GAP }})</label>
        </div>
        <p v-if="!shownQ.length" class="xa-empty">没有符合条件的提问</p>
        <table v-else class="xa-table">
          <thead>
            <tr><th>时间</th><th>问题</th><th>在哪一页问的</th><th>相关度</th><th>回答方式</th></tr>
          </thead>
          <tbody>
            <tr v-for="(q, i) in shownQ" :key="i" :class="{ gap: q.top < GAP }">
              <td class="nowrap">{{ time(q.t) }}</td>
              <td>{{ q.q }}<div v-if="q.quote" class="xa-muted small">引用：{{ q.quote }}</div></td>
              <td><a v-if="link(q.path)" :href="link(q.path)" target="_blank">{{ q.path }}</a></td>
              <td class="nowrap">{{ q.top }}<span v-if="q.top < GAP"> 🕳️</span></td>
              <td class="nowrap">{{ q.ai ? 'AI' : '搜索' }}</td>
            </tr>
          </tbody>
        </table>
      </section>

      <!-- 按页面 -->
      <section v-else>
        <p class="xa-muted small">“看不懂”“写错了”多的页面排在前面，最该先改。</p>
        <table class="xa-table">
          <thead>
            <tr><th>页面</th><th>🤔 看不懂</th><th>🛠️ 写错了</th><th>全部反馈</th><th>提问</th><th>👍</th></tr>
          </thead>
          <tbody>
            <tr v-for="p in pages" :key="p.path">
              <td><a v-if="link(p.path)" :href="link(p.path)" target="_blank">{{ p.title || p.path }}</a><span v-else>{{ p.path }}</span></td>
              <td>{{ p.confused || '' }}</td>
              <td>{{ p.wrong || '' }}</td>
              <td>{{ p.fb || '' }}</td>
              <td>{{ p.asks || '' }}</td>
              <td>{{ p.likes || '' }}</td>
            </tr>
          </tbody>
        </table>
      </section>
    </template>
  </div>
</template>

<style scoped>
.xa {
  max-width: 1280px;
  margin: 0 auto;
  padding: 24px 24px 64px;
  font-size: 14px;
  line-height: 1.6;
}
.xa button,
.xa select,
.xa input {
  font: inherit;
  color: inherit;
}
.xa-muted {
  color: var(--vp-c-text-2);
}
.small {
  font-size: 12px;
}
.xa-warn {
  padding: 10px 12px;
  border-radius: 8px;
  background: var(--at-optional-soft, rgba(183, 121, 31, 0.12));
}
.xa-err {
  margin: 0;
  color: var(--vp-c-danger-1);
}

/* 登录 */
.xa-center {
  display: grid;
  place-items: center;
  min-height: 60vh;
}
.xa-login {
  display: flex;
  flex-direction: column;
  gap: 12px;
  width: min(360px, 100%);
  padding: 28px;
  border: 1px solid var(--vp-c-divider);
  border-radius: 16px;
  background: var(--vp-c-bg-soft);
}
.xa-login h1 {
  margin: 0 0 4px;
  font-size: 20px;
}
.xa-login p {
  margin: 0;
}
.xa-login label {
  display: flex;
  flex-direction: column;
  gap: 4px;
  font-size: 13px;
  color: var(--vp-c-text-2);
}
.xa-login input {
  padding: 8px 10px;
  border: 1px solid var(--vp-c-divider);
  border-radius: 8px;
  background: var(--vp-c-bg);
  color: var(--vp-c-text-1);
}
.xa-login input:focus {
  outline: none;
  border-color: var(--vp-c-brand-1);
}
.xa-login button[type='submit'] {
  padding: 9px;
  border: 0;
  border-radius: 8px;
  background: var(--vp-c-brand-2);
  color: #fff;
  font-weight: 600;
  cursor: pointer;
}
.xa-login button:disabled {
  opacity: 0.6;
}

/* 顶栏 */
.xa-bar {
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  justify-content: space-between;
  gap: 12px;
  margin-bottom: 16px;
}
.xa-bar h1 {
  margin: 0;
  font-size: 22px;
}
.xa-bar-right {
  display: flex;
  gap: 8px;
}
.xa-bar select,
.ghost {
  padding: 5px 12px;
  border: 1px solid var(--vp-c-divider);
  border-radius: 8px;
  background: var(--vp-c-bg);
  cursor: pointer;
}
.ghost:hover {
  border-color: var(--vp-c-brand-1);
}

/* 统计 */
.xa-tiles {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(128px, 1fr));
  gap: 10px;
  margin-bottom: 18px;
}
.xa-tile {
  display: flex;
  flex-direction: column;
  padding: 12px 14px;
  border: 1px solid var(--vp-c-divider);
  border-radius: 12px;
  background: var(--vp-c-bg-soft);
}
.xa-tile span {
  font-size: 12px;
  color: var(--vp-c-text-2);
}
.xa-tile strong {
  font-size: 26px;
  line-height: 1.3;
  font-variant-numeric: tabular-nums;
}
.xa-tile small {
  font-size: 11px;
  color: var(--vp-c-text-3);
}

/* 标签页、筛选 */
.xa-tabs {
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  gap: 4px;
  margin-bottom: 12px;
  border-bottom: 1px solid var(--vp-c-divider);
}
.xa-tabs button {
  padding: 8px 14px;
  border: 0;
  border-bottom: 2px solid transparent;
  background: none;
  color: var(--vp-c-text-2);
  cursor: pointer;
}
.xa-tabs button.on {
  border-bottom-color: var(--vp-c-brand-1);
  color: var(--vp-c-text-1);
  font-weight: 600;
}
.xa-search {
  margin-left: auto;
  margin-bottom: 4px;
  width: min(260px, 100%);
  padding: 5px 10px;
  border: 1px solid var(--vp-c-divider);
  border-radius: 8px;
  background: var(--vp-c-bg);
}
.xa-filters {
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  gap: 6px;
  margin-bottom: 12px;
}
.xa-filters button {
  padding: 3px 12px;
  border: 1px solid var(--vp-c-divider);
  border-radius: 999px;
  background: var(--vp-c-bg);
  cursor: pointer;
  font-size: 13px;
}
.xa-filters button.on {
  border-color: var(--vp-c-brand-1);
  background: var(--vp-c-brand-soft);
  color: var(--vp-c-brand-1);
}
.xa-check {
  display: inline-flex;
  align-items: center;
  gap: 6px;
  margin-left: 8px;
  font-size: 13px;
  cursor: pointer;
}
.xa-empty {
  padding: 32px;
  text-align: center;
  color: var(--vp-c-text-2);
}

/* 反馈卡片 */
.xa-card {
  padding: 12px 16px;
  border: 1px solid var(--vp-c-divider);
  border-radius: 12px;
  background: var(--vp-c-bg);
}
.xa-card + .xa-card {
  margin-top: 8px;
}
.xa-card.done {
  opacity: 0.55;
}
.xa-card-head {
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  gap: 10px;
  font-size: 13px;
}
.xa-kind {
  padding: 1px 10px;
  border-radius: 999px;
  background: var(--vp-c-default-soft);
  font-weight: 600;
}
.xa-kind[data-k='写错了'] {
  background: var(--vp-c-danger-soft);
  color: var(--vp-c-danger-1);
}
.xa-kind[data-k='看不懂'] {
  background: var(--at-optional-soft, rgba(183, 121, 31, 0.12));
  color: var(--at-optional, #b7791f);
}
.xa-kind[data-k='建议'] {
  background: var(--vp-c-brand-soft);
  color: var(--vp-c-brand-1);
}
.xa-kind[data-k='夸奖'] {
  background: var(--at-main-soft, rgba(15, 138, 95, 0.1));
  color: var(--at-main, #0f8a5f);
}
.xa-page {
  color: var(--vp-c-brand-1);
}
.xa-done {
  margin-left: auto;
  padding: 2px 10px;
  border: 1px solid var(--vp-c-divider);
  border-radius: 8px;
  background: var(--vp-c-bg-soft);
  cursor: pointer;
  font-size: 12px;
}
.xa-done:hover {
  border-color: var(--vp-c-brand-1);
}
.xa-card blockquote {
  margin: 8px 0 0;
  padding: 4px 10px;
  border-left: 3px solid var(--vp-c-brand-1);
  background: var(--vp-c-brand-soft);
  color: var(--vp-c-text-2);
  font-size: 13px;
  border-radius: 4px;
}
.xa-text {
  margin: 8px 0 0;
  font-size: 15px;
  white-space: pre-wrap;
}
.xa-card .small {
  margin: 4px 0 0;
}

/* 表格 */
.xa-table {
  display: table;
  width: 100%;
  border-collapse: collapse;
  font-size: 13px;
}
.xa-table th,
.xa-table td {
  padding: 8px 10px;
  border-bottom: 1px solid var(--vp-c-divider);
  text-align: left;
  vertical-align: top;
}
.xa-table th {
  color: var(--vp-c-text-2);
  font-weight: 500;
  white-space: nowrap;
}
.xa-table tr.gap td {
  background: var(--at-optional-soft, rgba(183, 121, 31, 0.08));
}
.xa-table a {
  color: var(--vp-c-brand-1);
}
.nowrap {
  white-space: nowrap;
}

@media (max-width: 640px) {
  .xa {
    padding: 16px 16px 48px;
  }
  .xa-table {
    display: block;
    overflow-x: auto;
  }
}
</style>
