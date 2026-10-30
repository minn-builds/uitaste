import { z } from "zod";

export const RAMP_STEPS = [
  "50",
  "100",
  "200",
  "300",
  "400",
  "500",
  "600",
  "700",
  "800",
  "900",
  "950",
] as const;
export const TYPE_STEPS = ["xs", "sm", "base", "lg", "xl", "2xl", "3xl", "4xl", "5xl"] as const;
export const SEMANTIC_ROLES = [
  "bg",
  "fg",
  "muted",
  "mutedFg",
  "accent",
  "accentFg",
  "border",
  "ring",
  "destructive",
  "destructiveFg",
] as const;

const OklchSchema = z.string().regex(/^oklch\([^()]+\)$/, { message: "Expected an oklch() color" });
const CssLengthSchema = z
  .string()
  .regex(/^(?:0|-?\d*\.?\d+(?:px|rem|em))$/, { message: "Expected a CSS length" });
const DurationSchema = z.string().regex(/^\d+ms$/, { message: "Expected a duration in ms" });

function keyedBy<const K extends string, T extends z.ZodType>(keys: readonly K[], value: T) {
  return z.strictObject(Object.fromEntries(keys.map((key) => [key, value])) as Record<K, T>);
}

export const RampSchema = keyedBy(RAMP_STEPS, OklchSchema);
export const SemanticColorsSchema = keyedBy(SEMANTIC_ROLES, OklchSchema);

export const TokensSchema = z.strictObject({
  meta: z.strictObject({
    presetId: z.string().min(1),
    presetName: z.string().min(1),
  }),
  /** Full CSS font-family stacks. */
  font: z.strictObject({
    display: z.string().min(1),
    body: z.string().min(1),
    mono: z.string().min(1),
  }),
  fontWeight: z.strictObject({
    display: z.array(z.number().int()).min(1),
    body: z.array(z.number().int()).min(1),
    mono: z.array(z.number().int()).min(1),
  }),
  text: keyedBy(
    TYPE_STEPS,
    z.strictObject({ size: CssLengthSchema, lineHeight: z.number().positive() }),
  ),
  /** Spacing scale keyed by step multiplier ("0", "1", "1.5", "2", ...). */
  space: z.record(z.string().regex(/^\d+(?:\.5)?$/), CssLengthSchema),
  color: z.strictObject({
    ramps: z.strictObject({ neutral: RampSchema, accent: RampSchema, destructive: RampSchema }),
    light: SemanticColorsSchema,
    dark: SemanticColorsSchema.optional(),
  }),
  radius: z.strictObject({
    sm: CssLengthSchema,
    md: CssLengthSchema,
    lg: CssLengthSchema,
    full: CssLengthSchema,
  }),
  /** CSS box-shadow values ("none" allowed). */
  shadow: z.strictObject({
    sm: z.string().min(1),
    md: z.string().min(1),
    lg: z.string().min(1),
  }),
  motion: z.strictObject({
    duration: z.strictObject({ fast: DurationSchema, base: DurationSchema, slow: DurationSchema }),
    easing: z.string().min(1),
  }),
});

export type Tokens = z.output<typeof TokensSchema>;
export type Ramp = z.output<typeof RampSchema>;
export type SemanticColors = z.output<typeof SemanticColorsSchema>;
export type RampStep = (typeof RAMP_STEPS)[number];
export type TypeStep = (typeof TYPE_STEPS)[number];
export type SemanticRole = (typeof SEMANTIC_ROLES)[number];
