// Footer (art-direction §4 «Футер», wording copy-global §7). Ink field.
// Top: destinations as D3 links with live local time. Below: a media slot in columns 1–6
// (sunset 4:5 cut by the left edge, or a coastline), and in 8–12 the menu (D3), contacts,
// requisites, documents and credits. `variant="compact"`: the one-line quiz footer.

import { TransitionLink as Link } from '@/components/motion/transition-link'
import type { ReactNode } from 'react'
import {
  brokerHours,
  consultationLink,
  contacts,
  creditsLinks,
  destinationHref,
  destinations,
  footerNav,
  legalLinks,
  requisites,
  resolveLink,
  site,
} from '@/lib/site'
import { brokerHoursIn } from '@/lib/reply-time'
import { splitStubs } from '@/components/sections/shared/stub'
import { LocalTime } from '@/components/ui/local-time'

type FooterProps = {
  variant?: 'full' | 'compact'
  /** Columns 1–6, bleeding off the left edge: photo (`<Figure photo="sunset" ratio="4x5" />`) or coastline. */
  media?: ReactNode
}

const MOSCOW_OFFSET = 3 * 60

export function Footer({ variant = 'full', media }: FooterProps) {
  const year = site.year

  if (variant === 'compact') {
    return (
      <footer data-surface="ink">
        <div className="grid-site py-6">
          <ul role="list" className="type-small col-span-full flex flex-wrap gap-x-8 gap-y-2 text-on-ink-muted">
            <li>
              © {year} {site.name}
            </li>
            {legalLinks.map((item) => (
              <li key={item.href}>
                <Link href={item.href} className="link-underline">
                  {item.label}
                </Link>
              </li>
            ))}
          </ul>
        </div>
      </footer>
    )
  }

  const moscow = brokerHoursIn(MOSCOW_OFFSET)
  const phuket = brokerHoursIn(brokerHours.utcOffsetMinutes)

  return (
    <footer data-surface="ink" className="pt-section pb-[calc(5rem+env(safe-area-inset-bottom))] md:pb-16">
      <div className="grid-site">
        <nav aria-label="Направления" className="col-span-full grid grid-cols-subgrid">
          <ul role="list" className="col-span-full grid grid-cols-subgrid gap-y-4">
            {destinations.map((d) => (
              <li key={d.id} className="col-span-2 md:col-span-4 lg:col-span-3">
                <Link href={destinationHref(d)} className="type-d3 inline-flex flex-wrap items-baseline gap-x-3 py-1">
                  <span className="link-reveal">{d.name}</span>
                  <LocalTime timeZone={d.timeZone} label={d.timeLabel} className="text-on-ink-muted" />
                </Link>
              </li>
            ))}
          </ul>
        </nav>

        <div className="order-last col-span-full mt-heading md:order-none md:col-span-4 lg:col-span-6">
          {media ? (
            <div className="-ml-[calc(var(--grid-margin)+env(safe-area-inset-left,0px))]">{media}</div>
          ) : null}
        </div>

        <div className="col-span-full mt-heading md:col-span-4 lg:col-span-5 lg:col-start-8">
          <nav aria-label="Разделы">
            <ul role="list" className="flex flex-col gap-2">
              {footerNav.map((item) => {
                const link = resolveLink(item)
                if (!link) return null
                return (
                  <li key={item.href}>
                    <Link href={link.href} className="type-d3 inline-block py-1">
                      <span className="link-reveal">{link.label}</span>
                    </Link>
                  </li>
                )
              })}
            </ul>
          </nav>

          <div className="mt-12">
            <Link href={consultationLink.href} className="type-ui link-underline">
              {consultationLink.label}
            </Link>
            <ul role="list" className="type-ui mt-6 flex flex-col gap-1">
              <li>
                <a href={contacts.telegram.href} target="_blank" rel="noopener noreferrer" className="inline-flex min-h-11 items-center">
                  <span className="link-reveal">{contacts.telegram.label}</span>
                </a>
              </li>
              <li>
                <a href={contacts.whatsapp.href} target="_blank" rel="noopener noreferrer" className="inline-flex min-h-11 items-center">
                  <span className="link-reveal">{contacts.whatsapp.label}</span>
                </a>
              </li>
              {/* A value flagged `placeholder` in @/lib/site shows the channel name as the link and
                  the quiet note after it (QA round 1 §2); confirmed values show as they are. */}
              {[contacts.phone, contacts.email].map((c) => (
                <li key={c.id} className="flex flex-wrap items-baseline gap-x-3">
                  <a href={c.href} className="nums inline-flex min-h-11 items-center">
                    <span className="link-reveal">{c.placeholder ? c.name : c.display}</span>
                  </a>
                  {c.placeholder ? (
                    <span className="type-small text-on-ink-muted">{splitStubs(c.display).notes.join(' ')}</span>
                  ) : null}
                </li>
              ))}
            </ul>
            <p className="type-small nums mt-4 max-w-[48ch] text-on-ink-muted">
              Брокеры на связи с {phuket.open} до {phuket.close} по Пхукету, это с {moscow.open} до {moscow.close} по Москве
            </p>
          </div>

          <p className="type-small mt-12 max-w-[48ch] text-on-ink-muted">{requisites.text}</p>

          <ul role="list" className="type-small mt-6 flex flex-col gap-2 text-on-ink-muted">
            {legalLinks.map((item) => (
              <li key={item.href}>
                <Link href={item.href} className="link-underline">
                  {item.label}
                </Link>
              </li>
            ))}
            <li>
              <Link href={creditsLinks.photos.href} className="link-underline">
                {creditsLinks.photos.label}
              </Link>
            </li>
            <li>
              <a href={creditsLinks.maps.href} target="_blank" rel="noopener noreferrer" className="link-underline">
                {creditsLinks.maps.label}
              </a>
            </li>
            <li>
              © {year} {site.name}
            </li>
          </ul>
        </div>
      </div>
    </footer>
  )
}
