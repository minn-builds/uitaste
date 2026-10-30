import { mkdirSync, mkdtempSync, symlinkSync, writeFileSync } from "node:fs";
import { tmpdir } from "node:os";
import { join } from "node:path";
import { describe, expect, it } from "vitest";
import { resolveInside, resolveShootOptions } from "./resolve.js";

function tmp(): string {
  return mkdtempSync(join(tmpdir(), "resolve-"));
}

describe("resolveInside", () => {
  it("resolves relative paths under the root", () => {
    const root = tmp();
    expect(resolveInside(root, "a/b")).toBe(join(root, "a", "b"));
    expect(resolveInside(root, join(root, "x"))).toBe(join(root, "x"));
  });
  it("rejects paths escaping the root", () => {
    const root = tmp();
    expect(() => resolveInside(root, "../x")).toThrow(/inside/);
    expect(() => resolveInside(root, "/etc")).toThrow(/inside/);
    expect(() => resolveInside(root, "a/../../x")).toThrow(/inside/);
  });
  it("rejects the root itself unless allowed", () => {
    const root = tmp();
    expect(() => resolveInside(root, ".")).toThrow(/inside/);
    expect(resolveInside(root, ".", { allowRoot: true })).toBe(root);
  });
  it("rejects symlinks that point outside the root", () => {
    const root = tmp();
    const outside = tmp();
    symlinkSync(outside, join(root, "link"));
    expect(() => resolveInside(root, "link/shots")).toThrow(/inside/);
    mkdirSync(join(root, "real"));
    symlinkSync(join(root, "real"), join(root, "inner"));
    expect(resolveInside(root, "inner/shots")).toBe(join(root, "inner", "shots"));
    expect(resolveInside(root, "real/new/deep")).toBe(join(root, "real", "new", "deep"));
  });

  it("rejects dangling symlinks that point outside the root", () => {
    const root = tmp();
    const outside = tmp();
    symlinkSync(join(outside, "newdir"), join(root, "link"));
    expect(() => resolveInside(root, "link")).toThrow(/inside/);
    expect(() => resolveInside(root, "link/shots")).toThrow(/inside/);
    symlinkSync("../../../escape", join(root, "rel"));
    expect(() => resolveInside(root, "rel/x")).toThrow(/inside/);
  });
  it("rejects symlink loops", () => {
    const root = tmp();
    symlinkSync(join(root, "b"), join(root, "a"));
    symlinkSync(join(root, "a"), join(root, "b"));
    expect(() => resolveInside(root, "a/x")).toThrow(/symlinks/);
  });
  it("works when the root itself is a symlink", () => {
    const real = tmp();
    const holder = tmp();
    const root = join(holder, "root-link");
    symlinkSync(real, root);
    expect(resolveInside(root, "shots/x")).toBe(join(root, "shots", "x"));
    expect(resolveInside(root, ".", { allowRoot: true })).toBe(root);
    expect(() => resolveInside(root, "../x")).toThrow(/inside/);
    symlinkSync(holder, join(real, "up"));
    expect(() => resolveInside(root, "up/x")).toThrow(/inside/);
  });
});

describe("resolveShootOptions", () => {
  const now = new Date("2026-01-02T03:04:05.678Z");

  it("falls back to config, then defaults", () => {
    const cwd = tmp();
    writeFileSync(
      join(cwd, "uitaste.config.json"),
      JSON.stringify({
        preset: "editorial",
        framework: "vite",
        tailwind: true,
        tokensCss: "src/uitaste.tokens.css",
        globalCss: null,
        shoot: { url: "http://localhost:5173", routes: ["/a"], breakpoints: [500] },
      }),
    );
    const o = resolveShootOptions({ cwd, now });
    expect(o).toMatchObject({
      url: "http://localhost:5173",
      routes: ["/a"],
      breakpoints: [500],
      outDir: join(cwd, ".uitaste", "shots", "2026-01-02T03-04-05"),
    });
    const o2 = resolveShootOptions({
      cwd,
      url: "http://x.test",
      routes: ["/b"],
      breakpoints: [390],
    });
    expect(o2).toMatchObject({ url: "http://x.test", routes: ["/b"], breakpoints: [390] });
  });
  it("defaults routes to / and breakpoints to the standard set", () => {
    const o = resolveShootOptions({ cwd: tmp(), url: "http://x.test", now });
    expect(o.routes).toEqual(["/"]);
    expect(o.breakpoints).toEqual([390, 768, 1440]);
  });
  it("requires a url and validates options", () => {
    expect(() => resolveShootOptions({ cwd: tmp() })).toThrow(/No URL/);
    expect(() => resolveShootOptions({ cwd: tmp(), url: "nope" })).toThrow();
    expect(() => resolveShootOptions({ cwd: tmp(), url: "http://x.test", routes: ["x"] })).toThrow(
      /start with/,
    );
  });
  it("allows any out dir by default but confines it when asked", () => {
    const cwd = tmp();
    expect(resolveShootOptions({ cwd, url: "http://x.test", out: "../elsewhere" }).outDir).toBe(
      join(cwd, "..", "elsewhere"),
    );
    expect(() =>
      resolveShootOptions({ cwd, url: "http://localhost:1", out: "../elsewhere", confine: true }),
    ).toThrow(/inside/);
    expect(
      resolveShootOptions({ cwd, url: "http://localhost:5173", out: "shots", confine: true })
        .outDir,
    ).toBe(join(cwd, "shots"));
  });
  it("confined runs only allow http(s) and local hosts for caller URLs", () => {
    const cwd = tmp();
    const run = (url: string) => resolveShootOptions({ cwd, url, out: "s", confine: true });
    expect(() => run("file:///etc/passwd")).toThrow(/http or https/);
    expect(() => run("ftp://localhost/x")).toThrow(/http or https/);
    expect(() => run("http://169.254.169.254/latest")).toThrow(/not allowed/);
    expect(() => run("https://example.com")).toThrow(/not allowed/);
    expect(run("http://localhost:5173").url).toBe("http://localhost:5173");
    expect(run("http://127.0.0.1:3000").url).toBe("http://127.0.0.1:3000");
    expect(run("http://[::1]:3000").url).toBe("http://[::1]:3000");
    // Unconfined (CLI) keeps any http(s) host.
    expect(resolveShootOptions({ cwd, url: "https://example.com" }).url).toBe(
      "https://example.com",
    );
  });
  it("trusts the config URL host but still requires http(s) when confined", () => {
    const write = (url: string) => {
      const cwd = tmp();
      writeFileSync(
        join(cwd, "uitaste.config.json"),
        JSON.stringify({
          preset: "editorial",
          framework: "vite",
          tailwind: true,
          tokensCss: "src/uitaste.tokens.css",
          globalCss: null,
          shoot: { url },
        }),
      );
      return cwd;
    };
    const cwd = write("https://staging.example.com");
    expect(resolveShootOptions({ cwd, out: "s", confine: true }).url).toBe(
      "https://staging.example.com",
    );
    expect(() =>
      resolveShootOptions({ cwd, url: "https://staging.example.com", out: "s", confine: true }),
    ).toThrow(/not allowed/);
  });
});
