import type { Metadata } from 'next'
import { Locator } from '@/components/coast'
import { BookingForm } from '@/components/sections/forms/booking-form'
import { Breadcrumbs } from '@/components/sections/shared/breadcrumbs'
import { ORG_ID, absoluteUrl } from '@/components/sections/shared/site-url'
import { withStubs } from '@/components/sections/shared/stub'
import { Figure } from '@/components/ui/figure'
import { LocalTime } from '@/components/ui/local-time'
import { ReplyTime } from '@/components/ui/reply-time'
import { SectionHeading } from '@/components/ui/section-heading'
import { brokerHoursIn, formatClock } from '@/lib/reply-time'
import { MOSCOW_UTC_OFFSET_MINUTES, brokerHours, contacts, destinations, site } from '@/lib/site'
import { JsonLd } from '@/lib/seo/json-ld'
import { getDictionary } from '@/i18n'
import { type Locale, htmlLang, localizePath } from '@/i18n/config'
import { fmt } from '@/i18n/format'
import { pageMetadata } from '@/lib/seo/page-meta'

// Words: `contacts` in src/i18n/<locale>/contacts.ts (copy-contacts.md v1.0) and `common`
// (channel names, destinations, requisites). Facts stay here and in @/lib/site.

const PATH = '/contacts'

/** Booking block; `consultationLink` in @/lib/site points here (copy-global §7). */
const BOOKING_ANCHOR = 'zapis'

export function contactsMetadata(locale: Locale): Metadata {
  // Brand is already in the title (seo-brief §4.6), so no suffix.
  return pageMetadata({ locale, path: PATH, ...getDictionary(locale).meta.contacts, photo: 'naiharn' })
}

const telephone = contacts.phone.href.replace(/^tel:/, '')

// Full organisation record with the contact point (seo-brief §6.6). Only confirmed promo facts:
// no address and no opening hours (schema.org hours carry no time zone, so they would read wrong).
function contactJsonLd(locale: Locale) {
  return {
    '@context': 'https://schema.org',
    '@type': 'ContactPage',
    name: getDictionary(locale).meta.contacts.title,
    url: absoluteUrl(localizePath(locale, PATH)),
    inLanguage: htmlLang[locale],
    mainEntity: {
      '@type': 'RealEstateAgent',
      '@id': ORG_ID,
      name: site.name,
      url: absoluteUrl('/'),
      telephone,
      email: contacts.email.href.replace(/^mailto:/, ''),
      contactPoint: { '@type': 'ContactPoint', telephone, contactType: 'sales', availableLanguage: ['ru'] },
    },
  }
}

/** Opening + the promised reply on the Phuket clock: «9:15» («9:15 am» in English). */
function openReplyText(locale: Locale): string {
  const minutes = brokerHours.openMinutes + brokerHours.replyMinutes
  return formatClock(Date.UTC(2026, 0, 1, 0, minutes - brokerHours.utcOffsetMinutes), brokerHours.timeZone, locale)
}

/** Channels in page order. `owner`: the founder answers it (DEMO_DECISIONS); `external`: opens a new tab. */
const channelRows = [
  { channel: contacts.telegram, owner: true, external: true },
  { channel: contacts.whatsapp, owner: true, external: true },
  { channel: contacts.phone, owner: true, external: false },
  { channel: contacts.email, owner: false, external: false },
] as const

export function ContactsView({ locale }: { locale: Locale }) {
  const t = getDictionary(locale)
  const { hero, channels, booking, meet } = t.contacts
  const phuket = brokerHoursIn(brokerHours.utcOffsetMinutes, locale)
  const moscow = brokerHoursIn(MOSCOW_UTC_OFFSET_MINUTES, locale)
  const ownerLine = fmt(channels.owner, { name: t.common.founder.name, role: t.common.founder.role })
  return (
    <>
      <JsonLd data={contactJsonLd(locale)} />

      {/* 1. Hero: h1 D1, the «no office» line in D3 (a paragraph), reply line. */}
      <section data-hero="" aria-labelledby="contacts-title" className="grid-site pt-[calc(var(--header-h)+2rem)] lg:pt-[calc(var(--header-h)+3rem)]">
        <Breadcrumbs
          locale={locale}
          items={[{ label: t.common.breadcrumbs.home, href: '/' }, { label: t.common.nav.contacts }]}
          className="mb-8 lg:mb-12"
        />
        <h1 id="contacts-title" data-hero-title="" className="type-d1 col-span-full lg:col-span-8">
          {hero.title}
        </h1>
        <div className="col-span-full mt-8 md:col-span-6 lg:mt-12">
          <p className="type-d3 max-w-[24ch]">{hero.line}</p>
          <ReplyTime className="mt-6 max-w-[40ch]" />
        </div>
      </section>

      {/* 2. Channels (1–7): the channel name is the D2 link, the address and who answers sit
          under it in Small (QA round 1 §5); local times and broker hours (9–12). */}
      <section aria-labelledby="contacts-channels" className="grid-site pt-section">
        <SectionHeading id="contacts-channels" title={channels.title} reveal />
        <div className="col-span-full mt-heading grid grid-cols-subgrid gap-y-16">
          <div className="col-span-full lg:col-span-7">
            <ul role="list" data-reveal="items" className="flex flex-col gap-10 md:gap-14">
              {channelRows.map(({ channel, owner, external }) => (
                <li key={channel.id}>
                  <a
                    href={channel.href}
                    aria-describedby={`channel-${channel.id}`}
                    {...(external ? { target: '_blank', rel: 'noopener noreferrer' } : {})}
                    className="type-d2 inline-block"
                  >
                    <span className="link-reveal">{t.common.channels[channel.id].name}</span>
                  </a>
                  {/* The gap clears the D2 descenders (g, р, ф) above the Small line. */}
                  <p id={`channel-${channel.id}`} className="type-small nums mt-4 lg:mt-6">
                    {withStubs(channel.display)}
                  </p>
                  {owner ? <p className="type-small mt-1 text-ink-muted">{ownerLine}</p> : null}
                </li>
              ))}
            </ul>
            <p className="type-small mt-10 max-w-[48ch] text-ink-muted">{channels.fallback}</p>
          </div>

          <div data-reveal="fade" className="col-span-full md:col-span-6 lg:col-span-4 lg:col-start-9">
            <ul role="list" className="type-ui nums flex flex-col gap-3">
              {destinations.map((d) => (
                <li key={d.id} className="flex gap-3">
                  <span>{t.common.destinations[d.id].name}</span>
                  <LocalTime timeZone={d.timeZone} label={t.common.destinations[d.id].timeLabel} />
                </li>
              ))}
            </ul>
            <p className="type-body nums mt-8">
              {fmt(channels.hours, { open: phuket.open, close: phuket.close, mskOpen: moscow.open, mskClose: moscow.close })}
            </p>
            <p className="type-body mt-6">{fmt(channels.promise, { openReply: openReplyText(locale) })}</p>
          </div>
        </div>
      </section>

      {/* 3. Booking: ink field, heading and explanation (1–4), form (6–12). Anchor #zapis. */}
      <div className="pt-section">
        <section id={BOOKING_ANCHOR} data-surface="ink" aria-labelledby="contacts-booking" className="section-y">
          <div className="grid-site gap-y-12">
            <div className="col-span-full md:col-span-6 lg:col-span-4">
              <div className="lg:sticky lg:top-[calc(var(--header-h)+2rem)]">
                <h2 id="contacts-booking" className="type-d2">
                  {booking.title}
                </h2>
                <p className="type-body mt-6 max-w-[36ch]">{booking.text}</p>
                <p className="type-small mt-4 text-on-ink-muted">{withStubs(booking.price)}</p>
              </div>
            </div>
            <div className="col-span-full md:col-span-8 lg:col-span-7 lg:col-start-6">
              <BookingForm kind="viewing" page={PATH} />
              <p className="type-small mt-10 max-w-[56ch] text-on-ink-muted">{booking.after}</p>
            </div>
          </div>
        </section>
      </div>

      {/* 4. Where we meet: naiharn 3:2 (1–7), text and requisites (9–12). */}
      <section aria-labelledby="contacts-meet" className="grid-site py-section">
        <div data-reveal="clip" className="col-span-full md:col-span-6 lg:col-span-7">
          <Figure
            locale={locale}
            photo="naiharn"
            ratio="3x2"
            sizes="(min-width: 64rem) 58vw, (min-width: 48rem) 75vw, 100vw"
            caption={meet.photoCaption}
            locator={<Locator place="nai-harn" />}
          />
        </div>
        <div data-reveal="fade" className="col-span-full mt-12 md:col-span-6 lg:col-span-4 lg:col-start-9 lg:mt-0">
          <h2 id="contacts-meet" className="type-d3">
            {meet.title}
          </h2>
          {meet.paragraphs.map((p) => (
            <p key={p} className="type-body mt-6">
              {withStubs(p)}
            </p>
          ))}
          {meet.yearNote ? <p className="type-small mt-2 text-ink-muted">{withStubs(meet.yearNote)}</p> : null}
          <h3 className="type-ui mt-10 font-medium">{meet.requisitesTitle}</h3>
          <p className="type-small mt-2">{withStubs(t.common.footer.requisites)}</p>
        </div>
      </section>
    </>
  )
}
