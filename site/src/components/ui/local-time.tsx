'use client'

import { clsx } from 'clsx'
import { useSyncExternalStore } from 'react'
import { formatClock, subscribeClock } from '@/lib/reply-time'

type LocalTimeProps = {
  /** IANA zone, e.g. `Asia/Bangkok` (see `destinations` in `@/lib/site`). */
  timeZone: string
  /** Accessible context, e.g. «на Пхукете»: read as «16:40 на Пхукете». */
  label?: string
  className?: string
}

/**
 * Live wall-clock time for a zone, refreshed every 30 s. The server cannot know the time of the
 * visit (pages are static), so the slot is reserved with an invisible «00:00» until hydration:
 * same width with tabular figures, no layout shift.
 */
export function LocalTime({ timeZone, label, className }: LocalTimeProps) {
  const time = useSyncExternalStore(
    subscribeClock,
    () => formatClock(Date.now(), timeZone),
    () => null,
  )

  if (time === null) {
    return (
      <span className={clsx('nums invisible', className)} aria-hidden="true">
        00:00
      </span>
    )
  }

  return (
    <time className={clsx('nums', className)} dateTime={time.padStart(5, '0')}>
      {time}
      {label ? <span className="sr-only"> {label}</span> : null}
    </time>
  )
}
