import type { ReactNode } from 'react'
import { withStubs } from '@/components/sections/shared/stub'

// Typography for copy strings (copy-global: «неразрывные пробелы расставляет фронтенд»):
// a no-break space after short prepositions and conjunctions, and between a number and its unit
// or «%». Applied twice so chains like «и в Банг Тао» are bound too.
const SHORT_WORDS = 'а|в|во|и|к|ко|о|об|от|до|на|не|ни|но|по|с|со|у|за|из|для|без|при|про|над|под'
const AFTER_SHORT = new RegExp(`(^|[\\s«(\\u00A0])(${SHORT_WORDS})\\s+`, 'gi')
const NUMBER_UNIT = /(\d)\s+(%|лет|года?|час[а-я]*|месяц[а-я]*|минут[а-я]*|км|тыс\.|млн)/g
// Two-word place names never split across lines.
const PLACE_NAMES = /(Банг|Най|Ката|Лаем) (Тао|Харн|Ной|Сон)/g

export function typo(text: string): string {
  return text
    .replace(AFTER_SHORT, '$1$2 ')
    .replace(AFTER_SHORT, '$1$2 ')
    .replace(NUMBER_UNIT, '$1 $2')
    .replace(PLACE_NAMES, '$1 $2')
}

/**
 * A copy string as it should render in running text: typography applied, every «[заглушка: …]»
 * turned into a quiet <Stub> (Small, ink-muted). Headings use `splitStubs` + `<StubNote>` instead.
 */
export function Rich({ text }: { text: string }): ReactNode {
  return withStubs(typo(text))
}
