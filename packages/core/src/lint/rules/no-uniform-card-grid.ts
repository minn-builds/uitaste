import { elementChildren } from "../tree.js";
import type { ElementNode, Finding, Rule } from "../types.js";

const MIN_SIBLINGS = 3;
const CARD_NAME = /card|tile|feature/i;
const TEXTY = /^(h[1-6]|p)$/;

function classKey(el: ElementNode): string {
  return [...new Set(el.classes.map((c) => c.value))].sort().join(" ");
}

/** Structural fingerprint: tag + class set + children's fingerprints (text ignored). */
function signature(el: ElementNode): string {
  return `${el.tag}[${classKey(el)}](${elementChildren(el).map(signature).join(",")})`;
}

function hasTextyDescendant(el: ElementNode): boolean {
  return elementChildren(el).some((c) => TEXTY.test(c.tag) || hasTextyDescendant(c));
}

/** A real card look: a card-ish name, or rounded + border/shadow/ring with a heading or paragraph inside. */
function isCardLike(el: ElementNode): boolean {
  if (/^(tr|td|th|thead|tbody|tfoot)$/.test(el.tag)) return false;
  if (el.tag === "li" && (el.parent?.tag === "ul" || el.parent?.tag === "ol")) return false;
  if (CARD_NAME.test(el.tag) || el.classes.some((c) => CARD_NAME.test(c.utility))) return true;
  const u = el.classes.filter((c) => c.variants.length === 0).map((c) => c.utility);
  const rounded = u.some((x) => /^rounded(-(?!none).+)?$/.test(x));
  const surface = u.some((x) => /^(border$|border-\d|shadow|ring)/.test(x) || x === "border");
  return rounded && surface && hasTextyDescendant(el);
}

function isGridParent(el: ElementNode | null): boolean {
  if (!el) return false;
  const u = el.classes.map((c) => c.utility);
  return (
    u.includes("grid") ||
    u.includes("inline-grid") ||
    (u.includes("flex") && u.includes("flex-wrap"))
  );
}

export const noUniformCardGrid: Rule = {
  id: "no-uniform-card-grid",
  severity: "warn",
  description: "A grid of identical cards (the AI feature-grid).",
  check(file) {
    const findings: Finding[] = [];
    const hint =
      "Vary the layout: make one item larger, mix spans, use a list or table, or cut to the 2 items that matter.";

    for (const el of file.elements) {
      if (el.repeated && !el.parent?.repeated && isGridParent(el.parent) && isCardLike(el)) {
        findings.push({
          message: `<${el.tag}> is rendered from a .map() into a grid as identical cards.`,
          loc: el.loc,
          suggestion: hint,
        });
      }
    }

    for (const parent of file.elements) {
      const groups = new Map<string, ElementNode[]>();
      for (const child of elementChildren(parent)) {
        if (child.repeated || !isCardLike(child)) continue;
        const key = signature(child);
        groups.set(key, [...(groups.get(key) ?? []), child]);
      }
      for (const group of groups.values()) {
        const first = group[0];
        if (first && group.length >= MIN_SIBLINGS) {
          findings.push({
            message: `${group.length} identical sibling <${first.tag}> cards with the same classes and structure.`,
            loc: first.loc,
            suggestion: hint,
          });
        }
      }
    }
    return findings;
  },
};
