import { createRequire } from "node:module";
import { dirname, resolve } from "node:path";
import {
  agentHandoff,
  type BrowserLike,
  type Manifest,
  parseBreakpoints,
  parseList,
  resolveShootOptions,
  rubricPath,
  runShoot,
} from "@uitaste/core";
import { defineCommand } from "citty";
import { z } from "zod";
import type { Io } from "./preset.js";

const ShootArgs = z.object({
  url: z.string().optional(),
  routes: z.string().optional(),
  breakpoints: z.string().optional(),
  out: z.string().min(1).optional(),
  dir: z.string().min(1).default("."),
  json: z.boolean().default(false),
});

const stdio: Io = {
  out: (s) => process.stdout.write(`${s}\n`),
  err: (s) => process.stderr.write(`${s}\n`),
};

export const PLAYWRIGHT_HELP =
  "Playwright is required for `uitaste shoot`. Install it and its browser:\n" +
  "  npm i -D playwright && npx playwright install chromium";

function skillRoot(): string {
  const require = createRequire(import.meta.url);
  return dirname(require.resolve("@uitaste/skill/package.json"));
}

/** Launches headless chromium; the caller closes it. */
export type Launcher = () => Promise<BrowserLike & { close(): Promise<void> }>;

export const launchChromium: Launcher = async () => {
  let pw: typeof import("playwright");
  try {
    pw = await import("playwright");
  } catch {
    throw new Error(PLAYWRIGHT_HELP);
  }
  try {
    return (await pw.chromium.launch()) as unknown as BrowserLike & { close(): Promise<void> };
  } catch (e) {
    const msg = e instanceof Error ? e.message : String(e);
    if (/Executable doesn't exist|playwright install/i.test(msg)) {
      throw new Error(`Chromium is not installed. Run: npx playwright install chromium`);
    }
    throw e;
  }
};

/** Returns the process exit code: 0 when every shot succeeded. */
export async function runShootCommand(
  input: unknown,
  io: Io = stdio,
  launch: Launcher = launchChromium,
): Promise<number> {
  const parsed = ShootArgs.safeParse(input);
  if (!parsed.success) {
    io.err(z.prettifyError(parsed.error));
    return 1;
  }
  const args = parsed.data;
  try {
    const opts = resolveShootOptions({
      cwd: resolve(args.dir),
      url: args.url,
      routes: args.routes !== undefined ? parseList(args.routes) : undefined,
      breakpoints: args.breakpoints !== undefined ? parseBreakpoints(args.breakpoints) : undefined,
      out: args.out,
    });

    const browser = await launch();
    let manifest: Manifest;
    try {
      manifest = await runShoot(browser, opts);
    } finally {
      await browser.close();
    }
    if (args.json) {
      io.out(JSON.stringify(manifest, null, 2));
    } else {
      for (const s of manifest.shots) {
        const mark = s.status === "ok" ? "ok " : "ERR";
        const tail = s.error
          ? `  ${s.error}`
          : s.consoleErrors.length
            ? `  (${s.consoleErrors.length} console errors)`
            : "";
        io.out(`${mark} ${s.route} @${s.width}  ${s.path ?? "-"}${tail}`);
      }
      io.out(
        `${manifest.summary.ok}/${manifest.summary.total} shots -> ${manifest.outDir}/manifest.json`,
      );
      io.out(agentHandoff(manifest.outDir, rubricPath(skillRoot())));
    }
    return manifest.summary.failed > 0 ? 1 : 0;
  } catch (e) {
    io.err(e instanceof Error ? e.message : String(e));
    return 1;
  }
}

export const shootCommand = defineCommand({
  meta: { name: "shoot", description: "Screenshot routes at several breakpoints" },
  args: {
    url: { type: "string", description: "Base URL of the running app", required: false },
    routes: { type: "string", description: "Comma-separated routes (default /)", required: false },
    breakpoints: {
      type: "string",
      description: "Comma-separated widths (default 390,768,1440)",
      required: false,
    },
    out: {
      type: "string",
      description: "Output directory (default .uitaste/shots/<timestamp>)",
      required: false,
    },
    dir: {
      type: "string",
      description: "Project directory (for uitaste.config.json)",
      default: ".",
    },
    json: { type: "boolean", description: "Print the manifest as JSON", default: false },
  },
  async run({ args }) {
    process.exitCode = await runShootCommand(args);
  },
});
