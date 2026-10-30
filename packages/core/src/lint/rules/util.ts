import { colorsNamed, converter, parse } from "culori";
import type { StyleDeclaration } from "../types.js";

const toOklch = converter("oklch");

/** Hue range (OKLCH degrees) covering indigo, violet, purple and fuchsia. */
const PURPLE_HUE = { min: 272, max: 335 } as const;
const MIN_CHROMA = 0.06;

/** `true` when a CSS color string is a saturated purple/violet/indigo (by OKLCH hue). */
export function isPurpleColor(value: string): boolean {
  const parsed = parse(value.trim());
  if (!parsed) return false;
  const { h, c } = toOklch(parsed);
  if (h === undefined || Number.isNaN(h)) return false;
  return c >= MIN_CHROMA && h >= PURPLE_HUE.min && h <= PURPLE_HUE.max;
}

const COLOR_RE =
  /#[0-9a-f]{3,8}\b|\b(?:oklch|oklab|lch|lab|rgba?|hsla?|hwb|color)\([^()]*\)|\b(?:purple|violet|indigo|magenta|fuchsia|rebeccapurple|blueviolet|darkviolet|mediumpurple|slateblue)\b/gi;

/** Every color literal found in a CSS value. */
export function colorsIn(value: string): string[] {
  return value.match(COLOR_RE) ?? [];
}

/** Static text of a declaration value, falling back to the raw source. */
export function declValue(decl: StyleDeclaration): string {
  return decl.value ?? decl.raw;
}

/** First family of a `font-family` stack, unquoted and lowercased. */
export function firstFamily(stack: string): string {
  const first = stack.split(",")[0] ?? "";
  return first
    .trim()
    .replace(/^['"]|['"]$/g, "")
    .trim()
    .toLowerCase();
}

/** Matches the generic fonts agents default to. */
export function isDefaultFont(family: string): boolean {
  return /^(inter(?: variable| var)?|roboto|arial)$/.test(family.toLowerCase());
}

/** Generated token stylesheets may define raw colors; token rules skip them. */
export function isGeneratedTokensFile(path: string): boolean {
  return /(?:^|[\\/])(?:tokens\.generated|uitaste\.tokens)\.css$/.test(path);
}

/** Keywords that are never a hardcoded color. */
export const COLOR_KEYWORDS = /^(transparent|currentcolor|inherit|initial|unset|revert|none)$/i;

const NAMED_COLORS = Object.keys(colorsNamed).filter((n) => n !== "transparent");
const NAMED_RE = new RegExp(`\\b(?:${NAMED_COLORS.join("|")})\\b`, "i");
const FUNC_OR_HEX_RE =
  /#[0-9a-f]{3,8}\b|\b(?:oklch|oklab|lch|lab|rgba?|hsla?|hwb|color)\([^()]*\)/gi;

/** CSS properties whose values may be a bare named color (`red`, `white`). */
export const COLOR_PROPS =
  /^(?:color|background(?:-color|-image)?|border(?:-[a-z]+)*-color|border|border-(?:top|right|bottom|left|block|inline)(?:-[a-z]+)?|outline(?:-color)?|fill|stroke|caret-color|accent-color|text-decoration(?:-color)?|box-shadow|text-shadow|column-rule(?:-color)?|--.+)$/;

/** Raw color literals in a CSS value, ignoring anything inside `var(...)`. Named colors only when `allowNamed`. */
export function hardcodedColors(rawValue: string, allowNamed: boolean): string[] {
  const value = rawValue.replace(/url\((?:[^()]|\([^()]*\))*\)/gi, " ");
  const found: string[] = value.match(FUNC_OR_HEX_RE) ?? [];
  if (allowNamed) {
    const stripped = value.replace(FUNC_OR_HEX_RE, " ").replace(/var\([^()]*\)/g, " ");
    const re = new RegExp(NAMED_RE.source, "gi");
    for (const m of stripped.matchAll(re)) found.push(m[0]);
  }
  return found;
}
