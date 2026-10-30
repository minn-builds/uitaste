import { z } from "zod";

const HEX_COLOR = /^#(?:[0-9a-f]{3}|[0-9a-f]{6})$/i;
const OKLCH_COLOR = /^oklch\(\s*(\d*\.?\d+)(%?)\s+(\d*\.?\d+)\s+(\d*\.?\d+)\s*\)$/i;

function isValidOklch(value: string): boolean {
  const match = OKLCH_COLOR.exec(value);
  if (!match) return false;
  const lightness = Number(match[1]) / (match[2] === "%" ? 100 : 1);
  const hue = Number(match[4]);
  return lightness <= 1 && hue <= 360;
}

/** A seed color: `#rgb`, `#rrggbb` or `oklch(L C H)`. */
export const ColorSeedSchema = z
  .string()
  .trim()
  .refine((value) => HEX_COLOR.test(value) || isValidOklch(value), {
    message: 'Expected a hex color ("#1c1917") or oklch ("oklch(0.62 0.19 35)")',
  });

const FontWeightSchema = z
  .number()
  .int()
  .min(100)
  .max(900)
  .refine((weight) => weight % 100 === 0, { message: "Font weight must be a multiple of 100" });

export const FontSpecSchema = z.strictObject({
  family: z.string().trim().min(1),
  fallback: z.array(z.string().trim().min(1)).min(1),
  weights: z.array(FontWeightSchema).min(1),
});

const ascending =
  <K extends string>(keys: readonly K[], label: string) =>
  (value: Record<K, number>, ctx: z.RefinementCtx) => {
    for (let i = 1; i < keys.length; i++) {
      const prev = keys[i - 1] as K;
      const curr = keys[i] as K;
      if (value[curr] < value[prev]) {
        ctx.addIssue({
          code: "custom",
          path: [curr],
          message: `${label}: ${curr} must be >= ${prev}`,
        });
      }
    }
  };

const RADIUS_KEYS = ["sm", "md", "lg"] as const;
const DURATION_KEYS = ["fast", "base", "slow"] as const;

export const PresetSchema = z.strictObject({
  meta: z.strictObject({
    id: z.string().regex(/^[a-z0-9]+(?:-[a-z0-9]+)*$/, { message: "id must be kebab-case" }),
    name: z.string().trim().min(1),
    description: z.string().trim().min(1),
    tags: z.array(z.string().trim().min(1)).default([]),
  }),
  fonts: z.strictObject({
    display: FontSpecSchema,
    body: FontSpecSchema,
    mono: FontSpecSchema.optional(),
  }),
  /** Seeds for the generated OKLCH ramps. `destructive` falls back to a generator default. */
  colors: z.strictObject({
    neutral: ColorSeedSchema,
    accent: ColorSeedSchema,
    destructive: ColorSeedSchema.optional(),
  }),
  scale: z.strictObject({
    /** Modular type scale: base size in px and ratio between steps. */
    type: z.strictObject({
      base: z.number().min(12).max(24),
      ratio: z.number().min(1.05).max(1.75),
    }),
    spacing: z.strictObject({ base: z.union([z.literal(4), z.literal(8)]) }),
  }),
  /** Corner radii in px. */
  radius: z
    .strictObject({
      sm: z.number().min(0).max(64),
      md: z.number().min(0).max(64),
      lg: z.number().min(0).max(64),
    })
    .superRefine(ascending(RADIUS_KEYS, "radius")),
  shadow: z.strictObject({
    style: z.enum(["none", "subtle", "soft", "hard"]),
  }),
  motion: z.strictObject({
    /** Durations in ms. */
    duration: z
      .strictObject({
        fast: z.number().int().min(0).max(2000),
        base: z.number().int().min(0).max(2000),
        slow: z.number().int().min(0).max(2000),
      })
      .superRefine(ascending(DURATION_KEYS, "motion.duration")),
    easing: z.string().trim().min(1),
  }),
  /** Path to the preset's rules file, relative to the preset folder. */
  rules: z
    .string()
    .regex(/^[\w.-]+(?:\/[\w.-]+)*\.md$/, { message: "rules must be a relative .md path" })
    .refine((path) => !path.split("/").some((segment) => segment === "." || segment === ".."), {
      message: "rules must stay inside the preset folder",
    })
    .default("rules.md"),
  darkMode: z.boolean().default(true),
});

/** A preset after parsing (defaults filled). */
export type Preset = z.output<typeof PresetSchema>;
/** A preset as written in `preset.json`. */
export type PresetInput = z.input<typeof PresetSchema>;
export type FontSpec = z.output<typeof FontSpecSchema>;
