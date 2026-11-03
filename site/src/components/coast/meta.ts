import { coastData } from "./data";
import type { CoastId, DistrictId, PlaceId } from "./types";

/** Attribution required by the ODbL wherever a coast is shown (footer line is enough). */
export const OSM_ATTRIBUTION = "© участники OpenStreetMap";
export const OSM_LICENSE_URL = "https://www.openstreetmap.org/copyright";
/** Date of the OpenStreetMap snapshot the coastlines were built from (YYYY-MM-DD). */
export const OSM_DATA_DATE = coastData["phuket-island"].osmDate;

export type CoastMeta = {
  readonly id: CoastId;
  /** Russian accessible name, used as the SVG title. */
  readonly title: string;
  readonly width: number;
  readonly height: number;
  /** width / height of the viewBox. */
  readonly aspect: number;
};

const TITLES: Record<CoastId, string> = {
  "phuket-island": "Остров Пхукет",
  "phuket-west": "Западное побережье Пхукета",
  "bali-bukit": "Полуостров Букит, Бали",
  "dubai-jumeirah": "Побережье Дубая: Дубай Марина, Пальма Джумейра и Джумейра",
  sihanoukville: "Побережье Сиануквиля, Камбоджа",
};

export const coasts = Object.fromEntries(
  (Object.keys(TITLES) as CoastId[]).map((id) => {
    const { width, height } = coastData[id];
    return [id, { id, title: TITLES[id], width, height, aspect: width / height }];
  }),
) as Record<CoastId, CoastMeta>;

export type PhuketDistrict = {
  readonly id: DistrictId;
  readonly name: string;
  /** SVG path of the district segment on `phuket-island` (full detail, same viewBox). */
  readonly segment: string;
};

/** The client's six Phuket districts, north to south. */
export const phuketDistricts: readonly PhuketDistrict[] = (
  [
    ["layan", "Лаян"],
    ["bang-tao", "Банг Тао"],
    ["kamala", "Камала"],
    ["karon-kata", "Карон и Ката"],
    ["nai-harn-rawai", "Най Харн и Раваи"],
    ["chalong", "Чалонг"],
  ] as const
).map(([id, name]) => ({ id, name, segment: coastData["phuket-island"].full.districts[id] }));

export type PlaceMeta = {
  readonly id: PlaceId;
  readonly name: string;
  /** Coast whose silhouette the locator draws. */
  readonly coast: CoastId;
};

export const places: Record<PlaceId, PlaceMeta> = {
  layan: { id: "layan", name: "Лаян", coast: "phuket-island" },
  "bang-tao": { id: "bang-tao", name: "Банг Тао", coast: "phuket-island" },
  kamala: { id: "kamala", name: "Камала", coast: "phuket-island" },
  karon: { id: "karon", name: "Карон", coast: "phuket-island" },
  kata: { id: "kata", name: "Ката", coast: "phuket-island" },
  "kata-noi": { id: "kata-noi", name: "Ката Ной", coast: "phuket-island" },
  "nai-harn": { id: "nai-harn", name: "Най Харн", coast: "phuket-island" },
  rawai: { id: "rawai", name: "Раваи", coast: "phuket-island" },
  chalong: { id: "chalong", name: "Чалонг", coast: "phuket-island" },
};

export function districtName(id: DistrictId): string {
  return phuketDistricts.find((d) => d.id === id)?.name ?? id;
}
