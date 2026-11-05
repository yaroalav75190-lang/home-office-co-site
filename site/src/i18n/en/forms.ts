// Forms (copy-global §8–§10): field labels, options, validation messages, sending states and the
// thank-you screens of the booking forms and the guide form. The quiz questions are in podbor.ts.
// Option ids, booking slots, budget bounds and phone codes are facts in src/lib/lead.ts and
// src/components/ui/field.tsx; only words live here. These strings are also used by the lead API:
// the server answers field errors in the visitor's language.

import type { FormsDict } from '../ru/forms'

export const forms = {
  /** Field names for the error summary «Исправьте поля: Имя, Телефон». */
  fields: {
    name: 'Name',
    channel: 'Where to reply',
    /** Used when the channel is not chosen yet; otherwise the contact label of the channel. */
    contact: 'Contact',
    consent: 'Consent to data processing',
    format: 'Format',
    direction: 'Destination',
    date: 'Date',
    time: 'Time in Phuket',
    comment: 'Comment',
    goal: 'Goal',
    budget: 'Budget',
    timeline: 'Timing',
    district: 'District',
  },
  /** Added to the label of an optional field (there are no asterisks). */
  optional: ', optional',

  /** «Куда ответить» tiles (four in a row on desktop: keep them short). */
  channels: {
    telegram: 'Telegram',
    whatsapp: 'WhatsApp',
    phone: 'Call',
    email: 'Email',
  },
  /** Label of the contact field for the chosen channel. */
  contactLabels: {
    telegram: 'Telegram username or number',
    whatsapp: 'WhatsApp number',
    phone: 'Phone',
    email: 'Email',
  },
  placeholders: {
    telegram: '@username or +1 555 000 0000',
    email: 'name@example.com',
  },
  /** Under the phone field when the visitor chose a call. */
  phoneHoursHint: 'A broker will call from {open} to {close} Phuket time',

  /** Phone field: hidden label of the code selector and the country names (codes are facts in field.tsx). */
  phone: {
    countryCodeLabel: 'Country code',
    countries: {
      ru: 'Russia',
      kz: 'Kazakhstan',
      by: 'Belarus',
      uz: 'Uzbekistan',
      kg: 'Kyrgyzstan',
      am: 'Armenia',
      ge: 'Georgia',
      az: 'Azerbaijan',
      th: 'Thailand',
      id: 'Indonesia',
      ae: 'UAE',
      kh: 'Cambodia',
      tr: 'Turkey',
      il: 'Israel',
      de: 'Germany',
      other: 'Other country',
    },
  },

  /** Consent checkbox (copy-global §9). The link texts go to /consent and /privacy: legal wording. */
  consent: {
    label: { before: 'I give my ', link: 'consent to the processing of personal data', after: '' },
    description: { before: 'How we store and use data is described in the ', link: 'privacy policy', after: '' },
  },

  /** Hidden field for bots: screen readers skip it, the label only helps a human who reaches it. */
  honeypot: 'Leave this field empty',

  /** Validation messages (copy-global §8.3): say what to fix, never «ошибка». Also returned by the lead API. */
  // Translated by the developers so the lead API answers in the visitor's language from day one: reviewed and kept.
  messages: {
    nameEmpty: 'Please tell us what to call you',
    nameLong: 'Please shorten your name to 60 characters',
    channel: 'Choose where we should reply',
    telegramEmpty: 'Enter the username or phone number linked to your Telegram',
    telegramNick: 'A Telegram username has 5 to 32 characters: Latin letters, digits or _, for example @john_smith',
    phoneEmpty: 'Enter your phone number',
    /** A +7 number (Russia, Kazakhstan) with too few digits. */
    phoneShortRu: 'Check the number: a +7 number needs 10 digits after the code',
    phoneShortOther: 'Check the number: digits are missing after the country code',
    phoneLong: 'The number has extra digits. Check that the country code is not repeated',
    emailEmpty: 'Enter your email',
    emailBad: 'Check the email address, for example name@example.com',
    format: 'Choose a meeting format',
    direction: 'Choose a destination or the “Not decided yet” option',
    date: 'Choose a date',
    time: 'Choose a time',
    slotTaken: 'This time was just booked. Please choose another one',
    /** {n}: the current length of the text. */
    commentLong: 'Please shorten the text to 1,000 characters. It is {n} now',
    consent: 'To send the request, please agree to the processing of your data',
    /** Quiz answers come from tiles; this only shows if a request was tampered with. */
    choice: 'Choose one of the options',
    /** {fields}: field names joined with commas. */
    summary: 'The request was not sent. Please correct: {fields}',
    offline: 'No internet connection. Your details are still in the form. Check your connection and send it again',
    /** {phone}: the broker's number. */
    server: 'The request did not go through because of a problem on our side. Your details are still in the form. Send it again or call us: {phone}',
    /** 429: a retry within 10 minutes fails the same way, so the sentence leads to the phone and Telegram. */
    rateLimited: 'The request did not go through: there were too many attempts from your connection in a row. Call us or message us on Telegram: {phone}',
    /** {when}: «до 16:55», «завтра до 5:15 по вашему времени»… (`common.reply.when`). */
    duplicate: 'A request with this contact is already with the broker. They will reply {when}',
  },

  /** Error summary heading before the field links. */
  summaryLead: 'The request was not sent. Please correct:',
  /** Submit button while sending (same width as the label: keep it short). */
  sending: 'Sending…',
  retry: 'Send again',
  call: 'Call',
  /** Under every submit button. */
  channelNote: 'We write only to the channel you chose. We call if you ask',

  /** Quiz options (question texts are in podbor.ts). Tiles: label one line, description up to two. */
  options: {
    directions: {
      phuket: { label: 'Phuket', description: 'Six districts, condos, villas' },
      pattaya: { label: 'Pattaya', description: 'Mainland city by the sea' },
      bali: { label: 'Bali', description: 'Ownership rules differ from Thailand' },
      dubai: { label: 'Dubai', description: 'Residence visa for a purchase above a set amount' },
      cambodia: { label: 'Cambodia', description: 'Seaside condos' },
      undecided: { label: 'Undecided', description: 'A broker compares countries for you' },
    },
    /** «Направление» in the viewing form. */
    formDirections: {
      phuket: 'Phuket',
      pattaya: 'Pattaya',
      bali: 'Bali',
      dubai: 'Dubai',
      cambodia: 'Cambodia',
      undecided: 'Not decided yet',
    },
    /** Phuket districts the quiz accepts from `?district=`. */
    districts: {
      layan: 'Layan',
      'bang-tao': 'Bang Tao',
      kamala: 'Kamala',
      'karon-kata': 'Kata and Karon',
      'nai-harn-rawai': 'Rawai and Nai Harn',
      chalong: 'Chalong',
    },
    goals: {
      income: { label: 'Rental or resale income', description: 'We calculate seasonal occupancy and phased prices' },
      wintering: { label: 'Live in winter, rent out the rest', description: 'You stay November to March, then it is rented out' },
      relocation: { label: 'Relocation and long stays', description: 'We explain which visas the country offers' },
      capital: { label: 'Preserve capital', description: 'We check the developer and how easy resale will be' },
    },
    /**
     * Budget tiles. The bounds are facts in src/lib/lead.ts (thousands of US dollars: 150, 300, 600);
     * {min} and {max} are those numbers formatted for the locale. Keep the currency and the
     * «thousand» unit in the template: «До 150 тыс. $», «$150–300k».
     */
    budgets: {
      upTo: 'Under ${max}k',
      range: '${min}–{max}k',
      from: '${min}k+',
      unsure: {
        label: 'See what my budget buys',
        description: 'The broker will ask for the amount in a message and show what it can buy',
      },
    },
    timelines: {
      month: { label: 'Within a month', description: '' },
      '1-3': { label: 'In 1–3 months', description: '' },
      '3-6': { label: 'In 3–6 months', description: '' },
      exploring: { label: 'Just exploring', description: 'A shortlist shows prices. We will not rush you' },
    },
    /** «Формат» of the consultation on /services/deal (three tiles in a row). */
    consultationFormats: {
      video: 'Video call',
      call: 'Phone call',
      meeting: 'Meeting in Phuket',
    },
    /** «Формат» of the booking on /contacts. */
    viewingFormats: {
      viewing: { label: 'Viewing in Phuket', description: 'Meet at the property; address after booking' },
      online: { label: 'Online viewing', description: 'The broker shows the property by video' },
      video: { label: 'Video consultation', description: '30 minutes: goal, districts, budget' },
      call: { label: 'Phone call', description: 'Same conversation by phone' },
    },
  },

  /** Date tiles of the booking forms (dates themselves are formatted by locale). */
  dates: {
    legend: 'Date',
    hint: 'Next 14 days',
  },
  /** Time slots: «11:00 на Пхукете» / «07:00 у вас». {time} is formatted by locale. */
  slots: {
    legend: 'Time in Phuket',
    hint: 'Your time is shown next to it',
    phuket: '{time} in Phuket',
    phuketAndYou: '{time} for you and Phuket',
    local: '{time} your time',
  },

  /** Booking forms on /services/deal (consultation) and /contacts (viewing). */
  booking: {
    format: 'Format',
    direction: 'Destination',
    commentConsultation: 'What you have chosen',
    commentViewing: 'What to discuss',
    placeholderConsultation: 'Project name or link',
    placeholderViewing: 'For example, beachfront villas up to $300k',
    submitConsultation: 'Book a consultation',
    submitViewing: 'Book a time',
    /** Under the viewing button. {when}: `common.reply.when`. */
    confirmLine: 'A broker will confirm the booking {when}',
    confirmFallback: 'A broker will confirm the booking within 15 minutes',
  },

  /** Thank-you screens of the booking forms (copy-global §10.2, §10.3). */
  thanks: {
    consultationTitle: 'Consultation booked',
    viewingTitle: 'Viewing booked',
    /** {day}: «12 ноября»; {local}/{phuket}: times formatted by locale. */
    slotPhuket: '{day}, {phuket} Phuket time',
    slotSameZone: '{day}, {phuket}. Your time is the same as Phuket time',
    slotLocal: '{day}, {local} your time, which is {phuket} in Phuket',
    /** «напишет в Telegram»: the {writes} part of the sentences below. */
    writes: {
      telegram: 'will message you on Telegram',
      whatsapp: 'will message you on WhatsApp',
      email: 'will email you',
      phone: 'will call you',
    },
    /** «в Telegram»: the {via} part («подтвердит время в Telegram»). */
    via: {
      telegram: 'on Telegram',
      whatsapp: 'on WhatsApp',
      email: 'by email',
      phone: 'by phone',
    },
    /** By format. {writes}, {via}: above; {when}: `common.reply.when`. */
    formats: {
      video: 'A broker {writes} {when}, confirm the time and send a call link',
      call: 'A broker will confirm the time, {via} {when}, and call you at the agreed hour',
      meeting: 'A broker {writes} {when}, confirm the time and send the meeting address',
      viewing: 'A broker {writes} {when}, ask which properties to show and send the meeting address',
      online: 'A broker {writes} {when}, ask which properties to show and send a video call link',
    },
    change: 'If your plans change, reply to the broker in the same chat and they will offer another time',
    guideCta: 'Open the investor guide',
    guideNote: 'The chapter “The deal step by step” will help before the call',
  },

  /** Investor guide form (home page, copy-home §9) and its thank-you screen (copy-global §10.4). */
  guide: {
    formLabel: 'Get the guide',
    channelLegend: 'Where to send the guide',
    /** Three tiles: no «Звонок» for a PDF. */
    channels: { telegram: 'Telegram', whatsapp: 'WhatsApp', email: 'Email' },
    submit: 'Get guide',
    note: 'We will send the guide to the channel you chose',
    /** {channel}: «в Telegram», «на почту». */
    doneTitle: 'We will send the guide {channel}',
    to: { telegram: 'on Telegram', whatsapp: 'on WhatsApp', email: 'by email' },
    /** {when}: `common.reply.when`. */
    doneEmail: 'Reply to the email with any questions about the guide, and the broker will answer {when}',
    doneChat: 'Ask any questions about the guide in the same chat, and the broker will answer {when}',
  },
} satisfies FormsDict
