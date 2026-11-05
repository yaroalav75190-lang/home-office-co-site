// Home page / (copy-home v1.0, 2 Nov 2026), ten blocks top to bottom. Facts the client had not
// given are set per docs/DEMO_DECISIONS.md for the promo version.
// Hrefs, photo keys, ids, figures and the order of rows stay in code (components/sections/home);
// lists keyed by id (verdicts, where, samples) follow the ids there. Page title and
// description: meta.home. Shared words: common.destinations, common.founder.

import type { HomeDict } from '../ru/home'

export const home = {
  /** Block 1: first screen. */
  hero: {
    /**
     * Two D1 display lines of the h1, the second indented (column 5 of 12 on desktop ≥1024 px,
     * where it reaches column 11, above the villa print). Each line must stay one line: the
     * translation of each must not be wider than the Russian one. Line 1 «Недвижимость»: 12
     * characters; line 2 «в Таиланде»: 10 characters (it has less room: it starts further right).
     * Spanish: «Inmuebles en» (12) / «Tailandia» (9); «en Tailandia» (12) would not fit line 2.
     */
    titleLines: ['Inmuebles en', 'Tailandia'],
    /** Lead under the title (136 characters, keep a similar length). Mentions paying from Russia: adapt. */
    lead: 'Agencia inmobiliaria en Phuket. Apartamentos y villas en Tailandia, Bali, Dubái y Camboya: búsqueda, documentos, pago desde el extranjero y alquiler',
    /** Primary button (one line, no wrap): keep it about as short as the Russian (16 characters). */
    cta: 'Buscar propiedad',
    /** Caption under the villa photo; «Пример формата»: the photo shows a format, not a listing. */
    printCaption: 'Ejemplo de formato: villa con piscina',
    /** Caption under the panorama. */
    panoramaCaption: 'Costa oeste de Phuket',
  },

  /** Block 2: row of figures. The figures themselves (5+, 100+, 15, 4) are in code. */
  figures: {
    /** Hidden h2 for screen readers. */
    title: 'Home Office & Co en cifras',
    /**
     * Unit (Lead, one short word, on the baseline of the figure) and the phrase under it. Each unit
     * follows its figure grammatically: experience «5+», clients «100+», reply «15», countries «4».
     */
    stats: {
      experience: {
        unit: 'años',
        /** The opening year (2026) is a promo decision the client confirms before launch. */
        text: 'de experiencia de nuestros especialistas en mercados internacionales. La agencia se fundó en 2026',
      },
      clients: { unit: 'clientes', text: 'han atendido nuestros especialistas en estos años' },
      reply: { unit: 'minutos', text: 'tarda el asesor en responder a una solicitud en horario laboral' },
      countries: { unit: 'países', text: 'Tailandia, Indonesia (Bali), EAU (Dubái) y Camboya' },
    },
  },

  /** Block 3: «Четыре побережья», one row per destination (names: common.destinations). */
  coasts: {
    /** «Четыре»: there are four rows. */
    title: 'Cuatro costas',
    lead: 'Trabajamos en cuatro países, sobre todo en Tailandia. Cada uno tiene sus propias normas de propiedad',
    /** Broker's verdict next to each destination, by destination id. */
    verdicts: {
      phuket: 'Nuestro destino principal: seis zonas, de Layan a Chalong. En Tailandia también trabajamos en Pattaya',
      bali: 'Las normas de propiedad no son las de Tailandia. Se las explicamos antes de elegir propiedad',
      dubai: 'Comprar a partir de un importe fijado da derecho a la visa de residente de los EAU',
      cambodia: 'Apartamentos junto al mar. Qué derechos tiene un extranjero sobre la vivienda lo vemos en la consulta',
    },
    /** Caption under the property photo of the Phuket row; «Пример объекта»: not a listing. */
    houseCaption: 'Ejemplo de propiedad: casa con piscina',
    /** Line after the rows, then a link to the quiz. «4 вопроса»: the quiz has four questions. */
    after: 'El país puede elegirlo junto con el asesor',
    afterLink: 'Buscar propiedad en 4 preguntas',
  },

  /**
   * Block 4: «Где жить, а где сдавать», the district scene. District names, verdicts, the «Кому
   * подходит» and «Что покупают» facts and photo captions come from the Phuket hub rows, so the
   * home page and /thailand/phuket never disagree.
   */
  districts: {
    title: 'Dónde vivir y dónde alquilar',
    lead: 'Seis zonas de Phuket, de norte a sur. En cada una se ve para quién es y qué se compra',
    /** Screen-reader name of the island drawing. */
    mapLabel: 'Mapa de Phuket: seis zonas de norte a sur',
    /** Screen-reader name of the list of district names that drives the scene. */
    navLabel: 'Zonas de Phuket',
    /** Small labels of the three facts (tight: keep them to two or three words). */
    factLabels: { where: 'Dónde', forWhom: 'Para quién', buy: 'Qué se compra' },
    /**
     * First word of the hub facts («Подходит тем, кто…», «Покупают виллы…»): under the labels above
     * the home page drops it and capitalizes the rest. Must equal the first word of the translated
     * hub facts; leave the string empty if the translation does not start with such a word.
     * Spanish hub facts start with «Para quienes…» and «Se compran…» (afterLabel accepts a
     * multi-word prefix), so the scene shows «Quienes…» and «Villas…».
     */
    hubVerbs: { forWhom: 'Para', buy: 'Se compran' },
    /** «Где»: position on the island, by district id (north to south). */
    where: {
      layan: 'Noroeste de la isla, al norte de Bang Tao',
      'bang-tao': 'Noroeste de la isla, en torno a la Laguna',
      kamala: 'Oeste de la isla, entre Bang Tao y Patong',
      'karon-kata': 'Suroeste de la isla, al sur de Patong',
      'nai-harn-rawai': 'Extremo sur de la isla, junto al cabo Promthep',
      chalong: 'Sureste de la isla, junto a la bahía de Chalong',
    },
    /** Link to a district page under its block. {name}: district name, «Банг Тао подробно». */
    more: '{name} en detalle',
    /** Link under the scene. */
    allLink: 'Todas las zonas de Phuket',
  },

  /** Block 5: FAQ. */
  faq: {
    /** «Пять»: there are five questions. */
    title: 'Cinco preguntas de la primera llamada',
    /** Questions and answers. Question 3 is about paying from Russia: adapt for the audience. */
    items: [
      {
        q: '¿Puede un extranjero ser propietario de un inmueble en Tailandia?',
        a: 'Sí. Un extranjero puede inscribir a su nombre un apartamento en un condominio en propiedad plena (freehold). Pero los extranjeros no pueden poseer más del 49 % de la superficie de los apartamentos de un edificio, así que comprobamos la cuota disponible antes de reservar. Un extranjero no puede comprar terreno en propiedad: la villa se formaliza mediante un arrendamiento del terreno a 30 años (leasehold). La renovación se prevé en el contrato, y le explicamos qué solidez tiene esa cláusula en el suyo.',
      },
      {
        q: '¿Cuánto cuesta el metro cuadrado?',
        a: 'No hay un precio único. El metro depende de la zona, la distancia al mar y la fase de obra, y las promotoras suben el precio por fases, así que la lista de precios del año pasado se queda vieja enseguida. En lugar de una cifra media, le enviamos de 3 a 5 proyectos dentro de su presupuesto, cada uno con su precio actual, el tipo de propiedad y sus inconvenientes. La selección le llega en 24 horas.',
      },
      {
        q: '¿Cómo se paga la compra desde el extranjero?',
        a: 'Por vías legales que funcionan hoy. El apartamento se inscribe en propiedad si el dinero llega a Tailandia desde el extranjero en divisas: el banco emite una confirmación de la transferencia y, sin ella, la propiedad no se registra. No ofrecemos fórmulas para eludir restricciones. Las formas de pago las vemos en la consulta: las normas cambian, y el asesor le indica las que la agencia utiliza ahora para tramitar pagos.',
      },
      {
        q: '¿Qué zona conviene para vivir y cuál para alquilar?',
        a: 'Depende del objetivo y de cuántos meses al año pase en la isla. A una familia que vive aquí todo el año le importan las escuelas y los trayectos; para alquilar pesan más la playa y la demanda en temporada. Las seis zonas de Phuket se describen brevemente más arriba. La respuesta exacta para su caso se la da la búsqueda: 4 preguntas, y el asesor le propondrá zonas y proyectos.',
      },
      {
        q: '¿Comprar un inmueble da derecho a una visa?',
        a: 'En Tailandia, la compra por sí sola no da derecho a visa. Para vivir en el país durante largos periodos hace falta un programa aparte de residencia de larga duración. En los EAU, comprar un inmueble a partir de un importe fijado da derecho a la visa de residente. Los umbrales y las condiciones cambian, así que analizamos su caso en la consulta según las normas vigentes.',
      },
    ],
  },

  /** Block 6: «От звонка до ключей». */
  process: {
    title: 'De la llamada a las llaves',
    /** «Пять»: there are five steps. */
    lead: 'Cinco etapas y un mismo asesor en todo el proceso',
    /**
     * Five steps in order, no visible numbers: the order is carried by the when field, a short
     * opening phrase set in UI 500 on its own line (ends with a full stop).
     */
    steps: [
      {
        when: 'Primero.',
        text: 'Concretamos el objetivo y el presupuesto. En el sitio no hay catálogo porque cada selección se prepara a mano: de 3 a 5 proyectos y una explicación de por qué el resto no encajaba. Mostramos las propiedades en persona o por videollamada.',
      },
      {
        when: 'Antes de reservar.',
        text: 'Revisamos los documentos del terreno, la licencia de obra, la cuota extranjera disponible y cómo entregó la promotora sus edificios anteriores. No le propondremos un proyecto de riesgo.',
      },
      {
        when: 'El día del pago.',
        text: 'El dinero sigue una vía legal y llega a Tailandia en divisas, con confirmación bancaria. Sin ella, el apartamento no puede inscribirse en propiedad.',
      },
      {
        when: 'En la entrega.',
        text: 'Revisamos el apartamento según el contrato antes de firmar el acta de recepción, anotamos los defectos y se los trasladamos a la promotora. Después llegan el registro de la propiedad y las llaves.',
      },
      {
        when: 'Tras las llaves.',
        text: 'Le ayudamos a alquilar el apartamento a través de empresas de gestión asociadas y a revenderlo cuando lo decida.',
      },
    ],
    /** Link to /services/deal. */
    link: 'Más sobre la gestión de la compra',
    /** Photo captions; «Пример формата»: the photo shows a format, not a listing. */
    captions: {
      kata: 'Kata, costa oeste de Phuket',
      naiharn: 'Nai Harn, sur de Phuket',
      condo: 'Ejemplo de formato: condominio con piscina común',
    },
  },

  /** Block 7: «Мы сами инвестируем» (the founder; name and role: common.founder). */
  invest: {
    /** Hidden h2. */
    title: 'Invertimos nosotros mismos',
    /** The founder's quote, D3. Wording kept for the promo; the client confirms it before launch. */
    quote: 'Compramos para nosotros donde le aconsejamos comprar a usted',
    /** Signature under the quote. {name}: the founder's first name. */
    author: '{name}, fundador de Home Office & Co',
    text: 'El equipo compra inmuebles para sí mismo e invierte en proyectos conjuntos con clientes. En la selección, cada proyecto tiene un apartado de inconvenientes que redacta el propio asesor.',
  },

  /**
   * Block 8: client reviews. PROMO SAMPLES, not real reviews: every one is shown with the
   * sampleLabel line and a city, never a name. Keep them labelled as samples in every language.
   */
  review: {
    /** Hidden h2. */
    title: 'Reseñas de clientes',
    /** Link to all reviews (not shown until /reviews exists). */
    allLabel: 'Todas las reseñas',
    /** Under every sample review: says it is an example. Never drop or soften it. */
    sampleLabel: 'Ejemplo de reseña',
    /** Line under the city. {purchase}: the sample's purchase. */
    purchase: 'Compra: {purchase}',
    /**
     * Sample reviews, by the district of the purchase (drawn on the island next to the first one;
     * the order is in code). quote: up to 25 words, no quotation marks. city: where the buyer is
     * from (Russian cities in the Russian version). place: caption under the island drawing.
     */
    samples: {
      'bang-tao': {
        quote:
          'El asesor señaló los inconvenientes de cada proyecto antes de la visita. Dos se descartaron tras revisar documentos; elegimos un apartamento junto a la Laguna',
        city: 'Krasnoyarsk',
        purchase: 'apartamento en condominio, Bang Tao',
        place: 'Bang Tao en el mapa de Phuket',
      },
      'nai-harn-rawai': {
        quote:
          'Vimos la propiedad por videollamada y revisamos el contrato con un abogado. Volamos a Tailandia ya para recoger las llaves',
        city: 'Moscú',
        purchase: 'villa, Rawai y Nai Harn',
        place: 'Rawai y Nai Harn en el mapa de Phuket',
      },
      'karon-kata': {
        quote:
          'Respondieron en 10 minutos y nunca nos presionaron. En invierno vivimos en el apartamento; el resto del año lo alquila la empresa de gestión',
        city: 'Novosibirsk',
        purchase: 'apartamento para pasar el invierno, Kata y Karon',
        place: 'Kata y Karon en el mapa de Phuket',
      },
    },
  },

  /**
   * Block 9: investor guide (the form has its words in the forms dictionary). Written for buyers
   * from Russia: adapt.
   */
  guide: {
    /**
     * h2 at D2 in seven of twelve columns and the cover title at D3: the longest word must fit one
     * line (Russian «приукрашивания», 14 characters).
     */
    title: 'Phuket sin adornos',
    text: 'Guía del inversor para compradores internacionales, 2026/27. Ocho capítulos y 20 minutos de lectura: qué puede comprar un extranjero, cómo pagar la compra de forma legal, dónde vivir y dónde alquilar, qué esperar del alquiler.',
    /** Small line on the cover, under the title (the cover column is 16 characters wide; it wraps). */
    coverSubtitle: 'Guía del inversor para compradores internacionales',
    /** Edition on the cover. */
    coverYear: '2026/27',
  },

  /** Block 10: closing line (the reply time and the contacts are added by the component). */
  closing: {
    /** Start of the closing sentence; «, и брокер ответит до 16:55» follows (common.reply.closing). */
    title: 'Cuéntenos qué busca',
    note: 'Nos reunimos en persona en Phuket, en las propiedades y en centros de negocios. Si está en otro país, le mostramos la propiedad por videollamada',
  },

  /** JSON-LD of the organisation and the website (not shown on the page). */
  jsonLd: {
    description: 'Agencia inmobiliaria internacional: Tailandia (Phuket, Pattaya), Bali, Dubái, Camboya.',
    /** Countries served, full official names. */
    areaServed: ['Tailandia', 'Indonesia', 'Emiratos Árabes Unidos', 'Camboya'],
    /**
     * The brand written in this language's script, for search. «Home Office and Co» is always added
     * in code; leave the list empty for a language written in Latin script.
     */
    alternateNames: [],
  },
} satisfies HomeDict
