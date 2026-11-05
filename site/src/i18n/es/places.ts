// Names of the coast drawings and the Phuket districts on them (src/components/coast). Accessible
// names only: the SVG <title> and aria-label of a drawing that is not decorative.

import type { PlacesDict } from '../ru/places'

export const places = {
  /** Default accessible name of each coast drawing, by coast id. */
  coasts: {
    'phuket-island': 'Isla de Phuket',
    'phuket-west': 'Costa oeste de Phuket',
    'bali-bukit': 'Península de Bukit, Bali',
    'dubai-jumeirah': 'Costa de Dubái: Dubai Marina, Palm Jumeirah y Jumeirah',
    sihanoukville: 'Costa de Sihanoukville, Camboya',
  },
  /** District segments on the island drawing, by district id (north to south). */
  districts: {
    layan: 'Layan',
    'bang-tao': 'Bang Tao',
    kamala: 'Kamala',
    'karon-kata': 'Karon y Kata',
    'nai-harn-rawai': 'Nai Harn y Rawai',
    chalong: 'Chalong',
  },
  /** Name of a drawing with one district highlighted: «Остров Пхукет, район Банг Тао». */
  coastWithDistrict: '{coast}, zona de {district}',
  /** OpenStreetMap attribution required by the ODbL wherever a coast is shown. */
  osmAttribution: '© colaboradores de OpenStreetMap',
} satisfies PlacesDict
