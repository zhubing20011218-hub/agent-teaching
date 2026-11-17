// Skill 库的数据。网站的 Skill 库页面和“全站 skill 名可点击”都读这一个文件。
// 收录标准：公开、许可证允许使用、看过说明和脚本、用途正当、新手能用 DSH 跑起来。
// 新增一条：复制一个对象，改字段；id 要唯一（会成为网址里的 #锚点）。
// 核对日期写在 CHECKED。

export const CHECKED = '2026-11-17'
const SITE = 'https://teach.prismice.cn/files/skills'

export type RoleKey = 'student' | 'teacher' | 'accounting' | 'ecommerce' | 'media' | 'pet' | 'travel'

export interface SkillEntry {
  id: string // 页面锚点，也是全站自动链接用的名字
  name: string // 安装后的文件夹名（DSH 里用 /name 调用）
  title: string // 中文名
  desc: string // 一句话：能帮你做什么
  cat: string // 分类 key，见 CATEGORIES
  roles?: RoleKey[]
  url: string // 源地址：GitHub 上的 skill 文件夹，或本站的 SKILL.md
  hosted?: boolean // true = 本站提供下载（本教程自带）
  collection?: boolean // 一个仓库里有好几个 skill
  license: string
  script?: boolean // 带脚本
  net?: boolean // 会联网
  zh?: boolean // 说明是中文
  note?: string // 特别提醒
}

export const CATEGORIES: { key: string; label: string; intro: string }[] = [
  { key: 'office', label: '📄 办公文档', intro: 'Word、Excel、PPT、PDF，人人都用得上' },
  { key: 'research', label: '🔎 查证与搜索', intro: '少被 AI 编的内容坑：找原始来源、交叉核对' },
  { key: 'writing', label: '✍️ 写作与翻译', intro: '纪要、改写、翻译、把要求说清楚' },
  { key: 'learning', label: '📚 学习与复习', intro: '课件变复习手册、出题自测、一对一讲解' },
  { key: 'academic', label: '🎓 学术科研', intro: '读论文、写文献综述' },
  { key: 'teaching', label: '👩‍🏫 教学', intro: '批阅作业、做学生自测' },
  { key: 'finance', label: '🧾 财务会计', intro: '对账、核对差异' },
  { key: 'career', label: '💼 求职与职场', intro: '简历、面试、合同审查' },
  { key: 'ecommerce', label: '🛒 电商与营销', intro: '商品页诊断、选品、文案' },
  { key: 'media', label: '🎬 视频与多媒体', intro: '字幕、动画视频' },
  { key: 'design', label: '🎨 设计与图表', intro: '海报、配色、网页、流程图' },
  { key: 'life', label: '🏡 生活', intro: '宠物照护、旅行规划' },
  { key: 'dev', label: '🛠️ 做 skill 和编程', intro: '写自己的 skill、调试代码、让 AI 用浏览器' },
]

export const ROLES: { key: RoleKey; label: string }[] = [
  { key: 'student', label: '🎓 大学生' },
  { key: 'teacher', label: '👩‍🏫 大学老师' },
  { key: 'accounting', label: '🧾 会计' },
  { key: 'ecommerce', label: '🛒 电商' },
  { key: 'media', label: '🎬 自媒体' },
  { key: 'pet', label: '🐾 宠物主人' },
  { key: 'travel', label: '✈️ 旅行' },
]

const A = 'https://github.com/anthropics/skills/tree/main/skills'
const ALL: RoleKey[] = ['student', 'teacher', 'accounting', 'ecommerce', 'media', 'pet', 'travel']

export const SKILLS: SkillEntry[] = [
  // 办公文档
  { id: 'docx', name: 'docx', title: 'Word 文档', desc: '新建、修改 Word：报告、通知、讲义、合同模板', cat: 'office', roles: ['student', 'teacher', 'accounting'], url: `${A}/docx`, license: 'Apache-2.0', script: true },
  { id: 'xlsx', name: 'xlsx', title: 'Excel 表格', desc: '读、整理、计算 Excel 和 CSV，保留公式和格式，用程序算数不心算', cat: 'office', roles: ALL, url: `${A}/xlsx`, license: 'Apache-2.0', script: true },
  { id: 'pptx', name: 'pptx', title: 'PPT 制作', desc: '做 PPT、改 PPT（第 13 章专门讲）', cat: 'office', roles: ['student', 'teacher', 'ecommerce'], url: `${A}/pptx`, license: 'Apache-2.0', script: true, note: '你电脑上如果有旧版 pptx skill，许可证可能是早期的专有许可，建议换成这个新版' },
  { id: 'pdf', name: 'pdf', title: 'PDF 处理', desc: '读 PDF 里的文字和表格，合并、拆分 PDF，填 PDF 表单', cat: 'office', roles: ['student', 'teacher', 'accounting'], url: `${A}/pdf`, license: 'Apache-2.0', script: true },
  { id: 'ppt-polish', name: 'ppt-polish', title: 'PPT 美化检查（本教程自带）', desc: '检查并美化已有的 PPT：对齐、字号、配色、每页一个重点', cat: 'office', roles: ['student', 'teacher'], url: `${SITE}/ppt-polish/SKILL.md`, hosted: true, license: 'CC BY-NC-SA 4.0', zh: true },
  { id: 'theme-factory', name: 'theme-factory', title: '配色主题', desc: '给 PPT、文档、网页统一配色和字体，自带 10 套主题', cat: 'office', url: `${A}/theme-factory`, license: 'Apache-2.0' },

  // 查证与搜索
  { id: 'reliable-research', name: 'reliable-research', title: '靠谱搜索（本教程自带）', desc: '优先找原始来源，标出处，分清“查到的”和“推测的”，查不到就说查不到', cat: 'research', roles: ALL, url: `${SITE}/reliable-research/SKILL.md`, hosted: true, license: 'CC BY-NC-SA 4.0', zh: true },
  { id: 'fact-check', name: 'fact-check', title: '事实核查（DSH 专用）', desc: '为 DSH 写的事实核查：把问题拆开，多个来源交叉核对，标出可信度', cat: 'research', roles: ['student', 'teacher', 'media'], url: 'https://github.com/7starsseeker/dsh-fact-check', license: 'MIT', script: true, net: true, zh: true },
  { id: 'fact-check-skill', name: 'fact-check-skill', title: '新闻核查', desc: '核查新闻和社交媒体上的说法，识别虚假信息', cat: 'research', roles: ['media'], url: 'https://github.com/petar-nauka/fact-check-skill', license: 'MIT', script: true },
  { id: 'discernment-nudge', name: 'discernment-nudge', title: '提醒你核对', desc: 'AI 给出建议或数据后，自动追加 2–3 个“你该核对什么”的问题', cat: 'research', roles: ALL, url: `${A}/discernment-nudge`, license: 'Apache-2.0' },

  // 写作与翻译
  { id: 'meeting-notes', name: 'meeting-notes', title: '会议纪要（本教程自带）', desc: '把零散记录整理成会议纪要：结论、待办、负责人', cat: 'writing', roles: ['student', 'teacher', 'accounting', 'ecommerce'], url: `${SITE}/meeting-notes/SKILL.md`, hosted: true, license: 'CC BY-NC-SA 4.0', zh: true },
  { id: 'qu-ai-wei', name: 'qu-ai-wei', title: '去 AI 味', desc: '把生硬的中文改自然，保留原来的事实和意思', cat: 'writing', roles: ['ecommerce', 'media'], url: 'https://github.com/LifelongLazyLearner/qu-ai-wei', license: 'MIT', script: true, zh: true, note: '只用来改你自己的文字风格。要求独立完成的作业、论文，不能用它“去痕迹”' },
  { id: 'en-zh-max', name: 'en-zh-max', title: '英译汉', desc: '英文翻成通顺的中文，按翻译方法逐步处理', cat: 'writing', roles: ['student', 'teacher', 'media'], url: 'https://github.com/3060226349kk-cmd/en-zh-max', license: 'MIT', script: true, zh: true },
  { id: 'prompt-master', name: 'prompt-master', title: '把要求说清楚', desc: '帮你把“想让 AI 做的事”写成更清楚的指令', cat: 'writing', roles: ALL, url: 'https://github.com/nidhinjs/prompt-master', license: 'MIT' },
  { id: 'internal-comms', name: 'internal-comms', title: '工作通知和周报', desc: '按固定格式写工作通知、周报、项目进展', cat: 'writing', roles: ['teacher', 'accounting', 'ecommerce'], url: `${A}/internal-comms`, license: 'Apache-2.0' },

  // 学习与复习
  { id: 'lecture-notes', name: 'lecture-notes', title: '课件变复习手册', desc: '把课件整理成复习手册：概念讲解、准确定义、例题完整解答', cat: 'learning', roles: ['student', 'teacher'], url: 'https://github.com/SaB11F/lecture-notes-skill/tree/main/skills/lecture-notes', license: 'MIT', script: true, note: '说明是英文，可以要求它输出中文' },
  { id: 'quiz-generator', name: 'quiz-generator', title: '自测网页', desc: '把题目做成离线自测网页：答题卡、错题本、随机抽题，不收集任何信息', cat: 'learning', roles: ['student', 'teacher'], url: 'https://github.com/fall-dust/quiz-generator-skill', license: 'MIT', script: true, net: true, zh: true },
  { id: 'learning-tutor', name: 'learning-tutor', title: '一对一自学老师', desc: '想系统学一样东西：先定计划，再一课一课教，布置小任务并批改', cat: 'learning', roles: ['student'], url: 'https://github.com/MyLiya46/learning-tutor/tree/main/skills/learning-tutor', license: 'MIT', zh: true },
  { id: 'teacher', name: 'teacher', title: 'AI 讲解老师', desc: '把课本、讲义交给它，先判断你的水平，再一步步讲懂', cat: 'learning', roles: ['student'], url: 'https://github.com/chentao326/teacher-skill', license: 'MIT', script: true, net: true, zh: true },
  { id: 'anki', name: 'anki', title: 'Anki 记忆卡片', desc: '把知识点做成 Anki 记忆卡片（需要先装 Anki）', cat: 'learning', roles: ['student'], url: 'https://github.com/loftiskg/anki-claude-code-skill/tree/main/.claude/skills/anki', license: 'MIT' },

  // 学术科研
  { id: 'sunzi-reading', name: 'sunzi-reading', title: '论文讲人话', desc: '用大白话讲论文：想解决什么、怎么做的、发现了什么，适合第一次读', cat: 'academic', roles: ['student', 'teacher'], url: 'https://github.com/julilaoshi/sunzi-reading/tree/main/skill', license: 'MIT', zh: true },
  { id: 'paper-reading', name: 'paper-reading', title: '论文精读笔记', desc: '精读论文，生成中文阅读笔记：主线、方法、图表、公式', cat: 'academic', roles: ['student', 'teacher'], url: 'https://github.com/Kingslayer-bot/paper-reading-skill', license: 'MIT', script: true, net: true, zh: true },
  { id: 'literature-review-skills', name: 'literature-review-skills', title: '文献综述（6 个）', desc: '收窄题目、拆分结构、比较研究方法、梳理矛盾、找研究空白', cat: 'academic', roles: ['student', 'teacher'], url: 'https://github.com/xingtaxueshu/literature-review-skills', collection: true, license: 'MIT', script: true, zh: true, note: '帮你理清思路和找资料；写进论文要用你自己的话，按规范引用' },

  // 教学
  { id: 'rubric-feedback', name: 'rubric-feedback', title: '按评分标准写反馈（本教程自带）', desc: '逐项给建议档位、引用学生原文作证据、写反馈草稿，分数由老师定', cat: 'teaching', roles: ['teacher'], url: `${SITE}/rubric-feedback/SKILL.md`, hosted: true, license: 'CC BY-NC-SA 4.0', zh: true },

  // 财务会计
  { id: 'fcs-reconcile', name: 'fcs-reconcile', title: '对账', desc: '银行流水对台账，找差异，出复核底稿；金额比对由本地程序完成，原始明细不发给 AI', cat: 'finance', roles: ['accounting'], url: 'https://github.com/cxtx/finance-copilot-skills/tree/main/skills/fcs-reconcile', license: 'MIT', script: true, zh: true },
  { id: 'paypal-stripe-reconciliation', name: 'paypal-stripe-reconciliation', title: '跨境收款对账', desc: 'PayPal、Stripe 的结算和银行到账对上', cat: 'finance', roles: ['accounting', 'ecommerce'], url: 'https://github.com/fengyiqicoder/paypal-stripe-reconciliation', license: 'MIT' },

  // 求职与职场
  { id: 'resume-builder', name: 'resume-builder', title: '简历制作', desc: '先采访你的经历，再写简历、排版', cat: 'career', roles: ['student'], url: 'https://github.com/StoneLL1/resume-builder', license: 'MIT', script: true, net: true, zh: true, note: '简历里只写真实经历' },
  { id: 'interview-prep-skills', name: 'interview-prep-skills', title: '模拟面试（5 个）', desc: '按你的简历出面试题、模拟追问；有前端、后端、AI 开发岗位版本', cat: 'career', roles: ['student'], url: 'https://github.com/Hazenix/interview-prep-skills', collection: true, license: 'MIT', zh: true },
  { id: 'easy-job-tutor', name: 'easy-job-tutor', title: '岗位分析和简历优化', desc: '分析招聘要求，对照优化简历，生成 PDF 简历', cat: 'career', roles: ['student'], url: 'https://github.com/yicLionel/Easy-Job-Tutor', license: 'Apache-2.0', script: true, net: true, zh: true },
  { id: 'claude-legal-skill', name: 'claude-legal-skill', title: '合同审查', desc: '逐条看合同风险，给出修改建议（英文）', cat: 'career', roles: ['ecommerce'], url: 'https://github.com/evolsb/claude-legal-skill', license: 'MIT', note: '只能帮你先看一遍，不能代替律师。文件名是小写的 skill.md，安装时改成 SKILL.md' },

  // 电商与营销
  { id: 'ecommerce-claude-skills', name: 'ecommerce-claude-skills', title: '电商运营（20 个）', desc: '商品页诊断、促销复盘、库存风险、利润核算，用你导出的表格分析，不连店铺后台', cat: 'ecommerce', roles: ['ecommerce'], url: 'https://github.com/mardab96/ecommerce-claude-skills', collection: true, license: 'MIT', script: true, note: '合集，挑一两个最常用的文件夹装，不要整包装' },
  { id: 'amazon-skills', name: 'amazon-skills', title: '亚马逊运营（7 个）', desc: '选品、Listing 健康检查、搜索词分析', cat: 'ecommerce', roles: ['ecommerce'], url: 'https://github.com/zach22-1999/amazon-skills', collection: true, license: 'MIT', script: true, net: true, zh: true, note: '会抓取网页，先确认不违反平台规则' },
  { id: 'copywriting', name: 'copywriting', title: '营销文案', desc: '写落地页、商品介绍等营销文案（英文，可要求输出中文）', cat: 'ecommerce', roles: ['ecommerce', 'media'], url: 'https://github.com/coreyhaines31/marketingskills/tree/main/skills/copywriting', license: 'MIT' },

  // 视频与多媒体
  { id: 'video-subtitle', name: 'video-subtitle', title: '视频加字幕', desc: '本地语音识别生成字幕，再烧录进视频（需要装 ffmpeg 和 Whisper）', cat: 'media', roles: ['media', 'teacher'], url: 'https://github.com/Tofuswang/video-subtitle-skill/tree/main/skills/video-subtitle', license: 'MIT' },
  { id: 'remotion-motion-graphics', name: 'remotion-motion-graphics', title: '代码做动画视频', desc: '片头、文字动画、数据图表动画', cat: 'media', roles: ['media'], url: 'https://github.com/haidrrrry/claude-remotion-skill', license: 'MIT', script: true },

  // 设计与图表
  { id: 'canvas-design', name: 'canvas-design', title: '海报和封面', desc: '做海报、封面、宣传图，输出 PNG 或 PDF', cat: 'design', roles: ['media', 'ecommerce', 'teacher'], url: `${A}/canvas-design`, license: 'Apache-2.0' },
  { id: 'excalidraw', name: 'excalidraw', title: '流程图和示意图', desc: '画可以继续编辑的手绘风流程图、结构图', cat: 'design', roles: ['student', 'teacher'], url: 'https://github.com/fabricioartur/codex-excalidraw-skill/tree/main/skill', license: 'MIT', script: true, net: true },
  { id: 'frontend-design', name: 'frontend-design', title: '好看的网页', desc: '做网页时避免“一看就是 AI 做的”模板感', cat: 'design', url: `${A}/frontend-design`, license: 'Apache-2.0' },
  { id: 'algorithmic-art', name: 'algorithmic-art', title: '代码生成艺术', desc: '用代码画出可调参数的生成艺术作品', cat: 'design', url: `${A}/algorithmic-art`, license: 'Apache-2.0', script: true },

  // 生活
  { id: 'pet-care-log', name: 'pet-care-log', title: '宠物照护记录（本教程自带）', desc: '记录喂养、疫苗、驱虫、体重、看病，提醒下次该做什么', cat: 'life', roles: ['pet'], url: `${SITE}/pet-care-log/SKILL.md`, hosted: true, license: 'CC BY-NC-SA 4.0', zh: true },
  { id: 'travel-itinerary', name: 'travel-itinerary', title: '顺路行程和手机行程页', desc: '根据目的地、航班、酒店排顺路行程，做成手机能看的网页', cat: 'life', roles: ['travel'], url: 'https://github.com/linyoungjiang0617-stack/travel-itinerary-skill/tree/main/travel-itinerary', license: 'MIT', zh: true },
  { id: 'travel-planning-skill', name: 'travel-planning-skill', title: '先问清楚再规划', desc: '先确认需求，再给路线图和按小时排的每日安排', cat: 'life', roles: ['travel'], url: 'https://github.com/618034128/Travel-Planning-Skill', license: 'MIT', script: true, net: true },
  { id: 'lele', name: 'lele', title: '一问一答做行程', desc: '一问一答问细了，再出完整的行程文档（英文）', cat: 'life', roles: ['travel'], url: 'https://github.com/eazhou99/lele-skill', license: 'MIT' },

  // 做 skill 和编程
  { id: 'skill-creator', name: 'skill-creator', title: '写 skill 的助手', desc: '一问一答帮你写 skill，还能测试它好不好用（第 16 章用得上）', cat: 'dev', roles: ALL, url: `${A}/skill-creator`, license: 'Apache-2.0', script: true },
  { id: 'systematic-debugging', name: 'systematic-debugging', title: '一步步找 bug', desc: '程序出错时，先复现、再缩小范围、再修，不乱改', cat: 'dev', url: 'https://github.com/obra/superpowers/tree/main/skills/systematic-debugging', license: 'MIT' },
  { id: 'dev-browser', name: 'dev-browser', title: '让 AI 用浏览器', desc: '让 AI 打开网页、点按钮、截图，检查你做的网页', cat: 'dev', url: 'https://github.com/SawyerHood/dev-browser/tree/main/skills/dev-browser', license: 'MIT', script: true, net: true },
  { id: 'mcp-builder', name: 'mcp-builder', title: '做 MCP 工具', desc: '指导你写一个 MCP 服务，让 AI 连上新的工具（第 18 章之后再看）', cat: 'dev', url: `${A}/mcp-builder`, license: 'Apache-2.0', script: true },
  { id: 'webapp-testing', name: 'webapp-testing', title: '测试网页', desc: '自动打开你做的网页并测试功能', cat: 'dev', url: `${A}/webapp-testing`, license: 'Apache-2.0', script: true },
]

/** 发给 DSH 的安装指令 */
export function installPrompt(s: SkillEntry): string {
  if (s.hosted) {
    return `请帮我安装一个 skill：
下载 ${s.url}
保存为 ~/.dsh/skills/${s.name}/SKILL.md
装好后列出 ~/.dsh/skills/${s.name}/ 里的文件给我确认。`
  }
  if (s.collection) {
    return `这是一个 skill 合集：
${s.url}

请先列出里面有哪些 skill、各自做什么，以及有没有脚本、会不会联网、需不需要钥匙。
等我选好要哪几个，再把选中的每个 skill 文件夹分别放到 ~/.dsh/skills/<skill 名字>/，确认 SKILL.md 就在文件夹里，不要多套一层。`
  }
  return `请帮我安装这个 skill：
${s.url}

要求：
1. 只要这一个 skill 文件夹，放到 ~/.dsh/skills/${s.name}/，确认 SKILL.md 就在这个文件夹里，不要多套一层
2. 安装前先告诉我：有没有脚本、会不会联网、需不需要钥匙
3. 等我确认后再安装`
}
