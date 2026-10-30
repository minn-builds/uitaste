import { describe, expect, it } from "vitest";
import { buildManifest, defaultOutDir } from "./manifest.js";
import { parseBreakpoints, parseList, ShootOptionsSchema } from "./options.js";
import { planShots, resolveRouteUrl, routeSlug, shotFileName } from "./plan.js";
import { type BrowserLike, runShoot } from "./run.js";

describe("plan", () => {
  it("slugs routes", () => {
    expect(routeSlug("/")).toBe("index");
    expect(routeSlug("/presets/editorial")).toBe("presets-editorial");
    expect(routeSlug("/a/b/#h")).toBe("a-b");
    expect(routeSlug("/x?tab=1")).not.toBe(routeSlug("/x?tab=2"));
    expect(routeSlug("/x?tab=1")).toMatch(/^x-q[a-z0-9]+$/);
    expect(shotFileName("/pricing", 390)).toBe("pricing-390.png");
  });
  it("resolves urls against a base with or without path", () => {
    expect(resolveRouteUrl("http://localhost:5000", "/x")).toBe("http://localhost:5000/x");
    expect(resolveRouteUrl("http://localhost:5000/app", "x")).toBe("http://localhost:5000/app/x");
  });
  it("plans routes x breakpoints", () => {
    const o = ShootOptionsSchema.parse({
      url: "http://localhost:1",
      routes: ["/", "/a"],
      outDir: "o",
    });
    const plans = planShots(o);
    expect(plans.map((p) => p.file)).toEqual([
      "index-390.png",
      "index-768.png",
      "index-1440.png",
      "a-390.png",
      "a-768.png",
      "a-1440.png",
    ]);
  });
  it("dedupes identical routes and keeps query variants apart", () => {
    const plans = planShots({
      url: "http://x.test",
      routes: ["/x?tab=1", "/x?tab=2", "/x?tab=1"],
      breakpoints: [390],
    });
    expect(plans).toHaveLength(2);
    expect(new Set(plans.map((p) => p.file)).size).toBe(2);
  });
  it("rejects colliding file names", () => {
    expect(() =>
      planShots({ url: "http://x.test", routes: ["/a-b", "/a/b"], breakpoints: [390] }),
    ).toThrow(/same file/);
  });
  it("parses lists and validates options", () => {
    expect(parseList(" /a, /b ,")).toEqual(["/a", "/b"]);
    expect(parseBreakpoints("390,1440")).toEqual([390, 1440]);
    expect(() => parseBreakpoints("abc")).toThrow();
    expect(() => ShootOptionsSchema.parse({ url: "nope", routes: ["/"], outDir: "o" })).toThrow();
    expect(() =>
      ShootOptionsSchema.parse({ url: "http://a.b", routes: ["x"], outDir: "o" }),
    ).toThrow();
  });
});

describe("manifest", () => {
  it("summarises results", () => {
    const m = buildManifest({
      baseUrl: "http://a.b",
      outDir: "/o",
      now: new Date("2026-01-02T03:04:05.678Z"),
      shots: [
        { route: "/", width: 390, url: "u", path: "p", status: "ok", consoleErrors: ["boom"] },
        { route: "/", width: 768, url: "u", status: "error", error: "x", consoleErrors: [] },
      ],
    });
    expect(m.summary).toEqual({ total: 2, ok: 1, failed: 1, consoleErrors: 1 });
    expect(m.createdAt).toBe("2026-01-02T03:04:05.678Z");
  });
  it("names the default out dir by timestamp", () => {
    expect(defaultOutDir(new Date("2026-01-02T03:04:05.678Z"))).toBe(
      ".uitaste/shots/2026-01-02T03-04-05",
    );
  });
});

describe("runShoot", () => {
  it("records successes, console errors and failures with a fake browser", async () => {
    const { mkdtempSync, existsSync } = await import("node:fs");
    const { tmpdir } = await import("node:os");
    const { join } = await import("node:path");
    const outDir = mkdtempSync(join(tmpdir(), "shoot-"));
    const browser: BrowserLike = {
      async newContext({ viewport }) {
        const handlers: Record<string, (a: never) => void> = {};
        return {
          async newPage() {
            return {
              on(ev: string, cb: (a: never) => void) {
                handlers[ev] = cb;
              },
              async goto(url: string) {
                if (url.endsWith("/bad")) throw new Error("net::ERR");
                handlers.console?.({
                  type: () => "error",
                  text: () => `w${viewport.width}`,
                } as never);
                return { status: () => 200 };
              },
              async evaluate() {},
              async screenshot() {},
            } as never;
          },
          async close() {},
        };
      },
    };
    const m = await runShoot(browser, {
      url: "http://x.test",
      routes: ["/", "/bad"],
      breakpoints: [390],
      outDir,
    });
    expect(m.shots[0]).toMatchObject({
      status: "ok",
      path: "index-390.png",
      consoleErrors: ["w390"],
    });
    expect(m.shots[1]).toMatchObject({ status: "error", error: "net::ERR" });
    expect(m.summary.failed).toBe(1);
    expect(existsSync(join(outDir, "manifest.json"))).toBe(true);
  });

  it("closes every context, including after goto/screenshot failures and HTTP errors", async () => {
    const { mkdtempSync } = await import("node:fs");
    const { tmpdir } = await import("node:os");
    const { join } = await import("node:path");
    let opened = 0;
    let closed = 0;
    const browser: BrowserLike = {
      async newContext() {
        opened++;
        return {
          async newPage() {
            return {
              on() {},
              async goto(url: string) {
                if (url.endsWith("/throw")) throw new Error("timeout");
                return { status: () => (url.endsWith("/404") ? 404 : 200) };
              },
              async evaluate() {},
              async screenshot() {
                throw new Error("shot failed");
              },
            } as never;
          },
          async close() {
            closed++;
          },
        };
      },
    };
    const m = await runShoot(browser, {
      url: "http://x.test",
      routes: ["/throw", "/404", "/ok"],
      breakpoints: [390],
      outDir: mkdtempSync(join(tmpdir(), "shoot-")),
    });
    expect(opened).toBe(3);
    expect(closed).toBe(3);
    expect(m.shots.map((s) => s.error)).toEqual(["timeout", "shot failed", "shot failed"]);
    expect(m.shots.every((s) => s.status === "error" && s.path === undefined)).toBe(true);
  });
});
