'use client'

import { useSyncExternalStore } from 'react'
import { computeReplyState, replyConfig, subscribeClock, visitorTimeZone } from '@/lib/reply-time'

const FALLBACK = 'We reply within 15 minutes'

/** «4:55 pm» in the visitor's zone (or Phuket's), 12-hour clock as in copy-global §12. */
function englishTime(ms: number, tz: string | undefined): string {
  return new Intl.DateTimeFormat('en-US', { hour: 'numeric', minute: '2-digit', hour12: true, timeZone: tz })
    .format(ms)
    .replace(/\s?([AP])M$/i, (_, p: string) => ` ${p.toLowerCase()}m`)
}

let cache: { minute: number; text: string } | null = null

function snapshot(): string {
  const minute = Math.floor(Date.now() / 60000) * 60000
  if (cache?.minute === minute) return cache.text
  let text = FALLBACK
  try {
    const tz = visitorTimeZone()
    const s = computeReplyState(minute, tz, replyConfig())
    const zone = s.known ? tz : 'Asia/Bangkok'
    const replyBy = englishTime(minute + 15 * 60000, zone)
    if (s.open) text = `Message us now and a broker will reply by ${replyBy}${s.known ? '' : ' Phuket time'}`
    // Out of hours: copy-global §12 has no wording; the opening time on Phuket is stated plainly.
    else text = 'Brokers are online from 9:00 am Phuket time'
  } catch {
    text = FALLBACK
  }
  cache = { minute, text }
  return text
}

/** Reply line in English (copy-global §12); no JS and server render: «We reply within 15 minutes». */
export function EnglishReplyLine() {
  const text = useSyncExternalStore(subscribeClock, snapshot, () => FALLBACK)
  return <p className="type-small nums mt-4 min-h-[2.8em] text-laterite">{text}</p>
}
