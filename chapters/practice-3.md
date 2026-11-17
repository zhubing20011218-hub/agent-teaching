---
title: ✍️ 进阶篇实操题
part: 进阶篇 · 用 Skill 教 AI 新本事
last_checked: 2026-11-17
---

# ✍️ 进阶篇实操题

> 对应第 11–16 章。需要：DSH 能正常对话。

## 题 1：从 Skill 库装一个 skill，并证明它被用上了

**操作：** 打开 [Skill 库](/skill-hub/)，找到 `meeting-notes`，点「复制安装指令」，粘贴到 DSH 发送。装好后，粘贴一段随便写的聊天记录，说“整理成会议纪要”。

**做对了：** 输入 `/` 能看到 `meeting-notes`；整理时对话里出现「加载技能」；纪要最后一行是“以上内容由 AI 根据原始记录整理，请核对。”

<details>
<summary>卡住了？</summary>

- `/` 里找不到：文件夹多套了一层，确认是 `~/.dsh/skills/meeting-notes/SKILL.md`
- 没出现「加载技能」：换个说法，或者直接输入 `/meeting-notes` 指定
- 详见第 12 章

</details>

## 题 2：3 页 PPT

**操作：** 装好 `pptx`，发：

```text
做一份 3 页的 PPT,主题「我的一周」:封面、本周做了什么、下周计划。
保存为「我的一周.pptx」，做完把每页的内容列给我。
```

**做对了：** 文件能用 PowerPoint 或 WPS 打开，中文不是方框。

<details>
<summary>卡住了？</summary>

- 报错找不到 `pptxgenjs`：让 AI 运行 `npm install pptxgenjs`
- 中文变方框：让 AI 换成系统自带的中文字体
- 详见第 13 章

</details>

## 题 3：抓住一次 AI 编的“出处”

**操作：** 不装任何 skill，问：“2025 年中国大学生平均每天用 AI 多长时间？给出处。”然后装好 `reliable-research`，**新开一个会话**再问一次。

**做对了：** 能说出两次回答的区别。第二次应该每条都有可以点开的出处，查不到时会直说查不到。点开至少 2 个出处核对。

## 题 4：写一个你自己的 skill

**操作：** 把你最常让 AI 做的一件事（比如“把周报写成固定格式”），按第 16 章写成 skill。然后做三个测试：让 AI 自己判断要不要用、手动指定、不相关的事不该用。

**做对了：** 三个测试都通过。

<details>
<summary>卡住了？</summary>

- 不自动调用：`description` 里多写几种“用户会怎么说”
- 不相关的事也调用：在 `description` 里加“……时不用”

</details>

## 全部做完？

- [ ] 我从 Skill 库装过 skill，并且确认它被调用了
- [ ] 我做出过一份能正常打开的 PPT
- [ ] 我写过一个自己的 skill，三个测试都通过

下一篇：[第 17 章 让 DSH 自动干活](17-automation.md)
