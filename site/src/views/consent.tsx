import type { Metadata } from 'next'
import { getDictionary } from '@/i18n'
import type { Locale } from '@/i18n/config'
import { fmt } from '@/i18n/format'
import { pageMetadata } from '@/lib/seo/page-meta'
import { TransitionLink as Link } from '@/components/motion/transition-link'
import { LegalList, LegalPage, LegalSection, legalDate, rich } from '@/components/sections/shared/legal'
import { contacts, site } from '@/lib/site'

// Consent under 152-ФЗ, promo version (DEMO_DECISIONS «Юридические тексты»). Since 1 Sept 2025 the
// consent is a separate document (copy-global §9). A lawyer checks it before launch (§13.10); index
// it after that check. Linked from the consent checkbox of every form. Words: `legal.consent` in
// src/i18n/<locale>/legal.ts.

/** Edition date (03.11.2026), shown in the locale's form. */
const EDITION = '2026-11-03'

export function consentMetadata(locale: Locale): Metadata {
  // noindex until the lawyer has checked the 152-ФЗ texts (see LEGAL_INDEXABLE in app/sitemap.ts).
  return pageMetadata({ locale, path: '/consent', ...getDictionary(locale).meta.consent, absoluteTitle: false, index: false })
}

const email = (
  <a href={contacts.email.href} className="link-underline">
    {contacts.email.display}
  </a>
)

export function ConsentView({ locale }: { locale: Locale }) {
  const t = getDictionary(locale).legal
  const c = t.consent
  return (
    <LegalPage
      id="consent-title"
      title={c.title}
      note={t.prevailNote}
      lead={fmt(c.lead, { name: site.name })}
      edition={fmt(t.edition, { date: legalDate(EDITION, locale) })}
    >
      <LegalSection title={c.operator.title}>
        <p className="type-body">{rich(c.operator.text, { name: site.name, email })}</p>
      </LegalSection>

      <LegalSection title={c.data.title}>
        <LegalList items={c.data.items} />
      </LegalSection>

      <LegalSection title={c.purposes.title}>
        <LegalList items={c.purposes.items} />
      </LegalSection>

      <LegalSection title={c.processing.title}>
        <p className="type-body">{c.processing.text}</p>
      </LegalSection>

      <LegalSection title={c.term.title}>
        <p className="type-body">{c.term.text}</p>
      </LegalSection>

      <LegalSection title={c.withdrawal.title}>
        <p className="type-body">{rich(c.withdrawal.text, { email })}</p>
      </LegalSection>

      <LegalSection title={c.more.title}>
        <p className="type-body">
          {rich(c.more.text, {
            link: (
              <Link href="/privacy" className="link-underline">
                {c.more.link}
              </Link>
            ),
          })}
        </p>
      </LegalSection>
    </LegalPage>
  )
}
