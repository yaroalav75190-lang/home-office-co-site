'use client'

// Building blocks shared by the consultation form, the booking form and the quiz contact step
// (art-direction §4 «Поля форм», wording copy-global §8–§9). Primitives from `@/components/ui`
// are reused as they are; the compact option tile below is a 56 px sibling of ChoiceTile for
// short answers (channel, format, direction, date), so ChoiceTile keeps its 88 px quiz size.

import { clsx } from 'clsx'
import { type ReactNode, type Ref, useCallback, useEffect, useId, useState } from 'react'
import { Button } from '@/components/ui/button'
import { ChoiceTile } from '@/components/ui/choice-tile'
import { FieldError, PhoneField, TextField, validatePhone } from '@/components/ui/field'
import { PhoneIcon } from '@/components/ui/icons'
import { useLocale } from '@/i18n/client'
import { type Locale, intlLocale, localizePath } from '@/i18n/config'
import { fmt } from '@/i18n/format'
import type { FormsDict } from '@/i18n/ru/forms'
import { installClickGoals } from '@/lib/analytics'
import {
  type ChannelId,
  type LeadFieldName,
  type LeadPayload,
  type LeadResult,
  type Option,
  BOOKING,
  bookingDates,
  captureFirstTouch,
  closedSlots,
  formOptions,
  submitLead,
  validateEmail,
  validateTelegram,
} from '@/lib/lead'
import { brokerHoursIn } from '@/lib/reply-time'
import { brokerHours, contacts } from '@/lib/site'
import { useMinute } from './use-clock'

export type FieldErrors = Partial<Record<LeadFieldName, string>>

/* ───────────────────────── Analytics bridge ───────────────────────── */

/**
 * First-touch UTM capture + delegated click goals (tel:, Telegram, WhatsApp, mailto:).
 * Idempotent; mount once in the root layout (recommended) or on pages with forms.
 */
export function AnalyticsBridge() {
  useEffect(() => {
    captureFirstTouch()
    return installClickGoals()
  }, [])
  return null
}

/* ───────────────────────── Honeypot ───────────────────────── */

/**
 * DOM name of the honeypot input. Not «website» / «url» / «company»: password managers (1Password
 * identities have a «website» field) and browser autofill fill such names even off screen, and a
 * filled honeypot used to drop a real lead behind a fake «спасибо». The value is still sent as
 * `HONEYPOT_FIELD` («website») in the request.
 */
const HONEYPOT_INPUT = 'hoc_hp_x'

/** Off-screen field that only bots fill. Read it with `readHoneypot(form)`. */
export function Honeypot() {
  const { t } = useLocale()
  return (
    <div aria-hidden="true" className="absolute -left-[9999px] h-px w-px overflow-hidden">
      <label>
        {t.forms.honeypot}
        <input
          type="text"
          name={HONEYPOT_INPUT}
          tabIndex={-1}
          autoComplete="off"
          defaultValue=""
          data-1p-ignore=""
          data-lpignore="true"
          data-bwignore="true"
          data-form-type="other"
        />
      </label>
    </div>
  )
}

/** The honeypot value, to send as `fields[HONEYPOT_FIELD]`. */
export function readHoneypot(form: HTMLFormElement): string {
  const value = new FormData(form).get(HONEYPOT_INPUT)
  return typeof value === 'string' ? value : ''
}

/* ───────────────────────── Option tiles ───────────────────────── */

type OptionTilesProps<T extends string> = {
  name: string
  legend: ReactNode
  options: Option<T>[]
  value: T | ''
  onChange: (value: T) => void
  error?: string
  hint?: ReactNode
  /** `compact`: 56 px, UI label (channel, format, direction). `tile`: ChoiceTile, 88 px with a description. */
  variant?: 'compact' | 'tile'
  /** Grid classes, e.g. «grid-cols-2 md:grid-cols-4». */
  columns?: string
  /** id of the group, focused from the error summary (the first radio gets `${id}-first`). */
  id?: string
  className?: string
}

/** Radio group as tiles: `<fieldset>` with a Small legend, tiles in a grid, error under it. */
export function OptionTiles<T extends string>({
  name,
  legend,
  options,
  value,
  onChange,
  error,
  hint,
  variant = 'compact',
  columns = 'grid-cols-2',
  id: idProp,
  className,
}: OptionTilesProps<T>) {
  const autoId = useId()
  const id = idProp ?? autoId
  const hintId = `${id}-hint`
  const errorId = `${id}-error`
  return (
    <fieldset
      id={id}
      className={clsx('min-w-0', className)}
      aria-describedby={clsx(hint && hintId, error && errorId) || undefined}
    >
      <legend className="type-small mb-1 text-ink-muted on-ink:text-on-ink-muted">{legend}</legend>
      {hint ? (
        <p id={hintId} className="type-small mb-3 text-ink-muted on-ink:text-on-ink-muted">
          {hint}
        </p>
      ) : (
        <div className="h-2" />
      )}
      <div className={clsx('grid gap-2', columns)}>
        {options.map((option, i) =>
          variant === 'tile' ? (
            <ChoiceTile
              key={option.id}
              id={i === 0 ? `${id}-first` : undefined}
              name={name}
              value={option.id}
              checked={value === option.id}
              onChange={() => onChange(option.id)}
              label={option.label}
              description={option.description}
            />
          ) : (
            <CompactTile
              key={option.id}
              id={i === 0 ? `${id}-first` : undefined}
              name={name}
              checked={value === option.id}
              onChange={() => onChange(option.id)}
              label={option.label}
            />
          ),
        )}
      </div>
      <FieldError id={errorId}>{error}</FieldError>
    </fieldset>
  )
}

const tileClasses = clsx(
  'group focus-ring-within relative flex cursor-pointer flex-col justify-center px-4 py-3 transition-colors duration-160',
  'bg-sand text-ink has-checked:bg-ink has-checked:text-salt',
  'on-ink:bg-ink-raised on-ink:text-salt on-ink:has-checked:bg-salt on-ink:has-checked:text-ink',
  'has-disabled:cursor-not-allowed has-disabled:opacity-50',
  // Windows contrast themes drop both fills, so the tile and its selected state need a border.
  'forced-colors:border forced-colors:has-checked:border-4',
)

function CompactTile({
  id,
  name,
  checked,
  onChange,
  label,
  sub,
  disabled,
}: {
  id?: string
  name: string
  checked: boolean
  onChange: () => void
  label: ReactNode
  sub?: ReactNode
  disabled?: boolean
}) {
  return (
    <label className={clsx(tileClasses, 'min-h-14')}>
      <input
        id={id}
        type="radio"
        name={name}
        className="sr-only"
        checked={checked}
        onChange={onChange}
        disabled={disabled}
      />
      {sub ? (
        <span className="type-small text-ink-muted group-has-checked:text-on-ink-muted on-ink:text-on-ink-muted on-ink:group-has-checked:text-ink-muted">
          {sub}
        </span>
      ) : null}
      <span className="type-ui nums">{label}</span>
    </label>
  )
}

/* ───────────────────────── Date tiles ───────────────────────── */

const dateFormats = new Map<Locale, { weekday: Intl.DateTimeFormat; dayMonth: Intl.DateTimeFormat; dayMonthShort: Intl.DateTimeFormat }>()

/** Weekday and date in the page's language: «Пн» / «3 ноября», «Mon» / «November 3», «lun» / «3 de noviembre». */
function dateParts(iso: string, locale: Locale) {
  let f = dateFormats.get(locale)
  if (!f) {
    const tag = intlLocale[locale]
    f = {
      weekday: new Intl.DateTimeFormat(tag, { weekday: 'short', timeZone: 'UTC' }),
      dayMonth: new Intl.DateTimeFormat(tag, { day: 'numeric', month: 'long', timeZone: 'UTC' }),
      dayMonthShort: new Intl.DateTimeFormat(tag, { day: 'numeric', month: 'short', timeZone: 'UTC' }),
    }
    dateFormats.set(locale, f)
  }
  const [y, m, d] = iso.split('-').map(Number)
  const date = new Date(Date.UTC(y, m - 1, d, 12))
  const wd = f.weekday.format(date)
  return {
    weekday: wd.charAt(0).toUpperCase() + wd.slice(1),
    label: f.dayMonth.format(date),
    short: f.dayMonthShort.format(date),
  }
}

/** «12 ноября» for a booking date (Phuket calendar). */
export function formatBookingDate(iso: string, locale: Locale = 'ru'): string {
  return dateParts(iso, locale).label
}

/**
 * «Дата»: the next 14 days (Phuket calendar) as tiles, «Пн» / «3 ноября», 4 per row on phones,
 * 7 from 768 px (two weeks). Days without an open slot are disabled. Rendered after hydration
 * (the dates depend on today); before that the grid keeps its size.
 */
export function DateTiles({
  name,
  value,
  onChange,
  error,
  id: idProp,
  className,
}: {
  name: string
  value: string
  onChange: (date: string) => void
  error?: string
  id?: string
  className?: string
}) {
  const autoId = useId()
  const id = idProp ?? autoId
  const { locale, t } = useLocale()
  const now = useMinute()
  const today = now ?? 0
  const dates = now === null ? null : bookingDates(now)
  return (
    <fieldset id={id} className={clsx('min-w-0', className)} aria-describedby={clsx(`${id}-hint`, error && `${id}-error`)}>
      <legend className="type-small mb-1 text-ink-muted on-ink:text-on-ink-muted">{t.forms.dates.legend}</legend>
      <p id={`${id}-hint`} className="type-small mb-3 text-ink-muted on-ink:text-on-ink-muted">
        {t.forms.dates.hint}
      </p>
      <div className="grid grid-cols-4 gap-2 md:grid-cols-7">
        {dates === null
          ? Array.from({ length: 14 }, (_, i) => (
              <div key={i} aria-hidden="true" className="min-h-16 bg-sand on-ink:bg-ink-raised" />
            ))
          : dates.map((iso, i) => {
              const parts = dateParts(iso, locale)
              const disabled = closedSlots(iso, today).length === BOOKING.slots.length
              return (
                <label key={iso} className={clsx(tileClasses, 'min-h-16 px-3')}>
                  <input
                    id={i === 0 ? `${id}-first` : undefined}
                    type="radio"
                    name={name}
                    value={iso}
                    className="sr-only"
                    checked={value === iso}
                    onChange={() => onChange(iso)}
                    disabled={disabled}
                  />
                  <span className="type-small text-ink-muted group-has-checked:text-on-ink-muted on-ink:text-on-ink-muted on-ink:group-has-checked:text-ink-muted">
                    {parts.weekday}
                  </span>
                  <span className="type-ui nums whitespace-nowrap">
                    <span aria-hidden="true">{parts.short}</span>
                    <span className="sr-only">{parts.label}</span>
                  </span>
                </label>
              )
            })}
      </div>
      <FieldError id={`${id}-error`}>{error}</FieldError>
    </fieldset>
  )
}

/* ───────────────────────── Channel + contact ───────────────────────── */

export type PhoneState = { country: string; digits: string; value: string }

export type ChannelContactState = {
  channel: ChannelId | ''
  telegram: string
  email: string
  phone: PhoneState
}

/** `phone.country` '' = the locale's default code (`defaultPhoneCountry`), set by the phone field once typed in. */
export const emptyChannelContact: ChannelContactState = {
  channel: '',
  telegram: '',
  email: '',
  phone: { country: '', digits: '', value: '' },
}

/** The `contact` and `phoneCountry` values to send for the chosen channel. */
export function contactValue(s: ChannelContactState): { contact: string; phoneCountry?: string } {
  switch (s.channel) {
    case 'telegram':
      return { contact: s.telegram.trim() }
    case 'email':
      return { contact: s.email.trim() }
    case 'whatsapp':
    case 'phone':
      return { contact: s.phone.value, phoneCountry: s.phone.country }
    default:
      return { contact: '' }
  }
}

/** Submit-time check of channel + contact with copy-global §8.3 wording (`forms.messages`). */
export function validateChannelContact(s: ChannelContactState, m: FormsDict['messages']): FieldErrors {
  if (!s.channel) return { channel: m.channel }
  let message: string | undefined
  if (s.channel === 'telegram') message = validateTelegram(s.telegram, m)
  else if (s.channel === 'email') message = validateEmail(s.email, m)
  else message = validatePhone(s.phone.country, s.phone.digits, m)
  return message ? { contact: message } : {}
}

/** «Брокер позвонит с 9:00 до 21:00 по Пхукету», hours formatted for the locale. */
function hoursHint(f: FormsDict, locale: Locale): string {
  const { open, close } = brokerHoursIn(brokerHours.utcOffsetMinutes, locale)
  return fmt(f.phoneHoursHint, { open, close })
}

/**
 * «Куда ответить» (Telegram, WhatsApp, Звонок, Почта) and the contact field for that channel
 * (copy-global §8.2). WhatsApp and Звонок share one phone field, so the number survives a switch.
 */
export function ChannelContact({
  idPrefix,
  state,
  onChange,
  errors,
  onFieldEdit,
  columns = 'grid-cols-2 md:grid-cols-4',
}: {
  idPrefix: string
  state: ChannelContactState
  onChange: (next: ChannelContactState) => void
  errors: FieldErrors
  /** Called when the visitor edits a field, so the form can drop its submit-time error. */
  onFieldEdit: (field: LeadFieldName) => void
  columns?: string
}) {
  const contactId = `${idPrefix}-contact`
  const { channel } = state
  const { locale, t } = useLocale()
  const f = t.forms
  const m = f.messages
  return (
    <div className="flex flex-col gap-6">
      <OptionTiles
        id={`${idPrefix}-channel`}
        name={`${idPrefix}-channel`}
        legend={f.fields.channel}
        options={formOptions(f, locale).channels}
        value={channel}
        columns={columns}
        error={errors.channel}
        onChange={(next) => {
          onFieldEdit('channel')
          if (next !== channel) onFieldEdit('contact')
          onChange({ ...state, channel: next })
        }}
      />
      {channel === 'telegram' ? (
        <TextField
          key="telegram"
          id={contactId}
          label={f.contactLabels.telegram}
          placeholder={f.placeholders.telegram}
          autoComplete="off"
          autoCapitalize="none"
          spellCheck={false}
          value={state.telegram}
          error={errors.contact}
          validate={(v) => validateTelegram(v, m)}
          onChange={(e) => {
            onFieldEdit('contact')
            onChange({ ...state, telegram: e.currentTarget.value })
          }}
        />
      ) : null}
      {channel === 'email' ? (
        <TextField
          key="email"
          id={contactId}
          type="email"
          inputMode="email"
          label={f.contactLabels.email}
          placeholder={f.placeholders.email}
          autoComplete="email"
          autoCapitalize="none"
          spellCheck={false}
          value={state.email}
          error={errors.contact}
          validate={(v) => validateEmail(v, m)}
          onChange={(e) => {
            onFieldEdit('contact')
            onChange({ ...state, email: e.currentTarget.value })
          }}
        />
      ) : null}
      {channel === 'whatsapp' || channel === 'phone' ? (
        <PhoneField
          key="phone"
          id={contactId}
          name={`${idPrefix}-phone`}
          label={f.contactLabels[channel]}
          hint={channel === 'phone' ? hoursHint(f, locale) : undefined}
          defaultCountry={state.phone.country || undefined}
          defaultValue={state.phone.digits}
          error={errors.contact}
          onValueChange={(v) => {
            onFieldEdit('contact')
            onChange({ ...state, phone: { country: v.country, digits: v.digits, value: v.value } })
          }}
        />
      ) : null}
    </div>
  )
}

/* ───────────────────────── Error summary ───────────────────────── */

/**
 * «Заявка не отправлена. Исправьте поля: Имя, Телефон» (copy-global §8.3). Receives focus after a
 * failed submit; each label moves focus to its field.
 */
export function ErrorSummary({
  items,
  summaryRef,
}: {
  items: { label: string; targetId: string }[]
  summaryRef: Ref<HTMLDivElement>
}) {
  const { t } = useLocale()
  if (!items.length) return null
  return (
    <div
      ref={summaryRef}
      tabIndex={-1}
      role="alert"
      className="type-body flex items-start gap-3 bg-sand px-4 py-3 text-ink on-ink:bg-ink-raised on-ink:text-salt"
    >
      <span>
        {t.forms.summaryLead}{' '}
        {items.map((item, i) => (
          <span key={item.targetId}>
            <button
              type="button"
              className="link-underline"
              onClick={() => {
                const root = document.getElementById(item.targetId)
                const focusable = 'input:not(:disabled):not([type="hidden"]), select, textarea, button'
                const target = [
                  root,
                  document.getElementById(`${item.targetId}-first`),
                  ...Array.from(root?.querySelectorAll<HTMLElement>(focusable) ?? []),
                ].find((el): el is HTMLElement => Boolean(el && el.matches(focusable)))
                target?.focus()
              }}
            >
              {item.label}
            </button>
            {i < items.length - 1 ? ', ' : ''}
          </span>
        ))}
      </span>
    </div>
  )
}

/* ───────────────────────── Submit ───────────────────────── */

/**
 * Submit button: «Отправляем…» while busy, disabled, same width (both labels share one grid
 * cell). `variant="inverse"` on ink fields.
 */
export function SubmitButton({
  label,
  busy,
  variant = 'inverse',
  className,
}: {
  label: string
  busy: boolean
  variant?: 'primary' | 'inverse'
  className?: string
}) {
  const { t } = useLocale()
  return (
    <Button type="submit" variant={variant} disabled={busy} aria-busy={busy || undefined} className={className}>
      <span className="grid">
        <span className={clsx('[grid-area:1/1]', busy && 'invisible')}>{label}</span>
        <span className={clsx('[grid-area:1/1]', !busy && 'invisible')} aria-hidden={!busy}>
          {t.forms.sending}
        </span>
      </span>
    </Button>
  )
}

/** Note under every submit button (copy-global §9). */
export function ChannelNote({ className }: { className?: string }) {
  const { t } = useLocale()
  return <p className={clsx('type-small text-ink-muted on-ink:text-on-ink-muted', className)}>{t.forms.channelNote}</p>
}

/**
 * Sending failed (copy-global §8.4): no network → «Повторить отправку»; server → «Повторить
 * отправку» and «Позвонить»; duplicate → the sentence only. The data stays in the form.
 */
export function SubmitFailure({
  result,
  onRetry,
  busy,
  failureRef,
  variant = 'inverse',
}: {
  result: Extract<LeadResult, { ok: false }>
  onRetry: () => void
  busy: boolean
  failureRef: Ref<HTMLDivElement>
  /** `inverse` on ink fields (default), `primary` on salt. */
  variant?: 'primary' | 'inverse'
}) {
  const { t } = useLocale()
  if (result.reason === 'validation') return null
  const neutral = result.reason === 'duplicate'
  return (
    <div
      ref={failureRef}
      tabIndex={-1}
      role={neutral ? 'status' : 'alert'}
      className="flex flex-col gap-4 bg-sand px-4 py-4 text-ink on-ink:bg-ink-raised on-ink:text-salt"
    >
      <p className="type-body">{result.error}</p>
      {neutral ? null : (
        <div className="flex flex-wrap gap-2">
          <Button type="button" variant={variant} size="sm" onClick={onRetry} disabled={busy}>
            {busy ? t.forms.sending : t.forms.retry}
          </Button>
          {result.reason === 'server' ? (
            <a
              href={contacts.phone.href}
              className="type-ui inline-flex h-11 items-center gap-2 px-3 underline-offset-4 hover:underline"
            >
              <PhoneIcon size={20} />
              {t.forms.call}
            </a>
          ) : null}
        </div>
      )}
    </div>
  )
}

/* ───────────────────────── Submit state ───────────────────────── */

export type SubmitStatus = 'idle' | 'busy' | 'done'

/**
 * Sending state for a form: `send(payload)` posts through `submitLead` and resolves the result;
 * `retry()` re-sends the last payload. `done` only after `{ ok: true }`. The page's locale goes
 * with the lead (field errors come back in it) and the page path gets its locale prefix.
 */
export function useLeadSubmit() {
  const [status, setStatus] = useState<SubmitStatus>('idle')
  const [failure, setFailure] = useState<Extract<LeadResult, { ok: false }> | null>(null)
  const [last, setLast] = useState<LeadPayload | null>(null)
  const { locale, t } = useLocale()

  const send = useCallback(async (input: LeadPayload): Promise<LeadResult> => {
    const payload: LeadPayload = { ...input, page: localizePath(locale, input.page), locale }
    setStatus('busy')
    setFailure(null)
    setLast(payload)
    const result = await submitLead(payload, { forms: t.forms, reply: t.common.reply })
    if (result.ok) {
      setStatus('done')
    } else {
      setFailure(result)
      setStatus('idle')
    }
    return result
  }, [locale, t])

  const retry = useCallback(() => (last ? send(last) : Promise.resolve(null)), [last, send])

  return { status, failure, send, retry, clearFailure: () => setFailure(null) }
}
