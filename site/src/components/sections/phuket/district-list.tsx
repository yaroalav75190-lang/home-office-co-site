import { clsx } from 'clsx'
import { TransitionLink as Link } from '@/components/motion/transition-link'
import { Locator } from '@/components/coast'
import { SectionHeading } from '@/components/ui/section-heading'
import { Figure } from '@/components/ui/figure'
import { TextLink } from '@/components/ui/text-link'
import { getDictionary } from '@/i18n'
import type { Locale } from '@/i18n/config'
import { phuketPage } from './content'
import { type District, type DistrictCopy, districtHref, districts } from './districts'
import { Rich, typo } from './text'

const { districts: facts } = phuketPage

/**
 * «Шесть районов Пхукета» (art-direction §4 «Карточка района», §6 block 3), north to south.
 * Anchor `#rajony` (home page and menu link here); each row has the district slug as its id,
 * so the island labels in the hero jump to it.
 */
export function DistrictList({ locale }: { locale: Locale }) {
  const t = getDictionary(locale)
  const copy = t.phuket.districtList
  return (
    <section id={facts.id} aria-labelledby="rajony-title" className="grid-site pt-section">
      <SectionHeading id="rajony-title" title={copy.title} lead={typo(copy.lead, locale)} reveal />

      <ol role="list" data-reveal="items" className="col-span-full mt-heading grid grid-cols-subgrid">
        {districts.map((d) => (
          <DistrictRow key={d.id} locale={locale} district={d} copy={t.districts.districts[d.id]} />
        ))}
      </ol>

      <p className="type-ui col-span-full mt-12 lg:col-start-6 lg:col-span-7">
        <TextLink href={facts.quizHref}>{copy.quiz}</TextLink>
      </p>
    </section>
  )
}

/**
 * One district row. Desktop: name D2 (1–5), verdict Lead and two facts Small (6–8), locator
 * 96 px with the district segment (9–10), photo 3:2 (11–12); without a photo the locator grows
 * to 160 px and takes the photo's place. Mobile: name with the 96 px locator, verdict, facts,
 * photo across the width.
 *
 * Only a district with its own page is a link (copy-phuket §3): the whole row is clickable through
 * the stretched name link, the row turns sand on hover and the photo opens from an 8 % inset to
 * full (600 ms). Rows of districts without a page are plain text with no hover: sending them to the
 * quiz would answer «tell me about Kamala» with a form.
 */
function DistrictRow({ locale, district: d, copy }: { locale: Locale; district: District; copy: DistrictCopy }) {
  const linked = Boolean(d.page)
  const name = typo(copy.name, locale)

  return (
    <li
      id={d.slug}
      className={clsx(
        'relative isolate col-span-full grid scroll-mt-[calc(var(--header-h)+1rem)] grid-cols-subgrid gap-y-6 py-10 lg:py-8',
        linked && [
          'group focus-ring-within',
          // Sand band behind the row, a little wider than the text, so the hover reads as a tile.
          'before:absolute before:inset-y-0 before:-inset-x-4 before:-z-10 before:bg-sand before:opacity-0 before:transition-opacity before:duration-160 lg:before:-inset-x-6',
          'hover:before:opacity-100',
        ],
      )}
    >
      <div className="col-span-3 md:col-span-6 lg:col-span-5 lg:row-start-1">
        <h3 className="type-d2">
          {linked ? (
            <Link
              href={districtHref(d)}
              className="after:absolute after:inset-0 after:z-10 after:content-[''] focus-visible:outline-none"
            >
              <span className="link-reveal">{name}</span>
            </Link>
          ) : (
            name
          )}
        </h3>
      </div>

      {/* Locator next to the name under 1024 px */}
      <div className="col-span-1 col-start-4 row-start-1 justify-self-end md:col-span-2 md:col-start-7 lg:hidden">
        <Locator district={d.id} size={96} />
      </div>

      <div className="col-span-full md:col-span-6 lg:col-span-3 lg:col-start-6 lg:row-start-1">
        <p className="type-lead">
          <Rich text={copy.verdict} locale={locale} />
        </p>
        <ul role="list" className="type-small mt-4 flex flex-col gap-1 text-ink-muted">
          {copy.facts.map((fact) => (
            <li key={fact}>
              <Rich text={fact} locale={locale} />
            </li>
          ))}
        </ul>
      </div>

      {/* Desktop locators share one column (9), so the silhouettes run down the list in a line;
          a row without a photo gets the 160 px one to carry the weight of the missing picture. */}
      <div className="hidden lg:col-span-2 lg:col-start-9 lg:row-start-1 lg:block">
        <Locator district={d.id} size={d.photo ? 96 : 160} />
      </div>

      {d.photo ? (
        <Figure
          locale={locale}
          photo={d.photo.key}
          ratio="3x2"
          sizes="(min-width: 64rem) 16vw, (min-width: 48rem) 75vw, 100vw"
          // The row already names the place and carries the locator; on desktop the caption is
          // left to screen readers so the thumbnail stays clean.
          caption={<span className="lg:sr-only">{copy.photoCaption}</span>}
          className="col-span-full md:col-span-6 lg:col-span-2 lg:col-start-11 lg:row-start-1 lg:[&>figcaption]:mt-0"
          mediaClassName={clsx(
            linked &&
              'transition-[clip-path] duration-600 ease-out [@media(hover:hover)]:lg:[clip-path:inset(8%)] [@media(hover:hover)]:lg:group-hover:[clip-path:inset(0)]',
          )}
        />
      ) : null}
    </li>
  )
}
