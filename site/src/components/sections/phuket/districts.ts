// Phuket districts: the six rows of the hub (/thailand/phuket, copy-phuket §3) and the district
// page template (/thailand/phuket/[district], copy-bang-tao). Facts only: ids, slugs, photos,
// coordinates, hrefs and the `ready` flag. The words (names, verdicts, facts, captions and the page
// copy) live in src/i18n/ru/districts.ts, keyed by district id: `getDictionary(locale).districts`.
// The broker checks the district descriptions before launch (DEMO_DECISIONS). When Payload arrives,
// this file and the dictionary map to the district collection (seo-brief §4.3, «Шаблон района: поля CMS»).

import type { DistrictId, PlaceId } from '@/components/coast'
import type { DistrictsDict } from '@/i18n/ru/districts'
import type { PhotoKey, PhotoRatio, Ratio } from '@/lib/photos'

/** Photos that have every crop in `R`, e.g. `PhotoHaving<'21x9' | '3x2'>`. */
export type PhotoHaving<R extends Ratio> = {
  [K in PhotoKey]: [R] extends [PhotoRatio<K>] ? K : never
}[PhotoKey]

/** A district photo. Its caption («Место, побережье») is in the dictionary, next to the block's words. */
export type DistrictPhoto<R extends Ratio> = {
  key: PhotoHaving<R>
}

/** Words of one hub row: `getDictionary(locale).districts.districts[id]` (name, verdict, facts, photoCaption). */
export type DistrictCopy = DistrictsDict['districts'][DistrictId]

/** District ids that have page copy in the dictionary (`districts.pages`). */
export type DistrictPageId = keyof DistrictsDict['pages'] & DistrictId

/** Words of one district page: `getDictionary(locale).districts.pages[id]`. */
export type DistrictPageCopy = DistrictsDict['pages'][DistrictPageId]

export type DistrictPage = {
  /**
   * The broker has filled blocks 2–4 with facts about this district. Until then the page is
   * `noindex, follow` and has no canonical: seo-brief §4.3 forbids publishing a district page
   * without unique facts, BUILD_PLAN decision 7 keeps Bang Tao out of production until then.
   */
  ready: boolean
  /** Latin name for schema.org `alternateName`: a fact, the same in every language. */
  nameLatin: string
  /** Locator dot for photo captions on the page (a district without a point gets none). */
  place: PlaceId | null
  /** Beach centre from OpenStreetMap (scripts/coast/regions.mjs), for Place.geo. */
  geo: { latitude: number; longitude: number }
  hero: {
    /** 21:9 photo «в край» under the hero (caption: `hero.panoramaCaption`). */
    panorama: DistrictPhoto<'21x9' | '3x2'>
  }
  life: {
    /** Captions: `life.portraitCaption`, `life.squareCaption`. */
    portrait: DistrictPhoto<'4x5'>
    square: DistrictPhoto<'1x1'>
  }
  honest: {
    guide: { href: string }
  }
  neighbours: {
    /** Neighbours along the coast, north first; their words are `neighbours.items[id]`. */
    ids: readonly DistrictId[]
    /** Where neighbour links go while those district pages do not exist (copy-bang-tao §6). */
    fallback: { href: string }
  }
}

export type District = {
  id: DistrictId
  /** URL segment, seo-brief §3: /thailand/phuket/{slug}. Also the quiz `district` parameter. */
  slug: string
  /** 3:2 photo for the row (caption: `photoCaption`); rows without one get the 160 px locator (art-direction §4). */
  photo?: DistrictPhoto<'3x2'>
  /** Full district page. Only districts with a page get a route and a link from the hub. */
  page?: DistrictPage
}

const bangTaoPage: DistrictPage = {
  ready: false,
  nameLatin: 'Bang Tao',
  place: 'bang-tao',
  geo: { latitude: 8.0083, longitude: 98.2886 },
  hero: {
    panorama: { key: 'banana' },
  },
  life: {
    // The author asks for «Photo: Anton Zelenov» next to this photo (lib/photos NOTES): the
    // dictionary caption carries it.
    portrait: { key: 'sunset' },
    square: { key: 'villa' },
  },
  honest: {
    guide: { href: '/#gid' },
  },
  neighbours: {
    ids: ['layan', 'kamala'],
    fallback: { href: '/thailand/phuket#rajony' },
  },
}

/** The client's six districts, north to south (art-direction §2). */
export const districts: readonly District[] = [
  {
    id: 'layan',
    slug: 'layan',
    photo: { key: 'banana' },
  },
  {
    id: 'bang-tao',
    slug: 'bang-tao',
    photo: { key: 'bangtao' },
    page: bangTaoPage,
  },
  {
    id: 'kamala',
    slug: 'kamala',
    photo: { key: 'kamala' },
  },
  {
    id: 'karon-kata',
    slug: 'kata-karon',
    photo: { key: 'kata' },
  },
  {
    id: 'nai-harn-rawai',
    slug: 'rawai-nai-harn',
    photo: { key: 'naiharn' },
  },
  {
    id: 'chalong',
    slug: 'chalong',
    photo: { key: 'bigBuddha' },
  },
]

export const districtHref = (d: District) => `/thailand/phuket/${d.slug}`

/** Quiz with Phuket and this district pre-selected (copy-global §3). */
export const districtQuizHref = (d: District) => `/podbor?country=phuket&district=${d.slug}`

/** A district with its own page; its id indexes `districts.pages` and `meta.districts` in the dictionary. */
export type DistrictWithPage = District & { id: DistrictPageId; page: DistrictPage }

export function districtBySlug(slug: string): DistrictWithPage | undefined {
  const d = districts.find((item) => item.slug === slug)
  return d?.page ? (d as DistrictWithPage) : undefined
}

export function districtById(id: DistrictId): District | undefined {
  return districts.find((item) => item.id === id)
}

/** Slugs that have a full page: the only ones `generateStaticParams` returns. */
export const districtPageSlugs = districts.filter((d) => d.page).map((d) => d.slug)
