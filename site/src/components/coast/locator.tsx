import type { SVGProps } from "react";
import { coastData } from "./data";
import { places } from "./meta";
import type { CoastData, CoastId, DistrictId, PlaceId } from "./types";

export type LocatorSize = 24 | 64 | 96 | 120 | 160;

export type LocatorProps = Omit<
  SVGProps<SVGSVGElement>,
  "viewBox" | "children" | "ref" | "role" | "width" | "height"
> & {
  /** Place marked with a filled dot. */
  place?: PlaceId;
  /** Phuket district drawn as a 3 px segment (district card locator). */
  district?: DistrictId;
  /** Coast silhouette; defaults to the place's coast, or `phuket-island` for districts. */
  coast?: CoastId;
  /** Long side in px. Art direction sizes: 24 (captions), 64 (menu), 96 (district card), 120, 160. */
  size?: LocatorSize;
  /**
   * Accessible name. Without it the locator is decorative (aria-hidden): captions and cards
   * already name the place in text next to it.
   */
  title?: string;
  /** Colour class of the coast silhouette when a district is shown. Default ink-muted. */
  baseClassName?: string;
  /** Colour class of the dot / district segment. Default laterite. */
  accentClassName?: string;
};

// Dot radius in px for each locator size.
const DOT_PX: Record<LocatorSize, number> = { 24: 2.5, 64: 3.5, 96: 4, 120: 4.5, 160: 5 };

/**
 * Small static coast silhouette with a dot (place) and/or a district segment.
 * Server-safe, no client JS. Locators are never animated (art direction §5).
 */
export function Locator({
  place,
  district,
  coast,
  size = 24,
  title,
  className,
  baseClassName = "text-ink-muted",
  accentClassName = "text-laterite",
  ...rest
}: LocatorProps) {
  const coastId: CoastId = coast ?? (place ? places[place].coast : "phuket-island");
  const data: CoastData = coastData[coastId];
  const lod = size <= 64 ? data.tiny : data.mid;
  const long = Math.max(data.width, data.height);
  const unitsPerPx = long / size;
  const width = Math.round((data.width / long) * size);
  const height = Math.round((data.height / long) * size);
  const point = place ? data.points[place] : undefined;
  const segment = district ? lod.districts?.[district] : undefined;

  if (process.env.NODE_ENV !== "production") {
    if (place && !point) console.warn(`<Locator>: no point "${place}" on coast "${coastId}"`);
    if (district && !segment) console.warn(`<Locator>: no district "${district}" on coast "${coastId}"`);
  }

  // Decorative by default; pass e.g. title="Ката Ной на карте Пхукета" when it stands alone.
  const label = title;

  return (
    <svg
      viewBox={`0 0 ${data.width} ${data.height}`}
      width={width}
      height={height}
      fill="none"
      stroke="currentColor"
      strokeWidth={1.5}
      strokeLinecap="round"
      strokeLinejoin="round"
      overflow="visible"
      className={className}
      data-locator={place ?? district ?? coastId}
      {...(label ? { role: "img", "aria-label": label } : { "aria-hidden": true })}
      {...rest}
    >
      {label ? <title>{label}</title> : null}
      <g className={segment ? baseClassName : undefined}>
        {lod.d.map((d, i) => (
          <path key={i} d={d} vectorEffect="non-scaling-stroke" />
        ))}
      </g>
      {segment ? (
        <path
          d={segment}
          vectorEffect="non-scaling-stroke"
          strokeWidth={3}
          className={accentClassName}
          data-district={district}
        />
      ) : null}
      {point ? (
        <circle
          cx={point[0]}
          cy={point[1]}
          r={DOT_PX[size] * unitsPerPx}
          fill="currentColor"
          stroke="none"
          className={accentClassName}
          data-place={place}
        />
      ) : null}
    </svg>
  );
}
