// React import not needed with new JSX transform
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
import { useAppStore } from './store'

export function App() {
  const currentView = useAppStore((state) => state.currentView)

  return (
    <div className="min-h-screen bg-background text-foreground">
      <Navigation />
      <main className="pt-0 md:pt-16">
        {currentView === 'home' && <HomeView />}
        {currentView === 'normal-smear' && <NormalSmearView />}
        {currentView === 'cbc-patterns' && <CBCPatternsView />}
        {currentView === 'anemia-game' && <AnemiaGameView />}
        {currentView === 'flow-cytometry' && <FlowCytometryView />}
        {currentView === 'molecular-panel' && <MolecularPanelView />}
        {currentView === 'coagulation' && <CoagulationView />}
        {currentView === 'case-engine' && <CaseEngineView />}
        {currentView === 'settings' && <SettingsView />}
        {currentView === 'glossary' && <GlossaryView />}
      </main>
    </div>
  )
}
