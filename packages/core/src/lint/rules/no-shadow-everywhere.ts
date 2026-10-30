import type { ElementNode, Finding, Rule } from "../types.js";
import { declValue } from "./util.js";

const MIN_SHADOWED = 4;
const MIN_RATIO = 0.4;
const MIN_CSS_RULES = 5;
const REPEAT_WEIGHT = 3;

const INTERACTIVE = /:(hover|focus|focus-visible|focus-within|active|disabled)\b/;

/** `true` unless every layer is `none`, inset, or a ring (zero offset and blur, spread only). */
function isRealShadow(value: string): boolean {
  if (/^(none|inherit|initial|unset)$/.test(value.trim())) return false;
  return value.split(/,(?![^()]*\))/).some((layer) => {
    const l = layer.trim();
    return !/\binset\b/.test(l) && !/^0(px)?\s+0(px)?\s+0(px)?\s+\S/.test(l);
  });
}

function hasShadow(el: ElementNode): boolean {
  return el.classes.some(
    (c) =>
      c.variants.length === 0 &&
      /^shadow(-(xs|sm|md|lg|xl|2xl|inner|\[.+\]|\(.+\)))?$/.test(c.utility) &&
      c.utility !== "shadow-none",
  );
}

export const noShadowEverywhere: Rule = {
  id: "no-shadow-everywhere",
  severity: "warn",
  description: "Drop shadows on most elements flatten hierarchy and look generic.",
  check(file) {
    const hint =
      "Keep shadows for one elevation level (popovers, modals); separate other surfaces with borders or background steps from the tokens.";

    if (file.kind === "css") {
      const all = new Set<string>();
      const shadowed = new Map<string, (typeof file.declarations)[number]>();
      for (const d of file.declarations) {
        if (d.origin !== "stylesheet" || d.selector === null || d.property.startsWith("--"))
          continue;
        const key = `${d.atRules.join("|")}@@${d.selector}`;
        all.add(key);
        if (
          d.property === "box-shadow" &&
          !INTERACTIVE.test(d.selector) &&
          isRealShadow(declValue(d))
        ) {
          shadowed.set(key, d);
        }
      }
      const first = [...shadowed.values()][0];
      if (!first || shadowed.size < MIN_CSS_RULES || shadowed.size / all.size < MIN_RATIO)
        return [];
      const names = [...shadowed.values()].map((d) => d.selector);
      const listed = names.slice(0, 6).join(", ") + (names.length > 6 ? ", ..." : "");
      return [
        {
          message: `${shadowed.size} of ${all.size} rules set box-shadow (${listed}); shadows lose meaning when everything has one.`,
          loc: first.loc,
          suggestion: hint,
        },
      ];
    }

    const styled = file.elements.filter((e) => e.classes.length > 0 || e.style.length > 0);
    const shadowed = styled.filter(
      (e) =>
        hasShadow(e) ||
        e.style.some((d) => d.property === "box-shadow" && !/^none$/.test(declValue(d))),
    );
    const weight = (e: ElementNode) => (e.repeated && !e.parent?.repeated ? REPEAT_WEIGHT : 1);
    const count = shadowed.reduce((n, e) => n + weight(e), 0);
    const total = styled.reduce((n, e) => n + weight(e), 0);
    const first = shadowed[0];
    if (!first || count < MIN_SHADOWED || count / total < MIN_RATIO) return [];
    const finding: Finding = {
      message: `${count} of ${total} styled elements have a drop shadow; shadows lose meaning when everything has one.`,
      loc: first.loc,
      suggestion: hint,
    };
    return [finding];
  },
};
