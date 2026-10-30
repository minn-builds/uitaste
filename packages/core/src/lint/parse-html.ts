import { type DefaultTreeAdapterMap, parse, parseFragment } from "parse5";
import { classTokensAt } from "./classes.js";
import type { LineIndex } from "./location.js";
import { parseCss } from "./parse-css.js";
import type { ElementNode, LintFile, TextNode } from "./types.js";

type P5Node = DefaultTreeAdapterMap["node"];
type P5Element = DefaultTreeAdapterMap["element"];
type HtmlParts = Pick<LintFile, "roots" | "elements" | "texts" | "classNames" | "declarations">;

const RAW_TEXT = new Set(["script", "style", "noscript", "template"]);

function isElement(node: P5Node): node is P5Element {
  return "tagName" in node;
}

function childNodes(node: P5Node): P5Node[] {
  return "childNodes" in node ? node.childNodes : [];
}

/** Finds the value span of an attribute from its source span (`class="a b"` -> span of `a b`). */
function attrValueSpan(
  source: string,
  start: number,
  end: number,
): { start: number; end: number } | null {
  const raw = source.slice(start, end);
  const eq = raw.indexOf("=");
  if (eq === -1) return null;
  let i = eq + 1;
  while (i < raw.length && /\s/.test(raw[i] ?? "")) i++;
  const quote = raw[i];
  if (quote === '"' || quote === "'") {
    const close = raw.lastIndexOf(quote);
    return { start: start + i + 1, end: start + (close > i ? close : raw.length) };
  }
  return { start: start + i, end };
}

class HtmlCollector {
  readonly out: HtmlParts = {
    roots: [],
    elements: [],
    texts: [],
    classNames: [],
    declarations: [],
  };

  constructor(
    private readonly source: string,
    private readonly lines: LineIndex,
  ) {}

  private element(node: P5Element, parent: ElementNode | null): void {
    const loc = node.sourceCodeLocation;
    // parse5 synthesises <html>/<head>/<body> when missing; those have no location. Flatten them.
    if (!loc) {
      for (const child of childNodes(node)) this.visit(child, parent);
      return;
    }
    const el: ElementNode = {
      type: "element",
      tag: node.tagName,
      attributes: [],
      children: [],
      parent,
      classes: [],
      style: [],
      repeated: false,
      loc: this.lines.range(loc.startOffset, loc.endOffset),
    };
    this.out.elements.push(el);
    if (parent) parent.children.push(el);
    else this.out.roots.push(el);

    for (const attr of node.attrs) {
      const aloc = loc.attrs?.[attr.name];
      if (!aloc) continue;
      el.attributes.push({
        name: attr.name,
        value: attr.value,
        dynamic: false,
        loc: this.lines.range(aloc.startOffset, aloc.endOffset),
      });
      const span = attrValueSpan(this.source, aloc.startOffset, aloc.endOffset);
      if (!span) continue;
      const rawValue = this.source.slice(span.start, span.end);
      if (attr.name === "class" && attr.value.trim() !== "") {
        const classes = classTokensAt(attr.value, rawValue, span.start, this.lines);
        el.classes.push(...classes);
        this.out.classNames.push({
          value: attr.value,
          classes,
          source: "class",
          dynamic: false,
          element: el,
          loc: this.lines.range(span.start, span.end),
        });
      } else if (attr.name === "style" && rawValue.trim() !== "") {
        const { declarations } = parseCss(rawValue, {
          baseOffset: span.start,
          lines: this.lines,
          origin: "inline",
          element: el,
        });
        el.style.push(...declarations);
        this.out.declarations.push(...declarations);
      }
    }

    if (node.tagName === "style") {
      for (const child of childNodes(node)) {
        const cloc = child.sourceCodeLocation;
        if (child.nodeName !== "#text" || !cloc) continue;
        const css = this.source.slice(cloc.startOffset, cloc.endOffset);
        const parsed = parseCss(css, {
          baseOffset: cloc.startOffset,
          lines: this.lines,
          origin: "stylesheet",
          element: null,
        });
        this.out.declarations.push(...parsed.declarations);
        this.out.classNames.push(...parsed.classNames);
      }
      return;
    }
    if (RAW_TEXT.has(node.tagName)) return;
    for (const child of childNodes(node)) this.visit(child, el);
  }

  private text(start: number, end: number, value: string, parent: ElementNode | null): void {
    const raw = this.source.slice(start, end);
    const trimmed = raw.trim();
    if (trimmed === "") return;
    const lead = raw.length - raw.trimStart().length;
    const node: TextNode = {
      type: "text",
      value: value.trim().replace(/\s+/g, " "),
      parent,
      loc: this.lines.range(start + lead, start + lead + trimmed.length),
    };
    this.out.texts.push(node);
    parent?.children.push(node);
  }

  visit(node: P5Node, parent: ElementNode | null): void {
    if (isElement(node)) {
      this.element(node, parent);
      return;
    }
    if (node.nodeName === "#text" && "value" in node) {
      const loc = node.sourceCodeLocation;
      if (loc) this.text(loc.startOffset, loc.endOffset, node.value, parent);
      return;
    }
    for (const child of childNodes(node)) this.visit(child, parent);
  }
}

/** Parses an HTML document or fragment into the shared lint model. parse5 is error-tolerant and never throws. */
export function parseHtml(source: string, lines: LineIndex): HtmlParts {
  const isDocument = /<!doctype|<html[\s>]/i.test(source);
  const opts = { sourceCodeLocationInfo: true } as const;
  const root = isDocument ? parse(source, opts) : parseFragment(source, opts);
  const collector = new HtmlCollector(source, lines);
  collector.visit(root, null);
  return collector.out;
}
