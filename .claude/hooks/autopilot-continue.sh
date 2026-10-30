#!/usr/bin/env bash
# Stop hook: while autopilot is on and runnable tasks remain, don't let Claude stop. Exit 2 = keep going.
cat >/dev/null
cd "$CLAUDE_PROJECT_DIR" || exit 0
lock=.claude/autopilot.on
[ -f "$lock" ] || exit 0
n=$(( $(cat "$lock" 2>/dev/null || echo 0) + 1 ))
echo "$n" > "$lock"
# Safety cap on forced continues
if [ "$n" -gt 60 ]; then rm -f "$lock"; exit 0; fi
grep -qE '^- \[ \] T' docs/TASKS.md || { rm -f "$lock"; exit 0; }
echo "Autopilot is ON and docs/TASKS.md has open tasks. Continue the /autopilot loop with the next runnable task (see .claude/skills/autopilot/SKILL.md). If no task is runnable (only blocked deps left), do the Finish step." >&2
exit 2
