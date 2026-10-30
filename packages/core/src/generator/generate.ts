import type { Oklch } from "culori";
import { z } from "zod";
import {
  ColorSeedSchema,
  type FontSpec,
  FontSpecSchema,
  type Preset,
  type PresetInput,
  PresetSchema,
} from "../schema/preset.js";
import {
  RAMP_STEPS,
  type RampStep,
  type SemanticColors,
  type Tokens,
  TokensSchema,
} from "../schema/tokens.js";
import {
  type BuiltRamp,
  buildRamp,
  firstLegible,
  formatOklch,
  formatRamp,
  pickForeground,
} from "./color.js";
import { DEFAULT_MONO, fontStack, shadows, spacingScale, typeScale } from "./scale.js";

/** Destructive seed used when a preset leaves out `colors.destructive`. */
export const DEFAULT_DESTRUCTIVE_SEED = "oklch(0.577 0.215 27)";

/** A font override: a bare family name (keeps the preset's fallbacks/weights) or a full spec. */
const FontOverrideSchema = z.union([z.string().trim().min(1), FontSpecSchema]);

/** User-level overrides applied on top of a preset (e.g. brand color/font from `uitaste init`). */
export const TokenOverridesSchema = z.strictObject({
  accent: ColorSeedSchema.optional(),
  fonts: z
    .strictObject({
      display: FontOverrideSchema.optional(),
      body: FontOverrideSchema.optional(),
    })
    .optional(),
});

export type TokenOverrides = z.input<typeof TokenOverridesSchema>;

function applyFont(base: FontSpec, override: z.output<typeof FontOverrideSchema> | undefined) {
  if (override === undefined) return base;
  return typeof override === "string" ? { ...base, family: override } : override;
}

function stepRange(anchor: RampStep, min: RampStep, max: RampStep): RampStep {
  const index = Math.min(
    RAMP_STEPS.indexOf(max),
    Math.max(RAMP_STEPS.indexOf(min), RAMP_STEPS.indexOf(anchor)),
  );
  return RAMP_STEPS[index] ?? anchor;
}

interface Ramps {
  neutral: BuiltRamp;
  accent: BuiltRamp;
  destructive: BuiltRamp;
}

function semanticColors(ramps: Ramps, mode: "light" | "dark"): SemanticColors {
  const n = ramps.neutral.colors;
  const light = mode === "light";
  const pick = (
    ramp: BuiltRamp,
    lightRange: [RampStep, RampStep],
    darkRange: [RampStep, RampStep],
  ) => ramp.colors[stepRange(ramp.anchor, ...(light ? lightRange : darkRange))];

  const bg = light ? n["50"] : n["950"];
  const fg = firstLegible([bg], light ? [n["950"]] : [n["50"]]);
  const muted = light ? n["100"] : n["900"];
  const mutedFg = firstLegible(
    [bg, muted],
    light ? [n["600"], n["700"], n["800"], n["900"]] : [n["400"], n["300"], n["200"], n["100"]],
  );
  const accent = pick(ramps.accent, ["400", "700"], ["300", "500"]);
  const destructive = pick(ramps.destructive, ["500", "700"], ["400", "500"]);
  const fgFor = (color: Oklch, ramp: BuiltRamp) =>
    pickForeground(color, [ramp.colors["50"], ramp.colors["950"]]);

  const roles = {
    bg,
    fg,
    muted,
    mutedFg,
    accent,
    accentFg: fgFor(accent, ramps.accent),
    border: light ? n["200"] : n["800"],
    ring: accent,
    destructive,
    destructiveFg: fgFor(destructive, ramps.destructive),
  } satisfies Record<keyof SemanticColors, Oklch>;

  return Object.fromEntries(
    Object.entries(roles).map(([role, color]) => [role, formatOklch(color)]),
  ) as SemanticColors;
}

/**
 * Generates a full, resolved token set from a preset: modular type scale, 4/8pt spacing,
 * 11-step OKLCH ramps (gamut-mapped to sRGB), semantic light/dark roles, radius, shadow, motion.
 * Pure and deterministic. Throws a ZodError on invalid preset or overrides.
 */
export function generateTokens(preset: PresetInput | Preset, overrides?: TokenOverrides): Tokens {
  const p = PresetSchema.parse(preset);
  const o = TokenOverridesSchema.parse(overrides ?? {});

  const ramps: Ramps = {
    neutral: buildRamp(p.colors.neutral),
    accent: buildRamp(o.accent ?? p.colors.accent),
    destructive: buildRamp(p.colors.destructive ?? DEFAULT_DESTRUCTIVE_SEED),
  };
  const display = applyFont(p.fonts.display, o.fonts?.display);
  const body = applyFont(p.fonts.body, o.fonts?.body);
  const mono = p.fonts.mono ?? DEFAULT_MONO;

  const tokens: Tokens = {
    meta: { presetId: p.meta.id, presetName: p.meta.name },
    font: { display: fontStack(display), body: fontStack(body), mono: fontStack(mono) },
    fontWeight: { display: display.weights, body: body.weights, mono: mono.weights },
    text: typeScale(p.scale.type),
    space: spacingScale(p.scale.spacing.base),
    color: {
      ramps: {
        neutral: formatRamp(ramps.neutral),
        accent: formatRamp(ramps.accent),
        destructive: formatRamp(ramps.destructive),
      },
      light: semanticColors(ramps, "light"),
      ...(p.darkMode ? { dark: semanticColors(ramps, "dark") } : {}),
    },
    radius: {
      sm: `${p.radius.sm}px`,
      md: `${p.radius.md}px`,
      lg: `${p.radius.lg}px`,
      full: "9999px",
    },
    shadow: shadows(p.shadow.style, ramps.neutral.colors["950"]),
    motion: {
      duration: {
        fast: `${p.motion.duration.fast}ms`,
        base: `${p.motion.duration.base}ms`,
        slow: `${p.motion.duration.slow}ms`,
      },
      easing: p.motion.easing,
    },
  };
  return TokensSchema.parse(tokens);
}
