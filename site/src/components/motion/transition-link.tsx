'use client'

// Drop-in replacement for next/link that plays the «Занавес места» transition.
// Same props as <Link> (prefetching, aria-current, onClick… all pass through). The curtain is
// skipped for modified clicks, external URLs and downloads (Next.js does not call onNavigate),
// for same-page links and anchors, for /podbor, under reduced motion, and with `curtain={false}`.
// Internal hrefs are localized for the page's locale («/contacts» → «/en/contacts»).
import Link from 'next/link'
import type { ComponentProps } from 'react'
import { useLocale } from '@/i18n/client'
import { localizePath } from '@/i18n/config'
import { requestTransition } from './transition-store'

type LinkProps = ComponentProps<typeof Link>

export type TransitionLinkProps = LinkProps & {
  /** `false` keeps a plain Next.js navigation for this link. */
  curtain?: boolean
}

function localizeHref(locale: Parameters<typeof localizePath>[0], href: LinkProps['href']): LinkProps['href'] {
  if (typeof href === 'string') return localizePath(locale, href)
  return href.pathname ? { ...href, pathname: localizePath(locale, href.pathname) } : href
}

function hrefToString(href: LinkProps['href']): string {
  if (typeof href === 'string') return href
  const { pathname = '', search, query, hash } = href
  let qs = search ?? ''
  if (!qs && query && typeof query === 'object') {
    const params = new URLSearchParams()
    for (const [k, v] of Object.entries(query)) {
      if (Array.isArray(v)) v.forEach((item) => params.append(k, String(item)))
      else if (v != null) params.append(k, String(v))
    }
    const s = params.toString()
    qs = s ? `?${s}` : ''
  }
  const h = hash ? (hash.startsWith('#') ? hash : `#${hash}`) : ''
  return `${pathname}${qs}${h}`
}

export function TransitionLink({ curtain = true, onNavigate, href: rawHref, replace, ...rest }: TransitionLinkProps) {
  // Internal paths are written as Russian paths («/podbor»); on English and Spanish pages they get
  // their prefix here («/en/podbor»), so every link of the site stays in the visitor's language.
  const { locale } = useLocale()
  const href = localizeHref(locale, rawHref)
  return (
    <Link
      href={href}
      replace={replace}
      onNavigate={(e) => {
        let prevented = false
        onNavigate?.({
          preventDefault: () => {
            prevented = true
            e.preventDefault()
          },
        })
        if (prevented || !curtain) return
        if (requestTransition({ href: hrefToString(href), replace: replace ?? undefined })) e.preventDefault()
      }}
      {...rest}
    />
  )
}
