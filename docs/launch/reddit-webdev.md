# r/webdev post (draft)

Check the subreddit's self-promotion rules before posting (r/webdev usually wants a Showoff Saturday post for projects). Keep the tone low-key.

**Title:** A design linter for React/Tailwind that flags hardcoded colors, off-scale values and the usual "AI template" patterns

**Image (first in the gallery):** `docs/assets/before-after-restaurant.png`
Caption: Same prompt for both pages. Left uses stock Tailwind, right uses the editorial preset's tokens and passes the linter. 1440 px and 390 px.

---

I've been working on an open-source tool called uitaste. The part I think is useful on its own is a linter for design-token discipline, plus a small token generator to go with it.

## The linter

`uitaste lint` scans `src/**/*.{tsx,jsx,ts,css,html}` and exits 1 on errors, so it can sit in CI next to ESLint.

Errors (token discipline):

- `no-hardcoded-color`: hex, `rgb()`, named colors, and stock palette classes like `bg-blue-500` instead of your token colors
- `no-arbitrary-values`: `p-[13px]`-style values instead of the spacing scale
- `max-radius-variants`: more than 3 distinct radii plus `full`
- `font-from-tokens`: fonts other than `font-display`, `font-body`, `font-mono`

Warnings (the template look):

- `no-default-font` (Inter, Roboto or Arial as the display face), `no-purple-gradient`, `no-gradient-text-hero`, `no-uniform-card-grid`, `no-emoji-icons`, `no-shadow-everywhere`

The warnings are opinionated. Nothing is wrong with Inter, but Inter plus an indigo gradient plus three identical cards is what you get if nobody makes a choice. `--fail-on warn` makes them fail too, and `--json` gives machine-readable output.

## The tokens

`npx uitaste init --preset <name>` generates a type scale, spacing, OKLCH colors, radii, shadows and motion as CSS variables, or as a Tailwind v4 `@theme` if it detects Tailwind v4. There are four presets (editorial, swiss, soft-utility, brutal); `--accent` and `--font` override the accent color and display font. Previews: `docs/assets/preset-{editorial,swiss,soft-utility,brutal}.png`.

```sh
npx uitaste init --preset swiss
npx uitaste lint
```

## Where AI comes in

The reason I built it: coding agents (Claude Code, Cursor, Codex) produce the template look by default, and a prompt doesn't fix that for long. So uitaste also installs instructions for the agent (use only tokens, lint, screenshot, fix) and has a `uitaste shoot` command that takes Playwright screenshots at 390/768/1440 px for the agent to review. There's an MCP server too. Nothing is hosted and nothing calls an API; if you don't use an agent, the linter and tokens still work by themselves.

## What it doesn't do

- It doesn't give you taste. It enforces consistency with a preset someone already designed. Four presets is not many.
- It's static analysis on source text. It doesn't check rendered contrast, layout or accessibility.
- The init/agent flow targets React for now. The CSS-variable output works with anything, and Vue/Svelte support is planned.
- No Figma sync, no image generation.

## The numbers, with a big asterisk

I built 10 pages from the same prompts with and without uitaste and linted both: 7–85 errors for the baseline vs 0 for uitaste. That comparison is rigged in uitaste's favor by construction, because stock palette classes count as errors and the baseline uses stock Tailwind. Both sets of pages were written by agents, and the uitaste runs knew they were being benchmarked. Look at the screenshots (`docs/assets/before-after-pricing.png`, `docs/assets/before-after-event-conference.png` and all 10 in `bench/out`) and decide for yourself.

MIT, v0.1.0: https://github.com/minn-builds/uitaste

I'd like feedback on the rules, especially false positives and patterns I'm missing.
