import { Figure } from '@/components/ui/figure'
import { TextLink } from '@/components/ui/text-link'
import { phuketPage } from './content'
import { typo } from './text'

const { pattaya } = phuketPage

/**
 * Pattaya (art-direction §6 block 6): pattaya.jpg 3:2 in columns 1–7, the D3 line (an h2 by
 * markup), a sentence and the link in 9–12, standing on the photo's bottom edge.
 * Pattaya is not on Phuket, so its caption has no locator.
 */
export function PattayaTeaser() {
  return (
    <section aria-labelledby="pattaya-title" className="grid-site gap-y-10 pt-section lg:items-end">
      <div data-reveal="clip" className="col-span-full md:col-span-6 lg:col-span-7">
        <Figure
          photo="pattaya"
          ratio="3x2"
          sizes="(min-width: 64rem) 58vw, (min-width: 48rem) 75vw, 100vw"
          caption={pattaya.caption}
        />
      </div>
      <div data-reveal="fade" className="col-span-full md:col-span-6 lg:col-span-4 lg:col-start-9 lg:pb-10">
        <h2 id="pattaya-title" className="type-d3 max-w-[18ch]">
          {typo(pattaya.title)}
        </h2>
        <p className="type-body mt-6 max-w-[40ch]">{typo(pattaya.text)}</p>
        <p className="type-ui mt-8">
          <TextLink href={pattaya.link.href}>{pattaya.link.label}</TextLink>
        </p>
      </div>
    </section>
  )
}
