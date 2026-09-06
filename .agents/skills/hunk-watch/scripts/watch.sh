#!/usr/bin/env bash
set -euo pipefail

if [[ $# -ne 1 ]]; then
  printf 'Usage: bash watch.sh <hunk-session-id>\n' >&2
  exit 2
fi
command -v hunk >/dev/null
command -v jq >/dev/null
session=$1
state=$(mktemp -d "${TMPDIR:-/tmp}/hunk-watch.XXXXXX")
trap 'rm -rf -- "$state"' EXIT
trap 'exit 130' INT
trap 'exit 143' TERM
mkdir -m 700 "$state/cli"
seen="$state/seen"

fetch_comments() {
  local status=0
  TMPDIR="$state/cli" hunk session comment list "$session" --type user --json > "$state/out" 2> "$state/error" || status=$?
  # この監視プロセス専用の領域だけを回収します。
  find "$state/cli" -maxdepth 1 -type f -name '.*-00000000.so' -delete
  [[ $status -eq 0 ]] || return "$status"
  jq -e 'type == "object" and (.comments | type == "array") and all(.comments[]; .noteId | type == "string")' "$state/out" >/dev/null 2> "$state/error"
}

if ! fetch_comments; then
  printf 'HUNK-WATCH-ERROR: initial comment fetch failed\n' >&2
  command head -n 1 "$state/error" >&2
  exit 1
fi
jq -c '.comments[].noteId' "$state/out" > "$seen"
printf 'HUNK-WATCH-START pid=%s session=%s\n' "$$" "$session"
fails=0
while true; do
  sleep 3
  if ! fetch_comments; then
    fails=$((fails + 1))
    if [[ $fails -ge 3 ]]; then
      printf 'HUNK-SESSION-LOST: three consecutive fetch failures\n' >&2
      command head -n 1 "$state/error" >&2
      exit 1
    fi
    continue
  fi
  fails=0
  # 本文を通知へ含めず、位置情報も端末制御文字として解釈されない形式にします。
  jq --rawfile seen "$seen" -ac '.comments[] | select((.noteId | tojson) as $id | ($seen | split("\n") | index($id)) == null) | {noteId, filePath, line: (.newRange[0] // .oldRange[0])}' "$state/out" > "$state/rows"
  while IFS= read -r note; do
    printf 'NEW-COMMENT %s\n' "$note"
    printf '%s\n' "$note" | jq -c '.noteId' >> "$seen"
  done < "$state/rows"
done
