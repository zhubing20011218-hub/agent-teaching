<script setup lang="ts">
import { computed } from 'vue'
import { useData } from 'vitepress'

const { frontmatter, page } = useData()
// 只有教程章节才显示“主线 / 选修”标签;按身份学、Skill 库的页面不显示
const isChapter = computed(() => page.value.relativePath.startsWith('chapters/'))
const part = computed(() => frontmatter.value.part as string | undefined)
const optional = computed(() => String(frontmatter.value.title ?? '').includes('选修'))
const verified = computed(() => {
  const v = frontmatter.value.verified_with
  return v && v !== 'n/a' ? String(v) : ''
})
// YAML 会把 2026-11-17 读成日期对象,这里统一只取"年-月-日"
const checked = computed(() => {
  const v = frontmatter.value.last_checked
  if (!v) return ''
  return (v instanceof Date ? v.toISOString() : String(v)).slice(0, 10)
})
</script>

<template>
  <div v-if="part" class="doc-meta">
    <span class="doc-meta-part">{{ part }}</span>
    <span v-if="isChapter && optional" class="doc-meta-tag optional">选修 · 要写一点代码</span>
    <span v-else-if="isChapter && part !== '附录'" class="doc-meta-tag main">主线 · 不用写代码</span>
    <span v-if="verified || checked" class="doc-meta-verify" :title="verified">
      <span v-if="checked">核对于 {{ checked }}</span>
      <span v-if="verified" class="doc-meta-version"> · {{ verified }}</span>
    </span>
  </div>
</template>
