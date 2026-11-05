import { PrivacyView, privacyMetadata } from '@/views/privacy'

export const metadata = privacyMetadata('ru')

export default function Page() {
  return <PrivacyView locale="ru" />
}
