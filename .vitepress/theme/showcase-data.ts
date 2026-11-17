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
  prompt: string // 复刻的起点：第 0 步（交代项目 + 检查环境）的提示词，完整步骤在 /showcase/<id> 页面
  recipeSteps: number // 复刻一共几步
}

export const SHOWCASE_ROLES: { key: ShowcaseEntry['role']; label: string }[] = [
  { key: 'student', label: '🎓 大学生' },
  { key: 'teacher', label: '👩‍🏫 大学老师' },
  { key: 'accounting', label: '🧾 会计 / 家庭财务' },
  { key: 'ecommerce', label: '🛒 电商' },
  { key: 'media', label: '🎬 自媒体' },
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
    prompt: '我要在 DSH 里复刻一个项目的简化版。今天先检查电脑环境，先不写代码。\n项目：english-handbook（英语口语练习系统） https://github.com/shazinet/english-handbook\n原作只支持 Mac，安装脚本会装命令行开发者工具、Homebrew、Anki 和一个 Python 环境，并直接生成 Anki 牌组。\n我这次做的是：一个只用文件的简化版：日记和错题是 Markdown 文件，记忆卡片导出成 CSV 再手动导入 Anki，进度页是一个 HTML 文件。\n这次只需要检查这几样：\n1. Anki 桌面版：Mac 看 /Applications/Anki.app 是否存在，Windows 看开始菜单里有没有 Anki；导入记忆卡片要用，没有也能先做日记和批改\n2. 浏览器：能打开本地的 HTML 文件（打开进度页要用）\n不需要：Homebrew、Python、Node.js（这次都用不到，不要安装）。\n请逐项检查。只检查，不要安装、不要修改任何东西。用表格告诉我：装了没有、版本号、够不够用。\n缺的：要下载安装包的，给我官网地址和安装步骤，我自己装；工具包可以你来装，但先把完整命令告诉我，等我同意。\n检查完就停下，先不要开始做，等我发下一条消息。',
    recipeSteps: 7,
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
    prompt: '我要在 DSH 里复刻一个项目的简化版。今天先检查电脑环境，先不写代码。\n项目：GeneGuessr（每日猜基因小游戏） https://geneguessr.brinedew.bio\n原作是一个网站，不开源。\n我这次做的是：一个单文件的“每日猜化学元素”网页小游戏 guess.html。\n这次只需要检查这几样：\n1. 能在当前文件夹写文件：新建 test.html，里面只写一行大字“环境正常 ✅”\n2. 能用浏览器打开它：告诉我在我这台电脑上怎么双击打开\n不需要：Python、Node.js、任何工具包。\n请逐项检查。除了上面让你新建的测试文件，不要安装、不要修改任何东西。用表格告诉我：装了没有、版本号、够不够用。\n缺的：要下载安装包的，给我官网地址和安装步骤，我自己装；工具包可以你来装，但先把完整命令告诉我，等我同意。\n检查完就停下，先不要开始做，等我发下一条消息。',
    recipeSteps: 3,
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
    prompt: '我要在 DSH 里复刻一个项目的简化版。今天先检查电脑环境，先不写代码。\n项目：household-budget（家庭记账） https://github.com/ramazankarisan/household-budget\n原作需要 macOS 或 Linux、Node.js 24、pnpm 12，数据存在 SQLite 数据库里。\n我这次做的是：一个单文件的本地记账网页 budget.html，数据存在浏览器里，所以用不到原作的那些环境。\n这次只需要检查这几样：\n1. 能在当前文件夹写文件：新建 test.html，里面只写一行大字“环境正常 ✅”\n2. 能用浏览器打开它：告诉我在我这台电脑上怎么双击打开\n不需要：Node.js、pnpm、SQLite、任何工具包（这次都用不到，不要安装）。\n请逐项检查。除了上面让你新建的测试文件，不要安装、不要修改任何东西。用表格告诉我：装了没有、版本号、够不够用。\n缺的：要下载安装包的，给我官网地址和安装步骤，我自己装；工具包可以你来装，但先把完整命令告诉我，等我同意。\n检查完就停下，先不要开始做，等我发下一条消息。',
    recipeSteps: 6,
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
    prompt: '我要在 DSH 里复刻一个项目的简化版。今天先检查电脑环境，先不写代码。\n项目：Ledger 记账本 https://github.com/fikriub/expense_tracker\n原作就是一个 HTML 文件，用浏览器的 localStorage 存数据，不需要安装任何东西。\n我这次做的是：一个单文件的记账网页 ledger.html。\n这次只需要检查这几样：\n1. 能在当前文件夹写文件：新建 test.html，里面只写一行大字“环境正常 ✅”\n2. 能用浏览器打开它：告诉我在我这台电脑上怎么双击打开\n不需要：Python、Node.js、任何工具包。\n请逐项检查。除了上面让你新建的测试文件，不要安装、不要修改任何东西。用表格告诉我：装了没有、版本号、够不够用。\n缺的：要下载安装包的，给我官网地址和安装步骤，我自己装；工具包可以你来装，但先把完整命令告诉我，等我同意。\n检查完就停下，先不要开始做，等我发下一条消息。',
    recipeSteps: 4,
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
    prompt: '我要在 DSH 里复刻一个项目的简化版。今天先检查电脑环境，先不写代码。\n项目：ecommerce-claude-skills（电商分析 skill 合集） https://github.com/mardab96/ecommerce-claude-skills\n原作的计算脚本只用 Python 3 自带的库，不需要安装任何工具包，也不联网。\n我这次做的是：自己的一个“退货原因分析”skill，带一个 Python 计算脚本，同样只用自带的库。\n这次只需要检查这几样：\n1. Python 3.8 以上：运行 python3 --version（Windows 用 python --version）\n2. 当前项目里能新建 .dsh/skills/ 文件夹并写入文件\n不需要：pandas、Node.js（这次都用不到，不要安装）。\n请逐项检查。只检查，不要安装、不要修改任何东西。用表格告诉我：装了没有、版本号、够不够用。\n缺的：要下载安装包的，给我官网地址和安装步骤，我自己装；工具包可以你来装，但先把完整命令告诉我，等我同意。\n检查完就停下，先不要开始做，等我发下一条消息。',
    recipeSteps: 4,
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
    prompt: '我要在 DSH 里复刻一个项目的简化版。今天先检查电脑环境，先不写代码。\n项目：unfaced（不露脸短视频流水线） https://github.com/dodoshell/unfaced\n原作需要 Node.js 22 以上、git，还要下载约 1GB 的语音模型、语音识别和渲染用的浏览器。\n我这次做的是：一个会自动播放的动画网页 video.html，用系统自带的录屏录成视频；封面图用 canvas-design skill 生成。\n这次只需要检查这几样：\n1. 浏览器：能打开本地 HTML 文件并全屏播放\n2. 录屏工具：Mac 用系统自带的 QuickTime 或 Cmd+Shift+5；Windows 用系统自带的 Xbox Game Bar（Win+G），确认能用就行\n3. reliable-research 和 canvas-design 两个 skill：在 DSH 的 skill 列表里能找到\n4. Python 3.10 以上，以及 Pillow 工具包（canvas-design 出封面图要用）：运行 python3 --version 和 python3 -c "import PIL"（Windows 把 python3 换成 python）\n不需要：Node.js、git、语音模型（这次都用不到，不要安装）。\n请逐项检查。只检查，不要安装、不要修改任何东西。用表格告诉我：装了没有、版本号、够不够用。\n缺的：要下载安装包的，给我官网地址和安装步骤，我自己装；工具包可以你来装，但先把完整命令告诉我，等我同意。\n检查完就停下，先不要开始做，等我发下一条消息。',
    recipeSteps: 5,
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
    prompt: '我要在 DSH 里复刻一个项目的简化版。今天先检查电脑环境，先不写代码。\n项目：co-work-travel-planner-claude（家庭旅行管家） https://github.com/theoms/co-work-travel-planner-claude\n原作是 Claude 桌面版的插件，不需要配置；它用谷歌地图查商家，用开源地图画路线。\n我这次做的是：自己的一个旅行规划 skill，最后输出一个带地图的行程网页 trip.html；查资料用 reliable-research，不用谷歌地图。\n这次只需要检查这几样：\n1. 浏览器：能打开本地 HTML 文件\n2. 网络：能不能打开 https://unpkg.com 和 https://tile.openstreetmap.org （地图要从这两个地方加载；打不开也能做，只是没有地图）\n3. reliable-research skill：在 DSH 的 skill 列表里能找到\n不需要：谷歌地图钥匙、Python、Node.js（这次都用不到，不要安装）。\n请逐项检查。只检查，不要安装、不要修改任何东西。用表格告诉我：装了没有、版本号、够不够用。\n缺的：要下载安装包的，给我官网地址和安装步骤，我自己装；工具包可以你来装，但先把完整命令告诉我，等我同意。\n检查完就停下，先不要开始做，等我发下一条消息。',
    recipeSteps: 4,
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
    prompt: '我要在 DSH 里复刻一个项目的简化版。今天先检查电脑环境，先不写代码。\n项目：micasa（家庭事务管家） https://github.com/micasa-dev/micasa\n原作是用 Go 1.27 写的终端程序，要用 go install 安装。\n我这次做的是：一个单文件的网页版 home.html，样子模仿终端，所以用不到 Go。\n这次只需要检查这几样：\n1. 能在当前文件夹写文件：新建 test.html，里面只写一行大字“环境正常 ✅”\n2. 能用浏览器打开它：告诉我在我这台电脑上怎么双击打开\n不需要：Go、Python、Node.js、任何工具包（这次都用不到，不要安装）。\n请逐项检查。除了上面让你新建的测试文件，不要安装、不要修改任何东西。用表格告诉我：装了没有、版本号、够不够用。\n缺的：要下载安装包的，给我官网地址和安装步骤，我自己装；工具包可以你来装，但先把完整命令告诉我，等我同意。\n检查完就停下，先不要开始做，等我发下一条消息。',
    recipeSteps: 5,
  },
]
