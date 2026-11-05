// /thailand/phuket, the Phuket hub (docs/content/copy-phuket.md), blocks in page order. Hrefs,
// anchors, photos and the order of keyed blocks stay in src/components/sections/phuket/content.ts;
// the six district rows and the district pages live in ./districts.ts.
//
// Legal facts the translation keeps as they are: a condominium flat is full ownership (freehold,
// «фрихолд») within the 49 % foreign quota of the building's floor area; land under a villa or a
// house is leased for 30 years (leasehold), the extension is written into the contract; the money
// comes to Thailand from abroad in foreign currency with a bank confirmation.

import type { PhuketDict } from '../ru/phuket'

export const phuket = {
  hero: {
    /**
     * h1, D1, two lines. From 1024 px each line is one unbreakable display line (whitespace-nowrap):
     * a translated line must not be wider than the Russian one (12 and 10 characters).
     * Spanish: «Inmuebles en» (12) / «Phuket» (6).
     */
    titleLines: ['Inmuebles en', 'Phuket'],
    lead: 'Una isla donde la zona importa más que los metros cuadrados. Seleccionamos apartamentos y villas en Phuket, de obra nueva y de reventa',
    /** Button to the quiz with Phuket preselected. */
    cta: 'Buscar en Phuket',
    /** Screen-reader name of the island drawing. */
    mapLabel: 'Mapa de Phuket: las seis zonas donde trabajamos',
    /** Screen-reader name of the list of district labels on the drawing. */
    mapNavLabel: 'Zonas en el mapa',
    /**
     * District labels on the island drawing (copy-phuket §1), by district id. Each is one line beside
     * the coast on the water side: keep them as short as the Russian (the longest, «Раваи и Най Харн»,
     * is 16 characters).
     */
    mapNames: {
      layan: 'Layan',
      'bang-tao': 'Bang Tao',
      kamala: 'Kamala',
      'karon-kata': 'Kata y Karon',
      'nai-harn-rawai': 'Rawai y Nai Harn',
      chalong: 'Chalong',
    },
  },

  /**
   * «Что знать до покупки»: five lines, each a big D2 figure (`value`) with its unit beside it in Lead
   * on one baseline (`unit`: «часа» 4, «месяцев» 7, «лет» 3, «часов» 5 characters; keep units that
   * short, they agree with the figure), then the phrase. The figures are facts: keep the numbers.
   * Keyed by stable ids; the order of the lines is set in code (content.ts `phuketPage.know.order`).
   */
  know: {
    title: 'Qué saber antes de comprar',
    items: {
      /**
       * Russia-specific: the time difference with Moscow (Phuket is UTC+7). Spanish: the time zone
       * itself, per the translation guide §6a (UTC+7 all year, no daylight saving time).
       */
      timeDifference: {
        value: 'UTC+7',
        unit: '',
        text: 'es la hora de Phuket durante todo el año, sin cambio al horario de verano',
      },
      winterSeason: {
        value: '5',
        unit: 'meses',
        text: 'de noviembre a marzo, la isla recibe a quienes vienen a pasar el invierno. El resto del año la vivienda se puede alquilar',
      },
      /** Legal fact: the 49 % foreign quota. No unit: the figure carries «%». */
      foreignQuota: {
        value: '49 %',
        unit: '',
        text: 'de la superficie de los apartamentos de un edificio puede inscribirse en propiedad a nombre de extranjeros',
      },
      /** Legal fact: the 30-year land lease (leasehold). */
      landLease: {
        value: '30',
        unit: 'años',
        text: 'dura el arrendamiento del terreno de una villa para un extranjero (leasehold). La renovación se prevé en el contrato',
      },
      /**
       * Russia-specific: the direct Aeroflot flight from Moscow (Sheremetyevo) and its timetable.
       * Translated as is (guide §6a: no confirmed international equivalent; flagged to the lead).
       */
      flight: {
        value: '10',
        unit: 'horas',
        text: 'de vuelo directo desde Moscú. Según el horario de Aeroflot, desde Sheremétievo son 9 h 40 min, y el regreso, 10 h 15 min',
      },
    },
    /** Placeholder note for a figure the client has not given yet: renders «[заглушка: цифра]». */
    figureStub: 'cifra',
    photoCaption: 'Kata, costa oeste de Phuket',
  },

  /** «Шесть районов Пхукета»: the rows themselves are in ./districts.ts. */
  districtList: {
    title: 'Seis zonas de Phuket',
    lead: 'Para vivir y para alquilar convienen zonas distintas. En cada una indicamos para quién es y qué se compra',
    /** Link to the quiz under the list. */
    quiz: 'Elegir zona en 3 preguntas',
  },

  /**
   * «Право собственности». Legal terms are facts: freehold within the 49 % quota for a condominium
   * flat, a 30-year land lease for a villa. Keyed by kind of property; the order is set in code.
   */
  ownership: {
    title: 'Régimen de propiedad',
    parts: {
      condo: {
        title: 'Condominio: propiedad plena dentro de la cuota',
        text: 'Un extranjero puede inscribir a su nombre un apartamento en un condominio en propiedad plena (freehold). Los extranjeros no pueden poseer más del 49 % de la superficie de los apartamentos de un mismo edificio, por eso comprobamos la cuota disponible en ese edificio antes de reservar. El dinero de la compra debe llegar a Tailandia desde el extranjero en divisas, con confirmación bancaria.',
      },
      villa: {
        title: 'Villa y terreno: arrendamiento a largo plazo',
        text: 'Un extranjero no puede comprar terreno en propiedad. La villa se formaliza mediante un arrendamiento del terreno a 30 años (leasehold), con la renovación prevista en el contrato. Qué solidez tiene la cláusula de renovación en su contrato concreto se lo explicamos antes de reservar, junto con un abogado.',
      },
    },
    /**
     * Shown only once a partner lawyer has really checked the wording (copy-phuket §4).
     * {name}: the lawyer's name, set in code.
     */
    checkedBy: 'Redacción revisada por {name}',
    guide: 'Más detalles en la guía del inversor, capítulo 1',
  },

  /**
   * «Форматы, с которыми работаем» (QA round 1 §4), on the hub and the district pages: types of
   * property instead of project cards. Cards keyed by format id (photos and crops: content.ts).
   * `note` is the 24-hour line; `cta` the quiz link after the cards.
   */
  formats: {
    title: 'Formatos con los que trabajamos',
    lead: 'En qué se diferencian los formatos y a quién conviene cada uno. Los proyectos para su presupuesto los selecciona el asesor',
    note: 'Le enviamos una selección de proyectos en 24 horas',
    cta: 'Recibir selección',
    /** Labels of the two Small facts on every card. */
    ownershipLabel: 'Régimen de propiedad',
    suitsLabel: 'Para quién',
    items: {
      condo: {
        title: 'Apartamento en condominio',
        text: 'Apartamento en un edificio con piscina común, seguridad y empresa de gestión. Todos los propietarios pagan las cuotas de mantenimiento del edificio.',
        /** Legal fact: freehold within the 49 % quota. */
        ownership: 'Propiedad plena a su nombre (freehold), dentro de la cuota extranjera del 49 % de la superficie del edificio',
        suits: 'Quienes alquilan a través de una empresa de gestión o vienen a pasar el invierno',
        /** Under the photo; «Пример формата» says the photo shows a kind of property, not our project. */
        caption: 'Ejemplo de formato: condominio con piscina',
      },
      villa: {
        title: 'Villa con piscina',
        text: 'Casa independiente con piscina y parcela propias. Las villas se construyen de una en una o en urbanizaciones enteras con seguridad común.',
        /** Legal fact: the 30-year land lease. */
        ownership: 'El extranjero arrienda el terreno por 30 años (leasehold), con la renovación prevista en el contrato. La solidez de esa cláusula la revisamos con un abogado antes de reservar',
        suits: 'Familias que pasan el invierno en la isla y quienes alquilan la casa entera',
        caption: 'Ejemplo de formato: villa con piscina',
      },
      house: {
        title: 'Casa adosada o casa para vivir',
        text: 'En una casa adosada, las viviendas vecinas comparten muros. Una casa independiente ocupa su propia parcela dentro de una urbanización.',
        /** Legal fact: the 30-year land lease. */
        ownership: 'Como en la villa: arrendamiento del terreno a 30 años, con la renovación prevista en el contrato',
        suits: 'Quienes se mudan a Phuket por mucho tiempo y viven aquí todo el año',
        caption: 'Ejemplo de formato: casa para vivir',
      },
    },
  },

  /** Quiz link label: project cards, and the «Форматы» link when a page passes no label. */
  requestCta: 'Solicitar selección',

  /**
   * «С чем работаем сейчас»: project cards. NOT RENDERED since QA round 1 §4 («Форматы» shows
   * instead); kept for the real project cards. The `…Stub` words render inside «[заглушка: …]».
   */
  projects: {
    title: 'Con qué trabajamos ahora',
    lead: 'Cuatro proyectos de las selecciones actuales. La lista completa, con pros y contras, se la enviamos por mensajería',
    /** Line under the price. */
    place: 'Phuket',
    photoStub: 'foto del proyecto con permiso de la promotora',
    nameStub: 'nombre del proyecto',
    typeStub: 'tipo de propiedad',
    /** Between the two stubs: «[тип объекта], сдача [квартал и год]». */
    handover: 'entrega',
    handoverStub: 'trimestre y año',
    price: 'Precio a consultar',
  },

  pattaya: {
    title: 'Pattaya, si busca una ciudad junto al mar',
    /** Legal fact: the 49 % quota. */
    text: 'Las mismas normas tailandesas: apartamento en propiedad dentro de la cuota del 49 %. Los precios y la demanda de alquiler son otros; los comparamos con Phuket según su presupuesto.',
    /** Link to the quiz with Pattaya preselected (until a Pattaya page exists). */
    link: 'Buscar en Pattaya',
    caption: 'Pattaya, costa del golfo de Tailandia',
  },

  faq: {
    title: 'Preguntas sobre la compra en Phuket',
    /**
     * Questions and answers, in this order. Legal facts: the 49 % quota, the 30-year lease, no visa
     * from buying property. The third question («из России») is Russia-specific.
     */
    items: [
      {
        q: '¿Puede un extranjero comprar en propiedad un apartamento en Phuket?',
        a: 'Sí, si es un apartamento en un condominio y la cuota extranjera del edificio no está agotada: los extranjeros pueden poseer hasta el 49 % de la superficie de los apartamentos. La propiedad se inscribe a su nombre. Con una villa el esquema es otro: el extranjero arrienda el terreno por 30 años. Más detalles en el bloque «Régimen de propiedad», más arriba.',
      },
      {
        q: '¿Cuánto cuesta un inmueble en Phuket?',
        a: 'El precio depende de la zona, la distancia al mar, la categoría del edificio y la fase de obra. Las promotoras lo suben por fases de construcción, así que la lista de precios del año pasado se queda vieja enseguida. Le enviamos una selección con precios actuales en las 24 horas siguientes a la búsqueda; el precio exacto de cada propiedad lo confirma el asesor.',
      },
      {
        q: '¿Cómo se paga un apartamento en Phuket desde el extranjero?',
        a: 'Solo por vías legales que funcionan hoy. No ofrecemos fórmulas para eludir restricciones. Un edificio en construcción suele pagarse a plazos según el calendario de la promotora, y cada pago llega desde el extranjero en divisas, con confirmación bancaria. Qué vías utiliza ahora la agencia para tramitar pagos se lo explica el asesor en la consulta.',
      },
      {
        q: '¿En qué zona de Phuket vivir y en cuál comprar para alquilar?',
        a: 'Depende de su plan: vivir en invierno y alquilar en verano, alquilar todo el año o mudarse. Para cada plan convienen zonas distintas. Más arriba, en esta misma página, tiene la comparación de las seis zonas. Si duda entre dos, el asesor le mostrará cuántos apartamentos similares se alquilan ya cerca de cada proyecto.',
      },
      {
        q: '¿Obtendré una visa si compro un apartamento en Phuket?',
        a: 'No. En Tailandia, comprar un inmueble no da derecho a visa por sí solo. Para vivir en la isla durante largos periodos hace falta un programa aparte de residencia de larga duración. Las condiciones de estos programas cambian, así que analizamos su caso en la consulta según las normas vigentes.',
      },
      {
        q: '¿Conviene fiarse de la rentabilidad garantizada?',
        a: 'No damos garantías de rentabilidad. La garantía de la promotora suele estar ya incluida en el precio del apartamento. Calculamos la ocupación real por temporadas, los gastos de gestión y los impuestos, y le mostramos el cálculo de una propiedad concreta. El cálculo es ilustrativo y no constituye una recomendación de inversión personalizada.',
      },
      {
        q: '¿Está sobrecalentado el mercado de Phuket?',
        a: 'El mercado no es homogéneo: en algunas zonas hay más apartamentos nuevos que inquilinos. Le diremos cuáles son y le mostraremos cuántos apartamentos similares se alquilan ya cerca del proyecto. En la selección, cada proyecto tiene un apartado de inconvenientes.',
      },
    ],
  },

  closing: {
    /** Start of the closing sentence; the site appends the reply part («, и брокер ответит до 16:55»). */
    title: 'Cuéntenos qué busca en Phuket',
    cta: 'Buscar en Phuket',
  },

  /** schema.org names in the JSON-LD of the hub and the district pages (not shown on the page). */
  place: {
    name: 'Phuket',
    country: 'Tailandia',
  },
} satisfies PhuketDict
