import { readFileSync } from "node:fs";
import { join } from "node:path";
import { fileURLToPath } from "node:url";
import { describe, expect, it } from "vitest";
import { editorial } from "../../generator/fixtures.js";
import { generateTokens } from "../../generator/generate.js";
import type { Tokens } from "../../schema/tokens.js";
import { lintSources } from "../engine.js";
import { aiTellRules, recommendedRules } from "./index.js";

const dir = join(fileURLToPath(new URL(".", import.meta.url)), "..", "__fixtures__", "rules");

function run(ruleId: string, name: string, tokens?: Tokens) {
  const rule = aiTellRules.find((r) => r.id === ruleId);
  if (!rule) throw new Error(`no rule ${ruleId}`);
  const source = readFileSync(join(dir, name), "utf8");
  const report = lintSources([{ path: name, source }], {
    rules: [rule],
    ...(tokens ? { tokens } : {}),
  });
  return report.files[0]?.findings ?? [];
}

const cases: { rule: string; ext: string; failCount: number }[] = [
  { rule: "no-default-font", ext: "css", failCount: 2 },
  { rule: "no-default-font", ext: "tsx", failCount: 2 },
  { rule: "no-purple-gradient", ext: "tsx", failCount: 3 },
  { rule: "no-purple-gradient", ext: "css", failCount: 2 },
  { rule: "no-gradient-text-hero", ext: "tsx", failCount: 2 },
  { rule: "no-gradient-text-hero", ext: "css", failCount: 1 },
  { rule: "no-uniform-card-grid", ext: "tsx", failCount: 2 },
  { rule: "no-emoji-icons", ext: "tsx", failCount: 2 },
  { rule: "no-shadow-everywhere", ext: "tsx", failCount: 1 },
  { rule: "no-shadow-everywhere", ext: "css", failCount: 1 },
];

describe("AI-tell rules", () => {
  for (const { rule, ext, failCount } of cases) {
    it(`${rule} (${ext}): fail fixture is flagged, pass fixture is clean`, () => {
      const fail = run(rule, `${rule}.fail.${ext}`);
      expect(fail).toHaveLength(failCount);
      for (const f of fail) {
        expect(f.ruleId).toBe(rule);
        expect(f.suggestion).toBeTruthy();
      }
      expect(run(rule, `${rule}.pass.${ext}`)).toEqual([]);
    });
  }

  it("no-default-font maps font-display through the active tokens", () => {
    const base = generateTokens(editorial);
    const inter: Tokens = { ...base, font: { ...base.font, display: '"Inter", sans-serif' } };
    const src = [
      { path: "a.tsx", source: 'export const A = () => <p className="font-display">x</p>;' },
    ];
    const rule = aiTellRules.filter((r) => r.id === "no-default-font");
    expect(lintSources(src, { rules: rule, tokens: inter }).summary.warnings).toBe(1);
    expect(lintSources(src, { rules: rule, tokens: base }).summary.warnings).toBe(0);
    expect(lintSources(src, { rules: rule }).summary.warnings).toBe(0);
  });

  it("ships unique ids and a recommended set containing every AI-tell rule", () => {
    expect(new Set(aiTellRules.map((r) => r.id)).size).toBe(6);
    for (const r of aiTellRules) expect(recommendedRules).toContain(r);
  });
});
