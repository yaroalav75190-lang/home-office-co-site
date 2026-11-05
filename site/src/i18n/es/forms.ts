// Forms (copy-global §8–§10): field labels, options, validation messages, sending states and the
// thank-you screens of the booking forms and the guide form. The quiz questions are in podbor.ts.
// Option ids, booking slots, budget bounds and phone codes are facts in src/lib/lead.ts and
// src/components/ui/field.tsx; only words live here. These strings are also used by the lead API:
// the server answers field errors in the visitor's language.

import type { FormsDict } from '../ru/forms'

export const forms = {
  /** Field names for the error summary «Исправьте поля: Имя, Телефон». */
  fields: {
    name: 'Nombre',
    channel: 'Dónde responderle',
    /** Used when the channel is not chosen yet; otherwise the contact label of the channel. */
    contact: 'Contacto',
    consent: 'Consentimiento para el tratamiento de datos',
    format: 'Formato',
    direction: 'Destino',
    date: 'Fecha',
    time: 'Hora en Phuket',
    comment: 'Comentario',
    goal: 'Objetivo',
    budget: 'Presupuesto',
    timeline: 'Plazo',
    district: 'Zona',
  },
  /** Added to the label of an optional field (there are no asterisks). */
  optional: ', opcional',

  /** «Куда ответить» tiles (four in a row on desktop: keep them short). */
  channels: {
    telegram: 'Telegram',
    whatsapp: 'WhatsApp',
    phone: 'Llamada',
    email: 'Correo',
  },
  /** Label of the contact field for the chosen channel. */
  contactLabels: {
    telegram: 'Usuario o número de Telegram',
    whatsapp: 'Número de WhatsApp',
    phone: 'Teléfono',
    email: 'Correo electrónico',
  },
  placeholders: {
    telegram: '@usuario o +00 000 000 000',
    email: 'nombre@ejemplo.com',
  },
  /** Under the phone field when the visitor chose a call. */
  phoneHoursHint: 'El asesor le llamará entre las {open} y las {close}, hora de Phuket',

  /** Phone field: hidden label of the code selector and the country names (codes are facts in field.tsx). */
  phone: {
    countryCodeLabel: 'Código de país',
    countries: {
      ru: 'Rusia',
      kz: 'Kazajistán',
      by: 'Bielorrusia',
      uz: 'Uzbekistán',
      kg: 'Kirguistán',
      am: 'Armenia',
      ge: 'Georgia',
      az: 'Azerbaiyán',
      th: 'Tailandia',
      id: 'Indonesia',
      ae: 'Emiratos Árabes Unidos',
      kh: 'Camboya',
      tr: 'Turquía',
      il: 'Israel',
      de: 'Alemania',
      other: 'Otro país',
    },
  },

  /** Consent checkbox (copy-global §9). The link texts go to /consent and /privacy: legal wording. */
  consent: {
    label: { before: 'Doy mi ', link: 'consentimiento para el tratamiento de datos personales', after: '' },
    description: { before: 'Cómo guardamos y usamos los datos se explica en la ', link: 'política de privacidad', after: '' },
  },

  /** Hidden field for bots: screen readers skip it, the label only helps a human who reaches it. */
  honeypot: 'Deje este campo vacío',

  /** Validation messages (copy-global §8.3): say what to fix, never «ошибка». Also returned by the lead API. */
  // Translated by the developers so the lead API answers in the visitor's language from day one: review them.
  // Reviewed: «bróker» → «asesor» (site glossary), the «undecided» option name, the offline sentence.
  messages: {
    nameEmpty: 'Indique cómo debemos dirigirnos a usted',
    nameLong: 'Acorte el nombre a 60 caracteres',
    channel: 'Elija dónde quiere recibir la respuesta',
    telegramEmpty: 'Indique el usuario o el número vinculado a su Telegram',
    telegramNick: 'El usuario de Telegram tiene de 5 a 32 caracteres: letras latinas, números o _, por ejemplo @juan_perez',
    phoneEmpty: 'Indique su número de teléfono',
    /** A +7 number (Russia, Kazakhstan) with too few digits. */
    phoneShortRu: 'Revise el número: después de +7 deben ir 10 dígitos',
    phoneShortOther: 'Revise el número: faltan dígitos después del código de país',
    phoneLong: 'El número tiene dígitos de más. Revise que el código de país no esté repetido',
    emailEmpty: 'Indique su correo electrónico',
    emailBad: 'Revise la dirección de correo, por ejemplo nombre@ejemplo.com',
    format: 'Elija el formato de la reunión',
    direction: 'Elija un destino o la opción «Aún sin decidir»',
    date: 'Elija una fecha',
    time: 'Elija una hora',
    slotTaken: 'Esta hora se acaba de reservar. Elija otra',
    /** {n}: the current length of the text. */
    commentLong: 'Acorte el texto a 1000 caracteres; ahora tiene {n}',
    consent: 'Para enviar la solicitud, marque la casilla de consentimiento para el tratamiento de datos',
    /** Quiz answers come from tiles; this only shows if a request was tampered with. */
    choice: 'Elija una de las opciones',
    /** {fields}: field names joined with commas. */
    summary: 'La solicitud no se ha enviado. Corrija los campos: {fields}',
    offline: 'No hay conexión a internet. Sus datos siguen en el formulario. Compruebe la conexión y vuelva a enviar la solicitud',
    /** {phone}: the broker's number. */
    server: 'La solicitud no se ha enviado por un fallo de nuestra parte. Sus datos siguen en el formulario. Vuelva a enviarla o llámenos: {phone}',
    /** 429: a retry within 10 minutes fails the same way, so the sentence leads to the phone and Telegram. */
    rateLimited: 'La solicitud no se ha enviado: hubo demasiados intentos seguidos desde su conexión. Llámenos o escríbanos por Telegram: {phone}',
    /** {when}: «до 16:55», «завтра до 5:15 по вашему времени»… (`common.reply.when`). */
    duplicate: 'Ya tenemos una solicitud con este contacto. El asesor le responderá {when}',
  },

  /** Error summary heading before the field links. */
  summaryLead: 'La solicitud no se ha enviado. Corrija los campos:',
  /** Submit button while sending (same width as the label: keep it short). */
  sending: 'Enviando…',
  retry: 'Volver a enviar',
  call: 'Llamar',
  /** Under every submit button. */
  channelNote: 'Solo escribimos por el canal elegido. Llamamos si nos lo pide',

  /** Quiz options (question texts are in podbor.ts). Tiles: label one line, description up to two. */
  options: {
    directions: {
      phuket: { label: 'Phuket', description: '6 zonas, apartamentos y villas' },
      pattaya: { label: 'Pattaya', description: 'Ciudad costera continental' },
      bali: { label: 'Bali', description: 'Propiedad: otras normas que en Tailandia' },
      dubai: { label: 'Dubái', description: 'Visa de residente al comprar desde un importe fijado' },
      cambodia: { label: 'Camboya', description: 'Apartamentos junto al mar' },
      undecided: { label: 'Aún no lo sé', description: 'El asesor compara países para su caso' },
    },
    /** «Направление» in the viewing form. */
    formDirections: {
      phuket: 'Phuket',
      pattaya: 'Pattaya',
      bali: 'Bali',
      dubai: 'Dubái',
      cambodia: 'Camboya',
      undecided: 'Aún sin decidir',
    },
    /** Phuket districts the quiz accepts from `?district=`. */
    districts: {
      layan: 'Layan',
      'bang-tao': 'Bang Tao',
      kamala: 'Kamala',
      'karon-kata': 'Karon y Kata',
      'nai-harn-rawai': 'Nai Harn y Rawai',
      chalong: 'Chalong',
    },
    goals: {
      income: { label: 'Ingresos por alquiler o reventa', description: 'Ocupación por temporada y precio por fase de obra' },
      wintering: { label: 'Uso en invierno, alquiler el resto', description: 'Usted vive de noviembre a marzo; luego se alquila' },
      relocation: { label: 'Mudanza y estancia larga', description: 'Explicamos qué visas hay en el país elegido' },
      capital: { label: 'Guardar capital en divisas', description: 'Revisamos la promotora y si será fácil revender' },
    },
    /**
     * Budget tiles. The bounds are facts in src/lib/lead.ts (thousands of US dollars: 150, 300, 600);
     * {min} and {max} are those numbers formatted for the locale. Keep the currency and the
     * «thousand» unit in the template: «До 150 тыс. $», «$150–300k».
     * Spanish: «USD», since a bare «$» reads as pesos in much of Latin America; «k» keeps the tile
     * within 14 characters («Hasta 150k USD»).
     */
    budgets: {
      upTo: 'Hasta {max}k USD',
      range: '{min}–{max}k USD',
      from: 'Desde {min}k USD',
      unsure: {
        label: 'Ver qué es realista con mi presupuesto',
        description: 'El asesor le pedirá la suma por mensaje y le mostrará qué puede comprar',
      },
    },
    timelines: {
      month: { label: 'En el próximo mes', description: '' },
      '1-3': { label: 'En 1–3 meses', description: '' },
      '3-6': { label: 'En 3–6 meses', description: '' },
      exploring: { label: 'Solo me informo', description: 'La selección le orienta en precios. Sin presión' },
    },
    /** «Формат» of the consultation on /services/deal (three tiles in a row). */
    consultationFormats: {
      video: 'Videollamada',
      call: 'Llamada',
      meeting: 'Reunión en Phuket',
    },
    /** «Формат» of the booking on /contacts. */
    viewingFormats: {
      viewing: { label: 'Visita en Phuket', description: 'Cita en la propiedad, dirección tras reservar' },
      online: { label: 'Visita virtual', description: 'Visita guiada por videollamada' },
      video: { label: 'Videoconsulta', description: '30 min: meta, zonas, presupuesto' },
      call: { label: 'Llamada', description: 'Lo mismo, por teléfono' },
    },
  },

  /** Date tiles of the booking forms (dates themselves are formatted by locale). */
  dates: {
    legend: 'Fecha',
    hint: 'Próximos 14 días',
  },
  /** Time slots: «11:00 на Пхукете» / «07:00 у вас». {time} is formatted by locale. */
  slots: {
    legend: 'Hora en Phuket',
    hint: 'Al lado verá su hora local',
    phuket: '{time} en Phuket',
    phuketAndYou: '{time}, también su hora',
    local: '{time}, su hora',
  },

  /** Booking forms on /services/deal (consultation) and /contacts (viewing). */
  booking: {
    format: 'Formato',
    direction: 'Destino',
    commentConsultation: 'Qué ha elegido ya',
    commentViewing: 'Qué quiere tratar',
    placeholderConsultation: 'Nombre del proyecto o enlace',
    placeholderViewing: 'Por ejemplo, villas junto al mar hasta 300k USD',
    submitConsultation: 'Reservar una consulta',
    submitViewing: 'Reservar',
    /** Under the viewing button. {when}: `common.reply.when`. */
    confirmLine: 'El asesor confirmará la cita {when}',
    confirmFallback: 'El asesor confirmará la cita en 15 minutos',
  },

  /** Thank-you screens of the booking forms (copy-global §10.2, §10.3). */
  thanks: {
    consultationTitle: 'Consulta reservada',
    viewingTitle: 'Visita reservada',
    /** {day}: «12 ноября»; {local}/{phuket}: times formatted by locale. */
    slotPhuket: '{day}, a las {phuket}, hora de Phuket',
    slotSameZone: '{day}, a las {phuket}. Su hora y la de Phuket coinciden',
    slotLocal: '{day}, a las {local} en su hora local; en Phuket serán las {phuket}',
    /** «напишет в Telegram»: the {writes} part of the sentences below. */
    writes: {
      telegram: 'le escribirá por Telegram',
      whatsapp: 'le escribirá por WhatsApp',
      email: 'le escribirá por correo',
      phone: 'le llamará',
    },
    /** «в Telegram»: the {via} part («подтвердит время в Telegram»). */
    via: {
      telegram: 'por Telegram',
      whatsapp: 'por WhatsApp',
      email: 'por correo',
      phone: 'por teléfono',
    },
    /** By format. {writes}, {via}: above; {when}: `common.reply.when`. */
    formats: {
      video: 'El asesor {writes} {when}, confirmará la hora y le enviará el enlace de la llamada',
      call: 'El asesor confirmará la hora {via} {when} y le llamará a la hora acordada',
      meeting: 'El asesor {writes} {when}, confirmará la hora y le enviará la dirección de la reunión',
      viewing: 'El asesor {writes} {when}, concretará qué propiedades mostrarle y le enviará la dirección de la reunión',
      online: 'El asesor {writes} {when}, concretará qué propiedades mostrarle y le enviará el enlace de la videollamada',
    },
    change: 'Si cambian sus planes, responda al asesor en el mismo chat y le propondrá otra hora',
    guideCta: 'Abrir la guía del inversor',
    guideNote: 'El capítulo «La compra paso a paso» le será útil antes de la conversación',
  },

  /** Investor guide form (home page, copy-home §9) and its thank-you screen (copy-global §10.4). */
  guide: {
    formLabel: 'Recibir la guía',
    channelLegend: 'Dónde le enviamos la guía',
    /** Three tiles: no «Звонок» for a PDF. */
    channels: { telegram: 'Telegram', whatsapp: 'WhatsApp', email: 'Correo' },
    submit: 'Recibir guía',
    note: 'Le enviaremos la guía por el canal elegido',
    /** {channel}: «в Telegram», «на почту». */
    doneTitle: 'Le enviaremos la guía {channel}',
    to: { telegram: 'por Telegram', whatsapp: 'por WhatsApp', email: 'por correo' },
    /** {when}: `common.reply.when`. */
    doneEmail: 'Si tiene preguntas sobre la guía, responda a ese correo; el asesor le contestará {when}',
    doneChat: 'Si tiene preguntas sobre la guía, escríbalas en el mismo chat; el asesor le contestará {when}',
  },
} satisfies FormsDict
