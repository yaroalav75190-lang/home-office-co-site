'use client'

// «RU · EN · ES» (header from 1024 px, mobile menu). Each code links to the same page in that
// language; the current one is marked and not a link. Plain <a>, not TransitionLink: Russian and
// English/Spanish live under different root layouts, so the switch is a full page load anyway
// (no curtain), and the href must not be localized again. The query and the anchor are kept
// (a quiz link «/podbor?country=bali» stays prefilled in the other language).

import { clsx } from 'clsx'
import { usePathname } from 'next/navigation'
import type { MouseEvent } from 'react'
import { useLocale } from '@/i18n/client'
import { htmlLang, localeLabels, locales, switchLocalePath } from '@/i18n/config'

export function LanguageSwitcher({ className, linkClassName }: { className?: string; linkClassName?: string }) {
  const pathname = usePathname()
  const { locale, t } = useLocale()

  const keepQuery = (e: MouseEvent<HTMLAnchorElement>) => {
    const { search, hash } = window.location
    if (search || hash) e.currentTarget.href = `${e.currentTarget.pathname}${search}${hash}`
  }

  return (
    <nav aria-label={t.common.header.languageLabel} className={className}>
      <ul role="list" className="flex items-center">
        {locales.map((l, i) => {
          const { short, name } = localeLabels[l]
          const current = l === locale
          return (
            <li key={l} className="flex items-center">
              {i > 0 ? (
                <span aria-hidden="true" className="px-0.5 opacity-60">
                  ·
                </span>
              ) : null}
              {current ? (
                <span
                  aria-current="true"
                  lang={htmlLang[l]}
                  className={clsx('inline-flex min-h-11 items-center px-0.5 underline decoration-1 underline-offset-[0.3em]', linkClassName)}
                >
                  {short}
                  <span className="sr-only"> {name}</span>
                </span>
              ) : (
                <a
                  href={switchLocalePath(pathname, l)}
                  hrefLang={htmlLang[l]}
                  lang={htmlLang[l]}
                  onClick={keepQuery}
                  className={clsx('inline-flex min-h-11 items-center px-0.5', linkClassName)}
                >
                  <span className="link-reveal">{short}</span>
                  <span className="sr-only"> {name}</span>
                </a>
              )}
            </li>
          )
        })}
      </ul>
    </nav>
  )
}
