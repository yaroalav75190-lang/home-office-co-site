'use client'

import { useEffect } from 'react'
import { Button } from '@/components/ui/button'
import { TextLink } from '@/components/ui/text-link'
import { useLocale } from '@/i18n/client'
import { contacts } from '@/lib/site'

// Route error boundary (forms-gate: without it a client crash removed every form on the page).
// Header and footer stay, the visitor keeps a way to reach the broker: retry, phone, Telegram.
// Re-exported by app/(ru)/error.tsx and app/[lang]/error.tsx; it renders inside the site shell,
// so the page's language comes from <LocaleProvider>.

export function RouteError({ error, reset }: { error: Error & { digest?: string }; reset: () => void }) {
  const { t } = useLocale()
  const copy = t.errors.error

  useEffect(() => {
    console.error(JSON.stringify({ evt: 'page.error', digest: error.digest, message: error.message }))
  }, [error])

  return (
    <section
      aria-labelledby="error-title"
      className="grid-site pt-[calc(var(--header-h)+3rem)] pb-section lg:pt-[calc(var(--header-h)+5rem)]"
    >
      <div className="col-span-full lg:col-span-8">
        <h1 id="error-title" className="type-d2">
          {copy.title}
        </h1>
        <p className="type-lead mt-8 max-w-[40ch]">{copy.text}</p>
        <div className="mt-8 flex flex-wrap items-center gap-x-8 gap-y-4">
          <Button onClick={reset}>{copy.retry}</Button>
          <TextLink href={contacts.telegram.href} target="_blank" rel="noopener noreferrer" className="type-ui">
            {t.common.channels.telegram.action}
          </TextLink>
          <TextLink href={contacts.phone.href} className="type-ui nums">
            {contacts.phone.display}
          </TextLink>
        </div>
      </div>
    </section>
  )
}
