#!/usr/bin/env node
// Builds src/components/coast/data/*.ts from the raw Overpass responses in scripts/coast/raw/.
// No network access. Re-run after editing regions.mjs or re-fetching:
//
//   node scripts/coast/build-coast.mjs
//
// Steps per region: stitch coastline ways -> pick/clip geometry -> local equirectangular
// projection (cos(lat) scaling) -> normalise to a viewBox whose long side is 1000 units ->
// Visvalingam–Whyatt simplification at three levels of detail (full / mid / tiny) with the
// district anchors locked, so district segments are exact slices of the base path.

import { readFile, writeFile, mkdir } from "node:fs/promises";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";
import {
  stitchWays,
  makeProjection,
  signedArea,
  polylineLength,
  clipPolyline,
  subtractRect,
  effectiveAreas,
  thresholdForBudget,
  nearestIndex,
  snapToPolyline,
  dedupe,
  encodePath,
} from "./geo.mjs";
import { REGIONS, ANCHORS, PLACES, DISTRICTS } from "./regions.mjs";

const HERE = dirname(fileURLToPath(import.meta.url));
const RAW = join(HERE, "raw");
const OUT = join(HERE, "..", "..", "src", "components", "coast", "data");
const KM_PER_DEG = 111.32;
const LONG_SIDE = 1000;
const LODS = ["full", "mid", "tiny"];

const rawCache = new Map();
async function loadRaw(id) {
  if (!rawCache.has(id)) {
    const json = JSON.parse(await readFile(join(RAW, `${id}.json`), "utf8"));
    rawCache.set(id, json);
  }
  return rawCache.get(id);
}

/** Rotate a closed ring (first == last) so it starts at index k. */
function rotateRing(ring, k) {
  const open = ring.slice(0, -1);
  const r = open.slice(k).concat(open.slice(0, k));
  r.push(r[0]);
  return r;
}

async function buildRegion(cfg) {
  const raw = await loadRaw(cfg.source);
  const proj = makeProjection(cfg.frame);
  const parts = stitchWays(raw.elements).map((p) => ({
    closed: p.closed,
    pts: p.coords.map(proj.project),
  }));

  // pieces: [{ pts, closed, anchors: Map<anchorId, index> }]
  let pieces = [];
  if (cfg.mode === "island" || cfg.mode === "island-subline") {
    // The main island = the closed ring with the largest area.
    const ring = parts
      .filter((p) => p.closed)
      .sort((a, b) => Math.abs(signedArea(b.pts)) - Math.abs(signedArea(a.pts)))[0];
    let pts = ring.pts;
    // Projected frame is y-down, so OSM's counter-clockwise island ring has negative area here.
    // We want: start at the northernmost vertex, then run down the west coast (north -> south).
    if (signedArea(pts) > 0) pts = pts.slice().reverse();
    let north = 0;
    for (let i = 1; i < pts.length - 1; i++) if (pts[i][1] < pts[north][1]) north = i;
    pts = rotateRing(pts, north);
    // Make sure the second vertex heads west (x decreasing) — i.e. we go down the west coast.
    const probe = pts[Math.min(50, pts.length - 2)];
    if (probe[0] > pts[0][0]) pts = pts.slice().reverse();

    const anchorIdx = new Map();
    let last = 0;
    for (const a of ANCHORS) {
      const p = proj.project([a.lon, a.lat]);
      const i = nearestIndex(pts, p, 1, pts.length - 2);
      if (i <= last) throw new Error(`anchor ${a.id} out of order (index ${i} <= ${last})`);
      anchorIdx.set(a.id, i);
      last = i;
    }

    if (cfg.mode === "island") {
      pieces = [{ pts, closed: true, anchors: anchorIdx }];
    } else {
      const from = anchorIdx.get(cfg.subline[0]);
      const to = anchorIdx.get(cfg.subline[1]);
      const sub = pts.slice(from, to + 1);
      const shifted = new Map();
      for (const [id, i] of anchorIdx) if (i >= from && i <= to) shifted.set(id, i - from);
      pieces = [{ pts: sub, closed: false, anchors: shifted }];
    }
  } else {
    // Coast region: clip everything to the frame, drop small islands and short fragments.
    const [s, w, n, e] = cfg.frame;
    const rect = [0, 0, (e - w) * Math.cos((((s + n) / 2) * Math.PI) / 180), n - s];
    const minArea = (cfg.minIslandKm2 ?? 0.05) / KM_PER_DEG ** 2;
    const minLen = (cfg.minPieceKm ?? 0.5) / KM_PER_DEG;
    // Cutouts: lat/lon boxes whose contents are removed (harbour piers, clutter that turns
    // into a knot at icon size). Rings touched by a cutout become open lines.
    const cutRects = (cfg.cutouts ?? []).map(([cs, cw, cn, ce]) => {
      const [x0, y0] = proj.project([cw, cn]);
      const [x1, y1] = proj.project([ce, cs]);
      return [x0, y0, x1, y1];
    });
    const touches = (pts, [x0, y0, x1, y1]) => clipPolyline(pts, [x0, y0, x1, y1]).length > 0;
    for (const p of parts) {
      const inside = p.pts.every(([x, y]) => x >= rect[0] && x <= rect[2] && y >= rect[1] && y <= rect[3]);
      if (p.closed && inside && !cutRects.some((r) => touches(p.pts, r))) {
        if (Math.abs(signedArea(p.pts)) >= minArea) pieces.push({ pts: p.pts, closed: true, anchors: new Map() });
        continue;
      }
      let lines = clipPolyline(p.pts, rect);
      for (const r of cutRects) lines = lines.flatMap((l) => subtractRect(l, r));
      for (const c of lines) {
        if (polylineLength(c) >= minLen) pieces.push({ pts: c, closed: false, anchors: new Map() });
      }
    }
    pieces.sort((a, b) => polylineLength(b.pts) - polylineLength(a.pts));
  }

  // Normalise to a viewBox with the long side = 1000 units, tight to the geometry.
  let x0 = Infinity, y0 = Infinity, x1 = -Infinity, y1 = -Infinity;
  for (const pc of pieces)
    for (const [x, y] of pc.pts) {
      x0 = Math.min(x0, x); y0 = Math.min(y0, y);
      x1 = Math.max(x1, x); y1 = Math.max(y1, y);
    }
  const k = LONG_SIDE / Math.max(x1 - x0, y1 - y0);
  const width = Math.round((x1 - x0) * k);
  const height = Math.round((y1 - y0) * k);
  const norm = ([x, y]) => [(x - x0) * k, (y - y0) * k];
  for (const pc of pieces) pc.pts = pc.pts.map(norm);

  // Effective areas once per piece (anchors locked).
  const areas = pieces.map((pc) => effectiveAreas(pc.pts, new Set(pc.anchors.values())));
  const lods = {};
  const stats = {};
  for (const lod of LODS) {
    const t = thresholdForBudget(areas, cfg.budget[lod]);
    const d = [];
    const districts = {};
    let count = 0;
    pieces.forEach((pc, pi) => {
      const keptIdx = [];
      for (let i = 0; i < pc.pts.length; i++) if (areas[pi][i] >= t) keptIdx.push(i);
      const rounded = keptIdx.map((i) => pc.pts[i].map(Math.round));
      count += keptIdx.length;
      d.push(encodePath(dedupe(rounded), pc.closed));
      if (cfg.districts) {
        for (const dist of DISTRICTS) {
          const a = pc.anchors.get(dist.from);
          const b = pc.anchors.get(dist.to);
          if (a === undefined || b === undefined) continue;
          const seg = keptIdx.filter((i) => i >= a && i <= b).map((i) => pc.pts[i].map(Math.round));
          districts[dist.id] = encodePath(dedupe(seg), false);
        }
      }
    });
    lods[lod] = { d, ...(cfg.districts ? { districts } : {}) };
    stats[lod] = { points: count, bytes: d.reduce((s, x) => s + x.length, 0) };
  }

  // Locator dots: projected, normalised and snapped onto the (unsimplified) coastline.
  const points = {};
  for (const id of cfg.points ?? []) {
    const pl = PLACES.find((p) => p.id === id);
    const p = norm(proj.project([pl.lon, pl.lat]));
    let best = null;
    let bestD = Infinity;
    for (const pc of pieces) {
      const q = snapToPolyline(pc.pts, p);
      const dd = (q[0] - p[0]) ** 2 + (q[1] - p[1]) ** 2;
      if (dd < bestD) { bestD = dd; best = q; }
    }
    points[id] = best.map((v) => Math.round(v * 10) / 10);
  }

  return { cfg, width, height, lods, points, stats, osmBase: raw.osm3s?.timestamp_osm_base };
}

const camel = (s) => s.replace(/-([a-z])/g, (_, c) => c.toUpperCase());

function emit(r) {
  const { cfg } = r;
  const name = camel(cfg.id);
  const lines = [];
  lines.push(`// Generated by scripts/coast/build-coast.mjs. Do not edit by hand.`);
  lines.push(`// Coastline © участники OpenStreetMap (OpenStreetMap contributors), ODbL 1.0.`);
  lines.push(`// OSM data as of ${r.osmBase}. Source: raw/${cfg.source}.json (natural=coastline).`);
  lines.push(`import type { CoastData } from "../types";`);
  lines.push(``);
  lines.push(`export const ${name} = {`);
  lines.push(`  id: ${JSON.stringify(cfg.id)},`);
  lines.push(`  width: ${r.width},`);
  lines.push(`  height: ${r.height},`);
  lines.push(`  osmDate: ${JSON.stringify(r.osmBase?.slice(0, 10))},`);
  for (const lod of LODS) {
    const L = r.lods[lod];
    lines.push(`  ${lod}: {`);
    lines.push(`    d: [`);
    for (const d of L.d) lines.push(`      ${JSON.stringify(d)},`);
    lines.push(`    ],`);
    if (L.districts) {
      lines.push(`    districts: {`);
      for (const [id, d] of Object.entries(L.districts)) lines.push(`      ${JSON.stringify(id)}: ${JSON.stringify(d)},`);
      lines.push(`    },`);
    }
    lines.push(`  },`);
  }
  lines.push(`  points: {`);
  for (const [id, p] of Object.entries(r.points)) lines.push(`    ${JSON.stringify(id)}: [${p[0]}, ${p[1]}],`);
  lines.push(`  },`);
  lines.push(`} as const satisfies CoastData;`);
  lines.push(``);
  return { name, text: lines.join("\n") };
}

async function main() {
  await mkdir(OUT, { recursive: true });
  const only = process.argv.slice(2).filter((a) => !a.startsWith("--"));
  const report = [];
  const built = [];
  for (const cfg of REGIONS) {
    if (only.length && !only.includes(cfg.id)) continue;
    const r = await buildRegion(cfg);
    const { name, text } = emit(r);
    await writeFile(join(OUT, `${cfg.id}.ts`), text);
    built.push({ id: cfg.id, name });
    report.push(
      `${cfg.id.padEnd(16)} ${r.width}x${r.height}  ` +
        LODS.map((l) => `${l} ${r.stats[l].points} pts ${(r.stats[l].bytes / 1024).toFixed(1)} KB`).join("  ") +
        `  file ${(Buffer.byteLength(text) / 1024).toFixed(1)} KB`,
    );
  }
  if (!only.length) {
    const idx = [
      `// Generated by scripts/coast/build-coast.mjs. Do not edit by hand.`,
      ...built.map((b) => `import { ${b.name} } from "./${b.id}";`),
      ``,
      `export const coastData = {`,
      ...built.map((b) => `  ${JSON.stringify(b.id)}: ${b.name},`),
      `} as const;`,
      ``,
    ].join("\n");
    await writeFile(join(OUT, `index.ts`), idx);
  }
  console.log(report.join("\n"));
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
