// Where a validated lead goes: amoCRM (contact + deal in the pipeline «Сайт») and a Telegram
// message to the brokers' chat (PROJECT_BRIEF: «Заявки → amoCRM, уведомление брокеру в Telegram»).
// Server only: imported by route.ts.
//
// Environment (none of them is committed; set them on the host):
//   AMOCRM_SUBDOMAIN            «homeoffice» for https://homeoffice.amocrm.ru
//   AMOCRM_ACCESS_TOKEN         long-lived token of a private integration
//   AMOCRM_PIPELINE_ID          id of the pipeline «Сайт»
//   AMOCRM_STATUS_ID            optional: first stage «Новая заявка» (default: the pipeline's first)
//   AMOCRM_RESPONSIBLE_USER_ID  optional: who gets new deals
//   AMOCRM_TRACKING_FIELDS      optional «1»: also write UTM/yclid/gclid into amoCRM tracking fields
//                               (field codes UTM_SOURCE…; enable only after checking they exist,
//                               an unknown field code rejects the whole request)
//   TELEGRAM_BOT_TOKEN          bot that posts to the brokers' chat
//   TELEGRAM_CHAT_ID            that chat's id (the bot must be a member)
//
// Delivery rules:
// - At least one configured channel accepted the lead → ok (the other failure is logged as an
//   error; if amoCRM failed, the Telegram message says so, so the broker adds the deal by hand).
// - Every configured channel failed → not ok (the form shows the error with the phone).
// - A channel with only some of its variables set is reported in `errors`, not skipped silently.
// - Nothing configured: in development → ok, the lead is only logged (so forms can be built and
//   tested locally); in production → not ok, so a site without integrations never shows «спасибо»
//   for a lead that went nowhere.
//
// TODO(amoCRM): untested against a real account. Check with the client's integration:
//   field codes for the contact (PHONE/EMAIL with enum WORK), custom fields for «сегмент»,
//   «бюджет», «срок», «скоринг», «мессенджер», «страница входа» (sales-strategy §8) — until then
//   all of that goes into the deal note. Also: the 10-minute «не взяли» reminder to Иван (a
//   Salesbot or digital pipeline rule in amoCRM, not this code).

import { getDictionary } from '@/i18n'
import type { Locale } from '@/i18n/config'
import { type LeadFieldName, type LeadMeta, type LeadType, QUIZ_GOALS, fieldLabel, optionLabel as label } from '@/lib/lead'

// The broker reads Russian: option names and field labels always come from the Russian dictionary,
// whatever the language of the page. «Язык сайта» says in which language to answer.
const ru = getDictionary('ru').forms
const optionLabel = (field: LeadFieldName, id: string | undefined, type?: LeadType) => label(field, id, ru, 'ru', type)

/** «Язык сайта: English» line of the note: the broker answers in the visitor's language. */
const LANGUAGE: Record<Locale, string> = { ru: 'Русский', en: 'English', es: 'Español' }

export type NormalizedLead = {
  id: string
  type: LeadType
  page: string
  /** Language of the page the lead came from. */
  locale: Locale
  fields: Partial<Record<LeadFieldName, string>>
  meta: LeadMeta
  score: number
  temperature: 'hot' | 'warm' | 'cold'
  receivedAt: string
  /** The hidden honeypot field was filled although every field is valid (route.ts). */
  suspect?: 'honeypot'
}

export type DeliveryReport = {
  ok: boolean
  /** Per channel: true delivered, false failed, null not configured. */
  amocrm: boolean | null
  telegram: boolean | null
  devOnly?: boolean
  amoLeadId?: number
  errors: string[]
}

const TYPE_TITLE: Record<LeadType, string> = {
  quiz: 'Квиз «Подбор объекта»',
  consultation: 'Консультация',
  viewing: 'Запись на просмотр',
  guide: 'Гид инвестора',
}

const TEMPERATURE: Record<NormalizedLead['temperature'], string> = {
  hot: 'горячий',
  warm: 'тёплый',
  cold: 'холодный',
}

/**
 * Per request. The form gives up after 15 s (`submitLead`), so the worst case here must stay under
 * it: amoCRM deal 6 s, then the note and Telegram in parallel 6 s = 12 s. (Sequential note +
 * Telegram made 18 s: the visitor saw «сбой» for a lead that was in fact delivered.)
 */
const TIMEOUT_MS = 6000

/** Human-readable lines «Метка: значение» for the note and the Telegram message. */
export function describeLead(lead: NormalizedLead): string[] {
  const f = lead.fields
  const lines: string[] = []
  const add = (label: string, value: string | undefined) => {
    if (value) lines.push(`${label}: ${value}`)
  }
  if (lead.suspect === 'honeypot') {
    lines.push('Проверка: заполнено скрытое поле от ботов. Скорее всего, это автозаполнение браузера, но проверьте контакт')
  }
  add('Имя', f.name)
  add('Куда ответить', [optionLabel('channel', f.channel), f.contact].filter(Boolean).join(', '))
  if (lead.type === 'quiz') {
    add('Направление', [optionLabel('direction', f.direction, 'quiz'), optionLabel('district', f.district)].filter(Boolean).join(', '))
    const goal = QUIZ_GOALS.find((g) => g.id === f.goal)
    add('Цель', goal ? `${optionLabel('goal', goal.id)} (сегмент ${goal.segment})` : f.goal)
    add('Бюджет', optionLabel('budget', f.budget))
    add('Срок', optionLabel('timeline', f.timeline))
  }
  if (lead.type === 'consultation' || lead.type === 'viewing') {
    add('Формат', optionLabel('format', f.format, lead.type))
    if (lead.type === 'viewing') add('Направление', optionLabel('direction', f.format === 'viewing' ? 'phuket' : f.direction, 'viewing'))
    add('Дата и время', f.date && f.time ? `${f.date}, ${f.time} по Пхукету` : undefined)
    add(fieldLabel('comment', ru), f.comment)
  }
  add('Скоринг', lead.type === 'guide' ? undefined : `${lead.score} (${TEMPERATURE[lead.temperature]})`)
  add('Язык сайта', LANGUAGE[lead.locale])
  add('Страница', lead.page)
  const m = lead.meta
  add('Вход', [m.landing, m.referrer].filter(Boolean).join(', '))
  add(
    'UTM',
    (['utm_source', 'utm_medium', 'utm_campaign', 'utm_content', 'utm_term'] as const)
      .filter((k) => m[k])
      .map((k) => `${k.slice(4)}=${m[k]}`)
      .join(', '),
  )
  add('yclid', m.yclid)
  add('gclid', m.gclid)
  add('Метрика ClientID', m.ymUid)
  add('GA ClientID', m.gaCid)
  add('ID заявки', lead.id)
  return lines
}

function leadTitle(lead: NormalizedLead): string {
  const f = lead.fields
  const parts = [TYPE_TITLE[lead.type]]
  if (lead.type === 'quiz') parts.push(optionLabel('direction', f.direction, 'quiz') ?? '', optionLabel('budget', f.budget) ?? '')
  if (lead.type === 'consultation' || lead.type === 'viewing') parts.push(`${f.date ?? ''} ${f.time ?? ''}`.trim())
  return parts.filter(Boolean).join(': ').slice(0, 250)
}

/* ───────────────────────── amoCRM ───────────────────────── */

const AMO_REQUIRED = ['AMOCRM_SUBDOMAIN', 'AMOCRM_ACCESS_TOKEN', 'AMOCRM_PIPELINE_ID'] as const
const TELEGRAM_REQUIRED = ['TELEGRAM_BOT_TOKEN', 'TELEGRAM_CHAT_ID'] as const

/**
 * Names of the missing variables when a channel is set up only in part (a typo in one name, a
 * token not copied): without this the channel was silently skipped as «not configured».
 */
function missingOfPartial(names: readonly string[]): string[] | null {
  const missing = names.filter((n) => !process.env[n])
  return missing.length > 0 && missing.length < names.length ? missing : null
}

function amoConfig() {
  const { AMOCRM_SUBDOMAIN, AMOCRM_ACCESS_TOKEN, AMOCRM_PIPELINE_ID } = process.env
  if (!AMOCRM_SUBDOMAIN || !AMOCRM_ACCESS_TOKEN || !AMOCRM_PIPELINE_ID) return null
  return {
    base: `https://${AMOCRM_SUBDOMAIN}.amocrm.ru`,
    token: AMOCRM_ACCESS_TOKEN,
    pipelineId: Number(AMOCRM_PIPELINE_ID),
    statusId: process.env.AMOCRM_STATUS_ID ? Number(process.env.AMOCRM_STATUS_ID) : undefined,
    responsibleUserId: process.env.AMOCRM_RESPONSIBLE_USER_ID ? Number(process.env.AMOCRM_RESPONSIBLE_USER_ID) : undefined,
    trackingFields: process.env.AMOCRM_TRACKING_FIELDS === '1',
  }
}

type AmoConfig = NonNullable<ReturnType<typeof amoConfig>>

const amoHeaders = (config: AmoConfig) => ({ Authorization: `Bearer ${config.token}`, 'Content-Type': 'application/json' })

/** PHONE / EMAIL of the amoCRM contact. Empty for Telegram: the nick has no standard field. */
function amoContactFields(f: NormalizedLead['fields']): unknown[] {
  if ((f.channel === 'phone' || f.channel === 'whatsapp') && f.contact) {
    return [{ field_code: 'PHONE', values: [{ value: f.contact.replace(/\s+/g, ''), enum_code: 'WORK' }] }]
  }
  if (f.channel === 'email' && f.contact) return [{ field_code: 'EMAIL', values: [{ value: f.contact, enum_code: 'WORK' }] }]
  return []
}

/** POST /api/v4/leads/complex: deal + contact in one request. The note goes after, in `addAmoNote`. */
async function createAmoDeal(lead: NormalizedLead, config: AmoConfig): Promise<number> {
  const f = lead.fields
  // Telegram nick: no standard field; it is in the note only. TODO(amoCRM): custom contact field id.
  const contactFields = amoContactFields(f)

  const tracking = config.trackingFields
    ? (['utm_source', 'utm_medium', 'utm_campaign', 'utm_content', 'utm_term', 'yclid', 'gclid'] as const)
        .filter((k) => lead.meta[k])
        .map((k) => ({ field_code: k.toUpperCase(), values: [{ value: lead.meta[k] }] }))
    : []

  const res = await fetch(`${config.base}/api/v4/leads/complex`, {
    method: 'POST',
    headers: amoHeaders(config),
    signal: AbortSignal.timeout(TIMEOUT_MS),
    body: JSON.stringify([
      {
        name: leadTitle(lead),
        pipeline_id: config.pipelineId,
        ...(config.statusId ? { status_id: config.statusId } : {}),
        ...(config.responsibleUserId ? { responsible_user_id: config.responsibleUserId } : {}),
        ...(tracking.length ? { custom_fields_values: tracking } : {}),
        _embedded: {
          tags: [{ name: 'Сайт' }, { name: TYPE_TITLE[lead.type] }],
          contacts: [
            {
              first_name: f.name ?? '',
              ...(contactFields.length ? { custom_fields_values: contactFields } : {}),
            },
          ],
        },
      },
    ]),
  })
  if (!res.ok) throw new Error(`amoCRM ${res.status}: ${(await res.text()).slice(0, 300)}`)
  const created = (await res.json()) as { id?: number }[]
  const leadId = created?.[0]?.id
  if (!leadId) throw new Error('amoCRM: no deal id in the response')
  return leadId
}

/**
 * The note with all answers. Usually a convenience (the Telegram message carries the same lines),
 * logged with the deal id on failure. For a Telegram contact it is the only place the nick lives in
 * amoCRM, see `deliverLead`. Never throws; true when amoCRM accepted it.
 */
async function addAmoNote(lead: NormalizedLead, config: AmoConfig, leadId: number): Promise<boolean> {
  try {
    const note = await fetch(`${config.base}/api/v4/leads/${leadId}/notes`, {
      method: 'POST',
      headers: amoHeaders(config),
      signal: AbortSignal.timeout(TIMEOUT_MS),
      body: JSON.stringify([{ note_type: 'common', params: { text: describeLead(lead).join('\n') } }]),
    })
    if (note.ok) return true
    console.warn(JSON.stringify({ evt: 'lead.amocrm.note_failed', id: lead.id, amoLeadId: leadId, status: note.status }))
  } catch (error) {
    console.warn(JSON.stringify({ evt: 'lead.amocrm.note_failed', id: lead.id, amoLeadId: leadId, error: String(error) }))
  }
  return false
}

/* ───────────────────────── Telegram ───────────────────────── */

function telegramConfig() {
  const { TELEGRAM_BOT_TOKEN, TELEGRAM_CHAT_ID } = process.env
  if (!TELEGRAM_BOT_TOKEN || !TELEGRAM_CHAT_ID) return null
  return { token: TELEGRAM_BOT_TOKEN, chatId: TELEGRAM_CHAT_ID }
}

const escapeHtml = (s: string) => s.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;')

async function notifyTelegram(
  lead: NormalizedLead,
  config: NonNullable<ReturnType<typeof telegramConfig>>,
  amo: { link?: string; failed?: boolean },
): Promise<void> {
  // Telegram counts its 4096-character limit after parsing the HTML, so the plain lines are cut
  // before escaping. Cutting the HTML itself could split «&amp;» or drop «</a>», and Telegram then
  // rejects the whole message (400 «can't parse entities»).
  const body = describeLead(lead).join('\n').slice(0, 3600)
  const text = [
    `<b>${escapeHtml(TYPE_TITLE[lead.type])}</b>`,
    amo.failed ? '<b>Внимание: в amoCRM заявка не попала, внесите её вручную</b>' : null,
    escapeHtml(body),
    amo.link ? `<a href="${escapeHtml(amo.link)}">Сделка в amoCRM</a>` : null,
  ]
    .filter(Boolean)
    .join('\n')
  const res = await fetch(`https://api.telegram.org/bot${config.token}/sendMessage`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    signal: AbortSignal.timeout(TIMEOUT_MS),
    body: JSON.stringify({ chat_id: config.chatId, text, parse_mode: 'HTML', disable_web_page_preview: true }),
  })
  if (!res.ok) throw new Error(`Telegram ${res.status}: ${(await res.text()).slice(0, 200)}`)
}

/* ───────────────────────── Delivery ───────────────────────── */

export async function deliverLead(lead: NormalizedLead): Promise<DeliveryReport> {
  const amo = amoConfig()
  const tg = telegramConfig()
  const report: DeliveryReport = { ok: false, amocrm: null, telegram: null, errors: [] }

  // Half-configured channels are reported (route.ts logs them as errors), not silently skipped.
  const amoMissing = missingOfPartial(AMO_REQUIRED)
  if (amoMissing) report.errors.push(`amoCRM not configured: missing ${amoMissing.join(', ')}`)
  const tgMissing = missingOfPartial(TELEGRAM_REQUIRED)
  if (tgMissing) report.errors.push(`Telegram not configured: missing ${tgMissing.join(', ')}`)

  if (!amo && !tg) {
    // Development, or a promo run started with LEAD_DEMO_NO_DELIVERY=1 (`pnpm demo`): the server
    // log is the delivery. Never set the flag on a public deploy: visitors would see «спасибо»
    // while nothing reaches the broker. The one hosted exception is the closed preview for the
    // client (SITE_NOINDEX=1 beside it, docs/DEMO_DECISIONS.md «Показ на Vercel»). It is ignored as
    // soon as either channel is configured.
    const demo = process.env.LEAD_DEMO_NO_DELIVERY === '1'
    if (process.env.NODE_ENV !== 'production' || demo) {
      if (demo) console.warn(JSON.stringify({ evt: 'lead.demo_no_delivery', id: lead.id }))
      console.info(JSON.stringify({ evt: 'lead.dev_delivery', id: lead.id, lines: describeLead(lead) }))
      return { ...report, ok: true, devOnly: true }
    }
    report.errors.push('no integration configured (AMOCRM_* / TELEGRAM_*)')
    return report
  }

  // The amoCRM deal first, so the Telegram message can link to it or say that it is missing.
  if (amo) {
    try {
      report.amoLeadId = await createAmoDeal(lead, amo)
      report.amocrm = true
    } catch (error) {
      report.amocrm = false
      report.errors.push(String(error))
    }
  }
  // Then the note and Telegram in parallel (see TIMEOUT_MS).
  const tasks: Promise<void>[] = []
  let noteOk = false
  if (amo && report.amoLeadId) {
    const leadId = report.amoLeadId
    tasks.push(
      addAmoNote(lead, amo, leadId).then((ok) => {
        noteOk = ok
      }),
    )
  }
  if (tg) {
    const link = amo && report.amoLeadId ? `${amo.base}/leads/detail/${report.amoLeadId}` : undefined
    tasks.push(
      notifyTelegram(lead, tg, { link, failed: report.amocrm === false }).then(
        () => {
          report.telegram = true
        },
        (error: unknown) => {
          report.telegram = false
          report.errors.push(String(error))
        },
      ),
    )
  }
  await Promise.all(tasks)
  // Delivered = somebody can reach the visitor. A deal for a Telegram contact whose note failed
  // has a name and no contact; without the Telegram message that lead is lost behind «спасибо».
  const amoReachable = report.amocrm === true && (noteOk || amoContactFields(lead.fields).length > 0)
  if (report.amocrm === true && !amoReachable) {
    report.errors.push(`amoCRM: deal ${report.amoLeadId} has no contact (the Telegram nick is only in the note, and the note failed)`)
  }
  report.ok = amoReachable || report.telegram === true
  return report
}
