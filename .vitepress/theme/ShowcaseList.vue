<script setup lang="ts">
import { computed, ref } from 'vue'
import { SHOWCASE, SHOWCASE_ROLES, type ShowcaseEntry } from './showcase-data'

const role = ref<ShowcaseEntry['role'] | 'all'>('all')
const copied = ref('')

const groups = computed(() =>
  SHOWCASE_ROLES.filter((r) => role.value === 'all' || r.key === role.value)
    .map((r) => ({ ...r, items: SHOWCASE.filter((p) => p.role === r.key) }))
    .filter((g) => g.items.length > 0),
)

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
  <div class="sl">
    <div class="sl-row" role="group" aria-label="按身份筛选">
      <span class="sl-row-label">身份</span>
      <button type="button" class="sl-chip" :class="{ on: role === 'all' }" @click="role = 'all'">全部 {{ SHOWCASE.length }}</button>
      <button v-for="r in SHOWCASE_ROLES" :key="r.key" type="button" class="sl-chip" :class="{ on: role === r.key }" @click="role = r.key">{{ r.label }}</button>
    </div>

    <section v-for="g in groups" :key="g.key" class="sl-group">
      <h2 :id="`role-${g.key}`" class="sl-group-title">{{ g.label }}</h2>
      <div class="sl-grid sc-grid">
        <article v-for="p in g.items" :id="p.id" :key="p.id" class="sl-card">
          <header class="sl-card-head">
            <h3 class="sl-card-title">{{ p.title }}</h3>
          </header>
          <div class="sl-tags">
            <span class="sl-tag safe">{{ p.kind === 'built' ? '💻 代码由 AI 写' : '🧭 让 AI 干活的流程' }}</span>
            <span class="sl-tag muted">{{ p.license }}</span>
          </div>
          <p class="sl-card-desc">{{ p.what }}</p>
          <p class="sc-line"><b>成品：</b>{{ p.result }}</p>
          <div class="sc-line">
            <b>怎么做出来的：</b>
            <ol class="sc-steps"><li v-for="(s, i) in p.steps" :key="i">{{ s }}</li></ol>
          </div>
          <p class="sc-evidence">📎 证据：{{ p.evidence }}</p>
          <p class="sc-line"><b>可以学走的做法：</b>{{ p.learn }}</p>

          <div class="sc-prompt">
            <span class="sl-link-label">发给 DSH 试一个简化版</span>
            <code class="sl-link-url">{{ p.prompt }}</code>
          </div>

          <div class="sl-link">
            <span class="sl-link-label">项目地址</span>
            <code class="sl-link-url">{{ p.url }}</code>
          </div>

          <div class="sl-actions">
            <button type="button" class="sl-btn primary" @click="copy(p.prompt, p.id + ':prompt')">
              {{ copied === p.id + ':prompt' ? '✅ 已复制，粘贴给 DSH' : '复制提示词' }}
            </button>
            <button type="button" class="sl-btn" @click="copy(p.url, p.id + ':url')">{{ copied === p.id + ':url' ? '✅ 已复制' : '复制链接' }}</button>
            <a class="sl-btn ghost" :href="p.url" target="_blank" rel="noopener noreferrer">打开</a>
          </div>
        </article>
      </div>
    </section>
  </div>
</template>
