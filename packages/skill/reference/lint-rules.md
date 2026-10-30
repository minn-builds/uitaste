# `tastekit lint` rules and how to fix them

Run `npx tastekit lint --json`. Each finding has `ruleId`, `severity`, `message`, `loc`
(`start.line`, `start.column`) and a `suggestion`. Exit code 1 means at least one error.

- **error**: token discipline. The build is not done until there are 0.
- **warn**: AI-default tells. Fix them; keep one only when the user explicitly asked for it,
  and say so in your report.

Fix the UI, not the config: don't set rules to `"off"` in `tastekit.config.json` to pass.
The generated tokens file (`tastekit.tokens.css`) is never linted for token rules.

## Errors (token discipline)

### `no-hardcoded-color`

Message: `` `bg-white` is a hardcoded color, not a token. `` or
`` `color` hardcodes `#1a1a1a`. ``

Triggers: hex, `rgb()`, `hsl()`, `oklch()` and other color functions, named colors (`white`,
`tomato`) in CSS, inline `style`, or bracket classes (`bg-[#111]`), and stock palette classes
(`bg-gray-100`, `text-indigo-600`, `border-black`). They also don't render: the palette is reset.

Fix: map to the role it plays.

| Wrote                             | Use                                  |
| --------------------------------- | ------------------------------------ |
| `bg-white`, `bg-gray-50`, `#fff`  | `bg-bg`                              |
| `text-black`, `text-gray-900`     | `text-fg`                            |
| `text-gray-500`, `text-slate-600` | `text-muted-fg`                      |
| `bg-gray-100`, `bg-slate-50`      | `bg-muted` or `bg-neutral-100`       |
| `border-gray-200`                 | `border-border`                      |
| `bg-indigo-600 text-white` (CTA)  | `bg-accent text-accent-fg`           |
| `text-blue-600` (link)            | `text-accent` or `text-fg underline` |
| `bg-red-50 text-red-700` (error)  | `bg-destructive text-destructive-fg` |
| `bg-black/50` (overlay)           | `bg-fg/50`                           |
| `color: #333` in CSS              | `color: var(--tk-color-fg)`          |

### `no-arbitrary-values`

Message: `` `p-[13px]` uses an arbitrary value instead of a token scale. ``

Triggers: bracket values on design utilities: spacing, sizes, type, radius, leading, tracking,
z-index, etc. (`p-[13px]`, `text-[22px]`, `w-[340px]`, `rounded-[10px]`, `tracking-[0.2em]`).

Fix: use the nearest scale step (`p-3`, `text-xl`, `w-80`, `rounded-md`, `tracking-widest`),
or a token var (`p-(--tk-space-4)`). Not flagged: `grid-cols-[...]`, `grid-rows-[...]`,
`col-[...]`, `row-[...]`, `aspect-[...]`, `content-[...]`, `url()` images, values using
`var(--...)`, and arbitrary properties (`[mask-type:luminance]`).

### `max-radius-variants`

Message: `5 distinct radius values in use (sm, md, lg, xl, 2xl); the limit is 3 plus full`

Triggers: more than 3 distinct radii across all linted files, counting `rounded-*` classes
(including corner variants) and CSS `border-radius`. `rounded-full`, `rounded-none` and `0`
don't count. Reported once, on the first file.

Fix: pick one radius per role from `rounded-sm` / `rounded-md` / `rounded-lg` and replace the
rest (`rounded-xl` and `rounded-2xl` become `rounded-lg`, bare `rounded` becomes `rounded-sm`).
Use `rounded-full` only for pills and avatars.

### `font-from-tokens`

Message: `` `font-sans` is not a font token. `` or
`` `font-family: Helvetica, sans-serif` is not a font token. ``

Triggers: `font-sans`, `font-serif`, `font-[Inter]`, `font-(family-name:...)` without a var,
and CSS `font-family` values that are not a token family or `var(--...)`.

Fix: `font-display` for headings, `font-body` for text, `font-mono` for labels and data. In CSS,
`font-family: var(--tk-font-body)` (plain CSS) or `var(--font-body)` (Tailwind). `@font-face`
blocks that declare the preset's own families are fine.

## Warnings (AI-default tells)

### `no-default-font`

Message: `"Inter" is the default AI font; ...` or
`` `font-display` resolves to "Inter" in the active tokens, the default AI font. ``

Triggers: Inter, Roboto or Arial as the display or heading face:
`--font-display`, `h1`–`h3` `font-family`, or `font-[Inter]` on a heading.

Fix: headings use `font-display`. If the tokens themselves resolve to a default font, the
config override is the cause: re-run `npx tastekit init --font "<preset display family>" --yes`
or remove `overrides.fonts.display`. Inter as body text is fine.

### `no-purple-gradient`

Message: `` `to-violet-500` is a purple gradient stop, the classic AI-default gradient. ``

Triggers: gradient utilities with purple, violet, fuchsia or indigo stops (300 and up), and CSS
gradients with purple colors.

Fix: a flat `bg-accent`, `bg-muted` or `bg-fg` slab. If the preset recipe calls for a gradient,
use its own ramps: `bg-linear-to-b from-neutral-50 to-bg`.

### `no-gradient-text-hero`

Message: `Gradient text on <h1> ("...") is an AI-default hero treatment.`

Triggers: `bg-clip-text text-transparent` plus a gradient on an `h1`/`h2` or hero/headline
element, or CSS `background-clip: text` with a gradient on those selectors.

Fix: a solid `text-fg` headline. For emphasis use the preset's move instead: an italic phrase,
a weight change, an accent-colored word (`<span class="text-accent">`), or size.

### `no-uniform-card-grid`

Message: `<div> is rendered from a .map() into a grid as identical cards.` or
`3 identical sibling <div> cards with the same classes and structure.`

Triggers: card-like elements (rounded plus border/shadow/ring with a heading or paragraph, or a
`card`/`tile`/`feature` class) mapped into a `grid` or `flex flex-wrap`, or 3+ identical sibling
cards.

Fix: change the composition, not just the classes. Options, best first:

1. A list or table: `<dl>`/`<ul>` with `divide-y divide-border`, label left, text right.
2. One lead item plus a compact list: the first feature `lg:col-span-7` with a real visual,
   the rest as plain rows `lg:col-span-5`.
3. Mixed spans and different content per item (a number, a quote, a screenshot).
4. Cut to the 2 items that matter.

Items rendered from `.map()` are fine as list rows (`<li>`), table rows, or unboxed blocks
without the card surface (no rounded + border/shadow combo).

### `no-emoji-icons`

Message: `Emoji "🚀" used in text; emoji are not icons.`

Triggers: emoji in UI text or CSS `content` (not inside `<code>`/`<pre>`).

Fix: an icon from one set (`lucide-react`: `<Rocket className="size-5" aria-hidden />`) or an
inline SVG with `stroke="currentColor"`, or no icon at all. A mono label or a number often
works better than an icon.

### `no-shadow-everywhere`

Message: `6 of 10 styled elements have a drop shadow; shadows lose meaning when everything has one.`

Triggers: shadows on at least 4 elements and at least 40% of styled elements in a file
(mapped elements count 3x), or box-shadow on 5+ rules and 40%+ of rules in a CSS file.
`hover:`/`focus:` shadows and `shadow-none` don't count.

Fix: keep the shadow on the one focal element (or popovers and modals), and separate the other
surfaces with `border border-border`, a `bg-muted` step, or spacing.
