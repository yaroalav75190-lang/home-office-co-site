import { clsx } from 'clsx'
import { Coast } from '@/components/coast'
import { getDictionary } from '@/i18n'
import type { Locale } from '@/i18n/config'
import type { HomeDict } from '@/i18n/ru/home'
import { site } from '@/lib/site'
import { GuideForm } from './guide-form'

/** Words of the block: `home.guide` in the dictionary (the form has its own, in `forms`). */
type GuideCopy = HomeDict['guide']

/**
 * Investor guide block (art-direction §6 «Главная» 9, copy-home §9): ink field; h2, text and the
 * form in columns 1–6; a 4:5 cover typeset in the system with the island in laterite-on-ink in
 * columns 8–12. Anchor `#gid` (`GUIDE_HREF` in `@/lib/lead` points here).
 *
 * The form collects the request and the guide is sent to the chosen channel (DEMO_DECISIONS
 * «Формы»); nothing opens on the page.
 *
 * Spacing: `mt-section py-section` — a section gap of salt above the field, then the field.
 */
export function GuideBlock({ locale, id = 'gid', className }: { locale: Locale; id?: string; className?: string }) {
  const copy = getDictionary(locale).home.guide
  const headingId = `${id}-title`
  return (
    <section
      id={id}
      data-surface="ink"
      aria-labelledby={headingId}
      className={clsx('mt-section scroll-mt-0 py-section', className)}
    >
      <div className="grid-site">
        {/* Seven columns on desktop: «приукрашивания» at D2 is wider than six and would break mid-word. */}
        <div className="col-span-full md:col-span-6 lg:col-span-7">
          <h2 id={headingId} data-reveal="lines" className="type-d2">
            {copy.title}
          </h2>
          <p data-reveal="fade" className="type-body mt-6 max-w-[52ch] text-on-ink-muted">
            {copy.text}
          </p>
          <GuideForm className="mt-12 max-w-[36rem]" />
        </div>

        <div className="col-span-full mt-20 md:col-span-5 md:col-start-2 lg:col-span-5 lg:col-start-8 lg:mt-0">
          <GuideCover copy={copy} />
        </div>
      </div>
    </section>
  )
}

/** Cover 4:5 typeset in the system: an ink-raised sheet, the island drawn in laterite-on-ink. */
function GuideCover({ copy }: { copy: GuideCopy }) {
  return (
    <div
      aria-hidden="true"
      data-reveal="clip"
      className="relative flex aspect-[4/5] flex-col justify-between overflow-hidden bg-ink-raised p-6 md:p-8 lg:sticky lg:top-[calc(var(--header-h)+2rem)] lg:p-10"
    >
      <p className="type-ui">{site.name}</p>
      <Coast
        id="phuket-island"
        lod="mid"
        decorative
        data-coast-draw=""
        className="pointer-events-none absolute top-[12%] right-[10%] h-[62%] w-auto text-laterite-on-ink"
      />
      <div className="relative max-w-[16ch]">
        <p className="type-d3">{copy.title}</p>
        <p className="type-small mt-4 text-on-ink-muted">{copy.coverSubtitle}</p>
        <p className="type-small nums mt-1 text-on-ink-muted">{copy.coverYear}</p>
      </div>
    </div>
  )
}
