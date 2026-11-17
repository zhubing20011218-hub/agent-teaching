---
title: 第 23 章 🟡 选修：亲手调用一次 API
part: 选修 · 写一点代码
verified_with: DeepSeek API 文档（2026-11-17 查阅），openai Python 库 3.51
last_checked: 2026-11-17
---

# 第 23 章 🟡 选修：亲手调用一次 API

> 🟡 **这是选修章。** 会用到终端和几行代码（全部给好，只需复制）。不想学可以直接跳到 [第 6 章](06-install-dsh.md)，不影响后面。

> **学完这一章，你能：**
> - 用一条命令，亲手给 DeepSeek 发一个请求，看懂它回了什么
> - 用几行 Python 做一个能连续聊天的小程序
> - 看懂常见的报错
>
> **前置：** 第 1 章（会用终端）、第 5 章（有一把 API 钥匙）

## 1. 为什么要学这个

DSH 每次和 DeepSeek 说话，背后做的都是这一章的事情。亲手做一次，你就会明白：

- AI 其实**没有记忆**，每次都要把聊天记录重新发一遍
- 每次调用都会告诉你用了多少 Token（多少钱）

## 2. 跟着做

### 第一步：把钥匙放进“环境变量”

**环境变量**：打个比方，就是**终端随身带的一个小口袋**，可以往里面放一些值，命令和程序要用时从口袋里拿。

好处是：钥匙不用写进命令或代码里，截图、分享代码时就不会泄露。

在终端里输入(把 `sk-你的钥匙` 换成你真实的钥匙):

**Mac:**

```bash
export DEEPSEEK_API_KEY="sk-你的钥匙"
```

**Windows PowerShell:**

```powershell
$env:DEEPSEEK_API_KEY="sk-你的钥匙"
```

按回车。**应该看到：** 什么都没显示，这是正常的。

> [!WARNING]
> 这样放的钥匙，**关掉这个终端窗口就没了**，下次要重新放。这是故意的：更安全。输入完这条命令后，建议按 `Ctrl + L`(Mac 用 `⌘ + K`)清屏，别让钥匙留在屏幕上被截图。

### 第二步：发第一个请求

**Mac** 直接复制下面整段，粘贴进终端，按回车：

```bash
curl https://api.deepseek.com/chat/completions \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer $DEEPSEEK_API_KEY" \
  -d '{
    "model": "deepseek-flash",
    "messages": [
      {"role": "system", "content": "你是一个耐心的中文助手。"},
      {"role": "user", "content": "用一句话介绍你自己"}
    ]
  }'
```

**Windows PowerShell** 复制这段：

```powershell
$body = @{
  model = "deepseek-flash"
  messages = @(
    @{ role = "system"; content = "你是一个耐心的中文助手。" },
    @{ role = "user"; content = "用一句话介绍你自己" }
  )
} | ConvertTo-Json -Depth 5
Invoke-RestMethod -Uri "https://api.deepseek.com/chat/completions" -Method Post `
  -Headers @{ Authorization = "Bearer $env:DEEPSEEK_API_KEY" } `
  -ContentType "application/json; charset=utf-8" `
  -Body ([System.Text.Encoding]::UTF8.GetBytes($body))
```

**应该看到：** 一大段回复（Mac 上是一段 JSON 格式的文字，Windows 上是整理好的列表），里面有 AI 的自我介绍。

### 第三步：看懂回复

回复里重要的就三处（Mac 上的样子，已简化）：

```json
{
  "model": "deepseek-flash",
  "choices": [{
    "message": {
      "role": "assistant",
      "content": "我是 DeepSeek,一个……"      ← ① AI 的回答
    }
  }],
  "usage": {
    "prompt_tokens": 20,                     ← ② 你发过去的 Token 数(输入)
    "completion_tokens": 25,                 ← ③ AI 写回来的 Token 数(输出)
    "total_tokens": 45
  }
}
```

对照第 3 章：**这次花的钱 = 输入 Token × 输入单价 + 输出 Token × 输出单价**。45 个 Token，大约是万分之一元。

### 看懂请求：messages 里的三种角色

你发过去的 `messages`（消息列表）里，每条消息都有一个 `role`（角色）：

| 角色 | 是谁说的 | 作用 |
|---|---|---|
| `system` | 你给 AI 的“幕后指示” | 定规矩：用什么语气、扮演什么角色 |
| `user` | 你 | 你的问题 |
| `assistant` | AI | AI 之前的回答（多轮聊天时要带上） |

### 第四步（可选）：用 Python 做一个聊天小程序

1. 确认装了 Python：终端里输入 `python3 --version`(Windows 输入 `python --version`)。
   **应该看到** `Python 3.x.x`。没装的话去 https://www.python.org/downloads/ 下载安装（Windows 安装时**勾选 "Add python.exe to PATH"**）。
2. 安装 openai 库（一个帮你调用 API 的工具包，DeepSeek 兼容它）：

```bash
pip3 install openai
```

(Windows 用 `pip install openai`)

3. 下载本教程的示例文件 [examples/chat.py](https://teach.prismice.cn/files/examples/chat.py)，放进 `ai-练习` 文件夹
4. 在终端里进入 `ai-练习` 文件夹(输入 `cd `，把文件夹拖进终端，按回车)
5. 运行：

```bash
python3 chat.py
```

**应该看到：** 出现 `你:`，输入一句话，AI 会回答，还会告诉你这次用了多少 Token。输入 `退出` 结束。

试试这个对话：

```
你:我叫小明
AI:你好小明!……
你:我叫什么?
AI:你叫小明。
```

AI “记得”你叫小明。打开 `chat.py` 看看，秘密在 `history` 这个列表：**每次都把整段聊天记录一起发过去**。

再注意 Token 数：**聊得越久，每次用的 Token 越多**，因为聊天记录越来越长。这就是 Agent 聊太久会变贵、需要“压缩”的原因。

## 3. 自己检查

- [ ] 我成功发出了第一个请求，看到了 AI 的回答
- [ ] 我能在回复里找到 AI 的回答和 Token 用量
- [ ] 我知道 `system`、`user`、`assistant` 三种角色
- [ ] 我理解 AI 是靠“每次重发聊天记录”来“记住”的

## 4. 常见问题（看报错里的数字）

| 报错里出现 | 意思 | 怎么办 |
|---|---|---|
| `401` 认证失败 | 钥匙不对 | 检查环境变量里的钥匙有没有复制完整、多了空格；或者钥匙已被删除 |
| `402` 余额不足 | 账户没钱了 | 去开放平台充值 |
| `429` 请求速率达到上限 | 请求太快、太多 | 等一会儿再试 |
| `400` 格式错误 / `422` 参数错误 | 请求写错了 | 检查是不是复制漏了符号，重新完整复制 |
| `500` 服务器故障 / `503` 服务器繁忙 | DeepSeek 那边忙或出问题 | 等几分钟再试 |
| `KeyError: 'DEEPSEEK_API_KEY'`(Python) | 环境变量里没有钥匙 | 重新做第一步。**注意：关掉终端后要重新放** |
| `command not found: pip3` | 没装 Python 或 pip | 按第四步装 Python |

## 5. 想了解更多

- DeepSeek API 官方文档（含更多参数）：https://api-docs.deepseek.com/zh-cn/
- 错误码说明：https://api-docs.deepseek.com/zh-cn/quick_start/error_codes
- 下一章：[第 24 章 手写一个迷你 Agent](24-mini-agent.md)
