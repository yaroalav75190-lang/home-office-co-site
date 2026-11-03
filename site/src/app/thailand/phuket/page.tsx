import type { Metadata } from 'next'
import { Locator } from '@/components/coast'
import { ClosingLine } from '@/components/sections/shared/closing-line'
import { FaqSection } from '@/components/sections/shared/faq-section'
import { formats, formatsHeading, phuketPage } from '@/components/sections/phuket/content'
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
import { openGraphFor } from '@/lib/seo/og'

const { path, meta, hero, faq, closing } = phuketPage
export const metadata: Metadata = {
  // 50 characters; with the « — Home Office & Co» suffix it would pass 60 (seo-brief §4: suffix
  // only when it fits), so the title is absolute.
  title: { absolute: meta.title },
  description: meta.description,
  alternates: { canonical: path },
  openGraph: openGraphFor({ path, title: meta.title, description: meta.description, photo: 'phuket' }),
}

export default function PhuketPage() {
  return (
    <>
      <JsonLd
        data={webPageJsonLd({ path, name: meta.title, description: meta.description, about: phuketPlace })}
      />

      <GeoHero
        // No «Таиланд» level: /thailand is a temporary redirect, not a page (seo-brief §5.1, §6.1).
        crumbs={[{ label: 'Главная', href: '/' }, { label: 'Пхукет' }]}
        titleLines={hero.titleLines}
        lead={hero.lead}
        cta={hero.cta}
        art={
          <IslandMap
            names={hero.mapNames}
            label={hero.mapLabel}
            className="ml-auto mr-[8%] h-[30rem] md:absolute md:inset-y-0 md:right-0 md:mr-0 md:h-full"
          />
        }
        panorama={
          <Panorama
            photo="phuket"
            ratio="21x9"
            mobileRatio="4x5"
            locator={<Locator place="rawai" />}
            className="mt-16 lg:mt-24"
          />
        }
      />

      <KnowBefore />
      <DistrictList />
      <Ownership />
      {/* Formats instead of project cards until real projects arrive (QA round 1 §4). */}
      <Formats id="formats-title" heading={formatsHeading} items={formats} href={hero.cta.href} />
      <PattayaTeaser />
      <FaqSection
        title={faq.title}
        items={faq.items.map(({ q, a }) => ({ q: typo(q), a: typo(a) }))}
      />
      <ClosingLine title={typo(closing.title)} cta={closing.cta} />
    </>
  )
}
