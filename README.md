# Agent 上手指南：从零开始，让 AI 真的帮你干活

一份**写给零编程基础的人**的中文教程，会持续更新。

从“什么是 agent、什么是 API”讲起，一步步教你拿到 DeepSeek 的 API 钥匙、用上 [DeepSeek Harness(dsh)](https://github.com/deepseek-ai/deepseek-harness)、装好 skill 让 AI 学会新本事（做 PPT、美化 PPT、搜到靠谱资料），最后按自己的需要定制。

> 🌐 **在线阅读:https://teach.prismice.cn**
>
> 📖 **从这里开始：[第 0 章 怎么用这份教程](chapters/00-how-to-use.md)**

🟢 主线 = 不用写代码，所有人都学；🟡 选修 = 要写一点代码，跳过也不影响主线。

## 目录

### 入门篇 · 认识 AI
- 🟢 [第 0 章 怎么用这份教程](chapters/00-how-to-use.md)
- 🟢 [第 1 章 四个必备小技能](chapters/01-basic-skills.md)
- 🟢 [第 2 章 大模型和 Agent 到底是什么](chapters/02-what-is-agent.md)
- 🟢 [第 3 章 API 是什么](chapters/03-what-is-api.md)
- 🟢 [第 4 章 Harness 是什么](chapters/04-what-is-harness.md)
- ✍️ [入门篇实操题](chapters/practice-1.md)

### 基础篇 · 接上 AI
- 🟢 [第 5 章 申请 DeepSeek API 钥匙](chapters/05-get-api-key.md)
- 🟢 [第 6 章 安装 DSH](chapters/06-install-dsh.md)
- 🟢 [第 7 章 把钥匙填进 DSH](chapters/07-connect-key.md)
- 🟢 [第 8 章 接其他 AI：厂商渠道和自定义渠道](chapters/08-api-channels.md)
- 🟢 [第 9 章 中转站：学校网关和公开中转站](chapters/09-relay-station.md)
- 🟢 [第 10 章 让 DSH 帮你干活](chapters/10-work-with-dsh.md)
- ✍️ [基础篇实操题](chapters/practice-2.md)

### 进阶篇 · 用 Skill 教 AI 新本事
- 🟢 [第 11 章 Skill 是什么](chapters/11-what-is-skill.md)
- 🟢 [第 12 章 安装 Skill，并确认 AI 真的会用它](chapters/12-install-skill.md)
- 🟢 [第 13 章 实战一：让 AI 帮你做 PPT](chapters/13-ppt-make.md)
- 🟢 [第 14 章 实战二：优化、美化你已有的 PPT](chapters/14-ppt-polish.md)
- 🟢 [第 15 章 实战三：让 AI 搜到靠谱资料，少说“胡话”](chapters/15-reliable-search.md)
- 🟢 [第 16 章 写你自己的第一个 Skill](chapters/16-write-skill.md)
- ✍️ [进阶篇实操题](chapters/practice-3.md)

### 高级篇 · 自动化和定制
- 🟢 [第 17 章 让 DSH 自动干活](chapters/17-automation.md)
- 🟢 [第 18 章 MCP：让 AI 连上更多外部工具](chapters/18-mcp.md)
- 🟢 [第 19 章 插件和配置文件](chapters/19-plugins-config.md)
- 🟢 [第 20 章 定制你自己的 Agent](chapters/20-customize-agent.md)
- ✍️ [高级篇实操题](chapters/practice-4.md)

### 实战篇 · 综合运用
- 🟢 [第 21 章 综合实战](chapters/21-projects.md)
- 🟢 [第 22 章 安全和花费](chapters/22-safety-cost.md)
- ✍️ [实战篇实操题](chapters/practice-5.md)

### 选修 · 写一点代码
- 🟡 [第 23 章 亲手调用一次 API](chapters/23-call-api.md)
- 🟡 [第 24 章 手写一个迷你 Agent](chapters/24-mini-agent.md)
- 🟡 [第 25 章 开发你的第一个插件](chapters/25-plugin-dev.md)

### 附录
- [A 名词小词典](chapters/appendix-a-glossary.md)
- [B 常见报错速查](chapters/appendix-b-errors.md)
- [C 更新日志](chapters/appendix-c-changelog.md)
- [D 推荐资源](chapters/appendix-d-resources.md)

## 按身份学（7 套实操流程）

认识 AI 只是开始，用起来才有用。每个身份一套从头到尾的流程：

- [🎓 大学生](roles/student.md)：课件变复习手册和自测网页；读懂一篇论文
- [👩‍🏫 大学老师](roles/teacher.md)：一周的课程包：课件、阅读导读、自测网页、作业反馈草稿
- [🧾 会计 / 财务](roles/accounting.md)：银行流水对账（假数据练习）
- [🛒 电商运营](roles/ecommerce.md)：新品上架包
- [🎬 自媒体 / 剪辑](roles/media.md)：60 秒短视频
- [🐾 宠物主人](roles/pet.md)：照护档案和自动提醒
- [✈️ 旅行爱好者](roles/travel.md)：3 天行程

## Skill 库

GitHub 上公开、许可证允许、看过内容的 skill,分[通用](skill-hub/general.md)和[按身份](skill-hub/by-role.md)两类，另有[安装前的安全检查](skill-hub/safety-check.md)和[不推荐的 Skill](skill-hub/avoid.md)。

## 学创 AI

网站每一页右下角的机器人向导：边打字边搜全站、按回车由 AI 根据本站内容回答、划词提问和反馈、读完一页问一句“看懂了吗”。读者介绍见 [xuechuang.md](xuechuang.md)，维护说明(开启 AI、看反馈、隐私)见 [docs/elf.md](docs/elf.md)。

## 附带的示例

| 文件夹 | 内容 |
|---|---|
| [skills/](skills/) | 5 个可以直接安装的中文 skill:`meeting-notes`（会议纪要）、`ppt-polish`（PPT 优化规范）、`reliable-research`（靠谱调研）、`pet-care-log`（宠物照护记录）、`rubric-feedback`（按评分标准写作业反馈） |
| [examples/](examples/) | 🟡 选修章的 Python 示例：命令行聊天、迷你 Agent |

## 关于“持续更新”

DeepSeek Harness 还在快速更新（写作时是 0.2.2 预发布版）。所以：

- 每章开头写明**用哪个版本核对过**、**哪天核对的**
- 容易变的界面细节，都附上官方文档链接
- 版本变化对教程的影响，记在[附录 C 更新日志](chapters/appendix-c-changelog.md)

如果你发现某一步和你看到的画面不一样，欢迎提 Issue。

## 其他文档

- 📑 大纲：[OUTLINE.md](OUTLINE.md)
- ✍️ 写作规范：[docs/writing-guide.md](docs/writing-guide.md)
- 🔍 写作前的 GitHub 调研：[docs/research/2026-11-17-github-survey.md](docs/research/2026-11-17-github-survey.md)

## 许可证

本教程内容采用 [CC BY-NC-SA 4.0](LICENSE) 许可：可以免费分享和改编，但要**注明出处**、**不能用于商业用途**，改编后的作品要用**相同许可**发布。

教程里提到的第三方 skill、工具，版权归原作者，以各自仓库的许可证为准。
