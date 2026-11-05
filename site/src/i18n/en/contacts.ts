// /contacts, verbatim from docs/content/copy-contacts.md (v1.0, 2 Nov 2026).
// Facts stay in src/views/contacts.tsx and src/lib/site.ts: the #zapis anchor, phone numbers,
// e-mail, links, broker hours. Channel names: `common.channels`; destination names and clock
// labels: `common.destinations`; the requisites line: `common.footer.requisites`. Title and
// description of the page: `meta.contacts`.

import type { ContactsDict } from '../ru/contacts'

export const contacts = {
  hero: {
    /** h1, D1. */
    title: 'Contacts',
    /** Paragraph in D3 under the h1. */
    line: 'We meet in person in Phuket: at the property or in a business center nearby',
  },

  channels: {
    title: 'How to reach us',
    /**
     * Who answers Telegram, WhatsApp and the phone (the founder, DEMO_DECISIONS), under the channel
     * address: «Иван, основатель». {name} and {role} come from `common.founder`.
     */
    owner: '{name}, {role}',
    fallback: 'If Telegram or WhatsApp will not open, call us or send an email',
    /**
     * Broker hours next to the local clocks. {open}/{close}: hours on Phuket; {mskOpen}/{mskClose}:
     * the same hours in Moscow. Russia-specific: the Moscow part and the second sentence (Krasnoyarsk
     * and Novosibirsk have the same time as Phuket, UTC+7) are for visitors from Russia; translations
     * may drop them and keep only {open} and {close}. Times come formatted by locale («9:00», «9:00 am»).
     */
    hours: 'Brokers are available from {open} to {close} Phuket time',
    /**
     * Under the hours. «15 минут» is the promised reply time; {openReply}: opening + 15 minutes on the
     * Phuket clock («9:15», «9:15 am»).
     */
    promise: 'During these hours we reply within 15 minutes. If you write at night, we will see your request in the morning and reply by {openReply} Phuket time',
  },

  /** Booking block on the ink field, next to the viewing form (anchor #zapis). */
  booking: {
    title: 'Book a viewing',
    text: 'Choose a time in Phuket, and we show your own time next to it',
    /** DEMO_DECISIONS «Стоимость консультации» (the client confirms before launch). */
    price: 'The consultation is free',
    /** Small line under the form. */
    after: 'If you cannot fly in, choose an online viewing. We explain the remote signing procedure in advance',
  },

  meet: {
    /** Caption under the Nai Harn photo, after the locator. */
    photoCaption: 'Nai Harn, south of Phuket',
    title: 'Where we meet',
    /** The year the agency opened (2026, DEMO_DECISIONS «Год открытия») and the figures are facts: keep them. */
    paragraphs: [
      'In person in Phuket: at the property you chose, or in a business center nearby. We send the meeting address right after you book.',
      'Our specialists have worked in international markets for more than 5 years and have served more than 100 clients. In 2026 they opened the Home Office & Co agency.',
    ],
    /** Placeholder: optional Small line under the paragraphs; empty hides it. */
    yearNote: '',
    /** Small heading above `common.footer.requisites`. */
    requisitesTitle: 'Company details',
  },
} satisfies ContactsDict
