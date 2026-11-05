// Home page facts: link targets and the order of rows (copy-home v1.0, 2 Nov 2026). Words live in
// the dictionary, `home` in src/i18n/<locale>/home.ts; lists there keyed by id follow the ids here.
// Hrefs are Russian paths: links localize them for en/es.

import type { DistrictId } from '@/components/coast'
import type { DestinationId } from '@/lib/site'

export const links = {
  podbor: '/podbor',
  allDistricts: '/thailand/phuket#rajony',
  deal: '/services/deal',
} as const

/** «Четыре побережья», top to bottom (texts: `home.coasts.verdicts`, names: `common.destinations`). */
export const coastOrder: readonly DestinationId[] = ['phuket', 'bali', 'dubai', 'cambodia']

/**
 * Promo review samples (DEMO_DECISIONS «Люди и отзывы») in display order, by the district of the
 * purchase drawn on the island next to the first one. Texts: `home.review.samples[district]`.
 */
export const reviewSampleDistricts = ['bang-tao', 'nai-harn-rawai', 'karon-kata'] as const satisfies readonly DistrictId[]

export type ReviewSampleDistrict = (typeof reviewSampleDistricts)[number]
