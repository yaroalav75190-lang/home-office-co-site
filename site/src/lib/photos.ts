/**
 * Photo registry: graded files, captions, alt texts and credits.
 *
 * Files come from `scripts/photos/grade.mjs` (art-directed crops + the «Документальный дневной
 * свет» grade, art direction §3.6 and §7). The `<generated:photos>` block below is rewritten by
 * that script, so sizes always match the files; everything else in this module is edited by hand.
 * Sources: Unsplash (Unsplash License), picked 3 Nov 2026; ids, authors and the Unsplash location
 * field of every pick are in `scripts/photos/unsplash.json`, fetch with `fetch-unsplash.mjs`.
 * The two Bang Tao frames (`bangtao`, `sunset`) are Wikimedia Commons photos
 * (CC BY / CC BY-SA): Unsplash has no photo with a confirmed Bang Tao location, and a caption
 * must not name a place the photo does not show.
 *
 *   photos.hero['21x9']        → { src, width, height }   (only the ratios that exist)
 *   photos[key][ratio]         → PhotoAsset | undefined for union-typed props
 *   getPhoto('hero', '21x9')   → PhotoAsset; a missing crop is a type error (PhotoRef / PhotoRatio)
 *   photoMeta.hero             → { alt, caption, place, credit, license, sourceUrl }
 *   credits                    → rows for /credits
 *
 * Captions go under the photo in «Место, побережье» form; text never sits on a photo. A caption
 * names a place only when the Unsplash location (or the author's description) confirms it;
 * format photos (villa, condo, house) say «Пример формата: …».
 * Key names are historical and kept for the API: `naiharnRocks` is Nai Harn from above; `hero`
 * is a Phuket beach without a confirmed place, so its caption names only the coast.
 */

export type PhotoKey =
  | 'hero'
  | 'phuket'
  | 'bangtao'
  | 'sunset'
  | 'kata'
  | 'naiharn'
  | 'pattaya'
  | 'bali'
  | 'villa'
  | 'dubai'
  | 'cambodia'
  | 'kamala'
  | 'banana'
  | 'naiharnRocks'
  | 'condo'
  | 'house'

export type Ratio = '21x9' | '3x2' | '4x5' | '1x1'

export type PhotoAsset = { readonly src: string; readonly width: number; readonly height: number }

/** Locator ids used by photos; a subset of `PlaceId` in `components/coast/types.ts`. */
export type PhotoPlace = 'kata-noi' | 'bang-tao' | 'kata' | 'nai-harn' | 'rawai' | 'kamala'

export type PhotoMeta = {
  /** Russian alt text: what is actually in the frame. */
  readonly alt: string
  /** Caption under the photo, «Место, побережье». */
  readonly caption: string
  /** Locator dot for the caption: only for a confirmed Phuket place, otherwise null. */
  readonly place: PhotoPlace | null
  /** Author as it should be credited (Unsplash profile name). */
  readonly credit: string
  readonly license: string
  /** Unsplash photo page. */
  readonly sourceUrl: string
}

// <generated:photos>
// Written by scripts/photos/grade.mjs from the crop config. Do not edit by hand.
const graded = {
  hero: {
    '21x9': { src: '/photos/graded/hero-21x9.jpg', width: 2400, height: 1029 },
    '3x2': { src: '/photos/graded/hero-3x2.jpg', width: 2400, height: 1600 },
    '4x5': { src: '/photos/graded/hero-4x5.jpg', width: 1492, height: 1865 },
  },
  phuket: {
    '21x9': { src: '/photos/graded/phuket-21x9.jpg', width: 2400, height: 1029 },
    '3x2': { src: '/photos/graded/phuket-3x2.jpg', width: 2400, height: 1600 },
    '4x5': { src: '/photos/graded/phuket-4x5.jpg', width: 1494, height: 1868 },
  },
  bangtao: {
    '21x9': { src: '/photos/graded/bangtao-21x9.jpg', width: 2400, height: 1029 },
    '3x2': { src: '/photos/graded/bangtao-3x2.jpg', width: 2400, height: 1600 },
  },
  banana: {
    '21x9': { src: '/photos/graded/banana-21x9.jpg', width: 2400, height: 1029 },
    '3x2': { src: '/photos/graded/banana-3x2.jpg', width: 2400, height: 1600 },
  },
  sunset: {
    '3x2': { src: '/photos/graded/sunset-3x2.jpg', width: 2400, height: 1600 },
    '4x5': { src: '/photos/graded/sunset-4x5.jpg', width: 1365, height: 1706 },
  },
  kata: {
    '3x2': { src: '/photos/graded/kata-3x2.jpg', width: 2400, height: 1600 },
    '4x5': { src: '/photos/graded/kata-4x5.jpg', width: 1494, height: 1867 },
    '1x1': { src: '/photos/graded/kata-1x1.jpg', width: 1867, height: 1867 },
  },
  naiharn: {
    '21x9': { src: '/photos/graded/naiharn-21x9.jpg', width: 2400, height: 1029 },
    '3x2': { src: '/photos/graded/naiharn-3x2.jpg', width: 2400, height: 1600 },
    '1x1': { src: '/photos/graded/naiharn-1x1.jpg', width: 1785, height: 1785 },
  },
  pattaya: {
    '3x2': { src: '/photos/graded/pattaya-3x2.jpg', width: 2400, height: 1600 },
    '4x5': { src: '/photos/graded/pattaya-4x5.jpg', width: 1493, height: 1866 },
  },
  bali: {
    '21x9': { src: '/photos/graded/bali-21x9.jpg', width: 2400, height: 1029 },
    '3x2': { src: '/photos/graded/bali-3x2.jpg', width: 2400, height: 1600 },
    '4x5': { src: '/photos/graded/bali-4x5.jpg', width: 1494, height: 1867 },
  },
  villa: {
    '3x2': { src: '/photos/graded/villa-3x2.jpg', width: 2363, height: 1575 },
    '4x5': { src: '/photos/graded/villa-4x5.jpg', width: 1260, height: 1575 },
    '1x1': { src: '/photos/graded/villa-1x1.jpg', width: 1575, height: 1575 },
  },
  dubai: {
    '3x2': { src: '/photos/graded/dubai-3x2.jpg', width: 1890, height: 1260 },
    '4x5': { src: '/photos/graded/dubai-4x5.jpg', width: 1243, height: 1554 },
  },
  cambodia: {
    '21x9': { src: '/photos/graded/cambodia-21x9.jpg', width: 2400, height: 1029 },
    '3x2': { src: '/photos/graded/cambodia-3x2.jpg', width: 2400, height: 1600 },
    '4x5': { src: '/photos/graded/cambodia-4x5.jpg', width: 1494, height: 1867 },
  },
  kamala: {
    '3x2': { src: '/photos/graded/kamala-3x2.jpg', width: 2400, height: 1600 },
  },
  naiharnRocks: {
    '3x2': { src: '/photos/graded/naiharnRocks-3x2.jpg', width: 2009, height: 1339 },
  },
  condo: {
    '3x2': { src: '/photos/graded/condo-3x2.jpg', width: 2400, height: 1600 },
    '4x5': { src: '/photos/graded/condo-4x5.jpg', width: 1494, height: 1867 },
  },
  house: {
    '3x2': { src: '/photos/graded/house-3x2.jpg', width: 2400, height: 1600 },
    '4x5': { src: '/photos/graded/house-4x5.jpg', width: 1484, height: 1855 },
  },
} as const satisfies Record<PhotoKey, Partial<Record<Ratio, PhotoAsset>>>
// </generated:photos>

/**
 * `photos[key][ratio]` works with union-typed keys and ratios (→ `PhotoAsset | undefined`),
 * while literal access to an existing crop (`photos.hero['21x9']`) is typed as defined.
 */
export const photos: { readonly [K in PhotoKey]: Partial<Record<Ratio, PhotoAsset>> } & typeof graded = graded

/** Ratios that exist for a given photo, e.g. `PhotoRatio<'dubai'>` is `'3x2' | '4x5'`. */
export type PhotoRatio<K extends PhotoKey> = Extract<keyof (typeof graded)[K], Ratio>

/** A photo + ratio pair that is guaranteed to exist: `{ photo: 'hero', ratio: '21x9' }`. */
export type PhotoRef = { [K in PhotoKey]: { photo: K; ratio: PhotoRatio<K> } }[PhotoKey]

/** Lookup that only accepts crops that exist (compile-time), for components taking props. */
export function getPhoto<K extends PhotoKey>(key: K, ratio: PhotoRatio<K>): PhotoAsset {
  const asset = photos[key][ratio as Ratio]
  if (!asset) throw new Error(`photos: no ${ratio} crop for "${key}"`)
  return asset
}

/** Ratios available per photo, for runtime checks (e.g. falling back from 21:9 to 3:2). */
export function photoRatios(key: PhotoKey): Ratio[] {
  return Object.keys(photos[key]) as Ratio[]
}

const UNSPLASH = 'Unsplash License'

const CC_BY_2 = 'CC BY 2.0'
const CC_BY_SA_4 = 'CC BY-SA 4.0'

const LICENSE_URL: Record<string, string | null> = {
  [UNSPLASH]: 'https://unsplash.com/license',
  [CC_BY_2]: 'https://creativecommons.org/licenses/by/2.0/deed.ru',
  [CC_BY_SA_4]: 'https://creativecommons.org/licenses/by-sa/4.0/deed.ru',
}

/**
 * Unsplash License: free commercial use, attribution not required; we credit authors anyway.
 * Every pick was checked as a free photo (not Unsplash+) on 3 November 2026. «Confirmed» below
 * means the Unsplash location field or the author's description names the place.
 * CC BY / CC BY-SA (the Bang Tao frames): author, license link, source page and changes are
 * required, all of them are on /credits; the sunset author also asks for a credit in the caption.
 */
export const photoMeta = {
  hero: {
    // Tags: phuket, thai beach; no location field. A west-coast beach (shallow water, casuarinas).
    alt: 'Длинный пляж Пхукета с высоты: дуга белого песка между казуаринами и мелкой бирюзовой водой, лодки на якоре, песчаная коса вдали',
    caption: 'Западное побережье Пхукета',
    place: null,
    credit: 'Antonio Araujo',
    license: UNSPLASH,
    sourceUrl: 'https://unsplash.com/photos/a-birds-eye-view-of-a-beach-and-ocean-6yBdFYernH8',
  },
  phuket: {
    // Location: Ya Nui, Rawai, Phuket. No locator: Ya Nui has no point of its own.
    alt: 'Бухта Я Нуи со смотровой площадки: лесистый мыс, островок напротив, маленький пляж и яхта на якоре',
    caption: 'Я Нуи, юго-западное побережье Пхукета',
    place: null,
    credit: 'Polina Kocheva',
    license: UNSPLASH,
    sourceUrl: 'https://unsplash.com/photos/a-body-of-water-surrounded-by-lush-green-trees-peQvWjjNPwo',
  },
  bangtao: {
    // Wikimedia Commons, «Bang Tao Beach (53667853591).jpg».
    alt: 'Пляж Банг Тао днём: шезлонги и зонты под пальмами, белый песок, лодки на воде, лесистый мыс на севере бухты',
    caption: 'Банг Тао, западное побережье Пхукета',
    place: 'bang-tao',
    credit: 'Raita Futo',
    license: CC_BY_2,
    sourceUrl: 'https://commons.wikimedia.org/wiki/File:Bang_Tao_Beach_(53667853591).jpg',
  },
  sunset: {
    // Wikimedia Commons, «Sunset at Bang Tao beach - 01.jpg».
    alt: 'Закат на пляже Банг Тао: камни на переднем плане, мокрый песок отражает небо, силуэт лесистого мыса',
    caption: 'Закат на Банг Тао, западное побережье Пхукета',
    place: 'bang-tao',
    credit: 'Anton Zelenov',
    license: CC_BY_SA_4,
    sourceUrl: 'https://commons.wikimedia.org/wiki/File:Sunset_at_Bang_Tao_beach_-_01.jpg',
  },
  kata: {
    // Location: Kata Beach, Karon; the author describes the sunset and the boat.
    alt: 'Пляж Ката на закате, снято с воды: лодка-лонгтейл, остров Ко Пу, солнце садится за мыс',
    caption: 'Ката, западное побережье Пхукета',
    place: 'kata',
    credit: 'Andre Mouton',
    license: UNSPLASH,
    sourceUrl: 'https://unsplash.com/photos/silhouette-of-trees-near-body-of-water-painting-pSQLxpYDh94',
  },
  naiharn: {
    // Location: Rawai (the subdistrict of Nai Harn); the frame is Nai Harn bay: the lake behind
    // the beach and the yacht anchorage are unmistakable.
    alt: 'Бухта Най Харн со склона холма: пляж и озеро за ним, яхты на рейде, остров у входа в бухту, сухой кустарник на переднем плане',
    caption: 'Най Харн, юго-западное побережье Пхукета',
    place: 'nai-harn',
    credit: 'Max Bvp',
    license: UNSPLASH,
    sourceUrl: 'https://unsplash.com/photos/a-view-of-the-ocean-from-a-hill-jBuf2eBg9I8',
  },
  pattaya: {
    // Location: Pattaya Beach, Chon Buri.
    alt: 'Паттайя с высоты: длинный пляж вдоль залива, высотки у набережной и город за ними',
    caption: 'Паттайя, побережье Сиамского залива',
    place: null,
    credit: 'Ryutaro Uozumi',
    license: UNSPLASH,
    sourceUrl: 'https://unsplash.com/photos/aerial-view-of-city-buildings-near-sea-during-daytime-QayxhLotMvM',
  },
  bali: {
    // Location: Uluwatu, Pecatu, Badung; description «Uluwatu Temple View».
    alt: 'Обрыв у храма Улувату на Бали: зелёные скалы, тропа по краю, внизу прибой и камень в пене',
    caption: 'Улувату, полуостров Букит, Бали',
    place: null,
    credit: 'Alexandra Smielova',
    license: UNSPLASH,
    sourceUrl: 'https://unsplash.com/photos/a-scenic-view-of-the-ocean-and-a-cliff-4euu6M6opno',
  },
  villa: {
    // Location: Koh Samui, not Phuket. A format example, not a client property.
    alt: 'Панорамный бассейн виллы на склоне: кромка воды сливается с морем, острова на горизонте, белый павильон слева',
    caption: 'Пример формата: вилла с бассейном',
    place: null,
    credit: 'big.tiny.belly',
    license: UNSPLASH,
    sourceUrl: 'https://unsplash.com/photos/infinity-pool-overlooking-blue-bay-XtnNrQYC7ts',
  },
  dubai: {
    // Location: West Beach, Palm Jumeirah; description «West Beach The Palm Jumeirah».
    alt: 'Небоскрёбы Дубай Марины через залив с пляжа на Пальме Джумейра, на воде катера',
    caption: 'Дубай Марина, вид с Пальмы Джумейра',
    place: null,
    credit: 'Jeffrey Francisco',
    license: UNSPLASH,
    sourceUrl: 'https://unsplash.com/photos/a-city-skyline-with-a-beach-and-water-6XlvCBOdkxI',
  },
  cambodia: {
    // Location: Koh Rong, Preah Sihanouk.
    alt: 'Две наклонённые пальмы на пляже Кох Ронга на закате, острова на горизонте, мокрый песок',
    caption: 'Кох Ронг, побережье Сиануквиля',
    place: null,
    credit: 'Jules Nehlig',
    license: UNSPLASH,
    sourceUrl: 'https://unsplash.com/photos/a-beach-with-palm-trees-and-water-Z1nxFBt9mfo',
  },
  kamala: {
    // Author's description: «Kamala Phuket Thailand sea view».
    alt: 'Скрытый пляж в Камале под лесистыми холмами: полоса песка, бирюзовая вода, на другом берегу бухты холм Патонга под дождевой тучей',
    caption: 'Камала, западное побережье Пхукета',
    place: 'kamala',
    credit: 'Max Bvp',
    license: UNSPLASH,
    sourceUrl: 'https://unsplash.com/photos/a-beautiful-beach-meets-a-green-lush-landscape-fShPggUL3LQ',
  },
  banana: {
    // Location: Choeng Thale, Thalang; description «Banana Phuket». The cove north of Layan.
    alt: 'Бухта Банана на северо-западе Пхукета: бирюзовая вода, лесистый мыс с одной виллой, гранитные валуны на переднем плане',
    caption: 'Пляж Банана, Чонг Тале, 3 км к северу от Банг Тао',
    place: 'bang-tao',
    credit: 'Max Bvp',
    license: UNSPLASH,
    sourceUrl: 'https://unsplash.com/photos/a-person-standing-on-a-rocky-beach-next-to-a-body-of-water-C9tf2yNUm-o',
  },
  naiharnRocks: {
    // Location: Nai Harn Beach, Rawai.
    alt: 'Пляж Най Харн сверху: диагональ песка между бирюзовой водой и деревьями, ряды синих зонтиков',
    caption: 'Най Харн, юго-западное побережье Пхукета',
    place: 'nai-harn',
    credit: 'Aleksandr Galichkin',
    license: UNSPLASH,
    sourceUrl: 'https://unsplash.com/photos/aerial-view-of-a-tropical-beach-with-palm-trees-and-ocean-LRHbBae_6k0',
  },
  condo: {
    // Location: Hua Hin, not Phuket. A format example.
    alt: 'Малоэтажный кондоминиум с общим бассейном: террасы и балконы, деревья и газон вдоль воды',
    caption: 'Пример формата: кондоминиум с общим бассейном',
    place: null,
    credit: 'allPhoto Bangkok',
    license: UNSPLASH,
    sourceUrl: 'https://unsplash.com/photos/green-trees-near-swimming-pool-during-daytime-nI4aC1kaTRc',
  },
  house: {
    // No location. A format example.
    alt: 'Современный одноэтажный дом с деревянной облицовкой, бассейном и газоном под деревьями',
    caption: 'Пример формата: дом для жизни',
    place: null,
    credit: 'Ronaldo Rizzutti',
    license: UNSPLASH,
    sourceUrl: 'https://unsplash.com/photos/a-modern-house-with-a-pool-in-the-yard-HY2xcxQQ0FU',
  },
} as const satisfies Record<PhotoKey, PhotoMeta>

export type Credit = {
  readonly key: PhotoKey
  /** What the photo shows (the caption). */
  readonly caption: string
  readonly author: string
  readonly license: string
  /** License URL, null if there is none. */
  readonly licenseUrl: string | null
  readonly sourceUrl: string
  /** What we changed (required by CC licenses; for Unsplash photos stated anyway). */
  readonly changes: string
  /** Share-alike license: our crops are published under the same license. */
  readonly shareAlike: boolean
  /** Extra request from the author, if any. */
  readonly note?: string
}

const NOTES: Partial<Record<PhotoKey, string>> = {
  sunset: 'По просьбе автора его имя стоит в подписи под фото',
}

const ORDER: PhotoKey[] = [
  'hero',
  'phuket',
  'bangtao',
  'banana',
  'kamala',
  'sunset',
  'kata',
  'naiharn',
  'naiharnRocks',
  'pattaya',
  'bali',
  'dubai',
  'cambodia',
  'villa',
  'condo',
  'house',
]

/** Rows for the /credits page, in site order. */
export const credits: readonly Credit[] = ORDER.map((key) => {
  const m: PhotoMeta = photoMeta[key]
  return {
    key,
    caption: m.caption,
    author: m.credit,
    license: m.license,
    licenseUrl: LICENSE_URL[m.license] ?? null,
    sourceUrl: m.sourceUrl,
    changes: 'Кадрирование и цветокоррекция',
    shareAlike: m.license.includes('BY-SA'),
    ...(NOTES[key] ? { note: NOTES[key] } : {}),
  }
})
