# r/ClaudeAI post (draft)

**Title:** I built a skill + MCP server that makes Claude Code stop producing the same purple-gradient landing page

**Flair:** Built with Claude (or the subreddit's closest project flair)

**Image (post first, or as the first gallery image):** `docs/assets/before-after-event-conference.png`
Caption: Same prompt, same agent. Left is default Claude Code output, right is with uitaste's brutal preset. 1440 px and 390 px.

---

If you've built a few frontends with Claude Code you've probably seen the pattern: Inter, an indigo-to-purple gradient hero, three identical rounded feature cards, emoji as icons. Telling it "make it distinctive" helps for a component or two, then it drifts back.

I made uitaste to give Claude Code something more concrete than a prompt: a fixed set of design tokens, a linter that checks it used them, and screenshots so it can see what it rendered. It's open source (MIT) and runs locally with no API key, because your own agent does the critique.

## The workflow

**1. Install into a React project**

```sh
npx uitaste init --preset editorial   # or swiss, soft-utility, brutal
```

This writes `uitaste.tokens.css` (CSS variables, or a Tailwind v4 `@theme` if you use Tailwind v4), `uitaste.config.json`, and a skill in `.claude/skills/uitaste/`. If you have a `.cursor` folder it also writes `.cursor/rules/uitaste.mdc`.

**2. Ask for a page as usual**

Claude Code loads the skill when you ask for UI work. The skill tells it to:

- use only the preset's tokens (colors, type scale, spacing, radii)
- run `uitaste lint` and fix every error
- run `uitaste shoot` to screenshot the routes at 390, 768 and 1440 px
- read the PNGs, critique them against a written rubric, and fix what it finds, for at most two rounds

The two-round cap is deliberate. Without it the agent tends to keep polishing.

**3. The lint step is the part that holds**

`uitaste lint` exits 1 on errors, so Claude can't call the page done while it still uses `bg-indigo-500`, `p-[13px]`, a fourth radius or an off-token font. Warnings cover the AI tells: purple gradients, gradient headline text, uniform card grids, emoji icons, shadows on everything. `--json` gives the agent structured output.

**4. MCP, if you'd rather use tools than CLI calls**

```json
{
  "mcpServers": {
    "uitaste": {
      "command": "npx",
      "args": ["-y", "-p", "@uitaste/mcp", "uitaste-mcp"]
    }
  }
}
```

Tools: `list_presets`, `get_preset`, `generate_tokens`, `lint`, `shoot`. `shoot` only accepts local URLs (localhost, 127.0.0.1, `[::1]`) unless you set `shoot.url` in the config. Screenshots need Playwright in your project: `npm i -D playwright && npx playwright install chromium`.

## More examples

- Restaurant site, editorial preset: `docs/assets/before-after-restaurant.png`
- API pricing page, swiss preset: `docs/assets/before-after-pricing.png`
- The four presets: `docs/assets/preset-{editorial,swiss,soft-utility,brutal}.png`

## Caveats, up front

- **The benchmark number is biased.** I ran 10 prompts with and without uitaste and linted both. Baseline pages had 7–85 errors and uitaste pages had 0, but most baseline errors are stock Tailwind palette classes, which the linter counts as errors by design. That shows token discipline, not taste. The screenshots are the real evidence, so judge those.
- **Every page in the comparison was written by an agent**, from the prompts in `bench/prompts.json`. The uitaste runs knew they were being benchmarked, and the baseline runs got only the raw prompt. There's no blind preference test yet.
- **What it doesn't do:** it doesn't generate images or copy, doesn't sync with Figma, has no hosted service or accounts, and the skill/init flow targets React for now (the CSS-variable output works anywhere). Four presets is a small palette; it won't produce your brand from nothing, though `--accent` and `--font` let you override the accent color and display font.

Repo, all 10 before/afters, the prompts and the bench harness: <REPO_URL>

I'd like to hear where the skill instructions break down in longer sessions, and which preset you'd want next.
