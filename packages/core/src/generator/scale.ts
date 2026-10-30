import type { Oklch } from "culori";
import type { FontSpec, Preset } from "../schema/preset.js";
import { type Tokens, TYPE_STEPS, type TypeStep } from "../schema/tokens.js";

/** Index of `base` in TYPE_STEPS; steps below shrink, steps above grow by the ratio. */
const BASE_INDEX = TYPE_STEPS.indexOf("base");

/** Line heights tighten as type gets larger. */
const LINE_HEIGHT: Record<TypeStep, number> = {
  xs: 1.5,
  sm: 1.5,
  base: 1.6,
  lg: 1.5,
  xl: 1.4,
  "2xl": 1.3,
  "3xl": 1.2,
  "4xl": 1.1,
  "5xl": 1.05,
};

/** Spacing steps, as multiples of the preset's base unit (4 or 8 px). */
export const SPACE_STEPS = [0, 0.5, 1, 1.5, 2, 2.5, 3, 4, 5, 6, 8, 10, 12, 16, 20, 24] as const;

const ROOT_PX = 16;

const rem = (px: number) => (px === 0 ? "0px" : `${Number((px / ROOT_PX).toFixed(4))}rem`);

/** Modular type scale: `base * ratio^(step - base)`, emitted in rem. */
export function typeScale(scale: Preset["scale"]["type"]): Tokens["text"] {
  return Object.fromEntries(
    TYPE_STEPS.map((step, i) => [
      step,
      { size: rem(scale.base * scale.ratio ** (i - BASE_INDEX)), lineHeight: LINE_HEIGHT[step] },
    ]),
  ) as Tokens["text"];
}

/** Spacing scale on a 4pt or 8pt grid, keyed by multiplier of the base unit. */
export function spacingScale(base: Preset["scale"]["spacing"]["base"]): Tokens["space"] {
  return Object.fromEntries(SPACE_STEPS.map((step) => [String(step), rem(step * base)]));
}

/** Font used when a preset leaves out `fonts.mono`. */
export const DEFAULT_MONO: FontSpec = {
  family: "ui-monospace",
  fallback: ["SFMono-Regular", "Menlo", "Consolas", "Liberation Mono", "monospace"],
  weights: [400],
};

const GENERIC_FAMILIES = new Set([
  "serif",
  "sans-serif",
  "monospace",
  "cursive",
  "fantasy",
  "system-ui",
  "ui-serif",
  "ui-sans-serif",
  "ui-monospace",
  "ui-rounded",
  "math",
  "emoji",
  "fangsong",
]);

const quote = (name: string) => `"${name.replace(/["\\]/g, "\\$&")}"`;

/** Builds a CSS font-family stack: the family is quoted, fallbacks only when needed. */
export function fontStack(font: FontSpec): string {
  const family = GENERIC_FAMILIES.has(font.family) ? font.family : quote(font.family);
  const fallbacks = font.fallback.map((name) =>
    GENERIC_FAMILIES.has(name) || /^[A-Za-z][\w-]*$/.test(name) ? name : quote(name),
  );
  return [family, ...fallbacks].join(", ");
}

/** Box shadows per `shadow.style`, tinted with the given (dark neutral) color. */
export function shadows(style: Preset["shadow"]["style"], tint: Oklch): Tokens["shadow"] {
  const c = (alpha: number) => `oklch(${tint.l} ${tint.c} ${tint.h ?? 0} / ${alpha})`;
  switch (style) {
    case "none":
      return { sm: "none", md: "none", lg: "none" };
    case "subtle":
      return {
        sm: `0 1px 2px ${c(0.06)}`,
        md: `0 1px 3px ${c(0.08)}, 0 1px 2px ${c(0.04)}`,
        lg: `0 4px 12px ${c(0.08)}, 0 2px 4px ${c(0.04)}`,
      };
    case "soft":
      return {
        sm: `0 2px 8px ${c(0.06)}`,
        md: `0 8px 24px ${c(0.08)}`,
        lg: `0 20px 48px ${c(0.12)}`,
      };
    case "hard":
      return {
        sm: `2px 2px 0 ${c(1)}`,
        md: `4px 4px 0 ${c(1)}`,
        lg: `8px 8px 0 ${c(1)}`,
      };
  }
}
