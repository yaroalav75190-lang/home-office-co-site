'use client'

import { clsx } from 'clsx'
import { useEffect, useState } from 'react'

/**
 * Sticky list of the six stages (art-direction §6 `/services/deal` 2, columns 1–4, from 1024 px).
 * The stage in the middle of the viewport is marked (ink, `aria-current="step"`), the rest are
 * ink-muted. Links jump to the stage. Without JS: a plain list of links.
 * Words come as props from the server view (`deal.stages.navLabel`, `deal.stages.items[].nav`).
 */
export function StageNav({ label, items }: { label: string; items: { id: string; label: string }[] }) {
  const [active, setActive] = useState(items[0]?.id)

  useEffect(() => {
    const targets = items.map((i) => document.getElementById(i.id)).filter((el): el is HTMLElement => Boolean(el))
    if (!targets.length) return
    const io = new IntersectionObserver(
      (entries) => {
        const visible = entries.filter((e) => e.isIntersecting).sort((a, b) => a.boundingClientRect.top - b.boundingClientRect.top)
        if (visible[0]) setActive(visible[0].target.id)
      },
      { rootMargin: '-35% 0px -60% 0px' },
    )
    targets.forEach((t) => io.observe(t))
    return () => io.disconnect()
  }, [items])

  return (
    <nav aria-label={label} className="sticky top-[calc(var(--header-h)+2rem)]">
      <ol role="list" className="flex flex-col gap-3">
        {items.map((item) => {
          const current = item.id === active
          return (
            <li key={item.id}>
              <a
                href={`#${item.id}`}
                aria-current={current ? 'step' : undefined}
                className={clsx(
                  'type-ui inline-flex min-h-11 items-center transition-colors duration-160',
                  current ? 'text-ink' : 'text-ink-muted hover:text-ink',
                )}
              >
                <span className={clsx('link-reveal', current && 'bg-[length:100%_1px] bg-[position:0_100%]')}>{item.label}</span>
              </a>
            </li>
          )
        })}
      </ol>
    </nav>
  )
}
