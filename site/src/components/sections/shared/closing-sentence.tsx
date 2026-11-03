'use client'

import { useSyncExternalStore } from 'react'
import {
  REPLY_FALLBACK,
  computeReplyState,
  replyConfig,
  subscribeClock,
  visitorTimeZone,
} from '@/lib/reply-time'

/**
 * The closing sentence with the reply time built in (copy-home §10, copy-phuket §8, copy-bang-tao §7):
 * - in hours: «{title}, и брокер ответит до 16:55»;
 * - out of hours: «{title}. Брокер ответит завтра до 5:15 по вашему времени»;
 * - no JS (and the server render): «{title}. Отвечаем в течение 15 минут».
 * Visitor zone unknown: Phuket times, said so.
 */
export function closingSentence(title: string, now: number, visitorTz: string | undefined): string {
  try {
    const s = computeReplyState(now, visitorTz, replyConfig())
    if (s.open) return `${title}, и брокер ответит до ${s.replyBy}${s.known ? '' : ' по Пхукету'}`
    if (!s.known) return `${title}. Брокер ответит в начале рабочего дня, с ${s.openText} по Пхукету`
    return `${title}. Брокер ответит ${s.tomorrow ? 'завтра' : 'сегодня'} до ${s.openReply} по вашему времени`
  } catch {
    return `${title}. ${REPLY_FALLBACK}`
  }
}

type ClosingSentenceProps = {
  title: string
  id?: string
  className?: string
}

/**
 * h2 whose wording follows the live reply state; refreshed every 30 s with the shared clock.
 * It sits at the bottom of the page, so the swap after hydration happens off screen (no CLS).
 * Do not put `data-reveal="lines"` on it: SplitText would fight React over the changing text.
 */
export function ClosingSentence({ title, id, className }: ClosingSentenceProps) {
  const text = useSyncExternalStore(
    subscribeClock,
    () => closingSentence(title, Date.now(), visitorTimeZone()),
    () => null,
  )
  return (
    <h2 id={id} className={className}>
      {text ?? `${title}. ${REPLY_FALLBACK}`}
    </h2>
  )
}
