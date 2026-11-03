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
import {
  type LeadFieldName,
  type Option,
  contactLabels,
  fieldLabel,
  leadMessages,
  validateEmail,
  validateName,
  validateTelegram,
} from '@/lib/lead'

type GuideChannel = 'telegram' | 'whatsapp' | 'email'

/** «Куда прислать гид» (copy-home §9): no «Звонок» for a PDF. */
const guideChannels: Option<GuideChannel>[] = [
  { id: 'telegram', label: 'Telegram' },
  { id: 'whatsapp', label: 'WhatsApp' },
  { id: 'email', label: 'Почта' },
]

/** «в Telegram» · «в WhatsApp» · «на почту» (copy-global §10.4). */
const toChannel: Record<GuideChannel, string> = {
  telegram: 'в Telegram',
  whatsapp: 'в WhatsApp',
  email: 'на почту',
}

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
  const [phone, setPhone] = useState<Phone>({ country: 'ru', digits: '', value: '' })
  const [consent, setConsent] = useState(false)
  const [errors, setErrors] = useState<FieldErrors>({})
  const [summary, setSummary] = useState<{ label: string; targetId: string }[]>([])
  const [sentChannel, setSentChannel] = useState<GuideChannel | null>(null)

  const [focusTarget, setFocusTarget] = useState<'summary' | 'failure' | null>(null)

  const { status, failure, send } = useLeadSubmit()
  const reply = useReplyState()

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
    const nameError = validateName(name)
    if (nameError) next.name = nameError
    if (!channel) next.channel = leadMessages.channel
    else {
      const message =
        channel === 'telegram'
          ? validateTelegram(telegram)
          : channel === 'email'
            ? validateEmail(email)
            : validatePhone(phone.country, phone.digits)
      if (message) next.contact = message
    }
    if (!consent) next.consent = leadMessages.consent
    return next
  }

  /** «Заявка не отправлена. Исправьте поля: …» for errors found here or returned by the server. */
  const summaryOf = (found: FieldErrors) =>
    (Object.keys(found) as LeadFieldName[]).map((key) => ({
      label: key === 'contact' && channel ? contactLabels[channel] : fieldLabel(key, channel || undefined),
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
    const when = reply ? replyWhen(reply) : 'в течение 15 минут'
    return (
      <div className={className} role="status">
        <h3 ref={doneRef} tabIndex={-1} className="type-d3 max-w-[24ch] focus:outline-none">
          Пришлём гид {toChannel[sentChannel]}
        </h3>
        <p className="type-small nums mt-4 max-w-[44ch]">
          {sentChannel === 'email'
            ? `Вопросы по гиду задайте в ответном письме, брокер ответит ${when}`
            : `Вопросы по гиду задайте в том же чате, брокер ответит ${when}`}
        </p>
      </div>
    )
  }

  const busy = status === 'busy'

  return (
    <form ref={formRef} method="post" noValidate onSubmit={onSubmit} className={className} aria-label="Получить гид">
      <Honeypot />
      <div className="flex flex-col gap-8">
        <ErrorSummary items={summary} summaryRef={summaryRef} />

        <TextField
          id={ids.name}
          name="name"
          label="Имя"
          autoComplete="given-name"
          value={name}
          error={errors.name}
          validate={validateName}
          onChange={(e) => {
            dropError('name')
            setName(e.currentTarget.value)
          }}
        />

        <div className="flex flex-col gap-6">
          <OptionTiles
            id={ids.channel}
            name={`${id}-channel-choice`}
            legend="Куда прислать гид"
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
              label={contactLabels.telegram}
              placeholder="@username или +7 900 000-00-00"
              autoComplete="off"
              autoCapitalize="none"
              spellCheck={false}
              value={telegram}
              error={errors.contact}
              validate={validateTelegram}
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
              label={contactLabels.email}
              placeholder="name@mail.ru"
              autoComplete="email"
              autoCapitalize="none"
              spellCheck={false}
              value={email}
              error={errors.contact}
              validate={validateEmail}
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
              label={contactLabels.whatsapp}
              defaultCountry={phone.country}
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
          <SubmitButton label="Получить гид" busy={busy} variant="inverse" />
          <p className="type-small mt-4 text-on-ink-muted">
            Пришлём гид в выбранный канал
          </p>
          <ChannelNote className="mt-2" />
        </div>
      </div>
    </form>
  )
}
