import { describe, expect, it } from "vitest";
import { scope } from "./uitaste-tokens-plugin.ts";

const css = `:root {
  --tk-color-bg: oklch(0.97 0 0);
}

.dark {
  --tk-color-bg: oklch(0.2 0 0);
}

@media (prefers-color-scheme: dark) {
  :root:not(.light) {
    --tk-color-bg: oklch(0.2 0 0);
  }
}
`;

describe("scope", () => {
  const out = scope(css, "editorial");
  const root = ':root[data-preset="editorial"]';

  it("scopes the indented dark block inside the media query", () => {
    expect(out).toContain(`  ${root}:not(.light) {`);
    expect(out).not.toMatch(/^\s*:root:not\(\.light\)/m);
  });

  it("scopes the light and .dark blocks", () => {
    expect(out).toContain(`${root} {`);
    expect(out).toContain(`${root}.dark {`);
    expect(out).not.toMatch(/^\s*:root \{/m);
  });
});
