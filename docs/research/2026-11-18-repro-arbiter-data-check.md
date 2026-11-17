# 「复现仲裁 Agent」数据核实报告(2026-11-18)

> 目的:在动手做参赛项目「复现仲裁 Agent」(StudyHack 学习科研赛道)之前,先确认它依赖的公开数据真实存在、能下载、能找到够用的争议案例。
> 结论先说:**数据真实、公开、可用;争议案例足够多,而且比预想的更有意思。** 但有两个风险要提前规划(见第 4 节)。

## 1. 数据来源(全部公开,无需登录)

| 内容 | 地址 | 大小 |
|---|---|---|
| 挑战说明、论文列表 | https://huggingface.co/datasets/ICML-2026-agent-repro/challenge | 约 17 MB |
| 每份复现记录的逐条裁决 | https://huggingface.co/datasets/ICML-2026-agent-repro/verdicts (`verdicts_final.json`) | 27.6 MB |
| 每份复现记录本身(logbook) | 各参赛者的 HF Space,例如 `AceVikings/68AMoK2YNk` | 每份几十 KB |

裁决数据的结构:每份复现记录 → 若干条「结论(claim)」→ 每条有 `verdict`(判定)和 `evidence`(一句话证据)。判定由 GLM-5.2 这个 AI 裁判给出。

## 2. 新闻数字核对

| 新闻说法 | 我实际算出来的 | 是否一致 |
|---|---|---|
| 判定了 35,908 条结论 | 35,908 条 | ✅ 完全一致 |
| 约 6,816 份复现记录 | 6,885 份 | ✅ 基本一致(统计口径略不同) |
| 覆盖 2,226 篇论文 | 2,176 篇 | ✅ 基本一致 |
| 242 篇论文出现「结论相反」 | 243 篇(我用文字相似度匹配同一条结论) | ✅ 基本一致 |

判定分布:verified(复现成功)17,167 / inconclusive(说不清)9,425 / toy(规模太小)7,617 / falsified(被推翻)1,699。

另外:1,035 篇论文有 ≥2 份独立复现记录,这是「仲裁」的原料。

## 3. 关键发现:「结论相反」其实分好几种,并不都是论文错了

逐条看了 12 篇争议论文后,争议大致分 5 类。**这正是仲裁 Agent 要做的分类工作**:

| 类型 | 例子(论文 ID) | 实际情况 |
|---|---|---|
| ① 同样的数字,不同的读法 | Minimizing Upper Confidence Bounds(eXLcL70GXO) | 两边测到的覆盖率几乎一样(都在 0.95 以上),一边认为符合「接近 0.95」,一边认为「超过 0.95 不算接近」→ 是**措辞争议**,不是复现失败 |
| ① 同上 | Accurate Large-sample UQ(Zkj9ctQdMM) | 两边都发现对手方法误差约大 3 倍但没到无穷大;一边认为符合论文说的「发散」,一边认为不符合 → **措辞争议** |
| ② AI 裁判判错 | In-Context Continual Learning(68AMoK2YNk) | 推翻方自己的记录写的是「仍未解决」(unresolved),AI 裁判却判成「推翻」 |
| ③ 边界反例 | To Grok Grokking(5nNNVY8NW4) | 推翻方找到一组满足论文条件、却让训练爆炸的参数。**我用自己写的代码独立验算:确实成立**(见下) |
| ④ 结论被抄错 | k-Means 高维失败(4CwO8At8Hw) | 推翻方查了论文 TeX 源码,发现结论文字里的公式和原文不一样(2c̄ vs √(2c̄)),是**提取结论时抄错**,不是论文错 |
| ⑤ 测的范围不同 | Minimum Distance Summaries(lq8fNVME8v) | 支持方根本没测论文提到的那几个对比方法 → 「支持」证据不完整 |

### 独立验算(③ Grokking 反例)

用纯 Python 重新算(没有运行别人的代码):H = diag(100, 1, 0)、λ = 1e-6、学习率 η = 0.1。

- 论文印出来的条件 η < 1/(λ + μ_min) = 1,000,000 → **满足**
- 但第一维的梯度下降乘数是 1 − 0.1 × 100 = **−9**,绝对值大于 1 → 一定发散
- 实测:损失从 50.5 → 15 步后 2.1 × 10³⁰
- 如果条件里用的是 μ_max(最大特征值),需要 η < 0.0099,反例就不成立

→ 很可能是论文把 μ_max 印成了 μ_min(或者结论提取时抄错)。**还需要打开论文原文确认**,这一步还没做。

这一个例子就说明了项目的价值:**AI 们吵架时,很多时候谁都没「跑错」,真正的问题在措辞、在裁判、在抄写**;能把这些分开,才算真的讲清楚了一篇论文。

## 4. 风险(必须提前规划)

1. **代码大多不公开**:每份记录的 Traces(AI 操作过程)和 Artifacts(产出文件)默认是私有的(实测返回 401)。公开 Space 里通常只有文字页面和少量脚本;抽查 30 篇争议论文的 426 份记录,只有 86 份(约 20%)带 `.py` 文件。
   → 对策:仲裁主要依据**公开的文字记录 + 自己重写最小验证代码**,而不是「对比两边代码」。上面的 Grokking 验算就是这种做法,几秒钟就能完成。
2. **很多复现用了 GPU**:挑战要求在 HF GPU Job 上跑实验。
   → 对策:演示只选**理论 / 数值类论文**。按证据文字筛选,243 篇争议论文里约 189 篇看起来不需要 GPU(粗筛,有误差)。
3. **AI 裁判数据本身有噪声**:类型 ② 说明官方判定不能当「标准答案」。
   → 对策:评估效果时用人工确认过的案例,或者自己往正确复现里埋 bug 来测。
4. 空间名字和论文对不上的记录有一些(粗筛 131 份,含大量误报,比如用论文编号命名的),不影响主线,先不处理。

## 5. 首批候选案例(都是理论/数值类、普通电脑可验证)

| 论文 ID | 论文 | 带代码的记录数 | 争议类型(初判) |
|---|---|---|---|
| 5nNNVY8NW4 | To Grok Grokking: Provable Grokking in Ridge Regression | 4/38 | ③ 边界反例(已独立验算) |
| 68AMoK2YNk | Understanding Generalization and Forgetting in In-Context Continual Learning | — | ② 裁判误判 |
| eXLcL70GXO | Minimizing Upper Confidence Bounds | 4/12 | ① 措辞争议 |
| Zkj9ctQdMM | Accurate Large-sample UQ using SG-MCMC | 5/13 | ① 措辞争议 |
| 4CwO8At8Hw | The Catastrophic Failure of the k-Means Algorithm in High Dimensions | 2/16 | ④ 结论抄错 |
| lq8fNVME8v | Minimum Distance Summaries for Robust NPE | 4/17 | ⑤ 范围不同 |
| uYWVGk1Qt0 | Towards Understanding Adam Convergence on Highly Degenerate Polynomials | 4/21 | ③ 边界反例(待验算) |
| zrn7rRuvhW | Attention's forward pass and Frank-Wolfe | 4/19 | ③ 精确有理数反例(待验算) |
| q7mB5s1ie1 | Operator Splitting with Hamilton-Jacobi-based Proximals | 4/14 | ③ 假设允许无最小值(待验算) |
| ANVg7NnupP | Demystifying LLM-as-a-Judge | 4/16 | ③ 高阶项系数不符(待验算) |

## 6. 下一步

1. 打开上表 10 篇论文的原文,确认每个争议的「真相」→ 得到人工标注的标准答案(这是评估仲裁 Agent 准不准的基础)。
2. 把 5 类争议写成仲裁 Agent 的判定流程:先看两边数字是否一致 → 一致则查措辞;不一致则找设置差异 → 必要时自己写最小代码验算。
3. 做一个最小可演示版本:输入论文 ID,输出分类 + 证据链。

## 附:本次用到的脚本与中间文件

中间数据放在本次会话的临时目录(会被清理,需要时可重新下载):`verdicts.json`、`disputes.json`(4,052 对争议结论)、`cpu_candidates.json`、`shortlist.json`。
