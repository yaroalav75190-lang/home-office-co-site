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

import { tpl } from '../format'

export const legal = {
  /**
   * One Small line right under the h1 of /privacy and /consent saying that the Russian text
   * prevails. Empty in Russian (nothing is rendered); translations state it in one sentence.
   */
  prevailNote: '',
  /** Last line of /privacy and /consent; {date} is the edition date («03.11.2026»). */
  edition: tpl<'date'>('Редакция от {date}'),

  /** LEGAL TEXT (152-ФЗ): translate faithfully. */
  privacy: {
    title: 'Политика конфиденциальности',
    lead: tpl<'name'>('Как {name} обрабатывает персональные данные тех, кто заходит на сайт и оставляет заявку.'),
    operator: {
      title: '1. Кто обрабатывает данные',
      text: tpl<'name' | 'email'>(
        'Оператор персональных данных: агентство недвижимости {name}. Реквизиты для договора отправляем по запросу. Вопросы о данных принимаем на почту {email}.',
      ),
    },
    data: {
      title: '2. Какие данные собираем',
      items: [
        'имя;',
        'контакт, который вы указали: телефон, ник или номер в Telegram, номер WhatsApp или почту;',
        'ответы в формах: направление и район, цель покупки, бюджет, срок, формат, дата и время встречи, комментарий;',
        'технические данные заявки: страницу, с которой она отправлена, источник перехода, метки рекламной кампании и идентификаторы cookie систем аналитики.',
      ],
      note: 'Паспортные данные и данные банковских карт на сайте не собираем.',
    },
    purposes: {
      title: '3. Зачем',
      items: [
        'чтобы ответить на заявку в канал, который вы выбрали;',
        'чтобы подобрать объекты недвижимости и прислать подборку;',
        'чтобы записать вас на консультацию или просмотр;',
        'чтобы прислать гид инвестора, если вы его запросили;',
        'чтобы считать посещения и понимать, какие страницы полезны. Эти данные обезличены.',
      ],
      note: 'Рассылок, о которых вы не просили, не отправляем. Данные не продаём и не передаём другим компаниям для рекламы.',
    },
    storage: {
      title: '4. Где храним',
      text: 'Заявки хранятся в CRM-системе агентства. Уведомление о новой заявке приходит брокерам агентства в Telegram. Доступ к данным есть только у сотрудников, которые ведут вашу заявку.',
    },
    retention: {
      title: '5. Сколько храним',
      text: 'Пока данные нужны для ответа на заявку, подбора и сопровождения сделки, но не дольше 3 лет с последнего обращения. После этого или после отзыва согласия данные удаляем.',
    },
    rights: {
      title: '6. Ваши права и отзыв согласия',
      text: tpl<'email'>(
        'Вы можете узнать, какие данные о вас хранятся, попросить исправить или удалить их и отозвать согласие на обработку. Напишите на {email} с того контакта, который указали в заявке. Ответим в течение 10 рабочих дней, после отзыва согласия удалим данные в течение 30 дней.',
      ),
    },
    /** «Яндекс Метрика» is the analytics service the site uses (a proper name). */
    cookies: {
      title: '7. Cookie и аналитика',
      text: 'Сайт использует cookie и Яндекс Метрику, чтобы считать посещения и понимать, какие страницы полезны. Cookie можно отключить в настройках браузера, сайт продолжит работать.',
    },
    consent: {
      title: '8. Согласие',
      /** {link}: link to /consent with the text `link`. */
      text: tpl<'link'>(
        'Согласие на обработку персональных данных оформлено отдельным документом: {link}. Актуальная редакция политики всегда на этой странице.',
      ),
      link: 'согласие на обработку персональных данных',
    },
  },

  /** LEGAL TEXT (152-ФЗ, a separate document since 1 Sept 2025): translate faithfully. */
  consent: {
    title: 'Согласие на обработку персональных данных',
    lead: tpl<'name'>(
      'Отмечая согласие в форме на сайте, вы свободно, своей волей и в своём интересе разрешаете агентству {name} обрабатывать ваши персональные данные на условиях ниже.',
    ),
    operator: {
      title: '1. Оператор',
      text: tpl<'name' | 'email'>(
        'Агентство недвижимости {name}. Реквизиты для договора отправляем по запросу, почта для вопросов о данных: {email}.',
      ),
    },
    data: {
      title: '2. Какие данные',
      items: [
        'имя;',
        'телефон, ник или номер в мессенджере, адрес почты: тот контакт, который вы указали;',
        'ответы в квизе и формах записи: направление и район, цель, бюджет, срок, формат, дата и время встречи, комментарий;',
        'технические данные заявки: страница, с которой она отправлена, источник перехода, метки рекламной кампании, идентификаторы cookie систем аналитики.',
      ],
    },
    purposes: {
      title: '3. Цели',
      items: [
        'связаться с вами по заявке в выбранный канал;',
        'подобрать объекты недвижимости и прислать подборку;',
        'записать на консультацию или просмотр;',
        'прислать гид инвестора, если вы его запросили.',
      ],
    },
    processing: {
      title: '4. Что делаем с данными',
      text: 'Собираем, записываем, систематизируем, храним в CRM-системе агентства, уточняем, используем для ответа и подбора, передаём брокерам агентства, которые ведут заявку, удаляем и уничтожаем. Обработка идёт с использованием средств автоматизации и без них.',
    },
    term: {
      title: '5. Срок',
      /** «раздела 3» refers to section 3 above: keep the number. */
      text: 'Согласие действует, пока данные нужны для целей из раздела 3, но не дольше 3 лет с последнего обращения, или до отзыва.',
    },
    withdrawal: {
      title: '6. Как отозвать согласие',
      text: tpl<'email'>('Напишите на {email} с того контакта, который указали в заявке. Данные удалим в течение 30 дней с получения отзыва.'),
    },
    more: {
      title: '7. Подробнее',
      /** {link}: link to /privacy with the text `link`. */
      text: tpl<'link'>('Как храним и используем данные, написано в {link}.'),
      link: 'политике конфиденциальности',
    },
  },

  /** /credits: authors and licenses of photos, map data, fonts and code. Plain, factual wording. */
  credits: {
    title: 'Авторы фото и данных карт',
    lead: 'Фотографии взяты с Unsplash, два снимка Банг Тао — с Wikimedia Commons. Мы кадрируем их и меняем цвет, авторы и лицензии указаны ниже.',
    /** Rows of the photo list; each row is captioned with the caption of its photo (`photos`). */
    photos: {
      title: 'Фотографии',
      /** {author}: name of the author as the source gives it (kept in the original spelling). */
      author: tpl<'author'>('Автор: {author}'),
      /** {license}: the license name as a link («Unsplash License», «CC BY 2.0»), or `publicDomain`. */
      license: tpl<'license'>('Лицензия: {license}'),
      publicDomain: 'общественное достояние',
      /** Link texts to the source page of the photo. */
      sourceUnsplash: 'Страница фото на Unsplash',
      sourceCommons: 'Страница файла на Commons',
      /** {changes}: `photoCredits.changes`, lower-cased by the page. */
      changes: tpl<'changes'>('Изменения: {changes}'),
      /** Rows under a share-alike license (CC BY-SA). */
      shareAlike: 'Наши версии кадра публикуются под той же лицензией',
    },
    maps: {
      title: 'Карты',
      /**
       * {attribution}: `places.osmAttribution` («© участники OpenStreetMap», required by the ODbL);
       * {license}: link with the text `license`; {date}: date of the map data («02.11.2026»).
       */
      text: tpl<'attribution' | 'license' | 'date'>(
        'Береговая линия на картах и в подписях к фото: {attribution}, лицензия {license}, данные на {date}, упрощено. Наши контуры, построенные из этих данных, распространяются под той же лицензией.',
      ),
      /** Official license name: keep in English as is. */
      license: 'Open Database License 1.0',
    },
    software: {
      title: 'Шрифты и код',
      /**
       * `name`: what was used (product names stay as they are); `license`: the official license name
       * and holder, keep as is (only the quote marks in the GSAP one follow your language).
       */
      items: [
        { name: 'Шрифты Noto Serif Display и Onest', license: 'SIL Open Font License 1.1' },
        { name: 'Next.js и React', license: 'MIT' },
        { name: 'GSAP', license: 'Standard «No Charge» License, GreenSock' },
        { name: 'Lenis', license: 'MIT, darkroom.engineering' },
        { name: 'Satūs: плавный скролл и JSON-LD', license: 'MIT, darkroom.engineering' },
        { name: 'Enklawa Villas и Isle Thorne Collective: приёмы раскладки и переходов', license: 'MIT' },
        { name: 'ARVEN: приёмы типографики и формы записи, переписаны на React', license: 'Apache License 2.0' },
      ],
    },
  },
}

export type LegalDict = typeof legal
