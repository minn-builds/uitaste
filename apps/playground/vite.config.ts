import { createRequire } from "node:module";
import { dirname } from "node:path";
import tailwindcss from "@tailwindcss/vite";
import react from "@vitejs/plugin-react";
import { defineConfig } from "vite";
import { uitasteTokens } from "./uitaste-tokens-plugin";

const require = createRequire(import.meta.url);
const pkgDir = (name: string) => dirname(require.resolve(`${name}/package.json`));

// bench/pages lives outside the app root, so bare react imports there need an explicit target.
export default defineConfig({
  plugins: [uitasteTokens(), react(), tailwindcss()],
  resolve: {
    alias: [
      { find: /^react\/(.*)$/, replacement: `${pkgDir("react")}/$1` },
      { find: /^react$/, replacement: pkgDir("react") },
      { find: /^react-dom\/(.*)$/, replacement: `${pkgDir("react-dom")}/$1` },
    ],
  },
});
