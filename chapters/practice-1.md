---
title: ✍️ 入门篇实操题
part: 入门篇 · 认识 AI
last_checked: 2026-11-17
---

# ✍️ 入门篇实操题

> 对应第 0–4 章。不需要钥匙，也不需要装 DSH，用电脑和任意一个 AI 聊天网页就能做。

## 题 1：找到文件的“家庭住址”

**操作：** 在桌面新建文件夹 `ai-练习`，在里面新建一个文本文件 `你好.txt`。然后找出这个文件的完整路径。

**做对了：** Mac 上类似 `/Users/你的名字/Desktop/ai-练习/你好.txt`，Windows 上类似 `C:\Users\你的名字\Desktop\ai-练习\你好.txt`。

<details>
<summary>卡住了？</summary>

- Mac：在访达里选中文件，按 `Option + Cmd + C` 复制路径
- Windows：按住 `Shift` 右键文件，选「复制为路径」
- 详见第 1 章

</details>

## 题 2：在终端里看到这个文件

**操作：** 打开终端，进入 `ai-练习` 文件夹，列出里面的文件。

```bash
cd ~/Desktop/ai-练习
ls
```

Windows 的 PowerShell 也可以用 `ls`。

**做对了：** 屏幕上出现 `你好.txt`。

<details>
<summary>卡住了？</summary>

- 提示 `No such file or directory`：路径写错了。用题 1 复制的路径，去掉最后的文件名
- 桌面在 OneDrive 里的 Windows 电脑，路径可能是 `~\OneDrive\Desktop\ai-练习`

</details>

## 题 3：分清聊天 AI 和 Agent

**操作：** 判断下面 4 件事，哪些普通聊天 AI 就能做，哪些需要 Agent（能动手的 AI）：

1. 解释“通货膨胀”是什么意思
2. 把电脑上 50 张照片按拍摄日期改名
3. 写一封请假邮件的草稿
4. 每天早上自动整理昨天的下载文件夹

<details>
<summary>参考答案</summary>

- 聊天 AI 就能做：1、3（只需要说话）
- 需要 Agent：2、4（要读写你电脑上的文件；4 还要定时自动做）

</details>

## 题 4：用比喻讲给朋友听

**操作：** 用一两句话，向一个没学过的朋友解释：API、API 钥匙、Harness 分别是什么。

<details>
<summary>参考说法</summary>

- **API**：餐厅的点菜窗口，把要求递进去，把结果递出来
- **API 钥匙**：你的会员卡兼钱包，证明是你在点菜、从你的账户扣钱
- **Harness**：AI 的“管家”，帮 AI 拿工具、读文件、做事，还会在危险操作前先问你

</details>

## 全部做完？

- [ ] 我能找到任何文件的完整路径
- [ ] 我能在终端里进入一个文件夹并列出文件
- [ ] 我能用比喻讲清楚 API、钥匙和 Harness

下一篇：[第 5 章 申请 DeepSeek API 钥匙](05-get-api-key.md)
