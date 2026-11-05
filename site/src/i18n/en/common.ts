// Shell of every page (copy-global §1–§7): header, menus, footer, sticky bar, contact channels,
// the live reply-time line, local clocks and the page-transition curtain.
// Hrefs, phone numbers, time zones and hours stay in src/lib/site.ts; only words live here.

import type { CommonDict } from '../ru/common'

export const common = {
  /** Skip link, first focusable element of the page. */
  skipLink: 'Skip to content',

  header: {
    /** Screen-reader name of the logo link. */
    homeLabel: '{name}, home page',
    mainNavLabel: 'Main navigation',
    /** Screen-reader name of the phone link in the header. */
    callLabel: 'Call {phone}',
    /** Visible «Меню» button (under 1280 px) and its screen-reader name. */
    menu: 'Menu',
    openMenu: 'Open menu',
    /** On /podbor the header shows only the logo and this link. */
    closeQuiz: 'Close',
    closeQuizLabel: 'Close property search',
    /** Screen-reader name of the RU · EN · ES switcher. */
    languageLabel: 'Site language',
  },

  /**
   * Navigation labels by item id (ids and hrefs: src/lib/site.ts). Keep them short: the desktop
   * header at 1280 px holds «Направления, Сопровождение сделки, Контакты», the phone, the language
   * switcher and the button in one line.
   */
  nav: {
    destinations: 'Destinations',
    services: 'Services',
    deal: 'Deal support',
    team: 'Team',
    reviews: 'Reviews',
    journal: 'Journal',
    contacts: 'Contacts',
    /** Primary button in the header and the sticky bar. */
    podborCta: 'Find a property',
    /** «Подбор объекта» in the mobile menu and the footer. */
    podbor: 'Property search',
    investors: 'For investors',
    living: 'Living and wintering',
    phuket: 'Phuket',
    bangTao: 'Bang Tao',
    pattaya: 'Pattaya',
    pattayaQuiz: 'Find in Pattaya',
    baliPage: 'Property in Bali',
    baliQuiz: 'Find in Bali',
    dubaiPage: 'Property in Dubai',
    dubaiQuiz: 'Find in Dubai',
    cambodiaPage: 'Property in Cambodia',
    cambodiaQuiz: 'Find in Cambodia',
    consultation: 'Book a consultation',
    privacy: 'Privacy policy',
    consent: 'Consent to personal data processing',
    creditsPhotos: 'Photo credits',
    creditsMaps: 'Maps © OpenStreetMap contributors',
  },

  /** Mobile and tablet menu (full-screen dialog). */
  menu: {
    label: 'Menu',
    close: 'Close',
    closeLabel: 'Close menu',
    /** Short tile label for the phone, next to Telegram and WhatsApp. */
    call: 'Call',
  },

  /** Destinations, by id (time zones and pages: src/lib/site.ts). */
  destinations: {
    phuket: {
      /** Short name: footer «Пхукет 16:40», mobile menu. */
      name: 'Phuket',
      /** Column title in the desktop «Направления» panel. */
      region: 'Thailand',
      /** After the clock in the panel: «16:40 в Таиланде». */
      regionTimeLabel: 'in Thailand',
      /** After the clock elsewhere (read by screen readers): «16:40 на Пхукете». */
      timeLabel: 'in Phuket',
      /** Screen-reader name of the coast drawing. */
      coastLabel: 'West coast of Phuket',
    },
    bali: {
      name: 'Bali',
      region: 'Bali',
      regionTimeLabel: 'in Bali',
      timeLabel: 'in Bali',
      coastLabel: 'Bukit Peninsula, Bali',
    },
    dubai: {
      name: 'Dubai',
      region: 'Dubai',
      regionTimeLabel: 'in Dubai',
      timeLabel: 'in Dubai',
      coastLabel: 'Jumeirah and Palm Jumeirah, Dubai',
    },
    cambodia: {
      name: 'Cambodia',
      region: 'Cambodia',
      regionTimeLabel: 'in Cambodia',
      timeLabel: 'in Cambodia',
      coastLabel: 'Sihanoukville coast, Cambodia',
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
      action: 'Message on Telegram',
    },
    whatsapp: { name: 'WhatsApp', label: 'WhatsApp', action: 'Message on WhatsApp' },
    phone: { name: 'Phone', label: 'Call', action: 'Call' },
    email: { name: 'Email', label: 'Email', action: 'Send an email' },
  },

  /** The person behind the phone and the messengers (DEMO_DECISIONS «Контакты и работа»). */
  founder: { name: 'Ivan', role: 'founder' },

  footer: {
    destinationsLabel: 'Destinations',
    sectionsLabel: 'Sections',
    /**
     * Broker hours under the contacts. {open}/{close}: hours on Phuket; {mskOpen}/{mskClose}: the same
     * hours in Moscow (Russian only, optional elsewhere).
     */
    hours: 'Brokers are available from {open} to {close} Phuket time',
    /** Legal block (seo-brief §7.5); no registration numbers until the client sends them. */
    requisites: 'Home Office & Co. We send company details for the contract on request',
    /** Caption of the footer photo; the author asks for his name next to it (keep «Anton Zelenov»). */
    photoCaption: 'Sunset at Bang Tao, west coast of Phuket. Photo: Anton Zelenov',
  },

  /** Mobile sticky bar (under 768 px). */
  stickyBar: {
    label: 'Quick contact',
  },

  /** Closing line at the bottom of the main pages. */
  closingLine: {
    /** Before the phone number: «Или позвоните: +7 …». */
    call: 'Or call:',
  },

  breadcrumbs: {
    label: 'Breadcrumb',
    home: 'Home',
  },

  /**
   * The live reply-time line (copy-global §5). Placeholders: {replyBy} now + 15 minutes, {openReply}
   * opening + 15 minutes, {openLocal} opening on the visitor's clock (all visitor time), {open} and
   * {close} broker hours on Phuket, {day} the word «сегодня»/«завтра», {lead} the sentence before
   * the time. Times are formatted by locale («16:55», «4:55 pm»).
   */
  reply: {
    /** No JavaScript: the only line that can be server-rendered. */
    fallback: 'We reply within 15 minutes',
    /** Default in-hours sentence before the time. */
    lead: 'Write now and a broker will reply',
    today: 'today',
    tomorrow: 'tomorrow',
    /** Full line under buttons. */
    full: {
      open: '{lead} by {replyBy}',
      /** The visitor's clock shows Phuket time. */
      openSameZone: '{lead} by {replyBy}. Your time is the same as Phuket time',
      /** The browser does not tell the visitor's zone: Phuket times, said so. */
      openUnknownZone: '{lead} by {replyBy} Phuket time',
      closed: 'A broker is available from {open} Phuket time, which is {openLocal} for you. We will reply {day} by {openReply}',
      closedSameZone: 'A broker is available from {open}, and your time is the same as Phuket time. We will reply {day} by {openReply}',
      closedUnknownZone: 'A broker is available from {open} to {close} Phuket time. We will reply at the start of the working day',
    },
    /** Short line for the menu and narrow columns. */
    short: {
      open: 'We reply by {replyBy}',
      openUnknownZone: 'We reply by {replyBy} Phuket time',
      closed: 'We reply {day} by {openReply}',
      closedUnknownZone: 'We reply at the start of the working day',
    },
    /** The «when» part of thank-you and duplicate-request sentences: «Брокер напишет {when}». */
    when: {
      open: 'by {replyBy}',
      openUnknownZone: 'by {replyBy} Phuket time',
      closed: '{day} by {openReply} your time',
      closedUnknownZone: 'at the start of the working day',
      /** No clock yet (server render, no JS). */
      fallback: 'within 15 minutes',
    },
    /** Closing sentence of the main pages: {title} is the page's «Расскажите, что ищете…». */
    closing: {
      open: '{title}, and a broker will reply by {replyBy}',
      openUnknownZone: '{title}, and a broker will reply by {replyBy} Phuket time',
      closed: '{title}. A broker will reply {day} by {openReply} your time',
      closedUnknownZone: '{title}. A broker will reply at the start of the working day, from {open} Phuket time',
      fallback: '{title}. We reply within 15 minutes',
    },
  },

  /** «Занавес места» page transition: the destination name (D1) and its local time. */
  curtain: {
    names: {
      home: 'Home Office & Co',
      phuket: 'Phuket',
      bangTao: 'Bang Tao',
      deal: 'Deal',
      contacts: 'Contacts',
      pattaya: 'Pattaya',
      bali: 'Bali',
      dubai: 'Dubai',
      cambodia: 'Cambodia',
      team: 'Team',
      reviews: 'Reviews',
      journal: 'Journal',
    },
    /** After the clock: «16:40 на Пхукете». */
    at: {
      phuket: 'in Phuket',
      pattaya: 'in Pattaya',
      bali: 'in Bali',
      dubai: 'in Dubai',
      cambodia: 'in Cambodia',
    },
    /** Screen-reader announcement of the new page (switched off, kept for the a11y gate). */
    opened: 'Page opened: {name}',
  },
} satisfies CommonDict
