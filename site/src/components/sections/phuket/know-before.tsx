import { Locator } from '@/components/coast'
import { Stub, hasStub } from '@/components/sections/shared/stub'
import { Figure } from '@/components/ui/figure'
import { getDictionary } from '@/i18n'
import type { Locale } from '@/i18n/config'
import { phuketPage } from './content'
import { Rich, typo } from './text'

/**
 * «Что знать до покупки» (art-direction §6, taste-skill «Quiet figure lines»): a `dl` in
 * columns 1–7, each line a D2 figure with its unit on one baseline and the phrase in Body beside
 * it; no rules between lines, only space. kata.jpg 1:1 in columns 10–12 rides along (sticky).
 * A figure the client has not given yet (a stub marker in `value`) is a quiet note, never a D2.
 */
export function KnowBefore({ locale }: { locale: Locale }) {
  const { know } = getDictionary(locale).phuket
  return (
    <section aria-labelledby="know-title" className="grid-site pt-section">
      <h2 id="know-title" data-reveal="lines" className="type-d2 col-span-full lg:col-span-8">
        {know.title}
      </h2>

      <dl data-reveal="items" className="col-span-full mt-heading grid grid-cols-subgrid gap-y-10 lg:col-span-7 lg:gap-y-12">
        {phuketPage.know.order.map((id) => {
          const item = know.items[id]
          const missing = hasStub(item.value)
          return (
            <div key={id} className="col-span-full grid grid-cols-subgrid gap-y-3 md:items-baseline">
              <dt className="col-span-full flex items-baseline gap-x-3 md:col-span-3 lg:col-span-4">
                {missing ? (
                  <Stub>{know.figureStub}</Stub>
                ) : (
                  <span className="type-d2 nums">{typo(item.value, locale)}</span>
                )}
                {item.unit ? <span className="type-lead">{item.unit}</span> : null}
              </dt>
              <dd className="type-body col-span-full max-w-[38ch] md:col-span-5 lg:col-span-3 lg:col-start-5">
                <Rich text={item.text} locale={locale} />
              </dd>
            </div>
          )
        })}
      </dl>

      <div className="col-span-full mt-16 md:col-span-4 md:col-start-5 lg:col-span-3 lg:col-start-9 lg:row-start-2 lg:mt-heading">
        <div data-reveal="clip" className="lg:sticky lg:top-[calc(var(--header-h)+2rem)]">
          <Figure
            locale={locale}
            photo="kata"
            ratio="1x1"
            sizes="(min-width: 64rem) 25vw, (min-width: 48rem) 50vw, 100vw"
            caption={know.photoCaption}
            locator={<Locator place="kata" />}
          />
        </div>
      </div>
    </section>
  )
}
