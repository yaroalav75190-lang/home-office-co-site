'use client'

// Menus (art-direction §4 «Меню», wording copy-global §2).
// - MenuDialog: full-screen salt panel under 1280 px (see header.tsx for why not 1024). Native modal <dialog>: the rest of the page
//   is inert (real focus trap), Esc closes, focus returns to the «Меню» button.
// - DirectionsPanel: desktop «Направления», a full-width panel under the header with four columns.
// Both open with clip `inset(0 0 100% 0)` → `inset(0)` in 600 ms, items rise 24 px in 40 ms steps.

import { useLenis } from 'lenis/react'
import { TransitionLink as Link } from '@/components/motion/transition-link'
import { usePathname } from 'next/navigation'
import { type CSSProperties, type ReactNode, type RefObject, useEffect, useRef } from 'react'
import {
  type DestinationId,
  destinations,
  englishLink,
  mobileDestinationLinks,
  mobileNav,
  resolveLink,
  servicesNav,
  site,
} from '@/lib/site'
import { LocalTime } from '@/components/ui/local-time'
import { MessengerLink } from '@/components/ui/messenger-link'
import { ReplyTime } from '@/components/ui/reply-time'
import { ChevronIcon } from '@/components/ui/icons'
import { currentFor } from './nav-utils'

export type DestinationArt = Partial<Record<DestinationId, ReactNode>>

const stagger = (i: number) => ({ '--i': i }) as CSSProperties

/* ───────────────────────── Mobile / tablet menu ───────────────────────── */

type MenuDialogProps = {
  id: string
  open: boolean
  onRequestClose: () => void
  /** The «Меню» button: focus goes back to it after closing. */
  returnFocusRef: RefObject<HTMLButtonElement | null>
}

export function MenuDialog({ id, open, onRequestClose, returnFocusRef }: MenuDialogProps) {
  const dialogRef = useRef<HTMLDialogElement>(null)
  const closeRef = useRef<HTMLButtonElement>(null)
  const wasOpen = useRef(false)
  const pathname = usePathname()
  const lenis = useLenis()
  const lenisRef = useRef(lenis)

  useEffect(() => {
    lenisRef.current = lenis
  }, [lenis])

  // `data-open` follows `open` in the same render, so after showModal the panel is already
  // visible (focus can move in) and the clip runs from its @starting-style.
  useEffect(() => {
    const dialog = dialogRef.current
    if (!dialog) return
    const root = document.documentElement

    if (open) {
      wasOpen.current = true
      if (!dialog.open) dialog.showModal()
      root.dataset.scrollLock = ''
      lenisRef.current?.stop()
      closeRef.current?.focus()
      return
    }

    if (!wasOpen.current) return
    wasOpen.current = false
    // Let the clip close (400 ms), then really close the dialog and give focus back.
    const timer = window.setTimeout(() => {
      if (dialog.open) dialog.close()
      delete root.dataset.scrollLock
      lenisRef.current?.start()
      returnFocusRef.current?.focus()
    }, 420)
    return () => window.clearTimeout(timer)
  }, [open, returnFocusRef])

  useEffect(
    () => () => {
      delete document.documentElement.dataset.scrollLock
    },
    [],
  )

  const linkClass = 'type-d2 inline-block py-1'
  // «Услуги» expands only when it holds more than one built page; with just «Сопровождение
  // сделки» live, that page is a plain item, as in the desktop header (BUILD_PLAN decision 5).
  const serviceLinks = servicesNav.flatMap((item) => {
    const link = resolveLink(item)
    return link ? [link] : []
  })
  let i = 0

  return (
    <dialog
      ref={dialogRef}
      id={id}
      aria-label="Меню"
      data-open={open ? 'true' : 'false'}
      data-lenis-prevent=""
      onCancel={(e) => {
        e.preventDefault()
        onRequestClose()
      }}
      onClose={() => {
        if (open) onRequestClose()
      }}
      className="clip-panel fixed inset-0 m-0 h-dvh max-h-none w-full max-w-none overflow-y-auto overscroll-contain bg-salt text-ink"
    >
      <div className="grid-site h-header items-center">
        <Link
          href="/"
          aria-label={`${site.name}, на главную`}
          onClick={onRequestClose}
          className="type-ui col-span-2 inline-flex min-h-11 items-center text-[1.125rem] md:col-span-3"
        >
          {site.name}
        </Link>
        <button
          ref={closeRef}
          type="button"
          aria-label="Закрыть меню"
          onClick={onRequestClose}
          className="type-ui col-span-2 inline-flex min-h-11 min-w-11 items-center justify-end justify-self-end md:col-start-6 md:col-end-9 lg:col-start-10 lg:col-end-13"
        >
          Закрыть
        </button>
      </div>

      <nav aria-label="Меню" className="grid-site pt-6 pb-[calc(3rem+env(safe-area-inset-bottom))]">
        <ul role="list" className="col-span-full flex flex-col gap-2 md:col-span-6">
          <li data-stagger="" style={stagger(i++)}>
            <details className="group details-animate">
              <summary className="type-d2 flex min-h-11 items-center gap-3 py-1">
                Направления
                <ChevronIcon size={24} className="transition-transform duration-320 group-open:rotate-180" />
              </summary>
              <ul role="list" className="flex flex-col gap-1 pt-2 pb-4">
                {mobileDestinationLinks.map((item) => {
                  const link = resolveLink(item)
                  if (!link) return null
                  return (
                    <li key={item.href} className={item.indent ? 'pl-6' : undefined}>
                      <Link
                        href={link.href}
                        onClick={onRequestClose}
                        aria-current={currentFor(pathname, link.href)}
                        className="type-d3 inline-block py-1.5"
                      >
                        <span className="link-reveal">{link.label}</span>
                      </Link>
                    </li>
                  )
                })}
              </ul>
            </details>
          </li>
          {serviceLinks.length === 1 ? (
            <li data-stagger="" style={stagger(i++)}>
              <Link
                href={serviceLinks[0].href}
                onClick={onRequestClose}
                aria-current={currentFor(pathname, serviceLinks[0].href)}
                className={linkClass}
              >
                <span className="link-reveal">{serviceLinks[0].label}</span>
              </Link>
            </li>
          ) : serviceLinks.length > 1 ? (
            <li data-stagger="" style={stagger(i++)}>
              <details className="group details-animate">
                <summary className="type-d2 flex min-h-11 items-center gap-3 py-1">
                  Услуги
                  <ChevronIcon size={24} className="transition-transform duration-320 group-open:rotate-180" />
                </summary>
                <ul role="list" className="flex flex-col gap-1 pt-2 pb-4">
                  {serviceLinks.map((link) => (
                    <li key={link.href}>
                      <Link
                        href={link.href}
                        onClick={onRequestClose}
                        aria-current={currentFor(pathname, link.href)}
                        className="type-d3 inline-block py-1.5"
                      >
                        <span className="link-reveal">{link.label}</span>
                      </Link>
                    </li>
                  ))}
                </ul>
              </details>
            </li>
          ) : null}
          {mobileNav.map((item) => {
            const link = resolveLink(item)
            if (!link) return null
            return (
              <li key={item.href} data-stagger="" style={stagger(i++)}>
                <Link
                  href={link.href}
                  onClick={onRequestClose}
                  aria-current={currentFor(pathname, link.href)}
                  className={linkClass}
                >
                  <span className="link-reveal">{link.label}</span>
                </Link>
              </li>
            )
          })}
        </ul>

        <div className="col-span-full mt-12 md:col-span-6" data-stagger="" style={stagger(i++)}>
          <div className="flex flex-wrap gap-2">
            <MessengerLink channel="telegram" label="Telegram" />
            <MessengerLink channel="whatsapp" label="WhatsApp" />
            <MessengerLink channel="phone" label="Позвонить" />
          </div>
          <ReplyTime variant="short" className="mt-4" />
          <Link
            href={englishLink.href}
            lang="en"
            hrefLang="en"
            onClick={onRequestClose}
            className="type-ui link-underline mt-8 inline-block"
          >
            {englishLink.label}
          </Link>
        </div>
      </nav>
    </dialog>
  )
}

/* ───────────────────────── Desktop «Направления» panel ───────────────────────── */

type DirectionsPanelProps = {
  id: string
  open: boolean
  onNavigate: () => void
  /** Coast drawings per destination, 64 px (`<Coast id="phuket-west" />` from `@/components/coast`). */
  art?: DestinationArt
}

export function DirectionsPanel({ id, open, onNavigate, art }: DirectionsPanelProps) {
  const pathname = usePathname()
  return (
    <div
      id={id}
      role="region"
      aria-label="Направления"
      data-open={open ? 'true' : 'false'}
      className="clip-panel absolute inset-x-0 top-full bg-salt text-ink"
    >
      <div className="grid-site pt-10 pb-16">
        {destinations.map((d, index) => (
          <div key={d.id} className="col-span-3" data-stagger="" style={stagger(index)}>
            {art?.[d.id] ? (
              <div role="img" aria-label={d.coastLabel} className="mb-6 size-16 text-laterite">
                {art[d.id]}
              </div>
            ) : null}
            <p className="type-d3">{d.region}</p>
            <p className="type-small mt-2 text-ink-muted">
              <LocalTime timeZone={d.timeZone} /> {d.regionTimeLabel}
            </p>
            <ul role="list" className="mt-6 flex flex-col gap-1">
              {d.links.map((item) => {
                const link = resolveLink(item)
                if (!link) return null
                return (
                  <li key={item.href}>
                    <Link
                      href={link.href}
                      onClick={onNavigate}
                      aria-current={currentFor(pathname, link.href)}
                      className="type-ui inline-flex min-h-11 items-center"
                    >
                      <span className="link-reveal">{link.label}</span>
                    </Link>
                  </li>
                )
              })}
            </ul>
          </div>
        ))}
      </div>
    </div>
  )
}
