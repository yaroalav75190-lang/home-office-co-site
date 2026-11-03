import { TransitionLink as Link } from '@/components/motion/transition-link'
import { Locator } from '@/components/coast'
import { TextLink } from '@/components/ui/text-link'
import { type DistrictPage, districtById, districtHref } from './districts'
import { Rich, typo } from './text'

/**
 * «Вдоль берега» / «Соседи по берегу» (art-direction §6 block 6): one line per neighbour, north
 * first. Small «К северу от Банг Тао» over the name D2 (columns 1–4), the comparison in Body
 * (5–8), the 96 px locator with that district's segment (11–12). A neighbour with its own page
 * links to it; until then one «Все районы Пхукета» link closes the block (copy-bang-tao §6), so
 * the page does not repeat the same link twice.
 */
export function DistrictNeighbours({ neighbours }: { neighbours: DistrictPage['neighbours'] }) {
  const rows = neighbours.items.map((n) => ({ ...n, district: districtById(n.id) }))
  const anyWithoutPage = rows.some((r) => !r.district?.page)

  return (
    <section aria-labelledby="neighbours-title" className="grid-site pt-section">
      <h2 id="neighbours-title" data-reveal="lines" className="type-d2 col-span-full lg:col-span-8">
        {typo(neighbours.title)}
      </h2>

      <ul role="list" data-reveal="items" className="col-span-full mt-heading grid grid-cols-subgrid gap-y-14 lg:gap-y-16">
        {rows.map((row) => {
          const name = typo(row.district?.name ?? row.id)
          const page = row.district?.page ? districtHref(row.district) : null
          return (
            <li key={row.id} className="col-span-full grid grid-cols-subgrid gap-y-4 md:items-end">
              <div className="col-span-3 md:col-span-4">
                <p className="type-small text-ink-muted">{row.side}</p>
                <h3 className="type-d2 mt-2">{page ? <Link href={page}>{name}</Link> : name}</h3>
              </div>
              <div className="col-span-1 col-start-4 row-start-1 justify-self-end md:col-span-2 md:col-start-7 lg:col-start-11">
                <Locator district={row.id} size={96} />
              </div>
              <p className="type-body col-span-full max-w-[44ch] md:col-span-4 md:col-start-1 md:row-start-2 lg:col-span-4 lg:col-start-5 lg:row-start-1">
                <Rich text={row.text} />
              </p>
            </li>
          )
        })}
      </ul>

      {anyWithoutPage ? (
        <p className="type-ui col-span-full mt-14 lg:col-start-5">
          <TextLink href={neighbours.fallback.href}>{neighbours.fallback.label}</TextLink>
        </p>
      ) : null}
    </section>
  )
}
