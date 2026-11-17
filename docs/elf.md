# 学创 AI：网站上的机器人向导（维护说明）

> 给维护网站的人看。读者看到的介绍页是 [/xuechuang](../xuechuang.md)。

## 它是什么

每一页右下角漂浮的小机器人，名字叫「学创 AI」。形象是原创的，用代码(SVG)画出来，不用图片文件。

| 功能 | 怎么做到的 |
|---|---|
| 边打字边搜 | 浏览器下载知识库 `/elf/index.json`（约 130KB，压缩后），在本地搜索，不经过服务器 |
| 直接问 | 按回车 → 服务器在知识库里找最相关的 6 节 → 交给 DeepSeek，只根据这些内容回答，附参考链接 |
| 划词提问 / 反馈 | 选中正文里的一段字，冒出「问学创 / 这段有问题」 |
| 读完一页问一句 | 在章节 / 身份 / 作品页面待满 20 秒并读到底，问“看懂了吗？”，点 👍 或 🤔 |
| 聊天里认出反馈 | AI 判断读者是在提意见时，在回答末尾加一个隐藏标记，服务器认出后存成反馈 |
| 发现教程缺什么 | 每个提问都记下“知识库最相关内容的得分”，得分低 = 教程里多半没讲 |

**没有“反馈按钮”**，这是 calmness 的要求：反馈要像聊天一样自然地收集。

### 9 个动作

形象和动作在 `.vitepress/theme/elf/XcRobot.vue`，每个动作对应一种情况：

| 动作 | 什么时候 |
|---|---|
| idle 待机 | 平时 |
| wave 打招呼 | 第一次来、鼠标移上去、睡醒、读完一页 |
| listen 倾听 | 读者在输入框打字 |
| search 翻找 | 输入框下面出现了搜索结果 |
| think 思考 | 等 AI 回答 |
| talk 讲解 | 回答一个字一个字出来 |
| cheer 开心 | 收到反馈、读者点 👍 |
| confused 疑惑 | 没找到、出错 |
| sleep 打盹 | 一分钟没人理它 |

页面 `/xuechuang` 上能同时看到 9 个动作，改形象后去那里检查。

## 文件在哪

| 文件 | 作用 |
|---|---|
| `.vitepress/elf-index.ts` | 生成知识库：全部章节、身份、作品、Skill 库 → `public/elf/index.json`。每次 `npm run dev` / `npm run build` 自动重新生成 |
| `elf/search.mjs` | 搜索（BM25，中文按两字一组 + 单字）。网页和服务器共用这一个文件 |
| `elf/server.mjs` | 服务器接口（Node，不用装依赖）：`/api/elf/chat`、`/api/elf/feedback`、`/api/elf/health` |
| `.vitepress/theme/elf/XcElf.vue` | 机器人按钮、对话框、划词、读完一页、打盹 |
| `.vitepress/theme/elf/XcRobot.vue` | 机器人形象和 9 个动作 |
| `deploy/teach-site/compose.yml` | 服务器上多了一个容器 `prismice-teach-api` |
| `deploy/teach-site/conf/Caddyfile` | `/api/*` 转给接口容器 |
| `deploy/set-elf-key.sh` | 把 DeepSeek 钥匙放到服务器 |
| `deploy/feedback.sh` | 查看读者的反馈和提问 |

改了网站内容，**不用管知识库**：部署时自动重新生成，接口发现文件变了会自动重新读。

## 开启 AI 回答（第一次）

没配钥匙时，学创 AI 照样能用：按回车时用搜索结果回答，反馈照样能收。

1. 在 DeepSeek 开放平台单独建一把钥匙给学创 AI 用，设好用量上限
2. 在仓库根目录 `.env` 里写 `TEACH_ELF_DEEPSEEK_KEY=sk-...`(参考 `.env.example`)
3. 先部署一次网站：`bash deploy/deploy.sh`（会创建接口容器）
4. `bash deploy/set-elf-key.sh`，看到“✅ AI 回答已开启”就好了

### 花费和防滥用

- 模型 `deepseek-flash`，每次回答最多 700 个 token，带 6 段资料（约 3 千字）。按 token 计费，价格看 https://api-docs.deepseek.com/zh-cn/quick_start/pricing ；上线后在开放平台看一周的实际用量再调 `ELF_DAILY_LIMIT`
- 每个 IP 每小时最多问 30 次、反馈 20 次；全站每天最多回答 800 次(compose.yml 里的 `ELF_DAILY_LIMIT`)
- 超过限制时，网页自动改用搜索回答，不会报错
- AI 只根据本站内容回答；让它写作业、闲聊，它会拉回教程

## 看反馈

```bash
bash deploy/feedback.sh
```

会列出：最近的反馈（哪一页、引用了哪段、读者原话、AI 概括）、点 👍 最多的页面、教程可能没讲到的问题、问得最多的页面。原始记录下载到 `.elf-data/server/`（不进 git）。

> ⚠️ 仓库是公开的。读者写的内容只在服务器和本机 `.elf-data/` 里，不要复制进会提交的文件。

## 隐私

- 不记录 IP、不记录读者身份。IP 只在内存里用来限流，一小时后清掉
- 提问会发给 DeepSeek 生成回答（网页上写明了）
- 对话框下方提醒读者不要发钥匙和密码

## 本机试运行

```bash
npm run dev                 # 网站：http://localhost:5173
node --env-file-if-exists=.env elf/server.mjs   # 接口：18787 端口(网站会自动转过去)
```

不启动接口也能看：网页会自动改用搜索回答。本机的提问和反馈存在 `.elf-data/`，用 `node scripts/elf-report.mjs .elf-data` 查看。

## 形象来源

参考了 DSH 社区插件 dsh-pet 的思路（用固定的几种状态表现“空闲 / 等待 / 运行 / 出错”），形象和动画是本项目原创，没有使用它的图片。
