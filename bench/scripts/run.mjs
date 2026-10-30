// Usage: pnpm bench [-- <id>...]   Needs `pnpm build` once (uses packages/core/dist) and chromium.
import { spawn, spawnSync } from "node:child_process";
import { existsSync, mkdirSync, readFileSync, writeFileSync } from "node:fs";
import { createServer } from "node:net";
import { join } from "node:path";
import { chromium } from "playwright";
import {
  generateTokens,
  getPreset,
  lintSources,
  recommendedRules,
} from "../../packages/core/dist/index.js";
import { benchRoot, loadPrompts, repoRoot, VARIANTS } from "../schema.mjs";
import { compose } from "./compose.mjs";

const BREAKPOINTS = [1440, 390];
const prompts = loadPrompts();
const wanted = process.argv.slice(2).filter((a) => a !== "--");
for (const w of wanted) {
  if (!prompts.some((p) => p.id === w)) throw new Error(`Unknown prompt id "${w}"`);
}
const selected = prompts.filter((p) => wanted.length === 0 || wanted.includes(p.id));
const pageFile = (id, v) => join(benchRoot, "pages", id, `${v}.tsx`);
const work = selected.flatMap((p) =>
  VARIANTS.filter((v) => existsSync(pageFile(p.id, v))).map((v) => ({ ...p, variant: v })),
);
if (work.length === 0) {
  console.error("No bench/pages/<id>/<variant>.tsx found for the selected ids.");
  process.exit(1);
}

function freePort() {
  return new Promise((res, rej) => {
    const s = createServer();
    s.once("error", rej);
    s.listen(0, "127.0.0.1", () => {
      const port = s.address().port;
      s.close(() => res(port));
    });
  });
}

async function waitFor(url, ms) {
  const end = Date.now() + ms;
  while (Date.now() < end) {
    try {
      if ((await fetch(url)).ok) return;
    } catch {}
    await new Promise((r) => setTimeout(r, 250));
  }
  throw new Error(`dev server did not start at ${url}`);
}

function killTree(child) {
  if (child.pid === undefined) return;
  try {
    if (process.platform === "win32")
      spawnSync("taskkill", ["/pid", String(child.pid), "/T", "/F"]);
    else process.kill(-child.pid, "SIGTERM");
  } catch {}
}

async function shoot(base) {
  const shots = join(benchRoot, "shots");
  mkdirSync(shots, { recursive: true });
  const browser = await chromium.launch();
  const problems = [];
  const warnings = [];
  try {
    for (const w of work) {
      for (const bp of BREAKPOINTS) {
        const page = await browser.newPage({ viewport: { width: bp, height: 900 } });
        page.on("pageerror", (e) => problems.push(`${w.id}/${w.variant}@${bp}: ${e.message}`));
        page.on("console", (m) => {
          if (m.type() === "error") warnings.push(`${w.id}/${w.variant}@${bp}: ${m.text()}`);
        });
        await page.goto(`${base}/bench/${w.id}/${w.variant}`, { waitUntil: "networkidle" });
        await page.waitForSelector('[data-ready="true"]', { timeout: 30_000 });
        await page.evaluate(() => document.fonts.ready);
        await page.screenshot({
          path: join(shots, `${w.id}-${w.variant}-${bp}.png`),
          fullPage: true,
        });
        await page.close();
      }
      console.log(`shot ${w.id}/${w.variant}`);
    }
  } finally {
    await browser.close();
  }
  return { problems, warnings };
}

function lint() {
  const presetsCache = new Map();
  const tokensFor = (preset) => {
    if (!presetsCache.has(preset))
      presetsCache.set(preset, generateTokens(getPreset(preset).preset));
    return presetsCache.get(preset);
  };
  const results = {};
  for (const w of work) {
    const path = pageFile(w.id, w.variant);
    const report = lintSources([{ path, source: readFileSync(path, "utf8") }], {
      rules: recommendedRules,
      ...(w.variant === "uitaste" ? { tokens: tokensFor(w.preset) } : {}),
    });
    const findings = report.files.flatMap((f) => f.findings);
    results[w.id] ??= { preset: w.preset };
    results[w.id][w.variant] = {
      errors: report.summary.errors,
      warnings: report.summary.warnings,
      rules: [...new Set(findings.map((f) => f.ruleId))].sort(),
    };
  }
  return results;
}

const port = await freePort();
const base = `http://127.0.0.1:${port}`;
const playground = join(repoRoot, "apps", "playground");
const viteBin = join(playground, "node_modules", "vite", "bin", "vite.js");
const server = spawn(
  process.execPath,
  [viteBin, "--host", "127.0.0.1", "--port", String(port), "--strictPort"],
  { cwd: playground, detached: true, stdio: "ignore" },
);
const stop = () => killTree(server);
process.on("exit", stop);
for (const sig of ["SIGINT", "SIGTERM"]) {
  process.on(sig, () => {
    stop();
    process.exit(130);
  });
}
let code = 0;
try {
  await waitFor(`${base}/`, 60_000);
  const { problems, warnings } = await shoot(base);
  if (warnings.length) console.warn(`Console errors (warnings):\n  ${warnings.join("\n  ")}`);
  if (problems.length) {
    console.error(`Page errors:\n  ${problems.join("\n  ")}`);
    code = 1;
  }
} catch (e) {
  console.error(e instanceof Error ? e.message : e);
  code = 1;
} finally {
  killTree(server);
}

const outDir = join(benchRoot, "out");
mkdirSync(outDir, { recursive: true });
const resultsFile = join(outDir, "results.json");
const previous = existsSync(resultsFile) ? JSON.parse(readFileSync(resultsFile, "utf8")) : {};
const fresh = lint();
const results = { ...previous };
for (const [id, entry] of Object.entries(fresh)) results[id] = { ...previous[id], ...entry };
writeFileSync(resultsFile, `${JSON.stringify(results, null, 2)}\n`);
for (const [id, r] of Object.entries(results).filter(([id]) => selected.some((p) => p.id === id))) {
  const f = (v) => (r[v] ? `${r[v].errors}E/${r[v].warnings}W` : "-");
  console.log(`lint ${id}: baseline ${f("baseline")} · uitaste ${f("uitaste")}`);
}

for (const p of selected) {
  if (VARIANTS.every((v) => existsSync(pageFile(p.id, v)))) {
    try {
      console.log(`composed ${await compose(p.id)}`);
    } catch (e) {
      console.error(`compose ${p.id} failed: ${e instanceof Error ? e.message : e}`);
      code = 1;
    }
  }
}
process.exit(code);
