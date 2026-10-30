# Questions for the human (answer inline, then reopen the task in TASKS.md)

## FYI · Phase 2 done (presets)

Please look at the four presets (render with `pnpm --filter playground dev` → `/presets/<id>`):

- `.uitaste/shots/T2.2/editorial-{390,1440}.png` · critic 3.6 after fixes
- `.uitaste/shots/T2.2/swiss-{390,1440}.png` · critic 3.6 after fixes
- `.uitaste/shots/T2.3/soft-utility-{390,1440}.png` · critic 4.0
- `.uitaste/shots/T2.3/brutal-{390,1440}.png` · critic 4.3

Open critic notes:

- Editorial and swiss were not re-scored after their fix round.
- Soft-utility's hero frame still has a ~100px gap under its table.
- Brutal's "Choose Crew" button reads peach on the orange slab.

## FYI · Phase 7 done (proof)

Please look at:

- `docs/assets/hero.gif`
- `docs/assets/before-after-{event-conference,restaurant,pricing}.png`
- all 10 comparisons in `bench/out/*.png`
- `README.md`

Lint errors per page are 7–85 for the baseline and 0 for uitaste. Note that most baseline errors come from stock palette classes (`no-hardcoded-color`), so this metric favors uitaste by construction. The screenshots are the real evidence.

The uitaste bench pages were written by agents that knew they were being benchmarked, and the baseline agents got only the raw prompt. Worth an honest disclosure in launch posts.

## Q1 · LICENSE file before publishing (T8.1) · RESOLVED

Resolved 2026-10-30: MIT, copyright 2026 Minn Thit Kyaw. `LICENSE` is at the root and copied into each package, so npm tarballs ship it.

Still before you publish:

- Confirm you can publish the unscoped `uitaste` package and the `@uitaste` scope (`npm whoami`, `npm view uitaste`).
- Use Node ≥ 22: the @changesets/cli 3 crashes on Node 20.
