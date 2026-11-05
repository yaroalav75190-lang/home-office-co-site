import { TextLink } from '@/components/ui/text-link'
import { getDictionary } from '@/i18n'
import type { Locale } from '@/i18n/config'
import { fmt } from '@/i18n/format'
import { phuketPage } from './content'
import { typo } from './text'

const { ownership: facts } = phuketPage

/**
 * «Право собственности» (art-direction §6 block 4): a sand field, the quiet heading (h2 D3) in
 * columns 1–3 and the two kinds of title as subsections on the 5 and 9 text edges
 * (`.manifesto-grid` 3fr / 9fr from Arven). The h3 reads on its own: object type and type of right.
 */
export function Ownership({ locale }: { locale: Locale }) {
  const { ownership } = getDictionary(locale).phuket
  return (
    <section data-surface="sand" aria-labelledby="ownership-title" className="mt-section py-section">
      <div className="grid-site gap-y-12">
        <h2 id="ownership-title" data-reveal="lines" className="type-d3 col-span-full md:col-span-3">
          {ownership.title}
        </h2>

        {facts.order.map((kind, i) => {
          const part = ownership.parts[kind]
          return (
            <div
              key={kind}
              data-reveal="fade"
              className={
                i === 0
                  ? 'col-span-full md:col-span-5 md:col-start-4 lg:col-span-4 lg:col-start-5'
                  : 'col-span-full md:col-span-5 md:col-start-4 lg:col-span-4 lg:col-start-9'
              }
            >
              <h3 className="type-lead max-w-[24ch] font-medium">{typo(part.title, locale)}</h3>
              <p className="type-body mt-4 max-w-[60ch]">{typo(part.text, locale)}</p>
            </div>
          )
        })}

        <div className="col-span-full md:col-span-5 md:col-start-4 lg:col-span-8 lg:col-start-5">
          {facts.checkedBy ? (
            <p className="type-small mb-4 text-ink-muted">{fmt(ownership.checkedBy, { name: facts.checkedBy })}</p>
          ) : null}
          <p className="type-ui">
            <TextLink href={facts.guideHref}>{ownership.guide}</TextLink>
          </p>
        </div>
      </div>
    </section>
  )
}
