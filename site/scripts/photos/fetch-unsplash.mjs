#!/usr/bin/env node
/**
 * Downloads the picked Unsplash sources (scripts/photos/unsplash.json) into
 * photos-src/unsplash/{key}.jpg at 2800 px wide (`raw` + &w=2800&q=86&fm=jpg).
 * Existing files are kept unless --force. Then run grade.mjs.
 *
 *   cd site && node scripts/photos/fetch-unsplash.mjs [--only hero,bali] [--force]
 */
import fs from 'node:fs/promises'
import path from 'node:path'
import { fileURLToPath } from 'node:url'

const HERE = path.dirname(fileURLToPath(import.meta.url))
const OUT = path.resolve(HERE, '../../photos-src/unsplash')
const picks = JSON.parse(await fs.readFile(path.join(HERE, 'unsplash.json'), 'utf8'))

const args = process.argv.slice(2)
const onlyArg = args.find((a, i) => args[i - 1] === '--only')
const only = onlyArg ? onlyArg.split(',') : null
const force = args.includes('--force')

await fs.mkdir(OUT, { recursive: true })
for (const [key, p] of Object.entries(picks)) {
  if (key.startsWith('_') || (only && !only.includes(key))) continue
  const file = path.join(OUT, `${key}.jpg`)
  if (!force) {
    try {
      await fs.access(file)
      console.log(`= ${key}.jpg exists`)
      continue
    } catch {}
  }
  const res = await fetch(`${p.raw}&w=2800&q=86&fm=jpg`, { headers: { 'user-agent': 'Mozilla/5.0 (home-office-photos)' } })
  if (!res.ok) throw new Error(`${key}: HTTP ${res.status}`)
  const buf = Buffer.from(await res.arrayBuffer())
  await fs.writeFile(file, buf)
  console.log(`✓ ${key}.jpg ${(buf.length / 1024).toFixed(0)} KB  (${p.author}, ${p.page})`)
}
