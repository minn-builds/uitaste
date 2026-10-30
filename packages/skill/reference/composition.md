# Composition: replacing the AI-default page

The default agent landing page is: centered hero, gradient headline, two buttons, logo cloud,
three icon cards, testimonial grid, centered CTA, footer. Every section the same width and
height. Use this file to plan something else. The preset's **component recipes** in
`preset.md` always win over the generic patterns here.

## Plan the page first

Before writing JSX, write a one-line plan per section: its job, its layout, and which signature
move it uses. Example for a SaaS landing page:

```
nav      wordmark left, 3 links, one text CTA            (preset nav recipe)
hero     7/5 split: headline + 1 CTA | product proof      (signature move 1)
proof    one big number + one sentence, full-bleed band   (signature move 2)
how      numbered steps as a dense list, not cards
detail   one lead feature with a screenshot + 4 rows
pricing  preset pricing recipe, recommended plan emphasized
close    left-aligned CTA line + plain link, then footer
```

Rules of thumb:

- No two adjacent sections share a layout. Alternate split, list, full-bleed, table, offset.
- Vary section height on purpose: a dense band between two tall sections creates rhythm.
- One focal point per screen. One primary button per view; the second action is a text link.
- Left-align by default. Center only when the preset's recipe centers.

## Hero alternatives

- **Split** (`lg:grid-cols-12`): headline and one CTA in `col-span-7`, proof in `col-span-5`
  (a real UI fragment, a number, a code snippet, a quote). Stack on mobile with the headline first.
- **Headline-led**: one very large `font-display` headline across 9–10 columns, the subhead in a
  narrow column offset to the right, CTA under it.
- **Document**: the hero is the product's own artifact (an invoice, a terminal, a schedule)
  rendered in tokens, with a short headline above.

Headline copy names the outcome for a specific user ("Close the month in two days, not ten"),
not a category ("The all-in-one platform for modern teams").

## Feature alternatives (instead of 3 icon cards)

- **Definition list**: `<dl>` rows with `divide-y divide-border`; term in `font-display` or
  `font-mono`, description in `font-body text-muted-fg`, 2 columns on `md:`.
- **Lead + rows**: the most important feature large with a visual (`lg:col-span-7`), the rest as
  compact text rows beside it (`lg:col-span-5`).
- **Numbered steps**: `01 / 02 / 03` in `font-mono` or `font-display`, each step a sentence,
  laid out as a list or a horizontal track with rules between.
- **Comparison table**: "Before / With us" or "Manual / Automated" columns, numbers in
  `font-mono tabular-nums`.

## Social proof without the template

- One specific quote with a name, role and company, set large, instead of a grid of six.
- Real-sounding numbers with units and a time frame ("4,200 invoices sent last month").
- Skip the logo cloud unless the user gives real logos.

## Responsive (390px first)

- Decide the mobile order: headline, one line of proof, CTA. Hide nothing important.
- Type steps down one or two sizes on mobile (`text-3xl md:text-5xl`); keep body at `text-base`.
- Tap targets at least 44px (`min-h-11` or `py-3` on buttons and links in lists).
- Tables become stacked rows (`grid` per row) or scroll inside their own container, never the page.
- Check for horizontal scroll at 390: long words, wide tables, fixed widths, negative margins.

## Copy

- No lorem ipsum, "Acme", "Lorem Corp", "John Doe", or "Feature 1/2/3".
- Buttons say what happens ("Start a 14-day trial", "See the pricing"), not "Get Started" /
  "Learn More".
- Keep claims concrete and checkable. Fewer, sharper sections beat more generic ones.
