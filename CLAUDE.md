# tastekit

Open-source toolkit that makes coding agents (Claude Code, Cursor, Codex) produce distinctive, consistent frontends instead of default "AI-looking" UI.
Three levers: **design tokens from curated presets**, a **design linter** that flags AI-default patterns, and a **screenshot → critique → fix loop**.

Product spec: `docs/PRD.md` · Task list: `docs/TASKS.md` · Decisions: `docs/decisions.md` · Critique rubric: `docs/design-rubric.md`
Read those only when the task needs them.

## Stack

- pnpm 12 workspaces + Turborepo, TypeScript strict, ESM only, Node >= 20
- tsup (build), vitest (test), Biome (lint + format), zod (schemas), culori (OKLCH color math)
- Playwright (screenshots), @modelcontextprotocol/sdk (MCP server), citty + @clack/prompts (CLI)

## Layout

```
packages/core      schema (preset/tokens), generator (generateTokens), emit (CSS vars, Tailwind v4 @theme, JSON),
                   presets loader (listPresets/getPreset/defaultPresetsRoot), init, lint engine + rules
                   (lint/rules/), shoot (plan/manifest/runShoot over a structural BrowserLike, no playwright dep)
packages/presets   one folder per preset: preset.json, rules.md, examples/*.tsx
packages/cli       `tastekit init | lint | shoot | preset`; playwright is an optional peer
packages/mcp       MCP server wrapping core (get_preset, generate_tokens, lint, shoot)
packages/skill     SKILL.md shipped to end users' agents (the product's brain)
apps/playground    Vite + React app for rendering presets and before/after benchmarks
bench/             before/after screenshots (marketing material)
```

## Commands

- `pnpm i` · `pnpm build` · `pnpm test` · `pnpm typecheck` · `pnpm lint`
- Single package: `pnpm --filter @tastekit/core test`
- Playground: `pnpm --filter playground dev` (port 5173)
- CLI: `pnpm tastekit <cmd>` runs the built `packages/cli/dist`, so `pnpm build` first
- pnpm 12 does not support `pnpm -s`
- CLI tests alias `@tastekit/core` to `packages/core/src` (vitest.config.ts), so no rebuild needed to test
- `tastekit shoot` writes to `.tastekit/shots/<timestamp>/` (gitignored); needs `npx playwright install chromium`

## Rules

- Core logic lives in `packages/core`. CLI and MCP are thin wrappers: no business logic there.
- Every public function in core has a vitest test. Write the test first for pure logic.
- No new dependency without a one-line entry in `docs/decisions.md` saying why.
- Never use `any`. Validate all external input (preset files, config, CLI args) with zod.
- Keep the product skill (`packages/skill/SKILL.md`) under 300 lines; move detail into its reference files.
- The playground uses ONLY tokens from the active preset. No hardcoded colors, fonts, radii or spacing.
- Lint fixtures live in `packages/core/src/lint/__fixtures__`, excluded from tsc and Biome.
- Don't edit `pnpm-lock.yaml`, `dist/`, or `.env*` by hand (a hook blocks it).
- Don't run `git push` or any publish command. The human does releases.

## Definition of done (every task)

1. `pnpm typecheck && pnpm test && pnpm lint` passes (delegate to the `verifier` subagent).
2. `reviewer` subagent has no blocking findings on the diff.
3. Task ticked in `docs/TASKS.md`; any decision added to `docs/decisions.md`.
4. One conventional commit (`feat(core): ...`, `fix(cli): ...`).

## Working style

- One task per session. If the context gets long, finish the current step, commit, and suggest `/clear`.
- Delegate noisy work (test runs, web lookups, screenshot critique) to subagents so their output stays out of the main context.
- Report results in ≤5 lines: what changed, what was verified, what's next.
