import { NotFoundView, notFoundMetadata } from '@/views/not-found'

// notFound() inside a Russian page. Unmatched URLs get app/global-not-found.tsx (same page).
export const metadata = notFoundMetadata('ru')

export default function NotFound() {
  return <NotFoundView locale="ru" />
}
