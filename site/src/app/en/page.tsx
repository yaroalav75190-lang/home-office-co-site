import type { Metadata } from 'next'
import { Button } from '@/components/ui/button'
import { TextLink } from '@/components/ui/text-link'
import { contacts } from '@/lib/site'
import { EnglishReplyLine } from './reply-line'

// One English stub page (copy-global §12; BUILD_PLAN decision 6): noindex, no hreflang until the
// English pages exist. The root layout sets <html lang="ru">; this page's content carries lang="en".

const TITLE = 'English site coming soon | Home Office & Co'
const DESCRIPTION =
  'Home Office & Co helps buyers find property in Phuket, Pattaya, Bali, Dubai and Cambodia. The English site is in progress. Message a broker in the meantime.'

export const metadata: Metadata = {
  title: { absolute: TITLE },
  description: DESCRIPTION,
  robots: { index: false, follow: true },
  openGraph: { title: TITLE, description: DESCRIPTION, locale: 'en_US', url: '/en', siteName: 'Home Office & Co' },
}

export default function EnglishPage() {
  return (
    <div lang="en">
      <section
        data-hero=""
        aria-labelledby="en-title"
        className="grid-site pt-[calc(var(--header-h)+3rem)] pb-section lg:pt-[calc(var(--header-h)+5rem)]"
      >
        <h1 id="en-title" data-hero-title="" className="type-d1 col-span-full">
          <span className="block">English site</span>{' '}
          <span className="block pl-[22vw] md:pl-[calc((100%+var(--grid-gutter))/4)] lg:pl-[calc((100%+var(--grid-gutter))/3)]">
            coming soon
          </span>
        </h1>
        <div className="col-span-full mt-10 md:col-span-6 lg:col-span-5 lg:mt-16">
          <p className="type-lead max-w-[40ch]">
            {/* No promise of an English-speaking broker until the client confirms it (copy-round2 §5). */}
            We are preparing the English version of the site. In the meantime, message a broker on Telegram, WhatsApp or by
            phone.
          </p>
          <div className="mt-8 flex flex-wrap items-center gap-x-8 gap-y-4">
            <Button href={contacts.telegram.href} target="_blank" rel="noopener noreferrer">
              Message us on Telegram
            </Button>
            <TextLink href="/" lang="ru" className="type-ui">
              Русская версия
            </TextLink>
          </div>
          <EnglishReplyLine />
        </div>
      </section>
    </div>
  )
}
