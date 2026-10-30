import { mkdirSync, mkdtempSync, writeFileSync } from "node:fs";
import { tmpdir } from "node:os";
import { join } from "node:path";
import { describe, expect, it } from "vitest";
import { listPresets } from "../presets/loader.js";
import { collectFiles, globToRegExp, lintExitCode, runLint } from "./run.js";
import { LintProjectConfigSchema } from "./run-config.js";
import type { LintReport } from "./types.js";

function proj(files: Record<string, string>): string {
  const dir = mkdtempSync(join(tmpdir(), "tk-lint-"));
  for (const [p, c] of Object.entries(files)) {
    mkdirSync(join(dir, p, ".."), { recursive: true });
    writeFileSync(join(dir, p), c);
  }
  return dir;
}

const rep = (errors: number, warnings: number): LintReport => ({
  files: [],
  summary: { files: 0, errors, warnings, infos: 0 },
});

describe("globToRegExp", () => {
  it("handles **, *, braces", () => {
    const re = globToRegExp("src/**/*.{tsx,css}");
    expect(re.test("src/a.tsx")).toBe(true);
    expect(re.test("src/a/b/c.css")).toBe(true);
    expect(re.test("src/a.ts")).toBe(false);
    expect(re.test("lib/a.tsx")).toBe(false);
    expect(globToRegExp("*.css").test("a/b.css")).toBe(false);
  });
});

describe("collectFiles", () => {
  it("applies default globs and ignores", () => {
    const d = proj({
      "src/App.tsx": "",
      "src/deep/x.css": "",
      "src/readme.md": "",
      "src/node_modules/y.tsx": "",
      "src/dist/z.tsx": "",
      "other/q.tsx": "",
    });
    expect(collectFiles(d)).toEqual(["src/App.tsx", "src/deep/x.css"]);
  });
  it("accepts custom globs", () => {
    const d = proj({ "other/q.tsx": "", "src/a.tsx": "" });
    expect(collectFiles(d, ["other/*.tsx"])).toEqual(["other/q.tsx"]);
  });
});

describe("lintExitCode", () => {
  it("maps severities", () => {
    expect(lintExitCode(rep(0, 3))).toBe(0);
    expect(lintExitCode(rep(1, 0))).toBe(1);
    expect(lintExitCode(rep(0, 1), "warn")).toBe(1);
  });
});

describe("runLint", () => {
  it("lints without config and reports relative paths", async () => {
    const d = proj({
      "src/A.tsx": `export const A = () => <div className="bg-[#ff0000]">hi</div>;\n`,
    });
    const { report, exitCode } = await runLint({ cwd: d });
    expect(report.summary.files).toBe(1);
    expect(report.files[0]?.path).toBe("src/A.tsx");
    expect(report.files[0]?.findings.length).toBeGreaterThan(0);
    expect(exitCode).toBe(lintExitCode(report));
  });
  it("reads config, honours lint.include and rule overrides", async () => {
    const d = proj({
      "uitaste.config.json": JSON.stringify({
        preset: listPresets()[0]?.preset.meta.id,
        framework: "vite",
        tailwind: true,
        tokensCss: "src/uitaste.tokens.css",
        globalCss: null,
        lint: { include: ["app/**/*.tsx"] },
      }),
      "app/A.tsx": `export const A = () => <div>hi</div>;\n`,
      "src/B.tsx": `export const B = () => <div>hi</div>;\n`,
    });
    const { report, exitCode } = await runLint({ cwd: d });
    expect(report.files.map((f) => f.path)).toEqual(["app/A.tsx"]);
    expect(exitCode).toBe(0);
  });
  it("throws on unknown preset", async () => {
    const d = proj({
      "uitaste.config.json": JSON.stringify({
        preset: "nope",
        framework: "vite",
        tailwind: true,
        tokensCss: "t.css",
        globalCss: null,
      }),
    });
    await expect(runLint({ cwd: d })).rejects.toThrow(/Unknown preset/);
  });
});

describe("globToRegExp edge cases", () => {
  const m = (g: string, p: string) => globToRegExp(g).test(p);
  it("trailing **, leading **/, ** without slash", () => {
    expect(m("src/**", "src/a/b.tsx")).toBe(true);
    expect(m("**/x.tsx", "x.tsx")).toBe(true);
    expect(m("**/x.tsx", "a/b/x.tsx")).toBe(true);
    expect(m("src**", "srcfoo/a.tsx")).toBe(true);
  });
  it("? matches one non-slash char", () => {
    expect(m("a?.css", "ab.css")).toBe(true);
    expect(m("a?.css", "a/.css")).toBe(false);
    expect(m("a?.css", "a.css")).toBe(false);
  });
  it("escapes regex-special characters", () => {
    expect(m("src/a+b.tsx", "src/a+b.tsx")).toBe(true);
    expect(m("src/a+b.tsx", "src/aab.tsx")).toBe(false);
    expect(m("src/(x)/$.tsx", "src/(x)/$.tsx")).toBe(true);
  });
  it("nested and unbalanced braces", () => {
    expect(m("a.{ts,{tsx,css}}", "a.css")).toBe(true);
    expect(m("a.{ts,{tsx,css}}", "a.js")).toBe(false);
    expect(m("a.{ts", "a.{ts")).toBe(true);
  });
  it("strips ./ and normalizes backslashes", () => {
    expect(m("./src/*.tsx", "src/a.tsx")).toBe(true);
    expect(m("src\\**\\*.tsx", "src/a/b.tsx")).toBe(true);
  });
});

describe("collectFiles edge cases", () => {
  it("matches dotfile directories", () => {
    const d = proj({ ".storybook/x.tsx": "", "src/a.tsx": "" });
    expect(collectFiles(d, ["**/*.tsx"])).toEqual([".storybook/x.tsx", "src/a.tsx"]);
  });
  it("prunes default-ignored dirs (git, next, turbo, coverage)", () => {
    const d = proj({
      ".next/a.tsx": "",
      ".git/a.tsx": "",
      ".turbo/a.tsx": "",
      "coverage/a.tsx": "",
      "src/ok.tsx": "",
    });
    expect(collectFiles(d, ["**/*.tsx"])).toEqual(["src/ok.tsx"]);
  });
  it("a `**/x` ignore does not prune directories", () => {
    const d = proj({ "src/x/a.tsx": "", "src/x.tsx": "" });
    expect(collectFiles(d, ["src/**/*.tsx"], ["**/x"])).toEqual(["src/x.tsx", "src/x/a.tsx"]);
  });
  it("custom dir ignore prunes", () => {
    const d = proj({ "src/gen/a.tsx": "", "src/b.tsx": "" });
    expect(collectFiles(d, undefined, ["src/gen/**"])).toEqual(["src/b.tsx"]);
  });
  it("throws for a missing base dir", () => {
    const d = proj({ "src/a.tsx": "" });
    expect(() => collectFiles(d, ["nope/**/*.tsx"])).toThrow(/Cannot read directory/);
  });
});

describe("runLint errors and config ignore", () => {
  const cfg = (lint: object) =>
    JSON.stringify({
      preset: listPresets()[0]?.preset.meta.id,
      framework: "vite",
      tailwind: true,
      tokensCss: "t.css",
      globalCss: null,
      lint,
    });
  it("honours lint.ignore", async () => {
    const d = proj({
      "uitaste.config.json": cfg({ ignore: ["src/gen/**"] }),
      "src/gen/a.tsx": "export const A = 1;\n",
      "src/b.tsx": "export const B = 1;\n",
    });
    const { report } = await runLint({ cwd: d });
    expect(report.files.map((f) => f.path)).toEqual(["src/b.tsx"]);
  });
  it("fails when no files match", async () => {
    const d = proj({ "src/notes.md": "" });
    await expect(runLint({ cwd: d })).rejects.toThrow(/No files matched/);
  });
  it("fails for a missing project dir", async () => {
    await expect(runLint({ cwd: join(tmpdir(), "tk-does-not-exist-xyz") })).rejects.toThrow();
  });
});

describe("LintProjectConfigSchema", () => {
  it("rejects unknown keys and empty globs", () => {
    expect(LintProjectConfigSchema.safeParse({ bogus: 1 }).success).toBe(false);
    expect(LintProjectConfigSchema.safeParse({ include: [""] }).success).toBe(false);
    expect(LintProjectConfigSchema.safeParse({ ignore: [""] }).success).toBe(false);
    expect(LintProjectConfigSchema.safeParse({ include: ["src/**"] }).success).toBe(true);
  });
});
