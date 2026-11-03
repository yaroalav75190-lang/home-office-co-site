import { clsx } from 'clsx'
import { contacts, type ContactChannel } from '@/lib/site'
import { MailIcon, PhoneIcon, TelegramIcon, WhatsAppIcon } from './icons'

const icons = {
  telegram: TelegramIcon,
  whatsapp: WhatsAppIcon,
  phone: PhoneIcon,
  email: MailIcon,
} as const

type MessengerLinkProps = {
  channel: ContactChannel['id']
  /** Visible word; defaults to the verb label, «Написать в Telegram» (copy-global §3). */
  label?: string
  className?: string
}

/**
 * Messenger tile (art-direction §4): sand tile, monochrome glyph and a word, 56 px.
 * On ink fields the tile is ink-raised with salt text. Hrefs come from `contacts` in `@/lib/site`.
 */
export function MessengerLink({ channel, label, className }: MessengerLinkProps) {
  const c = contacts[channel]
  const Icon = icons[channel]
  const external = c.href.startsWith('http')
  return (
    <a
      href={c.href}
      {...(external ? { target: '_blank', rel: 'noopener noreferrer' } : {})}
      className={clsx(
        'group type-ui inline-flex h-14 items-center gap-3 bg-sand px-5 text-ink',
        'on-ink:bg-ink-raised on-ink:text-salt',
        className,
      )}
    >
      <Icon size={22} className="shrink-0" />
      <span className="bg-[linear-gradient(currentColor,currentColor)] bg-[length:0_1px] bg-[position:100%_100%] bg-no-repeat pb-0.5 transition-[background-size] duration-320 ease-in-out group-hover:bg-[length:100%_1px] group-hover:bg-[position:0_100%]">
        {label ?? c.action}
      </span>
    </a>
  )
}
