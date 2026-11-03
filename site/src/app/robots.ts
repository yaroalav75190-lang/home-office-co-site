import type { MetadataRoute } from 'next'

// robots.txt (seo-brief §6.4). Allow everything except service routes; /_next/static and /_next/image
// stay open so robots can render the page. /s/{token} is deliberately not listed: it is closed with
// noindex headers, a robots.txt block would hide those from the crawler (§6.4, §6.5).
//
// TODO(launch): keep equal to `metadataBase` in app/layout.tsx (see the note in app/sitemap.ts).
const ORIGIN = 'https://homeofficeco.com'

export default function robots(): MetadataRoute.Robots {
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
          ],
        },
      },
    ],
    sitemap: `${ORIGIN}/sitemap.xml`,
  }
}
