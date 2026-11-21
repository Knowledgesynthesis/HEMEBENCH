import { Settings2 } from 'lucide-react'
import { useAppStore } from './store'
import { isModuleId } from './curriculum'

export function Navigation() {
  const view = useAppStore(state => state.currentView)
  const links = [
    { id: 'home', label: 'Study bench', active: view === 'home' || isModuleId(view) },
    { id: 'review', label: 'Mixed review', active: view === 'review' },
    { id: 'glossary', label: 'Glossary', active: view === 'glossary' },
  ]
  return <header className="masthead">
    <div className="masthead-inner">
      <a className="wordmark" href="#home" aria-label="HemeBench home">
        <img src="/icon-192.png" alt="" width="32" height="32" /> HemeBench
      </a>
      <nav aria-label="Main navigation" className="site-nav">
        {links.map(link => <a key={link.id} href={'#' + link.id} aria-current={link.active ? (link.id === view ? 'page' : 'location') : undefined}>
          {link.label}
        </a>)}
      </nav>
      <a href="#settings" aria-label="Learning settings" title="Learning settings" className="settings-link" aria-current={view === 'settings' ? 'page' : undefined}><Settings2 size={19} /></a>
    </div>
  </header>
}
