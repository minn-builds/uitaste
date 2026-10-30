// Usage: node bench/scripts/compose.mjs <id>...   (reads bench/shots, writes bench/out/<id>.png)
import { mkdirSync } from "node:fs";
import { join } from "node:path";
import { fileURLToPath } from "node:url";
import sharp from "sharp";
import { benchRoot, VARIANTS } from "../schema.mjs";

const MAX_H = 2400; // crop of the 1440 shot
const W = 1440;
const MOBILE_W = 390;
const GAP = 48;
const PAD = 48;
const LABEL_H = 96;
const LABELS = { baseline: "Default agent", tastekit: "With tastekit" };
const BG = "#f4f4f5";

const esc = (s) => s.replace(/&/g, "&amp;").replace(/</g, "&lt;");

function label(text, width, accent) {
  const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="${width}" height="${LABEL_H}">
    <rect x="0" y="28" width="12" height="40" fill="${accent}"/>
    <text x="28" y="62" font-family="Helvetica, Arial, sans-serif" font-size="40" font-weight="700" fill="#18181b">${esc(text)}</text></svg>`;
  return Buffer.from(svg);
}

/** Crop a shot to at most `maxH` rows, returning a PNG buffer and its size. */
async function crop(file, width, maxH) {
  const img = sharp(file);
  const { width: w = width, height: h = 0 } = await img.metadata();
  const height = Math.min(h, maxH);
  const buf = await img.extract({ left: 0, top: 0, width: w, height }).png().toBuffer();
  return { buf, width: w, height };
}

export async function compose(id) {
  const shots = (v, bp) => join(benchRoot, "shots", `${id}-${v}-${bp}.png`);
  const cols = [];
  for (const v of VARIANTS) {
    const desktop = await crop(shots(v, 1440), W, MAX_H);
    const mobile = await crop(shots(v, 390), MOBILE_W, MAX_H);
    cols.push({ v, desktop, mobile });
  }
  const colW = W + GAP / 2 + MOBILE_W;
  const contentH = Math.max(...cols.flatMap((c) => [c.desktop.height, c.mobile.height]));
  const width = PAD * 2 + colW * 2 + GAP * 2;
  const height = PAD * 2 + LABEL_H + contentH;
  const layers = [];
  cols.forEach((c, i) => {
    const x = PAD + i * (colW + GAP * 2);
    const accent = c.v === "baseline" ? "#a1a1aa" : "#18181b";
    layers.push({ input: label(LABELS[c.v], colW, accent), left: x, top: PAD });
    layers.push({ input: c.desktop.buf, left: x, top: PAD + LABEL_H });
    layers.push({ input: c.mobile.buf, left: x + W + GAP / 2, top: PAD + LABEL_H });
  });
  // Thin divider between the columns.
  const divX = PAD + colW + GAP;
  layers.push({
    input: { create: { width: 2, height: height - PAD * 2, channels: 3, background: "#d4d4d8" } },
    left: divX,
    top: PAD,
  });
  const out = join(benchRoot, "out", `${id}.png`);
  mkdirSync(join(benchRoot, "out"), { recursive: true });
  await sharp({ create: { width, height, channels: 3, background: BG } })
    .composite(layers)
    .png()
    .toFile(out);
  return out;
}

if (process.argv[1] === fileURLToPath(import.meta.url)) {
  const ids = process.argv.slice(2).filter((a) => a !== "--");
  if (ids.length === 0) {
    console.error("usage: node bench/scripts/compose.mjs <id>...");
    process.exit(1);
  }
  for (const id of ids) console.log(await compose(id));
}
