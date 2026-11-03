'use client'

// Time-dependent values for forms and thank-you screens. Pages are static, so anything that
// depends on «now» or on the visitor's zone is computed after hydration: the server snapshot is
// `null` and components render a same-size placeholder until then (no hydration mismatch).
// Snapshots are cached per minute, so `useSyncExternalStore` sees a stable value.

import { useSyncExternalStore } from 'react'
import { type ReplyState, computeReplyState, replyConfig, subscribeClock, visitorTimeZone } from '@/lib/reply-time'

const serverNull = () => null

let minuteCache = 0
function minuteSnapshot(): number {
  const minute = Math.floor(Date.now() / 60000) * 60000
  if (minute !== minuteCache) minuteCache = minute
  return minuteCache
}

/** Current time floored to the minute, refreshed by the shared 30-second clock. Null on the server. */
export function useMinute(): number | null {
  return useSyncExternalStore(subscribeClock, minuteSnapshot, serverNull)
}

let replyCache: { minute: number; tz: string | undefined; state: ReplyState } | null = null
function replySnapshot(): ReplyState {
  const minute = Math.floor(Date.now() / 60000) * 60000
  const tz = visitorTimeZone()
  if (!replyCache || replyCache.minute !== minute || replyCache.tz !== tz) {
    replyCache = { minute, tz, state: computeReplyState(minute, tz, replyConfig()) }
  }
  return replyCache.state
}

/** Reply-time state (copy-global §5 variables) for the visitor; null on the server. */
export function useReplyState(): ReplyState | null {
  return useSyncExternalStore(subscribeClock, replySnapshot, serverNull)
}

const noop = () => () => {}
const zoneSnapshot = () => visitorTimeZone() ?? null

/** Visitor IANA zone; null on the server or when the browser does not tell. */
export function useVisitorZone(): string | null {
  return useSyncExternalStore(noop, zoneSnapshot, serverNull)
}

/**
 * «до 16:55» · «завтра до 5:15 по вашему времени» · «до 20:55 по Пхукету» · «в начале рабочего дня».
 * The «when» part of every thank-you sentence (copy-global §10).
 */
export function replyWhen(s: ReplyState): string {
  if (!s.known) return s.open ? `до ${s.replyBy} по Пхукету` : 'в начале рабочего дня'
  if (s.open) return `до ${s.replyBy}`
  return `${s.tomorrow ? 'завтра' : 'сегодня'} до ${s.openReply} по вашему времени`
}
