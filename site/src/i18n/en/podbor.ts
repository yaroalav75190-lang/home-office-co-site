// /podbor: the quiz «Подбор объекта» (copy-podbor, copy-global §10.1) and the blocks under it.
// Answer options (directions, goals, budgets, timelines) are in forms.ts `options`.

import type { PodborDict } from '../ru/podbor'

export const podbor = {
  /** Screen-reader names of the two sections of the page. */
  sectionLabel: 'Property search',
  aboutLabel: 'About the search',

  quiz: {
    /** h1 (D2), visible on the first question only. */
    title: 'Find a property',
    /**
     * Lead over the first question. {count}: the number word from `countWords` («Четыре», «Три»
     * when the country came from the link).
     */
    intro: '{count} questions and your contact. A broker will send 3 to 5 projects, each with its downsides described',
    countWords: { three: 'Three', four: 'Four' },
    questions: {
      direction: 'Where are you looking for property?',
      goal: 'Why are you buying?',
      budget: 'What budget are you considering?',
      timeline: 'When do you plan to buy?',
    },
    /** Progress line: «Вопрос 2 из 4». */
    progress: 'Question {n} of {total}',
    lastStep: 'Last step',
    /** Shown when the country came from the link: «Направление: Пхукет, Банг Тао» + «Изменить». */
    prefilled: 'Destination: {direction}',
    change: 'Change',
    hint: 'The next question opens as soon as you choose',
    /** Desktop only, after the hint. {n}: the number of options. */
    keysHint: '. On a keyboard: arrow keys or 1–{n}, Enter to continue',
    personal: 'A broker answers personally. We write only to the channel you chose',
    back: 'Back',

    /** Photo column (desktop): {when} is `common.reply.when`. */
    columnLine: 'A broker will write {when}, and within 24 hours send 3 to 5 projects',
    columnFallback: 'A broker will write within 15 minutes, and within 24 hours send 3 to 5 projects',

    /** Contact step. */
    contactTitle: 'Where should we send the shortlist?',
    /** {broker}: «брокер по Пхукету» from `brokerFor`. */
    whoAnswers: 'Your reply will come from {broker}',
    /** «брокер по Пхукету»: who answers, by the chosen direction (dative in Russian). */
    brokerFor: {
      none: 'a Thailand broker',
      undecided: 'a Thailand broker',
      phuket: 'a Phuket broker',
      pattaya: 'a Pattaya broker',
      bali: 'a Bali broker',
      dubai: 'a Dubai broker',
      cambodia: 'a Cambodia broker',
    },
    nameLabel: 'Name',
    submit: 'Get a shortlist',

    /** Confirmation (copy-global §10.1). */
    doneTitle: 'Your request is with a broker',
    /** First line. {who}: `who` or `whoNamed`; {verb}: by channel; {when}: `common.reply.when`. */
    doneLead: '{who} {verb} {when}',
    /** Out of hours, appended to the first line. {time}: now on Phuket; {open}: opening time. */
    doneLeadClosed: '. It is {time} in Phuket now, and brokers are available from {open}',
    who: 'A broker',
    whoNamed: '{name}, a broker',
    verbs: {
      telegram: 'will message you on Telegram',
      whatsapp: 'will message you on WhatsApp',
      email: 'will reply by email',
      phone: 'will call you',
    },
    /** What happens next: three lines, each a bold lead and a sentence. */
    next: {
      /** First lead is the capitalised `common.reply.when` with a full stop: «До 16:55.» */
      firstFallback: 'Within 15 minutes',
      first: {
        telegram: 'The broker will message you on Telegram, introduce themselves and ask one follow-up question about your answers',
        whatsapp: 'The broker will message you on WhatsApp, introduce themselves and ask one follow-up question about your answers',
        email: 'The broker will email you, introduce themselves and ask one follow-up question about your answers',
        phone: 'The broker will call you, introduce themselves and ask one follow-up question about your answers',
      },
      secondLead: 'Within 24 hours.',
      second:
        'They will send 3 to 5 projects by a private link. Each one shows today’s price, the type of ownership, the construction stage, the pros and the downsides',
      thirdLead: 'Then at your pace.',
      third: 'If you want, the broker will go through the shortlist with you in 20 minutes by phone or video',
    },
    guideCta: 'Open the investor guide',
    guideNote: 'A PDF with 20 minutes of reading. We already have your contact, so no form is needed',
  },

  /** Under the quiz (copy-podbor «Под квизом»): h2 D3 + Body. */
  below: [
    {
      title: 'How the search works',
      text: 'You answer 4 questions and leave a contact. The broker reads your answers, asks one follow-up question and builds the shortlist by hand. Every project comes with its downsides described.',
    },
    {
      title: 'What happens after your request',
      text: 'A broker will write to the channel you chose within 15 minutes. Brokers are available from 9:00 am to 9:00 pm Phuket time. If you write at night, the request is seen in the morning and answered by 9:15 am Phuket time. The shortlist by a private link arrives within 24 hours.',
    },
    {
      title: 'Why there is no catalog on the site',
      text: 'Current properties live in chats with developers. Prices and available units change faster than a catalog could be updated. The broker selects projects for your goal and explains why the others did not fit.',
    },
  ],
  privacy: {
    title: 'Privacy',
    /** Two links inside: «{privacy}» → /privacy, «{consent}» → /consent (link texts below). */
    text: 'We use your contact only to answer your request. How we store data is described in the {privacy} and in the {consent}.',
    privacyLink: 'privacy policy',
    consentLink: 'consent to data processing',
  },
  dealLink: 'Deal support',
} satisfies PodborDict
