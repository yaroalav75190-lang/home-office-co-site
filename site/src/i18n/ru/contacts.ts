// /contacts, verbatim from docs/content/copy-contacts.md (v1.0, 2 Nov 2026).
// Facts stay in src/views/contacts.tsx and src/lib/site.ts: the #zapis anchor, phone numbers,
// e-mail, links, broker hours. Channel names: `common.channels`; destination names and clock
// labels: `common.destinations`; the requisites line: `common.footer.requisites`. Title and
// description of the page: `meta.contacts`.

import { tpl } from '../format'

export const contacts = {
  hero: {
    /** h1, D1. */
    title: 'Контакты',
    /** Paragraph in D3 under the h1. */
    line: 'Встречаемся лично на Пхукете: на объекте или в деловом центре рядом с ним',
  },

  channels: {
    title: 'Как с нами связаться',
    /**
     * Who answers Telegram, WhatsApp and the phone (the founder, DEMO_DECISIONS), under the channel
     * address: «Иван, основатель». {name} and {role} come from `common.founder`.
     */
    owner: tpl<'name' | 'role'>('{name}, {role}'),
    fallback: 'Если Telegram или WhatsApp не открываются, позвоните или напишите на почту',
    /**
     * Broker hours next to the local clocks. {open}/{close}: hours on Phuket; {mskOpen}/{mskClose}:
     * the same hours in Moscow. Russia-specific: the Moscow part and the second sentence (Krasnoyarsk
     * and Novosibirsk have the same time as Phuket, UTC+7) are for visitors from Russia; translations
     * may drop them and keep only {open} and {close}. Times come formatted by locale («9:00», «9:00 am»).
     */
    hours: tpl<'open' | 'close'>(
      'Брокеры на связи с {open} до {close} по Пхукету, это с {mskOpen} до {mskClose} по Москве. В Красноярске и Новосибирске время то же, что на Пхукете',
    ),
    /**
     * Under the hours. «15 минут» is the promised reply time; {openReply}: opening + 15 minutes on the
     * Phuket clock («9:15», «9:15 am»).
     */
    promise: tpl<'openReply'>(
      'В эти часы отвечаем за 15 минут. Если напишете ночью, увидим заявку утром и ответим до {openReply} по Пхукету',
    ),
  },

  /** Booking block on the ink field, next to the viewing form (anchor #zapis). */
  booking: {
    title: 'Запись на просмотр',
    text: 'Выберите время на Пхукете, рядом покажем ваше',
    /** DEMO_DECISIONS «Стоимость консультации» (the client confirms before launch). */
    price: 'Консультация бесплатная',
    /** Small line under the form. */
    after: 'Если прилететь не получается, выберите онлайн-показ. Порядок дистанционного подписания объясним заранее',
  },

  meet: {
    /** Caption under the Nai Harn photo, after the locator. */
    photoCaption: 'Най Харн, юг Пхукета',
    title: 'Где встречаемся',
    /** The year the agency opened (2026, DEMO_DECISIONS «Год открытия») and the figures are facts: keep them. */
    paragraphs: [
      'Лично на Пхукете: на объекте, который вы выбрали, или в деловом центре рядом с ним. Адрес встречи пришлём сразу после записи.',
      'Наши специалисты больше 5 лет работают на международных рынках, у них больше 100 клиентов. В 2026 году они открыли агентство Home Office & Co.',
    ],
    /** Placeholder: optional Small line under the paragraphs; empty hides it. */
    yearNote: '',
    /** Small heading above `common.footer.requisites`. */
    requisitesTitle: 'Реквизиты',
  },
}

export type ContactsDict = typeof contacts
