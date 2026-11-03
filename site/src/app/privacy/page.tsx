import type { Metadata } from 'next'
import { TransitionLink as Link } from '@/components/motion/transition-link'
import { LegalList, LegalPage, LegalSection } from '@/components/sections/shared/legal'
import { contacts, site } from '@/lib/site'

// Privacy policy, promo version (DEMO_DECISIONS «Юридические тексты»): a short standard template
// under 152-ФЗ. A lawyer checks it before launch (copy-global §9, §13.10); seo-brief §6.5 wants
// /privacy indexed, so switch `robots` to index after that check. Linked from every form's consent
// line and from the footer.

const EDITION = '03.11.2026'

export const metadata: Metadata = {
  title: 'Политика конфиденциальности',
  description:
    'Какие персональные данные собирает сайт Home Office & Co, зачем, где хранит, сколько и как отозвать согласие.',
  robots: { index: false, follow: true },
  alternates: { canonical: '/privacy' },
}

const email = (
  <a href={contacts.email.href} className="link-underline">
    {contacts.email.display}
  </a>
)

export default function PrivacyPage() {
  return (
    <LegalPage
      id="privacy-title"
      title="Политика конфиденциальности"
      lead={`Как ${site.name} обрабатывает персональные данные тех, кто заходит на сайт и оставляет заявку.`}
      edition={EDITION}
    >
      <LegalSection title="1. Кто обрабатывает данные">
        <p className="type-body">
          Оператор персональных данных: агентство недвижимости {site.name}. Реквизиты для договора отправляем по запросу.
          Вопросы о данных принимаем на почту {email}.
        </p>
      </LegalSection>

      <LegalSection title="2. Какие данные собираем">
        <LegalList
          items={[
            'имя;',
            'контакт, который вы указали: телефон, ник или номер в Telegram, номер WhatsApp или почту;',
            'ответы в формах: направление и район, цель покупки, бюджет, срок, формат, дата и время встречи, комментарий;',
            'технические данные заявки: страницу, с которой она отправлена, источник перехода, метки рекламной кампании и идентификаторы cookie систем аналитики.',
          ]}
        />
        <p className="type-body">Паспортные данные и данные банковских карт на сайте не собираем.</p>
      </LegalSection>

      <LegalSection title="3. Зачем">
        <LegalList
          items={[
            'чтобы ответить на заявку в канал, который вы выбрали;',
            'чтобы подобрать объекты недвижимости и прислать подборку;',
            'чтобы записать вас на консультацию или просмотр;',
            'чтобы прислать гид инвестора, если вы его запросили;',
            'чтобы считать посещения и понимать, какие страницы полезны. Эти данные обезличены.',
          ]}
        />
        <p className="type-body">
          Рассылок, о которых вы не просили, не отправляем. Данные не продаём и не передаём другим компаниям для рекламы.
        </p>
      </LegalSection>

      <LegalSection title="4. Где храним">
        <p className="type-body">
          Заявки хранятся в CRM-системе агентства. Уведомление о новой заявке приходит брокерам агентства в Telegram. Доступ к
          данным есть только у сотрудников, которые ведут вашу заявку.
        </p>
      </LegalSection>

      <LegalSection title="5. Сколько храним">
        <p className="type-body">
          Пока данные нужны для ответа на заявку, подбора и сопровождения сделки, но не дольше 3 лет с последнего обращения.
          После этого или после отзыва согласия данные удаляем.
        </p>
      </LegalSection>

      <LegalSection title="6. Ваши права и отзыв согласия">
        <p className="type-body">
          Вы можете узнать, какие данные о вас хранятся, попросить исправить или удалить их и отозвать согласие на обработку.
          Напишите на {email} с того контакта, который указали в заявке. Ответим в течение 10 рабочих дней, после отзыва
          согласия удалим данные в течение 30 дней.
        </p>
      </LegalSection>

      <LegalSection title="7. Cookie и аналитика">
        <p className="type-body">
          Сайт использует cookie и Яндекс Метрику, чтобы считать посещения и понимать, какие страницы полезны. Cookie можно
          отключить в настройках браузера, сайт продолжит работать.
        </p>
      </LegalSection>

      <LegalSection title="8. Согласие">
        <p className="type-body">
          Согласие на обработку персональных данных оформлено отдельным документом:{' '}
          <Link href="/consent" className="link-underline">
            согласие на обработку персональных данных
          </Link>
          . Актуальная редакция политики всегда на этой странице.
        </p>
      </LegalSection>
    </LegalPage>
  )
}
