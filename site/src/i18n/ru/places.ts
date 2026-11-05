// Names of the coast drawings and the Phuket districts on them (src/components/coast). Accessible
// names only: the SVG <title> and aria-label of a drawing that is not decorative.

import { tpl } from '../format'

export const places = {
  /** Default accessible name of each coast drawing, by coast id. */
  coasts: {
    'phuket-island': 'Остров Пхукет',
    'phuket-west': 'Западное побережье Пхукета',
    'bali-bukit': 'Полуостров Букит, Бали',
    'dubai-jumeirah': 'Побережье Дубая: Дубай Марина, Пальма Джумейра и Джумейра',
    sihanoukville: 'Побережье Сиануквиля, Камбоджа',
  },
  /** District segments on the island drawing, by district id (north to south). */
  districts: {
    layan: 'Лаян',
    'bang-tao': 'Банг Тао',
    kamala: 'Камала',
    'karon-kata': 'Карон и Ката',
    'nai-harn-rawai': 'Най Харн и Раваи',
    chalong: 'Чалонг',
  },
  /** Name of a drawing with one district highlighted: «Остров Пхукет, район Банг Тао». */
  coastWithDistrict: tpl<'coast' | 'district'>('{coast}, район {district}'),
  /** OpenStreetMap attribution required by the ODbL wherever a coast is shown. */
  osmAttribution: '© участники OpenStreetMap',
}

export type PlacesDict = typeof places
