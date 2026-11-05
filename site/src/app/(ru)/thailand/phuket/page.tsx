import { PhuketView, phuketMetadata } from '@/views/phuket'

export const metadata = phuketMetadata('ru')

export default function Page() {
  return <PhuketView locale="ru" />
}
