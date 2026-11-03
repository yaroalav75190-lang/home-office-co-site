import { clsx } from 'clsx'
import { useId } from 'react'
import { Faq } from '@/components/ui/faq'
import { SectionHeading } from '@/components/ui/section-heading'
import { withStubs } from './stub'

export type FaqSectionItem = { q: string; a: string }

type FaqSectionProps = {
  /** h2 D2 in columns 1–8. */
  title: string
  items: FaqSectionItem[]
  /** Optional Lead in columns 9–12 on the h2 baseline (SectionHeading). */
  lead?: string
  /**
   * FAQPage JSON-LD. Off by default: Google stopped showing FAQ rich results (07.05.2026) and
   * Yandex has no FAQ block, so the markup brings nothing (seo-brief §6.6). One per page at most.
   */
  schema?: boolean
  /** Anchor for in-page links. */
  id?: string
  className?: string
}

/**
 * FAQ section (art-direction §4 «FAQ»): h2 D2 in columns 1–8, questions in 5–12 below it,
 * native <details>, works without JS. Wraps `ui/Faq`.
 *
 * Spacing: the section carries `pt-section` only, so stacked salt sections keep one section gap
 * between them. Override with `className` when the page needs something else.
 */
export function FaqSection({ title, items, lead, schema = false, id, className }: FaqSectionProps) {
  const headingId = useId()
  return (
    <section id={id} aria-labelledby={headingId} className={clsx('grid-site pt-section', className)}>
      <SectionHeading id={headingId} title={title} lead={lead} reveal />
      <div data-reveal="fade" className="col-span-full mt-heading grid grid-cols-subgrid">
        {/* Placeholders in answers render as quiet Small stubs; the markup gets the plain text. */}
        <Faq
          items={items.map(({ q, a }) => ({ question: q, answer: withStubs(a), answerText: a }))}
          schema={schema}
        />
      </div>
    </section>
  )
}
