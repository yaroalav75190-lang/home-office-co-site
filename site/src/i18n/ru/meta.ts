// Page titles and descriptions (seo-brief §4): <title>, meta description, Open Graph and JSON-LD names.
// Titles marked «absolute» skip the « | Home Office & Co» template; keep them under 60 characters.

export const meta = {
  site: {
    /** Default description of the root layout; uses only facts from the brief. Pages set their own. */
    description:
      'Агентство недвижимости Home Office & Co: квартиры и виллы на Пхукете, в Паттайе, на Бали, в Дубае и Камбодже. Подбор, проверка документов, сопровождение сделки.',
  },
  /** Absolute title. */
  home: {
    title: 'Агентство недвижимости на Пхукете | Home Office & Co',
    description:
      'Агентство недвижимости на Пхукете: квартиры и виллы в Таиланде, на Бали, в Дубае и Камбодже. Подбор, проверка документов, сделка. Ответ за 15 минут.',
  },
  /** Absolute title. */
  phuket: {
    title: 'Недвижимость на Пхукете: купить квартиру или виллу',
    description:
      'Квартиры и виллы на Пхукете от застройщиков и на вторичном рынке: шесть районов для жизни и аренды, собственность для иностранцев, сделка с брокером.',
  },
  /** District pages, by district id. Absolute titles. */
  districts: {
    'bang-tao': {
      title: 'Недвижимость в Банг Тао: квартиры и виллы на Пхукете',
      description:
        'Недвижимость в Банг Тао на Пхукете: квартиры и виллы рядом с Лагуной, кому подходит район, аренда по сезонам, плюсы и минусы без приукрашивания.',
    },
  },
  /** Absolute title. */
  deal: {
    title: 'Сопровождение покупки недвижимости в Таиланде',
    description:
      'Сделка с недвижимостью в Таиланде от выбора до ключей: проверка застройщика и документов, договор, оплата, регистрация, затем сдача в аренду или перепродажа.',
  },
  /** Absolute title. */
  podbor: {
    title: 'Подбор недвижимости: Пхукет, Паттайя, Бали, Дубай',
    description:
      'Четыре вопроса: страна, цель, бюджет и срок. Брокер ответит в выбранный мессенджер за 15 минут и пришлёт от 3 до 5 проектов с ценой и минусами.',
  },
  /** Absolute title. */
  contacts: {
    title: 'Контакты Home Office & Co: консультация и просмотр',
    description:
      'Телефон, Telegram и почта Home Office & Co. Запишитесь на онлайн-консультацию или на просмотр объекта на Пхукете: выберите дату, время по Пхукету и формат.',
  },
  /** Title with the « | Home Office & Co» template. */
  privacy: {
    title: 'Политика конфиденциальности',
    description:
      'Какие персональные данные собирает сайт Home Office & Co, зачем, где хранит, сколько и как отозвать согласие.',
  },
  /** Title with the « | Home Office & Co» template. */
  consent: {
    title: 'Согласие на обработку персональных данных',
    description: 'Согласие на обработку персональных данных для заявок на сайте Home Office & Co.',
  },
  /** Title with the « | Home Office & Co» template. */
  credits: {
    title: 'Авторы фото и данных карт',
    description: 'Авторы и лицензии фотографий и картографических данных на сайте Home Office & Co.',
  },
  /** Absolute title of the 404 page. */
  notFound: {
    title: 'Страница не найдена | Home Office & Co',
  },
}

export type MetaDict = typeof meta
