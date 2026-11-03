'use client'

// Tiny module store between <TransitionLink> (anywhere, also inside server-rendered pages) and the
// single <TransitionProvider> in the layout. No React context: a link rendered in a portal or
// before the provider mounts simply falls back to a normal Next.js navigation.
import { isCurtainExcluded } from './curtain-routes'
import { prefersReducedMotion } from './tokens'

export type TransitionRequest = { href: string; replace?: boolean }
type Runner = (req: TransitionRequest) => void

let runner: Runner | null = null
let busy = false

export function registerTransitionRunner(fn: Runner): () => void {
  runner = fn
  return () => {
    if (runner === fn) runner = null
  }
}

let enterWaiters: (() => void)[] = []

export function setTransitionBusy(value: boolean) {
  busy = value
  if (!value) releaseEnter()
}

export function isTransitionBusy() {
  return busy
}

/**
 * Resolves when the curtain starts to lift (immediately when no transition runs). MotionRoot
 * waits for it so the first-screen reveals of the new page play in view, not under the curtain.
 */
export function waitForEnter(): Promise<void> {
  if (!busy) return Promise.resolve()
  return new Promise((resolve) => enterWaiters.push(resolve))
}

export function releaseEnter() {
  const waiting = enterWaiters
  enterWaiters = []
  waiting.forEach((fn) => fn())
}

/**
 * Called from Link's `onNavigate` (client-side navigations only: no modified clicks, no external
 * URLs, no downloads). Returns true when the curtain takes over the navigation, so the caller
 * prevents Next.js from navigating right away.
 */
export function requestTransition(req: TransitionRequest): boolean {
  if (busy) return true // one transition at a time; a second click during the curtain is ignored
  if (!runner || prefersReducedMotion()) return false
  let url: URL
  try {
    url = new URL(req.href, window.location.href)
  } catch {
    return false
  }
  if (url.origin !== window.location.origin) return false
  const from = window.location.pathname
  // Same page (anchors, query-only changes) and the quiz in either direction: no curtain.
  if (url.pathname === from) return false
  if (isCurtainExcluded(url.pathname) || isCurtainExcluded(from)) return false
  runner({ href: url.pathname + url.search + url.hash, replace: req.replace })
  return true
}
