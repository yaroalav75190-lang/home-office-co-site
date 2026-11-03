import { JsonLd } from '@/lib/seo/json-ld'
import { contacts, site } from '@/lib/site'
import { ORG_ID, SITE_ORIGIN, absoluteUrl } from '../shared/site-url'

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
 */
export function HomeJsonLd() {
  const phone = contacts.phone.placeholder ? null : contacts.phone.href.replace(/^tel:/, '')
  const email = contacts.email.placeholder ? null : contacts.email.href.replace(/^mailto:/, '')

  const organisation = {
    '@context': 'https://schema.org',
    '@type': 'RealEstateAgent',
    '@id': ORG_ID,
    name: site.name,
    alternateName: ['Home Office and Co', 'Хоум Офис энд Ко'],
    url: `${SITE_ORIGIN}/`,
    image: absoluteUrl('/photos/graded/hero-3x2.jpg'),
    description: 'Международное агентство недвижимости: Таиланд (Пхукет, Паттайя), Бали, Дубай, Камбоджа.',
    areaServed: ['Таиланд', 'Индонезия', 'Объединённые Арабские Эмираты', 'Камбоджа'],
    knowsLanguage: ['ru'],
    founder: { '@type': 'Person', name: 'Иван' },
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
    '@id': `${SITE_ORIGIN}/#website`,
    name: site.name,
    alternateName: 'Home Office and Co',
    url: `${SITE_ORIGIN}/`,
    inLanguage: 'ru',
    publisher: { '@id': ORG_ID },
  }

  return <JsonLd data={[organisation, website]} />
}
