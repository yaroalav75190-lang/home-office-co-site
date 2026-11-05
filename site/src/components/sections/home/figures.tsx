import { ReplyTime } from '@/components/ui/reply-time'
import { type Stat, StatRow } from '@/components/ui/stat-row'
import { getDictionary } from '@/i18n'
import type { Locale } from '@/i18n/config'

// copy-home §2. Figures never animate (art-direction §5), so no motion hooks here.
// The figures are facts and stay here; unit and phrase come from `home.figures.stats` by the same key.
// Year in the experience phrase: DEMO_DECISIONS «Год открытия» (the client confirms before launch).
const values = { experience: '5+', clients: '100+', reply: '15', countries: '4' } as const

/** Row of figures under the first screen (art-direction §6 «Главная» 2, §4 «Ряд цифр»). */
export function HomeFigures({ locale }: { locale: Locale }) {
  const figures = getDictionary(locale).home.figures
  const { stats } = figures
  const items: Stat[] = [
    { value: values.experience, unit: stats.experience.unit, text: stats.experience.text },
    { value: values.clients, unit: stats.clients.unit, text: stats.clients.text },
    {
      value: values.reply,
      unit: stats.reply.unit,
      text: stats.reply.text,
      after: <ReplyTime variant="short" />,
    },
    { value: values.countries, unit: stats.countries.unit, text: stats.countries.text },
  ]
  return (
    <section aria-labelledby="home-figures" className="grid-site pt-section">
      <h2 id="home-figures" className="sr-only">
        {figures.title}
      </h2>
      <StatRow items={items} />
    </section>
  )
}
