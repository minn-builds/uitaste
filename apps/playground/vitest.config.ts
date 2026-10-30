import { defineConfig } from "vitest/config";

// Separate from vite.config.ts so tests don't run the token-writing plugin.
export default defineConfig({
  test: { include: ["*.test.ts"] },
});
