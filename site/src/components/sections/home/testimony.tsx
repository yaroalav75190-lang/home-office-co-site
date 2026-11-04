import { clsx } from 'clsx'
import { Coast } from '@/components/coast'
import { investSection, reviewSection, reviewSamples, type ReviewSample } from './content'

/**
 * Typographic portrait card (DEMO_DECISIONS «Люди и отзывы»): a sand field with the person's
 * initial set large in the display face, until the team is photographed (shot list §7.1). No stock
 * faces. Decorative: the name is in the caption next to it.
 */
function InitialCard({ initial, label, className }: { initial: string; label: string; className?: string }) {
  return (
    <div
      aria-hidden="true"
      className={clsx('relative flex aspect-[4/5] flex-col justify-between overflow-hidden bg-sand p-4 md:p-5', className)}
    >
      <p className="type-small text-ink-muted">{label}</p>
      <p className="font-display text-[clamp(7rem,26vw,17rem)] leading-[0.8] font-light">{initial}</p>
    </div>
  )
}

/**
 * «Сами инвестируем» (art-direction §6 «Главная» 7): the «Отзыв» scheme for Ivan — portrait 4:5
 * (columns 1–4; the initial card until the shoot), the quote D3 (6–12) 120 px lower, «Иван,
 * основатель…» UI and a paragraph. No stars, no decorative quotation marks. What the team bought
 * and where is not shown until the client names it.
 */
export function HomeInvest() {
  return (
    <section aria-labelledby="home-invest" className="grid-site pt-section">
      <h2 id="home-invest" className="sr-only">
        {investSection.title}
      </h2>

      <div data-reveal="clip" className="col-span-3 md:col-span-4 lg:col-span-4">
        <InitialCard initial={investSection.name.charAt(0)} label={investSection.role} />
      </div>

      <figure className="col-span-full mt-12 grid grid-cols-subgrid md:mt-16 lg:col-span-7 lg:col-start-6 lg:mt-[120px] lg:content-start">
        <blockquote className="col-span-full">
          <p data-reveal="lines" className="type-d3 max-w-[24ch]">
            {investSection.quote}
          </p>
        </blockquote>
        {/* The paragraph lives in the caption: <figcaption> must be the figure's first or last child (W3C). */}
        <figcaption data-reveal="fade" className="col-span-full mt-8 lg:col-span-4">
          <p className="type-ui">{investSection.author}</p>
          <p className="type-body mt-8 max-w-[52ch]">{investSection.text}</p>
        </figcaption>
      </figure>
    </section>
  )
}

/** City (UI), what was bought and the «Пример отзыва» label (Small): the same caption for every review. */
function ReviewCaption({ review, className }: { review: ReviewSample; className?: string }) {
  return (
    <figcaption className={className}>
      <p className="type-ui">{review.city}</p>
      <p className="type-small mt-1 text-ink-muted">Покупка: {review.purchase}</p>
      <p className="type-small mt-1 text-ink-muted">{reviewSection.sampleLabel}</p>
    </figcaption>
  )
}

/**
 * Client reviews (art-direction §6 «Главная» 8, §4 «Отзыв»), mirrored against Ivan's block so the
 * two neighbours do not repeat a layout: the first review keeps the quote D3 on the left and a
 * 4:5 field on the right (9–12), here the district of the purchase on the island instead of a
 * client photo; two shorter reviews follow in Lead.
 *
 * Promo version (DEMO_DECISIONS «Люди и отзывы»): the texts are samples, each labelled «Пример
 * отзыва», never passed off as real. Replace them with real reviews and written consent before
 * launch, or set `SHOW_REVIEW_SAMPLES` to false.
 */
export const SHOW_REVIEW_SAMPLES = true

export function HomeReview() {
  if (!SHOW_REVIEW_SAMPLES || reviewSamples.length === 0) return null
  const [featured, ...rest] = reviewSamples

  return (
    <section aria-labelledby="home-review" className="grid-site pt-section">
      <h2 id="home-review" className="sr-only">
        {reviewSection.title}
      </h2>

      <figure className="col-span-full lg:col-span-7 lg:col-start-1 lg:row-start-1 lg:mt-[120px]">
        <blockquote>
          <p data-reveal="lines" className="type-d3 max-w-[24ch]">
            {featured.quote}
          </p>
        </blockquote>
        <ReviewCaption review={featured} className="mt-8" />
      </figure>

      {/* The island with the district of the purchase, named in the caption (decorative SVG). */}
      <div
        data-reveal="clip"
        className="col-span-3 col-start-2 mt-12 md:col-span-4 md:col-start-5 lg:col-span-4 lg:col-start-9 lg:row-start-1 lg:mt-0"
      >
        <div className="flex aspect-[4/5] items-center justify-center bg-sand">
          <Coast id="phuket-island" lod="mid" highlight={featured.district} decorative className="h-[78%] w-auto" />
        </div>
        <p className="type-small mt-3 text-ink-muted">{featured.place}</p>
      </div>

      {rest.length ? (
        <ul role="list" data-reveal="items" className="col-span-full mt-16 grid grid-cols-subgrid gap-y-12 lg:mt-24">
          {rest.map((review, i) => (
            <li
              key={review.city}
              className={clsx(
                'col-span-full md:col-span-4 lg:col-span-5',
                i % 2 === 1 && 'md:col-start-5 lg:col-start-7 lg:mt-24',
              )}
            >
              <figure>
                <blockquote>
                  <p className="type-lead max-w-[36ch]">{review.quote}</p>
                </blockquote>
                <ReviewCaption review={review} className="mt-6" />
              </figure>
            </li>
          ))}
        </ul>
      ) : null}
      {/* «Все отзывы» (reviewSection.allLabel) comes back as a link once /reviews exists. */}
    </section>
  )
}
