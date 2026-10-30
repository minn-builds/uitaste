import { clampChroma, converter, displayable, type Oklch, parse, wcagContrast } from "culori";
import { RAMP_STEPS, type Ramp, type RampStep } from "../schema/tokens.js";

/** WCAG 2 AA minimum contrast for normal text. */
export const AA_CONTRAST = 4.5;

const toOklchMode = converter("oklch");

/** Target OKLCH lightness per ramp step (50 → 950). */
const STEP_LIGHTNESS = [0.975, 0.94, 0.88, 0.8, 0.71, 0.62, 0.54, 0.46, 0.38, 0.3, 0.21] as const;
/** Chroma per step relative to the ramp's peak chroma: tapers toward white and black. */
const STEP_CHROMA = [0.2, 0.35, 0.55, 0.8, 0.95, 1, 1, 0.95, 0.85, 0.7, 0.55] as const;
/** Upper bound for peak chroma before gamut mapping. */
const MAX_CHROMA = 0.37;

export const WHITE: Oklch = { mode: "oklch", l: 1, c: 0, h: 0 };
export const BLACK: Oklch = { mode: "oklch", l: 0, c: 0, h: 0 };

/** Parses any CSS color string with culori and returns it in OKLCH. Throws on unparseable input. */
export function parseOklch(value: string): Oklch {
  const parsed = parse(value);
  if (!parsed) throw new Error(`Unparseable color: ${value}`);
  const color = toOklchMode(parsed);
  return { mode: "oklch", l: color.l, c: color.c, h: color.h ?? 0 };
}

const round = (value: number, digits: number) => {
  const factor = 10 ** digits;
  return Math.round(value * factor) / factor;
};

/**
 * Maps a color into the sRGB gamut by reducing chroma (hue and lightness kept), then rounds it
 * to the precision used in emitted CSS. The rounded color is guaranteed to stay displayable.
 */
export function toSrgbGamut(color: Oklch): Oklch {
  const mapped = clampChroma({ ...color, l: Math.min(1, Math.max(0, color.l)) }, "oklch");
  const l = round(mapped.l, 3);
  const h = mapped.c > 0 ? round(mapped.h ?? 0, 2) : 0;
  let c = Math.max(0, round(mapped.c, 3));
  while (c > 0 && !displayable({ mode: "oklch", l, c, h })) c = round(c - 0.001, 3);
  return { mode: "oklch", l, c, h: c > 0 ? h : 0 };
}

/** Formats an OKLCH color as a CSS `oklch(L C H)` string. */
export function formatOklch(color: Oklch): string {
  return `oklch(${color.l} ${color.c} ${color.h ?? 0})`;
}

export interface BuiltRamp {
  /** Gamut-mapped OKLCH colors per step. */
  colors: Record<RampStep, Oklch>;
  /** The step that holds the (gamut-mapped) seed itself. */
  anchor: RampStep;
}

/**
 * Builds an 11-step OKLCH ramp around a seed color. Hue stays constant, lightness follows a fixed
 * curve, chroma tapers toward the ends. The step closest in lightness to the seed is replaced by
 * the seed itself, so brand colors survive verbatim. Every step is gamut-mapped to sRGB.
 */
export function buildRamp(seed: string): BuiltRamp {
  const base = parseOklch(seed);
  let anchorIndex = 0;
  for (let i = 1; i < STEP_LIGHTNESS.length; i++) {
    const current = Math.abs((STEP_LIGHTNESS[i] ?? 0) - base.l);
    const best = Math.abs((STEP_LIGHTNESS[anchorIndex] ?? 0) - base.l);
    if (current < best) anchorIndex = i;
  }
  const peak = Math.min(MAX_CHROMA, base.c / (STEP_CHROMA[anchorIndex] ?? 1));
  const hue = base.h ?? 0;

  const entries = RAMP_STEPS.map((step, i) => {
    const color: Oklch =
      i === anchorIndex
        ? base
        : { mode: "oklch", l: STEP_LIGHTNESS[i] ?? 0, c: peak * (STEP_CHROMA[i] ?? 0), h: hue };
    return [step, toSrgbGamut(color)] as const;
  });
  return {
    colors: Object.fromEntries(entries) as Record<RampStep, Oklch>,
    anchor: RAMP_STEPS[anchorIndex] ?? "500",
  };
}

/** Converts a built ramp into CSS strings keyed by step. */
export function formatRamp(ramp: BuiltRamp): Ramp {
  return Object.fromEntries(
    RAMP_STEPS.map((step) => [step, formatOklch(ramp.colors[step])]),
  ) as Ramp;
}

/** WCAG 2 contrast ratio between two colors (CSS strings or OKLCH objects). */
export function contrastRatio(a: Oklch | string, b: Oklch | string): number {
  return wcagContrast(a, b);
}

/**
 * Picks the higher-contrast of the candidates against `bg`. If neither reaches AA, falls back to
 * pure white or black (one of which always clears AA against any color).
 */
export function pickForeground(bg: Oklch, candidates: readonly Oklch[]): Oklch {
  const byContrast = (list: readonly Oklch[]) =>
    [...list].sort((x, y) => contrastRatio(y, bg) - contrastRatio(x, bg))[0];
  const best = byContrast(candidates);
  if (best && contrastRatio(best, bg) >= AA_CONTRAST) return best;
  return byContrast([WHITE, BLACK]) ?? BLACK;
}

/**
 * Returns the first candidate that clears AA against every background, or the last candidate
 * if none does. Order candidates from most subtle to strongest.
 */
export function firstLegible(backgrounds: readonly Oklch[], candidates: readonly Oklch[]): Oklch {
  const pass = candidates.find((fg) =>
    backgrounds.every((bg) => contrastRatio(fg, bg) >= AA_CONTRAST),
  );
  const fallback = candidates[candidates.length - 1];
  if (!fallback) throw new Error("firstLegible needs at least one candidate");
  return pass ?? fallback;
}
