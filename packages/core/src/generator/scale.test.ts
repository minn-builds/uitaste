import { describe, expect, it } from "vitest";
import { TYPE_STEPS } from "../schema/tokens.js";
import { DEFAULT_MONO, fontStack, shadows, spacingScale, typeScale } from "./scale.js";

describe("typeScale", () => {
  it("builds a modular scale around the base size", () => {
    const text = typeScale({ base: 16, ratio: 1.25 });
    expect(Object.keys(text)).toEqual([...TYPE_STEPS]);
    expect(text.base.size).toBe("1rem");
    expect(text.lg.size).toBe("1.25rem");
    expect(text.sm.size).toBe("0.8rem");
  });
  it("tightens line height as size grows", () => {
    const text = typeScale({ base: 16, ratio: 1.25 });
    expect(text["5xl"].lineHeight).toBeLessThan(text.base.lineHeight);
  });
});

describe("spacingScale", () => {
  it("uses a 4pt grid", () => {
    const space = spacingScale(4);
    expect(space["0"]).toBe("0px");
    expect(space["1"]).toBe("0.25rem");
    expect(space["4"]).toBe("1rem");
    expect(space["1.5"]).toBe("0.375rem");
  });
  it("uses an 8pt grid", () => {
    const space = spacingScale(8);
    expect(space["1"]).toBe("0.5rem");
    expect(space["4"]).toBe("2rem");
  });
});

describe("fontStack", () => {
  it("quotes the family and only fallbacks that need it", () => {
    expect(fontStack({ family: "Fraunces", fallback: ["Georgia", "serif"], weights: [400] })).toBe(
      '"Fraunces", Georgia, serif',
    );
    expect(fontStack(DEFAULT_MONO)).toBe(
      'ui-monospace, SFMono-Regular, Menlo, Consolas, "Liberation Mono", monospace',
    );
  });
  it("escapes quotes in names", () => {
    expect(fontStack({ family: 'A"B', fallback: ["serif"], weights: [400] })).toBe(
      '"A\\"B", serif',
    );
  });
});

describe("shadows", () => {
  const tint = { mode: "oklch", l: 0.2, c: 0.01, h: 50 } as const;
  it("returns none for style none", () => {
    expect(shadows("none", tint)).toEqual({ sm: "none", md: "none", lg: "none" });
  });
  it.each(["subtle", "soft", "hard"] as const)("tints %s shadows with the given color", (style) => {
    const result = shadows(style, tint);
    for (const value of Object.values(result)) expect(value).toContain("oklch(0.2 0.01 50 /");
  });
  it("uses zero-blur offsets for hard shadows", () => {
    expect(shadows("hard", tint).md).toMatch(/^4px 4px 0 /);
  });
});
