import { type LangParams, localeFromParams } from '@/i18n/route'
import { PrivacyView, privacyMetadata } from '@/views/privacy'

// /en and /es only (generateStaticParams of the layout); any other prefix is a 404.
export const dynamicParams = false

export async function generateMetadata({ params }: { params: LangParams }) {
  return privacyMetadata(await localeFromParams(params))
}

export default async function Page({ params }: { params: LangParams }) {
  return <PrivacyView locale={await localeFromParams(params)} />
}
