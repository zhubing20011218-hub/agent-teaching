import DefaultTheme from 'vitepress/theme'
import { defineAsyncComponent, h } from 'vue'
import { onContentUpdated, useRoute } from 'vitepress'
import type { Theme } from 'vitepress'
import DocMeta from './DocMeta.vue'
import XcElf from './elf/XcElf.vue'
import './style.css'

/** 让"自己检查"里的复选框可以勾选,并记住进度(只存在读者自己的浏览器里) */
function setupCheckboxes(path: string) {
  const items = document.querySelectorAll<HTMLLIElement>('.vp-doc li.task-list-item')
  items.forEach((li, idx) => {
    const box = li.querySelector<HTMLInputElement>('input.task-checkbox')
    if (!box) return
    const key = `agent-teaching:check:${path}:${idx}`
    try {
      const saved = localStorage.getItem(key)
      if (saved !== null) box.checked = saved === '1'
    } catch {}
    li.classList.toggle('done', box.checked)
    box.onchange = () => {
      li.classList.toggle('done', box.checked)
      try {
        localStorage.setItem(key, box.checked ? '1' : '0')
      } catch {}
    }
    // 点文字也能勾选(点链接、代码时除外)
    li.onclick = (e) => {
      const target = e.target as HTMLElement
      if (target === box || target.closest('a, code, input')) return
      box.checked = !box.checked
      box.dispatchEvent(new Event('change'))
    }
  })
}

export default {
  extends: DefaultTheme,
  Layout() {
    return h(DefaultTheme.Layout, null, {
      'doc-before': () => h(DocMeta),
      // 学创 AI：全站右下角的机器人向导(搜索、提问、收集反馈)
      'layout-bottom': () => h(XcElf),
    })
  },
  enhanceApp({ app }) {
    // 按需加载：只有打开 Skill 库、作品展示时才下载它们的数据
    app.component('SkillLibrary', defineAsyncComponent(() => import('./SkillLibrary.vue')))
    app.component('ShowcaseList', defineAsyncComponent(() => import('./ShowcaseList.vue')))
    app.component('XcGallery', defineAsyncComponent(() => import('./elf/XcGallery.vue')))
  },
  setup() {
    const route = useRoute()
    // 每次页面内容渲染完成后,给清单接上勾选功能
    onContentUpdated(() => setupCheckboxes(route.path))
  },
} satisfies Theme
