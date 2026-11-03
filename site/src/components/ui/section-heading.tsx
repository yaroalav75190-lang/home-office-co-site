import { clsx } from 'clsx'
import type { ReactNode } from 'react'

type SectionHeadingProps = {
  title: ReactNode
  /** Lead (default) or Body (quiet) phrase, up to 40 ch. */
  lead?: ReactNode
  /**
   * `default`: h2 D2 in columns 1–8, Lead in 9–12 with its last line on the h2 baseline;
   * stacked 24 px below the h2 under 1024 px.
   * `quiet`: h2 D3 in columns 1–6 and Body under it.
   */
  variant?: 'default' | 'quiet'
  as?: 'h2' | 'h3'
  id?: string
  className?: string
  /**
   * Motion hooks (BUILD_PLAN «Хуки моушна»): `data-reveal="lines"` on the heading and
   * `data-reveal="fade"` on the lead. Off by default. Added by pages-home.
   */
  reveal?: boolean
}

/**
 * Section heading (art-direction §4). Place it inside a `grid-site` container:
 * it spans all columns and lays its parts out on the parent grid through subgrid.
 */
export function SectionHeading({
  title,
  lead,
  variant = 'default',
  as: Heading = 'h2',
  id,
  className,
  reveal = false,
}: SectionHeadingProps) {
  const headingReveal = reveal ? { 'data-reveal': 'lines' } : {}
  const leadReveal = reveal ? { 'data-reveal': 'fade' } : {}

  if (variant === 'quiet') {
    return (
      <div className={clsx('col-span-full grid grid-cols-subgrid', className)}>
        <Heading id={id} className="type-d3 col-span-full md:col-span-6" {...headingReveal}>
          {title}
        </Heading>
        {lead ? (
          <p
            className="type-body col-span-full mt-6 max-w-[60ch] text-ink-muted on-ink:text-on-ink-muted md:col-span-6"
            {...leadReveal}
          >
            {lead}
          </p>
        ) : null}
      </div>
    )
  }

  return (
    <div className={clsx('col-span-full grid grid-cols-subgrid lg:items-baseline-last', className)}>
      <Heading id={id} className="type-d2 col-span-full lg:col-span-8" {...headingReveal}>
        {title}
      </Heading>
      {lead ? (
        <p
          className="type-lead col-span-full mt-6 max-w-[40ch] md:col-span-6 lg:col-span-4 lg:col-start-9 lg:mt-0"
          {...leadReveal}
        >
          {lead}
        </p>
      ) : null}
    </div>
  )
}
