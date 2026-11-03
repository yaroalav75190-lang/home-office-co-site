import type { MetadataRoute } from 'next'
import { districtHref, districts } from '@/components/sections/phuket/districts'
import { SITE_ORIGIN } from '@/components/sections/shared/site-url'

// sitemap.xml (seo-brief §6.8): only canonical URLs that answer 200 and are indexable. No noindex
// pages, no redirects (/thailand and /services are 302s), no /en stub (noindex, no English pair yet),
// no /credits (noindex), no /s/{token}. One file is enough for this volume.
//
// The domain comes from SITE_ORIGIN, the same constant JSON-LD uses (equal to `metadataBase`).
const ORIGIN = SITE_ORIGIN

// `lastModified` is a real date, not the build date (seo-brief §6.8): the day the page content last
// changed in substance. Update it by hand together with the page; replace with Payload `updatedAt`
// when the CMS arrives. All first-wave pages were last revised for the promo version on 03.11.2026.
const REVISED = '2026-11-03'

/** The home URL has no trailing slash: it is exactly what `alternates.canonical: '/'` renders. */
const url = (path: string) => (path === '/' ? ORIGIN : `${ORIGIN}${path}`)

const pages: { path: string; lastModified: string }[] = [
  { path: '/', lastModified: REVISED },
  { path: '/thailand/phuket', lastModified: REVISED },
  { path: '/services/deal', lastModified: REVISED },
  { path: '/podbor', lastModified: REVISED },
  { path: '/contacts', lastModified: REVISED },
]

// /privacy and /consent are `noindex, follow` until the lawyer has checked the 152-ФЗ texts
// (robots in app/privacy/page.tsx and app/consent/page.tsx). seo-brief §6.5 wants them indexed and in
// the sitemap: flip this flag in the same commit that removes `robots: { index: false }` from both pages.
const LEGAL_INDEXABLE = false

const legalPages: { path: string; lastModified: string }[] = [
  { path: '/privacy', lastModified: REVISED },
  { path: '/consent', lastModified: REVISED },
]

export default function sitemap(): MetadataRoute.Sitemap {
  // District pages join the sitemap on their own when the broker confirms the facts (`page.ready`):
  // the same flag turns off `noindex` and adds the canonical in app/thailand/phuket/[district]/page.tsx.
  const districtPages = districts
    .filter((d) => d.page?.ready)
    .map((d) => ({ path: districtHref(d), lastModified: REVISED }))

  return [...pages, ...districtPages, ...(LEGAL_INDEXABLE ? legalPages : [])].map(({ path, lastModified }) => ({
    url: url(path),
    lastModified,
  }))
}
