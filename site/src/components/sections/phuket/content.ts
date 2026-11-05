// /thailand/phuket facts, blocks in wireframe order (art-direction §6): path, anchors, hrefs,
// photos and the order of keyed copy. The words, verbatim from docs/content/copy-phuket.md, live in
// src/i18n/ru/phuket.ts (`getDictionary(locale).phuket`). District rows live in ./districts.ts.

import type { PhuketDict } from '@/i18n/ru/phuket'
import type { PhotoKey } from '@/lib/photos'
import type { FormatItem, FormatsHeading } from './formats'

/** Quiz with Phuket preselected (copy-global §3). Hrefs are Russian paths; links localize them. */
const PHUKET_QUIZ = '/podbor?country=phuket'

export const phuketPage = {
  path: '/thailand/phuket',
  hero: { ctaHref: PHUKET_QUIZ },
  know: {
    /**
     * Order of the «Что знать до покупки» lines. The lines are keyed by these ids in the dictionary
     * (`phuket.know.items`), so a translation cannot drop or reorder one by accident.
     */
    order: ['timeDifference', 'winterSeason', 'foreignQuota', 'landLease', 'flight'],
  },
  districts: { id: 'rajony', quizHref: PHUKET_QUIZ },
  ownership: {
    /** Order of the two kinds of title (`phuket.ownership.parts` in the dictionary). */
    order: ['condo', 'villa'],
    /**
     * «Формулировки проверил [юрист]» — copy-phuket §4: shown only once a partner lawyer has really
     * checked the wording. Set the name here to show the line; null hides it.
     */
    checkedBy: null as string | null,
    guideHref: '/#gid',
  },
  /** Project cards (not rendered, see ./projects.tsx). */
  projects: { href: PHUKET_QUIZ },
  // Until /thailand/pattaya exists; then «Недвижимость в Паттайе» → /thailand/pattaya.
  pattaya: { href: '/podbor?country=pattaya' },
  closing: { ctaHref: PHUKET_QUIZ },
} as const

/** Format ids: the cards' words are `phuket.formats.items[id]` in the dictionary. */
export type FormatId = keyof PhuketDict['formats']['items']

/**
 * «Форматы, с которыми работаем» (QA round 1 §4): types of property instead of project cards, on
 * /thailand/phuket and the district pages. Sources and the photo choice: docs/content/copy-round2.md.
 * Facts only (photo and crop); the words are keyed by `id` in the dictionary.
 */
export const formats: { id: FormatId; photo: PhotoKey; ratio: '3x2' | '4x5' }[] = [
  { id: 'condo', photo: 'condo', ratio: '3x2' },
  { id: 'villa', photo: 'villa', ratio: '4x5' },
  { id: 'house', photo: 'house', ratio: '3x2' },
]

/**
 * Heading and cards of `<Formats />` in one language: the facts above with the words of
 * `getDictionary(locale).phuket.formats`. `note` is the 24-hour line; `cta.label` the quiz link.
 */
export function formatsContent(copy: PhuketDict['formats']): { heading: FormatsHeading; items: FormatItem[] } {
  return {
    heading: { title: copy.title, lead: copy.lead, note: copy.note, cta: { label: copy.cta } },
    items: formats.map((format) => ({ ...format, ...copy.items[format.id] })),
  }
}
