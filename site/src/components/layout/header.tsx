'use client'

// Header (art-direction §4 «Шапка», wording copy-global §1).
// 88 px from 1024 px, 64 px below. Transparent at the top of the page; after 120 px of scrolling
// down it slides away (400 ms) and comes back on scroll up on solid salt. Over sections marked
// `data-surface="ink"` it inverts (200 ms).
// Full navigation from 1280 px: at 1024 the six items, «English» and the button need ~760 px but
// columns 4–12 give ~700, so 1024–1279 uses the compact header (logo, «English», button, «Меню»).
// Under 1024: logo, (from 768 px) the button, «Меню». On /podbor: logo and «Закрыть».

import { clsx } from 'clsx'
import { TransitionLink as Link } from '@/components/motion/transition-link'
import { usePathname, useRouter } from 'next/navigation'
import { type CSSProperties, useCallback, useEffect, useId, useRef, useState } from 'react'
import { contacts, englishLink, mainNav, primaryCta, resolveLink, site } from '@/lib/site'
import { Button } from '@/components/ui/button'
import { type DestinationArt, DirectionsPanel, MenuDialog } from './menu'
import { currentFor, isQuizPath } from './nav-utils'

const HIDE_AFTER = 120
const DESKTOP_QUERY = '(min-width: 80rem)'

type HeaderProps = {
  /** Coast drawings for the «Направления» panel, 64 px each. */
  destinationArt?: DestinationArt
}

export function Header({ destinationArt }: HeaderProps) {
  const pathname = usePathname()
  const quiz = isQuizPath(pathname)
  const headerRef = useRef<HTMLElement>(null)
  const menuButtonRef = useRef<HTMLButtonElement>(null)
  const directionsButtonRef = useRef<HTMLButtonElement>(null)
  const panelId = useId()
  const menuId = useId()

  const [atTop, setAtTop] = useState(true)
  const [hidden, setHidden] = useState(false)
  const [overInk, setOverInk] = useState(false)
  const [panelOpen, setPanelOpen] = useState(false)
  const [menuOpen, setMenuOpen] = useState(false)

  // Scroll: position, direction and what lies under the header (one read per frame).
  useEffect(() => {
    let lastY = window.scrollY
    let frame = 0
    const measure = () => {
      frame = 0
      const y = window.scrollY
      const dy = y - lastY
      lastY = y
      setAtTop(y <= 4)
      if (y > HIDE_AFTER && dy > 2) setHidden(true)
      else if (dy < -2 || y <= HIDE_AFTER) setHidden(false)

      const header = headerRef.current
      if (header) {
        const probeY = header.offsetHeight / 2
        const under = document
          .elementsFromPoint(Math.min(24, window.innerWidth - 1), probeY)
          .find((el) => !header.contains(el))
        setOverInk(under?.closest('[data-surface]')?.getAttribute('data-surface') === 'ink')
      }
    }
    const schedule = () => {
      if (!frame) frame = requestAnimationFrame(measure)
    }
    schedule()
    window.addEventListener('scroll', schedule, { passive: true })
    window.addEventListener('resize', schedule)
    return () => {
      window.removeEventListener('scroll', schedule)
      window.removeEventListener('resize', schedule)
      if (frame) cancelAnimationFrame(frame)
    }
  }, [pathname])

  const closePanel = useCallback((returnFocus: boolean) => {
    setPanelOpen(false)
    if (returnFocus) directionsButtonRef.current?.focus()
  }, [])

  // Desktop panel: Esc, click outside and focus leaving close it.
  useEffect(() => {
    if (!panelOpen) return
    const header = headerRef.current
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') closePanel(true)
    }
    const onPointer = (e: PointerEvent) => {
      if (header && !header.contains(e.target as Node)) closePanel(false)
    }
    const onFocus = (e: FocusEvent) => {
      if (header && !header.contains(e.target as Node)) closePanel(false)
    }
    document.addEventListener('keydown', onKey)
    document.addEventListener('pointerdown', onPointer)
    document.addEventListener('focusin', onFocus)
    return () => {
      document.removeEventListener('keydown', onKey)
      document.removeEventListener('pointerdown', onPointer)
      document.removeEventListener('focusin', onFocus)
    }
  }, [panelOpen, closePanel])

  // Crossing the desktop breakpoint closes whichever menu does not exist there.
  useEffect(() => {
    const mq = window.matchMedia(DESKTOP_QUERY)
    const onChange = () => {
      if (mq.matches) setMenuOpen(false)
      else setPanelOpen(false)
    }
    mq.addEventListener('change', onChange)
    return () => mq.removeEventListener('change', onChange)
  }, [])

  const forcedSolid = panelOpen || menuOpen
  const visible = !hidden || forcedSolid
  const inverted = overInk && !forcedSolid
  const solid = !atTop || forcedSolid

  return (
    <header
      ref={headerRef}
      data-header=""
      data-tone={inverted ? 'ink' : 'salt'}
      onFocusCapture={() => setHidden(false)}
      className={clsx(
        'fixed inset-x-0 top-0 z-50 h-header',
        '[transition:translate_400ms_var(--ease-in-out),background-color_200ms_linear,color_200ms_linear]',
        visible ? 'translate-y-0' : '-translate-y-full',
        inverted ? 'text-salt' : 'text-ink',
        solid ? (inverted ? 'bg-ink' : 'bg-salt') : 'bg-transparent',
      )}
      style={inverted ? ({ '--focus-ring': 'var(--color-salt)' } as CSSProperties) : undefined}
    >
      <div className="grid-site h-full items-center">
        <Link
          href="/"
          aria-label={`${site.name}, на главную`}
          aria-current={pathname === '/' ? 'page' : undefined}
          className="type-ui col-span-2 inline-flex min-h-11 items-center justify-self-start text-[1.125rem] whitespace-nowrap md:col-span-3"
        >
          {site.name}
        </Link>

        {quiz ? (
          <QuizClose />
        ) : (
          <>
            <nav aria-label="Основная навигация" className="hidden xl:col-span-6 xl:col-start-4 xl:block">
              <ul role="list" className="list-commas type-ui flex flex-wrap items-center gap-x-[0.3em]">
                {mainNav.map((item) => {
                  if (item.href === '/destinations') {
                    return (
                      <li key={item.href} className="flex items-center">
                        <button
                          ref={directionsButtonRef}
                          type="button"
                          aria-expanded={panelOpen}
                          aria-controls={panelId}
                          onClick={() => setPanelOpen((v) => !v)}
                          className="inline-flex min-h-11 items-center"
                        >
                          <span className="link-reveal">{item.label}</span>
                        </button>
                      </li>
                    )
                  }
                  const link = resolveLink(item)
                  if (!link) return null
                  return (
                    <li key={item.href} className="flex items-center">
                      <Link
                        href={link.href}
                        aria-current={currentFor(pathname, link.href)}
                        className="inline-flex min-h-11 items-center"
                      >
                        <span className="link-reveal">{link.label}</span>
                      </Link>
                    </li>
                  )
                })}
              </ul>
            </nav>

            <div className="col-span-2 flex items-center justify-end gap-6 justify-self-end md:col-start-4 md:col-end-9 lg:col-start-4 lg:col-end-13 xl:col-span-3 xl:col-start-10">
              {/* A number flagged `placeholder` in @/lib/site never sits in the header (QA round 1 §2). */}
              {contacts.phone.placeholder ? null : (
                <a
                  href={contacts.phone.href}
                  aria-label={`Позвонить по номеру ${contacts.phone.display}`}
                  className="type-ui nums hidden min-h-11 items-center whitespace-nowrap xl:inline-flex"
                >
                  <span className="link-reveal">{contacts.phone.display}</span>
                </a>
              )}
              <Link
                href={englishLink.href}
                lang="en"
                hrefLang="en"
                className="type-ui hidden min-h-11 items-center lg:inline-flex"
              >
                <span className="link-reveal">{englishLink.label}</span>
              </Link>
              {/* Under 768 px the header is the mark and «Меню» only; the action lives in the sticky bar
                  (art-direction §4). `max-md:hidden`, not `hidden md:inline-flex`: the button's own
                  `inline-flex` comes later in the stylesheet and would beat a plain `hidden`. */}
              <Button
                href={primaryCta.href}
                size="sm"
                variant={inverted ? 'inverse' : 'primary'}
                className="max-md:hidden"
              >
                {primaryCta.label}
              </Button>
              <button
                ref={menuButtonRef}
                type="button"
                aria-label="Открыть меню"
                aria-haspopup="dialog"
                aria-expanded={menuOpen}
                aria-controls={menuId}
                onClick={() => setMenuOpen(true)}
                className="type-ui inline-flex min-h-11 min-w-11 items-center justify-end xl:hidden"
              >
                Меню
              </button>
            </div>
          </>
        )}
      </div>

      {!quiz ? (
        <>
          <div className="hidden xl:block">
            <DirectionsPanel id={panelId} open={panelOpen} onNavigate={() => closePanel(false)} art={destinationArt} />
          </div>
          <MenuDialog
            id={menuId}
            open={menuOpen}
            onRequestClose={() => setMenuOpen(false)}
            returnFocusRef={menuButtonRef}
          />
        </>
      ) : null}
    </header>
  )
}

/** Quiz header action: back to the previous page of this site, or home. */
function QuizClose() {
  const router = useRouter()
  return (
    <Link
      href="/"
      // The visible word alone does not say what closes (WCAG 2.4.4); the name starts with it (2.5.3).
      aria-label="Закрыть подбор"
      onClick={(e) => {
        const sameSite = document.referrer.startsWith(window.location.origin)
        if (sameSite && window.history.length > 1) {
          e.preventDefault()
          router.back()
        }
      }}
      className="type-ui col-span-2 inline-flex min-h-11 items-center justify-end justify-self-end md:col-start-6 md:col-end-9 lg:col-span-3 lg:col-start-10"
    >
      <span className="link-reveal">Закрыть</span>
    </Link>
  )
}
