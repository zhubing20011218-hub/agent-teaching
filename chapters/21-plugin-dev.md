---
title: 第 21 章 🟡 选修：开发你的第一个插件
part: 第五部分 · 进阶定制
verified_with: dsh 0.2.2-rc.3（按官方开发文档目录和 agent-preset 文档核对）
last_checked: 2026-11-17
---

# 第 21 章 🟡 选修：开发你的第一个插件

> 🟡 **这是选修章。** 自己写插件需要会 TypeScript（一种编程语言）。不会编程的话，可以先看第 3 节“让 AI 帮你做插件”，了解一下就好。

> **学完这一章，你能：**
> - 知道什么时候需要插件，而 skill 和 MCP 不够用
> - 用“创造模式”让 DSH 帮你做一个简单插件
> - 知道自己写插件该从哪里开始学
>
> **前置：** 第 19 章

## 1. 为什么要学这个

skill 改变 AI **知道的做法**，MCP 给 AI **加工具**。但如果你想改变 **DSH 本身**，比如：

- 在界面上加一个按钮、换一套皮肤
- 改变 DSH 处理某件事的方式
- 把你公司的内部系统深度接进来

就需要插件。

## 2. 先问自己：真的需要插件吗？

| 你想要的 | 用什么 |
|---|---|
| AI 按某种方式做事 | skill（第 17 章） |
| AI 能用一个外部服务 | MCP（第 18 章）；很多服务已经有现成的 MCP |
| AI 每次都遵守某条规矩 | AGENTS.md（第 20 章） |
| 改 DSH 的界面、行为、内部功能 | **插件** |

**90% 的需求，前三样就够了。** 插件开发难度高，出错还可能影响 DSH 稳定。

## 3. 让 AI 帮你做插件（创造模式）

DSH 有一个「**创造**」模式，专门用来让 AI **改造 DSH 本身**。

1. 打开「**插件**」页面
2. 点「**添加插件**」旁边的箭头 →「**让 Agent 创建插件**」
3. 会进入「创造」模式的新会话。用大白话描述你想要的插件，比如：

```
我想要一个很简单的插件:在 AI 可用的工具里加一个"今天是星期几"的工具,
返回今天的日期和星期几(用中文)。
请先说明你打算怎么做、会改动哪些文件,我确认后再动手。
```

4. 按 AI 的步骤一步步确认

> [!WARNING]
> 创造模式会修改 DSH 的配置和插件。**开始之前，先备份 `~/.dsh/profiles` 文件夹**（复制一份到别处）。做坏了可以恢复。

## 4. 自己写插件：学习路线

如果你会编程，想自己写，按这个顺序看官方文档：

| 顺序 | 官方文档 | 学什么 |
|---|---|---|
| 1 | [开发插件入门](https://github.com/deepseek-ai/deepseek-harness/blob/master/docs/user/develop/basic/index.zh.md) | 插件长什么样、怎么开始 |
| 2 | [加一个工具](https://github.com/deepseek-ai/deepseek-harness/blob/master/docs/user/develop/basic/tool.zh.md) | 给 AI 加一个新工具 |
| 3 | [插件配置](https://github.com/deepseek-ai/deepseek-harness/blob/master/docs/user/develop/basic/config.zh.md) | 让插件有可调的设置 |
| 4 | [发布插件](https://github.com/deepseek-ai/deepseek-harness/blob/master/docs/user/develop/basic/publish.zh.md) | 发布给别人用 |
| 5 | [Cordis 框架入门](https://github.com/deepseek-ai/deepseek-harness/blob/master/docs/cordis-primer.zh.md) | DSH 底层的插件框架 |
| 6 | [扩展配方集](https://github.com/deepseek-ai/deepseek-harness/tree/master/docs/cookbook) | 加工具、加模型适配器等进阶配方 |

想深入读 DSH 源码，推荐社区教程 [ht426/deepseek-harness-tutorial](https://github.com/ht426/deepseek-harness-tutorial)（中文，14 章，讲架构和源码）。

## 5. 自己检查

- [ ] 我能判断一个需求该用 skill、MCP、AGENTS.md 还是插件
- [ ] 我知道「让 Agent 创建插件」在哪里，用之前要备份
- [ ] （会编程的话）我知道从哪份官方文档开始学

## 6. 想了解更多

- 官方开发文档：https://github.com/deepseek-ai/deepseek-harness/tree/master/docs/user/develop
- 下一章：[第 22 章 综合实战](22-projects.md)
