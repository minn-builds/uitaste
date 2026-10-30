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

- 2026-10-30 · @fontsource/fraunces + @fontsource/source-serif-4 in playground · OFL, self-hosted fonts (no runtime network) so the playground shows the real preset faces; replace with preset-driven loading in T2.2
- 2026-10-30 · @clack/prompts in packages/cli · The prompt library chosen in the stack for the interactive `tastekit init` preset/accent/font picker
- 2026-10-30 · execa 9 (devDependency of packages/cli; v10 needs Node 22 Set.union) · e2e test runs the built CLI in a temp Vite app with sane exit/stdout handling
- 2026-10-30 · @tastekit/skill as workspace dep of packages/cli · `init` copies SKILL.md into user projects; resolved via package.json like presets
- 2026-10-30 · `init` writes `tastekit.tokens.css` next to the global CSS and adds one `@import` after existing imports (skipped if present) · Generated file is owned by tastekit and overwritten; user CSS is only touched once
- 2026-10-30 · playwright as optional peer dep + devDependency of packages/cli · Loaded by dynamic import so non-shoot users skip the download; missing package or chromium prints `npm i -D playwright && npx playwright install chromium`. Core stays Playwright-free (structural `BrowserLike`)
- 2026-10-30 · optional `shoot` section in tastekit.config.json ({url, routes, breakpoints}) · Defaults for `tastekit shoot`; `init` preserves it on re-run
- 2026-10-30 · @fontsource/schibsted-grotesk, hanken-grotesk, ibm-plex-mono in playground · OFL self-hosted faces for the swiss and editorial presets; no runtime font network calls
- 2026-10-30 · react + @types/react as devDependencies of packages/presets · Example .tsx components type-check against React without making presets a runtime React dependency
- 2026-10-30 · Playground `/presets/<id>` renders examples full-bleed (no wrapper) · Each example owns its container so screenshots show the preset's real layout
- 2026-10-30 · tastekit lint uses a small built-in glob matcher (*, **, ?, {a,b}) instead of a glob dependency · Node 20 lacks fs.glob; keeps core dependency-free; zero matches is an error so typo'd globs can't pass CI
- 2026-10-30 · @fontsource/red-hat-display, source-sans-3, jetbrains-mono in playground · OFL self-hosted humanist display/body faces and mono for the soft-utility preset; no runtime font network calls
- 2026-10-30 · @fontsource/archivo-black in playground · OFL self-hosted chunky display face for the brutal preset; no runtime font network calls
- 2026-10-30 · @fontsource/atkinson-hyperlegible in playground · OFL self-hosted body face for the brutal preset, chosen so the loud direction stays legible
- 2026-10-30 · @fontsource/space-mono in playground · OFL self-hosted mono for the brutal preset's labels and data
- 2026-10-30 · init installs the whole skill bundle (SKILL.md + reference/*) and the chosen preset's rules at a fixed `reference/preset.md` · SKILL.md can name the file without knowing the preset id; switching presets overwrites it (old `reference/presets/<id>/rules.md` from pre-release inits is left in place)
- 2026-10-30 · @modelcontextprotocol/sdk 1.x (+ zod, @tastekit/core, @tastekit/skill) in packages/mcp; playwright as optional peer + devDependency · Official SDK (McpServer.registerTool with zod shapes, stdio transport, InMemoryTransport for tests); playwright loaded lazily like the CLI
- 2026-10-30 · MCP `dir`/`out` args confined to the server's cwd via core `resolveInside` (symlink-aware); shoot out dir must be strictly inside the project · Agents can't make the server read or write outside the project; CLI keeps free `--out`
- 2026-10-30 · Shoot option merging (args > config.shoot > defaults) lives in core `resolveShootOptions`, used by CLI and MCP · One source of truth, no logic in wrappers
