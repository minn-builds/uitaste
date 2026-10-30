import { existsSync, mkdtempSync } from "node:fs";
import { tmpdir } from "node:os";
import { join } from "node:path";
import { describe, expect, it } from "vitest";
import { runShootCommand } from "./commands/shoot.js";

const fakeBrowser = {
  async close() {},
  async newContext() {
    return {
      async close() {},
      async newPage() {
        return {
          on() {},
          async goto() {
            return { status: () => 200 };
          },
          async evaluate() {},
          async screenshot() {},
        };
      },
    };
  },
};

describe("shoot agent handoff", () => {
  it("prints manifest and an existing rubric path", async () => {
    const out = mkdtempSync(join(tmpdir(), "tk-handoff-"));
    const lines: string[] = [];
    const code = await runShootCommand(
      { url: "http://localhost:1", out, dir: out },
      { out: (s) => lines.push(s), err: (s) => lines.push(s) },
      async () => fakeBrowser as never,
    );
    expect(code).toBe(0);
    const text = lines.join("\n");
    expect(text).toContain(`manifest: ${join(out, "manifest.json")}`);
    const m = /rubric: +(.+)/.exec(text);
    expect(m?.[1]).toMatch(/reference[\\/]rubric\.md$/);
    expect(existsSync(m?.[1] ?? "")).toBe(true);
    expect(text).toContain("against the rubric");
  });
});
