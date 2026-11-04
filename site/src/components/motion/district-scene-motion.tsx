'use client'

// Client side of <DistrictScene> (district-scene.tsx renders all markup on the server).
//
// ≥1024 px, motion allowed — pinned scene:
//   the stage holds for 6 × 60svh; the island is drawn north → south with the scroll (the drawn
//   length is mapped so each district's segment draws itself from the moment that district
//   activates and is complete at the centre of its range, where the snap rests); the active
//   segment turns laterite and thickens 1.5 → 3 px in 400 ms and the island breathes once
//   (scale 1 → 1.015 → 1, 600 ms); the district name switches through a 600 ms mask, the text
//   cross-fades, the photo wipes in from the left (clip 600 ms, image settling from 1.08) while
//   the previous photo slides away to the right, the caption locator draws; the list of names
//   mirrors and drives the scroll and the current name draws its underline (motion.css); when the
//   scroll stops inside the hold it settles on the nearest district (not on touch screens).
//   The first district's photo wipes in as the stage enters. MotionRoot leaves the panels alone
//   in this mode (their `data-reveal="clip"` hooks serve the stacked layouts).
//   The layout (100svh stage, stacked panels, list, reserved scroll track, sticky hold) is CSS from
//   the first paint (motion.css «District scene»): this code never changes geometry, it only
//   scrubs paint, so hydration and ScrollTrigger refreshes cause no layout shift. No ScrollTrigger
//   pin: no pin-spacer is inserted and no `position: fixed` is toggled.
// ≥1024 px, reduced motion — no pin, no movement: sticky island (CSS), the segment of the district
//   in view is highlighted instantly.
// <1024 px — no pin: the island is drawn once on enter (1800 ms); the blocks are static.
// No JS — the server markup: island + six blocks.
import { type CSSProperties, type ReactNode, useRef } from 'react'
import { setCoastDrawMode } from '@/components/coast/draw'
import type { DistrictId } from '@/components/coast/types'
import { gsap, ScrollTrigger, useGSAP } from '@/lib/gsap'
import { drawCoast, drawLocator, segmentDrawMode, svgScale } from './coast-draw'
import { scrollToY } from './lenis-ref'
import { dur, ease, mq } from './tokens'

/** Name mask travel; > 100% so the clip padding (0.12em) is cleared too. */
const NAME_OFFSET = 125
/** Photo wipe: hidden behind the right edge of its box (clip from the left). */
const PHOTO_HIDDEN = 'inset(0% 100% 0% 0%)'
/** How far the previous photo slides (px) while it fades; the island's breath amplitude. */
const PHOTO_SLIDE = 24
const BREATH = 1.015

type Scene = {
  /** The scroll track (motion.css: 100svh + n × 60svh); the stage is sticky inside it. */
  wrap: HTMLElement
  stage: HTMLElement
  svg: SVGSVGElement
  panels: HTMLElement[]
  names: HTMLElement[]
  bodies: HTMLElement[]
  /** Photo box of each panel (null for a panel without a photo). */
  photos: (HTMLElement | null)[]
  links: HTMLAnchorElement[]
  segments: SVGPathElement[]
}

export function DistrictSceneMotion({ ids, children }: { ids: DistrictId[]; children: ReactNode }) {
  const root = useRef<HTMLDivElement>(null)

  useGSAP(
    () => {
      const wrap = root.current
      if (!wrap) return
      const stage = wrap.querySelector<HTMLElement>('[data-scene-stage]')
      const svg = wrap.querySelector<SVGSVGElement>('[data-scene-map] svg')
      if (!stage || !svg) return

      const pick = <T extends Element>(sel: (id: DistrictId) => string) =>
        ids.map((id) => wrap.querySelector<T>(sel(id))).filter((el): el is T => el !== null)
      const panels = pick<HTMLElement>((id) => `[data-scene-panel="${id}"]`)
      const scene: Scene = {
        wrap,
        stage,
        svg,
        panels,
        names: panels.map((p) => p.querySelector<HTMLElement>('[data-scene-name]') ?? p),
        bodies: panels.map((p) => p.querySelector<HTMLElement>('[data-scene-body]') ?? p),
        photos: panels.map((p) => p.querySelector<HTMLElement>('[data-figure-media]')),
        links: pick<HTMLAnchorElement>((id) => `[data-scene-link="${id}"]`),
        segments: pick<SVGPathElement>((id) => `[data-district="${id}"]`),
      }
      if (panels.length !== ids.length || scene.segments.length !== ids.length) return

      const mm = gsap.matchMedia()
      mm.add(mq.desktopMotion, () => pinnedScene(scene))
      mm.add(mq.desktopReduce, () => followScene(scene))
      mm.add(mq.mobileMotion, () => drawCoast(svg))
      return () => mm.revert()
    },
    { scope: root },
  )

  // `--scene-n` sizes the scroll track of the pinned layout (motion.css), rendered on the server.
  return (
    <div ref={root} data-scene-root="" style={{ '--scene-n': ids.length } as CSSProperties}>
      {children}
    </div>
  )
}

/* ───────────────────────── Pinned scene (≥1024 px, motion) ───────────────────────── */

function pinnedScene(s: Scene): () => void {
  const { wrap, stage, svg, panels, names, bodies, photos, links, segments } = s
  const n = panels.length
  const base = Array.from(svg.querySelectorAll<SVGPathElement>('[data-coast-path]'))
  const main = base[0]
  const segClass = segments.map((seg) => seg.getAttribute('class'))
  const images = photos.map((box) => box?.querySelector<HTMLElement>('img') ?? null)
  const locators = panels.map((p) => p.querySelector<SVGSVGElement>('figcaption svg[data-locator]'))
  // The text column cross-fades; the photo column is left to the wipe (both sit in the body grid).
  const texts = bodies.map((b) => (b.firstElementChild as HTMLElement | null) ?? b)
  const drawCleanups: (() => void)[] = []

  const fr = districtFractions(main, segments)
  const width = segments.map(() => ({ px: 1.5 }))
  let scale = 0
  const applyWidth = (i: number) => {
    if (scale) segments[i].style.strokeWidth = String(width[i].px / scale)
  }
  const enterDrawMode = () => {
    setCoastDrawMode(svg, true)
    segmentDrawMode(svg, segments, true, width.map((w) => w.px))
    scale = svgScale(svg)
  }

  enterDrawMode()
  base.forEach((p) => {
    p.style.strokeDasharray = '1'
    p.style.strokeDashoffset = '1'
  })
  segments.forEach((seg) => {
    seg.setAttribute('class', 'text-laterite')
    seg.style.strokeDasharray = '1'
    seg.style.strokeDashoffset = '1'
    seg.style.opacity = '0'
  })
  panels.forEach((p, i) => gsap.set(p, { opacity: i === 0 ? 1 : 0, pointerEvents: i === 0 ? 'auto' : 'none' }))
  names.forEach((el, i) => gsap.set(el, { yPercent: i === 0 ? 0 : NAME_OFFSET }))
  // Every photo waits behind its left-edge clip; the locators wait for their panel.
  photos.forEach((box) => box && gsap.set(box, { clipPath: PHOTO_HIDDEN }))
  locators.forEach((svg) => svg && gsap.set(svg, { opacity: 0 }))

  /** The photo of panel i wipes in from the left; the image settles from 1.08 with a 4 % pan. */
  const wipeIn = (i: number, delay = 0) => {
    const box = photos[i]
    if (!box) return
    gsap.killTweensOf(images[i] ? [box, images[i]] : box)
    gsap.fromTo(
      box,
      { clipPath: PHOTO_HIDDEN, x: 0, opacity: 1 },
      { clipPath: 'inset(0% 0% 0% 0%)', duration: dur.swap, delay, ease: ease.out, clearProps: 'clipPath' },
    )
    if (images[i]) {
      gsap.fromTo(
        images[i],
        { scale: 1.08, xPercent: -4 },
        { scale: 1, xPercent: 0, duration: dur.lines, delay, ease: ease.out, clearProps: 'transform' },
      )
    }
    const loc = locators[i]
    if (loc) drawCleanups.push(drawLocator(loc, { immediate: true }))
  }

  /** The photo of panel i slides to the right and fades, then waits behind its clip again. */
  const slideAway = (i: number) => {
    const box = photos[i]
    if (!box) return
    gsap.killTweensOf(images[i] ? [box, images[i]] : box)
    gsap.to(box, {
      x: PHOTO_SLIDE,
      opacity: 0,
      duration: dur.ui,
      ease: ease.out,
      onComplete: () => gsap.set(box, { x: 0, opacity: 1, clipPath: PHOTO_HIDDEN }),
    })
  }

  /** The island takes one breath when a district activates. */
  const breathe = () => {
    gsap.fromTo(
      svg,
      { scale: 1 },
      { scale: BREATH, duration: 0.3, ease: 'sine.inOut', yoyo: true, repeat: 1, overwrite: true, transformOrigin: '50% 50%' },
    )
  }

  let active = -1

  const setActive = (next: number) => {
    if (next === active) return
    const prev = active
    active = next
    const dir = prev < 0 || next > prev ? 1 : -1

    links.forEach((l, i) => (i === next ? l.setAttribute('aria-current', 'true') : l.removeAttribute('aria-current')))

    // Segment: the old one thins and fades back into the ink-muted base, the new one thickens.
    if (prev >= 0) {
      gsap.to(width[prev], { px: 1.5, duration: dur.segment, ease: ease.out, overwrite: true, onUpdate: () => applyWidth(prev) })
      gsap.to(segments[prev], { opacity: 0, duration: dur.segment, ease: ease.out, overwrite: true })
    }
    gsap.set(segments[next], { opacity: 1, overwrite: true })
    width[next].px = 1.5
    applyWidth(next)
    gsap.to(width[next], { px: 3, duration: dur.segment, ease: ease.out, overwrite: true, onUpdate: () => applyWidth(next) })

    if (prev < 0) return
    breathe()

    // Panels: name through the mask (600 ms), text cross-fade, photo wipe. Others snap to hidden (fast scroll).
    panels.forEach((p, i) => {
      if (i === prev || i === next) return
      gsap.killTweensOf([p, names[i], texts[i], photos[i], images[i]].filter((el) => el !== null))
      gsap.set(p, { opacity: 0, pointerEvents: 'none' })
      gsap.set(names[i], { yPercent: NAME_OFFSET })
      if (photos[i]) gsap.set(photos[i], { x: 0, opacity: 1, clipPath: PHOTO_HIDDEN })
    })
    gsap.killTweensOf([panels[prev], names[prev], texts[prev], panels[next], names[next], texts[next]])

    gsap.set(panels[prev], { pointerEvents: 'none', zIndex: 0 })
    gsap.to(names[prev], { yPercent: -NAME_OFFSET * dir, duration: dur.swap, ease: ease.inOut })
    gsap.to(texts[prev], {
      opacity: 0,
      duration: dur.ui,
      ease: ease.out,
      onComplete: () => {
        gsap.set(panels[prev], { opacity: 0 })
        gsap.set(texts[prev], { opacity: 1 })
      },
    })
    slideAway(prev)

    gsap.set(panels[next], { opacity: 1, pointerEvents: 'auto', zIndex: 1 })
    gsap.fromTo(names[next], { yPercent: NAME_OFFSET * dir }, { yPercent: 0, duration: dur.swap, delay: 0.08, ease: ease.out })
    gsap.fromTo(texts[next], { opacity: 0, y: 12 }, { opacity: 1, y: 0, duration: 0.5, delay: 0.16, ease: ease.out, clearProps: 'transform' })
    wipeIn(next, 0.12)
  }

  // Drawn share of the main path for a hold progress p. Knots: when district i activates (p = i/n)
  // the line has reached the start of its segment, at the centre of its range (where the snap
  // rests) the segment is complete; the stretch to the next district is drawn in the second half.
  // The whole island at the end.
  const knots: [number, number][] = [
    ...fr.flatMap((f, i): [number, number][] => [
      [i / n, f.start],
      [(i + 0.5) / n, f.end],
    ]),
    [1, 1],
  ]
  const drawnAt = (p: number) => {
    for (let k = 1; k < knots.length; k++) {
      const [p1, f1] = knots[k]
      if (p <= p1) {
        const [p0, f0] = knots[k - 1]
        return f0 + ((f1 - f0) * (p - p0)) / (p1 - p0 || 1)
      }
    }
    return 1
  }

  let approach: ScrollTrigger | null = null
  let track: ScrollTrigger | null = null

  const render = () => {
    if (!approach || !track) return
    const p = track.progress
    const f = p > 0 ? drawnAt(p) : approach.progress * fr[0].start
    main.style.strokeDashoffset = String(1 - f)
    for (let i = 1; i < base.length; i++) base[i].style.strokeDashoffset = String(1 - p)
    segments.forEach((seg, i) => {
      const span = fr[i].end - fr[i].start || 1
      const t = Math.min(1, Math.max(0, (f - fr[i].start) / span))
      seg.style.strokeDashoffset = String(1 - t)
    })
    setActive(p > 0 ? Math.min(n - 1, Math.floor(p * n)) : 0)
  }

  // As the scene scrolls in, the north cape is drawn down to the first district.
  approach = ScrollTrigger.create({ trigger: wrap, start: 'top bottom', end: 'top top', onUpdate: render })
  // The hold: the track's top reaches the top of the viewport → its bottom reaches the bottom, i.e.
  // n × 60svh of scroll while the sticky stage stays in place (both lengths come from motion.css).
  track = ScrollTrigger.create({
    trigger: wrap,
    start: 'top top',
    end: 'bottom bottom',
    onUpdate: render,
    onRefresh: () => {
      enterDrawMode()
      render()
    },
  })

  // The first district's photo wipes in as the stage reaches the viewport (the others wipe in
  // when their district activates).
  // A guard instead of `once: true`, which kills the trigger inside a refresh (see ONCE in reveals.ts).
  let firstWiped = false
  const first = ScrollTrigger.create({
    trigger: stage,
    start: 'top 85%',
    onEnter: () => {
      if (firstWiped) return
      firstWiped = true
      if (active === 0) wipeIn(0)
    },
  })

  const yFor = (i: number) => {
    if (!track) return 0
    return track.start + ((i + 0.5) / n) * (track.end - track.start)
  }

  // List: click scrolls to the district (keyboard: Enter on the focused link).
  const onLink = (e: MouseEvent) => {
    const i = links.indexOf(e.currentTarget as HTMLAnchorElement)
    if (i < 0) return
    e.preventDefault()
    scrollToY(yFor(i), { duration: 1.2 })
  }
  links.forEach((l) => l.addEventListener('click', onLink))

  // Focus entering a hidden panel (Tab to «Банг Тао подробно») brings that district up.
  const onFocus = (e: FocusEvent) => {
    const i = panels.findIndex((p) => p.contains(e.target as Node))
    if (i >= 0 && i !== active) scrollToY(yFor(i), { duration: 0.6 })
  }
  stage.addEventListener('focusin', onFocus)

  // Settle on the nearest district when the scroll stops inside the hold. The outer halves of the
  // first and last districts are left free, so the scene never traps the way in or out.
  const coarse = window.matchMedia(mq.coarse).matches
  const onScrollEnd = () => {
    if (coarse || !track || !track.isActive) return
    const y = window.scrollY
    const p = (y - track.start) / (track.end - track.start)
    if (p < 0.5 / n || p > (n - 0.5) / n) return
    const target = yFor(Math.min(n - 1, Math.floor(p * n)))
    if (Math.abs(target - y) > 4) scrollToY(target, { duration: 0.6 })
  }
  ScrollTrigger.addEventListener('scrollEnd', onScrollEnd)

  setActive(0)
  render()

  return () => {
    ScrollTrigger.removeEventListener('scrollEnd', onScrollEnd)
    stage.removeEventListener('focusin', onFocus)
    links.forEach((l) => {
      l.removeEventListener('click', onLink)
      l.removeAttribute('aria-current')
    })
    approach?.kill()
    track?.kill()
    first.kill()
    drawCleanups.forEach((fn) => fn())
    // Tweens started from scroll callbacks are outside the GSAP context: clear them by hand
    // (these nodes carry no inline styles from React).
    const media = [...photos, ...images, ...locators].filter((el): el is HTMLElement | SVGSVGElement => el !== null)
    const touched = [...panels, ...names, ...bodies, ...texts, ...media]
    gsap.killTweensOf([...touched, ...segments, ...width, svg])
    gsap.set(touched, { clearProps: 'all' })
    gsap.set(svg, { clearProps: 'transform' })
    setCoastDrawMode(svg, false)
    segmentDrawMode(svg, segments, false)
    base.forEach((p) => {
      p.style.removeProperty('stroke-dasharray')
      p.style.removeProperty('stroke-dashoffset')
    })
    segments.forEach((seg, i) => {
      const cls = segClass[i]
      if (cls === null) seg.removeAttribute('class')
      else seg.setAttribute('class', cls)
      seg.style.removeProperty('stroke-dasharray')
      seg.style.removeProperty('stroke-dashoffset')
      seg.style.removeProperty('opacity')
    })
  }
}

/**
 * Where each district segment starts and ends along the main coast path, as a share of its
 * length (the island path runs from the north cape down the west coast). Falls back to equal
 * slices if the geometry is not usable.
 */
function districtFractions(main: SVGPathElement, segments: SVGPathElement[]): { start: number; end: number }[] {
  const fallback = segments.map((_, i) => ({ start: (i * 0.6) / segments.length, end: ((i + 1) * 0.6) / segments.length }))
  try {
    const total = main.getTotalLength()
    if (!total) return fallback
    const N = 600
    const samples: DOMPoint[] = []
    for (let k = 0; k <= N; k++) samples.push(main.getPointAtLength((total * k) / N))
    const nearest = (pt: DOMPoint) => {
      let best = 0
      let bestD = Infinity
      for (let k = 0; k <= N; k++) {
        const d = (samples[k].x - pt.x) ** 2 + (samples[k].y - pt.y) ** 2
        if (d < bestD) {
          bestD = d
          best = k
        }
      }
      return best / N
    }
    const out = segments.map((seg) => {
      const len = seg.getTotalLength()
      const a = nearest(seg.getPointAtLength(0))
      const b = nearest(seg.getPointAtLength(len))
      return { start: Math.min(a, b), end: Math.max(a, b) }
    })
    const ordered = out.every((f, i) => f.end > f.start && (i === 0 || f.start >= out[i - 1].start))
    return ordered ? out : fallback
  } catch {
    return fallback
  }
}

/* ───────────────────────── Reduced motion (≥1024 px) ───────────────────────── */

function followScene(s: Scene): () => void {
  const { panels, segments } = s
  const original = segments.map((seg) => [seg.getAttribute('class'), seg.getAttribute('stroke-width')] as const)

  const show = (i: number) => {
    segments.forEach((seg, j) => {
      seg.setAttribute('class', j === i ? 'text-laterite' : (original[j][0] ?? ''))
      seg.setAttribute('stroke-width', j === i ? '3' : (original[j][1] ?? '1.5'))
    })
  }

  const triggers = panels.map((panel, i) =>
    ScrollTrigger.create({
      trigger: panel,
      start: 'top 60%',
      end: 'bottom 60%',
      onToggle: (self) => {
        if (self.isActive) show(i)
      },
    }),
  )

  return () => {
    triggers.forEach((t) => t.kill())
    segments.forEach((seg, j) => {
      const [cls, sw] = original[j]
      if (cls === null) seg.removeAttribute('class')
      else seg.setAttribute('class', cls)
      if (sw === null) seg.removeAttribute('stroke-width')
      else seg.setAttribute('stroke-width', sw)
    })
  }
}
