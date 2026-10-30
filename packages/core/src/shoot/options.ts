import { z } from "zod";

export const DEFAULT_BREAKPOINTS = [390, 768, 1440] as const;

const RouteSchema = z
  .string()
  .min(1)
  .refine((r) => r.startsWith("/"), { message: "route must start with '/'" });

/** Optional `shoot` section of tastekit.config.json. */
export const ShootConfigSchema = z.strictObject({
  url: z.url().optional(),
  routes: z.array(RouteSchema).min(1).optional(),
  breakpoints: z.array(z.number().int().min(200).max(4000)).min(1).optional(),
});
export type ShootConfig = z.infer<typeof ShootConfigSchema>;

export const ShootOptionsSchema = z.object({
  url: z.url(),
  routes: z.array(RouteSchema).min(1),
  breakpoints: z
    .array(z.number().int().min(200).max(4000))
    .min(1)
    .default([...DEFAULT_BREAKPOINTS]),
  outDir: z.string().min(1),
  /** Per-navigation timeout in ms. */
  timeoutMs: z.number().int().positive().default(30_000),
});
export type ShootOptions = z.infer<typeof ShootOptionsSchema>;
export type ShootOptionsInput = z.input<typeof ShootOptionsSchema>;

/** Parse "/a, /b" into a route list. */
export function parseList(value: string): string[] {
  return value
    .split(",")
    .map((s) => s.trim())
    .filter(Boolean);
}

export function parseBreakpoints(value: string): number[] {
  return parseList(value).map((s) => {
    const n = Number(s);
    if (!Number.isInteger(n))
      throw new Error(`Invalid breakpoint "${s}": expected an integer width`);
    return n;
  });
}
