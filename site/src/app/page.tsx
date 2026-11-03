import type { Metadata } from 'next'
import { HomeCoasts } from '@/components/sections/home/coasts'
import { closing, faqSection, meta } from '@/components/sections/home/content'
import { HomeDistricts } from '@/components/sections/home/districts'
import { HomeFigures } from '@/components/sections/home/figures'
import { HomeHero } from '@/components/sections/home/hero'
import { HomeJsonLd } from '@/components/sections/home/json-ld'
import { HomeProcess } from '@/components/sections/home/process'
import { HomeInvest, HomeReview } from '@/components/sections/home/testimony'
import { ClosingLine } from '@/components/sections/shared/closing-line'
import { FaqSection } from '@/components/sections/shared/faq-section'
import { GuideBlock } from '@/components/sections/shared/guide-block'
import { photoMeta, photos } from '@/lib/photos'
import { site } from '@/lib/site'

export const metadata: Metadata = {
  // The title is already complete (copy-home «Мета»), so it skips the layout template.
  title: { absolute: meta.title },
  description: meta.description,
  alternates: { canonical: '/' },
  openGraph: {
    title: meta.title,
    description: meta.description,
    url: '/',
    siteName: site.name,
    locale: site.locale,
    type: 'website',
    // TODO(launch): a dedicated 1200×630 card (seo-brief §6.7); the hero 3:2 crop stands in.
    images: [
      {
        url: photos.hero['3x2'].src,
        width: photos.hero['3x2'].width,
        height: photos.hero['3x2'].height,
        alt: photoMeta.hero.alt,
      },
    ],
  },
}

/** Home `/` — ten blocks in the order of the wireframe (art-direction §6 «Главная»). */
export default function HomePage() {
  return (
    <>
      <HomeHero />
      <HomeFigures />
      <HomeCoasts />
      <HomeDistricts />
      <FaqSection title={faqSection.title} items={faqSection.items} />
      <HomeProcess />
      <HomeInvest />
      <HomeReview />
      <GuideBlock />
      <ClosingLine title={closing.title} note={closing.note} />
      <HomeJsonLd />
    </>
  )
}
