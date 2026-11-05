import type { Metadata } from 'next'
import { HomeCoasts } from '@/components/sections/home/coasts'
import { HomeDistricts } from '@/components/sections/home/districts'
import { HomeFigures } from '@/components/sections/home/figures'
import { HomeHero } from '@/components/sections/home/hero'
import { HomeJsonLd } from '@/components/sections/home/json-ld'
import { HomeProcess } from '@/components/sections/home/process'
import { HomeInvest, HomeReview } from '@/components/sections/home/testimony'
import { ClosingLine } from '@/components/sections/shared/closing-line'
import { FaqSection } from '@/components/sections/shared/faq-section'
import { GuideBlock } from '@/components/sections/shared/guide-block'
import { getDictionary } from '@/i18n'
import type { Locale } from '@/i18n/config'
import { pageMetadata } from '@/lib/seo/page-meta'

export function homeMetadata(locale: Locale): Metadata {
  // The title is already complete (copy-home «Мета»), so it skips the layout template.
  // TODO(launch): a dedicated 1200×630 card (seo-brief §6.7); the hero 3:2 crop stands in.
  return pageMetadata({ locale, path: '/', ...getDictionary(locale).meta.home, photo: 'hero' })
}

/** Home `/` — ten blocks in the order of the wireframe (art-direction §6 «Главная»). */
export function HomeView({ locale }: { locale: Locale }) {
  const { faq, closing } = getDictionary(locale).home
  return (
    <>
      <HomeHero locale={locale} />
      <HomeFigures locale={locale} />
      <HomeCoasts locale={locale} />
      <HomeDistricts locale={locale} />
      <FaqSection title={faq.title} items={faq.items} />
      <HomeProcess locale={locale} />
      <HomeInvest locale={locale} />
      <HomeReview locale={locale} />
      <GuideBlock locale={locale} />
      <ClosingLine locale={locale} title={closing.title} note={closing.note} />
      <HomeJsonLd locale={locale} />
    </>
  )
}
