// Shell of every page (copy-global §1–§7): header, menus, footer, sticky bar, contact channels,
// the live reply-time line, local clocks and the page-transition curtain.
// Hrefs, phone numbers, time zones and hours stay in src/lib/site.ts; only words live here.

import type { CommonDict } from '../ru/common'

export const common = {
  /** Skip link, first focusable element of the page. */
  skipLink: 'Ir al contenido',

  header: {
    /** Screen-reader name of the logo link. */
    homeLabel: '{name}, ir a la página de inicio',
    mainNavLabel: 'Navegación principal',
    /** Screen-reader name of the phone link in the header. */
    callLabel: 'Llamar al {phone}',
    /** Visible «Меню» button (under 1280 px) and its screen-reader name. */
    menu: 'Menú',
    openMenu: 'Abrir el menú',
    /** On /podbor the header shows only the logo and this link. */
    closeQuiz: 'Cerrar',
    closeQuizLabel: 'Cerrar la búsqueda',
    /** Screen-reader name of the RU · EN · ES switcher. */
    languageLabel: 'Idioma del sitio',
  },

  /**
   * Navigation labels by item id (ids and hrefs: src/lib/site.ts). Keep them short: the desktop
   * header at 1280 px holds «Направления, Сопровождение сделки, Контакты», the phone, the language
   * switcher and the button in one line.
   */
  nav: {
    destinations: 'Destinos',
    services: 'Servicios',
    deal: 'Gestión de la compra',
    team: 'Equipo',
    reviews: 'Reseñas',
    journal: 'Revista',
    contacts: 'Contacto',
    /** Primary button in the header and the sticky bar. */
    podborCta: 'Buscar propiedad',
    /** «Подбор объекта» in the mobile menu and the footer. */
    podbor: 'Buscar propiedad',
    investors: 'Para inversores',
    living: 'Vivir y pasar el invierno',
    phuket: 'Phuket',
    bangTao: 'Bang Tao',
    pattaya: 'Pattaya',
    pattayaQuiz: 'Buscar en Pattaya',
    baliPage: 'Inmuebles en Bali',
    baliQuiz: 'Buscar en Bali',
    dubaiPage: 'Inmuebles en Dubái',
    dubaiQuiz: 'Buscar en Dubái',
    cambodiaPage: 'Inmuebles en Camboya',
    cambodiaQuiz: 'Buscar en Camboya',
    consultation: 'Reservar una consulta',
    privacy: 'Política de privacidad',
    consent: 'Consentimiento para el tratamiento de datos personales',
    creditsPhotos: 'Autores de las fotos',
    creditsMaps: 'Mapas © colaboradores de OpenStreetMap',
  },

  /** Mobile and tablet menu (full-screen dialog). */
  menu: {
    label: 'Menú',
    close: 'Cerrar',
    closeLabel: 'Cerrar el menú',
    /** Short tile label for the phone, next to Telegram and WhatsApp. */
    call: 'Llamar',
  },

  /** Destinations, by id (time zones and pages: src/lib/site.ts). */
  destinations: {
    phuket: {
      /** Short name: footer «Пхукет 16:40», mobile menu. */
      name: 'Phuket',
      /** Column title in the desktop «Направления» panel. */
      region: 'Tailandia',
      /** After the clock in the panel: «16:40 в Таиланде». */
      regionTimeLabel: 'en Tailandia',
      /** After the clock elsewhere (read by screen readers): «16:40 на Пхукете». */
      timeLabel: 'en Phuket',
      /** Screen-reader name of the coast drawing. */
      coastLabel: 'Costa oeste de Phuket',
    },
    bali: {
      name: 'Bali',
      region: 'Bali',
      regionTimeLabel: 'en Bali',
      timeLabel: 'en Bali',
      coastLabel: 'Península de Bukit, Bali',
    },
    dubai: {
      name: 'Dubái',
      region: 'Dubái',
      regionTimeLabel: 'en Dubái',
      timeLabel: 'en Dubái',
      coastLabel: 'Jumeirah y Palm Jumeirah, Dubái',
    },
    cambodia: {
      name: 'Camboya',
      region: 'Camboya',
      regionTimeLabel: 'en Camboya',
      timeLabel: 'en Camboya',
      coastLabel: 'Costa de Sihanoukville, Camboya',
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
      action: 'Escribir por Telegram',
    },
    whatsapp: { name: 'WhatsApp', label: 'WhatsApp', action: 'Escribir por WhatsApp' },
    phone: { name: 'Teléfono', label: 'Llamar', action: 'Llamar' },
    email: { name: 'Correo', label: 'Correo', action: 'Escribir un correo' },
  },

  /** The person behind the phone and the messengers (DEMO_DECISIONS «Контакты и работа»). */
  founder: { name: 'Iván', role: 'fundador' },

  footer: {
    destinationsLabel: 'Destinos',
    sectionsLabel: 'Secciones',
    /**
     * Broker hours under the contacts. {open}/{close}: hours on Phuket; {mskOpen}/{mskClose}: the same
     * hours in Moscow (Russian only, optional elsewhere).
     */
    hours: 'Los asesores atienden de {open} a {close}, hora de Phuket',
    /** Legal block (seo-brief §7.5); no registration numbers until the client sends them. */
    requisites: 'Home Office & Co. Le enviamos los datos de la empresa para el contrato si los solicita',
    /** Caption of the footer photo; the author asks for his name next to it (keep «Anton Zelenov»). */
    photoCaption: 'Atardecer en Bang Tao, costa oeste de Phuket. Foto: Anton Zelenov',
  },

  /** Mobile sticky bar (under 768 px). */
  stickyBar: {
    label: 'Contacto rápido',
  },

  /** Closing line at the bottom of the main pages. */
  closingLine: {
    /** Before the phone number: «Или позвоните: +7 …». */
    call: 'O llámenos:',
  },

  breadcrumbs: {
    label: 'Ruta de navegación',
    home: 'Inicio',
  },

  /**
   * The live reply-time line (copy-global §5). Placeholders: {replyBy} now + 15 minutes, {openReply}
   * opening + 15 minutes, {openLocal} opening on the visitor's clock (all visitor time), {open} and
   * {close} broker hours on Phuket, {day} the word «сегодня»/«завтра», {lead} the sentence before
   * the time. Times are formatted by locale («16:55», «4:55 pm»).
   */
  reply: {
    /** No JavaScript: the only line that can be server-rendered. */
    fallback: 'Respondemos en 15 minutos',
    /** Default in-hours sentence before the time. */
    lead: 'Escríbanos ahora y el asesor le responderá',
    today: 'hoy',
    tomorrow: 'mañana',
    /** Full line under buttons. */
    full: {
      open: '{lead} antes de las {replyBy}',
      /** The visitor's clock shows Phuket time. */
      openSameZone: '{lead} antes de las {replyBy}. Su hora y la de Phuket coinciden',
      /** The browser does not tell the visitor's zone: Phuket times, said so. */
      openUnknownZone: '{lead} antes de las {replyBy}, hora de Phuket',
      closed:
        'El asesor atiende desde las {open}, hora de Phuket (las {openLocal} en su hora local). Le responderemos {day} antes de las {openReply}',
      closedSameZone:
        'El asesor atiende desde las {open}; su hora y la de Phuket coinciden. Le responderemos {day} antes de las {openReply}',
      closedUnknownZone: 'El asesor atiende de {open} a {close}, hora de Phuket. Le responderemos al inicio de la jornada',
    },
    /** Short line for the menu and narrow columns. */
    short: {
      open: 'Respondemos antes de las {replyBy}',
      openUnknownZone: 'Respondemos antes de las {replyBy}, hora de Phuket',
      closed: 'Respondemos {day} antes de las {openReply}',
      closedUnknownZone: 'Respondemos al inicio de la jornada',
    },
    /** The «when» part of thank-you and duplicate-request sentences: «Брокер напишет {when}». */
    when: {
      open: 'antes de las {replyBy}',
      openUnknownZone: 'antes de las {replyBy} (hora de Phuket)',
      closed: '{day} antes de las {openReply} (su hora local)',
      closedUnknownZone: 'al inicio de la jornada',
      /** No clock yet (server render, no JS). */
      fallback: 'en 15 minutos',
    },
    /** Closing sentence of the main pages: {title} is the page's «Расскажите, что ищете…». */
    closing: {
      open: '{title} y el asesor le responderá antes de las {replyBy}',
      openUnknownZone: '{title} y el asesor le responderá antes de las {replyBy}, hora de Phuket',
      closed: '{title}. El asesor le responderá {day} antes de las {openReply}, en su hora local',
      closedUnknownZone: '{title}. El asesor le responderá al inicio de la jornada, desde las {open}, hora de Phuket',
      fallback: '{title}. Respondemos en 15 minutos',
    },
  },

  /** «Занавес места» page transition: the destination name (D1) and its local time. */
  curtain: {
    names: {
      home: 'Home Office & Co',
      phuket: 'Phuket',
      bangTao: 'Bang Tao',
      deal: 'Compra',
      contacts: 'Contacto',
      pattaya: 'Pattaya',
      bali: 'Bali',
      dubai: 'Dubái',
      cambodia: 'Camboya',
      team: 'Equipo',
      reviews: 'Reseñas',
      journal: 'Revista',
    },
    /** After the clock: «16:40 на Пхукете». */
    at: {
      phuket: 'en Phuket',
      pattaya: 'en Pattaya',
      bali: 'en Bali',
      dubai: 'en Dubái',
      cambodia: 'en Camboya',
    },
    /** Screen-reader announcement of the new page (switched off, kept for the a11y gate). */
    opened: 'Página abierta: {name}',
  },
} satisfies CommonDict
