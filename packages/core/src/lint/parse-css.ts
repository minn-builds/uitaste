import postcss, { type AtRule, type ChildNode, type Declaration, type Root } from "postcss";
import { splitClasses } from "./classes.js";
import type { LineIndex } from "./location.js";
import type { ClassNameUsage, ElementNode, StyleDeclaration } from "./types.js";

export interface CssParseOptions {
  /** Offset of the CSS text inside the full file (for `<style>` blocks and `style=""` attributes). */
  baseOffset: number;
  lines: LineIndex;
  origin: StyleDeclaration["origin"];
  element: ElementNode | null;
}

export interface CssParseResult {
  declarations: StyleDeclaration[];
  classNames: ClassNameUsage[];
}

function startOffset(node: ChildNode): number | null {
  return node.source?.start?.offset ?? null;
}

function declaration(
  decl: Declaration,
  selector: string | null,
  atRules: string[],
  opts: CssParseOptions,
): StyleDeclaration | null {
  const start = startOffset(decl);
  if (start === null) return null;
  const between = decl.raws.between ?? ":";
  const rawValue = decl.raws.value?.raw ?? decl.value;
  const importantRaw = decl.important ? (decl.raws.important ?? " !important") : "";
  const from = opts.baseOffset + start;
  const valueStart = from + decl.prop.length + between.length;
  const valueEnd = valueStart + rawValue.length;
  return {
    property: decl.prop,
    value: decl.value,
    raw: rawValue,
    important: decl.important === true,
    origin: opts.origin,
    selector,
    atRules,
    element: opts.element,
    loc: opts.lines.range(from, valueEnd + importantRaw.length),
    valueLoc: opts.lines.range(valueStart, valueEnd),
  };
}

function applyUsage(rule: AtRule, opts: CssParseOptions): ClassNameUsage | null {
  const start = startOffset(rule);
  if (start === null) return null;
  const paramsStart =
    opts.baseOffset + start + 1 + rule.name.length + (rule.raws.afterName ?? "").length;
  return {
    value: rule.params,
    classes: splitClasses(rule.params, paramsStart, opts.lines),
    source: "@apply",
    dynamic: false,
    element: null,
    loc: opts.lines.range(paramsStart, paramsStart + rule.params.length),
  };
}

function walk(
  nodes: ChildNode[],
  selector: string | null,
  atRules: string[],
  opts: CssParseOptions,
  out: CssParseResult,
): void {
  for (const node of nodes) {
    if (node.type === "decl") {
      const d = declaration(node, selector, atRules, opts);
      if (d) out.declarations.push(d);
    } else if (node.type === "rule") {
      walk(node.nodes, node.selector, atRules, opts, out);
    } else if (node.type === "atrule") {
      if (node.name === "apply") {
        const usage = applyUsage(node, opts);
        if (usage) out.classNames.push(usage);
      }
      if (node.nodes) {
        const label = node.params ? `${node.name} ${node.params}` : node.name;
        walk(node.nodes, selector, [...atRules, label], opts, out);
      }
    }
  }
}

/** Parses a stylesheet (or a bare declaration list like an HTML `style` attribute). Throws on syntax errors. */
export function parseCss(css: string, opts: CssParseOptions): CssParseResult {
  const root: Root = postcss.parse(css);
  const out: CssParseResult = { declarations: [], classNames: [] };
  walk(root.nodes, null, [], opts, out);
  return out;
}
