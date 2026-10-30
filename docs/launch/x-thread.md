# X thread (draft)

Seven posts. Attach the listed image to each post. Character counts are for the post text only (X counts a URL as 23 characters; `<REPO_URL>` is a placeholder until the repo is public). X shows backticks literally, so remove them when posting; every post stays under 280 with or without them.

---

**1/7** · attach `docs/assets/before-after-event-conference.png`

Same prompt, same agent. Left: what it builds by default. Right: what it builds with tastekit installed.

tastekit is an open-source kit of design tokens, a linter and a screenshot loop that keeps coding agents off the default AI look.

---

**2/7** · attach `docs/assets/hero.gif`

The problem: agent-built frontends converge. Inter, indigo-to-purple gradients, centered hero, three identical rounded cards.

Asking the model to "be creative" doesn't hold. It drifts back to defaults over a session and never sees what it rendered.

---

**3/7** · attach `docs/assets/preset-editorial.png`

Lever 1: presets. Four hand-built directions (editorial, swiss, soft-utility, brutal) with type, OKLCH color, radius, spacing, motion and composition rules.

`npx @tastekit/cli init` writes them as CSS variables or a Tailwind v4 theme.

---

**4/7** · attach `docs/assets/before-after-restaurant.png`

Lever 2: a design linter. `tastekit lint` errors on hardcoded colors, arbitrary values, extra radii and off-token fonts, and warns on AI tells like purple gradients, uniform card grids and emoji icons.

Exit code 1, so it works in CI too.

---

**5/7** · attach `docs/assets/before-after-pricing.png`

Lever 3: `tastekit shoot` screenshots your routes at 390, 768 and 1440 px. Your own agent critiques the PNGs against a rubric and fixes what it finds, two rounds max.

No API key, nothing hosted. It also ships an MCP server and a Claude Code skill.

---

**6/7** · no image

Honest caveats: the bench (10 prompts) shows 7–85 lint errors for baseline vs 0 with tastekit, but stock Tailwind palette classes count as errors, so that favors tastekit by design. All pages were agent-written. No blind preference test yet. Judge the screenshots.

---

**7/7** · no image

v0.1.0, MIT, React only for now (the CSS-variable output works anywhere). No image generation, no Figma sync.

Try it: `npx @tastekit/cli init`
All 10 before/afters and the prompts are in the repo: <REPO_URL>
