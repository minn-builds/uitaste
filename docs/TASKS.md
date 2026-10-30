# Tasks

Format: `- [ ] ID · title · size (S ≤1h, M ≤3h, L = split it) · deps`
Each task is one Claude Code session. `/next` picks the first unchecked task whose deps are done.

## Phase 0: Foundation

- [x] T0.1 · Monorepo scaffold · M · none
  - pnpm workspaces, turbo.json (build/test/typecheck/lint pipelines), root tsconfig (strict, ESM), Biome config, vitest workspace
  - empty packages: core, presets, cli, mcp, skill; app: playground (Vite + React + Tailwind v4)
  - Accept: `pnpm build && pnpm test && pnpm typecheck && pnpm lint` pass on empty packages
- [x] T0.2 · CI · S · T0.1
  - GitHub Actions: install (pnpm cache), typecheck, lint, test, build on PR + main
  - Changesets initialized
  - Accept: workflow file valid (`actionlint` if available); changeset config present

## Phase 1: Tokens (core)

- [x] T1.1 · Preset + token schemas · S · T0.1
  - zod schemas: `Preset` (meta, fonts, color seeds, scale ratios, radius, shadow, motion, rules ref), `Tokens` (resolved output)
  - Accept: schema tests for valid/invalid fixtures; inferred types exported
- [x] T1.2 · Token generator · M · T1.1
  - `generateTokens(preset, overrides?)`: modular type scale, 4/8pt spacing, OKLCH color ramps (11 steps) from seeds with culori, semantic roles (bg, fg, muted, accent, border, ring, destructive), dark mode
  - Accept: deterministic snapshot tests; WCAG AA contrast check for fg/bg and accent/accent-fg pairs passes in tests
  - Note: generator supplies defaults the preset leaves out (mono stack, destructive seed, line-heights, `radius.full`, shadow values per `shadow.style`); `darkMode: false` → omit `color.dark`; parse seeds with culori
- [x] T1.3 · Emitters · S · T1.2
  - `toCssVars(tokens)`, `toTailwindTheme(tokens)` (v4 `@theme` block), `toJson(tokens)`
  - Accept: snapshot tests; playground imports emitted CSS and renders
- [x] T1.4 · Generator: `firstLegible` fallback guarantees AA · S · T1.2
  - Today it silently returns the last candidate when none passes; instead adjust lightness until AA passes (or throw)
  - Accept: test with a no-pass candidate list yields a color that clears AA on every background

## Phase 2: Presets

- [x] T2.1 · Preset loader + registry · S · T1.1
  - Load `packages/presets/*/preset.json` + `rules.md`; `listPresets()`, `getPreset(id)`
  - Accept: tests; invalid preset gives a readable zod error
- [x] T2.2 · Presets: editorial, swiss · M · T2.1, T1.3 (use `/new-preset`)
- [x] T2.3 · Presets: soft-utility, brutal · M · T2.2 (use `/new-preset`)
  - Each preset: preset.json, rules.md (do/don't, layout patterns, signature moves), 3 example components (hero, pricing, dashboard card)
  - Accept: each preset renders in the playground; design-critic scores ≥4/5 average; presets are visibly distinct from each other

## Phase 3: Linter

- [x] T3.1 · Lint engine · M · T1.1
  - Parse .tsx/.jsx/.css/.html (oxc-parser or @babel/parser for JSX className strings; postcss for CSS)
  - Rule interface `{id, severity, check(file, ctx) => Finding[]}`, reporters: pretty + JSON
  - Accept: tests with fixture files
- [x] T3.2 · Rules: AI-default tells · M · T3.1
  - `no-default-font` (Inter/Roboto/Arial as display font), `no-purple-gradient`, `no-gradient-text-hero`, `no-uniform-card-grid` (3+ identical sibling cards), `no-emoji-icons`, `no-shadow-everywhere`
  - Accept: each rule has a pass fixture and a fail fixture
- [x] T3.3 · Rules: token discipline · S · T3.1, T1.3
  - `no-hardcoded-color`, `no-arbitrary-values` (`p-[13px]`), `max-radius-variants`, `font-from-tokens`
  - Accept: fixtures; run on playground = 0 errors

## Phase 4: CLI

- [x] T4.1 · `tastekit init` · M · T2.1, T1.3
  - Detect framework (Vite/Next/plain), preset picker (clack), optional brand color + font, write `tastekit.config.json` + tokens CSS, patch global CSS import, install skill into `.claude/skills/tastekit/` and `.cursor/rules/tastekit.mdc` if `.cursor/` exists
  - Accept: e2e test in a temp Vite app (execa); idempotent re-run
- [x] T4.2 · `tastekit lint` · S · T3.2, T3.3
  - Globs, `--json`, exit codes 0/1, reads config
- [x] T4.3 · `tastekit preset list|show` · S · T2.1
- [x] T4.4 · CLI tests resolve `@tastekit/core` from source · S · T4.3
  - Alias `@tastekit/core` to `packages/core/src` in `packages/cli/vitest.config.ts` so tests don't run against a stale dist
  - Accept: a core change shows up in CLI tests without rebuilding core

## Phase 5: Critique loop

- [x] T5.1 · `tastekit shoot` · M · T4.1
  - Playwright: routes × breakpoints (390/768/1440), full-page PNG, wait for fonts + network idle, output manifest JSON with paths
  - Accept: e2e against playground dev server
- [x] T5.2 · Rubric packaging · S · T5.1
  - Ship `docs/design-rubric.md` as `packages/skill/reference/rubric.md`; `shoot` prints the rubric path + manifest for the agent

## Phase 6: Agent integration

- [x] T6.1 · Product skill · M · T4.2, T5.1
  - Finish `packages/skill/SKILL.md` + `reference/` (per-preset rules copied at init)
  - Accept: in a fresh Vite app, Claude Code with the skill builds a landing page that passes lint with 0 errors
- [x] T6.2 · MCP server · M · T4.2, T5.1
  - Tools: `list_presets`, `get_preset`, `generate_tokens`, `lint`, `shoot`; stdio transport
  - Accept: MCP inspector lists the tools; each tool has a test

## Phase 7: Proof

- [x] T7.1 · Benchmark harness · M · T6.1
  - `bench/prompts.json` (10 prompts: SaaS landing, pricing, dashboard, portfolio, restaurant, docs home, ...), script that renders baseline vs tastekit screenshots side by side
  - Accept: 10 comparison PNGs in `bench/out/` (use `/before-after`)
- [ ] T7.2 · README + demo · S · T7.1
  - Hero GIF, 3 before/after images, 30-second quickstart, preset gallery

## Phase 8: Launch

- [ ] T8.1 · Release 0.1.0 · S · all above (use `/ship`)
- [ ] T8.2 · Launch posts · S · T8.1
  - Draft X thread, r/ClaudeAI + r/webdev posts, Show HN. Lead with before/after images.

## Later (only after traction)

- Pro presets pack · Brand kit generator · GitHub Action with PR comments · Vue/Svelte examples · Figma token export
