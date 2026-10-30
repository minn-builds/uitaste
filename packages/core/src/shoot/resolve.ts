import { lstatSync, readlinkSync, realpathSync, type Stats } from "node:fs";
import { basename, dirname, isAbsolute, join, relative, resolve, sep } from "node:path";
import { z } from "zod";
import { readConfig } from "../init/init.js";
import { defaultOutDir } from "./manifest.js";
import { type ShootOptions, type ShootOptionsInput, ShootOptionsSchema } from "./options.js";

function within(root: string, target: string, allowRoot: boolean): boolean {
  const rel = relative(root, target);
  if (rel === "") return allowRoot;
  return rel !== ".." && !rel.startsWith(`..${sep}`) && !isAbsolute(rel);
}

const MAX_LINKS = 40;

/**
 * Real path of `p`, which may not exist yet. Follows every symlink on the way, dangling ones
 * included (their target is resolved against the link's real parent), so a link pointing at a
 * not-yet-created directory outside the root is still caught.
 */
function realpathLoose(p: string, hops = 0): string {
  if (hops > MAX_LINKS) throw new Error(`Too many symlinks resolving ${p}`);
  const parent = dirname(p);
  let stat: Stats;
  try {
    stat = lstatSync(p);
  } catch {
    // Missing: resolve the parent, then append the name.
    return parent === p ? p : join(realpathLoose(parent, hops), basename(p));
  }
  if (stat.isSymbolicLink()) {
    const realParent = parent === p ? p : realpathLoose(parent, hops);
    return realpathLoose(resolve(realParent, readlinkSync(p)), hops + 1);
  }
  return realpathSync(p);
}

/**
 * Resolve `target` against `root` and require the result to stay inside `root`, also after
 * following symlinks. Throws otherwise. Returns the (non-realpath) absolute path.
 */
export function resolveInside(
  root: string,
  target: string,
  opts: { allowRoot?: boolean } = {},
): string {
  const allowRoot = opts.allowRoot ?? false;
  const absRoot = resolve(root);
  const abs = resolve(absRoot, target);
  const ok =
    within(absRoot, abs, allowRoot) &&
    within(realpathLoose(absRoot), realpathLoose(abs), allowRoot);
  if (!ok) {
    throw new Error(
      `Path "${target}" must be inside ${absRoot}${allowRoot ? "" : " (not the directory itself)"}`,
    );
  }
  return abs;
}

const LOCAL_HOSTS: ReadonlySet<string> = new Set(["localhost", "127.0.0.1", "[::1]"]);

/**
 * For confined (MCP) runs: only http(s), and caller-supplied URLs must point at a local dev
 * server. A URL from tastekit.config.json is trusted for its host, since the project chose it.
 */
function checkConfinedUrl(url: string, fromArgs: boolean): void {
  let u: URL;
  try {
    u = new URL(url);
  } catch {
    throw new Error(`Invalid URL "${url}"`);
  }
  if (u.protocol !== "http:" && u.protocol !== "https:") {
    throw new Error(`URL "${url}" must use http or https`);
  }
  if (fromArgs && !LOCAL_HOSTS.has(u.hostname)) {
    throw new Error(
      `URL host "${u.hostname}" is not allowed: use localhost, 127.0.0.1 or [::1], or set shoot.url in tastekit.config.json`,
    );
  }
}

export interface ResolveShootInput {
  /** Project directory: holds tastekit.config.json; relative `out` resolves against it. */
  cwd: string;
  url?: string | undefined;
  routes?: readonly string[] | undefined;
  breakpoints?: readonly number[] | undefined;
  /** Output directory (default `.tastekit/shots/<timestamp>`). */
  out?: string | undefined;
  /**
   * MCP mode: the output dir must stay inside `cwd`, the URL must be http(s), and a URL passed
   * in `url` must be localhost (config URLs are trusted).
   */
  confine?: boolean;
  timeoutMs?: number;
  now?: Date;
}

/** Merge explicit args over the config's `shoot` section and defaults, then validate. */
export function resolveShootOptions(input: ResolveShootInput): ShootOptions {
  const cwd = resolve(input.cwd);
  const cfg = readConfig(cwd)?.shoot;
  const out = input.out ?? defaultOutDir(input.now);
  const breakpoints = input.breakpoints ?? cfg?.breakpoints;
  const raw: ShootOptionsInput = {
    url: input.url ?? cfg?.url ?? "",
    routes: [...(input.routes ?? cfg?.routes ?? ["/"])],
    outDir: input.confine ? resolveInside(cwd, out) : resolve(cwd, out),
    ...(breakpoints ? { breakpoints: [...breakpoints] } : {}),
    ...(input.timeoutMs !== undefined ? { timeoutMs: input.timeoutMs } : {}),
  };
  if (!raw.url) {
    throw new Error(
      "No URL. Pass --url (e.g. http://localhost:5173) or set shoot.url in tastekit.config.json",
    );
  }
  if (input.confine) checkConfinedUrl(raw.url, input.url !== undefined);
  const parsed = ShootOptionsSchema.safeParse(raw);
  if (!parsed.success) throw new Error(z.prettifyError(parsed.error));
  return parsed.data;
}
