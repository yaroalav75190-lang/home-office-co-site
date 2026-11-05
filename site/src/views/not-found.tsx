import type { Metadata } from 'next'
import { Coast } from '@/components/coast'
import { Button } from '@/components/ui/button'
import { ReplyTime } from '@/components/ui/reply-time'
import { TextLink } from '@/components/ui/text-link'
import { getDictionary } from '@/i18n'
import type { Locale } from '@/i18n/config'

// 404 (copy-global §11): real 404 status, noindex (Next.js adds both for not-found), no curtain.
// Rendered by app/global-not-found.tsx (every unmatched URL) and app/(ru)/not-found.tsx
// (notFound() inside a Russian page), each inside the site shell.

export function notFoundMetadata(locale: Locale): Metadata {
  return {
    title: { absolute: getDictionary(locale).meta.notFound.title },
    robots: { index: false, follow: true },
  }
}

const LINKS = [
  { key: 'phuket', href: '/thailand/phuket' },
  { key: 'deal', href: '/services/deal' },
  { key: 'podbor', href: '/podbor' },
  { key: 'contacts', href: '/contacts' },
  { key: 'home', href: '/' },
] as const

export function NotFoundView({ locale }: { locale: Locale }) {
  const t = getDictionary(locale).errors.notFound
  return (
    <section
      data-hero=""
      aria-labelledby="nf-title"
      className="grid-site pt-[calc(var(--header-h)+3rem)] pb-section lg:pt-[calc(var(--header-h)+5rem)]"
    >
      <div className="col-span-full lg:col-span-8">
        <h1 id="nf-title" className="type-d1">
          <span className="block">{t.titleLines[0]}</span>{' '}
          <span className="block pl-[22vw] md:pl-[calc((100%+var(--grid-gutter))/4)] lg:pl-[calc((100%+var(--grid-gutter))/8*3)]">
            {t.titleLines[1]}
          </span>
        </h1>
        <p className="type-lead mt-10 max-w-[40ch]">{t.lead}</p>
        <div className="mt-8">
          <Button href="/podbor">{t.cta}</Button>
        </div>
        <ReplyTime className="mt-3 max-w-[40ch]" />
        <nav aria-label={t.navLabel} className="mt-12">
          <ul role="list" className="type-ui flex flex-wrap gap-x-8 gap-y-3">
            {LINKS.map((l) => (
              <li key={l.href}>
                <TextLink href={l.href}>{t.links[l.key]}</TextLink>
              </li>
            ))}
          </ul>
        </nav>
      </div>
      <div className="col-span-full mt-16 hidden h-[60svh] justify-center text-laterite lg:col-span-3 lg:col-start-10 lg:mt-0 lg:flex">
        <Coast id="phuket-island" lod="mid" decorative className="h-full w-auto" data-coast-draw="" />
      </div>
    </section>
  )
}
