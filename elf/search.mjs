// 学创 AI 的"翻书"本事：在全站知识库里找最相关的段落。
// 网页(浏览器里即时搜索)和服务器(给 AI 找参考资料)共用这一个文件，保证两边找到的结果一样。
// 不依赖任何第三方库。
//
// 做法：BM25 打分(搜索引擎常用的老办法)。中文没有空格，所以按"相邻两个字"切词
// (比如"安装技能" → 安装 / 装技 / 技能)，英文和数字按整词切。

/** 问题里常见、但对找内容没帮助的词 */
const STOP = new Set([
  '什么', '怎么', '怎样', '如何', '为什', '么是', '是什', '一个', '这个', '那个', '可以', '能不', '不能', '我们', '你们',
  '他们', '的话', '一下', '请问', '告诉', '诉我', '我的', '你的', '有没', '没有', '哪里', '哪个', '为啥', '是不', '不是',
  '吗', '呢', '的', '了', '是', '我', '你', '在', '有', '和', '吧', '啊', '呀',
  'the', 'a', 'an', 'is', 'are', 'to', 'of', 'and', 'or', 'in', 'on', 'for', 'how', 'what', 'do', 'i', 'my', 'it',
])

/** 单字里太常见、没区分度的字 */
const STOP_CHAR = new Set([...'的了是我你他她它在有和与及或吧啊呀吗呢么什怎这那个一不也就都要会能可以到把被给让从对为上下中里去来说做用看过好多很还没'])
const UNI = 0.3 // 单字的分量
/** 含这些虚词的两字组合没有意义(比如"怎么装"切出的"么装")，跳过 */
const GLUE = /[么的了吗呢吧啊呀]/

const CJK = /[㐀-鿿豈-﫿]/

/** 读者问的是"这一页 / 这一章"：只在当前页面里找 */
export const THIS_PAGE = /这一?页|这一?章|本页|本章|这一?节|这篇|这里讲/

/** 把一段文字切成搜索用的小词 */
export function tokenize(text) {
  const out = []
  const s = String(text || '').toLowerCase()
  const re = /[a-z0-9][a-z0-9._+-]*|[㐀-鿿豈-﫿]+/g
  let m
  while ((m = re.exec(s))) {
    const w = m[0]
    if (CJK.test(w[0])) {
      if (w.length === 1) {
        if (!STOP.has(w)) out.push(w)
        continue
      }
      for (let i = 0; i < w.length - 1; i++) {
        const bi = w.slice(i, i + 2)
        if (!STOP.has(bi) && !GLUE.test(bi)) out.push(bi)
      }
      // 单个字也记一下(分量很轻)：问"怎么装"，也能找到写着"安装"的那一节
      for (const ch of w) if (!STOP_CHAR.has(ch)) out.push('~' + ch)
    } else {
      const word = w.replace(/[._+-]+$/, '')
      if (word && !STOP.has(word)) out.push(word)
      // deepseek-flash 这种带短横线的名字，同时拆成 deepseek / flash
      if (/[-_.]/.test(word)) for (const p of word.split(/[-_.]+/)) if (p.length > 1 && !STOP.has(p)) out.push(p)
    }
  }
  return out
}

/**
 * 建一个搜索器。chunks 是知识库里的段落：{ u: 网址, p: 页面标题, h: 小节标题, t: 正文 }
 * 标题里的词算 3 倍分量：问"怎么装 DSH"，标题就叫"安装 DSH"的那节应该排最前。
 */
export function createSearcher(chunks) {
  const docs = chunks.map((c) => {
    const tf = new Map()
    const add = (tokens, w) => {
      for (const t of tokens) tf.set(t, (tf.get(t) || 0) + (t[0] === '~' ? w * UNI : w))
    }
    add(tokenize(c.t), 1)
    add(tokenize(c.h), 3)
    add(tokenize(c.p), 1.5)
    let len = 0
    for (const v of tf.values()) len += v
    return { tf, len }
  })
  const df = new Map()
  for (const d of docs) for (const t of d.tf.keys()) df.set(t, (df.get(t) || 0) + 1)
  const N = docs.length || 1
  const avg = docs.reduce((s, d) => s + d.len, 0) / N || 1
  const idf = (t) => {
    const n = df.get(t) || 0
    return Math.log(1 + (N - n + 0.5) / (n + 0.5))
  }

  /**
   * 搜索。返回 [{ chunk, score }]，分数从高到低。
   * options.path：读者当前所在页面，同一页的内容稍微加分；
   * 问题里说了"这一页""这一章"，就只看这一页(这一页没有相关内容时，再看全站)
   */
  function search(query, options = {}) {
    const { limit = 6, path = '' } = options
    if (path && THIS_PAGE.test(query)) {
      const own = run(query.replace(THIS_PAGE, ' '), limit, path, true)
      if (own.length) return own
      // 只问"这一页讲了什么"，没有别的关键词：直接给这一页开头的几节
      const first = chunks.filter((c) => c.u.split('#')[0] === path).slice(0, limit)
      if (first.length) return first.map((chunk) => ({ chunk, score: 1 }))
    }
    return run(query, limit, path, false)
  }

  function run(query, limit, path, onlyPath) {
    const terms = [...new Set(tokenize(query))]
    if (!terms.length) return []
    // 问题里点名了"第 7 章"：那一章的内容加分
    const ch = /第\s*(\d{1,2})\s*章/.exec(query)
    const chPrefix = ch ? `/chapters/${ch[1].padStart(2, '0')}-` : ''
    const k1 = 1.2
    const b = 0.75
    const results = []
    for (let i = 0; i < docs.length; i++) {
      if (onlyPath && chunks[i].u.split('#')[0] !== path) continue
      const d = docs[i]
      let score = 0
      let hit = 0
      let need = 0
      for (const t of terms) {
        const uni = t[0] === '~'
        const w = uni ? UNI : 1
        need += w
        const f = d.tf.get(t)
        if (!f) continue
        hit += w
        score += w * idf(t) * ((f * (k1 + 1)) / (f + k1 * (1 - b + (b * d.len) / avg)))
      }
      if (!score) continue
      // 问题里的词命中得越全，越可信
      score *= 0.5 + (0.5 * hit) / need
      if (path && chunks[i].u.split('#')[0] === path) score *= 1.15
      if (chPrefix && chunks[i].u.startsWith(chPrefix)) score *= 2
      results.push({ chunk: chunks[i], score })
    }
    results.sort((a, b2) => b2.score - a.score)
    // 同一个网址只留分最高的一段，避免结果里全是同一节被切开的几块
    const seen = new Set()
    const out = []
    for (const r of results) {
      if (seen.has(r.chunk.u)) continue
      seen.add(r.chunk.u)
      out.push(r)
      if (out.length >= limit) break
    }
    return out
  }

  return { search, size: chunks.length }
}

/** 从正文里挑出和问题最相关的一小段，当作搜索结果下面的摘要 */
export function snippet(text, query, size = 72) {
  const t = String(text || '').replace(/\s+/g, ' ').trim()
  if (t.length <= size) return t
  const terms = [...new Set(tokenize(query))].map((x) => x.replace(/^~/, ''))
  if (!terms.length) return t.slice(0, size) + '…'
  const lower = t.toLowerCase()
  let best = 0
  let bestScore = -1
  for (let start = 0; start < lower.length; start += Math.max(8, Math.floor(size / 4))) {
    const win = lower.slice(start, start + size)
    let s = 0
    for (const term of terms) if (win.includes(term)) s++
    if (s > bestScore) {
      bestScore = s
      best = start
    }
  }
  const from = Math.max(0, best - 6)
  return (from > 0 ? '…' : '') + t.slice(from, from + size) + (from + size < t.length ? '…' : '')
}
