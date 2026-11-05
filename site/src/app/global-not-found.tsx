import { SiteShell, shellViewport } from '@/components/layout/site-shell'
import { NotFoundView, notFoundMetadata } from '@/views/not-found'
import './globals.css'

// Unmatched URLs (experimental.globalNotFound in next.config.ts). The app has two root layouts,
// app/(ru) and app/[lang], so there is no single layout to compose a 404 from: this is the
// documented 404 for that case. It renders the whole site shell itself, in Russian, the site's
// default (x-default) — also for an unknown address under /en/… or /es/…: Next.js 16 knows nothing
// of the requested path here, and a not-found.tsx inside app/[lang] is rendered on the server only
// for prerendered pages (an unknown dynamic path got an empty error shell, checked on 05.11.2026).
// Real 404 status and noindex come from Next.js.

export const metadata = notFoundMetadata('ru')
export const viewport = shellViewport

export default function GlobalNotFound() {
  return (
    <SiteShell locale="ru">
      <NotFoundView locale="ru" />
    </SiteShell>
  )
}
