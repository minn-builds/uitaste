---

name: sync-docs
description: Bring CLAUDE.md, TASKS.md and decisions.md in line with the code after structural changes. Run every ~5 tasks or after any refactor.
disable-model-invocation: true
---

1. `git log --oneline -20` and `git diff HEAD~5 --stat` to see what changed.
2. Update `CLAUDE.md` only where it is now wrong (layout, commands, rules). Keep it under 100 lines; it loads every session, so every line costs tokens.
3. In `docs/TASKS.md`, tick finished tasks, split any task that turned out L, and add tasks you discovered.
4. Add missing entries to `docs/decisions.md` (deps added, formats chosen).
5. Commit `docs: sync`. Report the changes in ≤3 lines.
