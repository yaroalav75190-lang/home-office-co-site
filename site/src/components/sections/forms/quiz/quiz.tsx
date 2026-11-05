'use client'

// «Подбор объекта» quiz (art-direction §4 «Шаг квиза», §6 «/podbor»; texts copy-podbor, copy-global §10.1).
//
// - Four decisions (direction, goal, budget, timeline) and the contact step. With ?country= the
//   direction question is replaced by «Направление: Пхукет» + «Изменить» (three questions).
// - Tiles auto-advance on click, Space or Enter; keys 1–6 pick a tile; arrow keys move inside the
//   group without advancing. «Назад» from the second step.
// - Progress «Вопрос N из M» / «Последний шаг» in a polite live region + a segmented 4 px bar with
//   one segment per question actually shown (M = 4, or 3 when ?country= removed the direction
//   question); on the contact step every segment is filled (QA round 1 §8).
// - Step change: out 240 ms up, in from below 360 ms; nothing moves with reduced motion. Focus
//   moves to the new question heading.
// - State lives in sessionStorage (quiz-store), so a reload keeps the answers.
// - Confirmation only after `submitLead` resolved `{ ok: true }`; it carries `noindex` (seo-brief §6.5).

import { clsx } from 'clsx'
import {
  type FormEvent,
  type KeyboardEvent as ReactKeyboardEvent,
  type MouseEvent as ReactMouseEvent,
  type ReactNode,
  type Ref,
  useCallback,
  useEffect,
  useLayoutEffect,
  useMemo,
  useRef,
  useState,
  useSyncExternalStore,
} from 'react'
import { Button } from '@/components/ui/button'
import { ChoiceTile } from '@/components/ui/choice-tile'
import { ConsentCheckbox, TextField } from '@/components/ui/field'
import { ReplyTime } from '@/components/ui/reply-time'
import { useLocale } from '@/i18n/client'
import { capitalize, fmt } from '@/i18n/format'
import type { CommonDict } from '@/i18n/ru/common'
import type { PodborDict } from '@/i18n/ru/podbor'
import { trackGoal } from '@/lib/analytics'
import {
  type ChannelId,
  type DirectionId,
  type FormOptions,
  GUIDE_HREF,
  type LeadFieldName,
  type Option,
  fieldLabel,
  formOptions,
  validateName,
} from '@/lib/lead'
import type { PhotoKey } from '@/lib/photos'
import type { ReplyState } from '@/lib/reply-time'
import {
  ChannelContact,
  ChannelNote,
  ErrorSummary,
  type FieldErrors,
  Honeypot,
  SubmitButton,
  SubmitFailure,
  contactValue,
  readHoneypot,
  useLeadSubmit,
  validateChannelContact,
} from '../form-kit'
import { LiveLine } from '../live-line'
import { replyWhen, useReplyState } from '../use-clock'
import { QuizPhoto } from './quiz-photo'
import {
  type QuizPrefill,
  type QuizState,
  type StepId,
  initialQuiz,
  questionStepsOf,
  readQuiz,
  resetQuiz,
  stepsOf,
  subscribeQuiz,
  updateQuiz,
} from './quiz-store'

export type QuizArtKey = DirectionId | 'none'
/** Server-rendered pieces (coast drawings and locators carry map data that must not ship in JS). */
export type QuizArt = Record<QuizArtKey, { coast: ReactNode | null; locator: ReactNode | null }>

/** Words of the quiz (`podbor.quiz`) and the alt/caption of its photos, passed by the page. */
export type QuizText = PodborDict['quiz']
export type QuizPhotoText = Partial<Record<PhotoKey, { alt: string; caption: string }>>

type QuestionStep = Exclude<StepId, 'contact'>
type QuestionField = 'direction' | 'goal' | 'budget' | 'timeline'
type Question = { title: string; options: Option[]; field: QuestionField }

/** The four questions with their options in the page's language (ids and order are the API). */
function questionsOf(t: QuizText, o: FormOptions): Record<QuestionStep, Question> {
  return {
    direction: { title: t.questions.direction, options: o.quizDirections, field: 'direction' },
    goal: { title: t.questions.goal, options: o.goals, field: 'goal' },
    budget: { title: t.questions.budget, options: o.budgets, field: 'budget' },
    timeline: { title: t.questions.timeline, options: o.timelines, field: 'timeline' },
  }
}

const FIELD_OF: Record<QuestionStep, QuestionField> = {
  direction: 'direction',
  goal: 'goal',
  budget: 'budget',
  timeline: 'timeline',
}

const ANSWER_STEPS: QuestionStep[] = ['direction', 'goal', 'budget', 'timeline']

/**
 * First question whose saved answer is missing or no longer an option: a run restored from
 * sessionStorage after a deploy changed the option ids, or an edited storage value. Without this
 * check the server answered 400 «Бюджет: выберите один из вариантов» on the contact step, where
 * that question is not on screen, and the lead could not be sent.
 */
function firstMissingAnswer(s: QuizState, questions: Record<QuestionStep, Question>): QuestionStep | undefined {
  return ANSWER_STEPS.find((step) => !questions[step].options.some((o) => o.id === s[questions[step].field]))
}

const PHOTO: Record<QuizArtKey, PhotoKey> = {
  none: 'hero',
  undecided: 'hero',
  phuket: 'phuket',
  pattaya: 'pattaya',
  bali: 'bali',
  dubai: 'dubai',
  cambodia: 'cambodia',
}


const prefersReducedMotion = () =>
  typeof window !== 'undefined' && window.matchMedia('(prefers-reduced-motion: reduce)').matches

const isTyping = (el: EventTarget | null) =>
  el instanceof HTMLElement &&
  (el.isContentEditable || el.matches('input:not([type="radio"]):not([type="checkbox"]), textarea, select'))

/** «Анна, брокер напишет вам в Telegram до 16:55» and the other copy-global §10.1 variants. */
function thanksLead(name: string, channel: ChannelId, s: ReplyState | null, t: QuizText, reply: CommonDict['reply']): string {
  const who = name ? fmt(t.whoNamed, { name }) : t.who
  const verb = t.verbs[channel]
  if (!s) return fmt(t.doneLead, { who, verb, when: reply.when.fallback })
  const tail = !s.open && s.known ? fmt(t.doneLeadClosed, { time: s.timeBroker, open: s.openText }) : ''
  return fmt(t.doneLead, { who, verb, when: replyWhen(s, reply) }) + tail
}

/**
 * The investor guide PDF exists. Until then the confirmation does not offer it: the button would
 * lead to a guide block that is not there yet (copy-round2 §5, copy-home §9).
 */
const GUIDE_READY = false

/** Lead over the first question: «Четыре вопроса и контакт», «Три…» when the country came from the URL. */
function countWord(n: number, t: QuizText): string {
  return n === 3 ? t.countWords.three : n === 4 ? t.countWords.four : String(n)
}

export function Quiz({
  prefill,
  art,
  t,
  photos,
}: {
  prefill: QuizPrefill
  art: QuizArt
  t: QuizText
  photos: QuizPhotoText
}) {
  const { locale, t: messages } = useLocale()
  const options = useMemo(() => formOptions(messages.forms, locale), [messages.forms, locale])
  const questions = useMemo(() => questionsOf(t, options), [t, options])
  const initial = useMemo(
    () => initialQuiz({ direction: prefill.direction, district: prefill.district }),
    [prefill.direction, prefill.district],
  )
  const state = useSyncExternalStore(
    subscribeQuiz,
    () => readQuiz(initial),
    () => initial,
  )
  const update = useCallback((change: (s: QuizState) => QuizState) => updateQuiz(initial, change), [initial])

  const steps = stepsOf(state)
  const index = Math.max(0, steps.indexOf(state.step))
  // The contact step is not a question: it has no segment of its own and the label says
  // «Последний шаг», so the bar has exactly as many segments as the «из M» count.
  const questionSteps = questionStepsOf(state)
  const questionCount = questionSteps.length
  const onContact = state.step === 'contact'
  const first = index === 0
  const [done, setDone] = useState<{ name: string; channel: ChannelId; art: QuizArtKey } | null>(null)

  const stepRef = useRef<HTMLDivElement>(null)
  const headingRef = useRef<HTMLHeadingElement>(null)
  const doneRef = useRef<HTMLHeadingElement>(null)
  const navigated = useRef(false)
  const moving = useRef(false)
  const arrowKey = useRef(false)
  const advanceTimer = useRef<ReturnType<typeof setTimeout> | undefined>(undefined)

  useEffect(() => () => clearTimeout(advanceTimer.current), [])

  // Out 240 ms up, then the new step mounts and comes in from below (layout effect below).
  const goTo = useCallback(
    async (next: StepId, change?: (s: QuizState) => QuizState) => {
      if (moving.current) return
      moving.current = true
      const el = stepRef.current
      if (el && !prefersReducedMotion()) {
        await el
          .animate([{ opacity: 1, transform: 'translateY(0)' }, { opacity: 0, transform: 'translateY(-24px)' }], {
            duration: 240,
            easing: 'cubic-bezier(.65,0,.35,1)',
            fill: 'forwards',
          })
          .finished.catch(() => undefined)
      }
      navigated.current = true
      update((s) => {
        const changed = change ? change(s) : s
        const sent = { ...changed.sent }
        if (next === 'budget' && !sent.step3) {
          sent.step3 = true
          trackGoal('quiz_step_3')
        }
        return { ...changed, step: next, sent }
      })
      moving.current = false
    },
    [update],
  )

  useLayoutEffect(() => {
    if (!navigated.current) return
    navigated.current = false
    const el = stepRef.current
    if (el && !prefersReducedMotion()) {
      el.animate([{ opacity: 0, transform: 'translateY(24px)' }, { opacity: 1, transform: 'translateY(0)' }], {
        duration: 360,
        easing: 'cubic-bezier(.16,1,.3,1)',
      })
    }
    headingRef.current?.focus()
  }, [state.step])

  useEffect(() => {
    if (done) doneRef.current?.focus()
  }, [done])

  const choose = useCallback(
    (step: QuestionStep, value: string, advance: boolean) => {
      const field = FIELD_OF[step]
      update((s) => {
        const next: QuizState = { ...s, [field]: value }
        if (field === 'direction' && value !== 'phuket') next.district = undefined
        if (!s.sent.start) {
          next.sent = { ...s.sent, start: true }
          trackGoal('quiz_start')
        }
        return next
      })
      if (!advance) return
      clearTimeout(advanceTimer.current)
      const nextStep = steps[steps.indexOf(step) + 1]
      // A short pause so the chosen tile is seen in its selected state.
      advanceTimer.current = setTimeout(() => void goTo(nextStep), prefersReducedMotion() ? 0 : 160)
    },
    [goTo, steps, update],
  )

  // Keys 1–6 pick a tile on question steps, only while focus is inside the quiz (WCAG 2.1.4): the
  // quiz moves focus to each new question, so keyboard users keep the shortcut.
  useEffect(() => {
    if (done || state.step === 'contact') return
    const step = state.step as QuestionStep
    const onKey = (e: KeyboardEvent) => {
      if (e.altKey || e.ctrlKey || e.metaKey || isTyping(e.target)) return
      if (!(e.target instanceof Element) || !e.target.closest('[data-quiz]')) return
      if (!/^[1-6]$/.test(e.key)) return
      const option = questions[step].options[Number(e.key) - 1]
      if (!option) return
      e.preventDefault()
      choose(step, option.id, true)
    }
    document.addEventListener('keydown', onKey)
    return () => document.removeEventListener('keydown', onKey)
  }, [choose, done, questions, state.step])

  const artKey: QuizArtKey = done?.art ?? (state.direction && state.direction !== 'undecided' ? state.direction : 'none')
  const photo = PHOTO[artKey]
  const progressText = onContact ? t.lastStep : fmt(t.progress, { n: index + 1, total: questionCount })

  const directionLabel = options.quizDirections.find((d) => d.id === state.direction)?.label
  const districtLabel = options.quizDistricts.find((d) => d.id === state.district)?.label

  return (
    <div data-quiz="" className="col-span-full grid grid-cols-subgrid gap-y-8">
      {/* Photo of the chosen direction: sticky column 8–12 on desktop, 21:9 strip on phones. */}
      <div className="col-span-full lg:col-span-5 lg:col-start-8 lg:row-start-1">
        <div className="lg:sticky lg:top-[calc(var(--header-h)+2rem)]">
          <figure>
            <QuizPhoto photo={photo} alt={photos[photo]?.alt ?? ''} />
            <figcaption className="type-small mt-3 flex items-center gap-2 text-ink-muted">
              {art[artKey].locator ? (
                <span className="inline-flex size-6 shrink-0 items-center justify-center" aria-hidden="true">
                  {art[artKey].locator}
                </span>
              ) : null}
              <span>{photos[photo]?.caption}</span>
            </figcaption>
          </figure>
          <div className="mt-10 hidden items-end gap-6 lg:flex">
            {art[artKey].coast ? <div className="h-24 shrink-0 text-laterite">{art[artKey].coast}</div> : null}
            <LiveLine
              tone="body"
              className="max-w-[32ch]"
              render={(s) => fmt(t.columnLine, { when: replyWhen(s, messages.common.reply) })}
              fallback={t.columnFallback}
            />
          </div>
        </div>
      </div>

      <div className="col-span-full lg:col-span-7 lg:row-start-1">
        <h1 className={clsx('type-d2', (!first || done) && 'sr-only')}>{t.title}</h1>
        <p className={clsx('type-lead mt-6 max-w-[40ch]', (!first || done) && 'sr-only')}>
          {fmt(t.intro, { count: countWord(questionCount, t) })}
        </p>

        {done ? (
          <QuizThanks done={done} doneRef={doneRef} t={t} />
        ) : (
          <div className={clsx(first ? 'mt-10 lg:mt-12' : 'mt-0')}>
            {state.prefilled && state.step !== 'contact' && directionLabel ? (
              <p className="type-ui mb-6 flex flex-wrap items-baseline gap-x-4 gap-y-1">
                <span>
                  {fmt(t.prefilled, { direction: directionLabel })}
                  {districtLabel ? `, ${districtLabel}` : ''}
                </span>
                <button
                  type="button"
                  className="link-underline type-ui -my-3 py-3 text-ink-muted hover:text-ink"
                  onClick={() => void goTo('direction', (s) => ({ ...s, prefilled: false }))}
                >
                  {t.change}
                </button>
              </p>
            ) : null}

            <div className="mb-8">
              <p aria-live="polite" className="type-small nums text-ink-muted">
                {progressText}
              </p>
              <div className="mt-3 flex gap-1" aria-hidden="true">
                {questionSteps.map((s, i) => (
                  <span
                    key={s}
                    className={clsx(
                      'h-1 flex-1 transition-colors duration-320',
                      onContact || i <= index ? 'bg-ink' : 'bg-sand',
                    )}
                  />
                ))}
              </div>
            </div>

            <div ref={stepRef} key={state.step} data-quiz-step="">
              {state.step === 'contact' ? (
                <ContactStep
                  state={state}
                  update={update}
                  headingRef={headingRef}
                  t={t}
                  questions={questions}
                  brokerFor={t.brokerFor[artKey]}
                  onBack={() => void goTo(steps[index - 1])}
                  onMissingAnswer={(step) =>
                    void goTo(step, (s) => {
                      const next: QuizState = { ...s }
                      next[FIELD_OF[step]] = undefined
                      // The direction question is hidden while the URL prefill holds: show it again.
                      if (step === 'direction') return { ...next, prefilled: false, district: undefined }
                      return next
                    })
                  }
                  onDone={(name, channel) => {
                    setDone({ name, channel, art: artKey })
                    resetQuiz(initial)
                  }}
                />
              ) : (
                <QuestionStepView
                  question={questions[state.step as QuestionStep]}
                  t={t}
                  step={state.step as QuestionStep}
                  value={state[FIELD_OF[state.step as QuestionStep]]}
                  headingRef={headingRef}
                  showBack={index > 0}
                  onBack={() => void goTo(steps[index - 1])}
                  onArrow={(down) => {
                    arrowKey.current = down
                  }}
                  onPick={(value, e) => {
                    // Keyboard clicks from arrow keys only move the selection (detail 0 = not a pointer).
                    const fromArrow = e.detail === 0 && arrowKey.current
                    arrowKey.current = false
                    choose(state.step as QuestionStep, value, !fromArrow)
                  }}
                  onSelect={(value) => choose(state.step as QuestionStep, value, false)}
                  onEnter={(value) => choose(state.step as QuestionStep, value, true)}
                />
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  )
}

/* ───────────────────────── Question step ───────────────────────── */

function QuestionStepView({
  question: q,
  t,
  step,
  value,
  headingRef,
  showBack,
  onBack,
  onArrow,
  onPick,
  onSelect,
  onEnter,
}: {
  question: Question
  t: QuizText
  step: QuestionStep
  value: string | undefined
  headingRef: Ref<HTMLHeadingElement>
  showBack: boolean
  onBack: () => void
  /** true on an arrow key, false on a pointer press (resets a stale arrow flag). */
  onArrow: (down: boolean) => void
  onPick: (value: string, e: ReactMouseEvent<HTMLInputElement>) => void
  onSelect: (value: string) => void
  onEnter: (value: string) => void
}) {
  const hintId = `quiz-hint-${step}`
  return (
    <fieldset
      aria-describedby={hintId}
      className="min-w-0"
      onKeyDown={(e: ReactKeyboardEvent) => {
        if (e.key.startsWith('Arrow')) onArrow(true)
      }}
      onPointerDown={() => onArrow(false)}
    >
      <legend className="mb-8 block w-full">
        <h2 ref={headingRef} tabIndex={-1} data-reveal="lines" className="type-d3 max-w-[24ch]">
          {q.title}
        </h2>
      </legend>
      <div data-reveal="items" className="grid gap-2 md:grid-cols-2">
        {q.options.map((option) => (
          <ChoiceTile
            key={option.id}
            name={`quiz-${step}`}
            value={option.id}
            checked={value === option.id}
            label={option.label}
            description={option.description}
            onChange={() => onSelect(option.id)}
            onClick={(e) => onPick(option.id, e)}
            onKeyDown={(e) => {
              if (e.key === 'Enter') {
                e.preventDefault()
                onEnter(option.id)
              }
            }}
          />
        ))}
      </div>
      <p id={hintId} className="type-small mt-6 text-ink-muted">
        {t.hint}
        <span className="hidden lg:inline [@media(hover:none)]:hidden">{fmt(t.keysHint, { n: q.options.length })}</span>
      </p>
      <p className="type-small mt-1 text-ink-muted">{t.personal}</p>
      {showBack ? <BackButton onClick={onBack} label={t.back} /> : null}
    </fieldset>
  )
}

function BackButton({ onClick, label }: { onClick: () => void; label: string }) {
  return (
    <button type="button" onClick={onClick} className="type-ui mt-8 inline-flex min-h-11 items-center">
      <span className="link-underline">{label}</span>
    </button>
  )
}

/* ───────────────────────── Contact step ───────────────────────── */

const ORDER: LeadFieldName[] = ['name', 'channel', 'contact', 'consent']

function ContactStep({
  state,
  update,
  headingRef,
  t,
  questions,
  brokerFor,
  onBack,
  onMissingAnswer,
  onDone,
}: {
  state: QuizState
  update: (change: (s: QuizState) => QuizState) => void
  headingRef: Ref<HTMLHeadingElement>
  t: QuizText
  questions: Record<QuestionStep, Question>
  brokerFor: string
  onBack: () => void
  /** A question's answer is missing or rejected by the server: go back to that question. */
  onMissingAnswer: (step: QuestionStep) => void
  onDone: (name: string, channel: ChannelId) => void
}) {
  const [errors, setErrors] = useState<FieldErrors>({})
  const [summary, setSummary] = useState<{ label: string; targetId: string }[]>([])
  const [focusTarget, setFocusTarget] = useState<'summary' | 'failure' | null>(null)
  const { status, failure, send } = useLeadSubmit()
  const summaryRef = useRef<HTMLDivElement>(null)
  const failureRef = useRef<HTMLDivElement>(null)
  const formRef = useRef<HTMLFormElement>(null)
  const busy = status === 'busy'
  const p = 'podbor'
  const { t: messages } = useLocale()
  const f = messages.forms
  const m = f.messages

  useEffect(() => {
    if (focusTarget === 'summary') summaryRef.current?.focus()
    if (focusTarget === 'failure') failureRef.current?.focus()
  }, [focusTarget, summary, failure])

  const clear = (field: LeadFieldName) =>
    setErrors((prev) => {
      if (!prev[field]) return prev
      const next = { ...prev }
      delete next[field]
      return next
    })

  const showErrors = (e: FieldErrors) => {
    setErrors(e)
    const items = (Object.keys(e) as LeadFieldName[])
      .sort((a, b) => ORDER.indexOf(a) - ORDER.indexOf(b))
      .map((field) => ({ label: fieldLabel(field, f, state.cc.channel), targetId: `${p}-${field}` }))
    setSummary(items)
    setFocusTarget(items.length ? 'summary' : null)
  }

  const onSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    if (busy) return
    const missing = firstMissingAnswer(state, questions)
    if (missing) {
      onMissingAnswer(missing)
      return
    }
    const e: FieldErrors = {}
    const nameError = validateName(state.name, m)
    if (nameError) e.name = nameError
    Object.assign(e, validateChannelContact(state.cc, m))
    if (!state.consent) e.consent = m.consent
    if (Object.keys(e).length) {
      showErrors(e)
      return
    }
    setSummary([])
    const { contact, phoneCountry } = contactValue(state.cc)
    const fields: Record<string, string> = {
      name: state.name.trim(),
      channel: state.cc.channel,
      contact,
      consent: 'yes',
      direction: state.direction ?? '',
      goal: state.goal ?? '',
      budget: state.budget ?? '',
      timeline: state.timeline ?? '',
      website: readHoneypot(event.currentTarget),
    }
    if (state.district) fields.district = state.district
    if (phoneCountry) fields.phoneCountry = phoneCountry
    const result = await send({ type: 'quiz', fields, page: '/podbor' })
    if (result.ok) {
      onDone(state.name.trim(), state.cc.channel as ChannelId)
      return
    }
    if (result.reason === 'validation' && result.fieldErrors) {
      // Errors on the answers (or the district from the URL) belong to a question, not to this step.
      const errors = result.fieldErrors
      const answer = errors.district ? 'direction' : ANSWER_STEPS.find((step) => errors[FIELD_OF[step]])
      if (answer) onMissingAnswer(answer)
      else showErrors(errors)
    } else setFocusTarget('failure')
  }

  return (
    <form ref={formRef} method="post" noValidate onSubmit={onSubmit} className="ym-disable-keys relative" aria-busy={busy || undefined}>
      <Honeypot />
      <h2 ref={headingRef} tabIndex={-1} data-reveal="lines" className="type-d3">
        {t.contactTitle}
      </h2>

      {/* Who answers (copy-podbor step 5). The role only: brokers' names and photos come with the
          team shoot (DEMO_DECISIONS «Люди и отзывы»), the card gets them then. */}
      <p className="type-body mt-8">{fmt(t.whoAnswers, { broker: brokerFor })}</p>

      <div className="mt-10 flex flex-col gap-8">
        <ErrorSummary items={summary} summaryRef={summaryRef} />
        <TextField
          id={`${p}-name`}
          label={t.nameLabel}
          autoComplete="name"
          value={state.name}
          error={errors.name}
          validate={(v) => validateName(v, m)}
          onChange={(e) => {
            clear('name')
            const value = e.currentTarget.value
            update((s) => ({ ...s, name: value }))
          }}
        />
        <ChannelContact
          idPrefix={p}
          state={state.cc}
          onChange={(cc) => update((s) => ({ ...s, cc }))}
          errors={errors}
          onFieldEdit={clear}
        />
        <ConsentCheckbox
          id={`${p}-consent`}
          checked={state.consent}
          error={errors.consent}
          onChange={(e) => {
            clear('consent')
            const checked = e.currentTarget.checked
            update((s) => ({ ...s, consent: checked }))
          }}
        />
        {failure ? (
          <SubmitFailure
            result={failure}
            onRetry={() => formRef.current?.requestSubmit()}
            busy={busy}
            failureRef={failureRef}
            variant="primary"
          />
        ) : null}
        <div className="flex flex-col items-start gap-3">
          <SubmitButton label={t.submit} busy={busy} variant="primary" />
          <ReplyTime className="max-w-[40ch]" />
          <ChannelNote />
        </div>
      </div>
      <BackButton onClick={onBack} label={t.back} />
    </form>
  )
}

/* ───────────────────────── Confirmation ───────────────────────── */

function QuizThanks({
  done,
  doneRef,
  t,
}: {
  done: { name: string; channel: ChannelId; art: QuizArtKey }
  doneRef: Ref<HTMLHeadingElement>
  t: QuizText
}) {
  const s = useReplyState()
  const { t: messages } = useLocale()
  const reply = messages.common.reply
  const when = s ? capitalize(replyWhen(s, reply)) : t.next.firstFallback
  const next = [
    { lead: `${when}.`, text: t.next.first[done.channel] },
    { lead: t.next.secondLead, text: t.next.second },
    { lead: t.next.thirdLead, text: t.next.third },
  ]
  return (
    // `data-quiz-done` / `data-reveal="items"`: the lines rise in turn and the column's coast draws
    // again (motion late-nodes). Items, not SplitText lines: a live region must keep its text nodes.
    <div className="mt-2" role="status" data-quiz-done="" data-reveal="items">
      {/* The result has no URL of its own; noindex in case a crawler ever renders it (seo-brief §6.5). */}
      <meta name="robots" content="noindex, nofollow" />
      <h2 ref={doneRef} tabIndex={-1} className="type-d2">
        {t.doneTitle}
      </h2>
      <p className="type-lead nums mt-6 max-w-[44ch]">{thanksLead(done.name, done.channel, s, t, reply)}</p>

      <p className="type-body mt-8">{fmt(t.whoAnswers, { broker: t.brokerFor[done.art] })}</p>

      <ol role="list" className="mt-12 flex max-w-[60ch] flex-col gap-6">
        {next.map((item) => (
          <li key={item.lead} className="type-body nums">
            <span className="font-medium">{item.lead}</span> {item.text}
          </li>
        ))}
      </ol>

      {GUIDE_READY ? (
        <div className="mt-12 flex flex-col items-start gap-3">
          <Button href={GUIDE_HREF}>{t.guideCta}</Button>
          <p className="type-small max-w-[48ch] text-ink-muted">{t.guideNote}</p>
        </div>
      ) : null}
    </div>
  )
}
