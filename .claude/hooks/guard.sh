#!/usr/bin/env bash
# PreToolUse: block hand edits to generated or secret files. Exit 2 = block, and stderr is shown to Claude.
f=$(jq -r '.tool_input.file_path // empty')
[ -z "$f" ] && exit 0
case "$f" in
  *pnpm-lock.yaml|*/dist/*|*/.env|*/.env.*|*/node_modules/*)
    echo "Blocked: $f is generated or secret. Change the source/config instead (e.g. run pnpm add)." >&2
    exit 2 ;;
esac
exit 0
