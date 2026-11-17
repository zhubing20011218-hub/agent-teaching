# Skill 库审查工具

网站 Skill 库（`.vitepress/theme/skills.json`）就是用这几个文件生成的。更新 Skill 库时按顺序跑：

```bash
bash scripts/skill-audit/fetch.sh /tmp/skill-src          # 1. 下载源码到隔离文件夹（不运行）
node scripts/skill-audit/scan.cjs /tmp/skill-src > scripts/skill-audit/scan.jsonl   # 2. 扫描
python3 scripts/skill-audit/build.py /tmp/skill-src .vitepress/theme/skills.json     # 3. 生成
```

| 文件 | 作用 |
|---|---|
| `repos.txt` | 要下载的仓库 |
| `scan.cjs` | 按 DSH 的规则检查格式（用 DSH 自带的 YAML 解析器），并扫描说明书和脚本：联网、危险命令、钥匙、“骗 AI”的话 |
| `select.txt` | 入选的 skill：仓库、名字、分类、适合的身份、是否新手推荐 |
| `zh*.tsv` | 每个 skill 的中文名和一句话说明 |
| `build.py` | 合并以上内容，生成 `skills.json`；排除名单和特别提醒也写在这里 |

**扫描出问题的条目要人工逐行看**，确认是误报还是真问题。审查记录见 `docs/skill-audit-2026-11-17.md`。

注意：`scan.cjs` 用的是 DSH 桌面版自带的 yaml 库（路径写在文件开头），换电脑要改路径，或者 `npm i yaml` 后改成 `require('yaml')`。
