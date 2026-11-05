import type { Metadata } from 'next'
import Link from 'next/link'
import { Coast, Locator } from '@/components/coast'
import type { DistrictId } from '@/components/coast'
import { Quiz, type QuizArt, type QuizPhotoText } from '@/components/sections/forms/quiz/quiz'
import type { QuizPrefill } from '@/components/sections/forms/quiz/quiz-store'
import { absoluteUrl } from '@/components/sections/shared/site-url'
import { withStubs } from '@/components/sections/shared/stub'
import { MessengerLink } from '@/components/ui/messenger-link'
import { TextLink } from '@/components/ui/text-link'
import { getDictionary } from '@/i18n'
import { type Locale, htmlLang, localizePath } from '@/i18n/config'
import { rich } from '@/i18n/rich'
import { DIRECTION_IDS, type DirectionId, QUIZ_DISTRICT_IDS } from '@/lib/lead'
import type { PhotoKey } from '@/lib/photos'
import { JsonLd } from '@/lib/seo/json-ld'
import { pageMetadata } from '@/lib/seo/page-meta'

const PATH = '/podbor'

export function podborMetadata(locale: Locale): Metadata {
  // 49 characters; the brand suffix would pass 60 (seo-brief §4).
  // ?country= and ?district= only prefill the quiz: the canonical URL has no parameters (seo-brief §6.1).
  return pageMetadata({ locale, path: PATH, ...getDictionary(locale).meta.podbor, photo: 'hero' })
}

function first(value: string | string[] | undefined): string | undefined {
  return Array.isArray(value) ? value[0] : value
}

/** ?country=phuket&district=bang-tao → a known direction (not «Пока выбираю») and a Phuket district. */
function readPrefill(params: Record<string, string | string[] | undefined>): QuizPrefill {
  const country = first(params.country)
  const direction = DIRECTION_IDS.find((id) => id === country && id !== 'undecided') as DirectionId | undefined
  const districtParam = first(params.district)
  const district = direction === 'phuket' ? QUIZ_DISTRICT_IDS.find((id) => id === districtParam) : undefined
  return { direction, district }
}

const coastClass = 'h-full w-auto'

/** Photos the quiz column can show (one per direction, `hero` before a choice). */
const QUIZ_PHOTOS: PhotoKey[] = ['hero', 'phuket', 'pattaya', 'bali', 'dubai', 'cambodia']

export function PodborView({
  locale,
  searchParams,
}: {
  locale: Locale
  searchParams: Record<string, string | string[] | undefined>
}) {
  const t = getDictionary(locale)
  const copy = t.podbor
  const meta = t.meta.podbor
  const prefill = readPrefill(searchParams)

  // No BreadcrumbList: the quiz page shows no crumbs, and markup must match what is visible.
  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'WebPage',
    name: meta.title,
    description: meta.description,
    url: absoluteUrl(localizePath(locale, PATH)),
    inLanguage: htmlLang[locale],
  }

  // Alt texts and captions of the column photos: the quiz is a Client Component without the dictionary.
  const photos: QuizPhotoText = Object.fromEntries(QUIZ_PHOTOS.map((key) => [key, t.photos[key]]))

  // Coast drawings and locators are rendered here so their map data stays on the server.
  const art: QuizArt = {
    none: { coast: <Coast id="phuket-west" lod="mid" decorative className={coastClass} />, locator: null },
    undecided: { coast: <Coast id="phuket-west" lod="mid" decorative className={coastClass} />, locator: null },
    phuket: {
      coast: prefill.district ? (
        <Coast id="phuket-island" lod="mid" highlight={prefill.district as DistrictId} decorative className={coastClass} />
      ) : (
        <Coast id="phuket-west" lod="mid" decorative className={coastClass} />
      ),
      locator: <Locator place="rawai" />,
    },
    pattaya: { coast: null, locator: null },
    bali: { coast: <Coast id="bali-bukit" lod="mid" decorative className={coastClass} />, locator: null },
    dubai: { coast: <Coast id="dubai-jumeirah" lod="mid" decorative className={coastClass} />, locator: null },
    cambodia: { coast: <Coast id="sihanoukville" lod="mid" decorative className={coastClass} />, locator: null },
  }

  return (
    <>
      <JsonLd data={jsonLd} />

      <section aria-label={copy.sectionLabel} className="grid-site pt-[calc(var(--header-h)+1.5rem)] pb-section lg:pt-[calc(var(--header-h)+3rem)]">
        <Quiz prefill={prefill} art={art} t={copy.quiz} photos={photos} />
        <noscript>
          <div className="col-span-full mt-8 flex flex-wrap gap-2 lg:col-span-7">
            <MessengerLink channel="telegram" />
            <MessengerLink channel="whatsapp" />
            <MessengerLink channel="phone" />
          </div>
        </noscript>
      </section>

      {/* Under the quiz: quiet variant, h2 D3 and Body (copy-podbor «Под квизом»). */}
      <section aria-label={copy.aboutLabel} className="grid-site pb-section">
        <div className="col-span-full grid gap-12 md:grid-cols-2 lg:col-span-7 lg:gap-x-[var(--grid-gutter)] lg:gap-y-16">
          {copy.below.map((block) => (
            <div key={block.title}>
              <h2 className="type-d3">{block.title}</h2>
              <p className="type-body nums mt-6 max-w-[48ch]">
                {withStubs(block.text)}
              </p>
            </div>
          ))}
          <div>
            <h2 className="type-d3">{copy.privacy.title}</h2>
            <p className="type-body mt-6 max-w-[48ch]">
              {rich(copy.privacy.text, {
                privacy: (
                  <Link href={localizePath(locale, '/privacy')} className="link-underline">
                    {copy.privacy.privacyLink}
                  </Link>
                ),
                consent: (
                  <Link href={localizePath(locale, '/consent')} className="link-underline">
                    {copy.privacy.consentLink}
                  </Link>
                ),
              })}
            </p>
          </div>
        </div>
        <p className="type-ui col-span-full mt-16">
          <TextLink href="/services/deal">{copy.dealLink}</TextLink>
        </p>
      </section>
    </>
  )
}
