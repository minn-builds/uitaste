# Progress log

- T1.1 · zod Preset + Tokens schemas
- T0.2 · GitHub Actions CI (typecheck, lint, test, build) + changesets
- T1.2 · generateTokens: modular type scale, 4/8pt spacing, gamut-mapped OKLCH ramps, AA-checked semantic roles, dark mode
- T2.1 · preset loader: listPresets/getPreset with default root, readable zod errors, path-escape checks
- T3.1 · lint engine: JSX/CSS/HTML → shared LintFile model, Rule/Finding API, zod config, pretty + JSON reporters
- T4.3 · tastekit preset list|show (--json, --root), thin citty wrapper over core loader
- T1.3 · emitters: toCssVars, toTailwindTheme (@theme + @theme inline, dark via .dark/prefers-color-scheme), toJson; playground token-proof page via Vite plugin · critic 2.9 → fixes applied (1 round)
- T1.4 · firstLegible nudges lightness until AA passes (throws if impossible); #000/#fff seeds tested
- T3.2 · six AI-tell lint rules (default display font, purple gradient, gradient hero text, uniform card grid, emoji icons, shadow everywhere), tuned for low false positives
- T4.4 · CLI vitest aliases @tastekit/core to src; turbo test depends on own build for the e2e
- T4.1 · tastekit init: framework detect, preset picker, tokens CSS + import patch, skill/cursor install, idempotent re-run with merged overrides
- T3.3 · token-discipline lint rules: no-hardcoded-color, no-arbitrary-values, max-radius-variants, font-from-tokens (url()-aware, cross-file radius loc)
