import { DealView, dealMetadata } from '@/views/deal'

export const metadata = dealMetadata('ru')

export default function Page() {
  return <DealView locale="ru" />
}
