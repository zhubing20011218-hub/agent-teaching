---
title: 第 20 章 MCP：让 AI 连上更多外部工具
part: 第五部分 · 进阶定制
verified_with: dsh 0.2.2-rc.3（按官方 dsh-mcp-client 文档核对配置格式）
last_checked: 2026-11-17
---

# 第 20 章 MCP：让 AI 连上更多外部工具

> **学完这一章，你能：**
> - 用“万能插座”的比喻讲清楚 MCP
> - 给 DSH 接上一个专业搜索 MCP(Exa)，让第 18 章的调研更准
> - 确认 MCP 接上了、AI 用上了
> - 知道接 MCP 有什么风险
>
> **前置：** 第 1 章（会编辑文本文件）、第 18 章

## 1. 为什么要学这个

skill 是“说明书”，只能教 AI **怎么做**。但如果 AI 本来就**没有某个能力**——比如用某个专业搜索引擎、查你公司的数据库、操作你的日历——光有说明书是不够的，得给它**新的工具**。

MCP 就是给 AI 接新工具的标准方法。

## 2. 讲解

### MCP = 工具的“万能插座”

打个比方：以前每个电器都有自己的插头，换个国家就插不上。后来有了**统一的插座标准**，什么电器都能插。

MCP 就是 AI 工具的**统一插座标准**：

- 别人把工具做成“MCP 服务器”（带标准插头的电器）
- DSH、Claude Code、Codex 等都有“MCP 插座”
- 插上就能用，不用为每个 AI 工具单独开发

专业名称：**MCP**（Model Context Protocol，模型上下文协议）。

### MCP 服务器有两种

| 类型 | 比喻 | 在哪运行 | 需要 |
|---|---|---|---|
| **远程**（专业名称 Streamable HTTP） | 用别人家的电器，通过网线连过去 | 别人的服务器上 | 一个网址（有时还要钥匙） |
| **本地**（专业名称 stdio） | 电器放在你家 | 你自己的电脑上 | 先在电脑上安装这个程序 |

**新手先用远程的**：不用安装任何东西，填一个网址就行。

### 接上以后，AI 看到的工具名

MCP 的工具在 DSH 里会叫 `mcp__服务器名__工具名`。比如接了 Exa 搜索，AI 会多出 `mcp__exa__web_search_exa` 这样的工具。看到这种名字，就知道它在用 MCP。

## 3. 跟着做：接一个 Exa 搜索 MCP

**Exa** 是一个专门给 AI 用的搜索引擎，英文资料质量比较高。它提供免费的远程 MCP，地址是 `https://mcp.exa.ai/mcp`。

> [!TIP]
> 中文资料多的话，也可以用**博查**（open.bochaai.com，需要注册拿 API 钥匙）。接法类似，看它的官方说明。

### 第一步：打开 DSH 的配置文件

1. 打开 DSH 的「**设置**」
2. 在设置页顶部点「**打开配置文件**」

**应该看到：** 用编辑器打开了一个叫 `cordis.patch.yml` 的文件。

<!-- 截图待补:设置页顶部的「打开配置文件」。补图方法见 docs/screenshots.md -->

> 如果找不到这个按钮，也可以自己打开：
> - 桌面版：`~/.dsh/profiles/desktop/cordis.patch.yml`
> - 网页版：`~/.dsh/profiles/web/cordis.patch.yml`

### 第二步：先备份

> [!WARNING]
> **改配置文件之前，一定先备份。** 改坏了 DSH 可能打不开。

在同一个文件夹里，把 `cordis.patch.yml` **复制一份**，改名为 `cordis.patch.yml.备份-今天的日期`。

### 第三步：加上 MCP 配置

在文件**最后面**另起一行，**原样复制**下面这段：

```yaml

# Exa 搜索 MCP(远程,免费)—— 第 20 章添加
- insert:
    - id: mcp-exa
      name: '@deepseek-ai/dsh-mcp-client'
      config:
        serverName: exa
        transport: streamable-http
        url: https://mcp.exa.ai/mcp
```

> [!WARNING]
> YAML 格式要求非常严格：
> - **只能用空格缩进，不能用 Tab 键**
> - 每一层缩进的空格数要和上面一模一样
> - 不要删掉文件里原来的内容
>
> 用 VS Code 编辑时，如果某行下面出现红色波浪线，说明格式有错。

保存文件。

### 第四步：重启 DSH

完全退出 DSH(Mac 按 `⌘ + Q`;Windows 右键托盘图标 → 退出)，再重新打开。

> [!TIP]
> DSH 有时能自动读取配置的变化，但重启最保险。

### 第五步：确认接上了

新开一个会话，输入：

```
你现在有哪些名字以 mcp__ 开头的工具?列出来。
```

**应该看到：** 它列出几个以 `mcp__exa__` 开头的工具。

再试一下：

```
用 exa 搜索工具搜一下 "DeepSeek Harness" 的官方网站和 GitHub 地址,给我链接。
```

**应该看到：** 对话里显示它调用了 `mcp__exa__……` 工具，并给出链接。

### 第六步：和调研 skill 配合

现在，第 18 章的 `reliable-research` skill 有了更好的“搜索引擎”。试试：

```
/reliable-research 中英文资料都用 exa 搜索工具搜。
问题:目前有哪些主流的 AI Agent 工具(类似 DeepSeek Harness 的)?各自是哪家公司做的?
```

## 4. 删除或暂停 MCP

- **删除**：打开配置文件，删掉你加的那一段，保存，重启
- **暂停**：在那段配置的每一行最前面加一个 `#`（变成“注释”,DSH 会忽略它），保存，重启。想恢复时删掉这些 `#`

## 5. ⚠️ 接 MCP 的风险

MCP 服务器会拿到 AI **发给它的内容**，有些还能**在你电脑上运行程序**。

| 风险 | 怎么防 |
|---|---|
| 远程 MCP 能看到 AI 发给它的内容（比如搜索词，有时包括你的文件内容） | 只接可信的公司或官方提供的 MCP；别让 AI 把敏感内容发出去 |
| 本地 MCP 是在你电脑上运行的程序，有你电脑的权限 | 只装来源可靠、很多人用的；安装前按第 15 章的方法检查 |
| MCP 返回的内容里可能藏着“骗 AI 的指令” | 第 25 章讲的提示词注入；遇到 AI 突然要做奇怪的事，先「拒绝」 |
| 需要钥匙的 MCP | 钥匙不要直接写在配置文件里，用官方文档推荐的环境变量方式 |

## 6. 自己检查

- [ ] 我能用“万能插座”解释 MCP
- [ ] 我知道远程 MCP 和本地 MCP 的区别
- [ ] 我备份了配置文件，加上了 Exa MCP
- [ ] AI 能列出 `mcp__exa__` 开头的工具，并成功搜索了一次
- [ ] 我知道怎么删除或暂停一个 MCP

## 7. 常见问题

**问：重启后 DSH 打不开了 / 报错？**
答：多半是配置文件格式错了。把备份文件改回原名（覆盖改坏的那个），重启。然后重新检查缩进（是不是用了 Tab、空格数对不对）。

**问：看不到 `mcp__exa__` 工具？**
答：① 确认重启过；② 确认网络能访问 `https://mcp.exa.ai`;③ 检查 `transport` 是 `streamable-http`（有短横线），`url` 没有多余空格。

**问：Exa 提示超出免费额度？**
答：免费版有使用限制。可以去 Exa 官网注册拿 API 钥匙，按 Exa 官方文档加上钥匙；或者换别的搜索 MCP。

**问：有没有 MCP 的“应用商店”?**
答：有很多 MCP 合集网站和 GitHub 列表。但记住：**数量多不代表安全**，装之前都要检查。

## 8. 想了解更多

- DSH 官方 MCP 客户端说明：https://github.com/deepseek-ai/deepseek-harness/blob/master/packages/mcp/mcp-client/README.zh.md
- DSH 官方“接记忆 MCP”指南（本地 MCP 的例子）：https://github.com/deepseek-ai/deepseek-harness/blob/master/docs/user/guide/mcp-memory.zh.md
- Exa MCP:https://github.com/exa-labs/exa-mcp-server
- 下一章：[第 21 章 插件和配置文件](21-plugins-config.md)
