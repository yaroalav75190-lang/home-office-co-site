// /services/deal, verbatim from docs/content/copy-deal.md (v1.0, 2 Nov 2026). Stage terms, the
// consultation price and the fee answer follow docs/DEMO_DECISIONS.md (typical terms, «обычно»).
// Facts stay in src/views/deal.tsx: stage anchors (#izuchenie-rynka …), the #konsultaciya anchor,
// hrefs and photo keys. Title and description of the page: `meta.deal`.

import type { DealDict } from '../ru/deal'

export const deal = {
  /** JSON-LD `Service` (not shown on the page): service name and the countries served. */
  schema: {
    name: 'Property deal support',
    areaServed: ['Thailand', 'Indonesia', 'United Arab Emirates', 'Cambodia'],
  },

  hero: {
    /**
     * h1, two D1 lines; the second starts one third of the grid in. From 1024 px each line is a
     * single `nowrap` line: the translation must not be wider than the Russian, 13 characters
     * («Сопровождение») and 6 characters («сделки»; it has a third less room because of the indent).
     */
    titleLines: ['Deal', 'support'],
    lead: 'We guide a property purchase in Thailand from choosing a district to the keys and renting out. One broker all the way',
    /** Button label (jumps to the consultation form); Russian 26 characters, keep it on one line. */
    cta: 'Book a consultation',
  },

  stages: {
    title: 'Six stages of the deal',
    lead: 'At every stage it is clear who does what and which documents stay with you',
    /** Screen-reader name of the sticky list of stages. */
    navLabel: 'Deal stages',
    /** Labels of the two rows under each stage. */
    documentsLabel: 'Documents',
    termLabel: 'Timing',
    /**
     * The six stages, in this order: the page gives them their anchors by position. `nav` is the
     * label in the sticky list (narrow column from 1024 px): keep it short, Russian at most 20
     * characters. «Оплата из России» is Russia-specific (the audience pays from Russia).
     */
    items: [
      {
        nav: 'Market research',
        title: 'Market research',
        text: 'We clarify your goal (to live, to rent out or to preserve capital), budget and timing. Within 24 hours we send 3 to 5 projects by a private link. Each one shows today’s price, the type of ownership, the construction stage, the pros and the downsides. We show properties on site or by video.',
        documents: 'Shortlist by a private link',
        term: 'usually 1–3 days',
      },
      {
        nav: 'Checks',
        title: 'Developer and document checks',
        text: 'Before the reservation we look at how the developer delivered past buildings and how fast. We check the land documents, the building permit and the remaining foreign quota. If we find a risk, we say so directly and suggest another project.',
        /** copy-deal: [согласовать список с юристом]. «чанот» is the Thai title deed (chanote). */
        documents: 'Land title deed (chanote), developer’s license, building permit, data on the remaining quota',
        term: 'usually 3–7 days',
      },
      {
        nav: 'Reservation/contract',
        title: 'Reservation and contract',
        text: 'We reserve the unit and read the contract with a lawyer: the payment schedule, the handover dates and the developer’s obligations if the deadline is missed.',
        documents: 'Reservation agreement, sale and purchase agreement, payment schedule',
        term: 'usually 1–2 weeks',
      },
      {
        nav: 'Payment and title',
        /** Russia-specific: «из России». */
        title: 'Payment from abroad and registration',
        text: 'The money comes into Thailand from abroad in foreign currency, the bank issues a transfer confirmation, and with it the title is registered at the Land Department. Payment options are described in the section below.',
        documents: 'Bank confirmation of each transfer, title registration documents',
        term: 'on the developer’s schedule; title registration usually 1–2 weeks after full payment',
      },
      {
        nav: 'Handover and keys',
        title: 'Handover and keys',
        text: 'We inspect the unit against the contract before the acceptance certificate is signed. We write down defects and pass them to the developer. After the certificate and the registration, you receive the keys.',
        documents: 'Acceptance certificate, title document',
        term: 'usually 1–2 days',
      },
      {
        nav: 'Rental and resale',
        /** «После ключей» in the text is the title of the block `afterKeys` below: keep them the same. */
        title: 'Rental and resale',
        text: 'We rent out the unit through management partners and sell it when you decide to exit the property. Details are in the “After the keys” section.',
        documents: 'Contract with the management company',
        term: 'as long as you own the property',
      },
    ],
    /** Link under the stages to the investor guide on the home page. */
    guideLink: 'The deal step by step: chapter 8 of the investor guide',
  },

  checks: {
    title: 'What we check before payment',
    items: [
      { name: 'Land title document', text: 'A chanote or another document: who owns the plot and whether it has encumbrances' },
      { name: 'Developer’s license and track record', text: 'How and when it delivered past buildings' },
      { name: 'Building permit', text: 'Whether it was issued for this project and what it allows' },
      { name: 'Contract and payment schedule', text: 'How much and when you pay, and what happens if deadlines are missed' },
      { name: 'Remaining foreign quota', text: 'How much of the building’s area can still be registered to foreigners' },
    ],
    /**
     * Placeholder: «Список согласован с {имя юриста}» once a partner lawyer has checked it; empty
     * hides the line (copy-round2 §5). Keep it empty in translations while the Russian is empty.
     */
    note: '',
  },

  /** Russia-specific block: the audience pays from Russia («Оплата из России»). Translate faithfully. */
  payment: {
    /** h2 D3 in a narrow column (3 of 12 from 1024 px). */
    title: 'Payment from abroad',
    paragraphs: [
      'Payment goes only by lawful methods that work today. We offer no schemes around restrictions.',
      'If the unit is registered in your ownership, the money must come into Thailand from abroad in foreign currency. The bank issues a confirmation of each transfer, and without it the title is not registered. A building under construction is usually paid for in installments on the developer’s schedule, and every payment follows the same route.',
      'We discuss in the consultation which methods you can use to pay now. Rules change, so the broker names only the methods the agency uses to process payments at the time of the conversation.',
    ],
    /** Placeholder: empty hides the line; the check by the lawyer is a note for the team, not for the page (copy-round2 §5). */
    note: '',
  },

  afterKeys: {
    /** Caption under the Nai Harn panorama, after the locator. */
    photoCaption: 'Nai Harn, south of Phuket',
    title: 'After the keys',
    /**
     * `note`: placeholder for a Small line naming rental partners, only once the client allows it
     * (copy-round2 §5); empty hides it.
     */
    items: [
      {
        title: 'Rental through partners',
        text: 'We help you choose a management company among our partners and compare terms. We do not promise guaranteed income: we calculate real occupancy by season, management costs and taxes.',
        note: '',
      },
      {
        title: 'Resale',
        text: 'When you decide to sell, we value the unit at the current market and find a buyer. The broker who handled the purchase knows the property and its documents, so you will not start from zero.',
        note: '',
      },
    ],
  },

  /** Cost is the first question. */
  faq: {
    title: 'Costs and common questions',
    items: [
      {
        q: 'How much does deal support cost?',
        a: 'The cost depends on the property and the task, and we state it in the consultation before work begins. Besides the price of the property, the buyer pays registration fees and bank commissions for the transfer. The broker calculates the exact amounts for your property before the reservation.',
      },
      {
        q: 'What exactly do you check?',
        a: 'We check the land documents, the building permit, the remaining foreign quota, the contract with its payment schedule and the developer’s history: how and when it delivered past buildings. We check before the reservation so that your deposit does not go into a project with problems. You learn about every risk we find before you sign the reservation.',
      },
      {
        q: 'What if the developer misses the deadline?',
        a: 'We reduce this risk before the purchase: we look at how the developer delivered past projects, and check the permits and the payment schedule. In a phased schedule, each payment is tied to a construction stage. We will not offer a risky project. What happens if a deadline is missed is written into the contract in advance.',
      },
      {
        q: 'Can I buy without flying to Thailand?',
        a: 'Yes. We show the property by video: the broker walks through the unit and the grounds and answers questions during the call. We explain the remote signing procedure in advance, before the reservation.',
      },
      {
        q: 'I have already chosen a property. Can you help check it?',
        a: 'Yes. Tell us in the consultation what you chose and what stage you are at. We check the developer and the documents before the reservation and tell you what concerns us. We discuss the terms of such a check in the consultation.',
      },
      {
        q: 'Do you sell only your partners’ properties?',
        a: 'No. We work with the whole Thai market, not tied to one developer. Every project in a shortlist has a downsides section. We buy property here ourselves and invest in joint projects with clients, so we look at a property as buyers do.',
      },
    ],
  },

  /** Consultation block on the ink field, next to the booking form. */
  consultation: {
    title: 'We will go through your deal',
    text: '30 minutes with a broker by video, by phone or in a meeting in Phuket. You can bring a property you have already chosen.',
    /** DEMO_DECISIONS «Стоимость консультации» (the client confirms before launch). */
    price: 'The consultation is free',
  },
} satisfies DealDict
