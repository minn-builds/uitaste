import tailwindcss from "@tailwindcss/vite";
import react from "@vitejs/plugin-react";
import { defineConfig } from "vite";
import { tastekitTokens } from "./tastekit-tokens-plugin";

export default defineConfig({
  plugins: [tastekitTokens(), react(), tailwindcss()],
});
