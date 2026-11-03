'use client'

/* ───────────────────────── Home hero scrub (≥1024 px) ─────────────────────────
 * Scroll 0 → 70svh: the panorama is pinned where it stands and grows from its 21:9 frame inside the
 * grid margins to 100vw × 100svh, the image drifts yPercent −6 (art-direction §5). Transforms only:
 * the media box scales (non-uniformly) from its top-left corner, the image is counter-scaled so it
 * never distorts, the caption follows the bottom edge. The 70svh are reserved in CSS from the first
 * paint (motion.css «Home hero scrub»: hero padding-bottom), not by pin spacing, so creating the
 * pin at hydration moves no box (CLS); after the end ScrollTrigger offsets the panorama by the
 * same 70svh, into that reserved space. Below 1024 px: the CSS entry only.
 *
 * Edition 2 — the expansion reads as a camera move: the caption fades out over the first part of
 * the scrub, the title and the print are pushed up faster than the page (a parallax of the
 * foreground against the panorama that stays). The lead, button and reply line are left alone:
 * the one action of the screen never moves under the pointer.
 *
 * Tuning: TITLE_PUSH / PRINT_PUSH = extra upward travel as a share of the scrolled distance
 * (0 = none); CAPTION_FADE = share of the scrub after which the caption is fully transparent.
 */
import { ScrollTrigger, gsap } from '@/lib/gsap'

const TITLE_PUSH = 0.25
const PRINT_PUSH = 0.12
const CAPTION_FADE = 0.35
const SCRUB_VH = 0.7

export function heroScrub(hero: HTMLElement): (() => void) | undefined {
  const pano = hero.querySelector<HTMLElement>('[data-hero-panorama]')
  if (!pano) return
  const box = pano.querySelector<HTMLElement>('[data-figure-media]') ?? pano
  const img = box.querySelector<HTMLElement>('img')
  const caption = box === pano ? null : pano.querySelector<HTMLElement>('figcaption')
  const title = hero.querySelector<HTMLElement>('[data-hero-title]')
  const print = hero.querySelector<HTMLElement>('[data-hero-print]')

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
    if (caption) {
      caption.style.transform = `translate3d(0, ${ty + geo.h * sy - geo.h}px, 0)`
      caption.style.opacity = String(1 - Math.min(1, p / CAPTION_FADE))
    }
    // Foreground parallax. At rest the styles are removed, so the LCP text keeps its own
    // rasterisation (no compositor layer while nothing moves).
    const scrolled = p * SCRUB_VH * geo.vh
    if (title) title.style.transform = p > 0 ? `translate3d(0, ${(-TITLE_PUSH * scrolled).toFixed(2)}px, 0)` : ''
    if (print) print.style.transform = p > 0 ? `translate3d(0, ${(-PRINT_PUSH * scrolled).toFixed(2)}px, 0)` : ''
  }

  const st = ScrollTrigger.create({
    trigger: pano,
    pin: pano,
    pinSpacing: false, // the distance is reserved in CSS (see above)
    start: 0,
    end: () => window.innerHeight * SCRUB_VH,
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
    caption?.style.removeProperty('opacity')
    title?.style.removeProperty('transform')
    print?.style.removeProperty('transform')
  }
}
