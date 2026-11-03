import type { Metadata } from 'next'
import { TransitionLink as Link } from '@/components/motion/transition-link'
import { LegalList, LegalPage, LegalSection } from '@/components/sections/shared/legal'
import { contacts, site } from '@/lib/site'

// Consent under 152-ФЗ, promo version (DEMO_DECISIONS «Юридические тексты»). Since 1 Sept 2025 the
// consent is a separate document (copy-global §9). A lawyer checks it before launch (§13.10); index
// it after that check. Linked from the consent checkbox of every form.

const EDITION = '03.11.2026'

export const metadata: Metadata = {
  title: 'Согласие на обработку персональных данных',
  description: 'Согласие на обработку персональных данных для заявок на сайте Home Office & Co.',
  robots: { index: false, follow: true },
  alternates: { canonical: '/consent' },
}

const email = (
  <a href={contacts.email.href} className="link-underline">
    {contacts.email.display}
  </a>
)

export default function ConsentPage() {
  return (
    <LegalPage
      id="consent-title"
      title="Согласие на обработку персональных данных"
      lead={`Отмечая согласие в форме на сайте, вы свободно, своей волей и в своём интересе разрешаете агентству ${site.name} обрабатывать ваши персональные данные на условиях ниже.`}
      edition={EDITION}
    >
      <LegalSection title="1. Оператор">
        <p className="type-body">
          Агентство недвижимости {site.name}. Реквизиты для договора отправляем по запросу, почта для вопросов о данных:{' '}
          {email}.
        </p>
      </LegalSection>

      <LegalSection title="2. Какие данные">
        <LegalList
          items={[
            'имя;',
            'телефон, ник или номер в мессенджере, адрес почты: тот контакт, который вы указали;',
            'ответы в квизе и формах записи: направление и район, цель, бюджет, срок, формат, дата и время встречи, комментарий;',
            'технические данные заявки: страница, с которой она отправлена, источник перехода, метки рекламной кампании, идентификаторы cookie систем аналитики.',
          ]}
        />
      </LegalSection>

      <LegalSection title="3. Цели">
        <LegalList
          items={[
            'связаться с вами по заявке в выбранный канал;',
            'подобрать объекты недвижимости и прислать подборку;',
            'записать на консультацию или просмотр;',
            'прислать гид инвестора, если вы его запросили.',
          ]}
        />
      </LegalSection>

      <LegalSection title="4. Что делаем с данными">
        <p className="type-body">
          Собираем, записываем, систематизируем, храним в CRM-системе агентства, уточняем, используем для ответа и подбора,
          передаём брокерам агентства, которые ведут заявку, удаляем и уничтожаем. Обработка идёт с использованием средств
          автоматизации и без них.
        </p>
      </LegalSection>

      <LegalSection title="5. Срок">
        <p className="type-body">
          Согласие действует, пока данные нужны для целей из раздела 3, но не дольше 3 лет с последнего обращения, или до
          отзыва.
        </p>
      </LegalSection>

      <LegalSection title="6. Как отозвать согласие">
        <p className="type-body">
          Напишите на {email} с того контакта, который указали в заявке. Данные удалим в течение 30 дней с получения отзыва.
        </p>
      </LegalSection>

      <LegalSection title="7. Подробнее">
        <p className="type-body">
          Как храним и используем данные, написано в{' '}
          <Link href="/privacy" className="link-underline">
            политике конфиденциальности
          </Link>
          .
        </p>
      </LegalSection>
    </LegalPage>
  )
}
