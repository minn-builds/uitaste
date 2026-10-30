import { existsSync, readdirSync, readFileSync, realpathSync, statSync } from "node:fs";
import { createRequire } from "node:module";
import { basename, dirname, isAbsolute, join, relative, sep } from "node:path";
import { z } from "zod";
import { type Preset, PresetSchema } from "../schema/preset.js";

export class PresetLoadError extends Error {
  override name = "PresetLoadError";
}

export interface LoadedPreset {
  preset: Preset;
  /** Contents of the preset's rules markdown file. */
  rules: string;
  /** Absolute path of the preset folder. */
  dir: string;
}

const ID_PATTERN = /^[a-z0-9]+(?:-[a-z0-9]+)*$/;

function isInside(parent: string, child: string): boolean {
  const rel = relative(parent, child);
  return rel !== "" && rel !== ".." && !rel.startsWith(`..${sep}`) && !isAbsolute(rel);
}

/** Load and validate one preset folder (`preset.json` + rules file). */
export function loadPresetDir(dir: string): LoadedPreset {
  const file = join(dir, "preset.json");
  let raw: string;
  try {
    raw = readFileSync(file, "utf8");
  } catch {
    throw new PresetLoadError(`${file}: cannot read preset.json`);
  }

  let json: unknown;
  try {
    json = JSON.parse(raw);
  } catch (e) {
    throw new PresetLoadError(`${file}: not valid JSON (${(e as Error).message})`);
  }

  const parsed = PresetSchema.safeParse(json);
  if (!parsed.success) {
    throw new PresetLoadError(`Invalid preset ${file}:\n${z.prettifyError(parsed.error)}`);
  }
  const preset = parsed.data;

  if (basename(dir) !== preset.meta.id) {
    throw new PresetLoadError(
      `${file}: folder name "${basename(dir)}" must equal meta.id "${preset.meta.id}"`,
    );
  }

  const rulesPath = join(dir, preset.rules);
  if (!existsSync(rulesPath)) {
    throw new PresetLoadError(`${file}: rules file "${preset.rules}" not found at ${rulesPath}`);
  }
  if (!statSync(rulesPath).isFile()) {
    throw new PresetLoadError(`${file}: rules path "${preset.rules}" is not a file`);
  }
  // Guard against symlinks escaping the preset folder.
  if (!isInside(realpathSync(dir), realpathSync(rulesPath))) {
    throw new PresetLoadError(
      `${file}: rules file "${preset.rules}" must stay inside the preset folder`,
    );
  }

  return { preset, rules: readFileSync(rulesPath, "utf8"), dir };
}

/** Load every preset folder under `presetsRoot` (folders with a preset.json), sorted by id. */
export function listPresets(presetsRoot: string = defaultPresetsRoot()): LoadedPreset[] {
  if (!existsSync(presetsRoot)) return [];
  return readdirSync(presetsRoot, { withFileTypes: true })
    .filter(
      (entry) => entry.isDirectory() && existsSync(join(presetsRoot, entry.name, "preset.json")),
    )
    .map((entry) => loadPresetDir(join(presetsRoot, entry.name)))
    .sort((a, b) => a.preset.meta.id.localeCompare(b.preset.meta.id));
}

/** Load a single preset by id from `presetsRoot`. */
export function getPreset(id: string, presetsRoot: string = defaultPresetsRoot()): LoadedPreset {
  if (!ID_PATTERN.test(id)) {
    throw new PresetLoadError(`Invalid preset id "${id}" (expected kebab-case)`);
  }
  const dir = join(presetsRoot, id);
  if (!existsSync(join(dir, "preset.json"))) {
    const available = listPresets(presetsRoot).map((p) => p.preset.meta.id);
    throw new PresetLoadError(
      `Unknown preset "${id}". Available: ${available.length ? available.join(", ") : "(none)"}`,
    );
  }
  return loadPresetDir(dir);
}

/** Directory of the `@tastekit/presets` package (works from src and dist). */
export function defaultPresetsRoot(): string {
  const require = createRequire(import.meta.url);
  return dirname(require.resolve("@tastekit/presets/package.json"));
}
