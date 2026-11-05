import { stripLocale } from '@/i18n/config'

// Paths are compared without the locale prefix: «/en/podbor» is the quiz too, and a nav item
// written as «/contacts» is current on «/es/contacts».

/** The quiz has its own chrome: logo + «Закрыть», one-line footer, no sticky bar (art-direction §6). */
export function isQuizPath(pathname: string | null): boolean {
  const path = stripLocale(pathname).path
  return path === '/podbor' || path.startsWith('/podbor/')
}

/** `aria-current="page"` for the link's own page, also for pages below it. `href` is a Russian path. */
export function currentFor(pathname: string | null, href: string): 'page' | undefined {
  if (!pathname) return undefined
  const current = stripLocale(pathname).path
  const path = href.split(/[?#]/)[0]
  if (path === '/') return current === '/' ? 'page' : undefined
  return current === path || current.startsWith(`${path}/`) ? 'page' : undefined
}
