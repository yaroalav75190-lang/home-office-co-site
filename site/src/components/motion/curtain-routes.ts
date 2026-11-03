// What the «Занавес места» curtain shows for each destination (copy-global §6).
// Name in D1, local time in Small, and for geographic pages a coast drawing (rendered on the
// server in app/layout.tsx and passed to TransitionProvider as `art`).
import { formatClock } from '@/lib/reply-time'

export type CurtainArtKey = 'phuket-island' | 'bang-tao' | 'pattaya' | 'bali' | 'dubai' | 'cambodia'

export type CurtainMeta = {
  name: string
  /** Builds the time line from «16:40». */
  time: (now: number) => string
  art?: CurtainArtKey
}

const zone = {
  phuket: 'Asia/Bangkok',
  bali: 'Asia/Makassar',
  dubai: 'Asia/Dubai',
  cambodia: 'Asia/Phnom_Penh',
}

const at = (tz: string, label: string) => (now: number) => `${formatClock(now, tz)} ${label}`
const inPhuket = at(zone.phuket, 'на Пхукете')

/** «4:40 pm in Phuket» for the English stub. */
const inPhuketEn = (now: number) =>
  `${new Intl.DateTimeFormat('en-US', { timeZone: zone.phuket, hour: 'numeric', minute: '2-digit', hour12: true })
    .format(new Date(now))
    .toLowerCase()} in Phuket`

const routes: Record<string, CurtainMeta> = {
  '/': { name: 'Home Office & Co', time: inPhuket },
  '/thailand/phuket': { name: 'Пхукет', time: inPhuket, art: 'phuket-island' },
  '/thailand/phuket/bang-tao': { name: 'Банг Тао', time: inPhuket, art: 'bang-tao' },
  '/services/deal': { name: 'Сделка', time: inPhuket },
  '/contacts': { name: 'Контакты', time: inPhuket },
  '/en': { name: 'English', time: inPhuketEn },
  // Planned pages (copy-global §6), ready for when they go live.
  '/thailand/pattaya': { name: 'Паттайя', time: at(zone.phuket, 'в Паттайе'), art: 'pattaya' },
  '/bali': { name: 'Бали', time: at(zone.bali, 'на Бали'), art: 'bali' },
  '/dubai': { name: 'Дубай', time: at(zone.dubai, 'в Дубае'), art: 'dubai' },
  '/cambodia': { name: 'Камбоджа', time: at(zone.cambodia, 'в Камбодже'), art: 'cambodia' },
  '/team': { name: 'Команда', time: inPhuket },
  '/reviews': { name: 'Отзывы', time: inPhuket },
  '/journal': { name: 'Журнал', time: inPhuket },
}

/** Routes that never get the curtain: the quiz has its own chrome (art-direction §5, copy-global §6). */
export function isCurtainExcluded(pathname: string): boolean {
  return pathname === '/podbor' || pathname.startsWith('/podbor/')
}

export function curtainFor(pathname: string): CurtainMeta {
  const clean = pathname.length > 1 ? pathname.replace(/\/+$/, '') : pathname
  return routes[clean] ?? { name: 'Home Office & Co', time: inPhuket }
}
