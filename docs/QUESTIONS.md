# Questions for the human (answer inline, then reopen the task in TASKS.md)

## FYI · Phase 2 done (presets)

Please look at the four presets (render with `pnpm --filter playground dev` → `/presets/<id>`):

- `.tastekit/shots/T2.2/editorial-{390,1440}.png` · critic 3.6 after fixes
- `.tastekit/shots/T2.2/swiss-{390,1440}.png` · critic 3.6 after fixes
- `.tastekit/shots/T2.3/soft-utility-{390,1440}.png` · critic 4.0
- `.tastekit/shots/T2.3/brutal-{390,1440}.png` · critic 4.3

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

Lint errors per page are 7–85 for the baseline and 0 for tastekit. Note that most baseline errors come from stock palette classes (`no-hardcoded-color`), so this metric favors tastekit by construction. The screenshots are the real evidence.

The tastekit bench pages were written by agents that knew they were being benchmarked, and the baseline agents got only the raw prompt. Worth an honest disclosure in launch posts.
