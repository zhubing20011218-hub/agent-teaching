// 把学创 AI 收到的反馈和提问整理成一份能读的清单。
// 用法：node scripts/elf-report.mjs <数据文件夹> [最近几天，默认 30]
//   线上数据：bash deploy/feedback.sh(会先从服务器下载)
//   本机试运行的数据：node scripts/elf-report.mjs .elf-data

import fs from 'node:fs'
import path from 'node:path'

const dir = process.argv[2] || '.elf-data'
const days = Number(process.argv[3] || 30)
const since = Date.now() - days * 86400_000
const GAP = 5 // 知识库最高分低于这个数：教程里多半没讲到

function load(file) {
  const p = path.join(dir, file)
  if (!fs.existsSync(p)) return []
  return fs
    .readFileSync(p, 'utf-8')
    .split('\n')
    .filter(Boolean)
    .map((l) => {
      try {
        return JSON.parse(l)
      } catch {
        return null
      }
    })
    .filter((r) => r && Date.parse(r.t) >= since)
}

const time = (t) => new Date(t).toLocaleString('zh-CN', { hour12: false, timeZone: 'Asia/Shanghai' }).slice(0, 16)
const VIA = { selection: '划词', 'chapter-end': '读完一页', chat: '聊天里', reaction: '点了表情' }
const clip = (s, n) => (s.length > n ? s.slice(0, n) + '…' : s)

const fb = load('feedback.jsonl')
const qs = load('questions.jsonl')

console.log(`\n学创 AI · 最近 ${days} 天\n`)

// ---------- 反馈 ----------
const kinds = {}
for (const r of fb) kinds[r.kind] = (kinds[r.kind] || 0) + 1
console.log(`📮 反馈 ${fb.length} 条  ` + Object.entries(kinds).map(([k, n]) => `${k} ${n}`).join(' · '))
const real = fb.filter((r) => r.via !== 'reaction')
for (const r of real.slice(-40).reverse()) {
  console.log(`\n  ${time(r.t)}  [${r.kind}]  ${r.path || '(未知页面)'}  · ${VIA[r.via] || r.via}`)
  if (r.quote) console.log(`    引用：「${clip(r.quote, 80)}」`)
  console.log(`    读者：${r.text}`)
  if (r.summary) console.log(`    AI 概括：${r.summary}`)
}

// 读完一页点 👍 的次数：哪些页面最受欢迎
const likes = {}
for (const r of fb) if (r.via === 'reaction') likes[r.path] = (likes[r.path] || 0) + 1
const top = Object.entries(likes).sort((a, b) => b[1] - a[1]).slice(0, 8)
if (top.length) {
  console.log('\n👍 读完说“看懂了”最多的页面')
  for (const [p, n] of top) console.log(`  ${String(n).padStart(4)}  ${p}`)
}

// ---------- 提问 ----------
console.log(`\n❓ 提问 ${qs.length} 个`)
const gaps = qs.filter((r) => r.top < GAP)
if (gaps.length) {
  console.log(`\n🕳️ 教程里可能没讲到的(知识库里最相关的内容得分 < ${GAP})：${gaps.length} 个`)
  for (const r of gaps.slice(-30).reverse()) console.log(`  ${time(r.t)}  ${clip(r.q, 60)}   (在 ${r.path || '?'} 问的，得分 ${r.top})`)
}
const byPage = {}
for (const r of qs) if (r.path) byPage[r.path] = (byPage[r.path] || 0) + 1
const hot = Object.entries(byPage).sort((a, b) => b[1] - a[1]).slice(0, 8)
if (hot.length) {
  console.log('\n📍 读者在哪些页面问得最多(可能是这一页不好懂)')
  for (const [p, n] of hot) console.log(`  ${String(n).padStart(4)}  ${p}`)
}
console.log('')
