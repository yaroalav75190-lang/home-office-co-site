import { clsx } from 'clsx'
import { TransitionLink as Link } from '@/components/motion/transition-link'
import type { ComponentProps, ReactNode } from 'react'

export type ButtonVariant = 'primary' | 'inverse'
export type ButtonSize = 'md' | 'sm' | 'compact'

type CommonProps = {
  /** `primary`: ink on salt. `inverse`: salt on ink fields (§4 «на тёмном инверсия»). */
  variant?: ButtonVariant
  /**
   * `md`: 56 px (52 on mobile), 28 px sides. `sm`: 44 px, for the header.
   * `compact`: 56 px with 16 px sides, for the mobile sticky bar.
   */
  size?: ButtonSize
  /** Stretch to the container width. */
  full?: boolean
  className?: string
  children: ReactNode
}

type ButtonAsLink = CommonProps & { href: string } & Omit<ComponentProps<'a'>, 'href' | 'className' | 'children'>
type ButtonAsButton = CommonProps & { href?: undefined } & Omit<ComponentProps<'button'>, 'className' | 'children'>

export type ButtonProps = ButtonAsLink | ButtonAsButton

const isExternal = (href: string) => /^(https?:|tel:|mailto:)/.test(href)

const variants: Record<ButtonVariant, { base: string; layer: string }> = {
  primary: { base: 'bg-ink text-salt', layer: 'bg-ink-raised' },
  inverse: { base: 'bg-salt text-ink', layer: 'bg-sand' },
}

const sizes: Record<ButtonSize, string> = {
  md: 'h-13 px-7 md:h-14',
  sm: 'h-11 px-5',
  compact: 'h-14 px-4',
}

export function buttonClasses({
  variant = 'primary',
  size = 'md',
  full = false,
  className,
}: Pick<CommonProps, 'variant' | 'size' | 'full' | 'className'> = {}) {
  return clsx(
    'group/button relative isolate inline-flex shrink-0 items-center justify-center overflow-hidden',
    'type-ui whitespace-nowrap select-none transition-colors duration-160',
    'disabled:cursor-not-allowed disabled:bg-ink-muted disabled:text-salt',
    // Windows contrast themes drop the fill; a border keeps the button's shape.
    'forced-colors:border',
    variants[variant].base,
    sizes[size],
    full && 'w-full',
    className,
  )
}

/** The layer that rises from the bottom on hover, 480 ms (Enklawa fill, no arrow cell). */
function HoverLayer({ variant }: { variant: ButtonVariant }) {
  return (
    <span
      aria-hidden="true"
      className={clsx(
        'pointer-events-none absolute inset-0 -z-10 translate-y-full transition-transform duration-480 ease-out',
        'group-hover/button:translate-y-0 group-disabled/button:hidden',
        variants[variant].layer,
      )}
    />
  )
}

/**
 * Primary action. Renders `next/link` for internal hrefs, `<a>` for tel:/mailto:/http(s),
 * and `<button type="button">` without href. Labels are verbs, no arrows (§4).
 */
export function Button(props: ButtonProps) {
  const { variant = 'primary', size = 'md', full, className, children } = props
  const classes = buttonClasses({ variant, size, full, className })
  const content = (
    <>
      <HoverLayer variant={variant} />
      {children}
    </>
  )

  if (props.href !== undefined) {
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const { href, variant: _v, size: _s, full: _f, className: _c, children: _ch, ...rest } = props
    if (isExternal(href)) {
      return (
        <a href={href} className={classes} {...rest}>
          {content}
        </a>
      )
    }
    return (
      <Link href={href} className={classes} {...rest}>
        {content}
      </Link>
    )
  }

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const { variant: _v, size: _s, full: _f, className: _c, children: _ch, type = 'button', ...rest } = props
  return (
    <button type={type} className={classes} {...rest}>
      {content}
    </button>
  )
}
