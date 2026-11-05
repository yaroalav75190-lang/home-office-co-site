import type { ReactNode } from 'react'
import { Breadcrumbs, type BreadcrumbItem } from '@/components/sections/shared/breadcrumbs'
import { Button } from '@/components/ui/button'
import { ReplyTime } from '@/components/ui/reply-time'
import type { Locale } from '@/i18n/config'
import { typo } from './text'

type GeoHeroProps = {
  locale: Locale
  crumbs: BreadcrumbItem[]
  /** h1 D1 in two lines (copy: «Недвижимость» / «на Пхукете»). */
  titleLines: readonly [string, string]
  lead: string
  cta: { label: string; href: string }
  /**
   * Right-hand drawing: the island with six districts (hub) or the large locator (district page).
   * Rendered at the height of the h1 + lead rows from 1024 px, below the action under that.
   */
  art: ReactNode
  /** The 21:9 photo «в край» under the hero (`<Panorama />`). */
  panorama: ReactNode
}

/**
 * Hero of the geographic pages (art-direction §6 `/thailand/phuket`, `/thailand/phuket/bang-tao`
 * and tech-lead decision 3): crumbs Small 48 px above the h1; the h1 D1 runs across columns 1–12
 * in two lines because the SEO wording is too wide for columns 1–7; the drawing moves to the right
 * column (9–12), next to the Lead, and rises into the free end of the short second line.
 *
 * Motion: `data-hero` on the section, `data-hero-title` on the h1. Nothing here carries
 * `data-reveal`: the h1, Lead, button and reply line are visible on first paint (LCP, §5).
 */
export function GeoHero({ locale, crumbs, titleLines, lead, cta, art, panorama }: GeoHeroProps) {
  return (
    <section
      data-hero=""
      aria-labelledby="hero-title"
      className="grid-site pt-[calc(var(--header-h)+1.5rem)] lg:pt-[calc(var(--header-h)+2.5rem)]"
    >
      <Breadcrumbs locale={locale} items={crumbs} className="mb-12" />

      {/* From 1024 px the grid, not the drawing's cell, is the containing block of the drawing (see
          the cell below): Chrome collapses a row-spanning cell whose only child is absolute to 0 px
          for the length of the panorama's clip reveal, which made the island vanish (CLS 0.024). */}
      <div className="col-span-full grid grid-cols-subgrid lg:relative">
        <h1 id="hero-title" data-hero-title="" className="type-d1 col-span-full lg:row-start-1">
          <span className="block">{typo(titleLines[0], locale)}</span>{' '}
          <span className="block">{typo(titleLines[1], locale)}</span>
        </h1>

        <div className="col-span-full mt-10 md:col-span-5 lg:row-start-2 lg:mt-14">
          <p className="type-lead max-w-[40ch]">{typo(lead, locale)}</p>
          <div className="mt-8">
            <Button href={cta.href}>{cta.label}</Button>
          </div>
          <ReplyTime className="mt-4 max-w-[40ch]" />
        </div>

        {/* From 1024 px the drawing spans both rows; it is absolutely sized inside, so it never
            makes the rows taller than the h1 and the Lead block need. */}
        <div className="relative col-span-full mt-14 md:col-span-3 md:col-start-6 md:mt-10 lg:static lg:col-span-4 lg:col-start-9 lg:row-span-2 lg:row-start-1 lg:mt-0">
          {art}
        </div>
      </div>

      {panorama}
    </section>
  )
}
