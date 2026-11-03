'use client'

// The live Lenis instance for imperative code (page transition, scene navigation, snapping).
// Set by the bridge in smooth-scroll.tsx; null on touch devices and under reduced motion,
// where the page scrolls natively.
import type Lenis from 'lenis'

let current: Lenis | null = null

export function setLenis(lenis: Lenis | null) {
  current = lenis
}

export function getLenis(): Lenis | null {
  return current
}

/** Scroll to a Y position: through Lenis when it runs, natively otherwise. */
export function scrollToY(y: number, opts: { immediate?: boolean; duration?: number } = {}) {
  const lenis = current
  if (lenis) {
    lenis.scrollTo(y, { immediate: opts.immediate, duration: opts.duration ?? 1.1, force: true, lock: false })
    return
  }
  window.scrollTo({ top: y, behavior: opts.immediate ? 'instant' : 'smooth' })
}
