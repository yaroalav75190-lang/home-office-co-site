// /podbor: the quiz «Подбор объекта» (copy-podbor, copy-global §10.1) and the blocks under it.
// Answer options (directions, goals, budgets, timelines) are in forms.ts `options`.

import { tpl } from '../format'

export const podbor = {
  /** Screen-reader names of the two sections of the page. */
  sectionLabel: 'Подбор недвижимости',
  aboutLabel: 'О подборе',

  quiz: {
    /** h1 (D2), visible on the first question only. */
    title: 'Подбор недвижимости',
    /**
     * Lead over the first question. {count}: the number word from `countWords` («Четыре», «Три»
     * when the country came from the link).
     */
    intro: tpl<'count'>('{count} вопроса и контакт. Брокер пришлёт от 3 до 5 проектов, у каждого описаны минусы'),
    countWords: { three: 'Три', four: 'Четыре' },
    questions: {
      direction: 'Где смотрите недвижимость?',
      goal: 'Для чего покупаете?',
      budget: 'Какой бюджет рассматриваете?',
      timeline: 'Когда планируете покупку?',
    },
    /** Progress line: «Вопрос 2 из 4». */
    progress: tpl<'n' | 'total'>('Вопрос {n} из {total}'),
    lastStep: 'Последний шаг',
    /** Shown when the country came from the link: «Направление: Пхукет, Банг Тао» + «Изменить». */
    prefilled: tpl<'direction'>('Направление: {direction}'),
    change: 'Изменить',
    hint: 'После выбора сразу откроется следующий вопрос',
    /** Desktop only, after the hint. {n}: the number of options. */
    keysHint: tpl<'n'>('. С клавиатуры: стрелки или 1–{n}, Enter — дальше'),
    personal: 'Отвечает брокер лично. Пишем только в выбранный канал',
    back: 'Назад',

    /** Photo column (desktop): {when} is `common.reply.when`. */
    columnLine: tpl<'when'>('Брокер напишет {when}, а в течение 24 часов пришлёт от 3 до 5 проектов'),
    columnFallback: 'Брокер напишет в течение 15 минут, а в течение 24 часов пришлёт от 3 до 5 проектов',

    /** Contact step. */
    contactTitle: 'Куда прислать подборку?',
    /** {broker}: «брокер по Пхукету» from `brokerFor`. */
    whoAnswers: tpl<'broker'>('Вам ответит {broker}'),
    /** «брокер по Пхукету»: who answers, by the chosen direction (dative in Russian). */
    brokerFor: {
      none: 'брокер по Таиланду',
      undecided: 'брокер по Таиланду',
      phuket: 'брокер по Пхукету',
      pattaya: 'брокер по Паттайе',
      bali: 'брокер по Бали',
      dubai: 'брокер по Дубаю',
      cambodia: 'брокер по Камбодже',
    },
    nameLabel: 'Имя',
    submit: 'Получить подборку',

    /** Confirmation (copy-global §10.1). */
    doneTitle: 'Заявка у брокера',
    /** First line. {who}: `who` or `whoNamed`; {verb}: by channel; {when}: `common.reply.when`. */
    doneLead: tpl<'who' | 'verb' | 'when'>('{who} {verb} {when}'),
    /** Out of hours, appended to the first line. {time}: now on Phuket; {open}: opening time. */
    doneLeadClosed: tpl<'time' | 'open'>('. Сейчас на Пхукете {time}, брокеры на связи с {open}'),
    who: 'Брокер',
    whoNamed: tpl<'name'>('{name}, брокер'),
    verbs: {
      telegram: 'напишет вам в Telegram',
      whatsapp: 'напишет вам в WhatsApp',
      email: 'ответит на почту',
      phone: 'позвонит',
    },
    /** What happens next: three lines, each a bold lead and a sentence. */
    next: {
      /** First lead is the capitalised `common.reply.when` with a full stop: «До 16:55.» */
      firstFallback: 'В течение 15 минут',
      first: {
        telegram: 'Брокер напишет в Telegram, представится и задаст один уточняющий вопрос по вашим ответам',
        whatsapp: 'Брокер напишет в WhatsApp, представится и задаст один уточняющий вопрос по вашим ответам',
        email: 'Брокер напишет на почту, представится и задаст один уточняющий вопрос по вашим ответам',
        phone: 'Брокер позвонит, представится и задаст один уточняющий вопрос по вашим ответам',
      },
      secondLead: 'В течение 24 часов.',
      second:
        'Пришлёт от 3 до 5 проектов по закрытой ссылке, у каждого указаны цена на сегодня, тип собственности, стадия стройки, плюсы и минусы',
      thirdLead: 'Дальше в вашем темпе.',
      third: 'Если захотите, брокер разберёт подборку с вами за 20 минут по телефону или видео',
    },
    guideCta: 'Открыть гид инвестора',
    guideNote: 'PDF на 20 минут чтения. Контакт у нас уже есть, форма не нужна',
  },

  /** Under the quiz (copy-podbor «Под квизом»): h2 D3 + Body. */
  below: [
    {
      title: 'Как работает подбор',
      text: 'Вы отвечаете на 4 вопроса и оставляете контакт. Брокер смотрит ответы, задаёт один уточняющий вопрос и вручную собирает подборку. У каждого проекта описаны минусы.',
    },
    {
      title: 'Что будет после заявки',
      text: 'Брокер напишет в выбранный канал за 15 минут. Брокеры на связи с 9:00 до 21:00 по Пхукету, это с 5:00 до 17:00 по Москве. Если напишете ночью, заявку увидят утром и ответят до 9:15 по Пхукету. Подборка по закрытой ссылке придёт в течение 24 часов.',
    },
    {
      title: 'Почему на сайте нет каталога',
      text: 'Актуальные объекты живут в чатах с застройщиками. Цены и свободные квартиры меняются быстрее, чем обновлялся бы каталог. Брокер отбирает проекты под задачу и объясняет, почему остальные не подошли.',
    },
  ],
  privacy: {
    title: 'Конфиденциальность',
    /** Two links inside: «{privacy}» → /privacy, «{consent}» → /consent (link texts below). */
    text: tpl<'privacy' | 'consent'>('Контакт используем только для ответа по заявке. Как храним данные, написано в {privacy} и в {consent}.'),
    privacyLink: 'политике конфиденциальности',
    consentLink: 'согласии на обработку данных',
  },
  dealLink: 'Сопровождение сделки',
}

export type PodborDict = typeof podbor
