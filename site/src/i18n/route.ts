// Route helpers for app/[lang] (English and Spanish). Russian routes in app/(ru) pass 'ru' directly.

import { notFound } from 'next/navigation'
import { type Locale, type PrefixedLocale, defaultLocale, isPrefixedLocale, prefixedLocales } from './config'

/** Params of app/[lang]/…: every page there is generated for /en and /es. */
export type LangParams = Promise<{ lang: string }>

/** `generateStaticParams` of the en/es root layout. */
export function prefixedLocaleParams(): { lang: PrefixedLocale }[] {
  return prefixedLocales.map((lang) => ({ lang }))
}

/** The page's locale; anything but en/es is a 404 (the layout and pages set `dynamicParams = false`). */
export async function localeFromParams(params: LangParams): Promise<PrefixedLocale> {
  const { lang } = await params
  if (!isPrefixedLocale(lang)) notFound()
  return lang
}

/**
 * Locale of the en/es root layout. With `dynamicParams = false` it only ever sees en and es; the
 * Russian fallback keeps the type total.
 */
export function layoutLocale(lang: string | undefined): Locale {
  return isPrefixedLocale(lang) ? lang : defaultLocale
}
