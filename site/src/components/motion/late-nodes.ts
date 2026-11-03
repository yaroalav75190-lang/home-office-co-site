'use client'

// Nodes that appear after the page scan: quiz steps (the step container is re-keyed on every
// answer), the thank-you screens of the forms, the quiz column's coast and locator when the
// direction changes. MotionRoot scans <main> once per route; this watcher catches the rest with a
// MutationObserver and gives each added subtree its own GSAP context, reverted when the subtree
// leaves the DOM (so no ScrollTrigger outlives its element).
//
// React reuses an <svg> when only its coast changes (same element type, same position), so the
// `data-coast` / `data-locator` attribute changes are watched too: that is the quiz redrawing the
// coast on every direction change.
//
// The observer runs in a microtask after React's commit, before the next paint: from-states set
// here never flash.
import { gsap } from '@/lib/gsap'

export type LateSetup = (el: Element, ctx: gsap.Context) => (() => void)[]
export type LateRedraw = (svg: SVGSVGElement, ctx: gsap.Context) => (() => void)[]

type Owned = { ctx: gsap.Context; cleanups: (() => void)[] }

/**
 * @param hooks  selector of what an added subtree must contain to get a context (anything else,
 *               e.g. SplitText's line wrappers or a form's error summary, is ignored)
 */
export function watchLateNodes(root: HTMLElement, hooks: string, setup: LateSetup, redraw: LateRedraw): () => void {
  const owned = new Map<Element, Owned>()
  const interesting = (el: Element) => el.matches(hooks) || el.querySelector(hooks) !== null

  const release = (el: Element) => {
    const o = owned.get(el)
    if (!o) return
    owned.delete(el)
    o.cleanups.forEach((fn) => fn())
    o.ctx.revert()
  }

  const observer = new MutationObserver((records) => {
    const added: Element[] = []
    const changed = new Set<SVGSVGElement>()
    for (const r of records) {
      if (r.type === 'attributes') {
        if (r.target instanceof SVGSVGElement && r.target.isConnected) changed.add(r.target)
        continue
      }
      r.addedNodes.forEach((n) => {
        if (n instanceof Element) added.push(n)
      })
      r.removedNodes.forEach((n) => {
        if (!(n instanceof Element)) return
        owned.forEach((_, el) => {
          if (n === el || n.contains(el)) release(el)
        })
      })
    }

    // One context per top-most added subtree (a node inside another added node is covered by it).
    added.forEach((el) => {
      if (!el.isConnected || owned.has(el) || !interesting(el)) return
      if (added.some((other) => other !== el && other.contains(el))) return
      const cleanups: (() => void)[] = []
      const ctx = gsap.context((self) => cleanups.push(...setup(el, self)))
      owned.set(el, { ctx, cleanups })
    })

    changed.forEach((svg) => {
      if (added.some((el) => el === svg || el.contains(svg))) return
      release(svg)
      const cleanups: (() => void)[] = []
      const ctx = gsap.context((self) => cleanups.push(...redraw(svg, self)))
      owned.set(svg, { ctx, cleanups })
    })
  })

  observer.observe(root, { childList: true, subtree: true, attributes: true, attributeFilter: ['data-coast', 'data-locator'] })

  return () => {
    observer.disconnect()
    Array.from(owned.keys()).forEach(release)
  }
}
