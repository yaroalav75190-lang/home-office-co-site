'use client'

import { usePathname } from 'next/navigation'
import { stripLocale } from '@/i18n/config'
import { errors as enErrors } from '@/i18n/en/errors'
import { errors as esErrors } from '@/i18n/es/errors'
import { errors as ruErrors } from '@/i18n/ru/errors'
import { contacts } from '@/lib/site'
import './globals.css'

// Last-resort boundary for a crash in a root layout itself (header, motion, smooth scroll). It
// replaces the whole document, so it carries its own <html> and only plain links. There is one
// for all locales (app/(ru) and app/[lang] are both root layouts): the language comes from the
// URL prefix, and only the small `errors` dictionaries are bundled here.

const copy = { ru: ruErrors.error, en: enErrors.error, es: esErrors.error }

export default function GlobalError({ reset }: { error: Error & { digest?: string }; reset: () => void }) {
  const { locale } = stripLocale(usePathname())
  const t = copy[locale]
  return (
    <html lang={locale}>
      <body className="bg-salt text-ink">
        <main className="grid-site min-h-svh content-center py-section">
          <div className="col-span-full lg:col-span-8">
            <p className="type-ui">Home Office &amp; Co</p>
            <h1 className="type-d2 mt-6">{t.title}</h1>
            <p className="type-lead mt-8 max-w-[40ch]">{t.text}</p>
            <div className="type-ui mt-8 flex flex-wrap items-center gap-x-8 gap-y-4">
              <button type="button" onClick={reset} className="min-h-11 bg-ink px-6 text-salt">
                {t.retry}
              </button>
              <a href={contacts.telegram.href} target="_blank" rel="noopener noreferrer" className="underline underline-offset-4">
                {t.telegram}
              </a>
              <a href={contacts.phone.href} className="nums underline underline-offset-4">
                {contacts.phone.display}
              </a>
            </div>
          </div>
        </main>
      </body>
    </html>
  )
}
