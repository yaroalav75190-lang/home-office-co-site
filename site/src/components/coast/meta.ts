import { coastData } from "./data";
import type { CoastId, DistrictId, PlaceId } from "./types";

// Names (coast titles, district names, the OpenStreetMap attribution) are words: they live in the
// dictionaries, `places` in src/i18n/<locale>/places.ts.

export const OSM_LICENSE_URL = "https://www.openstreetmap.org/copyright";
/** Date of the OpenStreetMap snapshot the coastlines were built from (YYYY-MM-DD). */
export const OSM_DATA_DATE = coastData["phuket-island"].osmDate;

export type CoastMeta = {
  readonly id: CoastId;
  readonly width: number;
  readonly height: number;
  /** width / height of the viewBox. */
  readonly aspect: number;
};

const COAST_IDS: readonly CoastId[] = ["phuket-island", "phuket-west", "bali-bukit", "dubai-jumeirah", "sihanoukville"];

export const coasts = Object.fromEntries(
  COAST_IDS.map((id) => {
    const { width, height } = coastData[id];
    return [id, { id, width, height, aspect: width / height }];
  }),
) as Record<CoastId, CoastMeta>;

export type PhuketDistrict = {
  readonly id: DistrictId;
  /** SVG path of the district segment on `phuket-island` (full detail, same viewBox). */
  readonly segment: string;
};

/** The client's six Phuket districts, north to south. */
export const phuketDistricts: readonly PhuketDistrict[] = (
  ["layan", "bang-tao", "kamala", "karon-kata", "nai-harn-rawai", "chalong"] as const
).map((id) => ({ id, segment: coastData["phuket-island"].full.districts[id] }));

export type PlaceMeta = {
  readonly id: PlaceId;
  /** Coast whose silhouette the locator draws. */
  readonly coast: CoastId;
};

export const places: Record<PlaceId, PlaceMeta> = {
  layan: { id: "layan", coast: "phuket-island" },
  "bang-tao": { id: "bang-tao", coast: "phuket-island" },
  kamala: { id: "kamala", coast: "phuket-island" },
  karon: { id: "karon", coast: "phuket-island" },
  kata: { id: "kata", coast: "phuket-island" },
  "kata-noi": { id: "kata-noi", coast: "phuket-island" },
  "nai-harn": { id: "nai-harn", coast: "phuket-island" },
  rawai: { id: "rawai", coast: "phuket-island" },
  chalong: { id: "chalong", coast: "phuket-island" },
};
