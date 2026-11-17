---
title: 复刻：英语口语练习系统
part: 作品展示 · 复刻步骤
last_checked: 2026-11-17
---

# 复刻：英语口语练习系统

> **原作品：** [shazinet/english-handbook](https://github.com/shazinet/english-handbook)（MIT）
> **做出来是什么样：** 每天写一段英文日记 → AI 批改并按语法点记错题 → 错题第二天、几天后、一周后再考你 → 错题变成记忆卡片 → 一个进度网页
> **简化了什么：** 原作会直接生成 Anki 牌组、自动安装、定时提醒；这里改成**纯文件**（Markdown + CSV），卡片用 Anki 自带的“导入 CSV”。学别的语言，把“英语”换掉就行
> **难度：** ⭐⭐ · 大约 1 小时搭好，之后每天 10 分钟
>
> 下面的提示词是我们读了原作的 `CLAUDE.md`、`.claude/commands/` 里的命令（journal 写日记、check 批改、mistakes 错题、dashboard 进度页）之后反推的，**不是作者的原话**，也没有实际运行过。
>
> **这个作品最值得学的是做法：** 把“学习方法”写成规则，把每天要做的事做成一句话就能触发的 skill。

> [!TIP]
> **第 1 步的提示词里附了原作关键文件的链接**，AI 会先读原作、再动手，做出来更接近原作。打不开 GitHub 也没关系，提示词里的要求已经够用。
>
> **整个复刻请在同一个 DSH 会话里做完**，AI 才会一直记得原作和前面的步骤。

## 准备

1. 新建文件夹 `ai-练习/英语练习`
2. DSH 选它当工作区，权限「工作区内修改」

## 第 1 步：建档

```text
参考这个开源项目：https://github.com/shazinet/english-handbook（MIT 许可证）
先读下面这几个文件。只读，不要运行里面的任何脚本，也不要安装它的依赖：
- https://raw.githubusercontent.com/shazinet/english-handbook/main/CLAUDE.md（整个系统的规则：数据怎么分、卡片怎么写）
- https://raw.githubusercontent.com/shazinet/english-handbook/main/.claude/commands/journal.md（“写日记”命令）
- https://raw.githubusercontent.com/shazinet/english-handbook/main/.claude/commands/check.md（“批改”命令）
读完用三五句话告诉我：它是做什么的、分几块、外观或写法有什么特点。
然后参考它的功能和外观，在当前文件夹里自己重新做一个简化版，不要整份复制它的代码；用到它的代码片段时，在文件开头注明出处和许可证。
如果打不开这些链接，直接告诉我，然后只按下面的要求做。

帮我搭一个英语口语练习系统，先建档。问我 5 个问题（一次问完）：
我的水平（大概 A2/B1/B2/C1）、母语、每天能花多少分钟、想练的场景（工作/旅行/日常聊天）、最想改掉的毛病。
我回答后，把结果写进 me/profile.md。
以后所有属于我个人的内容（日记、错题、卡片）都放在 me/ 文件夹里。
```

✅ **检查：** 出现 `me/profile.md`，内容和你的回答一致。

## 第 2 步：每日日记

```text
写今天的日记：在 me/journal/ 下用今天的日期新建一个文件（比如 2026-11-17.md）。
根据 me/profile.md 里我的水平和想练的场景，给我出一个写作题目，要求 80–120 词，题目里刻意用到我最容易错的语法点。
文件已经存在就直接给我看，不要覆盖。
```

然后自己在文件里写英文日记。

## 第 3 步：批改并记错题

```text
批改今天的日记。对每个错误：
1. 引用原句（一字不改）
2. 给出改正
3. 写出语法点名称（比如“现在完成时”“冠词 the/a”）
4. 如果是中文母语者常犯的，用一句话说为什么
用表格列出来，最后给一段改好的全文。
再把每个错误追加到 me/errors.md，格式：日期 | 原句 | 改正 | 语法点 | 状态（未掌握）。
不要编造我没写的内容。
```

✅ **检查：** 表格里的“原句”和你写的一字不差；`me/errors.md` 多了几行。
🔧 **不对的话：** `第 2 条你改的地方其实没错，"I'm used to it" 是对的。请去掉这条，errors.md 里也删掉。`

## 第 4 步：间隔复习热身

```text
做错题热身：从 me/errors.md 里挑 5 条“未掌握”的，按“1 天前、3 天前、7 天前、更早”各挑一些。
每条写成一个一句话场景 + 我当时的错句，让我一次性写出改正。先别给答案。
我回答后逐条判断：改对了且自然就记“已掌握”，否则保持“未掌握”。
```

## 第 5 步：错题变卡片

```text
把 me/errors.md 里“未掌握”的错题做成记忆卡片，保存为 me/cards.csv，两列：正面,背面。
正面：中文场景 + 一句需要我说出来的提示（不要直接给英文原句）
背面：正确的英文句子 + 语法点
用 UTF-8 编码，Anki 能直接导入。
```

✅ **检查：** 用 Anki 的「文件 → 导入」选 `cards.csv`，能看到卡片。

## 第 6 步：做成一句话触发的 skill

```text
把第 2–5 步写成 4 个 skill，放在当前项目的 .dsh/skills/ 下：
- english-journal：写今天的日记题目
- english-check：批改并记错题
- english-warmup：错题热身
- english-cards：错题变卡片
每个 skill 的 description 写清楚什么时候用；内容照我们刚才的做法写。写完告诉我怎么调用。
```

✅ **检查：** 在 DSH 输入框打 `/english`，能看到 4 个 skill。

## 第 7 步：进度网页

```text
做一个进度页 me/dashboard.html（单个文件，不联网）：
- 标题 English Practice
- 最近 12 周每天有没有写日记（像格子日历）
- 每 100 词的错误数随日记变化的折线
- 错题按语法点统计，最多的排前面
- 徽章：连续 3 天、7 天、30 天，铜 #b87333、银 #8f9caa、金 #c9971a
数据从 me/journal/ 和 me/errors.md 读取后写进网页里。
```

## 做完以后

- 每天只需要：`/english-journal` → 写 → `/english-check`，隔几天 `/english-warmup`
- 按[第 17 章](/chapters/17-automation)设一个每晚的定时提醒
- 回到 [作品展示](/showcase/)
