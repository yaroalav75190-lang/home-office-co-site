// Site-wide configuration: name, navigation, destinations, broker hours, contacts.
// One place for facts that several components show. Words (nav labels, destination names, channel
// names) live in the dictionaries: `common.nav`, `common.destinations`, `common.channels` in
// src/i18n/<locale>/common.ts. Hrefs here are Russian paths; links localize them for en/es.
// Promo version (docs/DEMO_DECISIONS.md, 3 Nov 2026): contacts, hours and the legal line carry the
// values the project lead approved; the client confirms them before launch (list at the end of that
// doc). `placeholder: true` brings back the quiet stub rendering for a value that is not confirmed.

import type { CoastId } from '@/components/coast/types'
import type { CommonDict } from '@/i18n/ru/common'

/** Key of a navigation label in `common.nav`. */
export type NavLabelId = keyof CommonDict['nav']

export type NavItem = {
  /** Label key in `common.nav`. */
  id: NavLabelId
  href: string
  /** Page exists in the current build wave. Planned pages are not linked directly (no 404s). */
  live?: boolean
  /** Where the link goes while the page is planned, and how it is named then (copy-global §2). */
  fallback?: { id: NavLabelId; href: string }
}

export type DestinationId = 'phuket' | 'bali' | 'dubai' | 'cambodia'

/** Ids of the coast drawings exported by `@/components/coast` (owned by the coast-data agent). */
export type { CoastId }

export type Destination = {
  /** Also the key of its words in `common.destinations` (name, region, time labels, coast label). */
  id: DestinationId
  /** Final page URL (seo-brief §3). */
  href: string
  live: boolean
  /** Quiz with the country pre-selected, used while the page is planned. */
  quizHref: string
  /** IANA time zone used for the live local time. */
  timeZone: string
  coast: CoastId
  /** Links in the desktop panel column. */
  links: NavItem[]
}

/**
 * Show planned pages (Команда, Отзывы, Журнал…) in the navigation.
 * `true` follows the tech lead's nav list (docs/BUILD_PLAN.md); copy-global §2 recommends `false`
 * until those pages exist, so no menu item leads to a 404. Decide before launch.
 */
export const SHOW_PLANNED_PAGES = false

export const site = {
  name: 'Home Office & Co',
  year: 2026,
} as const

/**
 * Desktop header navigation, in this order; commas between items come from CSS.
 * With SHOW_PLANNED_PAGES = false it reads «Направления, Сопровождение сделки, Контакты»
 * (BUILD_PLAN decision 5): «Услуги» stands in for its one built page until the services hub exists.
 */
export const mainNav: NavItem[] = [
  { id: 'destinations', href: '/destinations', live: false },
  {
    id: 'services',
    href: '/services',
    live: false,
    fallback: { id: 'deal', href: '/services/deal' },
  },
  { id: 'team', href: '/team', live: false },
  { id: 'reviews', href: '/reviews', live: false },
  { id: 'journal', href: '/journal', live: false },
  { id: 'contacts', href: '/contacts', live: true },
]

export const primaryCta: NavItem = { id: 'podborCta', href: '/podbor', live: true }

export const servicesNav: NavItem[] = [
  { id: 'investors', href: '/services/investors', live: false },
  { id: 'living', href: '/services/living', live: false },
  { id: 'deal', href: '/services/deal', live: true },
]

/** Mobile menu, top to bottom (copy-global §2). «Направления» and «Услуги» expand in place. */
export const mobileNav: NavItem[] = [
  { id: 'podbor', href: '/podbor', live: true },
  { id: 'team', href: '/team', live: false },
  { id: 'reviews', href: '/reviews', live: false },
  { id: 'journal', href: '/journal', live: false },
  { id: 'contacts', href: '/contacts', live: true },
]

/** Footer menu, D3 (copy-global §7). Add Команда, Отзывы, Журнал once those pages exist. */
export const footerNav: NavItem[] = [
  { id: 'phuket', href: '/thailand/phuket', live: true },
  { id: 'deal', href: '/services/deal', live: true },
  { id: 'podbor', href: '/podbor', live: true },
  { id: 'contacts', href: '/contacts', live: true },
]

/** Destinations in menu order. Phuket districts run north to south (art-direction §2). */
export const destinations: Destination[] = [
  {
    id: 'phuket',
    href: '/thailand/phuket',
    live: true,
    quizHref: '/podbor?country=phuket',
    timeZone: 'Asia/Bangkok',
    coast: 'phuket-west',
    links: [
      { id: 'phuket', href: '/thailand/phuket', live: true },
      { id: 'bangTao', href: '/thailand/phuket/bang-tao', live: true },
      {
        id: 'pattaya',
        href: '/thailand/pattaya',
        live: false,
        fallback: { id: 'pattayaQuiz', href: '/podbor?country=pattaya' },
      },
    ],
  },
  {
    id: 'bali',
    href: '/bali',
    live: false,
    quizHref: '/podbor?country=bali',
    timeZone: 'Asia/Makassar',
    coast: 'bali-bukit',
    links: [
      {
        id: 'baliPage',
        href: '/bali',
        live: false,
        fallback: { id: 'baliQuiz', href: '/podbor?country=bali' },
      },
    ],
  },
  {
    id: 'dubai',
    href: '/dubai',
    live: false,
    quizHref: '/podbor?country=dubai',
    timeZone: 'Asia/Dubai',
    coast: 'dubai-jumeirah',
    links: [
      {
        id: 'dubaiPage',
        href: '/dubai',
        live: false,
        fallback: { id: 'dubaiQuiz', href: '/podbor?country=dubai' },
      },
    ],
  },
  {
    id: 'cambodia',
    href: '/cambodia',
    live: false,
    quizHref: '/podbor?country=cambodia',
    timeZone: 'Asia/Phnom_Penh',
    coast: 'sihanoukville',
    links: [
      {
        id: 'cambodiaPage',
        href: '/cambodia',
        live: false,
        fallback: { id: 'cambodiaQuiz', href: '/podbor?country=cambodia' },
      },
    ],
  },
]

/**
 * Mobile «Направления» list (copy-global §2): Банг Тао is indented under Пхукет. Items with
 * `destination` take their label from `common.destinations[destination].name`.
 */
export const mobileDestinationLinks: (NavItem & { indent?: boolean; destination?: DestinationId })[] = [
  { id: 'phuket', href: '/thailand/phuket', live: true },
  { id: 'bangTao', href: '/thailand/phuket/bang-tao', live: true, indent: true },
  {
    id: 'pattaya',
    href: '/thailand/pattaya',
    live: false,
    fallback: { id: 'pattayaQuiz', href: '/podbor?country=pattaya' },
  },
  ...destinations
    .filter((d) => d.id !== 'phuket')
    .map((d) => ({
      id: d.links[0].id,
      destination: d.id,
      href: d.href,
      live: d.live,
      fallback: d.links[0]?.fallback,
    })),
]

/**
 * Resolves a nav item to what is actually linked now: the page, its fallback, or nothing.
 * `labels` is `common.nav` of the page's locale; `label` overrides the item's own label.
 */
export function resolveLink(
  item: NavItem,
  labels: CommonDict['nav'],
  label?: string,
): { label: string; href: string } | null {
  if (item.live !== false) return { label: label ?? labels[item.id], href: item.href }
  if (item.fallback) return { label: labels[item.fallback.id], href: item.fallback.href }
  return SHOW_PLANNED_PAGES ? { label: label ?? labels[item.id], href: item.href } : null
}

/** Destination href for the footer: page when live, quiz with the country otherwise (copy-global §7). */
export function destinationHref(d: Destination): string {
  return d.live ? d.href : d.quizHref
}

/**
 * Broker working hours: 9:00–21:00 on Phuket, daily (DEMO_DECISIONS «Контакты и работа»; the client
 * confirms before launch). Change here only: ReplyTime, the slot picker and the footer read it.
 */
export const brokerHours = {
  timeZone: 'Asia/Bangkok',
  /** UTC offset of the broker zone in minutes; Thailand has no DST. */
  utcOffsetMinutes: 7 * 60,
  /** Phuket wall-clock time, minutes from midnight. Requests before closing count as in hours. */
  openMinutes: 9 * 60,
  closeMinutes: 21 * 60,
  /** Promised reply time, minutes (brief: «брокер отвечает за 15 минут»). */
  replyMinutes: 15,
  placeholder: false,
} as const

export type BrokerHours = typeof brokerHours

/** Moscow is UTC+3 all year: the Russian footer and /contacts state broker hours in Moscow time too. */
export const MOSCOW_UTC_OFFSET_MINUTES = 3 * 60

export type ContactChannel = {
  /** Also the key of its words in `common.channels` (name, tile label, verb label). */
  id: 'telegram' | 'whatsapp' | 'phone' | 'email'
  /** What the visitor sees as the address: handle, number or e-mail. */
  display: string
  href: string
  placeholder: boolean
}

/**
 * Ivan's number from the questionnaire for phone, Telegram and WhatsApp; e-mail on the domain the
 * client still confirms (DEMO_DECISIONS «Контакты и работа»).
 */
export const contacts: Record<ContactChannel['id'], ContactChannel> = {
  telegram: {
    id: 'telegram',
    display: '+7 939 700-87-47',
    href: 'https://t.me/+79397008747',
    placeholder: false,
  },
  whatsapp: {
    id: 'whatsapp',
    display: '+7 939 700-87-47',
    href: 'https://wa.me/79397008747',
    placeholder: false,
  },
  phone: {
    id: 'phone',
    display: '+7 939 700-87-47',
    href: 'tel:+79397008747',
    placeholder: false,
  },
  email: {
    id: 'email',
    display: 'hello@homeofficeco.com',
    href: 'mailto:hello@homeofficeco.com',
    placeholder: false,
  },
}

/** Consultation booking anchor on /contacts (copy-global §7). */
export const consultationLink: NavItem = {
  id: 'consultation',
  href: '/contacts#zapis',
  live: true,
}

/**
 * Legal block for the footer and /contacts (seo-brief §7.5); its text is `common.footer.requisites`.
 * No registration numbers until the client sends them (DEMO_DECISIONS «Реквизиты»).
 */
export const requisites = {
  placeholder: false,
} as const

export const legalLinks: NavItem[] = [
  { id: 'privacy', href: '/privacy', live: true },
  { id: 'consent', href: '/consent', live: true },
]

export const creditsLinks = {
  photos: { id: 'creditsPhotos', href: '/credits' },
  maps: { id: 'creditsMaps', href: 'https://www.openstreetmap.org/copyright' },
} as const satisfies Record<string, { id: NavLabelId; href: string }>
