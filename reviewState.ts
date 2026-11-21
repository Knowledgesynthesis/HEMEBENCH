import { create } from 'zustand'
import { modules } from './curriculum'
import { reviewItems } from './reviewItems'
import { readSaved, save } from './store'

export const itemsById = new Map(reviewItems.map(item => [item.id, item]))
interface Round {
  key: string
  ids: string[]
  index: number
  responses: number[]
}
interface ReviewHistory {
  round: Round | null
  missed: string[]
  lastMixed: string[]
}

function validIds(value: unknown): string[] {
  return Array.isArray(value) ? [...new Set(value.filter((id): id is string => typeof id === 'string' && itemsById.has(id)))] : []
}
function restore(): ReviewHistory {
  const saved = readSaved('review')
  const history: ReviewHistory = { round: null, missed: [], lastMixed: [] }
  if (!saved || typeof saved !== 'object') return history
  if ('missed' in saved) history.missed = validIds(saved.missed)
  if ('lastMixed' in saved) history.lastMixed = validIds(saved.lastMixed)
  if (!('round' in saved) || !saved.round || typeof saved.round !== 'object') return history
  const r = saved.round as Partial<Round>
  const ids = validIds(r.ids)
  if (typeof r.key !== 'string' || !ids.length || ids.length !== r.ids?.length || typeof r.index !== 'number' ||
      !Number.isInteger(r.index) || r.index < 0 || r.index > ids.length || !Array.isArray(r.responses) ||
      r.responses.length < r.index || r.responses.length > Math.min(ids.length, r.index + 1)) return history
  if (!r.responses.every((choice, index) => Number.isInteger(choice) && choice >= 0 && choice < itemsById.get(ids[index])!.options.length)) return history
  history.round = {key: r.key, ids, index: r.index, responses: r.responses}
  return history
}

function shuffled<T>(values: T[]) {
  const result = [...values]
  for (let i = result.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1))
    ;[result[i], result[j]] = [result[j], result[i]]
  }
  return result
}
function persist(history: ReviewHistory): ReviewHistory {
  save('review', { round: history.round, missed: history.missed, lastMixed: history.lastMixed })
  return history
}

interface ReviewState extends ReviewHistory {
  start: (mode: 'mixed' | 'missed') => void
  answer: (key: string, index: number, choice: number) => void
  advance: (key: string, index: number) => void
}

export const useReview = create<ReviewState>((set) => ({
  ...restore(),
  start: mode => set(state => {
    const ids = mode === 'missed' ? shuffled(state.missed) : shuffled(modules.map(module => {
      const candidates = reviewItems.filter(item => item.module === module.id)
      const fresh = candidates.filter(item => !state.lastMixed.includes(item.id))
      return shuffled(fresh.length ? fresh : candidates)[0].id
    }))
    if (!ids.length) return state
    const key = Date.now().toString(36) + Math.random().toString(36).slice(2)
    return persist({round: {key, ids, responses: [], index: 0}, lastMixed: mode === 'mixed' ? ids : state.lastMixed, missed: state.missed})
  }),
  answer: (key, index, choice) => set(state => {
    const r = state.round
    if (!r || r.key !== key || r.index !== index || r.responses.length !== index) return state
    const item = itemsById.get(r.ids[index])
    if (!item || !item.options[choice]) return state
    const missed = state.missed.filter(id => id !== item.id)
    if (item.answer !== choice) missed.push(item.id)
    return persist({round: {...r, responses: [...r.responses, choice]}, missed, lastMixed: state.lastMixed})
  }),
  advance: (key, index) => set(state => {
    const r = state.round
    if (!r || r.key !== key || r.index !== index || r.responses.length !== index + 1) return state
    return persist({...state, round: {...r, index: index + 1}})
  }),
}))

window.addEventListener('storage', event => {
  if (event.key === null || event.key === 'hemebench.v2.review') useReview.setState(restore())
})
