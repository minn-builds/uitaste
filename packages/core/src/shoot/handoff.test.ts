import { existsSync, readFileSync } from "node:fs";
import { join } from "node:path";
import { describe, expect, it } from "vitest";
import { agentHandoff, rubricPath } from "./handoff.js";

const repo = join(import.meta.dirname, "..", "..", "..", "..");

describe("rubric handoff", () => {
  it("rubricPath points at reference/rubric.md under the skill root", () => {
    expect(rubricPath("/x/skill")).toBe(join("/x/skill", "reference", "rubric.md"));
  });
  it("shipped rubric is in sync with docs/design-rubric.md", () => {
    const shipped = join(repo, "packages", "skill", "reference", "rubric.md");
    expect(existsSync(shipped)).toBe(true);
    expect(readFileSync(shipped, "utf8")).toBe(
      readFileSync(join(repo, "docs", "design-rubric.md"), "utf8"),
    );
  });
  it("agentHandoff names manifest, rubric and the instruction", () => {
    const s = agentHandoff("/o", "/r/rubric.md");
    expect(s).toContain(`manifest: ${join("/o", "manifest.json")}`);
    expect(s).toContain("rubric:   /r/rubric.md");
    expect(s).toMatch(/critique .* against the rubric/);
  });
});
