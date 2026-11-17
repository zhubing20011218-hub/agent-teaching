<script setup lang="ts">
import { computed, nextTick, onMounted, onBeforeUnmount, ref, watch } from 'vue'
import { CATEGORIES, ROLES, SKILLS, CHECKED, installPrompt, type RoleKey, type SkillEntry } from './skills-data'

const PAGE = 24
const STARTER = 'starter'

const query = ref('')
const cat = ref<string>(STARTER)
const role = ref<RoleKey | 'all'>('all')
const shown = ref(PAGE)
const open = ref<SkillEntry | null>(null)
const copied = ref('')

const catsWithCount = computed(() => [
  { key: STARTER, label: '⭐ 新手推荐', intro: '第一次用，从这几个开始', count: SKILLS.filter((s) => s.starter).length },
  { key: 'all', label: '📚 全部', intro: '全部 skill', count: SKILLS.length },
  ...CATEGORIES.map((c) => ({ ...c, count: SKILLS.filter((s) => s.cat === c.key).length })),
])
const currentCat = computed(() => catsWithCount.value.find((c) => c.key === cat.value))

const filtered = computed(() => {
  const q = query.value.trim().toLowerCase()
  return SKILLS.filter((s) => {
    if (role.value !== 'all' && !(s.roles ?? []).includes(role.value)) return false
    if (q) return [s.name, s.title, s.desc, s.note ?? '', s.source].some((t) => t.toLowerCase().includes(q))
    if (cat.value === STARTER) return !!s.starter
    if (cat.value === 'all') return true
    return s.cat === cat.value
  })
})
const visible = computed(() => filtered.value.slice(0, shown.value))
const catLabel = (key: string) => CATEGORIES.find((c) => c.key === key)?.label ?? ''
const roleLabel = (k: RoleKey) => ROLES.find((r) => r.key === k)?.label ?? k

watch([query, cat, role], () => (shown.value = PAGE))

function pickCat(key: string) {
  cat.value = key
  query.value = ''
}

function openSkill(s: SkillEntry, updateHash = true) {
  open.value = s
  if (updateHash && typeof history !== 'undefined') history.replaceState(null, '', `#${s.id}`)
}
function closeSkill() {
  open.value = null
  if (typeof history !== 'undefined') history.replaceState(null, '', location.pathname)
}

function fromHash() {
  const id = decodeURIComponent(location.hash.replace(/^#/, ''))
  const s = SKILLS.find((x) => x.id === id)
  if (!s) return
  cat.value = s.cat
  query.value = ''
  role.value = 'all'
  nextTick(() => {
    const idx = filtered.value.findIndex((x) => x.id === s.id)
    if (idx >= shown.value) shown.value = idx + 1
    openSkill(s, false)
  })
}
const onKey = (e: KeyboardEvent) => e.key === 'Escape' && open.value && closeSkill()
onMounted(() => {
  fromHash()
  window.addEventListener('hashchange', fromHash)
  window.addEventListener('keydown', onKey)
})
onBeforeUnmount(() => {
  window.removeEventListener('hashchange', fromHash)
  window.removeEventListener('keydown', onKey)
})

async function copy(text: string, key: string) {
  try {
    await navigator.clipboard.writeText(text)
  } catch {
    const ta = document.createElement('textarea')
    ta.value = text
    ta.style.position = 'fixed'
    ta.style.opacity = '0'
    document.body.appendChild(ta)
    ta.select()
    try {
      document.execCommand('copy')
    } catch {}
    document.body.removeChild(ta)
  }
  copied.value = key
  setTimeout(() => {
    if (copied.value === key) copied.value = ''
  }, 1800)
}
</script>

<template>
  <div class="sk">
    <div class="sk-top">
      <input v-model="query" class="sk-search" type="search" :placeholder="`在 ${SKILLS.length} 个 skill 里搜索：Excel、论文、合同、字幕、对账……`" aria-label="搜索 skill" />
      <div class="sk-roles" role="group" aria-label="按身份筛选">
        <span class="sk-roles-label">按身份</span>
        <button type="button" class="sl-chip" :class="{ on: role === 'all' }" @click="role = 'all'">不限</button>
        <button v-for="r in ROLES" :key="r.key" type="button" class="sl-chip" :class="{ on: role === r.key }" @click="role = r.key">{{ r.label }}</button>
      </div>
    </div>

    <div class="sk-body">
      <nav class="sk-cats" aria-label="按领域筛选">
        <button
          v-for="c in catsWithCount"
          :key="c.key"
          type="button"
          class="sk-cat"
          :class="{ on: !query && cat === c.key }"
          @click="pickCat(c.key)"
        >
          <span>{{ c.label }}</span><span class="sk-cat-n">{{ c.count }}</span>
        </button>
      </nav>

      <div class="sk-main">
        <p class="sk-head">
          <template v-if="query">搜索「{{ query }}」：找到 {{ filtered.length }} 个</template>
          <template v-else>
            <b>{{ currentCat?.label }}</b> · {{ filtered.length }} 个<span v-if="currentCat?.intro" class="sk-head-intro"> · {{ currentCat.intro }}</span>
          </template>
        </p>

        <div class="sk-grid">
          <button v-for="s in visible" :id="s.id" :key="s.id" type="button" class="sk-card" @click="openSkill(s)">
            <span class="sk-card-title">{{ s.title }}</span>
            <code class="sk-card-name">/{{ s.name }}</code>
            <span class="sk-card-desc">{{ s.desc }}</span>
            <span class="sk-card-tags">
              <span class="sl-tag" :class="s.script ? 'warn' : 'safe'">{{ s.script ? '⚙️ 脚本' : '📄 纯说明' }}</span>
              <span v-if="s.net" class="sl-tag warn">🌐 联网</span>
              <span v-if="s.keys" class="sl-tag warn">🔑 账号</span>
              <span v-if="s.zh" class="sl-tag">🇨🇳 中文</span>
              <span v-if="query || cat === 'all' || cat === STARTER" class="sl-tag muted">{{ catLabel(s.cat) }}</span>
            </span>
          </button>
        </div>

        <p v-if="filtered.length === 0" class="sl-empty">没有找到。换个关键词，或者换一个领域。</p>
        <div v-if="filtered.length > shown" class="sk-more">
          <button type="button" class="sl-btn" @click="shown += PAGE">再显示 {{ Math.min(PAGE, filtered.length - shown) }} 个（还有 {{ filtered.length - shown }} 个）</button>
        </div>
        <p class="sk-checked">所有 skill 于 {{ CHECKED }} 下载源码检查：说明书和脚本都读过，格式按 DSH 的规则验证过；没有逐个实际运行。</p>
      </div>
    </div>

    <Teleport to="body">
      <div v-if="open" class="sk-modal-mask" @click.self="closeSkill">
        <div class="sk-modal" role="dialog" aria-modal="true" :aria-label="open.title">
          <button type="button" class="sk-close" aria-label="关闭" @click="closeSkill">×</button>
          <p class="sk-modal-cat">{{ catLabel(open.cat) }}</p>
          <h3 class="sk-modal-title">{{ open.title }} <code>/{{ open.name }}</code></h3>
          <p class="sk-modal-desc">{{ open.desc }}</p>
          <div class="sl-tags">
            <span class="sl-tag" :class="open.script ? 'warn' : 'safe'">{{ open.script ? '⚙️ 带脚本' : '📄 纯说明' }}</span>
            <span v-if="open.net" class="sl-tag warn">🌐 会联网</span>
            <span v-if="open.keys" class="sl-tag warn">🔑 需要外部账号或钥匙</span>
            <span v-if="open.zh" class="sl-tag">🇨🇳 中文</span>
            <span v-if="open.collection" class="sl-tag">📦 合集</span>
            <span class="sl-tag muted">{{ open.license }}</span>
          </div>
          <p v-if="open.deps" class="sk-modal-line">🧰 需要先装：{{ open.deps }}</p>
          <p v-if="open.note" class="sl-note">⚠️ {{ open.note }}</p>
          <p v-if="open.roles && open.roles.length" class="sk-modal-line">适合：<span v-for="r in open.roles" :key="r" class="sl-role">{{ roleLabel(r) }}</span></p>

          <div class="sl-link">
            <span class="sl-link-label">{{ open.hosted ? '本站下载' : '源地址' }}（来自 {{ open.source }}）</span>
            <code class="sl-link-url">{{ open.url }}</code>
          </div>
          <div class="sl-actions">
            <button type="button" class="sl-btn primary" @click="copy(installPrompt(open), 'prompt')">{{ copied === 'prompt' ? '✅ 已复制，粘贴给 DSH' : '复制安装指令' }}</button>
            <button type="button" class="sl-btn" @click="copy(open.url, 'url')">{{ copied === 'url' ? '✅ 已复制' : '复制链接' }}</button>
            <a class="sl-btn ghost" :href="open.url" target="_blank" rel="noopener noreferrer">打开</a>
          </div>
        </div>
      </div>
    </Teleport>
  </div>
</template>
