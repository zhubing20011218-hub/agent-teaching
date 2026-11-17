import { defineConfig } from 'vitepress'
import fs from 'node:fs'
import path from 'node:path'

const REPO = 'https://github.com/zhubing20011218-hub/agent-teaching'
const chaptersDir = path.resolve(__dirname, '../chapters')

/** 从章节文件的头部信息里读标题,侧边栏显示时去掉"第 N 章"里多余的空格和选修标记 */
function chapterTitle(file: string): string {
  const text = fs.readFileSync(path.join(chaptersDir, file), 'utf-8')
  const m = /^title:\s*(.+)$/m.exec(text)
  return (m ? m[1] : file).trim()
}

function item(file: string) {
  const title = chapterTitle(file)
  const optional = title.includes('🟡')
  const text = title
    .replace(/^第 (\d+) 章 /, '$1. ')
    .replace(/^附录 ([A-Z]) /, '$1. ')
    .replace(/🟡\s*选修[:：]\s*/, '')
  return {
    text: optional ? `${text} <span class="sb-badge">选修</span>` : text,
    link: `/chapters/${file.replace(/\.md$/, '')}`,
  }
}

const files = fs.readdirSync(chaptersDir).filter((f) => f.endsWith('.md')).sort()
const pick = (from: number, to: number) =>
  files.filter((f) => {
    const n = Number(f.slice(0, 2))
    return !Number.isNaN(n) && n >= from && n <= to
  }).map(item)

const sidebar = [
  { text: '开始之前', items: pick(0, 1) },
  { text: '第一部分 · 弄懂概念', items: pick(2, 4) },
  { text: '第二部分 · 拿到钥匙', items: pick(5, 7) },
  { text: '第三部分 · 接入和使用 DSH', items: pick(8, 13) },
  { text: '第四部分 · Skill 技能', items: pick(14, 19) },
  { text: '第五部分 · 进阶定制', items: pick(20, 23) },
  { text: '第六部分 · 实战与安全', items: pick(24, 25) },
  {
    text: '附录',
    collapsed: true,
    items: files.filter((f) => f.startsWith('appendix-')).map(item),
  },
]

/** 把 "- [ ] 文字" 渲染成可以勾选的复选框(进度保存在读者自己的浏览器里) */
function taskLists(md: any) {
  md.core.ruler.after('inline', 'task-lists', (state: any) => {
    const tokens = state.tokens
    for (let i = 2; i < tokens.length; i++) {
      const t = tokens[i]
      if (t.type !== 'inline') continue
      if (tokens[i - 1].type !== 'paragraph_open' || tokens[i - 2].type !== 'list_item_open') continue
      const m = /^\[([ xX])\]\s+/.exec(t.content)
      const first = t.children?.[0]
      if (!m || !first || first.type !== 'text') continue
      first.content = first.content.replace(/^\[([ xX])\]\s+/, '')
      const box = new state.Token('html_inline', '', 0)
      box.content = `<input type="checkbox" class="task-checkbox"${m[1] === ' ' ? '' : ' checked'} aria-label="标记为已完成">`
      t.children.unshift(box)
      tokens[i - 2].attrJoin('class', 'task-list-item')
      for (let j = i - 3; j >= 0; j--) {
        if (tokens[j].type === 'bullet_list_open' && tokens[j].level === tokens[i - 2].level - 1) {
          tokens[j].attrJoin('class', 'task-list')
          break
        }
      }
    }
  })
}

/** 提示框(> [!TIP] / > [!WARNING])的标题换成中文;VitePress 自带的这个插件不读语言设置 */
function zhAlertTitles(md: any) {
  const zh: Record<string, string> = {
    TIP: '小技巧',
    NOTE: '说明',
    INFO: '说明',
    IMPORTANT: '重要',
    WARNING: '注意',
    CAUTION: '小心',
    DANGER: '危险',
  }
  md.core.ruler.push('zh-alert-titles', (state: any) => {
    for (const t of state.tokens) {
      if (t.type === 'github_alert_open' && t.meta && zh[t.meta.title]) t.meta.title = zh[t.meta.title]
    }
  })
}

export default defineConfig({
  lang: 'zh-CN',
  title: 'Agent 小白教程',
  description: '写给零编程基础的人:从 API、DeepSeek Harness 到 Skill,让 AI 真的帮你干活',
  cleanUrls: true,
  lastUpdated: true,
  srcExclude: ['README.md', 'OUTLINE.md', 'docs/**', 'skills/**', 'examples/**'],
  head: [
    ['link', { rel: 'icon', type: 'image/svg+xml', href: '/logo.svg' }],
    ['meta', { name: 'theme-color', content: '#4d6bfe' }],
  ],
  markdown: {
    config: (md) => md.use(taskLists).use(zhAlertTitles),
    container: {
      tipLabel: '小技巧',
      warningLabel: '注意',
      dangerLabel: '危险',
      infoLabel: '说明',
      detailsLabel: '展开看看',
      noteLabel: '说明',
      importantLabel: '重要',
      cautionLabel: '小心',
    },
  },
  themeConfig: {
    logo: '/logo.svg',
    nav: [
      { text: '首页', link: '/' },
      { text: '开始学习', link: '/chapters/00-how-to-use', activeMatch: '^/chapters/' },
      { text: '名词小词典', link: '/chapters/appendix-a-glossary' },
      { text: '常见报错', link: '/chapters/appendix-b-errors' },
    ],
    sidebar: { '/chapters/': sidebar },
    socialLinks: [{ icon: 'github', link: REPO, ariaLabel: 'GitHub 仓库' }],
    outline: { level: [2, 3], label: '本页目录' },
    docFooter: { prev: '上一章', next: '下一章' },
    editLink: { pattern: `${REPO}/edit/main/:path`, text: '在 GitHub 上修改这一页' },
    lastUpdated: { text: '最后更新', formatOptions: { dateStyle: 'medium' } },
    returnToTopLabel: '回到顶部',
    sidebarMenuLabel: '目录',
    darkModeSwitchLabel: '深色模式',
    lightModeSwitchTitle: '切换到浅色模式',
    darkModeSwitchTitle: '切换到深色模式',
    langMenuLabel: '语言',
    externalLinkIcon: true,
    notFound: {
      title: '找不到这一页',
      quote: '可能是链接写错了,或者这一章换了名字。',
      linkLabel: '回到首页',
      linkText: '回到首页',
    },
    footer: {
      message: '内容采用 CC BY-NC-SA 4.0 许可:可以免费分享,请注明出处,不要用于商业用途',
      copyright: '持续更新中 · 发现问题欢迎到 GitHub 反馈',
    },
    search: {
      provider: 'local',
      options: {
        translations: {
          button: { buttonText: '搜索教程', buttonAriaLabel: '搜索教程' },
          modal: {
            displayDetails: '显示详细内容',
            resetButtonTitle: '清空',
            backButtonTitle: '关闭搜索',
            noResultsText: '没有找到相关内容',
            footer: { selectText: '打开', navigateText: '上下切换', closeText: '关闭' },
          },
        },
      },
    },
  },
})
