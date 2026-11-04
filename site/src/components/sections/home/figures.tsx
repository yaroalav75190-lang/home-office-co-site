import { ReplyTime } from '@/components/ui/reply-time'
import { type Stat, StatRow } from '@/components/ui/stat-row'
import { figures } from './content'

// copy-home §2. Figures never animate (art-direction §5), so no motion hooks here.
const items: Stat[] = [
  {
    value: '5+',
    unit: 'лет',
    // Year: DEMO_DECISIONS «Год открытия» (the client confirms before launch).
    text: 'опыт наших специалистов на международных рынках. Само агентство открылось в 2026 году',
  },
  { value: '100+', unit: 'клиентов', text: 'у наших специалистов за эти годы' },
  {
    value: '15',
    unit: 'минут',
    text: 'время ответа брокера на заявку в рабочие часы',
    after: <ReplyTime variant="short" />,
  },
  { value: '4', unit: 'страны', text: 'Таиланд, Индонезия (Бали), ОАЭ (Дубай) и Камбоджа' },
]

/** Row of figures under the first screen (art-direction §6 «Главная» 2, §4 «Ряд цифр»). */
export function HomeFigures() {
  return (
    <section aria-labelledby="home-figures" className="grid-site pt-section">
      <h2 id="home-figures" className="sr-only">
        {figures.title}
      </h2>
      <StatRow items={items} />
    </section>
  )
}
