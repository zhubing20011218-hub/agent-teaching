# GitHub 相关项目调研(2026-11-17)

> 目的:写教程之前先看看别人已经做了什么,避免重复造轮子,并找出我们能做出差异的地方。
> 方法:`gh search repos` 按关键词搜索 + 读各仓库 README / 目录。星数为调研当天数据。

## 1. 先把名字弄清楚:"DeepSeek Harness" 是什么

- 官方仓库:[deepseek-ai/deepseek-harness](https://github.com/deepseek-ai/deepseek-harness)(MIT,约 28.2 万星,口号「Everything is a Plugin」)
- 命令行叫 `dsh`,npm 包 `@deepseek-ai/dsh`。调研时最新版 **0.2.2-rc.3**(2026-11-13 发布;rc = 预发布版,说明还在快速变化,一周发了两个版本)。
- 它是一个 **agent 运行框架(harness)**:把 DeepSeek 等大模型包起来,给它加上工具(读写文件、跑命令、上网)、循环、权限审批、会话保存、skill、MCP、插件等。
- 同类产品:Claude Code、OpenAI Codex、OpenCode。理解了一个,其他都相通。

### 官方文档里对教程最有用的部分

| 位置 | 内容 | 用在我们教程哪里 |
|---|---|---|
| `docs/user/guide/index.zh.md` | 快速上手:启动 Web UI、配置模型、选工作区、跑第一个任务 | 第 7–9 章 |
| `docs/user/guide/providers.zh.md` | 配置 DeepSeek key、第三方提供商、自定义 OpenAI 兼容端点(中转站) | 第 8 章 |
| `docs/user/guide/mcp-memory.zh.md`、`schedule.zh.md`、`python-sdk.zh.md`、`plugin-market.zh.md` | MCP、定时任务、Python SDK、插件市场 | 第 10、14、15 章 |
| `docs/user/develop/basic/`(tool / config / publish) | 写第一个插件、加工具、发布 | 第 16 章 |
| `packages/skill/skill-filesystem/README.zh.md` | skill 格式与扫描目录优先级 | 第 11–13 章 |
| `docs/cookbook/` | 加工具、加 LLM 适配器等进阶配方 | 第 16–17 章 |
| `apps/cli/README.zh.md` | `dsh web` / `headless` / `sdk` / `acp` 各种启动模式 | 第 10 章 |

关键事实(写教程时要用到):
- 最简单的启动方式:装好 Node.js 后运行 `npx @deepseek-ai/dsh web`,浏览器会自动打开 `http://127.0.0.1:3080`。
- 配置 key:Web UI 里「设置 → 模型」填 DeepSeek API 密钥,存在 `$DSH_HOME/.credentials.yaml`(默认 `~/.dsh/`),页面只显示脱敏版本。
- 自定义提供商支持 4 种协议:OpenAI Chat Completions / OpenAI Responses / Anthropic Messages / Gemini API。
- Skill 格式:`<name>/SKILL.md` 或平铺 `<name>.md`,YAML 头必填 `name`、`description`;扫描目录有优先级,项目级 `<项目>/.dsh/skills` 排第一,用户级 `~/.dsh/skills` 也会加载。**和 Claude Code 的 skill 格式基本一致,可以互通。**

## 2. DSH 社区教程(直接竞品)

| 仓库 | 星 | 定位 | 评价 |
|---|---|---|---|
| [ht426/deepseek-harness-tutorial](https://github.com/ht426/deepseek-harness-tutorial) | 324 | 中文,14 章 + 零基础导读,**源码/架构向**(Cordis 框架、agent 循环、各 packages) | 质量最高的社区教程,但面向**插件开发者/读源码的人**,要求会 TypeScript。新手入门门槛高。 |
| [xbsheng/deepseek-harness-tutorial](https://github.com/xbsheng/deepseek-harness-tutorial) | 12 | 「从零实现 mini-dsh」,12 章,自己写一个简化版 harness | 很适合做我们「进阶:理解原理」的参考 |
| [dataphany/deepseek-harness-tutorial](https://github.com/dataphany/deepseek-harness-tutorial) | 1 | 中英双语,安装 + 界面使用,含配图(GPL-3.0) | 偏操作手册,覆盖安装/更新/迁移目录,内容浅 |
| [sandbaseai/dsh101](https://github.com/sandbaseai/dsh101) | 1 | 双语教程网站(8 月后没更新) | 已停更 |
| [jigangbo/deepseek-harness-tutorial](https://github.com/jigangbo/deepseek-harness-tutorial) | 0 | AI 生成的架构教程 | 参考价值低 |

**结论:社区里缺的正是"零基础 → 会用 → 会定制"这条线。** 现有教程要么只讲装软件点按钮,要么一上来就讲源码。我们的教程卡在中间这个空位上。

## 3. 通用 Agent 教程(可借鉴结构,不绑定 DSH)

| 仓库 | 星 | 可借鉴的地方 |
|---|---|---|
| [datawhalechina/hello-agents](https://github.com/datawhalechina/hello-agents) | 8.7 万 | 中文《从零开始构建智能体》,16 章五大部分(概念 → 动手 ReAct → 记忆/上下文/MCP → 综合案例 → 毕业设计)。**章节节奏最值得参考。** |
| [microsoft/ai-agents-for-beginners](https://github.com/microsoft/ai-agents-for-beginners) | 8 万 | 18 课,每课「概念 + 代码 + 练习」的固定格式,有多语言翻译。**每章模板值得参考。** |
| [Shubhamsaboo/awesome-llm-apps](https://github.com/Shubhamsaboo/awesome-llm-apps) | 14.5 万 | 100+ 实战案例,可做「实战项目」章的灵感库 |

## 4. Skill 相关

| 仓库 | 星 | 用途 |
|---|---|---|
| [anthropics/skills](https://github.com/anthropics/skills) | 19.6 万 | Agent Skills 官方示例,SKILL.md 格式的源头 |
| [obra/superpowers](https://github.com/obra/superpowers) | 31.9 万 | 最流行的 skill 套装(brainstorming、systematic-debugging 等常用 skill 都来自它) |
| [addyosmani/agent-skills](https://github.com/addyosmani/agent-skills) | 11.8 万 | 工程类 skill |
| [ComposioHQ/awesome-claude-skills](https://github.com/ComposioHQ/awesome-claude-skills) | 8 万 | skill 合集索引 |
| DSH 官方仓库 `.agents/skills/` | — | 官方自己维护项目用的 14 个 skill(代码审查、写文档、性能等),是「真实项目怎么用 skill」的好例子 |

## 5. DSH 生态工具(教程里可以提一下)

| 仓库 | 星 | 说明 |
|---|---|---|
| [awesome-dsh-plugin/awesome-dsh-plugin](https://github.com/awesome-dsh-plugin/awesome-dsh-plugin) | 2.5 万 | DSH 插件精选列表 |
| [dsh-market/dsh-market](https://github.com/dsh-market/dsh-market) | 1.2 万 | 可视化插件市场 |
| [farion1231/cc-switch](https://github.com/farion1231/cc-switch) | 15.5 万 | 在 Claude Code / Codex / DSH 等之间切换配置 |
| [anywhere-labs/dsh-desktop](https://github.com/anywhere-labs/dsh-desktop)、[dataelement/dsh-desktop](https://github.com/dataelement/dsh-desktop) | 3.6 万 / 1.9 万 | 第三方桌面端 |

> ⚠️ 第三方插件 / 桌面端 / skill 都是别人写的代码,会拿到你电脑的读写和执行权限。教程里要专门讲「装之前怎么检查」。

## 6. 对我们教程的启示

1. **定位差异化**:面向零基础,路线「概念 → 调 API → 用 DSH → skill → 定制」,不和 ht426 的源码教程抢同一批读者;需要深入源码时直接链过去。
2. **先讲原理再用工具**:用几十行 Python 手写一个最小 agent 循环(参考 hello-agents 第 4 章、mini-dsh),读者再看 DSH 就知道它到底帮你做了什么。
3. **"可持续更新"要靠机制,不靠决心**:DSH 还是 0.2.x 预发布版,界面和配置会变。每章标注「验证版本 + 验证日期」,操作细节尽量链接官方文档,概念章节写成和具体工具无关的,这样版本升级时只需改少数操作章节。
4. **每章固定模板**(借鉴微软课程):学习目标 → 讲解 → 动手练习 → 自检清单 → 延伸阅读。

---

## 7. 补充调研:PPT 相关 skill(用于第 14、15 章)

| 仓库 | 星 | 许可 | 说明 |
|---|---|---|---|
| [anthropics/skills](https://github.com/anthropics/skills) 里的 `pptx` | — | **专有许可** | 处理 .pptx 的"技术底座":读取、新建、按模板编辑、转图片自检。需要 Python、Node.js(pptxgenjs)、LibreOffice。**许可不允许转载,教程里只能链接、不能把文件复制进本仓库。** |
| [Gabberflast/academic-pptx-skill](https://github.com/Gabberflast/academic-pptx-skill) | 1607 | MIT | 学术汇报规范:标题写结论、一页一个图、三种颜色以内、结尾停在结论页。和 `pptx` 搭配使用 |
| [carnot-tech/jinba-consulting-pptx-skill](https://github.com/carnot-tech/jinba-consulting-pptx-skill) | 1622 | MIT | 咨询风格:一份"PPT 规范"+ 自动检查脚本 + 65 种版式。核心思路"先读规范,做完再机器检查",值得在第 15 章借鉴(日文) |
| [codezzzsleep/research-ppt-skill](https://github.com/codezzzsleep/research-ppt-skill) | 7 | MIT | 中文组会论文汇报 PPT;特点:先问 4 个问题再动手、每个数字记出处、排版自检。安装方式对小白很友好("把仓库地址交给 agent 让它装") |
| Binaryify/open-kimi-ppt-skill | 1596 | — | **已因版权问题清空**,不推荐 |

**教程思路:** "技术底座"(`pptx`,负责能做出文件)+ "规范 skill"(负责做得好看、讲得清楚)两层叠加;第 17 章再让读者写一个"我自己的 PPT 风格"skill。

## 8. 补充调研:让 AI 搜到靠谱资料的 skill(用于第 16 章)

背景:网上 AI 批量生成的低质量内容越来越多,AI 搜索时容易把它们当成可靠来源,再加上 AI 本身的"幻觉",结果就是答案看起来很像真的但是错的。要解决这个问题,需要两样东西:**搜索工具**(决定搜得到什么)和**调研方法**(决定怎么挑、怎么核对)。skill 负责后者。

### 调研 / 事实核查类 skill

| 仓库 | 星 | 许可 | 特点 |
|---|---|---|---|
| [Weizhena/Deep-Research-skills](https://github.com/Weizhena/Deep-Research-skills) | 2569 | MIT | 先出调研大纲、人确认后再深挖;有中文说明。最适合作为第 16 章的主例子 |
| [199-biotechnologies/claude-deep-research-skill](https://github.com/199-biotechnologies/claude-deep-research-skill) | 1223 | **无许可** | 8 步流程 + **来源可信度打分** + 自动校验引用。思路好,但没有许可证,只能链接、不能转载 |
| [SeanEllyJames/deep-research-skill](https://github.com/SeanEllyJames/deep-research-skill) | 186 | 其他 | 中文,一个 Markdown 文件即可;强调"精读少数一手来源、找出矛盾、给出判断",反对"堆一堆来源"式调研 |
| [7starsseeker/dsh-fact-check](https://github.com/7starsseeker/dsh-fact-check) | 6 | MIT | **专为 DSH 写的**事实核查 skill:不用模型记忆、国内外来源并行搜、反向再搜、每句话可追溯到链接。作者自己说 2.x 还在验证期,星少,作为"DSH 专属例子"介绍并提示风险 |
| [petar-nauka/fact-check-skill](https://github.com/petar-nauka/fact-check-skill) | 83 | MIT | 来源可信度评估、虚假信息风险打分;结构规范(SKILL.md 短 + references 细),适合当"好 skill 长什么样"的范例 |
| [FuturizeRush/fact-check-skill](https://github.com/FuturizeRush/fact-check-skill) | 2 | MIT | 专门查技术内容:过时版本号、编造的 API 字段 |
| [FeedHive/ai-slop-detector](https://github.com/FeedHive/ai-slop-detector) | 111 | — | 120 种"AI 腔"写作特征;可用来教读者识别 AI 垃圾文章 |

### 搜索工具(MCP,用于第 18 章)

| 仓库 | 星 | 说明 |
|---|---|---|
| [exa-labs/exa-mcp-server](https://github.com/exa-labs/exa-mcp-server) | 5239 | Exa 搜索,英文资料质量高 |
| [tavily-ai/tavily-mcp](https://github.com/tavily-ai/tavily-mcp) | 2494 | Tavily,专为 AI 设计的搜索 + 网页抓取 |
| [brave/brave-search-mcp-server](https://github.com/brave/brave-search-mcp-server) | 1584 | Brave 搜索官方 MCP |
| [BochaAI/bocha-search-mcp](https://github.com/BochaAI/bocha-search-mcp) | 187 | 博查搜索,**中文资料**的选择 |

这些都需要各自的 API 钥匙(多数有免费额度),写教程时要逐个确认价格和注册流程。

**教程要讲清楚的一句实话:** skill 能大幅减少错误,但不能保证 100% 正确;重要的事一定要点开原文核对。
