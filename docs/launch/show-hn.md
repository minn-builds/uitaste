# Show HN (draft)

HN doesn't render images in text posts, so the before/after goes first as a link. Use the repo as the submission URL and put the text below in the first comment, or submit as a text post with the URL in the body.

**Title:** Show HN: tastekit – Design tokens and a linter that keep coding agents off the default AI look

**URL:** <REPO_URL>

---

Before/after, same prompt, same agent (left: default, right: with tastekit): <REPO_URL>/blob/main/docs/assets/before-after-event-conference.png

Hi HN. I kept seeing the same frontend come out of Claude Code and Cursor: Inter, an indigo-to-purple gradient, a centered hero, three identical rounded cards. Prompting for "distinctive" works for a component or two, then the model drifts back, and it never looks at what it rendered.

tastekit is my attempt to fix that with constraints instead of prompts. It has three parts:

1. Presets and tokens. Four hand-built style directions (editorial, swiss, soft-utility, brutal). `npx @tastekit/cli init` generates the type scale, spacing, OKLCH colors, radii, shadows and motion as CSS variables or a Tailwind v4 `@theme`, and installs instructions telling the agent to use only those.

2. A linter. `tastekit lint` is static analysis over tsx/jsx/ts/css/html. Errors for token violations (hardcoded colors including stock palette classes, arbitrary values like `p-[13px]`, more than three radii, off-token fonts); warnings for common AI tells (purple gradients, gradient headline text, uniform card grids, emoji icons, shadows everywhere). Exit 1 on errors, `--json` for agents and CI.

3. A screenshot loop. `tastekit shoot` uses Playwright to capture routes at 390, 768 and 1440 px. The agent reads the PNGs, critiques them against a written rubric and fixes what it finds, capped at two rounds. The user's own agent does the critique, so there's no API key and nothing hosted.

Technical details:

- TypeScript monorepo: `core` (zod schemas, token generator, lint engine), plus thin CLI (citty) and MCP server (@modelcontextprotocol/sdk) wrappers. Colors are computed in OKLCH with culori.
- Presets are JSON plus a rules file and example components, validated with zod.
- MCP tools: `list_presets`, `get_preset`, `generate_tokens`, `lint`, `shoot`. Run with `npx -y -p @tastekit/mcp tastekit-mcp`. `shoot` refuses non-local URLs unless you configure one.
- `init` writes a Claude Code skill to `.claude/skills/tastekit/` and a Cursor rule if `.cursor/` exists. Re-running it is safe.

Caveats:

- The benchmark is weak evidence. Ten prompts, each built once without and once with tastekit: 7–85 lint errors for the baseline vs 0 for tastekit. But stock Tailwind palette classes count as errors, so the metric favors tastekit by construction. It measures token discipline, not taste.
- All 20 pages were written by agents. The tastekit runs knew they were being benchmarked, and the baselines got only the raw prompt. I haven't run a blind preference test. The screenshots (all 10 are in `bench/out`, with prompts and harness) are the real evidence.
- What it doesn't do: no taste of its own beyond four presets, no rendered contrast or accessibility checks, no image or copy generation, no Figma sync. The agent flow targets React; the CSS variables work anywhere.

What's next: Vue and Svelte support through the CSS-variable output, more presets, and a blind preference test on the benchmark so there's a better number than lint counts. I'm also considering a CI action that lints and critiques PRs.

MIT, v0.1.0. I'd like to hear where the lint rules are wrong and which style direction is missing.
