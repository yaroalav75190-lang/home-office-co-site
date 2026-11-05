import type { Metadata } from 'next'
import { getDictionary } from '@/i18n'
import type { Locale } from '@/i18n/config'
import { fmt } from '@/i18n/format'
import { pageMetadata } from '@/lib/seo/page-meta'
import { TransitionLink as Link } from '@/components/motion/transition-link'
import { LegalList, LegalPage, LegalSection, legalDate, rich } from '@/components/sections/shared/legal'
import { contacts, site } from '@/lib/site'

// Privacy policy, promo version (DEMO_DECISIONS «Юридические тексты»): a short standard template
// under 152-ФЗ. A lawyer checks it before launch (copy-global §9, §13.10); seo-brief §6.5 wants
// /privacy indexed, so switch `robots` to index after that check. Linked from every form's consent
// line and from the footer. Words: `legal.privacy` in src/i18n/<locale>/legal.ts.

/** Edition date (03.11.2026), shown in the locale's form. */
const EDITION = '2026-11-03'

export function privacyMetadata(locale: Locale): Metadata {
  // noindex until the lawyer has checked the 152-ФЗ texts (see LEGAL_INDEXABLE in app/sitemap.ts).
  return pageMetadata({ locale, path: '/privacy', ...getDictionary(locale).meta.privacy, absoluteTitle: false, index: false })
}

const email = (
  <a href={contacts.email.href} className="link-underline">
    {contacts.email.display}
  </a>
)

export function PrivacyView({ locale }: { locale: Locale }) {
  const t = getDictionary(locale).legal
  const p = t.privacy
  return (
    <LegalPage
      id="privacy-title"
      title={p.title}
      note={t.prevailNote}
      lead={fmt(p.lead, { name: site.name })}
      edition={fmt(t.edition, { date: legalDate(EDITION, locale) })}
    >
      <LegalSection title={p.operator.title}>
        <p className="type-body">{rich(p.operator.text, { name: site.name, email })}</p>
      </LegalSection>

      <LegalSection title={p.data.title}>
        <LegalList items={p.data.items} />
        <p className="type-body">{p.data.note}</p>
      </LegalSection>

      <LegalSection title={p.purposes.title}>
        <LegalList items={p.purposes.items} />
        <p className="type-body">{p.purposes.note}</p>
      </LegalSection>

      <LegalSection title={p.storage.title}>
        <p className="type-body">{p.storage.text}</p>
      </LegalSection>

      <LegalSection title={p.retention.title}>
        <p className="type-body">{p.retention.text}</p>
      </LegalSection>

      <LegalSection title={p.rights.title}>
        <p className="type-body">{rich(p.rights.text, { email })}</p>
      </LegalSection>

      <LegalSection title={p.cookies.title}>
        <p className="type-body">{p.cookies.text}</p>
      </LegalSection>

      <LegalSection title={p.consent.title}>
        <p className="type-body">
          {rich(p.consent.text, {
            link: (
              <Link href="/consent" className="link-underline">
                {p.consent.link}
              </Link>
            ),
          })}
        </p>
      </LegalSection>
    </LegalPage>
  )
}
