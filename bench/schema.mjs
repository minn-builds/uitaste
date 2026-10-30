import { readFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";
import { z } from "zod";

export const benchRoot = dirname(fileURLToPath(import.meta.url));
export const repoRoot = join(benchRoot, "..");
export const VARIANTS = ["baseline", "tastekit"];

export const PromptsSchema = z
  .array(
    z.strictObject({
      id: z.string().regex(/^[a-z0-9]+(-[a-z0-9]+)*$/),
      prompt: z.string().min(20),
      preset: z.enum(["editorial", "swiss", "soft-utility", "brutal"]),
    }),
  )
  .refine((a) => new Set(a.map((p) => p.id)).size === a.length, { message: "duplicate ids" });

export function loadPrompts() {
  return PromptsSchema.parse(JSON.parse(readFileSync(join(benchRoot, "prompts.json"), "utf8")));
}
