# Editorial

> Unlike `swiss` (grotesk sans, strict modular grid, flush-left objectivity), editorial is serif-led and literary: asymmetric columns, italic decks, drop caps and hairline rules, typeset like a printed magazine.

## Essence

Ink on warm paper: a high-contrast Fraunces display set large and light over a calm Source Serif text column, with one vermilion accent used like an editor's red pencil. Structure comes from whitespace and 1px rules, never from boxes, shadows or color fills.

## Signature moves

1. **Asymmetric 12-column spreads.** Split content 3/9, 4/8 or 8/4; a narrow "margin column" carries kickers, bylines, folios and captions next to the main column. Never 6/6, never centered.
2. **Hairline rules as structure.** `border-t border-border` between sections and rows, a heavier `border-t-2 border-fg` to open a major section. No card surfaces, no `shadow-*` (tokens are `none`).
3. **Display type set light and large.** `font-display font-light text-4xl`/`text-5xl` headlines with one italic phrase for emphasis; weight contrast comes from 300 vs 600, not from bold everything.
4. **Mono folio line.** Small-caps-style metadata in `font-mono text-xs uppercase tracking-widest text-muted-fg`: issue number, section, date, reading time. It opens every section.
5. **Drop caps and italic decks.** The first paragraph of long copy gets a `first-letter:` drop cap in `font-display`; a standfirst in `font-display italic text-xl text-muted-fg` sits under headlines.
6. **Oversized numerals as markers.** Section numbers, prices and KPIs set in `font-display font-light text-5xl` with `tabular-nums` where they align.

## Do

- Keep body copy at `text-base font-body` with a 55–75ch measure (`max-w-160` or a 7–8 column span).
- Use `text-accent` for one thing per view: a kicker, a single link, the featured rule, a delta.
- Let whitespace separate groups: `py-16`/`py-24` between sections, `gap-x-8`+ between columns.
- Underline links (`underline underline-offset-4 decoration-1`), shift the decoration to `decoration-accent` on hover.
- Use real tables and `dl` lists for data; rows split with `divide-y divide-border`.
- Keep radii at `rounded-sm` for buttons and inputs; everything else square.
- Give every interactive element a `focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ring`.

## Don't

- Never use cards with background fills plus borders plus radius; never `shadow-*` on content.
- Never center a hero or stack headline, subhead and a "Get Started / Learn More" pair.
- Never set a sans-serif display face, gradient text, or any gradient at all.
- Never repeat three identical tiles; vary spans, or use a ruled list.
- Never put the accent on large fills (full-width bands, section backgrounds).
- Never use icons as decoration; if one is unavoidable, a typographic glyph (arrow, section sign) in the text face.
- Never use bold body text for emphasis; use italic.

## Component recipes

**Hero.** A mono folio line above a `border-t-2 border-fg` rule, then a 12-col grid: a 3-col margin column (kicker, byline, date in `text-muted-fg`) and a 9-col headline in `font-display font-light text-3xl sm:text-4xl md:text-5xl break-words` with one italic phrase. Below, a deck in italic display and the first paragraph with an accent drop cap (the view's only accent), offset to start at column 4. One primary action (`bg-fg text-bg rounded-sm`) and, at most, an underlined text link.

**Nav.** A masthead, not a navbar: the wordmark in `font-display text-2xl` on the left, section links in `font-body text-sm` separated by space (no pills), a hairline `border-b border-border` underneath. Links are `inline-flex min-h-11 items-center` for 44px targets. Active section: `text-fg underline decoration-fg`; others `text-muted-fg`.

**Pricing.** A ruled list, not a card grid. Each tier is a row on a 12-col grid: name in display, a one-line italic description, the price as an oversized light numeral, and a text-link or small button. The recommended tier gets a `border-t-2 border-accent` rule and an accent kicker; no badge pills, no scale-up.

**Card.** There are no cards. A "card" is a block that opens with a `border-t border-fg` rule, a mono label, a display numeral or headline, and body copy. Group blocks with whitespace and column spans of different widths.

**Table.** Full-width, `text-left`, header row in mono xs uppercase `text-muted-fg` over a `border-b border-fg` rule, body rows `divide-y divide-border`, numbers right-aligned with `tabular-nums font-mono`. Include a `caption` set in italic display.

**Form.** Labels above fields in mono xs uppercase; inputs are underline-only (`border-0 border-b border-fg bg-transparent rounded-none`) with focus shifting the rule to `border-accent`. Helper text in italic `text-sm text-muted-fg`; errors in `text-destructive` with a written message, never color alone. One submit button, left-aligned.
