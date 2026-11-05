// «Ответим до 16:55» — the live reply-time line (art-direction §2, wording: copy-global §5).
//
// Broker hours and the promised 15 minutes come from `brokerHours` in `@/lib/site`; the words are
// `common.reply` of the page's dictionary, so the same code writes «до 16:55» and «by 4:55 pm».
// Requests before closing count as in hours: 20:50 on Phuket → «ответит до 21:05» (copy-global §5, rule 1).

import type { Locale } from '@/i18n/config'
import { hour12, intlLocale } from '@/i18n/config'
import type { CommonDict } from '@/i18n/ru/common'
import { brokerHours } from '@/lib/site'

export type ReplyVariant = 'full' | 'short'

/** Templates of the line (`common.reply` without the parts other components use). */
export type ReplyTexts = Pick<CommonDict['reply'], 'full' | 'short' | 'today' | 'tomorrow'>

export type ReplyConfig = {
  /** Broker time zone (IANA). */
  tz: string
  /** Opening and closing wall-clock minutes in the broker zone. */
  open: number
  close: number
  /** Promised reply, minutes. */
  reply: number
  /** In-hours sentence before the time (full variant). */
  lead: string
  /** `short`: «Ответим до 16:55» for the menu and narrow columns. */
  variant: ReplyVariant
  /** 12-hour clock with am/pm (English). */
  h12?: boolean
  /** Templates; the inline boot script fills them in for its per-instance scripts. */
  t?: ReplyTexts
}

export function replyConfig({
  texts,
  locale = 'ru',
  lead,
  variant = 'full',
}: {
  /** `common.reply` of the page's dictionary. */
  texts?: CommonDict['reply']
  locale?: Locale
  /** In-hours sentence; defaults to `texts.lead`. */
  lead?: string
  variant?: ReplyVariant
} = {}): ReplyConfig {
  return {
    tz: brokerHours.timeZone,
    open: brokerHours.openMinutes,
    close: brokerHours.closeMinutes,
    reply: brokerHours.replyMinutes,
    lead: lead ?? texts?.lead ?? '',
    variant,
    ...(hour12[locale] ? { h12: true } : {}),
    ...(texts ? { t: { full: texts.full, short: texts.short, today: texts.today, tomorrow: texts.tomorrow } } : {}),
  }
}

/** Everything the reply line and the thank-you screens (copy-global §10) need. */
export type ReplyState = {
  /** Visitor zone known to Intl. If not, all times below are Phuket times. */
  known: boolean
  /** Phuket time is within broker hours. */
  open: boolean
  /** Visitor's clock shows the same time as Phuket (UTC+7: Красноярск, Новосибирск). */
  sameZone: boolean
  /** Now + reply minutes, visitor's clock: «16:55». */
  replyBy: string
  /** Next opening, visitor's clock: «5:00». */
  openLocal: string
  /** Next opening + reply minutes, visitor's clock: «5:15». */
  openReply: string
  /** Opening falls on the visitor's next calendar day. */
  tomorrow: boolean
  /** Current time on Phuket: «2:10». */
  timeBroker: string
  /** Opening and closing in Phuket, «9:00» and «21:00». */
  openText: string
  closeText: string
}

/**
 * Self-contained (no imports, no outer variables, no object spread): its source is inlined into
 * <head> by `replyTimeBootScript()` so the line is right before first paint.
 */
export function computeReplyState(now: number, visitorTz: string | undefined, c: ReplyConfig): ReplyState {
  const hm = function (h: number, minute: string) {
    return c.h12 ? (h % 12 || 12) + ':' + minute + (h < 12 ? ' am' : ' pm') : h + ':' + minute
  }
  const read = function (ms: number, zone: string) {
    const parts = new Intl.DateTimeFormat('ru-RU', {
      timeZone: zone,
      year: 'numeric',
      month: '2-digit',
      day: '2-digit',
      hour: '2-digit',
      minute: '2-digit',
      hourCycle: 'h23',
    }).formatToParts(new Date(ms))
    const o: Record<string, string> = {}
    for (let i = 0; i < parts.length; i++) o[parts[i].type] = parts[i].value
    const h = Number(o.hour) % 24
    return { hm: hm(h, o.minute), mins: h * 60 + Number(o.minute), day: o.year + o.month + o.day }
  }
  const clock = function (m: number) {
    return hm(Math.floor(m / 60), String(m % 60).padStart(2, '0'))
  }
  let zone = c.tz
  let known = false
  if (visitorTz) {
    try {
      read(now, visitorTz)
      zone = visitorTz
      known = true
    } catch {
      known = false
    }
  }
  const minute = 60000
  const start = now - (now % minute)
  const broker = read(start, c.tz)
  const me = read(start, zone)
  const opensAt = start + ((c.open - broker.mins + 1440) % 1440) * minute
  const opens = read(opensAt, zone)
  return {
    known: known,
    open: broker.mins >= c.open && broker.mins < c.close,
    sameZone: known && broker.mins === me.mins && broker.day === me.day,
    replyBy: read(start + c.reply * minute, zone).hm,
    openLocal: opens.hm,
    openReply: read(opensAt + c.reply * minute, zone).hm,
    tomorrow: opens.day !== me.day,
    timeBroker: broker.hm,
    openText: clock(c.open),
    closeText: clock(c.close),
  }
}

/**
 * The sentence for a state (copy-global §5 table), from the templates in `c.t`. Self-contained,
 * inlined like the above.
 */
export function formatReplyText(s: ReplyState, c: ReplyConfig): string {
  const t = c.t as ReplyTexts
  const v: Record<string, string> = {
    lead: c.lead,
    replyBy: s.replyBy,
    openReply: s.openReply,
    openLocal: s.openLocal,
    open: s.openText,
    close: s.closeText,
    day: s.tomorrow ? t.tomorrow : t.today,
  }
  const f = function (template: string) {
    return template.replace(/\{(\w+)\}/g, function (m: string, k: string) {
      return k in v ? v[k] : m
    })
  }
  if (c.variant === 'short') {
    if (s.open) return f(s.known ? t.short.open : t.short.openUnknownZone)
    return s.known ? f(t.short.closed) : t.short.closedUnknownZone
  }
  if (!s.known) return f(s.open ? t.full.openUnknownZone : t.full.closedUnknownZone)
  if (s.open) return f(s.sameZone ? t.full.openSameZone : t.full.open)
  return f(s.sameZone ? t.full.closedSameZone : t.full.closed)
}

/** Reply line for a moment and a visitor zone; `null` if anything fails (the fallback stays). */
export function replyTimeText(now: number, visitorTz: string | undefined, c: ReplyConfig): string | null {
  try {
    return formatReplyText(computeReplyState(now, visitorTz, c), c)
  } catch {
    return null
  }
}

/** Visitor's IANA zone, or undefined when the browser does not tell. Client only. */
export function visitorTimeZone(): string | undefined {
  try {
    return Intl.DateTimeFormat().resolvedOptions().timeZone || undefined
  } catch {
    return undefined
  }
}

const scriptJson = (value: unknown) => JSON.stringify(value).replace(/</g, '\\u003c')

/**
 * Defines `window.__hocReplyTime(now, tz, config)` for the per-instance inline scripts, with the
 * page's templates built in. Rendered once in <head> (site shell).
 */
export function replyTimeBootScript(texts: CommonDict['reply']): string {
  const t: ReplyTexts = { full: texts.full, short: texts.short, today: texts.today, tomorrow: texts.tomorrow }
  return (
    'window.__hocReplyTime=function(n,z,c){c.t=c.t||' +
    scriptJson(t) +
    ';var s=(' +
    computeReplyState.toString() +
    ')(n,z,c);return(' +
    formatReplyText.toString() +
    ')(s,c)};'
  )
}

/** Per-instance script: fills the previous sibling element with the live line before paint. */
export function replyTimeInstanceScript(c: ReplyConfig): string {
  // The templates are in the boot script already; only the instance's own settings go here.
  const own: ReplyConfig = { tz: c.tz, open: c.open, close: c.close, reply: c.reply, lead: c.lead, variant: c.variant }
  if (c.h12) own.h12 = true
  return (
    '(function(s){try{var e=s&&s.previousElementSibling,f=window.__hocReplyTime;if(!e||!f)return;' +
    'var z;try{z=Intl.DateTimeFormat().resolvedOptions().timeZone}catch(_){}' +
    'e.textContent=f(Date.now(),z,' +
    scriptJson(own) +
    ')}catch(_){}})(document.currentScript)'
  )
}

/** «16:40» / «4:40 pm» from an hour (0–23) and minutes. */
function formatHm(h: number, minute: string, locale: Locale): string {
  if (hour12[locale]) return `${h % 12 || 12}:${minute} ${h < 12 ? 'am' : 'pm'}`
  return `${h}:${minute}`
}

function zoneHourMinute(ms: number, timeZone: string): { hour: number; minute: string } {
  const parts = new Intl.DateTimeFormat('ru-RU', {
    timeZone,
    hour: '2-digit',
    minute: '2-digit',
    hourCycle: 'h23',
  }).formatToParts(new Date(ms))
  const hour = Number(parts.find((p) => p.type === 'hour')?.value ?? 0) % 24
  const minute = parts.find((p) => p.type === 'minute')?.value ?? '00'
  return { hour, minute }
}

/** Wall-clock «16:40» for a zone; hours without a leading zero, as in «9:05». English: «4:40 pm». */
export function formatClock(ms: number, timeZone: string, locale: Locale = 'ru'): string {
  const { hour, minute } = zoneHourMinute(ms, timeZone)
  return formatHm(hour, minute, locale)
}

/** A 24-hour «16:40» shown in the locale's format: «16:40» or «4:40 pm». */
export function localeClock(hm24: string, locale: Locale): string {
  const [h, m] = hm24.split(':')
  return formatHm(Number(h), m, locale)
}

/**
 * «07:00»: slot tiles stand in a column and line up on the digits (copy-global §5, rule 3).
 * English keeps its 12-hour form, «7:00 am».
 */
export function formatClockPadded(ms: number, timeZone: string, locale: Locale = 'ru'): string {
  const { hour, minute } = zoneHourMinute(ms, timeZone)
  if (hour12[locale]) return formatHm(hour, minute, locale)
  return `${String(hour).padStart(2, '0')}:${minute}`
}

/** Placeholder of the same width as a live clock before hydration: «00:00» / «00:00 pm». */
export function clockPlaceholder(locale: Locale = 'ru'): string {
  return hour12[locale] ? '00:00 pm' : '00:00'
}

/**
 * The instant of a Phuket wall time on a date: «11:00» on 2026-11-20.
 * Thailand has no DST, so the fixed offset is exact; the visitor side is formatted with Intl
 * and therefore DST-correct for that date.
 */
export function brokerWallTimeToInstant(date: string, hm: string): number {
  const [y, mo, d] = date.split('-').map(Number)
  const [h, mi] = hm.split(':').map(Number)
  return Date.UTC(y, mo - 1, d, h, mi) - brokerHours.utcOffsetMinutes * 60000
}

/** Today in the broker zone as YYYY-MM-DD. */
export function brokerToday(now: number = Date.now()): string {
  return new Intl.DateTimeFormat('en-CA', {
    timeZone: brokerHours.timeZone,
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
  }).format(new Date(now))
}

/**
 * Broker hours in another fixed-offset zone, for static lines like the footer's
 * «с 9:00 до 21:00 по Пхукету, это с 5:00 до 17:00 по Москве» (Moscow is UTC+3 all year).
 */
export function brokerHoursIn(utcOffsetMinutes: number, locale: Locale = 'ru'): { open: string; close: string } {
  const shift = utcOffsetMinutes - brokerHours.utcOffsetMinutes
  const fmt = (m: number) => {
    const v = (((m + shift) % 1440) + 1440) % 1440
    return formatHm(Math.floor(v / 60), String(v % 60).padStart(2, '0'), locale)
  }
  return { open: fmt(brokerHours.openMinutes), close: fmt(brokerHours.closeMinutes) }
}

/** «12 ноября» / «November 12» / «12 de noviembre» for a date in a zone. */
export function formatDayMonth(ms: number, timeZone: string, locale: Locale = 'ru'): string {
  return new Intl.DateTimeFormat(intlLocale[locale], { day: 'numeric', month: 'long', timeZone }).format(ms)
}

/** Shared 30-second ticker for live clocks (useSyncExternalStore subscribe). */
const listeners = new Set<() => void>()
let timer: ReturnType<typeof setInterval> | undefined

export function subscribeClock(listener: () => void): () => void {
  listeners.add(listener)
  if (!timer) timer = setInterval(() => listeners.forEach((l) => l()), 30000)
  const onVisible = () => {
    if (document.visibilityState === 'visible') listener()
  }
  document.addEventListener('visibilitychange', onVisible)
  return () => {
    listeners.delete(listener)
    document.removeEventListener('visibilitychange', onVisible)
    if (listeners.size === 0 && timer) {
      clearInterval(timer)
      timer = undefined
    }
  }
}
