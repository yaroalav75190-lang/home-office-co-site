import { absoluteUrl, ORG_ID } from '@/components/sections/shared/site-url'

/** Phuket as a schema.org Place; districts point to it with `containedInPlace`. */
export const phuketPlace = {
  '@type': 'Place',
  name: 'Пхукет',
  alternateName: 'Phuket',
  containedInPlace: { '@type': 'Country', name: 'Таиланд' },
} as const

/**
 * `WebPage` with `about: Place` for the hub, district and country pages (seo-brief §6.6).
 * The organisation is referenced by `@id` only; its full RealEstateAgent record lives on `/` and
 * `/contacts`. BreadcrumbList comes from `<Breadcrumbs />`.
 */
export function webPageJsonLd({
  path,
  name,
  description,
  about,
}: {
  path: string
  name: string
  description: string
  about: Record<string, unknown>
}) {
  const url = absoluteUrl(path)
  return {
    '@context': 'https://schema.org',
    '@type': 'WebPage',
    '@id': `${url}#webpage`,
    url,
    name,
    description,
    inLanguage: 'ru',
    publisher: { '@type': 'RealEstateAgent', '@id': ORG_ID, name: 'Home Office & Co' },
    about,
  }
}
