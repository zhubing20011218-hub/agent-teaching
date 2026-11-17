// 学创 AI 的知识库：把全站内容切成一小节一小节，存成 public/elf/index.json。
// 网页上的即时搜索、服务器上的 AI 回答，都只从这份知识库里找资料。
// 每次启动预览(npm run dev)或构建(npm run build)时自动重新生成，不用手动维护。
//
// 每一节：{ u: 网址(带 #锚点), p: 页面标题, h: 小节标题, t: 正文(去掉了 Markdown 符号) }

import fs from 'node:fs'
import path from 'node:path'
import { SKILLS, CATEGORIES, ROLES } from './theme/skills-data'
import { SHOWCASE } from './theme/showcase-data'

const ROOT = path.resolve(__dirname, '..')
const OUT = path.join(ROOT, 'public/elf/index.json')
const DIRS = ['', 'chapters', 'roles', 'showcase', 'skill-hub']
const MAX_CHUNK = 1800 // 一节太长就切开，方便 AI 只拿最相关的那一块

export interface ElfChunk {
  u: string
  p: string
  h: string
  t: string
}

/** 和 VitePress 生成标题锚点的规则一模一样(抄自 vitepress 1.6 的 slugify)，这样跳转链接才能定位到小节 */
const rControl = /[\u0000-\u001f]/g
const rSpecial = /[\s~`!@#$%^&*()\-_+=[\]{}|\\;:"'“”‘’<>,.?/]+/g
const rCombining = /[̀-ͯ]/g
function slugify(str: string) {
  return str
    .normalize('NFKD')
    .replace(rCombining, '')
    .replace(rControl, '')
    .replace(rSpecial, '-')
    .replace(/-{2,}/g, '-')
    .replace(/^-+|-+$/g, '')
    .replace(/^(\d)/, '_$1')
    .toLowerCase()
}

/** 去掉行内 Markdown 符号，只留文字 */
function plainInline(s: string) {
  return s
    .replace(/!\[[^\]]*\]\([^)]*\)/g, '')
    .replace(/\[([^\]]*)\]\([^)]*\)/g, '$1')
    .replace(/<[^>]+>/g, '')
    .replace(/\*\*([^*]+)\*\*/g, '$1')
    .replace(/(^|[^*])\*([^*\n]+)\*/g, '$1$2')
    .replace(/`([^`]*)`/g, '$1')
    .replace(/&nbsp;/g, ' ')
}

function pageUrl(rel: string) {
  const noExt = rel.replace(/\.md$/, '')
  if (noExt === 'index') return '/'
  if (noExt.endsWith('/index')) return '/' + noExt.slice(0, -'index'.length)
  return '/' + noExt
}

function chunkMarkdown(rel: string, src: string): ElfChunk[] {
  const url = pageUrl(rel)
  let body = src
  let pageTitle = ''
  const fm = /^---\n([\s\S]*?)\n---\n/.exec(body)
  if (fm) {
    const m = /^title:\s*(.+)$/m.exec(fm[1])
    if (m) pageTitle = m[1].trim()
    body = body.slice(fm[0].length)
  }
  body = body.replace(/<!--[\s\S]*?-->/g, '')

  const chunks: ElfChunk[] = []
  const used = new Map<string, number>()
  let heading = ''
  let anchor = ''
  let buf: string[] = []
  let inFence = false

  const flush = () => {
    const text = buf
      .join('\n')
      .replace(/^\s*>\s?\[!(\w+)\]\s*$/gm, '')
      .replace(/^\s*>\s?/gm, '')
      .replace(/^\s*\|?[\s:|-]+\|[\s:|-]*$/gm, '') // 表格的分隔行
      .replace(/\|/g, ' ')
      .replace(/^\s*[-*+]\s+\[[ xX]\]\s+/gm, '· ')
      .replace(/^\s*[-*+]\s+/gm, '· ')
      .replace(/^:::.*$/gm, '')
      .replace(/<\/?details[^>]*>|<\/?summary>/g, '')
      .replace(/[ \t]+/g, ' ')
      .replace(/\n{2,}/g, '\n')
      .trim()
    buf = []
    if (text.length < 12) return
    const u = anchor ? `${url}#${anchor}` : url
    const h = heading || pageTitle
    for (let i = 0; i < text.length; i += MAX_CHUNK) {
      chunks.push({ u, p: pageTitle, h, t: text.slice(i, i + MAX_CHUNK) })
    }
  }

  for (const line of body.split('\n')) {
    if (/^\s*(```|~~~)/.test(line)) {
      inFence = !inFence
      continue
    }
    const hm = !inFence && /^(#{1,6})\s+(.+?)\s*#*\s*$/.exec(line)
    if (hm) {
      const title = plainInline(hm[2]).trim()
      // 所有级别的标题都参与锚点去重(和 VitePress 一致)
      const base = slugify(title)
      const n = used.get(base)
      const slug = n === undefined ? base : `${base}-${n}`
      used.set(base, (n ?? 0) + 1)
      if (hm[1].length === 1) {
        if (!pageTitle) pageTitle = title
        continue
      }
      if (hm[1].length <= 3) {
        flush()
        heading = title
        anchor = slug
        continue
      }
      buf.push(title) // 四级以下的小标题当普通文字
      continue
    }
    if (!inFence && /^\s*<\/?[A-Z][A-Za-z]*[\s/>]/.test(line)) continue // 页面里的 Vue 组件标签
    buf.push(inFence ? line : plainInline(line))
  }
  flush()
  return chunks
}

export function buildElfIndex() {
  const chunks: ElfChunk[] = []
  for (const dir of DIRS) {
    const abs = path.join(ROOT, dir)
    for (const f of fs.readdirSync(abs).filter((f) => f.endsWith('.md')).sort()) {
      const rel = dir ? `${dir}/${f}` : f
      if (!dir && !['index.md', 'xuechuang.md'].includes(f)) continue // 根目录只收网站页面(README、OUTLINE 不是)
      chunks.push(...chunkMarkdown(rel, fs.readFileSync(path.join(abs, f), 'utf-8')))
    }
  }

  // Skill 库：每个 skill 一条，链接直接打开 Skill 库里那一张卡片
  const catLabel = new Map(CATEGORIES.map((c) => [c.key, c.label.replace(/^\S+\s/, '')]))
  const roleLabel = new Map(ROLES.map((r) => [r.key, r.label.replace(/^\S+\s/, '')]))
  for (const s of SKILLS) {
    const bits = [
      s.desc,
      `分类：${catLabel.get(s.cat) ?? s.cat}`,
      s.roles?.length ? `适合：${s.roles.map((r) => roleLabel.get(r) ?? r).join('、')}` : '',
      s.starter ? '新手推荐' : '',
      s.hosted ? '本教程自带，可从本站下载' : `来自 ${s.source}`,
      s.script ? '带脚本' : '',
      s.net ? '会联网' : '',
      s.keys ? '需要外部账号或钥匙' : '',
      s.deps ? `需要先装：${s.deps}` : '',
      s.note ?? '',
    ].filter(Boolean)
    chunks.push({ u: `/skill-hub/#${s.id}`, p: 'Skill 库', h: `${s.title}(skill：${s.name})`, t: bits.join('。') })
  }

  // 作品展示：卡片上的介绍(详细的复刻步骤已经在上面的 showcase/*.md 里)
  const hasPage = new Set(fs.readdirSync(path.join(ROOT, 'showcase')).map((f) => f.replace(/\.md$/, '')))
  for (const w of SHOWCASE) {
    chunks.push({
      u: hasPage.has(w.id) ? `/showcase/${w.id}` : '/showcase/',
      p: '作品展示',
      h: w.title,
      t: [w.what, `成品：${w.result}`, `作者的做法：${w.steps.join('；')}`, `可以学走：${w.learn}`].join('\n'),
    })
  }

  fs.mkdirSync(path.dirname(OUT), { recursive: true })
  const json = JSON.stringify({ v: 1, built: new Date().toISOString(), chunks })
  fs.writeFileSync(OUT, json)
  console.log(`学创 AI 知识库：${chunks.length} 节 -> public/elf/index.json (${Math.round(json.length / 1024)} KB)`)
  return chunks.length
}
