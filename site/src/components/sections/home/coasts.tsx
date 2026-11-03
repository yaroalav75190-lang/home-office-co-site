import { clsx } from 'clsx'
import { TransitionLink as Link } from '@/components/motion/transition-link'
import type { ReactNode } from 'react'
import { Coast, Locator } from '@/components/coast'
import { Figure } from '@/components/ui/figure'
import { LocalTime } from '@/components/ui/local-time'
import { SectionHeading } from '@/components/ui/section-heading'
import { TextLink } from '@/components/ui/text-link'
import { destinationHref, destinations, type DestinationId } from '@/lib/site'
import { coastRows, coastsSection } from './content'

/** Photo per row: 3:2 and 4:5 alternate on desktop (Portfolio rhythm); phones get 3:2 throughout. */
const media: Record<DestinationId, ReactNode> = {
  phuket: (
    <Figure
      photo="phuket"
      ratio="3x2"
      sizes="(min-width: 64rem) 25vw, 100vw"
      locator={<Locator place="rawai" />}
    />
  ),
  bali: <Figure photo="bali" ratio="4x5" mobileRatio="3x2" sizes="(min-width: 64rem) 25vw, 100vw" />,
  dubai: <Figure photo="dubai" ratio="3x2" sizes="(min-width: 64rem) 25vw, 100vw" />,
  cambodia: <Figure photo="cambodia" ratio="4x5" mobileRatio="3x2" sizes="(min-width: 64rem) 25vw, 100vw" />,
}

/**
 * «Четыре побережья» (art-direction §6 «Главная» 3): one row per destination — name D2 (1–5),
 * the coastline 120 px (6–7), local time and verdict (8–9), photo (10–12). The whole row is the
 * link (stretched link from the h3, so the accessible name stays short); hover lays sand under it.
 * Planned destinations lead to the quiz with the country chosen (copy-global §2).
 */
export function HomeCoasts() {
  return (
    <section aria-labelledby="home-coasts" className="grid-site pt-section">
      <SectionHeading id="home-coasts" title={coastsSection.title} lead={coastsSection.lead} reveal />

      <ul role="list" className="col-span-full mt-heading grid grid-cols-subgrid">
        {coastRows.map((row, index) => {
          const d = destinations.find((x) => x.id === row.id)
          if (!d) return null
          const href = destinationHref(d)
          const label = d.live ? undefined : d.links[0]?.fallback?.label
          return (
            <li
              key={row.id}
              className={clsx(
                'group relative isolate col-span-full grid grid-cols-subgrid py-10 lg:py-12',
                // Sand under the whole row on hover, bleeding 16 px past the columns (§4 district card).
                'before:absolute before:inset-y-0 before:-inset-x-4 before:-z-10 before:bg-sand before:opacity-0',
                'before:transition-opacity before:duration-320 hover:before:opacity-100 has-focus-visible:before:opacity-100',
                index > 0 && 'mt-2',
              )}
            >
              <h3 className="type-d2 col-span-3 md:col-span-6 lg:col-span-5">
                <Link href={href} aria-label={label} className="after:absolute after:inset-0 after:z-10">
                  {row.name}
                </Link>
              </h3>

              <Coast
                id={d.coast}
                lod="mid"
                title={d.coastLabel}
                data-coast-draw=""
                className="col-span-1 size-16 justify-self-end text-laterite md:col-span-2 lg:col-span-2 lg:col-start-6 lg:size-30 lg:justify-self-start"
              />

              <div data-reveal="fade" className="col-span-full mt-4 md:col-span-6 lg:col-span-2 lg:col-start-8 lg:mt-3">
                <p className="type-small text-ink-muted">
                  <LocalTime timeZone={d.timeZone} /> {d.timeLabel}
                </p>
                <p className="type-body mt-3 max-w-[40ch]">{row.verdict}</p>
              </div>

              <div data-reveal="clip" className="col-span-full mt-8 md:col-span-5 lg:col-span-3 lg:col-start-10 lg:mt-0">
                {media[row.id]}
              </div>
            </li>
          )
        })}
      </ul>

      <div data-reveal="fade" className="col-span-full mt-12 md:col-span-6 lg:col-span-4 lg:col-start-8 lg:mt-8">
        <p className="type-body text-ink-muted">{coastsSection.after}</p>
        <p className="type-ui mt-3">
          <TextLink href={coastsSection.afterLink.href}>{coastsSection.afterLink.label}</TextLink>
        </p>
      </div>
    </section>
  )
}
