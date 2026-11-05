import type { ReactNode } from 'react'
import { type Locale, intlLocale } from '@/i18n/config'

/**
 * Layout of the legal pages (/privacy, /consent): h1 D2, an optional Small note under it, a Lead,
 * numbered sections with h2 D3 in a 64ch column, and the «Редакция от …» line at the end. Plain
 * document typography: no photos, no motion hooks. Words come from the page (`legal` dictionary).
 */
export function LegalPage({
  id,
  title,
  note,
  lead,
  edition,
  children,
}: {
  id: string
  title: string
  /**
   * One Small line right under the h1, e.g. that the Russian text prevails (`legal.prevailNote`).
   * Empty or missing renders nothing (the Russian pages).
   */
  note?: string
  lead: string
  /** The whole last line, e.g. «Редакция от 03.11.2026» (`legal.edition` filled with the date). */
  edition: string
  children: ReactNode
}) {
  return (
    <article aria-labelledby={id} className="grid-site pt-[calc(var(--header-h)+3rem)] pb-section lg:pt-[calc(var(--header-h)+5rem)]">
      <h1 id={id} className="type-d2 col-span-full lg:col-span-9">
        {title}
      </h1>
      {note ? <p className="type-small col-span-full mt-4 max-w-[52ch] text-ink-muted lg:col-span-7">{note}</p> : null}
      <p className="type-lead col-span-full mt-8 max-w-[52ch] lg:col-span-7">{lead}</p>
      <div className="col-span-full mt-16 flex max-w-[64ch] flex-col gap-12 lg:col-span-7">
        {children}
        <p className="type-small nums text-ink-muted">{edition}</p>
      </div>
    </article>
  )
}

export function LegalSection({ title, children }: { title: string; children: ReactNode }) {
  return (
    <section className="flex flex-col gap-4">
      <h2 className="type-d3">{title}</h2>
      {children}
    </section>
  )
}

/** Body list with quiet markers; items end with «;», the last one with «.». */
export function LegalList({ items }: { items: readonly ReactNode[] }) {
  return (
    <ul className="type-body flex list-disc flex-col gap-2 pl-[1.2em] marker:text-ink-muted">
      {items.map((item, i) => (
        <li key={i}>{item}</li>
      ))}
    </ul>
  )
}

export { rich } from '@/i18n/rich'

/**
 * A date of the legal and credits pages in the locale's numeric form: «2026-11-03» → «03.11.2026»
 * (ru), «11/03/2026» (en), «03/11/2026» (es).
 */
export function legalDate(isoDate: string, locale: Locale): string {
  return new Intl.DateTimeFormat(intlLocale[locale], {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
    timeZone: 'UTC',
  }).format(new Date(`${isoDate}T00:00:00Z`))
}
