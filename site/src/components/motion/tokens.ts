// Motion tokens (art-direction §5) for GSAP. The CSS side lives in globals.css (`--ease-*`) and
// motion.css; these functions are the same cubic-béziers, so JS and CSS motion share one curve.

/** CSS `cubic-bezier()` as an easing function (WebKit UnitBezier: Newton–Raphson, then bisection). */
export function cubicBezier(x1: number, y1: number, x2: number, y2: number): (p: number) => number {
  const cx = 3 * x1
  const bx = 3 * (x2 - x1) - cx
  const ax = 1 - cx - bx
  const cy = 3 * y1
  const by = 3 * (y2 - y1) - cy
  const ay = 1 - cy - by
  const sampleX = (t: number) => ((ax * t + bx) * t + cx) * t
  const sampleY = (t: number) => ((ay * t + by) * t + cy) * t
  const slopeX = (t: number) => (3 * ax * t + 2 * bx) * t + cx

  const solveX = (x: number) => {
    let t = x
    for (let i = 0; i < 8; i++) {
      const err = sampleX(t) - x
      if (Math.abs(err) < 1e-6) return t
      const d = slopeX(t)
      if (Math.abs(d) < 1e-6) break
      t -= err / d
    }
    let lo = 0
    let hi = 1
    t = x
    while (hi - lo > 1e-7) {
      const v = sampleX(t)
      if (Math.abs(v - x) < 1e-6) return t
      if (x > v) lo = t
      else hi = t
      t = (lo + hi) / 2
    }
    return t
  }

  return (p: number) => (p <= 0 ? 0 : p >= 1 ? 1 : sampleY(solveX(p)))
}

export const ease = {
  /** `--ease-out` cubic-bezier(.16,1,.3,1) ≈ expo.out: entrances. */
  out: cubicBezier(0.16, 1, 0.3, 1),
  /** `--ease-in-out` cubic-bezier(.65,0,.35,1) ≈ power3.inOut: transitions, curtain. */
  inOut: cubicBezier(0.65, 0, 0.35, 1),
  /** `--ease-line` cubic-bezier(.45,0,.2,1): the coastline drawing. */
  line: cubicBezier(0.45, 0, 0.2, 1),
}

/** Durations, seconds (§5): 320 UI, 480–600 buttons/menu, 900 lines, 1400 photos, 1800 line. */
export const dur = {
  ui: 0.32,
  segment: 0.4,
  swap: 0.6,
  text: 0.8,
  lines: 0.9,
  photo: 1.4,
  coast: 1.8,
}

/** Steps, seconds: lines 90 ms, section parts 80 ms, list items 60 ms. */
export const step = { lines: 0.09, parts: 0.08, items: 0.06 }

/** Media queries shared by every motion module. Under 1024 px there are no pins and no scrub (§5). */
export const mq = {
  motion: '(prefers-reduced-motion: no-preference)',
  reduce: '(prefers-reduced-motion: reduce)',
  desktopMotion: '(prefers-reduced-motion: no-preference) and (min-width: 64rem)',
  desktopReduce: '(prefers-reduced-motion: reduce) and (min-width: 64rem)',
  mobileMotion: '(prefers-reduced-motion: no-preference) and (max-width: 63.99rem)',
  /** Touch-first: no snapping (no scroll-jacking on touch). */
  coarse: '(pointer: coarse)',
} as const

export const prefersReducedMotion = () =>
  typeof window !== 'undefined' && window.matchMedia(mq.reduce).matches
