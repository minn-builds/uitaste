import { type ChildProcessWithoutNullStreams, spawn } from "node:child_process";
import { existsSync } from "node:fs";
import { join } from "node:path";
import { describe, expect, it } from "vitest";
import { z } from "zod";
import { TOOL_NAMES } from "./server.js";

const bin = join(import.meta.dirname, "..", "dist", "main.js");

const ListResponse = z.object({
  id: z.literal(2),
  result: z.object({ tools: z.array(z.object({ name: z.string() })) }),
});

function parseLine(line: string): unknown {
  try {
    return JSON.parse(line);
  } catch {
    return undefined;
  }
}

/** Send newline-delimited JSON-RPC to the built bin and wait for the tools/list response. */
function listToolsOverStdio(child: ChildProcessWithoutNullStreams): Promise<string[]> {
  return new Promise((resolve, reject) => {
    const timer = setTimeout(() => reject(new Error("timed out waiting for tools/list")), 10_000);
    let buf = "";
    let stderr = "";
    child.stderr.on("data", (d: Buffer) => {
      stderr += d.toString();
    });
    child.on("exit", (code) => {
      clearTimeout(timer);
      reject(new Error(`server exited (${code}): ${stderr}`));
    });
    child.stdout.on("data", (d: Buffer) => {
      buf += d.toString();
      const lines = buf.split("\n");
      buf = lines.pop() ?? "";
      for (const line of lines) {
        const msg = ListResponse.safeParse(parseLine(line));
        if (msg.success) {
          clearTimeout(timer);
          resolve(msg.data.result.tools.map((t) => t.name));
        }
      }
    });
    const send = (m: unknown) => child.stdin.write(`${JSON.stringify(m)}\n`);
    send({
      jsonrpc: "2.0",
      id: 1,
      method: "initialize",
      params: {
        protocolVersion: "2025-06-18",
        capabilities: {},
        clientInfo: { name: "smoke", version: "0.0.0" },
      },
    });
    send({ jsonrpc: "2.0", method: "notifications/initialized" });
    send({ jsonrpc: "2.0", id: 2, method: "tools/list" });
  });
}

describe("stdio bin", () => {
  it("starts and lists the five tools", async () => {
    if (!existsSync(bin)) {
      throw new Error(`${bin} is missing: run \`pnpm --filter @tastekit/mcp build\` first`);
    }
    const child = spawn(process.execPath, [bin], { stdio: ["pipe", "pipe", "pipe"] });
    try {
      const names = await listToolsOverStdio(child);
      expect(names.sort()).toEqual([...TOOL_NAMES].sort());
    } finally {
      child.removeAllListeners("exit");
      child.kill();
    }
  });
});
