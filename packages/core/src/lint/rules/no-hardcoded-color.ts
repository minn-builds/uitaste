import type { Finding, Rule } from "../types.js";
import {
  COLOR_KEYWORDS,
  COLOR_PROPS,
  declValue,
  hardcodedColors,
  isGeneratedTokensFile,
} from "./util.js";

const PALETTE =
  "slate|gray|zinc|stone|red|orange|amber|yellow|lime|green|emerald|teal|cyan|sky|blue|indigo|violet|purple|fuchsia|pink|rose";
const COLOR_PREFIX =
  "bg|text|border(?:-[xytrblse])?|ring|ring-offset|outline|fill|stroke|from|via|to|accent|caret|decoration|divide|placeholder|shadow";
const PALETTE_CLASS = new RegExp(`^(${COLOR_PREFIX})-(${PALETTE})-(?:50|[1-9]00|950)(?:/.+)?$`);
const BARE_CLASS = new RegExp(`^(${COLOR_PREFIX})-(black|white)(?:/.+)?$`);
const ARBITRARY_CLASS = new RegExp(`^(?:${COLOR_PREFIX})-\\[(.+)\\](?:/.+)?$`);

export const noHardcodedColor: Rule = {
  id: "no-hardcoded-color",
  severity: "error",
  description:
    "Colors must come from the preset tokens, not hex/rgb/hsl/oklch literals, named colors, arbitrary Tailwind colors or stock palette classes.",
  check(file) {
    if (isGeneratedTokensFile(file.path)) return [];
    const findings: Finding[] = [];
    const hint =
      "Use a token: semantic classes (`bg-bg`, `text-fg`, `bg-accent`, `border-border`), ramp classes (`bg-accent-700`, `bg-neutral-100`) or `var(--color-…)`.";

    for (const decl of file.declarations) {
      const value = declValue(decl);
      if (COLOR_KEYWORDS.test(value.trim())) continue;
      const colors = hardcodedColors(value, COLOR_PROPS.test(decl.property));
      if (colors.length > 0) {
        findings.push({
          message: `\`${decl.property}\` hardcodes ${colors.map((c) => `\`${c}\``).join(", ")}.`,
          loc: decl.valueLoc,
          suggestion: hint,
        });
      }
    }

    for (const usage of file.classNames) {
      for (const cls of usage.classes) {
        const u = cls.utility;
        const arbitrary = ARBITRARY_CLASS.exec(u)?.[1];
        let bad = false;
        if (arbitrary !== undefined) {
          const inner = arbitrary.replace(/^(?:color|color-mix):/, "");
          bad = hardcodedColors(inner, true).length > 0 && !/^var\(/.test(inner);
        } else {
          bad = PALETTE_CLASS.test(u) || BARE_CLASS.test(u);
        }
        if (bad) {
          findings.push({
            message: `\`${cls.value}\` is a hardcoded color, not a token.`,
            loc: cls.loc,
            suggestion: hint,
          });
        }
      }
    }
    return findings;
  },
};
