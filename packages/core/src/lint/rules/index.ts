import type { Rule } from "../types.js";
import { noDefaultFont } from "./no-default-font.js";
import { noEmojiIcons } from "./no-emoji-icons.js";
import { noGradientTextHero } from "./no-gradient-text-hero.js";
import { noPurpleGradient } from "./no-purple-gradient.js";
import { noShadowEverywhere } from "./no-shadow-everywhere.js";
import { noUniformCardGrid } from "./no-uniform-card-grid.js";

export {
  noDefaultFont,
  noEmojiIcons,
  noGradientTextHero,
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

/** The rule set `tastekit lint` runs by default. Grows as later rule families land. */
export const recommendedRules: readonly Rule[] = [...aiTellRules];
