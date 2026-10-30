---

name: critique
description: Screenshot a page of the playground (or any URL), get a design critique against the rubric and apply the top fixes. Max 2 rounds.
argument-hint: "<route-or-url> [preset-id]"
disable-model-invocation: true
---

Target: $ARGUMENTS (a route like `/presets/editorial` means the playground at http://localhost:5173).

1. Make sure the playground dev server is running (`pnpm --filter playground dev` in the background if port 5173 is free).
2. Screenshot with `pnpm uitaste shoot <url>` (before T5.1 exists, use `node scripts/shoot.mjs <url>`, a minimal Playwright script at 390/1440 widths). Output goes to `.uitaste/shots/`.
3. Spawn `design-critic` with the screenshot paths and preset id. Don't open the images in the main context yourself.
4. Apply fixes 1–3 (the highest-impact ones). Use tokens only.
5. Re-shoot and run the critic once more. Stop after round 2 even if the score isn't perfect.
6. Report: score before → after, fixes applied, remaining issues (1 line each).
