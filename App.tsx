import { useEffect, useRef } from 'react'
import { ArrowRight, ChevronLeft } from 'lucide-react'
import { Navigation } from './Navigation'
import { HomeView } from './HomeView'
import { NormalSmearView } from './NormalSmearView'
import { CBCPatternsView } from './CBCPatternsView'
import { AnemiaGameView } from './AnemiaGameView'
import { FlowCytometryView } from './FlowCytometryView'
import { MolecularPanelView } from './MolecularPanelView'
import { CoagulationView } from './CoagulationView'
import { CaseEngineView } from './CaseEngineView'
import { SettingsView } from './SettingsView'
import { GlossaryView } from './GlossaryView'
import { ReviewView } from './ReviewView'
import { useAppStore } from './store'
import { modules } from './curriculum'

const screens = {
  home: HomeView, 'normal-smear': NormalSmearView, 'cbc-patterns': CBCPatternsView, 'anemia-game': AnemiaGameView,
  'flow-cytometry': FlowCytometryView, 'molecular-panel': MolecularPanelView, coagulation: CoagulationView,
  'case-engine': CaseEngineView, settings: SettingsView, glossary: GlossaryView, review: ReviewView,
}

export function App() {
  const view = useAppStore(state => state.currentView)
  const dark = useAppStore(state => state.dark)
  const content = useRef<HTMLElement>(null)
  const previous = useRef(view)
  const Screen = screens[view]
  const position = modules.findIndex(module => module.id === view)
  const module = modules[position]
  const next = modules[position + 1]
  const title = module?.title ?? ({home: 'Hematology learning bench', settings: 'Learning settings', glossary: 'Glossary', review: 'Mixed review'} as Record<string, string>)[view]

  useEffect(() => {
    document.documentElement.classList.toggle('dark', dark)
  }, [dark])

  useEffect(() => {
    document.title = 'HemeBench · ' + title
    if (previous.current !== view) {
      window.scrollTo(0, 0)
      content.current?.focus({preventScroll: true})
    }
    previous.current = view
  }, [view, title])

  return <div className="app-shell">
    <button className="skip-link" onClick={() => content.current?.focus()}>Skip to content</button>
    <Navigation />
    <main ref={content} tabIndex={-1} className={module ? 'lesson-page' : undefined} key={view}>
      <Screen />
      {module && <nav className="lesson-footer" aria-label="Curriculum navigation">
        <a href="#home"><ChevronLeft size={16}/> Curriculum</a>
        <a href={'#' + (next?.id ?? 'review')}>{next?.title ?? 'Mixed review'} <ArrowRight size={16}/></a>
      </nav>}
    </main>
  </div>
}
