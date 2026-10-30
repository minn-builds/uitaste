import type { Rule } from "../types.js";
import { fontFromTokens } from "./font-from-tokens.js";
import { maxRadiusVariants } from "./max-radius-variants.js";
import { noArbitraryValues } from "./no-arbitrary-values.js";
import { noDefaultFont } from "./no-default-font.js";
import { noEmojiIcons } from "./no-emoji-icons.js";
import { noGradientTextHero } from "./no-gradient-text-hero.js";
import { noHardcodedColor } from "./no-hardcoded-color.js";
import { noPurpleGradient } from "./no-purple-gradient.js";
import { noShadowEverywhere } from "./no-shadow-everywhere.js";
import { noUniformCardGrid } from "./no-uniform-card-grid.js";

export {
  fontFromTokens,
  maxRadiusVariants,
  noArbitraryValues,
  noDefaultFont,
  noEmojiIcons,
  noGradientTextHero,
  noHardcodedColor,
  noPurpleGradient,
  noShadowEverywhere,
  noUniformCardGrid,
};

/** Rules that flag patterns coding agents produce by default. */
export const aiTellRules: readonly Rule[] = [
  noDefaultFont,
  noPurpleGradient,
  noGradientTextHero,
  noUniformCardGrid,
  noEmojiIcons,
  noShadowEverywhere,
];

/** Rules that keep styling on the preset's tokens. */
export const tokenRules: readonly Rule[] = [
  noHardcodedColor,
  noArbitraryValues,
  maxRadiusVariants,
  fontFromTokens,
];

/** The rule set `tastekit lint` runs by default. Grows as later rule families land. */
export const recommendedRules: readonly Rule[] = [...aiTellRules, ...tokenRules];
