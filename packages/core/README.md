# @uitaste/core

The library behind [uitaste](https://github.com/uitaste/uitaste): preset schema, OKLCH token generator, emitters (CSS variables, Tailwind v4 `@theme`, JSON), the design linter and the screenshot planner. The `uitaste` CLI and `@uitaste/mcp` are thin wrappers over it.

```ts
import { generateTokens, getPreset, toCssVars, toTailwindTheme } from "@uitaste/core";
```

Most people want the CLI instead: `npx uitaste init`. Docs: https://github.com/uitaste/uitaste

MIT
