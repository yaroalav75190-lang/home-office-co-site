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
import { openGraphFor } from '@/lib/seo/og'
import { site } from '@/lib/site'
import { StageNav } from './_components/stage-nav'
import { afterKeys, checks, consultation, faq, hero, meta, payment, stages } from './content'

const PATH = '/services/deal'

export const metadata: Metadata = {
  // 45 characters; with the « — Home Office & Co» suffix it would pass 60 (seo-brief §4: suffix only if it fits).
  title: { absolute: meta.title },
  description: meta.description,
  alternates: { canonical: PATH },
  openGraph: openGraphFor({ path: PATH, title: meta.title, description: meta.description, photo: 'villa' }),
}

const serviceJsonLd = {
  '@context': 'https://schema.org',
  '@type': 'Service',
  name: 'Сопровождение сделки с недвижимостью',
  serviceType: 'Сопровождение сделки с недвижимостью',
  url: absoluteUrl(PATH),
  provider: { '@type': 'RealEstateAgent', '@id': ORG_ID, name: site.name, url: absoluteUrl('/') },
  areaServed: ['Таиланд', 'Индонезия', 'Объединённые Арабские Эмираты', 'Камбоджа'],
  description: meta.description,
}

export default function DealPage() {
  const [line1, line2] = hero.titleLines
  return (
    <>
      <JsonLd data={serviceJsonLd} />

      {/* 1. Hero: stepped title, lead, consultation button, reply line, villa print 4:5. */}
      <section data-hero="" aria-labelledby="deal-title" className="grid-site pt-[calc(var(--header-h)+2rem)] lg:pt-[calc(var(--header-h)+3rem)]">
        {/* /services has no page yet: the trail is Главная › Сопровождение сделки (seo-brief §4.4). */}
        <Breadcrumbs items={[{ label: 'Главная', href: '/' }, { label: 'Сопровождение сделки' }]} className="mb-8 lg:mb-12" />
        <h1 id="deal-title" data-hero-title="" className="type-d1 col-span-full lg:row-start-2">
          <span className="block">{line1}</span>{' '}
          <span className="block pl-[22vw] md:pl-[calc((100%+var(--grid-gutter))/4)] lg:pl-[calc((100%+var(--grid-gutter))/3)]">
            {line2}
          </span>
        </h1>

        <div className="col-span-full mt-8 md:col-span-5 lg:col-span-4 lg:row-start-3 lg:mt-[calc(3rem_-_0.92*var(--text-d1))]">
          <p className="type-lead max-w-[36ch]">{hero.lead}</p>
          <div className="mt-6 md:mt-8">
            <Button href={`#${consultation.anchor}`}>{hero.cta}</Button>
          </div>
          <ReplyTime className="mt-3 max-w-[40ch] md:mt-4" />
        </div>

        <div
          data-hero-print=""
          className="col-span-2 col-start-3 mt-12 md:col-span-3 md:col-start-6 lg:col-span-3 lg:col-start-10 lg:row-start-3 lg:mt-12"
        >
          <Figure
            photo="villa"
            ratio="4x5"
            preload
            sizes="(min-width: 100rem) 380px, (min-width: 64rem) 24vw, (min-width: 48rem) 36vw, 46vw"
            caption={hero.printCaption}
          />
        </div>
      </section>

      {/* 2. Six stages: sticky list (1–4), stages with h3, text, documents and term (6–12). */}
      <section aria-labelledby="deal-stages" className="grid-site pt-section">
        <SectionHeading id="deal-stages" title={stages.title} lead={stages.lead} reveal />
        <div className="col-span-full mt-heading grid grid-cols-subgrid">
          <div className="hidden lg:col-span-4 lg:block">
            <StageNav items={stages.items.map((s) => ({ id: s.id, label: s.nav }))} />
          </div>
          <ol role="list" className="col-span-full flex flex-col gap-16 md:col-span-7 lg:col-span-7 lg:col-start-6 lg:gap-24">
            {stages.items.map((stage) => (
              <li key={stage.id} id={stage.id} className="scroll-mt-[calc(var(--header-h)+2rem)]">
                <article aria-labelledby={`${stage.id}-title`}>
                  <h3 id={`${stage.id}-title`} data-reveal="lines" className="type-d3">
                    {stage.title}
                  </h3>
                  <div data-reveal="fade">
                    <p className="type-body mt-6 max-w-[60ch]">{stage.text}</p>
                    <dl className="type-small mt-6 grid max-w-[60ch] gap-3 md:grid-cols-[8rem_1fr]">
                      <dt className="text-ink-muted">Документы</dt>
                      <dd>{withStubs(stage.documents)}</dd>
                      <dt className="text-ink-muted">Срок</dt>
                      <dd>{withStubs(stage.term)}</dd>
                    </dl>
                  </div>
                </article>
              </li>
            ))}
          </ol>
          <p data-reveal="fade" className="type-ui col-span-full mt-16 md:col-span-7 lg:col-span-7 lg:col-start-6">
            <TextLink href={stages.guideLink.href}>{stages.guideLink.label}</TextLink>
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
          id={consultation.anchor}
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
