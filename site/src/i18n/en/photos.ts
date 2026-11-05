// Photo alt texts and captions, by photo key (files, sizes and credits stay in src/lib/photos.ts).
// alt: what is actually in the frame. caption: under the photo, «Место, побережье»; a caption names
// a place only when the source confirms it; format photos say «Пример формата: …».

import type { PhotosDict, PhotoCreditsDict } from '../ru/photos'

export const photos = {
  hero: {
    alt: 'Aerial view of a long Phuket beach: an arc of white sand between casuarina trees and shallow turquoise water, boats at anchor, a sandbar in the distance',
    caption: 'West coast of Phuket',
  },
  phuket: {
    alt: 'Ya Nui Bay from a viewpoint: a wooded headland, a small island opposite, a small beach and a yacht at anchor',
    caption: 'Ya Nui, southwest coast of Phuket',
  },
  bangtao: {
    alt: 'Bang Tao beach by day: sun loungers and umbrellas under palms, white sand, boats on the water, a wooded headland at the north end of the bay',
    caption: 'Bang Tao, west coast of Phuket',
  },
  sunset: {
    alt: 'Sunset on Bang Tao beach: rocks in the foreground, wet sand reflecting the sky, the silhouette of a wooded headland',
    caption: 'Sunset at Bang Tao, west coast of Phuket',
  },
  kata: {
    alt: 'Kata beach at sunset, shot from the water: a longtail boat, Ko Pu island, the sun setting behind the headland',
    caption: 'Kata, west coast of Phuket',
  },
  naiharn: {
    alt: 'Nai Harn Bay from a hillside: the beach and the lake behind it, yachts in the roads, an island at the mouth of the bay, dry scrub in the foreground',
    caption: 'Nai Harn, southwest coast of Phuket',
  },
  pattaya: {
    alt: 'Aerial view of Pattaya: a long beach along the bay, high-rises by the waterfront and the city behind them',
    caption: 'Pattaya, Gulf of Thailand coast',
  },
  bali: {
    alt: 'Cliff by Uluwatu Temple in Bali: green rock faces, a path along the edge, surf and a rock in the foam below',
    caption: 'Uluwatu, Bukit Peninsula, Bali',
  },
  villa: {
    alt: 'Panoramic villa pool on a slope: the water’s edge merges with the sea, islands on the horizon, a white pavilion on the left',
    caption: 'Example format: villa with a pool',
  },
  dubai: {
    alt: 'Dubai Marina skyscrapers across the bay, seen from the beach on Palm Jumeirah, with boats on the water',
    caption: 'Dubai Marina, view from Palm Jumeirah',
  },
  cambodia: {
    alt: 'Two leaning palms on Koh Rong beach at sunset, islands on the horizon, wet sand',
    caption: 'Koh Rong, Sihanoukville coast',
  },
  kamala: {
    alt: 'A hidden beach in Kamala below wooded hills: a strip of sand, turquoise water, and across the bay the Patong hill under a rain cloud',
    caption: 'Kamala, west coast of Phuket',
  },
  banana: {
    alt: 'Banana Bay in northwest Phuket: turquoise water, a wooded headland with a single villa, granite boulders in the foreground',
    caption: 'Banana Beach, Choeng Thale, 3 km north of Bang Tao',
  },
  naiharnRocks: {
    alt: 'Nai Harn beach from above: a diagonal of sand between turquoise water and trees, rows of blue umbrellas',
    caption: 'Nai Harn, southwest coast of Phuket',
  },
  condo: {
    alt: 'Low-rise condominium with a shared pool: terraces and balconies, trees and lawn along the water',
    caption: 'Example format: condominium with a shared pool',
  },
  house: {
    alt: 'Modern single-story house with wood cladding, a pool and a lawn under trees',
    caption: 'Example format: family home',
  },
  bigBuddha: {
    alt: 'Big Buddha on Nakkerd Hill: a white statue above wooded slopes, with the coast and sea below',
    caption: 'Big Buddha on Nakkerd Hill, above Chalong and Kata',
  },
  baliVilla: {
    alt: 'Villa in Ubud: a glass pavilion under a pitched roof, loungers and umbrellas on the pool terrace, tropical greenery',
    caption: 'Example property: villa with a pool, Ubud, Bali',
  },
  dubaiHome: {
    alt: 'Dubai Marina residential towers seen from a terrace with a pool: skyscrapers above a canal with yachts',
    caption: 'Example property: apartment in Dubai Marina',
  },
  pattayaCondo: {
    alt: 'Two high-rise condominium towers by the sea in Pattaya, a green block below, islands on the horizon',
    caption: 'Example property: seaside condominiums, Pattaya',
  },
  cambodiaCondo: {
    alt: 'Aerial view of a high-rise residential complex on the shore in Sihanoukville: a tower by the beach, turquoise sea, a reclaimed peninsula',
    caption: 'Example property: seaside residential complex, Sihanoukville',
  },
} satisfies PhotosDict

/** Lines of the /credits rows that come from the photo registry. */
export const photoCredits = {
  changes: 'Cropping and color correction',
  /** Extra request of the author of the Bang Tao sunset photo. */
  sunsetNote: 'At the author’s request, his name appears in the caption under the photo',
} satisfies PhotoCreditsDict
