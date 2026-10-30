import type { ElementNode } from "./types.js";

/** Direct child elements (text nodes skipped). */
export function elementChildren(el: ElementNode): ElementNode[] {
  return el.children.filter((c): c is ElementNode => c.type === "element");
}

/** Concatenated static text of an element and its descendants, space-joined. */
export function textContent(el: ElementNode): string {
  return el.children
    .map((c) => (c.type === "text" ? c.value : textContent(c)))
    .filter((s) => s !== "")
    .join(" ");
}

/** Depth-first, pre-order walk over an element and its descendants. Return `false` to skip children. */
export function walkElements(root: ElementNode, visit: (el: ElementNode) => unknown): void {
  if (visit(root) === false) return;
  for (const child of elementChildren(root)) walkElements(child, visit);
}
