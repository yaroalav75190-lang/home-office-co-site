// /podbor: the quiz «Подбор объекта» (copy-podbor, copy-global §10.1) and the blocks under it.
// Answer options (directions, goals, budgets, timelines) are in forms.ts `options`.

import type { PodborDict } from '../ru/podbor'

export const podbor = {
  /** Screen-reader names of the two sections of the page. */
  sectionLabel: 'Búsqueda de propiedad',
  aboutLabel: 'Sobre la búsqueda',

  quiz: {
    /** h1 (D2), visible on the first question only. */
    title: 'Búsqueda de propiedad',
    /**
     * Lead over the first question. {count}: the number word from `countWords` («Четыре», «Три»
     * when the country came from the link).
     */
    intro: '{count} preguntas y su contacto. El asesor le enviará de 3 a 5 proyectos, cada uno con sus inconvenientes',
    countWords: { three: 'Tres', four: 'Cuatro' },
    questions: {
      direction: '¿Dónde busca propiedad?',
      goal: '¿Para qué compra?',
      budget: '¿Con qué presupuesto cuenta?',
      timeline: '¿Cuándo piensa comprar?',
    },
    /** Progress line: «Вопрос 2 из 4». */
    progress: 'Pregunta {n} de {total}',
    lastStep: 'Último paso',
    /** Shown when the country came from the link: «Направление: Пхукет, Банг Тао» + «Изменить». */
    prefilled: 'Destino: {direction}',
    change: 'Cambiar',
    hint: 'Al elegir una opción, se abre la siguiente pregunta',
    /** Desktop only, after the hint. {n}: the number of options. */
    keysHint: '. Con el teclado: flechas o 1–{n}; Enter para continuar',
    personal: 'Le responde un asesor en persona. Solo escribimos por el canal que elija',
    back: 'Atrás',

    /** Photo column (desktop): {when} is `common.reply.when`. */
    columnLine: 'El asesor le escribirá {when} y en 24 horas le enviará de 3 a 5 proyectos',
    columnFallback: 'El asesor le escribirá en 15 minutos y en 24 horas le enviará de 3 a 5 proyectos',

    /** Contact step. */
    contactTitle: '¿Adónde le enviamos la selección?',
    /** {broker}: «брокер по Пхукету» from `brokerFor`. */
    whoAnswers: 'Le responderá {broker}',
    /** «брокер по Пхукету»: who answers, by the chosen direction (dative in Russian). */
    brokerFor: {
      none: 'un asesor especializado en Tailandia',
      undecided: 'un asesor especializado en Tailandia',
      phuket: 'un asesor especializado en Phuket',
      pattaya: 'un asesor especializado en Pattaya',
      bali: 'un asesor especializado en Bali',
      dubai: 'un asesor especializado en Dubái',
      cambodia: 'un asesor especializado en Camboya',
    },
    nameLabel: 'Nombre',
    submit: 'Recibir selección',

    /** Confirmation (copy-global §10.1). */
    doneTitle: 'Su solicitud ya está con el asesor',
    /** First line. {who}: `who` or `whoNamed`; {verb}: by channel; {when}: `common.reply.when`. */
    doneLead: '{who} {verb} {when}',
    /** Out of hours, appended to the first line. {time}: now on Phuket; {open}: opening time. */
    doneLeadClosed: '. Hora actual en Phuket: {time}; los asesores atienden desde las {open}',
    who: 'El asesor',
    /** {name}: the visitor's name, so the line reads «Ana, el asesor le escribirá…». */
    whoNamed: '{name}, el asesor',
    verbs: {
      telegram: 'le escribirá por Telegram',
      whatsapp: 'le escribirá por WhatsApp',
      email: 'le responderá por correo',
      phone: 'le llamará',
    },
    /** What happens next: three lines, each a bold lead and a sentence. */
    next: {
      /** First lead is the capitalised `common.reply.when` with a full stop: «До 16:55.» */
      firstFallback: 'En 15 minutos',
      first: {
        telegram: 'El asesor le escribirá por Telegram, se presentará y le hará una pregunta para precisar sus respuestas',
        whatsapp: 'El asesor le escribirá por WhatsApp, se presentará y le hará una pregunta para precisar sus respuestas',
        email: 'El asesor le escribirá por correo, se presentará y le hará una pregunta para precisar sus respuestas',
        phone: 'El asesor le llamará, se presentará y le hará una pregunta para precisar sus respuestas',
      },
      secondLead: 'En 24 horas.',
      second:
        'Le enviará de 3 a 5 proyectos por un enlace privado, cada uno con su precio actual, tipo de propiedad, fase de obra, pros y contras',
      thirdLead: 'Después, a su ritmo.',
      third: 'Si lo desea, el asesor revisará la selección con usted en 20 minutos, por teléfono o por videollamada',
    },
    guideCta: 'Abrir la guía del inversor',
    guideNote: 'PDF de 20 minutos de lectura. Ya tenemos su contacto: no hace falta otro formulario',
  },

  /** Under the quiz (copy-podbor «Под квизом»): h2 D3 + Body. */
  below: [
    {
      title: 'Cómo funciona la búsqueda',
      text: 'Usted responde a 4 preguntas y deja su contacto. El asesor revisa las respuestas, le hace una pregunta para precisarlas y prepara la selección a mano. Cada proyecto incluye sus inconvenientes.',
    },
    {
      title: 'Qué pasa después de la solicitud',
      text: 'El asesor le escribirá por el canal elegido en 15 minutos. Los asesores atienden de 9:00 a 21:00, hora de Phuket. Si nos escribe de noche, veremos la solicitud por la mañana y le responderemos antes de las 9:15, hora de Phuket. La selección le llegará por un enlace privado en 24 horas.',
    },
    {
      title: 'Por qué no hay catálogo en el sitio',
      text: 'La oferta actual está en los chats con las promotoras. Los precios y los apartamentos disponibles cambian más rápido de lo que se actualizaría un catálogo. El asesor selecciona proyectos según su objetivo y le explica por qué el resto no encajaba.',
    },
  ],
  privacy: {
    title: 'Privacidad',
    /** Two links inside: «{privacy}» → /privacy, «{consent}» → /consent (link texts below). */
    text: 'Usamos su contacto solo para responder a su solicitud. Cómo guardamos los datos se explica en la {privacy} y en el {consent}.',
    privacyLink: 'política de privacidad',
    consentLink: 'consentimiento para el tratamiento de datos',
  },
  dealLink: 'Gestión de la compra',
} satisfies PodborDict
