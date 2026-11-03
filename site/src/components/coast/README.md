# Береговая линия (`@/components/coast`)

Единственная линия сайта: реальный контур побережья из OpenStreetMap, упрощённый, одним штрихом 1,5 px (арт-дирекция §2, §3.5, §5). Компоненты серверные, без клиентского JS.

## Атрибуция (обязательно)

Данные береговой линии © участники OpenStreetMap, лицензия ODbL 1.0 (<https://www.openstreetmap.org/copyright>). Снимок данных: **2 ноября 2026** (`OSM_DATA_DATE`, поле `osmDate` в каждом файле данных).

На каждой странице с берегом должна быть строка атрибуции. Достаточно строки в футере «Карты © участники OpenStreetMap» со ссылкой на `OSM_LICENSE_URL`; текст есть в `OSM_ATTRIBUTION`. В `/credits` и в THIRD-PARTY-NOTICES стоит добавить: «Береговая линия: © участники OpenStreetMap, ODbL 1.0, данные на 02.11.2026, упрощено». Производные пути (наши SVG) остаются под ODbL.

## Побережья

| id | Что | viewBox |
|---|---|---|
| `phuket-island` | весь остров, портрет («остров как оглавление»); начинается на северном мысе и идёт вниз по западному берегу | 415 × 1000 |
| `phuket-west` | западный берег от мыса Лаем Сон (север Лаяна) до Промтепа и вглубь бухты Чалонг | 413 × 1000 |
| `bali-bukit` | Букит: Кута над взлётной полосой, Джимбаран, Улувату, Нуса Дуа, коса Танджунг Беноа (порт Беноа и о. Серанган вырезаны) | 1000 × 810 |
| `dubai-jumeirah` | Дубай Марина, JBR, Пальма Джумейра, Бурдж аль-Араб, Джумейра до устья Dubai Water Canal (острова The World вырезаны) | 822 × 1000 |
| `sihanoukville` | побережье Сиануквиля от порта до Отреса, остров Кох Пос | 604 × 1000 |

Длинная сторона viewBox всегда 1000 единиц. У каждого побережья три уровня детализации: `full` (большие сцены), `mid` (96–160 px), `tiny` (24–64 px).

## `<Coast>`

```tsx
import { Coast } from "@/components/coast";

<Coast id="phuket-west" className="h-[120px] w-auto text-laterite" lod="mid" />
<Coast id="phuket-island" highlight="bang-tao" className="h-[80svh] w-auto" />
<Coast id="phuket-island" districts highlight={active} className="h-[80svh] w-auto" />
<Coast id="bali-bukit" decorative className="w-16 text-laterite" />
```

- SVG: `fill="none" stroke="currentColor" stroke-width="1.5"`, у каждого пути `vector-effect="non-scaling-stroke"`. Цвет задаёт класс (`text-laterite`, на тёмном `text-laterite-on-ink`). Размер задаёт CSS (`h-… w-auto`).
- Базовые пути: `pathLength="1"` и `data-coast-path` (по одному на кусок берега, главный первым).
- `highlight` — район поверх базы, 3 px, `text-laterite`; база становится `text-ink-muted`. Пути районов: `data-district="<id>"`, `data-active="true|false"`.
- `districts` — все шесть отрезков сразу (сцена «Где жить, а где сдавать»): неактивные лежат на базе 1,5 px в цвете базы, активный (`highlight`) 3 px латеритом. Моушн переключает активный отрезок: ширину (1,5 → 3 px за 400 мс) и класс цвета.
- `baseClassName` / `highlightClassName` меняют цвета, например на тёмном поле.
- Доступность: по умолчанию `role="img"` и русский `aria-label` (из `coasts[id].title`, с районом: «Остров Пхукет, район Банг Тао»); `title` переопределяет; `decorative` ставит `aria-hidden`.

### Анимация прорисовки: обязательно `setCoastDrawMode`

`pathLength="1"` не работает для пунктира на путях с `vector-effect="non-scaling-stroke"`: Chrome считает пунктир в экранных пикселях, и `stroke-dasharray: 1; stroke-dashoffset: 1 → 0` сразу показывает всю линию (проверено в Chrome 2.11.2026). Перед прорисовкой включайте режим рисования. Он переводит базовые пути на `vector-effect: none` и задаёт ту же экранную толщину в единицах viewBox:

```ts
import { setCoastDrawMode } from "@/components/coast/draw"; // прямой импорт: в клиентский бандл не попадут данные

setCoastDrawMode(svg, true);
gsap.fromTo(svg.querySelectorAll("[data-coast-path]"),
  { strokeDasharray: 1, strokeDashoffset: 1 },
  { strokeDashoffset: 0, duration: 1.8, ease: "power2.inOut", onComplete: () => setCoastDrawMode(svg, false) });
```

При прорисовке за скроллом не выключайте режим и вызывайте `setCoastDrawMode(svg, true)` заново после ресайза (в `refresh` ScrollTrigger). Скрытые состояния ставьте только при `html.js` (§5): без JS берег виден целиком.

## `<Locator>`

```tsx
import { Locator } from "@/components/coast";

<figcaption className="flex items-center gap-2 text-ink-muted">
  <Locator place="kata-noi" /> Ката Ной, западное побережье Пхукета
</figcaption>
<Locator district="bang-tao" size={96} />   {/* карточка района: остров ink-muted, отрезок 3 px латеритом */}
<Locator district="layan" size={160} />     {/* район без фото */}
```

- `size`: 24 (подписи), 64 (меню), 96 (карточка района), 120, 160 — длинная сторона в px; `width`/`height` проставляются сами.
- `place` — точка латеритом на берегу. Точки: `layan`, `bang-tao`, `kamala`, `karon`, `kata`, `kata-noi`, `nai-harn`, `rawai`, `chalong`, все на силуэте `phuket-island`.
- `district` — отрезок района. `coast` меняет силуэт.
- Силуэт берёт `currentColor` (в подписи наследует `ink-muted`); с `district` база `text-ink-muted`. Точка и отрезок: `accentClassName` (по умолчанию `text-laterite`).
- По умолчанию декоративный (`aria-hidden`): место называет текст рядом. Отдельно стоящему локатору передайте `title`.
- Локаторы статичны и без `pathLength`.

## Данные

- `phuketDistricts` — шесть районов с севера на юг: `{ id, name, segment }`, где `segment` — путь отрезка на `phuket-island` (full).
- `coasts[id]` — `{ id, title, width, height, aspect }`; `places[id]` — `{ id, name, coast }`; `coastData` — сырые пути.
- Файлы `data/*.ts` генерируются, руками не правятся.

## Пересборка

```bash
node scripts/coast/fetch-coast.mjs            # скачать недостающие raw/*.json (Overpass, вежливо, с бэкоффом)
node scripts/coast/fetch-coast.mjs --force    # перекачать всё (обновить дату OSM)
node scripts/coast/build-coast.mjs            # raw -> src/components/coast/data/*.ts, без сети
node --disable-warning=MODULE_TYPELESS_PACKAGE_JSON scripts/coast/preview-coast.mjs --out <dir>  # PNG-листы для проверки
```

Настройки (рамки, вырезы, бюджеты точек, якоря районов с координатами и источниками) — в `scripts/coast/regions.mjs`. Сырые ответы Overpass лежат в `scripts/coast/raw/`, сборка от сети не зависит. После `--force` обновите дату в этом файле и в атрибуции.
