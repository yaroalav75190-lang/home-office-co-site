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
import { brokerHoursIn } from '@/lib/reply-time'
import { brokerHours, contacts, destinations, requisites, site } from '@/lib/site'
import { JsonLd } from '@/lib/seo/json-ld'
import { openGraphFor } from '@/lib/seo/og'
import { booking, channels, hero, meet, meta } from './content'

const PATH = '/contacts'

export const metadata: Metadata = {
  // Brand is already in the title (seo-brief §4.6), so no suffix.
  title: { absolute: meta.title },
  description: meta.description,
  alternates: { canonical: PATH },
  openGraph: openGraphFor({ path: PATH, title: meta.title, description: meta.description, photo: 'naiharn' }),
}

const telephone = contacts.phone.href.replace(/^tel:/, '')

// Full organisation record with the contact point (seo-brief §6.6). Only confirmed promo facts:
// no address and no opening hours (schema.org hours carry no time zone, so they would read wrong).
const contactJsonLd = {
  '@context': 'https://schema.org',
  '@type': 'ContactPage',
  name: meta.title,
  url: absoluteUrl(PATH),
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

const moscow = brokerHoursIn(3 * 60)
const phuket = brokerHoursIn(brokerHours.utcOffsetMinutes)

const channelRows = [
  { channel: contacts.telegram, owner: channels.owners.telegram, external: true },
  { channel: contacts.whatsapp, owner: channels.owners.whatsapp, external: true },
  { channel: contacts.phone, owner: channels.owners.phone, external: false },
  { channel: contacts.email, owner: channels.owners.email, external: false },
] as const

export default function ContactsPage() {
  return (
    <>
      <JsonLd data={contactJsonLd} />

      {/* 1. Hero: h1 D1, the «no office» line in D3 (a paragraph), reply line. */}
      <section data-hero="" aria-labelledby="contacts-title" className="grid-site pt-[calc(var(--header-h)+2rem)] lg:pt-[calc(var(--header-h)+3rem)]">
        <Breadcrumbs items={[{ label: 'Главная', href: '/' }, { label: 'Контакты' }]} className="mb-8 lg:mb-12" />
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
                    <span className="link-reveal">{channel.name}</span>
                  </a>
                  {/* The gap clears the D2 descenders (g, р, ф) above the Small line. */}
                  <p id={`channel-${channel.id}`} className="type-small nums mt-4 lg:mt-6">
                    {withStubs(channel.display)}
                  </p>
                  {owner ? <p className="type-small mt-1 text-ink-muted">{owner}</p> : null}
                </li>
              ))}
            </ul>
            <p className="type-small mt-10 max-w-[48ch] text-ink-muted">{channels.fallback}</p>
          </div>

          <div data-reveal="fade" className="col-span-full md:col-span-6 lg:col-span-4 lg:col-start-9">
            <ul role="list" className="type-ui nums flex flex-col gap-3">
              {destinations.map((d) => (
                <li key={d.id} className="flex gap-3">
                  <span>{d.name}</span>
                  <LocalTime timeZone={d.timeZone} label={d.timeLabel} />
                </li>
              ))}
            </ul>
            <p className="type-body nums mt-8">
              Брокеры на связи с {phuket.open} до {phuket.close} по Пхукету, это с {moscow.open} до {moscow.close} по Москве. В
              Красноярске и Новосибирске время то же, что на Пхукете
            </p>
            <p className="type-body mt-6">{channels.promise}</p>
          </div>
        </div>
      </section>

      {/* 3. Booking: ink field, heading and explanation (1–4), form (6–12). Anchor #zapis. */}
      <div className="pt-section">
        <section id={booking.anchor} data-surface="ink" aria-labelledby="contacts-booking" className="section-y">
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
          <p className="type-small mt-2">{withStubs(requisites.text)}</p>
        </div>
      </section>
    </>
  )
}
