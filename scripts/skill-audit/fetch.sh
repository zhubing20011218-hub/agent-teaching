#!/usr/bin/env bash
# 下载 repos.txt 里每个仓库的源码到一个隔离文件夹（只解压，不运行任何东西）
# 用法：bash fetch.sh <下载到哪个文件夹>
set -u
OUT="${1:?请给出下载文件夹}"; HERE="$(cd "$(dirname "$0")" && pwd)"
mkdir -p "$OUT"
while read -r r; do
  [ -z "$r" ] && continue
  d="$OUT/${r/\//__}"; [ -d "$d" ] && continue
  mkdir -p "$d"
  if gh api "repos/$r/tarball" > "$d.tgz" 2>/dev/null && tar -xzf "$d.tgz" -C "$d" --strip-components=1 2>/dev/null; then rm -f "$d.tgz"; echo "ok $r"; else echo "FAIL $r"; rm -rf "$d" "$d.tgz"; fi
done < "$HERE/repos.txt"
