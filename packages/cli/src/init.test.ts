import { existsSync, mkdirSync, mkdtempSync, readFileSync, rmSync, writeFileSync } from "node:fs";
import { tmpdir } from "node:os";
import { join } from "node:path";
import { execa } from "execa";
import { afterAll, beforeAll, describe, expect, it } from "vitest";

const cli = join(import.meta.dirname, "..", "dist", "main.js");
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

const dirs: string[] = [];
let root = "";
let app = "";

function tmp(prefix: string): string {
  const d = mkdtempSync(join(tmpdir(), prefix));
  dirs.push(d);
  return d;
}

function makeViteApp(): string {
  const dir = tmp("tk-vite-app-");
  mkdirSync(join(dir, "src"));
  mkdirSync(join(dir, ".cursor"));
  writeFileSync(
    join(dir, "package.json"),
    JSON.stringify({
      name: "fixture-app",
      private: true,
      type: "module",
      scripts: { dev: "vite", build: "vite build" },
      devDependencies: { vite: "^7.0.0", typescript: "^5.0.0" },
    }),
  );
  writeFileSync(
    join(dir, "index.html"),
    '<!doctype html>\n<html><head><meta charset="UTF-8" /><title>app</title></head>\n<body><div id="app"></div><script type="module" src="/src/main.ts"></script></body></html>\n',
  );
  writeFileSync(
    join(dir, "src", "main.ts"),
    'import "./style.css";\ndocument.querySelector("#app")!.textContent = "hello";\n',
  );
  writeFileSync(join(dir, "src", "style.css"), "/* mine */\nbody { margin: 0; }\n");
  writeFileSync(
    join(dir, "vite.config.ts"),
    'import { defineConfig } from "vite";\nexport default defineConfig({});\n',
  );
  return dir;
}

beforeAll(() => {
  root = tmp("tk-presets-");
  mkdirSync(join(root, "demo"));
  writeFileSync(join(root, "demo", "rules.md"), "# Demo rules\n");
  writeFileSync(join(root, "demo", "preset.json"), JSON.stringify(demoPreset));
  app = makeViteApp();
});

afterAll(() => {
  for (const d of dirs) rmSync(d, { recursive: true, force: true });
});

const run = () =>
  execa("node", [
    cli,
    "init",
    app,
    "--preset",
    "demo",
    "--accent",
    "#3355ff",
    "--font",
    "Inter",
    "--yes",
    "--root",
    root,
  ]);

describe("tastekit init (e2e, minimal Vite app fixture)", () => {
  it("writes config, tokens, css import, skill and cursor rule; re-run is idempotent", async () => {
    const first = await run();
    expect(first.stdout).toContain("vite");
    const cfg = JSON.parse(readFileSync(join(app, "tastekit.config.json"), "utf8"));
    expect(cfg).toMatchObject({
      preset: "demo",
      framework: "vite",
      tokensCss: "src/tastekit.tokens.css",
    });
    expect(readFileSync(join(app, "src/tastekit.tokens.css"), "utf8")).toContain("--");
    const css = readFileSync(join(app, "src/style.css"), "utf8");
    expect(css.match(/tastekit\.tokens\.css/g)).toHaveLength(1);
    expect(css).toContain("body { margin: 0; }");
    expect(readFileSync(join(app, ".cursor/rules/tastekit.mdc"), "utf8")).toContain("Demo rules");
    expect(readFileSync(join(app, ".claude/skills/tastekit/SKILL.md"), "utf8")).toContain(
      "tastekit",
    );
    const skillDir = join(app, ".claude/skills/tastekit");
    expect(readFileSync(join(skillDir, "reference/preset.md"), "utf8")).toContain("Demo rules");
    expect(existsSync(join(skillDir, "reference/rubric.md"))).toBe(true);
    expect(existsSync(join(skillDir, "reference/lint-rules.md"))).toBe(true);

    writeFileSync(join(app, "src/style.css"), `${css}/* user edit */\n`);
    const second = await run();
    expect(second.stdout).toContain("already up to date");
    const css2 = readFileSync(join(app, "src/style.css"), "utf8");
    expect(css2.match(/tastekit\.tokens\.css/g)).toHaveLength(1);
    expect(css2).toContain("user edit");
  });

  it("exits 1 for an unknown preset", async () => {
    const r = await execa("node", [cli, "init", app, "--preset", "nope", "--yes", "--root", root], {
      reject: false,
    });
    expect(r.exitCode).toBe(1);
  });

  it("re-run keeps hand-edited config overrides", async () => {
    const cfgPath = join(app, "tastekit.config.json");
    const cfg = JSON.parse(readFileSync(cfgPath, "utf8"));
    cfg.overrides.fonts = { display: "Inter", body: "Georgia" };
    writeFileSync(cfgPath, JSON.stringify(cfg));
    await execa("node", [cli, "init", app, "--font", "Lora", "--yes", "--root", root]);
    const after = JSON.parse(readFileSync(cfgPath, "utf8"));
    expect(after.overrides).toMatchObject({
      accent: "#3355ff",
      fonts: { display: "Lora", body: "Georgia" },
    });
    expect(after.tokensCss).toBe("src/tastekit.tokens.css");
  });

  it("errors listing presets with --yes and no --preset on a fresh project", async () => {
    const fresh = makeViteApp();
    const r = await execa("node", [cli, "init", fresh, "--yes", "--root", root], {
      reject: false,
      stdin: "ignore",
    });
    expect(r.exitCode).toBe(1);
    expect(r.stderr).toContain("demo");
  });

  it("rejects unsafe font strings", async () => {
    const r = await execa(
      "node",
      [cli, "init", app, "--preset", "demo", "--font", "a;b", "--yes", "--root", root],
      { reject: false },
    );
    expect(r.exitCode).toBe(1);
  });
});
