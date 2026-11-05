import { Locator } from '@/components/coast'
import { Figure } from '@/components/ui/figure'
import { TextLink } from '@/components/ui/text-link'
import { getDictionary } from '@/i18n'
import type { Locale } from '@/i18n/config'
import { links } from './content'

/**
 * «От звонка до ключей» (art-direction §6 «Главная» 6; taste-skill «Photographs down a diagonal»).
 *
 * Desktop: three photographs fall down a diagonal — Ката 4:5 (columns 1–4), Най Харн 1:1 (6–8,
 * 220 px lower), Камала 3:2 (8–12, 180 px under the square). The text fills the two triangles
 * the diagonal leaves: heading and Lead top right (9–12, level with the first photo), the five
 * stages bottom left (1–6, under the first photo). One `<ol>`, no visible numbers: the order is
 * carried by the first words, set UI 500.
 * The third photo is a condominium with a shared pool (`condo`, «Пример формата»): the deal ends
 * with keys to a property, and the district scene two screens up already shows every district's
 * coast (copy-home §6, designer note).
 *
 * Mobile: heading, Ката full width, Най Харн 62 % flush right, the stages, Камала 78 % flush left.
 */
export function HomeProcess({ locale }: { locale: Locale }) {
  const processSection = getDictionary(locale).home.process
  const { captions } = processSection
  return (
    <section aria-labelledby="home-process" className="grid-site pt-section">
      {/* Heading: top right on desktop, first on phones. */}
      <div className="col-span-full lg:col-span-4 lg:col-start-9 lg:row-start-1">
        <h2 id="home-process" data-reveal="lines" className="type-d2">
          {processSection.title}
        </h2>
        <p data-reveal="fade" className="type-lead mt-6 max-w-[32ch]">
          {processSection.lead}
        </p>
      </div>

      {/* Left triangle: first photo, then the stages. `contents` below 1024 so phones can reorder. */}
      <div className="contents lg:col-span-6 lg:col-start-1 lg:row-start-1 lg:grid lg:grid-cols-subgrid lg:content-start">
        <div data-reveal="clip" className="order-1 col-span-full mt-heading lg:order-none lg:col-span-4 lg:mt-0">
          <Figure
            locale={locale}
            photo="kata"
            ratio="4x5"
            sizes="(min-width: 64rem) 33vw, 100vw"
            caption={captions.kata}
            locator={<Locator place="kata" />}
          />
        </div>

        <div className="order-3 col-span-full mt-16 md:col-span-6 lg:order-none lg:col-span-6 lg:mt-24">
          <ol data-reveal="items" className="flex max-w-[60ch] flex-col gap-10">
            {processSection.steps.map((step) => (
              <li key={step.when}>
                <p className="type-ui">{step.when}</p>
                <p className="type-body mt-2">{step.text}</p>
              </li>
            ))}
          </ol>
          <p className="type-ui mt-12">
            <TextLink href={links.deal}>{processSection.link}</TextLink>
          </p>
        </div>
      </div>

      {/* Right side of the diagonal: the square and the landscape. */}
      <div className="contents lg:col-span-7 lg:col-start-6 lg:row-start-1 lg:grid lg:grid-cols-subgrid lg:content-start">
        <div
          data-reveal="clip"
          className="order-2 col-span-full mt-12 ml-auto w-[62%] md:w-1/2 lg:order-none lg:col-span-3 lg:col-start-1 lg:mt-[220px] lg:ml-0 lg:w-auto"
        >
          <Figure
            locale={locale}
            photo="naiharn"
            ratio="1x1"
            sizes="(min-width: 64rem) 25vw, 62vw"
            caption={captions.naiharn}
            locator={<Locator place="nai-harn" />}
          />
        </div>
        <div
          data-reveal="clip"
          className="order-4 col-span-full mt-16 w-[78%] md:w-2/3 lg:order-none lg:col-span-5 lg:col-start-3 lg:mt-[180px] lg:w-auto"
        >
          <Figure
            locale={locale}
            photo="condo"
            ratio="3x2"
            sizes="(min-width: 64rem) 42vw, 78vw"
            caption={captions.condo}
          />
        </div>
      </div>
    </section>
  )
}
