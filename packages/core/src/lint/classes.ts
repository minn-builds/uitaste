import type { LineIndex } from "./location.js";
import type { ClassToken } from "./types.js";

/** Splits `md:hover:bg-[url(a:b)]` at top-level colons (ignores colons inside `[]` and `()`). */
function splitVariants(token: string): string[] {
  const parts: string[] = [];
  let depth = 0;
  let current = "";
  for (const ch of token) {
    if (ch === "[" || ch === "(") depth++;
    else if ((ch === "]" || ch === ")") && depth > 0) depth--;
    if (ch === ":" && depth === 0) {
      parts.push(current);
      current = "";
    } else {
      current += ch;
    }
  }
  parts.push(current);
  return parts;
}

/** Parses one class token into variants, utility and the important flag. Location is left to the caller. */
export function parseClassToken(value: string): Omit<ClassToken, "loc"> {
  const parts = splitVariants(value);
  let utility = parts.pop() ?? "";
  let important = false;
  if (utility.startsWith("!")) {
    important = true;
    utility = utility.slice(1);
  } else if (utility.endsWith("!") && utility.length > 1) {
    important = true;
    utility = utility.slice(0, -1);
  }
  return { value, variants: parts, utility, important };
}

/**
 * Splits a static class string into tokens with source ranges.
 * `startOffset` is the offset of the first character of `value` in the file.
 */
export function splitClasses(value: string, startOffset: number, lines: LineIndex): ClassToken[] {
  const tokens: ClassToken[] = [];
  const re = /\S+/g;
  for (let m = re.exec(value); m !== null; m = re.exec(value)) {
    const start = startOffset + m.index;
    tokens.push({ ...parseClassToken(m[0]), loc: lines.range(start, start + m[0].length) });
  }
  return tokens;
}

/**
 * Like {@link splitClasses}, but for strings whose source text (`raw`, e.g. with escapes or HTML
 * entities) differs from the decoded `value`. Token locations are exact when `raw === value`;
 * otherwise every token gets the range of the whole raw string, since per-token mapping is unreliable.
 */
export function classTokensAt(
  value: string,
  raw: string,
  startOffset: number,
  lines: LineIndex,
): ClassToken[] {
  if (value === raw) return splitClasses(value, startOffset, lines);
  const whole = lines.range(startOffset, startOffset + raw.length);
  return splitClasses(value, startOffset, lines).map((t) => ({ ...t, loc: whole }));
}
