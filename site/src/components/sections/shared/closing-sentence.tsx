'use client'

import { useSyncExternalStore } from 'react'
import type { CommonDict } from '@/i18n/ru/common'
import { useLocale } from '@/i18n/client'
import type { Locale } from '@/i18n/config'
import { fmt } from '@/i18n/format'
import { computeReplyState, replyConfig, subscribeClock, visitorTimeZone } from '@/lib/reply-time'

/**
 * The closing sentence with the reply time built in (copy-home §10, copy-phuket §8, copy-bang-tao §7):
 * - in hours: «{title}, и брокер ответит до 16:55»;
 * - out of hours: «{title}. Брокер ответит завтра до 5:15 по вашему времени»;
 * - no JS (and the server render): «{title}. Отвечаем в течение 15 минут».
 * Visitor zone unknown: Phuket times, said so. Wording: `common.reply.closing`.
 */
export function closingSentence(
  title: string,
  now: number,
  visitorTz: string | undefined,
  texts: CommonDict['reply'],
  locale: Locale = 'ru',
): string {
  const t = texts.closing
  try {
    const s = computeReplyState(now, visitorTz, replyConfig({ texts, locale }))
    const day = s.tomorrow ? texts.tomorrow : texts.today
    const values = { title, replyBy: s.replyBy, openReply: s.openReply, open: s.openText, day }
    if (s.open) return fmt(s.known ? t.open : t.openUnknownZone, values)
    if (!s.known) return fmt(t.closedUnknownZone, values)
    return fmt(t.closed, values)
  } catch {
    return fmt(t.fallback, { title })
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
  const { locale, t } = useLocale()
  const texts = t.common.reply
  const text = useSyncExternalStore(
    subscribeClock,
    () => closingSentence(title, Date.now(), visitorTimeZone(), texts, locale),
    () => null,
  )
  return (
    <h2 id={id} className={className}>
      {text ?? fmt(texts.closing.fallback, { title })}
    </h2>
  )
}
