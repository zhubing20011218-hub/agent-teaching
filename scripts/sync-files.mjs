// 把仓库里的示例 skill 和示例代码复制到 public/files/，让网站直接提供下载
// (读者不用打开 GitHub，复制网站上的链接交给 DSH 就能安装)
import { cpSync, rmSync, mkdirSync } from 'node:fs'

const out = 'public/files'
rmSync(out, { recursive: true, force: true })
mkdirSync(out, { recursive: true })
cpSync('skills', `${out}/skills`, { recursive: true })
cpSync('examples', `${out}/examples`, { recursive: true })
console.log('synced skills/ and examples/ -> public/files/')
