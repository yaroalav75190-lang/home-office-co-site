// Legal and service pages: /privacy, /consent (promo versions under 152-ФЗ, DEMO_DECISIONS
// «Юридические тексты»; a lawyer checks them before launch) and /credits (plain, factual wording).
// Facts stay in the views: e-mail and its link, hrefs, edition dates, the OpenStreetMap data date,
// photo authors, licenses and source links (src/lib/photos.ts). Titles and descriptions: `meta`.
//
// LEGAL TEXT: `privacy` and `consent` are legal documents. Translate them faithfully, sentence by
// sentence: no shortening, no rewording, keep the section numbers and the list punctuation (items
// end with «;», the last one with «.»). They are written for Russian law (152-ФЗ) and a Russian
// audience; the Russian text is the binding one (see `prevailNote`).
// Placeholders: {name} is the agency name (Home Office & Co), {email} the e-mail link, {link} a link
// whose text is the `link` string next to the template, {date} a date in the form of the locale.

import type { LegalDict } from '../ru/legal'

export const legal = {
  /**
   * One Small line right under the h1 of /privacy and /consent saying that the Russian text
   * prevails. Empty in Russian (nothing is rendered); translations state it in one sentence.
   */
  prevailNote: 'This is a translation. If it differs from the Russian text, the Russian text prevails.',
  /** Last line of /privacy and /consent; {date} is the edition date («03.11.2026»). */
  edition: 'Edition of {date}',

  /** LEGAL TEXT (152-ФЗ): translate faithfully. */
  privacy: {
    title: 'Privacy policy',
    lead: 'How {name} processes the personal data of people who visit the site and submit a request.',
    operator: {
      title: '1. Who processes the data',
      text: 'Personal data operator: the real estate agency {name}. We send company details for the contract on request. We accept questions about data at {email}.',
    },
    data: {
      title: '2. What data we collect',
      items: [
        'name;',
        'the contact you provided: phone number, Telegram username or number, WhatsApp number or email;',
        'your answers in the forms: destination and district, purpose of purchase, budget, timing, format, date and time of the meeting, comment;',
        'technical data of the request: the page it was sent from, the source of the visit, advertising campaign tags and analytics cookie identifiers.',
      ],
      note: 'We do not collect passport data or bank card data on the site.',
    },
    purposes: {
      title: '3. Why',
      items: [
        'to reply to your request through the channel you chose;',
        'to select properties and send a shortlist;',
        'to book you for a consultation or a viewing;',
        'to send the investor guide, if you requested it;',
        'to count visits and understand which pages are useful. This data is anonymized.',
      ],
      note: 'We send no mailings you did not ask for. We do not sell data or pass it to other companies for advertising.',
    },
    storage: {
      title: '4. Where we store it',
      text: 'Requests are stored in the agency’s CRM system. A notification of a new request goes to the agency’s brokers in Telegram. Only the employees who handle your request have access to the data.',
    },
    retention: {
      title: '5. How long we store it',
      text: 'For as long as the data is needed to answer the request, to select properties and to support the deal, but no longer than 3 years from your last contact. After that, or after you withdraw consent, we delete the data.',
    },
    rights: {
      title: '6. Your rights and withdrawal of consent',
      text: 'You can find out what data about you is stored, ask us to correct or delete it, and withdraw your consent to processing. Write to {email} from the contact you gave in your request. We will reply within 10 business days, and after consent is withdrawn we will delete the data within 30 days.',
    },
    /** «Яндекс Метрика» is the analytics service the site uses (a proper name). */
    cookies: {
      title: '7. Cookies and analytics',
      text: 'The site uses cookies and Yandex Metrica to count visits and understand which pages are useful. You can disable cookies in your browser settings, and the site will keep working.',
    },
    consent: {
      title: '8. Consent',
      /** {link}: link to /consent with the text `link`. */
      text: 'Consent to the processing of personal data is set out as a separate document: {link}. The current edition of the policy is always on this page.',
      link: 'consent to the processing of personal data',
    },
  },

  /** LEGAL TEXT (152-ФЗ, a separate document since 1 Sept 2025): translate faithfully. */
  consent: {
    title: 'Consent to the processing of personal data',
    lead: 'By ticking the consent box in a form on the site, you freely, of your own will and in your own interest allow the agency {name} to process your personal data on the terms below.',
    operator: {
      title: '1. Operator',
      text: 'The real estate agency {name}. We send company details for the contract on request; the email for questions about data: {email}.',
    },
    data: {
      title: '2. What data',
      items: [
        'name;',
        'phone number, messenger username or number, email address: the contact you provided;',
        'answers in the quiz and the booking forms: destination and district, goal, budget, timing, format, date and time of the meeting, comment;',
        'technical data of the request: the page it was sent from, the source of the visit, advertising campaign tags, analytics cookie identifiers.',
      ],
    },
    purposes: {
      title: '3. Purposes',
      items: [
        'to contact you about the request through the channel you chose;',
        'to select properties and send a shortlist;',
        'to book a consultation or a viewing;',
        'to send the investor guide, if you requested it.',
      ],
    },
    processing: {
      title: '4. What we do with the data',
      text: 'We collect, record, organize, store in the agency’s CRM system, clarify, use to answer you and select properties, pass to the agency’s brokers who handle the request, delete and destroy. Processing is carried out with and without the use of automation tools.',
    },
    term: {
      title: '5. Term',
      /** «раздела 3» refers to section 3 above: keep the number. */
      text: 'The consent is valid for as long as the data is needed for the purposes in section 3, but no longer than 3 years from your last contact, or until withdrawn.',
    },
    withdrawal: {
      title: '6. How to withdraw consent',
      text: 'Write to {email} from the contact you gave in your request. We will delete the data within 30 days of receiving the withdrawal.',
    },
    more: {
      title: '7. More information',
      /** {link}: link to /privacy with the text `link`. */
      text: 'How we store and use data is described in the {link}.',
      link: 'privacy policy',
    },
  },

  /** /credits: authors and licenses of photos, map data, fonts and code. Plain, factual wording. */
  credits: {
    title: 'Photo and map data credits',
    lead: 'The photographs come from Unsplash; two photos of Bang Tao come from Wikimedia Commons. We crop them and adjust the color. Authors and licenses are listed below.',
    /** Rows of the photo list; each row is captioned with the caption of its photo (`photos`). */
    photos: {
      title: 'Photographs',
      /** {author}: name of the author as the source gives it (kept in the original spelling). */
      author: 'Author: {author}',
      /** {license}: the license name as a link («Unsplash License», «CC BY 2.0»), or `publicDomain`. */
      license: 'License: {license}',
      publicDomain: 'public domain',
      /** Link texts to the source page of the photo. */
      sourceUnsplash: 'Photo page on Unsplash',
      sourceCommons: 'File page on Commons',
      /** {changes}: `photoCredits.changes`, lower-cased by the page. */
      changes: 'Changes: {changes}',
      /** Rows under a share-alike license (CC BY-SA). */
      shareAlike: 'Our versions of the image are published under the same license',
    },
    maps: {
      title: 'Maps',
      /**
       * {attribution}: `places.osmAttribution` («© участники OpenStreetMap», required by the ODbL);
       * {license}: link with the text `license`; {date}: date of the map data («02.11.2026»).
       */
      text: 'The coastline on the maps and in the photo captions: {attribution}, license {license}, data as of {date}, simplified. Our outlines built from this data are distributed under the same license.',
      /** Official license name: keep in English as is. */
      license: 'Open Database License 1.0',
    },
    software: {
      title: 'Fonts and code',
      /**
       * `name`: what was used (product names stay as they are); `license`: the official license name
       * and holder, keep as is (only the quote marks in the GSAP one follow your language).
       */
      items: [
        { name: 'Noto Serif Display and Onest fonts', license: 'SIL Open Font License 1.1' },
        { name: 'Next.js and React', license: 'MIT' },
        { name: 'GSAP', license: 'Standard “No Charge” License, GreenSock' },
        { name: 'Lenis', license: 'MIT, darkroom.engineering' },
        { name: 'Satūs: smooth scroll and JSON-LD', license: 'MIT, darkroom.engineering' },
        { name: 'Enklawa Villas and Isle Thorne Collective: layout and transition techniques', license: 'MIT' },
        { name: 'ARVEN: typography and booking form techniques, rewritten in React', license: 'Apache License 2.0' },
      ],
    },
  },
} satisfies LegalDict
