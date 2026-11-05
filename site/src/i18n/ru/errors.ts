// 404 page (copy-global §11) and the error screens (error.tsx, global-error.tsx).

export const errors = {
  notFound: {
    /** Two D1 lines, the second indented. Each line is one `nowrap`-free block, but keep it short. */
    titleLines: ['Такой бухты', 'нет на карте'] as [string, string],
    lead: 'Страницы по этому адресу нет. Ссылка устарела или в адресе опечатка',
    cta: 'Подобрать объект',
    navLabel: 'Разделы сайта',
    links: {
      phuket: 'Недвижимость на Пхукете',
      deal: 'Сопровождение сделки',
      podbor: 'Подбор объекта',
      contacts: 'Контакты',
      home: 'На главную',
    },
  },
  /** error.tsx and global-error.tsx: the page crashed. */
  error: {
    title: 'Страница не загрузилась',
    text: 'Обновите её. Если не поможет, напишите или позвоните брокеру: ответим и пришлём то, что вы искали',
    retry: 'Обновить страницу',
    /** Link to Telegram on the last-resort screen (global-error.tsx has no access to `common`); same as `common.channels.telegram.action`. */
    telegram: 'Написать в Telegram',
  },
}

export type ErrorsDict = typeof errors
