import type { ElementNode, Finding, Rule } from "../types.js";
import { declValue } from "./util.js";

const EMOJI = /\p{Emoji_Presentation}|\p{Extended_Pictographic}️/u;

function inCode(el: ElementNode | null): boolean {
  for (let cur = el; cur; cur = cur.parent)
    if (cur.tag === "code" || cur.tag === "pre") return true;
  return false;
}

export const noEmojiIcons: Rule = {
  id: "no-emoji-icons",
  severity: "warn",
  description: "Emoji used as icons or decoration in UI text.",
  check(file) {
    const findings: Finding[] = [];
    const hint =
      "Use an icon set (lucide, Phosphor, inline SVG) or drop the decoration. Emoji render differently per OS and read as AI-generated.";
    for (const text of file.texts) {
      if (inCode(text.parent)) continue;
      const match = EMOJI.exec(text.value);
      if (match) {
        findings.push({
          message: `Emoji "${match[0]}" used in text; emoji are not icons.`,
          loc: text.loc,
          suggestion: hint,
        });
      }
    }
    for (const decl of file.declarations) {
      if (decl.property !== "content") continue;
      const match = EMOJI.exec(declValue(decl));
      if (match) {
        findings.push({
          message: `Emoji "${match[0]}" used as generated content; emoji are not icons.`,
          loc: decl.valueLoc,
          suggestion: hint,
        });
      }
    }
    return findings;
  },
};
