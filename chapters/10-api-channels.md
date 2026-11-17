---
title: 第 10 章 接其他 AI：厂商渠道和自定义渠道
part: 第三部分 · 接入和使用 DeepSeek Harness
verified_with: dsh 0.2.2-rc.3（按桌面版界面文字和内置厂商列表核对）
last_checked: 2026-11-17
---

# 第 10 章 接其他 AI：厂商渠道和自定义渠道

> **学完这一章，你能：**
> - 分清 DSH 的三种接法：官方、厂商渠道、自定义渠道
> - 找到每一种接法的入口，知道每个框该填什么
> - 弄懂“API 地址”：为什么要填、去哪里找、怎么从文档里抠出来
> - 看到报错，自己判断是钥匙、地址、协议还是模型名出了问题
>
> **前置：** 第 3 章（API 是什么）、第 9 章（DSH 已经接上 DeepSeek）

## 1. 为什么要学这个

第 9 章接的是 DeepSeek 官方，几乎不用动脑。

但你迟早会遇到这些情况：

- 想试试 Kimi、通义、GLM 等其他家的 AI
- 学校或公司给了你一个“内部 AI 地址”
- 你买了某个中转站的额度（第 11 章专门讲）

这时候，新手最常卡在三个地方：

1. **找不到入口**：不知道在哪里添加
2. **不知道地址填什么**：服务商给了一堆网址，不知道哪个才对
3. **填了就报错**：`404`、`401`，看不懂

这一章就解决这三件事。

## 2. 讲解

### 一个比喻：寄快递

让 DSH 去找一个 AI，就像寄一个快递。要寄到，**四样东西缺一不可**：

| 寄快递 | 接 AI | 填错了会怎样 |
|---|---|---|
| 收件地址 | **API 地址** | 寄到别人家，或者查无此地址（`404`） |
| 会员卡 | **API 钥匙** | 对方不认你（`401`） |
| 用哪家快递的单子 | **API 协议** | 单子格式不对，对方看不懂 |
| 收件人姓名 | **模型名** | 地址对了，但查无此人（`model not found`） |

- **API 地址**：AI 服务在网上的“门牌号”。英文叫 Base URL，也有人叫接口地址、Endpoint。
- **API 协议**：请求要按哪种格式写。第 3 章讲过，各家 AI 的“点菜单”格式不一样。
- 钥匙和模型名，第 5 章、第 9 章都见过了。

### DSH 的三种接法

| 接法 | 俗称 | 在 DSH 里的入口 | 你要填 | API 地址 |
|---|---|---|---|---|
| DeepSeek 官方 | 官方渠道 | 欢迎页「添加 API Key」，或「设置」→「模型」→ DeepSeek 卡片 | 钥匙 | 不用填 |
| 内置厂商 | **厂商渠道** | 「添加模型提供商」→「**第三方模型提供商**」 | 选厂商 + 钥匙 | 一般不用填 |
| 其他所有 | **自定义渠道** | 「添加模型提供商」→「**自定义模型 API**」 | 地址 + 协议 + 钥匙 + 模型 | **必须自己填** |

**为什么厂商渠道不用填地址？** DSH 里有一本“通讯录”，记着几十家大厂的门牌号。你选了哪家，它就自动用哪家的地址。

**为什么自定义渠道必须填？** 通讯录里没有这一家，DSH 不知道往哪里寄，只能你告诉它。

> [!TIP]
> “渠道”是中转站后台常用的叫法。DSH 界面里叫「**提供商**」。两个词说的是同一件事：一个能调用 AI 的来源。

### 我该用哪一种？

按顺序问自己：

1. 用的是 DeepSeek 官方吗？→ 用第 9 章的方法，不用往下看。
2. 这家公司在 DSH 的「第三方模型提供商」列表里吗？→ 用**厂商渠道**（第 3 节）。
3. 不在列表里？比如学校网关、中转站、自己搭的服务 → 用**自定义渠道**（第 4 节）。

## 3. 跟着做：厂商渠道（以 Kimi 为例）

### 第一步：先去那家公司申请钥匙

每家公司的钥匙**互不通用**。DeepSeek 的钥匙不能拿去用 Kimi。

1. 打开 Kimi 开放平台。国内版是 https://platform.moonshot.cn
2. 注册、充值、创建 API Key，方法和第 5 章一样
3. 把钥匙存进你的密码记事本

### 第二步：在 DSH 里添加

1. 打开「**设置**」→「**模型**」
2. 点「**添加模型提供商**」
3. 「添加方式」选「**第三方模型提供商**」（默认就是它）
4. 在「**提供商**」列表里选 `moonshotai-cn`
5. 在「**API 密钥**」框里粘贴钥匙
6. **「API 地址」那一栏不要动**。框里的灰字是默认地址，或者写着「由提供方配置地址」，意思是 DSH 已经知道地址了
7. 点「**保存**」

**应该看到：** 模型列表里多了一张 Kimi 的卡片，显示「API 密钥已配置」。

<!-- 截图待补：添加模型提供商 → 第三方模型提供商，选择 moonshotai-cn（钥匙打码）。补图方法见 docs/screenshots.md -->

### 第三步：测试

1. 新建一个会话
2. 在输入框旁边的模型选择器里，选一个 Kimi 的模型
3. 发一句：`你好，用一句话介绍你自己`

**应该看到：** 有回复。如果报错，看第 5 节的对照表。

### ⚠️ 最容易踩的坑：国内版和国际版

很多公司在中国和海外有**两套网站**，钥匙**不通用**。DSH 列表里也是两个名字：

| 列表里的名字 | 对应网站 | DSH 默认用的地址 |
|---|---|---|
| `moonshotai-cn` | Kimi 国内版 platform.moonshot.cn | `https://api.moonshot.cn/v1` |
| `moonshotai` | Kimi 国际版 platform.moonshot.ai | `https://api.moonshot.ai/v1` |
| `minimax-cn` | MiniMax 国内版 | `https://api.minimaxi.com/anthropic` |
| `minimax` | MiniMax 国际版 | `https://api.minimax.io/anthropic` |

**规则：钥匙在哪个网站申请的，就选哪个版本。** 一般名字带 `-cn` 的是国内版。

选反了，钥匙明明是对的，也会报 `401`。

> [!TIP]
> 厂商渠道里的「API 地址」**不是不能填**，而是**一般不用填**。只有服务商明确告诉你“请改用某某地址”时，才填进去。不确定就留空。

## 4. 跟着做：自定义渠道

### 第一步：动手前，先凑齐四样东西

打开服务商的文档或后台，把这四样找出来，抄在记事本里：

| 要找的 | 去哪里找 | 常见的叫法 |
|---|---|---|
| ① API 地址 | 文档的“快速开始”“接入说明”“API 文档”；后台首页 | Base URL、API 地址、接口地址、请求地址、Endpoint、API Host |
| ② API 协议 | 同上。文档会说“兼容 OpenAI”或“兼容 Anthropic” | 兼容 OpenAI 格式、OpenAI 兼容接口、Claude 格式 |
| ③ API 钥匙 | 后台的“API Keys”“令牌”“密钥管理” | API Key、令牌、Token、密钥，多数以 `sk-` 开头 |
| ④ 模型名 | 文档的“模型列表”；后台的“模型广场”“价格” | Model、模型 ID、model name |

> [!WARNING]
> 四样里**只有钥匙是机密**。地址、协议、模型名可以随便抄、随便问人；钥匙不要发给任何人，也不要贴进 AI 的聊天框。

### 第二步：从文档里“抠出”正确的地址

这是新手最容易错的一步。

服务商的文档里，常常给你看的是**完整地址**（后面带着具体的功能）。DSH 要的是**基础地址**：把后面那截“功能名”去掉。

| 协议 | 文档里常见的完整地址 | 去掉这一截 | 填进 DSH 的 API 地址 |
|---|---|---|---|
| OpenAI Chat Completions | `https://api.example.com/v1/chat/completions` | `/chat/completions` | `https://api.example.com/v1` |
| OpenAI Responses | `https://api.example.com/v1/responses` | `/responses` | `https://api.example.com/v1` |
| Anthropic Messages | `https://api.example.com/v1/messages` | `/v1/messages` | `https://api.example.com` |
| Gemini API | `https://api.example.com/v1beta/models/模型名:generateContent` | `/models/……` | `https://api.example.com/v1beta` |

**规律：**
- OpenAI 格式：通常**以 `/v1` 结尾**
- Anthropic 格式：通常**不带 `/v1`**
- Gemini 格式：通常以 `/v1beta` 结尾

**DSH 会提示你。** 在自定义渠道里先选好「API 协议」，再看「API 地址」框里的灰字示例：

- 选 OpenAI 协议，灰字是 `https://gateway.example/v1`
- 选 Anthropic Messages，灰字是 `https://gateway.example`
- 选 Gemini API，灰字是 `https://gateway.example/v1beta`

照着灰字的样子填，就不容易错。

> [!TIP]
> **文档写的和上面规律不一样时，以文档为准。** 比如 DeepSeek 自己的 OpenAI 格式地址就是 `https://api.deepseek.com`，后面不用加 `/v1`（加了也能用）。

### 第三步：四种协议怎么选

| DSH 里的选项 | 什么时候选 |
|---|---|
| **OpenAI Chat Completions** | 文档写“兼容 OpenAI”。**最常见，拿不准就先选它** |
| OpenAI Responses | 文档明确写了支持 Responses 接口 |
| Anthropic Messages | 文档写“兼容 Anthropic / Claude 格式” |
| Gemini API | 文档写“兼容 Gemini 格式” |

同一个服务常常几种都支持。这时选 OpenAI Chat Completions 最稳。**协议和地址要配套**：换了协议，地址也要按上一步的表跟着改。

### 第四步：在 DSH 里填写

1. 「**设置**」→「**模型**」→「**添加模型提供商**」
2. 「添加方式」选「**自定义模型 API**」
3. 按下面的表逐项填写：

| 框 | 填什么 | 例子 |
|---|---|---|
| **Provider ID** | 给它起个代号。小写字母开头，只能用小写字母、数字、短横线。⚠️ **建好后不能改** | `school-ai`、`relay1` |
| **显示名称** | 你自己看的名字，随便起 | 学校 AI |
| **API 协议** | 第三步选的那个 | OpenAI Chat Completions |
| **API 地址** | 第二步抠出来的基础地址 | `https://api.example.com/v1` |
| **API 密钥** | 粘贴钥匙 | `sk-……` |

4. 在「**模型目录**」里点「**获取可用模型**」
   - 弹出「选择模型」窗口，勾选你要用的模型，点「**更新列表**」
   - 如果提示「该提供商没有列出任何模型」或者获取失败：点「**添加模型**」，在「**模型 ID**」里手动填模型名，一个字母都不能错
5. 点「**创建提供商**」

**应该看到：** 模型列表里多了一张卡片，带一个「自定义」小标签。

<!-- 截图待补：添加模型提供商 → 自定义模型 API 的填写界面（钥匙打码）。补图方法见 docs/screenshots.md -->
<!-- 截图待补：获取可用模型 → 选择模型 弹窗。补图方法见 docs/screenshots.md -->

### 第五步：测试

1. 新建一个会话，在模型选择器里选新加的模型
2. 发一句：`你好，用一句话介绍你自己`

**应该看到：** 有回复。

> [!WARNING]
> 别用“你是哪个模型？”来确认身份。AI 经常答错自己是谁。怎么判断用的是不是真模型，第 11 章会讲。

### 改错和删除

- **地址、钥匙、模型填错了**：在卡片上点「**编辑**」，改完点「**保存**」
- **Provider ID 填错了**：它改不了。新建一个正确的，再在旧卡片上点「**删除**」

## 5. 填错了会怎样：报错对照表

把报错和下表对一对，基本都能找到原因。下面的报错文字是真实例子。

| 你看到的 | 多半是 | 怎么办 |
|---|---|---|
| 填写时提示「请输入有效的 HTTP 或 HTTPS 地址。」 | 地址前面少了 `https://`，或者混进了空格、中文标点 | 重新复制地址，确认以 `https://` 或 `http://` 开头 |
| `404`、`Invalid URL (POST /v1beta/models)`、`Not Found` | **地址路径不对**：多了或少了 `/v1`，`/v1` 写了两遍，或者把 `/chat/completions` 也贴进去了 | 按第 4 节第二步的表重新抠地址 |
| `401`、`令牌无效：请检查 Authorization 头……`、`invalid api key` | **钥匙不对**：复制不完整、已被删除；或者钥匙和地址不是同一家；或者国内版、国际版选反了 | 重新复制钥匙；确认钥匙和地址来自同一个网站 |
| `model not found`、`模型不存在`、`无可用渠道` | **模型名不对**，或者你的账号没有开通这个模型 | 用「获取可用模型」重新选；或者去后台核对模型名 |
| 「响应格式错误」、回复是一堆乱码 | **协议选错了** | 换成文档说的协议，地址也跟着改 |
| 一直转圈、超时、「网络错误」 | **网络不通**。内网地址（比如 `http://10.……`）离开单位网络就连不上 | 检查网络、VPN；第 11 章细讲 |
| 「获取可用模型」失败，但聊天正常 | 有些服务不提供模型列表 | 不影响使用，手动「添加模型」就行 |

> [!TIP]
> **一次只改一样。** 改了地址就测一次，再改钥匙。四样一起改，即使好了，你也不知道到底是哪一样错了。

## 6. 练习

选一个和你最像的角色来做。

### 🎓 小林（大学生）：用自定义渠道再接一次 DeepSeek

不用花钱，也不用注册新网站，用你第 5 章的 DeepSeek 钥匙就能练。

1. 「添加模型提供商」→「自定义模型 API」
2. Provider ID 填 `ds-practice`
3. API 协议选「OpenAI Chat Completions」
4. API 地址填 `https://api.deepseek.com`
5. 粘贴你的 DeepSeek 钥匙
6. 「获取可用模型」，勾选 `deepseek-flash`
7. 创建，然后用它发一句话

**成功之后：** 故意把地址改成 `https://api.deepseek.com/v1/chat/completions` 保存再试，看看报什么错。然后改回来。

**练完：** 删掉这张练习卡片，以免和官方卡片混在一起。

### 👩‍🏫 王老师（大学老师）：从学校的接入说明里找出四样东西

学校发来这样一段说明（示例）：

```text
校内 AI 服务接入说明
接口兼容 OpenAI 格式。
调用示例：
curl http://10.20.30.40:3000/v1/chat/completions \
  -H "Authorization: Bearer 你的令牌" \
  -d '{"model": "deepseek-flash", "messages": [...]}'
令牌请登录 http://10.20.30.40:3000 后在「令牌」页面创建。
仅限校园网或学校 VPN 访问。
```

请写出：① API 地址 ② API 协议 ③ 钥匙去哪里拿 ④ 模型名。

<details>
<summary>参考答案</summary>

- ① API 地址：`http://10.20.30.40:3000/v1`（去掉 `/chat/completions`）
- ② API 协议：OpenAI Chat Completions（说明里写了“兼容 OpenAI 格式”）
- ③ 钥匙：登录 `http://10.20.30.40:3000`，在「令牌」页面创建
- ④ 模型名：`deepseek-flash`
- 额外注意：只能在校园网或学校 VPN 里用。回家连不上是正常的。

</details>

### 🛒 阿杰（电商）：同一个中转站，两种协议

某中转站的文档里写着：

```text
OpenAI 格式：POST https://api.example-relay.com/v1/chat/completions
Claude 格式：POST https://api.example-relay.com/v1/messages
```

如果你在 DSH 里分别选这两种协议，API 地址各填什么？

<details>
<summary>参考答案</summary>

- 选「OpenAI Chat Completions」：`https://api.example-relay.com/v1`
- 选「Anthropic Messages」：`https://api.example-relay.com`（去掉整个 `/v1/messages`）

</details>

## 7. 自己检查

- [ ] 我能说出官方、厂商渠道、自定义渠道的入口分别在哪里
- [ ] 我知道厂商渠道一般不用填地址，以及为什么
- [ ] 我知道“国内版”和“国际版”要和钥匙的来源对上
- [ ] 我能从文档的完整地址里抠出 DSH 要的基础地址
- [ ] 看到 `404`，我知道先查地址；看到 `401`，我知道先查钥匙
- [ ] 我用自定义渠道成功接过一次 DeepSeek

## 8. 常见问题

**问：厂商渠道和自定义渠道都能接 Kimi，选哪个？**
答：选厂商渠道。少填好几样，出错的机会也少。

**问：同一家服务能加两次吗？**
答：可以，Provider ID 不一样就行。比如一个走官方，一个走学校网关。

**问：地址末尾要不要加 `/`？**
答：不要加。`https://api.example.com/v1` 就好，不要写成 `https://api.example.com/v1/`。

**问：钥匙保存在哪里？换电脑要重新填吗？**
答：保存在你电脑的 DSH 设置文件夹里，不会同步到别的电脑。换电脑要重新填。

**问：DSH 里 DeepSeek 官方卡片的地址为什么是 `https://api.deepseek.com/anthropic`？**
答：DSH 和 DeepSeek 官方之间用的是 Anthropic 格式，所以地址带 `/anthropic`。自定义渠道里你选的是 OpenAI 格式，地址就是 `https://api.deepseek.com`。**同一家公司，协议不同，地址就不同。**

## 9. 想了解更多

- DSH 官方模型配置指南：https://github.com/deepseek-ai/deepseek-harness/blob/master/docs/user/guide/providers.zh.md
- 下一章：[第 11 章 中转站：学校网关和公开中转站](11-relay-station.md)
