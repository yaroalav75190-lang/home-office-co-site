// Absolute URLs for JSON-LD (seo-brief §6.6: `https://{DOMAIN}/#org`, BreadcrumbList items).
// Promo domain (docs/DEMO_DECISIONS.md), the client confirms it before launch. It mirrors
// `metadataBase` in app/layout.tsx; NEXT_PUBLIC_SITE_URL overrides it for a staging host.

export const SITE_ORIGIN = (process.env.NEXT_PUBLIC_SITE_URL ?? 'https://homeofficeco.com').replace(/\/+$/, '')

/** «/thailand/phuket» → «https://{DOMAIN}/thailand/phuket». Absolute URLs pass through. */
export function absoluteUrl(path: string): string {
  if (/^https?:\/\//.test(path)) return path
  return `${SITE_ORIGIN}${path.startsWith('/') ? path : `/${path}`}`
}

/** `@id` of the organisation record (full record on `/` and `/contacts`, seo-brief §6.6). */
export const ORG_ID = `${SITE_ORIGIN}/#org`
