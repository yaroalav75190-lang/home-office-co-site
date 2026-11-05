// Dictionaries for Server Components, metadata, the lead API and other server code.
//
//   const t = getDictionary(locale)      // t.home.hero.lead, t.meta.contacts.title …
//
// All three locales are imported here, so keep this module out of Client Components: they get the
// strings they need through <LocaleProvider> (`useLocale()` from '@/i18n/client') or as props.

import type { Locale } from './config'
import { en } from './en'
import { es } from './es'
import { type Dictionary, ru } from './ru'

export type { Dictionary }
export type { Locale }

const dictionaries: Record<Locale, Dictionary> = { ru, en, es }

export function getDictionary(locale: Locale): Dictionary {
  return dictionaries[locale]
}

/** The part of the dictionary Client Components read through <LocaleProvider> (sent once per page load). */
export type ClientMessages = Pick<Dictionary, 'common' | 'forms' | 'errors'>

export function getClientMessages(locale: Locale): ClientMessages {
  const t = dictionaries[locale]
  return { common: t.common, forms: t.forms, errors: t.errors }
}
