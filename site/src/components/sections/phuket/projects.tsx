import { clsx } from 'clsx'
import { Stub } from '@/components/sections/shared/stub'
import { SectionHeading } from '@/components/ui/section-heading'
import { TextLink } from '@/components/ui/text-link'
import { getDictionary } from '@/i18n'
import type { Locale } from '@/i18n/config'
import { Rich, typo } from './text'

type ProjectsProps = {
  locale: Locale
  id: string
  title: string
  lead: string
  /** Two cards (district page: one 7+5 pair) or four (hub: 7+5, then 5+7). */
  count: 2 | 4
  /** Quiz link of every card, «Запросить подборку». */
  href: string
  /** Line under the price on the hub: «Банг Тао, Пхукет». */
  place?: string
  /** Caption under the photo on a district page: «{проект}, Банг Тао, западное побережье Пхукета». */
  caption?: string
}

// Pair geometry (art-direction §4 «Карточка проекта»): 7 + 5 and 5 + 7 columns, the narrow card
// 96 px lower; wide 3:2, narrow 4:5.
const LAYOUT = [
  { wide: true, cls: 'lg:col-span-7' },
  { wide: false, cls: 'lg:col-span-5 lg:col-start-8 lg:mt-24' },
  { wide: false, cls: 'lg:col-span-5 lg:mt-24' },
  { wide: true, cls: 'lg:col-span-7 lg:col-start-6' },
] as const

/**
 * NOT RENDERED since QA round 1 §4: the pages show `<Formats />` (./formats.tsx) instead. Kept as
 * the starting point for real project cards; before reuse, feed it real data and take the
 * placeholders out of the D3 title (a placeholder never sits in a heading, QA round 1 §2).
 *
 * «С чем работаем сейчас» / «Проекты в Банг Тао». Every fact is a placeholder until the client
 * sends real projects with the developer's permission to show photos (copy-phuket §5): renders of
 * other people's objects are never shown as ours. No prices, badges or carousels.
 *
 * copy-phuket §5 says the block stays hidden until four real projects exist; it is built and shown
 * here with visible placeholders so the layout can be judged. Hide it at the page level before launch.
 */
export function Projects({ locale, id, title, lead, count, href, place, caption }: ProjectsProps) {
  const t = getDictionary(locale).phuket
  // Placeholder words of the cards (`card` below is the layout slot).
  const words = t.projects
  return (
    <section aria-labelledby={id} className="grid-site pt-section">
      <SectionHeading id={id} title={title} lead={typo(lead, locale)} reveal />

      <ul role="list" className="col-span-full mt-heading grid grid-cols-subgrid gap-y-16 md:gap-y-20 lg:gap-y-32">
        {LAYOUT.slice(0, count).map((card, i) => (
          <li key={i} className={clsx('col-span-full md:col-span-6', i % 2 === 1 && 'md:col-start-3', card.cls)}>
            <figure>
              <div
                data-reveal="clip"
                className={clsx('flex items-end bg-sand p-4 md:p-6', card.wide ? 'aspect-[3/2]' : 'aspect-[4/5]')}
              >
                <Stub className="type-small">{words.photoStub}</Stub>
              </div>
              {caption ? (
                <figcaption className="type-small mt-3 text-ink-muted">
                  <Rich text={caption} locale={locale} />
                </figcaption>
              ) : null}
            </figure>
            <div data-reveal="fade" className="mt-6">
              <h3 className="type-d3">
                <Stub>{words.nameStub}</Stub>
              </h3>
              <p className="type-body mt-3">
                <Stub>{words.typeStub}</Stub>, {words.handover} <Stub>{words.handoverStub}</Stub>
              </p>
              <p className="type-body">{words.price}</p>
              {place ? (
                <p className="type-small mt-1 text-ink-muted">
                  <Rich text={place} locale={locale} />
                </p>
              ) : null}
              <p className="type-ui mt-6">
                <TextLink href={href}>{t.requestCta}</TextLink>
              </p>
            </div>
          </li>
        ))}
      </ul>
    </section>
  )
}
