// Texts of /contacts, verbatim from docs/content/copy-contacts.md (v1.0, 2 Nov 2026).

export const meta = {
  title: 'Контакты Home Office & Co: консультация и просмотр',
  description:
    'Телефон, Telegram и почта Home Office & Co. Запишитесь на онлайн-консультацию или на просмотр объекта на Пхукете: выберите дату, время по Пхукету и формат.',
}

export const hero = {
  title: 'Контакты',
  line: 'Офиса нет. Встречаемся на объектах и в деловых пространствах',
}

export const channels = {
  title: 'Как с нами связаться',
  /** Who answers each channel. Empty: no line under the channel (DEMO_DECISIONS: Ivan's number
   * serves phone, Telegram and WhatsApp). */
  owners: {
    telegram: 'Иван, основатель',
    whatsapp: 'Иван, основатель',
    phone: 'Иван, основатель',
    email: '',
  } as Record<'telegram' | 'whatsapp' | 'phone' | 'email', string>,
  fallback: 'Если Telegram или WhatsApp не открываются, позвоните или напишите на почту',
  promise: 'В эти часы отвечаем за 15 минут. Если напишете ночью, увидим заявку утром и ответим до 9:15 по Пхукету',
}

export const booking = {
  anchor: 'zapis',
  title: 'Запись на просмотр',
  text: 'Выберите время на Пхукете, рядом покажем ваше',
  /** DEMO_DECISIONS «Стоимость консультации» (the client confirms before launch). */
  price: 'Консультация бесплатная',
  after: 'Если прилететь не получается, выберите онлайн-показ. Порядок дистанционного подписания объясним заранее',
}

export const meet = {
  photoCaption: 'Най Харн, юг Пхукета',
  title: 'Где встречаемся',
  paragraphs: [
    'На объектах и в деловых пространствах рядом с ними. Точный адрес пришлём после записи.',
    'Агентство новое, открылось в 2026 году. Наши специалисты работают на международных рынках больше 5 лет, у них больше 100 клиентов.',
  ],
  /**
   * Optional Small line under the paragraphs; '' hides it. The year (2026, DEMO_DECISIONS «Год
   * открытия») now sits in the second paragraph.
   */
  yearNote: '',
  requisitesTitle: 'Реквизиты',
}
