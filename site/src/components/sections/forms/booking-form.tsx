'use client'

// Booking forms on ink fields (art-direction §6, wording copy-global §8, copy-deal §7, copy-contacts §3):
// - `consultation` (/services/deal): Имя · Куда ответить · Контакт · Формат · Дата · Время ·
//   Что уже выбрали (необязательно) · Согласие → «Записаться на консультацию».
// - `viewing` (/contacts): Формат · Направление · Дата · Время · Имя · Куда ответить · Контакт ·
//   Что обсудить (необязательно) · Согласие → «Записаться».
// Validation on blur (fields) and on submit (all, with the summary focused); the button shows
// «Отправляем…»; the thank-you screen replaces the form only after `{ ok: true }`; failures keep
// every value in the form and offer «Повторить отправку» (+ «Позвонить»).

import { type FormEvent, useEffect, useRef, useState } from 'react'
import { ConsentCheckbox, TextField } from '@/components/ui/field'
import { SlotPicker } from '@/components/ui/slot-picker'
import {
  BOOKING,
  type ConsultFormatId,
  type DirectionId,
  type LeadFieldName,
  type ViewingFormatId,
  closedSlots,
  consultationFormats,
  fieldLabel,
  formDirections,
  leadMessages,
  validateComment,
  validateName,
  viewingFormats,
} from '@/lib/lead'
import {
  ChannelContact,
  type ChannelContactState,
  ChannelNote,
  DateTiles,
  ErrorSummary,
  type FieldErrors,
  Honeypot,
  OptionTiles,
  SubmitButton,
  SubmitFailure,
  contactValue,
  emptyChannelContact,
  readHoneypot,
  useLeadSubmit,
  validateChannelContact,
} from './form-kit'
import { LiveLine } from './live-line'
import { BookingThanks } from './thanks'
import { replyWhen } from './use-clock'

type Kind = 'consultation' | 'viewing'
type Format = ConsultFormatId | ViewingFormatId

const ORDER: Record<Kind, LeadFieldName[]> = {
  consultation: ['name', 'channel', 'contact', 'format', 'date', 'time', 'comment', 'consent'],
  viewing: ['format', 'direction', 'date', 'time', 'name', 'channel', 'contact', 'comment', 'consent'],
}

export function BookingForm({ kind, page }: { kind: Kind; page: string }) {
  const p = kind === 'consultation' ? 'konsultaciya' : 'zapis'
  const [name, setName] = useState('')
  const [cc, setCc] = useState<ChannelContactState>(emptyChannelContact)
  const [format, setFormat] = useState<Format | ''>('')
  const [direction, setDirection] = useState<DirectionId | ''>('')
  const [date, setDate] = useState('')
  const [time, setTime] = useState('')
  const [comment, setComment] = useState('')
  const [consent, setConsent] = useState(false)
  const [errors, setErrors] = useState<FieldErrors>({})
  const [summary, setSummary] = useState<{ label: string; targetId: string }[]>([])
  const { status, failure, send } = useLeadSubmit()
  const formRef = useRef<HTMLFormElement>(null)

  const summaryRef = useRef<HTMLDivElement>(null)
  const failureRef = useRef<HTMLDivElement>(null)
  const thanksRef = useRef<HTMLHeadingElement>(null)
  const [focusTarget, setFocusTarget] = useState<'summary' | 'failure' | null>(null)

  const busy = status === 'busy'
  const needsDirection = kind === 'viewing' && format !== 'viewing'

  // Focus after the DOM shows the summary, the failure or the thank-you screen.
  useEffect(() => {
    if (focusTarget === 'summary') summaryRef.current?.focus()
    if (focusTarget === 'failure') failureRef.current?.focus()
  }, [focusTarget, summary, failure])
  useEffect(() => {
    if (status === 'done') thanksRef.current?.focus()
  }, [status])

  const clear = (field: LeadFieldName) => {
    setErrors((prev) => {
      if (!prev[field]) return prev
      const next = { ...prev }
      delete next[field]
      return next
    })
  }

  const targetId = (field: LeadFieldName) => `${p}-${field}`

  const validateAll = (): FieldErrors => {
    const e: FieldErrors = {}
    const nameError = validateName(name)
    if (nameError) e.name = nameError
    Object.assign(e, validateChannelContact(cc))
    if (!format) e.format = leadMessages.format
    if (needsDirection && !direction) e.direction = leadMessages.direction
    if (!date) e.date = leadMessages.date
    if (!time) e.time = leadMessages.time
    else if (date && closedSlots(date).includes(time)) e.time = leadMessages.slotTaken
    const commentError = validateComment(comment)
    if (commentError) e.comment = commentError
    if (!consent) e.consent = leadMessages.consent
    return e
  }

  const showErrors = (e: FieldErrors) => {
    setErrors(e)
    const items = ORDER[kind]
      .filter((f) => e[f])
      .map((f) => ({ label: fieldLabel(f, cc.channel), targetId: targetId(f) }))
    setSummary(items)
    setFocusTarget(items.length ? 'summary' : null)
  }

  const onSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    if (busy) return
    const e = validateAll()
    if (Object.keys(e).length) {
      showErrors(e)
      return
    }
    setSummary([])
    const { contact, phoneCountry } = contactValue(cc)
    const fields: Record<string, string> = {
      name: name.trim(),
      channel: cc.channel,
      contact,
      consent: 'yes',
      format,
      date,
      time,
      comment,
      website: readHoneypot(event.currentTarget),
    }
    if (phoneCountry) fields.phoneCountry = phoneCountry
    if (needsDirection) fields.direction = direction
    const result = await send({ type: kind, fields, page })
    if (!result.ok) {
      if (result.reason === 'validation' && result.fieldErrors) showErrors(result.fieldErrors)
      else setFocusTarget('failure')
    }
  }

  if (status === 'done' && cc.channel && format) {
    return <BookingThanks kind={kind} format={format} channel={cc.channel} date={date} time={time} headingRef={thanksRef} />
  }

  const nameField = (
    <TextField
      id={targetId('name')}
      label="Имя"
      autoComplete="name"
      value={name}
      error={errors.name}
      validate={validateName}
      onChange={(e) => {
        clear('name')
        setName(e.currentTarget.value)
      }}
    />
  )

  const contactFields = (
    <ChannelContact idPrefix={p} state={cc} onChange={setCc} errors={errors} onFieldEdit={clear} />
  )

  const formatField =
    kind === 'consultation' ? (
      <OptionTiles
        id={targetId('format')}
        name={`${p}-format`}
        legend="Формат"
        options={consultationFormats}
        value={format as ConsultFormatId | ''}
        columns="grid-cols-1 md:grid-cols-3"
        error={errors.format}
        onChange={(v) => {
          clear('format')
          setFormat(v)
        }}
      />
    ) : (
      <OptionTiles
        id={targetId('format')}
        name={`${p}-format`}
        legend="Формат"
        variant="tile"
        options={viewingFormats}
        value={format as ViewingFormatId | ''}
        columns="grid-cols-1 md:grid-cols-2"
        error={errors.format}
        onChange={(v) => {
          clear('format')
          if (v === 'viewing') clear('direction')
          setFormat(v)
        }}
      />
    )

  const whenFields = (
    <>
      <DateTiles
        id={targetId('date')}
        name={`${p}-date`}
        value={date}
        error={errors.date}
        onChange={(d) => {
          clear('date')
          setDate(d)
          if (time && closedSlots(d).includes(time)) setTime('')
        }}
      />
      <div id={targetId('time')}>
        <SlotPicker
          name={`${p}-time`}
          slots={[...BOOKING.slots]}
          date={date || undefined}
          disabledSlots={date ? closedSlots(date) : []}
          value={time}
          error={errors.time}
          onChange={(t) => {
            clear('time')
            setTime(t)
          }}
        />
      </div>
    </>
  )

  const commentField = (
    <TextField
      id={targetId('comment')}
      multiline
      rows={3}
      label={kind === 'consultation' ? 'Что уже выбрали' : 'Что обсудить'}
      optional
      placeholder={kind === 'consultation' ? 'Название проекта или ссылка' : 'Например, виллы у моря до 300 тыс. $'}
      value={comment}
      error={errors.comment}
      validate={validateComment}
      onChange={(e) => {
        clear('comment')
        setComment(e.currentTarget.value)
      }}
    />
  )

  return (
    <form ref={formRef} method="post" noValidate onSubmit={onSubmit} className="ym-disable-keys relative flex flex-col gap-8" aria-busy={busy || undefined}>
      <Honeypot />
      <ErrorSummary items={summary} summaryRef={summaryRef} />

      {kind === 'consultation' ? (
        <>
          {nameField}
          {contactFields}
          {formatField}
          {whenFields}
        </>
      ) : (
        <>
          {formatField}
          {needsDirection ? (
            <OptionTiles
              id={targetId('direction')}
              name={`${p}-direction`}
              legend="Направление"
              options={formDirections}
              value={direction}
              columns="grid-cols-2 md:grid-cols-3"
              error={errors.direction}
              onChange={(v) => {
                clear('direction')
                setDirection(v)
              }}
            />
          ) : null}
          {whenFields}
          {nameField}
          {contactFields}
        </>
      )}

      {commentField}

      <ConsentCheckbox
        id={targetId('consent')}
        checked={consent}
        error={errors.consent}
        onChange={(e) => {
          clear('consent')
          setConsent(e.currentTarget.checked)
        }}
      />

      {failure ? <SubmitFailure result={failure} onRetry={() => formRef.current?.requestSubmit()} busy={busy} failureRef={failureRef} /> : null}

      <div className="flex flex-col items-start gap-3">
        <SubmitButton label={kind === 'consultation' ? 'Записаться на консультацию' : 'Записаться'} busy={busy} />
        {kind === 'viewing' ? (
          <LiveLine
            render={(s) => `Брокер подтвердит запись ${replyWhen(s)}`}
            fallback="Брокер подтвердит запись в течение 15 минут"
          />
        ) : null}
        <ChannelNote />
      </div>
    </form>
  )
}
