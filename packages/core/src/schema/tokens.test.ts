import { describe, expect, it } from "vitest";
import { RAMP_STEPS, SEMANTIC_ROLES, TokensSchema, TYPE_STEPS } from "./tokens.js";

const ramp = Object.fromEntries(
  RAMP_STEPS.map((step, i) => [step, `oklch(${(0.98 - i * 0.08).toFixed(2)} 0.02 60)`]),
);
const roles = Object.fromEntries(SEMANTIC_ROLES.map((role) => [role, "oklch(0.5 0.1 60)"]));

const validTokens = {
  meta: { presetId: "editorial", presetName: "Editorial" },
  font: {
    display: '"Fraunces", Georgia, serif',
    body: '"Source Serif 4", Georgia, serif',
    mono: '"JetBrains Mono", monospace',
  },
  fontWeight: { display: [400, 700], body: [400, 600], mono: [400] },
  text: Object.fromEntries(
    TYPE_STEPS.map((step, i) => [
      step,
      { size: `${(0.75 + i * 0.25).toFixed(3)}rem`, lineHeight: 1.4 },
    ]),
  ),
  space: { "0": "0px", "1": "0.25rem", "2": "0.5rem", "4": "1rem", "8": "2rem" },
  color: {
    ramps: { neutral: ramp, accent: ramp, destructive: ramp },
    light: roles,
    dark: roles,
  },
  radius: { sm: "2px", md: "4px", lg: "8px", full: "9999px" },
  shadow: { sm: "0 1px 2px oklch(0 0 0 / 0.08)", md: "0 2px 6px oklch(0 0 0 / 0.1)", lg: "none" },
  motion: {
    duration: { fast: "120ms", base: "200ms", slow: "320ms" },
    easing: "cubic-bezier(0.2, 0, 0, 1)",
  },
};

describe("TokensSchema", () => {
  it("accepts resolved tokens", () => {
    expect(TokensSchema.parse(validTokens)).toEqual(validTokens);
  });

  it("accepts tokens without a dark palette", () => {
    const { dark: _dark, ...color } = validTokens.color;
    expect(TokensSchema.safeParse({ ...validTokens, color }).success).toBe(true);
  });

  it("exposes 11 ramp steps and the required semantic roles", () => {
    expect(RAMP_STEPS).toHaveLength(11);
    expect(SEMANTIC_ROLES).toEqual(
      expect.arrayContaining([
        "bg",
        "fg",
        "muted",
        "accent",
        "accentFg",
        "border",
        "ring",
        "destructive",
      ]),
    );
  });

  it.each([
    [
      "ramp missing a step",
      {
        ...validTokens,
        color: {
          ...validTokens.color,
          ramps: { ...validTokens.color.ramps, accent: { ...ramp, "950": undefined } },
        },
      },
    ],
    [
      "non-oklch ramp value",
      {
        ...validTokens,
        color: {
          ...validTokens.color,
          ramps: { ...validTokens.color.ramps, neutral: { ...ramp, "500": "#777777" } },
        },
      },
    ],
    [
      "missing semantic role",
      { ...validTokens, color: { ...validTokens.color, light: { ...roles, ring: undefined } } },
    ],
    [
      "unitless font size",
      { ...validTokens, text: { ...validTokens.text, base: { size: "16", lineHeight: 1.5 } } },
    ],
    ["missing type step", { ...validTokens, text: { ...validTokens.text, "5xl": undefined } }],
    ["bad space key", { ...validTokens, space: { ...validTokens.space, huge: "10rem" } }],
    [
      "duration without unit",
      {
        ...validTokens,
        motion: { ...validTokens.motion, duration: { fast: "120", base: "200ms", slow: "320ms" } },
      },
    ],
    ["unknown key", { ...validTokens, gradient: "linear-gradient(red, blue)" }],
  ])("rejects %s", (_label, input) => {
    expect(TokensSchema.safeParse(input).success).toBe(false);
  });
});
