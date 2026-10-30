#!/usr/bin/env bash
# PostToolUse: auto-format the edited file so Claude never spends tokens on formatting.
f=$(jq -r '.tool_input.file_path // empty')
[ -z "$f" ] && exit 0
case "$f" in
  *.ts|*.tsx|*.js|*.jsx|*.mjs|*.json|*.css)
    cd "$CLAUDE_PROJECT_DIR" && pnpm exec biome check --write "$f" >/dev/null 2>&1 || true ;;
esac
exit 0
