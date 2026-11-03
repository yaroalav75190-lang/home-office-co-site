#!/usr/bin/env node
// Downloads raw OpenStreetMap data from the Overpass API into scripts/coast/raw/.
// The build (build-coast.mjs) reads only these files, so it never needs the network.
//
//   node scripts/coast/fetch-coast.mjs            # fetch only sources that are missing
//   node scripts/coast/fetch-coast.mjs --force    # re-download everything
//   node scripts/coast/fetch-coast.mjs bali       # fetch one source (by id)
//
// Etiquette: one request per source, sequential, a pause between requests, exponential
// backoff on 429/5xx, and a User-Agent with a contact address.
// Override the endpoint with OVERPASS_URL if the main instance is down for a long time.

import { mkdir, writeFile, access } from "node:fs/promises";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";
import { SOURCES } from "./regions.mjs";

const HERE = dirname(fileURLToPath(import.meta.url));
const RAW = join(HERE, "raw");
const ENDPOINT = process.env.OVERPASS_URL || "https://overpass-api.de/api/interpreter";
const USER_AGENT = "HomeOfficeCo-site-coast/1.0 (static site build; contact: yaroalav75190@gmail.com)";
const MAX_ATTEMPTS = 8;

const sleep = (ms) => new Promise((r) => setTimeout(r, ms));

async function exists(path) {
  try {
    await access(path);
    return true;
  } catch {
    return false;
  }
}

async function overpass(query) {
  let wait = 15_000;
  for (let attempt = 1; attempt <= MAX_ATTEMPTS; attempt++) {
    let res;
    try {
      res = await fetch(ENDPOINT, {
        method: "POST",
        headers: {
          "User-Agent": USER_AGENT,
          "Content-Type": "application/x-www-form-urlencoded; charset=UTF-8",
          Accept: "application/json",
        },
        body: "data=" + encodeURIComponent(query),
      });
    } catch (err) {
      console.warn(`  network error (${err.message}), retry in ${wait / 1000}s`);
      await sleep(wait);
      wait *= 2;
      continue;
    }
    if (res.ok) {
      const text = await res.text();
      const json = JSON.parse(text);
      if (json.remark && /runtime error|timed out/i.test(json.remark)) {
        throw new Error("Overpass remark: " + json.remark);
      }
      return json;
    }
    if (res.status === 429 || res.status >= 500) {
      console.warn(`  HTTP ${res.status}, attempt ${attempt}/${MAX_ATTEMPTS}, retry in ${wait / 1000}s`);
      await res.text().catch(() => "");
      await sleep(wait);
      wait = Math.min(wait * 2, 240_000);
      continue;
    }
    throw new Error(`HTTP ${res.status}: ${(await res.text()).slice(0, 400)}`);
  }
  throw new Error("Overpass unavailable after retries");
}

async function main() {
  const args = process.argv.slice(2);
  const force = args.includes("--force");
  const only = args.filter((a) => !a.startsWith("--"));
  await mkdir(RAW, { recursive: true });

  let first = true;
  for (const src of SOURCES) {
    if (only.length && !only.includes(src.id)) continue;
    const file = join(RAW, `${src.id}.json`);
    if (!force && (await exists(file))) {
      console.log(`skip ${src.id} (raw/${src.id}.json exists)`);
      continue;
    }
    if (!first) await sleep(10_000); // be polite between requests
    first = false;
    console.log(`fetch ${src.id} from ${ENDPOINT}`);
    const json = await overpass(src.query);
    json.__fetched = { endpoint: ENDPOINT, at: new Date().toISOString(), query: src.query };
    await writeFile(file, JSON.stringify(json));
    const ways = json.elements.filter((e) => e.type === "way").length;
    console.log(`  saved raw/${src.id}.json: ${json.elements.length} elements (${ways} ways), OSM base ${json.osm3s?.timestamp_osm_base}`);
  }
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
