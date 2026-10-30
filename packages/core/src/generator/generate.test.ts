import { describe, expect, it } from "vitest";
import { TokensSchema } from "../schema/tokens.js";
import { contrastRatio } from "./color.js";
import { editorial } from "./fixtures.js";
import { DEFAULT_DESTRUCTIVE_SEED, generateTokens, TokenOverridesSchema } from "./generate.js";

const ACCENTS = [
  "oklch(0.62 0.19 35)",
  "#facc15",
  "#00ff00",
  "#2563eb",
  "#fde2e4",
  "#111111",
  "oklch(0.58 0.1 280)",
];
const NEUTRALS = ["#000", "#fff", "#1c1917", "#f5f5f4", "#64748b", "oklch(0.5 0.03 250)"];

describe("generateTokens", () => {
  it("matches the snapshot for the editorial fixture", () => {
    expect(generateTokens(editorial)).toMatchSnapshot();
  });

  it("is deterministic", () => {
    expect(generateTokens(editorial)).toEqual(generateTokens(editorial));
  });

  it("produces output that passes TokensSchema", () => {
    expect(() => TokensSchema.parse(generateTokens(editorial))).not.toThrow();
  });

  it("fills generator defaults the preset leaves out", () => {
    const tokens = generateTokens(editorial);
    expect(tokens.font.mono).toContain("ui-monospace");
    expect(tokens.fontWeight.mono).toEqual([400]);
    expect(tokens.radius.full).toBe("9999px");
    expect(tokens.text.base.lineHeight).toBeGreaterThan(1);
    expect(tokens.shadow.sm).not.toBe("none");
    const withDefault = generateTokens({
      ...editorial,
      colors: { ...editorial.colors, destructive: DEFAULT_DESTRUCTIVE_SEED },
    });
    expect(tokens.color.ramps.destructive).toEqual(withDefault.color.ramps.destructive);
  });

  it("omits color.dark when darkMode is false", () => {
    const tokens = generateTokens({ ...editorial, darkMode: false });
    expect(tokens.color.dark).toBeUndefined();
    expect("dark" in tokens.color).toBe(false);
  });

  it("emits shadows per shadow.style", () => {
    expect(generateTokens({ ...editorial, shadow: { style: "none" } }).shadow.md).toBe("none");
    expect(generateTokens({ ...editorial, shadow: { style: "hard" } }).shadow.md).toMatch(/^4px/);
  });

  it("uses an 8pt grid when spacing.base is 8", () => {
    const tokens = generateTokens({
      ...editorial,
      scale: { ...editorial.scale, spacing: { base: 8 } },
    });
    expect(tokens.space["1"]).toBe("0.5rem");
  });

  it("rejects an invalid preset", () => {
    expect(() =>
      generateTokens({ ...editorial, colors: { ...editorial.colors, accent: "purple" } }),
    ).toThrow();
  });

  describe("WCAG AA contrast", () => {
    const cases = NEUTRALS.flatMap((neutral) =>
      ACCENTS.map((accent) => [neutral, accent] as const),
    );
    it.each(cases)("neutral %s / accent %s", (neutral, accent) => {
      const tokens = generateTokens({ ...editorial, colors: { neutral, accent } });
      for (const mode of [tokens.color.light, tokens.color.dark]) {
        if (!mode) throw new Error("dark mode missing");
        expect(contrastRatio(mode.fg, mode.bg)).toBeGreaterThanOrEqual(4.5);
        expect(contrastRatio(mode.accentFg, mode.accent)).toBeGreaterThanOrEqual(4.5);
        expect(contrastRatio(mode.destructiveFg, mode.destructive)).toBeGreaterThanOrEqual(4.5);
        expect(contrastRatio(mode.mutedFg, mode.bg)).toBeGreaterThanOrEqual(4.5);
        expect(contrastRatio(mode.mutedFg, mode.muted)).toBeGreaterThanOrEqual(4.5);
      }
    });
  });

  describe("overrides", () => {
    it("replaces the accent seed", () => {
      const tokens = generateTokens(editorial, { accent: "#2563eb" });
      expect(tokens.color.ramps.accent).toEqual(
        generateTokens({ ...editorial, colors: { ...editorial.colors, accent: "#2563eb" } }).color
          .ramps.accent,
      );
    });

    it("accepts a bare display family and keeps the preset fallbacks", () => {
      const tokens = generateTokens(editorial, { fonts: { display: "Instrument Serif" } });
      expect(tokens.font.display).toBe('"Instrument Serif", Georgia, serif');
      expect(tokens.fontWeight.display).toEqual([400, 700]);
    });

    it("accepts a full font spec", () => {
      const tokens = generateTokens(editorial, {
        fonts: { body: { family: "Inter", fallback: ["sans-serif"], weights: [400, 500] } },
      });
      expect(tokens.font.body).toBe('"Inter", sans-serif');
      expect(tokens.fontWeight.body).toEqual([400, 500]);
    });

    it.each([
      ["bad accent", { accent: "purple" }],
      ["unknown key", { radius: 4 }],
      ["empty family", { fonts: { display: "" } }],
    ])("rejects %s", (_label, input) => {
      expect(TokenOverridesSchema.safeParse(input).success).toBe(false);
      expect(() => generateTokens(editorial, input as never)).toThrow();
    });
  });
});
