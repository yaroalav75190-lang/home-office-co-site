'use client'

// The one-shot reveals of art-direction §5 (edition 2). Each function builds its tweens inside the
// caller's GSAP context (MotionRoot, or the late-node watcher for quiz steps), so everything is
// reverted with that context. All reveals fire once, at `START`.
//
//   revealLines    h2/h3: SplitText lines in a mask, yPercent 105 → 0, 900 ms, step 90 ms
//   revealFade     text: opacity 0 → 1, y 24 → 0, 800 ms, +150 ms after the heading
//   revealClip     photo box: clip inset(100% 0 0 0) → inset(0) 1400 ms, image 1.15 → 1
//   revealItems    list: children y 16 → 0, step 60 ms
//   revealSurface  ink / sand field: the block unrolls from its top edge, clip 1400 ms, ease-line
//
// Tuning: durations and steps live in tokens.ts; the from-values are the numbers below.
import { gsap, SplitText } from '@/lib/gsap'
import { dur, ease, step } from './tokens'

/** Trigger point of every reveal: the element's top at 85 % of the viewport height. */
export const START = 'top 85%'

/**
 * Play once on entering and never reverse — instead of `once: true`. A `once` trigger kills
 * itself inside ScrollTrigger.refresh() when the page is already scrolled past it (a direct load
 * of /#gid, a reload mid-page), which shrinks GSAP's trigger list while a pinned trigger is
 * walking it: «Cannot read properties of undefined (reading 'end')» and the whole page fell to
 * the error screen. These triggers stay alive (cheap) and do the same thing on screen.
 */
export const ONCE = { start: START, toggleActions: 'play none none none' } as const

/** The clip box of a figure wrapper (the caption stays put), or the element itself. */
export function mediaBox(el: HTMLElement): HTMLElement {
  return el.querySelector<HTMLElement>('[data-figure-media]') ?? el
}

/** The from-state of a reveal, set while the new page waits under the curtain. */
export function hideReveal(el: HTMLElement) {
  switch (el.dataset.reveal) {
    case 'lines':
      gsap.set(el, { opacity: 0 })
      break
    case 'clip':
      hideClip(el)
      break
    case 'items':
      gsap.set(el, { opacity: 1 })
      gsap.set(el.children, { opacity: 0, y: 16 })
      break
    default:
      gsap.set(el, { opacity: 0, y: 24 })
  }
}

export function hideClip(el: HTMLElement) {
  gsap.set(mediaBox(el), { clipPath: 'inset(100% 0% 0% 0%)' })
}

export function hideSurface(el: HTMLElement) {
  gsap.set(el, { clipPath: 'inset(0% 0% 100% 0%)' })
}

export function revealFade(el: HTMLElement) {
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
      scrollTrigger: { trigger: el, ...ONCE },
    },
  )
}

export function revealItems(el: HTMLElement) {
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
      scrollTrigger: { trigger: el, ...ONCE },
    },
  )
}

/**
 * Photo reveal: the box opens from the bottom edge while the image settles from 1.15 to its
 * resting scale. The resting scale is 1 unless `parallax()` already enlarged the image for its
 * slack (it leaves the value in `img.dataset.motionScale`), so the parallax must be set up first.
 */
export function revealClip(el: HTMLElement) {
  const box = mediaBox(el)
  const img = box.querySelector<HTMLElement>('img, video')
  const base = (img && Number(img.dataset.motionScale)) || 1
  const tl = gsap.timeline({ scrollTrigger: { trigger: box, ...ONCE } })
  tl.fromTo(
    box,
    { clipPath: 'inset(100% 0% 0% 0%)' },
    { clipPath: 'inset(0% 0% 0% 0%)', duration: dur.photo, ease: 'expo.inOut', clearProps: 'clipPath' },
    0,
  )
  if (img) tl.fromTo(img, { scale: base * 1.15 }, { scale: base, duration: dur.photo, ease: ease.out }, 0.1)
}

/**
 * A tinted field (`data-surface="ink" | "sand"`) arrives as a block: its top edge is a hairline
 * when the section reaches 85 % of the viewport, then the field unrolls downward over 1400 ms on
 * the line curve (slow start, so the edge is seen before it moves). The section is clipped as a
 * whole — background and text together — so nothing is ever salt-on-salt. Transform-free: the
 * clip changes paint only, the header reads the ink through hit-testing once the edge passes it.
 */
export function revealSurface(el: HTMLElement) {
  gsap.fromTo(
    el,
    { clipPath: 'inset(0% 0% 100% 0%)' },
    {
      clipPath: 'inset(0% 0% 0% 0%)',
      duration: dur.photo,
      ease: ease.line,
      clearProps: 'clipPath',
      scrollTrigger: { trigger: el, ...ONCE },
    },
  )
}

/** Wait for web fonts (line breaks depend on them), at most 1.5 s; autoSplit fixes a later swap. */
function fontsReady(): Promise<unknown> {
  const fonts = document.fonts?.ready ?? Promise.resolve()
  return Promise.race([fonts, new Promise((r) => window.setTimeout(r, 1500))])
}

export function revealLines(el: HTMLElement, ctx: gsap.Context): () => void {
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
        // Lines keep whole words, so the split text reads correctly as it is. The default 'auto'
        // puts aria-label on the element, which is not allowed on <p> and <h2> without a role
        // (Lighthouse/axe «aria-prohibited-attr»).
        aria: 'none',
        onSplit(self) {
          gsap.set(el, { opacity: 1 })
          return gsap.from(self.lines, {
            yPercent: 105,
            duration: dur.lines,
            ease: ease.out,
            stagger: step.lines,
            scrollTrigger: { trigger: el, ...ONCE },
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
