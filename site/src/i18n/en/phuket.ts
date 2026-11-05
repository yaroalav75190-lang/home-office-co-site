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
     */
    titleLines: ['Property in', 'Phuket'],
    lead: 'An island where the district matters more than the size of the unit. We find apartments and villas in Phuket from developers and on the resale market',
    /** Button to the quiz with Phuket preselected. */
    cta: 'Find in Phuket',
    /** Screen-reader name of the island drawing. */
    mapLabel: 'Map of Phuket, the six districts where we work',
    /** Screen-reader name of the list of district labels on the drawing. */
    mapNavLabel: 'Districts on the map',
    /**
     * District labels on the island drawing (copy-phuket §1), by district id. Each is one line beside
     * the coast on the water side: keep them as short as the Russian (the longest, «Раваи и Най Харн»,
     * is 16 characters).
     */
    mapNames: {
      layan: 'Layan',
      'bang-tao': 'Bang Tao',
      kamala: 'Kamala',
      'karon-kata': 'Kata and Karon',
      'nai-harn-rawai': 'Rawai & Nai Harn',
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
    title: 'What to know before buying',
    items: {
      /** Russia-specific: the time difference with Moscow (Phuket is UTC+7). */
      timeDifference: {
        value: 'UTC+7',
        unit: '',
        text: 'Phuket’s time zone all year round, with no daylight saving time',
      },
      winterSeason: {
        value: '5',
        unit: 'months',
        text: 'From November to March, people come to the island to spend the winter. In the other months a property can be rented out',
      },
      /** Legal fact: the 49 % foreign quota. No unit: the figure carries «%». */
      foreignQuota: {
        value: '49%',
        unit: '',
        text: 'share of the unit area in a building that can be registered in foreigners’ ownership',
      },
      /** Legal fact: the 30-year land lease (leasehold). */
      landLease: {
        value: '30',
        unit: 'years',
        text: 'term of the land lease under a villa for a foreigner. The extension is written into the contract',
      },
      /** Russia-specific: the direct Aeroflot flight from Moscow (Sheremetyevo) and its timetable. */
      flight: {
        value: '10',
        unit: 'hours',
        text: 'direct flight from Moscow. By Aeroflot’s timetable from Sheremetyevo, 9 h 40 min there and 10 h 15 min back',
      },
    },
    /** Placeholder note for a figure the client has not given yet: renders «[заглушка: цифра]». */
    figureStub: 'figure',
    photoCaption: 'Kata, west coast of Phuket',
  },

  /** «Шесть районов Пхукета»: the rows themselves are in ./districts.ts. */
  districtList: {
    title: 'Six districts of Phuket',
    lead: 'Different districts suit living and renting out. Each one shows who it suits and what people buy there',
    /** Link to the quiz under the list. */
    quiz: 'Find a district in 3 questions',
  },

  /**
   * «Право собственности». Legal terms are facts: freehold within the 49 % quota for a condominium
   * flat, a 30-year land lease for a villa. Keyed by kind of property; the order is set in code.
   */
  ownership: {
    title: 'Ownership',
    parts: {
      condo: {
        title: 'Condominium: full ownership within the quota',
        text: 'A foreigner registers a condominium unit in their own name in full ownership, freehold. Foreigners in one building may own no more than 49% of the unit area, so we check the remaining quota in the specific building before the reservation. The money for the purchase must come into Thailand from abroad in foreign currency, with a bank confirmation.',
      },
      villa: {
        title: 'Villa and land: long-term lease',
        text: 'A foreigner does not buy the land. A villa is arranged through a 30-year land lease, and the extension is written into the contract. How reliable the extension clause is in your specific contract, we explain before the reservation together with a lawyer.',
      },
    },
    /**
     * Shown only once a partner lawyer has really checked the wording (copy-phuket §4).
     * {name}: the lawyer's name, set in code.
     */
    checkedBy: 'Wording checked by {name}',
    guide: 'More in the investor guide, chapter 1',
  },

  /**
   * «Форматы, с которыми работаем» (QA round 1 §4), on the hub and the district pages: types of
   * property instead of project cards. Cards keyed by format id (photos and crops: content.ts).
   * `note` is the 24-hour line; `cta` the quiz link after the cards.
   */
  formats: {
    title: 'Formats we work with',
    lead: 'How the formats differ and who each one suits. A broker will find projects within your budget',
    note: 'We send a shortlist of projects within 24 hours',
    cta: 'Get a shortlist',
    /** Labels of the two Small facts on every card. */
    ownershipLabel: 'Ownership',
    suitsLabel: 'Who it suits',
    items: {
      condo: {
        title: 'Apartment in a condominium',
        text: 'A unit in a building with a shared pool, security and a management company. All owners pay the building’s maintenance fees.',
        /** Legal fact: freehold within the 49 % quota. */
        ownership: 'Full ownership in your name, freehold, within the foreign quota of 49% of the building’s unit area',
        suits: 'Those who rent out through a management company or come for the winter',
        /** Under the photo; «Пример формата» says the photo shows a kind of property, not our project. */
        caption: 'Example format: condominium with a pool',
      },
      villa: {
        title: 'Villa with a pool',
        text: 'A detached house with its own pool and plot. Villas are built one by one or in whole communities with shared security.',
        /** Legal fact: the 30-year land lease. */
        ownership: 'A foreigner leases the land for 30 years, and the extension is written into the contract. We check how reliable that clause is with a lawyer before the reservation',
        suits: 'Families who winter on the island and those who rent out the whole house',
        caption: 'Example format: villa with a pool',
      },
      house: {
        title: 'Townhouse or family home',
        text: 'In a townhouse, neighboring homes share walls. A detached house stands on its own plot in a residential community.',
        /** Legal fact: the 30-year land lease. */
        ownership: 'Same as a villa: a 30-year land lease, with the extension written into the contract',
        suits: 'Those who move to Phuket for the long term and live here year-round',
        caption: 'Example format: family home',
      },
    },
  },

  /** Quiz link label: project cards, and the «Форматы» link when a page passes no label. */
  requestCta: 'Request a shortlist',

  /**
   * «С чем работаем сейчас»: project cards. NOT RENDERED since QA round 1 §4 («Форматы» shows
   * instead); kept for the real project cards. The `…Stub` words render inside «[заглушка: …]».
   */
  projects: {
    title: 'What we work with now',
    lead: 'Four projects from current shortlists. We send the full list with pros and cons to your messenger',
    /** Line under the price. */
    place: 'Phuket',
    photoStub: 'project photo with the developer’s permission',
    nameStub: 'project name',
    typeStub: 'property type',
    /** Between the two stubs: «[тип объекта], сдача [квартал и год]». */
    handover: 'handover',
    handoverStub: 'quarter and year',
    price: 'Price on request',
  },

  pattaya: {
    title: 'Pattaya, if you want a city by the sea',
    /** Legal fact: the 49 % quota. */
    text: 'The same Thai rules apply: a unit in full ownership within the 49% quota. Prices and rental demand are different, and we compare them with Phuket for your budget.',
    /** Link to the quiz with Pattaya preselected (until a Pattaya page exists). */
    link: 'Find in Pattaya',
    caption: 'Pattaya, Gulf of Thailand coast',
  },

  faq: {
    title: 'Questions about buying in Phuket',
    /**
     * Questions and answers, in this order. Legal facts: the 49 % quota, the 30-year lease, no visa
     * from buying property. The third question («из России») is Russia-specific.
     */
    items: [
      {
        q: 'Can a foreigner buy an apartment in Phuket in full ownership?',
        a: 'Yes, if it is a condominium unit and the building’s foreign quota is not used up: foreigners may own up to 49% of the unit area. The title is registered in your name. A villa works differently: a foreigner leases the land for 30 years. Details are in the Ownership section above.',
      },
      {
        q: 'How much does property in Phuket cost?',
        a: 'The price depends on the district, the distance to the sea, the class of the building and the construction stage. Developers raise prices in phases as construction progresses, so last year’s price list goes out of date fast. We send a shortlist with today’s prices within 24 hours of the search, and the broker confirms the exact price for each property.',
      },
      {
        q: 'How do I pay for an apartment in Phuket from abroad?',
        a: 'Only by lawful methods that work today. We offer no schemes around restrictions. A building under construction is usually paid for in installments on the developer’s schedule, and every payment comes from abroad in foreign currency with a bank confirmation. The broker explains in the consultation which methods the agency uses to process payments now.',
      },
      {
        q: 'Which Phuket district is for living, and which for buying to rent out?',
        a: 'It depends on the scenario: you live here in winter and rent out in summer, rent out year-round, or relocate. Different districts suit each scenario. The six districts are compared higher up on this page. If you are torn between two, the broker will show how many similar apartments are already rented near each project.',
      },
      {
        q: 'Will I get a visa if I buy an apartment in Phuket?',
        a: 'No. In Thailand, buying property does not give a visa by itself. To live on the island for long periods you need a separate long-stay program. The terms of such programs change, so we go through your case in the consultation under the rules in force now.',
      },
      {
        q: 'Can I trust guaranteed returns?',
        a: 'We do not give return guarantees. A developer’s guarantee is usually already built into the price of the unit. We calculate real occupancy by season, management costs and taxes, and show the calculation for a specific property. The calculation is illustrative and is not individual investment advice.',
      },
      {
        q: 'Is the Phuket market overheated?',
        a: 'The market is uneven: in some districts there are more new apartments than tenants. We will name those districts and show how many similar apartments are already rented near the project. Every project in a shortlist has a downsides section.',
      },
    ],
  },

  closing: {
    /** Start of the closing sentence; the site appends the reply part («, и брокер ответит до 16:55»). */
    title: 'Tell us what you are looking for in Phuket',
    cta: 'Find in Phuket',
  },

  /** schema.org names in the JSON-LD of the hub and the district pages (not shown on the page). */
  place: {
    name: 'Phuket',
    country: 'Thailand',
  },
} satisfies PhuketDict
