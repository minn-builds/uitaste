import { z } from "zod";
import { LintConfigSchema } from "./engine.js";

/** `lint` section of uitaste.config.json. */
export const LintProjectConfigSchema = LintConfigSchema.extend({
  /** Globs relative to the project dir. Defaults to {@link DEFAULT_LINT_GLOBS}. */
  include: z.array(z.string().min(1)).optional(),
  /** Extra ignore globs, added to {@link DEFAULT_LINT_IGNORE}. */
  ignore: z.array(z.string().min(1)).optional(),
});
export type LintProjectConfig = z.output<typeof LintProjectConfigSchema>;
