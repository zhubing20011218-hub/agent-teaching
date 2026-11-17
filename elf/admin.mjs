// 学创 AI 的管理后台接口：登录后查看读者的反馈和提问。
//
//   POST /api/elf/admin/login    { user, password } → 设置登录 cookie(12 小时有效)
//   POST /api/elf/admin/logout
//   GET  /api/elf/admin/data     反馈、提问、统计(要先登录)
//   POST /api/elf/admin/mark     { id, done } 把一条反馈标成"已处理"/"未处理"
//
// 密码：
//   线上：api.env 里只放密码的"指纹" ELF_ADMIN_PASSWORD_HASH(scrypt 加盐哈希)，不放原文。
//         用 deploy/set-elf-secrets.sh 从本机 .env 的 TEACH_ELF_ADMIN_PASSWORD 算好再传上去
//   本机试运行：可以直接读 .env 的 TEACH_ELF_ADMIN_PASSWORD(启动时在内存里算指纹)
//   用户名：ELF_ADMIN_USER / TEACH_ELF_ADMIN_USER，默认 admin
//
// 防护：同一 IP 15 分钟最多试 5 次；全站 15 分钟最多失败 30 次(防有人换 IP 猜)；
//      cookie 是 HttpOnly + SameSite=Strict(网页脚本读不到，别的网站也带不过来)，线上加 Secure

import crypto from 'node:crypto'
import fs from 'node:fs'
import path from 'node:path'

/** 生成密码指纹：scrypt:盐:哈希 */
export function hashPassword(password, salt = crypto.randomBytes(16)) {
  const hash = crypto.scryptSync(String(password), salt, 32)
  return `scrypt:${salt.toString('base64')}:${hash.toString('base64')}`
}

function checkPassword(password, stored) {
  const [algo, salt, hash] = String(stored).split(':')
  if (algo !== 'scrypt' || !salt || !hash) return false
  const want = Buffer.from(hash, 'base64')
  const got = crypto.scryptSync(String(password), Buffer.from(salt, 'base64'), want.length)
  return got.length === want.length && crypto.timingSafeEqual(got, want)
}

export function createAdmin({ env, dataDir, send, readBody, clientIp }) {
  const USER = (env.ELF_ADMIN_USER || env.TEACH_ELF_ADMIN_USER || 'admin').trim()
  let HASH = (env.ELF_ADMIN_PASSWORD_HASH || '').trim()
  if (!HASH && env.TEACH_ELF_ADMIN_PASSWORD) {
    HASH = hashPassword(env.TEACH_ELF_ADMIN_PASSWORD)
    if (env.TEACH_ELF_ADMIN_PASSWORD.length < 12) console.warn('[elf] ⚠️ 管理员密码太短，只适合本机试用，不要用在线上')
  }
  const enabled = Boolean(HASH)

  const sessions = new Map() // token → 过期时间
  const SESSION_MS = 12 * 3600_000
  const fails = new Map() // ip → [时间]
  let globalFails = []
  const WINDOW = 15 * 60_000

  const handledFile = path.join(dataDir, 'handled.json')
  const readHandled = () => {
    try {
      return JSON.parse(fs.readFileSync(handledFile, 'utf-8'))
    } catch {
      return {}
    }
  }

  function cookieToken(req) {
    const m = /(?:^|;\s*)xc_admin=([A-Za-z0-9_-]+)/.exec(String(req.headers.cookie || ''))
    return m ? m[1] : ''
  }
  function loggedIn(req) {
    const t = cookieToken(req)
    const exp = t && sessions.get(t)
    if (!exp) return false
    if (exp < Date.now()) {
      sessions.delete(t)
      return false
    }
    return true
  }
  function cookie(req, value, maxAge) {
    const secure = String(req.headers['x-forwarded-proto'] || '').includes('https') ? '; Secure' : ''
    return `xc_admin=${value}; Path=/api/elf/admin; HttpOnly; SameSite=Strict; Max-Age=${maxAge}${secure}`
  }

  function readJsonl(file, since) {
    const p = path.join(dataDir, file)
    if (!fs.existsSync(p)) return []
    const out = []
    for (const line of fs.readFileSync(p, 'utf-8').split('\n')) {
      if (!line) continue
      try {
        const r = JSON.parse(line)
        if (Date.parse(r.t) >= since) out.push(r)
      } catch {}
    }
    return out
  }

  async function login(req, res) {
    if (!enabled) return send(res, 503, { error: 'not_configured' })
    const ip = clientIp(req)
    const now = Date.now()
    const mine = (fails.get(ip) || []).filter((t) => now - t < WINDOW)
    globalFails = globalFails.filter((t) => now - t < WINDOW)
    if (mine.length >= 5 || globalFails.length >= 30) return send(res, 429, { error: 'locked' })
    const body = await readBody(req, 2048)
    const user = typeof body.user === 'string' ? body.user.trim() : ''
    const password = typeof body.password === 'string' ? body.password : ''
    const ok = checkPassword(password, HASH) && user === USER // 先算密码，用户名对不对都花一样的时间
    if (!ok) {
      mine.push(now)
      fails.set(ip, mine)
      globalFails.push(now)
      console.warn(`[elf] 后台登录失败(15 分钟内第 ${mine.length} 次)`)
      return send(res, 401, { error: 'wrong', left: Math.max(0, 5 - mine.length) })
    }
    fails.delete(ip)
    const token = crypto.randomBytes(32).toString('base64url')
    sessions.set(token, now + SESSION_MS)
    res.setHeader('set-cookie', cookie(req, token, SESSION_MS / 1000))
    console.log('[elf] 后台登录成功')
    send(res, 200, { ok: true })
  }

  function logout(req, res) {
    sessions.delete(cookieToken(req))
    res.setHeader('set-cookie', cookie(req, '', 0))
    send(res, 200, { ok: true })
  }

  function data(req, res, url) {
    const days = Math.min(365, Math.max(1, Number(url.searchParams.get('days')) || 30))
    const since = Date.now() - days * 86400_000
    const handled = readHandled()
    const newestFirst = (a, b) => (a.t < b.t ? 1 : a.t > b.t ? -1 : 0)
    const feedback = readJsonl('feedback.jsonl', since)
      .map((r) => ({ ...r, id: r.id || r.t, done: Boolean(handled[r.id || r.t]) }))
      .sort(newestFirst)
      .slice(0, 2000)
    const questions = readJsonl('questions.jsonl', since).sort(newestFirst).slice(0, 3000)
    send(res, 200, { days, user: USER, feedback, questions })
  }

  async function mark(req, res) {
    const body = await readBody(req, 1024)
    const id = typeof body.id === 'string' ? body.id.slice(0, 80) : ''
    if (!id) return send(res, 400, { error: 'no_id' })
    const handled = readHandled()
    if (body.done) handled[id] = new Date().toISOString()
    else delete handled[id]
    fs.writeFileSync(handledFile, JSON.stringify(handled))
    send(res, 200, { ok: true })
  }

  /** 是后台的请求就处理并返回 true */
  return async function handle(req, res, url) {
    if (!url.pathname.startsWith('/api/elf/admin/')) return false
    const route = req.method + ' ' + url.pathname.slice('/api/elf/admin/'.length)
    if (route === 'POST login') await login(req, res)
    else if (route === 'GET status') send(res, 200, { enabled, loggedIn: loggedIn(req) })
    else if (!loggedIn(req)) send(res, 401, { error: 'login' })
    else if (route === 'POST logout') logout(req, res)
    else if (route === 'GET data') data(req, res, url)
    else if (route === 'POST mark') await mark(req, res)
    else send(res, 404, { error: 'not_found' })
    return true
  }
}
