import { clsx } from 'clsx'
import { StubNote, splitStubs } from '@/components/sections/shared/stub'
import { Figure } from '@/components/ui/figure'
import { SectionHeading } from '@/components/ui/section-heading'
import { TextLink } from '@/components/ui/text-link'
import { type PhotoKey, type PhotoRatio, type Ratio, photoRatios } from '@/lib/photos'
import { Rich, typo } from './text'

/** One format card (copy: `formats` in ./content). */
export type FormatItem = {
  id: string
  title: string
  text: string
  /** Kind of title, Small fact: «Полная собственность в пределах квоты 49 %». */
  ownership: string
  /** Who it suits, Small fact. */
  suits: string
  photo: PhotoKey
  /** 3:2 takes the wide slot (7 columns), 4:5 the narrow one (5 columns, 96 px lower). */
  ratio: '3x2' | '4x5'
  /** Under the photo: «Пример формата: …». */
  caption: string
}

/** Section copy (copy: `formatsHeading` in ./content). Only `title` is required; the CTA's href
 * comes from the page (`href` prop), so a district page links to its own quiz. */
export type FormatsHeading = {
  title: string
  lead?: string
  /** Line after the cards, e.g. the 24-hour promise. */
  note?: string
  cta?: { label: string; href?: string }
}

type FormatsProps = {
  id: string
  heading: FormatsHeading
  items: readonly FormatItem[]
  /** Quiz link after the cards: the hub's Phuket quiz, or the district quiz on a district page. */
  href: string
}

type Slot = { wide: boolean; lg: string; lower: boolean }

// Static class strings, so Tailwind sees every one of them.
const WIDE_LEFT = 'lg:col-span-7 lg:col-start-1'
const WIDE_RIGHT = 'lg:col-span-7 lg:col-start-6'
const NARROW_LEFT = 'lg:col-span-5 lg:col-start-1'
const NARROW_RIGHT = 'lg:col-span-5 lg:col-start-8'

/**
 * Pair geometry of art-direction §4 «Карточка проекта»: a 3:2 photo takes the wide slot (7
 * columns), a 4:5 photo the narrow one (5 columns) set 96 px lower than its partner. A mixed pair
 * shares a row, 7 + 5 or 5 + 7 in copy order; a card without a partner of the other shape gets a
 * row of its own and alternates sides, so the column of cards zigzags instead of forming a grid.
 */
function placeCards(items: readonly FormatItem[]): Slot[] {
  const slots: Slot[] = []
  let row = 0
  let i = 0
  while (i < items.length) {
    const aWide = items[i].ratio !== '4x5'
    const b = items[i + 1]
    if (b && aWide !== (b.ratio !== '4x5')) {
      slots.push(
        aWide ? { wide: true, lg: WIDE_LEFT, lower: false } : { wide: false, lg: NARROW_LEFT, lower: true },
        aWide ? { wide: false, lg: NARROW_RIGHT, lower: true } : { wide: true, lg: WIDE_RIGHT, lower: false },
      )
      i += 2
    } else {
      const left = row % 2 === 0
      slots.push(
        aWide
          ? { wide: true, lg: left ? WIDE_LEFT : WIDE_RIGHT, lower: false }
          : { wide: false, lg: left ? NARROW_RIGHT : NARROW_LEFT, lower: false },
      )
      i += 1
    }
    row += 1
  }
  return slots
}

/** The crop the copy asks for, or the nearest one the photo has (not every photo has a 4:5). */
function cropFor(photo: PhotoKey, wanted: FormatItem['ratio']): Ratio {
  const available = photoRatios(photo)
  if (available.includes(wanted)) return wanted
  const other = wanted === '3x2' ? '4x5' : '3x2'
  return available.includes(other) ? other : available[0]
}

/**
 * «Форматы, с которыми работаем» (QA round 1 §4), in place of the project cards on
 * /thailand/phuket and the district pages until the client sends real projects with the
 * developer's permission to show them. Types of property, not projects: no names, prices or
 * hand-over dates are invented. Each card: Figure with «Пример формата» under the photo, title D3,
 * a Body sentence, the kind of title and who it suits as Small facts. No badges or carousels.
 */
export function Formats({ id, heading, items, href }: FormatsProps) {
  const slots = placeCards(items)
  const title = splitStubs(heading.title)

  return (
    <section aria-labelledby={id} className="grid-site pt-section">
      <SectionHeading
        id={id}
        title={typo(title.text)}
        lead={heading.lead ? <Rich text={heading.lead} /> : undefined}
        reveal
      />
      {title.notes.length ? <StubNote notes={title.notes} className="col-span-full" /> : null}

      <ul role="list" className="col-span-full mt-heading grid grid-cols-subgrid gap-y-16 md:gap-y-20 lg:gap-y-32">
        {items.map((item, index) => {
          const slot = slots[index]
          const crop = cropFor(item.photo, item.ratio)
          const name = splitStubs(item.title)
          return (
            <li
              key={item.id}
              className={clsx(
                'col-span-full',
                slot.wide ? 'md:col-span-6' : 'md:col-span-5',
                index % 2 === 1 && (slot.wide ? 'md:col-start-3' : 'md:col-start-4'),
                slot.lg,
                slot.lower && 'lg:mt-24',
              )}
            >
              <div data-reveal="clip">
                <Figure
                  photo={item.photo}
                  ratio={crop as PhotoRatio<typeof item.photo>}
                  sizes={
                    slot.wide
                      ? '(min-width: 64rem) 58vw, (min-width: 48rem) 75vw, 100vw'
                      : '(min-width: 64rem) 42vw, (min-width: 48rem) 62vw, 100vw'
                  }
                  caption={typo(item.caption)}
                />
              </div>
              <div data-reveal="fade" className="mt-6 lg:mt-8">
                <h3 className="type-d3 max-w-[20ch]">{typo(name.text)}</h3>
                <StubNote notes={name.notes} />
                <p className="type-body mt-4 max-w-[44ch]">
                  <Rich text={item.text} />
                </p>
                <dl className="type-small mt-6 flex max-w-[44ch] flex-col gap-3">
                  <div>
                    <dt className="text-ink-muted">Право собственности</dt>
                    <dd className="mt-1">
                      <Rich text={item.ownership} />
                    </dd>
                  </div>
                  <div>
                    <dt className="text-ink-muted">Кому подходит</dt>
                    <dd className="mt-1">
                      <Rich text={item.suits} />
                    </dd>
                  </div>
                </dl>
              </div>
            </li>
          )
        })}
      </ul>

      <div data-reveal="fade" className="col-span-full mt-16 md:col-span-6 lg:col-span-5 lg:col-start-1 lg:mt-24">
        {heading.note ? (
          <p className="type-lead max-w-[40ch]">
            <Rich text={heading.note} />
          </p>
        ) : null}
        <p className={clsx('type-ui', heading.note && 'mt-6')}>
          <TextLink href={href}>{heading.cta?.label ?? 'Запросить подборку'}</TextLink>
        </p>
      </div>
    </section>
  )
}
