import { converter, parse } from "culori";
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
