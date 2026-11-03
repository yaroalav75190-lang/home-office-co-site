#!/usr/bin/env node
/**
 * Review sheets for the graded photos (nothing here is shipped).
 *
 *   node scripts/photos/review.mjs sheet   [--keys hero,phuket] [--tile 240] [--cols 2] [--out file.jpg]
 *       Contact sheet of public/photos/graded: one row per photo, every ratio at the same height,
 *       rows flowing down `cols` columns.
 *   node scripts/photos/review.mjs compare --key hero --ratio 21x9 [--width 1400] [--out file.jpg]
 *       Before/after: the plain crop above the graded file, same size.
 *
 * Default output folder: <os tmp>/home-office-photos/. Run grade.mjs first.
 */
import fs from 'node:fs/promises'
import os from 'node:os'
import path from 'node:path'
import sharp from 'sharp'
import { OUT_DIR, PHOTOS, outName, render } from './grade.mjs'

const RATIO_ORDER = ['21x9', '3x2', '4x5', '1x1']
const BG = { r: 243, g: 243, b: 239 } // --color-salt
const INK = '#10262B'

const args = process.argv.slice(2)
const mode = args[0]
const opt = (name, fallback) => {
  const i = args.indexOf(`--${name}`)
  return i >= 0 ? args[i + 1] : fallback
}
const outDefault = path.join(os.tmpdir(), 'home-office-photos')

const esc = (s) => s.replace(/&/g, '&amp;').replace(/</g, '&lt;')
const label = (text, width, height = 26, size = 15) =>
  Buffer.from(
    `<svg width="${width}" height="${height}" xmlns="http://www.w3.org/2000/svg">` +
      `<text x="0" y="${height - 8}" font-family="Arial, sans-serif" font-size="${size}" fill="${INK}">${esc(text)}</text></svg>`,
  )

const label2 = (lines, width, height) =>
  Buffer.from(
    `<svg width="${width}" height="${height}" xmlns="http://www.w3.org/2000/svg">` +
      lines
        .map((l, i) => `<text x="0" y="${16 + i * 17}" font-family="Arial, sans-serif" font-size="14" fill="${INK}">${esc(l)}</text>`)
        .join('') +
      '</svg>',
  )

async function write(file, buf) {
  await fs.mkdir(path.dirname(file), { recursive: true })
  await fs.writeFile(file, buf) // fs, not sharp.toFile: long Windows paths
  console.log(`✓ ${file}`)
}

async function sheet() {
  const keys = (opt('keys') ?? Object.keys(PHOTOS).join(',')).split(',')
  const tileH = Number(opt('tile', 240))
  const cols = Number(opt('cols', 2))
  const gap = 16
  const labelH = 40
  const rows = []
  for (const key of keys) {
    const tiles = []
    let x = 0
    for (const ratio of RATIO_ORDER) {
      if (!PHOTOS[key].crops[ratio]) continue
      const file = path.join(OUT_DIR, outName(key, ratio))
      const meta = await sharp(file).metadata()
      const stat = await fs.stat(file)
      const w = Math.round((tileH * meta.width) / meta.height)
      const img = await sharp(file).resize(w, tileH).toBuffer()
      tiles.push({ img, x, w, lines: [`${key} ${ratio}`, `${meta.width}×${meta.height}, ${Math.round(stat.size / 1024)} KB`] })
      x += w + gap
    }
    rows.push({ tiles, width: x - gap })
  }
  // Rows flow down the columns: ceil(n / cols) rows per column.
  const perCol = Math.ceil(rows.length / cols)
  const colW = []
  rows.forEach((r, i) => {
    const c = Math.floor(i / perCol)
    colW[c] = Math.max(colW[c] ?? 0, r.width)
  })
  const colX = colW.map((_, c) => gap + colW.slice(0, c).reduce((a, w) => a + w + gap * 3, 0))
  const rowH = tileH + labelH + gap
  const width = colX.at(-1) + colW.at(-1) + gap
  const height = gap + perCol * rowH
  const composites = []
  rows.forEach((r, i) => {
    const c = Math.floor(i / perCol)
    const top = gap + (i % perCol) * rowH
    for (const t of r.tiles) {
      const left = colX[c] + t.x
      composites.push({ input: t.img, left, top })
      composites.push({ input: label2(t.lines, Math.max(t.w, 10), labelH), left, top: top + tileH })
    }
  })
  const buf = await sharp({ create: { width, height, channels: 3, background: BG } })
    .composite(composites)
    .jpeg({ quality: 88 })
    .toBuffer()
  await write(opt('out', path.join(outDefault, 'contact-sheet.jpg')), buf)
}

async function compare() {
  const key = opt('key')
  const ratio = opt('ratio')
  if (!PHOTOS[key]?.crops[ratio]) throw new Error(`no crop ${key} ${ratio}`)
  const width = Number(opt('width', 1400))
  const [before, after] = await Promise.all([render(key, ratio, { grade: false }), render(key, ratio)])
  const b = await sharp(before).resize(width).toBuffer({ resolveWithObject: true })
  const a = await sharp(after).resize(width).toBuffer()
  const h = b.info.height
  const labelH = 30
  const buf = await sharp({ create: { width, height: (h + labelH) * 2, channels: 3, background: BG } })
    .composite([
      { input: label(`${key} ${ratio}: before (crop only)`, width, labelH, 18), left: 0, top: 0 },
      { input: b.data, left: 0, top: labelH },
      { input: label(`${key} ${ratio}: after (graded)`, width, labelH, 18), left: 0, top: h + labelH },
      { input: a, left: 0, top: h + labelH * 2 },
    ])
    .jpeg({ quality: 90 })
    .toBuffer()
  await write(opt('out', path.join(outDefault, `compare-${key}-${ratio}.jpg`)), buf)
}

const modes = { sheet, compare }
if (!modes[mode]) {
  console.error('usage: review.mjs sheet|compare [options] (see header)')
  process.exit(1)
}
modes[mode]().catch((err) => {
  console.error(err)
  process.exit(1)
})
