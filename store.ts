import { create } from 'zustand'
import { isModuleId, viewFromHash } from './curriculum'
import type { ModuleId } from './curriculum'
import type { NavigationView } from './types'

const prefix = 'hemebench.v2.'

export function readSaved(key: string): unknown {
  try {
    const value = localStorage.getItem(prefix + key)
    return value === null ? null : JSON.parse(value)
  } catch {
    return null
  }
}

export function save(key: string, value: unknown) {
  try {
    localStorage.setItem(prefix + key, JSON.stringify(value))
  } catch {
    // Practice remains available in memory when browser storage is full or blocked.
  }
}

function savedModules(): ModuleId[] {
  const ids = readSaved('completed')
  return Array.isArray(ids) ? [...new Set(ids.filter(isModuleId))] : []
}

interface AppState {
  currentView: NavigationView
  setCurrentView: (view: NavigationView) => void
  completedModules: ModuleId[]
  markModuleComplete: (id: ModuleId) => void
  showHints: boolean
  toggleHints: () => void
  dark: boolean
  toggleDark: () => void
}

export const useAppStore = create<AppState>((set) => ({
  currentView: viewFromHash(),
  setCurrentView: view => {
    if (view !== viewFromHash()) window.location.hash = view
    set({ currentView: view })
  },
  completedModules: savedModules(),
  markModuleComplete: id => set(state => {
    const completedModules = [...new Set([...savedModules(), ...state.completedModules, id])]
    save('completed', completedModules)
    return { completedModules }
  }),
  showHints: readSaved('hints') !== false,
  toggleHints: () => set(state => {
    save('hints', !state.showHints)
    return { showHints: !state.showHints }
  }),
  dark: readSaved('dark') === true,
  toggleDark: () => set(state => {
    save('dark', !state.dark)
    return { dark: !state.dark }
  }),
}))

window.addEventListener('hashchange', () => useAppStore.setState({ currentView: viewFromHash() }))
window.addEventListener('storage', event => {
  if (event.key === null || event.key.startsWith(prefix)) {
    useAppStore.setState({ completedModules: savedModules(), showHints: readSaved('hints') !== false, dark: readSaved('dark') === true })
  }
})
