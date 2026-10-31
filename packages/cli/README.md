# uitaste

Design tokens, a linter and a screenshot loop that make coding agents (Claude Code, Cursor, Codex) produce frontends that don't look like default AI output.

![Default agent output vs the same prompt with uitaste](https://raw.githubusercontent.com/uitaste/uitaste/main/docs/assets/before-after-event-conference.png)

```sh
npx uitaste init --preset editorial   # or: swiss, soft-utility, brutal
npx uitaste lint                      # flags hardcoded colors, arbitrary values, AI-default patterns
npx uitaste shoot --url http://localhost:5173 --routes /,/pricing   # needs playwright
```

`init` writes `uitaste.config.json`, a token file (CSS variables or a Tailwind v4 `@theme`) and the agent skill in `.claude/skills/uitaste/` (plus `.cursor/rules/uitaste.mdc` if a `.cursor` folder exists). Then ask your agent for a page as usual.

Docs, presets and before/afters: https://github.com/uitaste/uitaste

MIT
