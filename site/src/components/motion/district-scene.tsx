// «Где жить, а где сдавать» — the signature scene of the home page (art-direction §5, §6 Home 4).
//
// Server component: the island (<Coast>, ~40 KB of path data) and the six district blocks are
// rendered here, so no coastline data ships to the client. `DistrictSceneMotion` (client) only
// enhances the markup it receives as children:
//   • ≥1024 px, motion allowed: the stage holds for 6 × 60svh, the island is drawn north → south
//     with the scroll, the active district segment thickens 1.5 → 3 px in laterite, the district
//     text switches with a 600 ms mask, the list of names drives and mirrors the scroll, snap per district.
//   • ≥1024 px, reduced motion: no pin, no movement; sticky island, the segment of the district in
//     view is highlighted instantly.
//   • <1024 px, or no JS: island + six stacked district blocks (complete static content).
//
// Layout is never switched by script (CLS): the pinned layout of the first mode is CSS in
// motion.css, keyed on `html.js` (set before first paint) and the same media query the motion code
// uses. The scroll track it needs is reserved there too, and the hold is `position: sticky`, so the
// page has its final geometry from the first paint and hydration changes paint only.
// The data-scene-* attributes below are the hooks for that CSS and for district-scene-motion.tsx.
import { clsx } from 'clsx'
import { Coast, Locator } from '@/components/coast'
import type { DistrictId } from '@/components/coast/types'
import { Figure } from '@/components/ui/figure'
import { TextLink } from '@/components/ui/text-link'
import { photoMeta, type PhotoKey } from '@/lib/photos'
import { DistrictSceneMotion } from './district-scene-motion'

export type DistrictSceneItem = {
  id: DistrictId
  /** District name, D2 (copy-home §4 spelling: «Ката и Карон», «Раваи и Най Харн»). */
  name: string
  /** Broker's verdict, Lead, one sentence. */
  verdict: string
  /** Three facts rendered as a <dl>: «Где», «Кому подходит», «Что покупают». */
  facts: { term: string; value: string }[]
  /** 3:2 photo; without it the block shows a 160 px locator (art-direction §4, §7). */
  photo?: PhotoKey
  /** District page, e.g. `/thailand/phuket/bang-tao`. */
  href?: string
  /** Link text for `href`. Default «{name} подробно» (copy-home §4: «Банг Тао подробно»). */
  linkLabel?: string
}

export type DistrictSceneProps = {
  districts: DistrictSceneItem[]
  /** Section h2 (D2). Pass it: district names are h3. */
  title?: string
  /** Lead next to the h2. */
  lead?: string
  /** Screen-reader name of the island. */
  mapLabel?: string
  /** id of the <section> (anchor target). */
  id?: string
  className?: string
}

export function DistrictScene({
  districts,
  title,
  lead,
  mapLabel = 'Карта Пхукета, шесть районов с севера на юг',
  id = 'gde-zhit',
  className,
}: DistrictSceneProps) {
  const headingId = `${id}-title`

  return (
    <section
      id={id}
      aria-labelledby={title ? headingId : undefined}
      data-district-scene=""
      className={clsx('section-y', className)}
    >
      {title ? (
        <div className="grid-site lg:items-baseline-last">
          <h2 id={headingId} data-reveal="lines" className="type-d2 col-span-full lg:col-span-8">
            {title}
          </h2>
          {lead ? (
            <p
              data-reveal="fade"
              className="type-lead col-span-full mt-6 max-w-[40ch] md:col-span-6 lg:col-span-4 lg:col-start-9 lg:mt-0"
            >
              {lead}
            </p>
          ) : null}
        </div>
      ) : null}

      <DistrictSceneMotion ids={districts.map((d) => d.id)}>
        {/* Pinned layout (≥1024 px, motion allowed, html.js): see «District scene» in motion.css. */}
        <div data-scene-stage="" className="grid-site mt-heading">
          {/* Island: table of contents of the coast. */}
          <div
            data-scene-map=""
            className={clsx(
              'col-span-full flex justify-center md:col-span-4 md:col-start-3',
              'lg:sticky lg:top-[calc(var(--header-h)+2rem)] lg:col-span-5 lg:col-start-1 lg:row-span-2 lg:self-start',
            )}
          >
            <Coast
              id="phuket-island"
              districts
              title={mapLabel}
              className={clsx(
                'h-[min(60svh,32rem)] w-auto text-ink-muted',
                'lg:h-[calc(100svh-var(--header-h)-4rem)] lg:max-h-[80svh]',
              )}
            />
          </div>

          <div
            data-scene-text=""
            className="col-span-full mt-16 md:col-span-8 lg:col-span-6 lg:col-start-7 lg:mt-0"
          >
            <ol data-scene-panels="" className="space-y-24 lg:space-y-section">
              {districts.map((d) => (
                <DistrictPanel key={d.id} district={d} />
              ))}
            </ol>

            {/* Scene navigation: shown only in the pinned layout; anchors work without JS anyway. */}
            <nav aria-label="Районы Пхукета" data-scene-nav="" className="mt-12 hidden">
              <ul className="type-ui flex flex-wrap gap-x-6 gap-y-2">
                {districts.map((d) => (
                  <li key={d.id}>
                    <a
                      href={`#rajon-${d.id}`}
                      data-scene-link={d.id}
                      className="link-reveal inline-flex min-h-11 items-center text-ink-muted transition-colors duration-160 hover:text-ink aria-[current=true]:text-ink"
                    >
                      {d.name}
                    </a>
                  </li>
                ))}
              </ul>
            </nav>
          </div>
        </div>
      </DistrictSceneMotion>
    </section>
  )
}

function DistrictPanel({ district: d }: { district: DistrictSceneItem }) {
  const nameId = `rajon-${d.id}-name`
  const place = d.photo ? photoMeta[d.photo].place : null

  return (
    <li
      id={`rajon-${d.id}`}
      data-scene-panel={d.id}
      className="scroll-mt-[calc(var(--header-h)+2rem)]"
    >
      <article aria-labelledby={nameId}>
        <div className="flex items-end justify-between gap-4">
          {/* Mask for the 600 ms name switch; padding keeps descenders (у, р, д) inside the clip. */}
          <div data-scene-name-mask="" className="-my-[0.12em] overflow-hidden py-[0.12em]">
            <h3 id={nameId} data-scene-name="" className="type-d2">
              {d.name}
            </h3>
          </div>
          {d.photo ? (
            <Locator district={d.id} size={64} className="mb-2 shrink-0 lg:hidden" />
          ) : null}
        </div>

        <div data-scene-body="" className="mt-6 grid gap-x-gutter gap-y-10 md:grid-cols-2 lg:mt-8">
          <div>
            <p className="type-lead max-w-[40ch]">{d.verdict}</p>
            <dl className="mt-8 space-y-4">
              {d.facts.map((f) => (
                <div key={f.term}>
                  <dt className="type-small text-ink-muted">{f.term}</dt>
                  <dd className="type-body mt-1">{f.value}</dd>
                </div>
              ))}
            </dl>
            {d.href ? (
              <p className="mt-8">
                <TextLink href={d.href} className="type-ui">
                  {d.linkLabel ?? `${d.name} подробно`}
                </TextLink>
              </p>
            ) : null}
          </div>

          {/* Stacked layouts: the photo opens on enter (MotionRoot); the pinned scene wipes it in itself. */}
          <div data-reveal="clip" className="md:self-start">
            {d.photo ? (
              <Figure
                photo={d.photo}
                ratio="3x2"
                sizes="(min-width: 64rem) 25vw, (min-width: 48rem) 50vw, 100vw"
                locator={place ? <Locator place={place} /> : undefined}
              />
            ) : (
              // Stacked layouts only: in the pinned layout the big island already marks the district
              // (QA round 1, item 9), so motion.css never renders this one there.
              <div data-scene-locator="">
                <Locator district={d.id} size={160} className="text-ink-muted" />
              </div>
            )}
          </div>
        </div>
      </article>
    </li>
  )
}
