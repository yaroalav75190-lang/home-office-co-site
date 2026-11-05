import { DistrictView, districtMetadata, districtStaticParams } from '@/views/district'

type Params = Promise<{ district: string }>

// Only districts with real content get a page; every other slug is a 404 (seo-brief §4.3).
export const dynamicParams = false

export function generateStaticParams() {
  return districtStaticParams()
}

export async function generateMetadata({ params }: { params: Params }) {
  return districtMetadata('ru', (await params).district)
}

export default async function Page({ params }: { params: Params }) {
  return <DistrictView locale="ru" slug={(await params).district} />
}
