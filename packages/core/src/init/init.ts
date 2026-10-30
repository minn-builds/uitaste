import { existsSync, mkdirSync, readdirSync, readFileSync, statSync, writeFileSync } from "node:fs";
import { dirname, isAbsolute, join, posix, relative, sep } from "node:path";
import { z } from "zod";
import { type TokenOverrides, TokenOverridesSchema } from "../generator/generate.js";
import { LintProjectConfigSchema } from "../lint/run-config.js";
import { type ShootConfig, ShootConfigSchema } from "../shoot/options.js";

export const CONFIG_FILE = "uitaste.config.json";
export const TOKENS_FILE = "uitaste.tokens.css";
/** Where `init` installs the agent skill, project-relative. */
export const SKILL_DIR = ".claude/skills/uitaste";
/** Skill-relative path of the active preset's rules, copied from the preset at init. */
export const PRESET_RULES_FILE = "reference/preset.md";

export const FrameworkSchema = z.enum(["vite", "next", "plain"]);
export type Framework = z.infer<typeof FrameworkSchema>;

/** Shape of `uitaste.config.json`. */
export const UitasteConfigSchema = z.strictObject({
  version: z.literal(1).default(1),
  preset: z.string().min(1),
  framework: FrameworkSchema,
  tailwind: z.boolean(),
  /** Project-relative POSIX path of the generated tokens CSS. */
  tokensCss: z.string().min(1),
  /** Project-relative POSIX path of the global CSS that imports the tokens (null if none found). */
  globalCss: z.string().min(1).nullable(),
  overrides: TokenOverridesSchema.default({}),
  /** Defaults for `uitaste shoot`. */
  shoot: ShootConfigSchema.optional(),
  /** Defaults for `uitaste lint`: globs, ignores and per-rule severities. */
  lint: LintProjectConfigSchema.optional(),
});
export type UitasteConfig = z.infer<typeof UitasteConfigSchema>;

export interface Detection {
  framework: Framework;
  tailwind: boolean;
  globalCss: string | null;
}

const PackageJsonSchema = z.looseObject({
  dependencies: z.record(z.string(), z.string()).optional(),
  devDependencies: z.record(z.string(), z.string()).optional(),
});

const GLOBAL_CSS_CANDIDATES = [
  "src/app/globals.css",
  "app/globals.css",
  "src/styles/globals.css",
  "styles/globals.css",
  "src/globals.css",
  "src/index.css",
  "src/main.css",
  "src/style.css",
  "src/styles.css",
  "style.css",
  "index.css",
];

/** Detect framework, Tailwind usage and the global CSS file of a project directory. */
export function detectProject(cwd: string): Detection {
  let deps: Record<string, string> = {};
  const pkgPath = join(cwd, "package.json");
  if (existsSync(pkgPath)) {
    try {
      const pkg = PackageJsonSchema.parse(JSON.parse(readFileSync(pkgPath, "utf8")));
      deps = { ...pkg.devDependencies, ...pkg.dependencies };
    } catch {
      deps = {};
    }
  }
  const framework: Framework = "next" in deps ? "next" : "vite" in deps ? "vite" : "plain";
  const tailwind = "tailwindcss" in deps || "@tailwindcss/vite" in deps;
  const globalCss = GLOBAL_CSS_CANDIDATES.find((p) => existsSync(join(cwd, p))) ?? null;
  return { framework, tailwind, globalCss };
}

/** Read and validate an existing config; null when absent. Throws on invalid content. */
export function readConfig(cwd: string): UitasteConfig | null {
  const file = join(cwd, CONFIG_FILE);
  if (!existsSync(file)) return null;
  let json: unknown;
  try {
    json = JSON.parse(readFileSync(file, "utf8"));
  } catch {
    throw new Error(`${CONFIG_FILE} is not valid JSON`);
  }
  const r = UitasteConfigSchema.safeParse(json);
  if (!r.success) throw new Error(`${CONFIG_FILE} is invalid: ${z.prettifyError(r.error)}`);
  return r.data;
}

const IMPORT_RE = /^\s*@import\b[^;]*;[ \t]*$/;

/**
 * Add `@import "<spec>";` after the last leading `@import` (or `@charset`) of a stylesheet.
 * Idempotent: returns the input unchanged when the file is already imported.
 */
export function patchCssImport(css: string, importPath: string): string {
  const file = posix.basename(importPath);
  const already = new RegExp(
    `@import\\s+(?:url\\()?\\s*["'][^"']*${file.replace(/\./g, "\\.")}["']`,
  );
  if (already.test(css)) return css;
  const line = `@import "${importPath}";`;
  const eol = css.includes("\r\n") ? "\r\n" : "\n";
  const lines = css.split(/\r?\n/);
  let at = 0;
  for (let i = 0; i < lines.length; i++) {
    const l = lines[i] ?? "";
    if (IMPORT_RE.test(l) || /^\s*@charset\b/.test(l)) at = i + 1;
    else if (l.trim() === "" || /^\s*\/\*.*\*\/\s*$/.test(l)) continue;
    else break;
  }
  lines.splice(at, 0, line);
  return lines.join(eol);
}

/** Relative CSS import specifier from one project file to another (POSIX, `./` prefixed). */
export function cssImportSpecifier(fromFile: string, toFile: string): string {
  const rel = relative(dirname(fromFile), toFile).split(sep).join("/");
  return rel.startsWith(".") ? rel : `./${rel}`;
}

export interface FileOp {
  /** Project-relative POSIX path. */
  path: string;
  content: string;
}

export interface PlanInput {
  preset: string;
  /** Project-relative tokens CSS path to reuse (from an existing config). */
  tokensCssPath?: string;
  detection: Detection;
  overrides?: TokenOverrides;
  /** Existing `shoot` config section, preserved on re-init. */
  shoot?: ShootConfig | undefined;
  /** Tokens CSS content (already emitted for the right target). */
  tokensCss: string;
  /** Current content of the global CSS, if any. */
  globalCssContent?: string | null;
  skillMd: string | null;
  /** Extra skill files (skill-relative POSIX paths, e.g. `reference/rubric.md`), see {@link readSkillBundle}. */
  skillFiles?: readonly FileOp[];
  rulesMd: string;
  cursor: boolean;
}

export interface InitPlan {
  config: UitasteConfig;
  ops: FileOp[];
}

const HEADER = "/* Generated by uitaste. Edit uitaste.config.json and re-run `uitaste init`. */\n";

function stripFrontmatter(md: string): string {
  return md.replace(/^---\r?\n[\s\S]*?\r?\n---\r?\n/, "").replace(/^\s*\n/, "");
}

/** Installed copy of a preset's rules.md, tagged with the preset id so agents know which preset it is. */
export function presetRulesDoc(preset: string, rulesMd: string): string {
  const head = `<!-- uitaste preset: ${preset}. Copied from the preset by \`uitaste init\`; re-run init to update. -->\n\n`;
  return head + (rulesMd.endsWith("\n") ? rulesMd : `${rulesMd}\n`);
}

/**
 * Read the shipped skill package: `SKILL.md` (null when missing) plus every file under
 * `reference/`, as skill-relative POSIX paths sorted for stable output.
 */
export function readSkillBundle(skillRoot: string): { skillMd: string | null; files: FileOp[] } {
  const skillFile = join(skillRoot, "SKILL.md");
  const skillMd = existsSync(skillFile) ? readFileSync(skillFile, "utf8") : null;
  const files: FileOp[] = [];
  const walk = (rel: string) => {
    const abs = join(skillRoot, ...rel.split("/"));
    if (!existsSync(abs)) return;
    for (const name of readdirSync(abs).sort()) {
      const child = `${rel}/${name}`;
      const childAbs = join(abs, name);
      if (statSync(childAbs).isDirectory()) walk(child);
      else files.push({ path: child, content: readFileSync(childAbs, "utf8") });
    }
  };
  walk("reference");
  return { skillMd, files };
}

/** Pure planning step: which files `init` writes. The caller applies them with `applyOps`. */
export function planInit(input: PlanInput): InitPlan {
  const { detection: d } = input;
  const base = d.globalCss ? posix.dirname(d.globalCss) : d.framework === "plain" ? "." : "src";
  const tokensCss = input.tokensCssPath ?? (base === "." ? TOKENS_FILE : `${base}/${TOKENS_FILE}`);
  const config = UitasteConfigSchema.parse({
    version: 1,
    preset: input.preset,
    framework: d.framework,
    tailwind: d.tailwind,
    tokensCss,
    globalCss: d.globalCss,
    overrides: input.overrides ?? {},
    ...(input.shoot ? { shoot: input.shoot } : {}),
  });
  const ops: FileOp[] = [
    { path: CONFIG_FILE, content: `${JSON.stringify(config, null, 2)}\n` },
    { path: tokensCss, content: HEADER + input.tokensCss },
  ];
  if (d.globalCss && input.globalCssContent != null) {
    const patched = patchCssImport(
      input.globalCssContent,
      cssImportSpecifier(d.globalCss, tokensCss),
    );
    if (patched !== input.globalCssContent) ops.push({ path: d.globalCss, content: patched });
  }
  if (input.skillMd) {
    ops.push({ path: `${SKILL_DIR}/SKILL.md`, content: input.skillMd });
    for (const f of input.skillFiles ?? []) {
      if (f.path === PRESET_RULES_FILE || !isInsideProject(f.path)) continue;
      ops.push({ path: `${SKILL_DIR}/${posix.normalize(f.path)}`, content: f.content });
    }
    ops.push({
      path: `${SKILL_DIR}/${PRESET_RULES_FILE}`,
      content: presetRulesDoc(input.preset, input.rulesMd),
    });
    if (input.cursor) {
      const note = `Reference files (rubric, lint fixes, tokens) live in \`${SKILL_DIR}/reference/\`.`;
      const body = `${stripFrontmatter(input.skillMd).trimEnd()}\n\n${note}\n\n---\n\n${input.rulesMd}`;
      ops.push({
        path: ".cursor/rules/uitaste.mdc",
        content: `---\ndescription: uitaste design rules; apply when building or restyling UI\nalwaysApply: false\n---\n\n${body}`,
      });
    }
  }
  return { config, ops };
}

/** Write planned files under `cwd`, skipping files whose content is already identical. Returns written paths. */
export function applyOps(cwd: string, ops: FileOp[]): string[] {
  const written: string[] = [];
  for (const op of ops) {
    const abs = join(cwd, ...op.path.split("/"));
    if (existsSync(abs) && readFileSync(abs, "utf8") === op.content) continue;
    mkdirSync(dirname(abs), { recursive: true });
    writeFileSync(abs, op.content);
    written.push(op.path);
  }
  return written;
}

/** Font family from user input; must not be able to break out of a CSS declaration. */
export const FontFamilyInputSchema = z
  .string()
  .trim()
  .min(1)
  .regex(/^[^;{}]+$/, "font family must not contain ; { or }");

type FontOverrides = NonNullable<TokenOverrides["fonts"]>;

/** Merge CLI flags over overrides from an existing config, field by field (flags win). */
export function mergeOverrides(
  existing: TokenOverrides | undefined,
  flags: TokenOverrides | undefined,
): TokenOverrides {
  const accent = flags?.accent ?? existing?.accent;
  const fonts: FontOverrides = { ...existing?.fonts, ...flags?.fonts };
  for (const k of ["display", "body"] as const) if (fonts[k] === undefined) delete fonts[k];
  return {
    ...(accent !== undefined ? { accent } : {}),
    ...(Object.keys(fonts).length ? { fonts } : {}),
  };
}

function isInsideProject(rel: string): boolean {
  if (isAbsolute(rel)) return false;
  const n = posix.normalize(rel.split("\\").join("/"));
  return n !== ".." && !n.startsWith("../");
}

/**
 * Reuse tokens/global CSS paths from an existing config when those files still exist
 * (inside `cwd` only), so a re-run doesn't create a second tokens file.
 */
export function reuseConfigPaths(
  cwd: string,
  existing: UitasteConfig | null,
  detection: Detection,
): { detection: Detection; tokensCssPath?: string } {
  if (!existing) return { detection };
  const ok = (rel: string | null): rel is string =>
    rel !== null && isInsideProject(rel) && existsSync(join(cwd, ...rel.split("/")));
  const out: { detection: Detection; tokensCssPath?: string } = {
    detection: ok(existing.globalCss) ? { ...detection, globalCss: existing.globalCss } : detection,
  };
  if (ok(existing.tokensCss)) out.tokensCssPath = existing.tokensCss;
  return out;
}
