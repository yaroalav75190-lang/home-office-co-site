// In-memory abuse guards for /api/lead: a per-IP rate limit and the 10-minute duplicate window
// (copy-global §8.4 «Повторная отправка того же контакта за 10 минут»).
//
// Minimal by design: state lives in this server instance's memory, so it resets on restart and is
// not shared between serverless instances. Enough against a double click or a naive bot; for
// real traffic put a shared store (Redis / Upstash) or the hosting firewall in front.

import { createHash } from 'node:crypto'

const WINDOW_MS = 10 * 60 * 1000
/**
 * Requests per IP per window (valid or not). A person sends one or two; 8 leaves room for typos.
 * Development allows 40 so testing the forms does not lock you out. Override: LEAD_RATE_LIMIT.
 */
const MAX_PER_WINDOW = Number(process.env.LEAD_RATE_LIMIT) || (process.env.NODE_ENV === 'production' ? 8 : 40)
const MAX_KEYS = 5000

const hits = new Map<string, number[]>()
const recent = new Map<string, number>()

function prune<T>(map: Map<string, T>) {
  if (map.size <= MAX_KEYS) return
  // Maps keep insertion order: drop the oldest tenth.
  let n = Math.ceil(MAX_KEYS / 10)
  for (const key of map.keys()) {
    map.delete(key)
    if (--n <= 0) break
  }
}

/** true if this IP may send another request now (and counts it). */
export function allowRequest(ip: string, now: number = Date.now()): boolean {
  const list = (hits.get(ip) ?? []).filter((t) => now - t < WINDOW_MS)
  if (list.length >= MAX_PER_WINDOW) {
    hits.set(ip, list)
    return false
  }
  list.push(now)
  hits.delete(ip)
  hits.set(ip, list)
  prune(hits)
  return true
}

/**
 * Normalised contact (digits for phones, lower-case for nicks and e-mails) plus a hash of the
 * answers. The answers are part of the key so that only a true repeat (double click, retry after a
 * timeout) is a duplicate: a visitor who rebooks another slot or changes the budget within 10
 * minutes gets a new lead, instead of «уже у брокера» while the broker holds the old answers.
 */
function contactKey(type: string, channel: string, contact: string, answers: string) {
  const c = contact.trim().toLowerCase()
  const value = /^[+\d(][\d\s()+-]*$/.test(c) ? c.replace(/\D/g, '') : c.replace(/^@/, '')
  const hash = createHash('sha256').update(answers).digest('hex').slice(0, 16)
  return `${type}:${channel}:${value}:${hash}`
}

/** The same lead (type, contact and answers) was delivered less than 10 minutes ago. */
export function isDuplicate(type: string, channel: string, contact: string, answers: string, now: number = Date.now()): boolean {
  const at = recent.get(contactKey(type, channel, contact, answers))
  return at !== undefined && now - at < WINDOW_MS
}

/** Remember a delivered lead for the duplicate window. */
export function rememberLead(type: string, channel: string, contact: string, answers: string, now: number = Date.now()) {
  const key = contactKey(type, channel, contact, answers)
  recent.delete(key)
  recent.set(key, now)
  prune(recent)
}

/**
 * Client IP from the proxy headers; hashed before it reaches a log. Behind nginx or another proxy
 * the proxy must set X-Forwarded-For / X-Real-IP: otherwise every visitor shares the proxy's IP
 * and the whole site shares one bucket of MAX_PER_WINDOW leads per 10 minutes.
 */
export function clientIp(headers: Headers): string {
  const forwarded = headers.get('x-forwarded-for')
  if (forwarded) return forwarded.split(',')[0].trim()
  return headers.get('x-real-ip')?.trim() || 'unknown'
}

export function hashIp(ip: string): string {
  return createHash('sha256').update(`hoc-lead:${ip}`).digest('hex').slice(0, 12)
}
