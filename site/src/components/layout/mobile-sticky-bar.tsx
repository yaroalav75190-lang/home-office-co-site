'use client'

// Mobile sticky bar (art-direction §4, wording copy-global §4). Under 768 px only.
// Appears once the element marked `data-hero` has scrolled away (no hero: after 60 % of the
// viewport); hides while a footer, a form or anything marked `data-sticky-hide` is on screen,
// while an input is focused (keyboard open), and on /podbor. 64 px + safe area, ink field:
// Telegram, WhatsApp, «Позвонить» glyphs 56 px and the salt button «Подобрать объект».

import { clsx } from 'clsx'
import { usePathname } from 'next/navigation'
import { useEffect, useState, useSyncExternalStore } from 'react'
import { contacts, primaryCta } from '@/lib/site'
import { Button } from '@/components/ui/button'
import { PhoneIcon, TelegramIcon, WhatsAppIcon } from '@/components/ui/icons'
import { isQuizPath } from './nav-utils'

const BLOCKERS = 'footer, form, [data-sticky-hide]'
const TYPING =
  'input:not([type="checkbox"]):not([type="radio"]):not([type="button"]):not([type="submit"]):not([type="hidden"]), textarea, select, [contenteditable="true"]'

// Where the bar may show: under 768 px (as `md:hidden`) and only on screens taller than 480 px.
// A short viewport is a desktop at 400 % zoom (1280×1024 → 320×256 CSS px): there the fixed
// header and the bar would cover half the screen (a11y-gate: WCAG 1.4.10, 2.4.11).
const FITS_QUERY = '(max-width: 47.99rem) and (min-height: 30rem)'
const subscribeFits = (onChange: () => void) => {
  const mq = window.matchMedia(FITS_QUERY)
  mq.addEventListener('change', onChange)
  return () => mq.removeEventListener('change', onChange)
}

export function MobileStickyBar() {
  const pathname = usePathname()
  const quiz = isQuizPath(pathname)
  const fits = useSyncExternalStore(subscribeFits, () => window.matchMedia(FITS_QUERY).matches, () => false)
  const [pastHero, setPastHero] = useState(false)
  const [blocked, setBlocked] = useState(false)
  const [typing, setTyping] = useState(false)

  useEffect(() => {
    if (quiz) return
    const cleanups: (() => void)[] = []

    const hero = document.querySelector('[data-hero]')
    if (hero) {
      const io = new IntersectionObserver(([entry]) => {
        setPastHero(!entry.isIntersecting && entry.boundingClientRect.top < 0)
      })
      io.observe(hero)
      cleanups.push(() => io.disconnect())
    } else {
      let frame = 0
      const check = () => {
        frame = 0
        setPastHero(window.scrollY > window.innerHeight * 0.6)
      }
      const schedule = () => {
        if (!frame) frame = requestAnimationFrame(check)
      }
      schedule()
      window.addEventListener('scroll', schedule, { passive: true })
      cleanups.push(() => {
        window.removeEventListener('scroll', schedule)
        if (frame) cancelAnimationFrame(frame)
      })
    }

    const onScreen = new Set<Element>()
    const blockers = new IntersectionObserver((entries) => {
      for (const entry of entries) {
        if (entry.isIntersecting) onScreen.add(entry.target)
        else onScreen.delete(entry.target)
      }
      setBlocked(onScreen.size > 0)
    })
    document.querySelectorAll(BLOCKERS).forEach((el) => blockers.observe(el))
    cleanups.push(() => blockers.disconnect())

    return () => cleanups.forEach((fn) => fn())
  }, [pathname, quiz])

  useEffect(() => {
    const onIn = (e: FocusEvent) => {
      if (e.target instanceof Element && e.target.matches(TYPING)) setTyping(true)
    }
    const onOut = () => setTyping(false)
    document.addEventListener('focusin', onIn)
    document.addEventListener('focusout', onOut)
    return () => {
      document.removeEventListener('focusin', onIn)
      document.removeEventListener('focusout', onOut)
    }
  }, [])

  const visible = !quiz && fits && pastHero && !blocked && !typing

  // While the bar is up, keyboard focus must not land under it (WCAG 2.4.11): the browser keeps
  // focused elements out of the scroll padding, as it does with the header (`scroll-padding-top`).
  useEffect(() => {
    if (!visible) return
    const root = document.documentElement
    root.style.scrollPaddingBottom = 'calc(4.5rem + env(safe-area-inset-bottom, 0px))'
    return () => {
      root.style.removeProperty('scroll-padding-bottom')
    }
  }, [visible])

  if (quiz) return null

  // Under 360 px «Подобрать объект» (144 px) does not fit the 140 px left for the button and was
  // clipped on both sides (a11y-gate, WCAG 1.4.10): the glyph cells narrow to 48 px (still a
  // 44 px+ target) and the button padding to 8 px.
  const iconLink = 'grid size-14 shrink-0 place-items-center max-[22.5rem]:w-12'

  return (
    <div
      role="region"
      aria-label="Быстрая связь"
      data-surface="ink"
      data-sticky-bar=""
      inert={!visible}
      className={clsx(
        'fixed inset-x-0 bottom-0 z-40 pb-[env(safe-area-inset-bottom)] md:hidden',
        'transition-[translate] duration-320 ease-out',
        visible ? 'translate-y-0' : 'translate-y-full',
      )}
    >
      <div className="flex h-16 items-center gap-0 pr-1 pl-[calc(0.25rem+env(safe-area-inset-left))]">
        <a
          href={contacts.telegram.href}
          target="_blank"
          rel="noopener noreferrer"
          aria-label={contacts.telegram.action}
          className={iconLink}
        >
          <TelegramIcon />
        </a>
        <a
          href={contacts.whatsapp.href}
          target="_blank"
          rel="noopener noreferrer"
          aria-label={contacts.whatsapp.action}
          className={iconLink}
        >
          <WhatsAppIcon />
        </a>
        <a href={contacts.phone.href} aria-label={contacts.phone.action} className={iconLink}>
          <PhoneIcon />
        </a>
        <Button href={primaryCta.href} variant="inverse" size="compact" className="ml-1 min-w-0 flex-1 max-[22.5rem]:px-2">
          {primaryCta.label}
        </Button>
      </div>
    </div>
  )
}
