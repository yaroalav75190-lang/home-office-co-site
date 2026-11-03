import type { DistrictPage } from './districts'
import { Rich, typo } from './text'

/**
 * «Где Банг Тао и что рядом» (wireframe «Лоция района», art-direction §6 block 2): h2 D2 and the
 * paragraphs in columns 1–5; the facts as a `dl` without rules in 7–12, label Small ink-muted
 * over the value in Lead. Placeholders stay visible in quiet ink-muted.
 */
export function DistrictFacts({ facts }: { facts: DistrictPage['facts'] }) {
  return (
    <section aria-labelledby="facts-title" className="grid-site gap-y-16 pt-section">
      <div className="col-span-full md:col-span-6 lg:col-span-5">
        <h2 id="facts-title" data-reveal="lines" className="type-d2">
          {typo(facts.title)}
        </h2>
        <div data-reveal="fade" className="type-body mt-10 flex max-w-[48ch] flex-col gap-5 lg:mt-14">
          {facts.paragraphs.map((p) => (
            <p key={p}>
              <Rich text={p} />
            </p>
          ))}
        </div>
      </div>

      <dl
        data-reveal="items"
        className="col-span-full grid grid-cols-subgrid gap-y-10 md:col-span-8 lg:col-span-6 lg:col-start-7 lg:gap-y-12 lg:pt-4"
      >
        {facts.items.map((item, i) => (
          <div
            key={item.term}
            className={
              // The long ones (prices, rent, title) take the full width; the short ones pair up.
              i < 4 ? 'col-span-full md:col-span-4 lg:col-span-3' : 'col-span-full md:col-span-8 lg:col-span-6'
            }
          >
            <dt className="type-small text-ink-muted">{item.term}</dt>
            <dd className="type-lead mt-2 max-w-[44ch]">
              <Rich text={item.value} />
            </dd>
          </div>
        ))}
      </dl>
    </section>
  )
}
