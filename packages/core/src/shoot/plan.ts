import type { ShootOptions } from "./options.js";

export interface ShotPlan {
  route: string;
  width: number;
  /** Absolute URL to navigate to. */
  url: string;
  /** File name relative to the output directory. */
  file: string;
}

function shortHash(s: string): string {
  let h = 5381;
  for (const ch of s) h = ((h * 33) ^ ch.charCodeAt(0)) >>> 0;
  return h.toString(36).slice(0, 6);
}

/** `/` -> `index`, `/presets/editorial` -> `presets-editorial`. */
export function routeSlug(route: string): string {
  const [path = "", ...rest] = route.split("#")[0]?.split("?") ?? [];
  const query = rest.join("?");
  const slug = path
    .replace(/^\/+|\/+$/g, "")
    .replace(/[^a-zA-Z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "")
    .toLowerCase();
  const base = slug || "index";
  return query ? `${base}-q${shortHash(query)}` : base;
}

export function shotFileName(route: string, width: number): string {
  return `${routeSlug(route)}-${width}.png`;
}

export function resolveRouteUrl(base: string, route: string): string {
  return new URL(route, base.endsWith("/") ? base : `${base}/`).toString();
}

/** Routes x breakpoints, routes outermost. Throws if two routes map to the same file name. */
export function planShots(opts: Pick<ShootOptions, "url" | "routes" | "breakpoints">): ShotPlan[] {
  const plans: ShotPlan[] = [];
  const seen = new Map<string, string>();
  for (const route of new Set(opts.routes)) {
    for (const width of opts.breakpoints) {
      const file = shotFileName(route, width);
      const prev = seen.get(file);
      if (prev !== undefined && prev !== `${route}@${width}`) {
        throw new Error(
          `Routes "${prev.split("@")[0]}" and "${route}" map to the same file ${file}`,
        );
      }
      seen.set(file, `${route}@${width}`);
      plans.push({ route, width, url: resolveRouteUrl(opts.url, route), file });
    }
  }
  return plans;
}
