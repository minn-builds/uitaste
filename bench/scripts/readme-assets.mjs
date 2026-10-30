// Usage: node bench/scripts/readme-assets.mjs
// Builds the README images in docs/assets from bench/out, bench/shots and .tastekit/shots.
// Preset thumbnails need the gitignored shots from the preset tasks (.tastekit/shots/T2.2, T2.3).
import { existsSync, mkdirSync } from "node:fs";
import { join } from "node:path";
import sharp from "sharp";
import { benchRoot, repoRoot } from "../schema.mjs";

const out = join(repoRoot, "docs", "assets");
const COMPARISONS = ["event-conference", "restaurant", "pricing"];
const PRESET_SHOTS = {
  editorial: "T2.2",
  swiss: "T2.2",
  "soft-utility": "T2.3",
  brutal: "T2.3",
};
const HERO = { id: "event-conference", w: 1200, h: 700, crop: 840 };
const HOLD = [1600, 2200]; // ms on "Default agent", "With tastekit"
const STEPS = 4;
const STEP_MS = 90;

async function comparisons() {
  for (const id of COMPARISONS) {
    const src = join(benchRoot, "out", `${id}.png`);
    if (!existsSync(src)) {
      console.warn(`skip ${id}: ${src} not found (run pnpm bench)`);
      continue;
    }
    await sharp(src)
      .resize({ width: 1600 })
      .png({ compressionLevel: 9, palette: true, quality: 90 })
      .toFile(join(out, `before-after-${id}.png`));
  }
}

async function thumbnails() {
  for (const [id, dir] of Object.entries(PRESET_SHOTS)) {
    const src = join(repoRoot, ".tastekit", "shots", dir, `${id}-1440.png`);
    if (!existsSync(src)) {
      console.warn(`skip ${id}: ${src} not found`);
      continue;
    }
    await sharp(src)
      .extract({ left: 0, top: 0, width: 1440, height: 900 })
      .resize({ width: 800 })
      .png({ compressionLevel: 9, palette: true, quality: 90 })
      .toFile(join(out, `preset-${id}.png`));
  }
}

function pill(text, w, h) {
  const tw = text.length * 15 + 40;
  return Buffer.from(
    `<svg xmlns="http://www.w3.org/2000/svg" width="${w}" height="${h}">
      <rect x="24" y="${h - 76}" width="${tw}" height="52" rx="4" fill="#18181b"/>
      <text x="44" y="${h - 41}" font-family="Helvetica, Arial, sans-serif" font-size="26" font-weight="700" fill="#fff">${text}</text></svg>`,
  );
}

async function frame(file, label) {
  const { w, h, crop } = HERO;
  return sharp(file)
    .extract({ left: 0, top: 0, width: 1440, height: crop })
    .resize({ width: w, height: h, fit: "fill" })
    .composite([{ input: pill(label, w, h) }])
    .removeAlpha()
    .raw()
    .toBuffer();
}

function mix(a, b, t) {
  const o = Buffer.allocUnsafe(a.length);
  for (let i = 0; i < a.length; i++) o[i] = Math.round(a[i] * (1 - t) + b[i] * t);
  return o;
}

async function hero() {
  const { w, h, id } = HERO;
  const a = await frame(join(benchRoot, "shots", `${id}-baseline-1440.png`), "Default agent");
  const b = await frame(join(benchRoot, "shots", `${id}-tastekit-1440.png`), "With tastekit");
  const frames = [a];
  const delay = [HOLD[0]];
  for (let i = 1; i <= STEPS; i++) {
    frames.push(mix(a, b, i / (STEPS + 1)));
    delay.push(STEP_MS);
  }
  frames.push(b);
  delay.push(HOLD[1]);
  for (let i = STEPS; i >= 1; i--) {
    frames.push(mix(a, b, i / (STEPS + 1)));
    delay.push(STEP_MS);
  }
  await sharp(Buffer.concat(frames), {
    raw: { width: w, height: h * frames.length, channels: 3, pageHeight: h },
  })
    .gif({ delay, loop: 0, effort: 7, colours: 128, dither: 0.3 })
    .toFile(join(out, "hero.gif"));
}

mkdirSync(out, { recursive: true });
await comparisons();
await thumbnails();
await hero();
