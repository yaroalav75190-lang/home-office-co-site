// Quiz state that survives a reload: an external store mirrored to sessionStorage (one tab,
// cleared when the tab closes and after a successful submit). Read with useSyncExternalStore:
// the server snapshot is the state from the URL (?country=, ?district=), the client snapshot
// is what the visitor already answered in this tab.

import type { BudgetId, DirectionId, GoalId, TimelineId } from '@/lib/lead'
import { type ChannelContactState, emptyChannelContact } from '../form-kit'

export type StepId = 'direction' | 'goal' | 'budget' | 'timeline' | 'contact'

export type QuizPrefill = { direction?: DirectionId; district?: string }

export type QuizState = {
  v: 1
  /** «phuket/bang-tao» — the URL prefill this state belongs to. */
  prefillKey: string
  /** Direction came from the URL and the visitor has not pressed «Изменить». */
  prefilled: boolean
  district?: string
  step: StepId
  direction?: DirectionId
  goal?: GoalId
  budget?: BudgetId
  timeline?: TimelineId
  name: string
  cc: ChannelContactState
  consent: boolean
  /** Goals already sent in this run (quiz_start, quiz_step_3). */
  sent: { start?: boolean; step3?: boolean }
}

const KEY = 'hoc-quiz-v1'

export function prefillKeyOf(p: QuizPrefill): string {
  return p.direction ? `${p.direction}${p.district ? `/${p.district}` : ''}` : ''
}

export function initialQuiz(p: QuizPrefill): QuizState {
  return {
    v: 1,
    prefillKey: prefillKeyOf(p),
    prefilled: Boolean(p.direction),
    district: p.direction === 'phuket' ? p.district : undefined,
    step: p.direction ? 'goal' : 'direction',
    direction: p.direction,
    name: '',
    cc: emptyChannelContact,
    consent: false,
    sent: {},
  }
}

/** Steps in order for a state: without the direction question when it came from the URL. */
export function stepsOf(s: Pick<QuizState, 'prefilled'>): StepId[] {
  return s.prefilled ? ['goal', 'budget', 'timeline', 'contact'] : ['direction', 'goal', 'budget', 'timeline', 'contact']
}

/**
 * The question steps of a run, without the contact step: what «Вопрос N из M» and the segmented
 * progress bar count (M = 4, or 3 when the direction came from the URL).
 */
export function questionStepsOf(s: Pick<QuizState, 'prefilled'>): StepId[] {
  return stepsOf(s).filter((step) => step !== 'contact')
}

let memory: QuizState | null = null
const listeners = new Set<() => void>()

function isState(value: unknown): value is QuizState {
  if (!value || typeof value !== 'object') return false
  const s = value as Partial<QuizState>
  return s.v === 1 && typeof s.step === 'string' && typeof s.prefillKey === 'string' && typeof s.name === 'string' && !!s.cc
}

/**
 * Client snapshot. Restores the tab's saved run when the URL carries no prefill or the same one;
 * a different prefill (a new entry from another page) starts fresh. Stable between writes.
 */
export function readQuiz(initial: QuizState): QuizState {
  if (memory && (!initial.prefillKey || memory.prefillKey === initial.prefillKey)) return memory
  memory = initial
  try {
    const raw = window.sessionStorage.getItem(KEY)
    if (raw) {
      const saved: unknown = JSON.parse(raw)
      if (isState(saved) && (!initial.prefillKey || saved.prefillKey === initial.prefillKey)) {
        memory = { ...saved, cc: { ...emptyChannelContact, ...saved.cc }, sent: saved.sent ?? {} }
        if (!stepsOf(memory).includes(memory.step)) memory = { ...memory, step: stepsOf(memory)[0] }
      }
    }
  } catch {
    // Storage blocked: the quiz still works, it just does not survive a reload.
  }
  return memory
}

export function writeQuiz(next: QuizState) {
  memory = next
  try {
    window.sessionStorage.setItem(KEY, JSON.stringify(next))
  } catch {
    // ignore
  }
  listeners.forEach((l) => l())
}

/** Applies a change to the latest state (never a stale render copy). */
export function updateQuiz(initial: QuizState, change: (s: QuizState) => QuizState) {
  writeQuiz(change(readQuiz(initial)))
}

/** After a successful submit: forget the run (the confirmation lives in component state). */
export function resetQuiz(initial: QuizState) {
  memory = initial
  try {
    window.sessionStorage.removeItem(KEY)
  } catch {
    // ignore
  }
  listeners.forEach((l) => l())
}

export function subscribeQuiz(listener: () => void) {
  listeners.add(listener)
  return () => {
    listeners.delete(listener)
  }
}
