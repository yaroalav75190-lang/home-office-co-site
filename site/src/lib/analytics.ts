// Analytics hooks: Yandex Metrika and GA4 goals (seo-brief §7.3).
//
// The counters are not installed yet, so every function here is a safe no-op until they are:
// - Metrika: set NEXT_PUBLIC_YM_ID and load tag.js in <head> (seo-brief §7.3); `trackGoal` then
//   calls `ym(ID, 'reachGoal', goal, params)`.
// - GA4: load gtag.js; `trackGoal` then calls `gtag('event', goal, params)`.
// In development every goal is printed to the console as `[goal] …`.
//
// Rule from seo-brief §7.3: lead goals fire only after the server answered `ok`, never on click.
// `submitLead` in `@/lib/lead` does that for all four lead types, so forms do not call it twice.

/** Goal ids as configured in Metrika (seo-brief §7.3). `click_whatsapp` is our addition: the
 * brief lists Telegram and MAX only, but WhatsApp is a channel on every page. Add it in Metrika. */
export type Goal =
  | 'quiz_start'
  | 'quiz_step_3'
  | 'quiz_submit'
  | 'lead_consult'
  | 'lead_viewing'
  | 'lead_guide'
  | 'click_phone'
  | 'click_telegram'
  | 'click_whatsapp'
  | 'click_max'
  | 'click_email'

export type GoalParams = Record<string, string | number | boolean>

type Counters = {
  ym?: (...args: unknown[]) => void
  gtag?: (...args: unknown[]) => void
}

const YM_ID = process.env.NEXT_PUBLIC_YM_ID

/** Sends a goal to Metrika and GA4 if they are on the page; otherwise does nothing. */
export function trackGoal(goal: Goal, params?: GoalParams): void {
  if (typeof window === 'undefined') return
  try {
    const w = window as unknown as Counters
    if (YM_ID && typeof w.ym === 'function') w.ym(Number(YM_ID), 'reachGoal', goal, params)
    if (typeof w.gtag === 'function') w.gtag('event', goal, params ?? {})
    if (process.env.NODE_ENV !== 'production') console.debug('[goal]', goal, params ?? '')
  } catch {
    // Analytics must never break a form or a link.
  }
}

/** Metrika and GA client ids from their cookies, sent with every lead to amoCRM (cro-specialist). */
export function getClientIds(): { ymUid?: string; gaCid?: string } {
  if (typeof document === 'undefined') return {}
  try {
    const cookies = Object.fromEntries(
      document.cookie
        .split(';')
        .map((c) => c.trim().split('='))
        .filter((p) => p.length >= 2)
        .map(([k, ...v]) => [k, decodeURIComponent(v.join('='))]),
    )
    const ga = cookies._ga as string | undefined
    return {
      ymUid: (cookies._ym_uid as string | undefined)?.slice(0, 64),
      // _ga = GA1.1.<client id> — the client id is the last two parts.
      gaCid: ga ? ga.split('.').slice(-2).join('.').slice(0, 64) : undefined,
    }
  } catch {
    return {}
  }
}

/** Which goal a link click means, by its href; null for ordinary links. */
export function goalForHref(href: string): Goal | null {
  if (href.startsWith('tel:')) return 'click_phone'
  if (href.startsWith('mailto:')) return 'click_email'
  if (/^https?:\/\/(t\.me|telegram\.me)\//.test(href) || href.startsWith('tg:')) return 'click_telegram'
  if (/^https?:\/\/(wa\.me|api\.whatsapp\.com|web\.whatsapp\.com)\//.test(href)) return 'click_whatsapp'
  if (/^https?:\/\/max\.ru\//.test(href)) return 'click_max'
  return null
}

let installed = 0
let onClick: ((e: MouseEvent) => void) | null = null

/**
 * One delegated listener for `click_phone`, `click_telegram`, `click_whatsapp`, `click_max`,
 * `click_email` on any link of the page (header, sticky bar, footer, tiles). Reference-counted,
 * so mounting it from several places never double-counts. Returns the cleanup.
 */
export function installClickGoals(): () => void {
  if (typeof document === 'undefined') return () => {}
  installed += 1
  if (installed === 1) {
    onClick = (e: MouseEvent) => {
      const target = e.target instanceof Element ? e.target.closest('a[href]') : null
      if (!target) return
      const goal = goalForHref(target.getAttribute('href') ?? '')
      if (goal) trackGoal(goal, { page: window.location.pathname })
    }
    document.addEventListener('click', onClick, { capture: true })
  }
  return () => {
    installed -= 1
    if (installed === 0 && onClick) {
      document.removeEventListener('click', onClick, { capture: true })
      onClick = null
    }
  }
}
