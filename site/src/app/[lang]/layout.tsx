import type { ReactNode } from 'react'
import { SiteShell, shellMetadata, shellViewport } from '@/components/layout/site-shell'
import { layoutLocale, prefixedLocaleParams } from '@/i18n/route'
import '../globals.css'

// Root layout of the English and Spanish sites (/en/…, /es/…): <html lang="en"> / <html lang="es">.
// Generated for en and es only; any other first segment («/xx», «/xx/…») is not a page and gets
// the 404 of app/global-not-found.tsx.

type Params = Promise<{ lang: string }>

export const dynamicParams = false

export function generateStaticParams() {
  return prefixedLocaleParams()
}

export async function generateMetadata({ params }: { params: Params }) {
  return shellMetadata(layoutLocale((await params).lang))
}

export const viewport = shellViewport

export default async function LocaleLayout({ children, params }: { children: ReactNode; params: Params }) {
  return <SiteShell locale={layoutLocale((await params).lang)}>{children}</SiteShell>
}
