// Locales of the site (docs/content/i18n-translation-guide.md).
//
// Russian is the default and lives at the root, exactly where it always was: `/`, `/contacts`…
// English and Spanish mirror every page under a prefix: `/en/contacts`, `/es/contacts`.
// Route groups give each its own root layout (`app/(ru)` with lang="ru", `app/[lang]` for en/es),
// so `<html lang>` is right on the first byte.
//
// Facts only here (codes, URL prefixes, Intl locales). Words live in the dictionaries.

export const locales = ['ru', 'en', 'es'] as const
export type Locale = (typeof locales)[number]

/** The root locale: no URL prefix, `x-default` for search engines. */
export const defaultLocale: Locale = 'ru'

/** Locales served under `/{locale}/…` by `app/[lang]`. */
export const prefixedLocales = ['en', 'es'] as const
export type PrefixedLocale = (typeof prefixedLocales)[number]

export function isLocale(value: unknown): value is Locale {
  return typeof value === 'string' && (locales as readonly string[]).includes(value)
}

export function isPrefixedLocale(value: unknown): value is PrefixedLocale {
  return typeof value === 'string' && (prefixedLocales as readonly string[]).includes(value)
}

/** `<html lang>` and `hreflang` values. */
export const htmlLang: Record<Locale, string> = { ru: 'ru', en: 'en', es: 'es' }

/** Intl locale for dates, times and numbers (American English, Castilian Spanish). */
export const intlLocale: Record<Locale, string> = { ru: 'ru-RU', en: 'en-US', es: 'es-ES' }

/** `og:locale`. */
export const ogLocale: Record<Locale, string> = { ru: 'ru_RU', en: 'en_US', es: 'es_ES' }

/** Clock style: 24-hour «16:40» or 12-hour «4:40 pm». */
export const hour12: Record<Locale, boolean> = { ru: false, en: true, es: false }

/** Language switcher: the short code and the language's own name (endonym), the same on every page. */
export const localeLabels: Record<Locale, { short: string; name: string }> = {
  ru: { short: 'RU', name: 'Русский' },
  en: { short: 'EN', name: 'English' },
  es: { short: 'ES', name: 'Español' },
}

/** Country preselected in the phone field. Russian visitors mostly call from +7; en/es pick the code. */
export const defaultPhoneCountry: Record<Locale, string> = { ru: 'ru', en: 'other', es: 'other' }

const PREFIX = /^\/(en|es)(?=\/|$|\?|#)/

/**
 * «/podbor?country=bali» → «/en/podbor?country=bali» for en; unchanged for ru.
 * External URLs, protocol-relative URLs, anchors, `/api/…` and already prefixed paths pass through.
 */
export function localizePath(locale: Locale, href: string): string {
  if (locale === defaultLocale) return href
  if (!href.startsWith('/') || href.startsWith('//') || href.startsWith('/api/')) return href
  if (PREFIX.test(href)) return href
  if (href === '/') return `/${locale}`
  // «/?x=1», «/#gid»: the home page with a query or an anchor.
  if (href.startsWith('/?') || href.startsWith('/#')) return `/${locale}${href.slice(1)}`
  return `/${locale}${href}`
}

/** «/en/podbor» → { locale: 'en', path: '/podbor' }; «/podbor» → { locale: 'ru', path: '/podbor' }. */
export function stripLocale(pathname: string | null | undefined): { locale: Locale; path: string } {
  const p = pathname || '/'
  const m = PREFIX.exec(p)
  if (!m) return { locale: defaultLocale, path: p }
  const rest = p.slice(m[0].length)
  return { locale: m[1] as Locale, path: rest === '' ? '/' : rest.startsWith('/') ? rest : `/${rest}` }
}

/** The same page in another locale: «/en/contacts» → «/es/contacts», «/contacts» → «/en/contacts». */
export function switchLocalePath(pathname: string | null | undefined, target: Locale): string {
  return localizePath(target, stripLocale(pathname).path)
}
