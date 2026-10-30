import { mkdirSync, mkdtempSync, writeFileSync } from "node:fs";
import { tmpdir } from "node:os";
import { join } from "node:path";
import { beforeAll, describe, expect, it } from "vitest";
import { runList, runShow } from "./commands/preset.js";

let root = "";

function capture() {
  const out: string[] = [];
  const err: string[] = [];
  return { out, err, io: { out: (s: string) => out.push(s), err: (s: string) => err.push(s) } };
}

const demoPreset = {
  meta: { id: "demo", name: "Demo Preset", description: "A demo", tags: ["bold"] },
  fonts: {
    display: { family: "A", fallback: ["serif"], weights: [400] },
    body: { family: "B", fallback: ["sans-serif"], weights: [400] },
  },
  colors: { neutral: "#1c1917", accent: "oklch(0.62 0.19 35)" },
  scale: { type: { base: 16, ratio: 1.25 }, spacing: { base: 4 } },
  radius: { sm: 2, md: 4, lg: 8 },
  shadow: { style: "soft" },
  motion: { duration: { fast: 100, base: 200, slow: 300 }, easing: "ease-out" },
};

beforeAll(() => {
  root = mkdtempSync(join(tmpdir(), "tk-presets-"));
  const dir = join(root, "demo");
  mkdirSync(dir);
  writeFileSync(join(dir, "rules.md"), "# Demo rules\nBe bold.\n");
  writeFileSync(join(dir, "preset.json"), JSON.stringify(demoPreset));
});

describe("preset list", () => {
  it("prints id, name, tags, description", () => {
    const c = capture();
    expect(runList({ root }, c.io)).toBe(0);
    expect(c.out.join("\n")).toContain("demo");
    expect(c.out.join("\n")).toContain("Demo Preset");
  });
  it("--json outputs parseable meta", () => {
    const c = capture();
    expect(runList({ root, json: true }, c.io)).toBe(0);
    expect(JSON.parse(c.out[0] ?? "")[0].id).toBe("demo");
  });
  it("reports empty root", () => {
    const c = capture();
    expect(runList({ root: join(root, "nope") }, c.io)).toBe(0);
    expect(c.out[0]).toBe("No presets found.");
  });
});

describe("preset show", () => {
  it("prints summary and rules", () => {
    const c = capture();
    expect(runShow({ id: "demo", root }, c.io)).toBe(0);
    expect(c.out.join("\n")).toContain("Be bold.");
  });
  it("--json includes preset and rules", () => {
    const c = capture();
    expect(runShow({ id: "demo", root, json: true }, c.io)).toBe(0);
    const j = JSON.parse(c.out[0] ?? "");
    expect(j.preset.meta.id).toBe("demo");
    expect(j.rules).toContain("Be bold.");
  });
  it("unknown id gives readable error and exit 1", () => {
    const c = capture();
    expect(runShow({ id: "nope", root }, c.io)).toBe(1);
    expect(c.err.join("\n")).toContain('Unknown preset "nope"');
  });
  it("missing id fails validation", () => {
    const c = capture();
    expect(runShow({ root }, c.io)).toBe(1);
  });
});
