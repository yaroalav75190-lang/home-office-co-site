export type CoastId =
  | "phuket-island"
  | "phuket-west"
  | "bali-bukit"
  | "dubai-jumeirah"
  | "sihanoukville";

/** Phuket districts of the client, north to south. */
export type DistrictId =
  | "layan"
  | "bang-tao"
  | "kamala"
  | "karon-kata"
  | "nai-harn-rawai"
  | "chalong";

/** Places that have a locator dot (all on Phuket for now). */
export type PlaceId =
  | "layan"
  | "bang-tao"
  | "kamala"
  | "karon"
  | "kata"
  | "kata-noi"
  | "nai-harn"
  | "rawai"
  | "chalong";

/** Level of detail: full for large scenes, mid for 96–160 px, tiny for 24–64 px. */
export type CoastLod = "full" | "mid" | "tiny";

export type CoastPaths = {
  /** One SVG path per coastline piece (main line first). */
  readonly d: readonly string[];
  /** District segments, exact slices of `d` (Phuket only). */
  readonly districts?: { readonly [K in DistrictId]?: string };
};

export type CoastData = {
  readonly id: CoastId;
  /** viewBox is `0 0 width height`; the long side is 1000 units. */
  readonly width: number;
  readonly height: number;
  /** OpenStreetMap data date (YYYY-MM-DD) for the attribution line. */
  readonly osmDate: string;
  readonly full: CoastPaths;
  readonly mid: CoastPaths;
  readonly tiny: CoastPaths;
  /** Locator dots in viewBox units, snapped onto the coastline. */
  readonly points: { readonly [K in PlaceId]?: readonly [number, number] };
};
