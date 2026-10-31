# Swiss

> Different from the others: structure comes from a visible 12-column grid, size jumps and one red, not from serif texture, centered prose columns or surface effects.

## Essence

International Typographic Style for screens: a heavy neo-grotesk set flush-left and ragged-right on a strict 12-column grid, black on off-white, with one signal red. Information is ordered by position, weight and size alone. Nothing is decorated.

## Signature moves

1. **Asymmetric column spans.** Content sits in uneven spans of a `grid-cols-12` grid (2/10, 4/8, 3/9, 7/5). Columns 1–2 are often a narrow label column; the headline starts at column 3. Never 6/6, never everything centered.
2. **Steep size jumps.** Pair a `text-3xl`–`text-5xl` display line with `text-base` body and `text-sm` labels. Skip steps on purpose: no `text-lg` next to `text-xl`.
3. **Thick rules as structure.** A `border-t-4 border-fg` opens each section; `border-t border-border` hairlines separate rows. Rules replace cards, boxes and backgrounds.
4. **Numbered sections.** Sections and items carry an index (`01`, `02`) in `font-mono text-sm`, placed in the label column, top-aligned with the heading.
5. **One red, used as a signal.** `bg-accent` or `text-accent` marks one thing per view: the primary action, the active item or the key number. Large flat red fields (a full column block) are allowed once per page.
6. **Tabular numbers in mono.** Prices, metrics and dates are `font-mono`, right-aligned in tables, left-aligned in prose.

## Do

- Use `grid grid-cols-12` with `gap-x-3` (24px gutters) at `md:` and up; stack to a single column on mobile but keep the label-above-content order.
- Set everything flush-left and ragged-right. Display type is `font-display font-bold`; heading words break onto separate lines on purpose.
- Keep body text inside 5–6 columns (roughly 60ch at `text-base`).
- Use sentence case. Labels are short nouns ("Plan", "Usage"), not slogans.
- Keep corners square (`rounded-none`), surfaces flat, transitions fast (`transition-colors ease-standard`).
- Show focus with `focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ring`.
- Use `bg-fg text-bg` for inverted black blocks: the second-strongest emphasis after red.

## Don't

- Never center a hero or a section heading. Never justify text (it opens rivers).
- Never use shadows, gradients, blur, glass or rounded corners. `shadow-*` is `none` here; do not fake it.
- Never use a second accent hue or tints of red for decoration. `accent-*` ramps are for hover and pressed states only.
- Never use `text-xs` (8.5px) for anything a person must read.
- Never put icons in colored circles, use emoji, or set three equal cards in a row.
- Never set a sentence in `text-sm` (12px). It is for labels of four words or fewer; prose uses `text-base`.
- Never italicise or letter-space for emphasis; use weight or size.
- Do not use `destructive` and `accent` side by side; errors also carry a text label.

## Component recipes

**Hero.** Twelve columns, top-aligned. Columns 1–2 hold a mono index and a short label; columns 3–12 hold a `text-2xl md:text-4xl` headline broken across two or three lines, flush-left. Under it, a 5-column paragraph at `text-base` and one red primary action with a plain text link next to it. A `border-t-4 border-fg` runs the full width above everything.

**Nav.** A single row on a hairline bottom border: wordmark in `font-display font-bold` left, links in `text-sm font-medium` aligned to the grid columns, not spread with `justify-between`. The current page is underlined in red (`border-b-2 border-accent`), not filled.

**Pricing.** A table, not cards. Each plan is a column separated by `divide-x divide-border` on the rows; the recommended plan gets a `bg-fg text-bg` header cell, not a badge. Price in `font-mono text-2xl`, features as hairline-separated rows. The label column (spans 2, `table-fixed`, equal plan columns, `pl-3` so text sits on the gutter) names each feature row. Below `md` the table becomes a stacked list: one block per plan under `border-t-4 border-fg`, features as a `dl` of hairline rows on the 12-column grid.

**Card.** No card container. A card is a `border-t-4 border-fg` (or `border-accent` for the active one) above a block of type: mono index, heading, body, meta line. Padding only below and between, never around.

**Table.** Full-width, hairline row rules, no zebra stripes, no vertical rules except between plan columns. Header row in `text-sm font-medium text-muted-fg`. Numbers in `font-mono`, right-aligned. Use `divide-y divide-border` on the body; `hover:bg-muted` only when a row is a link.

**Form.** Labels above fields, `text-sm font-medium`. Inputs are square, `border-b-2 border-fg` only, `bg-bg`, with `px-0 py-1.5`. Focus turns the bottom rule red. Errors are `text-destructive text-sm` with the word "Error" before the message. The submit button is a full red block, left-aligned, never full width.
