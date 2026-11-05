'use client'

// Thank-you screens for bookings (copy-global §10.2 consultation, §10.3 viewing). Shown only
// after `submitLead` resolved `{ ok: true }`. Words: `forms.thanks` of the page's dictionary.

import type { Ref } from 'react'
import { Button } from '@/components/ui/button'
import { useLocale } from '@/i18n/client'
import type { Locale } from '@/i18n/config'
import { fmt } from '@/i18n/format'
import type { FormsDict } from '@/i18n/ru/forms'
import { type ChannelId, GUIDE_HREF } from '@/lib/lead'
import { brokerWallTimeToInstant, formatClockPadded, formatDayMonth } from '@/lib/reply-time'
import { brokerHours } from '@/lib/site'
import { replyWhen, useReplyState, useVisitorZone } from './use-clock'

/** «12 ноября, 07:00 по вашему времени, на Пхукете будет 11:00» (copy-global §10.2). */
export function slotSentence(date: string, time: string, zone: string | null, f: FormsDict, locale: Locale): string {
  const t = f.thanks
  const instant = brokerWallTimeToInstant(date, time)
  const tz = zone ?? brokerHours.timeZone
  const day = formatDayMonth(instant, tz, locale)
  const phuket = formatClockPadded(instant, brokerHours.timeZone, locale)
  if (!zone) return fmt(t.slotPhuket, { day, phuket })
  const local = formatClockPadded(instant, zone, locale)
  const phuketDay = formatDayMonth(instant, brokerHours.timeZone, locale)
  if (local === phuket && day === phuketDay) return fmt(t.slotSameZone, { day, phuket })
  return fmt(t.slotLocal, { day, local, phuket })
}

type BookingFormat = 'video' | 'call' | 'meeting' | 'viewing' | 'online'

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
  const { locale, t } = useLocale()
  const f = t.forms
  const zone = useVisitorZone()
  const state = useReplyState()
  const consultation = kind === 'consultation' || format === 'video' || format === 'call'
  const when = state ? replyWhen(state, t.common.reply) : t.common.reply.when.fallback
  const sentence = fmt(f.thanks.formats[format], { writes: f.thanks.writes[channel], via: f.thanks.via[channel], when })
  return (
    // `data-reveal="items"`: the lines rise in turn when the screen appears (motion late-nodes).
    <div className="flex flex-col gap-6" role="status" data-reveal="items">
      <h3 ref={headingRef} tabIndex={-1} className="type-d2">
        {consultation ? f.thanks.consultationTitle : f.thanks.viewingTitle}
      </h3>
      <p className="type-lead nums">{slotSentence(date, time, zone, f, locale)}</p>
      <p className="type-body nums max-w-[60ch]">{sentence}</p>
      <p className="type-body max-w-[60ch] text-ink-muted on-ink:text-on-ink-muted">{f.thanks.change}</p>
      {kind === 'consultation' ? (
        <div className="mt-2 flex flex-col items-start gap-3">
          <Button href={GUIDE_HREF} variant="inverse">
            {f.thanks.guideCta}
          </Button>
          <p className="type-small text-on-ink-muted">{f.thanks.guideNote}</p>
        </div>
      ) : null}
    </div>
  )
}
