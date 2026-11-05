// Leads: the one way every form sends a request (docs/BUILD_PLAN.md, «Лиды»).
//
//   submitLead({ type: 'guide', fields: { name, channel, contact, consent: 'yes' }, page: '/', locale }, t)
//     → { ok: true } | { ok: false; error: string; reason; fieldErrors? }
//
// - POST /api/lead (route handler in `app/api/lead/route.ts`), JSON.
// - `error` is the sentence to show (copy-global §8.4), ready to render as is.
// - `reason`: 'validation' (400, see `fieldErrors` keyed by field), 'duplicate' (409: the same
//   lead, same answers, was delivered in the last 10 minutes), 'offline' (no network), 'server'
//   (5xx, 429 with its own sentence, timeout). Never show «спасибо» unless `ok`.
// - First-touch UTM / yclid / gclid, landing page and Metrika/GA client ids are attached
//   automatically (`meta`); the lead goal (quiz_submit, lead_consult, lead_viewing, lead_guide)
//   fires here after `ok`, so forms must not fire it again.
//
// The module is shared by the browser (forms) and the server (validation in the route handler):
// no 'use client', no React. Field names and option ids below are the API. Words come from the
// `forms` dictionary of the page's locale, passed in by the caller (the client gets it from
// <LocaleProvider>, the route handler from `getDictionary(payload.locale)`), so the server answers
// field errors in the language the visitor submitted in.

import type { CommonDict } from '@/i18n/ru/common'
import type { FormsDict } from '@/i18n/ru/forms'
import { type Locale, intlLocale } from '@/i18n/config'
import { fmt } from '@/i18n/format'
import { brokerToday, brokerWallTimeToInstant, computeReplyState, replyConfig, visitorTimeZone } from '@/lib/reply-time'
import { contacts } from '@/lib/site'
import { type Goal, getClientIds, trackGoal } from '@/lib/analytics'

/* ───────────────────────── Contract ───────────────────────── */

export type LeadType = 'quiz' | 'consultation' | 'viewing' | 'guide'

export type LeadPayload = {
  type: LeadType
  /** Field values by name (see `LeadFieldName`). Unknown names are dropped by the server. */
  fields: Record<string, string>
  /** Path of the page with the form, e.g. «/services/deal» or «/en/services/deal». */
  page: string
  /** Language of the page: the server answers field errors in it and tells the broker. Default 'ru'. */
  locale?: Locale
}

export type LeadFailureReason = 'validation' | 'duplicate' | 'offline' | 'server'

export type LeadResult =
  | { ok: true }
  | { ok: false; error: string; reason: LeadFailureReason; fieldErrors?: Partial<Record<LeadFieldName, string>> }

/** First-touch attribution and client ids, sent next to the fields. */
export type LeadMeta = Partial<Record<(typeof ATTRIBUTION_KEYS)[number] | 'landing' | 'referrer' | 'ymUid' | 'gaCid', string>>

export const LEAD_ENDPOINT = '/api/lead'

/** Hidden field for bots (render `<Honeypot />` from `@/components/sections/forms/form-kit`). */
export const HONEYPOT_FIELD = 'website'

export type LeadFieldName =
  | 'name'
  | 'channel'
  | 'contact'
  | 'phoneCountry'
  | 'consent'
  | 'direction'
  | 'district'
  | 'goal'
  | 'budget'
  | 'timeline'
  | 'format'
  | 'date'
  | 'time'
  | 'comment'
  | typeof HONEYPOT_FIELD

/** Which fields each form may send (everything else is dropped). */
export const LEAD_FIELDS: Record<LeadType, readonly LeadFieldName[]> = {
  quiz: ['name', 'channel', 'contact', 'phoneCountry', 'consent', 'direction', 'district', 'goal', 'budget', 'timeline'],
  consultation: ['name', 'channel', 'contact', 'phoneCountry', 'consent', 'format', 'date', 'time', 'comment'],
  viewing: ['name', 'channel', 'contact', 'phoneCountry', 'consent', 'format', 'direction', 'date', 'time', 'comment'],
  guide: ['name', 'channel', 'contact', 'phoneCountry', 'consent'],
}

/* ───────────────────────── Options (ids are the API, labels from the dictionary) ───────────────────────── */

export type Option<T extends string = string> = { id: T; label: string; description?: string }

export type ChannelId = 'telegram' | 'whatsapp' | 'phone' | 'email'
export type DirectionId = 'phuket' | 'pattaya' | 'bali' | 'dubai' | 'cambodia' | 'undecided'
export type QuizDistrictId = keyof FormsDict['options']['districts']
export type GoalId = 'income' | 'wintering' | 'relocation' | 'capital'
export type BudgetId = 'lt150' | '150-300' | '300-600' | 'gt600' | 'unsure'
export type TimelineId = 'month' | '1-3' | '3-6' | 'exploring'
export type ConsultFormatId = 'video' | 'call' | 'meeting'
export type ViewingFormatId = 'viewing' | 'online' | 'video' | 'call'

/** «Куда ответить» (copy-global §8.2), in this order. */
export const CHANNEL_IDS: readonly ChannelId[] = ['telegram', 'whatsapp', 'phone', 'email']
/** Quiz question 1 (copy-podbor) and «Направление» in the viewing form. */
export const DIRECTION_IDS: readonly DirectionId[] = ['phuket', 'pattaya', 'bali', 'dubai', 'cambodia', 'undecided']
/** Districts the quiz accepts from `?district=` (ids match `phuketDistricts` in `@/components/coast`). */
export const QUIZ_DISTRICT_IDS: readonly QuizDistrictId[] = ['layan', 'bang-tao', 'kamala', 'karon-kata', 'nai-harn-rawai', 'chalong']
/** Quiz question 2; `segment` is the amoCRM segment (copy-podbor, sales-strategy §1). */
export const QUIZ_GOALS: readonly { id: GoalId; segment: number }[] = [
  { id: 'income', segment: 1 },
  { id: 'wintering', segment: 2 },
  { id: 'relocation', segment: 3 },
  { id: 'capital', segment: 4 },
]
/**
 * Quiz question 3, thousands of US dollars. Bounds kept for the promo version (DEMO_DECISIONS
 * «Формы»); the client confirms them. The words around the numbers are `forms.options.budgets`.
 */
export const QUIZ_BUDGETS: readonly { id: BudgetId; min?: number; max?: number }[] = [
  { id: 'lt150', max: 150 },
  { id: '150-300', min: 150, max: 300 },
  { id: '300-600', min: 300, max: 600 },
  { id: 'gt600', min: 600 },
  { id: 'unsure' },
]
/** Quiz question 4. */
export const TIMELINE_IDS: readonly TimelineId[] = ['month', '1-3', '3-6', 'exploring']
/** «Формат», consultation on /services/deal (copy-global §8.2). */
export const CONSULT_FORMAT_IDS: readonly ConsultFormatId[] = ['video', 'call', 'meeting']
/** «Формат», booking on /contacts (copy-contacts §3). */
export const VIEWING_FORMAT_IDS: readonly ViewingFormatId[] = ['viewing', 'online', 'video', 'call']

/** A budget tile label: «До 150 тыс. $», «150–300 тыс. $», «От 600 тыс. $» (numbers by locale). */
function budgetLabel(b: (typeof QUIZ_BUDGETS)[number], f: FormsDict, locale: Locale): string {
  const n = (v: number) => new Intl.NumberFormat(intlLocale[locale]).format(v)
  const t = f.options.budgets
  if (b.min !== undefined && b.max !== undefined) return fmt(t.range, { min: n(b.min), max: n(b.max) })
  if (b.max !== undefined) return fmt(t.upTo, { max: n(b.max) })
  if (b.min !== undefined) return fmt(t.from, { min: n(b.min) })
  return t.unsure.label
}

const described = <T extends string>(id: T, o: { label: string; description: string }): Option<T> =>
  o.description ? { id, label: o.label, description: o.description } : { id, label: o.label }

/** Every option list of the forms, with labels in the locale of `f`. */
export function formOptions(f: FormsDict, locale: Locale) {
  const o = f.options
  return {
    channels: CHANNEL_IDS.map((id): Option<ChannelId> => ({ id, label: f.channels[id] })),
    quizDirections: DIRECTION_IDS.map((id) => described(id, o.directions[id])),
    formDirections: DIRECTION_IDS.map((id): Option<DirectionId> => ({ id, label: o.formDirections[id] })),
    quizDistricts: QUIZ_DISTRICT_IDS.map((id): Option<QuizDistrictId> => ({ id, label: o.districts[id] })),
    goals: QUIZ_GOALS.map((g) => ({ ...described(g.id, o.goals[g.id]), segment: g.segment })),
    budgets: QUIZ_BUDGETS.map((b): Option<BudgetId> =>
      b.id === 'unsure'
        ? { id: b.id, label: o.budgets.unsure.label, description: o.budgets.unsure.description }
        : { id: b.id, label: budgetLabel(b, f, locale) },
    ),
    timelines: TIMELINE_IDS.map((id) => described(id, o.timelines[id])),
    consultationFormats: CONSULT_FORMAT_IDS.map((id): Option<ConsultFormatId> => ({ id, label: o.consultationFormats[id] })),
    viewingFormats: VIEWING_FORMAT_IDS.map((id) => described(id, o.viewingFormats[id])),
  }
}

export type FormOptions = ReturnType<typeof formOptions>

/**
 * Booking grid: the next 14 days, slots 11:00–18:00 on Phuket (DEMO_DECISIONS «Формы»; the client
 * confirms before launch). 11:00–18:00 on Phuket is 7:00–14:00 in Moscow and the same time in
 * Krasnoyarsk and Novosibirsk.
 */
export const BOOKING = {
  horizonDays: 14,
  slots: ['11:00', '12:00', '13:00', '14:00', '15:00', '16:00', '17:00', '18:00'],
  /** A slot today must start at least this far ahead. */
  minLeadMinutes: 60,
  placeholder: false,
} as const

/**
 * Where «Открыть гид инвестора» leads. The PDF is not written yet (copy-global §13.6), so the
 * button opens the guide block on the home page. TODO: the PDF URL once the guide exists.
 */
export const GUIDE_HREF = '/#gid'

export const NAME_MAX = 60
export const COMMENT_MAX = 1000

/** Validation messages of a locale (`forms.messages`). */
export type LeadMessages = FormsDict['messages']

/* ───────────────────────── Validators (shared by forms and the server) ───────────────────────── */

export function validateName(value: string | undefined, m: LeadMessages): string | undefined {
  const v = (value ?? '').trim()
  if (!v) return m.nameEmpty
  if (v.length > NAME_MAX) return m.nameLong
  return undefined
}

export function isChannel(value: unknown): value is ChannelId {
  return (CHANNEL_IDS as readonly unknown[]).includes(value)
}

export function validateEmail(value: string, m: LeadMessages): string | undefined {
  const v = value.trim()
  if (!v) return m.emailEmpty
  if (v.length > 254 || !/^[^\s@]+@[^\s@]+\.[^\s@.]{2,}$/.test(v)) return m.emailBad
  return undefined
}

/** A phone typed as text (Telegram field): «+7 900 000-00-00», «8 900…», «+66 81…», «701 234 56 78». */
function validateFreePhone(value: string, m: LeadMessages): string | undefined {
  const v = value.trim()
  const digits = v.replace(/\D/g, '')
  // «+7…», 11 digits after the trunk «8» or the code «7», or «89…» / «79…» (a Russian mobile with a
  // digit missing). Ten digits starting with 7 or 8 are a national number typed without the code
  // (Kazakh mobile «701…», Petersburg «812…»), not «+7» with one digit short.
  const russian = v.startsWith('+7') || (!v.startsWith('+') && /^[78]/.test(digits) && (digits.length >= 11 || /^[78]9/.test(digits)))
  if (russian) {
    const national = digits.slice(1)
    if (national.length < 10) return m.phoneShortRu
    if (national.length > 10) return m.phoneLong
    return undefined
  }
  if (digits.length < 8) return m.phoneShortOther
  if (digits.length > 15) return m.phoneLong
  return undefined
}

export function validateTelegram(value: string, m: LeadMessages): string | undefined {
  const v = value.trim()
  if (!v) return m.telegramEmpty
  // «@ivan_petrov», «ivan_petrov», «t.me/ivan_petrov» (copied without https://), «https://t.me/ivan_petrov/».
  const handle = v.replace(/^(https?:\/\/)?(www\.)?(t\.me|telegram\.me)\//i, '').replace(/\/+$/, '')
  if (/^[+\d(]/.test(handle)) return validateFreePhone(handle, m)
  if (!/^[A-Za-z0-9_]{5,32}$/.test(handle.replace(/^@/, ''))) return m.telegramNick
  return undefined
}

/**
 * Phone from `<PhoneField>`: «+7 9001234567» (code, space, national digits) or «+ 4915…» for
 * «Другая страна». The form checks exact lengths per country with `validatePhone` from
 * `@/components/ui/field`; this is the looser server-side net with the same wording.
 */
export function validatePhoneValue(value: string, m: LeadMessages): string | undefined {
  const v = value.trim()
  const match = /^(\+\d{0,4})\s*([\d\s-]*)$/.exec(v)
  if (!v || !match) return v ? m.phoneShortOther : m.phoneEmpty
  const code = match[1]
  const national = match[2].replace(/\D/g, '')
  if (!national) return m.phoneEmpty
  if (code === '+7') {
    if (national.length < 10) return m.phoneShortRu
    if (national.length > 10) return m.phoneLong
    return undefined
  }
  const total = code.replace(/\D/g, '').length + national.length
  if (total < 8 || national.length < 6) return m.phoneShortOther
  if (total > 15) return m.phoneLong
  return undefined
}

export function validateContact(channel: string | undefined, value: string | undefined, m: LeadMessages): string | undefined {
  const v = value ?? ''
  switch (channel) {
    case 'telegram':
      return validateTelegram(v, m)
    case 'whatsapp':
    case 'phone':
      return validatePhoneValue(v, m)
    case 'email':
      return validateEmail(v, m)
    default:
      return undefined
  }
}

export function validateComment(value: string | undefined, m: LeadMessages): string | undefined {
  const n = (value ?? '').length
  return n > COMMENT_MAX ? fmt(m.commentLong, { n }) : undefined
}

/** Dates open for booking: today and the next days in the Phuket calendar, «YYYY-MM-DD». */
export function bookingDates(now: number = Date.now()): string[] {
  const today = brokerToday(now)
  const [y, m, d] = today.split('-').map(Number)
  return Array.from({ length: BOOKING.horizonDays }, (_, i) => {
    const date = new Date(Date.UTC(y, m - 1, d + i))
    return date.toISOString().slice(0, 10)
  })
}

/** A slot is open if it starts at least `minLeadMinutes` from now. */
export function isSlotOpen(date: string, slot: string, now: number = Date.now()): boolean {
  return brokerWallTimeToInstant(date, slot) - now >= BOOKING.minLeadMinutes * 60000
}

/** Slots of a date that can no longer be booked (passed or too close). */
export function closedSlots(date: string, now: number = Date.now()): string[] {
  return BOOKING.slots.filter((s) => !isSlotOpen(date, s, now))
}

const has = (list: readonly string[], value: string | undefined) => list.includes(value ?? '')

/**
 * Full check of a lead's fields. Returns errors keyed by field (empty object when valid), in the
 * language of `m`. Used by the route handler; forms run the same functions field by field.
 */
export function validateLeadFields(
  type: LeadType,
  fields: Partial<Record<LeadFieldName, string>>,
  m: LeadMessages,
  now: number = Date.now(),
): Partial<Record<LeadFieldName, string>> {
  const errors: Partial<Record<LeadFieldName, string>> = {}
  const set = (key: LeadFieldName, message: string | undefined) => {
    if (message) errors[key] = message
  }

  set('name', validateName(fields.name, m))
  if (!isChannel(fields.channel)) errors.channel = m.channel
  else set('contact', validateContact(fields.channel, fields.contact, m))
  if (fields.consent !== 'yes') errors.consent = m.consent

  if (type === 'quiz') {
    if (!has(DIRECTION_IDS, fields.direction)) errors.direction = m.choice
    if (fields.district && (fields.direction !== 'phuket' || !has(QUIZ_DISTRICT_IDS, fields.district))) {
      errors.district = m.choice
    }
    if (!has(QUIZ_GOALS.map((g) => g.id), fields.goal)) errors.goal = m.choice
    if (!has(QUIZ_BUDGETS.map((b) => b.id), fields.budget)) errors.budget = m.choice
    if (!has(TIMELINE_IDS, fields.timeline)) errors.timeline = m.choice
  }

  if (type === 'consultation' || type === 'viewing') {
    const formats = type === 'consultation' ? CONSULT_FORMAT_IDS : VIEWING_FORMAT_IDS
    if (!has(formats, fields.format)) errors.format = m.format
    if (type === 'viewing' && fields.format !== 'viewing' && !has(DIRECTION_IDS, fields.direction)) {
      errors.direction = m.direction
    }
    const date = fields.date ?? ''
    if (!bookingDates(now).includes(date)) errors.date = m.date
    const time = fields.time ?? ''
    if (!(BOOKING.slots as readonly string[]).includes(time)) errors.time = m.time
    else if (!errors.date && !isSlotOpen(date, time, now)) errors.time = m.slotTaken
    set('comment', validateComment(fields.comment, m))
  }

  return errors
}

/** Field labels for the error summary (copy-global §8.3) and the CRM note. */
export function fieldLabel(name: LeadFieldName, f: FormsDict, channel?: string): string {
  if (name === 'contact') return isChannel(channel) ? f.contactLabels[channel] : f.fields.contact
  if (name === 'phoneCountry' || name === HONEYPOT_FIELD) return name
  return f.fields[name]
}

/* ───────────────────────── Scoring (sales-strategy §8) ───────────────────────── */

/**
 * 0–10: timeline (month 3 · 1–3 mo 2 · 3–6 mo 1 · exploring 0) + budget (from 300k 3 · 150–300k 2 ·
 * other 1) + country (Phuket or Pattaya 2 · other 1) + form (booking +2). Hot 7+, warm 4–6, cold 0–3;
 * the guide without a quiz is always cold.
 */
export function scoreLead(type: LeadType, fields: Partial<Record<LeadFieldName, string>>) {
  if (type === 'guide') return { score: 0, temperature: 'cold' as const }
  let score = 0
  const timeline: Record<string, number> = { month: 3, '1-3': 2, '3-6': 1, exploring: 0 }
  const budget: Record<string, number> = { gt600: 3, '300-600': 3, '150-300': 2, lt150: 1, unsure: 1 }
  score += timeline[fields.timeline ?? ''] ?? 0
  score += budget[fields.budget ?? ''] ?? 0
  const direction = type === 'viewing' && fields.format === 'viewing' ? 'phuket' : fields.direction
  if (direction) score += direction === 'phuket' || direction === 'pattaya' ? 2 : 1
  if (type === 'consultation' || type === 'viewing') score += 2
  const temperature = score >= 7 ? ('hot' as const) : score >= 4 ? ('warm' as const) : ('cold' as const)
  return { score, temperature }
}

/** Human text of an option id, for notifications and thank-you screens. */
export function optionLabel(
  field: LeadFieldName,
  id: string | undefined,
  f: FormsDict,
  locale: Locale,
  type?: LeadType,
): string | undefined {
  if (!id) return undefined
  const o = formOptions(f, locale)
  const lists: Partial<Record<LeadFieldName, Option[]>> = {
    channel: o.channels,
    direction: type === 'viewing' ? o.formDirections : o.quizDirections,
    district: o.quizDistricts,
    goal: o.goals,
    budget: o.budgets,
    timeline: o.timelines,
    format: type === 'viewing' ? o.viewingFormats : o.consultationFormats,
  }
  return lists[field]?.find((option) => option.id === id)?.label ?? id
}

/* ───────────────────────── Reply time phrases (copy-global §5, §10) ───────────────────────── */

/**
 * «до 16:55» in hours; «завтра до 5:15 по вашему времени» out of hours; «до 20:55 по Пхукету» /
 * «в начале рабочего дня» when the visitor zone is unknown (`common.reply.when`). Client only
 * (needs the visitor zone).
 */
export function replyByPhrase(
  texts: CommonDict['reply'],
  locale: Locale,
  now: number = Date.now(),
  tz: string | undefined = visitorTimeZone(),
): string {
  const w = texts.when
  try {
    const s = computeReplyState(now, tz, replyConfig({ texts, locale }))
    const values = { replyBy: s.replyBy, openReply: s.openReply, day: s.tomorrow ? texts.tomorrow : texts.today }
    if (!s.known) return s.open ? fmt(w.openUnknownZone, values) : w.closedUnknownZone
    if (s.open) return fmt(w.open, values)
    return fmt(w.closed, values)
  } catch {
    return w.fallback
  }
}

/* ───────────────────────── First-touch attribution ───────────────────────── */

const ATTRIBUTION_KEYS = ['utm_source', 'utm_medium', 'utm_campaign', 'utm_content', 'utm_term', 'yclid', 'gclid'] as const
const FIRST_TOUCH_KEY = 'hoc-first-touch'

/**
 * Stores the first page of the visit with its utm_* / yclid / gclid in sessionStorage (once per
 * tab session; UTM from a later page fills in only if the first page had none). Runs when this
 * module loads in the browser and from `<AnalyticsBridge />`; safe to call often.
 */
export function captureFirstTouch(): void {
  if (typeof window === 'undefined') return
  try {
    const params = new URLSearchParams(window.location.search)
    const utm: Record<string, string> = {}
    for (const key of ATTRIBUTION_KEYS) {
      const value = params.get(key)
      if (value) utm[key] = value.slice(0, 200)
    }
    const stored = window.sessionStorage.getItem(FIRST_TOUCH_KEY)
    if (stored) {
      const prev = JSON.parse(stored) as Record<string, string>
      const hasUtm = ATTRIBUTION_KEYS.some((k) => prev[k])
      if (!hasUtm && Object.keys(utm).length) {
        window.sessionStorage.setItem(FIRST_TOUCH_KEY, JSON.stringify({ ...prev, ...utm }))
      }
      return
    }
    const first: Record<string, string> = { ...utm, landing: window.location.pathname.slice(0, 200) }
    if (document.referrer) {
      const ref = new URL(document.referrer)
      // Origin only: a full referrer can carry personal data in its query.
      if (ref.origin !== window.location.origin) first.referrer = ref.origin
    }
    window.sessionStorage.setItem(FIRST_TOUCH_KEY, JSON.stringify(first))
  } catch {
    // Private mode or blocked storage: the lead goes without attribution.
  }
}

/** Attribution + client ids for the request. */
export function readLeadMeta(): LeadMeta {
  const meta: LeadMeta = {}
  try {
    const stored = window.sessionStorage.getItem(FIRST_TOUCH_KEY)
    if (stored) Object.assign(meta, JSON.parse(stored))
  } catch {
    // ignore
  }
  const { ymUid, gaCid } = getClientIds()
  if (ymUid) meta.ymUid = ymUid
  if (gaCid) meta.gaCid = gaCid
  return meta
}

if (typeof window !== 'undefined') captureFirstTouch()

/* ───────────────────────── submitLead ───────────────────────── */

const GOALS: Record<LeadType, Goal> = {
  quiz: 'quiz_submit',
  consultation: 'lead_consult',
  viewing: 'lead_viewing',
  guide: 'lead_guide',
}

const TIMEOUT_MS = 15000

/**
 * `AbortSignal.timeout` where it exists; an AbortController elsewhere (Safari before 16). Without
 * the fallback the call threw before `fetch`, and every lead from such a browser ended as «сбой»
 * without a request ever reaching the server.
 */
function timeoutSignal(ms: number): AbortSignal | undefined {
  if (typeof AbortSignal !== 'undefined' && typeof AbortSignal.timeout === 'function') return AbortSignal.timeout(ms)
  if (typeof AbortController === 'undefined') return undefined
  const controller = new AbortController()
  setTimeout(() => controller.abort(), ms)
  return controller.signal
}


/** Words `submitLead` needs: the page's `forms` and `common.reply`. */
export type LeadTexts = { forms: FormsDict; reply: CommonDict['reply'] }

/** Sends a lead. Resolves, never throws. See the header of this file for the result. */
export async function submitLead(payload: LeadPayload, t: LeadTexts): Promise<LeadResult> {
  const locale = payload.locale ?? 'ru'
  const m = t.forms.messages
  const offline = (): LeadResult => ({ ok: false, reason: 'offline', error: m.offline })
  const server = (): LeadResult => ({ ok: false, reason: 'server', error: fmt(m.server, { phone: contacts.phone.display }) })

  if (typeof navigator !== 'undefined' && navigator.onLine === false) return offline()
  captureFirstTouch()

  let response: Response
  try {
    response = await fetch(LEAD_ENDPOINT, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ ...payload, locale, meta: readLeadMeta() }),
      signal: timeoutSignal(TIMEOUT_MS),
      cache: 'no-store',
    })
  } catch {
    return typeof navigator !== 'undefined' && navigator.onLine === false ? offline() : server()
  }

  let data: { ok?: boolean; error?: string; fieldErrors?: Partial<Record<LeadFieldName, string>> } | null = null
  try {
    data = await response.json()
  } catch {
    data = null
  }

  if (response.ok && data?.ok === true) {
    trackGoal(GOALS[payload.type], { page: payload.page })
    return { ok: true }
  }

  if (response.status === 400 && data?.fieldErrors && Object.keys(data.fieldErrors).length) {
    const channel = payload.fields.channel
    const labels = (Object.keys(data.fieldErrors) as LeadFieldName[]).map((k) => fieldLabel(k, t.forms, channel))
    return { ok: false, reason: 'validation', error: fmt(m.summary, { fields: labels.join(', ') }), fieldErrors: data.fieldErrors }
  }

  if (response.status === 409) {
    return { ok: false, reason: 'duplicate', error: fmt(m.duplicate, { when: replyByPhrase(t.reply, locale) }) }
  }

  if (response.status === 429) {
    return { ok: false, reason: 'server', error: fmt(m.rateLimited, { phone: contacts.phone.display }) }
  }

  return server()
}
