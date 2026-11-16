---
title: 附录 B 常见报错速查
part: 附录
verified_with: dsh 0.2.2-rc.3;DeepSeek 错误码文档（2026-11-17 查阅）
last_checked: 2026-11-17
---

# 附录 B 常见报错速查

遇到问题，先在这里按关键字找(Mac 按 `⌘ + F`、Windows 按 `Ctrl + F` 搜索页面)。找不到的话：**把完整的报错文字复制给 AI**，问“这是什么意思、怎么解决”。

## DeepSeek API 报错

| 报错里出现 | 意思 | 怎么办 | 详见 |
|---|---|---|---|
| `401` 认证失败 | 钥匙不对、复制不完整、或者已被删除 | 重新复制钥匙；去开放平台确认钥匙还在 | 第 5、9 章 |
| `402` 余额不足 | 账户没钱了 | 去 platform.deepseek.com 充值 | 第 5 章 |
| `400` 格式错误 / `422` 参数错误 | 请求写错了 | 重新完整复制命令或代码 | 第 6 章 |
| `429` 请求速率达到上限 | 太快、太多 | 等一会儿再试 | 第 6 章 |
| `500` 服务器故障 / `503` 服务器繁忙 | DeepSeek 那边的问题 | 等几分钟再试 | 第 6 章 |

## 安装和启动

| 现象 / 报错 | 原因 | 怎么办 | 详见 |
|---|---|---|---|
| Mac:“无法打开，因为无法验证开发者” | 系统安全检查 | 确认是官网下载的，在“系统设置 → 隐私与安全性”里点“仍要打开” | 第 8 章 |
| `command not found: npx` / `'npx' 不是内部或外部命令` | Node.js 没装好 | 装 Node.js LTS 版，重新打开终端 | 第 8 章 |
| `EADDRINUSE` / 端口 `3080` 被占用 | DSH 网页版已经在运行 | 用已经开着的那个，或者先停掉 | 第 8 章 |
| Windows:“禁止运行脚本” | PowerShell 安全策略 | `Set-ExecutionPolicy -Scope CurrentUser RemoteSigned` | 第 8 章 |
| 输入框是灰的 / 「选择一个工作区开始」 | 还没选工作区 | 点「选择工作区」 | 第 9、10 章 |

## Skill

| 现象 | 原因 | 怎么办 | 详见 |
|---|---|---|---|
| `/` 菜单里找不到装好的 skill | 文件夹多套了一层；文件名不是 `SKILL.md`；头部格式错 | 确认是 `~/.dsh/skills/<名字>/SKILL.md`；第一行是 `---`；有 `name` 和 `description` | 第 13 章 |
| AI 不自动调用 skill | `description` 没写到你说的那种说法 | 换说法；用 `/skill名`；改 `description` | 第 13、17 章 |
| 不相关的事也调用了 skill | `description` 范围太宽 | 在 `description` 里加“……时不用” | 第 17 章 |
| 做 PPT 报错找不到 `pptxgenjs` | 没装 | 让 AI 运行 `npm install pptxgenjs` | 第 14 章 |
| 找不到 `soffice` / LibreOffice | 没装或找不到 | 安装 LibreOffice，告诉 AI 装在哪 | 第 14 章 |
| PPT 中文变方框 | 字体问题 | 指定系统自带的中文字体 | 第 14 章 |

## MCP、插件、配置文件

| 现象 / 报错 | 原因 | 怎么办 | 详见 |
|---|---|---|---|
| 改完配置文件 DSH 打不开 | YAML 格式错（用了 Tab、缩进不对） | 用备份恢复，重新检查缩进 | 第 18、19 章 |
| 看不到 `mcp__` 开头的工具 | 没重启；网址或 `transport` 写错；网络不通 | 重启；检查拼写；检查网络 | 第 18 章 |
| `Plugin … is incompatible with dsh …` | 插件和当前 DSH 版本不兼容，已被跳过 | 更新插件或卸载；新手不要强行豁免 | 第 19 章 |

## Python（🟡 选修章）

| 报错 | 原因 | 怎么办 | 详见 |
|---|---|---|---|
| `KeyError: 'DEEPSEEK_API_KEY'` | 环境变量里没有钥匙 | 重新 `export` / `$env:` 设置；关掉终端后要重新设 | 第 6 章 |
| `ModuleNotFoundError: No module named 'openai'` | 没装 openai 库 | `pip3 install openai` | 第 6 章 |
| `command not found: pip3` / `python3` | 没装 Python | 去 python.org 下载安装 | 第 6 章 |
