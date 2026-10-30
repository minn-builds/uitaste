import { getPreset, listPresets } from "@tastekit/core";
import { defineCommand } from "citty";
import { z } from "zod";

const ListArgs = z.object({
  json: z.boolean().default(false),
  root: z.string().min(1).optional(),
});
const ShowArgs = ListArgs.extend({ id: z.string().min(1) });

export interface Io {
  out: (s: string) => void;
  err: (s: string) => void;
}

const stdio: Io = {
  out: (s) => process.stdout.write(`${s}\n`),
  err: (s) => process.stderr.write(`${s}\n`),
};

function rootOf(root: string | undefined): string | undefined {
  return root ?? process.env.TASTEKIT_PRESETS_ROOT ?? undefined;
}

/** Returns the process exit code. */
export function runList(input: unknown, io: Io = stdio): number {
  const args = ListArgs.safeParse(input);
  if (!args.success) {
    io.err(z.prettifyError(args.error));
    return 1;
  }
  try {
    const items = listPresets(rootOf(args.data.root)).map(({ preset }) => preset.meta);
    if (args.data.json) {
      io.out(JSON.stringify(items, null, 2));
    } else if (items.length === 0) {
      io.out("No presets found.");
    } else {
      for (const m of items) {
        const tags = m.tags.length ? ` [${m.tags.join(", ")}]` : "";
        io.out(`${m.id}  ${m.name}${tags}\n    ${m.description}`);
      }
    }
    return 0;
  } catch (e) {
    io.err(e instanceof Error ? e.message : String(e));
    return 1;
  }
}

/** Returns the process exit code. */
export function runShow(input: unknown, io: Io = stdio): number {
  const args = ShowArgs.safeParse(input);
  if (!args.success) {
    io.err(z.prettifyError(args.error));
    return 1;
  }
  try {
    const { preset, rules } = getPreset(args.data.id, rootOf(args.data.root));
    if (args.data.json) {
      io.out(JSON.stringify({ preset, rules }, null, 2));
    } else {
      const m = preset.meta;
      io.out(`${m.name} (${m.id})`);
      io.out(m.description);
      if (m.tags.length) io.out(`Tags: ${m.tags.join(", ")}`);
      io.out(`\n--- rules ---\n${rules.trimEnd()}`);
    }
    return 0;
  } catch (e) {
    io.err(e instanceof Error ? e.message : String(e));
    return 1;
  }
}

const common = {
  json: { type: "boolean", description: "Output JSON", default: false },
  root: { type: "string", description: "Presets root directory (testing)", required: false },
} as const;

const list = defineCommand({
  meta: { name: "list", description: "List available presets" },
  args: common,
  run({ args }) {
    process.exitCode = runList(args);
  },
});

const show = defineCommand({
  meta: { name: "show", description: "Show a preset and its rules" },
  args: { id: { type: "positional", description: "Preset id", required: true }, ...common },
  run({ args }) {
    process.exitCode = runShow(args);
  },
});

export const presetCommand = defineCommand({
  meta: { name: "preset", description: "Inspect presets" },
  subCommands: { list, show },
});
