// 作品展示的数据：GitHub 上真实存在、能看到成品的 AI 项目。
// 每条都要有“证据”：提交记录里的 AI 署名、仓库里的 CLAUDE.md / AGENTS.md / 计划文档，或作者自己的说明。
// 没证据的过程，不写。核对日期写在 CHECKED。

import type { RoleKey } from './skills-data'

export const CHECKED = '2026-11-17'

export interface ShowcaseEntry {
  id: string
  title: string
  role: RoleKey | 'home'
  kind: 'built' | 'powered' // built = 代码由 AI 写；powered = 一套让 AI 干活的流程 / skill
  url: string
  license: string
  what: string // 它是什么（一句话）
  result: string // 你能看到的成品
  steps: string[] // 作者是怎么做的（只写有证据的）
  evidence: string // 证据在哪里
  learn: string // 你可以学走的做法
  prompt: string // 发给 DSH 的“简化版”提示词
}

export const SHOWCASE_ROLES: { key: ShowcaseEntry['role']; label: string }[] = [
  { key: 'student', label: '🎓 大学生' },
  { key: 'teacher', label: '👩‍🏫 大学老师' },
  { key: 'accounting', label: '🧾 会计 / 家庭财务' },
  { key: 'ecommerce', label: '🛒 电商' },
  { key: 'media', label: '🎬 自媒体' },
  { key: 'pet', label: '🐾 宠物主人' },
  { key: 'travel', label: '✈️ 旅行' },
  { key: 'home', label: '🏠 综合' },
]

export const SHOWCASE: ShowcaseEntry[] = [
  {
    id: 'english-handbook',
    title: '英语口语练习系统',
    role: 'student',
    kind: 'built',
    url: 'https://github.com/shazinet/english-handbook',
    license: 'MIT',
    what: '一个学习者给自己做的英语练习系统：记忆卡片、每日写作批改，错题自动变成新卡片。',
    result: '一键安装后，得到一套按你的水平生成的 Anki 卡片，以及 /journal、/check 这些练习命令。',
    steps: [
      '先写 CLAUDE.md：规定卡片怎么写、按什么教材的大纲来',
      '把常用操作做成命令：/journal 写日记、/check 批改、/drill 练习',
      '一小批一小批地加内容，每次提交都写清楚改了什么',
    ],
    evidence: '仓库 35 次提交，每一次都带 Claude 的协作署名；根目录有 CLAUDE.md 和 .claude/commands',
    learn: '把“学习方法”写成规则交给 AI，把每天要做的事做成一句话就能触发的命令',
    prompt: '我想做一个背单词的小系统：每天给我 10 个四级单词，我写例句，你批改；我写错的单词第二天再考我。先给我看计划，确认后再做。所有文件放在当前文件夹里。',
  },
  {
    id: 'tikz-editor',
    title: 'TikZ 论文插图编辑器',
    role: 'teacher',
    kind: 'built',
    url: 'https://tikz.dev/editor/',
    license: '不开源，可以直接在线使用',
    what: '在网页上拖拽编辑 LaTeX TikZ 图形，适合做论文和讲义里的示意图。',
    result: '打开网页就能用，所见即所得，画完导出 TikZ 代码。',
    steps: ['作者说明：几乎全部代码由 Codex 写成'],
    evidence: '收录于开源清单 awesome-vibecoded-apps（作者自述）；不开源，看不到开发过程',
    learn: '老师自己最常用、又最费时间的小工具，最适合让 AI 帮你做出来',
    prompt: '帮我做一个网页小工具：粘贴学生名单（只用学号），随机分成每组 4 人，能导出 Excel。只用一个 HTML 文件，不联网。先给我看计划。',
  },
  {
    id: 'geneguessr',
    title: 'GeneGuessr 每日生物学谜题',
    role: 'teacher',
    kind: 'built',
    url: 'https://geneguessr.brinedew.bio',
    license: '不开源，可以直接在线使用',
    what: '一位生物学研究者用 Claude 做的每日生物学猜谜小游戏。',
    result: '在线小游戏，每天一道题。',
    steps: ['作者说明：由生物学研究者借助 Claude 做成'],
    evidence: '收录于开源清单 awesome-vibecoded-apps（作者自述）；不开源',
    learn: '懂专业的人 + AI 写代码 = 能做出课堂用的互动小游戏',
    prompt: '帮我做一个课堂小测网页：从 题库.md 随机抽 5 道选择题，做完立刻显示对错和解析。只用一个 HTML 文件，不联网，不收集任何信息。',
  },
  {
    id: 'household-budget',
    title: '家庭记账：银行流水自动分类',
    role: 'accounting',
    kind: 'built',
    url: 'https://github.com/ramazankarisan/household-budget',
    license: 'MIT',
    what: '导入银行流水 CSV，按规则自动分类，做月度预算；数据只存在自己电脑上。',
    result: '一个本地运行的记账工具：导入、分类、按月看预算。',
    steps: [
      '每个功能都按“调研 → 写计划 → 实现”三步走',
      '决定都写成文档：仓库里有 12 份计划、7 份调研笔记',
      '给 AI 设了它跳不过去的检查关卡（作者在 docs/best-practices.md 里写了六层）',
    ],
    evidence: 'README 写明用 Claude Code 开发；docs/plans、docs/research 里是完整的计划和调研记录',
    learn: '让 AI 先写计划、你确认后再动手；每一步都有检查，这正是本教程反复强调的做法',
    prompt: '我有一份银行流水 CSV。请先读前 20 行告诉我有哪些列；然后写一个计划：怎么按“餐饮、交通、房租、其他”自动分类。等我确认计划后，再用程序分类并输出 Excel。不要心算。',
  },
  {
    id: 'expense-tracker',
    title: '一个文件的记账本',
    role: 'accounting',
    kind: 'built',
    url: 'https://github.com/fikriub/expense_tracker',
    license: 'MIT',
    what: '一个 HTML 文件做成的个人记账本：记收入支出、看余额。',
    result: '双击网页文件就能用，不用安装任何东西。',
    steps: ['作者说明：借助 Claude 完成开发', '全部功能放在一个 HTML 文件里'],
    evidence: 'README 写明“Claude-assisted development workflow”',
    learn: '新手的第一个作品，从“一个文件就能跑”的小工具开始最容易成功',
    prompt: '帮我做一个记账网页：能记收入和支出、分类、看本月余额，数据存在浏览器里。只用一个 HTML 文件，不联网。做完告诉我怎么打开。',
  },
  {
    id: 'ecommerce-claude-skills',
    title: '电商运营 skill 合集',
    role: 'ecommerce',
    kind: 'powered',
    url: 'https://github.com/mardab96/ecommerce-claude-skills',
    license: 'MIT',
    what: '20 个电商 skill：商品页诊断、促销复盘、库存风险、利润核算，用导出的表格分析。',
    result: '装上其中一个，把店铺导出的表格交给 AI，就能得到一份诊断报告。',
    steps: ['先做 10 个店铺前台相关的 skill', '再扩充到 20 个，补上利润和库存', '最后加确定性的计算脚本，修了 7 个问题'],
    evidence: '提交记录完整记录了从 10 个到 20 个的迭代；仓库有 AGENTS.md，部分提交带 AI 协作署名',
    learn: '先做最常用的几个，用起来再扩充；涉及金额的计算交给脚本',
    prompt: '我导出了上个月的订单表 订单.xlsx。请先告诉我表里有哪些列，然后按商品统计销量、销售额和退款率，找出退款率最高的 3 个商品。用程序计算。',
  },
  {
    id: 'unfaced',
    title: '不露脸短视频流水线',
    role: 'media',
    kind: 'built',
    url: 'https://github.com/dodoshell/unfaced',
    license: 'MIT',
    what: '用编程 agent 做“不露脸”短视频：选题、脚本、配音、画面、字幕、封面。',
    result: '一句话的想法，变成一条竖版短视频和发布文案。',
    steps: ['脚本写好后，先停下来等人确认，再往下做', '每条视频做完，自动检查，再交给另一个“审核员”复查', '只生成文件，从不替你自动发布'],
    evidence: '描述写明用 Claude Code 制作；仓库有 CLAUDE.md、AGENTS.md 和测试用例（evals）',
    learn: '关键节点让 AI 停下来等你确认；发布这一步永远自己来',
    prompt: '我要做一条 60 秒的科普短视频，主题是「猫为什么爱踩奶」。先查资料并标出处，再写脚本和分镜表。写完脚本先停下，等我确认后再继续。',
  },
  {
    id: 'dog-e-dex',
    title: 'Dog-e-dex 狗狗图鉴',
    role: 'pet',
    kind: 'built',
    url: 'https://apps.apple.com/app/dog-e-dex/id6741032284',
    license: '不开源（iOS 应用）',
    what: '拍一张狗狗的照片，识别品种并收集进图鉴。',
    result: 'App Store 上架的 iPhone 应用。',
    steps: ['作者说明：借助 AI 编程完成'],
    evidence: '收录于开源清单 awesome-vibecoded-apps（作者自述）；不开源',
    learn: '养宠的人最懂需求，AI 可以帮你把想法变成能用的工具',
    prompt: '帮我做一个宠物记录网页：记录疫苗、驱虫、体重，按日期列出下次要做的事。只用一个 HTML 文件，数据存在浏览器里，不联网。',
  },
  {
    id: 'travel-planner-plugin',
    title: '家庭旅行管家',
    role: 'travel',
    kind: 'powered',
    url: 'https://github.com/theoms/co-work-travel-planner-claude',
    license: 'MIT',
    what: '一套让 AI 规划家庭旅行的 skill：先问清楚家庭情况，再选目的地、排路线、出每日行程。',
    result: '回答几个问题后，得到完整的行程、路线图和出行清单。',
    steps: ['把规划拆成几个参考文档：目的地调研、自驾规划、每日行程、出行清单', '先问问题，再规划'],
    evidence: '仓库里 skills/plan-trip 下的 SKILL.md 和 references 文档就是它的全部“做法”',
    learn: '复杂的事拆成几份说明书；让 AI 先问清楚再动手',
    prompt: '我想带父母去杭州玩 3 天。请先问我问题（预算、体力、喜好），问清楚再排行程。开放时间和票价要查官方来源，查不到写「待查」。',
  },
  {
    id: 'micasa',
    title: 'micasa 家庭事务管家',
    role: 'home',
    kind: 'built',
    url: 'https://github.com/micasa-dev/micasa',
    license: 'Apache-2.0',
    what: '在终端里管理家里的维修、项目、家电保修。',
    result: '一个成熟的开源工具，1,200 多人收藏，有官网和文档。',
    steps: ['用 AGENTS.md 给 AI 定规矩', '把常用操作写成 AI 命令：加新数据类型、检查文档', '官网有完整文档和开发博客'],
    evidence: '仓库有 AGENTS.md 和 .claude/commands；最近 100 次提交里有 17 次带 AI 协作署名',
    learn: '项目越大，越要把规矩写下来；AI 写的代码人要审',
    prompt: '帮我建一个“家里的东西”清单：家电名称、购买日期、保修到期日，生成 Excel，保修 30 天内到期的标红。',
  },
]
