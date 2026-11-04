'use client'

// Lenis smooth scroll driven by the GSAP ticker so ScrollTrigger and Lenis share one frame.
// Pattern adapted from darkroom.engineering's Satūs starter (MIT), with Tempus replaced by gsap.ticker.
//
// ReactLenis is rendered as a SIBLING of the page (root mode needs no wrapper), so enabling it after
// mount never remounts the page tree. The bridge lives inside ReactLenis and gets the instance from
// context via useLenis(), so the ticker is attached only once Lenis really exists. It also publishes
// the instance to lenis-ref.ts for imperative code (page transition, scene navigation).
//
// ScrollTrigger.refresh after navigation, fonts and images is owned by MotionRoot.
import 'lenis/dist/lenis.css'
import { ReactLenis, useLenis } from 'lenis/react'
import { usePathname } from 'next/navigation'
import { type ReactNode, useEffect, useState } from 'react'
import { gsap, ScrollTrigger } from '@/lib/gsap'
import { setLenis } from './lenis-ref'
import { mq } from './tokens'

function LenisBridge() {
  const lenis = useLenis()
  const pathname = usePathname()

  useEffect(() => {
    if (!lenis) return
    setLenis(lenis)
    const offScroll = lenis.on('scroll', () => ScrollTrigger.update())
    const tick = (time: number) => lenis.raf(time * 1000)
    gsap.ticker.add(tick)
    gsap.ticker.lagSmoothing(0)
    return () => {
      offScroll()
      gsap.ticker.remove(tick)
      setLenis(null)
    }
  }, [lenis])

  // A new page starts at the top (keeps Lenis' own position in sync with the native one) — unless
  // the URL has an anchor: then the browser (direct load) or the page transition has already put
  // the page there, and MotionRoot settles it after measuring.
  useEffect(() => {
    if (!lenis || window.location.hash) return
    lenis.scrollTo(0, { immediate: true, force: true })
  }, [pathname, lenis])

  return null
}

export function SmoothScroll({ children }: { children: ReactNode }) {
  const [enabled, setEnabled] = useState(false)

  // Smooth scroll only for users who did not ask for reduced motion, and never on touch-first devices.
  useEffect(() => {
    const reduce = window.matchMedia(mq.reduce)
    const coarse = window.matchMedia(mq.coarse)
    const update = () => setEnabled(!reduce.matches && !coarse.matches)
    update()
    reduce.addEventListener('change', update)
    coarse.addEventListener('change', update)
    return () => {
      reduce.removeEventListener('change', update)
      coarse.removeEventListener('change', update)
    }
  }, [])

  return (
    <>
      {enabled && (
        // duration 1.1 s (art-direction §5); lerp is ignored when a duration is set.
        <ReactLenis root options={{ autoRaf: false, duration: 1.1, syncTouch: false }}>
          <LenisBridge />
        </ReactLenis>
      )}
      {children}
    </>
  )
}
