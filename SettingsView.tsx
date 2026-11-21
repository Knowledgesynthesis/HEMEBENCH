import { ArrowUpRight, Settings2 } from 'lucide-react'
import { useAppStore } from './store'

export function SettingsView() {
  const { showHints, toggleHints, dark, toggleDark } = useAppStore()
  return <div className="reading-page">
    <div className="eyebrow"><Settings2 size={15}/> Preferences</div>
    <h1>Learning settings</h1>
    <section className="exercise-card">
      <h2>At the bench</h2>
      <div className="setting-row"><div><h3>Practice hints</h3><p>Make optional clues available before you answer.</p></div>
        <button role="switch" aria-checked={showHints} aria-label="Practice hints" className="switch" onClick={toggleHints}><span /></button></div>
      <div className="setting-row"><div><h3>Dark appearance</h3><p>Use a darker reading surface.</p></div>
        <button role="switch" aria-checked={dark} aria-label="Dark appearance" className="switch" onClick={toggleDark}><span /></button></div>
    </section>
    <section className="exercise-card">
      <h2>Evidence and progress</h2>
      <p>The modules link to the sources behind their teaching points. Case values are fictional. Reference intervals on the bench belong to the example laboratory.</p>
      <p>A module earns a check after you answer its practice questions successfully. Mixed review tracks first answers separately. Progress and preferences are saved in this browser when local storage is available.</p>
      <a className="text-link" href="https://github.com/Knowledgesynthesis/HEMEBENCH" rel="noreferrer" target="_blank">Source code and content history <ArrowUpRight size={14}/></a>
    </section>
  </div>
}
