import type { Finding, Rule } from "../types.js";
import { declValue, firstFamily, isGeneratedTokensFile } from "./util.js";

const TOKEN_FONT_CLASS = /^font-(display|body|mono)$/;
const STOCK_FAMILY_CLASS = /^font-(sans|serif)$/;
const ARBITRARY_FONT = /^font-\[(.+)\]$/;

export const fontFromTokens: Rule = {
  id: "font-from-tokens",
  severity: "error",
  description: "Font families must come from the font tokens (display/body/mono) or var(--…).",
  check(file, ctx) {
    if (isGeneratedTokensFile(file.path)) return [];
    const findings: Finding[] = [];
    const hint =
      "Use `font-display`, `font-body` or `font-mono`, or `font-family: var(--font-body)`.";
    const tokenFamilies = new Set(
      ctx.tokens ? Object.values(ctx.tokens.font).map((s) => firstFamily(s)) : [],
    );

    for (const decl of file.declarations) {
      if (decl.property !== "font-family") continue;
      const value = declValue(decl).trim();
      if (/^(inherit|initial|unset|revert)$/.test(value) || value.startsWith("var(")) continue;
      if (tokenFamilies.has(firstFamily(value))) continue;
      findings.push({
        message: `\`font-family: ${value}\` is not a font token.`,
        loc: decl.valueLoc,
        suggestion: hint,
      });
    }

    for (const usage of file.classNames) {
      for (const cls of usage.classes) {
        const u = cls.utility;
        if (TOKEN_FONT_CLASS.test(u)) continue;
        let bad = STOCK_FAMILY_CLASS.test(u);
        const inner = ARBITRARY_FONT.exec(u)?.[1];
        if (inner !== undefined) {
          const isWeight = /^(?:weight:)?\d+$/.test(inner);
          bad = !isWeight && !inner.includes("var(--");
        }
        if (/^font-\(.+\)$/.test(u) && !u.includes("(--")) bad = true;
        if (bad) {
          findings.push({
            message: `\`${cls.value}\` is not a font token.`,
            loc: cls.loc,
            suggestion: hint,
          });
        }
      }
    }
    return findings;
  },
};
