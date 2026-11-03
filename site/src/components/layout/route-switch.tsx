'use client'

import { usePathname } from 'next/navigation'
import type { ReactNode } from 'react'
import { isQuizPath } from './nav-utils'

/**
 * Picks the chrome variant by route: `quiz` on /podbor, `children` elsewhere.
 * Both are rendered on the server (they can be Server Components); only one reaches the DOM.
 */
export function RouteSwitch({ quiz, children }: { quiz: ReactNode; children: ReactNode }) {
  const pathname = usePathname()
  return <>{isQuizPath(pathname) ? quiz : children}</>
}
