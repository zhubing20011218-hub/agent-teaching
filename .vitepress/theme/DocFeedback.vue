<script setup lang="ts">
import { computed } from 'vue'
import { useData } from 'vitepress'

const { frontmatter, page } = useData()
const issueUrl = computed(() => {
  const title = `【反馈】${frontmatter.value.title ?? page.value.title}`
  const body = `页面:${page.value.relativePath}\n\n哪一步和你看到的不一样?(可以附截图,记得把钥匙、账号打码)\n\n`
  return `https://github.com/zhubing20011218-hub/agent-teaching/issues/new?title=${encodeURIComponent(title)}&body=${encodeURIComponent(body)}`
})
</script>

<template>
  <div v-if="frontmatter.part" class="doc-feedback">
    <span>这一章有看不懂的地方,或者和你看到的画面不一样?</span>
    <a :href="issueUrl" target="_blank" rel="noopener">告诉我们 →</a>
  </div>
</template>
