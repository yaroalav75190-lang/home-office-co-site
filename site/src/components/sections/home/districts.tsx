import { DistrictScene, type DistrictSceneItem } from '@/components/motion/district-scene'
import { districtHref, districts as hubDistricts } from '@/components/sections/phuket/districts'
import { TextLink } from '@/components/ui/text-link'
import { getDictionary } from '@/i18n'
import type { Locale } from '@/i18n/config'
import { capitalize } from '@/i18n/format'
import { links } from './content'

// copy-home §4, north to south. Verdicts and the «Кому подходит» / «Что покупают» facts come from
// the hub rows (phuket/districts.ts, written from open sources, QA round 1 §3), so the home scene
// and /thailand/phuket never disagree; photos and the district page link come from there too.
// «Где» is a position on the island, kept in `home.districts.where`.

/** The hub writes «Подходит тем, кто…», «Покупают квартиры…»; under the labels the verb goes. */
function afterLabel(fact: string, verb: string): string {
  if (!verb || !fact.startsWith(`${verb} `)) return fact
  return capitalize(fact.slice(verb.length + 1))
}

/**
 * «Где жить, а где сдавать» (art-direction §6 «Главная» 4): the signature scene is the motion
 * agent's `<DistrictScene>`; this file passes the copy. «Все районы Пхукета» closes the scene.
 * The scene section carries `section-y`; its bottom padding is dropped so the link sits close
 * under it and the next section keeps the usual single section gap.
 */
export function HomeDistricts({ locale }: { locale: Locale }) {
  const t = getDictionary(locale)
  const districtsSection = t.home.districts
  const rows = t.districts.districts
  const { factLabels, hubVerbs, where } = districtsSection

  // Name, verdict, facts and photo caption: the hub row (see the note at the top of the file).
  const districts: DistrictSceneItem[] = hubDistricts.map((d) => ({
    id: d.id,
    name: rows[d.id].name,
    verdict: rows[d.id].verdict,
    facts: [
      { term: factLabels.where, value: where[d.id] },
      { term: factLabels.forWhom, value: afterLabel(rows[d.id].facts[0], hubVerbs.forWhom) },
      { term: factLabels.buy, value: afterLabel(rows[d.id].facts[1], hubVerbs.buy) },
    ],
    photo: d.photo?.key,
    photoCaption: d.photo ? rows[d.id].photoCaption : undefined,
    // Only a district with its own page links out; the scene labels it `home.districts.more`
    // («Банг Тао подробно», copy-home §4).
    href: d.page ? districtHref(d) : undefined,
  }))

  return (
    <>
      <DistrictScene
        locale={locale}
        districts={districts}
        title={districtsSection.title}
        lead={districtsSection.lead}
        mapLabel={districtsSection.mapLabel}
        className="pb-0!"
      />
      <div className="grid-site pt-16 lg:pt-20">
        <p data-reveal="fade" className="type-ui col-span-full lg:col-span-6 lg:col-start-7">
          <TextLink href={links.allDistricts}>{districtsSection.allLink}</TextLink>
        </p>
      </div>
    </>
  )
}
