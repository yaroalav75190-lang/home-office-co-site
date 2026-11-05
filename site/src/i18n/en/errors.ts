// 404 page (copy-global §11) and the error screens (error.tsx, global-error.tsx).

import type { ErrorsDict } from '../ru/errors'

export const errors = {
  notFound: {
    /** Two D1 lines, the second indented. Each line is one `nowrap`-free block, but keep it short. */
    titleLines: ['No such bay', 'on the map'],
    lead: 'There is no page at this address. The link is outdated or the address has a typo',
    cta: 'Find a property',
    navLabel: 'Site sections',
    links: {
      phuket: 'Property in Phuket',
      deal: 'Deal support',
      podbor: 'Property search',
      contacts: 'Contacts',
      home: 'Home',
    },
  },
  /** error.tsx and global-error.tsx: the page crashed. */
  error: {
    title: 'The page did not load',
    text: 'Refresh it. If that does not help, write or call a broker: we will reply and send what you were looking for',
    retry: 'Refresh the page',
    /** Link to Telegram on the last-resort screen (global-error.tsx has no access to `common`); same as `common.channels.telegram.action`. */
    telegram: 'Message on Telegram',
  },
} satisfies ErrorsDict
