import { Locator, type PlaceId } from '@/components/coast'
import { Figure } from '@/components/ui/figure'
import type { Locale } from '@/i18n/config'
import type { DistrictPage, DistrictPageCopy } from './districts'
import { Rich, typo } from './text'

/**
 * «Жизнь в районе» (art-direction §6 block 3): a 4:5 photo in columns 2–5, the 1:1 «пример
 * формата» in 9–11 and 120 px lower, the quiet heading (D3) and the broker's paragraph between them.
 * `showSquare={false}` drops the 1:1 when another block on the page already shows that photo
 * (the Formats villa, copy-round2 §3), so one frame never appears twice on a page.
 */
export function DistrictLife({
  locale,
  life,
  copy,
  place,
  showSquare = true,
}: {
  locale: Locale
  /** Photos (facts). */
  life: DistrictPage['life']
  /** Words: heading, paragraph and the two captions. */
  copy: DistrictPageCopy['life']
  place: PlaceId | null
  showSquare?: boolean
}) {
  return (
    <section aria-labelledby="life-title" className="grid-site gap-y-12 pt-section">
      <div data-reveal="clip" className="col-span-3 md:col-span-4 lg:col-span-4 lg:col-start-2 lg:row-start-1">
        <Figure
          locale={locale}
          photo={life.portrait.key}
          ratio="4x5"
          sizes="(min-width: 64rem) 33vw, (min-width: 48rem) 50vw, 75vw"
          caption={copy.portraitCaption}
          locator={place ? <Locator place={place} /> : undefined}
        />
      </div>

      <div
        data-reveal="fade"
        className="col-span-full md:col-span-4 md:col-start-5 md:self-end lg:col-span-3 lg:col-start-6 lg:row-start-1 lg:self-center"
      >
        <h2 id="life-title" className="type-d3">
          {typo(copy.title, locale)}
        </h2>
        <p className="type-body mt-6 max-w-[40ch]">
          <Rich text={copy.text} locale={locale} />
        </p>
      </div>

      {showSquare ? (
        <div
          data-reveal="clip"
          className="col-span-3 col-start-2 md:col-span-4 md:col-start-5 lg:col-span-3 lg:col-start-9 lg:row-start-1 lg:mt-[7.5rem]"
        >
          <Figure
            locale={locale}
            photo={life.square.key}
            ratio="1x1"
            sizes="(min-width: 64rem) 25vw, (min-width: 48rem) 50vw, 75vw"
            caption={copy.squareCaption}
          />
        </div>
      ) : null}
    </section>
  )
}
