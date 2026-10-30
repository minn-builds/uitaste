# Decisions log

One line per decision: `YYYY-MM-DD · decision · why`. Newest at the bottom.

- 2026-10-30 · Critique runs in the user's own agent (we only take screenshots + ship the rubric) · Zero API keys/cost for open-source users; works in any vision-capable agent
- 2026-10-30 · Tokens in OKLCH via culori · Perceptually even color ramps; Tailwind v4 is OKLCH-native
- 2026-10-30 · Tailwind v4 `@theme` + plain CSS vars as outputs · Covers Tailwind users and anything else (Vue/Svelte/plain CSS)
- 2026-10-30 · Biome instead of ESLint + Prettier · One fast tool and one config; hooks stay cheap
- 2026-10-30 · Core logic only in `packages/core` · CLI, MCP and skill stay thin and consistent
- 2026-10-30 · Scaffold deps: turbo, tsup 8, vitest 4, TypeScript 5.9, Vite 8 + React 19 + Tailwind v4 (`@tailwindcss/vite`) · vitest 5 / tsup 9 need Node 22 (we support 20); tsup 8 dts breaks on TS 6 (`baseUrl` deprecation) and TS 7 has no JS API
