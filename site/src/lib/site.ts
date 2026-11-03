// Site-wide configuration: name, navigation, destinations, broker hours, contacts.
// One place for facts that several components show. Wording follows docs/content/copy-global.md.
// Promo version (docs/DEMO_DECISIONS.md, 3 Nov 2026): contacts, hours and the legal line carry the
// values the project lead approved; the client confirms them before launch (list at the end of that
// doc). `placeholder: true` brings back the quiet stub rendering for a value that is not confirmed.

import type { CoastId } from '@/components/coast/types'

export type NavItem = {
  label: string
  href: string
  /** Page exists in the current build wave. Planned pages are not linked directly (no 404s). */
  live?: boolean
  /** Where the link goes while the page is planned, and how it is named then (copy-global §2). */
  fallback?: { label: string; href: string }
}

export type DestinationId = 'phuket' | 'bali' | 'dubai' | 'cambodia'

/** Ids of the coast drawings exported by `@/components/coast` (owned by the coast-data agent). */
export type { CoastId }

export type Destination = {
  id: DestinationId
  /** Short name: footer «Пхукет 16:40», mobile menu. */
  name: string
  /** Column title in the desktop «Направления» panel: «Таиланд», «Бали»… */
  region: string
  /** Locative for the clock in the panel: «16:40 в Таиланде». */
  regionTimeLabel: string
  /** Locative for the clock elsewhere: «16:40 на Пхукете». */
  timeLabel: string
  /** Final page URL (seo-brief §3). */
  href: string
  live: boolean
  /** Quiz with the country pre-selected, used while the page is planned. */
  quizHref: string
  /** IANA time zone used for the live local time. */
  timeZone: string
  coast: CoastId
  /** Screen-reader name of the coast drawing (copy-global §2). */
  coastLabel: string
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
  /** Default description; uses only facts from the brief. Pages set their own. */
  description:
    'Агентство недвижимости Home Office & Co: квартиры и виллы на Пхукете, в Паттайе, на Бали, в Дубае и Камбодже. Подбор, проверка документов, сопровождение сделки.',
  locale: 'ru_RU',
  year: 2026,
} as const

/**
 * Desktop header navigation, in this order; commas between items come from CSS.
 * With SHOW_PLANNED_PAGES = false it reads «Направления, Сопровождение сделки, Контакты»
 * (BUILD_PLAN decision 5): «Услуги» stands in for its one built page until the services hub exists.
 */
export const mainNav: NavItem[] = [
  { label: 'Направления', href: '/destinations', live: false },
  {
    label: 'Услуги',
    href: '/services',
    live: false,
    fallback: { label: 'Сопровождение сделки', href: '/services/deal' },
  },
  { label: 'Команда', href: '/team', live: false },
  { label: 'Отзывы', href: '/reviews', live: false },
  { label: 'Журнал', href: '/journal', live: false },
  { label: 'Контакты', href: '/contacts', live: true },
]

export const primaryCta: NavItem = { label: 'Подобрать объект', href: '/podbor', live: true }

export const englishLink: NavItem = { label: 'English', href: '/en', live: true }

export const servicesNav: NavItem[] = [
  {
    label: 'Инвесторам',
    href: '/services/investors',
    live: false,
  },
  {
    label: 'Для жизни и зимовки',
    href: '/services/living',
    live: false,
  },
  { label: 'Сопровождение сделки', href: '/services/deal', live: true },
]

/** Mobile menu, top to bottom (copy-global §2). «Направления» and «Услуги» expand in place. */
export const mobileNav: NavItem[] = [
  { label: 'Подбор объекта', href: '/podbor', live: true },
  { label: 'Команда', href: '/team', live: false },
  { label: 'Отзывы', href: '/reviews', live: false },
  { label: 'Журнал', href: '/journal', live: false },
  { label: 'Контакты', href: '/contacts', live: true },
]

/** Footer menu, D3 (copy-global §7). Add Команда, Отзывы, Журнал once those pages exist. */
export const footerNav: NavItem[] = [
  { label: 'Пхукет', href: '/thailand/phuket', live: true },
  { label: 'Сопровождение сделки', href: '/services/deal', live: true },
  { label: 'Подбор объекта', href: '/podbor', live: true },
  { label: 'Контакты', href: '/contacts', live: true },
]

/** Destinations in menu order. Phuket districts run north to south (art-direction §2). */
export const destinations: Destination[] = [
  {
    id: 'phuket',
    name: 'Пхукет',
    region: 'Таиланд',
    regionTimeLabel: 'в Таиланде',
    timeLabel: 'на Пхукете',
    href: '/thailand/phuket',
    live: true,
    quizHref: '/podbor?country=phuket',
    timeZone: 'Asia/Bangkok',
    coast: 'phuket-west',
    coastLabel: 'Западное побережье Пхукета',
    links: [
      { label: 'Пхукет', href: '/thailand/phuket', live: true },
      { label: 'Банг Тао', href: '/thailand/phuket/bang-tao', live: true },
      {
        label: 'Паттайя',
        href: '/thailand/pattaya',
        live: false,
        fallback: { label: 'Подобрать в Паттайе', href: '/podbor?country=pattaya' },
      },
    ],
  },
  {
    id: 'bali',
    name: 'Бали',
    region: 'Бали',
    regionTimeLabel: 'на Бали',
    timeLabel: 'на Бали',
    href: '/bali',
    live: false,
    quizHref: '/podbor?country=bali',
    timeZone: 'Asia/Makassar',
    coast: 'bali-bukit',
    coastLabel: 'Полуостров Букит, Бали',
    links: [
      {
        label: 'Недвижимость на Бали',
        href: '/bali',
        live: false,
        fallback: { label: 'Подобрать на Бали', href: '/podbor?country=bali' },
      },
    ],
  },
  {
    id: 'dubai',
    name: 'Дубай',
    region: 'Дубай',
    regionTimeLabel: 'в Дубае',
    timeLabel: 'в Дубае',
    href: '/dubai',
    live: false,
    quizHref: '/podbor?country=dubai',
    timeZone: 'Asia/Dubai',
    coast: 'dubai-jumeirah',
    coastLabel: 'Джумейра и Пальма, Дубай',
    links: [
      {
        label: 'Недвижимость в Дубае',
        href: '/dubai',
        live: false,
        fallback: { label: 'Подобрать в Дубае', href: '/podbor?country=dubai' },
      },
    ],
  },
  {
    id: 'cambodia',
    name: 'Камбоджа',
    region: 'Камбоджа',
    regionTimeLabel: 'в Камбодже',
    timeLabel: 'в Камбодже',
    href: '/cambodia',
    live: false,
    quizHref: '/podbor?country=cambodia',
    timeZone: 'Asia/Phnom_Penh',
    coast: 'sihanoukville',
    coastLabel: 'Побережье Сиануквиля, Камбоджа',
    links: [
      {
        label: 'Недвижимость в Камбодже',
        href: '/cambodia',
        live: false,
        fallback: { label: 'Подобрать в Камбодже', href: '/podbor?country=cambodia' },
      },
    ],
  },
]

/** Mobile «Направления» list (copy-global §2): Банг Тао is indented under Пхукет. */
export const mobileDestinationLinks: (NavItem & { indent?: boolean })[] = [
  { label: 'Пхукет', href: '/thailand/phuket', live: true },
  { label: 'Банг Тао', href: '/thailand/phuket/bang-tao', live: true, indent: true },
  {
    label: 'Паттайя',
    href: '/thailand/pattaya',
    live: false,
    fallback: { label: 'Подобрать в Паттайе', href: '/podbor?country=pattaya' },
  },
  ...destinations
    .filter((d) => d.id !== 'phuket')
    .map((d) => ({
      label: d.name,
      href: d.href,
      live: d.live,
      fallback: d.links[0]?.fallback,
    })),
]

/** Resolves a nav item to what is actually linked now: the page, its fallback, or nothing. */
export function resolveLink(item: NavItem): { label: string; href: string } | null {
  if (item.live !== false) return { label: item.label, href: item.href }
  if (item.fallback) return item.fallback
  return SHOW_PLANNED_PAGES ? { label: item.label, href: item.href } : null
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

export type ContactChannel = {
  id: 'telegram' | 'whatsapp' | 'phone' | 'email'
  /** Name of the channel, set large on /contacts with the address under it (QA round 1 §5). */
  name: string
  /** Channel name on tiles. */
  label: string
  /** Verb label for buttons and screen readers (copy-global §3, §4). */
  action: string
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
    name: 'Telegram',
    label: 'Telegram',
    action: 'Написать в Telegram',
    display: '+7 939 700-87-47',
    href: 'https://t.me/+79397008747',
    placeholder: false,
  },
  whatsapp: {
    id: 'whatsapp',
    name: 'WhatsApp',
    label: 'WhatsApp',
    action: 'Написать в WhatsApp',
    display: '+7 939 700-87-47',
    href: 'https://wa.me/79397008747',
    placeholder: false,
  },
  phone: {
    id: 'phone',
    name: 'Телефон',
    label: 'Позвонить',
    action: 'Позвонить',
    display: '+7 939 700-87-47',
    href: 'tel:+79397008747',
    placeholder: false,
  },
  email: {
    id: 'email',
    name: 'Почта',
    label: 'Почта',
    action: 'Написать на почту',
    display: 'hello@homeofficeco.com',
    href: 'mailto:hello@homeofficeco.com',
    placeholder: false,
  },
}

/**
 * Ivan answers Telegram, WhatsApp and the phone (DEMO_DECISIONS «Контакты и работа»). Until the team
 * is photographed his portrait is a typographic card with the initial (DEMO_DECISIONS «Люди и отзывы»).
 */
export const founder = { name: 'Иван', role: 'основатель' } as const

/** Consultation booking anchor on /contacts (copy-global §7). */
export const consultationLink: NavItem = {
  label: 'Записаться на консультацию',
  href: '/contacts#zapis',
  live: true,
}

/**
 * Legal block for the footer and /contacts (seo-brief §7.5). No registration numbers until the
 * client sends them (DEMO_DECISIONS «Реквизиты»).
 */
export const requisites = {
  text: 'Home Office & Co. Реквизиты для договора отправляем по запросу',
  placeholder: false,
} as const

export const legalLinks: NavItem[] = [
  { label: 'Политика конфиденциальности', href: '/privacy', live: true },
  { label: 'Согласие на обработку персональных данных', href: '/consent', live: true },
]

export const creditsLinks = {
  photos: { label: 'Авторы фото', href: '/credits' },
  maps: { label: 'Карты © участники OpenStreetMap', href: 'https://www.openstreetmap.org/copyright' },
} as const
