<script setup lang="ts">
import { computed, ref } from 'vue'
import { CATEGORIES, ROLES, SKILLS, installPrompt, type RoleKey, type SkillEntry } from './skills-data'

const query = ref('')
const cat = ref<string>('all')
const role = ref<RoleKey | 'all'>('all')
const copied = ref('') // 刚复制的按钮 key，用来显示“已复制”

const filtered = computed(() => {
  const q = query.value.trim().toLowerCase()
  return SKILLS.filter((s) => {
    if (cat.value !== 'all' && s.cat !== cat.value) return false
    if (role.value !== 'all' && !(s.roles ?? []).includes(role.value)) return false
    if (!q) return true
    return [s.name, s.title, s.desc, s.note ?? ''].some((t) => t.toLowerCase().includes(q))
  })
})

const groups = computed(() =>
  CATEGORIES.map((c) => ({ ...c, items: filtered.value.filter((s) => s.cat === c.key) })).filter((g) => g.items.length > 0),
)

const countOf = (key: string) => SKILLS.filter((s) => s.cat === key).length

async function copy(text: string, key: string) {
  try {
    await navigator.clipboard.writeText(text)
  } catch {
    // 有的浏览器不允许直接写剪贴板：退回到“选中再复制”的老办法
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

function reset() {
  query.value = ''
  cat.value = 'all'
  role.value = 'all'
}

const roleLabel = (k: RoleKey) => ROLES.find((r) => r.key === k)?.label ?? k
const sourceLabel = (s: SkillEntry) => (s.hosted ? '本站下载' : 'GitHub')
</script>

<template>
  <div class="sl">
    <div class="sl-filters">
      <input v-model="query" class="sl-search" type="search" placeholder="搜索 skill：比如 Excel、论文、字幕、对账" aria-label="搜索 skill" />

      <div class="sl-row" role="group" aria-label="按领域筛选">
        <span class="sl-row-label">领域</span>
        <button type="button" class="sl-chip" :class="{ on: cat === 'all' }" @click="cat = 'all'">全部 {{ SKILLS.length }}</button>
        <button v-for="c in CATEGORIES" :key="c.key" type="button" class="sl-chip" :class="{ on: cat === c.key }" @click="cat = c.key">
          {{ c.label }} {{ countOf(c.key) }}
        </button>
      </div>

      <div class="sl-row" role="group" aria-label="按身份筛选">
        <span class="sl-row-label">身份</span>
        <button type="button" class="sl-chip" :class="{ on: role === 'all' }" @click="role = 'all'">不限</button>
        <button v-for="r in ROLES" :key="r.key" type="button" class="sl-chip" :class="{ on: role === r.key }" @click="role = r.key">{{ r.label }}</button>
      </div>
    </div>

    <p class="sl-count">
      找到 {{ filtered.length }} 个 skill
      <button v-if="filtered.length !== SKILLS.length" type="button" class="sl-reset" @click="reset">清空筛选</button>
    </p>

    <section v-for="g in groups" :key="g.key" class="sl-group">
      <h2 :id="`cat-${g.key}`" class="sl-group-title">{{ g.label }}</h2>
      <p class="sl-group-intro">{{ g.intro }}</p>

      <div class="sl-grid">
        <article v-for="s in g.items" :id="s.id" :key="s.id" class="sl-card">
          <header class="sl-card-head">
            <h3 class="sl-card-title">{{ s.title }}</h3>
            <code class="sl-card-name">/{{ s.name }}</code>
          </header>
          <p class="sl-card-desc">{{ s.desc }}</p>

          <div class="sl-tags">
            <span class="sl-tag" :class="s.script ? 'warn' : 'safe'">{{ s.script ? '⚙️ 带脚本' : '📄 纯说明' }}</span>
            <span v-if="s.net" class="sl-tag warn">🌐 会联网</span>
            <span v-if="s.zh" class="sl-tag">🇨🇳 中文</span>
            <span v-if="s.collection" class="sl-tag">📦 合集</span>
            <span class="sl-tag muted">{{ s.license }}</span>
          </div>

          <p v-if="s.note" class="sl-note">⚠️ {{ s.note }}</p>

          <div class="sl-link">
            <span class="sl-link-label">{{ sourceLabel(s) }}</span>
            <code class="sl-link-url">{{ s.url }}</code>
          </div>

          <div class="sl-actions">
            <button type="button" class="sl-btn primary" @click="copy(installPrompt(s), s.id + ':prompt')">
              {{ copied === s.id + ':prompt' ? '✅ 已复制，粘贴给 DSH' : '复制安装指令' }}
            </button>
            <button type="button" class="sl-btn" @click="copy(s.url, s.id + ':url')">
              {{ copied === s.id + ':url' ? '✅ 已复制' : '复制链接' }}
            </button>
            <a class="sl-btn ghost" :href="s.url" target="_blank" rel="noopener noreferrer">打开</a>
          </div>

          <footer v-if="s.roles && s.roles.length" class="sl-roles">
            适合：<span v-for="r in s.roles" :key="r" class="sl-role">{{ roleLabel(r) }}</span>
          </footer>
        </article>
      </div>
    </section>

    <p v-if="groups.length === 0" class="sl-empty">没有找到。换个关键词，或者点「清空筛选」。</p>
  </div>
</template>
