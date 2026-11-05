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
     */
    titleLines: ['Property in', 'Thailand'],
    /** Lead under the title (136 characters, keep a similar length). Mentions paying from Russia: adapt. */
    lead: 'Real estate agency in Phuket. Apartments and villas in Thailand, Bali, Dubai and Cambodia: search, documents, payment from abroad, rentals',
    /** Primary button (one line, no wrap): keep it about as short as the Russian (16 characters). */
    cta: 'Find a property',
    /** Caption under the villa photo; «Пример формата»: the photo shows a format, not a listing. */
    printCaption: 'Example format: villa with a pool',
    /** Caption under the panorama. */
    panoramaCaption: 'West coast of Phuket',
  },

  /** Block 2: row of figures. The figures themselves (5+, 100+, 15, 4) are in code. */
  figures: {
    /** Hidden h2 for screen readers. */
    title: 'Home Office & Co in numbers',
    /**
     * Unit (Lead, one short word, on the baseline of the figure) and the phrase under it. Each unit
     * follows its figure grammatically: experience «5+», clients «100+», reply «15», countries «4».
     */
    stats: {
      experience: {
        unit: 'years',
        /** The opening year (2026) is a promo decision the client confirms before launch. */
        text: 'of our specialists’ experience in international markets. The agency itself opened in 2026',
      },
      clients: { unit: 'clients', text: 'served by our specialists over these years' },
      reply: { unit: 'minutes', text: 'broker’s reply time to a request during working hours' },
      countries: { unit: 'markets', text: 'Thailand, Indonesia (Bali), the UAE (Dubai) and Cambodia' },
    },
  },

  /** Block 3: «Четыре побережья», one row per destination (names: common.destinations). */
  coasts: {
    /** «Четыре»: there are four rows. */
    title: 'Four coasts',
    lead: 'We work in four countries, mostly in Thailand. Ownership rules differ in each',
    /** Broker's verdict next to each destination, by destination id. */
    verdicts: {
      phuket: 'Our main destination: six districts from Layan to Chalong. In Thailand we also work in Pattaya',
      bali: 'Ownership rules differ from Thailand. We explain them before you choose a property',
      dubai: 'A purchase above a set amount gives the right to a UAE residence visa',
      cambodia: 'Apartments by the sea. We go through a foreigner’s housing rights in the consultation',
    },
    /** Caption under the property photo of the Phuket row; «Пример объекта»: not a listing. */
    houseCaption: 'Example property: house with a pool',
    /** Line after the rows, then a link to the quiz. «4 вопроса»: the quiz has four questions. */
    after: 'You can choose the country together with a broker',
    afterLink: 'Find a property in 4 questions',
  },

  /**
   * Block 4: «Где жить, а где сдавать», the district scene. District names, verdicts, the «Кому
   * подходит» and «Что покупают» facts and photo captions come from the Phuket hub rows, so the
   * home page and /thailand/phuket never disagree.
   */
  districts: {
    title: 'Where to live, where to rent out',
    lead: 'Six Phuket districts from north to south. Each one shows who it suits and what people buy there',
    /** Screen-reader name of the island drawing. */
    mapLabel: 'Map of Phuket, six districts from north to south',
    /** Screen-reader name of the list of district names that drives the scene. */
    navLabel: 'Phuket districts',
    /** Small labels of the three facts (tight: keep them to two or three words). */
    factLabels: { where: 'Where', forWhom: 'Who it suits', buy: 'What people buy' },
    /**
     * First word of the hub facts («Подходит тем, кто…», «Покупают виллы…»): under the labels above
     * the home page drops it and capitalizes the rest. Must equal the first word of the translated
     * hub facts; leave the string empty if the translation does not start with such a word.
     */
    hubVerbs: { forWhom: 'Suits', buy: 'Buyers choose' },
    /** «Где»: position on the island, by district id (north to south). */
    where: {
      layan: 'Northwest of the island, north of Bang Tao',
      'bang-tao': 'Northwest of the island, around Laguna',
      kamala: 'West of the island, between Bang Tao and Patong',
      'karon-kata': 'Southwest of the island, south of Patong',
      'nai-harn-rawai': 'Southern tip of the island, by Cape Promthep',
      chalong: 'Southeast of the island, on Chalong Bay',
    },
    /** Link to a district page under its block. {name}: district name, «Банг Тао подробно». */
    more: '{name} in detail',
    /** Link under the scene. */
    allLink: 'All Phuket districts',
  },

  /** Block 5: FAQ. */
  faq: {
    /** «Пять»: there are five questions. */
    title: 'Five questions for the first call',
    /** Questions and answers. Question 3 is about paying from Russia: adapt for the audience. */
    items: [
      {
        q: 'Can a foreigner own property in Thailand?',
        a: 'Yes. A foreigner can hold a condominium unit in full ownership, freehold. But foreigners may own no more than 49% of the unit area in a building, so we check the remaining quota before the reservation. A foreigner cannot buy land. A villa is arranged through a 30-year land lease. The extension is written into the contract, and we explain how reliable that clause is in yours.',
      },
      {
        q: 'How much does a square meter cost?',
        a: 'There is no single price. The price per square meter depends on the district, the distance to the sea and the construction stage, and developers raise prices in phases, so last year’s price list goes out of date fast. Instead of an average figure, we send 3 to 5 projects within your budget. Each one shows today’s price, the type of ownership and the downsides. We send the shortlist within 24 hours.',
      },
      {
        q: 'How do I pay for a purchase from abroad?',
        a: 'By lawful methods that work today. A condominium unit can be registered in your ownership if the money comes into Thailand from abroad in foreign currency: the bank issues a transfer confirmation, and without it the title is not registered. We offer no schemes around restrictions. We discuss payment methods in the consultation: rules change, and the broker names the ones the agency uses to process payments now.',
      },
      {
        q: 'Which district suits living, and which suits renting out?',
        a: 'It depends on your goal and on how many months a year you spend on the island. A family living here year-round cares about schools and roads. For renting out, the beach and demand in season matter more. The six Phuket districts are described briefly in the section above. The property search gives an exact answer for your case: 4 questions, and a broker suggests districts and projects.',
      },
      {
        q: 'Does buying property give me a visa?',
        a: 'In Thailand, buying property does not give a visa by itself. To live in the country for long periods you need a separate long-stay program. In the UAE, a purchase above a set amount gives the right to a residence visa. Thresholds and conditions change, so we go through your case in the consultation under the rules in force now.',
      },
    ],
  },

  /** Block 6: «От звонка до ключей». */
  process: {
    title: 'From first call to keys',
    /** «Пять»: there are five steps. */
    lead: 'Five stages, one broker all the way',
    /**
     * Five steps in order, no visible numbers: the order is carried by the when field, a short
     * opening phrase set in UI 500 on its own line (ends with a full stop).
     */
    steps: [
      {
        when: 'First.',
        text: 'We clarify your goal and budget. There is no catalog on the site because we build each shortlist by hand: 3 to 5 projects and an explanation of why the others did not fit. We show properties on site or by video.',
      },
      {
        when: 'Before booking.',
        text: 'We check the land documents, the building permit, the remaining foreign quota and how the developer delivered past buildings. We will not offer a risky project.',
      },
      {
        when: 'On payment day.',
        text: 'The money moves by a lawful route and arrives in Thailand in foreign currency with a bank confirmation. Without it, the unit cannot be registered in your ownership.',
      },
      {
        when: 'At handover.',
        text: 'We inspect the unit against the contract before the acceptance certificate is signed. We write down defects and pass them to the developer. Then come registration of the title and the keys.',
      },
      {
        when: 'After the keys.',
        text: 'We help you rent the unit through management partners and resell it when you decide to.',
      },
    ],
    /** Link to /services/deal. */
    link: 'More about deal support',
    /** Photo captions; «Пример формата»: the photo shows a format, not a listing. */
    captions: {
      kata: 'Kata, west coast of Phuket',
      naiharn: 'Nai Harn, south of Phuket',
      condo: 'Example format: condominium with a shared pool',
    },
  },

  /** Block 7: «Мы сами инвестируем» (the founder; name and role: common.founder). */
  invest: {
    /** Hidden h2. */
    title: 'We invest ourselves',
    /** The founder's quote, D3. Wording kept for the promo; the client confirms it before launch. */
    quote: 'We buy for ourselves in the same places we recommend to you',
    /** Signature under the quote. {name}: the founder's first name. */
    author: '{name}, founder of Home Office & Co',
    text: 'The team buys property for itself and invests in joint projects with clients. Every project in a shortlist has a downsides section, which the broker writes personally.',
  },

  /**
   * Block 8: client reviews. PROMO SAMPLES, not real reviews: every one is shown with the
   * sampleLabel line and a city, never a name. Keep them labelled as samples in every language.
   */
  review: {
    /** Hidden h2. */
    title: 'Client reviews',
    /** Link to all reviews (not shown until /reviews exists). */
    allLabel: 'All reviews',
    /** Under every sample review: says it is an example. Never drop or soften it. */
    sampleLabel: 'Sample review',
    /** Line under the city. {purchase}: the sample's purchase. */
    purchase: 'Purchase: {purchase}',
    /**
     * Sample reviews, by the district of the purchase (drawn on the island next to the first one;
     * the order is in code). quote: up to 25 words, no quotation marks. city: where the buyer is
     * from (Russian cities in the Russian version). place: caption under the island drawing.
     */
    samples: {
      'bang-tao': {
        quote:
          'The broker named each project’s downsides before the viewing. Two options failed the document check, and from the rest we chose an apartment by Laguna',
        city: 'Krasnoyarsk',
        purchase: 'condominium apartment, Bang Tao',
        place: 'Bang Tao on the map of Phuket',
      },
      'nai-harn-rawai': {
        quote:
          'We viewed the property by video and read the contract with a lawyer. We flew to Thailand only to collect the keys',
        city: 'Moscow',
        purchase: 'villa, Rawai and Nai Harn',
        place: 'Rawai and Nai Harn on the map of Phuket',
      },
      'karon-kata': {
        quote:
          'They replied in 10 minutes and never rushed us. We live in the apartment ourselves in winter; a management company rents it out the rest of the time',
        city: 'Novosibirsk',
        purchase: 'apartment for winters, Kata and Karon',
        place: 'Kata and Karon on the map of Phuket',
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
    title: 'Phuket without sugarcoating',
    text: 'An investor guide for international buyers, 2026/27. Eight chapters, 20 minutes of reading: what a foreigner can buy, how to pay lawfully, where to live and where to rent out, what to expect from rental income.',
    /** Small line on the cover, under the title (the cover column is 16 characters wide; it wraps). */
    coverSubtitle: 'Investor guide for international buyers',
    /** Edition on the cover. */
    coverYear: '2026/27',
  },

  /** Block 10: closing line (the reply time and the contacts are added by the component). */
  closing: {
    /** Start of the closing sentence; «, и брокер ответит до 16:55» follows (common.reply.closing). */
    title: 'Tell us what you are looking for',
    note: 'We meet in person in Phuket, at properties and in business centers. If you are in another country, we show the property by video',
  },

  /** JSON-LD of the organisation and the website (not shown on the page). */
  jsonLd: {
    description: 'International real estate agency: Thailand (Phuket, Pattaya), Bali, Dubai, Cambodia.',
    /** Countries served, full official names. */
    areaServed: ['Thailand', 'Indonesia', 'United Arab Emirates', 'Cambodia'],
    /**
     * The brand written in this language's script, for search. «Home Office and Co» is always added
     * in code; leave the list empty for a language written in Latin script.
     */
    alternateNames: [],
  },
} satisfies HomeDict
