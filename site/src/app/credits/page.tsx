import type { Metadata } from 'next'
import { OSM_ATTRIBUTION, OSM_DATA_DATE, OSM_LICENSE_URL } from '@/components/coast'
import { TextLink } from '@/components/ui/text-link'
import { credits } from '@/lib/photos'

// Attribution page linked from the footer («Авторы фото»). Rows come from `credits` in
// `@/lib/photos` (Unsplash picks checked 3 Nov 2026, Commons licenses 2 Nov 2026); coastline data
// from the coast module.
// No copy doc covers this page: the wording is plain and factual. Service page, so noindex.

export const metadata: Metadata = {
  title: 'Авторы фото и данных карт',
  description: 'Авторы и лицензии фотографий и картографических данных на сайте Home Office & Co.',
  robots: { index: false, follow: true },
}

const osmDate = OSM_DATA_DATE.split('-').reverse().join('.')

const software = [
  { name: 'Шрифты Noto Serif Display и Onest', license: 'SIL Open Font License 1.1' },
  { name: 'Next.js и React', license: 'MIT' },
  { name: 'GSAP', license: 'Standard «No Charge» License, GreenSock' },
  { name: 'Lenis', license: 'MIT, darkroom.engineering' },
  { name: 'Satūs: плавный скролл и JSON-LD', license: 'MIT, darkroom.engineering' },
  { name: 'Enklawa Villas и Isle Thorne Collective: приёмы раскладки и переходов', license: 'MIT' },
  { name: 'ARVEN: приёмы типографики и формы записи, переписаны на React', license: 'Apache License 2.0' },
]

export default function CreditsPage() {
  return (
    <>
      <section aria-labelledby="credits-title" className="grid-site pt-[calc(var(--header-h)+3rem)] lg:pt-[calc(var(--header-h)+5rem)]">
        <h1 id="credits-title" className="type-d2 col-span-full lg:col-span-8">
          Авторы фото и данных карт
        </h1>
        <p className="type-lead col-span-full mt-8 max-w-[48ch] lg:col-span-6">
          Фотографии взяты с Unsplash, три снимка Банг Тао — с Wikimedia Commons. Мы кадрируем их и меняем цвет,
          авторы и лицензии указаны ниже.
        </p>
      </section>

      <section aria-labelledby="credits-photos" className="grid-site pt-section">
        <h2 id="credits-photos" className="type-d3 col-span-full">
          Фотографии
        </h2>
        <ul role="list" className="col-span-full mt-12 grid grid-cols-subgrid gap-y-10">
          {credits.map((c) => (
            <li key={c.key} className="col-span-full grid grid-cols-subgrid gap-y-2">
              <p className="type-ui col-span-full font-medium md:col-span-4">{c.caption}</p>
              <div className="type-small col-span-full md:col-span-4">
                <p>Автор: {c.author}</p>
                <p className="mt-1">
                  Лицензия:{' '}
                  {c.licenseUrl ? (
                    <TextLink href={c.licenseUrl} target="_blank" rel="noopener noreferrer">
                      {c.license}
                    </TextLink>
                  ) : (
                    'общественное достояние'
                  )}
                </p>
              </div>
              <div className="type-small col-span-full text-ink-muted md:col-span-8 md:col-start-5 lg:col-span-4 lg:col-start-9">
                <p>
                  <TextLink href={c.sourceUrl} target="_blank" rel="noopener noreferrer" className="text-ink">
                    {c.sourceUrl.includes('unsplash.com') ? 'Страница фото на Unsplash' : 'Страница файла на Commons'}
                  </TextLink>
                </p>
                <p className="mt-1">Изменения: {c.changes.toLowerCase()}</p>
                {c.shareAlike ? <p className="mt-1">Наши версии кадра публикуются под той же лицензией</p> : null}
                {c.note ? <p className="mt-1">{c.note}</p> : null}
              </div>
            </li>
          ))}
        </ul>
      </section>

      <section aria-labelledby="credits-maps" className="grid-site pt-section">
        <h2 id="credits-maps" className="type-d3 col-span-full">
          Карты
        </h2>
        <p className="type-body col-span-full mt-8 max-w-[60ch] lg:col-span-8">
          Береговая линия на картах и в подписях к фото: {OSM_ATTRIBUTION}, лицензия{' '}
          <TextLink href={OSM_LICENSE_URL} target="_blank" rel="noopener noreferrer">
            Open Database License 1.0
          </TextLink>
          , данные на {osmDate}, упрощено. Наши контуры, построенные из этих данных, распространяются под той же
          лицензией.
        </p>
      </section>

      <section aria-labelledby="credits-code" className="grid-site py-section">
        <h2 id="credits-code" className="type-d3 col-span-full">
          Шрифты и код
        </h2>
        <ul role="list" className="col-span-full mt-8 flex max-w-[60ch] flex-col gap-3 lg:col-span-8">
          {software.map((s) => (
            <li key={s.name} className="type-body">
              {s.name} <span className="text-ink-muted">— {s.license}</span>
            </li>
          ))}
        </ul>
      </section>
    </>
  )
}
