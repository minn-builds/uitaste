import { writeFileSync } from "node:fs";
import type { Plugin } from "vite";
import { generateTokens, PresetSchema, toTailwindTheme } from "../../packages/core/src/index.ts";
import preset from "./src/fixture-preset.json";

/** Writes src/tokens.generated.css (Tailwind v4 @theme) from the active preset before Vite starts. */
export function tastekitTokens(): Plugin {
  return {
    name: "tastekit-tokens",
    buildStart() {
      const css = toTailwindTheme(generateTokens(PresetSchema.parse(preset)));
      writeFileSync(new URL("./src/tokens.generated.css", import.meta.url), css);
    },
  };
}
