# План сборки v3 — Home Office & Co

Руководитель: tech lead (главная сессия). Код: `site/` (Next.js 16.4.4, React 19.3, Tailwind 4.3, GSAP 3.15, Lenis 1.3, pnpm). Перед кодом прочитайте `site/AGENTS.md` и нужные разделы `site/node_modules/next/dist/docs/`.

## Источники правды
1. `docs/PROJECT_BRIEF.md` — факты о клиенте.
2. `docs/design/art-direction.md` — визуальная система, компоненты, моушн, вайрфреймы. **Обязательна к исполнению.**
3. `docs/content/sales-strategy.md` — воронка, CTA, возражения, формы.
4. `docs/content/seo-brief.md` — H1, title, description, H2, техтребования.
5. `docs/content/copy-*.md` — финальные тексты (после копирайтера).

## Решения руководителя (снимают противоречия между документами)
- **Квиз:** маршрут `/podbor`, 4 решения + контакт (как в стратегии продаж и арт-дирекции).
- **H1 главной:** визуально двухуровневый ступенчатый заголовок из арт-дирекции, но содержит «недвижимость» и географию; ключ «агентство недвижимости Пхукет» несут title, description и Lead (решение SEO-брифа: главная = агентство, хаб = «недвижимость Пхукет»).
- **Каналы связи:** телефон, форма и почта — полноценные каналы (по SEO-брифу WhatsApp и Telegram в РФ нестабильны). Telegram и WhatsApp остаются, телефон всегда рядом.
- **Часы брокеров:** заглушка 9:00–21:00 по Пхукету (UTC+7) до ответа клиента; вынести в один конфиг.
- **English:** ссылка в шапке ведёт на заглушку `/en` (одна страница «English version is coming»); EN-версии в этой итерации нет.
- **Тёмной темы нет** (арт-дирекция v1).
- **Без выдуманных фактов:** всё, чего нет в брифе, — видимая пометка `[заглушка: …]` в макете или нейтральная формулировка.

## Владение файлами (чтобы агенты не пересекались)
| Агент | Владеет | Не трогает |
| --- | --- | --- |
| foundation (expert-nextjs-developer + tailwind-frontend-expert) | `site/src/app/layout.tsx`, `site/src/app/globals.css`, `site/src/components/layout/**`, `site/src/components/ui/**`, `site/src/lib/site.ts`, `site/src/lib/reply-time.ts` | страницы, `coast/`, `photos` |
| coast-data | `site/src/components/coast/**`, `site/scripts/coast/**` | всё остальное |
| photo-pipeline | `site/scripts/photos/**`, `site/public/photos/graded/**`, `site/src/lib/photos.ts` | всё остальное |
| ru-copywriter | `docs/content/copy-*.md` | код |
| pages (следующая волна) | `site/src/app/**/page.tsx`, `site/src/components/sections/**` | токены и примитивы без согласования |
| motion (следующая волна) | `site/src/components/motion/**` + точечные правки секций | токены |

## Договорённости об API
- **Фото:** `site/src/lib/photos.ts` экспортирует `photos[key][ratio]` → `{ src, width, height }` и `photoMeta[key]` → `{ alt, caption, place, credit, license, sourceUrl }`. Ключи: `hero, phuket, bangtao, sunset, kata, naiharn, pattaya, bali, villa, dubai, cambodia, bangtaoBoat, naiharnRocks`. Пропорции: `'21x9' | '3x2' | '4x5' | '1x1'`. Файлы: `site/public/photos/graded/{key}-{ratio}.jpg`.
- **Берег:** `site/src/components/coast/` экспортирует `<Coast id="phuket-west|phuket-island|bali-bukit|dubai-jumeirah|sihanoukville" />` (SVG, `stroke="currentColor"`, `pathLength=1`, проп `highlight?: districtId`), `<Locator place="kata-noi|bang-tao|..." size={24} />`, и данные районов `phuketDistricts` (id, name, path-сегмент). Атрибуция «© участники OpenStreetMap».
- **Строка ответа:** `<ReplyTime />` из `site/src/components/ui/reply-time.tsx`, логика в `site/src/lib/reply-time.ts`, часы из `site/src/lib/site.ts`.
- **Подпись к фото:** `<Figure photo="hero" ratio="21x9" locator={<Locator place="kata-noi" />} />` — подпись под фото, текст никогда не на фото.

## Ворота качества (после страниц и моушна)
seo-technical + seo-schema → ui-finish-gate-reviewer (чек-лист §8 арт-дирекции) → accessibility-auditor → silent-failure-hunter (формы) → cro-specialist → evidence-collector (скриншоты 390 и 1440).

## Решения руководителя по текстам (после копирайтера)
1. Кнопка в шапке и липкой панели — «Подобрать объект» (`/podbor`). Консультация — главное действие на `/services/deal` и `/contacts`.
2. H1 главной: «Недвижимость» / «в Таиланде».
3. H1 Пхукета и Банг Тао из SEO-брифа слишком широки для колонок 1–7: заголовок занимает колонки 1–12 в две строки, остров или локатор переезжает в правую колонку ряда с Lead. «Сопровождение» / «сделки» проверить на 390 px; если не влезает — «Сделка» / «под ключ».
4. Квиз: обещание «3–5 проектов за 24 часа» оставить, в `docs/content/copy-podbor.md` пометить как требующее подтверждения клиента. Прогресс «Вопрос 1 из 4», затем «Последний шаг».
5. Навигация показывает только собранные страницы: «Направления» (панель: Пхукет → страница; Паттайя, Бали, Дубай, Камбоджа → `/podbor?country=…` с подписью из copy-global §2), «Сопровождение сделки», «Подбор объекта», «Контакты». Команда, Отзывы, Журнал скрыты до готовности.
6. `/en` — noindex, без hreflang. Блоки гида инвестора показываем (это лид-магнит), но кнопка ведёт на форму, а сам PDF помечен как готовящийся: «Гид пришлём на почту, когда он выйдет; первая глава — сразу» не обещаем; текст из copy-global.
7. Банг Тао собирается как шаблон района с видимыми заглушками; в продакшен — только после фактов от брокера.

## Волна 3: страницы и моушн (параллельно)
| Агент | Владеет |
| --- | --- |
| pages-home | `site/src/app/page.tsx`, `site/src/components/sections/home/**`, `site/src/components/sections/shared/**` (общие секции — делает ПЕРВЫМИ) |
| pages-phuket | `site/src/app/thailand/**`, `site/src/components/sections/phuket/**` |
| pages-forms | `site/src/app/services/**`, `site/src/app/contacts/**`, `site/src/app/podbor/**`, `site/src/app/api/lead/**`, `site/src/app/en/**`, `site/src/app/credits/**`, `site/src/app/not-found.tsx`, `site/src/components/sections/forms/**`, `site/src/lib/lead.ts` |
| motion | `site/src/components/motion/**` (кроме уже готового smooth-scroll — его можно дорабатывать), точечные замены ссылок на `TransitionLink` в layout/ui после согласования |

### Общие секции (API, `site/src/components/sections/shared/`)
- `closing-line.tsx`: `<ClosingLine title: string; cta?: { label: string; href: string } />` — фраза D3 со строкой ответа, портрет брокера-заглушка 1:1, Telegram, WhatsApp, телефон.
- `faq-section.tsx`: `<FaqSection title: string; items: { q: string; a: string }[]; lead?: string />`.
- `guide-block.tsx`: `<GuideBlock />` — поле ink, форма гида (отправка через `submitLead` из `@/lib/lead`, тип `guide`).
- `breadcrumbs.tsx`: `<Breadcrumbs items: { label: string; href?: string }[] />` + JSON-LD BreadcrumbList.

### Лиды (`site/src/lib/lead.ts`, владелец pages-forms)
`submitLead(payload: { type: 'quiz' | 'consultation' | 'viewing' | 'guide'; fields: Record<string,string>; page: string }) → Promise<{ ok: true } | { ok: false; error: string }>` — POST на `/api/lead`. Route handler валидирует, логирует, возвращает 200/400/500; интеграции amoCRM и Telegram — TODO с явной точкой подключения. Форма никогда не показывает «спасибо», если ответ не `ok`.

### Хуки моушна (разметка в секциях, анимацию делает motion)
Страницы ставят атрибуты, моушн их находит внутри `<main>`:
- `data-hero` — секция героя (для липкой панели и сцены входа); `data-hero-title` на h1, `data-hero-panorama` на обёртке панорамы, `data-hero-print` на отпечатке.
- `data-reveal="lines"` на h2/h3 (маска строк), `data-reveal="fade"` на текстовых блоках, `data-reveal="clip"` на обёртках фото (внутри `img` — масштаб), `data-reveal="items"` на списках (дети по очереди).
- `data-parallax` на обёртке фото «в край» (внутри изображение выше на 12 %).
- `data-coast-draw` на SVG `<Coast>`, который рисуется при входе.
- Сцена «Где жить, а где сдавать» — компонент моушна `<DistrictScene districts={...} />` из `@/components/motion/district-scene` (данные и тексты передаёт pages-home пропсами; тип экспортирует motion).
Без JS и при reduced motion всё видно; скрытые состояния только под `html.js`.
