# Brutal

> Different from the others: structure is drawn, not implied. Square slabs with 3px ink borders, hard offset shadows and an orange flood, versus editorial's serif hairlines, swiss's flat unboxed grid and soft-utility's rounded calm.

## Essence

Neo-brutalism with manners: oversized uppercase Archivo Black, Atkinson Hyperlegible for reading and Space Mono for labels and numbers, all inside square slabs outlined in 3px ink and lifted by hard, unblurred shadows. It is loud through scale, borders and one safety-orange flood, never through clutter, and every text pair clears WCAG AA.

## Signature moves

1. **Slabs with drawn edges.** Every surface is `border-3 border-fg rounded-none` on `bg-bg`. Adjacent cells share one edge through `divide-x-3`/`divide-y-3 divide-fg` instead of doubling borders, so the page reads like a printed form.
2. **One hard shadow, one press.** The focal slab gets `shadow-lg` (8px offset). Buttons get `shadow-md` and press in on hover: `hover:translate-x-1 hover:translate-y-1 hover:shadow-none`. Everything else is flat.
3. **Oversized uppercase display.** Headlines are `font-display uppercase text-xl md:text-3xl xl:text-4xl leading-none`, hand-broken into short lines (a two-letter middle line is fine). One headline per view; section titles stop at `text-2xl`.
4. **Tape labels.** Section and field labels are `font-mono uppercase text-sm` in an ink chip (`bg-fg text-bg px-2 py-0.5`) sitting on the top edge of a slab.
5. **One orange flood.** `bg-accent text-accent-fg` fills one whole slab or block per view (the offer, the active plan, the key number). Never a gradient, tint or outline.
6. **Asymmetric stack.** Uneven splits (8/4, 7/5, 3/9 on `grid-cols-12`), with the minor slab dropped down `md:mt-12` so edges do not line up.

## Do

- Use `font-display` at its only weight (no `font-bold`). Body is `font-body text-base`, `max-w-prose`, mixed case.
- Put numbers, prices, dates and codes in `font-mono` at `text-base` (Space Mono reads small); `text-sm` mono only for uppercase tape labels. Big prices and key numbers use `font-display`.
- Focus: `focus-visible:outline-3 focus-visible:outline-offset-2 focus-visible:outline-fg`. Ink outlines read on bg and on orange.
- Keep tap targets `min-h-12` (48px) and padding from the 4px scale (`p-4`, `p-6`, `p-8`).
- Use `bg-fg text-bg` for inverted slabs, the second loudest emphasis after orange.
- Keep motion short and mechanical: `transition ease-standard` (100ms) plus `motion-reduce:transition-none` on anything that moves.

## Don't

- Never round a corner, blur a shadow, or use `shadow-sm/md/lg` on more than a few elements per view.
- Never use `text-accent` or `border-accent` on `bg-bg` (3.0:1); orange is a fill with ink text on it.
- Never tilt, rotate or stack stickers, never use emoji, and never set three identical boxed cards in a row.
- Never use `text-xs`, letter-spaced body text, or uppercase paragraphs. Uppercase is for display and labels.
- Never center the hero or put two buttons of equal weight side by side.
- Never use more than one orange flood per view: if the button is orange, the stat slab is ink.
- Do not use the light `border-border` token for structure; borders are `border-fg`. Hairlines only inside tables and feature lists.
- No dark mode (`darkMode: false`): ink shadows and ink borders vanish on a dark ground. Use `bg-fg text-bg` slabs for darkness.

## Component recipes

**Hero.** A 12-column grid. Columns 1–8: a tape label, the display headline on three hand-broken lines, a body paragraph, then one `shadow-md` orange button and a plain underlined link. Columns 9–12: one stat rail dropped `md:mt-12` with `shadow-lg`, an ink (`bg-fg text-bg`) slab holding the key number on top and supporting facts stacked under it with `divide-y-3`. Never a full-width row of equal stats.

**Nav.** One bordered bar (`border-b-3 border-fg`): wordmark in `font-display uppercase` left in its own cell (`border-r-3`), links as mono uppercase cells divided by `divide-x-3 divide-fg`. The current link is a `bg-fg text-bg` cell.

**Pricing.** Plans are slabs in an uneven row (`lg:grid-cols-12`, spans 4/5/3, stacked below `lg`). The recommended plan is the orange flood with `shadow-lg`, sits higher and comes first on mobile (`order-first lg:order-none`); the others are flat. Price in `font-display text-2xl`, the period in mono. Features are a `divide-y` list with values spelled out in mono ("6,000 / mo", "Any deploy"), never check icons.

**Card.** A slab with a tape label overlapping its top border, split 5/7 inside by a 3px divider: the giant display number and its delta on one side, the chart on the other. Charts are vertical ink columns standing on a 3px baseline with mono values on top; the current period is the orange column. Never horizontal bar tables.

**Table.** Inside a slab: `thead` is `bg-fg text-bg font-mono uppercase text-sm`; body rows `divide-y divide-fg`; numbers `font-mono text-right tabular-nums`. No bars inside tables; charts belong in a card.

**Form.** Labels are mono uppercase `text-sm` above inputs. Inputs are `border-3 border-fg bg-bg px-3 min-h-12`, square; focus adds `shadow-md`. Errors are a `bg-destructive text-destructive-fg` strip under the field starting with "Error:". Submit is the orange `shadow-md` button.
