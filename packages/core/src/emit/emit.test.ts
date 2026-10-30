import { describe, expect, it } from "vitest";
import { editorial } from "../generator/fixtures.js";
import { generateTokens } from "../generator/generate.js";
import { toCssVars, toJson, toTailwindTheme } from "./emit.js";

const tokens = generateTokens(editorial);

describe("emitters", () => {
  it("toCssVars snapshot", () => expect(toCssVars(tokens)).toMatchSnapshot());
  it("toTailwindTheme snapshot", () => expect(toTailwindTheme(tokens)).toMatchSnapshot());
  it("toJson round-trips", () => expect(JSON.parse(toJson(tokens))).toEqual(tokens));
  it("emits dark overrides under .dark and media query", () => {
    const css = toCssVars(tokens);
    if (tokens.color.dark) {
      expect(css).toContain(".dark {");
      expect(css).toContain("prefers-color-scheme: dark");
    }
  });
  it("tailwind theme maps semantic colors inline", () => {
    const css = toTailwindTheme(tokens);
    expect(css).toContain("@theme inline {");
    expect(css).toContain("--color-bg: var(--tk-color-bg);");
    expect(css).toContain("--text-base--line-height:");
    expect(css).toContain("--tk-duration-fast:");
    expect(css).toContain("--default-transition-duration:");
    expect(css).not.toContain("--duration-");
    expect(css).toContain("@custom-variant dark");
  });
  it("is deterministic", () =>
    expect(toCssVars(tokens)).toBe(toCssVars(generateTokens(editorial))));
});
