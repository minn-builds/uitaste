# Soft Utility

> Different from the others: a product-tool look built from layered rounded panels on a tinted canvas, dense 15px humanist type and app-shell chrome (toolbars, segmented controls, status dots), where `editorial` uses serif prose columns and `swiss` uses flat, square, giant-type grids.

## Essence

Calm, friendly product UI for tools and SaaS: Red Hat Display headings over Source Sans 3 body at a dense 15px, on a sage-tinted canvas with one muted teal. Surfaces stack by background step and hairline border, with soft medium radii and a single, barely-there shadow tier.

## Signature moves

1. **Panels on a canvas.** The page is `bg-muted`; content lives in `bg-bg border border-border` panels. A panel has a header strip (`border-b px-4 py-3`, title left, controls right) and often a `bg-muted` footer strip.
2. **One radius per tier.** Controls (buttons, inputs, chips, `kbd`, segmented items) are `rounded-sm`; panels, rows and tables are `rounded-md`; the single outer frame or floating summary is `rounded-lg`. `rounded-full` only for status dots.
3. **Show the product, not a slogan.** Heroes put a live-looking app frame (toolbar, table, statuses) next to a short left-aligned pitch in a 5/7 split. Display type stays modest: `text-3xl md:text-4xl font-semibold tracking-tight leading-tight`.
4. **Status dot + label.** State is a `size-2 rounded-full` dot plus a word: `bg-accent` only for the one live/running thing, `bg-neutral-400` for done or healthy, outlined dot for queued or closed, `bg-destructive` with `text-destructive` for failure. Never color alone.
5. **Property lists and inline stats.** Facts are `dl` rows (`flex justify-between`, `text-sm text-muted-fg` term, `tabular-nums` value) or a `divide-x` stat strip inside a panel (`grid-cols-1 divide-y` below `sm`), never a row of stat cards.
6. **Keyboard hints and segmented controls.** `kbd` chips (`rounded-sm border bg-bg font-mono text-sm`) next to actions; ranges and views are segmented radio groups in a `bg-muted p-0.5` track.

## Do

- Body is `font-body text-base` (15px); meta, labels and table headers are `text-sm text-muted-fg`. Page headings (h1/h2) use `font-display font-semibold tracking-tight leading-tight`; panel titles `font-display font-medium`; 700 only for the key number.
- Numbers use `tabular-nums` in the body face; `font-mono` only for IDs, keys and code.
- Teal marks one thing per view: the primary action, the focus ring, or the healthy/running state.
- Group tightly: `gap-2`/`py-2` inside lists and rows, `gap-6` between panels, `py-10 md:py-16` between sections.
- Tap targets are `min-h-11` on mobile and may tighten to `md:min-h-9`/`md:min-h-8` on desktop.
- Hide secondary table columns below `sm`/`md` (`hidden sm:table-cell`) instead of squeezing them.
- Focus: `focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ring`; hover is a background step (`hover:bg-muted`), never a lift.

## Don't

- Never center a hero or stack three equal feature cards; never use a colored icon circle or emoji.
- Never put `shadow-*` on more than one surface per view. Only `shadow-sm`, only on the frame or summary that floats.
- Never use `rounded-xl`/`2xl`, pill buttons or mixed radii within one tier.
- Never use gradients, glass, blur or a second accent hue; teal tints are for hover/pressed only.
- Never use `text-xs` for readable text, uppercase tracking labels or marketing slogans. Sentence case, plain verbs.
- Never pad the layout out: no full-viewport heroes, no 128px gaps between a heading and its content.

## Component recipes

**Hero.** `bg-muted` canvas, `md:grid-cols-12`. Left `col-span-5`: status line with dot, `text-3xl md:text-4xl` headline, `text-muted-fg` paragraph at `max-w-120`, one teal button plus an underlined text link, and a 3-row property list. Right `col-span-7`: a `rounded-lg border bg-bg shadow-sm` app frame stretched to the row (`self-stretch flex flex-col`, table wrapper `flex-1`) with a toolbar strip (title plus segmented control), a compact table and a `bg-muted` footer strip with a `kbd` hint.

**Nav.** `bg-bg border-b`, one row at `py-2`: wordmark with a small `rounded-sm bg-accent` mark, links as `rounded-sm px-3` items where the current one is `bg-muted font-semibold`, and a bordered neutral button on the right. Links wrap to a scrollable second row on mobile.

**Pricing.** On a `bg-muted` canvas, a plan picker, not cards: a radio list of `rounded-md border bg-bg` rows (`has-checked:border-accent`) with name, one-line blurb and right-aligned price, a limits table under it, a `bg-bg` limits panel, and a `rounded-lg shadow-sm` summary panel at `col-span-5` with the total and the full-width teal button.

**Card.** A `rounded-md border bg-bg overflow-hidden` panel: header strip (title, status, segmented control), a `divide-x` stat strip, content, and a `bg-muted` footer strip with a timestamp and a link with a `kbd` hint. No shadow.

**Table.** Inside a panel, full width. Header row `bg-muted text-sm text-muted-fg font-normal`, rows `py-2 divide-y divide-border`, numbers right-aligned `tabular-nums`, IDs in `font-mono text-sm`. `hover:bg-muted` on rows. No zebra stripes, no vertical rules.

**Form.** Labels above fields in `text-sm font-semibold`. Inputs `rounded-sm border border-border bg-bg px-3 min-h-11 md:min-h-9`; focus swaps the border to `border-accent` plus the ring outline. Help text `text-sm text-muted-fg`; errors `text-sm text-destructive` with a written reason. Actions right-aligned in a `bg-muted` footer strip.
