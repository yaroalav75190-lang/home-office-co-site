// Helpers for dictionary strings: placeholder templates and locale-aware typography.
// No React, no Next: safe in client and server code and in the lead API.

import type { Locale } from './config'

type UnionToIntersection<U> = (U extends unknown ? (x: U) => void : never) extends (x: infer I) => void ? I : never

/**
 * A string that must contain every `{placeholder}` in K, e.g. `Tpl<'n'>` for
 * «Сократите текст до 1000 знаков, сейчас {n}». The Russian dictionary declares it with `tpl()`;
 * an English or Spanish value without one of the placeholders is a type error.
 */
export type Tpl<K extends string> = UnionToIntersection<K extends string ? `${string}{${K}}${string}` : never>

/** Declares a template in the Russian dictionary: `tpl<'n'>('… сейчас {n}')`. Returns the string as is. */
export function tpl<K extends string>(template: Tpl<K>): Tpl<K> {
  return template
}

/** Fills `{name}` placeholders: fmt('сейчас {n}', { n: 12 }) → «сейчас 12». Unknown names stay as written. */
export function fmt(template: string, values: Record<string, string | number>): string {
  return template.replace(/\{(\w+)\}/g, (match, key: string) => (key in values ? String(values[key]) : match))
}

/** «завтра» → «Завтра». */
export function capitalize(text: string): string {
  return text.charAt(0).toUpperCase() + text.slice(1)
}

// Russian typography (copy-global: «неразрывные пробелы расставляет фронтенд»): a no-break space
// after short prepositions and conjunctions, and between a number and its unit or «%». Applied
// twice so chains like «и в Банг Тао» are bound too.
const SHORT_WORDS = 'а|в|во|и|к|ко|о|об|от|до|на|не|ни|но|по|с|со|у|за|из|для|без|при|про|над|под'
const AFTER_SHORT = new RegExp(`(^|[\\s«(\\u00A0])(${SHORT_WORDS})\\s+`, 'gi')
const NUMBER_UNIT = /(\d)\s+(%|лет|года?|час[а-я]*|месяц[а-я]*|минут[а-я]*|км|тыс\.|млн)/g
// Two-word place names never split across lines.
const PLACE_NAMES = /(Банг|Най|Ката|Лаем) (Тао|Харн|Ной|Сон)/g

// English and Spanish: no preposition rules, only a number kept with its unit or «%».
const NUMBER_UNIT_EN = /(\d)\s+(%|km|m²|years?|months?|hours?|minutes?|min|h)\b/g
const NUMBER_UNIT_ES = /(\d)\s+(%|km|m²|años?|meses|mes|horas?|minutos?|min|h)\b/g
const PERCENT = /(\d)\s+%/g

/**
 * Typography for a copy string in running text. Russian gets its full rules; English and Spanish
 * only a no-break space between a number and its unit or «%».
 */
export function typo(text: string, locale: Locale = 'ru'): string {
  if (locale === 'ru') {
    return text
      .replace(AFTER_SHORT, '$1$2 ')
      .replace(AFTER_SHORT, '$1$2 ')
      .replace(NUMBER_UNIT, '$1 $2')
      .replace(PLACE_NAMES, '$1 $2')
  }
  const units = locale === 'es' ? NUMBER_UNIT_ES : NUMBER_UNIT_EN
  return text.replace(units, '$1 $2').replace(PERCENT, '$1 %')
}
