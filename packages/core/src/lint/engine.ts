import { readFile } from "node:fs/promises";
import { z } from "zod";
import type { Tokens } from "../schema/tokens.js";
import { LintParseError, parseFile } from "./parse.js";
import type {
  FileReport,
  LintContext,
  LintFile,
  LintFinding,
  LintReport,
  LintSummary,
  Rule,
  Severity,
} from "./types.js";

export const PARSE_ERROR_RULE_ID = "parse-error";
export const RULE_ERROR_RULE_ID = "rule-error";

export const RuleSettingSchema = z.enum(["off", "error", "warn", "info"]);
export type RuleSetting = z.output<typeof RuleSettingSchema>;

/** User-facing lint config (e.g. from `tastekit.config`): per-rule severity overrides. */
export const LintConfigSchema = z.strictObject({
  rules: z.record(z.string(), RuleSettingSchema).default({}),
});
export type LintConfig = z.output<typeof LintConfigSchema>;
export type LintConfigInput = z.input<typeof LintConfigSchema>;

export interface LintOptions {
  rules: readonly Rule[];
  tokens?: Tokens;
  /** Unvalidated config; parsed with {@link LintConfigSchema}. */
  config?: unknown;
}

export interface SourceInput {
  path: string;
  source: string;
}

function summarize(files: FileReport[]): LintSummary {
  const summary: LintSummary = { files: files.length, errors: 0, warnings: 0, infos: 0 };
  for (const file of files) {
    for (const f of file.findings) {
      if (f.severity === "error") summary.errors++;
      else if (f.severity === "warn") summary.warnings++;
      else summary.infos++;
    }
  }
  return summary;
}

function pointRange(line: number, column: number) {
  const p = { line, column, offset: 0 };
  return { start: p, end: p };
}

function runRule(rule: Rule, severity: Severity, file: LintFile, ctx: LintContext): LintFinding[] {
  if (rule.kinds && !rule.kinds.includes(file.kind)) return [];
  try {
    return rule.check(file, ctx).map((f) => ({
      ruleId: rule.id,
      severity: f.severity ?? severity,
      message: f.message,
      ...(f.suggestion === undefined ? {} : { suggestion: f.suggestion }),
      file: file.path,
      loc: f.loc,
    }));
  } catch (err) {
    return [
      {
        ruleId: RULE_ERROR_RULE_ID,
        severity: "error",
        message: `Rule "${rule.id}" crashed: ${err instanceof Error ? err.message : String(err)}`,
        file: file.path,
        loc: pointRange(1, 1),
      },
    ];
  }
}

/**
 * Lints in-memory sources. Files with unsupported extensions are skipped; syntax errors become
 * `parse-error` findings. Rules see every parsed file through `ctx.files`.
 */
export function lintSources(inputs: readonly SourceInput[], options: LintOptions): LintReport {
  const config = LintConfigSchema.parse(options.config ?? {});
  const seen = new Set<string>();
  for (const rule of options.rules) {
    if (seen.has(rule.id)) throw new Error(`Duplicate lint rule id "${rule.id}"`);
    seen.add(rule.id);
  }
  const unknown = Object.keys(config.rules).filter((id) => !seen.has(id));
  if (unknown.length > 0) {
    throw new Error(
      `Unknown lint rule id(s) in config: ${unknown.join(", ")}. Known rules: ${[...seen].join(", ") || "(none)"}`,
    );
  }

  const reports: FileReport[] = [];
  const parsed: { file: LintFile; report: FileReport }[] = [];
  for (const input of inputs) {
    try {
      const file = parseFile(input.path, input.source);
      if (!file) continue;
      const report: FileReport = { path: input.path, findings: [] };
      reports.push(report);
      parsed.push({ file, report });
    } catch (err) {
      if (!(err instanceof LintParseError)) throw err;
      reports.push({
        path: input.path,
        findings: [
          {
            ruleId: PARSE_ERROR_RULE_ID,
            severity: "error",
            message: err.message,
            file: input.path,
            loc: pointRange(err.line, err.column),
          },
        ],
      });
    }
  }

  const ctx: LintContext = {
    files: parsed.map((p) => p.file),
    ...(options.tokens ? { tokens: options.tokens } : {}),
  };
  for (const { file, report } of parsed) {
    for (const rule of options.rules) {
      const setting = config.rules[rule.id] ?? rule.severity;
      if (setting === "off") continue;
      report.findings.push(...runRule(rule, setting, file, ctx));
    }
    report.findings.sort(
      (a, b) => a.loc.start.line - b.loc.start.line || a.loc.start.column - b.loc.start.column,
    );
  }
  return { files: reports, summary: summarize(reports) };
}

/** Reads the given file paths from disk and lints them. No globbing: pass explicit paths. */
export async function lintFiles(
  paths: readonly string[],
  options: LintOptions,
): Promise<LintReport> {
  const inputs = await Promise.all(
    paths.map(async (path) => ({ path, source: await readFile(path, "utf8") })),
  );
  return lintSources(inputs, options);
}
