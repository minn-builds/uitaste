---

name: new-preset
description: Create a new style preset end to end (author, validate, render, critique).
argument-hint: "<preset-id> <one-line direction, e.g. 'swiss: strict grid, grotesk type, red accent'>"
disable-model-invocation: true
---

Preset request: $ARGUMENTS

1. Spawn `preset-author` with the id and direction.
2. Register the preset's examples on a playground route `/presets/<id>` (one page showing Hero, Pricing, DashboardCard at full width).
3. Run `/critique /presets/<id> <id>`.
4. Check it against the other presets: screenshot `/presets/<other-id>` for one existing preset and confirm the two are clearly different (layout and type, not just color). If they aren't, send the critic's notes back to `preset-author` once.
5. Verify (`verifier`), then commit as `feat(presets): add <id>`.
6. Report: essence line, final critic score, screenshot paths.
