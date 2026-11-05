import { PodborView, podborMetadata } from '@/views/podbor'

type SearchParams = Promise<Record<string, string | string[] | undefined>>

export const metadata = podborMetadata('ru')

export default async function Page({ searchParams }: { searchParams: SearchParams }) {
  return <PodborView locale="ru" searchParams={await searchParams} />
}
