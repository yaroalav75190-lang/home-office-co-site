// Forms (copy-global §8–§10): field labels, options, validation messages, sending states and the
// thank-you screens of the booking forms and the guide form. The quiz questions are in podbor.ts.
// Option ids, booking slots, budget bounds and phone codes are facts in src/lib/lead.ts and
// src/components/ui/field.tsx; only words live here. These strings are also used by the lead API:
// the server answers field errors in the visitor's language.

import { tpl } from '../format'

export const forms = {
  /** Field names for the error summary «Исправьте поля: Имя, Телефон». */
  fields: {
    name: 'Имя',
    channel: 'Куда ответить',
    /** Used when the channel is not chosen yet; otherwise the contact label of the channel. */
    contact: 'Контакт',
    consent: 'Согласие на обработку данных',
    format: 'Формат',
    direction: 'Направление',
    date: 'Дата',
    time: 'Время на Пхукете',
    comment: 'Комментарий',
    goal: 'Цель',
    budget: 'Бюджет',
    timeline: 'Срок',
    district: 'Район',
  },
  /** Added to the label of an optional field (there are no asterisks). */
  optional: ', необязательно',

  /** «Куда ответить» tiles (four in a row on desktop: keep them short). */
  channels: {
    telegram: 'Telegram',
    whatsapp: 'WhatsApp',
    phone: 'Звонок',
    email: 'Почта',
  },
  /** Label of the contact field for the chosen channel. */
  contactLabels: {
    telegram: 'Ник или номер в Telegram',
    whatsapp: 'Номер WhatsApp',
    phone: 'Телефон',
    email: 'Почта',
  },
  placeholders: {
    telegram: '@username или +7 900 000-00-00',
    email: 'name@mail.ru',
  },
  /** Under the phone field when the visitor chose a call. */
  phoneHoursHint: tpl<'open' | 'close'>('Брокер позвонит с {open} до {close} по Пхукету'),

  /** Phone field: hidden label of the code selector and the country names (codes are facts in field.tsx). */
  phone: {
    countryCodeLabel: 'Код страны',
    countries: {
      ru: 'Россия',
      kz: 'Казахстан',
      by: 'Беларусь',
      uz: 'Узбекистан',
      kg: 'Кыргызстан',
      am: 'Армения',
      ge: 'Грузия',
      az: 'Азербайджан',
      th: 'Таиланд',
      id: 'Индонезия',
      ae: 'ОАЭ',
      kh: 'Камбоджа',
      tr: 'Турция',
      il: 'Израиль',
      de: 'Германия',
      other: 'Другая страна',
    },
  },

  /** Consent checkbox (copy-global §9). The link texts go to /consent and /privacy: legal wording. */
  consent: {
    label: { before: 'Даю ', link: 'согласие на обработку персональных данных', after: '' },
    description: { before: 'Как храним и используем данные, написано в ', link: 'политике конфиденциальности', after: '' },
  },

  /** Hidden field for bots: screen readers skip it, the label only helps a human who reaches it. */
  honeypot: 'Оставьте это поле пустым',

  /** Validation messages (copy-global §8.3): say what to fix, never «ошибка». Also returned by the lead API. */
  messages: {
    nameEmpty: 'Напишите, как к вам обращаться',
    nameLong: 'Сократите имя до 60 знаков',
    channel: 'Выберите, куда ответить',
    telegramEmpty: 'Укажите ник или номер, к которому привязан Telegram',
    telegramNick: 'В нике Telegram от 5 до 32 знаков: латинские буквы, цифры или _, например @ivan_petrov',
    phoneEmpty: 'Укажите номер телефона',
    /** A +7 number (Russia, Kazakhstan) with too few digits. */
    phoneShortRu: 'Проверьте номер: после +7 нужно 10 цифр',
    phoneShortOther: 'Проверьте номер: после кода страны не хватает цифр',
    phoneLong: 'В номере лишние цифры. Проверьте, не повторился ли код страны',
    emailEmpty: 'Укажите почту',
    emailBad: 'Проверьте адрес почты, например name@mail.ru',
    format: 'Выберите формат встречи',
    direction: 'Выберите направление или вариант «Пока не выбрал»',
    date: 'Выберите дату',
    time: 'Выберите время',
    slotTaken: 'Это время только что заняли. Выберите другое',
    /** {n}: the current length of the text. */
    commentLong: tpl<'n'>('Сократите текст до 1000 знаков, сейчас {n}'),
    consent: 'Чтобы отправить заявку, отметьте согласие на обработку данных',
    /** Quiz answers come from tiles; this only shows if a request was tampered with. */
    choice: 'Выберите один из вариантов',
    /** {fields}: field names joined with commas. */
    summary: tpl<'fields'>('Заявка не отправлена. Исправьте поля: {fields}'),
    offline: 'Нет связи с интернетом. Введённые данные остались в форме. Проверьте подключение и отправьте ещё раз',
    /** {phone}: the broker's number. */
    server: tpl<'phone'>(
      'Заявка не отправилась из-за сбоя на нашей стороне. Данные остались в форме. Отправьте ещё раз или позвоните: {phone}',
    ),
    /** 429: a retry within 10 minutes fails the same way, so the sentence leads to the phone and Telegram. */
    rateLimited: tpl<'phone'>(
      'Заявка не отправилась: с вашего подключения было много попыток подряд. Позвоните или напишите в Telegram: {phone}',
    ),
    /** {when}: «до 16:55», «завтра до 5:15 по вашему времени»… (`common.reply.when`). */
    duplicate: tpl<'when'>('Заявка с этим контактом уже у брокера. Он ответит {when}'),
  },

  /** Error summary heading before the field links. */
  summaryLead: 'Заявка не отправлена. Исправьте поля:',
  /** Submit button while sending (same width as the label: keep it short). */
  sending: 'Отправляем…',
  retry: 'Повторить отправку',
  call: 'Позвонить',
  /** Under every submit button. */
  channelNote: 'Пишем только в выбранный канал. Звоним, если попросите',

  /** Quiz options (question texts are in podbor.ts). Tiles: label one line, description up to two. */
  options: {
    directions: {
      phuket: { label: 'Пхукет', description: 'Шесть районов, квартиры и виллы' },
      pattaya: { label: 'Паттайя', description: 'Город у моря на материке' },
      bali: { label: 'Бали', description: 'Правила владения не такие, как в Таиланде' },
      dubai: { label: 'Дубай', description: 'Резидентская виза при покупке от установленной суммы' },
      cambodia: { label: 'Камбоджа', description: 'Квартиры у моря' },
      undecided: { label: 'Пока выбираю', description: 'Брокер сравнит страны под вашу задачу' },
    },
    /** «Направление» in the viewing form. */
    formDirections: {
      phuket: 'Пхукет',
      pattaya: 'Паттайя',
      bali: 'Бали',
      dubai: 'Дубай',
      cambodia: 'Камбоджа',
      undecided: 'Пока не выбрал',
    },
    /** Phuket districts the quiz accepts from `?district=`. */
    districts: {
      layan: 'Лаян',
      'bang-tao': 'Банг Тао',
      kamala: 'Камала',
      'karon-kata': 'Карон и Ката',
      'nai-harn-rawai': 'Най Харн и Раваи',
      chalong: 'Чалонг',
    },
    goals: {
      income: { label: 'Доход от аренды или перепродажи', description: 'Считаем загрузку по сезонам и цену по этапам стройки' },
      wintering: { label: 'Жить зимой, сдавать остальное время', description: 'С ноября по март живёте сами, потом квартира сдаётся' },
      relocation: { label: 'Переезд и долгое проживание', description: 'Расскажем, какие визы есть в выбранной стране' },
      capital: { label: 'Сохранить капитал в валюте', description: 'Проверяем застройщика и смотрим, легко ли будет продать объект' },
    },
    /**
     * Budget tiles. The bounds are facts in src/lib/lead.ts (thousands of US dollars: 150, 300, 600);
     * {min} and {max} are those numbers formatted for the locale. Keep the currency and the
     * «thousand» unit in the template: «До 150 тыс. $», «$150–300k».
     */
    budgets: {
      upTo: tpl<'max'>('До {max} тыс. $'),
      range: tpl<'min' | 'max'>('{min}–{max} тыс. $'),
      from: tpl<'min'>('От {min} тыс. $'),
      unsure: {
        label: 'Хочу понять, что реально за мой бюджет',
        description: 'Брокер спросит сумму в сообщении и покажет, что можно купить на эти деньги',
      },
    },
    timelines: {
      month: { label: 'В ближайший месяц', description: '' },
      '1-3': { label: 'Через 1–3 месяца', description: '' },
      '3-6': { label: 'Через 3–6 месяцев', description: '' },
      exploring: { label: 'Пока изучаю рынок', description: 'Подборка поможет понять цены, торопить не будем' },
    },
    /** «Формат» of the consultation on /services/deal (three tiles in a row). */
    consultationFormats: {
      video: 'Видеозвонок',
      call: 'Звонок',
      meeting: 'Встреча на Пхукете',
    },
    /** «Формат» of the booking on /contacts. */
    viewingFormats: {
      viewing: { label: 'Просмотр на Пхукете', description: 'Встреча на объекте, адрес пришлём после записи' },
      online: { label: 'Онлайн-показ', description: 'Брокер показывает объект по видеосвязи' },
      video: { label: 'Консультация по видео', description: '30 минут: задача, районы, бюджет' },
      call: { label: 'Звонок', description: 'Тот же разговор по телефону' },
    },
  },

  /** Date tiles of the booking forms (dates themselves are formatted by locale). */
  dates: {
    legend: 'Дата',
    hint: 'Ближайшие 14 дней',
  },
  /** Time slots: «11:00 на Пхукете» / «07:00 у вас». {time} is formatted by locale. */
  slots: {
    legend: 'Время на Пхукете',
    hint: 'Рядом показываем ваше время',
    phuket: tpl<'time'>('{time} на Пхукете'),
    phuketAndYou: tpl<'time'>('{time} на Пхукете и у вас'),
    local: tpl<'time'>('{time} у вас'),
  },

  /** Booking forms on /services/deal (consultation) and /contacts (viewing). */
  booking: {
    format: 'Формат',
    direction: 'Направление',
    commentConsultation: 'Что уже выбрали',
    commentViewing: 'Что обсудить',
    placeholderConsultation: 'Название проекта или ссылка',
    placeholderViewing: 'Например, виллы у моря до 300 тыс. $',
    submitConsultation: 'Записаться на консультацию',
    submitViewing: 'Записаться',
    /** Under the viewing button. {when}: `common.reply.when`. */
    confirmLine: tpl<'when'>('Брокер подтвердит запись {when}'),
    confirmFallback: 'Брокер подтвердит запись в течение 15 минут',
  },

  /** Thank-you screens of the booking forms (copy-global §10.2, §10.3). */
  thanks: {
    consultationTitle: 'Записали на консультацию',
    viewingTitle: 'Записали на просмотр',
    /** {day}: «12 ноября»; {local}/{phuket}: times formatted by locale. */
    slotPhuket: tpl<'day' | 'phuket'>('{day}, {phuket} по Пхукету'),
    slotSameZone: tpl<'day' | 'phuket'>('{day}, {phuket}. У вас и на Пхукете одно время'),
    slotLocal: tpl<'day' | 'local' | 'phuket'>('{day}, {local} по вашему времени, на Пхукете будет {phuket}'),
    /** «напишет в Telegram»: the {writes} part of the sentences below. */
    writes: {
      telegram: 'напишет в Telegram',
      whatsapp: 'напишет в WhatsApp',
      email: 'напишет на почту',
      phone: 'позвонит',
    },
    /** «в Telegram»: the {via} part («подтвердит время в Telegram»). */
    via: {
      telegram: 'в Telegram',
      whatsapp: 'в WhatsApp',
      email: 'по почте',
      phone: 'по телефону',
    },
    /** By format. {writes}, {via}: above; {when}: `common.reply.when`. */
    formats: {
      video: tpl<'writes' | 'when'>('Брокер {writes} {when}, подтвердит время и пришлёт ссылку на звонок'),
      call: tpl<'via' | 'when'>('Брокер подтвердит время {via} {when} и позвонит в назначенный час'),
      meeting: tpl<'writes' | 'when'>('Брокер {writes} {when}, подтвердит время и пришлёт адрес встречи'),
      viewing: tpl<'writes' | 'when'>('Брокер {writes} {when}, уточнит, какие объекты показать, и пришлёт адрес встречи'),
      online: tpl<'writes' | 'when'>('Брокер {writes} {when}, уточнит, какие объекты показать, и пришлёт ссылку на видеозвонок'),
    },
    change: 'Если планы изменятся, ответьте брокеру в том же чате, и он предложит другое время',
    guideCta: 'Открыть гид инвестора',
    guideNote: 'Глава «Сделка по шагам» пригодится перед разговором',
  },

  /** Investor guide form (home page, copy-home §9) and its thank-you screen (copy-global §10.4). */
  guide: {
    formLabel: 'Получить гид',
    channelLegend: 'Куда прислать гид',
    /** Three tiles: no «Звонок» for a PDF. */
    channels: { telegram: 'Telegram', whatsapp: 'WhatsApp', email: 'Почта' },
    submit: 'Получить гид',
    note: 'Пришлём гид в выбранный канал',
    /** {channel}: «в Telegram», «на почту». */
    doneTitle: tpl<'channel'>('Пришлём гид {channel}'),
    to: { telegram: 'в Telegram', whatsapp: 'в WhatsApp', email: 'на почту' },
    /** {when}: `common.reply.when`. */
    doneEmail: tpl<'when'>('Вопросы по гиду задайте в ответном письме, брокер ответит {when}'),
    doneChat: tpl<'when'>('Вопросы по гиду задайте в том же чате, брокер ответит {when}'),
  },
}

export type FormsDict = typeof forms
