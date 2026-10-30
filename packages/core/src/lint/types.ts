import type { Tokens } from "../schema/tokens.js";

/** A point in a source file. `line` and `column` are 1-based; `offset` is a 0-based UTF-16 index. */
export interface Position {
  line: number;
  column: number;
  offset: number;
}

/** A source range. `end` is exclusive (points just past the last character). */
export interface SourceRange {
  start: Position;
  end: Position;
}

export type FileKind = "jsx" | "css" | "html";

export type Severity = "error" | "warn" | "info";

/** One class token inside a class string, e.g. `md:hover:bg-[#fff]`. */
export interface ClassToken {
  /** The full token as written: `md:hover:!bg-[#fff]/50`. */
  value: string;
  /** Variant prefixes in order: `["md", "hover"]`. */
  variants: string[];
  /** The token without variants and without the `!` important marker: `bg-[#fff]/50`. */
  utility: string;
  /** `true` for Tailwind's `!` important modifier (prefix or suffix form). */
  important: boolean;
  loc: SourceRange;
}

export type ClassSource = "className" | "class" | "helper" | "@apply";

/** One static class string found in a file (a string literal, template chunk, attribute or `@apply`). */
export interface ClassNameUsage {
  /** The raw static string. */
  value: string;
  classes: ClassToken[];
  /** Where the string came from: a JSX/HTML attribute, a `cn()/clsx()/cva()` call, or a CSS `@apply`. */
  source: ClassSource;
  /** `true` when this string is only part of a dynamic expression (conditionals, template `${}`...). */
  dynamic: boolean;
  /** The element the class applies to; `null` for helper calls outside JSX and for `@apply`. */
  element: ElementNode | null;
  loc: SourceRange;
}

export type DeclarationOrigin = "stylesheet" | "inline";

/** A CSS declaration, from a stylesheet, a `<style>` block, an HTML `style=""` or a JSX `style={{}}`. */
export interface StyleDeclaration {
  /** kebab-case property name (`backgroundColor` in JSX becomes `background-color`); custom properties kept as-is. */
  property: string;
  /** Static value as a string (`4` for JSX numbers); `null` when the value is a dynamic expression. */
  value: string | null;
  /** Source text of the value exactly as written. */
  raw: string;
  important: boolean;
  origin: DeclarationOrigin;
  /** Selector of the enclosing rule, `null` for inline styles and root-level declarations. */
  selector: string | null;
  /** Enclosing at-rules from outermost to innermost, e.g. `["media (min-width: 40rem)"]`. */
  atRules: string[];
  /** Element for inline styles, otherwise `null`. */
  element: ElementNode | null;
  loc: SourceRange;
  valueLoc: SourceRange;
}

/** A static attribute on an element. */
export interface Attribute {
  name: string;
  /** Static string value; `null` for dynamic expressions; `""` for boolean attributes. */
  value: string | null;
  dynamic: boolean;
  loc: SourceRange;
}

export interface TextNode {
  type: "text";
  /** Text with surrounding whitespace trimmed (`loc` covers the trimmed text). */
  value: string;
  parent: ElementNode | null;
  loc: SourceRange;
}

export interface ElementNode {
  type: "element";
  /** Tag as written: `div`, `Card`, `motion.div`. */
  tag: string;
  attributes: Attribute[];
  /** Child elements and text in source order. JSX fragments are flattened into the parent. */
  children: LintNode[];
  parent: ElementNode | null;
  /** All class tokens applied via `class`/`className` (static parts only). */
  classes: ClassToken[];
  /** Inline style declarations. */
  style: StyleDeclaration[];
  /**
   * `true` when the element is rendered from a `.map()`/`.flatMap()` callback in JSX, so one source
   * element stands for many siblings at runtime.
   */
  repeated: boolean;
  loc: SourceRange;
}

export type LintNode = ElementNode | TextNode;

/** Normalised view of a source file that rules check against. Same shape for every file kind. */
export interface LintFile {
  path: string;
  kind: FileKind;
  source: string;
  /** Top-level elements (elements with no element parent). */
  roots: ElementNode[];
  /** Every element in document order. */
  elements: ElementNode[];
  /** Every non-empty text node in document order. */
  texts: TextNode[];
  classNames: ClassNameUsage[];
  /** Stylesheet and inline declarations in document order. */
  declarations: StyleDeclaration[];
}

export interface LintContext {
  /** Tokens of the active preset, when known. Token-discipline rules compare against these. */
  tokens?: Tokens;
  /** All files of the current run, for cross-file rules (e.g. counting radius variants). */
  files: readonly LintFile[];
}

/** What a rule reports. The engine adds rule id, final severity and file path. */
export interface Finding {
  message: string;
  loc: SourceRange;
  /** Overrides the rule's default severity for this one finding. */
  severity?: Severity;
  /** Short hint on how to fix it. */
  suggestion?: string;
}

export interface Rule {
  id: string;
  severity: Severity;
  description: string;
  /** File kinds the rule runs on; all kinds when omitted. */
  kinds?: readonly FileKind[];
  check(file: LintFile, ctx: LintContext): Finding[];
}

export interface LintFinding {
  ruleId: string;
  severity: Severity;
  message: string;
  suggestion?: string;
  file: string;
  loc: SourceRange;
}

export interface FileReport {
  path: string;
  findings: LintFinding[];
}

export interface LintSummary {
  files: number;
  errors: number;
  warnings: number;
  infos: number;
}

export interface LintReport {
  files: FileReport[];
  summary: LintSummary;
}
