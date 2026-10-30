import { existsSync, readFileSync } from "node:fs";
import { createRequire } from "node:module";
import { dirname, join, resolve } from "node:path";
import * as p from "@clack/prompts";
import {
  applyOps,
  defaultPresetsRoot,
  detectProject,
  FontFamilyInputSchema,
  generateTokens,
  getPreset,
  listPresets,
  mergeOverrides,
  planInit,
  readConfig,
  readSkillBundle,
  reuseConfigPaths,
  type TokenOverrides,
  TokenOverridesSchema,
  toCssVars,
  toTailwindTheme,
} from "@uitaste/core";
import { defineCommand } from "citty";
import { z } from "zod";
import type { Io } from "./preset.js";

const InitArgs = z.object({
  dir: z.string().min(1).default("."),
  preset: z.string().min(1).optional(),
  accent: z.string().min(1).optional(),
  font: FontFamilyInputSchema.optional(),
  yes: z.boolean().default(false),
  root: z.string().min(1).optional(),
});

const stdio: Io = {
  out: (s) => process.stdout.write(`${s}\n`),
  err: (s) => process.stderr.write(`${s}\n`),
};

function skillRoot(): string {
  const require = createRequire(import.meta.url);
  return dirname(require.resolve("@uitaste/skill/package.json"));
}

/** Returns the process exit code. Prompts only when `--yes` is absent and a value is missing. */
export async function runInit(input: unknown, io: Io = stdio): Promise<number> {
  const parsed = InitArgs.safeParse(input);
  if (!parsed.success) {
    io.err(z.prettifyError(parsed.error));
    return 1;
  }
  const args = parsed.data;
  const cwd = resolve(args.dir);
  const presetsRoot = args.root ?? process.env.UITASTE_PRESETS_ROOT ?? defaultPresetsRoot();
  try {
    const existing = readConfig(cwd);
    const interactive = !args.yes && Boolean(process.stdin.isTTY);
    let presetId = args.preset ?? existing?.preset;
    let accent = args.accent;
    let font = args.font;
    if (!presetId) {
      const all = listPresets(presetsRoot).map(({ preset }) => preset.meta);
      if (all.length === 0) throw new Error("No presets found.");
      if (interactive) {
        const choice = await p.select({
          message: "Pick a preset",
          options: all.map((m) => ({ value: m.id, label: m.name, hint: m.description })),
        });
        if (p.isCancel(choice)) return 1;
        presetId = choice;
      } else {
        throw new Error(
          `No --preset given and no terminal to prompt. Available presets: ${all.map((m) => m.id).join(", ")}`,
        );
      }
    }
    if (!presetId) throw new Error("No preset selected.");
    if (interactive && args.accent === undefined && !existing) {
      const a = await p.text({
        message: "Brand accent color (blank = preset default)",
        defaultValue: "",
      });
      if (p.isCancel(a)) return 1;
      accent = a.trim() || undefined;
    }
    if (interactive && args.font === undefined && !existing) {
      const f = await p.text({
        message: "Display font family (blank = preset default)",
        defaultValue: "",
      });
      if (p.isCancel(f)) return 1;
      font = f.trim() || undefined;
      if (font) FontFamilyInputSchema.parse(font);
    }

    const overrides: TokenOverrides = TokenOverridesSchema.parse(
      mergeOverrides(existing?.overrides, {
        ...(accent ? { accent } : {}),
        ...(font ? { fonts: { display: font } } : {}),
      }),
    );
    const { preset, rules } = getPreset(presetId, presetsRoot);
    const tokens = generateTokens(preset, overrides);
    const { detection, tokensCssPath } = reuseConfigPaths(cwd, existing, detectProject(cwd));
    const tokensCss = detection.tailwind ? toTailwindTheme(tokens) : toCssVars(tokens);
    const globalAbs = detection.globalCss ? join(cwd, detection.globalCss) : null;
    const root = skillRoot();
    const { skillMd, files: skillFiles } = readSkillBundle(root);
    if (skillMd === null)
      io.err(`warning: ${join(root, "SKILL.md")} not found; skill not installed`);
    const plan = planInit({
      preset: presetId,
      ...(tokensCssPath ? { tokensCssPath } : {}),
      detection,
      overrides,
      shoot: existing?.shoot,
      tokensCss,
      globalCssContent: globalAbs ? readFileSync(globalAbs, "utf8") : null,
      skillMd,
      skillFiles,
      rulesMd: rules,
      cursor: existsSync(join(cwd, ".cursor")),
    });
    const written = applyOps(cwd, plan.ops);
    io.out(
      `uitaste: ${detection.framework}${detection.tailwind ? " + tailwind" : ""}, preset ${presetId}`,
    );
    io.out(written.length ? written.map((w) => `  wrote ${w}`).join("\n") : "  already up to date");
    if (!detection.globalCss) {
      io.out(`  no global CSS found: import ${plan.config.tokensCss} from your entry point`);
    }
    return 0;
  } catch (e) {
    io.err(e instanceof Error ? e.message : String(e));
    return 1;
  }
}

export const initCommand = defineCommand({
  meta: { name: "init", description: "Set up uitaste in this project" },
  args: {
    dir: { type: "positional", description: "Project directory", required: false, default: "." },
    preset: { type: "string", description: "Preset id", required: false },
    accent: { type: "string", description: "Brand accent color override", required: false },
    font: { type: "string", description: "Display font family override", required: false },
    yes: { type: "boolean", description: "Skip prompts", default: false },
    root: { type: "string", description: "Presets root directory (testing)", required: false },
  },
  async run({ args }) {
    process.exitCode = await runInit(args);
  },
});
