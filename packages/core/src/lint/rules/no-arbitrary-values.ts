import type { Finding, Rule } from "../types.js";
import { hardcodedColors } from "./util.js";

const ARBITRARY = /^-?([a-z][a-z0-9-]*)-\[(.+)\](?:\/.+)?$/;

/**
 * Utilities where a bracket value is structural rather than a design value: raw content,
 * grid templates, aspect ratios, images/urls and will-change.
 */
const STRUCTURAL = new Set([
  "content",
  "grid-cols",
  "grid-rows",
  "col",
  "row",
  "aspect",
  "will-change",
  "list",
  "mask",
  "fill",
  "stroke",
  "clip",
]);

/**
 * Flags Tailwind bracket values for spacing, size, radius, type and the like.
 * Allowed: `var(--…)` forms (`w-(--x)`, `w-[var(--x)]`, `w-[calc(…var(--x)…)]`), arbitrary
 * properties (`[grid-template-columns:…]`, an escape hatch with no utility), structural utilities
 * (content, grid-cols/rows, aspect, url()) and colors (reported by no-hardcoded-color).
 */
export const noArbitraryValues: Rule = {
  id: "no-arbitrary-values",
  severity: "error",
  description: "Tailwind arbitrary values (`p-[13px]`) bypass the token scales.",
  check(file) {
    const findings: Finding[] = [];
    for (const usage of file.classNames) {
      for (const cls of usage.classes) {
        const m = ARBITRARY.exec(cls.utility);
        if (!m) continue;
        const [, prefix = "", inner = ""] = m;
        if (STRUCTURAL.has(prefix)) continue;
        if (/var\(--/.test(inner)) continue;
        if (/url\(|image:|^(?:color|family-name):/.test(inner)) continue;
        if (hardcodedColors(inner, true).length > 0) continue;
        findings.push({
          message: `\`${cls.value}\` uses an arbitrary value instead of a token scale.`,
          loc: cls.loc,
          suggestion:
            "Use a scale utility (`p-4`, `rounded-md`, `text-lg`) or reference a token, e.g. `p-(--tk-space-4)`. Extend the preset if the value is truly missing.",
        });
      }
    }
    return findings;
  },
};
