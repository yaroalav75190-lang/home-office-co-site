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
   */
  districts: {
    layan: {
      name: 'Layan',
      verdict: 'A quiet beach at the northern end of Bang Tao Bay, next to Sirinat National Park',
      facts: [
        'Suits those who want quiet and nature close to home',
        'Buyers choose villas and apartments, including in branded residences',
      ],
      photoCaption: 'Banana Beach, north of Layan',
    },
    'bang-tao': {
      name: 'Bang Tao',
      verdict: 'A beach of about 7 km in the northwest, and Laguna with six hotels and a golf course',
      facts: [
        'Suits those who want a quiet beach and Laguna nearby',
        'Buyers choose condominium apartments and villas, including in Laguna',
      ],
      photoCaption: 'Bang Tao, west coast of Phuket',
    },
    kamala: {
      name: 'Kamala',
      verdict: 'A bay with a beach of about 3 km between Surin and Patong, with a village around it',
      facts: [
        'Suits those who want a calm beach not far from Patong',
        'Buyers choose condominium apartments and villas on the hillsides',
      ],
      photoCaption: 'Kamala, west coast of Phuket',
    },
    'karon-kata': {
      name: 'Kata and Karon',
      verdict: 'The beaches of Kata and Karon in the southwest, with hotels, cafes and shops around them',
      facts: [
        'Suits those who want to live in a resort district by the beach',
        'Buyers choose condominium apartments',
      ],
      photoCaption: 'Kata, west coast of Phuket',
    },
    'nai-harn-rawai': {
      name: 'Rawai and Nai Harn',
      verdict: 'The south of the island: boats leave Rawai for the nearby islands, and Nai Harn has a beach by a lake',
      facts: [
        'Suits those who live on the island for long periods',
        'Buyers choose condominium apartments and villas',
      ],
      photoCaption: 'Nai Harn, south of Phuket',
    },
    chalong: {
      name: 'Chalong',
      verdict: 'A bay in the southeast with a yacht anchorage and a pier for boats to the islands',
      facts: [
        'Suits those who sail or often travel to the islands',
        'Buyers choose houses and villas in residential communities',
      ],
      photoCaption: 'Big Buddha on Nakkerd Hill, above Chalong and Kata',
    },
  },

  /**
   * First line of a district page h1 (D1); the second line is the page's `namePrep` («в Банг Тао»).
   * From 1024 px each line is one unbreakable display line (whitespace-nowrap): not wider than the
   * Russian (12 characters).
   */
  heroTitle: 'Property in',

  /** District pages, by district id. Only districts with a page in code have copy here. */
  pages: {
    'bang-tao': {
      /**
       * Second line of the h1: «в Банг Тао». Preposition and case are set by hand, never generated
       * (seo-brief §4.3). One unbreakable D1 line from 1024 px: not wider than the Russian (10 characters).
       */
      namePrep: 'Bang Tao',
      hero: {
        lead: 'A district in northwest Phuket, around Laguna. We explain who it suits and who it does not',
        /** Button to the quiz with Phuket and this district preselected. */
        cta: 'Find in Bang Tao',
        /** Screen-reader name of the large locator. */
        mapLabel: 'Bang Tao on the map of Phuket',
        /** Under the 21:9 photo «в край» under the hero. */
        panoramaCaption: 'Banana Beach, Choeng Thale, 3 km north of Bang Tao',
      },
      /** «Где Банг Тао и что рядом» (wireframe «Лоция района»). */
      facts: {
        title: 'Where Bang Tao is and what is nearby',
        paragraphs: [
          'Of the districts where we work, the closest are Layan to the north and Kamala to the south.',
          'Most of the bay is taken by Laguna, a complex on the site of former tin mines. Its territory of more than 400 hectares holds six hotels, an 18-hole golf course and residential projects, from apartments to villas.',
          'The airport is about 25 minutes by car, Patong about 20. Inside Laguna, hotels and shops are linked by shuttles and by a boat across the lagoon.',
        ],
        /**
         * Label over value, seven in this order: the first four are short and share a row in pairs,
         * the last three (prices, rent, title) take the full width.
         */
        items: [
          { term: 'To the airport', value: 'About 25 minutes by car' },
          { term: 'Beach', value: 'About 7 km along the bay. Swimming is best in the dry season' },
          { term: 'Who it suits', value: 'Those who want a quiet beach and Laguna nearby' },
          {
            term: 'What people buy',
            value: 'Condominium apartments and villas, including in Laguna',
          },
          {
            term: 'Prices',
            value:
              'They depend on the class of the building, the distance to the sea and the construction stage. We send current figures in the shortlist, and the broker confirms the exact price for each property',
          },
          {
            term: 'Rental',
            value:
              'The tourist season runs from November to April, and the monsoon lasts from May to October. We do not promise guaranteed income: we calculate occupancy by season, management costs and taxes',
          },
          {
            term: 'Ownership',
            /** Legal facts: the 49 % quota and the 30-year land lease. */
            value: 'A condominium unit in full ownership within the 49% quota. A villa through a 30-year land lease',
          },
        ],
      },
      life: {
        title: 'Life in Bang Tao',
        text: 'Daily life is built around Laguna. The hotels have restaurants and spas, and a golf course is next door. On the beach there are simple cafes, cheaper than the hotels. There is no nightlife like Patong’s here. Patong is about 20 minutes by car.',
        /** The author asks for his name next to this photo: keep «Фото: Anton Zelenov» (credit, not text). */
        portraitCaption: 'Sunset at Bang Tao, west coast of Phuket. Photo: Anton Zelenov',
        squareCaption: 'Example format: villa with a pool',
      },
      /** «Без приукрашивания»: minuses on every district page. */
      honest: {
        title: 'No sugarcoating',
        lead: 'Every district has downsides. We name them before the viewing',
        pros: {
          title: 'Why people choose Bang Tao',
          items: [
            'A long, quiet beach, about 7 km',
            'Laguna with restaurants, spas and a golf course in the district itself',
            'The airport is 25 minutes away by car. From Karon in the southwest the drive takes almost an hour',
          ],
        },
        cons: {
          title: 'What to know',
          items: [
            'The district is being actively built up. We check what will appear near your project and how many similar apartments are already rented',
            'In buildings with many foreign buyers, the 49% quota can run out. We check the remaining quota in the specific building before the reservation',
            'From May to October the west coast has strong currents. You cannot swim every day, so watch the flags on the beach',
            'It is inconvenient without your own car or scooter: there are few taxis in Laguna and rides are expensive',
          ],
        },
        guide: 'Renting without illusions: chapter 5 of the investor guide',
      },
      /** «Проекты в Банг Тао»: project cards, NOT RENDERED since QA round 1 §4 («Форматы» instead). */
      projects: {
        title: 'Projects in Bang Tao',
        lead: 'Two projects from the current shortlist. We send the rest as a list with pros and cons',
        caption: 'Bang Tao, west coast of Phuket',
      },
      /** «Соседи по берегу»: one line per neighbour, by district id (the list and order are set in code). */
      neighbours: {
        title: 'Neighbors along the coast',
        items: {
          layan: {
            side: 'North of Bang Tao',
            text: 'Quieter and greener than Bang Tao, with fewer cafes and shops. Villas and branded residences are being built here.',
          },
          kamala: {
            side: 'South of Bang Tao',
            text: 'Bang Tao or Kamala: Kamala is more compact, with a beach of about 3 km, and Patong is about 8 km away. Villas stand on the hillsides around the bay.',
          },
        },
        /** Closes the block while the neighbours have no pages of their own (copy-bang-tao §6). */
        fallback: 'All Phuket districts',
      },
      closing: {
        /** Start of the closing sentence; the site appends the reply part («, и брокер ответит до 16:55»). */
        title: 'Tell us what you are looking for in Bang Tao',
        cta: 'Find in Bang Tao',
        /** Prefilled Telegram message (copy-bang-tao §7). Not used yet: the shared closing line has no prop for it. */
        telegramText: 'Hello, I am interested in Bang Tao',
      },
    },
  },
} satisfies DistrictsDict
