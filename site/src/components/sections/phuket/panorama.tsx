import { clsx } from 'clsx'
import type { ReactNode } from 'react'
import { Figure } from '@/components/ui/figure'
import type { PhotoKey, PhotoRatio } from '@/lib/photos'

type PanoramaProps<K extends PhotoKey> = {
  photo: K
  ratio: PhotoRatio<K>
  /** Own crop under 768 px (art-direction §3.6). */
  mobileRatio?: PhotoRatio<K>
  caption?: ReactNode
  locator?: ReactNode
  preload?: boolean
  className?: string
}

/**
 * Photo «в край» (100vw) with its caption kept on the grid, under the photo.
 * Motion hooks: `data-parallax` on the wrapper (BUILD_PLAN «Хуки моушна», art-direction §5). The
 * image keeps its own box: the motion layer scales it 1.12 for the slack it needs to drift
 * −6 % → 6 % (motion `parallax`), so the page must not make it taller as well. `data-reveal="clip"`:
 * the photo opens from the bottom as it enters (on arrival through the curtain, as the panel lifts).
 */
export function Panorama<K extends PhotoKey>({
  photo,
  ratio,
  mobileRatio,
  caption,
  locator,
  preload,
  className,
}: PanoramaProps<K>) {
  return (
    <div data-parallax="" data-reveal="clip" className={clsx('col-span-full', className)}>
      <Figure
        photo={photo}
        ratio={ratio}
        mobileRatio={mobileRatio}
        caption={caption}
        locator={locator}
        preload={preload}
        sizes="100vw"
        mediaClassName="full-bleed"
      />
    </div>
  )
}
