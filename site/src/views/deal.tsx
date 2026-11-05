import type { Metadata } from 'next'
import { Locator } from '@/components/coast'
import { BookingForm } from '@/components/sections/forms/booking-form'
import { Breadcrumbs } from '@/components/sections/shared/breadcrumbs'
import { FaqSection } from '@/components/sections/shared/faq-section'
import { ORG_ID, absoluteUrl } from '@/components/sections/shared/site-url'
import { withStubs } from '@/components/sections/shared/stub'
import { Button } from '@/components/ui/button'
import { Figure } from '@/components/ui/figure'
import { ReplyTime } from '@/components/ui/reply-time'
import { SectionHeading } from '@/components/ui/section-heading'
import { TextLink } from '@/components/ui/text-link'
import { JsonLd } from '@/lib/seo/json-ld'
import { getDictionary } from '@/i18n'
import { type Locale, localizePath } from '@/i18n/config'
import { pageMetadata } from '@/lib/seo/page-meta'
import { site } from '@/lib/site'
import { StageNav } from './deal-stage-nav'

// Words: `deal` in src/i18n/<locale>/deal.ts (copy-deal.md v1.0). Facts stay here: anchors, hrefs,
// photo keys.

const PATH = '/services/deal'

/** Anchors of the six stages, in the order of `deal.stages.items` (links from the sticky list and from outside). */
const STAGE_IDS = [
  'izuchenie-rynka',
  'proverka',
  'bron-i-dogovor',
  'oplata-i-registraciya',
  'priemka-i-klyuchi',
  'arenda-i-pereprodazha',
] as const

/** Consultation block; the hero button jumps here. */
const CONSULTATION_ANCHOR = 'konsultaciya'

/** «Сделка по шагам подробно»: chapter 8 of the investor guide on the home page. */
const GUIDE_HREF = '/#gid'

export function dealMetadata(locale: Locale): Metadata {
  // 45 characters; with the « — Home Office & Co» suffix it would pass 60 (seo-brief §4: suffix only if it fits).
  return pageMetadata({ locale, path: PATH, ...getDictionary(locale).meta.deal, photo: 'villa' })
}

function serviceJsonLd(locale: Locale) {
  const t = getDictionary(locale)
  return {
    '@context': 'https://schema.org',
    '@type': 'Service',
    name: t.deal.schema.name,
    serviceType: t.deal.schema.name,
    url: absoluteUrl(localizePath(locale, PATH)),
    provider: { '@type': 'RealEstateAgent', '@id': ORG_ID, name: site.name, url: absoluteUrl('/') },
    areaServed: t.deal.schema.areaServed,
    description: t.meta.deal.description,
  }
}

export function DealView({ locale }: { locale: Locale }) {
  const t = getDictionary(locale)
  const { hero, stages, checks, payment, afterKeys, faq, consultation } = t.deal
  const [line1, line2] = hero.titleLines
  const stageItems = stages.items.map((stage, i) => ({ ...stage, id: STAGE_IDS[i] }))
  return (
    <>
      <JsonLd data={serviceJsonLd(locale)} />

      {/* 1. Hero: stepped title, lead, consultation button, reply line, villa print 4:5. */}
      <section data-hero="" aria-labelledby="deal-title" className="grid-site pt-[calc(var(--header-h)+2rem)] lg:pt-[calc(var(--header-h)+3rem)]">
        {/* /services has no page yet: the trail is Главная › Сопровождение сделки (seo-brief §4.4). */}
        <Breadcrumbs
          locale={locale}
          items={[{ label: t.common.breadcrumbs.home, href: '/' }, { label: t.common.nav.deal }]}
          className="mb-8 lg:mb-12"
        />
        <h1 id="deal-title" data-hero-title="" className="type-d1 col-span-full lg:row-start-2">
          <span className="block">{line1}</span>{' '}
          <span className="block pl-[22vw] md:pl-[calc((100%+var(--grid-gutter))/4)] lg:pl-[calc((100%+var(--grid-gutter))/3)]">
            {line2}
          </span>
        </h1>

        <div className="col-span-full mt-8 md:col-span-5 lg:col-span-4 lg:row-start-3 lg:mt-[calc(3rem_-_0.92*var(--text-d1))]">
          <p className="type-lead max-w-[36ch]">{hero.lead}</p>
          <div className="mt-6 md:mt-8">
            <Button href={`#${CONSULTATION_ANCHOR}`}>{hero.cta}</Button>
          </div>
          <ReplyTime className="mt-3 max-w-[40ch]" />
        </div>

        <div
          data-hero-print=""
          className="col-span-2 col-start-3 mt-12 md:col-span-3 md:col-start-6 lg:col-span-3 lg:col-start-10 lg:row-start-3 lg:mt-12"
        >
          {/* Caption: the photo's own (`photos.villa.caption`, «Пример формата: вилла с бассейном»). */}
          <Figure
            locale={locale}
            photo="villa"
            ratio="4x5"
            preload
            sizes="(min-width: 100rem) 380px, (min-width: 64rem) 24vw, (min-width: 48rem) 36vw, 46vw"
          />
        </div>
      </section>

      {/* 2. Six stages: sticky list (1–4), stages with h3, text, documents and term (6–12). */}
      <section aria-labelledby="deal-stages" className="grid-site pt-section">
        <SectionHeading id="deal-stages" title={stages.title} lead={stages.lead} reveal />
        <div className="col-span-full mt-heading grid grid-cols-subgrid">
          <div className="hidden lg:col-span-4 lg:block">
            <StageNav label={stages.navLabel} items={stageItems.map((s) => ({ id: s.id, label: s.nav }))} />
          </div>
          <ol role="list" className="col-span-full flex flex-col gap-16 md:col-span-7 lg:col-span-7 lg:col-start-6 lg:gap-24">
            {stageItems.map((stage) => (
              <li key={stage.id} id={stage.id} className="scroll-mt-[calc(var(--header-h)+2rem)]">
                <article aria-labelledby={`${stage.id}-title`}>
                  <h3 id={`${stage.id}-title`} data-reveal="lines" className="type-d3">
                    {stage.title}
                  </h3>
                  <div data-reveal="fade">
                    <p className="type-body mt-6 max-w-[60ch]">{stage.text}</p>
                    <dl className="type-small mt-6 grid max-w-[60ch] gap-3 md:grid-cols-[8rem_1fr]">
                      <dt className="text-ink-muted">{stages.documentsLabel}</dt>
                      <dd>{withStubs(stage.documents)}</dd>
                      <dt className="text-ink-muted">{stages.termLabel}</dt>
                      <dd>{withStubs(stage.term)}</dd>
                    </dl>
                  </div>
                </article>
              </li>
            ))}
          </ol>
          <p data-reveal="fade" className="type-ui col-span-full mt-16 md:col-span-7 lg:col-span-7 lg:col-start-6">
            <TextLink href={GUIDE_HREF}>{stages.guideLink}</TextLink>
          </p>
        </div>
      </section>

      {/* 3. What we check before payment: sand field, five checks in two columns. */}
      <div className="pt-section">
        <section data-surface="sand" aria-labelledby="deal-checks" className="section-y">
          <div className="grid-site">
            <h2 id="deal-checks" data-reveal="lines" className="type-d2 col-span-full lg:col-span-8">
              {checks.title}
            </h2>
            <ul
              role="list"
              data-reveal="items"
              className="col-span-full mt-heading grid gap-x-[var(--grid-gutter)] gap-y-10 md:grid-cols-2 lg:col-span-8 lg:col-start-5"
            >
              {checks.items.map((item) => (
                <li key={item.name}>
                  <p className="type-ui font-medium">{item.name}</p>
                  <p className="type-body mt-2 max-w-[40ch]">{item.text}</p>
                </li>
              ))}
            </ul>
            {checks.note ? (
              <p className="type-small col-span-full mt-12 text-ink-muted lg:col-span-8 lg:col-start-5">{withStubs(checks.note)}</p>
            ) : null}
          </div>
        </section>
      </div>

      {/* 4. Payment from Russia: quiet variant, h2 D3 (1–3), text (4–12). No schemes or banks. */}
      <section aria-labelledby="deal-payment" className="grid-site pt-section">
        <h2 id="deal-payment" data-reveal="lines" className="type-d3 col-span-full lg:col-span-3">
          {payment.title}
        </h2>
        <div data-reveal="fade" className="col-span-full mt-6 flex max-w-[64ch] flex-col gap-5 md:col-span-7 lg:col-span-8 lg:col-start-5 lg:mt-0">
          {payment.paragraphs.map((p) => (
            <p key={p} className="type-body">
              {p}
            </p>
          ))}
          {payment.note ? <p className="type-small">{withStubs(payment.note)}</p> : null}
        </div>
      </section>

      {/* 5. After the keys: naiharn 21:9 edge to edge, then rent and resale. */}
      <section aria-labelledby="deal-after" className="pt-section">
        <div className="grid-site">
          <div data-parallax="" data-reveal="clip" className="full-bleed col-span-full">
            <Figure
              locale={locale}
              photo="naiharn"
              ratio="21x9"
              sizes="100vw"
              caption={null}
              mediaClassName="w-full"
            />
          </div>
          <p className="type-small col-span-full mt-3 flex items-center gap-2 text-ink-muted">
            <span className="inline-flex size-6 shrink-0 items-center justify-center" aria-hidden="true">
              <Locator place="nai-harn" />
            </span>
            {afterKeys.photoCaption}
          </p>
          <h2 id="deal-after" data-reveal="lines" className="type-d2 col-span-full mt-heading lg:col-span-8">
            {afterKeys.title}
          </h2>
          <div className="col-span-full mt-heading grid gap-12 md:grid-cols-2 lg:col-span-8 lg:col-start-5 lg:gap-[var(--grid-gutter)]">
            {afterKeys.items.map((item) => (
              <div key={item.title} data-reveal="fade" className="max-w-[44ch]">
                <h3 className="type-d3">{item.title}</h3>
                <p className="type-body mt-6">{item.text}</p>
                {item.note ? <p className="type-small mt-4">{withStubs(item.note)}</p> : null}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 6. Cost and FAQ (cost is the first question). */}
      <FaqSection title={faq.title} items={faq.items} />

      {/* 7. Consultation: ink field, heading + reply line (1–5), form (7–12). */}
      <div className="pt-section">
        <section
          id={CONSULTATION_ANCHOR}
          data-surface="ink"
          aria-labelledby="deal-consultation"
          className="section-y"
        >
          <div className="grid-site gap-y-12">
            <div className="col-span-full md:col-span-6 lg:col-span-5">
              <div className="lg:sticky lg:top-[calc(var(--header-h)+2rem)]">
                <h2 id="deal-consultation" className="type-d2">
                  {consultation.title}
                </h2>
                <p className="type-body mt-6 max-w-[40ch]">{consultation.text}</p>
                <p className="type-small mt-4 text-on-ink-muted">{withStubs(consultation.price)}</p>
                <ReplyTime className="mt-6 max-w-[40ch]" />
              </div>
            </div>
            <div className="col-span-full md:col-span-8 lg:col-span-6 lg:col-start-7">
              <BookingForm kind="consultation" page={PATH} />
            </div>
          </div>
        </section>
      </div>
    </>
  )
}
