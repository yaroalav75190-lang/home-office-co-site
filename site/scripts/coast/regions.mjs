// Configuration for the coastline pipeline: what to download (SOURCES) and how to turn it
// into SVG paths (REGIONS). Bboxes are [south, west, north, east] in degrees (Overpass order).

const coastlineQuery = ([s, w, n, e]) =>
  `[out:json][timeout:120];way["natural"="coastline"](${s},${w},${n},${e});out geom;`;

export const SOURCES = [
  // Whole island + a margin so every way of the Phuket ring is returned and the ring closes.
  { id: "phuket", query: coastlineQuery([7.7, 98.22, 8.25, 98.5]) },
  {
    // Named beaches and capes, used once to choose the district anchors below (kept for provenance).
    id: "phuket-features",
    query:
      `[out:json][timeout:60];(` +
      `node["natural"~"^(beach|cape)$"]["name"](7.74,98.24,8.21,98.48);` +
      `way["natural"~"^(beach|cape)$"]["name"](7.74,98.24,8.21,98.48);` +
      `);out center tags;`,
  },
  { id: "bali", query: coastlineQuery([-8.88, 115.06, -8.68, 115.27]) },
  { id: "dubai", query: coastlineQuery([25.05, 55.09, 25.25, 55.31]) },
  { id: "sihanoukville", query: coastlineQuery([10.54, 103.44, 10.71, 103.61]) },
];

// ---------------------------------------------------------------------------------------
// Phuket district anchors, north -> south along the west/south coast. Each anchor is snapped
// to the nearest vertex of the OSM island ring; districts are the ring between two anchors.
// Sources (looked up 2 Nov 2026):
//   OSM natural=cape / natural=beach in raw/phuket-features.json (OSM base 2026-11-02T13:28Z),
//   where a beach has no named OSM object, the bay was read off the coastline itself
//   (raw/phuket.json) and checked against the Wikipedia coordinates of the beach.
//
//   laem-son-n   8.0393, 98.2719  Laem Son (แหลมสน), OSM cape north of Layan: start of Layan & phuket-west
//   layan-s      8.0300, 98.2870  rocks / lagoon mouth between Layan Beach (OSM 8.0346, 98.2841)
//                                 and Bang Tao Beach (OSM 8.0083, 98.2886)
//   laem-son-s   7.9879, 98.2703  Laem Son (แหลมสน), OSM cape closing Bang Tao bay in the south (Pansea)
//   laem-mai-phai 7.9703, 98.2764 Laem Mai Phai (แหลมไม้พาย), OSM cape south of Surin: Kamala starts
//                                 (Laem Sing beach + Kamala beach; Wikipedia Kamala 7.95, 98.283)
//   kamala-s     7.9416, 98.2605  western tip of the Kamala headland; latitude of OSM cape
//                                 Laem Thai Phao (แหลมท้ายเภา, 7.9416, 98.2721), taken on the coast
//   karon-n      7.8683, 98.2731  headland north of Karon Noi / Relax Bay (OSM Karon Noi 7.8647, 98.2824)
//   kata-noi-s   7.7990, 98.2960  rocks south of Kata Noi (Laem Sai 7.8254, 98.2907 and Laem Rap
//                                 7.8120, 98.2960 separate Karon | Kata | Kata Noi inside the segment)
//   nai-harn-n   7.7795, 98.2868  headland west of Krathing Beach (OSM 7.7779, 98.2951), Nai Harn bay
//   laem-ka      7.7764, 98.3361  Laem Ka (แหลมกา, OSM cape 7.7791, 98.3348): Rawai ends, Chalong bay starts
//   chalong-e    7.8408, 98.3756  head of Ao Chalong (north shore past Chalong pier): end of Chalong & phuket-west
export const ANCHORS = [
  { id: "laem-son-n", lat: 8.0393, lon: 98.2719 },
  { id: "layan-s", lat: 8.03, lon: 98.287 },
  { id: "laem-son-s", lat: 7.9879, lon: 98.2703 },
  { id: "laem-mai-phai", lat: 7.9703, lon: 98.2764 },
  { id: "kamala-s", lat: 7.9416, lon: 98.2605 },
  { id: "karon-n", lat: 7.8683, lon: 98.2731 },
  { id: "kata-noi-s", lat: 7.799, lon: 98.296 },
  { id: "nai-harn-n", lat: 7.7795, lon: 98.2868 },
  { id: "laem-ka", lat: 7.7764, lon: 98.3361 },
  { id: "chalong-e", lat: 7.8408, lon: 98.3756 },
];

// Order = north to south. Names are final (art direction §2).
export const DISTRICTS = [
  { id: "layan", name: "Лаян", from: "laem-son-n", to: "layan-s" },
  { id: "bang-tao", name: "Банг Тао", from: "layan-s", to: "laem-son-s" },
  { id: "kamala", name: "Камала", from: "laem-mai-phai", to: "kamala-s" },
  { id: "karon-kata", name: "Карон и Ката", from: "karon-n", to: "kata-noi-s" },
  { id: "nai-harn-rawai", name: "Най Харн и Раваи", from: "nai-harn-n", to: "laem-ka" },
  { id: "chalong", name: "Чалонг", from: "laem-ka", to: "chalong-e" },
];

// Locator dots (snapped onto the coastline at build time).
//   bang-tao  8.0083, 98.2886  OSM natural=beach "Bang Tao Beach" (way centre)
//   layan     8.0346, 98.2841  OSM natural=beach "Layan Beach" (way centre)
//   karon     7.8440, 98.2918  OSM natural=beach "Karon Beach" (way centre)
//   chalong   7.8135, 98.3419  OSM natural=beach "Chalong Beach" (node)
//   kamala    7.9560, 98.2830  middle of the Kamala beach arc on the OSM coastline (Wikipedia 7.95, 98.283)
//   kata      7.8185, 98.2985  middle of Kata (Yai) beach between Laem Sai and Laem Rap (Wikipedia 7.82, 98.298)
//   kata-noi  7.8050, 98.2990  middle of Kata Noi bay south of Laem Rap (Wikipedia 7.80–7.81, 98.30);
//                              hero photo place
//   nai-harn  7.7778, 98.3030  middle of Nai Harn beach on the coastline (Wikipedia 7.778, 98.305)
//   rawai     7.7735, 98.3250  Rawai beach on the coastline (Wikipedia 7.773, 98.326)
export const PLACES = [
  { id: "layan", lat: 8.0346, lon: 98.2841 },
  { id: "bang-tao", lat: 8.0083, lon: 98.2886 },
  { id: "kamala", lat: 7.956, lon: 98.283 },
  { id: "karon", lat: 7.844, lon: 98.2918 },
  { id: "kata", lat: 7.8185, lon: 98.2985 },
  { id: "kata-noi", lat: 7.805, lon: 98.299 },
  { id: "nai-harn", lat: 7.7778, lon: 98.303 },
  { id: "rawai", lat: 7.7735, lon: 98.325 },
  { id: "chalong", lat: 7.8135, lon: 98.3419 },
];

const PHUKET_PLACES = PLACES.map((p) => p.id);

// budget = target vertex count per level of detail:
//   full -> large scenes (Coast), mid -> locators 96–160 px, tiny -> locators 24–64 px.
export const REGIONS = [
  {
    id: "phuket-island",
    source: "phuket",
    mode: "island",
    frame: [7.75, 98.25, 8.21, 98.45],
    districts: true,
    budget: { full: 900, mid: 280, tiny: 90 },
    points: PHUKET_PLACES,
  },
  {
    id: "phuket-west",
    source: "phuket",
    mode: "island-subline",
    subline: ["laem-son-n", "chalong-e"],
    frame: [7.75, 98.25, 8.21, 98.45],
    districts: true,
    budget: { full: 650, mid: 240, tiny: 80 },
    points: PHUKET_PLACES,
  },
  {
    // Bukit from Kuta (just above the runway) round Uluwatu and Nusa Dua to the tip of
    // Tanjung Benoa. Cut out: Benoa port piers and Serangan island, which knot up at icon size.
    id: "bali-bukit",
    source: "bali",
    mode: "coast",
    frame: [-8.86, 115.08, -8.725, 115.245],
    cutouts: [[-8.7525, 115.193, -8.7, 115.26]],
    minIslandKm2: 0.3,
    minPieceKm: 1,
    budget: { full: 700, mid: 260, tiny: 90 },
  },
  {
    // Dubai Marina / Dubai Harbour -> JBR -> Palm Jumeirah -> Burj Al Arab -> Jumeirah,
    // ending at the Dubai Water Canal mouth (north of it the coastline turns inland along
    // the canal). Cut out: The World islands (hundreds of specks at icon size).
    id: "dubai-jumeirah",
    source: "dubai",
    mode: "coast",
    frame: [25.06, 55.1, 25.198, 55.233],
    cutouts: [[25.183, 55.11, 25.26, 55.205]],
    minIslandKm2: 0.3,
    minPieceKm: 1,
    budget: { full: 1100, mid: 420, tiny: 150 },
  },
  {
    // Kampong Som coast from the north (Hun Sen beach) past the port, Victory/Independence,
    // Sokha, Ochheuteal/Serendipity and Otres, with Koh Pos (Snake Island). The south edge
    // stops at Otres 2 so the detached Ream river-mouth fragment is not drawn.
    id: "sihanoukville",
    source: "sihanoukville",
    mode: "coast",
    frame: [10.5615, 103.45, 10.7, 103.6],
    minIslandKm2: 0.3,
    minPieceKm: 1,
    budget: { full: 700, mid: 260, tiny: 90 },
  },
];
