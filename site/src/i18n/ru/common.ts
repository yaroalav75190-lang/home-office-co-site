// Shell of every page (copy-global §1–§7): header, menus, footer, sticky bar, contact channels,
// the live reply-time line, local clocks and the page-transition curtain.
// Hrefs, phone numbers, time zones and hours stay in src/lib/site.ts; only words live here.

import { tpl } from '../format'

export const common = {
  /** Skip link, first focusable element of the page. */
  skipLink: 'Перейти к содержанию',

  header: {
    /** Screen-reader name of the logo link. */
    homeLabel: tpl<'name'>('{name}, на главную'),
    mainNavLabel: 'Основная навигация',
    /** Screen-reader name of the phone link in the header. */
    callLabel: tpl<'phone'>('Позвонить по номеру {phone}'),
    /** Visible «Меню» button (under 1280 px) and its screen-reader name. */
    menu: 'Меню',
    openMenu: 'Открыть меню',
    /** On /podbor the header shows only the logo and this link. */
    closeQuiz: 'Закрыть',
    closeQuizLabel: 'Закрыть подбор',
    /** Screen-reader name of the RU · EN · ES switcher. */
    languageLabel: 'Язык сайта',
  },

  /**
   * Navigation labels by item id (ids and hrefs: src/lib/site.ts). Keep them short: the desktop
   * header at 1280 px holds «Направления, Сопровождение сделки, Контакты», the phone, the language
   * switcher and the button in one line.
   */
  nav: {
    destinations: 'Направления',
    services: 'Услуги',
    deal: 'Сопровождение сделки',
    team: 'Команда',
    reviews: 'Отзывы',
    journal: 'Журнал',
    contacts: 'Контакты',
    /** Primary button in the header and the sticky bar. */
    podborCta: 'Подобрать объект',
    /** «Подбор объекта» in the mobile menu and the footer. */
    podbor: 'Подбор объекта',
    investors: 'Инвесторам',
    living: 'Для жизни и зимовки',
    phuket: 'Пхукет',
    bangTao: 'Банг Тао',
    pattaya: 'Паттайя',
    pattayaQuiz: 'Подобрать в Паттайе',
    baliPage: 'Недвижимость на Бали',
    baliQuiz: 'Подобрать на Бали',
    dubaiPage: 'Недвижимость в Дубае',
    dubaiQuiz: 'Подобрать в Дубае',
    cambodiaPage: 'Недвижимость в Камбодже',
    cambodiaQuiz: 'Подобрать в Камбодже',
    consultation: 'Записаться на консультацию',
    privacy: 'Политика конфиденциальности',
    consent: 'Согласие на обработку персональных данных',
    creditsPhotos: 'Авторы фото',
    creditsMaps: 'Карты © участники OpenStreetMap',
  },

  /** Mobile and tablet menu (full-screen dialog). */
  menu: {
    label: 'Меню',
    close: 'Закрыть',
    closeLabel: 'Закрыть меню',
    /** Short tile label for the phone, next to Telegram and WhatsApp. */
    call: 'Позвонить',
  },

  /** Destinations, by id (time zones and pages: src/lib/site.ts). */
  destinations: {
    phuket: {
      /** Short name: footer «Пхукет 16:40», mobile menu. */
      name: 'Пхукет',
      /** Column title in the desktop «Направления» panel. */
      region: 'Таиланд',
      /** After the clock in the panel: «16:40 в Таиланде». */
      regionTimeLabel: 'в Таиланде',
      /** After the clock elsewhere (read by screen readers): «16:40 на Пхукете». */
      timeLabel: 'на Пхукете',
      /** Screen-reader name of the coast drawing. */
      coastLabel: 'Западное побережье Пхукета',
    },
    bali: {
      name: 'Бали',
      region: 'Бали',
      regionTimeLabel: 'на Бали',
      timeLabel: 'на Бали',
      coastLabel: 'Полуостров Букит, Бали',
    },
    dubai: {
      name: 'Дубай',
      region: 'Дубай',
      regionTimeLabel: 'в Дубае',
      timeLabel: 'в Дубае',
      coastLabel: 'Джумейра и Пальма, Дубай',
    },
    cambodia: {
      name: 'Камбоджа',
      region: 'Камбоджа',
      regionTimeLabel: 'в Камбодже',
      timeLabel: 'в Камбодже',
      coastLabel: 'Побережье Сиануквиля, Камбоджа',
    },
  },

  /** Contact channels (addresses and links: src/lib/site.ts). */
  channels: {
    telegram: {
      /** Large channel name on /contacts. */
      name: 'Telegram',
      /** Short label on tiles and in the footer. */
      label: 'Telegram',
      /** Verb label for buttons and screen readers. */
      action: 'Написать в Telegram',
    },
    whatsapp: { name: 'WhatsApp', label: 'WhatsApp', action: 'Написать в WhatsApp' },
    phone: { name: 'Телефон', label: 'Позвонить', action: 'Позвонить' },
    email: { name: 'Почта', label: 'Почта', action: 'Написать на почту' },
  },

  /** The person behind the phone and the messengers (DEMO_DECISIONS «Контакты и работа»). */
  founder: { name: 'Иван', role: 'основатель' },

  footer: {
    destinationsLabel: 'Направления',
    sectionsLabel: 'Разделы',
    /**
     * Broker hours under the contacts. {open}/{close}: hours on Phuket; {mskOpen}/{mskClose}: the same
     * hours in Moscow (Russian only, optional elsewhere).
     */
    hours: tpl<'open' | 'close'>('Брокеры на связи с {open} до {close} по Пхукету, это с {mskOpen} до {mskClose} по Москве'),
    /** Legal block (seo-brief §7.5); no registration numbers until the client sends them. */
    requisites: 'Home Office & Co. Реквизиты для договора отправляем по запросу',
    /** Caption of the footer photo; the author asks for his name next to it (keep «Anton Zelenov»). */
    photoCaption: 'Закат на Банг Тао, западное побережье Пхукета. Фото: Anton Zelenov',
  },

  /** Mobile sticky bar (under 768 px). */
  stickyBar: {
    label: 'Быстрая связь',
  },

  /** Closing line at the bottom of the main pages. */
  closingLine: {
    /** Before the phone number: «Или позвоните: +7 …». */
    call: 'Или позвоните:',
  },

  breadcrumbs: {
    label: 'Навигационная цепочка',
    home: 'Главная',
  },

  /**
   * The live reply-time line (copy-global §5). Placeholders: {replyBy} now + 15 minutes, {openReply}
   * opening + 15 minutes, {openLocal} opening on the visitor's clock (all visitor time), {open} and
   * {close} broker hours on Phuket, {day} the word «сегодня»/«завтра», {lead} the sentence before
   * the time. Times are formatted by locale («16:55», «4:55 pm»).
   */
  reply: {
    /** No JavaScript: the only line that can be server-rendered. */
    fallback: 'Отвечаем в течение 15 минут',
    /** Default in-hours sentence before the time. */
    lead: 'Напишите сейчас, и брокер ответит',
    today: 'сегодня',
    tomorrow: 'завтра',
    /** Full line under buttons. */
    full: {
      open: tpl<'lead' | 'replyBy'>('{lead} до {replyBy}'),
      /** The visitor's clock shows Phuket time. */
      openSameZone: tpl<'lead' | 'replyBy'>('{lead} до {replyBy}. У вас и на Пхукете одно время'),
      /** The browser does not tell the visitor's zone: Phuket times, said so. */
      openUnknownZone: tpl<'lead' | 'replyBy'>('{lead} до {replyBy} по Пхукету'),
      closed: tpl<'open' | 'openLocal' | 'day' | 'openReply'>(
        'Брокер на связи с {open} по Пхукету, у вас это {openLocal}. Ответим {day} до {openReply}',
      ),
      closedSameZone: tpl<'open' | 'day' | 'openReply'>(
        'Брокер на связи с {open}, у вас и на Пхукете одно время. Ответим {day} до {openReply}',
      ),
      closedUnknownZone: tpl<'open' | 'close'>(
        'Брокер на связи с {open} до {close} по Пхукету. Ответим в начале рабочего дня',
      ),
    },
    /** Short line for the menu and narrow columns. */
    short: {
      open: tpl<'replyBy'>('Ответим до {replyBy}'),
      openUnknownZone: tpl<'replyBy'>('Ответим до {replyBy} по Пхукету'),
      closed: tpl<'day' | 'openReply'>('Ответим {day} до {openReply}'),
      closedUnknownZone: 'Ответим в начале рабочего дня',
    },
    /** The «when» part of thank-you and duplicate-request sentences: «Брокер напишет {when}». */
    when: {
      open: tpl<'replyBy'>('до {replyBy}'),
      openUnknownZone: tpl<'replyBy'>('до {replyBy} по Пхукету'),
      closed: tpl<'day' | 'openReply'>('{day} до {openReply} по вашему времени'),
      closedUnknownZone: 'в начале рабочего дня',
      /** No clock yet (server render, no JS). */
      fallback: 'в течение 15 минут',
    },
    /** Closing sentence of the main pages: {title} is the page's «Расскажите, что ищете…». */
    closing: {
      open: tpl<'title' | 'replyBy'>('{title}, и брокер ответит до {replyBy}'),
      openUnknownZone: tpl<'title' | 'replyBy'>('{title}, и брокер ответит до {replyBy} по Пхукету'),
      closed: tpl<'title' | 'day' | 'openReply'>('{title}. Брокер ответит {day} до {openReply} по вашему времени'),
      closedUnknownZone: tpl<'title' | 'open'>('{title}. Брокер ответит в начале рабочего дня, с {open} по Пхукету'),
      fallback: tpl<'title'>('{title}. Отвечаем в течение 15 минут'),
    },
  },

  /** «Занавес места» page transition: the destination name (D1) and its local time. */
  curtain: {
    names: {
      home: 'Home Office & Co',
      phuket: 'Пхукет',
      bangTao: 'Банг Тао',
      deal: 'Сделка',
      contacts: 'Контакты',
      pattaya: 'Паттайя',
      bali: 'Бали',
      dubai: 'Дубай',
      cambodia: 'Камбоджа',
      team: 'Команда',
      reviews: 'Отзывы',
      journal: 'Журнал',
    },
    /** After the clock: «16:40 на Пхукете». */
    at: {
      phuket: 'на Пхукете',
      pattaya: 'в Паттайе',
      bali: 'на Бали',
      dubai: 'в Дубае',
      cambodia: 'в Камбодже',
    },
    /** Screen-reader announcement of the new page (switched off, kept for the a11y gate). */
    opened: tpl<'name'>('Открыта страница: {name}'),
  },
}

export type CommonDict = typeof common
