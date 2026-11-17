#!/usr/bin/env bash
# 把学创 AI 的两样"秘密"放到服务器上：DeepSeek 钥匙、后台管理员密码。
# 只写进服务器的 /opt/prismice/teach/api.env(权限 600)，不进 git。
#
# 用法(在仓库根目录)：
#   1. 在仓库根目录的 .env 里写(参考 .env.example；.env 在 .gitignore 里，不会被提交)：
#        TEACH_ELF_DEEPSEEK_KEY=sk-你的钥匙        # 留空 = 只用搜索回答，不花钱
#        TEACH_ELF_ADMIN_USER=admin                # 后台账号，默认 admin
#        TEACH_ELF_ADMIN_PASSWORD=一个长密码        # 至少 12 位；留空 = 关闭后台
#   2. bash deploy/set-elf-secrets.sh
#
# 安全做法：
#   - 钥匙通过 ssh 的标准输入传过去，不会出现在命令行、进程列表或服务器的命令历史里
#   - 密码只上传"指纹"(scrypt 加盐哈希)，服务器上没有密码原文
#   - 太短的密码直接拒绝(后台里是读者的原话，泄露了伤害的是读者)

set -euo pipefail
SSH_KEY="${PRISMICE_SSH_KEY:-$HOME/.ssh/hk_server_ai_ed25519}"
SSH_HOST="${PRISMICE_SSH_HOST:-root@154.219.113.151}"
SSH=(ssh -i "$SSH_KEY" -o IdentitiesOnly=yes -o BatchMode=yes -o ConnectTimeout=15 -p 52222 "$SSH_HOST")
REMOTE_DIR=/opt/prismice/teach

ROOT="$(cd "$(dirname "$0")/.." && pwd)"
cd "$ROOT"
fail() { printf '\n❌ %s\n' "$*" >&2; exit 1; }
val() { grep -E "^$1=" .env | tail -1 | cut -d= -f2- | sed -e 's/[[:space:]]*#.*$//' -e "s/^[\"']//" -e "s/[\"']$//" | tr -d '\r' || true; }

[ -f .env ] || fail "仓库根目录没有 .env。先复制 .env.example 为 .env 再填"
[ "$(stat -f %Lp .env 2>/dev/null || stat -c %a .env)" = 600 ] || chmod 600 .env

KEY="$(val TEACH_ELF_DEEPSEEK_KEY)"
ADMIN_USER="$(val TEACH_ELF_ADMIN_USER)"; ADMIN_USER="${ADMIN_USER:-admin}"
ADMIN_PW="$(val TEACH_ELF_ADMIN_PASSWORD)"

if [ -n "$KEY" ]; then
  [[ "$KEY" == sk-* ]] || fail "TEACH_ELF_DEEPSEEK_KEY 看起来不像 DeepSeek 钥匙(应该以 sk- 开头)"
  echo "DeepSeek 钥匙：sk-…${KEY: -4}(只显示最后 4 位)"
else
  echo "⚠️ 没有 DeepSeek 钥匙：学创 AI 只用搜索回答"
fi

HASH=""
if [ -n "$ADMIN_PW" ]; then
  [ "${#ADMIN_PW}" -ge 12 ] || fail "后台密码太短(现在 ${#ADMIN_PW} 位，至少 12 位)。像 123456 这种几秒就会被猜中，线上不能用"
  grep -qiE '^(123456|password|admin|qwerty)' <<<"$ADMIN_PW" && fail "后台密码太常见，换一个随机的(可以运行：openssl rand -base64 18)"
  [ "$ADMIN_PW" != "$ADMIN_USER" ] || fail "密码不能和账号一样"
  HASH="$(printf '%s' "$ADMIN_PW" | node --input-type=module -e "import { hashPassword } from './elf/admin.mjs'; let d = ''; process.stdin.on('data', (c) => (d += c)).on('end', () => process.stdout.write(hashPassword(d)))")"
  [[ "$HASH" == scrypt:* ]] || fail "生成密码指纹失败"
  echo "后台账号：$ADMIN_USER(密码只上传指纹)"
else
  echo "⚠️ 没有后台密码：后台(/admin)关闭"
fi

printf 'DEEPSEEK_API_KEY=%s\nELF_ADMIN_USER=%s\nELF_ADMIN_PASSWORD_HASH=%s\n' "$KEY" "$ADMIN_USER" "$HASH" \
  | "${SSH[@]}" "umask 077 && mkdir -p $REMOTE_DIR && cat > $REMOTE_DIR/api.env && chmod 600 $REMOTE_DIR/api.env" \
  || fail "连服务器失败(多半是 ssh 超时)：等 20 秒原样重跑；不要改用 22 端口"

# 这些设置是接口启动时读的，要重建接口容器才生效(网站容器不用动)
"${SSH[@]}" "cd $REMOTE_DIR && [ -f compose.yml ] && docker compose up -d --force-recreate elf-api" </dev/null >/dev/null \
  || fail "接口容器重建失败。网站还没部署过的话，先运行 bash deploy/deploy.sh"

for i in 1 2 3 4 5 6 7 8 9 10; do
  H="$("${SSH[@]}" "docker exec prismice-caddy-1 wget -q -O - http://prismice-teach/api/elf/health 2>/dev/null || true" </dev/null)"
  if grep -q '"ok":true' <<<"$H"; then
    grep -q '"ai":true' <<<"$H" && echo "✅ AI 回答：已开启" || echo "✅ AI 回答：关闭(只用搜索)"
    [ -n "$HASH" ] && echo "✅ 后台已开启：https://teach.prismice.cn/admin"
    exit 0
  fi
  sleep 2
done
fail "接口没起来：在服务器上看 docker logs prismice-teach-api"
