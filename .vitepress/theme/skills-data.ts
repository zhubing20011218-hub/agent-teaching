// Skill 库的数据入口。网站的 Skill 库页面和“全站 skill 名可点击”都读这里。
//
// 具体的 skill 列表在 skills.json（由审查脚本生成，每条都下载过源码检查）：
//   - 格式按 DSH 的规则验证（头部信息、name、description、名字只能用小写字母数字短横线）
//   - 说明书和所有脚本都扫描过：联网、危险命令、要钥匙、“骗 AI”的话；扫出问题的逐条人工看过
//   - 只收仓库 ≥300 星、近半年有更新的；说明书按结构和内容打分，空壳、难用、太专业、依赖付费服务的不收
//   - 没有逐个实际运行
// 新增一条：在 skills.json 里加一个对象；id 要唯一（会成为网址里的 #锚点）。

import data from './skills.json'

export const CHECKED = '2026-11-17'

export type RoleKey = 'student' | 'teacher' | 'accounting' | 'ecommerce' | 'media' | 'pet' | 'travel'

export interface SkillEntry {
  id: string // 页面锚点，也是全站自动链接用的名字
  name: string // 安装后的文件夹名（DSH 里用 /name 调用）
  title: string // 中文名
  desc: string // 一句话：能帮你做什么
  cat: string // 分类 key，见 CATEGORIES
  roles?: RoleKey[]
  starter?: boolean // 新手推荐
  url: string // 源地址：GitHub 上的 skill 文件夹，或本站的 SKILL.md
  source: string // 来自哪个仓库
  hosted?: boolean // true = 本站提供下载（本教程自带）
  collection?: boolean
  license: string
  stars?: number
  script?: boolean // 带脚本
  net?: boolean // 会联网
  keys?: boolean // 需要外部账号或钥匙
  zh?: boolean // 说明是中文
  deps?: string // 需要先装的软件
  note?: string // 特别提醒
  extra?: string // 安装时要额外做的事（会写进安装指令）
  review?: string // 审查结论：说明书的结构、是否运行脚本、仓库星数
}

export const SKILLS = data as SkillEntry[]

export const CATEGORIES: { key: string; label: string; intro: string }[] = [
  { key: 'office', label: '📄 办公文档', intro: 'Word、Excel、PPT、PDF，人人都用得上' },
  { key: 'writing', label: '✍️ 写作与翻译', intro: '纪要、改写、翻译、把要求说清楚' },
  { key: 'productivity', label: '⏱️ 效率与时间管理', intro: '专注、复盘、开会、整理想法' },
  { key: 'research', label: '🔎 查证与搜索', intro: '少被 AI 编的内容坑：找原始来源、交叉核对' },
  { key: 'learning', label: '📚 学习与复习', intro: '课件变复习手册、出题自测、一对一讲解' },
  { key: 'academic', label: '🎓 学术科研', intro: '读论文、写综述、实验设计，以及各学科的工具' },
  { key: 'teaching', label: '👩‍🏫 教学', intro: '批阅作业、主持研讨、设计问卷' },
  { key: 'data', label: '📊 数据分析', intro: '统计、画图、表格处理、预测' },
  { key: 'finance', label: '🧾 财务会计', intro: '对账、月结、财务分析、预算' },
  { key: 'legal', label: '⚖️ 法律合规', intro: '合同、协议、隐私政策（多为美国、欧盟法律）' },
  { key: 'career', label: '💼 求职与人力资源', intro: '简历、模拟面试、招聘和组织' },
  { key: 'business', label: '🧭 管理与创业', intro: '战略分析、经营决策、流程和供应商' },
  { key: 'product', label: '🗂️ 产品与项目管理', intro: '需求文档、用户研究、路线图、迭代' },
  { key: 'ecommerce', label: '🛒 电商与营销', intro: '店铺诊断、亚马逊运营、广告、文案、增长' },
  { key: 'sales', label: '🤝 销售与客服', intro: '开发客户、方案报价、客户成功、模板回复' },
  { key: 'media', label: '🎬 视频与多媒体', intro: '字幕、动画视频、图片' },
  { key: 'design', label: '🎨 设计与图表', intro: '海报、流程图、网页、设计规范' },
  { key: 'life', label: '🏡 生活', intro: '宠物照护、旅行规划' },
  { key: 'dev', label: '🛠️ 编程开发', intro: '写 skill、调试、各种编程语言和框架' },
  { key: 'security', label: '🛡️ 安全', intro: '装 skill 前的安全扫描、代码安全' },
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

/** 发给 DSH 的安装指令 */
export function installPrompt(s: SkillEntry): string {
  if (s.hosted) {
    return `请帮我安装一个 skill：
下载 ${s.url}
保存为 ~/.dsh/skills/${s.name}/SKILL.md
装好后列出 ~/.dsh/skills/${s.name}/ 里的文件给我确认。`
  }
  const steps = [
    `只要这一个 skill 文件夹，放到 ~/.dsh/skills/${s.name}/，确认 SKILL.md 就在这个文件夹里，不要多套一层`,
    ...(s.extra ? [s.extra] : []),
    '安装前先告诉我：有没有脚本、会不会联网、需不需要钥匙或账号',
    '等我确认后再安装',
  ]
  return `请帮我安装这个 skill：
${s.url}

要求：
${steps.map((t, i) => `${i + 1}. ${t}`).join('\n')}`
}
