import { clsx } from 'clsx'
import Image, { getImageProps } from 'next/image'
import type { ReactNode } from 'react'
import { getPhoto, photoMeta, type PhotoKey, type PhotoRatio, type Ratio } from '@/lib/photos'

const aspect: Record<Ratio, string> = {
  '21x9': 'aspect-[21/9]',
  '3x2': 'aspect-[3/2]',
  '4x5': 'aspect-[4/5]',
  '1x1': 'aspect-square',
}

/** Same ratios from 768 px up, for art-directed figures. */
const aspectMd: Record<Ratio, string> = {
  '21x9': 'md:aspect-[21/9]',
  '3x2': 'md:aspect-[3/2]',
  '4x5': 'md:aspect-[4/5]',
  '1x1': 'md:aspect-square',
}

export type FigureProps<K extends PhotoKey> = {
  photo: K
  /** Crop from `@/lib/photos`; only ratios that exist for this photo type-check. */
  ratio: PhotoRatio<K>
  /** Own crop under 768 px (e.g. hero 21:9 → 4:5 on phones, art-direction §3.6). */
  mobileRatio?: PhotoRatio<K>
  /** Locator 24 px before the caption: `<Locator place="kata-noi" />` from `@/components/coast`. */
  locator?: ReactNode
  /** Caption under the photo. Defaults to `photoMeta[photo].caption`; `null` hides it. */
  caption?: ReactNode | null
  /** Overrides `photoMeta[photo].alt`. Use "" only for a purely decorative repeat. */
  alt?: string
  /** `sizes` for srcset; defaults to full width. Pass the real layout width, e.g. "(min-width: 64rem) 33vw, 100vw". */
  sizes?: string
  /** LCP image: preload in <head> (Next 16 `preload`, replaces `priority`). */
  preload?: boolean
  className?: string
  /** Classes for the media box (the element motion code clips and scales). */
  mediaClassName?: string
  imageClassName?: string
}

/**
 * Photo with the caption UNDER it (text never sits on a photo, art-direction §3.6):
 * Small, ink-muted, «Место, побережье», with an optional locator.
 * The media box keeps the ratio before the image loads (no CLS) and is marked `data-figure-media`
 * for reveal animations; the figure itself is marked `data-figure` for the hover (image 1.03,
 * locator dot pulse; motion.css «Figures alive on hover»).
 */
export function Figure<K extends PhotoKey>({
  photo,
  ratio,
  mobileRatio,
  locator,
  caption,
  alt,
  sizes = '100vw',
  preload = false,
  className,
  mediaClassName,
  imageClassName,
}: FigureProps<K>) {
  const meta = photoMeta[photo]
  const altText = alt ?? meta.alt
  const captionContent = caption === undefined ? meta.caption : caption
  const asset = getPhoto(photo, ratio)
  const imgClasses = clsx('object-cover', imageClassName)

  let media: ReactNode
  if (mobileRatio && mobileRatio !== ratio) {
    // Art direction: <picture> with a desktop source from 768 px. `preload` cannot be used with
    // two candidates (both would load), so the LCP hint is fetchPriority instead.
    const mobileAsset = getPhoto(photo, mobileRatio)
    const common = { alt: altText, sizes, quality: 80, fill: true } as const
    const {
      props: { srcSet: desktopSrcSet },
    } = getImageProps({ ...common, src: asset.src })
    const {
      props: { srcSet: mobileSrcSet, ...rest },
    } = getImageProps({
      ...common,
      src: mobileAsset.src,
      loading: preload ? 'eager' : 'lazy',
      fetchPriority: preload ? 'high' : undefined,
    })
    media = (
      <picture>
        <source media="(min-width: 48rem)" srcSet={desktopSrcSet} sizes={sizes} />
        {/* The mobile crop lives on the <img> itself (srcSet + sizes): a second, media-less
            <source> before an <img srcset> is invalid HTML, and so is `sizes` without `srcset` (W3C). */}
        {/* eslint-disable-next-line jsx-a11y/alt-text -- props come from getImageProps, alt included */}
        <img {...rest} srcSet={mobileSrcSet} className={imgClasses} />
      </picture>
    )
  } else {
    media = (
      <Image
        src={asset.src}
        alt={altText}
        fill
        sizes={sizes}
        quality={80}
        preload={preload}
        className={imgClasses}
      />
    )
  }

  return (
    <figure data-figure="" className={className}>
      <div
        data-figure-media=""
        className={clsx(
          'relative overflow-hidden bg-sand',
          mobileRatio && mobileRatio !== ratio ? [aspect[mobileRatio], aspectMd[ratio]] : aspect[ratio],
          mediaClassName,
        )}
      >
        {media}
      </div>
      {captionContent ? (
        <figcaption className="type-small mt-3 flex items-center gap-2 text-ink-muted on-ink:text-on-ink-muted">
          {locator ? (
            <span className="inline-flex size-6 shrink-0 items-center justify-center" aria-hidden="true">
              {locator}
            </span>
          ) : null}
          <span>{captionContent}</span>
        </figcaption>
      ) : null}
    </figure>
  )
}
