// Inline <script> that runs during HTML parsing (before first paint) on hard loads and is inert
// after hydration. Pattern from node_modules/next/dist/docs/01-app/02-guides/preventing-flash-before-hydration.md:
// `text/javascript` on the server, `text/plain` on the client, so React does not warn about
// rendering scripts and nothing runs twice on client navigations.
export function InlineScript({ html }: { html: string }) {
  return (
    <script
      type={typeof window === 'undefined' ? 'text/javascript' : 'text/plain'}
      suppressHydrationWarning
      dangerouslySetInnerHTML={{ __html: html }}
    />
  )
}
