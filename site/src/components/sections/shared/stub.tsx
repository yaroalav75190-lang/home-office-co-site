import { clsx } from 'clsx'
import { Fragment, type ReactNode } from 'react'

/**
 * Visible placeholder for a fact only the client can give (QA round 1 §2): phone, e-mail, legal
 * entity, hours, team names and photos, reviews, the year the agency opened, project names.
 *
 * Always quiet: Small, ink-muted, whatever the size of the text around it, so a placeholder never
 * reads as copy and never takes a D1–D3 size. In a heading position do not nest it in the heading:
 * use `splitStubs` + `<StubNote>` so the heading keeps its neutral label and the note goes under it.
 *
 *   <Stub>год</Stub>            → «[заглушка: год]»
 *   <Stub raw>[заглушка]</Stub>  → text as is
 */
export function Stub({ children, raw = false, className }: { children: ReactNode; raw?: boolean; className?: string }) {
  return (
    <span data-stub="" className={clsx('type-small text-ink-muted on-ink:text-on-ink-muted', className)}>
      {raw ? children : <>[заглушка: {children}]</>}
    </span>
  )
}

const STUB_PATTERN = /(\[заглушка[^\]]*\])/g
const STUB_ONLY = /\[заглушка[^\]]*\]/g

export function hasStub(text: string): boolean {
  return text.includes('[заглушка')
}

/**
 * Wraps every «[заглушка…]» inside a plain string in a quiet <Stub>, e.g. strings from
 * `@/lib/site` such as «+7 [заглушка: номер для сайта]». For running text (Body, Lead, Small).
 */
export function withStubs(text: string): ReactNode {
  if (!hasStub(text)) return text
  return text.split(STUB_PATTERN).map((part, i) =>
    part.startsWith('[заглушка') ? (
      <Stub key={i} raw>
        {part}
      </Stub>
    ) : (
      <Fragment key={i}>{part}</Fragment>
    ),
  )
}

/**
 * Splits a copy string meant for a heading position (D1–D3, a D2 link) into the text that may be
 * set large and the placeholder notes that go under it in Small. When nothing is left once the
 * placeholders are out, `fallback` is the heading's neutral label (e.g. «Телефон» for
 * «+7 [заглушка: номер для сайта]» set as «Телефон» + note).
 *
 *   splitStubs('Банг Тао или Камала: [заглушка: разница]') → { text: 'Банг Тао или Камала', notes: ['[заглушка: разница]'] }
 */
export function splitStubs(text: string, fallback = ''): { text: string; notes: string[] } {
  if (!hasStub(text)) return { text, notes: [] }
  const notes = text.match(STUB_ONLY) ?? []
  const rest = text
    .replace(STUB_ONLY, ' ')
    .replace(/\s+([,.;:])/g, '$1')
    .replace(/\s{2,}/g, ' ')
    .replace(/^[\s,.;:]+|[\s,;:]+$/g, '')
    // A lone prefix such as «+7» is not a heading on its own.
    .replace(/^\+?\d{0,3}$/, '')
  return { text: rest || fallback, notes }
}

/** The Small note under a heading whose copy carried placeholders (see `splitStubs`). */
export function StubNote({ notes, className }: { notes: readonly string[]; className?: string }) {
  if (!notes.length) return null
  return (
    <p data-stub="" className={clsx('type-small mt-2 text-ink-muted on-ink:text-on-ink-muted', className)}>
      {notes.join(' ')}
    </p>
  )
}
