import { clsx } from 'clsx'
import type { ComponentProps, ReactNode } from 'react'

export type ChoiceTileProps = Omit<ComponentProps<'input'>, 'type' | 'className'> & {
  label: ReactNode
  /** Small explanation under the label. */
  description?: ReactNode
  /** `radio` for quiz steps and channel choice, `checkbox` for multi-select. */
  type?: 'radio' | 'checkbox'
  className?: string
}

/**
 * Quiz / choice tile (art-direction §4 «Шаг квиза»): sand, from 88 px, Lead label with a Small
 * explanation, selected state ink. The input is visually hidden; the tile is the target and shows
 * the focus ring. Group tiles in a `<fieldset>` with a `<legend>`; keys 1–6 and auto-advance
 * belong to the quiz. No visible numbers (§8.2).
 */
export function ChoiceTile({ label, description, type = 'radio', className, ...input }: ChoiceTileProps) {
  return (
    <label
      className={clsx(
        'group focus-ring-within relative flex min-h-22 cursor-pointer flex-col justify-center gap-1 px-5 py-4 transition-colors duration-160',
        'bg-sand text-ink has-checked:bg-ink has-checked:text-salt',
        'on-ink:bg-ink-raised on-ink:text-salt on-ink:has-checked:bg-salt on-ink:has-checked:text-ink',
        'has-disabled:cursor-not-allowed has-disabled:opacity-50',
        // Windows contrast themes drop both fills, so the tile and its selected state need a border.
        'forced-colors:border forced-colors:has-checked:border-4',
        className,
      )}
    >
      <input {...input} type={type} className="sr-only" />
      <span className="type-lead">{label}</span>
      {description ? (
        <span className="type-small text-ink-muted group-has-checked:text-on-ink-muted on-ink:text-on-ink-muted on-ink:group-has-checked:text-ink-muted">
          {description}
        </span>
      ) : null}
    </label>
  )
}
