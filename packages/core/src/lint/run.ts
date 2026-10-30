import { type Dirent, readdirSync } from "node:fs";
import { join, relative, sep } from "node:path";
import { generateTokens } from "../generator/generate.js";
import { readConfig } from "../init/init.js";
import { defaultPresetsRoot, getPreset } from "../presets/loader.js";
import { lintFiles } from "./engine.js";
import { recommendedRules } from "./rules/index.js";
import type { LintReport } from "./types.js";

export const DEFAULT_LINT_GLOBS: readonly string[] = ["src/**/*.{tsx,jsx,ts,css,html}"];
export const DEFAULT_LINT_IGNORE: readonly string[] = [
  "**/node_modules/**",
  "**/dist/**",
  "**/.git/**",
  "**/.next/**",
  "**/.turbo/**",
  "**/coverage/**",
  "**/__fixtures__/**",
];

/** Backslashes to `/` (Windows-style input) and drop a leading `./`. */
function normalizeGlob(glob: string): string {
  return glob.replace(/\\/g, "/").replace(/^\.\//, "");
}

/** Expand `{a,b}` alternatives (nestable) into several patterns. */
function expandBraces(pattern: string): string[] {
  const m = /\{([^{}]*)\}/.exec(pattern);
  if (!m) return [pattern];
  const head = pattern.slice(0, m.index);
  const tail = pattern.slice(m.index + m[0].length);
  return m[1]?.split(",").flatMap((alt) => expandBraces(`${head}${alt}${tail}`)) ?? [pattern];
}

function singleToRegex(glob: string): string {
  let re = "";
  for (let i = 0; i < glob.length; i++) {
    const c = glob[i] as string;
    if (c === "*") {
      if (glob[i + 1] === "*") {
        i++;
        if (glob[i + 1] === "/") {
          i++;
          re += "(?:.*/)?";
        } else re += ".*";
      } else re += "[^/]*";
    } else if (c === "?") re += "[^/]";
    else re += c.replace(/[.+^${}()|[\]\\]/g, "\\$&");
  }
  return re;
}

/** Compile a glob (`*`, `**`, `?`, `{a,b}`) to a regex over POSIX relative paths. */
export function globToRegExp(glob: string): RegExp {
  const g = normalizeGlob(glob);
  return new RegExp(`^(?:${expandBraces(g).map(singleToRegex).join("|")})$`);
}

/** Fixed directory prefix of a glob, used to avoid walking the whole tree. */
function globBase(glob: string): string {
  const parts = normalizeGlob(glob).split("/");
  const base: string[] = [];
  for (const p of parts.slice(0, -1)) {
    if (/[*?{]/.test(p)) break;
    base.push(p);
  }
  return base.join("/");
}

interface Ignore {
  files: RegExp[];
  /** Directory-only matchers from patterns ending in `/**`, used to prune the walk. */
  dirs: RegExp[];
}

function compileIgnore(patterns: readonly string[]): Ignore {
  const norm = patterns.map(normalizeGlob);
  return {
    files: norm.map(globToRegExp),
    dirs: norm.filter((p) => p.endsWith("/**")).map((p) => globToRegExp(p.slice(0, -3))),
  };
}

function walk(root: string, rel: string, ignore: Ignore, out: string[]): void {
  let entries: Dirent[];
  try {
    entries = readdirSync(join(root, rel), { withFileTypes: true });
  } catch (e) {
    const code = (e as NodeJS.ErrnoException).code;
    throw new Error(`Cannot read directory "${rel || "."}" in ${root}${code ? ` (${code})` : ""}`);
  }
  for (const e of entries) {
    const r = rel ? `${rel}/${e.name}` : e.name;
    if (e.isDirectory()) {
      if (ignore.dirs.some((re) => re.test(r))) continue;
      walk(root, r, ignore, out);
    } else if (e.isFile() && !ignore.files.some((re) => re.test(r))) out.push(r);
  }
}

/** Collect project files matching `include` and not `ignore`. Returns sorted POSIX paths relative to `cwd`. */
export function collectFiles(
  cwd: string,
  include: readonly string[] = DEFAULT_LINT_GLOBS,
  ignore: readonly string[] = DEFAULT_LINT_IGNORE,
): string[] {
  const ignoreRes = compileIgnore(ignore);
  const found = new Set<string>();
  for (const glob of include) {
    const re = globToRegExp(glob);
    const base =
      expandBraces(glob)
        .map(globBase)
        .sort((a, b) => a.length - b.length)[0] ?? "";
    const all: string[] = [];
    walk(cwd, base, ignoreRes, all);
    for (const f of all) if (re.test(f)) found.add(f);
  }
  return [...found].sort();
}

export type FailOn = "error" | "warn";

/** 1 when the report has errors (or warnings with `failOn: "warn"`), else 0. */
export function lintExitCode(report: LintReport, failOn: FailOn = "error"): 0 | 1 {
  const { errors, warnings } = report.summary;
  return errors > 0 || (failOn === "warn" && warnings > 0) ? 1 : 0;
}

export interface RunLintOptions {
  cwd: string;
  /** Globs overriding config/default includes. */
  globs?: readonly string[];
  failOn?: FailOn;
  presetsRoot?: string;
}

export interface RunLintResult {
  report: LintReport;
  exitCode: 0 | 1;
}

/**
 * Lint a project: reads uitaste.config.json (if any), generates tokens for its preset so
 * token-aware rules work, collects files and runs the recommended rules.
 */
export async function runLint(opts: RunLintOptions): Promise<RunLintResult> {
  const config = readConfig(opts.cwd);
  const tokens = config
    ? generateTokens(
        getPreset(config.preset, opts.presetsRoot ?? defaultPresetsRoot()).preset,
        config.overrides,
      )
    : undefined;
  const include = opts.globs?.length ? opts.globs : (config?.lint?.include ?? DEFAULT_LINT_GLOBS);
  const ignore = [...DEFAULT_LINT_IGNORE, ...(config?.lint?.ignore ?? [])];
  const files = collectFiles(opts.cwd, include, ignore);
  if (files.length === 0) {
    throw new Error(
      `No files matched ${include.join(", ")} in ${opts.cwd}. Pass globs or set lint.include in uitaste.config.json.`,
    );
  }
  const report = await lintFiles(
    files.map((f) => join(opts.cwd, f)),
    {
      rules: recommendedRules,
      ...(tokens ? { tokens } : {}),
      ...(config?.lint ? { config: { rules: config.lint.rules } } : {}),
    },
  );
  for (const f of report.files) f.path = relative(opts.cwd, f.path).split(sep).join("/");
  for (const f of report.files) for (const x of f.findings) x.file = f.path;
  return { report, exitCode: lintExitCode(report, opts.failOn) };
}
