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
import { formats, formatsHeading } from '@/components/sections/phuket/content'
import { Formats } from '@/components/sections/phuket/formats'
import { phuketPlace, webPageJsonLd } from '@/components/sections/phuket/schema'
import { typo } from '@/components/sections/phuket/text'
import { openGraphFor } from '@/lib/seo/og'
import { JsonLd } from '@/lib/seo/json-ld'

type DistrictPageProps = { params: Promise<{ district: string }> }

// Only districts with real content get a page; every other slug is a 404 (no thin clones,
// seo-brief §4.3). Today that is Bang Tao, the template.
export const dynamicParams = false

export function generateStaticParams() {
  return districtPageSlugs.map((district) => ({ district }))
}

export async function generateMetadata({ params }: DistrictPageProps): Promise<Metadata> {
  const { district: slug } = await params
  const d = districtBySlug(slug)
  if (!d) return {}
  const { meta, ready, hero } = d.page
  const path = districtHref(d)
  return {
    // 52 characters: the brand suffix would pass 60 (seo-brief §4), so the title is absolute.
    title: { absolute: meta.title },
    description: meta.description,
    // Until the broker's facts are in, the page stays out of the index and has no canonical
    // (seo-brief §4.3, §6.2: noindex pages carry no canonical).
    ...(ready ? { alternates: { canonical: path } } : { robots: { index: false, follow: true } }),
    openGraph: openGraphFor({ path, title: meta.title, description: meta.description, photo: hero.panorama.key }),
  }
}

export default async function DistrictPage({ params }: DistrictPageProps) {
  const { district: slug } = await params
  const d = districtBySlug(slug)
  if (!d) notFound()

  const { page } = d
  const path = districtHref(d)
  const quizHref = districtQuizHref(d)
  const { place } = page

  return (
    <>
      <JsonLd
        data={webPageJsonLd({
          path,
          name: page.meta.title,
          description: page.meta.description,
          about: {
            '@type': 'Place',
            name: d.name,
            alternateName: page.nameLatin,
            geo: { '@type': 'GeoCoordinates', ...page.geo },
            containedInPlace: phuketPlace,
          },
        })}
      />

      <GeoHero
        crumbs={[{ label: 'Главная', href: '/' }, { label: 'Пхукет', href: '/thailand/phuket' }, { label: d.name }]}
        titleLines={['Недвижимость', page.namePrep]}
        lead={page.hero.lead}
        cta={{ label: page.hero.cta, href: quizHref }}
        art={
          <DistrictMap
            district={d.id}
            label={page.hero.mapLabel}
            className="ml-auto mr-[12%] h-[24rem] md:absolute md:inset-y-0 md:right-0 md:mr-0 md:h-full"
          />
        }
        panorama={
          <Panorama
            photo={page.hero.panorama.key}
            ratio="21x9"
            mobileRatio="3x2"
            caption={page.hero.panorama.caption}
            locator={place ? <Locator place={place} /> : undefined}
            className="mt-16 lg:mt-24"
          />
        }
      />

      <DistrictFacts facts={page.facts} />
      <DistrictLife
        life={page.life}
        place={place}
        showSquare={!formats.some((f) => f.photo === page.life.square.key)}
      />
      <DistrictHonest honest={page.honest} />
      {/* Formats instead of project cards until real projects arrive (QA round 1 §4). */}
      <Formats id="formats-title" heading={formatsHeading} items={formats} href={quizHref} />
      <DistrictNeighbours neighbours={page.neighbours} />
      {/* «Спросить в Telegram» with the prefilled «Здравствуйте, интересует Банг Тао»
          (copy-bang-tao §7) needs a `telegramText` prop on the shared ClosingLine (owned by
          pages-home); until then the closing line carries the standard Telegram tile. */}
      <ClosingLine title={typo(page.closing.title)} cta={{ label: page.closing.cta, href: quizHref }} />
    </>
  )
}
