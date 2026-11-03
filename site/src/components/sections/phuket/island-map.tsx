import { clsx } from 'clsx'
import { Coast, coastData, type CoastData, type DistrictId, type PlaceId } from '@/components/coast'
import { districts } from './districts'

const ISLAND: CoastData = coastData['phuket-island']

/** Absolute vertices of the island outline (paths use only M, relative l and z). */
function outlineVertices(): [number, number][] {
  const out: [number, number][] = []
  for (const d of ISLAND.full.d) {
    let x = 0
    let y = 0
    for (const [, cmd, args] of d.matchAll(/([MLlz])([^MLlz]*)/g)) {
      const n = (args.match(/-?\d*\.?\d+/g) ?? []).map(Number)
      for (let i = 0; i + 1 < n.length; i += 2) {
        if (cmd === 'l') {
          x += n[i]
          y += n[i + 1]
        } else {
          x = n[i]
          y = n[i + 1]
        }
        out.push([x, y])
      }
    }
  }
  return out
}

const VERTICES = outlineVertices()

/** Westmost point of the coast within ±`band` units of `y`: labels stop short of it. */
function westEdge(y: number, band = 28): number {
  let min = Infinity
  for (const [vx, vy] of VERTICES) if (Math.abs(vy - y) <= band && vx < min) min = vx
  return Number.isFinite(min) ? min : 0
}

// Where each district label hangs: the latitude of its locator points (averaged for the double
// districts), set against the coast on the water side. Chalong faces the bay in the south-east,
// so its name sits in open water below the segment instead.
const ANCHORS: Record<DistrictId, { at: PlaceId[] } | { x: number; y: number }> = {
  layan: { at: ['layan'] },
  'bang-tao': { at: ['bang-tao'] },
  kamala: { at: ['kamala'] },
  'karon-kata': { at: ['karon', 'kata'] },
  'nai-harn-rawai': { at: ['nai-harn', 'rawai'] },
  chalong: { x: 206, y: 938 },
}

type LabelPosition = { top: string; right?: string; left?: string }

function labelPosition(id: DistrictId): LabelPosition | null {
  const anchor = ANCHORS[id]
  const pct = (v: number, of: number) => `${((v / of) * 100).toFixed(2)}%`
  if ('x' in anchor) return { top: pct(anchor.y, ISLAND.height), left: pct(anchor.x, ISLAND.width) }
  const pts = anchor.at.map((p) => ISLAND.points[p]).filter((p): p is readonly [number, number] => Boolean(p))
  if (pts.length === 0) return null
  const y = pts.reduce((s, p) => s + p[1], 0) / pts.length
  return { top: pct(y, ISLAND.height), right: pct(ISLAND.width - westEdge(y), ISLAND.width) }
}

type IslandMapProps = {
  /** Label per district (copy-phuket §1). */
  names: Record<DistrictId, string>
  /** Accessible name of the drawing. */
  label: string
  className?: string
}

/**
 * «Остров как оглавление» (art-direction §2.3): the whole island, ink-muted, with the client's six
 * districts as 3 px laterite segments and their names on the water side. Each name jumps to the
 * district row further down the page. The coast is drawn on entry by the motion layer
 * (`data-coast-draw`); without JS it is simply there.
 *
 * The box keeps the island's aspect ratio; give it a height (or let a parent stretch it).
 */
export function IslandMap({ names, label, className }: IslandMapProps) {
  return (
    <div className={clsx('relative aspect-[415/1000]', className)}>
      <Coast
        id="phuket-island"
        districts
        title={label}
        data-coast-draw=""
        className="absolute inset-0 size-full text-ink-muted [&_[data-district]]:text-laterite [&_[data-district]]:[stroke-width:3]"
      />
      <nav aria-label="Районы на карте">
        <ul role="list" className="type-small">
          {districts.map((d) => {
            const position = labelPosition(d.id)
            if (!position) return null
            return (
              <li
                key={d.id}
                style={position}
                className={clsx(
                  'absolute -translate-y-1/2 whitespace-nowrap max-[389px]:w-max max-[389px]:max-w-[6.5rem] max-[389px]:whitespace-normal',
                  position.right ? 'pr-3 max-[389px]:text-right' : 'pl-1',
                )}
              >
                <a href={`#${d.slug}`} className="-my-3 inline-block py-3 text-ink">
                  <span className="link-reveal">{names[d.id]}</span>
                </a>
              </li>
            )
          })}
        </ul>
      </nav>
    </div>
  )
}
