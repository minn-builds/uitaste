---
name: autopilot
description: Build all remaining tasks in docs/TASKS.md one after another using subagents, without asking between tasks. Stops only for important decisions or when everything is done.
argument-hint: "[stop-after task-id, e.g. T4.3]"
disable-model-invocation: true
---

You are the ORCHESTRATOR. You don't write product code yourself. You dispatch subagents, check their results, track progress and commit.
Stop after: $ARGUMENTS (if empty, run to the end).

## Setup (once)
1. `echo 0 > .claude/autopilot.on`. If that path isn't in `.gitignore`, add it.
2. Create `docs/QUESTIONS.md` and `docs/PROGRESS.md` if they're missing (each with a one-line header).
3. Task markers in `docs/TASKS.md`: `[ ]` open, `[x]` done, `[!]` blocked (add `→ Q<n>` at the end of the line).

## Loop
1. **Pick** the first `[ ]` task whose deps are all `[x]`.
   - None runnable but `[!]` tasks remain → go to **Finish**.
   - Everything `[x]`, or the stop-after task is done → go to **Finish**.
2. **Build**: spawn `task-runner` with the task ID, the full task block (copied from TASKS.md) and any relevant `NOTES_FOR_LATER` from earlier reports. For architecture tasks (T1.2, T3.1, T6.1, T6.2), set the model to opus.
3. **Handle the report**:
   - `blocked` → mark `[!] → Q<n>`, append the question to `docs/QUESTIONS.md` (with options and a recommendation), then go back to step 1 to work on other tasks.
   - `failed` → spawn a new `task-runner` once, giving it the FAILURE text. If it fails again → mark `[!]`, log it as a question ("stuck: …") and go back to step 1.
4. **UI check** (only if UI_SHOTS isn't "none"): spawn `design-critic` with the screenshot paths and preset id. If the average is under 4, spawn `task-runner` once with "apply fixes 1–3 from this critique: …" and re-shoot. Don't loop further.
5. **Review**: spawn `reviewer`. If it finds BLOCKING items, spawn `task-runner` with exactly those items (max 2 rounds).
6. **Verify**: spawn `verifier`. It must pass. If it doesn't, treat that as `failed` (step 3).
7. **Close**: tick `[x]`, append the DECISIONS lines to `docs/decisions.md`, append one line to `docs/PROGRESS.md` (`T-id · summary · critic score if any`), commit `<type>(<scope>): <T-id> <summary>`.
8. **Every 5 tasks**: spawn `general-purpose` with the `/sync-docs` instructions from `.claude/skills/sync-docs/SKILL.md`.
9. **FYI checkpoints** (don't stop for these): after Phase 2 and Phase 7, add an "FYI: please look at <screenshot paths>" entry to QUESTIONS.md.
10. Go to step 1. NEVER ask "should I continue?". Keep your own chat output to ≤2 lines per task.

## Special tasks
- T8.1: follow `.claude/skills/ship/SKILL.md` but never push or publish.
- T8.2: write the drafts into `docs/launch/`.

## Finish
1. `rm -f .claude/autopilot.on`
2. Report in ≤12 lines: tasks done (count), blocked tasks with their question IDs, the top 3 FYI items, and the commands the human must run (`git push --follow-tags`, `pnpm changeset publish`) if T8.1 is done.

## Resume
All state lives in TASKS.md, QUESTIONS.md and git. If the session dies or the context fills up, run `/autopilot` again and it picks up where it left off.
Once the human answers a question in QUESTIONS.md, change that task back to `[ ]` and include the answer in the task-runner prompt.
