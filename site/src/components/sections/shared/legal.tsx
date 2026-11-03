import type { ReactNode } from 'react'

/**
 * Layout of the legal pages (/privacy, /consent): h1 D2, a Lead, numbered sections with h2 D3 in
 * a 64ch column, and the «Редакция от …» line at the end. Plain document typography: no photos,
 * no motion hooks.
 */
export function LegalPage({
  id,
  title,
  lead,
  edition,
  children,
}: {
  id: string
  title: string
  lead: string
  /** «03.11.2026»: shown as «Редакция от 03.11.2026». */
  edition: string
  children: ReactNode
}) {
  return (
    <article aria-labelledby={id} className="grid-site pt-[calc(var(--header-h)+3rem)] pb-section lg:pt-[calc(var(--header-h)+5rem)]">
      <h1 id={id} className="type-d2 col-span-full lg:col-span-9">
        {title}
      </h1>
      <p className="type-lead col-span-full mt-8 max-w-[52ch] lg:col-span-7">{lead}</p>
      <div className="col-span-full mt-16 flex max-w-[64ch] flex-col gap-12 lg:col-span-7">
        {children}
        <p className="type-small nums text-ink-muted">Редакция от {edition}</p>
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
