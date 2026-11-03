import { clsx } from 'clsx'
import type { ReactNode } from 'react'

export type Stat = {
  /** Figure, D2: «5+», «100+», «15», «4». */
  value: string
  /** Unit, Lead, on the figure's baseline: «лет», «клиентов», «минут», «страны». */
  unit: string
  /** Phrase under the figure, Body ink-muted. */
  text?: ReactNode
  /** Extra line under the phrase, e.g. `<ReplyTime />` under «15 минут». */
  after?: ReactNode
}

/**
 * Row of figures (art-direction §4): four cells of three columns, 2×2 under 1024 px.
 * No dividers, icons or counters; figures never animate. Place inside a `grid-site` container.
 */
export function StatRow({ items, className }: { items: Stat[]; className?: string }) {
  return (
    <ul role="list" className={clsx('col-span-full grid grid-cols-subgrid gap-y-12', className)}>
      {items.map((item) => (
        <li key={`${item.value}-${item.unit}`} className="col-span-2 md:col-span-4 lg:col-span-3">
          <p className="flex flex-wrap items-baseline gap-x-2">
            <span className="type-d2 nums">{item.value}</span>
            <span className="type-lead">{item.unit}</span>
          </p>
          {item.text ? (
            <p className="type-body mt-4 max-w-[28ch] text-ink-muted on-ink:text-on-ink-muted">{item.text}</p>
          ) : null}
          {item.after ? <div className="mt-3">{item.after}</div> : null}
        </li>
      ))}
    </ul>
  )
}
