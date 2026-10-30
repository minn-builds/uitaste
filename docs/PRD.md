# uitaste: product spec (v0.1)

## Problem

Agent-built frontends converge on the same look: shadcn defaults, Inter, indigo/purple gradients, centered hero, three identical feature cards. Prompts alone don't fix it, because the model drifts back to defaults over a long session and never sees what it rendered.

## Users

1. Developers vibecoding apps in Claude Code / Cursor / Codex who want a site that doesn't look AI-made.
2. Agencies shipping client sites fast that need visual variety and brand consistency.

## What v0.1 does

| Lever         | What it is                                                                                                                       | Why it beats a prompt                                                                    |
| ------------- | -------------------------------------------------------------------------------------------------------------------------------- | ---------------------------------------------------------------------------------------- |
| Presets       | Curated style directions (tokens + rules + reference components)                                                                 | Variety comes from curation, not from asking the model to "be creative"                  |
| Tokens        | Generated design system (type scale, spacing, color in OKLCH, radius, shadow, motion) emitted as CSS vars + Tailwind v4 `@theme` | The whole app stays consistent, not just one component                                   |
| Linter        | Static checks for AI-default tells and token violations                                                                          | Catches drift deterministically, in CI too                                               |
| Critique loop | `uitaste shoot` screenshots routes at 3 breakpoints; the user's own agent critiques them against the rubric and fixes them       | The agent finally sees its output. No API key needed: the user's agent does the critique |

## Surfaces

- `npx uitaste init`: pick a preset (+ optional brand color/font), write tokens, install the agent skill into `.claude/skills/uitaste/` (and `.cursor/rules/` if present)
- `npx uitaste lint [glob]`: exit 1 on errors; `--json` for agents/CI
- `npx uitaste shoot --url <url> [--routes /,/pricing]`: PNGs at 390/768/1440 into `.uitaste/shots/<timestamp>/`
- MCP server `@uitaste/mcp` exposing the same functions as tools (`list_presets`, `get_preset`, `generate_tokens`, `lint`, `shoot`)
- `SKILL.md` that teaches the agent: tokens only → lint → shoot → critique → fix (max 2 rounds)

## Non-goals (v0.1)

Hosted service, accounts, image generation, Figma sync, non-React frameworks (Vue/Svelte come in v0.2 via the CSS-var output, which already works anywhere).

## Success metrics

- Before/after benchmark: in a blind pick, ≥70% prefer the uitaste version across 10 prompts
- 500 GitHub stars and 1k weekly npm downloads within 60 days of launch

## Monetization (after traction, not before)

- **Pro presets** pack (one-time or yearly), like the Tailwind Plus model
- **Brand kits**: upload a logo/brand, get a locked custom preset for a team
- **CI action**: lint + visual critique on PRs, with a PR comment (paid for private repos)
- Agency license
