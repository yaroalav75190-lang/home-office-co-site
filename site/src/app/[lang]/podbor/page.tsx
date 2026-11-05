import { type LangParams, localeFromParams } from '@/i18n/route'
import { PodborView, podborMetadata } from '@/views/podbor'

type SearchParams = Promise<Record<string, string | string[] | undefined>>

// /en and /es only; any other prefix is a 404.
export const dynamicParams = false

export async function generateMetadata({ params }: { params: LangParams }) {
  return podborMetadata(await localeFromParams(params))
}

export default async function Page({ params, searchParams }: { params: LangParams; searchParams: SearchParams }) {
  return <PodborView locale={await localeFromParams(params)} searchParams={await searchParams} />
}
