---
title: 通用 Skill：人人用得上
part: Skill 库
last_checked: 2026-11-17
---

# 通用 Skill：人人用得上

> **不管你是什么身份，先装这几个。** 它们解决的是每个人都会遇到的事：处理文件、查证资料、把话说清楚。
>
> 标记说明：📄 纯说明 · ⚙️ 带脚本 · 🌐 会联网 · 🇨🇳 中文。怎么装见「[怎么用这个 Skill 库](./)」。

## 1. 办公文件四件套（官方出品，推荐）

Anthropic 官方仓库 [anthropics/skills](https://github.com/anthropics/skills) 里的四个 skill，许可证都是 **Apache 2.0**。

| Skill | 能帮你做什么 | 标记 | 链接 |
|---|---|---|---|
| `docx` | 新建、修改 Word 文档：报告、通知、教案、合同模板 | ⚙️ | [打开](https://github.com/anthropics/skills/tree/main/skills/docx) |
| `xlsx` | 读、整理、计算 Excel 和 CSV 表格，保留公式和格式 | ⚙️ | [打开](https://github.com/anthropics/skills/tree/main/skills/xlsx) |
| `pptx` | 做 PPT、改 PPT（教程第 16、17 章专门讲） | ⚙️ | [打开](https://github.com/anthropics/skills/tree/main/skills/pptx) |
| `pdf` | 读 PDF 里的文字和表格，合并、拆分 PDF，填 PDF 表单 | ⚙️ | [打开](https://github.com/anthropics/skills/tree/main/skills/pdf) |

**为什么带脚本还推荐？** 这几个是官方维护的，脚本只用来读写你的文件。第一次用时，AI 可能要安装 Python 的库，它请求运行命令时看一眼再允许。

> [!TIP]
> 你电脑上如果有旧版的 `pptx` skill，许可证可能还是早期的专有许可。建议换成上面链接里的新版。

## 2. 不被 AI 骗：查证和核对

AI 会编造内容，网上也有很多 AI 生成的“噪音”。这一组 skill 帮你**把关**。

| Skill | 能帮你做什么 | 标记 | 链接 |
|---|---|---|---|
| `reliable-research`（本教程自带） | 搜资料时优先找原始来源，标明出处，分清“查到的”和“推测的” | 📄 🇨🇳 | [打开](https://github.com/zhubing20011218-hub/agent-teaching/tree/main/skills/reliable-research) |
| `fact-check`（dsh-fact-check） | 专为 DSH 写的事实核查：把问题拆开，多个来源交叉核对，标出可信度 | ⚙️ 🌐 🇨🇳 | [打开](https://github.com/7starsseeker/dsh-fact-check) |
| `discernment-nudge`（官方） | AI 给出建议或数据后，自动追加 2–3 个“你该核对什么”的问题 | 📄 | [打开](https://github.com/anthropics/skills/tree/main/skills/discernment-nudge) |
| `fact-check-skill` | 核查新闻、社交媒体上的说法，识别虚假信息（英文） | ⚙️ | [打开](https://github.com/petar-nauka/fact-check-skill) |

教程第 18 章讲了怎么用 `reliable-research`。

## 3. 说清楚、写清楚

| Skill | 能帮你做什么 | 标记 | 链接 |
|---|---|---|---|
| `meeting-notes`（本教程自带） | 把零散的记录整理成会议纪要：结论、待办、负责人 | 📄 🇨🇳 | [打开](https://github.com/zhubing20011218-hub/agent-teaching/tree/main/skills/meeting-notes) |
| `qu-ai-wei`（去 AI 味） | 把 AI 写得生硬的中文改自然，**保留原来的事实和意思** | ⚙️ 🇨🇳 | [打开](https://github.com/LifelongLazyLearner/qu-ai-wei) |
| `prompt-master` | 帮你把“想让 AI 做的事”写成更清楚的指令 | 📄 | [打开](https://github.com/nidhinjs/prompt-master) |

> [!WARNING]
> **“去 AI 味”只用来改你自己的文字风格。** 作业、论文、考试要求独立完成的，用 AI 写完再“去 AI 味”冒充自己写的，属于学术不端。详见「[不推荐的 Skill](avoid)」。

## 4. 做图、配色

| Skill | 能帮你做什么 | 标记 | 链接 |
|---|---|---|---|
| `canvas-design`（官方） | 做海报、宣传图，输出 PNG 或 PDF | ⚙️ | [打开](https://github.com/anthropics/skills/tree/main/skills/canvas-design) |
| `theme-factory`（官方） | 给 PPT、文档、网页统一配色和字体，自带 10 套主题 | 📄 | [打开](https://github.com/anthropics/skills/tree/main/skills/theme-factory) |
| `ppt-polish`（本教程自带） | 检查并美化已有的 PPT：对齐、字号、配色、每页一个重点 | 📄 🇨🇳 | [打开](https://github.com/zhubing20011218-hub/agent-teaching/tree/main/skills/ppt-polish) |

## 5. 做你自己的 skill

| Skill | 能帮你做什么 | 标记 | 链接 |
|---|---|---|---|
| `skill-creator`（官方） | 一问一答帮你写 skill，还能测试它好不好用 | ⚙️ | [打开](https://github.com/anthropics/skills/tree/main/skills/skill-creator) |

教程第 19 章教你从零写一个。用熟了，再用 `skill-creator` 提速。

## 6. 推荐的安装顺序

不要一次全装。装得越多，AI 越容易挑错说明书。

1. **第一周**：`xlsx`、`docx`、`reliable-research`
2. **需要做 PPT 时**：`pptx`、`ppt-polish`
3. **经常写东西时**：`meeting-notes`、`qu-ai-wei`
4. **熟练以后**：`skill-creator`，开始写你自己的

然后去「[按身份找 Skill](by-role)」，挑一两个和你工作对口的。
