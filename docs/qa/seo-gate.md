# SEO-гейт перед презентацией клиенту (технический аудит)

Дата: 03.11.2026 · автор: technical-seo · основание: `docs/content/seo-brief.md` (§4, §6, §7), `docs/DEMO_DECISIONS.md`, исходники `site/src`.
Домен для промо: `https://homeofficeco.com` (решение руководителя проекта, клиент подтверждает перед запуском).

## 0. Как читать отчёт и что в нём недостоверно

- **Метаданные (title, description, canonical, robots, OG, JSON-LD) проверены по исходникам** `site/src`, они актуальны на 03.11.2026.
- **Серверный HTML, иерархия заголовков, alt, внутренние ссылки проверены по старой сборке** (`site/.next`, собрана 02.11 в 23:37, запущена мной через `next start -p 3100`, порт 3100 был свободен). В ней ещё стоят прежние значения: домен `homeoffice.example` в canonical/OG/JSON-LD, заглушки контактов (`tel:+70000000000`, `https://t.me/`, `https://wa.me/`, `hello@homeoffice.example`). После пересборки их надо перепроверить. На порту 3000 работает чужой проект («Опердир·OS»), я его не трогал.
- `sitemap.xml` и `robots.txt` в этой сборке отдают 404, потому что файлы появились позже. Их вывод я сверил по коду сериализатора Next.js (`resolve-route-data.js`) и типам, вживую не проверял.
- `tsc --noEmit` после правок: **без ошибок** (exit 0).

## 1. Итог

**Технический балл: 78 / 100** (ниже 90 из-за FIX №1–5, они закрываются за час и не требуют решений клиента).

| Категория | Статус |
|---|---|
| Краулинг (robots, sitemap, noindex) | PASS после моих файлов; FIX №3 (noindex на юр. страницах и районе — решение) |
| Индексация (canonical, дубли) | PASS; FIX №1 (домен в JSON-LD расходится с canonical) |
| Безопасность (HTTPS, заголовки) | FIX №5 (нет ни одного security-заголовка) |
| Структура URL, редиректы | PASS; FIX №10 (редиректы через `Response.redirect`) |
| Мобильная версия | PASS по HTML (viewport, safe-area); тач-цели не измерялись |
| Core Web Vitals (по исходнику) | PASS по CSS (h1 не прячется); FIX №6 (`/podbor` динамическая), замеров нет |
| Структурированные данные | PASS по валидности; FIX №7, №8 |
| Рендеринг (SSR) | PASS |
| IndexNow | не реализован (запуск, см. brief §7.4) |
| Яндекс: коммерческие факторы | PASS с замечанием FIX №9 (телефон в шапке только от 1536 px) |

## 2. Что сделано в коде (мои файлы)

1. `site/src/app/sitemap.ts` (новый). Только индексируемые URL: `/`, `/thailand/phuket`, `/services/deal`, `/podbor`, `/contacts`. `lastModified` задан вручную (`2026-11-03`, дата последней смысловой правки промо-версии, не дата сборки, как требует brief §6.8), комментарий: заменить на `updatedAt` из Payload. Не попадают: `/en` (noindex), `/privacy` и `/consent` (noindex, управляются флагом `LEGAL_INDEXABLE = false`), `/credits` (noindex), `/thailand` и `/services` (302). Страница района добавляется сама, когда `page.ready === true` в `districts.ts` (сейчас Банг Тао `ready: false`, в карте её нет). hreflang-альтернатив нет: английских пар пока не существует. URL главной без слеша: так Next рендерит canonical `/`.
2. `site/src/app/robots.ts` (новый). Next.js в этой версии (16.4.4) принимает `other` в правиле, поэтому `Clean-param` делается штатно. Ожидаемый вывод:
```
User-Agent: *
Allow: /
Disallow: /api/
Disallow: /admin
Clean-param: utm_source&utm_medium&utm_campaign&utm_content&utm_term
Clean-param: yclid&ysclid&gclid&fbclid&_openstat&from&roistat
Clean-param: country&district /podbor

Sitemap: https://homeofficeco.com/sitemap.xml
```
   `Clean-param` межсекционная директива Яндекса, поэтому стоит в группе `*`, отдельная группа `User-agent: Yandex` не нужна (она заставила бы дублировать все `Disallow`). Третья строка добавлена мной сверх brief §6.4: ссылки на квиз `/podbor?country=…&district=…` стоят в меню, подвале и на странице Пхукета, canonical у них без параметров, для Яндекса нужен `Clean-param`. `/s/` не закрыт, `_next` не закрыт (brief §6.4). `Host` и `Crawl-delay` не пишем.
3. `site/src/app/layout.tsx` строка 36: `metadataBase: new URL('https://homeofficeco.com')` + комментарий строкой выше. Больше ничего не менял.

## 3. FIX-список по влиянию

### Критично и высокий приоритет

**№1. Домен в JSON-LD и хлебных крошках расходится с canonical/OG/sitemap.**
Я поставил `metadataBase = homeofficeco.com`, а `SITE_ORIGIN` по умолчанию остался `homeoffice.example`. Пока это не исправлено, `@id`, `url` и `item` во всей разметке (RealEstateAgent, WebSite, WebPage, Service, ContactPage, BreadcrumbList) указывают на другой домен, чем canonical. Это ломает связь `publisher`/`provider` → `#org` и крошки в Яндексе и Google.
- `site/src/components/sections/shared/site-url.ts:6` — `?? 'https://homeoffice.example'` — `?? 'https://homeofficeco.com'`. Комментарий в строках 2–5 («TODO(launch)… not known yet») тоже обновить. Когда файл исправлен, `sitemap.ts` и `robots.ts` можно перевести на `import { SITE_ORIGIN }`.

**№2. На большинстве страниц нет `og:image`, `og:site_name`, `og:locale`.**
Страничный `openGraph` в Next.js заменяет корневой целиком, он не сливается. Видно в HTML: на `/`, `/thailand/phuket`, Банг Тао картинка есть, а `og:site_name` и `og:locale` только на главной; на `/services/deal`, `/podbor`, `/contacts`, `/en` картинки нет совсем, при этом `twitter:card = summary_large_image`. Ссылки будут пересылаться в Telegram (brief §6.7): превью получится без картинки. Нужны импорты `site` из `@/lib/site` и `getPhoto, photoMeta` из `@/lib/photos`.
- `site/src/app/podbor/page.tsx:26` — `openGraph: { title: TITLE, description: DESCRIPTION, url: PATH, type: 'website' }` — добавить `siteName: site.name, locale: site.locale, images: [{ url: ogHero.src, width: ogHero.width, height: ogHero.height, alt: photoMeta.hero.alt }]`, где `const ogHero = getPhoto('hero', '3x2')`.
- `site/src/app/contacts/page.tsx:24` — то же; фото `getPhoto('naiharn', '3x2')`, alt из `photoMeta.naiharn.alt`.
- `site/src/app/services/deal/page.tsx:25` — то же; фото `getPhoto('villa', '3x2')`, alt из `photoMeta.villa.alt`.
- `site/src/app/thailand/phuket/page.tsx:28-34` — в объект `openGraph` добавить `siteName: site.name, locale: site.locale`.
- `site/src/app/thailand/phuket/[district]/page.tsx:49-55` — то же.
- `site/src/app/en/page.tsx:18` — добавить `siteName: 'Home Office & Co'` (картинка не обязательна, страница noindex).
- Лучше вынести в один хелпер (например `lib/seo/og.ts`: `ogFor({ path, title, description, photo })`), чтобы не повторять. Файловый `opengraph-image` здесь не поможет: он не наследуется страницей, у которой свой `openGraph` (проверил по `mergeStaticMetadata`). Финальная карточка 1200×630 для главной ещё в TODO (`page.tsx:28`), 3:2 пока допустимо.

**№3. Что noindex сейчас и подтверждение решений.**
- **Банг Тао: noindex, без canonical, в sitemap нет. Подтверждаю, это сделано намеренно:** `bangTaoPage.ready = false` в `site/src/components/sections/phuket/districts.ts` (строка 92), ожидание фактов брокера (DEMO_DECISIONS п. 14, BUILD_PLAN решение 7). Brief §4.3 относит страницу к первой волне и индексируемой, поэтому перед боевым запуском: брокер проверил, `ready: true`. Одно изменение флага включает canonical, снимает noindex и добавляет URL в sitemap.
- **`/privacy`, `/consent`: noindex, а brief §6.5 требует индексировать и включать в sitemap** (документы — фактор доверия). В исходнике это сознательно «до проверки юристом». Перед запуском: `site/src/app/privacy/page.tsx:17` и `site/src/app/consent/page.tsx:15` — удалить `robots: { index: false, follow: true },`, и в `sitemap.ts` поставить `LEGAL_INDEXABLE = true`.
- **`/en`: `noindex, follow`, без canonical и hreflang. Соответствует брифу** (заглушка до появления английских страниц).
- **`/credits`: noindex — верно, служебная.** `site/src/app/credits/page.tsx:14` — `alternates: { canonical: '/credits' }` на noindex-странице противоречит brief §6.2 («у noindex canonical не ставят», как сделано у района); удалить строку. Для `privacy:18` и `consent:16` canonical остаётся, они станут индексируемыми.
- Страница 404 отдаёт реальный 404 и `noindex`.

**№4. Контакты в собранной версии.** В старой сборке на всех страницах `tel:+70000000000`, `https://t.me/`, `https://wa.me/`. В исходнике `site.ts` уже реальные значения из DEMO_DECISIONS (+7 939 700-87-47, `hello@homeofficeco.com`). Это не правка кода, а условие: показывать клиенту только свежую сборку, иначе на презентации в подвале будут нерабочие ссылки.

**№5. Нет security-заголовков, лишний `X-Powered-By`.** В ответах нет HSTS, `X-Content-Type-Options`, `Referrer-Policy`, `X-Frame-Options`/`frame-ancestors`, `Permissions-Policy`; есть `X-Powered-By: Next.js`.
- `site/next.config.ts` (в объект `nextConfig`, сейчас строки 3–19) — добавить:
```ts
poweredByHeader: false,
async headers() {
  return [{
    source: '/:path*',
    headers: [
      { key: 'X-Content-Type-Options', value: 'nosniff' },
      { key: 'Referrer-Policy', value: 'strict-origin-when-cross-origin' },
      { key: 'X-Frame-Options', value: 'DENY' },
      { key: 'Permissions-Policy', value: 'camera=(), microphone=(), geolocation=()' },
      // HSTS включать только когда HTTPS на боевом домене подтверждён; без preload.
      { key: 'Strict-Transport-Security', value: 'max-age=31536000; includeSubDomains' },
    ],
  }]
},
```
CSP отдельной задачей: нужны nonce для inline-скриптов (`boot`, Метрика).

### Средний приоритет

**№6. `/podbor` рендерится динамически.** `site/src/app/podbor/page.tsx:77-82` — `searchParams: Promise<…>` и `await searchParams` делают страницу динамической: ответ `Cache-Control: private, no-cache, no-store`, нет статического кэша и CDN (хуже TTFB и LCP для посадочной, которая нужна в быстрых ссылках бренда). Замена: убрать `searchParams` из страницы, читать `country` и `district` на клиенте (`useSearchParams` внутри `<Suspense>` в `Quiz`), страница станет статической. Чтение параметров на сервере нужно только ради раскраски береговой линии под префилл; это можно сделать на клиенте.

**№7. Разметка хлебных крошек на странице без видимых крошек.** `site/src/app/podbor/page.tsx:37-44` — `BreadcrumbList` есть, на странице хлебных крошек нет; разметка должна соответствовать видимому содержимому (Google и Яндекс). Замена: удалить объект `BreadcrumbList` из массива `jsonLd` (оставить `WebPage`), либо добавить компонент `<Breadcrumbs items={[{ label: 'Главная', href: '/' }, { label: 'Подбор недвижимости' }]} />` в hero страницы (квиз сознательно минимальный, поэтому предпочтителен первый вариант).

**№8. JSON-LD: неполные ссылки на организацию.**
- `site/src/app/contacts/page.tsx:29-35` — `ContactPage` только ссылается `about: { '@id': ORG_ID }`, а brief §6.6 требует на `/contacts` полную запись с `contactPoint`. Телефон и почта уже не заглушки. Замена (внутри `contactJsonLd`, после `url`):
```ts
mainEntity: {
  '@type': 'RealEstateAgent',
  '@id': ORG_ID,
  name: site.name,
  telephone: contacts.phone.href.replace(/^tel:/, ''),
  email: contacts.email.href.replace(/^mailto:/, ''),
  contactPoint: { '@type': 'ContactPoint', telephone: contacts.phone.href.replace(/^tel:/, ''), contactType: 'sales', availableLanguage: ['ru'] },
},
```
  `availableLanguage` только `['ru']`, пока клиент не подтвердил англоговорящего брокера; часы работы в разметку не кладём (часовой пояс там не задаётся, получится неверное расписание); `about` можно убрать.
- `site/src/app/services/deal/page.tsx:34` — `provider: { '@id': ORG_ID }` — `provider: { '@type': 'RealEstateAgent', '@id': ORG_ID, name: site.name, url: absoluteUrl('/') }`. Ссылка только по `@id` на узел, описанный на другой странице, роботом не разворачивается, у провайдера не будет даже названия. То же правило для `publisher` в `components/sections/phuket/schema.ts:36`: `publisher: { '@type': 'RealEstateAgent', '@id': ORG_ID, name: 'Home Office & Co' }`.

**№9. Телефон в шапке виден только от 1536 px.** `site/src/components/layout/header.tsx:193` — `hidden … 2xl:inline-flex` — `hidden … xl:inline-flex`. Brief §7.5 («телефон в шапке на каждой странице, кликабельный») и коммерческие факторы Яндекса. На ноутбуках 1280–1440 px и на мобильной версии номер в шапке не показан: на мобильной есть иконка телефона в нижней панели (только aria-label, без цифр), в подвале и на `/contacts` номер есть. Если в `xl` не хватает места рядом с «English» и кнопкой, скрывать «English» раньше, а не телефон. Компактный подвал на `/podbor` без контактов, это допустимо (квиз), но телефон в нижней панели есть.

**№10. Редиректы `/thailand` и `/services` через `Response.redirect(new URL(…, request.url), 302)`.**
- `site/src/app/thailand/route.ts:6` и `site/src/app/services/route.ts:6`. За обратным прокси `request.url` может содержать внутренний хост, а не боевой домен. Статус 302 и цель корректны (проверено: `/thailand` → `/thailand/phuket`, `/services` → `/services/deal`, один прыжок). Замена: удалить оба `route.ts`, в `next.config.ts` добавить
```ts
async redirects() {
  return [
    { source: '/thailand', destination: '/thailand/phuket', statusCode: 302 },
    { source: '/services', destination: '/services/deal', statusCode: 302 },
  ]
},
```
  (если `headers()` из №5 уже добавлен, это второй метод рядом). Слеш в конце: Next отдаёт 308 (`/services/deal/` → `/services/deal`). Google считает 308 как 301; для Яндекса проверить «Проверку ответа сервера» в Вебмастере (brief §6.1), при сомнении перейти на явный `statusCode: 301` в `redirects()`.

**№11. `/en`: `<html lang="ru">` и `<div lang="en">`.** `site/src/app/layout.tsx:93` (`<html lang="ru" …>`) — единый корневой layout. Для заглушки с noindex достаточно текущего решения (контент помечен `lang="en"`, ссылка на русскую версию `lang="ru"`, переключатель `lang="en" hrefLang="en"`). Brief §6.3 требует `<html lang="en">`: при появлении настоящих английских страниц перейти на два корневых layout (route groups `(ru)` и `en`). Решение ставить до выпуска `/en/*`.

### Низкий приоритет

- **Фавикон.** В `<head>` только `icon.svg`. Brief §7.1 п. 7: SVG плюс PNG 120×120 для Яндекса. Добавить `src/app/icon.png` (120×120) рядом с `icon.svg`.
- **Суффикс title.** Шаблон в `layout.tsx:39` — `%s — Home Office & Co`, на остальных страницах `| Home Office & Co`. Привести к `| `: `template: \`%s | ${site.name}\``. Страница 404 наследует описание сайта по умолчанию, терпимо.
- **Схема без адреса.** `RealEstateAgent` на главной без `address` и `logo`: Rich Results Test покажет ошибку «Local business: нет address». Это сознательно по brief §6.6 (выдуманный адрес хуже отсутствия), на индексацию не влияет. `logo`, `sameAs`, фамилия основателя добавляются, когда клиент даст факты.
- **Canonical главной** рендерится как `https://домен` (без слеша), а `url` в JSON-LD как `https://домен/`. Это один и тот же URL, действий не требуется; sitemap использует вариант как в canonical.
- **Фото и подписи об авторах.** В футере (`site.ts`, `creditsLinks.photos`) и на `/credits` (строка 37) написано «Wikimedia Commons», а реестр `lib/photos.ts` уже ссылается на Unsplash (решение DEMO_DECISIONS «Фото»). Сверить после того, как закончит агент, правящий фото.
- **LCP панорамы на `/thailand/phuket`.** В старой сборке первая картинка панорамы `loading=lazy` без preload. Если панорама попадает в первый экран на 1440×900, нужен `preload`/`priority`. Проверить в Lighthouse на свежей сборке.

## 4. PASS-список

1. **Title и description.** Все title совпадают с brief и ≤ 60 символов: главная 52, Пхукет 50, Банг Тао 52, сопровождение 45, подбор 49, контакты 50. Description 143–157 символов, все различаются. Фраза про цены в батах и рублях у Пхукета не используется (блока цен нет), это условие brief §4.2 выполнено.
2. **Canonical.** Абсолютный, на себя, на `/`, `/thailand/phuket`, `/services/deal`, `/podbor`, `/contacts`. `/podbor?country=phuket&district=bang-tao&utm_source=x` отдаёт canonical `/podbor`. У noindex-района canonical нет, как в brief §6.2.
3. **Robots meta.** Индексируемые страницы `index, follow`; `/en`, район, юридические и `/credits` `noindex, follow`; 404 реальный статус 404 и `noindex`. Неизвестный район (`/thailand/phuket/layan`) даёт 404, а не пустую копию.
4. **Заголовки.** Один `<h1>` на каждой из 10 страниц и на 404, уровни не перепрыгиваются (h1 → h2 → h3). Крупный слоган не выделен как второй h1. (Замечание: внутри SVG-карты есть `<title>`, это не `<title>` документа и на сниппет не влияет.)
5. **SSR.** Весь текст в серверном HTML: 850–1370 слов на коммерческих страницах, ответы FAQ в `<details>` присутствуют, нет `BAILOUT_TO_CLIENT_SIDE_RENDERING`, нет незавершённых Suspense. Скрытые состояния анимаций работают только при классе `html.js`, h1 никогда не получает `opacity: 0` (комментарий в `motion.css`, LCP-требование brief §6.9).
6. **Изображения.** У всех `<img>` непустой осмысленный русский `alt` (описание кадра), у `og:image` есть `og:image:alt`.
7. **Внутренние ссылки.** Со всех 10 страниц собраны 19 уникальных внутренних `href`, все отвечают 200; якоря `#gid`, `#rajony`, `#zapis`, `#main` существуют; запланированные страницы (команда, отзывы, журнал, Паттайя, Бали, Дубай) не линкуются (нет ссылок в 404).
8. **JSON-LD.** Валидный JSON, только свойства schema.org, символ `<` экранируется. Главная: `RealEstateAgent` и `WebSite` (`name`, `alternateName`, `inLanguage`, без `SearchAction`). Пхукет и Банг Тао: `WebPage` с `about: Place` (у района `geo` и `containedInPlace`). Сопровождение: `Service`. Контакты: `ContactPage`. `BreadcrumbList` на всех внутренних страницах, последний элемент без `item` допустим для Google. `FAQPage` не включён (`schema = false` по умолчанию в `FaqSection`, решение после 07.05.2026), `HowTo`, `Review`, `AggregateRating` не используются. Крошки на Пхукете и сопровождении честные: уровней «Таиланд» и «Услуги» нет, так как страниц нет.
9. **hreflang.** Его нет, и это верно: английских пар нет. У ссылки «English» `lang="en" hrefLang="en"`, обратная ссылка на `/en` `lang="ru"`.
10. **Яндекс: коммерческие факторы (по исходникам).** Контакты: телефон, Telegram, WhatsApp, почта на домене (`/contacts`, подвал). Часы брокеров 9:00–21:00 по Пхукету и 5:00–17:00 по Москве (подвал, `/contacts`, `/podbor`). Формулировка реквизитов «Реквизиты для договора отправляем по запросу» (подвал, `/contacts`, политика). Ценовая политика: «Консультация бесплатная», раздел «Стоимость и частые вопросы» на `/services/deal`. Команда: «Иван, основатель», роли без выдуманных имён; отдельной страницы `/team` пока нет (в плане). Политика конфиденциальности и согласие есть. Офис отсутствует и это объяснено прямым текстом.
11. **Шрифты.** Через `next/font` (cyrillic и latin), внешних CDN нет. Фавикон SVG есть.
12. **Новые файлы** `sitemap.ts`, `robots.ts` компилируются (`tsc --noEmit`, exit 0).

## 5. Что не проверялось

- Живой вывод `/robots.txt` и `/sitemap.xml` (старая сборка без них): проверить сразу после пересборки.
- Rich Results Test, validator.schema.org и валидатор микроразметки Яндекс Вебмастера (внешние сервисы недоступны из среды): прогнать после исправления №1.
- Отрисованный DOM после JS (Playwright не запускался), поэтому поведение Яндекса на `data-reveal` по факту не наблюдал.
- Core Web Vitals и Lighthouse: замеров нет; оценка LCP только по исходнику и CSS.
- Доступность из России (brief §6.10), заголовки боевого хостинга, HTTPS, `www`-вариант хоста.
- Яндекс Метрика (счётчик, цели, хиты SPA), подтверждение прав в Вебмастере, IndexNow, ключ-файл.
- Содержимое страниц после пересборки: старая сборка содержит прежние тексты контактов и описаний юридических страниц.
- Роут `/s/{token}` (персональные подборки) ещё не существует, правила §6.5 для него не проверить. `/api/lead` отвечает 405 на GET и закрыт `Disallow: /api/`.
- Тач-цели и горизонтальный скролл на мобильной версии: только HTML и CSS, на устройствах не смотрел.
- Фоновый процесс: `next start -p 3100` (сборка 02.11) всё ещё запущен, его можно остановить.
