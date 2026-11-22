import { Activity, BookOpen, Dna, Droplet, FlaskConical, Microscope, ScanLine } from 'lucide-react'
import type { NavigationView } from './types'

export type ModuleId = Exclude<NavigationView, 'home' | 'review' | 'settings' | 'glossary'>

export const modules = [
  {
    id: 'normal-smear', title: 'Peripheral smear', group: 'Foundations', icon: Microscope,
    objective: 'Identify cells by their size, nucleus and granules.',
  },
  {
    id: 'cbc-patterns', title: 'CBC patterns', group: 'Foundations', icon: Activity,
    objective: 'Read cell counts alongside the indices and differential.',
  },
  {
    id: 'anemia-game', title: 'Anemia patterns', group: 'Foundations', icon: Droplet,
    objective: 'Use cell size and marrow response to narrow the differential.',
  },
  {
    id: 'coagulation', title: 'Coagulation', group: 'Special studies', icon: FlaskConical,
    objective: 'Interpret clotting times in the context of bleeding and medications.',
  },
  {
    id: 'flow-cytometry', title: 'Flow cytometry', group: 'Special studies', icon: ScanLine,
    objective: 'Interpret marker combinations on a gated cell population.',
  },
  {
    id: 'molecular-panel', title: 'Molecular findings', group: 'Special studies', icon: Dna,
    objective: 'Decide what a variant supports and what else you need.',
  },
  {
    id: 'case-engine', title: 'Integrated cases', group: 'Casework', icon: BookOpen,
    objective: 'Choose the next step as clinical and laboratory findings arrive.',
  },
] as const satisfies ReadonlyArray<{id: ModuleId, title: string, group: string, objective: string, icon: typeof Activity}>

export function isModuleId(value: unknown): value is ModuleId {
  return modules.some(module => module.id === value)
}

export function viewFromHash(): NavigationView {
  const id = window.location.hash.slice(1)
  return isModuleId(id) || id === 'review' || id === 'glossary' || id === 'settings' ? id : 'home'
}
