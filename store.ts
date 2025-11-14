import { create } from 'zustand'
import type { NavigationView, DiagnosticCase } from './types'

interface AppState {
  currentView: NavigationView
  setCurrentView: (view: NavigationView) => void

  // User progress tracking
  completedModules: Set<string>
  markModuleComplete: (moduleId: string) => void

  // Case tracking
  currentCase: DiagnosticCase | null
  setCurrentCase: (caseData: DiagnosticCase | null) => void

  // User preferences
  showHints: boolean
  toggleHints: () => void

  difficulty: 'beginner' | 'intermediate' | 'advanced'
  setDifficulty: (level: 'beginner' | 'intermediate' | 'advanced') => void
}

export const useAppStore = create<AppState>((set) => ({
  currentView: 'home',
  setCurrentView: (view) => set({ currentView: view }),

  completedModules: new Set<string>(),
  markModuleComplete: (moduleId) => set((state) => ({
    completedModules: new Set(state.completedModules).add(moduleId)
  })),

  currentCase: null,
  setCurrentCase: (caseData) => set({ currentCase: caseData }),

  showHints: true,
  toggleHints: () => set((state) => ({ showHints: !state.showHints })),

  difficulty: 'intermediate',
  setDifficulty: (level) => set({ difficulty: level }),
}))
