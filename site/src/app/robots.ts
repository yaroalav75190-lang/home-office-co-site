import type { MetadataRoute } from 'next'
import { SITE_ORIGIN } from '@/components/sections/shared/site-url'
import { NOINDEX } from '@/lib/seo/noindex'

// robots.txt (seo-brief §6.4). Allow everything except service routes; /_next/static and /_next/image
// stay open so robots can render the page. /s/{token} is deliberately not listed: it is closed with
// noindex headers, a robots.txt block would hide those from the crawler (§6.4, §6.5).
//
// The origin is the one of `metadataBase` and the sitemap (sections/shared/site-url.ts).
const ORIGIN = SITE_ORIGIN

export default function robots(): MetadataRoute.Robots {
  // A preview for the client (SITE_NOINDEX=1): nothing to crawl, no sitemap.
  if (NOINDEX) return { rules: [{ userAgent: '*', disallow: '/' }] }
  return {
    rules: [
      {
        userAgent: '*',
        allow: '/',
        disallow: ['/api/', '/admin'],
        // Yandex only (Google ignores the directive and relies on canonical). Clean-param is an
        // intersectional directive: Yandex reads it from any group, so it can live in the `*` block
        // and no separate `User-agent: Yandex` group is needed (a Yandex group would make Yandex ignore
        // `*` and force a copy of every Disallow). Syntax: `Clean-param: p1&p2 [path prefix]`.
        // Next.js passes `other` through verbatim, one line per array entry.
        other: {
          'Clean-param': [
            'utm_source&utm_medium&utm_campaign&utm_content&utm_term',
            'yclid&ysclid&gclid&fbclid&_openstat&from&roistat',
            // The quiz links prefill the form (/podbor?country=bali, ?country=phuket&district=bang-tao);
            // the canonical is /podbor without parameters (§6.1).
            'country&district /podbor',
            'country&district /en/podbor',
            'country&district /es/podbor',
          ],
        },
      },
    ],
    sitemap: `${ORIGIN}/sitemap.xml`,
  }
}
