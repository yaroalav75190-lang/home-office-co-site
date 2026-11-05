import type { Metadata } from 'next'
import { notFound } from 'next/navigation'
import { Locator } from '@/components/coast'
import { ClosingLine } from '@/components/sections/shared/closing-line'
import { DistrictFacts } from '@/components/sections/phuket/district-facts'
import { DistrictHonest } from '@/components/sections/phuket/district-honest'
import { DistrictLife } from '@/components/sections/phuket/district-life'
import { DistrictMap } from '@/components/sections/phuket/district-map'
import { DistrictNeighbours } from '@/components/sections/phuket/district-neighbours'
import {
  districtBySlug,
  districtHref,
  districtPageSlugs,
  districtQuizHref,
} from '@/components/sections/phuket/districts'
import { GeoHero } from '@/components/sections/phuket/geo-hero'
import { Panorama } from '@/components/sections/phuket/panorama'
import { formats, formatsContent, phuketPage } from '@/components/sections/phuket/content'
import { Formats } from '@/components/sections/phuket/formats'
import { phuketPlace, webPageJsonLd } from '@/components/sections/phuket/schema'
import { typo } from '@/components/sections/phuket/text'
import { getDictionary } from '@/i18n'
import type { Locale } from '@/i18n/config'
import { pageMetadata } from '@/lib/seo/page-meta'
import { JsonLd } from '@/lib/seo/json-ld'

// Only districts with real content get a page; every other slug is a 404 (no thin clones,
// seo-brief §4.3). Today that is Bang Tao, the template. Route files set `dynamicParams = false`.
export function districtStaticParams() {
  return districtPageSlugs.map((district) => ({ district }))
}

export function districtMetadata(locale: Locale, slug: string): Metadata {
  const d = districtBySlug(slug)
  if (!d) return {}
  const { ready, hero } = d.page
  const path = districtHref(d)
  const meta = getDictionary(locale).meta.districts[d.id]
  // 52 characters: the brand suffix would pass 60 (seo-brief §4), so the title is absolute.
  // Until the broker's facts are in, the page stays out of the index and has no canonical
  // (seo-brief §4.3, §6.2: noindex pages carry no canonical).
  return pageMetadata({ locale, path, ...meta, photo: hero.panorama.key, index: ready, canonical: ready })
}

export function DistrictView({ locale, slug }: { locale: Locale; slug: string }) {
  const d = districtBySlug(slug)
  if (!d) notFound()

  const t = getDictionary(locale)
  const { page } = d
  const copy = t.districts.pages[d.id]
  const { name } = t.districts.districts[d.id]
  const meta = t.meta.districts[d.id]
  const path = districtHref(d)
  const quizHref = districtQuizHref(d)
  const { place } = page

  return (
    <>
      <JsonLd
        data={webPageJsonLd({
          locale,
          path,
          name: meta.title,
          description: meta.description,
          about: {
            '@type': 'Place',
            name,
            alternateName: page.nameLatin,
            geo: { '@type': 'GeoCoordinates', ...page.geo },
            containedInPlace: phuketPlace(locale),
          },
        })}
      />

      <GeoHero
        locale={locale}
        crumbs={[
          { label: t.common.breadcrumbs.home, href: '/' },
          { label: t.common.destinations.phuket.name, href: phuketPage.path },
          { label: name },
        ]}
        titleLines={[t.districts.heroTitle, copy.namePrep]}
        lead={copy.hero.lead}
        cta={{ label: copy.hero.cta, href: quizHref }}
        art={
          <DistrictMap
            district={d.id}
            label={copy.hero.mapLabel}
            className="ml-auto mr-[12%] h-[24rem] md:absolute md:inset-y-0 md:right-0 md:mr-0 md:h-full"
          />
        }
        panorama={
          <Panorama
            locale={locale}
            photo={page.hero.panorama.key}
            ratio="21x9"
            mobileRatio="3x2"
            caption={copy.hero.panoramaCaption}
            locator={place ? <Locator place={place} /> : undefined}
            className="mt-16 lg:mt-24"
          />
        }
      />

      <DistrictFacts locale={locale} facts={copy.facts} />
      <DistrictLife
        locale={locale}
        life={page.life}
        copy={copy.life}
        place={place}
        showSquare={!formats.some((f) => f.photo === page.life.square.key)}
      />
      <DistrictHonest locale={locale} honest={page.honest} copy={copy.honest} />
      {/* Formats instead of project cards until real projects arrive (QA round 1 §4). */}
      <Formats locale={locale} id="formats-title" {...formatsContent(t.phuket.formats)} href={quizHref} />
      <DistrictNeighbours locale={locale} neighbours={page.neighbours} copy={copy.neighbours} />
      {/* «Спросить в Telegram» with the prefilled «Здравствуйте, интересует Банг Тао»
          (copy-bang-tao §7) needs a `telegramText` prop on the shared ClosingLine (owned by
          pages-home); until then the closing line carries the standard Telegram tile. The text is
          ready in the dictionary: `districts.pages[id].closing.telegramText`. */}
      <ClosingLine
        locale={locale}
        title={typo(copy.closing.title, locale)}
        cta={{ label: copy.closing.cta, href: quizHref }}
      />
    </>
  )
}
