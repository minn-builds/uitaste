import { displayable } from "culori";
import { describe, expect, it } from "vitest";
import { RAMP_STEPS } from "../schema/tokens.js";
import {
  BLACK,
  buildRamp,
  contrastRatio,
  firstLegible,
  formatOklch,
  formatRamp,
  parseOklch,
  pickForeground,
  toSrgbGamut,
  WHITE,
} from "./color.js";

const SEEDS = [
  "#1c1917",
  "oklch(0.62 0.19 35)",
  "#facc15",
  "#00ff00",
  "oklch(0.7 0.4 150)",
  "#000",
];

describe("parseOklch", () => {
  it("parses hex and oklch seeds", () => {
    expect(parseOklch("#ffffff").l).toBeCloseTo(1, 5);
    expect(parseOklch("oklch(0.62 0.19 35)")).toEqual({ mode: "oklch", l: 0.62, c: 0.19, h: 35 });
  });
  it("gives achromatic colors hue 0", () => {
    expect(parseOklch("#000").h).toBe(0);
  });
  it("throws on garbage", () => {
    expect(() => parseOklch("not-a-color")).toThrow(/Unparseable/);
  });
});

describe("toSrgbGamut", () => {
  it("reduces chroma of out-of-gamut colors and keeps lightness and hue", () => {
    const mapped = toSrgbGamut({ mode: "oklch", l: 0.7, c: 0.4, h: 150 });
    expect(mapped.c).toBeLessThan(0.4);
    expect(mapped.l).toBe(0.7);
    expect(mapped.h).toBe(150);
    expect(displayable(mapped)).toBe(true);
  });
  it("leaves in-gamut colors intact (up to rounding)", () => {
    expect(toSrgbGamut({ mode: "oklch", l: 0.5, c: 0.05, h: 200 })).toEqual({
      mode: "oklch",
      l: 0.5,
      c: 0.05,
      h: 200,
    });
  });
});

describe("formatOklch", () => {
  it("formats as CSS", () => {
    expect(formatOklch({ mode: "oklch", l: 0.5, c: 0.1, h: 20 })).toBe("oklch(0.5 0.1 20)");
  });
});

describe("buildRamp", () => {
  it.each(SEEDS)("builds 11 displayable steps with decreasing lightness for %s", (seed) => {
    const ramp = buildRamp(seed);
    const lightness = RAMP_STEPS.map((step) => ramp.colors[step].l);
    expect(lightness).toHaveLength(11);
    for (let i = 1; i < lightness.length; i++) {
      expect(lightness[i]).toBeLessThan(lightness[i - 1] ?? 0);
    }
    for (const step of RAMP_STEPS) expect(displayable(ramp.colors[step])).toBe(true);
  });

  it("anchors the seed at the step closest in lightness", () => {
    const ramp = buildRamp("oklch(0.62 0.19 35)");
    expect(ramp.anchor).toBe("500");
    expect(ramp.colors["500"]).toEqual({ mode: "oklch", l: 0.62, c: 0.19, h: 35 });
  });

  it("keeps the seed hue across the ramp", () => {
    const ramp = buildRamp("oklch(0.62 0.19 35)");
    for (const step of RAMP_STEPS) expect(ramp.colors[step].h).toBe(35);
  });

  it("formats every step as an oklch() string", () => {
    const formatted = formatRamp(buildRamp("#facc15"));
    expect(Object.keys(formatted)).toEqual([...RAMP_STEPS]);
    for (const value of Object.values(formatted)) expect(value).toMatch(/^oklch\([^()]+\)$/);
  });
});

describe("contrastRatio", () => {
  it("is 21 for black on white", () => {
    expect(contrastRatio(WHITE, BLACK)).toBeCloseTo(21, 5);
    expect(contrastRatio("#fff", "#fff")).toBeCloseTo(1, 5);
  });
});

describe("pickForeground", () => {
  it("picks the higher-contrast candidate when it passes AA", () => {
    const light = parseOklch("#fafafa");
    const dark = parseOklch("#111");
    expect(pickForeground(parseOklch("#1d4ed8"), [light, dark])).toBe(light);
  });
  it("falls back to pure white/black when no candidate passes", () => {
    const grey = parseOklch("#777");
    const fg = pickForeground(parseOklch("#767676"), [grey]);
    expect([WHITE, BLACK]).toContain(fg);
    expect(contrastRatio(fg, parseOklch("#767676"))).toBeGreaterThanOrEqual(4.5);
  });
});

describe("firstLegible", () => {
  const bg = WHITE;
  const soft = parseOklch("#bbb");
  const strong = parseOklch("#555");
  it("returns the first candidate that clears AA on all backgrounds", () => {
    expect(firstLegible([bg], [soft, strong])).toBe(strong);
  });
  it("returns the last candidate when none passes", () => {
    expect(firstLegible([bg], [soft, soft])).toBe(soft);
  });
  it("throws without candidates", () => {
    expect(() => firstLegible([bg], [])).toThrow();
  });
});
