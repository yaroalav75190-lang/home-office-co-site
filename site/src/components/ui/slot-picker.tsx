'use client'

import { clsx } from 'clsx'
import { type ReactNode, useId, useSyncExternalStore } from 'react'
import { useLocale } from '@/i18n/client'
import { fmt } from '@/i18n/format'
import { brokerHours } from '@/lib/site'
import { brokerToday, brokerWallTimeToInstant, formatClockPadded, visitorTimeZone } from '@/lib/reply-time'
import { FieldError } from './field'

const noop = () => () => {}

export type SlotPickerProps = {
  /** Radio group name; the submitted value is the Phuket time, «11:00». */
  name: string
  /** Phuket wall times, «HH:MM». */
  slots: string[]
  /** Date of the meeting (YYYY-MM-DD, Phuket calendar) for a DST-correct conversion. Default: today. */
  date?: string
  /** Legend; default `forms.slots.legend` (copy-global §8.2: «Время на Пхукете»). */
  label?: ReactNode
  /** Default `forms.slots.hint` (copy-global §8.2: «Рядом показываем ваше время»); `null` hides it. */
  hint?: ReactNode
  error?: ReactNode
  disabledSlots?: string[]
  value?: string
  defaultValue?: string
  onChange?: (value: string) => void
  required?: boolean
  className?: string
}

/**
 * Time slots as sand tiles in two lines: «11:00 на Пхукете» / «07:00 у вас» (copy-global §8.2).
 * Same offset as Phuket: one line «11:00 на Пхукете и у вас». Zone unknown or before hydration:
 * «11:00 на Пхукете». Tiles keep a two-line height in every case, so nothing moves.
 */
export function SlotPicker({
  name,
  slots,
  date,
  label: labelProp,
  hint: hintProp,
  error,
  disabledSlots = [],
  value,
  defaultValue,
  onChange,
  required,
  className,
}: SlotPickerProps) {
  const id = useId()
  const { locale, t } = useLocale()
  const words = t.forms.slots
  const label = labelProp ?? words.legend
  const hint = hintProp === undefined ? words.hint : hintProp
  const hintId = `${id}-hint`
  const errorId = `${id}-error`
  const zone = useSyncExternalStore(noop, () => visitorTimeZone() ?? null, () => null)
  const day = date ?? brokerToday()

  return (
    <fieldset
      className={clsx('min-w-0', className)}
      aria-describedby={[hint ? hintId : '', error ? errorId : ''].filter(Boolean).join(' ') || undefined}
    >
      <legend className="type-small mb-1 text-ink-muted on-ink:text-on-ink-muted">{label}</legend>
      {hint ? (
        <p id={hintId} className="type-small mb-3 text-ink-muted on-ink:text-on-ink-muted">
          {hint}
        </p>
      ) : null}
      <div className="grid grid-cols-2 gap-2 md:grid-cols-4">
        {slots.map((slot) => {
          const instant = brokerWallTimeToInstant(day, slot)
          const local = zone ? formatClockPadded(instant, zone, locale) : null
          const phuket = formatClockPadded(instant, brokerHours.timeZone, locale)
          const same = local !== null && local === phuket
          const disabled = disabledSlots.includes(slot)
          return (
            <label
              key={slot}
              className={clsx(
                'group focus-ring-within relative flex min-h-16 cursor-pointer flex-col justify-center px-4 py-3 transition-colors duration-160',
                'bg-sand text-ink has-checked:bg-ink has-checked:text-salt',
                'on-ink:bg-ink-raised on-ink:text-salt on-ink:has-checked:bg-salt on-ink:has-checked:text-ink',
                'has-disabled:cursor-not-allowed has-disabled:opacity-50',
                // Windows contrast themes drop both fills: border for the tile and its selected state.
                'forced-colors:border forced-colors:has-checked:border-4',
              )}
            >
              <input
                type="radio"
                name={name}
                value={slot}
                className="sr-only"
                disabled={disabled}
                required={required}
                {...(value !== undefined
                  ? { checked: value === slot, onChange: () => onChange?.(slot) }
                  : { defaultChecked: defaultValue === slot, onChange: () => onChange?.(slot) })}
              />
              <span className="type-ui nums">{fmt(same ? words.phuketAndYou : words.phuket, { time: phuket })}</span>
              {local !== null && !same ? (
                <span className="type-small nums mt-0.5 text-ink-muted group-has-checked:text-on-ink-muted on-ink:text-on-ink-muted on-ink:group-has-checked:text-ink-muted">
                  {fmt(words.local, { time: local })}
                </span>
              ) : null}
            </label>
          )
        })}
      </div>
      <FieldError id={errorId}>{error}</FieldError>
    </fieldset>
  )
}
