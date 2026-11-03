'use client'

// Thank-you screens for bookings (copy-global §10.2 consultation, §10.3 viewing). Shown only
// after `submitLead` resolved `{ ok: true }`.

import type { Ref } from 'react'
import { Button } from '@/components/ui/button'
import { type ChannelId, GUIDE_HREF } from '@/lib/lead'
import { type ReplyState, brokerWallTimeToInstant, formatClockPadded } from '@/lib/reply-time'
import { brokerHours } from '@/lib/site'
import { replyWhen, useReplyState, useVisitorZone } from './use-clock'

/** «напишет в Telegram» · «напишет на почту» · «позвонит». */
export function writesPhrase(channel: ChannelId): string {
  switch (channel) {
    case 'telegram':
      return 'напишет в Telegram'
    case 'whatsapp':
      return 'напишет в WhatsApp'
    case 'email':
      return 'напишет на почту'
    case 'phone':
      return 'позвонит'
  }
}

/** «в Telegram» · «по почте» · «по телефону» (for «подтвердит время …»). */
function viaPhrase(channel: ChannelId): string {
  switch (channel) {
    case 'telegram':
      return 'в Telegram'
    case 'whatsapp':
      return 'в WhatsApp'
    case 'email':
      return 'по почте'
    case 'phone':
      return 'по телефону'
  }
}

/** «12 ноября, 07:00 по вашему времени, на Пхукете будет 11:00» (copy-global §10.2). */
export function slotSentence(date: string, time: string, zone: string | null): string {
  const instant = brokerWallTimeToInstant(date, time)
  const tz = zone ?? brokerHours.timeZone
  const day = new Intl.DateTimeFormat('ru-RU', { day: 'numeric', month: 'long', timeZone: tz }).format(instant)
  const phuket = formatClockPadded(instant, brokerHours.timeZone)
  if (!zone) return `${day}, ${phuket} по Пхукету`
  const local = formatClockPadded(instant, zone)
  const phuketDay = new Intl.DateTimeFormat('ru-RU', { day: 'numeric', month: 'long', timeZone: brokerHours.timeZone }).format(instant)
  if (local === phuket && day === phuketDay) return `${day}, ${phuket}. У вас и на Пхукете одно время`
  return `${day}, ${local} по вашему времени, на Пхукете будет ${phuket}`
}

type BookingFormat = 'video' | 'call' | 'meeting' | 'viewing' | 'online'

function formatSentence(format: BookingFormat, channel: ChannelId, s: ReplyState | null): string {
  const when = s ? replyWhen(s) : 'в течение 15 минут'
  const writes = writesPhrase(channel)
  switch (format) {
    case 'video':
      return `Брокер ${writes} ${when}, подтвердит время и пришлёт ссылку на звонок`
    case 'call':
      return `Брокер подтвердит время ${viaPhrase(channel)} ${when} и позвонит в назначенный час`
    case 'meeting':
      return `Брокер ${writes} ${when}, подтвердит время и пришлёт адрес встречи`
    case 'viewing':
      return `Брокер ${writes} ${when}, уточнит, какие объекты показать, и пришлёт адрес встречи`
    case 'online':
      return `Брокер ${writes} ${when}, уточнит, какие объекты показать, и пришлёт ссылку на видеозвонок`
  }
}

export function BookingThanks({
  kind,
  format,
  channel,
  date,
  time,
  headingRef,
}: {
  kind: 'consultation' | 'viewing'
  format: BookingFormat
  channel: ChannelId
  date: string
  time: string
  headingRef: Ref<HTMLHeadingElement>
}) {
  const zone = useVisitorZone()
  const state = useReplyState()
  const consultation = kind === 'consultation' || format === 'video' || format === 'call'
  return (
    // `data-reveal="items"`: the lines rise in turn when the screen appears (motion late-nodes).
    <div className="flex flex-col gap-6" role="status" data-reveal="items">
      <h3 ref={headingRef} tabIndex={-1} className="type-d2">
        {consultation ? 'Записали на консультацию' : 'Записали на просмотр'}
      </h3>
      <p className="type-lead nums">{slotSentence(date, time, zone)}</p>
      <p className="type-body nums max-w-[60ch]">{formatSentence(format, channel, state)}</p>
      <p className="type-body max-w-[60ch] text-ink-muted on-ink:text-on-ink-muted">
        Если планы изменятся, ответьте брокеру в том же чате, и он предложит другое время
      </p>
      {kind === 'consultation' ? (
        <div className="mt-2 flex flex-col items-start gap-3">
          <Button href={GUIDE_HREF} variant="inverse">
            Открыть гид инвестора
          </Button>
          <p className="type-small text-on-ink-muted">Глава «Сделка по шагам» пригодится перед разговором</p>
        </div>
      ) : null}
    </div>
  )
}
