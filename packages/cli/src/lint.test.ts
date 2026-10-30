import { mkdirSync, mkdtempSync, writeFileSync } from "node:fs";
import { tmpdir } from "node:os";
import { join } from "node:path";
import { listPresets } from "@tastekit/core";
import { describe, expect, it } from "vitest";
import { runLintCommand } from "./commands/lint.js";

function capture() {
  const out: string[] = [];
  const err: string[] = [];
  return { out, err, io: { out: (s: string) => out.push(s), err: (s: string) => err.push(s) } };
}

function proj(src: string): string {
  const d = mkdtempSync(join(tmpdir(), "tk-cli-lint-"));
  mkdirSync(join(d, "src"));
  writeFileSync(join(d, "src/A.tsx"), src);
  return d;
}

describe("runLintCommand", () => {
  it("prints JSON and returns the exit code", async () => {
    const c = capture();
    const d = proj(`export const A = () => <div>hi</div>;\n`);
    const code = await runLintCommand({ dir: d, json: true }, c.io);
    expect(JSON.parse(c.out.join("\n")).summary.files).toBe(1);
    expect(code).toBe(0);
  });
  it("accepts glob positionals", async () => {
    const c = capture();
    const d = proj(`export const A = 1;\n`);
    await runLintCommand({ _: ["src/*.tsx"], dir: d, json: true }, c.io);
    expect(JSON.parse(c.out.join("\n")).summary.files).toBe(1);
  });
  it("rejects bad args", async () => {
    const c = capture();
    expect(await runLintCommand({ failOn: "bogus" }, c.io)).toBe(1);
    expect(c.err.length).toBe(1);
  });
  it("exits 1 on a real error finding", async () => {
    const c = capture();
    const d = proj(`export const A = () => <div>`);
    expect(await runLintCommand({ dir: d, json: true }, c.io)).toBe(1);
  });
  it("--fail-on warn fails on warnings only", async () => {
    const d = proj(`export const A = () => <div className="bg-[#ff0000]">hi</div>;\n`);
    writeFileSync(
      join(d, "tastekit.config.json"),
      JSON.stringify({
        preset: listPresets()[0]?.preset.meta.id,
        framework: "vite",
        tailwind: true,
        tokensCss: "t.css",
        globalCss: null,
        lint: { rules: { "no-hardcoded-color": "warn" } },
      }),
    );
    const c = capture();
    expect(await runLintCommand({ dir: d, json: true }, c.io)).toBe(0);
    expect(JSON.parse(c.out.join("\n")).summary.warnings).toBeGreaterThan(0);
    expect(await runLintCommand({ dir: d, failOn: "warn" }, capture().io)).toBe(1);
  });
  it("exits 1 with a message on invalid config", async () => {
    const c = capture();
    const d = proj(`export const A = 1;\n`);
    writeFileSync(join(d, "tastekit.config.json"), "{}");
    expect(await runLintCommand({ dir: d }, c.io)).toBe(1);
    expect(c.err.join("\n")).toMatch(/invalid/);
  });
  it("exits 1 when no files match", async () => {
    const c = capture();
    const d = proj(`x`);
    expect(await runLintCommand({ _: ["zzz/**"], dir: d }, c.io)).toBe(1);
  });
});
