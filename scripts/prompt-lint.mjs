// 提示词检查：网站上每一段要发给 AI 的提示词（```text 代码框），单独拿出来发给 AI 也必须能看懂。
// AI 看不到我们的网页，所以提示词里不能出现“第 3 步”“第 12 章”“上一步”“这个作品”“本页”这类只有读者看得懂的指代。
// 用法：node scripts/prompt-lint.mjs      （deploy.sh 部署前会自动运行，发现问题就停止部署）
import { readFileSync, readdirSync, statSync } from 'node:fs'
import { join } from 'node:path'

const DIRS = ['chapters', 'roles', 'showcase', 'skill-hub']
const RULES = [
  [/第\s*\d+\s*[步章节篇]/, '提到了网页上的步骤或章节编号（AI 不知道是哪一步）'],
  [/第[一二三四五六七八九十]+[步章]/, '提到了网页上的步骤或章节编号（AI 不知道是哪一步）'],
  [/上一步|下一步|前一步|前面那步/, '“上一步/下一步”：AI 不知道网页上的步骤顺序，请写出具体的文件或事情'],
  [/这个作品|本页|这一页|这一章|本章|本教程|教程里|网页上说/, '指代网页内容：AI 看不到我们的网页'],
]

const problems = []
for (const dir of DIRS) {
  for (const f of readdirSync(dir)) {
    const p = join(dir, f)
    if (!f.endsWith('.md') || !statSync(p).isFile()) continue
    const lines = readFileSync(p, 'utf-8').split('\n')
    let inCode = false
    let isPrompt = false
    lines.forEach((line, i) => {
      const fence = /^\s*```(\S*)/.exec(line)
      if (fence) {
        if (!inCode) {
          inCode = true
          isPrompt = fence[1] === '' || fence[1] === 'text' // 只检查纯文本代码框：那是要发给 AI 的话
        } else inCode = false
        return
      }
      if (!inCode || !isPrompt) return
      for (const [rule, why] of RULES) {
        if (rule.test(line)) problems.push(`${p}:${i + 1}  ${why}\n    ${line.trim().slice(0, 80)}`)
      }
    })
  }
}
if (problems.length) {
  console.error(`❌ 有 ${problems.length} 处提示词用了 AI 看不懂的指代：\n` + problems.join('\n'))
  process.exit(1)
}
console.log('✅ 提示词检查通过：每段提示词都能单独发给 AI')
