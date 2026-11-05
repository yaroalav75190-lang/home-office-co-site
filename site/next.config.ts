import type { NextConfig } from 'next'

const nextConfig: NextConfig = {
  // A check build can go to its own folder (NEXT_DIST_DIR=.next/check) so it never overwrites the
  // build a running `next start` serves. Unset, this is the default `.next`.
  distDir: process.env.NEXT_DIST_DIR || '.next',
  images: {
    // Next.js 16 requires an explicit allowlist of qualities.
    qualities: [70, 80, 90],
    formats: ['image/avif', 'image/webp'],
  },
  // Tailwind CSS v4 runs as a Turbopack loader (the project has no PostCSS config).
  // Without this rule `@import "tailwindcss"` is not compiled and no utilities are generated.
  turbopack: {
    rules: {
      '*.css': {
        loaders: ['@tailwindcss/turbopack'],
        as: '*.css',
      },
    },
  },
  poweredByHeader: false,
  // Baseline security headers (docs/qa/seo-gate.md №5). CSP is a separate task: the inline boot
  // script and Yandex Metrica need nonces. Browsers ignore HSTS over plain HTTP, so local runs are safe;
  // on the production domain it applies once HTTPS is confirmed (no preload).
  async headers() {
    return [
      {
        source: '/:path*',
        headers: [
          { key: 'X-Content-Type-Options', value: 'nosniff' },
          { key: 'Referrer-Policy', value: 'strict-origin-when-cross-origin' },
          { key: 'X-Frame-Options', value: 'DENY' },
          { key: 'Permissions-Policy', value: 'camera=(), microphone=(), geolocation=()' },
          { key: 'Strict-Transport-Security', value: 'max-age=31536000; includeSubDomains' },
        ],
      },
    ]
  },
  // Hubs without a page yet answer a temporary 302 to their main child (seo-brief §5.1, §6.1).
  // Here rather than in route handlers: `request.url` behind a proxy can carry the internal host.
  // Replace with app/thailand/page.tsx and app/services/page.tsx once the hubs exist.
  // English and Spanish mirror them under /en and /es.
  async redirects() {
    return [
      { source: '/thailand', destination: '/thailand/phuket', statusCode: 302 },
      { source: '/services', destination: '/services/deal', statusCode: 302 },
      { source: '/:lang(en|es)/thailand', destination: '/:lang/thailand/phuket', statusCode: 302 },
      { source: '/:lang(en|es)/services', destination: '/:lang/services/deal', statusCode: 302 },
    ]
  },
  experimental: {
    // Two root layouts (app/(ru) for Russian, app/[lang] for en/es): unmatched URLs get
    // app/global-not-found.tsx, the documented 404 for apps without a single root layout.
    globalNotFound: true,
  },
}

export default nextConfig
