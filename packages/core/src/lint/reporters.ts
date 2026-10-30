import type { LintReport, Severity } from "./types.js";

export interface PrettyOptions {
  /** Emit ANSI colors. Default `false`. */
  color?: boolean;
}

const ANSI = { red: 31, yellow: 33, cyan: 36, dim: 2, bold: 1, underline: 4 } as const;

function plural(n: number, word: string): string {
  return `${n} ${word}${n === 1 ? "" : "s"}`;
}

/** Human-readable report grouped by file, ESLint-style. Ends with a summary line. */
export function formatPretty(report: LintReport, options: PrettyOptions = {}): string {
  const paint = (code: number, s: string) => (options.color ? `\x1b[${code}m${s}\x1b[0m` : s);
  const sevColor: Record<Severity, number> = {
    error: ANSI.red,
    warn: ANSI.yellow,
    info: ANSI.cyan,
  };
  const out: string[] = [];
  for (const file of report.files) {
    if (file.findings.length === 0) continue;
    out.push(paint(ANSI.underline, file.path));
    const positions = file.findings.map((f) => `${f.loc.start.line}:${f.loc.start.column}`);
    const posWidth = Math.max(...positions.map((p) => p.length));
    const sevWidth = Math.max(...file.findings.map((f) => f.severity.length));
    file.findings.forEach((f, i) => {
      const pos = paint(ANSI.dim, (positions[i] ?? "").padEnd(posWidth));
      const sev = paint(sevColor[f.severity], f.severity.padEnd(sevWidth));
      out.push(`  ${pos}  ${sev}  ${f.message}  ${paint(ANSI.dim, f.ruleId)}`);
      if (f.suggestion)
        out.push(
          `  ${" ".repeat(posWidth + sevWidth + 4)}${paint(ANSI.dim, `-> ${f.suggestion}`)}`,
        );
    });
    out.push("");
  }
  const { errors, warnings, infos, files } = report.summary;
  const total = errors + warnings + infos;
  if (total === 0) {
    out.push(`No problems found in ${plural(files, "file")}.`);
  } else {
    const line = `${plural(total, "problem")} (${plural(errors, "error")}, ${plural(warnings, "warning")}, ${plural(infos, "info")})`;
    out.push(paint(ANSI.bold, paint(errors > 0 ? ANSI.red : ANSI.yellow, line)));
  }
  return out.join("\n");
}

/** Stable JSON report for agents and CI. */
export function formatJson(report: LintReport): string {
  return JSON.stringify(report, null, 2);
}
