---
title: 第 7 章 🟡 选修:手写一个迷你 Agent
part: 第二部分 · 拿到钥匙,接上 DeepSeek
verified_with: openai Python 库 3.51(示例代码已用模拟回复测试循环逻辑)
last_checked: 2026-11-17
---

# 第 7 章 🟡 选修:手写一个迷你 Agent(约 80 行,代码全给)

> 🟡 **这是选修章。** 需要先学完第 6 章。不想学可以直接跳到 [第 8 章](08-install-dsh.md)。

> **学完这一章,你能:**
> - 亲手运行一个"会自己用工具"的迷你 Agent
> - 看懂 Agent 的核心秘密:**工具调用 + 循环**
> - 明白为什么 DSH 要做"权限审批"
>
> **前置:** 第 6 章(能运行 `chat.py`)

## 1. 为什么要学这个

第 2 章说 Agent = 大脑 + 双手 + 反复做。这一章你会**亲眼看到**这三样东西在代码里长什么样。

看完以后再用 DSH,你就知道它每一步到底在干什么,遇到问题也更容易想明白原因。

## 2. 讲解

### 工具调用:AI"申请"用工具

大模型只会输出文字,它怎么"用工具"?

办法是:**我们事先告诉 AI 有哪些工具可以用**(工具清单)。AI 想用的时候,不直接回答,而是回一段**特殊格式的"申请单"**:

```
我要用工具:read_file
参数:{"path": "笔记.txt"}
```

**我们的程序**看到申请单,就去真的执行 `read_file`,把读到的内容交回给 AI。AI 看到内容,再决定下一步。

这个机制的专业名称叫**工具调用**(Tool Calling,也叫 Function Calling)。

> 💡 关键:**真正执行工具的是你电脑上的程序,不是 AI。** 所以程序可以决定:哪些申请批准,哪些拒绝,哪些先问用户。

### 循环:一直做到 AI 说"完成"

```
把任务 + 工具清单发给 AI
重复:
    AI 回复了
    如果 AI 没有申请工具 → 它做完了,把回答给用户,结束
    如果 AI 申请了工具   → 执行工具,把结果加进聊天记录,再发给 AI
```

就这么简单。DSH、Claude Code 这些工业级的 Harness,核心也是这个循环,只是加了更多工具、审批、记忆管理等功能。

## 3. 跟着做

### 第一步:准备文件

1. 下载 [examples/mini_agent.py](../examples/mini_agent.py),放进 `ai-练习` 文件夹
2. 在 `ai-练习` 里随便放两个文本文件,比如第 1 章建的 `test.md`,再建一个 `购物清单.txt`,里面写:`鸡蛋、牛奶、面包`

### 第二步:运行

在终端里(记得先按第 6 章放好钥匙,并 `cd` 进 `ai-练习` 文件夹):

```bash
python3 mini_agent.py
```

出现 `你想让 AI 做什么?>` 时,输入:

```
看看这个文件夹里有什么,购物清单里要买什么?
```

**应该看到**类似这样的过程:

```
[第 1 圈] AI 要用工具 list_files,参数 {}
[第 2 圈] AI 要用工具 read_file,参数 {'path': '购物清单.txt'}

AI 的回答: 文件夹里有 mini_agent.py、test.md、购物清单.txt。购物清单上要买鸡蛋、牛奶和面包。
```

注意:**你没告诉它文件名**,它自己先"看"了文件夹,再决定读哪个文件。这就是 Agent。

### 第三步:读懂代码

打开 `mini_agent.py`,它分成三块,正好对应 Agent 的公式:

| 代码里的部分 | 对应 | 做什么 |
|---|---|---|
| `client = OpenAI(...)` | **大脑** | 连接 DeepSeek |
| `list_files`、`read_file`、`TOOL_SPECS` | **双手** | 两个工具,以及告诉 AI 的"工具清单" |
| `run_agent` 里的 `for` 循环 | **反复做** | 一圈一圈执行,直到 AI 不再申请工具 |

还有一个容易忽略但很重要的函数:`safe_path`。它确保 AI **只能看 `ai-练习` 文件夹里的东西**。试试问它:

```
帮我读一下上一级文件夹里的文件
```

它申请了,但会收到"不允许访问工作文件夹以外的地方"。**这就是最简单的"权限控制"。**

### 第四步:想一想——如果给它更大的权力?

现在它只能"看",不能"改"。假如我们加一个工具 `run_command`,让它可以**执行任何命令**:

- 好处:它能做的事一下子多了很多(改名、移动、安装软件……)
- 风险:如果 AI 理解错了,或者读到的文件里藏着坏指令(第 23 章讲的"提示词注入"),它可能执行**删除文件**之类的危险命令

所以**工业级 Harness 必须有审批**:危险操作先停下来,问你"可以吗?"。这就是你在 DSH 里会经常看到的确认弹窗。

## 4. 练习:加一个计算器工具

试着自己加一个工具 `calculator`,让 AI 算数时调用它。提示:

1. 写一个函数 `def calculator(expression: str) -> str:`,用 Python 算出结果(为了安全,只允许数字和 `+ - * / ( ) .`)
2. 把它加进 `TOOLS`
3. 在 `TOOL_SPECS` 里照着 `read_file` 的样子加一项说明

<details>
<summary>点这里看参考答案</summary>

```python
def calculator(expression: str) -> str:
    """计算一个算式,只允许数字和 + - * / ( ) ."""
    if not all(c in "0123456789+-*/(). " for c in expression):
        return "只能算加减乘除"
    return str(eval(expression))  # 上面已经限制了字符,这里才敢用 eval

TOOLS["calculator"] = calculator
TOOL_SPECS.append({"type": "function", "function": {
    "name": "calculator",
    "description": "计算加减乘除算式,例如 (3+5)*2",
    "parameters": {"type": "object", "properties": {
        "expression": {"type": "string", "description": "算式"}}, "required": ["expression"]},
}})
```

把这段放在 `TOOL_SPECS = [...]` 那一大段的**后面**、`def run_agent` 的**前面**。

</details>

## 5. 本章结论

你刚刚运行的,就是一个**迷你版的 DSH**。DSH 在这个基础上帮你做好了:

- 几十个现成的工具(读写文件、运行命令、上网、子任务……)
- 危险操作的审批
- 聊天记录的保存和压缩
- skill、MCP、插件这些扩展方式
- 好用的界面

下一部分,我们就来用这个"工业级"的版本。

## 6. 自己检查

- [ ] 我成功运行了 `mini_agent.py`,看到了"第 1 圈、第 2 圈"
- [ ] 我知道工具是由**我电脑上的程序**执行的,不是 AI
- [ ] 我能指出代码里"大脑、双手、反复做"分别在哪
- [ ] 我理解为什么 Harness 需要审批

## 7. 常见问题

**问:AI 没有用工具,直接说"我无法访问你的文件"?**
答:换个说法,明确一点,比如"请用工具查看当前文件夹"。不同时候 AI 的判断会有差异。

**问:报错 `KeyError: 'DEEPSEEK_API_KEY'`?**
答:钥匙没放进环境变量,重新做第 6 章第一步。

**问:为什么限制最多 10 圈?**
答:防止 AI 陷入死循环,一直花你的钱。DSH 也有类似的保护。

## 8. 想了解更多

- DeepSeek 工具调用官方说明:https://api-docs.deepseek.com/zh-cn/guides/function_calling
- 想从零造一个更完整的 Harness:[xbsheng/deepseek-harness-tutorial](https://github.com/xbsheng/deepseek-harness-tutorial)(mini-dsh 教程)
- 下一章:[第 8 章 安装 DSH](08-install-dsh.md)
