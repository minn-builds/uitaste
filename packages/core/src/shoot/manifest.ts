import { z } from "zod";

export const ShotResultSchema = z.object({
  route: z.string(),
  width: z.number(),
  url: z.string(),
  /** Path of the PNG, relative to the manifest. Absent on failure. */
  path: z.string().optional(),
  status: z.enum(["ok", "error"]),
  /** HTTP status of the main document, when known. */
  httpStatus: z.number().optional(),
  consoleErrors: z.array(z.string()),
  error: z.string().optional(),
});
export type ShotResult = z.infer<typeof ShotResultSchema>;

export const ManifestSchema = z.object({
  version: z.literal(1),
  createdAt: z.string(),
  baseUrl: z.string(),
  outDir: z.string(),
  shots: z.array(ShotResultSchema),
  summary: z.object({
    total: z.number(),
    ok: z.number(),
    failed: z.number(),
    consoleErrors: z.number(),
  }),
});
export type Manifest = z.infer<typeof ManifestSchema>;

export const MANIFEST_FILE = "manifest.json";

export function buildManifest(input: {
  baseUrl: string;
  outDir: string;
  shots: ShotResult[];
  now?: Date;
}): Manifest {
  const ok = input.shots.filter((s) => s.status === "ok").length;
  return {
    version: 1,
    createdAt: (input.now ?? new Date()).toISOString(),
    baseUrl: input.baseUrl,
    outDir: input.outDir,
    shots: input.shots,
    summary: {
      total: input.shots.length,
      ok,
      failed: input.shots.length - ok,
      consoleErrors: input.shots.reduce((n, s) => n + s.consoleErrors.length, 0),
    },
  };
}

/** Default output dir: `.tastekit/shots/2026-01-02T03-04-05`. */
export function defaultOutDir(now: Date = new Date()): string {
  const stamp = now
    .toISOString()
    .replace(/\.\d+Z$/, "")
    .replace(/:/g, "-");
  return `.tastekit/shots/${stamp}`;
}
