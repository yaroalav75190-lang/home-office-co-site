import { type LangParams, localeFromParams } from '@/i18n/route'
import { HomeView, homeMetadata } from '@/views/home'

// /en and /es only (generateStaticParams of the layout); any other prefix is a 404.
export const dynamicParams = false

export async function generateMetadata({ params }: { params: LangParams }) {
  return homeMetadata(await localeFromParams(params))
}

export default async function Page({ params }: { params: LangParams }) {
  return <HomeView locale={await localeFromParams(params)} />
}
