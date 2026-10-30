---

name: next
description: Pick the next task from docs/TASKS.md (or the given task ID), implement it, verify, review and commit. The main build loop.
argument-hint: "[task-id e.g. T1.2]"
disable-model-invocation: true
---

Run one task end to end. Task: $ARGUMENTS (if empty, take the first unchecked task in `docs/TASKS.md` whose deps are all checked).

1. **Load only what's needed**: read the task block in `docs/TASKS.md`, then only the files it touches. Read `docs/PRD.md` or `docs/decisions.md` only if the task depends on them.
2. **Unknown external API?** Ask the `researcher` subagent instead of guessing.
3. **Plan**: for size M, write a plan of ≤8 bullets (files, functions, tests) in the chat, then proceed. Stop and ask me first only if the plan changes a public API, the token schema or a preset format.
4. **Build**: tests first for pure logic in `packages/core`. Keep CLI/MCP thin.
5. **Verify**: spawn `verifier`. Fix failures, then re-run until it passes (max 3 rounds; if it still fails, stop and report).
6. **UI touched?** (playground, presets, examples) Run `/critique` on the affected page.
7. **Review**: spawn `reviewer`. Fix every BLOCKING item, then re-verify.
8. **Close**: tick the task in `docs/TASKS.md`, add any decision to `docs/decisions.md`, make one conventional commit.
9. **Report** in ≤5 lines: done / verified / next task ID. If the context is heavy, suggest `/clear`.
