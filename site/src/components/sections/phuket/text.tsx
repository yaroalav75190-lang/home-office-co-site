import type { ReactNode } from 'react'
import { withStubs } from '@/components/sections/shared/stub'
import type { Locale } from '@/i18n/config'
import { typo } from '@/i18n/format'

// Typography for copy strings (copy-global: «неразрывные пробелы расставляет фронтенд»): Russian
// gets no-break spaces after short prepositions and conjunctions and between a number and its unit;
// English and Spanish only keep a number with its unit or «%». Rules: `typo` in src/i18n/format.ts.
export { typo }

/**
 * A copy string as it should render in running text: typography applied, every «[заглушка: …]»
 * turned into a quiet <Stub> (Small, ink-muted). Headings use `splitStubs` + `<StubNote>` instead.
 */
export function Rich({ text, locale }: { text: string; locale: Locale }): ReactNode {
  return withStubs(typo(text, locale))
}
