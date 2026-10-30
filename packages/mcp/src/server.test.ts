import { existsSync, mkdirSync, mkdtempSync, writeFileSync } from "node:fs";
import { tmpdir } from "node:os";
import { join } from "node:path";
import { Client } from "@modelcontextprotocol/sdk/client/index.js";
import { InMemoryTransport } from "@modelcontextprotocol/sdk/inMemory.js";
import type { BrowserLike } from "@tastekit/core";
import { afterEach, describe, expect, it } from "vitest";
import { z } from "zod";
import { PLAYWRIGHT_HELP } from "./launch.js";
import { createServer, type ServerOptions, TOOL_NAMES } from "./server.js";

const TextContent = z.array(z.object({ type: z.literal("text"), text: z.string() }));
const ToolResult = z.object({ content: TextContent, isError: z.boolean().optional() });

const clients: Client[] = [];
afterEach(async () => {
  await Promise.all(clients.splice(0).map((c) => c.close()));
});

async function connect(opts: ServerOptions = {}): Promise<Client> {
  const server = createServer(opts);
  const [clientT, serverT] = InMemoryTransport.createLinkedPair();
  const client = new Client({ name: "test", version: "0.0.0" });
  await Promise.all([server.connect(serverT), client.connect(clientT)]);
  clients.push(client);
  return client;
}

async function call(client: Client, name: string, args: Record<string, unknown> = {}) {
  const res = ToolResult.parse(await client.callTool({ name, arguments: args }));
  const [summary, payload] = res.content;
  return { isError: res.isError ?? false, summary: summary?.text ?? "", payload: payload?.text };
}

function json(text: string | undefined): unknown {
  return JSON.parse(text ?? "null");
}

function project(): string {
  return mkdtempSync(join(tmpdir(), "tastekit-mcp-"));
}

describe("tools/list", () => {
  it("lists the five tools with input schemas", async () => {
    const { tools } = await (await connect()).listTools();
    expect(tools.map((t) => t.name).sort()).toEqual([...TOOL_NAMES].sort());
    for (const t of tools) expect(t.inputSchema.type).toBe("object");
  });
});

describe("list_presets", () => {
  it("returns preset metadata", async () => {
    const r = await call(await connect(), "list_presets");
    expect(r.isError).toBe(false);
    const presets = z.array(z.object({ id: z.string(), name: z.string() })).parse(json(r.payload));
    expect(presets.map((p) => p.id)).toContain("editorial");
    expect(r.summary).toMatch(/presets: .*editorial/);
  });
});

describe("get_preset", () => {
  it("returns preset json and rules", async () => {
    const r = await call(await connect(), "get_preset", { id: "editorial" });
    const data = z
      .object({ preset: z.object({ meta: z.object({ id: z.string() }) }), rules: z.string() })
      .parse(json(r.payload));
    expect(data.preset.meta.id).toBe("editorial");
    expect(data.rules.length).toBeGreaterThan(0);
  });
  it("returns a tool error for unknown presets", async () => {
    const r = await call(await connect(), "get_preset", { id: "nope" });
    expect(r.isError).toBe(true);
    expect(r.summary).toMatch(/Unknown preset "nope"/);
  });
});

describe("generate_tokens", () => {
  it("returns JSON tokens with overrides applied", async () => {
    const c = await connect();
    const r = await call(c, "generate_tokens", {
      preset: "editorial",
      overrides: { fonts: { body: "Inter" } },
    });
    expect(r.isError).toBe(false);
    expect(JSON.stringify(json(r.payload))).toContain("Inter");
  });
  it("emits css and tailwind", async () => {
    const c = await connect();
    const css = await call(c, "generate_tokens", { preset: "editorial", format: "css" });
    expect(css.payload).toMatch(/:root \{/);
    const tw = await call(c, "generate_tokens", { preset: "editorial", format: "tailwind" });
    expect(tw.payload).toContain("@theme");
  });
  it("rejects invalid overrides", async () => {
    const r = await call(await connect(), "generate_tokens", {
      preset: "editorial",
      overrides: { accent: 42 },
    });
    expect(r.isError).toBe(true);
  });
});

describe("lint", () => {
  it("returns findings JSON and a summary", async () => {
    const root = project();
    mkdirSync(join(root, "app", "src"), { recursive: true });
    writeFileSync(
      join(root, "app", "src", "Hero.tsx"),
      'export const Hero = () => <div className="bg-gradient-to-r from-purple-500 to-indigo-500 p-[13px]">Hi</div>;\n',
    );
    const r = await call(await connect({ projectDir: root }), "lint", { dir: "app" });
    expect(r.isError).toBe(false);
    const report = z
      .object({
        files: z.array(z.object({ path: z.string(), findings: z.array(z.unknown()) })),
        summary: z.object({ files: z.number() }),
      })
      .parse(json(r.payload));
    expect(report.files[0]?.path).toBe("src/Hero.tsx");
    expect(report.files[0]?.findings.length).toBeGreaterThan(0);
    expect(r.summary).toMatch(/in 1 files/);
  });
  it("rejects dirs outside the project", async () => {
    const r = await call(await connect({ projectDir: project() }), "lint", { dir: "../.." });
    expect(r.isError).toBe(true);
    expect(r.summary).toMatch(/inside/);
  });
});

function fakeBrowser(log: string[]): BrowserLike & { close(): Promise<void> } {
  return {
    async newContext({ viewport }) {
      return {
        async newPage() {
          return {
            on() {},
            async goto(url: string) {
              log.push(`${url}@${viewport.width}`);
              return { status: () => 200 };
            },
            async evaluate() {},
            async screenshot() {},
          } as never;
        },
        async close() {},
      };
    },
    async close() {
      log.push("closed");
    },
  };
}

describe("shoot", () => {
  it("returns the manifest and rubric path", async () => {
    const root = project();
    const log: string[] = [];
    const c = await connect({
      projectDir: root,
      skillRoot: "/skill",
      launch: async () => fakeBrowser(log),
    });
    const r = await call(c, "shoot", {
      url: "http://localhost:5173",
      routes: ["/", "/a"],
      breakpoints: [390],
      out: "shots",
    });
    expect(r.isError).toBe(false);
    const data = z
      .object({
        manifest: z.object({ outDir: z.string(), summary: z.object({ total: z.number() }) }),
        rubric: z.string(),
      })
      .parse(json(r.payload));
    expect(data.manifest.outDir).toBe(join(root, "shots"));
    expect(data.manifest.summary.total).toBe(2);
    expect(data.rubric).toBe(join("/skill", "reference", "rubric.md"));
    expect(existsSync(join(root, "shots", "manifest.json"))).toBe(true);
    expect(log).toEqual(["http://localhost:5173/@390", "http://localhost:5173/a@390", "closed"]);
    expect(r.summary).toMatch(/2\/2 shots ok/);
    expect(r.summary).toContain("rubric:");
  });
  it("refuses output dirs outside the project", async () => {
    const log: string[] = [];
    const c = await connect({ projectDir: project(), launch: async () => fakeBrowser(log) });
    const r = await call(c, "shoot", { url: "http://localhost:5173", out: "../escape" });
    expect(r.isError).toBe(true);
    expect(r.summary).toMatch(/inside/);
    expect(log).toEqual([]);
  });
  it("refuses non-local or non-http urls", async () => {
    const log: string[] = [];
    const c = await connect({ projectDir: project(), launch: async () => fakeBrowser(log) });
    for (const url of ["file:///etc/passwd", "http://169.254.169.254/"]) {
      const r = await call(c, "shoot", { url, out: "s" });
      expect(r.isError).toBe(true);
    }
    expect(log).toEqual([]);
  });
  it("rejects out-of-range breakpoints at the schema", async () => {
    const c = await connect({ projectDir: project(), launch: async () => fakeBrowser([]) });
    const r = await call(c, "shoot", { url: "http://localhost:5173", breakpoints: [50] });
    expect(r.isError).toBe(true);
  });
  it("reports a clear error when playwright is missing", async () => {
    const c = await connect({
      projectDir: project(),
      launch: async () => {
        throw new Error(PLAYWRIGHT_HELP);
      },
    });
    const r = await call(c, "shoot", { url: "http://localhost:5173", out: "s" });
    expect(r.isError).toBe(true);
    expect(r.summary).toContain("npm i -D playwright");
  });
  it("requires a url when the config has none", async () => {
    const r = await call(await connect({ projectDir: project() }), "shoot", {});
    expect(r.isError).toBe(true);
    expect(r.summary).toMatch(/No URL/);
  });
});
