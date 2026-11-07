// SITE_NOINDEX=1 closes the whole site to search engines: a preview for the client on Vercel
// (docs/DEMO_DECISIONS.md, «Показ на Vercel»). Then every response carries `X-Robots-Tag: noindex,
// nofollow` (next.config.ts), every page `<meta name="robots" content="noindex, nofollow">`
// (site-shell.tsx) and robots.txt disallows everything (app/robots.ts). Unset on the real launch.
// Server only: read at build and on the server, never in a client component.

export const NOINDEX = process.env.SITE_NOINDEX === '1'
