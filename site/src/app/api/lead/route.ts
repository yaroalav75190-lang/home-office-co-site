// POST /api/lead — every form of the site posts here through `submitLead` (`@/lib/lead`).
//
// Request:  { type: 'quiz'|'consultation'|'viewing'|'guide', fields: Record<string,string>,
//             page: '/path', meta?: { utm_*, yclid, gclid, landing, referrer, ymUid, gaCid } }
// Responses (JSON, never cached):
//   200 { ok: true, id }                         delivered (or a honeypot hit with invalid fields: a
//                                                bot, silently accepted; with valid fields the lead is
//                                                delivered marked «скрытое поле», see below)
//   400 { ok: false, error: 'validation', fieldErrors: { name: '…', … } }   wording: copy-global §8.3
//   400 { ok: false, error: 'bad_request' }      not JSON, unknown type, body over 16 KB
//   409 { ok: false, error: 'duplicate' }        same type + contact + answers delivered in the last
//                                                10 minutes (changed answers make a new lead)
//   429 { ok: false, error: 'rate_limited' }     more than 8 requests per IP in 10 minutes
//   500 { ok: false, error: 'delivery_failed' }  amoCRM and Telegram both failed, or none configured
//                                                in production (see deliver.ts)
// Development only: a lead named «Тест сбой» returns 500, to check the forms' error state.
//
// Every request writes one structured JSON line to the server log (`evt: "lead"`): id, type,
// page, status, timing, hashed IP, scoring, UTM source, delivery result. The contact is masked;
// full fields are logged only by the development delivery (deliver.ts).

import type { NextRequest } from 'next/server'
import {
  HONEYPOT_FIELD,
  LEAD_FIELDS,
  type LeadFieldName,
  type LeadMeta,
  type LeadType,
  scoreLead,
  validateLeadFields,
} from '@/lib/lead'
import { deliverLead, type NormalizedLead } from './deliver'
import { allowRequest, clientIp, hashIp, isDuplicate, rememberLead } from './guard'

const MAX_BODY = 16 * 1024
const LEAD_TYPES: readonly LeadType[] = ['quiz', 'consultation', 'viewing', 'guide']
const META_KEYS = [
  'utm_source',
  'utm_medium',
  'utm_campaign',
  'utm_content',
  'utm_term',
  'yclid',
  'gclid',
  'landing',
  'referrer',
  'ymUid',
  'gaCid',
] as const

const HEADERS = { 'Cache-Control': 'no-store', 'X-Robots-Tag': 'noindex' }

function reply(status: number, body: Record<string, unknown>, extra?: Record<string, string>) {
  return Response.json(body, { status, headers: { ...HEADERS, ...extra } })
}

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === 'object' && value !== null && !Array.isArray(value)
}

/** «+7 9001234567» → «+7…67», «@ivan_petrov» → «@i…ov»: enough to find a lead, not to read it. */
function mask(value: string | undefined): string | undefined {
  if (!value) return undefined
  const v = value.trim()
  return v.length <= 4 ? '…' : `${v.slice(0, 2)}…${v.slice(-2)}`
}

export async function POST(request: NextRequest) {
  const started = Date.now()
  const id = crypto.randomUUID()
  const ip = clientIp(request.headers)
  /** `level` overrides the level picked by status (a 200 with a failed channel is an error). */
  const log = (status: number, data: Record<string, unknown>, level?: 'error' | 'warn') => {
    const line = JSON.stringify({ evt: 'lead', id, status, ms: Date.now() - started, ip: hashIp(ip), ...data })
    if (level === 'error' || status >= 500) console.error(line)
    else if (level === 'warn' || status >= 400) console.warn(line)
    else console.info(line)
  }

  // Body: JSON object, at most 16 KB.
  let raw: string
  try {
    raw = await request.text()
  } catch {
    log(400, { error: 'unreadable_body' })
    return reply(400, { ok: false, error: 'bad_request' })
  }
  if (raw.length > MAX_BODY) {
    log(400, { error: 'body_too_large', size: raw.length })
    return reply(400, { ok: false, error: 'bad_request' })
  }
  let body: unknown
  try {
    body = JSON.parse(raw)
  } catch {
    log(400, { error: 'invalid_json' })
    return reply(400, { ok: false, error: 'bad_request' })
  }
  if (!isRecord(body) || !LEAD_TYPES.includes(body.type as LeadType) || !isRecord(body.fields)) {
    log(400, { error: 'invalid_shape' })
    return reply(400, { ok: false, error: 'bad_request' })
  }

  const type = body.type as LeadType
  const page = typeof body.page === 'string' && body.page.startsWith('/') ? body.page.slice(0, 200) : 'unknown'

  if (!allowRequest(ip)) {
    // A real visitor behind a shared IP (office, mobile CGNAT, a proxy without X-Forwarded-For)
    // can land here: the masked contact lets the team find the lead the form did not deliver.
    const contact = typeof body.fields.contact === 'string' ? mask(body.fields.contact) : undefined
    log(429, { type, page, error: 'rate_limited', contact })
    return reply(429, { ok: false, error: 'rate_limited' }, { 'Retry-After': '600' })
  }

  // Only the fields this form may send, as trimmed strings.
  const fields: Partial<Record<LeadFieldName, string>> = {}
  for (const key of [...LEAD_FIELDS[type], HONEYPOT_FIELD] as LeadFieldName[]) {
    const value = body.fields[key]
    if (typeof value === 'string') fields[key] = (key === 'comment' ? value : value.trim()).slice(0, 2000)
  }
  const meta: LeadMeta = {}
  if (isRecord(body.meta)) {
    for (const key of META_KEYS) {
      const value = body.meta[key]
      if (typeof value === 'string' && value) meta[key] = value.slice(0, 300)
    }
  }

  // Honeypot: a hidden field only bots fill. Filled + invalid fields = a bot: answer as if all went
  // well, deliver nothing. Filled + valid fields (a real channel, a checked contact, consent) is far
  // more likely a password manager that autofilled the hidden field than a bot, so the lead is
  // delivered with a mark for the broker instead of vanishing behind a fake «спасибо».
  const honeypot = Boolean(fields[HONEYPOT_FIELD])
  delete fields[HONEYPOT_FIELD]

  const fieldErrors = validateLeadFields(type, fields, started)
  if (Object.keys(fieldErrors).length) {
    if (honeypot) {
      log(200, { type, page, spam: 'honeypot', invalid: Object.keys(fieldErrors) })
      return reply(200, { ok: true, id })
    }
    log(400, { type, page, error: 'validation', fields: Object.keys(fieldErrors) })
    return reply(400, { ok: false, error: 'validation', fieldErrors })
  }

  // Viewing on Phuket has no direction field: the place is Phuket.
  if (type === 'viewing' && fields.format === 'viewing') fields.direction = 'phuket'
  if (type !== 'viewing' && type !== 'quiz') delete fields.direction
  if (fields.channel !== 'phone' && fields.channel !== 'whatsapp') delete fields.phoneCountry

  const channel = fields.channel ?? ''
  const contact = fields.contact ?? ''
  // Every answer except the contact (normalised in the key): a changed slot or budget is a new lead.
  const answers = JSON.stringify(Object.entries(fields).filter(([k]) => k !== 'contact').sort())
  if (isDuplicate(type, channel, contact, answers, started)) {
    log(409, { type, page, error: 'duplicate', contact: mask(contact) })
    return reply(409, { ok: false, error: 'duplicate' })
  }

  if (process.env.NODE_ENV !== 'production' && fields.name === 'Тест сбой') {
    log(500, { type, page, error: 'dev_forced_failure' })
    return reply(500, { ok: false, error: 'delivery_failed' })
  }

  const { score, temperature } = scoreLead(type, fields)
  const lead: NormalizedLead = {
    id,
    type,
    page,
    fields,
    meta,
    score,
    temperature,
    receivedAt: new Date(started).toISOString(),
    ...(honeypot ? { suspect: 'honeypot' as const } : {}),
  }

  let report
  try {
    report = await deliverLead(lead)
  } catch (error) {
    log(500, { type, page, error: 'delivery_threw', detail: String(error) })
    return reply(500, { ok: false, error: 'delivery_failed' })
  }

  const summary = {
    type,
    page,
    score,
    temperature,
    channel,
    contact: mask(contact),
    utm_source: meta.utm_source,
    landing: meta.landing,
    delivery: { amocrm: report.amocrm, telegram: report.telegram, devOnly: report.devOnly ?? false },
    ...(honeypot ? { suspect: 'honeypot' } : {}),
    ...(report.errors.length ? { errors: report.errors } : {}),
  }

  if (!report.ok) {
    log(500, { ...summary, error: 'delivery_failed' })
    return reply(500, { ok: false, error: 'delivery_failed' })
  }

  rememberLead(type, channel, contact, answers, started)
  // Delivered, but a channel failed or is half-configured (e.g. the amoCRM token expired and only
  // Telegram got the lead): logged as an error so monitoring sees it, not buried in info lines.
  const degraded = report.errors.length > 0
  log(200, degraded ? { ...summary, degraded: true } : summary, degraded ? 'error' : honeypot ? 'warn' : undefined)
  return reply(200, { ok: true, id })
}
