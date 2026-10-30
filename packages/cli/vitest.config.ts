import { fileURLToPath } from "node:url";
import { defineProject } from "vitest/config";

export default defineProject({
  resolve: {
    alias: {
      // Resolve core from source so tests never run against a stale dist.
      "@uitaste/core": fileURLToPath(new URL("../core/src/index.ts", import.meta.url)),
    },
  },
  test: {
    name: "cli",
    include: ["src/**/*.test.ts"],
  },
});
