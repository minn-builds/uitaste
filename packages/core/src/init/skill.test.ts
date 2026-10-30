import { join } from "node:path";
import { describe, expect, it } from "vitest";
import { recommendedRules } from "../lint/rules/index.js";
import { PRESET_RULES_FILE, readSkillBundle } from "./init.js";

const skillRoot = join(import.meta.dirname, "..", "..", "..", "skill");
const { skillMd, files } = readSkillBundle(skillRoot);
const file = (path: string) => files.find((f) => f.path === path)?.content ?? "";

describe("shipped skill", () => {
  it("has valid frontmatter and stays under 300 lines", () => {
    expect(skillMd).toMatch(/^---\n\n?name: tastekit\ndescription: .+\n---\n/);
    expect(skillMd?.split("\n").length).toBeLessThan(300);
  });

  it("every reference file it mentions is shipped or written by init", () => {
    const mentioned = [...new Set(skillMd?.match(/reference\/[a-z-]+\.md/g) ?? [])];
    expect(mentioned.length).toBeGreaterThan(0);
    const shipped = new Set([...files.map((f) => f.path), PRESET_RULES_FILE]);
    for (const m of mentioned) expect(shipped, m).toContain(m);
  });

  it("lint-rules.md documents every recommended rule with its severity group", () => {
    const doc = file("reference/lint-rules.md");
    const [errors = "", warnings = ""] = doc.split("## Warnings");
    for (const rule of recommendedRules) {
      const section = rule.severity === "error" ? errors : warnings;
      expect(section, rule.id).toContain(`### \`${rule.id}\``);
    }
  });

  it("teaches the lint and shoot commands the CLI actually has", () => {
    expect(skillMd).toContain("npx tastekit lint --json");
    expect(skillMd).toContain("npx tastekit shoot --url");
    expect(skillMd).toContain("--- for the agent ---");
  });
});
