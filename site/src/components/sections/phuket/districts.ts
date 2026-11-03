// Phuket districts: the six rows of the hub (/thailand/phuket, copy-phuket §3) and the district
// page template (/thailand/phuket/[district], copy-bang-tao). Texts are final copy, verbatim; the
// broker checks the district descriptions before launch (DEMO_DECISIONS). When Payload arrives, this file
// maps 1:1 to the district collection (seo-brief §4.3, «Шаблон района: поля CMS»).

import type { DistrictId, PlaceId } from '@/components/coast'
import type { PhotoKey, PhotoRatio, Ratio } from '@/lib/photos'

/** Photos that have every crop in `R`, e.g. `PhotoHaving<'21x9' | '3x2'>`. */
export type PhotoHaving<R extends Ratio> = {
  [K in PhotoKey]: [R] extends [PhotoRatio<K>] ? K : never
}[PhotoKey]

export type DistrictPhoto<R extends Ratio> = {
  key: PhotoHaving<R>
  /** «Место, побережье» under the photo. */
  caption: string
}

export type DistrictPage = {
  /**
   * The broker has filled blocks 2–4 with facts about this district. Until then the page is
   * `noindex, follow` and has no canonical: seo-brief §4.3 forbids publishing a district page
   * without unique facts, BUILD_PLAN decision 7 keeps Bang Tao out of production until then.
   */
  ready: boolean
  meta: { title: string; description: string }
  /** «в Банг Тао»: preposition and case are set by hand, never generated (seo-brief §4.3). */
  namePrep: string
  nameLatin: string
  /** Locator dot for photo captions on the page (a district without a point gets none). */
  place: PlaceId | null
  /** Beach centre from OpenStreetMap (scripts/coast/regions.mjs), for Place.geo. */
  geo: { latitude: number; longitude: number }
  hero: {
    lead: string
    cta: string
    /** Screen-reader name of the large locator. */
    mapLabel: string
    panorama: DistrictPhoto<'21x9' | '3x2'>
  }
  /** «Где Банг Тао и что рядом» (wireframe «Лоция района»). */
  facts: {
    title: string
    paragraphs: string[]
    items: { term: string; value: string }[]
  }
  life: {
    title: string
    text: string
    portrait: DistrictPhoto<'4x5'>
    square: DistrictPhoto<'1x1'>
  }
  honest: {
    title: string
    lead: string
    pros: { title: string; items: string[] }
    cons: { title: string; items: string[] }
    guide: { label: string; href: string }
  }
  projects: { title: string; lead: string; caption: string }
  neighbours: {
    title: string
    items: { id: DistrictId; side: string; text: string }[]
    /** Where neighbour links go while those district pages do not exist (copy-bang-tao §6). */
    fallback: { label: string; href: string }
  }
  closing: {
    /** Start of the closing sentence; ClosingLine appends the reply part. */
    title: string
    cta: string
    /** Prefilled Telegram message (copy-bang-tao §7). See the note in the page about ClosingLine. */
    telegramText: string
  }
}

export type District = {
  id: DistrictId
  /** URL segment, seo-brief §3: /thailand/phuket/{slug}. Also the quiz `district` parameter. */
  slug: string
  /** Name as the hub writes it (copy-phuket §3: «Ката и Карон», «Раваи и Най Харн»). */
  name: string
  verdict: string
  facts: readonly [string, string]
  /** 3:2 photo for the row; rows without one get the 160 px locator (art-direction §4). */
  photo?: DistrictPhoto<'3x2'>
  /** Full district page. Only districts with a page get a route and a link from the hub. */
  page?: DistrictPage
}

const bangTaoPage: DistrictPage = {
  ready: false,
  meta: {
    title: 'Недвижимость в Банг Тао: квартиры и виллы на Пхукете',
    description:
      'Недвижимость в Банг Тао на Пхукете: квартиры и виллы рядом с Лагуной, кому подходит район, аренда по сезонам, плюсы и минусы без приукрашивания.',
  },
  namePrep: 'в Банг Тао',
  nameLatin: 'Bang Tao',
  place: 'bang-tao',
  geo: { latitude: 8.0083, longitude: 98.2886 },
  hero: {
    lead: 'Район на северо-западе Пхукета, вокруг Лагуны. Рассказываем, кому он подходит, а кому нет',
    cta: 'Подобрать в Банг Тао',
    mapLabel: 'Банг Тао на карте Пхукета',
    panorama: { key: 'banana', caption: 'Пляж Банана, Чонг Тале, 3 км к северу от Банг Тао' },
  },
  facts: {
    title: 'Где Банг Тао и что рядом',
    paragraphs: [
      'Из районов, где мы работаем, ближе всего Лаян к северу и Камала к югу.',
      'Большую часть бухты занимает Лагуна, комплекс на месте бывших оловянных рудников. На территории больше 400 гектаров шесть отелей, поле для гольфа на 18 лунок и жилые проекты, от квартир до вилл.',
      'До аэропорта около 25 минут на машине, до Патонга около 20. Внутри Лагуны отели и магазины связаны шаттлами и лодкой через лагуну.',
    ],
    items: [
      { term: 'До аэропорта', value: 'Около 25 минут на машине' },
      { term: 'Пляж', value: 'Около 7 км вдоль бухты. Купаться лучше в сухой сезон' },
      { term: 'Кому подходит', value: 'Тем, кому нужны тихий пляж и Лагуна рядом' },
      {
        term: 'Что покупают',
        value: 'Квартиры в кондоминиумах и виллы, в том числе в Лагуне',
      },
      {
        term: 'Цены',
        value:
          'Зависят от класса дома, расстояния до моря и стадии стройки. Актуальные цифры пришлём в подборке, точную цену по объекту подтвердит брокер',
      },
      {
        term: 'Аренда',
        value:
          'Туристический сезон длится с ноября по апрель, с мая по октябрь идёт муссон. Гарантированный доход не обещаем: считаем загрузку по сезонам, расходы на управление и налоги',
      },
      {
        term: 'Право собственности',
        value: 'Квартира в кондоминиуме в собственность в пределах квоты 49 %. Вилла через аренду земли на 30 лет',
      },
    ],
  },
  life: {
    title: 'Жизнь в Банг Тао',
    text: 'Повседневная жизнь собрана вокруг Лагуны. При отелях работают рестораны и спа, рядом поле для гольфа. На пляже есть простые кафе, там дешевле, чем в отелях. Ночной жизни, как в Патонге, здесь нет, до него около 20 минут на машине.',
    // The author asks for «Photo: Anton Zelenov» next to this photo (lib/photos NOTES).
    portrait: { key: 'sunset', caption: 'Закат на Банг Тао, западное побережье Пхукета. Фото: Anton Zelenov' },
    square: { key: 'villa', caption: 'Пример формата: вилла с бассейном' },
  },
  honest: {
    title: 'Без приукрашивания',
    lead: 'Минусы есть у каждого района. Называем их до показа',
    pros: {
      title: 'Почему выбирают Банг Тао',
      items: [
        'Длинный тихий пляж, около 7 км',
        'Лагуна с ресторанами, спа и полем для гольфа в самом районе',
        'Аэропорт в 25 минутах на машине. Из Карона на юго-западе дорога занимает почти час',
      ],
    },
    cons: {
      title: 'О чём стоит знать',
      items: [
        'Район активно строится. Проверяем, что появится рядом с вашим проектом и сколько похожих квартир уже сдаётся',
        'В домах, где много покупателей-иностранцев, квота 49 % может закончиться. Остаток квоты в конкретном доме проверяем до брони',
        'С мая по октябрь у западного побережья сильные течения. Купаться можно не каждый день, следите за флагами на пляже',
        'Без своей машины или байка неудобно: такси в Лагуне мало, поездки дорогие',
      ],
    },
    guide: { label: 'Аренда без иллюзий: глава 5 гида инвестора', href: '/#gid' },
  },
  projects: {
    title: 'Проекты в Банг Тао',
    lead: 'Два проекта из текущей подборки. Остальные пришлём списком с плюсами и минусами',
    caption: 'Банг Тао, западное побережье Пхукета',
  },
  neighbours: {
    title: 'Соседи по берегу',
    items: [
      {
        id: 'layan',
        side: 'К северу от Банг Тао',
        text: 'Тише и зеленее, чем Банг Тао, кафе и магазинов меньше. Здесь строят виллы и брендированные резиденции.',
      },
      {
        id: 'kamala',
        side: 'К югу от Банг Тао',
        text: 'Банг Тао или Камала: Камала компактнее, пляж около 3 км, до Патонга около 8 км. На склонах холмов вокруг залива стоят виллы.',
      },
    ],
    fallback: { label: 'Все районы Пхукета', href: '/thailand/phuket#rajony' },
  },
  closing: {
    title: 'Расскажите, что ищете в Банг Тао',
    cta: 'Подобрать в Банг Тао',
    telegramText: 'Здравствуйте, интересует Банг Тао',
  },
}

/** The client's six districts, north to south (art-direction §2). */
export const districts: readonly District[] = [
  {
    id: 'layan',
    slug: 'layan',
    name: 'Лаян',
    verdict: 'Тихий пляж на северном краю бухты Банг Тао, рядом с национальным парком Сиринат',
    facts: [
      'Подходит тем, кто ищет тишину и природу рядом с домом',
      'Покупают виллы и квартиры, в том числе в брендированных резиденциях',
    ],
  },
  {
    id: 'bang-tao',
    slug: 'bang-tao',
    name: 'Банг Тао',
    verdict: 'Пляж около 7 км на северо-западе и Лагуна с шестью отелями и полем для гольфа',
    facts: [
      'Подходит тем, кому нужны тихий пляж и Лагуна рядом',
      'Покупают квартиры в кондоминиумах и виллы, в том числе в Лагуне',
    ],
    photo: { key: 'bangtao', caption: 'Банг Тао, западное побережье Пхукета' },
    page: bangTaoPage,
  },
  {
    id: 'kamala',
    slug: 'kamala',
    name: 'Камала',
    verdict: 'Залив с пляжем около 3 км между Суриным и Патонгом, вокруг него посёлок',
    facts: [
      'Подходит тем, кому нужен спокойный пляж недалеко от Патонга',
      'Покупают квартиры в кондоминиумах и виллы на склонах холмов',
    ],
  },
  {
    id: 'karon-kata',
    slug: 'kata-karon',
    name: 'Ката и Карон',
    verdict: 'Пляжи Ката и Карон (Kata, Karon) на юго-западе, вокруг отели, кафе и магазины',
    facts: ['Подходит тем, кто хочет жить в курортном районе у пляжа', 'Покупают квартиры в кондоминиумах'],
    photo: { key: 'kata', caption: 'Ката, западное побережье Пхукета' },
  },
  {
    id: 'nai-harn-rawai',
    slug: 'rawai-nai-harn',
    name: 'Раваи и Най Харн',
    verdict: 'Юг острова: из Раваи уходят лодки на ближние острова, в Най Харне пляж у озера',
    facts: ['Подходит тем, кто живёт на острове подолгу', 'Покупают квартиры в кондоминиумах и виллы'],
    photo: { key: 'naiharn', caption: 'Най Харн, юг Пхукета' },
  },
  {
    id: 'chalong',
    slug: 'chalong',
    name: 'Чалонг',
    verdict: 'Залив на юго-востоке с якорной стоянкой для яхт и пирсом для лодок на острова',
    facts: ['Подходит тем, кто ходит на яхте или часто ездит на острова', 'Покупают дома и виллы в жилых посёлках'],
  },
]

export const districtHref = (d: District) => `/thailand/phuket/${d.slug}`

/** Quiz with Phuket and this district pre-selected (copy-global §3). */
export const districtQuizHref = (d: District) => `/podbor?country=phuket&district=${d.slug}`

export function districtBySlug(slug: string): (District & { page: DistrictPage }) | undefined {
  const d = districts.find((item) => item.slug === slug)
  return d?.page ? (d as District & { page: DistrictPage }) : undefined
}

export function districtById(id: DistrictId): District | undefined {
  return districts.find((item) => item.id === id)
}

/** Slugs that have a full page: the only ones `generateStaticParams` returns. */
export const districtPageSlugs = districts.filter((d) => d.page).map((d) => d.slug)
