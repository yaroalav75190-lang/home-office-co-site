// Names of the coast drawings and the Phuket districts on them (src/components/coast). Accessible
// names only: the SVG <title> and aria-label of a drawing that is not decorative.

import type { PlacesDict } from '../ru/places'

export const places = {
  /** Default accessible name of each coast drawing, by coast id. */
  coasts: {
    'phuket-island': 'Phuket island',
    'phuket-west': 'West coast of Phuket',
    'bali-bukit': 'Bukit Peninsula, Bali',
    'dubai-jumeirah': 'Dubai coast: Dubai Marina, Palm Jumeirah and Jumeirah',
    sihanoukville: 'Sihanoukville coast, Cambodia',
  },
  /** District segments on the island drawing, by district id (north to south). */
  districts: {
    layan: 'Layan',
    'bang-tao': 'Bang Tao',
    kamala: 'Kamala',
    'karon-kata': 'Kata and Karon',
    'nai-harn-rawai': 'Rawai and Nai Harn',
    chalong: 'Chalong',
  },
  /** Name of a drawing with one district highlighted: «Остров Пхукет, район Банг Тао». */
  coastWithDistrict: '{coast}, {district} district',
  /** OpenStreetMap attribution required by the ODbL wherever a coast is shown. */
  osmAttribution: '© OpenStreetMap contributors',
} satisfies PlacesDict
