'use client'

import { clsx } from 'clsx'
import { getImageProps } from 'next/image'
import { useLayoutEffect, useRef, useState } from 'react'
import { type PhotoKey, type Ratio, photoRatios, photos } from '@/lib/photos'

/** Phones: 21:9 strip on top of the quiz; Pattaya and Dubai have no 21:9 crop, so 3:2. */
function mobileRatio(key: PhotoKey): Ratio {
  return photoRatios(key).includes('21x9') ? '21x9' : '3x2'
}

const aspect: Record<Ratio, string> = {
  '21x9': 'aspect-[21/9]',
  '3x2': 'aspect-[3/2]',
  '4x5': 'aspect-[4/5]',
  '1x1': 'aspect-square',
}

const SIZES = '(min-width: 64rem) 40vw, 100vw'

function Layer({ photo, alt, priority }: { photo: PhotoKey; alt: string; priority: boolean }) {
  const desktop = photos[photo]['4x5'] ?? photos[photo]['3x2']
  const mobile = photos[photo][mobileRatio(photo)] ?? desktop
  if (!desktop || !mobile) return null
  const common = { alt, sizes: SIZES, quality: 80, fill: true } as const
  const {
    props: { srcSet: desktopSrcSet },
  } = getImageProps({ ...common, src: desktop.src })
  const {
    props: { srcSet: mobileSrcSet, ...rest },
  } = getImageProps({
    ...common,
    src: mobile.src,
    loading: 'eager',
    fetchPriority: priority ? 'high' : undefined,
  })
  return (
    <picture>
      <source media="(min-width: 64rem)" srcSet={desktopSrcSet} sizes={SIZES} />
      {/* The mobile crop lives on the <img> (srcSet + sizes): valid HTML, same choice as ui/figure. */}
      {/* eslint-disable-next-line jsx-a11y/alt-text -- alt comes from getImageProps */}
      <img {...rest} srcSet={mobileSrcSet} className="object-cover" />
    </picture>
  )
}

/**
 * Photo of the chosen direction: 4:5 in the sticky column from 1024 px, 21:9 (or 3:2) strip on
 * phones. A new photo is revealed over the old one by a clip from the bottom, 600 ms
 * (art-direction §6 «/podbor»); instant with reduced motion.
 */
export function QuizPhoto({ photo, alt }: { photo: PhotoKey; alt: string }) {
  const [shown, setShown] = useState(photo)
  const [prev, setPrev] = useState<PhotoKey | null>(null)
  const [first] = useState(photo)
  const topRef = useRef<HTMLDivElement>(null)

  // Remember the previous photo while the new one is revealed (derived state, set during render).
  if (photo !== shown) {
    setPrev(shown)
    setShown(photo)
  }

  useLayoutEffect(() => {
    const el = topRef.current
    if (!prev || !el) return
    const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches
    const animation = el.animate([{ clipPath: 'inset(100% 0 0 0)' }, { clipPath: 'inset(0 0 0 0)' }], {
      duration: reduce ? 0 : 600,
      easing: 'cubic-bezier(.16,1,.3,1)',
    })
    animation.onfinish = () => setPrev(null)
    return () => animation.cancel()
  }, [shown, prev])

  return (
    <div data-figure-media="" className={clsx('relative overflow-hidden bg-sand lg:aspect-[4/5]', aspect[mobileRatio(shown)])}>
      {prev ? (
        <div className="absolute inset-0" aria-hidden="true">
          <Layer photo={prev} alt="" priority={false} />
        </div>
      ) : null}
      <div ref={topRef} key={shown} className="absolute inset-0">
        <Layer photo={shown} alt={alt} priority={shown === first} />
      </div>
    </div>
  )
}
