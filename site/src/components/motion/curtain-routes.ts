// What the «Занавес места» curtain shows for each destination (copy-global §6).
// Name in D1, local time in Small, and for geographic pages a coast drawing (rendered on the
// server in the site shell and passed to TransitionProvider as `art`). Paths are matched without
// the locale prefix; names and the «на Пхукете» labels come from `common.curtain`.
import type { Locale } from '@/i18n/config'
import { stripLocale } from '@/i18n/config'
import type { CommonDict } from '@/i18n/ru/common'
import { formatClock } from '@/lib/reply-time'

export type CurtainArtKey = 'phuket-island' | 'bang-tao' | 'pattaya' | 'bali' | 'dubai' | 'cambodia'

type CurtainWords = CommonDict['curtain']
type NameKey = keyof CurtainWords['names']
type PlaceKey = keyof CurtainWords['at']

export type CurtainMeta = {
  name: string
  /** Builds the time line from «16:40». */
  time: (now: number) => string
  art?: CurtainArtKey
}

const zone: Record<PlaceKey, string> = {
  phuket: 'Asia/Bangkok',
  pattaya: 'Asia/Bangkok',
  bali: 'Asia/Makassar',
  dubai: 'Asia/Dubai',
  cambodia: 'Asia/Phnom_Penh',
}

const routes: Record<string, { name: NameKey; at: PlaceKey; art?: CurtainArtKey }> = {
  '/': { name: 'home', at: 'phuket' },
  '/thailand/phuket': { name: 'phuket', at: 'phuket', art: 'phuket-island' },
  '/thailand/phuket/bang-tao': { name: 'bangTao', at: 'phuket', art: 'bang-tao' },
  '/services/deal': { name: 'deal', at: 'phuket' },
  '/contacts': { name: 'contacts', at: 'phuket' },
  // Planned pages (copy-global §6), ready for when they go live.
  '/thailand/pattaya': { name: 'pattaya', at: 'pattaya', art: 'pattaya' },
  '/bali': { name: 'bali', at: 'bali', art: 'bali' },
  '/dubai': { name: 'dubai', at: 'dubai', art: 'dubai' },
  '/cambodia': { name: 'cambodia', at: 'cambodia', art: 'cambodia' },
  '/team': { name: 'team', at: 'phuket' },
  '/reviews': { name: 'reviews', at: 'phuket' },
  '/journal': { name: 'journal', at: 'phuket' },
}

/** Routes that never get the curtain: the quiz has its own chrome (art-direction §5, copy-global §6). */
export function isCurtainExcluded(pathname: string): boolean {
  const path = stripLocale(pathname).path
  return path === '/podbor' || path.startsWith('/podbor/')
}

export function curtainFor(pathname: string, words: CurtainWords, locale: Locale): CurtainMeta {
  const path = stripLocale(pathname).path
  const clean = path.length > 1 ? path.replace(/\/+$/, '') : path
  const route = routes[clean] ?? { name: 'home', at: 'phuket' }
  return {
    name: words.names[route.name],
    time: (now: number) => `${formatClock(now, zone[route.at], locale)} ${words.at[route.at]}`,
    art: route.art,
  }
}
