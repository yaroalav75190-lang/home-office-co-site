#!/usr/bin/env node
/**
 * Photo pipeline: art-directed crops + the «Документальный дневной свет» grade
 * (docs/design/art-direction.md §3.6 and §7).
 *
 *   cd site && node scripts/photos/grade.mjs            # all photos, all ratios
 *   node scripts/photos/grade.mjs --only hero,bangtao   # subset (photos.ts is still rewritten for all)
 *   node scripts/photos/grade.mjs --no-ts               # do not touch src/lib/photos.ts
 *
 * In:  photos-src/unsplash/{key}.jpg — 2800 px Unsplash sources from fetch-unsplash.mjs
 *      (picks in unsplash.json; authors, pages and locations also in photos-src/unsplash/_credits.json).
 *      photos-src/wikimedia/ — the Commons originals; the two Bang Tao frames still come from
 *      there, because Unsplash has no photo with a confirmed Bang Tao location.
 *      photos-src/ sits outside public/, so the sources are never served.
 * Out: public/photos/graded/{key}-{ratio}.jpg — JPEG q86 progressive, long edge ≤ 2400 px,
 *      never upscaled. Next/image makes AVIF/WebP and the responsive widths from these.
 *      The block between the `<generated:photos>` markers in src/lib/photos.ts is rewritten
 *      with the real file sizes, so the TS registry can never drift from the files.
 *
 * Re-runnable: outputs are overwritten, stale {key}-{ratio}.jpg files that are no longer
 * in the config are deleted.
 */
import fs from 'node:fs/promises'
import path from 'node:path'
import { fileURLToPath, pathToFileURL } from 'node:url'
import sharp from 'sharp'

export const SITE_DIR = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '../..')
export const PHOTOS_DIR = path.join(SITE_DIR, 'public/photos')
export const SRC_DIR = path.join(SITE_DIR, 'photos-src')
export const OUT_DIR = path.join(PHOTOS_DIR, 'graded')
const PHOTOS_TS = path.join(SITE_DIR, 'src/lib/photos.ts')

export const RATIOS = { '21x9': 21 / 9, '3x2': 3 / 2, '4x5': 4 / 5, '1x1': 1 }
export const MAX_EDGE = 2400

/** Lighter grade for sources that arrive muted (see «Per-photo tune» in the Grade section). */
export const LIGHT = { saturation: 0.93, bands: 0.5 }

/* -------------------------------------------------------------------------------------------
 * Crops
 *
 * Every crop is { x, y, w } or { x, y, h } in fractions of the SOURCE frame: left edge, top edge,
 * and width (or height, for crops limited by the frame height). The other side always follows
 * from the ratio, so a crop can never be off-ratio; the script throws if a rectangle leaves the
 * frame. Percent positions in the comments are of the source frame.
 *
 * Rules (art direction §3.6): horizon on a third, coast enters from a corner, watermarks,
 * signs and lettering are removed by framing (never retouched), the mobile hero gets its own 4:5.
 * Ratios per photo follow §6 (wireframes) and §7 (photo table); the quiz shows the chosen
 * direction 4:5 on desktop and 21:9 on mobile, so direction photos get both where the frame allows.
 * ----------------------------------------------------------------------------------------- */
export const PHOTOS = {
  hero: {
    // A long beach from above, Phuket (Unsplash, Antonio Araujo; tagged phuket, no exact place).
    // 2800×1865: the beach arc runs from the lower-left corner to a sandbar at the top right
    // (x 72–92 %, y 12–20 %), casuarinas and a resort garden fill the lower right, boats on
    // shallow water, open sea top-left. No people visible at any size.
    file: 'unsplash/hero.jpg',
    crops: {
      // Home panorama. Full width, y 17–81 %: the arc crosses the frame as a diagonal, the
      // sandbar closes the top-right corner, the roofs along the bottom edge are cut.
      '21x9': { x: 0, y: 0.17, w: 1 },
      // Mobile hero. Full height from x 40 %: the right half of the arc, the sandbar at the top,
      // the casuarina belt as the base.
      '4x5': { x: 0.4, y: 0, h: 1 },
      // Cards / OG. Full frame (by height: the source is two pixels short of 3:2 by width).
      '3x2': { x: 0, y: 0, h: 1 },
    },
  },

  phuket: {
    // Ya Nui bay from the windmill viewpoint, Rawai (Unsplash, Polina Kocheva). 2800×1868,
    // horizon at 30 %. Headland from the left (x 0–47 %, y 26–55 %), Koh Man island on the
    // right (x 74–100 %, y 30–46 %), beach x 10–30 % / y 62–73 %, rock islet in the bay, a yacht
    // at x 81 %, scrub and a sugar palm in the foreground (y > 77 %, palm x 85–100 %).
    file: 'unsplash/phuket.jpg',
    crops: {
      // /thailand/phuket full-bleed hero. Full width, y 12–76 %: horizon at 28 %, the headland
      // and the island frame the bay, the beach sits on the lower edge, foreground scrub dropped.
      '21x9': { x: 0, y: 0.12, w: 1 },
      // Directions card. Full frame: the foreground scrub anchors the bottom, horizon at 30 %.
      '3x2': { x: 0, y: 0, w: 1 },
      // Quiz (Phuket chosen). Full height from x 8 %: the headland enters from the left, beach
      // and rock islet on the lower third, open sea to the right.
      '4x5': { x: 0.08, y: 0, h: 1 },
    },
    // Soft morning light, deep-blue water: the full grade turned the bay grey. LIGHT.
    tune: LIGHT,
  },

  bangtao: {
    // Bang Tao Beach (Wikimedia Commons, Raita Futo, CC BY 2.0). No Unsplash photo with a
    // confirmed Bang Tao location exists (searched 3 Nov 2026), so the real place stays.
    // 2560×1707: horizon at 70 %, palms and umbrellas on the left (x 0–40 %), the wooded
    // headland at the north end of the bay x 30–92 % / y 61–70 %, boats on the water, sand y > 75 %.
    file: 'wikimedia/bangtao.jpg',
    crops: {
      // District hero «горизонт на нижней трети». Full width, y 30–94 %: horizon at 62 %, the
      // palm crowns cross the top edge, the umbrellas hold the lower-left corner.
      '21x9': { x: 0, y: 0.3, w: 1 },
      // District row. Full frame, horizon at 70 %.
      '3x2': { x: 0, y: 0, w: 1 },
    },
  },

  banana: {
    // Banana Beach, Choeng Thale (Unsplash, Max Bvp; location field confirms it): the small cove
    // north of Layan, 3 km from Bang Tao. 2800×2100: turquoise water across the middle, a wooded
    // headland with one villa on it at the right (y 25–55 %), granite boulders along the bottom
    // (y > 72 %), sky with cirrus above.
    file: 'unsplash/banana.jpg',
    crops: {
      // District hero. x 4–100 %, y 23–78 %: headland on the upper third, water in the middle,
      // the boulders enter from the lower-left corner; the person on the rocks at the left edge
      // (x < 4 %) is cut.
      '21x9': { x: 0.04, y: 0.23, w: 0.96 },
      // Spare 3:2. Full width, y 8–97 %.
      '3x2': { x: 0, y: 0.08, w: 1 },
    },
  },

  sunset: {
    // Sunset at Bang Tao beach (Wikimedia Commons, Anton Zelenov, CC BY-SA 4.0; the author asks
    // for «Фото: Anton Zelenov» next to the photo). 2560×1706: horizon at 54 %, casuarina
    // silhouette on the left (x 0–20 %), the headland x 12–58 % / y 45–54 %, the glow centred at
    // x 45 %, boulders in the lower-left corner, wet sand mirrors the sky.
    file: 'wikimedia/sunset.jpg',
    crops: {
      // Footer and Bang Tao page print. Full height from x 8 %: the tree enters from the left
      // edge, the headland and the glow on the upper half, the boulders hold the bottom.
      '4x5': { x: 0.08, y: 0, h: 1 },
      // Spare 3:2. Full frame (by height: the source is a pixel short of 3:2 by width).
      '3x2': { x: 0, y: 0, h: 1 },
    },
  },

  kata: {
    // Kata Beach at sunset, a longtail and Koh Pu island (Unsplash, Andre Mouton, shot from the
    // water). 2800×1867: horizon at 59 %, boat x 10–25 % / y 49–61 %, Koh Pu x 26–44 %, sun at
    // x 64 % / y 48 % behind the southern headland (x 60–100 %), sun path x 64–66 %.
    file: 'unsplash/kata.jpg',
    crops: {
      // Process print «по лодкам». Full height from x 3 %: the longtail on the left third,
      // Koh Pu in the middle, the warm sky carries the top; the sun stays just out of frame.
      '4x5': { x: 0.03, y: 0, h: 1 },
      // Phuket page small print. Full height from x 6 %: boat, island and the sun with the
      // headland on the right third.
      '1x1': { x: 0.06, y: 0, h: 1 },
      // Districts card. Full frame.
      '3x2': { x: 0, y: 0, w: 1 },
    },
    // Golden hour, as for sunset: LIGHT instead of the muddy full grade.
    tune: LIGHT,
  },

  naiharn: {
    // Nai Harn bay from the hill road to Promthep, Rawai (Unsplash, Max Bvp; location field
    // «Rawai», the frame is Nai Harn: lake behind the beach, yachts, Koh Man). 2800×2100:
    // horizon at 42 %, beach x 22–35 % / y 60–70 %, yachts x 40–85 % / y 60–77 %, Koh Man
    // x 68–92 % / y 52–58 %, dry scrub in the foreground (y > 68 %, left edge x < 20 %).
    file: 'unsplash/naiharn.jpg',
    crops: {
      // /services/deal panorama. Full width, y 23–80 %: horizon on the upper third, the bay
      // with the anchorage across the middle, scrub along the bottom edge.
      '21x9': { x: 0, y: 0.23, w: 1 },
      // Districts card / contacts. Full width, y 11–100 %: horizon at 35 %, scrub enters from
      // the lower-left corner.
      '3x2': { x: 0, y: 0.111, w: 1 },
      // Process print. Koh Man, the yachts and the headland, horizon at 32 %.
      '1x1': { x: 0.32, y: 0.15, h: 0.85 },
    },
    // Light haze over the bay (§7 «снять дымку»): LIGHT plus a firmer S-curve, so the full
    // grade does not flatten it further.
    tune: { ...LIGHT, contrast: 0.3 },
  },

  pattaya: {
    // Pattaya from above (Unsplash, Ryutaro Uozumi, location «Pattaya Beach»). 2800×1866:
    // horizon at 43 %, skyline x 49–100 % / y 37–55 %, the beach runs diagonally from the
    // bottom (x 30 %) to the skyline, the city fills the lower right.
    file: 'unsplash/pattaya.jpg',
    crops: {
      // Phuket page «Паттайя». x 10–100 %, y 9.9–100 % (the source is 1866 px high): horizon at 37 %, the beach as a diagonal
      // from the bottom edge into the skyline, sea on the left third.
      '3x2': { x: 0.1, y: 0.099, w: 0.9 },
      // Quiz (Pattaya chosen). Full height from x 28 %: beach diagonal from the lower left,
      // skyline top right.
      '4x5': { x: 0.28, y: 0, h: 1 },
    },
  },

  bali: {
    // Cliffs at Uluwatu temple, Bukit (Unsplash, Alexandra Smielova). 2800×1867: horizon at
    // 32 % (x > 64 %), the cliff runs in from the left (top y 20–50 %), temple roofs on the
    // clifftop x 37–62 % / y 21–26 %, rock islet x 45–51 % / y 56–62 %, surf below.
    file: 'unsplash/bali.jpg',
    crops: {
      // Directions / quiz «по обрыву». Full height from x 30 %: the cliff face enters from the
      // left edge, islet and surf below, open sea and horizon on the right.
      '4x5': { x: 0.3, y: 0, h: 1 },
      // Full frame: horizon already on the upper third.
      '3x2': { x: 0, y: 0, w: 1 },
      // Quiz mobile header. Full width, y 10.6–74.8 %: horizon at 33 %, the green slope at the
      // bottom left and the white water on the lower right.
      '21x9': { x: 0, y: 0.106, w: 1 },
    },
  },

  villa: {
    // Infinity pool of a hillside villa over a bay, Koh Samui (Unsplash, big.tiny.belly).
    // «Пример формата». 2800×1575 (16:9 source): pavilion column and planters on the left
    // (x 0–30 %), the pool edge runs to the right, islands and a far shore on the horizon at 45 %.
    file: 'unsplash/villa.jpg',
    crops: {
      // Hero print (home, deal, formats). Full height, x 30–75 %: pool edge, sea and islands,
      // the planter at the left edge.
      '4x5': { x: 0.3, y: 0, h: 1 },
      // Bang Tao page small print. Full height from x 28 %.
      '1x1': { x: 0.28, y: 0, h: 1 },
      // Formats card and OG. Full height, x 10–94 %: part of the pavilion, the whole pool.
      '3x2': { x: 0.1, y: 0, h: 1 },
    },
  },

  dubai: {
    // Dubai Marina skyline across the water from West Beach, Palm Jumeirah (Unsplash, Jeffrey
    // Francisco). 2800×2100: skyline x 0–100 % / y 30–62 % (a tower under construction with
    // cranes at x 68–75 %), beach diagonal at the lower left. Cut by every crop: a beach-club
    // pavilion with a small red sign on its facade (x 4–13 %, y 75–82 %) and the umbrellas and
    // roofs along the bottom (y > 87 %).
    file: 'unsplash/dubai.jpg',
    crops: {
      // Directions card. x 0–67.5 %, y 13–73 %: the Marina cluster centred, skyline base at 82 %,
      // the beach in the lower-left corner; ends above the pavilion (y 75 %) and left of the crane
      // tower (x 68 %), which took the centre of a wider crop. 1890 px wide.
      '3x2': { x: 0, y: 0.13, w: 0.675 },
      // Quiz (Dubai chosen). The Marina cluster (x 30–55 %) with the water and beach below,
      // y 12–86 %, x 19–63 %: right of the pavilion, stops left of the crane tower.
      '4x5': { x: 0.19, y: 0.12, h: 0.74 },
    },
  },

  cambodia: {
    // Two leaning palms on the beach at sunset, Koh Rong (Unsplash, Jules Nehlig). 2800×1867:
    // horizon at 66 %, left palm x 5–35 %, right palm x 62–85 %, islands on the horizon between
    // them, pale sky, wet sand in the foreground.
    file: 'unsplash/cambodia.jpg',
    crops: {
      // Directions / quiz. Full height, x 10–63 %: the left palm whole, the islands, the trunk of
      // the right palm at the edge.
      '4x5': { x: 0.1, y: 0, h: 1 },
      // Full frame, less a hairline (the source is 2800×1867, half a pixel over 3:2).
      '3x2': { x: 0, y: 0.002, h: 0.996 },
      // Quiz mobile header. Full width, y 20–84 %: both crowns kept, less sky.
      '21x9': { x: 0, y: 0.2, w: 1 },
    },
    // Pastel sunset: the full grade turned the sky grey. LIGHT.
    tune: LIGHT,
  },

  kamala: {
    // A hidden beach under jungle hills, Kamala (Unsplash, Max Bvp). 2800×1867: the cove and
    // its sand in the lower-left quarter, forested slopes left and right, Patong's hill and
    // houses across the bay under a rain cloud, banana leaves in the lower-right corner.
    file: 'unsplash/kamala.jpg',
    crops: {
      // «От звонка до ключей» third photo. x 3–97 %, y 6–100 %: a little less cloud.
      '3x2': { x: 0.03, y: 0.06, h: 0.94 },
    },
    // Overcast, already muted: the full grade went flat. LIGHT.
    tune: LIGHT,
  },

  naiharnRocks: {
    // Nai Harn beach from straight above (Unsplash, Aleksandr Galichkin). Replaces the hazy
    // rocks shot (key name kept). 2800×1575: sea top-left, the sand as a diagonal, umbrellas
    // x 28–47 %, trees lower right, a red roof and service buildings at x > 80 %, y > 75 %.
    file: 'unsplash/naiharnRocks.jpg',
    crops: {
      // x 0–72 %, y 0–85 %: the beach diagonal from corner to corner, no roofs.
      '3x2': { x: 0, y: 0, h: 0.85 },
    },
  },

  condo: {
    // Low-rise condominium with a shared pool, Hua Hin (Unsplash, allPhoto Bangkok).
    // «Пример формата». 2800×1867: tree on the left (x 0–27 %), terraces x 20–100 %, pool
    // x 10–55 % / y 70–82 %, two sunbathers at x 4–12 % (cut by every crop), no signage.
    file: 'unsplash/condo.jpg',
    crops: {
      // Formats card. x 12–100 %, y 6–94 %: the terraces step back along the pool, no people.
      '3x2': { x: 0.12, y: 0.06, w: 0.88 },
      // Full height from x 30 %: the nearest block with the balconies, the pool and the garden.
      '4x5': { x: 0.3, y: 0, h: 1 },
    },
  },

  house: {
    // A modern single-storey house with a pool and a lawn (Unsplash, Ronaldo Rizzutti; no
    // location). «Пример формата». 2800×1855: the house across the middle (y 25–65 %), pool at
    // the lower right (x 55–85 %), lawn across the bottom, trees on both sides.
    file: 'unsplash/house.jpg',
    crops: {
      // Formats card. Full frame (by height: the source is short of 3:2 by width).
      '3x2': { x: 0, y: 0, h: 1 },
      // The living wing with the pool, x 28–81 %, full height.
      '4x5': { x: 0.28, y: 0, h: 1 },
    },
  },
}

/* -------------------------------------------------------------------------------------------
 * Grade «Документальный дневной свет» (§3.6)
 *
 * The art direction is written in Lightroom terms; sharp has no HSL panel, so the mapping is:
 *
 *  §3.6                               here
 *  баланс −150 K от авто               sharp .recomb() diagonal: R ×0.991, G ×1.002, B ×1.011
 *                                      (Planck locus 5500 → 5650 K ≈ 5 mired, renormalised to keep
 *                                      luma). Approximation: no tint axis.
 *  насыщенность −18 %                  chroma ×0.82 around Rec.709 luma (luma-preserving, unlike
 *                                      sharp .modulate({saturation}), which works in LCh and lets
 *                                      saturated blues shift in brightness).
 *  небо −30 % и +8 яркости             «blue» band, hue 185–245°: chroma ×0.70, +8/255 lightness.
 *  бирюза воды −5 %                    «aqua» band, hue 155–205°: chroma ×0.95.
 *  зелень −20 % и +4 к жёлтому         «green» band, hue 60–150°: chroma ×0.80, hue −4° (toward
 *                                      yellow) with a luma-preserving hue-rotate matrix.
 *  песок и кожа −10 %                  «orange» band, hue 0–60°: chroma ×0.90.
 *  чёрная точка 14, светлые до 245     sharp .linear(231/255, 14): output levels 14…245.
 *  без HDR, зерна, виньетки, дуотона   none of those operations exist in the pipeline.
 *
 * Band weights fall off as cos² from the band centre, so neighbouring hues blend without seams,
 * and are gated by chroma (pixels with max−min < 2 % get no selective change: greys keep their hue).
 * Sky and water are told apart by hue only, exactly like the Lightroom HSL panel: deep-blue sea
 * gets the «sky» treatment too.
 *
 * Added to keep the look from going grey: a gentle S-curve (15 % blend toward smoothstep) before
 * the levels squeeze. Midtone slope ends at ≈ 0.97 instead of 0.91, the ends are still lifted to
 * 14 and capped at 245.
 *
 * Per-photo `tune` (only where the source needs it to match the set; each use is commented):
 *   saturation  replaces the global 0.82 (bands still apply on top)
 *   contrast    replaces the S-curve amount 0.15
 *   stretch     0…1, neutral input levels from the luma 0.5 / 99.5 percentiles (lifts a grey veil)
 *   clahe       { tile, maxSlope }: sharp .clahe() local contrast, tile as a fraction of the frame
 *               (slopes ≤ 4 so it never reads as HDR)
 *   bands       0…1, strength of the selective bands (1 = as listed in GRADE.bands)
 *
 * `LIGHT` below is the lighter grade for Unsplash sources that already arrive muted and natural
 * (soft morning light, haze, pale facades): the full grade turned their deep-blue water grey,
 * because the «sky» band (−30 %) hits deep blue sea too, and on top of −18 % global it reads as
 * overcast. LIGHT keeps the direction of §3.6 at roughly half strength. The punchy sources
 * (turquoise bays, blue skies, HDR-ish real-estate shots) take the full grade unchanged, which is
 * what pulls the set together. Every photo using LIGHT says so in its config comment.
 * ----------------------------------------------------------------------------------------- */

export const GRADE = {
  whiteBalance: [0.991, 1.002, 1.011],
  saturation: 0.82,
  bands: [
    { name: 'orange: sand, skin', center: 30, half: 30, sat: 0.9 },
    { name: 'green: foliage', center: 105, half: 45, sat: 0.8, hue: -4 },
    { name: 'aqua: water', center: 180, half: 25, sat: 0.95 },
    { name: 'blue: sky', center: 215, half: 30, sat: 0.7, lum: 8 },
  ],
  curve: 0.15,
  blackPoint: 14,
  whitePoint: 245,
}

export const JPEG = { quality: 86, progressive: true, mozjpeg: true, chromaSubsampling: '4:2:0' }

/* ------------------------------------------------------------------------------------------- */

const clamp01 = (v) => (v < 0 ? 0 : v > 1 ? 1 : v)
const smoothstep = (a, b, v) => {
  const t = clamp01((v - a) / (b - a))
  return t * t * (3 - 2 * t)
}

const sourceMeta = new Map()
export async function getSourceMeta(key) {
  if (!sourceMeta.has(key)) {
    // Read through fs: long Windows paths (MAX_PATH) trip libvips, see the note in main().
    const m = await sharp(await fs.readFile(path.join(SRC_DIR, PHOTOS[key].file))).metadata()
    // Respect EXIF orientation (none of the current files are rotated, but new ones may be).
    const swap = (m.orientation ?? 1) >= 5
    sourceMeta.set(key, { width: swap ? m.height : m.width, height: swap ? m.width : m.height })
  }
  return sourceMeta.get(key)
}

export function cropRect(key, ratio, src) {
  const c = PHOTOS[key].crops[ratio]
  const left = Math.round(c.x * src.width)
  const top = Math.round(c.y * src.height)
  let width
  let height
  if (c.h != null) {
    height = Math.round(c.h * src.height)
    width = Math.round(height * RATIOS[ratio])
  } else {
    width = Math.round(c.w * src.width)
    height = Math.round(width / RATIOS[ratio])
  }
  if (left < 0 || top < 0 || left + width > src.width || top + height > src.height) {
    throw new Error(
      `${key} ${ratio}: crop ${left},${top} ${width}×${height} leaves the ${src.width}×${src.height} frame`,
    )
  }
  return { left, top, width, height }
}

/** Long edge ≤ MAX_EDGE, never upscaled, height derived from the ratio (21:9 → 2400×1029). */
export function outputSize(rect, ratio) {
  const scale = Math.min(1, MAX_EDGE / Math.max(rect.width, rect.height))
  const r = RATIOS[ratio]
  if (r >= 1) {
    const width = Math.round(rect.width * scale)
    return { width, height: Math.round(width / r) }
  }
  const height = Math.round(rect.height * scale)
  return { width: Math.round(height * r), height }
}

export async function plan(key, ratio) {
  const src = await getSourceMeta(key)
  const rect = cropRect(key, ratio, src)
  return { rect, size: outputSize(rect, ratio) }
}

// Precomputed tables: band weight per integer hue, S-curve per 8-bit level.
const BAND_LUT = GRADE.bands.map((b) => {
  const lut = new Float32Array(360)
  for (let h = 0; h < 360; h++) {
    let d = Math.abs(h - b.center) % 360
    if (d > 180) d = 360 - d
    lut[h] = d >= b.half ? 0 : Math.cos((Math.PI / 2) * (d / b.half)) ** 2
  }
  return lut
})
/** S-curve: blend of identity and smoothstep, `amount` 0…1 (0.15 → midtone slope 1.075). */
function curveLut(amount) {
  const lut = new Uint8ClampedArray(256)
  for (let v = 0; v < 256; v++) {
    const x = v / 255
    const s = x * x * (3 - 2 * x)
    lut[v] = Math.round((x + amount * (s - x)) * 255)
  }
  return lut
}

function percentile(hist, total, p) {
  const target = total * p
  let acc = 0
  for (let v = 0; v < 256; v++) {
    acc += hist[v]
    if (acc >= target) return v
  }
  return 255
}

/** Selective colour + tone curve on an 8-bit RGB buffer, in place. */
function gradePixels(data, channels, tune = {}) {
  const n = data.length / channels
  const CURVE_LUT = curveLut(tune.contrast ?? GRADE.curve)

  // Per-photo `stretch`: neutral input levels from the luma 0.5 / 99.5 percentiles (same
  // offset and gain on R, G, B, so the colour balance is untouched). Lifts a grey veil.
  let lo = 0
  let gain = 1
  if (tune.stretch) {
    const hist = new Uint32Array(256)
    for (let i = 0; i < data.length; i += channels) {
      hist[Math.round(0.2126 * data[i] + 0.7152 * data[i + 1] + 0.0722 * data[i + 2])]++
    }
    lo = (percentile(hist, n, 0.005) / 255) * tune.stretch
    const hi = 1 - (1 - percentile(hist, n, 0.995) / 255) * tune.stretch
    gain = 1 / (hi - lo)
  }

  const baseSat = tune.saturation ?? GRADE.saturation
  const bandStrength = tune.bands ?? 1
  const bands = GRADE.bands
  const nb = bands.length
  for (let i = 0; i < data.length; i += channels) {
    let r = data[i] / 255
    let g = data[i + 1] / 255
    let b = data[i + 2] / 255
    if (tune.stretch) {
      r = clamp01((r - lo) * gain)
      g = clamp01((g - lo) * gain)
      b = clamp01((b - lo) * gain)
    }

    const max = r > g ? (r > b ? r : b) : g > b ? g : b
    const min = r < g ? (r < b ? r : b) : g < b ? g : b
    const c = max - min
    let sat = baseSat
    let lum = 0
    let rot = 0
    if (c > 0.02) {
      let h
      if (max === r) h = ((g - b) / c) % 6
      else if (max === g) h = (b - r) / c + 2
      else h = (r - g) / c + 4
      h *= 60
      if (h < 0) h += 360
      const hi = Math.min(359, h | 0)
      const gate = smoothstep(0.02, 0.12, c) * bandStrength
      for (let k = 0; k < nb; k++) {
        const w = BAND_LUT[k][hi] * gate
        if (w === 0) continue
        const band = bands[k]
        sat *= 1 - w * (1 - band.sat)
        if (band.lum) lum += w * band.lum
        if (band.hue) rot += w * band.hue
      }
    }

    // Hue rotation around the grey axis (CSS hue-rotate matrix, keeps luma).
    if (rot !== 0) {
      const a = Math.cos((rot * Math.PI) / 180)
      const s = Math.sin((rot * Math.PI) / 180)
      const r2 =
        r * (0.213 + a * 0.787 - s * 0.213) + g * (0.715 - a * 0.715 - s * 0.715) + b * (0.072 - a * 0.072 + s * 0.928)
      const g2 =
        r * (0.213 - a * 0.213 + s * 0.143) + g * (0.715 + a * 0.285 + s * 0.14) + b * (0.072 - a * 0.072 - s * 0.283)
      const b2 =
        r * (0.213 - a * 0.213 - s * 0.787) + g * (0.715 - a * 0.715 + s * 0.715) + b * (0.072 + a * 0.928 + s * 0.072)
      r = r2
      g = g2
      b = b2
    }

    // Saturation around Rec.709 luma.
    const y = 0.2126 * r + 0.7152 * g + 0.0722 * b
    r = y + (r - y) * sat
    g = y + (g - y) * sat
    b = y + (b - y) * sat

    // Band lightness (sky +8).
    if (lum !== 0) {
      const d = lum / 255
      r += d
      g += d
      b += d
    }

    data[i] = CURVE_LUT[Math.round(clamp01(r) * 255)]
    data[i + 1] = CURVE_LUT[Math.round(clamp01(g) * 255)]
    data[i + 2] = CURVE_LUT[Math.round(clamp01(b) * 255)]
  }
}

/**
 * Crop (+ grade) one photo/ratio. Returns a JPEG buffer.
 * `grade: false` gives the plain crop at the same size, for before/after reviews.
 */
export async function render(key, ratio, { grade = true } = {}) {
  const { rect, size } = await plan(key, ratio)
  let pipeline = sharp(await fs.readFile(path.join(SRC_DIR, PHOTOS[key].file)))
    .rotate()
    .extract(rect)
    .resize(size.width, size.height, { fit: 'cover', kernel: 'lanczos3' })
    .removeAlpha()
    .toColourspace('srgb')

  if (!grade) return pipeline.jpeg(JPEG).toBuffer()

  const tune = PHOTOS[key].tune ?? {}

  // Pass 0 (sharp, per photo): gentle local contrast against haze. Its own pass because
  // sharp's CLAHE needs 8-bit input and runs after recomb inside one pipeline.
  if (tune.clahe) {
    // Tile size as a fraction of the output, so it does not depend on the resolution.
    const { tile, maxSlope } = tune.clahe
    const pre = await pipeline
      .clahe({ width: Math.round(size.width * tile), height: Math.round(size.height * tile), maxSlope })
      .raw()
      .toBuffer({ resolveWithObject: true })
    pipeline = sharp(pre.data, { raw: { width: pre.info.width, height: pre.info.height, channels: pre.info.channels } })
  }

  // Pass 1 (sharp): white balance → raw 8-bit RGB.
  const wb = GRADE.whiteBalance
  pipeline = pipeline.recomb([
    [wb[0], 0, 0],
    [0, wb[1], 0],
    [0, 0, wb[2]],
  ])
  const { data, info } = await pipeline.raw().toBuffer({ resolveWithObject: true })

  // Pass 2 (JS): selective colour, saturation, sky lift, S-curve.
  gradePixels(data, info.channels, tune)

  // Pass 3 (sharp): output levels 14…245 → JPEG.
  const a = (GRADE.whitePoint - GRADE.blackPoint) / 255
  return sharp(data, { raw: { width: info.width, height: info.height, channels: info.channels } })
    .linear(a, GRADE.blackPoint)
    .jpeg(JPEG)
    .toBuffer()
}

export const outName = (key, ratio) => `${key}-${ratio}.jpg`

export async function buildManifest() {
  const manifest = {}
  for (const key of Object.keys(PHOTOS)) {
    manifest[key] = {}
    for (const ratio of Object.keys(PHOTOS[key].crops)) {
      const { size } = await plan(key, ratio)
      manifest[key][ratio] = { src: `/photos/graded/${outName(key, ratio)}`, ...size }
    }
  }
  return manifest
}

const RATIO_ORDER = ['21x9', '3x2', '4x5', '1x1']

async function writePhotosTs(manifest) {
  let ts
  try {
    ts = await fs.readFile(PHOTOS_TS, 'utf8')
  } catch {
    console.warn(`! ${path.relative(SITE_DIR, PHOTOS_TS)} not found, skipped`)
    return
  }
  const start = '// <generated:photos>'
  const end = '// </generated:photos>'
  const i = ts.indexOf(start)
  const j = ts.indexOf(end)
  if (i < 0 || j < i) {
    console.warn(`! no ${start} … ${end} block in photos.ts, skipped`)
    return
  }
  const lines = [start, '// Written by scripts/photos/grade.mjs from the crop config. Do not edit by hand.', 'const graded = {']
  for (const [key, ratios] of Object.entries(manifest)) {
    lines.push(`  ${key}: {`)
    for (const ratio of RATIO_ORDER) {
      const p = ratios[ratio]
      if (p) lines.push(`    '${ratio}': { src: '${p.src}', width: ${p.width}, height: ${p.height} },`)
    }
    lines.push('  },')
  }
  lines.push('} as const satisfies Record<PhotoKey, Partial<Record<Ratio, PhotoAsset>>>')
  const next = ts.slice(0, i) + lines.join('\n') + '\n' + ts.slice(j)
  if (next !== ts) {
    await fs.writeFile(PHOTOS_TS, next)
    console.log(`✓ ${path.relative(SITE_DIR, PHOTOS_TS)} updated`)
  } else {
    console.log(`= ${path.relative(SITE_DIR, PHOTOS_TS)} unchanged`)
  }
}

async function main() {
  const args = process.argv.slice(2)
  const onlyArg = args.find((a, i) => args[i - 1] === '--only') ?? args.find((a) => a.startsWith('--only='))?.slice(7)
  const only = onlyArg ? onlyArg.split(',').map((s) => s.trim()) : null
  for (const k of only ?? []) if (!PHOTOS[k]) throw new Error(`unknown key "${k}"`)

  await fs.mkdir(OUT_DIR, { recursive: true })
  const manifest = await buildManifest()
  const wanted = new Set(Object.entries(manifest).flatMap(([k, r]) => Object.keys(r).map((ratio) => outName(k, ratio))))

  const t0 = Date.now()
  for (const key of Object.keys(PHOTOS)) {
    if (only && !only.includes(key)) continue
    for (const ratio of RATIO_ORDER) {
      if (!PHOTOS[key].crops[ratio]) continue
      const buf = await render(key, ratio)
      // fs instead of sharp.toFile: the project path is long enough to hit MAX_PATH in libvips on Windows.
      await fs.writeFile(path.join(OUT_DIR, outName(key, ratio)), buf)
      const { width, height } = manifest[key][ratio]
      console.log(`  ${outName(key, ratio).padEnd(24)} ${`${width}×${height}`.padStart(10)}  ${(buf.length / 1024).toFixed(0).padStart(5)} KB`)
    }
  }

  // Remove outputs that are no longer in the config.
  for (const f of await fs.readdir(OUT_DIR)) {
    if (/^[A-Za-z]+-(21x9|3x2|4x5|1x1)\.jpg$/.test(f) && !wanted.has(f)) {
      await fs.rm(path.join(OUT_DIR, f))
      console.log(`  - removed stale ${f}`)
    }
  }
  console.log(`✓ graded in ${((Date.now() - t0) / 1000).toFixed(1)} s → ${path.relative(SITE_DIR, OUT_DIR)}`)

  // The file names never change, and next/image caches its AVIF/WebP by URL, so a regraded photo
  // would keep being served from the old optimised copy. Drop that cache (restart `next start`).
  const imageCache = path.join(SITE_DIR, '.next/cache/images')
  await fs.rm(imageCache, { recursive: true, force: true })
  console.log(`✓ cleared ${path.relative(SITE_DIR, imageCache)} (restart the server)`)

  if (!args.includes('--no-ts')) await writePhotosTs(manifest)
}

if (import.meta.url === pathToFileURL(process.argv[1] ?? '').href) {
  main().catch((err) => {
    console.error(err)
    process.exit(1)
  })
}
