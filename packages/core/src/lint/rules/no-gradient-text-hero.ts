import { textContent } from "../tree.js";
import type { ElementNode, Finding, Rule, StyleDeclaration } from "../types.js";
import { declValue } from "./util.js";

const HEADING = /^h[1-2]$/;
const HERO_SELECTOR = /(^|[\s>+~,])h[1-2]\b|hero|headline|title/i;

function isHeroContext(el: ElementNode): boolean {
  for (let cur: ElementNode | null = el; cur; cur = cur.parent) {
    if (HEADING.test(cur.tag)) return true;
    if (cur.classes.some((c) => /hero|headline/i.test(c.utility))) return true;
  }
  return false;
}

const GRADIENT_UTIL = /^bg-(gradient-|linear-|radial|conic)/;
const GRADIENT_FN = /(linear|radial|conic)-gradient\(/;

function clipsToText(decls: readonly StyleDeclaration[]): boolean {
  const clip = decls.some(
    (d) => /^(-webkit-)?background-clip$/.test(d.property) && /\btext\b/.test(declValue(d)),
  );
  const transparent = decls.some(
    (d) =>
      (d.property === "color" || d.property === "-webkit-text-fill-color") &&
      /transparent/.test(declValue(d)),
  );
  const gradient = decls.some((d) => GRADIENT_FN.test(declValue(d)));
  return clip && transparent && gradient;
}

export const noGradientTextHero: Rule = {
  id: "no-gradient-text-hero",
  severity: "warn",
  description: "Gradient-filled headline text (bg-clip-text + text-transparent) in a hero.",
  check(file) {
    const findings: Finding[] = [];
    const hint =
      "Set the headline in a solid text color from the tokens (`text-fg` or `text-accent`) and let type size and weight carry emphasis.";

    for (const el of file.elements) {
      const utilities = new Set(el.classes.map((c) => c.utility));
      const tailwind =
        utilities.has("bg-clip-text") &&
        utilities.has("text-transparent") &&
        el.classes.some((c) => GRADIENT_UTIL.test(c.utility));
      if ((tailwind || clipsToText(el.style)) && isHeroContext(el)) {
        const label = textContent(el).slice(0, 40);
        findings.push({
          message: `Gradient text on <${el.tag}>${label ? ` ("${label}")` : ""} is an AI-default hero treatment.`,
          loc: el.loc,
          suggestion: hint,
        });
      }
    }

    const byRule = new Map<string, StyleDeclaration[]>();
    for (const d of file.declarations) {
      if (d.origin !== "stylesheet" || d.selector === null) continue;
      const key = `${d.atRules.join("|")}@@${d.selector}`;
      byRule.set(key, [...(byRule.get(key) ?? []), d]);
    }
    for (const decls of byRule.values()) {
      const first = decls[0];
      if (first?.selector && HERO_SELECTOR.test(first.selector) && clipsToText(decls)) {
        findings.push({
          message: `\`${first.selector}\` fills text with a gradient (background-clip: text), an AI-default hero treatment.`,
          loc: first.loc,
          suggestion: hint,
        });
      }
    }
    return findings;
  },
};
