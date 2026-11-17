<script setup lang="ts">
import { computed, nextTick, onBeforeUnmount, onMounted, ref } from 'vue'
import { SHOWCASE, SHOWCASE_ROLES, type ShowcaseEntry } from './showcase-data'

const role = ref<ShowcaseEntry['role'] | 'all'>('all')
const open = ref<ShowcaseEntry | null>(null)
const copied = ref('')

const list = computed(() => (role.value === 'all' ? SHOWCASE : SHOWCASE.filter((p) => p.role === role.value)))
const countOf = (k: ShowcaseEntry['role']) => SHOWCASE.filter((p) => p.role === k).length
const roleLabel = (k: ShowcaseEntry['role']) => SHOWCASE_ROLES.find((r) => r.key === k)?.label ?? ''

function openItem(p: ShowcaseEntry, updateHash = true) {
  open.value = p
  if (updateHash) history.replaceState(null, '', `#${p.id}`)
}
function closeItem() {
  open.value = null
  history.replaceState(null, '', location.pathname)
}
function fromHash() {
  const p = SHOWCASE.find((x) => x.id === decodeURIComponent(location.hash.slice(1)))
  if (!p) return
  role.value = 'all'
  openItem(p, false)
  nextTick(() => document.getElementById(p.id)?.scrollIntoView({ block: 'center' }))
}
const onKey = (e: KeyboardEvent) => e.key === 'Escape' && open.value && closeItem()
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
    <div class="sk-roles" role="group" aria-label="按身份筛选">
      <span class="sk-roles-label">按身份</span>
      <button type="button" class="sl-chip" :class="{ on: role === 'all' }" @click="role = 'all'">全部 {{ SHOWCASE.length }}</button>
      <button v-for="r in SHOWCASE_ROLES.filter((x) => countOf(x.key) > 0)" :key="r.key" type="button" class="sl-chip" :class="{ on: role === r.key }" @click="role = r.key">
        {{ r.label }} {{ countOf(r.key) }}
      </button>
    </div>

    <div class="sk-grid sc-grid">
      <button v-for="p in list" :id="p.id" :key="p.id" type="button" class="sk-card" @click="openItem(p)">
        <span class="sk-card-title">{{ p.title }}</span>
        <span class="sk-card-desc">{{ p.what }}</span>
        <span class="sk-card-tags">
          <span class="sl-tag safe">{{ p.kind === 'built' ? '💻 代码由 AI 写' : '🧭 让 AI 干活的流程' }}</span>
          <span class="sl-tag muted">{{ roleLabel(p.role) }}</span>
          <span class="sl-tag">🧪 {{ p.recipeSteps }} 步复刻</span>
        </span>
      </button>
    </div>

    <Teleport to="body">
      <div v-if="open" class="sk-modal-mask" @click.self="closeItem">
        <div class="sk-modal" role="dialog" aria-modal="true" :aria-label="open.title">
          <button type="button" class="sk-close" aria-label="关闭" @click="closeItem">×</button>
          <p class="sk-modal-cat">{{ roleLabel(open.role) }}</p>
          <h3 class="sk-modal-title">{{ open.title }}</h3>
          <div class="sl-tags">
            <span class="sl-tag safe">{{ open.kind === 'built' ? '💻 代码由 AI 写' : '🧭 让 AI 干活的流程' }}</span>
            <span class="sl-tag muted">{{ open.license }}</span>
          </div>
          <p class="sk-modal-desc">{{ open.what }}</p>
          <p class="sk-modal-line"><b>成品：</b>{{ open.result }}</p>
          <div class="sk-modal-line">
            <b>怎么做出来的：</b>
            <ol class="sc-steps"><li v-for="(s, i) in open.steps" :key="i">{{ s }}</li></ol>
          </div>
          <p class="sk-modal-line">📎 证据：{{ open.evidence }}</p>
          <p class="sk-modal-line"><b>可以学走的做法：</b>{{ open.learn }}</p>
          <div class="sc-recipe">
            <p class="sc-recipe-title">🧪 复刻这个作品：一共 {{ open.recipeSteps }} 步，每一步都有提示词、检查方法和调试提示词</p>
            <a class="sl-btn primary" :href="`/showcase/${open.id}`">查看复刻步骤 →</a>
          </div>
          <div class="sl-link">
            <span class="sl-link-label">第 1 步的提示词（可以先复制试试）</span>
            <code class="sl-link-url sc-prompt-text">{{ open.prompt }}</code>
          </div>
          <div class="sl-link">
            <span class="sl-link-label">项目地址</span>
            <code class="sl-link-url">{{ open.url }}</code>
          </div>
          <div class="sl-actions">
            <button type="button" class="sl-btn" @click="copy(open.prompt, 'prompt')">{{ copied === 'prompt' ? '✅ 已复制，粘贴给 DSH' : '复制第 1 步' }}</button>
            <button type="button" class="sl-btn" @click="copy(open.url, 'url')">{{ copied === 'url' ? '✅ 已复制' : '复制链接' }}</button>
            <a class="sl-btn ghost" :href="open.url" target="_blank" rel="noopener noreferrer">打开</a>
          </div>
        </div>
      </div>
    </Teleport>
  </div>
</template>
