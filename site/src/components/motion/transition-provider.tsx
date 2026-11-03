'use client'

// «Занавес места» page transition (art-direction §5, copy-global §6). Mounted once in the layout.
//
//   leave 550 ms   salt panel rises from the bottom (clip), old page y −60 and fades;
//                  the curtain shows the destination name (D1), «16:40 на Пхукете» (Small) and,
//                  for geographic pages, a coast drawing itself in 600 ms
//   router.push    after the leave (Isle Thorne loading-curtain order)
//   hold ≥ 350 ms  and until the new route is committed
//   enter 700 ms   panel leaves upwards (expo.out), new page y 60 → 0
//
// Lenis is stopped for the whole transition and the page is put at the top (or at its #anchor)
// before the panel lifts. Started only by <TransitionLink>; reduced motion, anchors, external
// links, /podbor and form submits never get here (transition-store.ts). Browser back/forward
// navigations are instant.
import { usePathname, useRouter } from 'next/navigation'
import { type ReactNode, useCallback, useEffect, useRef, useState } from 'react'
import { flushSync } from 'react-dom'
import { setCoastDrawMode } from '@/components/coast/draw'
import { gsap, ScrollTrigger } from '@/lib/gsap'
import { HERO_INTRO_ATTR } from './boot'
import { segmentDrawMode } from './coast-draw'
import { type CurtainArtKey, curtainFor } from './curtain-routes'
import { getLenis } from './lenis-ref'
import { ease } from './tokens'
import { registerTransitionRunner, releaseEnter, setTransitionBusy, type TransitionRequest } from './transition-store'

const LEAVE = 0.55
const HOLD_MS = 350
const ENTER = 0.7
const COAST = 0.6
/** If the route never commits (error, redirect to another path), lift the curtain anyway. */
const ROUTE_TIMEOUT_MS = 10000

/**
 * Announce the new page in our own live region (copy-global §6: «Открыта страница: {название}»).
 * Off: Next.js already announces document.title on navigation, and two announcements per page
 * change were reported by the a11y gate (docs/qa/a11y-gate.md). Kept as a switch.
 */
const ANNOUNCE = false

type CurtainState = { name: string; time: string; art?: CurtainArtKey }

export type TransitionProviderProps = {
  /** Coast drawings for geographic destinations, rendered on the server (no coast data in JS). */
  art?: Partial<Record<CurtainArtKey, ReactNode>>
  children?: ReactNode
}

const wait = (ms: number) => new Promise<void>((r) => window.setTimeout(r, ms))

export function TransitionProvider({ art, children }: TransitionProviderProps) {
  const router = useRouter()
  const pathname = usePathname()
  const curtainRef = useRef<HTMLDivElement>(null)
  const pending = useRef<{ path: string; resolve: () => void } | null>(null)
  const [curtain, setCurtain] = useState<CurtainState>({ name: '', time: '' })
  const [announcement, setAnnouncement] = useState('')

  // Route committed: resolve the hold.
  useEffect(() => {
    const p = pending.current
    if (p && p.path === pathname) {
      pending.current = null
      p.resolve()
    }
  }, [pathname])

  // Any navigation (also back/forward) ends the home hero entry.
  useEffect(() => {
    const end = () => document.documentElement.removeAttribute(HERO_INTRO_ATTR)
    window.addEventListener('popstate', end)
    return () => window.removeEventListener('popstate', end)
  }, [])

  const run = useCallback(
    async ({ href, replace }: TransitionRequest) => {
      const el = curtainRef.current
      const main = document.getElementById('main')
      if (!el || !main) {
        if (replace) router.replace(href)
        else router.push(href)
        return
      }
      setTransitionBusy(true)
      document.documentElement.removeAttribute(HERO_INTRO_ATTR)

      const target = new URL(href, window.location.href)
      const meta = curtainFor(target.pathname)
      const artKey = meta.art && art?.[meta.art] ? meta.art : undefined
      // Render the curtain content before measuring and animating it.
      flushSync(() => setCurtain({ name: meta.name, time: meta.time(Date.now()), art: artKey }))

      const lenis = getLenis()
      lenis?.stop()

      // A pinned element is `position: fixed`; moving <main> would make it jump, so fade only.
      const pinned = ScrollTrigger.getAll().some((t) => t.pin && t.isActive)

      gsap.killTweensOf([el, main])
      gsap.set(el, { visibility: 'visible', clipPath: 'inset(100% 0% 0% 0%)' })

      const svg = el.querySelector<SVGSVGElement>('[data-curtain-art] svg')
      let drawn: SVGPathElement[] = []
      if (svg) {
        const segments = Array.from(svg.querySelectorAll<SVGPathElement>('[data-district]'))
        if (segments.length) {
          segmentDrawMode(svg, segments, true)
          drawn = segments
        } else {
          setCoastDrawMode(svg, true)
          drawn = Array.from(svg.querySelectorAll<SVGPathElement>('[data-coast-path]'))
        }
        gsap.set(drawn, { strokeDasharray: '1', strokeDashoffset: 1 })
      }

      const leave = gsap.timeline()
      leave.to(el, { clipPath: 'inset(0% 0% 0% 0%)', duration: LEAVE, ease: ease.inOut }, 0)
      leave.to(main, { y: pinned ? 0 : -60, opacity: 0, duration: LEAVE, ease: ease.inOut }, 0)
      if (drawn.length) leave.to(drawn, { strokeDashoffset: 0, duration: COAST, ease: ease.line }, 0.3)
      await leave.then()

      // The mobile menu restarts Lenis when it finishes closing; keep the page still.
      getLenis()?.stop()

      const leftAt = performance.now()
      const ready = new Promise<void>((resolve) => {
        pending.current = { path: target.pathname, resolve }
      })
      if (replace) router.replace(href, { scroll: false })
      else router.push(href, { scroll: false })
      await Promise.race([ready, wait(ROUTE_TIMEOUT_MS)])
      pending.current = null
      // Hold at least 350 ms (the coast finishes drawing inside it).
      await wait(Math.max(0, HOLD_MS - (performance.now() - leftAt)))
      await new Promise<void>((r) => requestAnimationFrame(() => r()))

      // New page at the top, or at its anchor, before the panel lifts.
      const anchor = target.hash ? document.getElementById(decodeURIComponent(target.hash.slice(1))) : null
      const current = getLenis()
      if (anchor) {
        const header = parseFloat(getComputedStyle(document.documentElement).scrollPaddingTop) || 0
        const y = anchor.getBoundingClientRect().top + window.scrollY - header
        if (current) current.scrollTo(y, { immediate: true, force: true })
        else window.scrollTo(0, y)
      } else if (current) current.scrollTo(0, { immediate: true, force: true })
      else window.scrollTo(0, 0)

      gsap.set(main, { y: 60, opacity: 1 })
      releaseEnter()
      const enter = gsap.timeline()
      enter.to(el, { clipPath: 'inset(0% 0% 100% 0%)', duration: ENTER, ease: ease.out }, 0)
      enter.to(main, { y: 0, duration: ENTER, ease: ease.out }, 0)
      await enter.then()

      gsap.set(main, { clearProps: 'transform,opacity' })
      gsap.set(el, { visibility: 'hidden', clipPath: 'inset(100% 0% 0% 0%)' })
      if (svg) {
        setCoastDrawMode(svg, false)
        segmentDrawMode(svg, drawn, false)
        gsap.set(drawn, { clearProps: 'strokeDasharray,strokeDashoffset' })
      }
      flushSync(() => setCurtain((c) => ({ ...c, art: undefined })))
      getLenis()?.start()
      setTransitionBusy(false)
      // Positions were measured while <main> was translated; measure again at rest.
      ScrollTrigger.refresh()
      if (ANNOUNCE) {
        setAnnouncement('')
        window.setTimeout(() => setAnnouncement(`Открыта страница: ${meta.name}`), 50)
      }
    },
    [art, router],
  )

  useEffect(() => registerTransitionRunner((req) => void run(req)), [run])

  // Safety: never leave the page stuck behind the curtain if this unmounts mid-transition.
  useEffect(
    () => () => {
      setTransitionBusy(false)
      getLenis()?.start()
    },
    [],
  )

  const artNode = curtain.art ? art?.[curtain.art] : null

  return (
    <>
      {children}
      <div
        ref={curtainRef}
        aria-hidden="true"
        data-curtain=""
        className="invisible fixed inset-0 z-[70] bg-salt text-ink"
        style={{ clipPath: 'inset(100% 0 0 0)' }}
      >
        <div className="grid-site h-full content-end gap-y-8 pb-[max(3rem,10svh)] lg:items-end">
          <div className="col-span-full row-start-2 lg:col-span-8 lg:row-start-1">
            <p className="type-d1">{curtain.name}</p>
            <p className="type-small nums mt-6 text-ink-muted">{curtain.time}</p>
          </div>
          {artNode ? (
            <div
              data-curtain-art=""
              className="col-span-2 col-start-3 row-start-1 flex h-[28svh] justify-end text-laterite md:col-span-3 md:col-start-6 lg:col-span-3 lg:col-start-10 lg:h-[56svh] [&_svg]:h-full [&_svg]:w-auto"
            >
              {artNode}
            </div>
          ) : null}
        </div>
      </div>
      <p className="sr-only" aria-live="polite" aria-atomic="true">
        {announcement}
      </p>
    </>
  )
}
