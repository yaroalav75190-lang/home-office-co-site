'use client'

// MotionRoot: mounted once in app/layout.tsx. On every route it scans <main> for the motion hooks
// that pages put in their markup (docs/BUILD_PLAN.md «Хуки моушна») and animates them
// (art-direction §5). Everything lives in one useGSAP context keyed on the pathname, so all
// tweens, ScrollTriggers, SplitTexts and pins of the previous page are reverted on navigation.
//
//   data-reveal="lines"   h2/h3: SplitText lines in a mask, yPercent 105 → 0, 900 ms, step 90 ms
//   data-reveal="fade"    text: opacity 0 → 1, y 24 → 0, 800 ms, +150 ms after the heading
//   data-reveal="clip"    photo wrapper: clip inset(100% 0 0 0) → inset(0) 1400 ms, image 1.15 → 1
//   data-reveal="items"   list: children y 16 → 0, step 60 ms
//   data-parallax         full-bleed photo wrapper: image moves −6% → 6% with the scroll (≥1024 px)
//   data-coast-draw       <Coast> svg: drawn in 1800 ms on enter
//   data-hero …           home hero: CSS entry (motion.css) + desktop scrub expanding the panorama
//
// All reveals: once, at `top 85%`. Nothing runs under reduced motion; CSS keeps everything visible.
import './motion.css'

import { usePathname } from 'next/navigation'
import { gsap, ScrollTrigger, SplitText, useGSAP } from '@/lib/gsap'
import { drawCoast } from './coast-draw'
import { dur, ease, mq, step } from './tokens'
import { isTransitionBusy, waitForEnter } from './transition-store'

const START = 'top 85%'

/** True until the first init after a full page load. */
let firstInit = true

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

      // If GSAP arrives after the 2.5 s CSS failsafe, whatever is already on screen stays as it
      // is (no flash out and back in); only content below the fold still reveals.
      const late = firstInit && performance.now() > 2300
      firstInit = false
      const skip = (el: Element) => late && el.getBoundingClientRect().top < window.innerHeight

      const mm = gsap.matchMedia()

      mm.add(mq.motion, (ctx) => {
        const cleanups: (() => void)[] = []
        const reveals = Array.from(main.querySelectorAll<HTMLElement>('[data-reveal]')).filter((el) => !skip(el))
        const coasts = Array.from(main.querySelectorAll<SVGSVGElement>('svg[data-coast-draw]')).filter(
          (svg) => !skip(svg),
        )

        const setup = () => {
          reveals.forEach((el) => {
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
          coasts.forEach((svg) => cleanups.push(drawCoast(svg)))
        }

        if (isTransitionBusy()) {
          // New page under the curtain: hide now, create the scroll reveals when the curtain lifts
          // so the first screen animates in view.
          reveals.forEach(hideReveal)
          gsap.set(coasts, { opacity: 0 })
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
        return () => cleanups.forEach((fn) => fn())
      })

      mm.add(mq.desktopMotion, () => {
        const cleanups: (() => void)[] = []
        main.querySelectorAll<HTMLElement>('[data-parallax]').forEach((el) => parallax(el))
        const hero = main.querySelector<HTMLElement>('[data-hero]')
        if (hero) {
          const undo = heroScrub(hero)
          if (undo) cleanups.push(undo)
        }
        return () => cleanups.forEach((fn) => fn())
      })

      // From-states are set: CSS hidden states (globals.css) stop matching, GSAP owns the elements.
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

/* ───────────────────────── Reveals ───────────────────────── */

/** The from-state of each reveal, set while the new page waits under the curtain. */
function hideReveal(el: HTMLElement) {
  switch (el.dataset.reveal) {
    case 'lines':
      gsap.set(el, { opacity: 0 })
      break
    case 'clip':
      gsap.set(el.querySelector<HTMLElement>('[data-figure-media]') ?? el, { clipPath: 'inset(100% 0% 0% 0%)' })
      break
    case 'items':
      gsap.set(el, { opacity: 1 })
      gsap.set(el.children, { opacity: 0, y: 16 })
      break
    default:
      gsap.set(el, { opacity: 0, y: 24 })
  }
}

function revealFade(el: HTMLElement) {
  gsap.fromTo(
    el,
    { opacity: 0, y: 24 },
    {
      opacity: 1,
      y: 0,
      duration: dur.text,
      delay: 0.15,
      ease: ease.out,
      clearProps: 'transform',
      scrollTrigger: { trigger: el, start: START, once: true },
    },
  )
}

function revealItems(el: HTMLElement) {
  const items = Array.from(el.children)
  gsap.set(el, { opacity: 1 })
  if (!items.length) return
  gsap.fromTo(
    items,
    { opacity: 0, y: 16 },
    {
      opacity: 1,
      y: 0,
      duration: dur.text,
      ease: ease.out,
      stagger: step.items,
      clearProps: 'transform',
      scrollTrigger: { trigger: el, start: START, once: true },
    },
  )
}

function revealClip(el: HTMLElement) {
  // Clip the media box when the hook sits on a wrapper around <Figure>: the caption stays put.
  const box = el.querySelector<HTMLElement>('[data-figure-media]') ?? el
  const img = box.querySelector<HTMLElement>('img, video')
  const base = parallaxBaseScale(box)
  const tl = gsap.timeline({ scrollTrigger: { trigger: box, start: START, once: true } })
  tl.fromTo(
    box,
    { clipPath: 'inset(100% 0% 0% 0%)' },
    { clipPath: 'inset(0% 0% 0% 0%)', duration: dur.photo, ease: 'expo.inOut', clearProps: 'clipPath' },
    0,
  )
  if (img) tl.fromTo(img, { scale: base * 1.15 }, { scale: base, duration: dur.photo, ease: ease.out }, 0.1)
}

/** The parallax image is scaled 1.12 when it is not taller than its frame (see `parallax`). */
function parallaxBaseScale(box: HTMLElement): number {
  const wrap = box.closest<HTMLElement>('[data-parallax]')
  if (!wrap || !window.matchMedia(mq.desktopMotion).matches) return 1
  const img = wrap.querySelector<HTMLElement>('img')
  return img && img.offsetHeight < wrap.offsetHeight * 1.1 ? 1.12 : 1
}

/** Wait for web fonts (line breaks depend on them), at most 1.5 s; autoSplit fixes a later swap. */
function fontsReady(): Promise<unknown> {
  const fonts = document.fonts?.ready ?? Promise.resolve()
  return Promise.race([fonts, new Promise((r) => window.setTimeout(r, 1500))])
}

function revealLines(el: HTMLElement, ctx: gsap.Context) {
  // Same hidden state as the CSS one, kept while fonts load and the text is split.
  gsap.set(el, { opacity: 0 })
  let cancelled = false
  let split: SplitText | null = null

  fontsReady().then(() => {
    if (cancelled || !el.isConnected) return
    ctx.add(() => {
      split = SplitText.create(el, {
        type: 'lines',
        mask: 'lines',
        autoSplit: true,
        onSplit(self) {
          gsap.set(el, { opacity: 1 })
          return gsap.from(self.lines, {
            yPercent: 105,
            duration: dur.lines,
            ease: ease.out,
            stagger: step.lines,
            scrollTrigger: { trigger: el, start: START, once: true },
            onComplete: () => {
              // Back to the original markup: native wrapping, selection and find-in-page.
              self.kill()
              self.revert()
            },
          })
        },
      })
    })
  })

  return () => {
    cancelled = true
    split?.revert()
  }
}

/* ───────────────────────── Parallax (≥1024 px) ───────────────────────── */

function parallax(wrap: HTMLElement) {
  const img = wrap.querySelector<HTMLElement>('img')
  if (!img) return
  // The image needs 12% of slack (art-direction: «изображение выше на 12 %»). If the page did not
  // make it taller, scale it 1.12 around the centre: 6% spare on each side.
  const scaled = img.offsetHeight < wrap.offsetHeight * 1.1
  if (scaled) gsap.set(img, { scale: 1.12 })
  const range = () => (scaled ? img.offsetHeight * 0.06 : Math.max(0, (img.offsetHeight - wrap.offsetHeight) / 2))
  gsap.fromTo(
    img,
    { y: () => -range() },
    {
      y: () => range(),
      ease: 'none',
      scrollTrigger: { trigger: wrap, start: 'top bottom', end: 'bottom top', scrub: true, invalidateOnRefresh: true },
    },
  )
}

/* ───────────────────────── Home hero scrub (≥1024 px) ─────────────────────────
 * Scroll 0 → 70svh: the panorama is pinned where it stands and grows from its 21:9 frame inside the
 * grid margins to 100vw × 100svh, the image drifts yPercent −6 (art-direction §5). Transforms only:
 * the media box scales (non-uniformly) from its top-left corner, the image is counter-scaled so it
 * never distorts, the caption follows the bottom edge. The 70svh are reserved in CSS from the first
 * paint (motion.css «Home hero scrub»: hero padding-bottom), not by pin spacing, so creating the
 * pin at hydration moves no box (CLS); after the end ScrollTrigger offsets the panorama by the
 * same 70svh, into that reserved space. Below 1024 px: the CSS entry only.
 */
function heroScrub(hero: HTMLElement): (() => void) | undefined {
  const pano = hero.querySelector<HTMLElement>('[data-hero-panorama]')
  if (!pano) return
  const box = pano.querySelector<HTMLElement>('[data-figure-media]') ?? pano
  const img = box.querySelector<HTMLElement>('img')
  const caption = box === pano ? null : pano.querySelector<HTMLElement>('figcaption')

  // Above the title and the print while it grows (the header stays on top, z-50).
  gsap.set(pano, { position: 'relative', zIndex: 2 })

  const geo = { x: 0, y: 0, w: 1, h: 1, vw: 1, vh: 1 }

  const render = (p: number) => {
    const sx = 1 + (geo.vw / geo.w - 1) * p
    const sy = 1 + (geo.vh / geo.h - 1) * p
    const tx = -geo.x * p
    const ty = -geo.y * p
    box.style.transformOrigin = '0 0'
    box.style.transform = `translate3d(${tx}px, ${ty}px, 0) scale(${sx}, ${sy})`
    if (img) {
      // Uniform net scale k (cover), +12% slack for the −6% drift.
      const k = Math.max(sx, sy) * (1 + 0.12 * p)
      img.style.transform = `translate3d(0, ${-6 * p}%, 0) scale(${k / sx}, ${k / sy})`
    }
    if (caption) caption.style.transform = `translate3d(0, ${ty + geo.h * sy - geo.h}px, 0)`
  }

  const st = ScrollTrigger.create({
    trigger: pano,
    pin: pano,
    pinSpacing: false, // the distance is reserved in CSS (see above)
    start: 0,
    end: () => window.innerHeight * 0.7,
    refreshPriority: 1,
    onRefresh: (self) => {
      // Rest geometry at scroll = start, measured without our transform. The pin spacer stays in
      // the flow where the panorama was, so it gives the rest position even while pinned.
      const prev = box.style.transform
      box.style.transform = 'none'
      const spacer = pano.parentElement?.classList.contains('pin-spacer') ? pano.parentElement : pano
      const s = spacer.getBoundingClientRect()
      const p = pano.getBoundingClientRect()
      const b = box.getBoundingClientRect()
      box.style.transform = prev
      geo.x = s.left + (b.left - p.left)
      geo.y = s.top + window.scrollY - self.start + (b.top - p.top)
      geo.w = box.offsetWidth || 1
      geo.h = box.offsetHeight || 1
      geo.vw = document.documentElement.clientWidth
      geo.vh = window.innerHeight
      render(self.progress)
    },
    onUpdate: (self) => render(self.progress),
  })

  return () => {
    st.kill()
    box.style.removeProperty('transform')
    box.style.removeProperty('transform-origin')
    img?.style.removeProperty('transform')
    caption?.style.removeProperty('transform')
  }
}
