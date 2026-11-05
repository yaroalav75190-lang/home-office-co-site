import { ContactsView, contactsMetadata } from '@/views/contacts'

export const metadata = contactsMetadata('ru')

export default function Page() {
  return <ContactsView locale="ru" />
}
