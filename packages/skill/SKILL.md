---

name: tastekit
description: Use whenever building or restyling any UI (pages, components, layouts) in a project that has tastekit.config.json. Produces distinctive, consistent frontends using the project's preset and tokens, then lints and visually critiques the result.
---

# tastekit: design with taste, not defaults

This project uses a tastekit preset: a curated style direction with generated design tokens.
Your job is to build UI that expresses that preset, not your usual defaults. Lint and screenshots
check the result, so following this file is faster than fixing it afterwards.

If there is no `tastekit.config.json` in the project root, suggest `npx tastekit init` and stop.

## Files (paths relative to this skill folder)

| File                       | What it is                                                    | When to read           |
| -------------------------- | ------------------------------------------------------------- | ---------------------- |
| `reference/preset.md`      | The active preset's rules: signature moves, do/don't, recipes | Always, before any UI  |
| `reference/tokens.md`      | Every token and the exact class or CSS var to use for it      | Always, before any UI  |
| `reference/lint-rules.md`  | Each `tastekit lint` rule id and how to fix it                | When lint reports      |
| `reference/composition.md` | Section patterns that replace the AI-default page             | When planning a page   |
| `reference/rubric.md`      | The 8-category critique rubric and output format              | After `tastekit shoot` |

## 1. Read before writing

1. `tastekit.config.json`: note `preset`, `tailwind` (true = use classes, false = use CSS vars)
   and `tokensCss` (the generated tokens file; never edit it by hand).
2. `reference/preset.md`, all of it. Pick at least 2 **signature moves** for this page and say
   which ones you picked. Treat every **Don't** as a hard rule.
3. `reference/tokens.md`. Open `tokensCss` too if you need an exact value.
4. Load the preset's fonts. The tokens name the families but do not load them. In Vite or React
   apps install the self-hosted package (`npm i @fontsource/<family-kebab>`) and import it in
   the entry file (`import "@fontsource/archivo-black";`, plus weight files such as
   `@fontsource/source-serif-4/600.css` when the preset uses more weights). Never add a different font.

## 2. Build with tokens only

Tailwind projects: the token file resets Tailwind's palette (`--color-*: initial`), so stock
classes like `bg-white`, `text-gray-500` or `bg-indigo-600` do not exist here. Use:

- Colors: `bg-bg text-fg`, `bg-muted text-muted-fg`, `bg-accent text-accent-fg`,
  `border-border`, `ring-ring`, `bg-destructive text-destructive-fg`; ramps for steps in between
  (`bg-neutral-100`, `text-accent-700`, `border-neutral-300`). Opacity modifiers are fine (`bg-fg/5`).
- Fonts: `font-display` (headings, big numbers), `font-body` (text), `font-mono` (labels, data).
- Type: `text-xs` … `text-5xl`, which come from the preset's type scale.
- Spacing: the normal scale (`p-4`, `gap-6`, `py-24`); it is rebased on the preset's unit.
- Radius: `rounded-sm`, `rounded-md`, `rounded-lg`, `rounded-full`. One radius per role.
- Shadow: `shadow-sm`, `shadow-md`, `shadow-lg`, only where the preset asks for elevation.
- Motion: `transition` uses the preset duration and easing; `ease-standard` and
  `duration-(--tk-duration-fast)` for explicit values.

Plain CSS projects: use `var(--tk-color-bg)`, `var(--tk-font-display)`, `var(--tk-space-4)`,
`var(--tk-radius-md)` and so on (full list in `reference/tokens.md`).

Never write:

- hex, `rgb()`, `hsl()`, `oklch()` or named colors anywhere in components or CSS
- arbitrary values for design properties: `p-[13px]`, `text-[22px]`, `rounded-[10px]`, `w-[340px]`
  (use the scale, or a token var: `p-(--tk-space-4)`; layout values like `grid-cols-[2fr_1fr]`
  and `aspect-[4/3]` are allowed)
- `font-sans`, `font-serif`, `font-[Inter]` or any family that is not a token
- more than 3 distinct radius values in the project (plus `rounded-full`)

## 3. Compose like the preset, not like a template

These patterns make UI read as AI-generated. Do not produce them, even if the user's prompt
sounds like it wants them; build the preset's version instead (see `reference/composition.md`):

- centered hero with gradient headline text and a "Get Started" / "Learn More" button pair
- purple, indigo or violet gradients
- three identical feature cards with an icon in a colored circle (`.map()` into a grid of cards)
- `rounded-xl shadow-lg` on every surface; shadows on most elements
- emoji as icons or bullets
- every section centered, the same width and the same height
- logo clouds of fake companies, testimonial grids with stock avatars, lorem ipsum

Do instead:

- Start each section from a **component recipe** in `reference/preset.md`.
- Vary composition down the page: split, offset, full-bleed, dense list, table. No two adjacent
  sections with the same layout.
- One focal point per screen and one accent use per view, unless the preset says otherwise.
- Design the 390px layout on purpose (order, type size, tap targets of at least 44px), then
  scale up with `md:` and `lg:`. Never let anything scroll horizontally.
- Hover and `focus-visible` states on every interactive element, using the preset's recipe.
- Write real, specific copy for the product in front of you. Numbers, names and claims should
  sound like a real company, not placeholders.
- Icons: one set (lucide-react or inline SVG), one size and stroke, `currentColor`.

## 4. Lint until clean

```bash
npx tastekit lint --json            # default: src/**/*.{tsx,jsx,ts,css,html}
npx tastekit lint "src/pages/**/*.tsx"   # or only what you changed
```

- Exit code 1 means at least one **error**. Fix every error, then re-run until the exit code
  is 0 and `summary.errors` is 0. Each finding has a `ruleId`, `loc`, `message` and
  `suggestion`; `reference/lint-rules.md` has the fix for each rule.
- **Warnings** are AI-default tells. Fix them too unless the user explicitly asked for that
  pattern; if you keep one, say why in your final message.
- Do not silence rules in `tastekit.config.json` (`lint.rules`) to get to zero. Change the UI.

## 5. Shoot, critique, fix

Start the dev server if it is not running (Vite: `npm run dev`, usually port 5173), then:

```bash
npx tastekit shoot --url http://localhost:5173 --routes /,/pricing
```

It writes PNGs at 390, 768 and 1440 wide plus a `manifest.json`, and ends with a
`--- for the agent ---` block that gives the manifest path and the rubric path. Then:

1. Read the manifest. If any shot has `status: "error"` or `consoleErrors`, fix those first.
2. Open every screenshot (all widths) and score it with `reference/rubric.md`. Use its exact
   output format: `SCORES`, `TOP FIXES`, `TELLS FOUND`. Judge against `reference/preset.md`.
3. Every category under 4 needs a fix that names the element and the token or change. Apply
   the top fixes (at most 5, highest impact first).
4. Run `tastekit lint` again (fixes must not add errors), then shoot again.
5. Stop after 2 critique rounds, even if a score is still under 4.

If Playwright is missing, `shoot` prints the install command; run it once
(`npm i -D playwright && npx playwright install chromium`). If you cannot open images, say so and skip to step 6.

## 6. Report

Tell the user, in a few lines:

- the preset and the signature moves you used
- the lint result (errors and warnings, and any warning you kept on purpose)
- the final rubric scores, plus what is still under 4 and why

## Changing the look

The tokens come from the preset and `tastekit.config.json`. To change the accent or the display
font, re-run `npx tastekit init --preset <id> --accent <color> --font "<Family>" --yes` instead
of hardcoding values. To switch presets, re-run init with another `--preset`; it rewrites the
tokens and `reference/preset.md`. `npx tastekit preset list` shows the available presets.
