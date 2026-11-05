import { SectionHeading } from '@/components/ui/section-heading'
import { TextLink } from '@/components/ui/text-link'
import type { Locale } from '@/i18n/config'
import type { DistrictPage, DistrictPageCopy } from './districts'
import { Rich, typo } from './text'

/**
 * «Без приукрашивания» (art-direction §6 block 4: minuses on every district page). Heading D2 with
 * the Lead on its baseline; «Почему выбирают» in columns 1–4, «О чём стоит знать» wider in 5–12,
 * because the minuses are the point of the page. Plain lists: no bullets, rules or icons.
 */
export function DistrictHonest({
  locale,
  honest,
  copy,
}: {
  locale: Locale
  /** The guide link (fact). */
  honest: DistrictPage['honest']
  copy: DistrictPageCopy['honest']
}) {
  return (
    <section aria-labelledby="honest-title" className="grid-site pt-section">
      <SectionHeading id="honest-title" title={typo(copy.title, locale)} lead={typo(copy.lead, locale)} reveal />

      <div data-reveal="fade" className="col-span-full mt-heading md:col-span-3 lg:col-span-4">
        <h3 className="type-d3 max-w-[16ch]">{typo(copy.pros.title, locale)}</h3>
        <ul role="list" className="type-body mt-8 flex max-w-[40ch] flex-col gap-5">
          {copy.pros.items.map((item) => (
            <li key={item}>
              <Rich text={item} locale={locale} />
            </li>
          ))}
        </ul>
      </div>

      <div data-reveal="fade" className="col-span-full mt-16 md:col-span-5 md:col-start-4 md:mt-heading lg:col-span-7 lg:col-start-5">
        <h3 className="type-d3 max-w-[16ch]">{typo(copy.cons.title, locale)}</h3>
        <ul role="list" className="type-lead mt-8 flex max-w-[52ch] flex-col gap-6">
          {copy.cons.items.map((item) => (
            <li key={item}>
              <Rich text={item} locale={locale} />
            </li>
          ))}
        </ul>
        <p className="type-ui mt-10">
          <TextLink href={honest.guide.href}>{copy.guide}</TextLink>
        </p>
      </div>
    </section>
  )
}
