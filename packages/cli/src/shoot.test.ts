import { type ChildProcess, spawn, spawnSync } from "node:child_process";
import { existsSync, mkdtempSync, readFileSync, rmSync } from "node:fs";
import { createServer } from "node:net";
import { tmpdir } from "node:os";
import { join } from "node:path";
import { afterAll, beforeAll, describe, expect, it } from "vitest";
import { runShootCommand } from "./commands/shoot.js";

const playground = join(import.meta.dirname, "..", "..", "..", "apps", "playground");

function freePort(): Promise<number> {
  return new Promise((res, rej) => {
    const s = createServer();
    s.once("error", rej);
    s.listen(0, "127.0.0.1", () => {
      const addr = s.address();
      const port = typeof addr === "object" && addr ? addr.port : 0;
      s.close(() => res(port));
    });
  });
}

async function waitFor(url: string, ms: number): Promise<void> {
  const end = Date.now() + ms;
  while (Date.now() < end) {
    try {
      if ((await fetch(url)).ok) return;
    } catch {
      // not up yet
    }
    await new Promise((r) => setTimeout(r, 250));
  }
  throw new Error(`dev server did not start at ${url}`);
}

async function chromiumAvailable(): Promise<boolean> {
  try {
    const { chromium } = await import("playwright");
    return existsSync(chromium.executablePath());
  } catch {
    return false;
  }
}

const hasChromium = await chromiumAvailable();
if (!hasChromium) {
  console.warn("SKIP shoot e2e: chromium not installed. Run `npx playwright install chromium`.");
}

function killTree(child: ChildProcess): void {
  if (child.pid === undefined) return;
  try {
    if (process.platform === "win32") {
      spawnSync("taskkill", ["/pid", String(child.pid), "/T", "/F"]);
    } else {
      process.kill(-child.pid, "SIGTERM");
    }
  } catch {
    // already gone
  }
}

describe.skipIf(!hasChromium)("tastekit shoot e2e", () => {
  let server: ChildProcess | undefined;
  let base = "";
  let out = "";

  beforeAll(async () => {
    const port = await freePort();
    base = `http://127.0.0.1:${port}`;
    out = mkdtempSync(join(tmpdir(), "tastekit-shoot-"));
    const viteBin = join(playground, "node_modules", "vite", "bin", "vite.js");
    server = spawn(
      process.execPath,
      [viteBin, "--host", "127.0.0.1", "--port", String(port), "--strictPort"],
      { cwd: playground, detached: true, stdio: "ignore" },
    );
    try {
      await waitFor(`${base}/presets/editorial`, 60_000);
    } catch (e) {
      killTree(server);
      throw e;
    }
  }, 90_000);

  afterAll(async () => {
    if (server) {
      const exited = new Promise<void>((res) => {
        if (server?.exitCode !== null || server?.signalCode) res();
        else server.once("exit", () => res());
      });
      killTree(server);
      await Promise.race([exited, new Promise((r) => setTimeout(r, 5000))]);
    }
    if (out) rmSync(out, { recursive: true, force: true });
  });

  it("shoots a playground route at three widths and writes a manifest", async () => {
    const lines: string[] = [];
    const code = await runShootCommand(
      { url: base, routes: "/presets/editorial", out },
      { out: (s) => lines.push(s), err: (s) => lines.push(s) },
    );
    expect(code, lines.join("\n")).toBe(0);
    const manifest = JSON.parse(readFileSync(join(out, "manifest.json"), "utf8"));
    expect(manifest.shots).toHaveLength(3);
    expect(manifest.shots.map((s: { width: number }) => s.width)).toEqual([390, 768, 1440]);
    for (const s of manifest.shots) {
      expect(s.status).toBe("ok");
      expect(existsSync(join(out, s.path))).toBe(true);
      expect(readFileSync(join(out, s.path)).subarray(1, 4).toString()).toBe("PNG");
    }
  }, 120_000);

  it("exits non-zero with a readable error for an unreachable URL", async () => {
    const lines: string[] = [];
    const code = await runShootCommand(
      { url: "http://127.0.0.1:1", routes: "/", breakpoints: "390", out: join(out, "bad") },
      { out: (s) => lines.push(s), err: (s) => lines.push(s) },
    );
    expect(code).toBe(1);
  }, 60_000);
});

describe("tastekit shoot args", () => {
  it("errors without a url", async () => {
    const lines: string[] = [];
    const code = await runShootCommand(
      { dir: tmpdir() },
      { out: (s) => lines.push(s), err: (s) => lines.push(s) },
      async () => {
        throw new Error("should not launch");
      },
    );
    expect(code).toBe(1);
    expect(lines.join("\n")).toMatch(/No URL/);
  });
});
