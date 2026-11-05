import type { SVGProps } from "react";
import { getDictionary } from "@/i18n";
import type { Locale } from "@/i18n/config";
import { fmt } from "@/i18n/format";
import { coastData } from "./data";
import { phuketDistricts } from "./meta";
import type { CoastData, CoastId, CoastLod, DistrictId } from "./types";

export type CoastProps = Omit<SVGProps<SVGSVGElement>, "viewBox" | "children" | "ref" | "role"> & {
  id: CoastId;
  /** Draw this Phuket district on top: 3 px, `highlightClassName` (laterite). Base turns ink-muted. */
  highlight?: DistrictId;
  /**
   * Render all six district segments (for the scroll-driven «Где жить, а где сдавать» scene).
   * Inactive ones sit on the base line at 1.5 px with `data-active="false"`; the `highlight`
   * one is 3 px laterite with `data-active="true"`. Motion code swaps them by attribute.
   */
  districts?: boolean;
  /** Level of detail. Default `full`; use `mid` below ~200 px. */
  lod?: CoastLod;
  /** Accessible name; defaults to the coast title (+ district) from the dictionary of `locale`. */
  title?: string;
  /** Language of the default accessible name (only used without `title` and not `decorative`). */
  locale?: Locale;
  /** Hide from assistive tech (when nearby text already names the place). */
  decorative?: boolean;
  /** Colour class of the base line when a district is shown. */
  baseClassName?: string;
  /** Colour class of the active district segment. */
  highlightClassName?: string;
  /** Base stroke in px (non-scaling). Art direction: 1.5. */
  strokeWidth?: number;
};

/**
 * A real coastline from OpenStreetMap as one inline SVG stroke.
 * Server-safe, no client JS. Every base path has `pathLength="1"` and `data-coast-path`
 * so motion can animate `stroke-dashoffset` 1 -> 0.
 */
export function Coast({
  id,
  highlight,
  districts = false,
  lod = "full",
  title,
  locale = "ru",
  decorative = false,
  className,
  baseClassName = "text-ink-muted",
  highlightClassName = "text-laterite",
  strokeWidth = 1.5,
  ...rest
}: CoastProps) {
  const data: CoastData = coastData[id];
  const paths = data[lod];
  const segments = paths.districts;
  const withDistricts = Boolean(segments && (highlight || districts));
  const names = getDictionary(locale).places;
  const label =
    title ??
    (highlight ? fmt(names.coastWithDistrict, { coast: names.coasts[id], district: names.districts[highlight] }) : names.coasts[id]);

  const shown = phuketDistricts.filter((d) => segments?.[d.id] && (districts || d.id === highlight));

  return (
    <svg
      viewBox={`0 0 ${data.width} ${data.height}`}
      fill="none"
      stroke="currentColor"
      strokeWidth={strokeWidth}
      strokeLinecap="round"
      strokeLinejoin="round"
      overflow="visible"
      className={className}
      data-coast={id}
      {...(decorative ? { "aria-hidden": true } : { role: "img", "aria-label": label })}
      {...rest}
    >
      {decorative ? null : <title>{label}</title>}
      <g className={withDistricts ? baseClassName : undefined}>
        {paths.d.map((d, i) => (
          <path key={i} d={d} pathLength={1} vectorEffect="non-scaling-stroke" data-coast-path="" />
        ))}
      </g>
      {withDistricts
        ? shown
            // active segment last, so it is painted on top
            .sort((a, b) => Number(a.id === highlight) - Number(b.id === highlight))
            .map((d) => {
              const active = d.id === highlight;
              return (
                <path
                  key={d.id}
                  d={segments![d.id]}
                  pathLength={1}
                  vectorEffect="non-scaling-stroke"
                  className={active ? highlightClassName : baseClassName}
                  strokeWidth={active ? 3 : strokeWidth}
                  data-district={d.id}
                  data-active={active ? "true" : "false"}
                />
              );
            })
        : null}
    </svg>
  );
}
