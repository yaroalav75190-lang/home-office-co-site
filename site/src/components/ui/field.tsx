'use client'

// Form controls (art-direction §4 «Поля форм», wording copy-global §8):
// label above (Small, ink-muted), 56 px field with a 1 px underline, focus 2 px ink,
// error 2 px #A1182E with an icon and a sentence that says what to fix.
// Validation runs on blur (built-in `validate`) and on submit (the form passes `error`).

import { clsx } from 'clsx'
import Link from 'next/link'
import {
  type ChangeEvent,
  type ComponentProps,
  type FocusEvent,
  type ReactNode,
  useId,
  useState,
} from 'react'
import { AlertIcon, CheckIcon, ChevronIcon } from './icons'

/* ───────────────────────── Field shell ───────────────────────── */

type FieldShellProps = {
  id: string
  label: ReactNode
  /** Visually hidden label (still read by screen readers). */
  hideLabel?: boolean
  /** Adds «, необязательно» to the label; there are no asterisks (copy-global §8). */
  optional?: boolean
  hint?: ReactNode
  hintId: string
  error?: ReactNode
  errorId: string
  className?: string
  children: ReactNode
}

/** Label + control + hint + error. Used by TextField and PhoneField; exported for custom controls. */
export function Field({
  id,
  label,
  hideLabel,
  optional,
  hint,
  hintId,
  error,
  errorId,
  className,
  children,
}: FieldShellProps) {
  return (
    <div className={className}>
      <label
        htmlFor={id}
        className={clsx('type-small mb-1 block text-ink-muted on-ink:text-on-ink-muted', hideLabel && 'sr-only')}
      >
        {label}
        {optional ? ', необязательно' : null}
      </label>
      {children}
      {hint ? (
        <p id={hintId} className="type-small mt-2 text-ink-muted on-ink:text-on-ink-muted">
          {hint}
        </p>
      ) : null}
      <FieldError id={errorId}>{error}</FieldError>
    </div>
  )
}

/** Error line: icon + text, announced politely. Always in the DOM so updates are read. */
export function FieldError({ id, children }: { id: string; children?: ReactNode }) {
  return (
    <p id={id} aria-live="polite" className="type-small mt-2 flex items-start gap-2 text-error empty:mt-0 on-ink:text-salt">
      {children ? (
        <>
          <AlertIcon size={18} className="mt-px shrink-0" />
          <span>{children}</span>
        </>
      ) : null}
    </p>
  )
}

function describedBy(...ids: (string | false | undefined)[]) {
  const value = ids.filter(Boolean).join(' ')
  return value || undefined
}

/**
 * Additions to `field-control` (docs/qa/a11y-gate.md):
 * - on ink fields the placeholder is on-ink-muted (7.6:1); the global ink-muted gives 2.3:1 there
 *   (WCAG 1.4.3);
 * - Windows contrast themes remove the gradient underline, and with it the field edge and the only
 *   focus indicator (the control sets `outline: none`): there, a real bottom border and an outline.
 */
const controlExtras =
  'on-ink:placeholder:text-on-ink-muted forced-colors:border-b forced-colors:focus:outline-2 forced-colors:focus:outline-offset-2'

/* ───────────────────────── TextField ───────────────────────── */

type InputProps = Omit<ComponentProps<'input'>, 'id' | 'className'>
type TextareaProps = Omit<ComponentProps<'textarea'>, 'id' | 'className'>

type TextFieldBase = {
  label: ReactNode
  hideLabel?: boolean
  optional?: boolean
  hint?: ReactNode
  /** Error from the form (on submit). Wins over the blur check. */
  error?: ReactNode
  /** Blur check; return the sentence to show, or undefined. Re-runs while typing once shown. */
  validate?: (value: string) => string | undefined
  className?: string
  id?: string
}

export type TextFieldProps =
  | (TextFieldBase & { multiline?: false } & InputProps)
  | (TextFieldBase & { multiline: true } & TextareaProps)

/** Text input or textarea (`multiline`). Uncontrolled or controlled, like the native element. */
export function TextField(props: TextFieldProps) {
  const { label, hideLabel, optional, hint, error, validate, className, id: idProp, ...control } = props
  const autoId = useId()
  const id = idProp ?? autoId
  const hintId = `${id}-hint`
  const errorId = `${id}-error`
  const [blurError, setBlurError] = useState<string | undefined>()
  const shownError = error ?? blurError

  const run = (value: string) => setBlurError(validate?.(value))

  const aria = {
    id,
    // Visual rule (copy-global §8): no asterisks, only optional fields are marked. So an unmarked
    // field is required, and screen readers hear that too (WCAG 1.3.1, 3.3.2).
    'aria-required': optional ? undefined : (true as const),
    'aria-invalid': shownError ? (true as const) : undefined,
    'aria-describedby': describedBy(hint ? hintId : undefined, shownError ? errorId : undefined),
  }

  let field: ReactNode
  if (control.multiline) {
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const { multiline: _m, onBlur, onChange, rows = 4, ...rest } = control
    field = (
      <textarea
        {...rest}
        {...aria}
        rows={rows}
        className={clsx('field-control w-full resize-y py-3', controlExtras)}
        onBlur={(e: FocusEvent<HTMLTextAreaElement>) => {
          if (validate) run(e.currentTarget.value)
          onBlur?.(e)
        }}
        onChange={(e: ChangeEvent<HTMLTextAreaElement>) => {
          if (validate && blurError) run(e.currentTarget.value)
          onChange?.(e)
        }}
      />
    )
  } else {
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const { multiline: _m, onBlur, onChange, type = 'text', ...rest } = control
    field = (
      <input
        {...rest}
        {...aria}
        type={type}
        className={clsx('field-control w-full', controlExtras)}
        onBlur={(e: FocusEvent<HTMLInputElement>) => {
          if (validate) run(e.currentTarget.value)
          onBlur?.(e)
        }}
        onChange={(e: ChangeEvent<HTMLInputElement>) => {
          if (validate && blurError) run(e.currentTarget.value)
          onChange?.(e)
        }}
      />
    )
  }

  return (
    <Field
      id={id}
      label={label}
      hideLabel={hideLabel}
      optional={optional}
      hint={hint}
      hintId={hintId}
      error={shownError}
      errorId={errorId}
      className={className}
    >
      {field}
    </Field>
  )
}

/* ───────────────────────── PhoneField ───────────────────────── */

export type PhoneCountry = { id: string; name: string; code: string; min: number; max: number }

/** Country codes for the selector; Russia first (copy-global §8.2: default «Россия +7»). */
export const phoneCountries: PhoneCountry[] = [
  { id: 'ru', name: 'Россия', code: '+7', min: 10, max: 10 },
  { id: 'kz', name: 'Казахстан', code: '+7', min: 10, max: 10 },
  { id: 'by', name: 'Беларусь', code: '+375', min: 9, max: 9 },
  { id: 'uz', name: 'Узбекистан', code: '+998', min: 9, max: 9 },
  { id: 'kg', name: 'Кыргызстан', code: '+996', min: 9, max: 9 },
  { id: 'am', name: 'Армения', code: '+374', min: 8, max: 8 },
  { id: 'ge', name: 'Грузия', code: '+995', min: 9, max: 9 },
  { id: 'az', name: 'Азербайджан', code: '+994', min: 9, max: 9 },
  { id: 'th', name: 'Таиланд', code: '+66', min: 8, max: 9 },
  { id: 'id', name: 'Индонезия', code: '+62', min: 9, max: 12 },
  { id: 'ae', name: 'ОАЭ', code: '+971', min: 8, max: 9 },
  { id: 'kh', name: 'Камбоджа', code: '+855', min: 8, max: 9 },
  { id: 'tr', name: 'Турция', code: '+90', min: 10, max: 10 },
  { id: 'il', name: 'Израиль', code: '+972', min: 8, max: 9 },
  { id: 'de', name: 'Германия', code: '+49', min: 7, max: 12 },
  { id: 'other', name: 'Другая страна', code: '+', min: 7, max: 15 },
]

/** Phone check with copy-global §8.3 wording. `digits` is the national number without the code. */
export function validatePhone(countryId: string, digits: string, required = true): string | undefined {
  const country = phoneCountries.find((c) => c.id === countryId) ?? phoneCountries[0]
  const n = digits.replace(/\D/g, '').length
  if (n === 0) return required ? 'Укажите номер телефона' : undefined
  if (n < country.min) {
    return country.code === '+7' ? 'Проверьте номер: после +7 нужно 10 цифр' : 'Проверьте номер: после кода страны не хватает цифр'
  }
  if (n > country.max) return 'В номере лишние цифры. Проверьте, не повторился ли код страны'
  return undefined
}

/** «900 000-00-00» for +7 numbers; other countries keep the digits grouped by three. */
function formatNational(code: string, digits: string) {
  if (code === '+7') {
    const d = digits.slice(0, 10)
    const parts = [d.slice(0, 3), d.slice(3, 6), d.slice(6, 8), d.slice(8, 10)]
    let out = parts[0]
    if (parts[1]) out += ` ${parts[1]}`
    if (parts[2]) out += `-${parts[2]}`
    if (parts[3]) out += `-${parts[3]}`
    // Extra digits stay visible: otherwise «В номере лишние цифры» pointed at digits nobody could see.
    if (digits.length > 10) out += ` ${digits.slice(10)}`
    return out
  }
  return digits.replace(/(\d{3})(?=\d)/g, '$1 ')
}

/**
 * Strip a pasted country code or a trunk prefix: «+7 900…», «8 900…» → «900…»; «081 234 5678»
 * (Thailand), «050…» (UAE), «0532…» (Turkey) → without the 0; «8 029…» (Belarus) → «29…».
 * National numbers of these countries never start with 0, and a number written the local way
 * used to fail with «лишние цифры, не повторился ли код страны».
 */
function normalizeDigits(code: string, raw: string) {
  let d = raw.replace(/\D/g, '')
  const codeDigits = code.replace(/\D/g, '')
  if (code === '+7' && d.length === 11 && (d.startsWith('7') || d.startsWith('8'))) d = d.slice(1)
  else if (codeDigits && raw.trim().startsWith('+') && d.startsWith(codeDigits)) d = d.slice(codeDigits.length)
  if (code === '+375' && d.length === 11 && d.startsWith('80')) d = d.slice(2)
  else if (code !== '+7' && codeDigits && d.startsWith('0')) d = d.slice(1)
  return d
}

export type PhoneFieldProps = {
  /** Name of the hidden input with the full number, e.g. «+7 9001234567». */
  name: string
  label?: ReactNode
  hint?: ReactNode
  optional?: boolean
  /** Error from the form (on submit). */
  error?: ReactNode
  defaultCountry?: string
  defaultValue?: string
  /** Full number on every change: `{ country, code, digits, value }`. */
  onValueChange?: (v: { country: string; code: string; digits: string; value: string }) => void
  className?: string
  id?: string
  autoFocus?: boolean
}

/** Phone with a country-code selector (copy-global §8.2: hidden label «Код страны»). */
export function PhoneField({
  name,
  label = 'Телефон',
  hint,
  optional = false,
  error,
  defaultCountry = 'ru',
  defaultValue = '',
  onValueChange,
  className,
  id: idProp,
  autoFocus,
}: PhoneFieldProps) {
  const autoId = useId()
  const id = idProp ?? autoId
  const codeId = `${id}-code`
  const hintId = `${id}-hint`
  const errorId = `${id}-error`
  const [country, setCountry] = useState(defaultCountry)
  const [digits, setDigits] = useState(() => defaultValue.replace(/\D/g, ''))
  const [blurError, setBlurError] = useState<string | undefined>()
  const current = phoneCountries.find((c) => c.id === country) ?? phoneCountries[0]
  const shownError = error ?? blurError
  const full = digits ? `${current.code} ${digits}` : ''

  const update = (nextCountry: string, nextDigits: string) => {
    const c = phoneCountries.find((x) => x.id === nextCountry) ?? phoneCountries[0]
    onValueChange?.({ country: c.id, code: c.code, digits: nextDigits, value: nextDigits ? `${c.code} ${nextDigits}` : '' })
  }

  return (
    <Field
      id={id}
      label={label}
      optional={optional}
      hint={hint}
      hintId={hintId}
      error={shownError}
      errorId={errorId}
      className={className}
    >
      <div className="flex items-stretch gap-3">
        <label htmlFor={codeId} className="sr-only">
          Код страны
        </label>
        {/* The select is as wide as its longest option; capped so the number keeps ~150 px at 390. */}
        <div className="relative max-w-[12rem] shrink-0">
          <select
            id={codeId}
            value={country}
            onChange={(e) => {
              setCountry(e.target.value)
              update(e.target.value, digits)
              if (blurError) setBlurError(validatePhone(e.target.value, digits, !optional))
            }}
            className={clsx('field-control nums w-full pr-7', controlExtras)}
            aria-invalid={shownError ? true : undefined}
          >
            {phoneCountries.map((c) => (
              <option key={c.id} value={c.id}>
                {c.id === 'other' ? c.name : `${c.name} ${c.code}`}
              </option>
            ))}
          </select>
          <ChevronIcon size={16} className="pointer-events-none absolute top-1/2 right-1 -translate-y-1/2" />
        </div>
        <input
          id={id}
          type="tel"
          inputMode="tel"
          autoComplete="tel-national"
          autoFocus={autoFocus}
          placeholder={current.code === '+7' ? '900 000-00-00' : undefined}
          value={formatNational(current.code, digits)}
          onChange={(e) => {
            const next = normalizeDigits(current.code, e.target.value).slice(0, current.max + 3)
            setDigits(next)
            update(country, next)
            if (blurError) setBlurError(validatePhone(country, next, !optional))
          }}
          onBlur={() => setBlurError(validatePhone(country, digits, !optional))}
          aria-required={optional ? undefined : true}
          aria-invalid={shownError ? true : undefined}
          aria-describedby={describedBy(hint ? hintId : undefined, shownError ? errorId : undefined)}
          className={clsx('field-control nums w-0 min-w-0 flex-1', controlExtras)}
        />
      </div>
      <input type="hidden" name={name} value={full} />
      <input type="hidden" name={`${name}Country`} value={current.id} />
    </Field>
  )
}

/* ───────────────────────── Checkbox ───────────────────────── */

export type CheckboxProps = Omit<ComponentProps<'input'>, 'type' | 'className'> & {
  label: ReactNode
  /** Line under the label, Small. */
  description?: ReactNode
  error?: ReactNode
  className?: string
}

/** 24×24 checkbox (the frame is one of the allowed lines, §3.5); the whole row is the 44 px target. */
export function Checkbox({ label, description, error, className, id: idProp, ...input }: CheckboxProps) {
  const autoId = useId()
  const id = idProp ?? autoId
  const descId = `${id}-desc`
  const errorId = `${id}-error`

  return (
    <div className={className}>
      <div className="flex items-start gap-3">
        <span className="relative mt-0.5 grid size-6 shrink-0 place-items-center">
          <input
            {...input}
            id={id}
            type="checkbox"
            aria-invalid={error ? true : undefined}
            aria-describedby={describedBy(description ? descId : undefined, error ? errorId : undefined)}
            className={clsx(
              'peer absolute inset-0 m-0 size-6 cursor-pointer appearance-none border border-ink bg-transparent',
              'checked:bg-ink on-ink:border-salt on-ink:checked:bg-salt',
              'aria-invalid:border-2 aria-invalid:border-error on-ink:aria-invalid:border-salt',
            )}
          />
          <CheckIcon size={20} className="pointer-events-none relative invisible text-salt peer-checked:visible on-ink:text-ink" />
        </span>
        <div className="min-w-0">
          <label htmlFor={id} className="type-body -my-2 block cursor-pointer py-2">
            {label}
          </label>
          {description ? (
            <p id={descId} className="type-small mt-1 text-ink-muted on-ink:text-on-ink-muted">
              {description}
            </p>
          ) : null}
        </div>
      </div>
      <FieldError id={errorId}>{error}</FieldError>
    </div>
  )
}

/** Consent checkbox with the copy-global §9 wording and links to /consent and /privacy. */
export function ConsentCheckbox(props: Omit<CheckboxProps, 'label' | 'description'>) {
  return (
    <Checkbox
      aria-required
      {...props}
      label={
        <>
          Даю{' '}
          <Link href="/consent" className="link-underline">
            согласие на обработку персональных данных
          </Link>
        </>
      }
      description={
        <>
          Как храним и используем данные, написано в{' '}
          <Link href="/privacy" className="link-underline">
            политике конфиденциальности
          </Link>
        </>
      }
    />
  )
}
