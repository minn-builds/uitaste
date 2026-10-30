import { LineIndex } from "./location.js";
import { parseCss } from "./parse-css.js";
import { parseHtml } from "./parse-html.js";
import { parseJsx } from "./parse-jsx.js";
import type { FileKind, LintFile } from "./types.js";

const KIND_BY_EXT: Record<string, FileKind> = {
  tsx: "jsx",
  jsx: "jsx",
  ts: "jsx",
  js: "jsx",
  mjs: "jsx",
  cjs: "jsx",
  mts: "jsx",
  cts: "jsx",
  css: "css",
  html: "html",
  htm: "html",
};

/** Returns the lint file kind for a path, or `null` when the extension isn't supported. */
export function fileKindFromPath(path: string): FileKind | null {
  const ext = /\.([a-z0-9]+)$/i.exec(path)?.[1]?.toLowerCase();
  return ext ? (KIND_BY_EXT[ext] ?? null) : null;
}

export class LintParseError extends Error {
  constructor(
    readonly path: string,
    readonly line: number,
    readonly column: number,
    message: string,
  ) {
    super(message);
    this.name = "LintParseError";
  }
}

function errorPosition(err: unknown): { line: number; column: number } {
  if (typeof err === "object" && err !== null) {
    // Babel: err.loc = { line, column (0-based) }; PostCSS CssSyntaxError: err.line / err.column (1-based).
    const e = err as {
      loc?: { line?: unknown; column?: unknown };
      line?: unknown;
      column?: unknown;
    };
    if (typeof e.loc?.line === "number" && typeof e.loc.column === "number") {
      return { line: e.loc.line, column: e.loc.column + 1 };
    }
    if (typeof e.line === "number" && typeof e.column === "number")
      return { line: e.line, column: e.column };
  }
  return { line: 1, column: 1 };
}

/**
 * Parses a source file into the normalised {@link LintFile} model.
 * Returns `null` for unsupported extensions; throws {@link LintParseError} on syntax errors.
 */
export function parseFile(path: string, source: string): LintFile | null {
  const kind = fileKindFromPath(path);
  if (!kind) return null;
  const lines = new LineIndex(source);
  try {
    if (kind === "css") {
      const { declarations, classNames } = parseCss(source, {
        baseOffset: 0,
        lines,
        origin: "stylesheet",
        element: null,
      });
      return { path, kind, source, roots: [], elements: [], texts: [], classNames, declarations };
    }
    const parts = kind === "html" ? parseHtml(source, lines) : parseJsx(path, source, lines);
    return { path, kind, source, ...parts };
  } catch (err) {
    const { line, column } = errorPosition(err);
    const message = err instanceof Error ? err.message : String(err);
    throw new LintParseError(path, line, column, message);
  }
}
