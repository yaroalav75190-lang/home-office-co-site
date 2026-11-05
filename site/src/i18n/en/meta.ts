// Page titles and descriptions (seo-brief §4): <title>, meta description, Open Graph and JSON-LD names.
// Titles marked «absolute» skip the « | Home Office & Co» template; keep them under 60 characters.

import type { MetaDict } from '../ru/meta'

export const meta = {
  site: {
    /** Default description of the root layout; uses only facts from the brief. Pages set their own. */
    description:
      'Home Office & Co real estate agency: apartments and villas in Phuket, Pattaya, Bali, Dubai and Cambodia. Property search, document checks, deal support.',
  },
  /** Absolute title. */
  home: {
    title: 'Phuket Real Estate Agency | Home Office & Co',
    description:
      'Real estate agency in Phuket: apartments and villas in Thailand, Bali, Dubai and Cambodia. Property search, document checks, deal support. 15-minute replies.',
  },
  /** Absolute title. */
  phuket: {
    title: 'Phuket Property for Sale: Condos and Villas',
    description:
      'Condos and villas in Phuket from developers and on the resale market: six districts for living and renting out, ownership rules for foreigners.',
  },
  /** District pages, by district id. Absolute titles. */
  districts: {
    'bang-tao': {
      title: 'Bang Tao Property: Condos and Villas in Phuket',
      description:
        'Property in Bang Tao, Phuket: condos and villas near Laguna, who the district suits, rental by season, and the pros and cons without sugarcoating.',
    },
  },
  /** Absolute title. */
  deal: {
    title: 'Buying Property in Thailand: Deal Support',
    description:
      'Property deals in Thailand with one broker, from search to keys: developer and document checks, contract, payment, registration, then rental or resale.',
  },
  /** Absolute title. */
  podbor: {
    title: 'Find a Property: Phuket, Pattaya, Bali, Dubai',
    description:
      'Four questions: country, goal, budget and timing. A broker replies in your messenger within 15 minutes and sends 3 to 5 projects with prices and downsides.',
  },
  /** Absolute title. */
  contacts: {
    title: 'Contact Home Office & Co: Consultation, Viewing',
    description:
      'Phone, Telegram and email for Home Office & Co. Book an online consultation or a property viewing in Phuket: choose the date, Phuket time and format.',
  },
  /** Title with the « | Home Office & Co» template. */
  privacy: {
    title: 'Privacy policy',
    description:
      'What personal data the Home Office & Co site collects, why, where it is stored, for how long, and how to withdraw consent.',
  },
  /** Title with the « | Home Office & Co» template. */
  consent: {
    title: 'Consent to personal data processing',
    description: 'Consent to the processing of personal data for requests submitted on the Home Office & Co site.',
  },
  /** Title with the « | Home Office & Co» template. */
  credits: {
    title: 'Photo and map data credits',
    description: 'Authors and licenses of the photographs and map data on the Home Office & Co site.',
  },
  /** Absolute title of the 404 page. */
  notFound: {
    title: 'Page not found | Home Office & Co',
  },
} satisfies MetaDict
