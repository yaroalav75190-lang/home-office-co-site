import { clsx } from 'clsx'
import { TransitionLink as Link } from '@/components/motion/transition-link'
import type { ReactNode } from 'react'
import { Coast, Locator } from '@/components/coast'
import { Figure } from '@/components/ui/figure'
import { LocalTime } from '@/components/ui/local-time'
import { SectionHeading } from '@/components/ui/section-heading'
import { TextLink } from '@/components/ui/text-link'
import { getDictionary } from '@/i18n'
import type { Locale } from '@/i18n/config'
import { destinationHref, destinations, type DestinationId } from '@/lib/site'
import { coastOrder, links } from './content'

/** Photo per row: 3:2 and 4:5 alternate on desktop (Portfolio rhythm); phones get 3:2 throughout. */
function media(locale: Locale): Record<DestinationId, ReactNode> {
  return {
    phuket: (
      <Figure
        locale={locale}
        photo="phuket"
        ratio="3x2"
        sizes="(min-width: 64rem) 25vw, 100vw"
        locator={<Locator place="rawai" />}
      />
    ),
    bali: <Figure locale={locale} photo="bali" ratio="4x5" mobileRatio="3x2" sizes="(min-width: 64rem) 25vw, 100vw" />,
    dubai: <Figure locale={locale} photo="dubai" ratio="3x2" sizes="(min-width: 64rem) 25vw, 100vw" />,
    cambodia: (
      <Figure locale={locale} photo="cambodia" ratio="4x5" mobileRatio="3x2" sizes="(min-width: 64rem) 25vw, 100vw" />
    ),
  }
}

/** A property next to the landscape in every row: what is bought there, not only where. */
function property(locale: Locale, houseCaption: string): Record<DestinationId, ReactNode> {
  return {
    phuket: (
      <Figure locale={locale} photo="house" ratio="1x1" sizes="(min-width: 64rem) 16vw, 50vw" caption={houseCaption} />
    ),
    bali: <Figure locale={locale} photo="baliVilla" ratio="1x1" sizes="(min-width: 64rem) 16vw, 50vw" />,
    dubai: <Figure locale={locale} photo="dubaiHome" ratio="1x1" sizes="(min-width: 64rem) 16vw, 50vw" />,
    cambodia: <Figure locale={locale} photo="cambodiaCondo" ratio="1x1" sizes="(min-width: 64rem) 16vw, 50vw" />,
  }
}

/**
 * «Четыре побережья» (art-direction §6 «Главная» 3): one row per destination — name D2 (1–5),
 * the coastline 120 px (6–7), local time, verdict and a property photo 1:1 (8–9), landscape
 * photo (10–12). The whole row is the
 * link (stretched link from the h3, so the accessible name stays short); hover lays sand under it.
 * Planned destinations lead to the quiz with the country chosen (copy-global §2).
 */
export function HomeCoasts({ locale }: { locale: Locale }) {
  const t = getDictionary(locale)
  const coastsSection = t.home.coasts
  const mediaFor = media(locale)
  const propertyFor = property(locale, coastsSection.houseCaption)
  return (
    <section aria-labelledby="home-coasts" className="grid-site pt-section">
      <SectionHeading id="home-coasts" title={coastsSection.title} lead={coastsSection.lead} reveal />

      <ul role="list" className="col-span-full mt-heading grid grid-cols-subgrid">
        {coastOrder.map((id, index) => {
          const d = destinations.find((x) => x.id === id)
          if (!d) return null
          const words = t.common.destinations[d.id]
          const href = destinationHref(d)
          const fallback = d.live ? undefined : d.links[0]?.fallback
          const label = fallback ? t.common.nav[fallback.id] : undefined
          return (
            <li
              key={id}
              className={clsx(
                'group relative isolate col-span-full grid grid-cols-subgrid py-10 lg:py-12',
                // Sand under the whole row on hover, bleeding 16 px past the columns (§4 district card).
                'before:absolute before:inset-y-0 before:-inset-x-4 before:-z-10 before:bg-sand before:opacity-0',
                'before:transition-opacity before:duration-320 hover:before:opacity-100 has-focus-visible:before:opacity-100',
                index > 0 && 'mt-2',
              )}
            >
              <h3 className="type-d2 col-span-3 md:col-span-6 lg:col-span-5">
                {/* The accessible name starts with the visible name (WCAG 2.5.3 «label in name»):
                    a screen reader hears «Дубай, Подобрать в Дубае», a voice user can say «Дубай». */}
                <Link href={href} className="after:absolute after:inset-0 after:z-10">
                  {words.name}
                  {label ? <span className="sr-only">, {label}</span> : null}
                </Link>
              </h3>

              <Coast
                id={d.coast}
                lod="mid"
                title={words.coastLabel}
                data-coast-draw=""
                className="col-span-1 size-16 justify-self-end text-laterite md:col-span-2 lg:col-span-2 lg:col-start-6 lg:size-30 lg:justify-self-start"
              />

              <div data-reveal="fade" className="col-span-full mt-4 md:col-span-6 lg:col-span-2 lg:col-start-8 lg:mt-3">
                <p className="type-small text-ink-muted">
                  <LocalTime timeZone={d.timeZone} /> {words.timeLabel}
                </p>
                <p className="type-body mt-3 max-w-[40ch]">{coastsSection.verdicts[id]}</p>
                <div className="mt-8 w-1/2 md:w-2/3 lg:w-full">{propertyFor[id]}</div>
              </div>

              <div data-reveal="clip" className="col-span-full mt-8 md:col-span-5 lg:col-span-3 lg:col-start-10 lg:mt-0">
                {mediaFor[id]}
              </div>
            </li>
          )
        })}
      </ul>

      <div data-reveal="fade" className="col-span-full mt-12 md:col-span-6 lg:col-span-4 lg:col-start-8 lg:mt-8">
        <p className="type-body text-ink-muted">{coastsSection.after}</p>
        <p className="type-ui mt-3">
          <TextLink href={links.podbor}>{coastsSection.afterLink}</TextLink>
        </p>
      </div>
    </section>
  )
}
