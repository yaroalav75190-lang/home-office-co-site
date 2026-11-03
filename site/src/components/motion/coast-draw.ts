'use client'

// Drawing the coastline with stroke-dashoffset (art-direction §5: pathLength 1, dashoffset 1 → 0).
// Base paths go through `setCoastDrawMode` from the coast package (non-scaling strokes break
// pathLength dashes in Chrome). District segments are not covered by it, so `segmentDrawMode`
// does the same for them, keeping their on-screen width in px.
//
// Edition 2: locators draw too (`drawLocator`): the silhouette is drawn, then the district segment
// fades in and the place dot grows from nothing (its `r`, not a transform, so the CSS hover pulse
// in motion.css never fights it). A draw can be replayed on the same SVG (the quiz redraws the
// coast on every direction change): the running one is replaced, never stacked.
import { setCoastDrawMode } from '@/components/coast/draw'
import { gsap, ScrollTrigger } from '@/lib/gsap'
import { dur, ease } from './tokens'

/** Screen px per viewBox unit of an SVG (0 when it is not rendered). */
export function svgScale(svg: SVGSVGElement): number {
  const m = svg.getScreenCTM()
  return m ? Math.hypot(m.a, m.b) : 0
}

/**
 * Switch district segments to `vector-effect: none` so pathLength dashes work, and give them a
 * width in px (converted to viewBox units). `on = false` restores the server markup.
 */
export function segmentDrawMode(svg: SVGSVGElement, segments: SVGPathElement[], on: boolean, px: number[] = []) {
  const scale = svgScale(svg)
  segments.forEach((s, i) => {
    s.style.removeProperty('vector-effect')
    s.style.removeProperty('stroke-width')
    if (!on || !scale) return
    s.style.setProperty('vector-effect', 'none')
    s.style.setProperty('stroke-width', String((px[i] ?? (Number(s.getAttribute('stroke-width')) || 1.5)) / scale))
  })
}

export type DrawOptions = {
  /** ScrollTrigger start; default `top 85%`. */
  start?: string
  /** Play now instead of on enter (elements that appear in view: quiz column, scene panels). */
  immediate?: boolean
  /** Line duration in seconds; default `dur.coast` (1.8 s). */
  duration?: number
}

/** The cleanup of the draw running on each SVG, so a new draw replaces it. */
const running = new WeakMap<SVGSVGElement, () => void>()

/**
 * Draw a <Coast> (or a <Locator>) once when it enters the viewport (top 85%), 1800 ms on the line
 * curve. A highlighted district then appears on the drawn line and thickens 1.5 → 3 px (400 ms);
 * a place dot grows out of the line at the end.
 * Call inside a GSAP context (tweens and triggers are reverted with it); returns the cleanup for
 * the non-GSAP side effects.
 */
export function drawCoast(svg: SVGSVGElement, opts: DrawOptions = {}): () => void {
  running.get(svg)?.()
  const paths = Array.from(svg.querySelectorAll<SVGPathElement>('[data-coast-path]'))
  const segments = Array.from(svg.querySelectorAll<SVGPathElement>('[data-district]'))
  const dots = Array.from(svg.querySelectorAll<SVGCircleElement>('[data-place]'))
  if (!paths.length) return () => {}
  const duration = opts.duration ?? dur.coast
  const radius = dots.map((d) => d.getAttribute('r') ?? '0')
  let done = false

  setCoastDrawMode(svg, true)
  const onRefresh = () => {
    if (!done) setCoastDrawMode(svg, true)
  }
  ScrollTrigger.addEventListener('refresh', onRefresh)

  gsap.set(svg, { opacity: 1 })
  gsap.set(paths, { strokeDasharray: '1', strokeDashoffset: 1 })
  if (segments.length) gsap.set(segments, { opacity: 0 })
  if (dots.length) gsap.set(dots, { attr: { r: 0 } })

  const restore = () => {
    done = true
    setCoastDrawMode(svg, false)
    gsap.set(paths, { clearProps: 'strokeDasharray,strokeDashoffset' })
    dots.forEach((d, i) => d.setAttribute('r', radius[i]))
  }

  const tl = gsap.timeline({
    scrollTrigger: opts.immediate ? undefined : { trigger: svg, start: opts.start ?? 'top 85%', once: true },
    onComplete: restore,
  })
  tl.to(paths, { strokeDashoffset: 0, duration, ease: ease.line })
  if (segments.length) {
    tl.fromTo(
      segments,
      { opacity: 0, strokeWidth: 1.5 },
      {
        opacity: 1,
        strokeWidth: (_i: number, el: Element) => Number(el.getAttribute('stroke-width')) || 1.5,
        duration: dur.segment,
        ease: ease.out,
        clearProps: 'strokeWidth',
      },
    )
  }
  // The dot grows while the last stretch of the line is still being drawn.
  const dotAt = Math.max(0, duration - Math.min(0.4, duration * 0.25))
  dots.forEach((d, i) => tl.to(d, { attr: { r: radius[i] }, duration: 0.5, ease: ease.out }, dotAt))

  const cleanup = () => {
    if (running.get(svg) === cleanup) running.delete(svg)
    ScrollTrigger.removeEventListener('refresh', onRefresh)
    if (done) return
    tl.kill()
    restore()
    gsap.set(segments, { clearProps: 'opacity' })
  }
  running.set(svg, cleanup)
  return cleanup
}

/** Duration of a locator draw by its size: captions (24 px) are quick, the 96–160 px ones take the coast time. */
export function locatorDuration(svg: SVGSVGElement): number {
  const size = Number(svg.getAttribute('width')) || Number(svg.getAttribute('height')) || 0
  return size >= 96 ? dur.coast : dur.locator
}

/** A <Locator> draws like a coast, shorter when small. */
export function drawLocator(svg: SVGSVGElement, opts: DrawOptions = {}): () => void {
  return drawCoast(svg, { duration: locatorDuration(svg), ...opts })
}
