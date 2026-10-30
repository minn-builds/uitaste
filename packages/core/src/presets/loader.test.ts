import { existsSync, mkdirSync, mkdtempSync, rmSync, writeFileSync } from "node:fs";
import { tmpdir } from "node:os";
import { join } from "node:path";
import { afterEach, beforeEach, describe, expect, it } from "vitest";
import {
  defaultPresetsRoot,
  getPreset,
  listPresets,
  loadPresetDir,
  PresetLoadError,
} from "./loader.js";

const valid = (id: string, extra: Record<string, unknown> = {}) => ({
  meta: { id, name: id, description: "d", tags: [] },
  fonts: {
    display: { family: "A", fallback: ["serif"], weights: [400] },
    body: { family: "B", fallback: ["sans-serif"], weights: [400] },
  },
  colors: { neutral: "#1c1917", accent: "oklch(0.62 0.19 35)" },
  scale: { type: { base: 16, ratio: 1.25 }, spacing: { base: 4 } },
  radius: { sm: 2, md: 4, lg: 8 },
  shadow: { style: "soft" },
  motion: { duration: { fast: 100, base: 200, slow: 300 }, easing: "ease-out" },
  ...extra,
});

let root: string;
beforeEach(() => {
  root = mkdtempSync(join(tmpdir(), "uitaste-presets-"));
});
afterEach(() => rmSync(root, { recursive: true, force: true }));

function write(
  folder: string,
  preset: unknown,
  rules: string | null = "# Rules",
  file = "rules.md",
) {
  mkdirSync(join(root, folder), { recursive: true });
  writeFileSync(join(root, folder, "preset.json"), JSON.stringify(preset));
  if (rules !== null) writeFileSync(join(root, folder, file), rules);
}

describe("presets loader", () => {
  it("loads a preset with its rules", () => {
    write("brutal", valid("brutal"));
    const loaded = loadPresetDir(join(root, "brutal"));
    expect(loaded.preset.meta.id).toBe("brutal");
    expect(loaded.rules).toBe("# Rules");
  });

  it("lists presets sorted by id, ignoring non-preset folders", () => {
    write("zen", valid("zen"));
    write("alpha", valid("alpha"));
    mkdirSync(join(root, "not-a-preset"));
    expect(listPresets(root).map((p) => p.preset.meta.id)).toEqual(["alpha", "zen"]);
  });

  it("returns an empty list when the root is missing", () => {
    expect(listPresets(join(root, "nope"))).toEqual([]);
  });

  it("getPreset finds by id and errors on unknown id", () => {
    write("zen", valid("zen"));
    expect(getPreset("zen", root).preset.meta.id).toBe("zen");
    expect(() => getPreset("nope", root)).toThrow(/Unknown preset "nope".*zen/);
  });

  it("rejects ids that could traverse", () => {
    expect(() => getPreset("../x", root)).toThrow(PresetLoadError);
  });

  it("gives a readable zod error with the file path", () => {
    write("bad", valid("bad", { radius: { sm: 10, md: 4, lg: 8 } }));
    try {
      loadPresetDir(join(root, "bad"));
      expect.unreachable();
    } catch (e) {
      expect(e).toBeInstanceOf(PresetLoadError);
      const msg = (e as Error).message;
      expect(msg).toContain(join(root, "bad", "preset.json"));
      expect(msg).toContain("radius");
    }
  });

  it("reports invalid JSON", () => {
    mkdirSync(join(root, "j"));
    writeFileSync(join(root, "j", "preset.json"), "{nope");
    expect(() => loadPresetDir(join(root, "j"))).toThrow(/not valid JSON/);
  });

  it("requires folder name to equal meta.id", () => {
    write("folder", valid("other"));
    expect(() => loadPresetDir(join(root, "folder"))).toThrow(/must equal meta\.id/);
  });

  it("errors when the rules file is missing", () => {
    write("norules", valid("norules"), null);
    expect(() => loadPresetDir(join(root, "norules"))).toThrow(/rules\.md/);
  });

  it("supports a custom rules path inside the folder", () => {
    write("custom", valid("custom", { rules: "docs/r.md" }), null);
    mkdirSync(join(root, "custom", "docs"));
    writeFileSync(join(root, "custom", "docs", "r.md"), "custom rules");
    expect(loadPresetDir(join(root, "custom")).rules).toBe("custom rules");
  });

  it("rejects a rules path escaping the folder", () => {
    write("esc", valid("esc", { rules: "../x.md" }), null);
    expect(() => loadPresetDir(join(root, "esc"))).toThrow(/rules must/);
  });

  it("rejects a rules path that is a directory", () => {
    write("dir", valid("dir", { rules: "r.md" }), null);
    mkdirSync(join(root, "dir", "r.md"));
    expect(() => loadPresetDir(join(root, "dir"))).toThrow(/not a file/);
  });

  it("listPresets fails fast naming the bad preset file", () => {
    write("good", valid("good"));
    write("bad", valid("bad", { radius: { sm: 10, md: 4, lg: 8 } }));
    expect(() => listPresets(root)).toThrow(join(root, "bad", "preset.json"));
  });

  it("listPresets names the preset whose rules file is missing", () => {
    write("good", valid("good"));
    write("norules", valid("norules"), null);
    expect(() => listPresets(root)).toThrow(join(root, "norules", "preset.json"));
  });

  it("defaultPresetsRoot resolves the presets package and lists from it", () => {
    const dir = defaultPresetsRoot();
    expect(existsSync(join(dir, "package.json"))).toBe(true);
    expect(Array.isArray(listPresets())).toBe(true);
  });
});
