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
  prompt: string // 复刻第 1 步的提示词（完整步骤在 /showcase/<id> 页面）
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
    prompt: '参考这个开源项目：https://github.com/shazinet/english-handbook（MIT 许可证）\n先读下面这几个文件。只读，不要运行里面的任何脚本，也不要安装它的依赖：\n- https://raw.githubusercontent.com/shazinet/english-handbook/main/CLAUDE.md（整个系统的规则：数据怎么分、卡片怎么写）\n- https://raw.githubusercontent.com/shazinet/english-handbook/main/.claude/commands/journal.md（“写日记”命令）\n- https://raw.githubusercontent.com/shazinet/english-handbook/main/.claude/commands/check.md（“批改”命令）\n读完用三五句话告诉我：它是做什么的、分几块、外观或写法有什么特点。\n然后参考它的功能和外观，在当前文件夹里自己重新做一个简化版，不要整份复制它的代码；用到它的代码片段时，在文件开头注明出处和许可证。\n如果打不开这些链接，直接告诉我，然后只按下面的要求做。\n\n帮我搭一个英语口语练习系统，先建档。问我 5 个问题（一次问完）：\n我的水平（大概 A2/B1/B2/C1）、母语、每天能花多少分钟、想练的场景（工作/旅行/日常聊天）、最想改掉的毛病。\n我回答后，把结果写进 me/profile.md。\n以后所有属于我个人的内容（日记、错题、卡片）都放在 me/ 文件夹里。',
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
    prompt: '参考这个作品：https://geneguessr.brinedew.bio（不开源，只看网页上公开的玩法说明）\n先打开看看它的玩法说明，只看页面，不要在上面登录或输入任何信息。\n看完用三五句话告诉我：它怎么玩、有哪些提示、猜完会显示什么。\n然后参考它的玩法，在当前文件夹里自己做一个我所在学科的版本。\n如果打不开这个网站，直接告诉我，然后只按下面的要求做。\n\n做一个前 36 号化学元素的数据文件 elements.json，每个元素包含：\n中文名、符号、原子序数、相对原子质量（保留一位小数）、周期、族、类别（金属/非金属/稀有气体/类金属）、常温状态（固/液/气）、一个生活中的用途。\n数据要准确。做完后随机挑 5 个元素，把数据列成表给我核对。',
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
    prompt: '参考这个开源项目：https://github.com/ramazankarisan/household-budget（MIT 许可证）\n先读下面这几个文件。只读，不要运行里面的任何脚本，也不要安装它的依赖：\n- https://raw.githubusercontent.com/ramazankarisan/household-budget/main/README.md（功能说明）\n- https://raw.githubusercontent.com/ramazankarisan/household-budget/main/DESIGN.md（设计规范：颜色、原则、金额怎么显示）\n- https://raw.githubusercontent.com/ramazankarisan/household-budget/main/docs/plans/02-categorization-rules.md（分类规则的开发计划，看作者怎么写计划）\n读完用三五句话告诉我：它是做什么的、分几块、外观或写法有什么特点。\n然后参考它的功能和外观，在当前文件夹里自己重新做一个简化版，不要整份复制它的代码；用到它的代码片段时，在文件开头注明出处和许可证。\n如果打不开这些链接，直接告诉我，然后只按下面的要求做。\n\n我要做一个本地记账网页 budget.html。先别写代码，先写一份设计规范 DESIGN.md，内容：\n1. 三条原则：先给答案（每页开头一句话或一个大数字回答“这个月怎么样”）；颜色有含义（红色只用于超预算和错误）；本地优先（不联网、不加载外部资源）\n2. 颜色：页面底 #F6F5F1，卡片 #FFFFFF，浅底 #EFEDE7，分隔线 #E2DFD7，主文字 #1A1C1B，次要文字 #5B605D，主色 #0E5A4B（浅底 #E1EFEA），\n   收入/未超 #1D7442，接近预算 #A15C00，超预算 #B42318\n3. 分类颜色固定 8 种：蓝 #2A78D6、橙 #EB6834、青 #1BAF7A、黄 #EDA100、粉 #E87BA4、绿 #008300、紫 #4A3AA7、棕 #A8641C\n4. 金额一律用“分”为单位的整数，显示时保留两位小数、右对齐、不换行\n写完给我看。',
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
    prompt: '参考这个开源项目：https://github.com/fikriub/expense_tracker（MIT 许可证）\n先读下面这几个文件。只读，不要运行里面的任何脚本，也不要安装它的依赖：\n- https://raw.githubusercontent.com/fikriub/expense_tracker/main/expense-tracker.html（整个应用就是这一个文件：看它的页面结构、配色和交互）\n读完用三五句话告诉我：它是做什么的、分几块、外观或写法有什么特点。\n然后参考它的功能和外观，在当前文件夹里自己重新做一个简化版，不要整份复制它的代码；用到它的代码片段时，在文件开头注明出处和许可证。\n如果打不开这些链接，直接告诉我，然后只按下面的要求做。\n\n帮我做一个个人记账网页，名字叫“Ledger 记账本”。要求：\n1. 只用一个 HTML 文件（ledger.html），双击就能打开，不联网、不加载任何外部文件\n2. 数据存在浏览器的 localStorage 里，刷新不丢\n3. 功能：记一笔收入或支出（日期、描述、金额、分类）、删除、按类型和分类筛选、按日期/描述/分类/金额排序\n4. 顶部显示：当前余额、本期总收入、本期总支出\n先别写代码，先给我一份计划：页面分几块、每块放什么、数据怎么存。我确认后再写。',
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
    prompt: '参考这个开源项目：https://github.com/mardab96/ecommerce-claude-skills（MIT 许可证）\n先读下面这几个文件。只读，不要运行里面的任何脚本，也不要安装它的依赖：\n- https://raw.githubusercontent.com/mardab96/ecommerce-claude-skills/main/returns-reason-miner-ecommerce/SKILL.md（“退货原因分析”skill 原文：看它的结构）\n- https://raw.githubusercontent.com/mardab96/ecommerce-claude-skills/main/references/output-standard.md（所有 skill 共用的输出标准）\n读完用三五句话告诉我：它是做什么的、分几块、外观或写法有什么特点。\n然后参考它的功能和外观，在当前文件夹里自己重新做一个简化版，不要整份复制它的代码；用到它的代码片段时，在文件开头注明出处和许可证。\n如果打不开这些链接，直接告诉我，然后只按下面的要求做。\n\n生成一份假的退货数据 returns.csv（不要用任何真实客户信息），60 行，列：\n日期, 订单号, 商品编码, 商品名, 规格, 数量, 退货原因, 买家备注\n商品 5 种（保温杯、帆布包、蓝牙耳机、T恤、台灯），退货原因从这些里选：尺码不合适、颜色和图片不一样、质量问题、不想要了、发错货、物流太慢。\n故意让“T恤”的“尺码不合适”和“台灯”的“颜色和图片不一样”特别多。\n再生成 sales.csv：同期每个商品的销量。',
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
    prompt: '参考这个开源项目：https://github.com/dodoshell/unfaced（MIT 许可证）\n先读下面这几个文件。只读，不要运行里面的任何脚本，也不要安装它的依赖：\n- https://raw.githubusercontent.com/dodoshell/unfaced/main/catalog/hooks.md（开头钩子的规则和例子）\n- https://raw.githubusercontent.com/dodoshell/unfaced/main/catalog/scripts/09-did-you-know.md（“你知道吗”脚本结构）\n- https://raw.githubusercontent.com/dodoshell/unfaced/main/catalog/styles/01-soft-3d/STYLE.md（“黏土风”画面说明：配色、圆角、动画）\n读完用三五句话告诉我：它是做什么的、分几块、外观或写法有什么特点。\n然后参考它的功能和外观，在当前文件夹里自己重新做一个简化版，不要整份复制它的代码；用到它的代码片段时，在文件开头注明出处和许可证。\n如果打不开这些链接，直接告诉我，然后只按下面的要求做。\n\n用 reliable-research 查「猫为什么会踩奶」，找 3–4 个有可靠来源的知识点，标出处，保存为「资料.md」。查不到可靠来源的不要写。',
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
    prompt: '参考这个开源项目：https://github.com/theoms/co-work-travel-planner-claude（MIT 许可证）\n先读下面这几个文件。只读，不要运行里面的任何脚本，也不要安装它的依赖：\n- https://raw.githubusercontent.com/theoms/co-work-travel-planner-claude/main/skills/plan-trip/SKILL.md（skill 主说明）\n- https://raw.githubusercontent.com/theoms/co-work-travel-planner-claude/main/skills/plan-trip/references/itinerary-building.md（每日行程怎么排）\n- https://raw.githubusercontent.com/theoms/co-work-travel-planner-claude/main/skills/plan-trip/references/map-template.md（地图网页模板）\n读完用三五句话告诉我：它是做什么的、分几块、外观或写法有什么特点。\n然后参考它的功能和外观，在当前文件夹里自己重新做一个简化版，不要整份复制它的代码；用到它的代码片段时，在文件开头注明出处和许可证。\n如果打不开这些链接，直接告诉我，然后只按下面的要求做。\n\n在 .dsh/skills/family-trip/ 下写一个 skill。SKILL.md 的要点：\n1. 角色：一个细心的家庭旅行管家\n2. 第一条规则：每个家庭都不一样，不要假设喜好（不默认要午睡、不默认饮食偏好、不默认爱逛街）\n3. 原则：自己把事做完，不要只说“请您自己查一下”；每个推荐都写“为什么推荐它”；提前想到细节（几点关门、要不要预约、停车）\n4. 流程分四段：了解家庭 → 选目的地 → 排每日行程 → 出行清单和地图网页；各段的细节写在 references/ 里，用到时再读\n5. 开放时间、票价、预约规则必须用 reliable-research 查官方来源，标查询日期；查不到写「待核对」',
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
    prompt: '参考这个开源项目：https://github.com/micasa-dev/micasa（Apache-2.0 许可证）\n先读下面这几个文件。只读，不要运行里面的任何脚本，也不要安装它的依赖：\n- https://raw.githubusercontent.com/micasa-dev/micasa/main/README.md（功能和键盘操作）\n- https://raw.githubusercontent.com/micasa-dev/micasa/main/AGENTS.md（作者给 AI 定的规矩）\n- https://raw.githubusercontent.com/micasa-dev/micasa/main/.claude/commands/add-entity.md（“新增一种数据类型”命令）\n读完用三五句话告诉我：它是做什么的、分几块、外观或写法有什么特点。\n然后参考它的功能和外观，在当前文件夹里自己重新做一个简化版，不要整份复制它的代码；用到它的代码片段时，在文件开头注明出处和许可证。\n如果打不开这些链接，直接告诉我，然后只按下面的要求做。\n\n我要做一个家庭事务管家网页 home.html。先写 AGENTS.md，规定：\n1. 只用一个 HTML 文件，不联网、不加载外部资源；数据存 localStorage，可以导出、导入 JSON 备份\n2. 每次改动前先说要改什么，改完自己检查一遍：新增、修改、删除、刷新后保留\n3. 日期一律用 YYYY-MM-DD；金额用“分”为单位的整数\n4. 不删除任何数据之前，先弹确认',
    recipeSteps: 5,
  },
]
