/** The quiz has its own chrome: logo + «Закрыть», one-line footer, no sticky bar (art-direction §6). */
export function isQuizPath(pathname: string | null): boolean {
  return pathname === '/podbor' || Boolean(pathname?.startsWith('/podbor/'))
}

/** `aria-current="page"` for the link's own page, also for pages below it. */
export function currentFor(pathname: string | null, href: string): 'page' | undefined {
  if (!pathname) return undefined
  const path = href.split(/[?#]/)[0]
  if (path === '/') return pathname === '/' ? 'page' : undefined
  return pathname === path || pathname.startsWith(`${path}/`) ? 'page' : undefined
}
