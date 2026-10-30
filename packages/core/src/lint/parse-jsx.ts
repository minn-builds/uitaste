import { type ParserPlugin, parse } from "@babel/parser";
import type {
  CallExpression,
  Expression,
  JSXAttribute,
  JSXElement,
  JSXText,
  Node,
  ObjectExpression,
} from "@babel/types";
import { classTokensAt } from "./classes.js";
import type { LineIndex } from "./location.js";
import type { Attribute, ClassSource, ElementNode, LintFile, StyleDeclaration } from "./types.js";

/** Call names whose string arguments are treated as class strings. */
export const CLASS_HELPERS: ReadonlySet<string> = new Set([
  "cn",
  "clsx",
  "classnames",
  "classNames",
  "cx",
  "cva",
  "tv",
  "twMerge",
  "twJoin",
]);

const SKIP_KEYS = new Set([
  "loc",
  "start",
  "end",
  "extra",
  "range",
  "leadingComments",
  "trailingComments",
  "innerComments",
]);

type JsxParts = Pick<LintFile, "roots" | "elements" | "texts" | "classNames" | "declarations">;

function isNode(value: unknown): value is Node {
  return (
    typeof value === "object" &&
    value !== null &&
    typeof (value as { type?: unknown }).type === "string"
  );
}

function pluginsFor(path: string): ParserPlugin[] {
  if (/\.tsx$/i.test(path)) return ["jsx", "typescript"];
  if (/\.(c|m)?ts$/i.test(path)) return ["typescript"];
  return ["jsx"];
}

/** `backgroundColor` -> `background-color`, `WebkitTransform` -> `-webkit-transform`, `msX` -> `-ms-x`. */
export function toKebabCase(property: string): string {
  if (property.startsWith("--")) return property;
  const kebab = property.replace(/[A-Z]/g, (c) => `-${c.toLowerCase()}`);
  return property.startsWith("ms") && /^ms[A-Z]/.test(property) ? `-${kebab}` : kebab;
}

interface StringPiece {
  /** Decoded string value. */
  value: string;
  /** Source text of the string content (differs from `value` when it contains escapes). */
  raw: string;
  start: number;
}

class JsxCollector {
  readonly out: JsxParts = { roots: [], elements: [], texts: [], classNames: [], declarations: [] };

  constructor(
    private readonly source: string,
    private readonly lines: LineIndex,
  ) {}

  private range(node: Node) {
    return this.lines.range(node.start ?? 0, node.end ?? 0);
  }

  private addClassPieces(
    pieces: StringPiece[],
    source: ClassSource,
    dynamic: boolean,
    element: ElementNode | null,
  ): void {
    for (const piece of pieces) {
      if (piece.value.trim() === "") continue;
      const classes = classTokensAt(piece.value, piece.raw, piece.start, this.lines);
      this.out.classNames.push({
        value: piece.value,
        classes,
        source,
        dynamic,
        element,
        loc: this.lines.range(piece.start, piece.start + piece.raw.length),
      });
      if (element) element.classes.push(...classes);
    }
  }

  /** Collects static string pieces that end up as class names from an expression. */
  private classStrings(node: Node, out: StringPiece[]): void {
    switch (node.type) {
      case "StringLiteral": {
        const start = (node.start ?? 0) + 1;
        const raw = this.source.slice(start, (node.end ?? start + 1) - 1);
        out.push({ value: node.value, raw, start });
        return;
      }
      case "TemplateLiteral":
        for (const quasi of node.quasis) {
          out.push({
            value: quasi.value.cooked ?? quasi.value.raw,
            raw: quasi.value.raw,
            start: quasi.start ?? 0,
          });
        }
        for (const expr of node.expressions) this.classStrings(expr, out);
        return;
      case "ConditionalExpression":
        this.classStrings(node.consequent, out);
        this.classStrings(node.alternate, out);
        return;
      case "LogicalExpression":
        if (node.operator !== "&&") this.classStrings(node.left, out);
        this.classStrings(node.right, out);
        return;
      case "ArrayExpression":
        for (const el of node.elements) if (el) this.classStrings(el, out);
        return;
      case "ObjectExpression":
        this.objectClassStrings(node, out, false);
        return;
      case "CallExpression":
        for (const arg of node.arguments) this.classStrings(arg, out);
        return;
      case "TSAsExpression":
      case "TSSatisfiesExpression":
      case "ParenthesizedExpression":
        this.classStrings(node.expression, out);
        return;
      default:
        return;
    }
  }

  /** clsx-style `{ "a b": cond }` keys and cva-style `{ base: "...", variants: {...} }` values. */
  private objectClassStrings(
    node: ObjectExpression,
    out: StringPiece[],
    onlyClassKeys: boolean,
  ): void {
    for (const prop of node.properties) {
      if (prop.type !== "ObjectProperty") continue;
      const key =
        prop.key.type === "Identifier"
          ? prop.key.name
          : prop.key.type === "StringLiteral"
            ? prop.key.value
            : null;
      if (onlyClassKeys) {
        if (key === "class" || key === "className") this.classStrings(prop.value, out);
        continue;
      }
      if (!prop.computed && prop.key.type === "StringLiteral") this.classStrings(prop.key, out);
      if (key === "defaultVariants") continue;
      if (key === "compoundVariants" && prop.value.type === "ArrayExpression") {
        for (const item of prop.value.elements) {
          if (item?.type === "ObjectExpression") this.objectClassStrings(item, out, true);
        }
        continue;
      }
      this.classStrings(prop.value, out);
    }
  }

  private staticString(node: Node): string | null {
    if (node.type === "StringLiteral") return node.value;
    if (node.type === "TemplateLiteral" && node.expressions.length === 0) {
      const q = node.quasis[0];
      return q ? (q.value.cooked ?? q.value.raw) : "";
    }
    return null;
  }

  private inlineStyle(expr: ObjectExpression, element: ElementNode): void {
    for (const prop of expr.properties) {
      if (prop.type !== "ObjectProperty" || prop.computed) continue;
      const key =
        prop.key.type === "Identifier"
          ? prop.key.name
          : prop.key.type === "StringLiteral"
            ? prop.key.value
            : null;
      if (key === null) continue;
      const v = prop.value;
      let value: string | null = null;
      let valueStart = v.start ?? 0;
      let valueEnd = v.end ?? 0;
      if (
        v.type === "StringLiteral" ||
        (v.type === "TemplateLiteral" && v.expressions.length === 0)
      ) {
        value = this.staticString(v);
        valueStart += 1;
        valueEnd -= 1;
      } else if (v.type === "NumericLiteral") {
        value = String(v.value);
      } else if (
        v.type === "UnaryExpression" &&
        v.operator === "-" &&
        v.argument.type === "NumericLiteral"
      ) {
        value = String(-v.argument.value);
      }
      const decl: StyleDeclaration = {
        property: toKebabCase(key),
        value,
        raw: this.source.slice(valueStart, valueEnd),
        important: false,
        origin: "inline",
        selector: null,
        atRules: [],
        element,
        loc: this.range(prop),
        valueLoc: this.lines.range(valueStart, valueEnd),
      };
      element.style.push(decl);
      this.out.declarations.push(decl);
    }
  }

  private attribute(attr: JSXAttribute, element: ElementNode, repeated: boolean): void {
    const name =
      attr.name.type === "JSXIdentifier"
        ? attr.name.name
        : `${attr.name.namespace.name}:${attr.name.name.name}`;
    const valueNode = attr.value;
    let value: string | null = "";
    let expression: Expression | null = null;
    if (valueNode?.type === "StringLiteral") {
      value = valueNode.value;
    } else if (valueNode?.type === "JSXExpressionContainer") {
      if (valueNode.expression.type !== "JSXEmptyExpression") {
        expression = valueNode.expression;
        value = this.staticString(expression);
      }
    } else if (valueNode) {
      value = null;
    }
    element.attributes.push({ name, value, dynamic: value === null, loc: this.range(attr) });

    if ((name === "className" || name === "class") && valueNode) {
      const pieces: StringPiece[] = [];
      const target = valueNode.type === "JSXExpressionContainer" ? valueNode.expression : valueNode;
      this.classStrings(target, pieces);
      this.addClassPieces(pieces, name, value === null, element);
      return;
    }
    if (name === "style" && expression?.type === "ObjectExpression") {
      this.inlineStyle(expression, element);
      return;
    }
    // Visit attribute expressions for nested JSX / class helpers, but never as element children
    // text: `alt={"pic"}` must not become a TextNode.
    if (expression) this.visit(expression, element, repeated);
    else if (valueNode && valueNode.type !== "StringLiteral")
      this.visit(valueNode, element, repeated);
  }

  private text(node: JSXText, parent: ElementNode | null): void {
    const start = node.start ?? 0;
    const raw = this.source.slice(start, node.end ?? start);
    const lead = raw.length - raw.trimStart().length;
    const trimmed = raw.trim();
    if (trimmed === "") return;
    const textNode = {
      type: "text" as const,
      value: node.value.trim().replace(/\s+/g, " "),
      parent,
      loc: this.lines.range(start + lead, start + lead + trimmed.length),
    };
    this.out.texts.push(textNode);
    parent?.children.push(textNode);
  }

  private element(node: JSXElement, parent: ElementNode | null, repeated: boolean): void {
    const n = node.openingElement.name;
    const tag =
      n.type === "JSXIdentifier"
        ? n.name
        : n.type === "JSXNamespacedName"
          ? `${n.namespace.name}:${n.name.name}`
          : this.source.slice(n.start ?? 0, n.end ?? 0);
    const el: ElementNode = {
      type: "element",
      tag,
      attributes: [] as Attribute[],
      children: [],
      parent,
      classes: [],
      style: [],
      repeated,
      loc: this.range(node),
    };
    this.out.elements.push(el);
    if (parent) parent.children.push(el);
    else this.out.roots.push(el);
    for (const attr of node.openingElement.attributes) {
      if (attr.type === "JSXAttribute") this.attribute(attr, el, repeated);
      else this.visit(attr.argument, el, repeated);
    }
    for (const child of node.children) this.visit(child, el, repeated);
  }

  private call(node: CallExpression, parent: ElementNode | null, repeated: boolean): void {
    const callee = node.callee;
    if (callee.type === "Identifier" && CLASS_HELPERS.has(callee.name)) {
      const pieces: StringPiece[] = [];
      this.classStrings(node, pieces);
      this.addClassPieces(pieces, "helper", true, null);
      return;
    }
    const isMap =
      callee.type === "MemberExpression" &&
      !callee.computed &&
      callee.property.type === "Identifier" &&
      (callee.property.name === "map" || callee.property.name === "flatMap");
    this.visit(callee, parent, repeated);
    for (const arg of node.arguments) this.visit(arg, parent, repeated || isMap);
  }

  visit(node: Node, parent: ElementNode | null, repeated: boolean): void {
    switch (node.type) {
      case "JSXElement":
        this.element(node, parent, repeated);
        return;
      case "JSXText":
        this.text(node, parent);
        return;
      case "JSXExpressionContainer": {
        const expr = node.expression;
        const str = expr.type === "JSXEmptyExpression" ? null : this.staticString(expr);
        if (str !== null && str.trim() !== "" && parent) {
          const textNode = {
            type: "text" as const,
            value: str.trim(),
            parent,
            loc: this.range(expr),
          };
          this.out.texts.push(textNode);
          parent.children.push(textNode);
          return;
        }
        this.visit(expr, parent, repeated);
        return;
      }
      case "CallExpression":
        this.call(node, parent, repeated);
        return;
      default:
        break;
    }
    for (const [key, value] of Object.entries(node)) {
      if (SKIP_KEYS.has(key)) continue;
      if (Array.isArray(value)) {
        for (const item of value) if (isNode(item)) this.visit(item, parent, repeated);
      } else if (isNode(value)) {
        this.visit(value, parent, repeated);
      }
    }
  }
}

/** Parses a .tsx/.jsx/.ts/.js file into the shared lint model. Throws a SyntaxError on invalid code. */
export function parseJsx(path: string, source: string, lines: LineIndex): JsxParts {
  const ast = parse(source, {
    sourceType: "module",
    plugins: pluginsFor(path),
    allowReturnOutsideFunction: true,
  });
  const collector = new JsxCollector(source, lines);
  collector.visit(ast.program, null, false);
  return collector.out;
}
