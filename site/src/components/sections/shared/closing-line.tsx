import { clsx } from 'clsx'
import type { ReactNode } from 'react'
import { useId } from 'react'
import { Button } from '@/components/ui/button'
import { MessengerLink } from '@/components/ui/messenger-link'
import { getDictionary } from '@/i18n'
import type { Locale } from '@/i18n/config'
import { contacts } from '@/lib/site'
import { ClosingSentence } from './closing-sentence'
import { withStubs } from './stub'

type ClosingLineProps = {
  locale: Locale
  /**
   * Start of the closing sentence, without the reply part: «Расскажите, что ищете»,
   * «Расскажите, что ищете на Пхукете». The component appends «, и брокер ответит до 16:55»
   * (or the out-of-hours / no-JS wording, copy-home §10).
   */
  title: string
  /** Optional primary button under the sentence, e.g. «Подобрать на Пхукете» → /podbor?country=phuket. */
  cta?: { label: string; href: string }
  /** Extra Small line at the end of the contact column, e.g. the «Встречаемся лично…» line on the home page. */
  note?: ReactNode
  className?: string
}

/**
 * Closing line (art-direction §6 «Главная» 10, taste-skill «Sentence, portrait, two links»):
 * three elements hanging from one top line — the D3 sentence with the live reply time
 * (columns 1–5), a 1:1 portrait of the person behind the messengers (8–9), Telegram and WhatsApp
 * tiles with the phone under them (10–12). Phone sits next to the messengers by the tech lead's
 * decision. The number is Ivan's, so the portrait is his: a typographic card with the initial
 * until the team is photographed (DEMO_DECISIONS «Люди и отзывы», shot list §7.1).
 *
 * Spacing: `py-section` — it is the last salt section before the ink footer.
 * Mobile: sentence, then a 96 px portrait with its caption, then the tiles.
 */
export function ClosingLine({ locale, title, cta, note, className }: ClosingLineProps) {
  const headingId = useId()
  const { founder, closingLine } = getDictionary(locale).common
  return (
    <section aria-labelledby={headingId} className={clsx('grid-site py-section', className)}>
      <div className="col-span-full md:col-span-6 lg:col-span-5">
        <ClosingSentence id={headingId} title={title} className="type-d3 nums max-w-[24ch]" />
        {cta ? (
          <div className="mt-8">
            <Button href={cta.href}>{cta.label}</Button>
          </div>
        ) : null}
      </div>

      <figure
        data-reveal="fade"
        className="col-span-full mt-12 flex items-end gap-4 md:col-span-3 lg:col-span-2 lg:col-start-8 lg:mt-0 lg:block"
      >
        <div
          aria-hidden="true"
          className="flex aspect-square w-24 shrink-0 items-end overflow-hidden bg-sand p-2 lg:w-full lg:p-3"
        >
          <span className="font-display text-[4.5rem] leading-[0.8] font-light lg:text-[clamp(5rem,9vw,9rem)]">
            {founder.name.charAt(0)}
          </span>
        </div>
        <figcaption className="type-small text-ink-muted lg:mt-3">
          {founder.name}, {founder.role}
        </figcaption>
      </figure>

      <div
        data-reveal="fade"
        className="col-span-full mt-8 md:col-span-5 md:mt-12 lg:col-span-3 lg:col-start-10 lg:mt-0"
      >
        <div className="flex flex-col gap-2">
          <MessengerLink channel="telegram" className="w-full" />
          <MessengerLink channel="whatsapp" className="w-full" />
        </div>
        <p className="type-small mt-4 text-ink-muted">
          {closingLine.call}{' '}
          <a href={contacts.phone.href} className="link-underline nums text-ink">
            {withStubs(contacts.phone.display)}
          </a>
        </p>
        {note ? <p className="type-small mt-3 max-w-[40ch] text-ink-muted">{note}</p> : null}
      </div>
    </section>
  )
}
