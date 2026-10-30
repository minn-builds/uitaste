# Decisions log

One line per decision: `YYYY-MM-DD · decision · why`. Newest at the bottom.

- 2026-10-30 · Critique runs in the user's own agent (we only take screenshots + ship the rubric) · Zero API keys/cost for open-source users; works in any vision-capable agent
- 2026-10-30 · Tokens in OKLCH via culori · Perceptually even color ramps; Tailwind v4 is OKLCH-native
- 2026-10-30 · Tailwind v4 `@theme` + plain CSS vars as outputs · Covers Tailwind users and anything else (Vue/Svelte/plain CSS)
- 2026-10-30 · Biome instead of ESLint + Prettier · One fast tool and one config; hooks stay cheap
- 2026-10-30 · Core logic only in `packages/core` · CLI, MCP and skill stay thin and consistent
- 2026-10-30 · Scaffold deps: turbo, tsup 8, vitest 4, TypeScript 5.9, Vite 8 + React 19 + Tailwind v4 (`@tailwindcss/vite`) · vitest 5 / tsup 9 need Node 22 (we support 20); tsup 8 dts breaks on TS 6 (`baseUrl` deprecation) and TS 7 has no JS API
- 2026-10-30 · zod 4 in core for preset + token schemas · Runtime validation with readable errors and inferred TS types from one source
- 2026-10-30 · culori 4 + @types/culori in core for the token generator · Parse seeds, OKLCH conversion, sRGB gamut mapping (clampChroma) and WCAG contrast in one small dependency
- 2026-10-30 · @changesets/cli for versioning + changelogs · Standard release flow for pnpm monorepos; human runs publish
- 2026-10-30 · Lint parsers: @babel/parser 7 (+ @babel/types for AST types) for JSX/TSX, postcss for CSS, parse5 for HTML · Pure JS (no native binaries), precise source offsets, battle-tested; Babel 8 needs Node 22 so pinned to 7
- 2026-10-30 · citty 0.2 + zod in packages/cli · citty is the CLI framework chosen in the stack (tiny, typed subcommands); zod validates CLI args
- 2026-10-30 · Root `pnpm tastekit` runs the built `packages/cli/dist/main.js` · Exercises the bundle users actually get; requires `pnpm build` first
- 2026-10-30 · Lint fixtures in `packages/core/src/lint/__fixtures__`, excluded from tsc and Biome · They hold deliberately bad, standalone code that would otherwise fail CI
- 2026-10-30 · Lint output: pretty reporter for humans, JSON reporter for agents/MCP/CI · One Finding model, two stable formats
