// Leads: the one way every form sends a request (docs/BUILD_PLAN.md, «Лиды»).
//
//   submitLead({ type: 'guide', fields: { name, channel, contact, consent: 'yes' }, page: '/' })
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
// no 'use client', no React. Field names and option ids below are the API.

import { brokerToday, brokerWallTimeToInstant, computeReplyState, replyConfig, visitorTimeZone } from '@/lib/reply-time'
import { contacts } from '@/lib/site'
import { type Goal, getClientIds, trackGoal } from '@/lib/analytics'

/* ───────────────────────── Contract ───────────────────────── */

export type LeadType = 'quiz' | 'consultation' | 'viewing' | 'guide'

export type LeadPayload = {
  type: LeadType
  /** Field values by name (see `LeadFieldName`). Unknown names are dropped by the server. */
  fields: Record<string, string>
  /** Path of the page with the form, e.g. «/services/deal». */
  page: string
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

/* ───────────────────────── Options (ids are the API, labels from copy) ───────────────────────── */

export type Option<T extends string = string> = { id: T; label: string; description?: string }

export type ChannelId = 'telegram' | 'whatsapp' | 'phone' | 'email'

/** «Куда ответить» (copy-global §8.2). */
export const channelOptions: Option<ChannelId>[] = [
  { id: 'telegram', label: 'Telegram' },
  { id: 'whatsapp', label: 'WhatsApp' },
  { id: 'phone', label: 'Звонок' },
  { id: 'email', label: 'Почта' },
]

/** Label of the contact field per channel (copy-global §8.2). */
export const contactLabels: Record<ChannelId, string> = {
  telegram: 'Ник или номер в Telegram',
  whatsapp: 'Номер WhatsApp',
  phone: 'Телефон',
  email: 'Почта',
}

export type DirectionId = 'phuket' | 'pattaya' | 'bali' | 'dubai' | 'cambodia' | 'undecided'

/** Quiz question 1 (copy-podbor). */
export const quizDirections: Option<DirectionId>[] = [
  { id: 'phuket', label: 'Пхукет', description: 'Шесть районов, квартиры и виллы' },
  { id: 'pattaya', label: 'Паттайя', description: 'Город у моря на материке' },
  { id: 'bali', label: 'Бали', description: 'Правила владения не такие, как в Таиланде' },
  { id: 'dubai', label: 'Дубай', description: 'Резидентская виза при покупке от установленной суммы' },
  { id: 'cambodia', label: 'Камбоджа', description: 'Квартиры у моря' },
  { id: 'undecided', label: 'Пока выбираю', description: 'Брокер сравнит страны под вашу задачу' },
]

/** «Направление» in the viewing form (copy-global §8.2). */
export const formDirections: Option<DirectionId>[] = [
  { id: 'phuket', label: 'Пхукет' },
  { id: 'pattaya', label: 'Паттайя' },
  { id: 'bali', label: 'Бали' },
  { id: 'dubai', label: 'Дубай' },
  { id: 'cambodia', label: 'Камбоджа' },
  { id: 'undecided', label: 'Пока не выбрал' },
]

/** Districts the quiz accepts from `?district=` (ids match `phuketDistricts` in `@/components/coast`). */
export const quizDistricts: Option[] = [
  { id: 'layan', label: 'Лаян' },
  { id: 'bang-tao', label: 'Банг Тао' },
  { id: 'kamala', label: 'Камала' },
  { id: 'karon-kata', label: 'Карон и Ката' },
  { id: 'nai-harn-rawai', label: 'Най Харн и Раваи' },
  { id: 'chalong', label: 'Чалонг' },
]

export type GoalId = 'income' | 'wintering' | 'relocation' | 'capital'

/** Quiz question 2; `segment` is the amoCRM segment (copy-podbor, sales-strategy §1). */
export const quizGoals: (Option<GoalId> & { segment: number })[] = [
  { id: 'income', label: 'Доход от аренды или перепродажи', description: 'Считаем загрузку по сезонам и цену по этапам стройки', segment: 1 },
  { id: 'wintering', label: 'Жить зимой, сдавать остальное время', description: 'С ноября по март живёте сами, потом квартира сдаётся', segment: 2 },
  { id: 'relocation', label: 'Переезд и долгое проживание', description: 'Расскажем, какие визы есть в выбранной стране', segment: 3 },
  { id: 'capital', label: 'Сохранить капитал в валюте', description: 'Проверяем застройщика и смотрим, легко ли будет продать объект', segment: 4 },
]

export type BudgetId = 'lt150' | '150-300' | '300-600' | 'gt600' | 'unsure'

/** Quiz question 3. Bounds kept for the promo version (DEMO_DECISIONS «Формы»); the client confirms them. */
export const quizBudgets: Option<BudgetId>[] = [
  { id: 'lt150', label: 'До 150 тыс. $' },
  { id: '150-300', label: '150–300 тыс. $' },
  { id: '300-600', label: '300–600 тыс. $' },
  { id: 'gt600', label: 'От 600 тыс. $' },
  {
    id: 'unsure',
    label: 'Хочу понять, что реально за мой бюджет',
    description: 'Брокер спросит сумму в сообщении и покажет, что можно купить на эти деньги',
  },
]

export type TimelineId = 'month' | '1-3' | '3-6' | 'exploring'

/** Quiz question 4. */
export const quizTimelines: Option<TimelineId>[] = [
  { id: 'month', label: 'В ближайший месяц' },
  { id: '1-3', label: 'Через 1–3 месяца' },
  { id: '3-6', label: 'Через 3–6 месяцев' },
  { id: 'exploring', label: 'Пока изучаю рынок', description: 'Подборка поможет понять цены, торопить не будем' },
]

export type ConsultFormatId = 'video' | 'call' | 'meeting'

/** «Формат», consultation on /services/deal (copy-global §8.2). */
export const consultationFormats: Option<ConsultFormatId>[] = [
  { id: 'video', label: 'Видеозвонок' },
  { id: 'call', label: 'Звонок' },
  { id: 'meeting', label: 'Встреча на Пхукете' },
]

export type ViewingFormatId = 'viewing' | 'online' | 'video' | 'call'

/** «Формат», booking on /contacts (copy-contacts §3). */
export const viewingFormats: Option<ViewingFormatId>[] = [
  { id: 'viewing', label: 'Просмотр на Пхукете', description: 'Встреча на объекте, адрес пришлём после записи' },
  { id: 'online', label: 'Онлайн-показ', description: 'Брокер показывает объект по видеосвязи' },
  { id: 'video', label: 'Консультация по видео', description: '30 минут: задача, районы, бюджет' },
  { id: 'call', label: 'Звонок', description: 'Тот же разговор по телефону' },
]

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

/* ───────────────────────── Wording (copy-global §8.3, §8.4) ───────────────────────── */

export const leadMessages = {
  nameEmpty: 'Напишите, как к вам обращаться',
  nameLong: 'Сократите имя до 60 знаков',
  channel: 'Выберите, куда ответить',
  telegramEmpty: 'Укажите ник или номер, к которому привязан Telegram',
  telegramNick: 'В нике Telegram от 5 до 32 знаков: латинские буквы, цифры или _, например @ivan_petrov',
  phoneEmpty: 'Укажите номер телефона',
  phoneShortRu: 'Проверьте номер: после +7 нужно 10 цифр',
  phoneShortOther: 'Проверьте номер: после кода страны не хватает цифр',
  phoneLong: 'В номере лишние цифры. Проверьте, не повторился ли код страны',
  emailEmpty: 'Укажите почту',
  emailBad: 'Проверьте адрес почты, например name@mail.ru',
  format: 'Выберите формат встречи',
  direction: 'Выберите направление или вариант «Пока не выбрал»',
  date: 'Выберите дату',
  time: 'Выберите время',
  slotTaken: 'Это время только что заняли. Выберите другое',
  commentLong: (n: number) => `Сократите текст до 1000 знаков, сейчас ${n}`,
  consent: 'Чтобы отправить заявку, отметьте согласие на обработку данных',
  /** Quiz answers come from tiles; this only shows if a request was tampered with. */
  choice: 'Выберите один из вариантов',
  summary: (labels: string[]) => `Заявка не отправлена. Исправьте поля: ${labels.join(', ')}`,
  offline: 'Нет связи с интернетом. Введённые данные остались в форме. Проверьте подключение и отправьте ещё раз',
  server: `Заявка не отправилась из-за сбоя на нашей стороне. Данные остались в форме. Отправьте ещё раз или позвоните: ${contacts.phone.display}`,
  /** 429: a retry within 10 minutes fails the same way, so the sentence leads to the phone and Telegram. */
  rateLimited: `Заявка не отправилась: с вашего подключения было много попыток подряд. Позвоните или напишите в Telegram: ${contacts.phone.display}`,
  duplicate: (replyBy: string) => `Заявка с этим контактом уже у брокера. Он ответит ${replyBy}`,
} as const

export const NAME_MAX = 60
export const COMMENT_MAX = 1000

/* ───────────────────────── Validators (shared by forms and the server) ───────────────────────── */

export function validateName(value: string | undefined): string | undefined {
  const v = (value ?? '').trim()
  if (!v) return leadMessages.nameEmpty
  if (v.length > NAME_MAX) return leadMessages.nameLong
  return undefined
}

export function isChannel(value: unknown): value is ChannelId {
  return channelOptions.some((o) => o.id === value)
}

export function validateEmail(value: string): string | undefined {
  const v = value.trim()
  if (!v) return leadMessages.emailEmpty
  if (v.length > 254 || !/^[^\s@]+@[^\s@]+\.[^\s@.]{2,}$/.test(v)) return leadMessages.emailBad
  return undefined
}

/** A phone typed as text (Telegram field): «+7 900 000-00-00», «8 900…», «+66 81…», «701 234 56 78». */
function validateFreePhone(value: string): string | undefined {
  const v = value.trim()
  const digits = v.replace(/\D/g, '')
  // «+7…», 11 digits after the trunk «8» or the code «7», or «89…» / «79…» (a Russian mobile with a
  // digit missing). Ten digits starting with 7 or 8 are a national number typed without the code
  // (Kazakh mobile «701…», Petersburg «812…»), not «+7» with one digit short.
  const russian = v.startsWith('+7') || (!v.startsWith('+') && /^[78]/.test(digits) && (digits.length >= 11 || /^[78]9/.test(digits)))
  if (russian) {
    const national = digits.slice(1)
    if (national.length < 10) return leadMessages.phoneShortRu
    if (national.length > 10) return leadMessages.phoneLong
    return undefined
  }
  if (digits.length < 8) return leadMessages.phoneShortOther
  if (digits.length > 15) return leadMessages.phoneLong
  return undefined
}

export function validateTelegram(value: string): string | undefined {
  const v = value.trim()
  if (!v) return leadMessages.telegramEmpty
  // «@ivan_petrov», «ivan_petrov», «t.me/ivan_petrov» (copied without https://), «https://t.me/ivan_petrov/».
  const handle = v.replace(/^(https?:\/\/)?(www\.)?(t\.me|telegram\.me)\//i, '').replace(/\/+$/, '')
  if (/^[+\d(]/.test(handle)) return validateFreePhone(handle)
  if (!/^[A-Za-z0-9_]{5,32}$/.test(handle.replace(/^@/, ''))) return leadMessages.telegramNick
  return undefined
}

/**
 * Phone from `<PhoneField>`: «+7 9001234567» (code, space, national digits) or «+ 4915…» for
 * «Другая страна». The form checks exact lengths per country with `validatePhone` from
 * `@/components/ui/field`; this is the looser server-side net with the same wording.
 */
export function validatePhoneValue(value: string): string | undefined {
  const v = value.trim()
  const m = /^(\+\d{0,4})\s*([\d\s-]*)$/.exec(v)
  if (!v || !m) return v ? leadMessages.phoneShortOther : leadMessages.phoneEmpty
  const code = m[1]
  const national = m[2].replace(/\D/g, '')
  if (!national) return leadMessages.phoneEmpty
  if (code === '+7') {
    if (national.length < 10) return leadMessages.phoneShortRu
    if (national.length > 10) return leadMessages.phoneLong
    return undefined
  }
  const total = code.replace(/\D/g, '').length + national.length
  if (total < 8 || national.length < 6) return leadMessages.phoneShortOther
  if (total > 15) return leadMessages.phoneLong
  return undefined
}

export function validateContact(channel: string | undefined, value: string | undefined): string | undefined {
  const v = value ?? ''
  switch (channel) {
    case 'telegram':
      return validateTelegram(v)
    case 'whatsapp':
    case 'phone':
      return validatePhoneValue(v)
    case 'email':
      return validateEmail(v)
    default:
      return undefined
  }
}

export function validateComment(value: string | undefined): string | undefined {
  const n = (value ?? '').length
  return n > COMMENT_MAX ? leadMessages.commentLong(n) : undefined
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

const ids = <T extends string>(options: Option<T>[]) => options.map((o) => o.id) as string[]

/**
 * Full check of a lead's fields. Returns errors keyed by field (empty object when valid).
 * Used by the route handler; forms run the same functions field by field.
 */
export function validateLeadFields(
  type: LeadType,
  fields: Partial<Record<LeadFieldName, string>>,
  now: number = Date.now(),
): Partial<Record<LeadFieldName, string>> {
  const errors: Partial<Record<LeadFieldName, string>> = {}
  const set = (key: LeadFieldName, message: string | undefined) => {
    if (message) errors[key] = message
  }

  set('name', validateName(fields.name))
  if (!isChannel(fields.channel)) errors.channel = leadMessages.channel
  else set('contact', validateContact(fields.channel, fields.contact))
  if (fields.consent !== 'yes') errors.consent = leadMessages.consent

  if (type === 'quiz') {
    if (!ids(quizDirections).includes(fields.direction ?? '')) errors.direction = leadMessages.choice
    if (fields.district && (fields.direction !== 'phuket' || !ids(quizDistricts).includes(fields.district))) {
      errors.district = leadMessages.choice
    }
    if (!ids(quizGoals).includes(fields.goal ?? '')) errors.goal = leadMessages.choice
    if (!ids(quizBudgets).includes(fields.budget ?? '')) errors.budget = leadMessages.choice
    if (!ids(quizTimelines).includes(fields.timeline ?? '')) errors.timeline = leadMessages.choice
  }

  if (type === 'consultation' || type === 'viewing') {
    const formats = type === 'consultation' ? ids(consultationFormats) : ids(viewingFormats)
    if (!formats.includes(fields.format ?? '')) errors.format = leadMessages.format
    if (type === 'viewing' && fields.format !== 'viewing' && !ids(formDirections).includes(fields.direction ?? '')) {
      errors.direction = leadMessages.direction
    }
    const date = fields.date ?? ''
    if (!bookingDates(now).includes(date)) errors.date = leadMessages.date
    const time = fields.time ?? ''
    if (!(BOOKING.slots as readonly string[]).includes(time)) errors.time = leadMessages.time
    else if (!errors.date && !isSlotOpen(date, time, now)) errors.time = leadMessages.slotTaken
    set('comment', validateComment(fields.comment))
  }

  return errors
}

/** Field labels for the error summary (copy-global §8.3) and the CRM note. */
export function fieldLabel(name: LeadFieldName, channel?: string): string {
  switch (name) {
    case 'name':
      return 'Имя'
    case 'channel':
      return 'Куда ответить'
    case 'contact':
      return isChannel(channel) ? contactLabels[channel] : 'Контакт'
    case 'consent':
      return 'Согласие на обработку данных'
    case 'format':
      return 'Формат'
    case 'direction':
      return 'Направление'
    case 'date':
      return 'Дата'
    case 'time':
      return 'Время на Пхукете'
    case 'comment':
      return 'Комментарий'
    case 'goal':
      return 'Цель'
    case 'budget':
      return 'Бюджет'
    case 'timeline':
      return 'Срок'
    case 'district':
      return 'Район'
    default:
      return name
  }
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
export function optionLabel(field: LeadFieldName, id: string | undefined, type?: LeadType): string | undefined {
  if (!id) return undefined
  const lists: Partial<Record<LeadFieldName, Option[]>> = {
    channel: channelOptions,
    direction: type === 'viewing' ? formDirections : quizDirections,
    district: quizDistricts,
    goal: quizGoals,
    budget: quizBudgets,
    timeline: quizTimelines,
    format: type === 'viewing' ? viewingFormats : consultationFormats,
  }
  return lists[field]?.find((o) => o.id === id)?.label ?? id
}

/* ───────────────────────── Reply time phrases (copy-global §5, §10) ───────────────────────── */

/**
 * «до 16:55» in hours; «завтра до 5:15 по вашему времени» out of hours; «до 20:55 по Пхукету» /
 * «в начале рабочего дня» when the visitor zone is unknown. Client only (needs the visitor zone).
 */
export function replyByPhrase(now: number = Date.now(), tz: string | undefined = visitorTimeZone()): string {
  try {
    const s = computeReplyState(now, tz, replyConfig())
    if (!s.known) return s.open ? `до ${s.replyBy} по Пхукету` : 'в начале рабочего дня'
    if (s.open) return `до ${s.replyBy}`
    return `${s.tomorrow ? 'завтра' : 'сегодня'} до ${s.openReply} по вашему времени`
  } catch {
    return 'в течение 15 минут'
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

/** Sends a lead. Resolves, never throws. See the header of this file for the result. */
export async function submitLead(payload: LeadPayload): Promise<LeadResult> {
  const offline = (): LeadResult => ({ ok: false, reason: 'offline', error: leadMessages.offline })
  const server = (): LeadResult => ({ ok: false, reason: 'server', error: leadMessages.server })

  if (typeof navigator !== 'undefined' && navigator.onLine === false) return offline()
  captureFirstTouch()

  let response: Response
  try {
    response = await fetch(LEAD_ENDPOINT, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ ...payload, meta: readLeadMeta() }),
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
    const labels = (Object.keys(data.fieldErrors) as LeadFieldName[]).map((k) => fieldLabel(k, channel))
    return { ok: false, reason: 'validation', error: leadMessages.summary(labels), fieldErrors: data.fieldErrors }
  }

  if (response.status === 409) {
    return { ok: false, reason: 'duplicate', error: leadMessages.duplicate(replyByPhrase()) }
  }

  if (response.status === 429) {
    return { ok: false, reason: 'server', error: leadMessages.rateLimited }
  }

  return server()
}
