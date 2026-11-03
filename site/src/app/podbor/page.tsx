import type { Metadata } from 'next'
import Link from 'next/link'
import { Coast, Locator } from '@/components/coast'
import { Quiz, type QuizArt } from '@/components/sections/forms/quiz/quiz'
import type { QuizPrefill } from '@/components/sections/forms/quiz/quiz-store'
import { absoluteUrl } from '@/components/sections/shared/site-url'
import { withStubs } from '@/components/sections/shared/stub'
import { MessengerLink } from '@/components/ui/messenger-link'
import { TextLink } from '@/components/ui/text-link'
import { type DirectionId, quizDirections, quizDistricts } from '@/lib/lead'
import { JsonLd } from '@/lib/seo/json-ld'
import { openGraphFor } from '@/lib/seo/og'
import type { DistrictId } from '@/components/coast'

const PATH = '/podbor'
const TITLE = 'Подбор недвижимости: Пхукет, Паттайя, Бали, Дубай'
const DESCRIPTION =
  'Четыре вопроса: страна, цель, бюджет и срок. Брокер ответит в выбранный мессенджер за 15 минут и пришлёт от 3 до 5 проектов с ценой и минусами.'

export const metadata: Metadata = {
  // 49 characters; the brand suffix would pass 60 (seo-brief §4).
  title: { absolute: TITLE },
  description: DESCRIPTION,
  // ?country= and ?district= only prefill the quiz: the canonical URL has no parameters (seo-brief §6.1).
  alternates: { canonical: PATH },
  openGraph: openGraphFor({ path: PATH, title: TITLE, description: DESCRIPTION, photo: 'hero' }),
}

// No BreadcrumbList: the quiz page shows no crumbs, and markup must match what is visible.
const jsonLd = {
  '@context': 'https://schema.org',
  '@type': 'WebPage',
  name: TITLE,
  description: DESCRIPTION,
  url: absoluteUrl(PATH),
}

const below = [
  {
    title: 'Как работает подбор',
    text: 'Вы отвечаете на 4 вопроса и оставляете контакт. Брокер смотрит ответы, задаёт один уточняющий вопрос и вручную собирает подборку. У каждого проекта описаны минусы.',
  },
  {
    title: 'Что будет после заявки',
    text: 'Брокер напишет в выбранный канал за 15 минут. Брокеры на связи с 9:00 до 21:00 по Пхукету, это с 5:00 до 17:00 по Москве. Если напишете ночью, заявку увидят утром и ответят до 9:15 по Пхукету. Подборка по закрытой ссылке придёт в течение 24 часов.',
  },
  {
    title: 'Почему на сайте нет каталога',
    text: 'Актуальные объекты живут в чатах с застройщиками. Цены и свободные квартиры меняются быстрее, чем обновлялся бы каталог. Брокер отбирает проекты под задачу и объясняет, почему остальные не подошли.',
  },
]

function first(value: string | string[] | undefined): string | undefined {
  return Array.isArray(value) ? value[0] : value
}

/** ?country=phuket&district=bang-tao → a known direction (not «Пока выбираю») and a Phuket district. */
function readPrefill(params: Record<string, string | string[] | undefined>): QuizPrefill {
  const country = first(params.country)
  const direction = quizDirections.find((d) => d.id === country && d.id !== 'undecided')?.id as DirectionId | undefined
  const districtParam = first(params.district)
  const district = direction === 'phuket' ? quizDistricts.find((d) => d.id === districtParam)?.id : undefined
  return { direction, district }
}

const coastClass = 'h-full w-auto'

export default async function PodborPage({
  searchParams,
}: {
  searchParams: Promise<Record<string, string | string[] | undefined>>
}) {
  const prefill = readPrefill(await searchParams)

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

      <section aria-label="Подбор недвижимости" className="grid-site pt-[calc(var(--header-h)+1.5rem)] pb-section lg:pt-[calc(var(--header-h)+3rem)]">
        <Quiz prefill={prefill} art={art} />
        <noscript>
          <div className="col-span-full mt-8 flex flex-wrap gap-2 lg:col-span-7">
            <MessengerLink channel="telegram" />
            <MessengerLink channel="whatsapp" />
            <MessengerLink channel="phone" />
          </div>
        </noscript>
      </section>

      {/* Under the quiz: quiet variant, h2 D3 and Body (copy-podbor «Под квизом»). */}
      <section aria-label="О подборе" className="grid-site pb-section">
        <div className="col-span-full grid gap-12 md:grid-cols-2 lg:col-span-7 lg:gap-x-[var(--grid-gutter)] lg:gap-y-16">
          {below.map((block) => (
            <div key={block.title}>
              <h2 className="type-d3">{block.title}</h2>
              <p className="type-body nums mt-6 max-w-[48ch]">
                {withStubs(block.text)}
              </p>
            </div>
          ))}
          <div>
            <h2 className="type-d3">Конфиденциальность</h2>
            <p className="type-body mt-6 max-w-[48ch]">
              Контакт используем только для ответа по заявке. Как храним данные, написано в{' '}
              <Link href="/privacy" className="link-underline">
                политике конфиденциальности
              </Link>{' '}
              и в{' '}
              <Link href="/consent" className="link-underline">
                согласии на обработку данных
              </Link>
              .
            </p>
          </div>
        </div>
        <p className="type-ui col-span-full mt-16">
          <TextLink href="/services/deal">Сопровождение сделки</TextLink>
        </p>
      </section>
    </>
  )
}
