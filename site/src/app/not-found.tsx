import type { Metadata } from 'next'
import { Coast } from '@/components/coast'
import { Button } from '@/components/ui/button'
import { ReplyTime } from '@/components/ui/reply-time'
import { TextLink } from '@/components/ui/text-link'

// 404 (copy-global §11): real 404 status, noindex (Next.js adds both for not-found), no curtain.

export const metadata: Metadata = {
  title: { absolute: 'Страница не найдена | Home Office & Co' },
  robots: { index: false, follow: true },
}

const links = [
  { label: 'Недвижимость на Пхукете', href: '/thailand/phuket' },
  { label: 'Сопровождение сделки', href: '/services/deal' },
  { label: 'Подбор объекта', href: '/podbor' },
  { label: 'Контакты', href: '/contacts' },
  { label: 'На главную', href: '/' },
]

export default function NotFound() {
  return (
    <section
      data-hero=""
      aria-labelledby="nf-title"
      className="grid-site pt-[calc(var(--header-h)+3rem)] pb-section lg:pt-[calc(var(--header-h)+5rem)]"
    >
      <div className="col-span-full lg:col-span-8">
        <h1 id="nf-title" className="type-d1">
          <span className="block">Такой бухты</span>{' '}
          <span className="block pl-[22vw] md:pl-[calc((100%+var(--grid-gutter))/4)] lg:pl-[calc((100%+var(--grid-gutter))/8*3)]">
            нет на карте
          </span>
        </h1>
        <p className="type-lead mt-10 max-w-[40ch]">Страницы по этому адресу нет. Ссылка устарела или в адресе опечатка</p>
        <div className="mt-8">
          <Button href="/podbor">Подобрать объект</Button>
        </div>
        <ReplyTime className="mt-3 max-w-[40ch]" />
        <nav aria-label="Разделы сайта" className="mt-12">
          <ul role="list" className="type-ui flex flex-wrap gap-x-8 gap-y-3">
            {links.map((l) => (
              <li key={l.href}>
                <TextLink href={l.href}>{l.label}</TextLink>
              </li>
            ))}
          </ul>
        </nav>
      </div>
      <div className="col-span-full mt-16 hidden h-[60svh] justify-center text-laterite lg:col-span-3 lg:col-start-10 lg:mt-0 lg:flex">
        <Coast id="phuket-island" lod="mid" decorative className="h-full w-auto" data-coast-draw="" />
      </div>
    </section>
  )
}
