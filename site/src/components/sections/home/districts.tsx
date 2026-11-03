import { DistrictScene, type DistrictSceneItem } from '@/components/motion/district-scene'
import type { DistrictId } from '@/components/coast'
import { districtHref, districts as hubDistricts } from '@/components/sections/phuket/districts'
import { TextLink } from '@/components/ui/text-link'
import { districtsSection } from './content'

const { where, forWhom, buy } = districtsSection.factLabels

// copy-home §4, north to south. Verdicts and the «Кому подходит» / «Что покупают» facts come from
// the hub rows (phuket/districts.ts, written from open sources, QA round 1 §3), so the home scene
// and /thailand/phuket never disagree; photos and the district page link come from there too.
// «Где» is a position on the island, kept here.
const WHERE: Record<DistrictId, string> = {
  layan: 'Северо-запад острова, к северу от Банг Тао',
  'bang-tao': 'Северо-запад острова, район вокруг Лагуны',
  kamala: 'Запад острова, между Банг Тао и Патонгом',
  'karon-kata': 'Юго-запад острова, к югу от Патонга',
  'nai-harn-rawai': 'Южная оконечность острова, у мыса Пхромтхеп',
  chalong: 'Юго-восток острова, у залива Чалонг',
}

/** The hub writes «Подходит тем, кто…», «Покупают квартиры…»; under the labels the verb goes. */
function afterLabel(fact: string, verb: string): string {
  if (!fact.startsWith(`${verb} `)) return fact
  const rest = fact.slice(verb.length + 1)
  return rest.charAt(0).toUpperCase() + rest.slice(1)
}

const districts: DistrictSceneItem[] = hubDistricts.map((d) => ({
  id: d.id,
  name: d.name,
  verdict: d.verdict,
  facts: [
    { term: where, value: WHERE[d.id] },
    { term: forWhom, value: afterLabel(d.facts[0], 'Подходит') },
    { term: buy, value: afterLabel(d.facts[1], 'Покупают') },
  ],
  photo: d.photo?.key,
  // Only a district with its own page links out; the scene labels it «{name} подробно»
  // («Банг Тао подробно», copy-home §4).
  href: d.page ? districtHref(d) : undefined,
}))

/**
 * «Где жить, а где сдавать» (art-direction §6 «Главная» 4): the signature scene is the motion
 * agent's `<DistrictScene>`; this file passes the copy. «Все районы Пхукета» closes the scene.
 * The scene section carries `section-y`; its bottom padding is dropped so the link sits close
 * under it and the next section keeps the usual single section gap.
 */
export function HomeDistricts() {
  const allDistricts = districtsSection.links[1]
  return (
    <>
      <DistrictScene
        districts={districts}
        title={districtsSection.title}
        lead={districtsSection.lead}
        mapLabel={districtsSection.islandLabel}
        className="pb-0!"
      />
      <div className="grid-site pt-16 lg:pt-20">
        <p data-reveal="fade" className="type-ui col-span-full lg:col-span-6 lg:col-start-7">
          <TextLink href={allDistricts.href}>{allDistricts.label}</TextLink>
        </p>
      </div>
    </>
  )
}
