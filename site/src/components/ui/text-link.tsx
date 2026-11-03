import { clsx } from 'clsx'
import { TransitionLink as Link } from '@/components/motion/transition-link'
import type { ComponentProps, ReactNode } from 'react'

type TextLinkProps = Omit<ComponentProps<'a'>, 'href'> & {
  href: string
  /**
   * `underline` (default): 1 px line at rest; on hover it leaves to the right and redraws from the left, 320 ms.
   * `reveal`: no line at rest, drawn from the left on hover; stays for aria-current="page". For navigation.
   */
  variant?: 'underline' | 'reveal'
  children: ReactNode
}

const isExternal = (href: string) => /^(https?:|tel:|mailto:)/.test(href)

/** Text link. Internal hrefs go through next/link. Wording is a verb or a place, no arrows. */
export function TextLink({ href, variant = 'underline', className, children, ...rest }: TextLinkProps) {
  const classes = clsx(variant === 'underline' ? 'link-underline' : 'link-reveal', className)
  if (isExternal(href)) {
    return (
      <a href={href} className={classes} {...rest}>
        {children}
      </a>
    )
  }
  return (
    <Link href={href} className={classes} {...rest}>
      {children}
    </Link>
  )
}
