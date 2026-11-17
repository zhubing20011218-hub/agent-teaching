// 把仓库里的示例 skill 和示例代码复制到 public/files/，让网站直接提供下载
// (读者不用打开 GitHub，复制网站上的链接交给 DSH 就能安装)
import { cpSync, rmSync, mkdirSync, readdirSync, writeFileSync } from 'node:fs'

const out = 'public/files'
rmSync(out, { recursive: true, force: true })
mkdirSync(out, { recursive: true })
cpSync('skills', `${out}/skills`, { recursive: true })
cpSync('examples', `${out}/examples`, { recursive: true })
console.log('synced skills/ and examples/ -> public/files/')

// 给布局检查脚本(scripts/layout-check.js)用的页面清单
const pages = ['/', '/roles/', '/skill-hub/', '/showcase/']
for (const f of readdirSync('chapters').filter((f) => f.endsWith('.md')).sort()) pages.push('/chapters/' + f.replace(/\.md$/, ''))
for (const f of readdirSync('showcase').filter((f) => f.endsWith('.md') && f !== 'index.md').sort()) pages.push('/showcase/' + f.replace(/\.md$/, ''))
for (const f of readdirSync('roles').filter((f) => f.endsWith('.md') && f !== 'index.md').sort()) pages.push('/roles/' + f.replace(/\.md$/, ''))
writeFileSync(`${out}/pages.txt`, pages.join('\n') + '\n')
console.log(`page list: ${pages.length} pages -> ${out}/pages.txt`)
