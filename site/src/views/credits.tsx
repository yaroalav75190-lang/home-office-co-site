import type { Metadata } from 'next'
import { getDictionary } from '@/i18n'
import type { Locale } from '@/i18n/config'
import { fmt } from '@/i18n/format'
import { pageMetadata } from '@/lib/seo/page-meta'
import { OSM_DATA_DATE, OSM_LICENSE_URL } from '@/components/coast'
import { legalDate, rich } from '@/components/sections/shared/legal'
import { TextLink } from '@/components/ui/text-link'
import { credits } from '@/lib/photos'

// Attribution page linked from the footer («Авторы фото»). Rows come from `credits` in
// `@/lib/photos` (Unsplash picks checked 3 Nov 2026, Commons licenses 2 Nov 2026); coastline data
// from the coast module. The rows give the facts (author, license, links, share-alike, whether the
// author asked for more); the words are `legal.credits`, `photos[key].caption`, `photoCredits`
// and `places.osmAttribution` of the page's dictionary.
// No copy doc covers this page: the wording is plain and factual. Service page, so noindex.

export function creditsMetadata(locale: Locale): Metadata {
  // Service page: noindex, no canonical.
  return pageMetadata({ locale, path: '/credits', ...getDictionary(locale).meta.credits, absoluteTitle: false, index: false, canonical: false })
}

export function CreditsView({ locale }: { locale: Locale }) {
  const t = getDictionary(locale)
  const cr = t.legal.credits
  return (
    <>
      <section aria-labelledby="credits-title" className="grid-site pt-[calc(var(--header-h)+3rem)] lg:pt-[calc(var(--header-h)+5rem)]">
        <h1 id="credits-title" className="type-d2 col-span-full lg:col-span-8">
          {cr.title}
        </h1>
        <p className="type-lead col-span-full mt-8 max-w-[48ch] lg:col-span-6">{cr.lead}</p>
      </section>

      <section aria-labelledby="credits-photos" className="grid-site pt-section">
        <h2 id="credits-photos" className="type-d3 col-span-full">
          {cr.photos.title}
        </h2>
        <ul role="list" className="col-span-full mt-12 grid grid-cols-subgrid gap-y-10">
          {credits.map((c) => (
            <li key={c.key} className="col-span-full grid grid-cols-subgrid gap-y-2">
              <p className="type-ui col-span-full font-medium md:col-span-4">{t.photos[c.key].caption}</p>
              <div className="type-small col-span-full md:col-span-4">
                <p>{fmt(cr.photos.author, { author: c.author })}</p>
                <p className="mt-1">
                  {rich(cr.photos.license, {
                    license: c.licenseUrl ? (
                      // Creative Commons deeds exist per language: the Russian deed for ru, the English or Spanish one for en/es.
                      <TextLink href={c.licenseUrl.replace(/\/deed\.ru$/, `/deed.${locale}`)} target="_blank" rel="noopener noreferrer">
                        {c.license}
                      </TextLink>
                    ) : (
                      cr.photos.publicDomain
                    ),
                  })}
                </p>
              </div>
              <div className="type-small col-span-full text-ink-muted md:col-span-8 md:col-start-5 lg:col-span-4 lg:col-start-9">
                <p>
                  <TextLink href={c.sourceUrl} target="_blank" rel="noopener noreferrer" className="text-ink">
                    {c.sourceUrl.includes('unsplash.com') ? cr.photos.sourceUnsplash : cr.photos.sourceCommons}
                  </TextLink>
                </p>
                <p className="mt-1">{fmt(cr.photos.changes, { changes: t.photoCredits.changes.toLowerCase() })}</p>
                {c.shareAlike ? <p className="mt-1">{cr.photos.shareAlike}</p> : null}
                {/* The only author request in the registry: the sunset photo's author (`photoCredits.sunsetNote`). */}
                {c.note ? <p className="mt-1">{t.photoCredits.sunsetNote}</p> : null}
              </div>
            </li>
          ))}
        </ul>
      </section>

      <section aria-labelledby="credits-maps" className="grid-site pt-section">
        <h2 id="credits-maps" className="type-d3 col-span-full">
          {cr.maps.title}
        </h2>
        <p className="type-body col-span-full mt-8 max-w-[60ch] lg:col-span-8">
          {rich(cr.maps.text, {
            attribution: t.places.osmAttribution,
            license: (
              <TextLink href={OSM_LICENSE_URL} target="_blank" rel="noopener noreferrer">
                {cr.maps.license}
              </TextLink>
            ),
            date: legalDate(OSM_DATA_DATE, locale),
          })}
        </p>
      </section>

      <section aria-labelledby="credits-code" className="grid-site py-section">
        <h2 id="credits-code" className="type-d3 col-span-full">
          {cr.software.title}
        </h2>
        <ul role="list" className="col-span-full mt-8 flex max-w-[60ch] flex-col gap-3 lg:col-span-8">
          {cr.software.items.map((s) => (
            <li key={s.name} className="type-body">
              {s.name} <span className="text-ink-muted">— {s.license}</span>
            </li>
          ))}
        </ul>
      </section>
    </>
  )
}
