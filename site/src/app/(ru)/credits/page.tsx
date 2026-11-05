import { CreditsView, creditsMetadata } from '@/views/credits'

export const metadata = creditsMetadata('ru')

export default function Page() {
  return <CreditsView locale="ru" />
}
