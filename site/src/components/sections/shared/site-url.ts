// Absolute URLs for JSON-LD (seo-brief §6.6: `https://{DOMAIN}/#org`, BreadcrumbList items), and the
// origin of `metadataBase`, robots.txt and sitemap.xml. Promo domain (docs/DEMO_DECISIONS.md), the
// client confirms it before launch.
//
// Order: NEXT_PUBLIC_SITE_URL (set it by hand for a staging host or the confirmed domain), then the
// project's production address on Vercel (NEXT_PUBLIC_VERCEL_PROJECT_PRODUCTION_URL, set by Vercel at
// build time: the custom domain once one is added, else <project>.vercel.app), then the promo domain.
// Without this a preview on Vercel would point canonical, hreflang and og:image at a domain that does
// not serve the site, and a link shared in a messenger would show no picture.

const vercel = process.env.NEXT_PUBLIC_VERCEL_PROJECT_PRODUCTION_URL

export const SITE_ORIGIN = (
  process.env.NEXT_PUBLIC_SITE_URL || (vercel ? `https://${vercel}` : 'https://homeofficeco.com')
).replace(/\/+$/, '')

/** «/thailand/phuket» → «https://{DOMAIN}/thailand/phuket». Absolute URLs pass through. */
export function absoluteUrl(path: string): string {
  if (/^https?:\/\//.test(path)) return path
  return `${SITE_ORIGIN}${path.startsWith('/') ? path : `/${path}`}`
}

/** `@id` of the organisation record (full record on `/` and `/contacts`, seo-brief §6.6). */
export const ORG_ID = `${SITE_ORIGIN}/#org`
