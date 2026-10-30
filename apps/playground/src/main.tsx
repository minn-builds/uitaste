import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { App } from "./App";

const root = document.getElementById("root");
if (!root) throw new Error("Missing #root element");

// Baseline bench pages must see stock Tailwind, so they get a different stylesheet.
const isBaseline = /^\/bench\/[^/]+\/baseline\/?$/.test(window.location.pathname);
await (isBaseline ? import("./bench.css") : import("./index.css"));

createRoot(root).render(
  <StrictMode>
    <App />
  </StrictMode>,
);
