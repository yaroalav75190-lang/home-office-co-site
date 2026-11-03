'use client'

// Photo parallax, ≥1024 px only (art-direction §5, edition 2): the image moves inside its box with
// the scroll, the box never moves. Panoramas «в край» (`data-parallax`) drift −6 % → 6 %, every
// other figure −4 % → 4 %. The image needs slack for that: when the page did not make it taller
// than its box, it is scaled around the centre (1.12 or 1.08) and the scale is left in
// `img.dataset.motionScale`, so `revealClip` settles the image to that scale, not to 1.
//
// Tuning: `PANORAMA` and `FIGURE` below are the half-travel as a share of the image height.
import { gsap } from '@/lib/gsap'

export const PANORAMA = 0.06
export const FIGURE = 0.04

/**
 * @param wrap  the `[data-parallax]` wrapper or a `[data-figure-media]` box
 * @param amount half-travel (0.06 = yPercent −6 → 6)
 */
export function parallax(wrap: HTMLElement, amount: number): (() => void) | undefined {
  const box = wrap.matches('[data-figure-media]') ? wrap : (wrap.querySelector<HTMLElement>('[data-figure-media]') ?? wrap)
  const img = box.querySelector<HTMLElement>('img')
  if (!img) return
  const need = 1 + amount * 2
  // Scale only when the image is not already taller than its box by the needed slack.
  const scaled = img.offsetHeight < box.offsetHeight * (need - 0.02)
  if (scaled) gsap.set(img, { scale: need })
  img.dataset.motionScale = String(scaled ? need : 1)
  const range = () => (scaled ? img.offsetHeight * amount : Math.max(0, (img.offsetHeight - box.offsetHeight) / 2))
  gsap.fromTo(
    img,
    { y: () => -range() },
    {
      y: () => range(),
      ease: 'none',
      scrollTrigger: { trigger: box, start: 'top bottom', end: 'bottom top', scrub: true, invalidateOnRefresh: true },
    },
  )
  return () => {
    delete img.dataset.motionScale
  }
}
