import { type LangParams, localeFromParams } from '@/i18n/route'
import { PhuketView, phuketMetadata } from '@/views/phuket'

// /en and /es only (generateStaticParams of the layout); any other prefix is a 404.
export const dynamicParams = false

export async function generateMetadata({ params }: { params: LangParams }) {
  return phuketMetadata(await localeFromParams(params))
}

export default async function Page({ params }: { params: LangParams }) {
  return <PhuketView locale={await localeFromParams(params)} />
}
