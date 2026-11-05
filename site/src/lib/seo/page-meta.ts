// Per-locale metadata for a page: title, description, canonical, hreflang alternates, Open Graph.
//
//   export const metadata = pageMetadata({ locale: 'ru', path: '/contacts', ...t.meta.contacts, photo: 'naiharn' })
//
// `path` is always the Russian path («/contacts»). Every page lists ru, en, es and x-default (→ ru);
// the canonical points at the page's own locale. Noindex pages that must not carry a canonical
// (Bang Tao while `ready: false`, /credits) pass `canonical: false`.

import type { Metadata } from 'next'
import { type Locale, localizePath } from '@/i18n/config'
import { type OgPhoto, openGraphFor } from './og'

/** `alternates` for a page: canonical in its own locale and the three language versions. */
export function alternatesFor(locale: Locale, path: string, canonical = true): NonNullable<Metadata['alternates']> {
  const languages = {
    ru: localizePath('ru', path),
    en: localizePath('en', path),
    es: localizePath('es', path),
    'x-default': localizePath('ru', path),
  }
  return canonical ? { canonical: localizePath(locale, path), languages } : { languages }
}

export function pageMetadata({
  locale,
  path,
  title,
  description,
  photo,
  absoluteTitle = true,
  index = true,
  canonical = true,
}: {
  locale: Locale
  path: string
  title: string
  description: string
  /** Open Graph picture (3:2 crop). Without it the page sets no `openGraph`. */
  photo?: OgPhoto
  /** `false`: the title goes through the « | Home Office & Co» template of the layout. */
  absoluteTitle?: boolean
  /** `false`: `noindex, follow`. */
  index?: boolean
  /** `false`: no canonical (noindex pages, seo-brief §6.2). */
  canonical?: boolean
}): Metadata {
  return {
    title: absoluteTitle ? { absolute: title } : title,
    description,
    ...(index ? {} : { robots: { index: false, follow: true } }),
    alternates: alternatesFor(locale, path, canonical),
    ...(photo ? { openGraph: openGraphFor({ locale, path, title, description, photo }) } : {}),
  }
}
