#!/usr/bin/env bash
# 给学创 AI 配上(或更换)DeepSeek 钥匙。钥匙只放在服务器的 /opt/prismice/teach/api.env,不进 git。
#
# 用法(在仓库根目录):
#   1. 在仓库根目录的 .env 里写一行(.env 已在 .gitignore 里,不会被提交):
#        TEACH_ELF_DEEPSEEK_KEY=sk-你的钥匙
#      建议单独建一把钥匙给学创 AI 用,并在 DeepSeek 开放平台给它设用量上限
#   2. bash deploy/set-elf-key.sh
#
# 钥匙通过 ssh 的标准输入传过去,不会出现在命令行、进程列表或服务器的命令历史里。
# 想关掉 AI 回答(只留搜索):把 .env 里那一行删掉或留空,再运行一次。

set -euo pipefail
SSH_KEY="${PRISMICE_SSH_KEY:-$HOME/.ssh/hk_server_ai_ed25519}"
SSH_HOST="${PRISMICE_SSH_HOST:-root@154.219.113.151}"
SSH=(ssh -i "$SSH_KEY" -o IdentitiesOnly=yes -o BatchMode=yes -o ConnectTimeout=15 -p 52222 "$SSH_HOST")
REMOTE_DIR=/opt/prismice/teach

ROOT="$(cd "$(dirname "$0")/.." && pwd)"
cd "$ROOT"
fail() { printf '\n❌ %s\n' "$*" >&2; exit 1; }

[ -f .env ] || fail "仓库根目录没有 .env。先建一个,写一行 TEACH_ELF_DEEPSEEK_KEY=sk-...(参考 .env.example)"
KEY="$(grep -E '^TEACH_ELF_DEEPSEEK_KEY=' .env | tail -1 | cut -d= -f2- | tr -d "\"' \r" || true)"
if [ -n "$KEY" ]; then
  [[ "$KEY" == sk-* ]] || fail "TEACH_ELF_DEEPSEEK_KEY 看起来不像 DeepSeek 钥匙(应该以 sk- 开头)"
  echo "准备写入钥匙 sk-…${KEY: -4}(只显示最后 4 位)"
else
  echo "⚠️ .env 里 TEACH_ELF_DEEPSEEK_KEY 是空的:会清空服务器上的钥匙,学创 AI 只用搜索回答"
fi

[ -f .env ] && [ "$(stat -f %Lp .env 2>/dev/null || stat -c %a .env)" != 600 ] && chmod 600 .env

printf 'DEEPSEEK_API_KEY=%s\n' "$KEY" | "${SSH[@]}" "umask 077 && mkdir -p $REMOTE_DIR && cat > $REMOTE_DIR/api.env && chmod 600 $REMOTE_DIR/api.env" \
  || fail "连服务器失败(多半是 ssh 超时):等 20 秒原样重跑;不要改用 22 端口"

# 钥匙是启动时读的,要重建接口容器才生效(网站容器不用动)
"${SSH[@]}" "cd $REMOTE_DIR && [ -f compose.yml ] && docker compose up -d --force-recreate elf-api" </dev/null >/dev/null \
  || fail "接口容器重建失败。网站还没部署过的话,先运行 bash deploy/deploy.sh"

for i in 1 2 3 4 5 6 7 8 9 10; do
  H="$("${SSH[@]}" "docker exec prismice-caddy-1 wget -q -O - http://prismice-teach/api/elf/health 2>/dev/null || true" </dev/null)"
  if grep -q '"ok":true' <<<"$H"; then
    if grep -q '"ai":true' <<<"$H"; then echo "✅ 学创 AI 的 AI 回答已开启"; else echo "✅ 已关闭 AI 回答,学创 AI 现在只用搜索回答"; fi
    exit 0
  fi
  sleep 2
done
fail "接口没起来:在服务器上看 docker logs prismice-teach-api"
