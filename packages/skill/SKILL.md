---

name: tastekit
description: Use whenever building or restyling any UI (pages, components, layouts) in a project that has tastekit.config.json. Produces distinctive, consistent frontends using the project's preset and tokens, then lints and visually critiques the result.
---

# tastekit: design with taste, not defaults

This project uses a tastekit preset. Your job is to make UI that expresses that preset, not your usual defaults.

## Before writing any UI

1. Read `tastekit.config.json` to get the preset id.
2. Read `reference/presets/<preset>/rules.md`, especially the **signature moves** and **don'ts**. Every page must use at least 2 signature moves.
3. Tokens live in the CSS file listed in the config. Use ONLY those tokens: colors, fonts, type sizes, spacing, radius, shadow, motion. No hex values, no arbitrary Tailwind values like `p-[13px]`, no new fonts.

## Hard bans (these make UI look AI-generated)

- Centered hero with gradient headline text and a "Get Started" / "Learn More" pair
- Purple/indigo/violet gradients
- Three identical feature cards with icons in colored circles
- `rounded-xl shadow-lg` on every surface
- Emoji as icons
- Every section centered and the same height

## Build

- Start from the preset's component recipes in rules.md, not from memory.
- Vary section composition down the page (split, offset, full-bleed, dense list), following the preset.
- Design the 390px layout deliberately; don't just stack the desktop layout.
- Real-feeling copy. No lorem ipsum, no "Lorem Corp" logo clouds.

## Check (always, before saying you're done)

1. `npx tastekit lint <changed files> --json`. Fix every error.
2. `npx tastekit shoot <url-of-page>`. This returns screenshot paths at 390/768/1440.
3. Open the screenshots and score them with `reference/rubric.md`. If any category is under 4, apply the top 3 fixes and re-shoot. Max 2 rounds.
4. Tell the user: preset used, rubric score, and anything you couldn't fix.

If tastekit isn't initialized (no `tastekit.config.json`), suggest `npx tastekit init` and stop.
