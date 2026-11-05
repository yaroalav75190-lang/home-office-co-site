import { ConsentView, consentMetadata } from '@/views/consent'

export const metadata = consentMetadata('ru')

export default function Page() {
  return <ConsentView locale="ru" />
}
