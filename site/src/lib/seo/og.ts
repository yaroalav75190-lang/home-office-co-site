import type { Metadata } from 'next'
import { type PhotoKey, type PhotoRatio, getPhoto, photoMeta } from '@/lib/photos'
import { site } from '@/lib/site'

type OpenGraph = NonNullable<Metadata['openGraph']>

/** Photos with a 3:2 crop: the OG card ratio until the 1200×630 cards exist. */
type OgPhoto = { [K in PhotoKey]: '3x2' extends PhotoRatio<K> ? K : never }[PhotoKey]

/**
 * Full Open Graph record for a page. A page-level `openGraph` replaces the root one in Next.js
 * (no merge), so every page sets site name, locale and picture itself (docs/qa/seo-gate.md №2):
 * links get forwarded in Telegram, and a preview without a picture looks broken.
 */
export function openGraphFor({
  path,
  title,
  description,
  photo,
}: {
  path: string
  title: string
  description: string
  photo: OgPhoto
}): OpenGraph {
  const image = getPhoto(photo, '3x2' as PhotoRatio<typeof photo>)
  return {
    title,
    description,
    url: path,
    type: 'website',
    siteName: site.name,
    locale: site.locale,
    images: [{ url: image.src, width: image.width, height: image.height, alt: photoMeta[photo].alt }],
  }
}
