'use client'

// Drop-in replacement for next/link that plays the «Занавес места» transition.
// Same props as <Link> (prefetching, aria-current, onClick… all pass through). The curtain is
// skipped for modified clicks, external URLs and downloads (Next.js does not call onNavigate),
// for same-page links and anchors, for /podbor, under reduced motion, and with `curtain={false}`.
import Link from 'next/link'
import type { ComponentProps } from 'react'
import { requestTransition } from './transition-store'

type LinkProps = ComponentProps<typeof Link>

export type TransitionLinkProps = LinkProps & {
  /** `false` keeps a plain Next.js navigation for this link. */
  curtain?: boolean
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

export function TransitionLink({ curtain = true, onNavigate, href, replace, ...rest }: TransitionLinkProps) {
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
