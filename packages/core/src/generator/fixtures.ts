import type { PresetInput } from "../schema/preset.js";

/** Shared preset fixture for generator tests. */
export const editorial = {
  meta: { id: "editorial", name: "Editorial", description: "Ink on paper." },
  fonts: {
    display: { family: "Fraunces", fallback: ["Georgia", "serif"], weights: [400, 700] },
    body: { family: "Source Serif 4", fallback: ["Georgia", "serif"], weights: [400, 600] },
  },
  colors: { neutral: "#1c1917", accent: "oklch(0.62 0.19 35)" },
  scale: { type: { base: 17, ratio: 1.25 }, spacing: { base: 4 } },
  radius: { sm: 2, md: 4, lg: 8 },
  shadow: { style: "subtle" },
  motion: { duration: { fast: 120, base: 200, slow: 320 }, easing: "cubic-bezier(0.2, 0, 0, 1)" },
} satisfies PresetInput;
