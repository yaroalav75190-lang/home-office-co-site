'use client'

import { clsx } from 'clsx'
import { useSyncExternalStore } from 'react'
import { useLocale } from '@/i18n/client'
import { clockPlaceholder, formatClock, localeClock, subscribeClock } from '@/lib/reply-time'

type LocalTimeProps = {
  /** IANA zone, e.g. `Asia/Bangkok` (see `destinations` in `@/lib/site`). */
  timeZone: string
  /** Accessible context, e.g. «на Пхукете»: read as «16:40 на Пхукете». */
  label?: string
  className?: string
}

/**
 * Live wall-clock time for a zone, refreshed every 30 s, in the page's format («16:40», «4:40 pm»).
 * The server cannot know the time of the visit (pages are static), so the slot is reserved with an
 * invisible «00:00» («00:00 pm» in English) until hydration: same width with tabular figures, no
 * layout shift.
 */
export function LocalTime({ timeZone, label, className }: LocalTimeProps) {
  const { locale } = useLocale()
  // 24-hour «9:05» from the store (also the machine-readable value); shown in the page's format.
  const clock = useSyncExternalStore(
    subscribeClock,
    () => formatClock(Date.now(), timeZone),
    () => null,
  )

  if (clock === null) {
    return (
      <span className={clsx('nums invisible', className)} aria-hidden="true">
        {clockPlaceholder(locale)}
      </span>
    )
  }

  return (
    <time className={clsx('nums', className)} dateTime={clock.padStart(5, '0')}>
      {localeClock(clock, locale)}
      {label ? <span className="sr-only"> {label}</span> : null}
    </time>
  )
}
