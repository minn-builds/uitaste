import { resolve } from "node:path";
import { formatJson, formatPretty, runLint } from "@uitaste/core";
import { defineCommand } from "citty";
import { z } from "zod";
import type { Io } from "./preset.js";

const LintArgs = z.object({
  _: z.array(z.string()).default([]),
  dir: z.string().min(1).default("."),
  json: z.boolean().default(false),
  failOn: z.enum(["error", "warn"]).default("error"),
});

const stdio: Io = {
  out: (s) => process.stdout.write(`${s}\n`),
  err: (s) => process.stderr.write(`${s}\n`),
};

/** Returns the process exit code: 0 clean, 1 on lint failures or bad input. */
export async function runLintCommand(
  input: unknown,
  io: Io = stdio,
  opts: { color?: boolean; presetsRoot?: string } = {},
): Promise<number> {
  const parsed = LintArgs.safeParse(input);
  if (!parsed.success) {
    io.err(z.prettifyError(parsed.error));
    return 1;
  }
  const args = parsed.data;
  try {
    const { report, exitCode } = await runLint({
      cwd: resolve(args.dir),
      globs: args._,
      failOn: args.failOn,
      ...(opts.presetsRoot ? { presetsRoot: opts.presetsRoot } : {}),
    });
    io.out(args.json ? formatJson(report) : formatPretty(report, { color: opts.color ?? false }));
    return exitCode;
  } catch (e) {
    io.err(e instanceof Error ? e.message : String(e));
    return 1;
  }
}

export const lintCommand = defineCommand({
  meta: { name: "lint", description: "Lint source files for AI-default design patterns" },
  args: {
    globs: {
      type: "positional",
      description: "Globs to lint (default src/**/*.{tsx,jsx,ts,css,html})",
      required: false,
    },
    dir: {
      type: "string",
      description: "Project directory (for uitaste.config.json)",
      default: ".",
    },
    json: { type: "boolean", description: "Print the report as JSON", default: false },
    "fail-on": {
      type: "string",
      description: "Exit 1 on: error (default) or warn",
      default: "error",
    },
  },
  async run({ args }) {
    process.exitCode = await runLintCommand({ ...args, failOn: args["fail-on"] }, stdio, {
      color: Boolean(process.stdout.isTTY),
    });
  },
});
