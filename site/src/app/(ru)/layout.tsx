import type { ReactNode } from 'react'
import { SiteShell, shellMetadata, shellViewport } from '@/components/layout/site-shell'
import '../globals.css'

// Root layout of the Russian site: every page at its old URL, no prefix, <html lang="ru">.
// English and Spanish have their own root layout in app/[lang]; both render the same shell.

export const metadata = shellMetadata('ru')
export const viewport = shellViewport

export default function RussianLayout({ children }: { children: ReactNode }) {
  return <SiteShell locale="ru">{children}</SiteShell>
}
