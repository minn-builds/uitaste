import type { Finding, Rule } from "../types.js";
import { colorsIn, declValue, isPurpleColor } from "./util.js";

const GRADIENT_UTIL = /^bg-(gradient-to-|linear-|radial|conic)/;
const STOP = /^(from|via|to)-(.+)$/;
const TW_PURPLE = /^(?:purple|violet|fuchsia|indigo)-(\d{2,3})$/;

function isPurpleStop(rest: string): boolean {
  const color = rest.replace(/\/[\d.]+$|\/\[[^\]]+\]$/, "");
  const shade = TW_PURPLE.exec(color)?.[1];
  if (shade !== undefined) return Number(shade) >= 300;
  const arbitrary = /^\[(?:color:)?(.+)\]$/.exec(color);
  return arbitrary?.[1] ? isPurpleColor(arbitrary[1].replaceAll("_", " ")) : false;
}

export const noPurpleGradient: Rule = {
  id: "no-purple-gradient",
  severity: "warn",
  description: "Purple/violet/indigo gradients are the signature AI-generated look.",
  check(file) {
    const findings: Finding[] = [];
    const hint =
      "Use a flat surface from the palette tokens (e.g. `bg-accent`) or a gradient between the preset's own accent and neutral ramps.";

    for (const usage of file.classNames) {
      if (!usage.classes.some((c) => GRADIENT_UTIL.test(c.utility))) continue;
      const cls = usage.classes.find((c) => {
        const rest = STOP.exec(c.utility)?.[2];
        return rest !== undefined && isPurpleStop(rest);
      });
      if (cls) {
        findings.push({
          message: `\`${cls.value}\` is a purple gradient stop, the classic AI-default gradient.`,
          loc: cls.loc,
          suggestion: hint,
        });
      }
    }

    for (const decl of file.declarations) {
      const value = declValue(decl);
      if (!/(linear|radial|conic)-gradient\(/.test(value)) continue;
      if (colorsIn(value).some(isPurpleColor)) {
        findings.push({
          message: `\`${decl.property}\` uses a gradient with purple/violet stops, the classic AI-default look.`,
          loc: decl.valueLoc,
          suggestion: hint,
        });
      }
    }
    return findings;
  },
};
