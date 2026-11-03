'use client'

// Drawing the coastline with stroke-dashoffset (art-direction §5: pathLength 1, dashoffset 1 → 0).
// Base paths go through `setCoastDrawMode` from the coast package (non-scaling strokes break
// pathLength dashes in Chrome). District segments are not covered by it, so `segmentDrawMode`
// does the same for them, keeping their on-screen width in px.
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

/**
 * Draw a <Coast> once when it enters the viewport (top 85%), 1800 ms on the line curve.
 * A highlighted district then appears on the drawn line and thickens 1.5 → 3 px (400 ms).
 * Call inside a GSAP context (tweens and triggers are reverted with it); returns the cleanup for
 * the non-GSAP side effects.
 */
export function drawCoast(svg: SVGSVGElement, start = 'top 85%'): () => void {
  const paths = Array.from(svg.querySelectorAll<SVGPathElement>('[data-coast-path]'))
  const segments = Array.from(svg.querySelectorAll<SVGPathElement>('[data-district]'))
  if (!paths.length) return () => {}
  let done = false

  setCoastDrawMode(svg, true)
  const onRefresh = () => {
    if (!done) setCoastDrawMode(svg, true)
  }
  ScrollTrigger.addEventListener('refresh', onRefresh)

  gsap.set(svg, { opacity: 1 })
  gsap.set(paths, { strokeDasharray: '1', strokeDashoffset: 1 })
  if (segments.length) gsap.set(segments, { opacity: 0 })

  const tl = gsap.timeline({
    scrollTrigger: { trigger: svg, start, once: true },
    onComplete: () => {
      done = true
      setCoastDrawMode(svg, false)
      gsap.set(paths, { clearProps: 'strokeDasharray,strokeDashoffset' })
    },
  })
  tl.to(paths, { strokeDashoffset: 0, duration: dur.coast, ease: ease.line })
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

  return () => {
    ScrollTrigger.removeEventListener('refresh', onRefresh)
    setCoastDrawMode(svg, false)
  }
}
