import { clsx } from 'clsx'
import type { ReactNode } from 'react'
import { JsonLd } from '@/lib/seo/json-ld'
import { ChevronIcon } from './icons'

export type FaqItem = {
  question: string
  answer: ReactNode
  /** Plain-text answer for FAQPage markup when `answer` is not a string. */
  answerText?: string
}

type FaqProps = {
  items: FaqItem[]
  /** h2 D2 in columns 1–8. Omit when the page renders its own heading. */
  title?: ReactNode
  titleId?: string
  /** Emit FAQPage JSON-LD (one per page). */
  schema?: boolean
  className?: string
}

/**
 * FAQ (art-direction §4): h2 D2 in columns 1–8, questions in 5–12, Lead 500, 24 px apart,
 * 2 px chevron. The open item sits on a sand tile; answer Body up to 60 ch; opening 320 ms.
 * Native <details>, works without JS. Place inside a `grid-site` container.
 */
export function Faq({ items, title, titleId, schema = false, className }: FaqProps) {
  const jsonLd = schema
    ? {
        '@context': 'https://schema.org',
        '@type': 'FAQPage',
        mainEntity: items
          .map((item) => ({
            text: item.answerText ?? (typeof item.answer === 'string' ? item.answer : ''),
            question: item.question,
          }))
          .filter((item) => item.text)
          .map((item) => ({
            '@type': 'Question',
            name: item.question,
            acceptedAnswer: { '@type': 'Answer', text: item.text },
          })),
      }
    : null

  return (
    <div className={clsx('col-span-full grid grid-cols-subgrid', className)}>
      {title ? (
        <h2 id={titleId} className="type-d2 col-span-full lg:col-span-8">
          {title}
        </h2>
      ) : null}
      <div className={clsx('col-span-full md:col-span-8 lg:col-span-8 lg:col-start-5', title && 'mt-heading')}>
        {items.map((item) => (
          <details
            key={item.question}
            className="group details-animate -mx-4 px-4 transition-colors duration-320 open:bg-sand on-ink:open:bg-ink-raised"
          >
            <summary className="type-lead flex min-h-11 items-start justify-between gap-6 py-3 font-medium">
              <span>{item.question}</span>
              <ChevronIcon
                size={20}
                className="mt-[0.2em] shrink-0 transition-transform duration-320 ease-out group-open:rotate-180"
              />
            </summary>
            <div className="type-body max-w-[60ch] pb-6">{item.answer}</div>
          </details>
        ))}
      </div>
      {jsonLd && jsonLd.mainEntity.length > 0 ? <JsonLd data={jsonLd} /> : null}
    </div>
  )
}
