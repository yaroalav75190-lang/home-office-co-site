import { Fragment, type ReactNode } from 'react'

/**
 * Fills the `{name}` placeholders of a dictionary template with strings or React nodes (a link,
 * the e-mail link): rich('Напишите на {email}.', { email: <a …>…</a> }). The text around them stays
 * exactly as written; unknown placeholders stay as written too. Works in Server and Client Components.
 */
export function rich(template: string, values: Record<string, ReactNode>): ReactNode {
  return template
    .split(/(\{\w+\})/)
    .filter((part) => part !== '')
    .map((part, i) => {
      const name = /^\{(\w+)\}$/.exec(part)?.[1]
      return name !== undefined && name in values ? <Fragment key={i}>{values[name]}</Fragment> : part
    })
}
