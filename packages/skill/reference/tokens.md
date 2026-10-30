# Tokens: what exists and how to use it

`uitaste init` generates the tokens file named by `tokensCss` in `uitaste.config.json`
(usually `src/uitaste.tokens.css`) and imports it from the global CSS. Never edit it by hand;
change the preset or `overrides` in the config and re-run `npx uitaste init --yes`.

With Tailwind (`"tailwind": true`) the file is a Tailwind v4 `@theme`. Without Tailwind it is
plain CSS custom properties, all prefixed `--tk-`. The values differ per preset; the names don't.

## Color

The Tailwind palette is reset (`--color-*: initial`): `white`, `black`, `gray-*`, `slate-*`,
`indigo-*` and every other stock color are gone. `transparent` and `current` still work.

**Semantic roles** follow dark mode automatically (when the preset has one). Prefer these.

| Role            | Tailwind                             | CSS var                     | Use for                        |
| --------------- | ------------------------------------ | --------------------------- | ------------------------------ |
| `bg`            | `bg-bg`                              | `--tk-color-bg`             | Page background                |
| `fg`            | `text-fg`, `border-fg`, `bg-fg`      | `--tk-color-fg`             | Body text, ink, inverted slabs |
| `muted`         | `bg-muted`                           | `--tk-color-muted`          | Quiet surfaces, wells          |
| `mutedFg`       | `text-muted-fg`                      | `--tk-color-muted-fg`       | Secondary text, captions       |
| `accent`        | `bg-accent`, `text-accent`           | `--tk-color-accent`         | The one accent per view        |
| `accentFg`      | `text-accent-fg`                     | `--tk-color-accent-fg`      | Text on `bg-accent`            |
| `border`        | `border-border`, `divide-border`     | `--tk-color-border`         | Hairlines and dividers         |
| `ring`          | `ring-ring`, `outline-ring`          | `--tk-color-ring`           | Focus rings                    |
| `destructive`   | `bg-destructive`, `text-destructive` | `--tk-color-destructive`    | Errors, destructive actions    |
| `destructiveFg` | `text-destructive-fg`                | `--tk-color-destructive-fg` | Text on `bg-destructive`       |

Any color utility takes these: `bg-`, `text-`, `border-`, `divide-`, `ring-`, `outline-`,
`fill-`, `stroke-`, `decoration-`, `from-`/`via-`/`to-`, `placeholder-`, `caret-`.
Opacity modifiers are fine: `bg-fg/5`, `border-fg/20`.

**Ramps** (static, do not follow dark mode): `neutral`, `accent`, `destructive`, each with steps
`50 100 200 300 400 500 600 700 800 900 950`. Tailwind: `bg-neutral-100`, `text-accent-700`,
`border-neutral-300`. CSS var: `--tk-ramp-neutral-100` (plain CSS) or `--color-neutral-100`
(Tailwind). Use ramps for in-between steps (zebra rows, chart bars, hover fills), and pair
light ramps with `text-fg`, dark ramps with `text-bg`. Check `reference/preset.md` for
contrast notes before putting text on an accent ramp.

## Font

| Token     | Tailwind       | CSS var             | Use for                      |
| --------- | -------------- | ------------------- | ---------------------------- |
| `display` | `font-display` | `--tk-font-display` | Headings, hero, big numbers  |
| `body`    | `font-body`    | `--tk-font-body`    | Paragraphs, UI text          |
| `mono`    | `font-mono`    | `--tk-font-mono`    | Labels, data, code, metadata |

Weights are normal Tailwind utilities (`font-light`, `font-semibold`, ...). Only use weights the
preset lists in `preset.md` or loads; a missing weight is faked by the browser and looks cheap.
Set the body font once on `body` (`font-body` on the root element, or
`body { font-family: var(--tk-font-body); }`).

Loading: the tokens name the families but don't load them. Vite/React: `npm i @fontsource/<family>`
(lowercase, spaces to dashes, e.g. `@fontsource/source-serif-4`) and import it in the entry file.

## Type scale

`text-xs`, `text-sm`, `text-base`, `text-lg`, `text-xl`, `text-2xl`, `text-3xl`, `text-4xl`,
`text-5xl`. Each sets size and line height from the preset's modular scale. CSS vars:
`--tk-text-<step>` and `--tk-text-<step>-line-height`. Steps above `5xl` (`text-6xl`+) are
Tailwind defaults, not tokens: don't use them. Tighten display leading with `leading-none` or
`leading-tight` when a recipe asks for it.

## Spacing

Tailwind's spacing unit (`--spacing`) is set to the preset's base unit, so the normal scale works:
`p-4`, `gap-6`, `mt-12`, `py-24`, `max-w-160`. Plain CSS steps: `--tk-space-0`, `-0-5`, `-1`,
`-1-5`, `-2`, `-2-5`, `-3`, `-4`, `-5`, `-6`, `-8`, `-10`, `-12`, `-16`, `-20`, `-24`.
Never `p-[13px]`; if a value is missing, use the nearest step or `p-(--tk-space-5)`.

## Radius

| Token  | Tailwind       | CSS var            |
| ------ | -------------- | ------------------ |
| `sm`   | `rounded-sm`   | `--tk-radius-sm`   |
| `md`   | `rounded-md`   | `--tk-radius-md`   |
| `lg`   | `rounded-lg`   | `--tk-radius-lg`   |
| `full` | `rounded-full` | `--tk-radius-full` |

`rounded-xl`, `rounded-2xl` and bare `rounded` are Tailwind defaults, not tokens. Assign one
radius per role (controls, cards, media) and stick to it. Some presets set all three to `0`:
then use `rounded-none` or nothing.

## Shadow

`shadow-sm`, `shadow-md`, `shadow-lg` (`--tk-shadow-sm|md|lg`). Some presets set them to `none`
or to hard offsets. Use one elevation level per view, as the preset says. `shadow-xl`/`2xl` are
not tokens.

## Motion

`transition` (and `transition-colors`, etc.) uses the preset's base duration and easing by
default. Explicit: `ease-standard`, `duration-(--tk-duration-fast)`, `duration-(--tk-duration-slow)`.
CSS vars: `--tk-duration-fast|base|slow`, `--tk-easing`. Add `motion-reduce:transition-none`
on anything that moves.

## Allowed escape hatches

- Layout-only arbitrary values: `grid-cols-[2fr_1fr]`, `grid-rows-[auto_1fr]`, `col-[1/-1]`,
  `aspect-[4/3]`, `content-['']`, `bg-[url(/hero.jpg)]`.
- Any value through a token var: `w-(--tk-space-24)`, `p-[var(--tk-space-4)]`,
  `[grid-template-columns:var(--x)]`.
- Layout sizes from the spacing scale: `max-w-160`, `w-80`, `h-12`; fractions and keywords
  (`w-1/2`, `max-w-prose`, `min-h-dvh`) are fine.
