import { createRequire } from "node:module";
import { dirname } from "node:path";
import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import type { CallToolResult } from "@modelcontextprotocol/sdk/types.js";
import {
  agentHandoff,
  defaultPresetsRoot,
  generateTokens,
  getPreset,
  listPresets,
  type Manifest,
  resolveInside,
  resolveShootOptions,
  rubricPath,
  runLint,
  runShoot,
  TokenOverridesSchema,
  toCssVars,
  toTailwindTheme,
} from "@tastekit/core";
import { z } from "zod";
import { type Launcher, launchChromium } from "./launch.js";

export const TOOL_NAMES = [
  "list_presets",
  "get_preset",
  "generate_tokens",
  "lint",
  "shoot",
] as const;

export interface ServerOptions {
  /** Root every `dir` / `out` argument must stay inside. Default: process.cwd(). */
  projectDir?: string;
  presetsRoot?: string;
  /** Root of the installed @tastekit/skill package (for the rubric path). */
  skillRoot?: string;
  launch?: Launcher;
}

const require = createRequire(import.meta.url);

function packageVersion(): string {
  const pkg: unknown = require("../package.json");
  const parsed = z.object({ version: z.string() }).safeParse(pkg);
  return parsed.success ? parsed.data.version : "0.0.0";
}

function defaultSkillRoot(): string {
  return dirname(require.resolve("@tastekit/skill/package.json"));
}

/** Short human summary first, then the machine-readable payload. */
function ok(summary: string, data: unknown): CallToolResult {
  return {
    content: [
      { type: "text", text: summary },
      { type: "text", text: typeof data === "string" ? data : JSON.stringify(data, null, 2) },
    ],
  };
}

function fail(e: unknown): CallToolResult {
  return {
    isError: true,
    content: [{ type: "text", text: e instanceof Error ? e.message : String(e) }],
  };
}

async function guard(fn: () => CallToolResult | Promise<CallToolResult>): Promise<CallToolResult> {
  try {
    return await fn();
  } catch (e) {
    return fail(e);
  }
}

const DirArg = z
  .string()
  .min(1)
  .optional()
  .describe("Project directory relative to the server's project root (default: the root)");

/** Build the tastekit MCP server. Tools are thin wrappers over @tastekit/core. */
export function createServer(opts: ServerOptions = {}): McpServer {
  const projectDir = opts.projectDir ?? process.cwd();
  const presetsRoot = () => opts.presetsRoot ?? defaultPresetsRoot();
  const launch = opts.launch ?? launchChromium;
  const projectPath = (dir: string | undefined) =>
    resolveInside(projectDir, dir ?? ".", { allowRoot: true });

  const server = new McpServer({ name: "tastekit", version: packageVersion() });

  server.registerTool(
    "list_presets",
    {
      title: "List presets",
      description: "List the curated tastekit design presets (id, name, description, tags).",
      inputSchema: {},
      annotations: { readOnlyHint: true },
    },
    () =>
      guard(() => {
        const presets = listPresets(presetsRoot()).map(({ preset: { meta } }) => meta);
        return ok(`${presets.length} presets: ${presets.map((p) => p.id).join(", ")}`, presets);
      }),
  );

  server.registerTool(
    "get_preset",
    {
      title: "Get preset",
      description:
        "Get one preset: its preset.json (fonts, color seeds, scales) and its rules markdown.",
      inputSchema: { id: z.string().min(1).describe("Preset id, e.g. editorial") },
      annotations: { readOnlyHint: true },
    },
    ({ id }) =>
      guard(() => {
        const { preset, rules } = getPreset(id, presetsRoot());
        return ok(`Preset ${preset.meta.id}: ${preset.meta.description}`, { preset, rules });
      }),
  );

  server.registerTool(
    "generate_tokens",
    {
      title: "Generate tokens",
      description:
        "Generate design tokens for a preset with optional brand overrides. format: json (default), css (CSS variables) or tailwind (Tailwind v4 @theme).",
      inputSchema: {
        preset: z.string().min(1).describe("Preset id"),
        overrides: TokenOverridesSchema.optional(),
        format: z.enum(["json", "css", "tailwind"]).default("json"),
      },
      annotations: { readOnlyHint: true },
    },
    ({ preset, overrides, format }) =>
      guard(() => {
        const tokens = generateTokens(getPreset(preset, presetsRoot()).preset, overrides ?? {});
        const summary = `Tokens for ${preset} (${format})`;
        if (format === "css") return ok(summary, toCssVars(tokens));
        if (format === "tailwind") return ok(summary, toTailwindTheme(tokens));
        return ok(summary, tokens);
      }),
  );

  server.registerTool(
    "lint",
    {
      title: "Design lint",
      description:
        "Run the tastekit design linter on a project (reads tastekit.config.json). Returns findings JSON.",
      inputSchema: {
        dir: DirArg,
        globs: z
          .array(z.string().min(1))
          .optional()
          .describe("Globs relative to dir (default: config lint.include or src/**)"),
        failOn: z.enum(["error", "warn"]).default("error"),
      },
      annotations: { readOnlyHint: true },
    },
    ({ dir, globs, failOn }) =>
      guard(async () => {
        const { report, exitCode } = await runLint({
          cwd: projectPath(dir),
          failOn,
          presetsRoot: presetsRoot(),
          ...(globs ? { globs } : {}),
        });
        const s = report.summary;
        const summary = `${exitCode === 0 ? "pass" : "fail"}: ${s.errors} errors, ${s.warnings} warnings, ${s.infos} infos in ${s.files} files`;
        return ok(summary, report);
      }),
  );

  server.registerTool(
    "shoot",
    {
      title: "Screenshot routes",
      description:
        "Screenshot routes of a running app at several breakpoints (needs playwright). Returns the manifest and the critique rubric path.",
      inputSchema: {
        dir: DirArg,
        url: z
          .string()
          .optional()
          .describe(
            "Base URL of the local dev server (http(s)://localhost, 127.0.0.1 or [::1]); default: config shoot.url",
          ),
        routes: z.array(z.string()).min(1).optional().describe("Routes, default ['/']"),
        breakpoints: z
          .array(z.number().int().min(200).max(4000))
          .min(1)
          .optional()
          .describe("Widths in px (200-4000)"),
        out: z
          .string()
          .min(1)
          .optional()
          .describe("Output dir inside the project (default .tastekit/shots/<timestamp>)"),
      },
    },
    ({ dir, url, routes, breakpoints, out }) =>
      guard(async () => {
        const shootOpts = resolveShootOptions({
          cwd: projectPath(dir),
          url,
          routes,
          breakpoints,
          out,
          confine: true,
        });
        const browser = await launch();
        let manifest: Manifest;
        try {
          manifest = await runShoot(browser, shootOpts);
        } finally {
          await browser.close();
        }
        const rubric = rubricPath(opts.skillRoot ?? defaultSkillRoot());
        const m = manifest.summary;
        const summary = `${m.ok}/${m.total} shots ok, ${m.consoleErrors} console errors\n${agentHandoff(manifest.outDir, rubric).trim()}`;
        return ok(summary, { manifest, rubric });
      }),
  );

  return server;
}
