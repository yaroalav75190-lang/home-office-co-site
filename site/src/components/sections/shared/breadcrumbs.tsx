import { clsx } from 'clsx'
import { TransitionLink as Link } from '@/components/motion/transition-link'
import { getDictionary } from '@/i18n'
import { type Locale, localizePath } from '@/i18n/config'
import { JsonLd } from '@/lib/seo/json-ld'
import { absoluteUrl } from './site-url'

export type BreadcrumbItem = {
  label: string
  /** Omit for the current page (last item): it is rendered as text with aria-current. */
  href?: string
}

type BreadcrumbsProps = {
  locale: Locale
  /** Hrefs are Russian paths; links and JSON-LD localize them. */
  items: BreadcrumbItem[]
  /** Skip the BreadcrumbList JSON-LD (e.g. when a page emits its own). Default: emitted. */
  schema?: boolean
  className?: string
}

/**
 * Breadcrumbs (art-direction §6: Small, 48 px above the h1) + BreadcrumbList JSON-LD
 * (seo-brief §6.6: Yandex requires JSON-LD for BreadcrumbList).
 *
 * Usage, inside a `grid-site` hero:
 *   <Breadcrumbs locale={locale} items={[{ label: t.common.breadcrumbs.home, href: '/' }, { label: 'Пхукет' }]} className="mb-12" />
 *
 * The separator is a slash in ink-muted, hidden from screen readers; no arrows
 * or middle dots (§8.10). Spans all columns of its grid.
 */
export function Breadcrumbs({ locale, items, schema = true, className }: BreadcrumbsProps) {
  if (items.length === 0) return null

  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: items.map((item, index) => ({
      '@type': 'ListItem',
      position: index + 1,
      name: item.label,
      // Google and Yandex accept the last crumb without `item`.
      ...(item.href ? { item: absoluteUrl(localizePath(locale, item.href)) } : {}),
    })),
  }

  return (
    <nav aria-label={getDictionary(locale).common.breadcrumbs.label} className={clsx('col-span-full', className)}>
      <ol role="list" className="type-small flex flex-wrap items-baseline gap-y-1 text-ink-muted on-ink:text-on-ink-muted">
        {items.map((item, index) => {
          const last = index === items.length - 1
          return (
            <li key={`${item.label}-${index}`} className="inline-flex items-baseline">
              {item.href && !last ? (
                <Link href={item.href} className="link-reveal -my-3 inline-block py-3 hover:text-ink on-ink:hover:text-salt">
                  {item.label}
                </Link>
              ) : (
                <span aria-current={last ? 'page' : undefined} className={last ? 'text-ink on-ink:text-salt' : undefined}>
                  {item.label}
                </span>
              )}
              {last ? null : (
                <span aria-hidden="true" className="mx-2">
                  /
                </span>
              )}
            </li>
          )
        })}
      </ol>
      {schema ? <JsonLd data={jsonLd} /> : null}
    </nav>
  )
}
