// Phuket districts: the six rows of the hub (/thailand/phuket, copy-phuket §3, also shown in the
// home page district scene) and the district pages (/thailand/phuket/[district], copy-bang-tao).
// Keyed by district id. Ids, slugs, photos, coordinates, hrefs and the `ready` flag stay in
// src/components/sections/phuket/districts.ts. The broker checks the district texts before launch.
//
// Legal facts the translation keeps: a condominium flat in ownership within the 49 % foreign quota,
// a villa through a 30-year land lease. Distances and times (7 km, 25 minutes…) are facts too.

export const districts = {
  /**
   * Hub rows, north to south, by district id. `name`: as the hub writes it («Ката и Карон», «Раваи и
   * Най Харн»), a D2 heading. `facts`: who it suits («Подходит тем, кто…»), then what is bought
   * («Покупают…»), in this order. `photoCaption`: under the row's 3:2 photo (a neighbouring beach
   * says whose neighbour it is).
   */
  districts: {
    layan: {
      name: 'Лаян',
      verdict: 'Тихий пляж на северном краю бухты Банг Тао, рядом с национальным парком Сиринат',
      facts: [
        'Подходит тем, кто ищет тишину и природу рядом с домом',
        'Покупают виллы и квартиры, в том числе в брендированных резиденциях',
      ] as [string, string],
      photoCaption: 'Пляж Банана, к северу от Лаяна',
    },
    'bang-tao': {
      name: 'Банг Тао',
      verdict: 'Пляж около 7 км на северо-западе и Лагуна с шестью отелями и полем для гольфа',
      facts: [
        'Подходит тем, кому нужны тихий пляж и Лагуна рядом',
        'Покупают квартиры в кондоминиумах и виллы, в том числе в Лагуне',
      ] as [string, string],
      photoCaption: 'Банг Тао, западное побережье Пхукета',
    },
    kamala: {
      name: 'Камала',
      verdict: 'Залив с пляжем около 3 км между Суриным и Патонгом, вокруг него посёлок',
      facts: [
        'Подходит тем, кому нужен спокойный пляж недалеко от Патонга',
        'Покупают квартиры в кондоминиумах и виллы на склонах холмов',
      ] as [string, string],
      photoCaption: 'Камала, западное побережье Пхукета',
    },
    'karon-kata': {
      name: 'Ката и Карон',
      verdict: 'Пляжи Ката и Карон (Kata, Karon) на юго-западе, вокруг отели, кафе и магазины',
      facts: [
        'Подходит тем, кто хочет жить в курортном районе у пляжа',
        'Покупают квартиры в кондоминиумах',
      ] as [string, string],
      photoCaption: 'Ката, западное побережье Пхукета',
    },
    'nai-harn-rawai': {
      name: 'Раваи и Най Харн',
      verdict: 'Юг острова: из Раваи уходят лодки на ближние острова, в Най Харне пляж у озера',
      facts: [
        'Подходит тем, кто живёт на острове подолгу',
        'Покупают квартиры в кондоминиумах и виллы',
      ] as [string, string],
      photoCaption: 'Най Харн, юг Пхукета',
    },
    chalong: {
      name: 'Чалонг',
      verdict: 'Залив на юго-востоке с якорной стоянкой для яхт и пирсом для лодок на острова',
      facts: [
        'Подходит тем, кто ходит на яхте или часто ездит на острова',
        'Покупают дома и виллы в жилых посёлках',
      ] as [string, string],
      photoCaption: 'Большой Будда на холме Наккерд, над Чалонгом и Катой',
    },
  },

  /**
   * First line of a district page h1 (D1); the second line is the page's `namePrep` («в Банг Тао»).
   * From 1024 px each line is one unbreakable display line (whitespace-nowrap): not wider than the
   * Russian (12 characters).
   */
  heroTitle: 'Недвижимость',

  /** District pages, by district id. Only districts with a page in code have copy here. */
  pages: {
    'bang-tao': {
      /**
       * Second line of the h1: «в Банг Тао». Preposition and case are set by hand, never generated
       * (seo-brief §4.3). One unbreakable D1 line from 1024 px: not wider than the Russian (10 characters).
       */
      namePrep: 'в Банг Тао',
      hero: {
        lead: 'Район на северо-западе Пхукета, вокруг Лагуны. Рассказываем, кому он подходит, а кому нет',
        /** Button to the quiz with Phuket and this district preselected. */
        cta: 'Подобрать в Банг Тао',
        /** Screen-reader name of the large locator. */
        mapLabel: 'Банг Тао на карте Пхукета',
        /** Under the 21:9 photo «в край» under the hero. */
        panoramaCaption: 'Пляж Банана, Чонг Тале, 3 км к северу от Банг Тао',
      },
      /** «Где Банг Тао и что рядом» (wireframe «Лоция района»). */
      facts: {
        title: 'Где Банг Тао и что рядом',
        paragraphs: [
          'Из районов, где мы работаем, ближе всего Лаян к северу и Камала к югу.',
          'Большую часть бухты занимает Лагуна, комплекс на месте бывших оловянных рудников. На территории больше 400 гектаров шесть отелей, поле для гольфа на 18 лунок и жилые проекты, от квартир до вилл.',
          'До аэропорта около 25 минут на машине, до Патонга около 20. Внутри Лагуны отели и магазины связаны шаттлами и лодкой через лагуну.',
        ],
        /**
         * Label over value, seven in this order: the first four are short and share a row in pairs,
         * the last three (prices, rent, title) take the full width.
         */
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
            /** Legal facts: the 49 % quota and the 30-year land lease. */
            value: 'Квартира в кондоминиуме в собственность в пределах квоты 49 %. Вилла через аренду земли на 30 лет',
          },
        ],
      },
      life: {
        title: 'Жизнь в Банг Тао',
        text: 'Повседневная жизнь собрана вокруг Лагуны. При отелях работают рестораны и спа, рядом поле для гольфа. На пляже есть простые кафе, там дешевле, чем в отелях. Ночной жизни, как в Патонге, здесь нет, до него около 20 минут на машине.',
        /** The author asks for his name next to this photo: keep «Фото: Anton Zelenov» (credit, not text). */
        portraitCaption: 'Закат на Банг Тао, западное побережье Пхукета. Фото: Anton Zelenov',
        squareCaption: 'Пример формата: вилла с бассейном',
      },
      /** «Без приукрашивания»: minuses on every district page. */
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
        guide: 'Аренда без иллюзий: глава 5 гида инвестора',
      },
      /** «Проекты в Банг Тао»: project cards, NOT RENDERED since QA round 1 §4 («Форматы» instead). */
      projects: {
        title: 'Проекты в Банг Тао',
        lead: 'Два проекта из текущей подборки. Остальные пришлём списком с плюсами и минусами',
        caption: 'Банг Тао, западное побережье Пхукета',
      },
      /** «Соседи по берегу»: one line per neighbour, by district id (the list and order are set in code). */
      neighbours: {
        title: 'Соседи по берегу',
        items: {
          layan: {
            side: 'К северу от Банг Тао',
            text: 'Тише и зеленее, чем Банг Тао, кафе и магазинов меньше. Здесь строят виллы и брендированные резиденции.',
          },
          kamala: {
            side: 'К югу от Банг Тао',
            text: 'Банг Тао или Камала: Камала компактнее, пляж около 3 км, до Патонга около 8 км. На склонах холмов вокруг залива стоят виллы.',
          },
        },
        /** Closes the block while the neighbours have no pages of their own (copy-bang-tao §6). */
        fallback: 'Все районы Пхукета',
      },
      closing: {
        /** Start of the closing sentence; the site appends the reply part («, и брокер ответит до 16:55»). */
        title: 'Расскажите, что ищете в Банг Тао',
        cta: 'Подобрать в Банг Тао',
        /** Prefilled Telegram message (copy-bang-tao §7). Not used yet: the shared closing line has no prop for it. */
        telegramText: 'Здравствуйте, интересует Банг Тао',
      },
    },
  },
}

export type DistrictsDict = typeof districts
