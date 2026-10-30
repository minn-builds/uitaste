import { join } from "node:path";
import { describe, expect, it } from "vitest";
import type { Tokens } from "../schema/tokens.js";
import { LintConfigSchema, lintFiles, lintSources, PARSE_ERROR_RULE_ID } from "./engine.js";
import { formatJson, formatPretty } from "./reporters.js";
import type { LintContext, LintFile, Rule } from "./types.js";

/** Trivial test rule: flags the class `forbidden` and any `purple` utility. */
const forbiddenClass: Rule = {
  id: "test/forbidden-class",
  severity: "warn",
  description: "Flags class tokens named `forbidden` (test only).",
  check(file) {
    return file.classNames.flatMap((u) =>
      u.classes
        .filter((c) => c.utility === "forbidden" || c.utility.includes("purple"))
        .map((c) => ({
          message: `Class "${c.value}" is not allowed`,
          loc: c.loc,
          ...(c.utility === "forbidden"
            ? { severity: "error" as const, suggestion: "Remove it" }
            : {}),
        })),
    );
  },
};

const fixtures = (...names: string[]) =>
  names.map((n) => join(import.meta.dirname, "__fixtures__", n));

describe("lintSources", () => {
  it("runs rules and attaches rule id, severity and file", () => {
    const report = lintSources(
      [{ path: "a.tsx", source: 'export const A = () => <div className="p-4 forbidden" />;' }],
      { rules: [forbiddenClass] },
    );
    expect(report.files).toHaveLength(1);
    expect(report.files[0]?.findings).toEqual([
      {
        ruleId: "test/forbidden-class",
        severity: "error",
        message: 'Class "forbidden" is not allowed',
        suggestion: "Remove it",
        file: "a.tsx",
        loc: {
          start: { line: 1, column: 44, offset: 43 },
          end: { line: 1, column: 53, offset: 52 },
        },
      },
    ]);
    expect(report.summary).toEqual({ files: 1, errors: 1, warnings: 0, infos: 0 });
  });

  it("skips unsupported files and reports parse errors as findings", () => {
    const report = lintSources(
      [
        { path: "README.md", source: "# hi" },
        { path: "bad.tsx", source: "const x = ;" },
      ],
      { rules: [forbiddenClass] },
    );
    expect(report.files.map((f) => f.path)).toEqual(["bad.tsx"]);
    expect(report.files[0]?.findings[0]).toMatchObject({
      ruleId: PARSE_ERROR_RULE_ID,
      severity: "error",
      loc: { start: { line: 1, column: 11 } },
    });
  });

  it("applies config severity overrides and 'off'", () => {
    const input = [{ path: "a.html", source: '<p class="text-purple-500">x</p>' }];
    const info = lintSources(input, {
      rules: [forbiddenClass],
      config: { rules: { "test/forbidden-class": "info" } },
    });
    expect(info.files[0]?.findings[0]?.severity).toBe("info");
    const off = lintSources(input, {
      rules: [forbiddenClass],
      config: { rules: { "test/forbidden-class": "off" } },
    });
    expect(off.files[0]?.findings).toEqual([]);
  });

  it("rejects invalid config and duplicate rule ids", () => {
    expect(() => lintSources([], { rules: [], config: { rules: { x: "loud" } } })).toThrow();
    expect(() => LintConfigSchema.parse({ extra: 1 })).toThrow();
    expect(() => lintSources([], { rules: [forbiddenClass, forbiddenClass] })).toThrow(/Duplicate/);
    expect(() =>
      lintSources([], { rules: [forbiddenClass], config: { rules: { "no-such-rule": "warn" } } }),
    ).toThrow(/Unknown lint rule id\(s\) in config: no-such-rule/);
  });

  it("respects rule kinds and passes tokens + all files in ctx", () => {
    const seen: { kind: string; ctx: LintContext }[] = [];
    const spy: Rule = {
      id: "test/spy",
      severity: "info",
      description: "records calls",
      kinds: ["css"],
      check(file: LintFile, ctx) {
        seen.push({ kind: file.kind, ctx });
        return [];
      },
    };
    const tokens = { meta: { id: "t" } } as unknown as Tokens;
    lintSources(
      [
        { path: "a.css", source: "a{color:red}" },
        { path: "b.tsx", source: "export {}" },
      ],
      { rules: [spy], tokens },
    );
    expect(seen.map((s) => s.kind)).toEqual(["css"]);
    expect(seen[0]?.ctx.tokens).toBe(tokens);
    expect(seen[0]?.ctx.files.map((f) => f.path)).toEqual(["a.css", "b.tsx"]);
  });

  it("turns a crashing rule into a rule-error finding", () => {
    const boom: Rule = {
      id: "test/boom",
      severity: "warn",
      description: "throws",
      check() {
        throw new Error("nope");
      },
    };
    const report = lintSources([{ path: "a.css", source: "a{}" }], { rules: [boom] });
    expect(report.files[0]?.findings[0]).toMatchObject({ ruleId: "rule-error", severity: "error" });
    expect(report.files[0]?.findings[0]?.message).toContain("test/boom");
  });
});

describe("lintFiles", () => {
  it("lints fixture files from disk, findings sorted by position", async () => {
    const report = await lintFiles(fixtures("Hero.tsx", "styles.css", "page.html"), {
      rules: [forbiddenClass],
    });
    expect(report.summary).toEqual({ files: 3, errors: 0, warnings: 1, infos: 0 });
    const hero = report.files[0];
    expect(hero?.findings.map((f) => [f.message, f.loc.start.line])).toEqual([
      ['Class "from-purple-500" is not allowed', 10],
    ]);
  });
});

describe("reporters", () => {
  const report = lintSources(
    [
      {
        path: "a.tsx",
        source: 'export const A = () => <div className="forbidden bg-purple-500" />;',
      },
      { path: "b.css", source: "a{color:red}" },
    ],
    { rules: [forbiddenClass] },
  );

  it("formats pretty output without color", () => {
    expect(formatPretty(report)).toBe(
      [
        "a.tsx",
        '  1:40  error  Class "forbidden" is not allowed  test/forbidden-class',
        "               -> Remove it",
        '  1:50  warn   Class "bg-purple-500" is not allowed  test/forbidden-class',
        "",
        "2 problems (1 error, 1 warning, 0 infos)",
      ].join("\n"),
    );
  });

  it("adds ANSI colors on request and reports clean runs", () => {
    expect(formatPretty(report, { color: true })).toContain("\x1b[31m");
    const clean = lintSources([{ path: "b.css", source: "a{}" }], { rules: [forbiddenClass] });
    expect(formatPretty(clean)).toBe("No problems found in 1 file.");
  });

  it("formats JSON that round-trips", () => {
    expect(JSON.parse(formatJson(report))).toEqual(report);
  });
});
