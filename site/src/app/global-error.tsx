'use client'

import { contacts } from '@/lib/site'
import './globals.css'

// Last-resort boundary for a crash in the root layout itself (header, motion, smooth scroll).
// It replaces the whole document, so it carries its own <html> and only plain links.

export default function GlobalError({ reset }: { error: Error & { digest?: string }; reset: () => void }) {
  return (
    <html lang="ru">
      <body className="bg-salt text-ink">
        <main className="grid-site min-h-svh content-center py-section">
          <div className="col-span-full lg:col-span-8">
            <p className="type-ui">Home Office &amp; Co</p>
            <h1 className="type-d2 mt-6">Страница не загрузилась</h1>
            <p className="type-lead mt-8 max-w-[40ch]">
              Обновите её. Если не поможет, напишите или позвоните брокеру: ответим и пришлём то, что вы искали
            </p>
            <div className="type-ui mt-8 flex flex-wrap items-center gap-x-8 gap-y-4">
              <button type="button" onClick={reset} className="min-h-11 bg-ink px-6 text-salt">
                Обновить страницу
              </button>
              <a href={contacts.telegram.href} target="_blank" rel="noopener noreferrer" className="underline underline-offset-4">
                {contacts.telegram.action}
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
