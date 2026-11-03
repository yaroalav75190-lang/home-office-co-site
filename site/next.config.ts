import type { NextConfig } from 'next'

const nextConfig: NextConfig = {
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
  async redirects() {
    return [
      { source: '/thailand', destination: '/thailand/phuket', statusCode: 302 },
      { source: '/services', destination: '/services/deal', statusCode: 302 },
    ]
  },
}

export default nextConfig
