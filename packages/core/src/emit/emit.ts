import type { Tokens } from "../schema/tokens.js";
import { SEMANTIC_ROLES } from "../schema/tokens.js";

type Entry = readonly [name: string, value: string];

const kebab = (s: string) => s.replace(/[A-Z]/g, (c) => `-${c.toLowerCase()}`);
const stepKey = (s: string) => s.replace(".", "-");
const numeric = (a: string, b: string) => Number(a) - Number(b);

function block(selector: string, entries: readonly Entry[], indent = ""): string {
  const body = entries.map(([k, v]) => `${indent}  ${k}: ${v};`).join("\n");
  return `${indent}${selector} {\n${body}\n${indent}}`;
}

function semantic(colors: Tokens["color"]["light"]): Entry[] {
  return SEMANTIC_ROLES.map((r) => [`--tk-color-${kebab(r)}`, colors[r]] as const);
}

function rampEntries(t: Tokens, prefix: string): Entry[] {
  return Object.entries(t.color.ramps).flatMap(([name, ramp]) =>
    Object.entries(ramp).map(([step, v]) => [`${prefix}-${name}-${step}`, v] as const),
  );
}

function motionEntries(t: Tokens): Entry[] {
  return [
    ...Object.entries(t.motion.duration).map(([k, v]) => [`--tk-duration-${k}`, v] as const),
    ["--tk-easing", t.motion.easing],
  ];
}

function spaceEntries(t: Tokens): Entry[] {
  return Object.entries(t.space)
    .sort(([a], [b]) => numeric(a, b))
    .map(([k, v]) => [`--tk-space-${stepKey(k)}`, v] as const);
}

/** Semantic color blocks: light on :root, dark via `.dark` class and prefers-color-scheme. */
function semanticBlocks(t: Tokens): string[] {
  const out = [block(":root", semantic(t.color.light))];
  if (t.color.dark) {
    const dark = semantic(t.color.dark);
    out.push(
      block(".dark", dark),
      `@media (prefers-color-scheme: dark) {\n${block(":root:not(.light)", dark, "  ")}\n}`,
    );
  }
  return out;
}

/**
 * Plain CSS custom properties, all prefixed `--tk-`.
 * Dark mode: `.dark` class, or automatically via prefers-color-scheme unless `.light` is set on :root.
 */
export function toCssVars(t: Tokens): string {
  const root: Entry[] = [
    ...semantic(t.color.light),
    ...rampEntries(t, "--tk-ramp"),
    ...Object.entries(t.font).map(([k, v]) => [`--tk-font-${k}`, v] as const),
    ...Object.entries(t.text).flatMap(([k, v]) => [
      [`--tk-text-${k}`, v.size] as const,
      [`--tk-text-${k}-line-height`, String(v.lineHeight)] as const,
    ]),
    ...spaceEntries(t),
    ...Object.entries(t.radius).map(([k, v]) => [`--tk-radius-${k}`, v] as const),
    ...Object.entries(t.shadow).map(([k, v]) => [`--tk-shadow-${k}`, v] as const),
    ...motionEntries(t),
  ];
  const [, ...rest] = semanticBlocks(t);
  return `${[block(":root", root), ...rest].join("\n\n")}\n`;
}

/**
 * Tailwind v4 output: runtime semantic vars (`:root`, `.dark`, media query) plus
 * `@theme inline` mapping semantic colors to them so utilities follow dark mode,
 * and a static `@theme` for ramps, fonts, type, spacing, radius, shadow, motion.
 * Default Tailwind colors are reset so only preset colors exist.
 */
export function toTailwindTheme(t: Tokens): string {
  const space1 = t.space["1"];
  const theme: Entry[] = [
    ["--color-*", "initial"],
    ...rampEntries(t, "--color"),
    ...Object.entries(t.font).map(([k, v]) => [`--font-${k}`, v] as const),
    ...Object.entries(t.text).flatMap(([k, v]) => [
      [`--text-${k}`, v.size] as const,
      [`--text-${k}--line-height`, String(v.lineHeight)] as const,
    ]),
    ...(space1 ? ([["--spacing", space1]] as Entry[]) : []),
    ...Object.entries(t.radius).map(([k, v]) => [`--radius-${k}`, v] as const),
    ...Object.entries(t.shadow).map(([k, v]) => [`--shadow-${k}`, v] as const),
    ["--default-transition-duration", t.motion.duration.base],
    ["--default-transition-timing-function", t.motion.easing],
    ["--ease-standard", t.motion.easing],
  ];
  const inline: Entry[] = SEMANTIC_ROLES.map(
    (r) => [`--color-${kebab(r)}`, `var(--tk-color-${kebab(r)})`] as const,
  );
  const [rootBlock, ...darkBlocks] = semanticBlocks(t);
  const motion = block(":root", [...motionEntries(t)])
    .replace(/^:root \{\n/, "")
    .replace(/\n\}$/, "");
  const root = (rootBlock ?? "").replace(/\n\}$/, `\n${motion}\n}`);
  const dark = "@custom-variant dark (&:where(.dark, .dark *));";
  return `${[dark, root, ...darkBlocks, block("@theme", theme), block("@theme inline", inline)].join("\n\n")}\n`;
}

/** Stable, pretty-printed JSON. */
export function toJson(t: Tokens): string {
  return `${JSON.stringify(t, null, 2)}\n`;
}
