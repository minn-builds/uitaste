# How to run this project with Claude Code

## 1. Setup (once, 5 min)

```bash
mkdir tastekit && cd tastekit && git init
# copy everything from this pack into the folder
chmod +x .claude/hooks/*.sh
# needs jq (hooks), Node 20+, pnpm
claude
```
First message in Claude Code:
```
/next T0.1
```

## 2. What's in the pack

| File                      | Purpose                                                 | Loaded                                      |
| ------------------------- | ------------------------------------------------------- | ------------------------------------------- |
| `CLAUDE.md`               | Project brain: stack, layout, rules, definition of done | Every session (kept short on purpose)       |
| `docs/PRD.md`             | What we're building and why                             | Only when a task needs it                   |
| `docs/TASKS.md`           | 20 tasks in 8 phases, each sized for one session        | Read by `/next`                             |
| `docs/design-rubric.md`   | Scoring rubric + "AI tells" list                        | Read by design-critic; ships in the product |
| `docs/decisions.md`       | One-line decision log                                   | When adding deps or formats                 |
| `packages/skill/SKILL.md` | The product itself: what end users' agents follow       | Shipped via `tastekit init`                 |

**Subagents** (`.claude/agents/`): each one keeps its noisy output out of your main context.
| Agent           | Model  | Job                                                |
| --------------- | ------ | -------------------------------------------------- |
| `verifier`      | haiku  | typecheck + test + lint, returns only failures     |
| `reviewer`      | sonnet | reviews the diff and blocks bad commits            |
| `design-critic` | opus   | scores screenshots against the rubric, top 5 fixes |
| `preset-author` | opus   | writes new presets (json + rules + examples)       |
| `researcher`    | haiku  | current docs/APIs from the web, with sources       |

**Commands** (`.claude/skills/`, manual only):
| Command                          | Use                                                                               |
| -------------------------------- | --------------------------------------------------------------------------------- |
| `/next [T-id]`                   | Main loop: pick task → plan → build → verify → critique (if UI) → review → commit |
| `/critique <route> [preset]`     | Screenshot → critic → fix → re-shoot (max 2 rounds)                               |
| `/new-preset <id> <direction>`   | Create a preset end to end                                                        |
| `/before-after <prompt-id\|all>` | Baseline vs tastekit comparison images (your marketing)                           |
| `/ship <patch\|minor\|major>`    | Release prep. Never publishes; you push                                           |
| `/sync-docs`                     | Keep CLAUDE.md / TASKS.md accurate every ~5 tasks                                 |

**Hooks** (`.claude/settings.json`):
- `guard.sh` blocks edits to the lockfile, dist and .env
- `format.sh` runs Biome on every edited file, so no tokens are spent on formatting
- `typecheck-on-stop.sh` stops Claude from finishing with type errors

## 3. Daily loop

```
/next            → builds one task, commits
/clear           → fresh context for the next task
/next
...
/sync-docs       → every ~5 tasks
```
For M tasks, press **Shift+Tab** into plan mode first if you want to approve the plan.

## 4. Efficiency rules

1. **One task = one session, then `/clear`.** Long contexts get slower, cost more and drift.
2. **Model per job**: Sonnet for the main session; switch with `/model` to Opus only for architecture tasks (T1.1, T3.1, T6.1). Subagents already pin their own model (haiku for cheap checks).
3. **Subagents are context firewalls**: test logs, web pages and screenshots go to subagents, and only summaries come back.
4. **CLAUDE.md stays under 100 lines.** Details live in `docs/`, read on demand. Don't `@import` big docs into it.
5. **Hooks do the boring parts** (format, guard, typecheck) deterministically, for free.
6. **Parallelize independent phases** with git worktrees. Phase 2 (presets) and Phase 3 (linter) only share T1.1:

   ```bash
   git worktree add ../tk-lint -b lint && cd ../tk-lint && claude   # run /next T3.1 here
   ```
7. **Don't over-plan.** TASKS.md is the plan. Fix it with `/sync-docs` instead of re-planning in chat.

## 5. Kickoff prompts for the tricky moments

- **Stuck in a loop on a bug:**
  `Stop fixing. Explain the root cause in 3 lines, list 2 hypotheses, and add a failing test that proves the bug. Then fix.`
- **Before a schema change:**
  `Plan mode. Show me the diff to the Preset/Tokens schema and every file affected. Don't edit yet.`
- **Presets look too similar:**
  `Screenshot /presets/<a> and /presets/<b>. Have design-critic list what makes them different. If it's mostly color, send preset-author back with "change layout and type, not color".`
- **Dogfood on a real client site** (best validation):
  `In ../client-site, run tastekit init with preset <x>, then rebuild the homepage following packages/skill/SKILL.md. Report lint + rubric scores.`

## 6. Milestones

| After   | You have                                                             |
| ------- | -------------------------------------------------------------------- |
| Phase 2 | 4 presets rendering in the playground → share screenshots early on X |
| Phase 4 | A working `npx tastekit init` → private beta with 5 dev friends      |
| Phase 7 | 10 before/after images → launch content                              |
| Phase 8 | Public 0.1.0                                                         |
