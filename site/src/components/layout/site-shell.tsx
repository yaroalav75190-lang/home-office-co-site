// The document of every page, shared by the two root layouts: app/(ru)/layout.tsx (Russian, no URL
// prefix) and app/[lang]/layout.tsx (English and Spanish under /en and /es), and by the global 404.
// Header, footer, motion root, smooth scroll, page transitions, analytics bridge and the sticky
// bar are the same for every locale; the locale picks <html lang>, the words and the formats.

import type { Metadata, Viewport } from 'next'
import { Noto_Serif_Display, Onest } from 'next/font/google'
import type { ReactNode } from 'react'
import { Coast, Locator } from '@/components/coast'
import { Footer } from '@/components/layout/footer'
import { Header } from '@/components/layout/header'
import { MobileStickyBar } from '@/components/layout/mobile-sticky-bar'
import { RouteSwitch } from '@/components/layout/route-switch'
import { motionBootScript } from '@/components/motion/boot'
import { MotionRoot } from '@/components/motion/motion-root'
import { SmoothScroll } from '@/components/motion/smooth-scroll'
import { TransitionProvider } from '@/components/motion/transition-provider'
import { AnalyticsBridge } from '@/components/sections/forms/form-kit'
import { SITE_ORIGIN } from '@/components/sections/shared/site-url'
import { Figure } from '@/components/ui/figure'
import { InlineScript } from '@/components/ui/inline-script'
import { getClientMessages, getDictionary } from '@/i18n'
import { LocaleProvider } from '@/i18n/client'
import { type Locale, htmlLang, ogLocale } from '@/i18n/config'
import { replyTimeBootScript } from '@/lib/reply-time'
import { NOINDEX } from '@/lib/seo/noindex'
import { site } from '@/lib/site'

// Display: narrow Didone with full Cyrillic; the wdth axis (62.5–100) sets width per step (§3.2–3.3).
const display = Noto_Serif_Display({
  subsets: ['cyrillic', 'latin'],
  axes: ['wdth'],
  style: 'normal',
  display: 'swap',
  variable: '--font-noto-serif-display',
})

// Text and interface.
const sans = Onest({
  subsets: ['cyrillic', 'latin'],
  display: 'swap',
  variable: '--font-onest',
})

/** Root metadata of a locale; pages add their own title, description, alternates and Open Graph. */
export function shellMetadata(locale: Locale): Metadata {
  return {
    // Promo domain (docs/DEMO_DECISIONS.md), the client confirms it before launch (seo-brief §6.2).
    // The same origin as JSON-LD, robots.txt and sitemap.xml (sections/shared/site-url.ts).
    metadataBase: new URL(SITE_ORIGIN),
    title: {
      default: site.name,
      template: `%s | ${site.name}`,
    },
    description: getDictionary(locale).meta.site.description,
    applicationName: site.name,
    // A preview for the client (SITE_NOINDEX=1, docs/DEMO_DECISIONS.md) stays out of search engines.
    robots: NOINDEX ? { index: false, follow: false } : { index: true, follow: true },
    openGraph: {
      siteName: site.name,
      locale: ogLocale[locale],
      type: 'website',
    },
    twitter: { card: 'summary_large_image' },
    formatDetection: { telephone: false, email: false, address: false },
  }
}

export const shellViewport: Viewport = {
  themeColor: '#f3f3ef',
  colorScheme: 'light',
  // Lets the grid and the sticky bar use env(safe-area-inset-*).
  viewportFit: 'cover',
}

// Coast drawings for the desktop «Направления» panel (64 px, laterite). Rendered here on the
// server, so the coastline data never ships in the client bundle.
const destinationArt = {
  phuket: <Coast id="phuket-west" lod="tiny" decorative className="size-full" />,
  bali: <Coast id="bali-bukit" lod="tiny" decorative className="size-full" />,
  dubai: <Coast id="dubai-jumeirah" lod="tiny" decorative className="size-full" />,
  cambodia: <Coast id="sihanoukville" lod="tiny" decorative className="size-full" />,
}

// Coast drawings for the «Занавес места» page transition (copy-global §6), drawn in 600 ms on
// the curtain. Server-rendered here so the coastline data never ships in the client bundle.
const curtainArt = {
  'phuket-island': <Coast id="phuket-island" lod="mid" decorative className="h-full w-auto" />,
  'bang-tao': <Coast id="phuket-island" lod="mid" highlight="bang-tao" decorative className="h-full w-auto" />,
}

export function SiteShell({ locale, children }: { locale: Locale; children: ReactNode }) {
  const t = getDictionary(locale)

  // Runs during parsing, before first paint: enables the `html.js` hidden states (§5) and defines
  // the reply-time function used by every <ReplyTime /> instance.
  const bootScript = `document.documentElement.classList.add('js');${replyTimeBootScript(t.common.reply)}${motionBootScript}`

  // Footer photograph, cut by the left edge (§4). The author asks for a credit next to the photo.
  const footerMedia = (
    <Figure
      locale={locale}
      photo="sunset"
      ratio="4x5"
      sizes="(min-width: 48rem) 50vw, 100vw"
      locator={<Locator place="bang-tao" baseClassName="text-on-ink-muted" accentClassName="text-laterite-on-ink" />}
      caption={t.common.footer.photoCaption}
    />
  )

  return (
    <html lang={htmlLang[locale]} className={`${display.variable} ${sans.variable}`} suppressHydrationWarning>
      {/* eslint-disable-next-line @next/next/no-head-element -- the root document of both root layouts (app/(ru), app/[lang]); next/head is Pages Router only */}
      <head>
        <InlineScript html={bootScript} />
      </head>
      <body>
        <LocaleProvider locale={locale} messages={getClientMessages(locale)}>
          <SmoothScroll>
            <TransitionProvider art={curtainArt}>
              <a
                href="#main"
                className="type-ui fixed top-2 left-2 z-[60] -translate-y-[200%] bg-ink px-5 py-3 text-salt focus-visible:translate-y-0"
              >
                {t.common.skipLink}
              </a>
              <Header destinationArt={destinationArt} />
              <main id="main" tabIndex={-1}>
                {children}
              </main>
              <RouteSwitch quiz={<Footer locale={locale} variant="compact" />}>
                <Footer locale={locale} media={footerMedia} />
              </RouteSwitch>
              <MobileStickyBar />
            </TransitionProvider>
            <MotionRoot />
            {/* UTM / yclid first touch and click goals on every page; one mount, so goals never double. */}
            <AnalyticsBridge />
          </SmoothScroll>
        </LocaleProvider>
      </body>
    </html>
  )
}
