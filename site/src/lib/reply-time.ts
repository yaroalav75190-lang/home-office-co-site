// «Ответим до 16:55» — the live reply-time line (art-direction §2, wording: copy-global §5).
//
// Broker hours and the promised 15 minutes come from `brokerHours` in `@/lib/site`.
// Requests before closing count as in hours: 20:50 on Phuket → «ответит до 21:05» (copy-global §5, rule 1).

import { brokerHours } from '@/lib/site'

/** No-JS line (copy-global §5). */
export const REPLY_FALLBACK = `Отвечаем в течение ${brokerHours.replyMinutes} минут`
/** In-hours sentence before «до {replyBy}». */
export const REPLY_LEAD = 'Напишите сейчас, и брокер ответит'

export type ReplyVariant = 'full' | 'short'

export type ReplyConfig = {
  /** Broker time zone (IANA). */
  tz: string
  /** Opening and closing wall-clock minutes in the broker zone. */
  open: number
  close: number
  /** Promised reply, minutes. */
  reply: number
  /** In-hours sentence before «до HH:MM» (full variant). */
  lead: string
  /** `short`: «Ответим до 16:55» for the menu and narrow columns. */
  variant: ReplyVariant
}

export function replyConfig(lead: string = REPLY_LEAD, variant: ReplyVariant = 'full'): ReplyConfig {
  return {
    tz: brokerHours.timeZone,
    open: brokerHours.openMinutes,
    close: brokerHours.closeMinutes,
    reply: brokerHours.replyMinutes,
    lead,
    variant,
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
    return { hm: h + ':' + o.minute, mins: h * 60 + Number(o.minute), day: o.year + o.month + o.day }
  }
  const clock = function (m: number) {
    return Math.floor(m / 60) + ':' + String(m % 60).padStart(2, '0')
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

/** The sentence for a state (copy-global §5 table). Self-contained, inlined like the above. */
export function formatReplyText(s: ReplyState, c: ReplyConfig): string {
  const day = s.tomorrow ? 'завтра' : 'сегодня'
  if (c.variant === 'short') {
    if (s.open) return 'Ответим до ' + s.replyBy + (s.known ? '' : ' по Пхукету')
    return s.known ? 'Ответим ' + day + ' до ' + s.openReply : 'Ответим в начале рабочего дня'
  }
  if (!s.known) {
    return s.open
      ? c.lead + ' до ' + s.replyBy + ' по Пхукету'
      : 'Брокер на связи с ' + s.openText + ' до ' + s.closeText + ' по Пхукету. Ответим в начале рабочего дня'
  }
  if (s.open) return c.lead + ' до ' + s.replyBy + (s.sameZone ? '. У вас и на Пхукете одно время' : '')
  if (s.sameZone) {
    return 'Брокер на связи с ' + s.openText + ', у вас и на Пхукете одно время. Ответим ' + day + ' до ' + s.openReply
  }
  return (
    'Брокер на связи с ' + s.openText + ' по Пхукету, у вас это ' + s.openLocal + '. Ответим ' + day + ' до ' + s.openReply
  )
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

/**
 * Defines `window.__hocReplyTime(now, tz, config)` for the per-instance inline scripts.
 * Rendered once in <head> (app/layout.tsx).
 */
export function replyTimeBootScript(): string {
  return (
    'window.__hocReplyTime=function(n,z,c){var s=(' +
    computeReplyState.toString() +
    ')(n,z,c);return(' +
    formatReplyText.toString() +
    ')(s,c)};'
  )
}

/** Per-instance script: fills the previous sibling element with the live line before paint. */
export function replyTimeInstanceScript(c: ReplyConfig): string {
  return (
    '(function(s){try{var e=s&&s.previousElementSibling,f=window.__hocReplyTime;if(!e||!f)return;' +
    'var z;try{z=Intl.DateTimeFormat().resolvedOptions().timeZone}catch(_){}' +
    'e.textContent=f(Date.now(),z,' +
    JSON.stringify(c).replace(/</g, '\\u003c') +
    ')}catch(_){}})(document.currentScript)'
  )
}

/** Wall-clock «16:40» for a zone; hours without a leading zero, as in «9:05». */
export function formatClock(ms: number, timeZone: string): string {
  const parts = new Intl.DateTimeFormat('ru-RU', {
    timeZone,
    hour: '2-digit',
    minute: '2-digit',
    hourCycle: 'h23',
  }).formatToParts(new Date(ms))
  const hour = Number(parts.find((p) => p.type === 'hour')?.value ?? 0) % 24
  const minute = parts.find((p) => p.type === 'minute')?.value ?? '00'
  return `${hour}:${minute}`
}

/** «07:00»: slot tiles stand in a column and line up on the digits (copy-global §5, rule 3). */
export function formatClockPadded(ms: number, timeZone: string): string {
  const [h, m] = formatClock(ms, timeZone).split(':')
  return `${h.padStart(2, '0')}:${m}`
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
export function brokerHoursIn(utcOffsetMinutes: number): { open: string; close: string } {
  const shift = utcOffsetMinutes - brokerHours.utcOffsetMinutes
  const fmt = (m: number) => {
    const v = (((m + shift) % 1440) + 1440) % 1440
    return `${Math.floor(v / 60)}:${String(v % 60).padStart(2, '0')}`
  }
  return { open: fmt(brokerHours.openMinutes), close: fmt(brokerHours.closeMinutes) }
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
