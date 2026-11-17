# Skill 库审查工具

网站 Skill 库（`.vitepress/theme/skills.json`）就是用这几个文件生成的。更新 Skill 库时按顺序跑：

```bash
bash scripts/skill-audit/fetch.sh /tmp/skill-src                                        # 1. 下载源码到隔离文件夹（不运行）
node scripts/skill-audit/scan.cjs /tmp/skill-src > scripts/skill-audit/scan.jsonl          # 2. 格式和安全扫描
python3 scripts/skill-audit/quality.py /tmp/skill-src > scripts/skill-audit/quality.jsonl  # 3. 说明书质量打分
python3 scripts/skill-audit/select2.py                                                    # 4. 按规则筛选 → select-final.txt
python3 scripts/skill-audit/build.py /tmp/skill-src .vitepress/theme/skills.json          # 5. 生成网站数据
```

| 文件 | 作用 |
|---|---|
| `repos.txt` | 要下载的仓库 |
| `scan.cjs` | 按 DSH 的规则检查格式（用 DSH 自带的 YAML 解析器），并扫描说明书和脚本：联网、危险命令、钥匙、“骗 AI”的话 |
| `quality.py` | 给说明书打质量分（满分 7）：长度、分步流程、输出模板、示例、何时使用；依赖外部服务越多扣分 |
| `select.txt`、`add2.txt` | 候选名单：仓库、名字、分类、适合的身份、是否新手推荐 |
| `select2.py` | 筛选规则：≥300 星、近半年更新、质量分 ≥5、外部服务 ≤2；人工放行名单 `KEEP_LOW` 和排除名单 `DROP` 都写在这里，每条有原因 |
| `zh*.tsv` | 每个 skill 的中文名和一句话说明（后面的文件覆盖前面的） |
| `build.py` | 合并以上内容，生成 `skills.json`，并给每条写审查结论 |

**扫描出问题的、分数在边界上的，都要人工看说明书原文再决定。** 审查记录见 `docs/skill-audit-2026-11-17.md`。

注意：`scan.cjs` 用的是 DSH 桌面版自带的 yaml 库（路径写在文件开头），换电脑要改路径，或者 `npm i yaml` 后改成 `require('yaml')`。
