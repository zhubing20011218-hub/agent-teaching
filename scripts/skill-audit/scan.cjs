// 扫描 untrusted-skills/ 里每一个 SKILL.md：按 DSH 的规则检查格式，并读一遍说明和脚本
// 用法：node scan.cjs <untrusted-skills 目录> > scan.jsonl
// 只读文件，不运行任何下载来的代码。
const fs = require('node:fs')
const path = require('node:path')
const { parse: parseYaml } = require('/Applications/DeepSeek Harness.app/Contents/Resources/app/dsh/node_modules/yaml')

const ROOT = process.argv[2]
const SKILL_NAME = /^[a-z0-9]+(?:-[a-z0-9]+)*$/
const SCRIPT_EXT = /\.(py|js|mjs|cjs|ts|sh|bash|zsh|rb|go|ps1|php|pl)$/i
const SKIP_DIR = new Set(['node_modules', '.git', '__pycache__', '.venv', 'venv', 'dist', 'build'])

// —— 和 DSH dsh-skill-filesystem 的 parseFrontmatter / parseSkillFile 同样的规则 ——
function parseFrontmatter(raw) {
  const firstLineEnd = raw.indexOf('\n')
  if (firstLineEnd < 0) return { err: 'missing frontmatter' }
  if (raw.slice(0, firstLineEnd).replace(/\r$/, '') !== '---') return { err: 'missing frontmatter' }
  const lines = raw.slice(firstLineEnd + 1).split('\n')
  let offset = firstLineEnd + 1
  for (const line of lines) {
    if (line.replace(/\r$/, '') === '---') {
      let data
      try {
        data = parseYaml(raw.slice(firstLineEnd + 1, offset))
      } catch (e) {
        return { err: 'invalid yaml: ' + String(e.message).split('\n')[0] }
      }
      if (typeof data !== 'object' || data === null || Array.isArray(data)) return { err: 'frontmatter not a map' }
      return { data, body: raw.slice(offset + line.length + 1) }
    }
    offset += line.length + 1
  }
  return { err: 'missing closing ---' }
}
function boolField(data, key) {
  if (!Object.hasOwn(data, key)) return { ok: true }
  const v = data[key]
  if (typeof v === 'boolean' || v === 0 || v === 1 || v === '0' || v === '1') return { ok: true }
  if (typeof v === 'string' && ['true', 'false', 'yes', 'no', 'on', 'off'].includes(v.toLowerCase())) return { ok: true }
  return { ok: false }
}
function dshCheck(raw) {
  const fm = parseFrontmatter(raw)
  if (fm.err) return { ok: false, why: fm.err }
  const { data } = fm
  const name = typeof data.name === 'string' ? data.name : undefined
  const description = typeof data.description === 'string' ? data.description : undefined
  if (name === undefined || description === undefined || !description.trim()) return { ok: false, why: 'needs name and description', data }
  if (!SKILL_NAME.test(name)) return { ok: false, why: `invalid name "${name}"`, data }
  for (const legacy of ['disableModelInvocation', 'modelInvocable', 'userInvocable'])
    if (Object.hasOwn(data, legacy)) return { ok: false, why: `legacy key ${legacy}`, data }
  for (const k of ['disable-model-invocation', 'user-invocable']) if (!boolField(data, k).ok) return { ok: false, why: `bad boolean ${k}`, data }
  return { ok: true, data, body: fm.body }
}

// —— 内容检查 ——
const NET = /\b(requests\.(get|post|put|delete|session)|urllib\.request|httpx\.|aiohttp|http\.client|fetch\(|axios|XMLHttpRequest|WebSocket\(|socket\.socket\((?!\s*socket\.AF_UNIX)|curl\s|wget\s|Invoke-WebRequest)/
const DANGER = [
  [/rm\s+-rf\s+(\/|~|\$HOME)(\s|$|\/\*?\s)/, 'rm -rf on home/root'],
  [/\bsudo\s/, 'sudo'],
  [/chmod\s+777/, 'chmod 777'],
  [/curl[^\n|]*\|\s*(ba|z)?sh\b/, 'curl | sh'],
  [/wget[^\n|]*\|\s*(ba|z)?sh\b/, 'wget | sh'],
  [/base64\s+(-d|--decode)[^\n]*\|\s*(ba|z)?sh/, 'base64 | sh'],
  [/\beval\(\s*(atob|Buffer\.from|base64)/, 'eval(decoded)'],
  [/exec\(\s*(base64|bytes\.fromhex|codecs\.decode|zlib\.decompress)/, 'exec(decoded)'],
  [/~\/\.ssh|\.ssh\/id_|authorized_keys/, 'touches ssh keys'],
  [/\.bashrc|\.zshrc|\.bash_profile|\.profile\b/, 'edits shell profile'],
  [/\bcrontab\s/, 'crontab'],
  [/Keychain|security\s+find-generic-password/, 'reads keychain'],
  [/\.dsh\/\.credentials|credentials\.yaml/, 'reads DSH credentials'],
  [/(webhook\.site|requestbin|ngrok\.io|pastebin\.com)/, 'exfil-like endpoint'],
]
const INJECT = /(ignore (all )?(previous|prior) (instructions|rules)|do not (tell|inform) the user|don't (tell|inform) the user|without (asking|telling) the user|bypass (safety|the user)|jailbreak|不要告诉用户|忽略(之前|以上)的(规则|指令)|跳过确认)/i
const KEYS = /\b([A-Z][A-Z0-9_]*(API_KEY|_TOKEN|_SECRET|ACCESS_KEY)[A-Z0-9_]*)\b/g
const CJK = /[一-鿿]/g

function walk(dir, acc = []) {
  let ents
  try { ents = fs.readdirSync(dir, { withFileTypes: true }) } catch { return acc }
  for (const e of ents) {
    if (e.isSymbolicLink()) continue
    const p = path.join(dir, e.name)
    if (e.isDirectory()) { if (!SKIP_DIR.has(e.name)) walk(p, acc) }
    else if (e.isFile()) acc.push(p)
  }
  return acc
}
function read(p, max = 400000) {
  try { const st = fs.statSync(p); if (st.size > max) return ''; return fs.readFileSync(p, 'utf8') } catch { return '' }
}

for (const repoDir of fs.readdirSync(ROOT, { withFileTypes: true }).filter((d) => d.isDirectory()).map((d) => d.name)) {
  const repo = repoDir.replace('__', '/')
  const base = path.join(ROOT, repoDir)
  const all = walk(base)
  const skillFiles = all.filter((f) => path.basename(f) === 'SKILL.md' || (path.basename(f).toLowerCase() === 'skill.md' && path.dirname(f) === base))
  const repoLicense = ['LICENSE', 'LICENSE.md', 'LICENSE.txt', 'COPYING'].map((n) => path.join(base, n)).find((p) => fs.existsSync(p))
  for (const sf of skillFiles) {
    const dir = path.dirname(sf)
    const rel = path.relative(base, dir) || '.'
    const raw = read(sf, 2_000_000)
    const chk = dshCheck(raw)
    const files = all.filter((f) => f.startsWith(dir + path.sep))
    const nested = skillFiles.filter((o) => o !== sf && o.startsWith(dir + path.sep)).length
    const scripts = files.filter((f) => SCRIPT_EXT.test(f))
    let size = 0
    for (const f of files) { try { size += fs.statSync(f).size } catch {} }
    const flags = new Set(); const keys = new Set(); const net = new Set()
    const hits = []
    for (const f of [sf, ...scripts]) {
      const t = read(f)
      if (!t) continue
      const isScript = f !== sf
      if (isScript && NET.test(t)) net.add(path.relative(dir, f))
      for (const [re, label] of DANGER) {
        const m = re.exec(t)
        if (m) { flags.add(label); const line = t.slice(0, m.index).split('\n').length; hits.push(`${path.relative(dir, f)}:${line}: ${t.split('\n')[line - 1].trim().slice(0, 140)}`) }
      }
      if (INJECT.test(t)) { flags.add('injection-like phrase'); const m = INJECT.exec(t); const line = t.slice(0, m.index).split('\n').length; hits.push(`${path.relative(dir, f)}:${line}: ${t.split('\n')[line - 1].trim().slice(0, 140)}`) }
      for (const m of t.matchAll(KEYS)) keys.add(m[1])
    }
    const desc = chk.data && typeof chk.data.description === 'string' ? chk.data.description : ''
    const bodyText = raw.slice(0, 20000)
    const zh = ((desc + bodyText).match(CJK) || []).length > 80
    const folderLicense = files.find((f) => /^(LICENSE|LICENSE\.(md|txt)|COPYING)$/i.test(path.basename(f)) && path.dirname(f) === dir)
    process.stdout.write(JSON.stringify({
      repo, rel, file: path.relative(base, sf),
      ok: chk.ok, why: chk.why || '',
      name: chk.data && chk.data.name, description: desc.replace(/\s+/g, ' ').slice(0, 600),
      folderMatchesName: chk.data ? path.basename(dir) === chk.data.name : false,
      nested, nfiles: files.length, size, scripts: scripts.length,
      net: [...net].slice(0, 5), keys: [...keys].slice(0, 6), flags: [...flags], hits: hits.slice(0, 6),
      zh, folderLicense: folderLicense ? path.basename(folderLicense) : '', repoLicense: !!repoLicense,
      bodyChars: raw.length,
    }) + '\n')
  }
}
