'use client'

import { clsx } from 'clsx'
import type { ReplyState } from '@/lib/reply-time'
import { useReplyState } from './use-clock'

/**
 * A reply-time sentence with its own wording, e.g. «Брокер подтвердит запись до 16:55»
 * (copy-contacts §3) or the quiz column «Брокер напишет до 16:55, а в течение 24 часов…».
 * `<ReplyTime />` covers the standard line; this one takes a `render(state)` for page-specific
 * sentences. Server and no-JS render `fallback`; the box keeps two lines so nothing moves.
 */
export function LiveLine({
  render,
  fallback,
  tone = 'laterite',
  reserve = true,
  className,
}: {
  render: (state: ReplyState) => string
  fallback: string
  /** `laterite` for reply lines next to actions; `body` for running text. */
  tone?: 'laterite' | 'body'
  reserve?: boolean
  className?: string
}) {
  const state = useReplyState()
  let text = fallback
  if (state) {
    try {
      text = render(state)
    } catch {
      text = fallback
    }
  }
  return (
    <p
      className={clsx(
        'nums',
        tone === 'laterite' ? 'type-small text-laterite on-ink:text-laterite-on-ink' : 'type-body',
        reserve && 'min-h-[2.8em]',
        className,
      )}
    >
      {text}
    </p>
  )
}
