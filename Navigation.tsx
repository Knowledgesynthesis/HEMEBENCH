import React from 'react'
import {
  Home,
  Microscope,
  Activity,
  Target,
  Dna,
  Droplets,
  FlaskConical,
  BookOpen,
  Settings
} from 'lucide-react'
import { useAppStore } from './store'
import { cn } from './utils'
import type { NavigationView } from './types'

interface NavItem {
  id: NavigationView
  label: string
  icon: React.ReactNode
}

const navItems: NavItem[] = [
  { id: 'home', label: 'Home', icon: <Home size={20} /> },
  { id: 'normal-smear', label: 'Normal Smear', icon: <Microscope size={20} /> },
  { id: 'cbc-patterns', label: 'CBC Patterns', icon: <Activity size={20} /> },
  { id: 'anemia-game', label: 'Anemia 2×2', icon: <Target size={20} /> },
  { id: 'flow-cytometry', label: 'Flow Cyto', icon: <Droplets size={20} /> },
  { id: 'molecular-panel', label: 'Molecular', icon: <Dna size={20} /> },
  { id: 'coagulation', label: 'Coagulation', icon: <FlaskConical size={20} /> },
  { id: 'case-engine', label: 'Cases', icon: <BookOpen size={20} /> },
]

export function Navigation() {
  const { currentView, setCurrentView } = useAppStore()

  return (
    <nav className="fixed bottom-0 left-0 right-0 bg-card border-t border-border z-50 md:top-0 md:bottom-auto md:border-b md:border-t-0">
      <div className="flex justify-around md:justify-start md:gap-1 md:px-4 overflow-x-auto">
        {navItems.map((item) => (
          <button
            key={item.id}
            onClick={() => setCurrentView(item.id)}
            className={cn(
              'flex flex-col md:flex-row items-center justify-center gap-1 md:gap-2 px-3 py-2 md:px-4 md:py-3 text-xs md:text-sm font-medium transition-colors min-w-[60px] md:min-w-0',
              currentView === item.id
                ? 'text-primary bg-accent'
                : 'text-muted-foreground hover:text-foreground hover:bg-accent/50'
            )}
          >
            {item.icon}
            <span className="md:inline">{item.label}</span>
          </button>
        ))}
        <button
          onClick={() => setCurrentView('settings')}
          className={cn(
            'flex flex-col md:flex-row items-center justify-center gap-1 md:gap-2 px-3 py-2 md:px-4 md:py-3 text-xs md:text-sm font-medium transition-colors min-w-[60px] md:min-w-0 md:ml-auto',
            currentView === 'settings'
              ? 'text-primary bg-accent'
              : 'text-muted-foreground hover:text-foreground hover:bg-accent/50'
          )}
        >
          <Settings size={20} />
          <span className="md:inline">Settings</span>
        </button>
      </div>
    </nav>
  )
}
