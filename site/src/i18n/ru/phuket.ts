// /thailand/phuket, the Phuket hub (docs/content/copy-phuket.md), blocks in page order. Hrefs,
// anchors, photos and the order of keyed blocks stay in src/components/sections/phuket/content.ts;
// the six district rows and the district pages live in ./districts.ts.
//
// Legal facts the translation keeps as they are: a condominium flat is full ownership (freehold,
// «фрихолд») within the 49 % foreign quota of the building's floor area; land under a villa or a
// house is leased for 30 years (leasehold), the extension is written into the contract; the money
// comes to Thailand from abroad in foreign currency with a bank confirmation.

import { tpl } from '../format'

export const phuket = {
  hero: {
    /**
     * h1, D1, two lines. From 1024 px each line is one unbreakable display line (whitespace-nowrap):
     * a translated line must not be wider than the Russian one (12 and 10 characters).
     */
    titleLines: ['Недвижимость', 'на Пхукете'] as [string, string],
    lead: 'Остров, где район решает больше, чем метраж. Подбираем квартиры и виллы на Пхукете от застройщиков и на вторичном рынке',
    /** Button to the quiz with Phuket preselected. */
    cta: 'Подобрать на Пхукете',
    /** Screen-reader name of the island drawing. */
    mapLabel: 'Карта Пхукета, шесть районов, где мы работаем',
    /** Screen-reader name of the list of district labels on the drawing. */
    mapNavLabel: 'Районы на карте',
    /**
     * District labels on the island drawing (copy-phuket §1), by district id. Each is one line beside
     * the coast on the water side: keep them as short as the Russian (the longest, «Раваи и Най Харн»,
     * is 16 characters).
     */
    mapNames: {
      layan: 'Лаян',
      'bang-tao': 'Банг Тао',
      kamala: 'Камала',
      'karon-kata': 'Ката и Карон',
      'nai-harn-rawai': 'Раваи и Най Харн',
      chalong: 'Чалонг',
    },
  },

  /**
   * «Что знать до покупки»: five lines, each a big D2 figure (`value`) with its unit beside it in Lead
   * on one baseline (`unit`: «часа» 4, «месяцев» 7, «лет» 3, «часов» 5 characters; keep units that
   * short, they agree with the figure), then the phrase. The figures are facts: keep the numbers.
   * Keyed by stable ids; the order of the lines is set in code (content.ts `phuketPage.know.order`).
   */
  know: {
    title: 'Что знать до покупки',
    items: {
      /** Russia-specific: the time difference with Moscow (Phuket is UTC+7). */
      timeDifference: {
        value: '+4',
        unit: 'часа',
        text: 'разница с Москвой. Пхукет живёт по UTC+7, как Красноярск и Новосибирск',
      },
      winterSeason: {
        value: '5',
        unit: 'месяцев',
        text: 'с ноября по март на остров приезжают зимовать. В остальные месяцы жильё можно сдавать',
      },
      /** Legal fact: the 49 % foreign quota. No unit: the figure carries «%». */
      foreignQuota: {
        value: '49 %',
        unit: '',
        text: 'доля площади квартир в доме, которую можно оформить на иностранцев в собственность',
      },
      /** Legal fact: the 30-year land lease (leasehold). */
      landLease: {
        value: '30',
        unit: 'лет',
        text: 'срок аренды земли под виллой для иностранца. Продление прописывают в договоре',
      },
      /** Russia-specific: the direct Aeroflot flight from Moscow (Sheremetyevo) and its timetable. */
      flight: {
        value: '10',
        unit: 'часов',
        text: 'прямой рейс из Москвы. По расписанию Аэрофлота из Шереметьево 9 ч 40 мин, обратно 10 ч 15 мин',
      },
    },
    /** Placeholder note for a figure the client has not given yet: renders «[заглушка: цифра]». */
    figureStub: 'цифра',
    photoCaption: 'Ката, западное побережье Пхукета',
  },

  /** «Шесть районов Пхукета»: the rows themselves are in ./districts.ts. */
  districtList: {
    title: 'Шесть районов Пхукета',
    lead: 'Для жизни и для сдачи подходят разные районы. По каждому указано, кому он подходит и что в нём покупают',
    /** Link to the quiz under the list. */
    quiz: 'Подобрать район за 3 вопроса',
  },

  /**
   * «Право собственности». Legal terms are facts: freehold within the 49 % quota for a condominium
   * flat, a 30-year land lease for a villa. Keyed by kind of property; the order is set in code.
   */
  ownership: {
    title: 'Право собственности',
    parts: {
      condo: {
        title: 'Кондоминиум: полная собственность в пределах квоты',
        text: 'Квартиру в кондоминиуме иностранец оформляет на себя в полную собственность, фрихолд. Иностранцам в одном доме может принадлежать не больше 49 % площади квартир, поэтому остаток квоты в конкретном доме проверяем до брони. Деньги на покупку должны прийти в Таиланд из-за рубежа в валюте, с банковским подтверждением.',
      },
      villa: {
        title: 'Вилла и земля: долгосрочная аренда',
        text: 'Землю иностранец в собственность не покупает. Виллу оформляют через аренду земли на 30 лет, продление прописывают в договоре. Насколько надёжен пункт о продлении именно в вашем договоре, объясняем до брони вместе с юристом.',
      },
    },
    /**
     * Shown only once a partner lawyer has really checked the wording (copy-phuket §4).
     * {name}: the lawyer's name, set in code.
     */
    checkedBy: tpl<'name'>('Формулировки проверил {name}'),
    guide: 'Подробнее в гиде инвестора, глава 1',
  },

  /**
   * «Форматы, с которыми работаем» (QA round 1 §4), on the hub and the district pages: types of
   * property instead of project cards. Cards keyed by format id (photos and crops: content.ts).
   * `note` is the 24-hour line; `cta` the quiz link after the cards.
   */
  formats: {
    title: 'Форматы, с которыми работаем',
    lead: 'Чем отличаются форматы и кому какой подходит. Проекты под ваш бюджет подберёт брокер',
    note: 'Подборку проектов пришлём за 24 часа',
    cta: 'Получить подборку',
    /** Labels of the two Small facts on every card. */
    ownershipLabel: 'Право собственности',
    suitsLabel: 'Кому подходит',
    items: {
      condo: {
        title: 'Апартаменты в кондоминиуме',
        text: 'Квартира в доме с общим бассейном, охраной и управляющей компанией. Взносы на обслуживание дома платят все собственники.',
        /** Legal fact: freehold within the 49 % quota. */
        ownership: 'Полная собственность на ваше имя, фрихолд, в пределах иностранной квоты 49 % площади дома',
        suits: 'Тем, кто сдаёт жильё через управляющую компанию или приезжает на зиму',
        /** Under the photo; «Пример формата» says the photo shows a kind of property, not our project. */
        caption: 'Пример формата: кондоминиум с бассейном',
      },
      villa: {
        title: 'Вилла с бассейном',
        text: 'Отдельный дом со своим бассейном и участком. Виллы строят поштучно или целыми посёлками с общей охраной.',
        /** Legal fact: the 30-year land lease. */
        ownership: 'Землю иностранец берёт в аренду на 30 лет, продление прописывают в договоре. Надёжность этого пункта проверяем с юристом до брони',
        suits: 'Семьям, которые зимуют на острове, и тем, кто сдаёт дом целиком',
        caption: 'Пример формата: вилла с бассейном',
      },
      house: {
        title: 'Таунхаус или дом для жизни',
        text: 'В таунхаусе у соседних домов общие стены. Отдельный дом стоит на своём участке в жилом посёлке.',
        /** Legal fact: the 30-year land lease. */
        ownership: 'Как у виллы: аренда земли на 30 лет, продление прописывают в договоре',
        suits: 'Тем, кто переезжает на Пхукет надолго и живёт здесь круглый год',
        caption: 'Пример формата: дом для жизни',
      },
    },
  },

  /** Quiz link label: project cards, and the «Форматы» link when a page passes no label. */
  requestCta: 'Запросить подборку',

  /**
   * «С чем работаем сейчас»: project cards. NOT RENDERED since QA round 1 §4 («Форматы» shows
   * instead); kept for the real project cards. The `…Stub` words render inside «[заглушка: …]».
   */
  projects: {
    title: 'С чем работаем сейчас',
    lead: 'Четыре проекта из текущих подборок. Полный список с плюсами и минусами пришлём в мессенджер',
    /** Line under the price. */
    place: 'Пхукет',
    photoStub: 'фото проекта с разрешения застройщика',
    nameStub: 'название проекта',
    typeStub: 'тип объекта',
    /** Between the two stubs: «[тип объекта], сдача [квартал и год]». */
    handover: 'сдача',
    handoverStub: 'квартал и год',
    price: 'Цена по запросу',
  },

  pattaya: {
    title: 'Паттайя, если нужен город у моря',
    /** Legal fact: the 49 % quota. */
    text: 'Те же тайские правила: квартира в собственность в пределах квоты 49 %. Цены и спрос на аренду другие, сравним их с Пхукетом под ваш бюджет.',
    /** Link to the quiz with Pattaya preselected (until a Pattaya page exists). */
    link: 'Подобрать в Паттайе',
    caption: 'Паттайя, побережье Сиамского залива',
  },

  faq: {
    title: 'Вопросы о покупке на Пхукете',
    /**
     * Questions and answers, in this order. Legal facts: the 49 % quota, the 30-year lease, no visa
     * from buying property. The third question («из России») is Russia-specific.
     */
    items: [
      {
        q: 'Может ли иностранец купить квартиру на Пхукете в собственность?',
        a: 'Да, если это квартира в кондоминиуме и иностранная квота в доме не выбрана: иностранцам может принадлежать до 49 % площади квартир. Право оформляют на ваше имя. С виллой схема другая, землю иностранец берёт в аренду на 30 лет. Подробности в блоке «Право собственности» выше.',
      },
      {
        q: 'Сколько стоит недвижимость на Пхукете?',
        a: 'Цена зависит от района, расстояния до моря, класса дома и стадии стройки. У застройщиков она растёт по этапам стройки, поэтому прошлогодний прайс быстро устаревает. Подборку с ценами на сегодня пришлём в течение 24 часов после подбора, точную цену по объекту подтвердит брокер.',
      },
      {
        q: 'Как оплатить квартиру на Пхукете из России?',
        a: 'Только законными способами, которые работают сейчас. Схем в обход ограничений не предлагаем. Строящийся дом обычно оплачивают частями по графику застройщика, и каждый платёж идёт из-за рубежа в валюте с банковским подтверждением. Какими способами агентство сейчас проводит платежи, брокер расскажет на консультации.',
      },
      {
        q: 'В каком районе Пхукета жить, а в каком покупать под сдачу?',
        a: 'Зависит от сценария: живёте зиму и сдаёте летом, сдаёте круглый год или переезжаете. Для каждого сценария подходят разные районы. Сравнение шести районов есть выше на странице. Если сомневаетесь между двумя, брокер покажет, сколько похожих квартир уже сдаётся рядом с каждым проектом.',
      },
      {
        q: 'Получу ли визу, если куплю квартиру на Пхукете?',
        a: 'Нет. В Таиланде покупка недвижимости сама по себе визу не даёт. Чтобы жить на острове подолгу, нужна отдельная программа долгосрочного проживания. Условия таких программ меняются, поэтому ваш случай разбираем на консультации по правилам, которые действуют сейчас.',
      },
      {
        q: 'Стоит ли верить гарантированной доходности?',
        a: 'Гарантий доходности мы не даём. Гарантия от застройщика обычно уже заложена в цену квартиры. Мы считаем реальную загрузку по сезонам, расходы на управление и налоги и показываем расчёт по конкретному объекту. Расчёт иллюстративный и не является индивидуальной инвестиционной рекомендацией.',
      },
      {
        q: 'Не перегрет ли рынок Пхукета?',
        a: 'Рынок неоднороден: в части районов новых квартир больше, чем арендаторов. Назовём такие районы и покажем, сколько похожих квартир уже сдаётся рядом с проектом. У каждого проекта в подборке есть раздел с минусами.',
      },
    ],
  },

  closing: {
    /** Start of the closing sentence; the site appends the reply part («, и брокер ответит до 16:55»). */
    title: 'Расскажите, что ищете на Пхукете',
    cta: 'Подобрать на Пхукете',
  },

  /** schema.org names in the JSON-LD of the hub and the district pages (not shown on the page). */
  place: {
    name: 'Пхукет',
    country: 'Таиланд',
  },
}

export type PhuketDict = typeof phuket
