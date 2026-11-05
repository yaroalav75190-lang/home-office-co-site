import type { Metadata } from 'next'
import { Locator } from '@/components/coast'
import { ClosingLine } from '@/components/sections/shared/closing-line'
import { FaqSection } from '@/components/sections/shared/faq-section'
import { formatsContent, phuketPage } from '@/components/sections/phuket/content'
import { DistrictList } from '@/components/sections/phuket/district-list'
import { GeoHero } from '@/components/sections/phuket/geo-hero'
import { IslandMap } from '@/components/sections/phuket/island-map'
import { KnowBefore } from '@/components/sections/phuket/know-before'
import { Ownership } from '@/components/sections/phuket/ownership'
import { Panorama } from '@/components/sections/phuket/panorama'
import { PattayaTeaser } from '@/components/sections/phuket/pattaya-teaser'
import { Formats } from '@/components/sections/phuket/formats'
import { phuketPlace, webPageJsonLd } from '@/components/sections/phuket/schema'
import { typo } from '@/components/sections/phuket/text'
import { JsonLd } from '@/lib/seo/json-ld'
import { getDictionary } from '@/i18n'
import type { Locale } from '@/i18n/config'
import { pageMetadata } from '@/lib/seo/page-meta'

const { path } = phuketPage
export function phuketMetadata(locale: Locale): Metadata {
  // 50 characters; with the « — Home Office & Co» suffix it would pass 60 (seo-brief §4: suffix
  // only when it fits), so the title is absolute.
  return pageMetadata({ locale, path, ...getDictionary(locale).meta.phuket, photo: 'phuket' })
}

export function PhuketView({ locale }: { locale: Locale }) {
  const t = getDictionary(locale)
  const { hero, faq, closing } = t.phuket
  const meta = t.meta.phuket

  return (
    <>
      <JsonLd
        data={webPageJsonLd({
          locale,
          path,
          name: meta.title,
          description: meta.description,
          about: phuketPlace(locale),
        })}
      />

      <GeoHero
        locale={locale}
        // No «Таиланд» level: /thailand is a temporary redirect, not a page (seo-brief §5.1, §6.1).
        crumbs={[{ label: t.common.breadcrumbs.home, href: '/' }, { label: t.common.destinations.phuket.name }]}
        titleLines={hero.titleLines}
        lead={hero.lead}
        cta={{ label: hero.cta, href: phuketPage.hero.ctaHref }}
        art={
          <IslandMap
            names={hero.mapNames}
            label={hero.mapLabel}
            navLabel={hero.mapNavLabel}
            className="ml-auto mr-[8%] h-[30rem] md:absolute md:inset-y-0 md:right-0 md:mr-0 md:h-full"
          />
        }
        panorama={
          <Panorama
            locale={locale}
            photo="phuket"
            ratio="21x9"
            mobileRatio="4x5"
            locator={<Locator place="rawai" />}
            className="mt-16 lg:mt-24"
          />
        }
      />

      <KnowBefore locale={locale} />
      <DistrictList locale={locale} />
      <Ownership locale={locale} />
      {/* Formats instead of project cards until real projects arrive (QA round 1 §4). */}
      <Formats
        locale={locale}
        id="formats-title"
        {...formatsContent(t.phuket.formats)}
        href={phuketPage.hero.ctaHref}
      />
      <PattayaTeaser locale={locale} />
      <FaqSection
        title={faq.title}
        items={faq.items.map(({ q, a }) => ({ q: typo(q, locale), a: typo(a, locale) }))}
      />
      <ClosingLine
        locale={locale}
        title={typo(closing.title, locale)}
        cta={{ label: closing.cta, href: phuketPage.closing.ctaHref }}
      />
    </>
  )
}
