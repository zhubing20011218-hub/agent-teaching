---
title: 第 13 章 安装 Skill，并确认 AI 真的会用它
part: 第四部分 · Skill（技能）：教 AI 新本事
verified_with: dsh 0.2.2-rc.3(按官方 skill 文档和界面文字核对)
last_checked: 2026-11-17
---

# 第 13 章 安装 Skill，并确认 AI 真的会用它

> **学完这一章，你能：**
> - 知道 DSH 去哪里找 skill
> - 用两种方法安装 skill：让 DSH 帮你装、自己动手装
> - **确认 skill 装好了**，并且**确认 AI 真的用上了它**
> - 安装别人的 skill 之前，检查它安不安全
>
> **前置：** 第 12 章

## 1. 为什么要学这个

很多人装了 skill 以后，不知道它到底有没有起作用。这一章把整个过程走一遍：

**装好 → 确认装上了 → 确认被调用了 → 确认效果对了。**

我们用本教程自带的一个简单 skill 来练习：`meeting-notes`（把零散内容整理成会议纪要）。它只有一个文本文件，没有脚本，很安全。

## 2. 讲解：DSH 去哪里找 skill

DSH 会自动去下面这几个文件夹找 skill(数字越小越优先，同名时用优先的那个):

| 优先级 | 位置 | 谁能用 |
|---|---|---|
| 1 | `<项目文件夹>/.dsh/skills/` | 只有这个项目 |
| 2 | `<项目文件夹>/.agents/skills/` | 只有这个项目（和其他 Agent 工具共用） |
| 3 | 你在配置里自定义的文件夹 | 看你怎么配 |
| 4 | **`~/.dsh/skills/`** | **你电脑上所有项目** ← 新手放这里 |
| 5 | `~/.agents/skills/` | 所有项目（和其他 Agent 工具共用） |

(`~` 是你的用户文件夹，第 1 章讲过。)

**新手建议：统一放在 `~/.dsh/skills/`。** 等你有了“只在某个项目里用”的 skill，再放进那个项目的 `.dsh/skills/`。

### ⚠️ 最容易错的一点：文件夹只能有一层

DSH 只认这两种放法：

```
~/.dsh/skills/
├── meeting-notes/          ✅ 一个文件夹
│   └── SKILL.md            ✅ 里面直接就是 SKILL.md
└── 我的小技能.md            ✅ 或者直接放一个 .md 文件
```

**下面这种不行**（多套了一层，DSH 找不到）：

```
~/.dsh/skills/
└── agent-teaching-main/        ❌ 下载解压出来的外层文件夹
    └── skills/
        └── meeting-notes/
            └── SKILL.md
```

所以从网上下载后，要**找到直接装着 `SKILL.md` 的那个文件夹**，只把它放进去。

> [!TIP]
> 装好、改名、删除 skill **都不用重启 DSH**，它会自己发现变化。

## 3. 跟着做：方法一，让 DSH 帮你装（推荐）

最简单的办法：**让 Agent 自己去装。**

1. 在 DSH 里新开一个会话(工作区随便选，比如 `ai-练习`)
2. 权限模式选「**工作区内修改**」
3. 输入：

```
请帮我安装一个 skill:
把 https://github.com/zhubing20011218-hub/agent-teaching 仓库里
skills/meeting-notes 这个文件夹,复制到 ~/.dsh/skills/meeting-notes。
注意 ~/.dsh/skills/meeting-notes/ 里面要直接是 SKILL.md,不要多套文件夹。
装好后列出 ~/.dsh/skills/meeting-notes/ 里的文件给我确认。
```

4. 因为 `~/.dsh/skills` 不在工作区里，它会弹出审批。看清它要执行的操作(下载、复制到 `~/.dsh/skills`)，确认就是你要求的事，点「**允许一次**」

**应该看到：** 最后它列出 `~/.dsh/skills/meeting-notes/SKILL.md`。

## 4. 跟着做：方法二，自己动手装

不想让 AI 动手，或者方法一失败了，就自己装：

1. 打开 https://github.com/zhubing20011218-hub/agent-teaching
2. 点绿色的「**Code**」按钮 →「**Download ZIP**」
3. 双击下载好的 zip 文件解压，得到一个 `agent-teaching-main` 文件夹
4. 打开它，进入 `skills` 文件夹，你会看到 `meeting-notes` 文件夹。**点进去确认里面直接就是 `SKILL.md`**
5. 打开 `~/.dsh/skills` 文件夹：
   - **Mac**：在访达里按 `⌘ + Shift + G`，输入 `~/.dsh/skills`，回车
   - **Windows**：在文件资源管理器的地址栏输入 `%USERPROFILE%\.dsh\skills`，回车
   - 如果提示文件夹不存在，就在 `.dsh` 里新建一个叫 `skills` 的文件夹
6. 把 `meeting-notes` 文件夹**整个复制**进 `~/.dsh/skills`

**应该看到：** `~/.dsh/skills/meeting-notes/SKILL.md` 这个文件存在。

## 5. 确认装好了

在 DSH 的输入框里输入 **`/`**，打开指令菜单，再输入 `meeting`。

**应该看到：** 菜单里出现 `meeting-notes`。

<!-- 截图待补:输入 `/` 后指令菜单里出现 meeting-notes。补图方法见 docs/screenshots.md -->

**没出现？** 按顺序检查：

1. 路径对不对：必须是 `~/.dsh/skills/meeting-notes/SKILL.md`，不能多一层
2. 文件名对不对：必须是 `SKILL.md`（全大写），不是 `skill.md`、不是 `SKILL.md.txt`
3. 头部信息对不对：`SKILL.md` 第一行必须是 `---`,`name` 和 `description` 都要有
4. 新开一个会话再试试

## 6. 确认 AI 真的用上了它

装上了，不代表 AI 会用。我们分两种情况测试。

### 测试一：让 AI 自己判断

新开一个会话，输入（**不要提 skill 的名字**）：

```
帮我把下面的内容整理成会议纪要:
今天下午小王、小李和我开了个会,说下个月的促销活动。
小王说预算 5000 块够了,小李觉得要 8000,最后定了 6000。
海报小李负责,下周三前给初稿。直播的时间还没定。
```

**看对话记录**：在 AI 回答之前，应该出现一行「**加载技能**」。点「**查看**」，确认加载的是 `meeting-notes`。

**再看结果**：是不是按 skill 里规定的格式（一、讨论了什么；二、做了哪些决定；三、待办事项表格；四、还没解决的问题），最后一行是不是“以上内容由 AI 根据原始记录整理，请核对。”

都对上了 → ✅ **AI 自己判断并用上了 skill。**

### 测试二：手动指定

如果 AI 没有自己加载，或者你想确保它一定用，就**手动叫**：

```
/meeting-notes 帮我整理:(粘贴上面那段内容)
```

### 测试三：不该用的时候不用

输入一句无关的话，比如 `今天天气怎么样?`。**应该看到：** 没有「加载技能」那一行。说明它不会乱用。

> [!TIP]
> **这三个测试，以后每装一个 skill 都建议做一遍。** 尤其是第三个：乱触发的 skill 会让 AI 在不相关的事上也照着它做，很烦人。

### AI 不自己调用，怎么办？

1. **换一种说法**：用 skill 的 `description` 里写到的词，比如“整理会议纪要”
2. **手动叫**：用 `/skill名字`
3. **改 `description`**：说明它写得不够清楚，第 17 章教你怎么改

## 7. ⚠️ 安装别人的 skill 前，先检查

skill 是**别人写的说明书，AI 会照着做**。有些 skill 还带脚本，会在你电脑上运行。坏的 skill 可能让 AI:

- 读取你的钥匙(`~/.dsh/.credentials.yaml`、`.env` 文件)并发到网上
- 删除文件
- 下载并运行别的程序

### 装之前看这 5 个地方

| 检查 | 怎么看 | 危险信号 |
|---|---|---|
| ① 来源 | GitHub 页面上的 Star(星)数、作者、最近更新时间 | 刚建的号、没人用、很久没更新 |
| ② `SKILL.md` 正文 | 通读一遍（看不懂就复制给 AI 翻译） | 要求"读取密钥 / 密码 / `.env`“、”把内容发送到某某网址“、”不要告诉用户" |
| ③ `scripts` 文件夹 | 看有哪些脚本 | 脚本里有陌生网址、`curl … \| sh` 这种“下载就运行”、看不懂的一大串乱码（base64） |
| ④ 要你装什么 | 正文里让 AI 安装哪些软件 | 要求从不知名网址下载安装 |
| ⑤ 许可证 | `LICENSE` 文件 | 没有许可证的，只能自己用，不能转发给别人 |

### 让 DSH 帮你检查（但别全信）

可以把 skill 下载到工作区，权限选「**仅可查看**」，问 DSH:

```
请检查 某某skill 文件夹里的所有文件(包括 scripts 里的脚本),
告诉我它会做哪些事:会不会联网、会不会读取密钥或密码文件、
会不会删除文件、会不会安装其他软件。用简单的中文列出来。
```

> [!WARNING]
> AI 的检查只能参考。写坏 skill 的人可能在文件里藏“骗 AI”的话（第 23 章讲的“提示词注入”）。**来源不明、星数很少、又带脚本的 skill，最好别装。**

## 8. 卸载 skill

直接删掉 `~/.dsh/skills/` 里对应的文件夹就行，不用重启。

## 9. 自己检查

- [ ] 我知道新手的 skill 放在 `~/.dsh/skills/`
- [ ] 我知道 `SKILL.md` 外面只能有一层文件夹
- [ ] 我装好了 `meeting-notes`，在 `/` 菜单里看到了它
- [ ] 我看到了「加载技能」那一行，确认 AI 用上了它
- [ ] 我做了“不该用时不用”的测试
- [ ] 我知道装别人的 skill 前要检查哪 5 个地方

## 10. 常见问题

**问：Mac 上看不到 `.dsh` 文件夹？**
答：它是隐藏文件夹。在访达里按 `⌘ + Shift + .` 显示隐藏文件，或者用 `⌘ + Shift + G` 直接输入路径。

**问：我同时用 Claude Code / Codex，能共用 skill 吗？**
答：能。放在 `~/.agents/skills/` 里的 skill,DSH 也会读。也可以在每个工具各自的 skill 文件夹里放一份。

**问：两个 skill 同名了怎么办？**
答：DSH 用优先级高的那个（项目里的优先于用户文件夹里的）。建议改掉其中一个的名字。

## 11. 想了解更多

- DSH 官方 skill 格式和目录说明：https://github.com/deepseek-ai/deepseek-harness/blob/master/packages/skill/skill-filesystem/README.zh.md
- 本教程的示例 skill:[skills/meeting-notes](https://github.com/zhubing20011218-hub/agent-teaching/blob/main/skills/meeting-notes/SKILL.md)
- 下一章：[第 14 章 实战一：让 AI 帮你做 PPT](14-ppt-make.md)
