// Phuket districts: the six rows of the hub (/thailand/phuket, copy-phuket §3, also shown in the
// home page district scene) and the district pages (/thailand/phuket/[district], copy-bang-tao).
// Keyed by district id. Ids, slugs, photos, coordinates, hrefs and the `ready` flag stay in
// src/components/sections/phuket/districts.ts. The broker checks the district texts before launch.
//
// Legal facts the translation keeps: a condominium flat in ownership within the 49 % foreign quota,
// a villa through a 30-year land lease. Distances and times (7 km, 25 minutes…) are facts too.

import type { DistrictsDict } from '../ru/districts'

export const districts = {
  /**
   * Hub rows, north to south, by district id. `name`: as the hub writes it («Ката и Карон», «Раваи и
   * Най Харн»), a D2 heading. `facts`: who it suits («Подходит тем, кто…»), then what is bought
   * («Покупают…»), in this order. `photoCaption`: under the row's 3:2 photo (a neighbouring beach
   * says whose neighbour it is).
   * Spanish facts start with «Para quienes…» and «Se compran…»: `home.districts.hubVerbs` strips
   * these prefixes in the home page scene, so keep them on every row.
   */
  districts: {
    layan: {
      name: 'Layan',
      verdict: 'Playa tranquila en el extremo norte de la bahía de Bang Tao, junto al parque nacional de Sirinat',
      facts: [
        'Para quienes buscan tranquilidad y naturaleza cerca de casa',
        'Se compran villas y apartamentos, también en residencias de marca',
      ],
      photoCaption: 'Playa Banana, al norte de Layan',
    },
    'bang-tao': {
      name: 'Bang Tao',
      verdict: 'Una playa de unos 7 km en el noroeste y la Laguna, con seis hoteles y un campo de golf',
      facts: [
        'Para quienes quieren una playa tranquila y la Laguna cerca',
        'Se compran apartamentos en condominios y villas, también en la Laguna',
      ],
      photoCaption: 'Bang Tao, costa oeste de Phuket',
    },
    kamala: {
      name: 'Kamala',
      verdict: 'Bahía con una playa de unos 3 km entre Surin y Patong, rodeada por un pueblo',
      facts: [
        'Para quienes quieren una playa tranquila cerca de Patong',
        'Se compran apartamentos en condominios y villas en las laderas',
      ],
      photoCaption: 'Kamala, costa oeste de Phuket',
    },
    'karon-kata': {
      name: 'Kata y Karon',
      verdict: 'Las playas de Kata y Karon, en el suroeste, rodeadas de hoteles, cafés y tiendas',
      facts: [
        'Para quienes quieren vivir en una zona turística junto a la playa',
        'Se compran apartamentos en condominios',
      ],
      photoCaption: 'Kata, costa oeste de Phuket',
    },
    'nai-harn-rawai': {
      name: 'Rawai y Nai Harn',
      verdict: 'El sur de la isla: de Rawai salen barcos hacia las islas cercanas; en Nai Harn, la playa está junto a un lago',
      facts: [
        'Para quienes pasan largas temporadas en la isla',
        'Se compran apartamentos en condominios y villas',
      ],
      photoCaption: 'Nai Harn, sur de Phuket',
    },
    chalong: {
      name: 'Chalong',
      verdict: 'Bahía en el sureste con fondeadero para yates y un muelle del que salen barcos hacia las islas',
      facts: [
        'Para quienes navegan en yate o van a menudo a las islas',
        'Se compran casas y villas en urbanizaciones',
      ],
      photoCaption: 'Gran Buda en la colina Nakkerd, sobre Chalong y Kata',
    },
  },

  /**
   * First line of a district page h1 (D1); the second line is the page's `namePrep` («в Банг Тао»).
   * From 1024 px each line is one unbreakable display line (whitespace-nowrap): not wider than the
   * Russian (12 characters). Spanish: «Inmuebles en» (12) / «Bang Tao» (8).
   */
  heroTitle: 'Inmuebles en',

  /** District pages, by district id. Only districts with a page in code have copy here. */
  pages: {
    'bang-tao': {
      /**
       * Second line of the h1: «в Банг Тао». Preposition and case are set by hand, never generated
       * (seo-brief §4.3). One unbreakable D1 line from 1024 px: not wider than the Russian (10 characters).
       * Spanish: the preposition ends line 1 («Inmuebles en»), so this line is the bare name.
       */
      namePrep: 'Bang Tao',
      hero: {
        lead: 'Zona del noroeste de Phuket, en torno a la Laguna. Le contamos a quién le conviene y a quién no',
        /** Button to the quiz with Phuket and this district preselected. */
        cta: 'Buscar en Bang Tao',
        /** Screen-reader name of the large locator. */
        mapLabel: 'Bang Tao en el mapa de Phuket',
        /** Under the 21:9 photo «в край» under the hero. */
        panoramaCaption: 'Playa Banana, Choeng Thale, 3 km al norte de Bang Tao',
      },
      /** «Где Банг Тао и что рядом» (wireframe «Лоция района»). */
      facts: {
        title: 'Dónde está Bang Tao y qué hay cerca',
        paragraphs: [
          'De las zonas donde trabajamos, las más cercanas son Layan, al norte, y Kamala, al sur.',
          'La mayor parte de la bahía la ocupa la Laguna, un complejo construido sobre antiguas minas de estaño. En más de 400 hectáreas hay seis hoteles, un campo de golf de 18 hoyos y proyectos residenciales, desde apartamentos hasta villas.',
          'El aeropuerto está a unos 25 minutos en coche, y Patong, a unos 20. Dentro de la Laguna, los hoteles y las tiendas se comunican con lanzaderas y con un barco que cruza la laguna.',
        ],
        /**
         * Label over value, seven in this order: the first four are short and share a row in pairs,
         * the last three (prices, rent, title) take the full width.
         */
        items: [
          { term: 'Al aeropuerto', value: 'Unos 25 minutos en coche' },
          { term: 'Playa', value: 'Unos 7 km a lo largo de la bahía. Para bañarse, mejor en la estación seca' },
          { term: 'Para quién', value: 'Quienes quieren una playa tranquila y la Laguna cerca' },
          {
            term: 'Qué se compra',
            value: 'Apartamentos en condominios y villas, también en la Laguna',
          },
          {
            term: 'Precios',
            value:
              'Dependen de la categoría del edificio, la distancia al mar y la fase de obra. Le enviaremos cifras actuales en la selección; el precio exacto de cada propiedad lo confirma el asesor',
          },
          {
            term: 'Alquiler',
            value:
              'La temporada turística va de noviembre a abril; de mayo a octubre llega el monzón. No prometemos ingresos garantizados: calculamos la ocupación por temporadas, los gastos de gestión y los impuestos',
          },
          {
            term: 'Régimen de propiedad',
            /** Legal facts: the 49 % quota and the 30-year land lease. */
            value: 'Apartamento en condominio en propiedad, dentro de la cuota del 49 %. Villa mediante arrendamiento del terreno a 30 años',
          },
        ],
      },
      life: {
        title: 'La vida en Bang Tao',
        text: 'La vida diaria gira en torno a la Laguna. Los hoteles tienen restaurantes y spas, y el campo de golf está al lado. En la playa hay cafés sencillos, más baratos que los de los hoteles. No hay vida nocturna como en Patong, que queda a unos 20 minutos en coche.',
        /** The author asks for his name next to this photo: keep «Фото: Anton Zelenov» (credit, not text). */
        portraitCaption: 'Atardecer en Bang Tao, costa oeste de Phuket. Foto: Anton Zelenov',
        squareCaption: 'Ejemplo de formato: villa con piscina',
      },
      /** «Без приукрашивания»: minuses on every district page. */
      honest: {
        title: 'Sin adornos',
        lead: 'Toda zona tiene inconvenientes. Se los decimos antes de la visita',
        pros: {
          title: 'Por qué eligen Bang Tao',
          items: [
            'Una playa larga y tranquila, de unos 7 km',
            'La Laguna, con restaurantes, spas y campo de golf en la propia zona',
            'El aeropuerto, a 25 minutos en coche. Desde Karon, en el suroeste, el trayecto lleva casi una hora',
          ],
        },
        cons: {
          title: 'Lo que conviene saber',
          items: [
            'En la zona se construye mucho. Comprobamos qué se levantará cerca de su proyecto y cuántos apartamentos similares se alquilan ya',
            'En edificios con muchos compradores extranjeros, la cuota del 49 % puede agotarse. Comprobamos la cuota disponible en cada edificio antes de reservar',
            'De mayo a octubre hay corrientes fuertes en la costa oeste. No todos los días se puede nadar: fíjese en las banderas de la playa',
            'Sin coche o moto propios resulta incómodo: en la Laguna hay pocos taxis y los trayectos son caros',
          ],
        },
        guide: 'Alquiler sin ilusiones: capítulo 5 de la guía del inversor',
      },
      /** «Проекты в Банг Тао»: project cards, NOT RENDERED since QA round 1 §4 («Форматы» instead). */
      projects: {
        title: 'Proyectos en Bang Tao',
        lead: 'Dos proyectos de la selección actual. El resto se lo enviamos en una lista con pros y contras',
        caption: 'Bang Tao, costa oeste de Phuket',
      },
      /** «Соседи по берегу»: one line per neighbour, by district id (the list and order are set in code). */
      neighbours: {
        title: 'Vecinos de costa',
        items: {
          layan: {
            side: 'Al norte de Bang Tao',
            text: 'Más tranquila y verde que Bang Tao, con menos cafés y tiendas. Aquí se construyen villas y residencias de marca.',
          },
          kamala: {
            side: 'Al sur de Bang Tao',
            text: 'Bang Tao o Kamala: Kamala es más compacta, con una playa de unos 3 km y a unos 8 km de Patong. En las laderas que rodean la bahía hay villas.',
          },
        },
        /** Closes the block while the neighbours have no pages of their own (copy-bang-tao §6). */
        fallback: 'Todas las zonas de Phuket',
      },
      closing: {
        /** Start of the closing sentence; the site appends the reply part («, и брокер ответит до 16:55»). */
        title: 'Cuéntenos qué busca en Bang Tao',
        cta: 'Buscar en Bang Tao',
        /** Prefilled Telegram message (copy-bang-tao §7). Not used yet: the shared closing line has no prop for it. */
        telegramText: 'Hola, me interesa Bang Tao',
      },
    },
  },
} satisfies DistrictsDict
