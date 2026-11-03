'use client'

// MotionRoot: mounted once in app/layout.tsx. On every route it scans <main> (and the footer) for
// the motion hooks that pages put in their markup (docs/BUILD_PLAN.md «Хуки моушна») and animates
// them (art-direction §5, edition 2). Everything lives in one useGSAP context keyed on the
// pathname, so all tweens, ScrollTriggers, SplitTexts and pins of the previous page are reverted
// on navigation.
//
//   data-reveal="lines"   h2/h3: SplitText lines in a mask, yPercent 105 → 0, 900 ms, step 90 ms
//   data-reveal="fade"    text: opacity 0 → 1, y 24 → 0, 800 ms, +150 ms after the heading
//   data-reveal="clip"    photo wrapper: clip inset(100% 0 0 0) → inset(0) 1400 ms, image 1.15 → 1
//   data-reveal="items"   list: children y 16 → 0, step 60 ms
//   [data-figure-media]   every other photo gets the clip reveal too (no attribute needed)
//   data-surface          ink / sand field: unrolls from its top edge as it enters, 1400 ms
//   data-parallax         full-bleed photo wrapper: image moves −6% → 6% with the scroll (≥1024 px);
//                         every other figure −4% → 4%
//   svg[data-coast]       <Coast>: drawn in 1800 ms on enter (`data-coast-draw` is no longer needed)
//   svg[data-locator]     <Locator>: drawn on enter, the dot grows at the end (1200 ms, 1800 from 96 px)
//   data-hero …           hero: CSS entry (motion.css) + desktop scrub expanding the home panorama
//   data-quiz-step, data-quiz-done, thank-you screens: nodes that appear later (late-nodes.ts)
//
// All reveals: once, at `top 85%`. Nothing runs under reduced motion; CSS keeps everything visible.
// The district scene (district-scene-motion.tsx) owns its own panels on desktop; they are skipped here.
import './motion.css'

import { usePathname } from 'next/navigation'
import { gsap, ScrollTrigger, useGSAP } from '@/lib/gsap'
import { drawCoast, drawLocator } from './coast-draw'
import { heroScrub } from './hero-scrub'
import { watchLateNodes } from './late-nodes'
import { FIGURE, PANORAMA, parallax } from './parallax'
import {
  hideClip,
  hideReveal,
  hideSurface,
  revealClip,
  revealFade,
  revealItems,
  revealLines,
  revealSurface,
} from './reveals'
import { mq } from './tokens'
import { isTransitionBusy, waitForEnter } from './transition-store'

/** True until the first init after a full page load. */
let firstInit = true

/** What a late subtree must contain to be worth a context (SplitText's line wrappers are not). */
const LATE_HOOKS = '[data-reveal], [data-figure-media], [data-surface], svg[data-coast], svg[data-locator], [data-quiz-done]'

type Scan = {
  reveals: HTMLElement[]
  /** Photo boxes without a `data-reveal="clip"` wrapper: they get the clip reveal anyway. */
  figures: HTMLElement[]
  surfaces: HTMLElement[]
  coasts: SVGSVGElement[]
  locators: SVGSVGElement[]
}

type ScanOptions = {
  /** The pinned district scene is active: its panels are animated by district-scene-motion.tsx. */
  desktop: boolean
  /** Elements to leave as they are (already on screen when GSAP arrived late). */
  skip: (el: Element) => boolean
}

const rendered = (el: Element) => el.getClientRects().length > 0

/** `scope` itself and its descendants matching `selector`. */
function all<T extends Element>(scope: Element, selector: string): T[] {
  const list = Array.from(scope.querySelectorAll<T>(selector))
  if (scope.matches(selector)) list.unshift(scope as T)
  return list
}

function collect(scope: Element, { desktop, skip }: ScanOptions): Scan {
  const inScene = (el: Element) => desktop && el.closest('[data-scene-panels]') !== null
  const reveals = all<HTMLElement>(scope, '[data-reveal]').filter((el) => !skip(el) && !inScene(el))
  const figures = all<HTMLElement>(scope, '[data-figure-media]').filter(
    (box) =>
      !skip(box) &&
      !inScene(box) &&
      rendered(box) &&
      box.closest('[data-reveal="clip"], [data-hero-panorama], [data-hero-print], [data-quiz]') === null,
  )
  const surfaces = all<HTMLElement>(scope, '[data-surface]').filter((el) => !skip(el) && rendered(el))
  const coasts = all<SVGSVGElement>(scope, 'svg[data-coast]').filter(
    (svg) => !skip(svg) && rendered(svg) && svg.closest('[data-scene-map]') === null,
  )
  const locators = all<SVGSVGElement>(scope, 'svg[data-locator]').filter((svg) => !skip(svg) && !inScene(svg) && rendered(svg))
  return { reveals, figures, surfaces, coasts, locators }
}

/** From-states for a page that waits under the curtain: nothing shows before the curtain lifts. */
function hideAll(scan: Scan) {
  scan.reveals.forEach(hideReveal)
  scan.figures.forEach(hideClip)
  scan.surfaces.forEach(hideSurface)
  gsap.set([...scan.coasts, ...scan.locators], { opacity: 0 })
}

/** Create every reveal of a scan; returns the cleanups of the non-GSAP side effects. */
function apply(scan: Scan, ctx: gsap.Context, immediate = false): (() => void)[] {
  const cleanups: (() => void)[] = []
  scan.surfaces.forEach(revealSurface)
  scan.reveals.forEach((el) => {
    switch (el.dataset.reveal) {
      case 'lines':
        cleanups.push(revealLines(el, ctx))
        break
      case 'clip':
        revealClip(el)
        break
      case 'items':
        revealItems(el)
        break
      default:
        revealFade(el)
    }
  })
  scan.figures.forEach((box) => revealClip(box))
  scan.coasts.forEach((svg) => cleanups.push(drawCoast(svg, { immediate })))
  scan.locators.forEach((svg) => cleanups.push(drawLocator(svg, { immediate })))
  return cleanups
}

export function MotionRoot() {
  const pathname = usePathname()

  useGSAP(
    () => {
      const html = document.documentElement
      const main = document.getElementById('main')
      if (!main) {
        html.classList.add('motion-ready')
        return
      }
      // The footer is a sibling of <main> (layout.tsx); its coast, locator and ink field reveal too.
      const footer = Array.from(document.querySelectorAll<HTMLElement>('footer')).find((f) => !main.contains(f))
      const roots: HTMLElement[] = footer ? [main, footer] : [main]

      // If GSAP arrives after the 2.5 s CSS failsafe, whatever is already on screen stays as it
      // is (no flash out and back in); only content below the fold still reveals.
      const late = firstInit && performance.now() > 2300
      firstInit = false
      const skip = (el: Element) => late && el.getBoundingClientRect().top < window.innerHeight

      const mm = gsap.matchMedia()

      // Desktop first: parallax enlarges the images for their slack, and the clip reveals created
      // below settle the image to that scale (reveals.ts `revealClip`).
      mm.add(mq.desktopMotion, () => {
        const cleanups: (() => void)[] = []
        roots.forEach((root) => {
          root.querySelectorAll<HTMLElement>('[data-parallax]').forEach((wrap) => {
            const undo = parallax(wrap, PANORAMA)
            if (undo) cleanups.push(undo)
          })
          root.querySelectorAll<HTMLElement>('[data-figure-media]').forEach((box) => {
            if (!rendered(box)) return
            if (box.closest('[data-parallax], [data-hero-panorama], [data-hero-print], [data-quiz], [data-scene-panels]')) return
            const undo = parallax(box, FIGURE)
            if (undo) cleanups.push(undo)
          })
        })
        const hero = main.querySelector<HTMLElement>('[data-hero]')
        if (hero) {
          const undo = heroScrub(hero)
          if (undo) cleanups.push(undo)
        }
        return () => cleanups.forEach((fn) => fn())
      })

      mm.add(mq.motion, (ctx) => {
        const cleanups: (() => void)[] = []
        const options: ScanOptions = { desktop: window.matchMedia(mq.desktopMotion).matches, skip }
        const scans = roots.map((root) => collect(root, options))

        const setup = () => scans.forEach((scan) => cleanups.push(...apply(scan, ctx)))

        if (isTransitionBusy()) {
          // New page under the curtain: hide now, create the scroll reveals when the curtain lifts
          // so the first screen animates in view.
          scans.forEach(hideAll)
          let cancelled = false
          waitForEnter().then(() => {
            if (cancelled) return
            ctx.add(() => {
              setup()
              ScrollTrigger.sort()
            })
          })
          cleanups.push(() => {
            cancelled = true
          })
        } else {
          setup()
        }

        // Quiz steps, thank-you screens, the quiz column's coast: nodes that come later.
        cleanups.push(
          watchLateNodes(
            main,
            LATE_HOOKS,
            (el, lateCtx) => {
              const scan = collect(el, { desktop: options.desktop, skip: () => false })
              const out = apply(scan, lateCtx, true)
              // The quiz confirmation: the column's coast and locator draw again with it.
              if (el.matches('[data-quiz-done]') || el.querySelector('[data-quiz-done]')) {
                main.querySelectorAll<SVGSVGElement>('[data-quiz] svg[data-coast]').forEach((svg) => {
                  if (rendered(svg)) out.push(drawCoast(svg, { immediate: true }))
                })
                main.querySelectorAll<SVGSVGElement>('[data-quiz] svg[data-locator]').forEach((svg) => {
                  if (rendered(svg)) out.push(drawLocator(svg, { immediate: true }))
                })
              }
              return out
            },
            (svg) => {
              if (!rendered(svg)) return []
              return [svg.matches('[data-locator]') ? drawLocator(svg, { immediate: true }) : drawCoast(svg, { immediate: true })]
            },
          ),
        )

        return () => cleanups.forEach((fn) => fn())
      })

      // From-states are set: CSS hidden states (globals.css, motion.css) stop matching, GSAP owns
      // the elements.
      html.classList.add('motion-ready')

      // Page components (e.g. DistrictScene) create their triggers before this effect runs, so
      // put every trigger in page order before measuring (pins push the ones below them).
      ScrollTrigger.sort()
      ScrollTrigger.refresh()

      // Re-measure once late layout changes land: the web-font swap and the window load (photo
      // boxes reserve their ratio, so lazy images loading during the scroll need no refresh).
      let timer = 0
      let alive = true
      const remeasure = () => {
        if (!alive) return
        window.clearTimeout(timer)
        timer = window.setTimeout(() => ScrollTrigger.refresh(), 200)
      }
      if (document.readyState !== 'complete') window.addEventListener('load', remeasure, { once: true })
      document.fonts?.ready.then(remeasure)

      return () => {
        alive = false
        window.clearTimeout(timer)
        window.removeEventListener('load', remeasure)
        mm.revert()
      }
    },
    { dependencies: [pathname], revertOnUpdate: true },
  )

  return null
}
