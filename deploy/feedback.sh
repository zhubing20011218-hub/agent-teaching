#!/usr/bin/env bash
# 看看读者通过学创 AI 说了什么:反馈 + 教程里可能缺的内容
#
# 用法(在仓库根目录):
#   bash deploy/feedback.sh          看最近 30 天
#   bash deploy/feedback.sh 7        看最近 7 天
#
# 原始记录会下载到 .elf-data/server/(已在 .gitignore 里)。
# 注意:这是读者写的内容,仓库是公开的,不要把它复制进会提交的文件里。

set -euo pipefail
DAYS="${1:-30}"
SSH_KEY="${PRISMICE_SSH_KEY:-$HOME/.ssh/hk_server_ai_ed25519}"
SSH_HOST="${PRISMICE_SSH_HOST:-root@154.219.113.151}"
SSH=(ssh -i "$SSH_KEY" -o IdentitiesOnly=yes -o BatchMode=yes -o ConnectTimeout=15 -p 52222 "$SSH_HOST")
REMOTE_DIR=/opt/prismice/teach

ROOT="$(cd "$(dirname "$0")/.." && pwd)"
cd "$ROOT"
OUT=.elf-data/server
mkdir -p "$OUT"
for f in feedback.jsonl questions.jsonl; do
  "${SSH[@]}" "cat $REMOTE_DIR/data/$f 2>/dev/null || true" </dev/null > "$OUT/$f" \
    || { echo "❌ 连服务器失败(多半是 ssh 超时):等 20 秒原样重跑" >&2; exit 1; }
done
node scripts/elf-report.mjs "$OUT" "$DAYS"
