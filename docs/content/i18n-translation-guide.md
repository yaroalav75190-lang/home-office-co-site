# English and Spanish translation guide

For the two translators of the Home Office & Co site: English (`site/src/i18n/en/`) and Spanish
(`site/src/i18n/es/`). You work in parallel; each of you edits **only your own folder**.

Today both folders hold copies of the Russian text, so the site builds and every English and
Spanish page already exists at `/en/…` and `/es/…`. Your job is to replace the Russian values with
your translation.

---

## 1. How the files work

- `site/src/i18n/ru/` is the source of truth. **Never edit it** (or the other language's folder).
- Your folder has the same 13 files with the same keys. Every file starts with the line
  `// TRANSLATE: values only, keep keys and structure; see docs/content/i18n-translation-guide.md`.
- **Change values only**: the text between the quotes. Keep every key, every nesting level, the
  order of list items, and every `{placeholder}`.
- Each file ends with `satisfies XxxDict`: TypeScript checks it against the Russian file. A missing
  key, an extra key or a lost placeholder is a type error. Check with
  `pnpm exec tsc --noEmit -p .` in `site/`, or ask the developer to run it.
- Strings are in single quotes. Write an apostrophe inside them as `\'`
  (`'Phuket\'s west coast'`), or use the typographic apostrophe `’`.
- Comments (`/** … */`) above a key explain where the text appears and its limits. Leave them in
  place. You may add your own notes.
- You do not need to type no-break spaces. The code adds them to English and Spanish, between a
  number and its unit or `%` (`49 %`, `30 years`, `25 km`).
- Do not type times, dates or prices that the code fills in. They arrive through placeholders
  already formatted for your language:
  - English: `4:55 pm`, `November 12`, `$150–300k`
  - Spanish: `16:55`, `12 de noviembre`

  See §4.

### What is already done for you

- **`forms.ts` → `messages`** (form validation and sending errors) is already translated in both
  folders. That way the lead form answers in the visitor's language from day one. Please review it.
- **`legal.ts` → `prevailNote`** is filled with the line "the Russian text prevails" in English and
  Spanish. It is empty in Russian on purpose.
- **Not translated: the language switcher** («RU · EN · ES»). It lives in code (`site/src/i18n/config.ts`).

## 2. Files and what they cover

All counts are approximate.

| File | What it covers | ~ strings |
|---|---|---|
| `common.ts` | Header, desktop «Направления» panel, mobile menu, footer, sticky bar, contact channel names, founder name/role, breadcrumbs, the live reply-time line (`reply`), page-transition curtain names | 110 |
| `home.ts` | Home page: hero, figures, four coasts, districts scene, FAQ, process, «we invest ourselves», sample reviews, investor guide block, closing line, JSON-LD | 105 |
| `phuket.ts` | `/thailand/phuket`: hero, island map labels, «know before buying», district list, ownership, formats (also used on district pages), Pattaya teaser, FAQ, closing | 95 |
| `districts.ts` | The six Phuket districts (name, verdict, two facts, photo caption) and the Bang Tao page | 80 |
| `deal.ts` | `/services/deal`: hero, six stages, checks, payment, after the keys, FAQ, consultation block | 85 |
| `podbor.ts` | `/podbor`: the quiz (questions, progress, contact step, confirmation) and the blocks under it | 55 |
| `contacts.ts` | `/contacts`: hero, channels, booking block, «where we meet» | 15 |
| `forms.ts` | Every form: field labels, options (quiz answers, formats, directions, budgets), validation messages, sending states, slots and dates, thank-you screens, investor guide form | 170 |
| `legal.ts` | `/privacy`, `/consent`, `/credits` | 65 |
| `photos.ts` | Alt text and caption for each of the 21 photos, plus two credit lines | 45 |
| `places.ts` | Accessible names of the coast drawings and the island's district names; the OpenStreetMap attribution | 15 |
| `errors.ts` | 404 page and the error screens | 15 |
| `meta.ts` | `<title>` and meta description of every page (also used for Open Graph and JSON-LD) | 20 |

## 3. Hard length limits

The design is tight. Measure in characters, spaces included. **Never make a line longer than the
Russian one.** Capital letters and `m`/`w` are wide, so a translation that is equal in length but
heavier in capitals can still overflow. When a translation does not fit, rephrase it; do not
abbreviate it into something unclear.

### Hero titles

Hero titles are D1 display lines in the condensed serif. From 1024 px wide, each line is one
unbreakable (`nowrap`) line. The second line is indented, so it has less room than the first.

| Key | Russian lines | Budget per line |
|---|---|---|
| `home.hero.titleLines` | «Недвижимость» / «в Таиланде» | 12 / 10 |
| `phuket.hero.titleLines` | «Недвижимость» / «на Пхукете» | 12 / 10 |
| `districts.heroTitle` + `districts.pages['bang-tao'].namePrep` | «Недвижимость» / «в Банг Тао» | 12 / 10 |
| `deal.hero.titleLines` | «Сопровождение» / «сделки» | 13 / 6 (line 2 starts a third of the grid in) |
| `errors.notFound.titleLines` | «Такой бухты» / «нет на карте» | 11 / 12 (keep it close; it may wrap on phones) |
| `contacts.hero.title` | «Контакты» | 8 (D1, may wrap) |

Example: «Real estate» (11) / «in Thailand» (11) does **not** fit line 2 (10). Something like
«Property» / «in Thailand» does not fit either. Rethink the pair, for instance «Thailand» /
«property», and check it in the browser.

### Header, menus and buttons

At 1280 px the header is the tightest place on the site: the gap between the last nav item and the
phone number is only 27 px.

| Key | Where it appears | Russian | Budget |
|---|---|---|---|
| `common.nav.destinations`, `common.nav.deal`, `common.nav.contacts` | Desktop header from 1280 px, shown together as «Направления, Сопровождение сделки, Контакты» | 11 + 20 + 8 | Total of the three ≤ 39. Shorter is better. |
| `common.nav.podborCta` | Header button and mobile sticky bar | «Подобрать объект» | ≤ 16. On a 360 px phone it gets about 140 px. |
| `common.header.menu`, `common.header.closeQuiz` | «Меню», «Закрыть» | | ≤ 6 / ≤ 7 |
| `common.menu.*` and the other `common.nav.*` | Mobile menu, large D2/D3 type | | Close to the Russian length |
| `common.curtain.names.*` | Page-transition curtain, one D1 line | | Close to the Russian; «Сделка» is 6 |
| `forms.channels.*`, `forms.guide.channels.*` | Tiles, four (three for the guide) in a row | | ≤ 8 |
| `forms.options.consultationFormats.*` | Tiles, three in a row | «Встреча на Пхукете» | ≤ 18 |
| `forms.options.viewingFormats.*.label` / `.description` | Two tiles in a row | | label ≤ 21; description ≤ the Russian |
| `forms.options.directions.*`, `goals.*`, `timelines.*`, `budgets.unsure` | Quiz tiles: label on one line, description up to two lines | | Label ≤ the Russian; description ≤ the Russian |
| `forms.options.budgets.upTo` / `range` / `from` | Quiz tiles | «До {max} тыс. $» | ≤ 14 characters once the numbers are filled in. English: `Under ${max}k`, `${min}–{max}k`, `${min}k+`. |
| `forms.slots.phuket`, `forms.slots.phuketAndYou`, `forms.slots.local` | Time tiles, two in a row on phones | «{time} на Пхукете» | `{time}` is 8 characters in English («11:00 am»), so keep the words short («in Phuket», «your time») |
| `forms.sending` | Shares the submit button's cell | «Отправляем…» | ≤ the shortest submit label it replaces |
| Submit buttons | One line | | `forms.booking.submitConsultation` / `deal.hero.cta` ≤ 26; `phuket.hero.cta` ≤ 20; `podbor.quiz.submit` ≤ 17; `forms.guide.submit` ≤ 12; `home.hero.cta` ≤ 16 |
| `home.figures.stats.*.unit` | One short word on the baseline of a big figure (5+, 100+, 15, 4); it must agree with the figure | «лет», «клиентов», «минут», «страны» | ≤ 8 |
| `phuket.know.items.*.unit` | Same style | «часа», «месяцев», «лет», «часов» | ≤ 7 |
| `phuket.hero.mapNames.*` | One line beside the island drawing | longest «Раваи и Най Харн» | ≤ 16 |
| `deal.stages.items[].nav` | Narrow sticky column | | ≤ 20 |
| `home.districts.factLabels.*`, `phuket.formats.ownershipLabel` / `suitsLabel`, `deal.stages.documentsLabel` / `termLabel` | Small labels | | Two or three words |
| `home.guide.title` | D2 in seven columns | | The longest word must fit on one line (Russian «приукрашивания», 14) |

### Lists whose count or order the code relies on

Keep the same number of items, in the same order.

| Key | Count | Why |
|---|---|---|
| `deal.stages.items` | 6 | The order matches the stage anchors in code |
| `districts.pages['bang-tao'].facts.items` | 7 | The first four share rows in pairs |
| `home.process.steps` | 5 | `home.process.lead` says «Пять этапов» |
| `home.faq.items` | 5 | `home.faq.title` says «Пять вопросов» |
| `home.coasts` | 4 coasts | `home.coasts.title` says «Четыре побережья» |
| `podbor.below` | 3 blocks | |

The `[string, string]` pairs, such as the hero lines and a district's two `facts`, are exactly two.
For the quiz, `podbor.quiz.countWords` («Три», «Четыре») feeds `podbor.quiz.intro`.

## 4. Placeholders

Keep every `{name}` exactly as written. You can move a placeholder within the sentence. The type
check refuses a template that loses a required placeholder. The values are filled in by the code
and are already in your language's format.

| Key | Placeholders: what they become |
|---|---|
| `common.header.homeLabel` | `{name}` site name |
| `common.header.callLabel` | `{phone}` phone number |
| `common.footer.hours` | `{open}` `{close}` broker hours on Phuket («9:00 am», «9:00 pm»). Optional `{mskOpen}` `{mskClose}`: the same hours in Moscow, Russian only. **Drop them in en/es.** |
| `common.reply.full.*`, `common.reply.short.*`, `common.reply.when.*`, `common.reply.closing.*` | `{lead}` the sentence before the time (`common.reply.lead`, or a page's own); `{replyBy}` now + 15 min on the visitor's clock; `{openReply}` opening + 15 min, visitor's clock; `{openLocal}` opening on the visitor's clock; `{open}` `{close}` broker hours on Phuket; `{day}` = `common.reply.today` / `tomorrow`; `{title}` the page's closing sentence («Расскажите, что ищете…») |
| `common.curtain.opened` | `{name}` page name |
| `contacts.channels.owner` | `{name}`, `{role}` (`common.founder`) |
| `contacts.channels.hours` | `{open}` `{close}` required. Optional `{mskOpen}` `{mskClose}`: Moscow, drop in en/es. |
| `contacts.channels.promise` | `{openReply}` 9:15 Phuket time, formatted |
| `forms.phoneHoursHint` | `{open}` `{close}` |
| `forms.messages.commentLong` | `{n}` current length |
| `forms.messages.summary` | `{fields}` field names (`forms.fields`) joined with commas |
| `forms.messages.server`, `forms.messages.rateLimited` | `{phone}` |
| `forms.messages.duplicate`, `forms.booking.confirmLine`, `forms.guide.doneEmail`, `forms.guide.doneChat`, `podbor.quiz.columnLine` | `{when}` one of `common.reply.when.*` («by 4:55 pm», «tomorrow by 9:15 am your time») |
| `forms.options.budgets.upTo` / `range` / `from` | `{max}` `{min}` 150, 300, 600 (thousands of US dollars, formatted numbers) |
| `forms.slots.*` | `{time}` |
| `forms.thanks.slotPhuket` / `slotSameZone` / `slotLocal` | `{day}` «November 12»; `{local}` and `{phuket}` times |
| `forms.thanks.formats.*` | `{writes}` (`forms.thanks.writes.*`), `{via}` (`forms.thanks.via.*`), `{when}` |
| `forms.guide.doneTitle` | `{channel}` (`forms.guide.to.*`) |
| `home.districts.more` | `{name}` district name |
| `home.invest.author` | `{name}` founder's name |
| `home.review.purchase` | `{purchase}` |
| `legal.edition` | `{date}` edition date, formatted |
| `legal.privacy.lead`, `legal.consent.lead` | `{name}` site name |
| `legal.privacy.operator.text`, `legal.consent.operator.text` | `{name}`, `{email}`; the e-mail becomes a link |
| `legal.privacy.rights.text`, `legal.consent.withdrawal.text` | `{email}` link |
| `legal.privacy.consent.text`, `legal.consent.more.text` | `{link}` (its text is the sibling `link` key) |
| `legal.credits.photos.author` / `license` / `changes`, `legal.credits.maps.text` | `{author}`, `{license}`, `{changes}`, `{attribution}`, `{date}` |
| `phuket.ownership.checkedBy` | `{name}` lawyer (hidden until a lawyer is confirmed) |
| `places.coastWithDistrict` | `{coast}`, `{district}` |
| `podbor.quiz.intro` | `{count}` (`countWords`) |
| `podbor.quiz.progress` | `{n}`, `{total}` |
| `podbor.quiz.prefilled` | `{direction}` |
| `podbor.quiz.keysHint` | `{n}` number of options; the leading «. » continues the previous sentence |
| `podbor.quiz.whoAnswers` | `{broker}` (`brokerFor.*`) |
| `podbor.quiz.doneLead` | `{who}` (`who` / `whoNamed`), `{verb}` (`verbs.*`), `{when}` |
| `podbor.quiz.doneLeadClosed` | `{time}` now on Phuket, `{open}` opening; appended to `doneLead`, so it starts with «. » |
| `podbor.quiz.whoNamed` | `{name}` visitor's name |
| `podbor.privacy.text` | `{privacy}` `{consent}` links (texts: `privacyLink`, `consentLink`) |

Some strings are built from parts instead of placeholders, for example
`forms.consent.label = { before, link, after }`: «Даю » + link «согласие на обработку
персональных данных» + «». Spaces at the joins are yours to place: before the link, after it, or
none.

## 5. Strings that are legal text

Translate them faithfully, without adapting or shortening, and keep their meaning complete. If
something cannot be translated faithfully, flag it.

- `legal.privacy.*` and `legal.consent.*`: the privacy policy and the consent to data processing.
  Keep every list item and paragraph.
- `legal.prevailNote`: already filled; it is shown under the title of both pages.
- `legal.edition`
- `forms.consent.*`: the consent checkbox under every form.
- `podbor.privacy.*`
- `meta.privacy`, `meta.consent`

## 6. Localization rules

**a) The audience is international buyers, not Russian investors.** Turn Russia-specific wording
into its international equivalent. **Never invent facts**: no new prices, flights, partners, laws or
people. If there is no honest equivalent, translate the fact as it is and flag it to the project
lead. The places to adapt:

- **Payment from Russia** («оплата из России», «Как оплатить покупку из России?»): the
  international equivalent is paying from abroad, money coming into Thailand in foreign currency
  with a bank confirmation. Keep «we offer no schemes around restrictions» as a plain statement.
  Where: `home.hero.lead`, `home.faq.items[2]`, `phuket.faq.items[2]`, `deal.payment.*`,
  `deal.stages.items[3]` (title and text).
- **Moscow time**: «по Москве», and Krasnoyarsk and Novosibirsk as «the same time as Phuket».
  - Use «your time» (the site shows the visitor's own clock) or «Phuket time».
  - Drop `{mskOpen}`/`{mskClose}` from `common.footer.hours` and `contacts.channels.hours`.
  - In `podbor.below[1].text`, which has the hours written out, write «9:00 am to 9:00 pm Phuket
    time» and drop the Moscow part.
  - `phuket.know.items.timeDifference` («+4 часа, разница с Москвой»): use the fact of Phuket's
    time zone, UTC+7 all year, no daylight saving time. For example, value «UTC+7», unit «» and a
    line about Phuket's time; the unit may stay empty.
- **The direct flight from Moscow** (Aeroflot, Sheremetyevo, `phuket.know.items.flight`): there is
  no confirmed international equivalent. Translate it faithfully and flag it to the lead. Do not
  write other routes.
- **«Гид инвестора для покупателей из России»** (`home.guide.text`, `home.guide.coverSubtitle`): «an
  investor's guide» for international buyers. Keep the year 2026/27 and the 8 chapters / 20 minutes.
- **Form examples**:
  - `forms.placeholders.email` «name@mail.ru» becomes «name@example.com».
  - In `forms.placeholders.telegram`, use a neutral international number format next to `@username`.
  - `forms.booking.placeholderViewing` «до 300 тыс. $» becomes «up to $300k».
  - The phone selector preselects «Other country» on English and Spanish pages (code fact).
- **Sample reviews**: keep the cities (`home.review.samples.*.city`: Krasnoyarsk, Moscow,
  Novosibirsk). They belong to the sample, and changing them would invent a buyer.
- **Latin transcriptions** in Russian copy («Kata, Karon» in brackets) are for Russian readers; you
  may drop them.
- **Place names**: use the standard English/Spanish forms. Examples: Phuket, Bang Tao, Layan,
  Kamala, Kata, Karon, Nai Harn, Rawai, Chalong, Laguna, Patong, Banana Beach, Big Buddha (Nakkerd
  Hill), Ya Nui, Pattaya, Uluwatu, Bukit Peninsula, Ubud, Dubai Marina, Palm Jumeirah, Koh Rong,
  Sihanoukville. Russian prepositional forms such as «на Пхукете», «в Банг Тао» and
  `podbor.quiz.brokerFor` («брокер по Пхукету») become natural phrases: «in Phuket», «a Phuket
  broker».
- **`home.jsonLd.alternateNames`**: the Cyrillic transcription of the brand. Leave the list empty, or
  keep only Latin forms.

**b) Keep every fact, number, price range and legal term.**
- Freehold: full ownership of a condominium unit, within the 49 % foreign quota of the building's
  floor area.
- Leasehold: the 30-year land lease for villas and land, with the extension written into the
  contract.
- A purchase gives no Thai visa.
- The UAE residence visa applies from a set purchase amount.
- No guaranteed income. Keep the disclaimer «Расчёт иллюстративный и не является индивидуальной
  инвестиционной рекомендацией».
- Keep the numbers: 15 minutes, 24 hours, 3–5 projects, 20 minutes, 400 ha, 18 holes, 7 km, 25/20
  minutes, 9 h 40 min / 10 h 15 min, 5+ years, 100+ clients, 2026, budgets 150/300/600 k$, slots
  11:00–18:00 Phuket time.
- Keep «Фото: Anton Zelenov» in `common.footer.photoCaption`: it is the author's request.

**c) Sample reviews stay labelled as samples.**
- `home.review.sampleLabel` («Пример отзыва») must stay explicit: «Sample review» / «Reseña de
  ejemplo».
- Captions «Пример формата: …» / «Пример объекта: …» say the photo shows a format, not a listing:
  «Example of the format: …» / «Example: …».

**d) Legal pages are translated faithfully.** They start with the line that the Russian text
prevails (`legal.prevailNote`, already filled). The legal basis named in Russian stays as it is.

**e) Tone.** Premium, calm, information style: short sentences, facts instead of adjectives, no
exclamation marks, no hype («best», «unique», «dream»). Verbs on buttons («Find a property»,
«Book a consultation»).
- **English**: American spelling and conventions (apartment, neighborhood, 12-hour clock).
- **Spanish**: Castilian, addressing the visitor as **usted** throughout (Indique, Elija, Escríbanos),
  24-hour clock.

## 7. Not shown yet

These can be translated last:
- `phuket.projects.*`, `districts.pages['bang-tao'].projects` (project cards are not on the pages yet)
- `districts.pages['bang-tao'].closing.telegramText`
- `phuket.ownership.checkedBy`
- `common.curtain.opened`

## 8. Checking your work

1. `pnpm exec tsc --noEmit -p .` in `site/` must pass. Ask the developer if you cannot run it.
2. In a build (`pnpm build`, then `pnpm exec next start -p 3103`), open `/en` or `/es` and every page
   under it. Check:
   - the header at 1280 px and 1440 px wide: one line, with a clear gap before the phone number;
   - the hero titles at 1024 px and wider: no line wraps;
   - the quiz tiles and the booking form on a 375 px phone.
3. Page titles (`meta.ts`): ≤ 60 characters; titles marked «absolute» carry the brand themselves.
   Descriptions: 140–160 characters.
