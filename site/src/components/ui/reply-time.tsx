'use client'

import { clsx } from 'clsx'
import { useSyncExternalStore } from 'react'
import { useLocale } from '@/i18n/client'
import { type ReplyVariant, replyConfig, replyTimeInstanceScript, replyTimeText, subscribeClock, visitorTimeZone } from '@/lib/reply-time'
import { InlineScript } from './inline-script'

type ReplyTimeProps = {
  /** In-hours sentence before «до HH:MM» (full variant), e.g. «Брокер пришлёт 2–3 варианта». Default: `common.reply.lead`. */
  lead?: string
  /** `full` (default) under buttons; `short` «Ответим до 16:55» for the menu and narrow columns. */
  variant?: ReplyVariant
  /**
   * Reserve two lines of height so the line never pushes content when it changes between the
   * in-hours and out-of-hours wording (copy-global §5, rule 2). Default: on for `full`.
   */
  reserve?: boolean
  as?: 'p' | 'span' | 'div'
  className?: string
}

/**
 * «Напишите сейчас, и брокер ответит до 16:55», laterite (laterite-on-ink on ink fields). Words and
 * time format follow the page's locale (`common.reply`).
 *
 * - Hard load: an inline script fills the line during HTML parsing, so the first paint already
 *   shows the visitor's time and nothing swaps after hydration (no CLS).
 * - No JS: «Отвечаем в течение 15 минут» in the same reserved box.
 * - Client navigation: computed on render; refreshed every 30 s and when the tab is shown again.
 */
export function ReplyTime({ lead, variant = 'full', reserve, as: Tag = 'p', className }: ReplyTimeProps) {
  const { locale, t } = useLocale()
  const texts = t.common.reply
  const config = replyConfig({ texts, locale, lead, variant })
  const text = useSyncExternalStore(
    subscribeClock,
    () => replyTimeText(Date.now(), visitorTimeZone(), config) ?? texts.fallback,
    () => null,
  )
  const reserveSpace = reserve ?? variant === 'full'

  return (
    <Tag
      className={clsx(
        'type-small nums text-laterite on-ink:text-laterite-on-ink',
        reserveSpace && 'min-h-[2.8em]',
        Tag === 'span' && 'inline-block',
        className,
      )}
    >
      <span suppressHydrationWarning>{text ?? texts.fallback}</span>
      <InlineScript html={replyTimeInstanceScript(config)} />
    </Tag>
  )
}
