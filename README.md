# Agent 小白教程：从零开始，让 AI 真的帮你干活

一份**写给零编程基础的人**的中文教程，会持续更新。

从“什么是 agent、什么是 API”讲起，一步步教你拿到 DeepSeek 的 API 钥匙、用上 [DeepSeek Harness(dsh)](https://github.com/deepseek-ai/deepseek-harness)、装好 skill 让 AI 学会新本事（做 PPT、美化 PPT、搜到靠谱资料），最后按自己的需要定制。

> 🌐 **在线阅读:https://teach.prismice.cn**
>
> 📖 **从这里开始：[第 0 章 怎么用这份教程](chapters/00-how-to-use.md)**

🟢 主线 = 不用写代码，所有人都学；🟡 选修 = 要写一点代码，跳过也不影响主线。

## 目录

### 第 0 部分 · 开始之前
- 🟢 [第 0 章 怎么用这份教程](chapters/00-how-to-use.md)
- 🟢 [第 1 章 三个必备小技能（终端、路径、文本文件）](chapters/01-basic-skills.md)

### 第一部分 · 先弄懂几个概念
- 🟢 [第 2 章 大模型和 Agent 到底是什么](chapters/02-what-is-agent.md)
- 🟢 [第 3 章 API 是什么](chapters/03-what-is-api.md)
- 🟢 [第 4 章 Harness 是什么](chapters/04-what-is-harness.md)

### 第二部分 · 拿到钥匙，接上 DeepSeek
- 🟢 [第 5 章 申请 DeepSeek API 钥匙](chapters/05-get-api-key.md)
- 🟡 [第 6 章 亲手调用一次 API](chapters/06-call-api.md)
- 🟡 [第 7 章 手写一个迷你 Agent](chapters/07-mini-agent.md)

### 第三部分 · 接入和使用 DeepSeek Harness
- 🟢 [第 8 章 安装 DSH](chapters/08-install-dsh.md)
- 🟢 [第 9 章 把钥匙填进 DSH](chapters/09-connect-key.md)
- 🟢 [第 10 章 接其他 AI：厂商渠道和自定义渠道](chapters/10-api-channels.md)
- 🟢 [第 11 章 中转站：学校网关和公开中转站](chapters/11-relay-station.md)
- 🟢 [第 12 章 让 DSH 帮你干活](chapters/12-work-with-dsh.md)
- 🟡 [第 13 章 让 DSH 自动干活](chapters/13-automation.md)

### 第四部分 · Skill（技能）：教 AI 新本事
- 🟢 [第 14 章 Skill 是什么](chapters/14-what-is-skill.md)
- 🟢 [第 15 章 安装 Skill，并确认 AI 真的会用它](chapters/15-install-skill.md)
- 🟢 [第 16 章 实战一：让 AI 帮你做 PPT](chapters/16-ppt-make.md)
- 🟢 [第 17 章 实战二：优化、美化你已有的 PPT](chapters/17-ppt-polish.md)
- 🟢 [第 18 章 实战三：让 AI 搜到靠谱资料，少说“胡话”](chapters/18-reliable-search.md)
- 🟢 [第 19 章 写你自己的第一个 Skill](chapters/19-write-skill.md)

### 第五部分 · 进阶定制
- 🟢 [第 20 章 MCP：让 AI 连上更多外部工具](chapters/20-mcp.md)
- 🟢 [第 21 章 插件和配置文件](chapters/21-plugins-config.md)
- 🟢 [第 22 章 定制你自己的 Agent](chapters/22-customize-agent.md)
- 🟡 [第 23 章 开发你的第一个插件](chapters/23-plugin-dev.md)

### 第六部分 · 实战与安全
- 🟢 [第 24 章 综合实战](chapters/24-projects.md)
- 🟢 [第 25 章 安全和花费](chapters/25-safety-cost.md)

### 附录
- [A 名词小词典](chapters/appendix-a-glossary.md)
- [B 常见报错速查](chapters/appendix-b-errors.md)
- [C 更新日志](chapters/appendix-c-changelog.md)
- [D 推荐资源](chapters/appendix-d-resources.md)

## 附带的示例

| 文件夹 | 内容 |
|---|---|
| [skills/](skills/) | 3 个可以直接安装的中文 skill:`meeting-notes`（会议纪要）、`ppt-polish`（PPT 优化规范）、`reliable-research`（靠谱调研） |
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
