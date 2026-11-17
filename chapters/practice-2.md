---
title: ✍️ 基础篇实操题
part: 基础篇 · 接上 AI
last_checked: 2026-11-17
---

# ✍️ 基础篇实操题

> 对应第 5–10 章。需要：DeepSeek 钥匙、装好的 DSH。

## 题 1：让 AI 整理一个乱文件夹

**准备：** 在 `ai-练习` 里新建文件夹 `乱文件夹`，随便放 10 个文件进去：几张图片、几个文档、几个表格。

**操作：** DSH 选 `乱文件夹` 当工作区，权限选「工作区内修改」，发：

```text
请把这个文件夹里的文件按类型分到「图片」「文档」「表格」「其他」四个子文件夹里。
动手之前先列出你的计划，等我确认。
```

**做对了：** AI 先给出计划；你回复“可以”后，它请求移动文件；做完后，四个子文件夹里都放对了。

<details>
<summary>卡住了？</summary>

- 输入框是灰的：还没选工作区（第 10 章）
- AI 没先给计划就动手了：下次在开头加一句“先别动手”
- 分错了：直接说“`xxx.pdf` 应该放进文档”，让它改

</details>

## 题 2：用自定义渠道再接一次 DeepSeek

**操作：** 按第 8 章，用「自定义模型 API」接 DeepSeek：协议选 OpenAI Chat Completions，地址填 `https://api.deepseek.com`，模型选 `deepseek-flash`。用它发一句话。

**做对了：** 新卡片带「自定义」标签，发消息有回复。

**再练一步：** 故意把地址改成 `https://api.deepseek.com/v1/chat/completions`，看报什么错，再改回来。

<details>
<summary>卡住了？</summary>

- `401`：钥匙复制少了一截，或者有空格
- `404`：地址后面多了路径
- 练完把这张练习卡片删掉

</details>

## 题 3：从文档里抠地址

**操作：** 某中转站的文档写着：

```text
OpenAI 格式：POST https://api.example-relay.com/v1/chat/completions
Claude 格式：POST https://api.example-relay.com/v1/messages
```

分别写出在 DSH 里选 OpenAI Chat Completions 和 Anthropic Messages 时，「API 地址」要填什么。

<details>
<summary>参考答案</summary>

- OpenAI Chat Completions：`https://api.example-relay.com/v1`
- Anthropic Messages：`https://api.example-relay.com`

</details>

## 题 4：认出这三个报错

**操作：** 说出下面三个报错，各自先查哪一样：

1. `401 令牌无效`
2. `404 Invalid URL`
3. `model not found`

<details>
<summary>参考答案</summary>

1. 查**钥匙**：复制完整了吗？和地址是同一家吗？
2. 查**地址**：`/v1` 多了还是少了？
3. 查**模型名**：一个字母都不能错

</details>

## 全部做完？

- [ ] AI 帮我整理好了一个文件夹，而且是先给计划再动手
- [ ] 我用自定义渠道成功接过一次
- [ ] 看到 401、404，我知道先查哪里

下一篇：[第 11 章 Skill 是什么](11-what-is-skill.md)
