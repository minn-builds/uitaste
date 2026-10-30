import type { LintFile, Rule, SourceRange } from "../types.js";
import { declValue, isGeneratedTokensFile } from "./util.js";

/** Distinct non-full radius values allowed across a run. */
export const MAX_RADIUS_VARIANTS = 3;

const RADIUS_CLASS = /^rounded(?:-(?:[trblsexy]|tl|tr|br|bl|ss|se|ee|es))?(?:-(.+))?$/;
const RADIUS_PROP = /^border(?:-(?:top|bottom|start|end)-(?:left|right|start|end))?-radius$/;

function normalize(raw: string): string | null {
  const v = raw.trim().toLowerCase();
  const tokenRef = /^var\(--(?:tk-)?radius-([a-z0-9]+)\)$/.exec(v)?.[1];
  const key = tokenRef ?? v.replace(/^\[|\]$/g, "").replace(/^\((--[^)]+)\)$/, "var($1)");
  if (key === "full" || /^(9{3,}px|50%|calc\(infinity.*)$/.test(key)) return "full";
  if (key === "none" || /^0(px|rem|em)?$/.test(key) || /^(inherit|initial|unset)$/.test(key))
    return null;
  return key === "" ? "default" : key;
}

interface Use {
  key: string;
  file: string;
  loc: SourceRange;
}

function collect(file: LintFile): Use[] {
  const uses: Use[] = [];
  if (isGeneratedTokensFile(file.path)) return uses;
  for (const usage of file.classNames) {
    for (const cls of usage.classes) {
      const m = RADIUS_CLASS.exec(cls.utility);
      if (!m) continue;
      const key = normalize(m[1] ?? "");
      if (key !== null) uses.push({ key, file: file.path, loc: cls.loc });
    }
  }
  for (const decl of file.declarations) {
    if (!RADIUS_PROP.test(decl.property) || decl.value === null) continue;
    const key = normalize(declValue(decl));
    if (key !== null) uses.push({ key, file: file.path, loc: decl.valueLoc });
  }
  return uses;
}

/**
 * Cross-file: counts distinct radius values (Tailwind `rounded-*` and CSS `border-radius`,
 * `full`, `none` and 0 excluded). Reports once, on the first file of the run.
 */
export const maxRadiusVariants: Rule = {
  id: "max-radius-variants",
  severity: "error",
  description: `More than ${MAX_RADIUS_VARIANTS} distinct border radii (plus full) breaks visual consistency.`,
  check(file, ctx) {
    if (ctx.files[0] !== file) return [];
    const uses = ctx.files.flatMap(collect);
    const keys = [...new Set(uses.map((u) => u.key))].filter((k) => k !== "full");
    if (keys.length <= MAX_RADIUS_VARIANTS) return [];
    const first = uses.find((u) => u.key === keys[MAX_RADIUS_VARIANTS]);
    const where = first && first.file !== file.path ? ` (first extra one in ${first.file})` : "";
    return [
      {
        message: `${keys.length} distinct radius values in use (${keys.join(", ")}); the limit is ${MAX_RADIUS_VARIANTS} plus \`full\`${where}.`,
        loc:
          first && first.file === file.path
            ? first.loc
            : {
                start: { line: 1, column: 1, offset: 0 },
                end: { line: 1, column: 1, offset: 0 },
              },
        suggestion:
          "Pick one radius per role from the tokens (`rounded-sm`, `rounded-md`, `rounded-lg`) and use `rounded-full` for pills.",
      },
    ];
  },
};
