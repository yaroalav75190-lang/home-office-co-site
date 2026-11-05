import { localeFromParams } from '@/i18n/route'
import { DistrictView, districtMetadata, districtStaticParams } from '@/views/district'

type Params = Promise<{ lang: string; district: string }>

// Only districts with real content get a page, in /en and /es only; everything else is a 404.
export const dynamicParams = false

export function generateStaticParams() {
  return districtStaticParams()
}

export async function generateMetadata({ params }: { params: Params }) {
  return districtMetadata(await localeFromParams(params), (await params).district)
}

export default async function Page({ params }: { params: Params }) {
  return <DistrictView locale={await localeFromParams(params)} slug={(await params).district} />
}
