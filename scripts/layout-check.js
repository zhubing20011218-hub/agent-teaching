// 布局检查：在浏览器里运行（本机预览或线上都可以）
// 用法：打开网站任意一页 → 开发者工具 Console → 粘贴本文件全部内容 → 回车
// 检查三件事：
//   1. 任何宽度下都不能出现横向滚动条
//   2. 工具型页面（Skill 库、作品展示）在 1440 宽的电脑上，内容区要撑满（≥ 1100px）
//   3. 工具型页面默认状态下不能太长（≤ 3 屏，1440×900 下约 2700px）
// 教程章节、按身份学属于“文章”，正常长度不算问题，只检查第 1 条。
;(async () => {
  const WIDE = ['/skill-hub/', '/showcase/']
  const res = await fetch('/files/pages.txt').then((r) => (r.ok ? r.text() : ''))
  const pages = res.split('\n').map((s) => s.trim()).filter(Boolean)
  if (!pages.length) return console.error('没找到 /files/pages.txt，先运行 npm run build')
  const problems = []
  for (const [w, h] of [[1440, 900], [390, 844]]) {
    for (const p of pages) {
      const f = document.createElement('iframe')
      f.style.cssText = `position:absolute;left:-9999px;top:0;width:${w}px;height:${h}px`
      f.src = p
      document.body.appendChild(f)
      await new Promise((r) => (f.onload = r))
      await new Promise((r) => setTimeout(r, 700))
      const d = f.contentDocument
      const html = d.documentElement
      if (html.scrollWidth > w + 1) problems.push(`${w}px ${p}：横向滚动条（内容宽 ${html.scrollWidth}px）`)
      if (w === 1440 && WIDE.some((x) => p.startsWith(x))) {
        const box = d.querySelector('.VPDoc .content-container') || d.querySelector('.vp-doc')
        const cw = box ? Math.round(box.getBoundingClientRect().width) : 0
        if (cw < 1100) problems.push(`${w}px ${p}：内容只有 ${cw}px 宽，没有撑满`)
        if (html.scrollHeight > h * 3) problems.push(`${w}px ${p}：页面太长（${html.scrollHeight}px，超过 3 屏）`)
      }
      f.remove()
    }
  }
  console.log(problems.length ? '❌ 发现问题：\n' + problems.join('\n') : `✅ ${pages.length} 个页面 × 2 种宽度，布局都正常`)
  return problems
})()
