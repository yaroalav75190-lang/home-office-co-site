import { absoluteUrl, ORG_ID } from '@/components/sections/shared/site-url'
import { getDictionary } from '@/i18n'
import { htmlLang, type Locale, localizePath } from '@/i18n/config'

/**
 * Phuket as a schema.org Place; districts point to it with `containedInPlace`. Names in the page's
 * language (`phuket.place` in the dictionary); `alternateName` is the Latin name, the same everywhere.
 */
export function phuketPlace(locale: Locale) {
  const { place } = getDictionary(locale).phuket
  return {
    '@type': 'Place',
    name: place.name,
    alternateName: 'Phuket',
    containedInPlace: { '@type': 'Country', name: place.country },
  } as const
}

/**
 * `WebPage` with `about: Place` for the hub, district and country pages (seo-brief §6.6).
 * The organisation is referenced by `@id` only; its full RealEstateAgent record lives on `/` and
 * `/contacts`. BreadcrumbList comes from `<Breadcrumbs />`. `path` is the Russian path; the URL is
 * localized for `locale`.
 */
export function webPageJsonLd({
  locale,
  path,
  name,
  description,
  about,
}: {
  locale: Locale
  path: string
  name: string
  description: string
  about: Record<string, unknown>
}) {
  const url = absoluteUrl(localizePath(locale, path))
  return {
    '@context': 'https://schema.org',
    '@type': 'WebPage',
    '@id': `${url}#webpage`,
    url,
    name,
    description,
    inLanguage: htmlLang[locale],
    publisher: { '@type': 'RealEstateAgent', '@id': ORG_ID, name: 'Home Office & Co' },
    about,
  }
}
