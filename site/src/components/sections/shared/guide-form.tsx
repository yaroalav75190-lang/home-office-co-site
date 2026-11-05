'use client'

// Guide form (copy-home §9, copy-global §8–§10.4): name, «Куда прислать гид» (Telegram,
// WhatsApp, Почта) with the contact for that channel, consent, «Получить гид». Promo version
// (DEMO_DECISIONS «Формы»): the guide is sent to the chosen channel, nothing opens on the page.
// Sends through `submitLead` (type `guide`) via the pages-forms kit; «спасибо» only after `ok`.

import { usePathname } from 'next/navigation'
import { type FormEvent, useEffect, useId, useRef, useState } from 'react'
import {
  type FieldErrors,
  ChannelNote,
  ErrorSummary,
  Honeypot,
  OptionTiles,
  SubmitButton,
  SubmitFailure,
  readHoneypot,
  useLeadSubmit,
} from '@/components/sections/forms/form-kit'
import { replyWhen, useReplyState } from '@/components/sections/forms/use-clock'
import { ConsentCheckbox, PhoneField, TextField, validatePhone } from '@/components/ui/field'
import { useLocale } from '@/i18n/client'
import { fmt } from '@/i18n/format'
import {
  type LeadFieldName,
  type Option,
  fieldLabel,
  validateEmail,
  validateName,
  validateTelegram,
} from '@/lib/lead'

type GuideChannel = 'telegram' | 'whatsapp' | 'email'

/** «Куда прислать гид» (copy-home §9): no «Звонок» for a PDF. Labels: `forms.guide.channels`. */
const GUIDE_CHANNELS: readonly GuideChannel[] = ['telegram', 'whatsapp', 'email']

type Phone = { country: string; digits: string; value: string }

export function GuideForm({ className }: { className?: string }) {
  const id = useId()
  const pathname = usePathname()
  const formRef = useRef<HTMLFormElement>(null)
  const summaryRef = useRef<HTMLDivElement>(null)
  const failureRef = useRef<HTMLDivElement>(null)
  const doneRef = useRef<HTMLHeadingElement>(null)

  const [name, setName] = useState('')
  const [channel, setChannel] = useState<GuideChannel | ''>('')
  const [telegram, setTelegram] = useState('')
  const [email, setEmail] = useState('')
  // '' = the locale's default code until the visitor types (see emptyChannelContact in form-kit).
  const [phone, setPhone] = useState<Phone>({ country: '', digits: '', value: '' })
  const [consent, setConsent] = useState(false)
  const [errors, setErrors] = useState<FieldErrors>({})
  const [summary, setSummary] = useState<{ label: string; targetId: string }[]>([])
  const [sentChannel, setSentChannel] = useState<GuideChannel | null>(null)

  const [focusTarget, setFocusTarget] = useState<'summary' | 'failure' | null>(null)

  const { status, failure, send } = useLeadSubmit()
  const reply = useReplyState()
  const { t } = useLocale()
  const f = t.forms
  const g = f.guide
  const m = f.messages
  const guideChannels: Option<GuideChannel>[] = GUIDE_CHANNELS.map((c) => ({ id: c, label: g.channels[c] }))

  useEffect(() => {
    if (focusTarget === 'summary') summaryRef.current?.focus()
    if (focusTarget === 'failure') failureRef.current?.focus()
  }, [focusTarget, summary, failure])
  useEffect(() => {
    if (status === 'done' && sentChannel) doneRef.current?.focus()
  }, [status, sentChannel])

  const ids = {
    name: `${id}-name`,
    channel: `${id}-channel`,
    contact: `${id}-contact`,
    consent: `${id}-consent`,
  }

  const dropError = (field: LeadFieldName) => {
    if (!errors[field]) return
    setErrors((prev) => {
      const next = { ...prev }
      delete next[field]
      return next
    })
  }

  const contact = (): Record<string, string> => {
    if (channel === 'telegram') return { contact: telegram.trim() }
    if (channel === 'email') return { contact: email.trim() }
    if (channel === 'whatsapp') return { contact: phone.value, phoneCountry: phone.country }
    return { contact: '' }
  }

  const validate = (): FieldErrors => {
    const next: FieldErrors = {}
    const nameError = validateName(name, m)
    if (nameError) next.name = nameError
    if (!channel) next.channel = m.channel
    else {
      const message =
        channel === 'telegram'
          ? validateTelegram(telegram, m)
          : channel === 'email'
            ? validateEmail(email, m)
            : validatePhone(phone.country, phone.digits, m)
      if (message) next.contact = message
    }
    if (!consent) next.consent = m.consent
    return next
  }

  /** «Заявка не отправлена. Исправьте поля: …» for errors found here or returned by the server. */
  const summaryOf = (found: FieldErrors) =>
    (Object.keys(found) as LeadFieldName[]).map((key) => ({
      label:
        key === 'channel'
          ? g.channelLegend
          : key === 'contact' && channel
            ? f.contactLabels[channel]
            : fieldLabel(key, f, channel || undefined),
      targetId: ids[key as keyof typeof ids] ?? ids.name,
    }))

  const onSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    if (status === 'busy') return
    const found = validate()
    setErrors(found)
    if (Object.keys(found).length) {
      setSummary(summaryOf(found))
      setFocusTarget('summary')
      return
    }
    setSummary([])
    const form = formRef.current
    const result = await send({
      type: 'guide',
      page: pathname || '/',
      fields: {
        name: name.trim(),
        channel: channel as GuideChannel,
        ...contact(),
        consent: 'yes',
        website: form ? readHoneypot(form) : '',
      },
    })
    // Focus moves in the effect above, after React has rendered the summary, failure or thanks
    // (a requestAnimationFrame after `await` could run before that render and focus nothing).
    if (result.ok) {
      setSentChannel(channel as GuideChannel)
    } else if (result.reason === 'validation' && result.fieldErrors) {
      // Without the summary the server's errors had no «Заявка не отправлена» and focus was lost.
      setErrors(result.fieldErrors)
      setSummary(summaryOf(result.fieldErrors))
      setFocusTarget('summary')
    } else {
      setFocusTarget('failure')
    }
  }

  if (status === 'done' && sentChannel) {
    // copy-global §10.4, promo version (DEMO_DECISIONS «Формы»): the guide goes to the chosen
    // channel, so there is no «Гид открылся в новой вкладке» and no «Скачать PDF».
    const when = reply ? replyWhen(reply, t.common.reply) : t.common.reply.when.fallback
    return (
      <div className={className} role="status">
        <h3 ref={doneRef} tabIndex={-1} className="type-d3 max-w-[24ch] focus:outline-none">
          {fmt(g.doneTitle, { channel: g.to[sentChannel] })}
        </h3>
        <p className="type-small nums mt-4 max-w-[44ch]">
          {fmt(sentChannel === 'email' ? g.doneEmail : g.doneChat, { when })}
        </p>
      </div>
    )
  }

  const busy = status === 'busy'

  return (
    <form ref={formRef} method="post" noValidate onSubmit={onSubmit} className={className} aria-label={g.formLabel}>
      <Honeypot />
      <div className="flex flex-col gap-8">
        <ErrorSummary items={summary} summaryRef={summaryRef} />

        <TextField
          id={ids.name}
          name="name"
          label={f.fields.name}
          autoComplete="given-name"
          value={name}
          error={errors.name}
          validate={(v) => validateName(v, m)}
          onChange={(e) => {
            dropError('name')
            setName(e.currentTarget.value)
          }}
        />

        <div className="flex flex-col gap-6">
          <OptionTiles
            id={ids.channel}
            name={`${id}-channel-choice`}
            legend={g.channelLegend}
            options={guideChannels}
            value={channel}
            columns="grid-cols-3"
            error={errors.channel}
            onChange={(next) => {
              dropError('channel')
              if (next !== channel) dropError('contact')
              setChannel(next)
            }}
          />
          {channel === 'telegram' ? (
            <TextField
              key="telegram"
              id={ids.contact}
              label={f.contactLabels.telegram}
              placeholder={f.placeholders.telegram}
              autoComplete="off"
              autoCapitalize="none"
              spellCheck={false}
              value={telegram}
              error={errors.contact}
              validate={(v) => validateTelegram(v, m)}
              onChange={(e) => {
                dropError('contact')
                setTelegram(e.currentTarget.value)
              }}
            />
          ) : null}
          {channel === 'email' ? (
            <TextField
              key="email"
              id={ids.contact}
              type="email"
              inputMode="email"
              label={f.contactLabels.email}
              placeholder={f.placeholders.email}
              autoComplete="email"
              autoCapitalize="none"
              spellCheck={false}
              value={email}
              error={errors.contact}
              validate={(v) => validateEmail(v, m)}
              onChange={(e) => {
                dropError('contact')
                setEmail(e.currentTarget.value)
              }}
            />
          ) : null}
          {channel === 'whatsapp' ? (
            <PhoneField
              key="whatsapp"
              id={ids.contact}
              name={`${id}-phone`}
              label={f.contactLabels.whatsapp}
              defaultCountry={phone.country || undefined}
              defaultValue={phone.digits}
              error={errors.contact}
              onValueChange={(v) => {
                dropError('contact')
                setPhone({ country: v.country, digits: v.digits, value: v.value })
              }}
            />
          ) : null}
        </div>

        <ConsentCheckbox
          id={ids.consent}
          name="consent"
          checked={consent}
          error={errors.consent}
          onChange={(e) => {
            dropError('consent')
            setConsent(e.currentTarget.checked)
          }}
        />

        {failure ? (
          // Through the submit handler, like the booking form and the quiz: `retry()` re-sent the
          // payload but skipped `setSentChannel`, so a successful retry showed neither the thanks
          // nor an error, just the filled form again.
          <SubmitFailure result={failure} onRetry={() => formRef.current?.requestSubmit()} busy={busy} failureRef={failureRef} />
        ) : null}

        <div>
          <SubmitButton label={g.submit} busy={busy} variant="inverse" />
          <p className="type-small mt-4 text-on-ink-muted">{g.note}</p>
          <ChannelNote className="mt-2" />
        </div>
      </div>
    </form>
  )
}
