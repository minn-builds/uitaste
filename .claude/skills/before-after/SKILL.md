---

name: before-after
description: Build the same page twice (plain agent default vs tastekit) and produce a side-by-side comparison image for the benchmark and marketing.
argument-hint: "<prompt-id from bench/prompts.json | 'all'>"
disable-model-invocation: true
---

Target: $ARGUMENTS

For each prompt:
1. **Baseline**: spawn a `general-purpose` subagent with ONLY the raw prompt text and the instruction "Build this as a single React + Tailwind page at `bench/pages/<id>/baseline.tsx`. Use your normal defaults." Do NOT give it tastekit context.
2. **tastekit**: spawn a second `general-purpose` subagent with the same prompt plus "Follow `packages/skill/SKILL.md` using preset `<preset>`" (the preset is set per prompt in `bench/prompts.json`). Output: `bench/pages/<id>/tastekit.tsx`.
3. Render both via the playground route `/bench/<id>/{baseline,tastekit}` and screenshot at 1440 and 390.
4. Compose a side-by-side PNG (`bench/scripts/compose.mjs`, using sharp) → `bench/out/<id>.png`, labeled "Default agent" / "With tastekit".
5. Run `npx tastekit lint` on both files and record the error counts in `bench/out/results.json`.

The two subagents keep both builds independent and out of the main context. Report: one line per prompt with the lint counts and the output path.
