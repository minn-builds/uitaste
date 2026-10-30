import { join } from "node:path";
import { MANIFEST_FILE } from "./manifest.js";

export const RUBRIC_RELATIVE = join("reference", "rubric.md");

/** Path of the critique rubric inside the installed @tastekit/skill package. */
export function rubricPath(skillRoot: string): string {
  return join(skillRoot, RUBRIC_RELATIVE);
}

/** Agent-facing closing block for `tastekit shoot`: where the manifest and rubric are, and what to do. */
export function agentHandoff(outDir: string, rubric: string): string {
  return [
    "",
    "--- for the agent ---",
    `manifest: ${join(outDir, MANIFEST_FILE)}`,
    `rubric:   ${rubric}`,
    "Next: view each screenshot in the manifest and critique it against the rubric; fix every score below 4.",
  ].join("\n");
}
