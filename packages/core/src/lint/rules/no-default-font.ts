import type { Finding, Rule } from "../types.js";
import { declValue, firstFamily, isDefaultFont } from "./util.js";

const DISPLAY_PROPS = /^--font-(display|heading|title)$/;
const HEADING_SELECTOR = /(^|[\s>+~,])h[1-3]\b/i;
const HEADING_TAG = /^h[1-3]$/;
const ARBITRARY_FONT = /^font-\[(?:family-name:)?(.+)\]$/;

export const noDefaultFont: Rule = {
  id: "no-default-font",
  severity: "warn",
  description: "Inter, Roboto or Arial as the display (heading) font is the default-AI look.",
  check(file, ctx) {
    const findings: Finding[] = [];
    const hint =
      "Use the preset's display font (token `font.display`, e.g. `var(--font-display)`) for headings. Inter as body text is fine.";

    for (const decl of file.declarations) {
      const isFamily = decl.property === "font-family";
      const display =
        DISPLAY_PROPS.test(decl.property) ||
        (isFamily &&
          (decl.selector?.split(",").some((s) => HEADING_SELECTOR.test(s.trim())) ||
            (decl.element !== null && HEADING_TAG.test(decl.element.tag))));
      if (!display) continue;
      const value = declValue(decl);
      if (value.startsWith("var(")) continue;
      const family = firstFamily(value);
      if (isDefaultFont(family)) {
        findings.push({
          message: `"${family}" is the default AI font; \`${decl.property}\` for headings should be a distinctive typeface.`,
          loc: decl.valueLoc,
          suggestion: hint,
        });
      }
    }

    const displayFamily = ctx.tokens ? firstFamily(ctx.tokens.font.display) : "";
    for (const usage of file.classNames) {
      const heading = usage.element !== null && HEADING_TAG.test(usage.element.tag);
      for (const cls of usage.classes) {
        const arbitrary = ARBITRARY_FONT.exec(cls.utility);
        if (arbitrary?.[1]) {
          const family = firstFamily(arbitrary[1].replaceAll("_", " "));
          if (heading && isDefaultFont(family)) {
            findings.push({
              message: `\`${cls.value}\` sets "${family}" on a heading, the default AI font.`,
              loc: cls.loc,
              suggestion: hint,
            });
          }
        } else if (
          (cls.utility === "font-display" || cls.utility === "font-heading") &&
          isDefaultFont(displayFamily)
        ) {
          findings.push({
            message: `\`${cls.value}\` resolves to "${displayFamily}" in the active tokens, the default AI font.`,
            loc: cls.loc,
            suggestion:
              "Pick a preset whose display font is distinctive, or change the font tokens.",
          });
        }
      }
    }
    return findings;
  },
};
