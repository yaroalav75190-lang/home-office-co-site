// Monochrome glyphs drawn for this project (24×24, currentColor). Not brand logos: simplified
// signs for messengers and actions. The only stroked lines are the functional chevron and check
// (art-direction §3.5, §4: FAQ chevron 2 px, checkbox mark).
import type { ReactNode, SVGProps } from 'react'

type IconProps = Omit<SVGProps<SVGSVGElement>, 'children'> & { size?: number }

function Svg({ size = 24, ...props }: IconProps & { children: ReactNode }) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="currentColor"
      aria-hidden="true"
      focusable="false"
      {...props}
    />
  )
}

export function TelegramIcon(props: IconProps) {
  return (
    <Svg {...props}>
      <path d="M21.6 3.2 2.4 10.6c-.8.3-.8 1.4 0 1.7l4.7 1.6 1.8 5.6c.2.6 1 .8 1.5.4l2.7-2.3 4.5 3.3c.6.4 1.4.1 1.5-.6l3.3-15.6c.2-.9-.6-1.6-1.4-1.3Zm-4 4.4-7.9 7.4-.4 3.3-1.4-4.6 9.4-6.4c.2-.1.4.1.3.3Z" />
    </Svg>
  )
}

export function WhatsAppIcon(props: IconProps) {
  return (
    <Svg {...props}>
      <path
        fillRule="evenodd"
        d="M12 2.2a9.8 9.8 0 0 0-8.4 14.8L2.2 21.8l4.9-1.3A9.8 9.8 0 1 0 12 2.2Zm0 1.8a8 8 0 1 1-4.1 14.9l-.3-.2-2.9.8.8-2.8-.2-.3A8 8 0 0 1 12 4Z"
      />
      <path d="M9.1 7.4c-.2-.4-.4-.4-.6-.4h-.5c-.2 0-.5.1-.8.4-.3.3-1 1-1 2.4s1 2.8 1.2 3c.1.2 2 3.2 5 4.4 2.5 1 3 .8 3.5.7.5-.1 1.7-.7 2-1.4.2-.7.2-1.3.2-1.4-.1-.1-.3-.2-.5-.3l-1.9-.9c-.3-.1-.4-.1-.6.1l-.9 1.1c-.2.2-.3.2-.6.1-.3-.1-1.1-.4-2.2-1.4-.8-.7-1.4-1.6-1.5-1.9-.2-.3 0-.4.1-.5l.4-.5.3-.5c.1-.2 0-.3 0-.5l-.9-2.1Z" />
    </Svg>
  )
}

export function PhoneIcon(props: IconProps) {
  return (
    <Svg {...props}>
      <path d="M7.2 2.8h2.7c.4 0 .8.3.9.7l1 3.6c.1.4 0 .8-.3 1L9.8 9.5a12.4 12.4 0 0 0 4.7 4.7l1.4-1.7c.3-.3.7-.4 1-.3l3.6 1c.4.1.7.5.7.9v2.7c0 1.4-1.1 2.5-2.5 2.4A15.8 15.8 0 0 1 4.8 5.3c-.1-1.4 1-2.5 2.4-2.5Z" />
    </Svg>
  )
}

export function MailIcon(props: IconProps) {
  return (
    <Svg {...props}>
      <path
        fillRule="evenodd"
        d="M3 5h18v14H3V5Zm2 2.6V17h14V7.6l-7 5-7-5Zm12.6-.8H6.4L12 10.8l5.6-4Z"
      />
    </Svg>
  )
}

export function AlertIcon(props: IconProps) {
  return (
    <Svg {...props}>
      <path fillRule="evenodd" d="M12 3a9 9 0 1 0 0 18 9 9 0 0 0 0-18Zm-1 4.5h2V14h-2V7.5Zm0 8h2v2h-2v-2Z" />
    </Svg>
  )
}

/** FAQ / select chevron, 2 px stroke. */
export function ChevronIcon(props: IconProps) {
  return (
    <Svg {...props} fill="none">
      <path d="M5 9l7 7 7-7" stroke="currentColor" strokeWidth={2} vectorEffect="non-scaling-stroke" />
    </Svg>
  )
}

/** Checkbox mark, 2 px stroke. */
export function CheckIcon(props: IconProps) {
  return (
    <Svg {...props} fill="none">
      <path d="M5.5 12.5l4 4 9-9" stroke="currentColor" strokeWidth={2} vectorEffect="non-scaling-stroke" />
    </Svg>
  )
}
