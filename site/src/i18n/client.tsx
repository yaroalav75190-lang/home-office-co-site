'use client'

// Locale for Client Components. The site shell (src/components/layout/site-shell.tsx) wraps every
// page in <LocaleProvider> with the page's locale and the client part of its dictionary.
//
//   const { locale, t } = useLocale()   // t.common.nav.contacts, t.forms.messages.nameEmpty …

import { createContext, type ReactNode, useContext } from 'react'
import type { ClientMessages } from '.'
import { type Locale, localizePath } from './config'

type LocaleContextValue = { locale: Locale; t: ClientMessages }

const LocaleContext = createContext<LocaleContextValue | null>(null)

export function LocaleProvider({
  locale,
  messages,
  children,
}: {
  locale: Locale
  messages: ClientMessages
  children: ReactNode
}) {
  return <LocaleContext.Provider value={{ locale, t: messages }}>{children}</LocaleContext.Provider>
}

export function useLocale(): LocaleContextValue {
  const value = useContext(LocaleContext)
  if (!value) throw new Error('useLocale() needs <LocaleProvider> (rendered by the site shell)')
  return value
}

/** Locale without throwing: null outside the shell (global-error.tsx). */
export function useOptionalLocale(): LocaleContextValue | null {
  return useContext(LocaleContext)
}

/** `href('/podbor')` → «/en/podbor» on English pages. */
export function useLocalizedHref(): (href: string) => string {
  const { locale } = useLocale()
  return (href: string) => localizePath(locale, href)
}
