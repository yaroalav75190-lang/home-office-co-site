// Home page / (copy-home v1.0, 2 Nov 2026), ten blocks top to bottom. Facts the client had not
// given are set per docs/DEMO_DECISIONS.md for the promo version.
// Hrefs, photo keys, ids, figures and the order of rows stay in code (components/sections/home);
// lists keyed by id (verdicts, where, samples) follow the ids there. Page title and
// description: meta.home. Shared words: common.destinations, common.founder.

import { tpl } from '../format'

export const home = {
  /** Block 1: first screen. */
  hero: {
    /**
     * Two D1 display lines of the h1, the second indented (column 5 of 12 on desktop ≥1024 px,
     * where it reaches column 11, above the villa print). Each line must stay one line: the
     * translation of each must not be wider than the Russian one. Line 1 «Недвижимость»: 12
     * characters; line 2 «в Таиланде»: 10 characters (it has less room: it starts further right).
     */
    titleLines: ['Недвижимость', 'в Таиланде'] as [string, string],
    /** Lead under the title (136 characters, keep a similar length). Mentions paying from Russia: adapt. */
    lead: 'Агентство недвижимости на Пхукете. Квартиры и виллы в Таиланде, на Бали, в Дубае и Камбодже: подбор, документы, оплата из России, аренда',
    /** Primary button (one line, no wrap): keep it about as short as the Russian (16 characters). */
    cta: 'Подобрать объект',
    /** Caption under the villa photo; «Пример формата»: the photo shows a format, not a listing. */
    printCaption: 'Пример формата: вилла с бассейном',
    /** Caption under the panorama. */
    panoramaCaption: 'Западное побережье Пхукета',
  },

  /** Block 2: row of figures. The figures themselves (5+, 100+, 15, 4) are in code. */
  figures: {
    /** Hidden h2 for screen readers. */
    title: 'Home Office & Co в цифрах',
    /**
     * Unit (Lead, one short word, on the baseline of the figure) and the phrase under it. Each unit
     * follows its figure grammatically: experience «5+», clients «100+», reply «15», countries «4».
     */
    stats: {
      experience: {
        unit: 'лет',
        /** The opening year (2026) is a promo decision the client confirms before launch. */
        text: 'опыт наших специалистов на международных рынках. Само агентство открылось в 2026 году',
      },
      clients: { unit: 'клиентов', text: 'у наших специалистов за эти годы' },
      reply: { unit: 'минут', text: 'время ответа брокера на заявку в рабочие часы' },
      countries: { unit: 'страны', text: 'Таиланд, Индонезия (Бали), ОАЭ (Дубай) и Камбоджа' },
    },
  },

  /** Block 3: «Четыре побережья», one row per destination (names: common.destinations). */
  coasts: {
    /** «Четыре»: there are four rows. */
    title: 'Четыре побережья',
    lead: 'Работаем в четырёх странах, больше всего в Таиланде. Правила владения в каждой свои',
    /** Broker's verdict next to each destination, by destination id. */
    verdicts: {
      phuket: 'Главное направление: шесть районов от Лаяна до Чалонга. Ещё в Таиланде работаем в Паттайе',
      bali: 'Правила владения не такие, как в Таиланде. Объясняем их до выбора объекта',
      dubai: 'Покупка от установленной суммы даёт право на резидентскую визу ОАЭ',
      cambodia: 'Квартиры у моря. Права иностранца на жильё разбираем на консультации',
    },
    /** Caption under the property photo of the Phuket row; «Пример объекта»: not a listing. */
    houseCaption: 'Пример объекта: дом с бассейном',
    /** Line after the rows, then a link to the quiz. «4 вопроса»: the quiz has four questions. */
    after: 'Страну можно выбрать вместе с брокером',
    afterLink: 'Подобрать объект за 4 вопроса',
  },

  /**
   * Block 4: «Где жить, а где сдавать», the district scene. District names, verdicts, the «Кому
   * подходит» and «Что покупают» facts and photo captions come from the Phuket hub rows, so the
   * home page and /thailand/phuket never disagree.
   */
  districts: {
    title: 'Где жить, а где сдавать',
    lead: 'Шесть районов Пхукета с севера на юг. По каждому видно, кому он подходит и что в нём покупают',
    /** Screen-reader name of the island drawing. */
    mapLabel: 'Карта Пхукета, шесть районов с севера на юг',
    /** Screen-reader name of the list of district names that drives the scene. */
    navLabel: 'Районы Пхукета',
    /** Small labels of the three facts (tight: keep them to two or three words). */
    factLabels: { where: 'Где', forWhom: 'Кому подходит', buy: 'Что покупают' },
    /**
     * First word of the hub facts («Подходит тем, кто…», «Покупают виллы…»): under the labels above
     * the home page drops it and capitalizes the rest. Must equal the first word of the translated
     * hub facts; leave the string empty if the translation does not start with such a word.
     */
    hubVerbs: { forWhom: 'Подходит', buy: 'Покупают' },
    /** «Где»: position on the island, by district id (north to south). */
    where: {
      layan: 'Северо-запад острова, к северу от Банг Тао',
      'bang-tao': 'Северо-запад острова, район вокруг Лагуны',
      kamala: 'Запад острова, между Банг Тао и Патонгом',
      'karon-kata': 'Юго-запад острова, к югу от Патонга',
      'nai-harn-rawai': 'Южная оконечность острова, у мыса Пхромтхеп',
      chalong: 'Юго-восток острова, у залива Чалонг',
    },
    /** Link to a district page under its block. {name}: district name, «Банг Тао подробно». */
    more: tpl<'name'>('{name} подробно'),
    /** Link under the scene. */
    allLink: 'Все районы Пхукета',
  },

  /** Block 5: FAQ. */
  faq: {
    /** «Пять»: there are five questions. */
    title: 'Пять вопросов первого звонка',
    /** Questions and answers. Question 3 is about paying from Russia: adapt for the audience. */
    items: [
      {
        q: 'Может ли иностранец владеть недвижимостью в Таиланде?',
        a: 'Да. Квартиру в кондоминиуме иностранец оформляет в полную собственность, фрихолд. Но иностранцам в доме может принадлежать не больше 49 % площади квартир, поэтому остаток квоты проверяем до брони. Землю иностранец в собственность не покупает, виллу оформляют через аренду земли на 30 лет. Продление прописывают в договоре, и мы объясняем, насколько надёжен этот пункт в вашем.',
      },
      {
        q: 'Сколько стоит квадратный метр?',
        a: 'Единой цены нет. Метр зависит от района, расстояния до моря и стадии стройки, а у застройщиков цена растёт по этапам, поэтому прошлогодний прайс быстро устаревает. Вместо средней цифры пришлём от 3 до 5 проектов в вашем бюджете, у каждого указаны цена на сегодня, тип собственности и минусы. Подборку присылаем в течение 24 часов.',
      },
      {
        q: 'Как оплатить покупку из России?',
        a: 'Законными способами, которые работают сейчас. Квартиру оформят в собственность, если деньги придут в Таиланд из-за рубежа в валюте: банк выдаёт подтверждение перевода, без него право не зарегистрируют. Схем в обход ограничений не предлагаем. Способы оплаты обсуждаем на консультации: правила меняются, и брокер называет те, через которые агентство проводит платежи сейчас.',
      },
      {
        q: 'Какой район подходит для жизни, а какой для сдачи?',
        a: 'Зависит от цели и от того, сколько месяцев в году вы проводите на острове. Семье, которая живёт здесь круглый год, важны школы и дорога, для сдачи важнее пляж и спрос в сезон. Шесть районов Пхукета коротко описаны в блоке выше. Точный ответ под вашу задачу даст подбор: 4 вопроса, и брокер предложит районы и проекты.',
      },
      {
        q: 'Дадут ли визу, если купить недвижимость?',
        a: 'В Таиланде покупка сама по себе визу не даёт. Чтобы жить в стране подолгу, нужна отдельная программа долгосрочного проживания. В ОАЭ покупка недвижимости от установленной суммы даёт право на резидентскую визу. Пороги и условия меняются, поэтому ваш случай разбираем на консультации по правилам, которые действуют сейчас.',
      },
    ],
  },

  /** Block 6: «От звонка до ключей». */
  process: {
    title: 'От звонка до ключей',
    /** «Пять»: there are five steps. */
    lead: 'Пять этапов, один брокер на всём пути',
    /**
     * Five steps in order, no visible numbers: the order is carried by the when field, a short
     * opening phrase set in UI 500 on its own line (ends with a full stop).
     */
    steps: [
      {
        when: 'Сначала.',
        text: 'Уточняем задачу и бюджет. Каталога на сайте нет, потому что подборку собираем вручную: от 3 до 5 проектов и объяснение, почему остальные не подошли. Объекты показываем на месте или по видеосвязи.',
      },
      {
        when: 'До брони.',
        text: 'Проверяем документы на землю, разрешение на строительство, остаток иностранной квоты и то, как застройщик сдавал прошлые дома. Рискованный проект не предложим.',
      },
      {
        when: 'В день оплаты.',
        text: 'Деньги идут законным путём и приходят в Таиланд в валюте с банковским подтверждением. Без него квартиру не оформить в собственность.',
      },
      {
        when: 'При сдаче дома.',
        text: 'Проверяем квартиру по договору до подписания акта приёмки, недочёты записываем и передаём застройщику. Потом регистрация права и ключи.',
      },
      {
        when: 'После ключей.',
        text: 'Помогаем сдавать квартиру через партнёров по управлению и перепродать её, когда решите.',
      },
    ],
    /** Link to /services/deal. */
    link: 'Подробно о сопровождении',
    /** Photo captions; «Пример формата»: the photo shows a format, not a listing. */
    captions: {
      kata: 'Ката, западное побережье Пхукета',
      naiharn: 'Най Харн, юг Пхукета',
      condo: 'Пример формата: кондоминиум с общим бассейном',
    },
  },

  /** Block 7: «Мы сами инвестируем» (the founder; name and role: common.founder). */
  invest: {
    /** Hidden h2. */
    title: 'Мы сами инвестируем',
    /** The founder's quote, D3. Wording kept for the promo; the client confirms it before launch. */
    quote: 'Покупаем для себя там же, где советуем вам',
    /** Signature under the quote. {name}: the founder's first name. */
    author: tpl<'name'>('{name}, основатель Home Office & Co'),
    text: 'Команда покупает недвижимость для себя и вкладывается в совместные проекты с клиентами. В подборке у каждого проекта есть раздел с минусами, брокер пишет его сам.',
  },

  /**
   * Block 8: client reviews. PROMO SAMPLES, not real reviews: every one is shown with the
   * sampleLabel line and a city, never a name. Keep them labelled as samples in every language.
   */
  review: {
    /** Hidden h2. */
    title: 'Отзывы клиентов',
    /** Link to all reviews (not shown until /reviews exists). */
    allLabel: 'Все отзывы',
    /** Under every sample review: says it is an example. Never drop or soften it. */
    sampleLabel: 'Пример отзыва',
    /** Line under the city. {purchase}: the sample's purchase. */
    purchase: tpl<'purchase'>('Покупка: {purchase}'),
    /**
     * Sample reviews, by the district of the purchase (drawn on the island next to the first one;
     * the order is in code). quote: up to 25 words, no quotation marks. city: where the buyer is
     * from (Russian cities in the Russian version). place: caption under the island drawing.
     */
    samples: {
      'bang-tao': {
        quote:
          'Минусы каждого проекта брокер назвал сам, до показа. Два варианта отпали после проверки документов, из оставшихся выбрали квартиру у Лагуны',
        city: 'Красноярск',
        purchase: 'квартира в кондоминиуме, Банг Тао',
        place: 'Банг Тао на карте Пхукета',
      },
      'nai-harn-rawai': {
        quote:
          'Объект смотрели по видео, договор читали вместе с юристом. В Таиланд прилетели уже за ключами',
        city: 'Москва',
        purchase: 'вилла, Раваи и Най Харн',
        place: 'Раваи и Най Харн на карте Пхукета',
      },
      'karon-kata': {
        quote:
          'Ответили через 10 минут и ни разу не торопили. Зимой живём в квартире сами, остальное время её сдаёт управляющая компания',
        city: 'Новосибирск',
        purchase: 'квартира для зимовки, Ката и Карон',
        place: 'Ката и Карон на карте Пхукета',
      },
    },
  },

  /**
   * Block 9: investor guide (the form has its words in the forms dictionary). Written for buyers
   * from Russia: adapt.
   */
  guide: {
    /**
     * h2 at D2 in seven of twelve columns and the cover title at D3: the longest word must fit one
     * line (Russian «приукрашивания», 14 characters).
     */
    title: 'Пхукет без приукрашивания',
    text: 'Гид инвестора для покупателей из России, 2026/27. Восемь глав на 20 минут чтения: что может купить иностранец, как законно оплатить покупку, где жить и где сдавать, чего ждать от аренды.',
    /** Small line on the cover, under the title (the cover column is 16 characters wide; it wraps). */
    coverSubtitle: 'Гид инвестора для покупателей из России',
    /** Edition on the cover. */
    coverYear: '2026/27',
  },

  /** Block 10: closing line (the reply time and the contacts are added by the component). */
  closing: {
    /** Start of the closing sentence; «, и брокер ответит до 16:55» follows (common.reply.closing). */
    title: 'Расскажите, что ищете',
    note: 'Встречаемся лично на Пхукете, на объектах и в деловых центрах. Если вы в другой стране, покажем объект по видеосвязи',
  },

  /** JSON-LD of the organisation and the website (not shown on the page). */
  jsonLd: {
    description: 'Международное агентство недвижимости: Таиланд (Пхукет, Паттайя), Бали, Дубай, Камбоджа.',
    /** Countries served, full official names. */
    areaServed: ['Таиланд', 'Индонезия', 'Объединённые Арабские Эмираты', 'Камбоджа'],
    /**
     * The brand written in this language's script, for search. «Home Office and Co» is always added
     * in code; leave the list empty for a language written in Latin script.
     */
    alternateNames: ['Хоум Офис энд Ко'],
  },
}

export type HomeDict = typeof home
