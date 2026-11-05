import { type LangParams, localeFromParams } from '@/i18n/route'
import { DealView, dealMetadata } from '@/views/deal'

// /en and /es only (generateStaticParams of the layout); any other prefix is a 404.
export const dynamicParams = false

export async function generateMetadata({ params }: { params: LangParams }) {
  return dealMetadata(await localeFromParams(params))
}

export default async function Page({ params }: { params: LangParams }) {
  return <DealView locale={await localeFromParams(params)} />
}
