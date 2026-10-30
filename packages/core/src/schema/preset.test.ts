import { describe, expect, it } from "vitest";
import { type PresetInput, PresetSchema } from "./preset.js";

const validPreset = {
  meta: {
    id: "editorial",
    name: "Editorial",
    description: "Serif headlines, generous whitespace, ink-on-paper palette.",
    tags: ["serif", "content"],
  },
  fonts: {
    display: { family: "Fraunces", fallback: ["Georgia", "serif"], weights: [400, 700] },
    body: { family: "Source Serif 4", fallback: ["Georgia", "serif"], weights: [400, 600] },
    mono: { family: "JetBrains Mono", fallback: ["monospace"], weights: [400] },
  },
  colors: {
    neutral: "#1c1917",
    accent: "oklch(0.62 0.19 35)",
    destructive: "#b91c1c",
  },
  scale: {
    type: { base: 17, ratio: 1.25 },
    spacing: { base: 4 },
  },
  radius: { sm: 2, md: 4, lg: 8 },
  shadow: { style: "subtle" },
  motion: {
    duration: { fast: 120, base: 200, slow: 320 },
    easing: "cubic-bezier(0.2, 0, 0, 1)",
  },
  rules: "rules.md",
} satisfies PresetInput;

function withPatch(patch: Record<string, unknown>): unknown {
  return { ...validPreset, ...patch };
}

describe("PresetSchema", () => {
  it("accepts a complete preset", () => {
    expect(PresetSchema.parse(validPreset)).toEqual({ ...validPreset, darkMode: true });
  });

  it("fills defaults for optional fields", () => {
    const { mono: _mono, ...fonts } = validPreset.fonts;
    const { tags: _tags, ...meta } = validPreset.meta;
    const { destructive: _d, ...colors } = validPreset.colors;
    const { rules: _r, ...rest } = validPreset;
    const parsed = PresetSchema.parse({ ...rest, meta, fonts, colors });
    expect(parsed.rules).toBe("rules.md");
    expect(parsed.darkMode).toBe(true);
    expect(parsed.meta.tags).toEqual([]);
    expect(parsed.fonts.mono).toBeUndefined();
    expect(parsed.colors.destructive).toBeUndefined();
  });

  it.each([
    ["non-kebab id", withPatch({ meta: { ...validPreset.meta, id: "Editorial Preset" } })],
    ["bad color seed", withPatch({ colors: { ...validPreset.colors, accent: "purple" } })],
    ["short hex", withPatch({ colors: { ...validPreset.colors, neutral: "#12" } })],
    [
      "oklch lightness > 1",
      withPatch({ colors: { ...validPreset.colors, accent: "oklch(1.5 0.1 30)" } }),
    ],
    [
      "type ratio too large",
      withPatch({ scale: { ...validPreset.scale, type: { base: 16, ratio: 3 } } }),
    ],
    [
      "spacing base not 4 or 8",
      withPatch({ scale: { ...validPreset.scale, spacing: { base: 5 } } }),
    ],
    [
      "font weight off-grid",
      withPatch({
        fonts: { ...validPreset.fonts, body: { ...validPreset.fonts.body, weights: [450] } },
      }),
    ],
    [
      "empty font family",
      withPatch({
        fonts: { ...validPreset.fonts, display: { ...validPreset.fonts.display, family: "" } },
      }),
    ],
    ["negative radius", withPatch({ radius: { sm: -1, md: 4, lg: 8 } })],
    ["radius out of order", withPatch({ radius: { sm: 8, md: 4, lg: 2 } })],
    ["unknown shadow style", withPatch({ shadow: { style: "glow" } })],
    [
      "motion durations out of order",
      withPatch({
        motion: { ...validPreset.motion, duration: { fast: 300, base: 200, slow: 100 } },
      }),
    ],
    ["rules not markdown", withPatch({ rules: "rules.txt" })],
    ["rules parent traversal", withPatch({ rules: "../x.md" })],
    ["rules nested traversal", withPatch({ rules: "a/../../b.md" })],
    ["rules absolute path", withPatch({ rules: "/abs.md" })],
    ["rules drive letter", withPatch({ rules: "C:/x.md" })],
    ["unknown top-level key", withPatch({ gradient: true })],
    [
      "missing fonts",
      (() => {
        const { fonts: _f, ...rest } = validPreset;
        return rest;
      })(),
    ],
  ])("rejects %s", (_label, input) => {
    expect(PresetSchema.safeParse(input).success).toBe(false);
  });

  it("accepts a nested rules path", () => {
    expect(PresetSchema.parse(withPatch({ rules: "docs/rules.md" })).rules).toBe("docs/rules.md");
  });

  it("reports the path of the invalid field", () => {
    const result = PresetSchema.safeParse(
      withPatch({ colors: { ...validPreset.colors, accent: "purple" } }),
    );
    expect(result.success).toBe(false);
    expect(result.error?.issues[0]?.path).toEqual(["colors", "accent"]);
  });
});
