import { Button } from '@/components/ui/button'
import { Figure } from '@/components/ui/figure'
import { ReplyTime } from '@/components/ui/reply-time'
import { hero } from './content'

/**
 * Home hero (art-direction §6 «Главная» 1).
 *
 * Desktop (≥1024): stepped D1 title — «Недвижимость» from column 1 with its baseline near 26 % of
 * the viewport, «в Таиланде» from column 5 one line lower. Lead, button and reply line sit in
 * columns 1–4 under the first line, to the left of the indented second line. The villa print 4:5
 * hangs in columns 10–12 under the end of the second line (with «в Таиланде» the second line
 * reaches column 11, so the print cannot sit beside it). The 21:9 panorama starts under the Lead
 * block inside the margins (columns 1–8, next to the print), so it is on the first screen;
 * motion widens it to 100vw × 100svh on scroll.
 * Mobile: print on the right above the title, second line indented 22vw, panorama 4:5.
 *
 * Motion hooks: `data-hero` (section), `data-hero-title` (h1), `data-hero-print`,
 * `data-hero-panorama`. Nothing here carries `data-reveal`: h1 and panorama are visible without JS.
 */
export function HomeHero() {
  const [line1, line2] = hero.titleLines
  return (
    <section data-hero="" aria-labelledby="home-title" className="grid-site pt-header">
      <h1
        id="home-title"
        data-hero-title=""
        className="type-d1 col-span-full mt-8 md:mt-12 lg:row-start-1 lg:mt-[max(1rem,calc(26svh_-_var(--header-h)_-_0.84*var(--text-d1)))]"
      >
        <span className="block">{line1}</span>{' '}
        <span className="block pl-[22vw] md:pl-[calc((100%+var(--grid-gutter))/4)] lg:pl-[calc((100%+var(--grid-gutter))/3)]">
          {line2}
        </span>
      </h1>

      <div className="col-span-full mt-8 md:col-span-5 lg:col-span-4 lg:row-start-2 lg:mt-[calc(3rem_-_0.92*var(--text-d1))]">
        <p className="type-lead max-w-[36ch]">{hero.lead}</p>
        <div className="mt-6 md:mt-8">
          <Button href={hero.cta.href}>{hero.cta.label}</Button>
        </div>
        <ReplyTime className="mt-3 max-w-[40ch] md:mt-4" />
      </div>

      <div
        data-hero-print=""
        className="col-span-2 col-start-3 -order-1 mt-4 md:col-span-3 md:col-start-6 md:mt-8 lg:order-none lg:col-span-3 lg:col-start-10 lg:row-span-2 lg:row-start-2 lg:mt-12 lg:self-start"
      >
        <Figure
          photo="villa"
          ratio="4x5"
          preload
          sizes="(min-width: 100rem) 380px, (min-width: 64rem) 24vw, (min-width: 48rem) 36vw, 46vw"
          caption={hero.printCaption}
        />
      </div>

      <div data-hero-panorama="" className="col-span-full mt-12 md:mt-16 lg:col-span-8 lg:row-start-3 lg:mt-16">
        <Figure
          photo="hero"
          ratio="21x9"
          mobileRatio="4x5"
          preload
          sizes="(min-width: 100rem) 1000px, (min-width: 64rem) 64vw, 94vw"
          caption={hero.panoramaCaption}
        />
      </div>
    </section>
  )
}
