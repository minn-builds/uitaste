import { mkdirSync, writeFileSync } from "node:fs";
import { join, resolve } from "node:path";
import { buildManifest, MANIFEST_FILE, type Manifest, type ShotResult } from "./manifest.js";
import { type ShootOptionsInput, ShootOptionsSchema } from "./options.js";
import { planShots } from "./plan.js";

/** Structural subset of Playwright's Browser/Page, so core does not depend on playwright. */
export interface PageLike {
  on(event: "console", cb: (msg: { type(): string; text(): string }) => void): unknown;
  on(event: "pageerror", cb: (err: Error) => void): unknown;
  goto(
    url: string,
    opts: { waitUntil: "networkidle"; timeout: number },
  ): Promise<{ status(): number } | null>;
  evaluate(fn: string): Promise<unknown>;
  screenshot(opts: { path: string; fullPage: boolean }): Promise<unknown>;
}
export interface ContextLike {
  newPage(): Promise<PageLike>;
  close(): Promise<void>;
}
export interface BrowserLike {
  newContext(opts: { viewport: { width: number; height: number } }): Promise<ContextLike>;
}

const VIEWPORT_HEIGHT = 900;

/** Shoot every route at every breakpoint. A failing shot is recorded, never thrown. */
export async function runShoot(browser: BrowserLike, input: ShootOptionsInput): Promise<Manifest> {
  const opts = ShootOptionsSchema.parse(input);
  const outDir = resolve(opts.outDir);
  mkdirSync(outDir, { recursive: true });
  const shots: ShotResult[] = [];
  for (const plan of planShots(opts)) {
    const consoleErrors: string[] = [];
    const base = { route: plan.route, width: plan.width, url: plan.url };
    const context = await browser.newContext({
      viewport: { width: plan.width, height: VIEWPORT_HEIGHT },
    });
    try {
      const page = await context.newPage();
      page.on("console", (m) => {
        if (m.type() === "error") consoleErrors.push(m.text());
      });
      page.on("pageerror", (e) => consoleErrors.push(e.message));
      const res = await page.goto(plan.url, { waitUntil: "networkidle", timeout: opts.timeoutMs });
      await page.evaluate("document.fonts.ready.then(() => undefined)");
      await page.screenshot({ path: join(outDir, plan.file), fullPage: true });
      const httpStatus = res?.status();
      const bad = httpStatus !== undefined && httpStatus >= 400;
      shots.push({
        ...base,
        path: plan.file,
        status: bad ? "error" : "ok",
        ...(httpStatus !== undefined ? { httpStatus } : {}),
        ...(bad ? { error: `HTTP ${httpStatus}` } : {}),
        consoleErrors,
      });
    } catch (e) {
      shots.push({
        ...base,
        status: "error",
        error: e instanceof Error ? e.message : String(e),
        consoleErrors,
      });
    } finally {
      await context.close().catch(() => undefined);
    }
  }
  const manifest = buildManifest({ baseUrl: opts.url, outDir, shots });
  writeFileSync(join(outDir, MANIFEST_FILE), `${JSON.stringify(manifest, null, 2)}\n`);
  return manifest;
}
