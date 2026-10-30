#!/usr/bin/env bash
# Stop: if TS files changed, typecheck before Claude finishes. On failure, exit 2 so Claude keeps working and fixes it.
input=$(cat)
# Avoid infinite loops: if we already blocked once this turn, let it stop.
[ "$(echo "$input" | jq -r '.stop_hook_active // false')" = "true" ] && exit 0
cd "$CLAUDE_PROJECT_DIR" || exit 0
git diff --name-only HEAD 2>/dev/null | grep -qE '\.(ts|tsx)$' || exit 0
# pnpm 12 rejects -s, so use the plain command and filter the output
out=$(pnpm typecheck 2>&1)
if [ $? -ne 0 ]; then
  echo "Typecheck failed. Fix before finishing:" >&2
  echo "$out" | grep -E 'error TS' | head -15 >&2
  exit 2
fi
exit 0
