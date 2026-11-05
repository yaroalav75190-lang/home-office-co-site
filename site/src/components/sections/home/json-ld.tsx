import { getDictionary } from '@/i18n'
import { htmlLang, type Locale, localizePath } from '@/i18n/config'
import { JsonLd } from '@/lib/seo/json-ld'
import { contacts, site } from '@/lib/site'
import { ORG_ID, absoluteUrl } from '../shared/site-url'

/**
 * Home JSON-LD (seo-brief §4.1, §6.6): the full organisation record and WebSite.
 * Rule of the brief: no fact, no field. telephone, contactPoint and email come from `contacts`
 * in @/lib/site and drop out again if a value there is flagged `placeholder`. Still waiting for
 * the client and therefore not set:
 *   logo                ← agency logo file (only the text mark exists)
 *   sameAs              ← Telegram channel, YouTube, Yandex Business
 *   founder surname     ← only «Иван» is known
 *   knowsLanguage "en"  ← is there a broker who answers in English (copy-global §13.9)
 *   address             ← not set without a legal or real address (seo-brief §6.6)
 *   image               ← dedicated OG card; the hero crop stands in
 * Words (description, countries, the brand in Cyrillic, the founder's name) come from the
 * dictionary of the page's locale; `url` is the home page in that locale. The organisation keeps
 * one `@id` for every language; each language version of the home page is its own WebSite.
 */
export function HomeJsonLd({ locale }: { locale: Locale }) {
  const { home, common } = getDictionary(locale)
  const t = home.jsonLd
  const homeUrl = absoluteUrl(localizePath(locale, '/'))
  const phone = contacts.phone.placeholder ? null : contacts.phone.href.replace(/^tel:/, '')
  const email = contacts.email.placeholder ? null : contacts.email.href.replace(/^mailto:/, '')

  const organisation = {
    '@context': 'https://schema.org',
    '@type': 'RealEstateAgent',
    '@id': ORG_ID,
    name: site.name,
    alternateName: ['Home Office and Co', ...t.alternateNames],
    url: homeUrl,
    image: absoluteUrl('/photos/graded/hero-3x2.jpg'),
    description: t.description,
    areaServed: t.areaServed,
    knowsLanguage: ['ru'],
    founder: { '@type': 'Person', name: common.founder.name },
    ...(phone
      ? {
          telephone: phone,
          contactPoint: [{ '@type': 'ContactPoint', telephone: phone, contactType: 'sales', availableLanguage: ['ru'] }],
        }
      : {}),
    ...(email ? { email } : {}),
  }

  const website = {
    '@context': 'https://schema.org',
    '@type': 'WebSite',
    '@id': `${homeUrl}#website`,
    name: site.name,
    alternateName: 'Home Office and Co',
    url: homeUrl,
    inLanguage: htmlLang[locale],
    publisher: { '@id': ORG_ID },
  }

  return <JsonLd data={[organisation, website]} />
}
