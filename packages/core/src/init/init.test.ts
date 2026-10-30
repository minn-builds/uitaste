import { mkdirSync, mkdtempSync, readFileSync, writeFileSync } from "node:fs";
import { tmpdir } from "node:os";
import { join } from "node:path";
import { describe, expect, it } from "vitest";
import {
  applyOps,
  cssImportSpecifier,
  detectProject,
  FontFamilyInputSchema,
  mergeOverrides,
  patchCssImport,
  planInit,
  readConfig,
  reuseConfigPaths,
  TastekitConfigSchema,
} from "./init.js";

function proj(files: Record<string, string>): string {
  const dir = mkdtempSync(join(tmpdir(), "tk-init-"));
  for (const [p, c] of Object.entries(files)) {
    mkdirSync(join(dir, p, ".."), { recursive: true });
    writeFileSync(join(dir, p), c);
  }
  return dir;
}

describe("detectProject", () => {
  it("detects vite + tailwind + css", () => {
    const d = proj({
      "package.json": JSON.stringify({ devDependencies: { vite: "7", tailwindcss: "4" } }),
      "src/index.css": "",
    });
    expect(detectProject(d)).toEqual({
      framework: "vite",
      tailwind: true,
      globalCss: "src/index.css",
    });
  });
  it("detects next", () => {
    const d = proj({
      "package.json": JSON.stringify({ dependencies: { next: "15", vite: "1" } }),
      "app/globals.css": "",
    });
    expect(detectProject(d)).toMatchObject({ framework: "next", globalCss: "app/globals.css" });
  });
  it("falls back to plain", () => {
    expect(detectProject(proj({}))).toEqual({
      framework: "plain",
      tailwind: false,
      globalCss: null,
    });
  });
});

describe("patchCssImport", () => {
  it("inserts after existing imports and is idempotent", () => {
    const once = patchCssImport('@import "tailwindcss";\n\nbody{}\n', "./tastekit.tokens.css");
    expect(once).toBe('@import "tailwindcss";\n@import "./tastekit.tokens.css";\n\nbody{}\n');
    expect(patchCssImport(once, "./tastekit.tokens.css")).toBe(once);
  });
  it("prepends when there are no imports", () => {
    expect(patchCssImport("body{}", "./t.tokens.css".replace("t.", "tastekit."))).toBe(
      '@import "./tastekit.tokens.css";\nbody{}',
    );
  });
  it("keeps @charset first", () => {
    expect(patchCssImport('@charset "utf-8";\na{}', "./tastekit.tokens.css")).toBe(
      '@charset "utf-8";\n@import "./tastekit.tokens.css";\na{}',
    );
  });
});

it("cssImportSpecifier", () => {
  expect(cssImportSpecifier("src/index.css", "src/tastekit.tokens.css")).toBe(
    "./tastekit.tokens.css",
  );
  expect(cssImportSpecifier("index.css", "src/x.css")).toBe("./src/x.css");
});

describe("planInit + applyOps", () => {
  const input = {
    preset: "demo",
    detection: { framework: "vite" as const, tailwind: false, globalCss: "src/index.css" },
    tokensCss: ":root{}\n",
    globalCssContent: "body{}\n",
    skillMd: "---\nname: tastekit\n---\n# Skill\n",
    rulesMd: "# Rules\n",
    cursor: true,
  };
  it("plans all files and re-apply writes nothing", () => {
    const dir = proj({ "src/index.css": "body{}\n" });
    const plan = planInit(input);
    expect(TastekitConfigSchema.safeParse(plan.config).success).toBe(true);
    expect(plan.ops.map((o) => o.path)).toEqual([
      "tastekit.config.json",
      "src/tastekit.tokens.css",
      "src/index.css",
      ".claude/skills/tastekit/SKILL.md",
      ".claude/skills/tastekit/reference/presets/demo/rules.md",
      ".cursor/rules/tastekit.mdc",
    ]);
    expect(applyOps(dir, plan.ops)).toHaveLength(6);
    expect(readConfig(dir)?.preset).toBe("demo");
    const css = readFileSync(join(dir, "src/index.css"), "utf8");
    const again = planInit({ ...input, globalCssContent: css });
    expect(applyOps(dir, again.ops)).toEqual([]);
  });
  it("skips skill without source and cursor when disabled", () => {
    const plan = planInit({ ...input, skillMd: null, cursor: false });
    expect(plan.ops.map((o) => o.path)).toEqual([
      "tastekit.config.json",
      "src/tastekit.tokens.css",
      "src/index.css",
    ]);
  });
});

describe("readConfig", () => {
  it("returns null when absent and throws on invalid", () => {
    expect(readConfig(proj({}))).toBeNull();
    expect(() => readConfig(proj({ "tastekit.config.json": "{}" }))).toThrow(/invalid/);
  });
});

describe("patchCssImport CRLF", () => {
  it("keeps CRLF line endings", () => {
    expect(patchCssImport('@import "a";\r\nbody{}\r\n', "./tastekit.tokens.css")).toBe(
      '@import "a";\r\n@import "./tastekit.tokens.css";\r\nbody{}\r\n',
    );
  });
});

describe("mergeOverrides", () => {
  it("merges field by field, flags win", () => {
    expect(
      mergeOverrides(
        { accent: "#111111", fonts: { display: "A", body: "B" } },
        { fonts: { display: "C" } },
      ),
    ).toEqual({ accent: "#111111", fonts: { display: "C", body: "B" } });
    expect(mergeOverrides(undefined, undefined)).toEqual({});
    expect(mergeOverrides({ accent: "#111111" }, { accent: "#222222" })).toEqual({
      accent: "#222222",
    });
  });
});

describe("FontFamilyInputSchema", () => {
  it("rejects CSS-breaking characters", () => {
    expect(FontFamilyInputSchema.safeParse("Inter").success).toBe(true);
    for (const bad of ["a;b", "a{b", "a}b"])
      expect(FontFamilyInputSchema.safeParse(bad).success).toBe(false);
  });
});

describe("reuseConfigPaths", () => {
  const det = { framework: "vite" as const, tailwind: false, globalCss: "src/index.css" };
  const cfg = TastekitConfigSchema.parse({
    preset: "demo",
    framework: "vite",
    tailwind: false,
    tokensCss: "styles/tastekit.tokens.css",
    globalCss: "styles/app.css",
  });
  it("reuses existing files only", () => {
    const d = proj({ "styles/tastekit.tokens.css": "", "styles/app.css": "" });
    const r = reuseConfigPaths(d, cfg, det);
    expect(r.tokensCssPath).toBe("styles/tastekit.tokens.css");
    expect(r.detection.globalCss).toBe("styles/app.css");
    expect(reuseConfigPaths(proj({}), cfg, det)).toEqual({ detection: det });
  });
  it("refuses paths escaping the project", () => {
    const d = proj({});
    const evil = { ...cfg, tokensCss: "../x.css", globalCss: "/etc/passwd" };
    expect(reuseConfigPaths(d, evil, det)).toEqual({ detection: det });
  });
});
