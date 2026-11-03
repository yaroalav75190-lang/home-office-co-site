#!/usr/bin/env node
// Renders contact sheets of the generated coastline data to PNG for visual QA.
// Uses sharp (librsvg) from Next's dependency tree; Node 24 strips the TS types of the data files.
//
//   node scripts/coast/preview-coast.mjs [--out <dir>]     (default: <os tmp>/coast-preview)

import { mkdir, writeFile } from "node:fs/promises";
import { createRequire } from "node:module";
import { tmpdir } from "node:os";
import { dirname, join } from "node:path";
import { fileURLToPath, pathToFileURL } from "node:url";

const HERE = dirname(fileURLToPath(import.meta.url));
const DATA = join(HERE, "..", "..", "src", "components", "coast", "data");
const IDS = ["phuket-island", "phuket-west", "bali-bukit", "dubai-jumeirah", "sihanoukville"];
const DISTRICTS = ["layan", "bang-tao", "kamala", "karon-kata", "nai-harn-rawai", "chalong"];
const SALT = "#F3F3EF";
const INK = "#10262B";
const MUTED = "#4D5E61";
const LATERITE = "#A34328";

const require = createRequire(import.meta.url);
function loadSharp() {
  try {
    return require("sharp");
  } catch {
    const nextDir = dirname(require.resolve("next/package.json"));
    return require(require.resolve("sharp", { paths: [nextDir] }));
  }
}

const args = process.argv.slice(2);
const outIdx = args.indexOf("--out");
const OUT_DIR = outIdx >= 0 ? args[outIdx + 1] : join(tmpdir(), "coast-preview");

/** One coast drawing placed at (x, y), long side = size px. Stroke widths are in px. */
function coast(data, { x, y, size, lod = "full", color = LATERITE, highlight, dot, sw = 1.5 }) {
  const { width: w, height: h } = data;
  const s = size / Math.max(w, h);
  const u = 1 / s; // px -> viewBox units
  const L = data[lod];
  let g = `<g transform="translate(${x} ${y}) scale(${s})" fill="none" stroke-linejoin="round" stroke-linecap="round">`;
  const base = highlight ? MUTED : color;
  for (const d of L.d) g += `<path d="${d}" stroke="${base}" stroke-width="${sw * u}"/>`;
  if (highlight && L.districts?.[highlight]) {
    g += `<path d="${L.districts[highlight]}" stroke="${LATERITE}" stroke-width="${3 * u}"/>`;
  }
  if (dot) {
    const p = data.points[dot];
    const r = { 24: 2.25, 64: 3, 96: 3.5, 120: 4, 160: 4.5 }[size] ?? 4;
    g += `<circle cx="${p[0]}" cy="${p[1]}" r="${r * u}" fill="${LATERITE}" stroke="none"/>`;
  }
  return g + `</g>`;
}

function label(x, y, text, size = 12) {
  return `<text x="${x}" y="${y}" font-family="Segoe UI, Arial, sans-serif" font-size="${size}" fill="${INK}">${text}</text>`;
}

async function main() {
  const sharp = loadSharp();
  await mkdir(OUT_DIR, { recursive: true });
  const data = {};
  for (const id of [...IDS]) {
    try {
      const mod = await import(pathToFileURL(join(DATA, `${id}.ts`)).href);
      data[id] = Object.values(mod)[0];
    } catch (err) {
      if (err.code !== "ERR_MODULE_NOT_FOUND") throw err;
      console.warn(`skip ${id}: data file not built yet`);
      IDS.splice(IDS.indexOf(id), 1);
    }
  }
  const written = [];
  const render = async (name, W, H, body) => {
    const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="${W}" height="${H}" viewBox="0 0 ${W} ${H}"><rect width="${W}" height="${H}" fill="${SALT}"/>${body}</svg>`;
    const file = join(OUT_DIR, `${name}.png`);
    await writeFile(join(OUT_DIR, `${name}.svg`), svg);
    // toBuffer + fs: libvips cannot open long Windows paths itself.
    await writeFile(file, await sharp(Buffer.from(svg), { density: 96 }).png().toBuffer());
    written.push(file);
  };

  // 1. Each region large (full LOD), 900 px long side.
  for (const id of IDS) {
    const d = data[id];
    const S = 900;
    const W = Math.round((d.width / 1000) * S) + 80;
    const H = Math.round((d.height / 1000) * S) + 80;
    await render(`${id}-full`, W, H, coast(d, { x: 40, y: 40, size: S }) + label(8, 20, `${id} full`));
  }

  // 2. Phuket districts: island with each district highlighted (mid at 160 px, full at 400 px).
  for (const id of ["phuket-island", "phuket-west"]) {
    const d = data[id];
    let body = "";
    DISTRICTS.forEach((dist, i) => {
      const x = 20 + i * 210;
      body += label(x, 18, dist);
      body += coast(d, { x, y: 30, size: 400, lod: "full", highlight: dist });
      body += coast(d, { x, y: 460, size: 160, lod: "mid", highlight: dist });
      body += coast(d, { x: x + 100, y: 460, size: 96, lod: "mid", highlight: dist });
    });
    await render(`${id}-districts`, 20 + 6 * 210, 640, body);
  }

  // 3. Locators at every size for every place (phuket-island).
  {
    const d = data["phuket-island"];
    const places = Object.keys(d.points);
    const sizes = [24, 64, 96, 120, 160];
    let body = "";
    places.forEach((pl, r) => {
      const y = 20 + r * 180;
      body += label(10, y + 12, pl);
      let x = 90;
      for (const size of sizes) {
        body += coast(d, { x, y, size, lod: size <= 64 ? "tiny" : "mid", color: MUTED, dot: pl });
        x += Math.round(size * (d.width / d.height)) + 40;
      }
    });
    await render(`phuket-locators`, 520, 20 + places.length * 180, body);
  }

  // 4. All coasts at locator sizes (tiny 24/64, mid 120).
  {
    let body = "";
    let x = 20;
    for (const id of IDS) {
      const d = data[id];
      body += label(x, 16, id, 11);
      body += coast(d, { x, y: 30, size: 24, lod: "tiny" });
      body += coast(d, { x, y: 70, size: 64, lod: "tiny" });
      body += coast(d, { x, y: 150, size: 120, lod: "mid" });
      x += 160;
    }
    await render(`all-small`, x, 290, body);
  }
  console.log(written.join("\n"));
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
