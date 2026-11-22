import { useState } from 'react'
import { ArrowDown, ArrowRight, ArrowUpRight, Check } from 'lucide-react'
import { modules } from './curriculum'
import { useAppStore } from './store'

const filters = ['All modules', 'Foundations', 'Special studies', 'Casework'] as const

export function HomeView() {
  const completed = useAppStore(state => state.completedModules)
  const [filter, setFilter] = useState<typeof filters[number]>('All modules')
  const next = modules.find(module => !completed.includes(module.id))
  const visible = modules.filter(module => filter === 'All modules' || module.group === filter)

  return <div className="home-page">
    <section className="bench-hero" aria-labelledby="bench-title">
      <div className="hero-text">
        <div className="eyebrow hero-eyebrow"><span className="tiny-rule" /> Blood film &amp; laboratory interpretation</div>
        <h1 id="bench-title">Hematology<br/><em>study bench</em></h1>
        <p>Start with a blood film. Work through counts, markers and case findings to decide what the evidence supports.</p>
        <div className="hero-actions">
          <a className="primary-link" href={'#' + (next?.id ?? 'review')}>{next ? (completed.length ? 'Continue learning' : 'Start with the smear') : 'Start mixed review'} <ArrowRight size={17} /></a>
          <button className="quiet-link" onClick={() => { const heading = document.getElementById('modules-heading'); heading?.focus({preventScroll:true}); heading?.scrollIntoView({block:'start'}) }}>Browse modules <ArrowDown size={15} /></button>
        </div>
      </div>
      <figure className="specimen">
        <img src="/smear-field.webp" width="800" height="600" alt="A neutrophil with a segmented purple nucleus surrounded by red cells." fetchPriority="high" />
        <figcaption><span className="figure-mark" aria-hidden="true"></span><span>Segmented neutrophil · MGG stain</span><a href="https://commons.wikimedia.org/wiki/File:Neutrophil.jpg" target="_blank" rel="noreferrer" aria-label="T. Leonardi, photograph source and license">T. Leonardi <ArrowUpRight size={12}/></a></figcaption>
      </figure>
    </section>

    <section className="curriculum-section" aria-labelledby="modules-heading">
      <div className="section-heading">
        <h2 id="modules-heading" tabIndex={-1}>The curriculum</h2>
        <div className="progress-summary">
          <span><b>{completed.length} of {modules.length}</b> modules checked</span>
          <progress aria-label="Modules checked" value={completed.length} max={modules.length}/>
        </div>
      </div>
      <div className="filters" role="group" aria-label="Filter modules">{filters.map(item => <button key={item} onClick={() => setFilter(item)} aria-pressed={item === filter}>{item}</button>)}</div>
      <div className="module-grid">
        {visible.map(module => <a className="module-card" href={'#'+module.id} key={module.id}>
          <div className="module-top"><span className="module-icon"><module.icon size={23} strokeWidth={1.6} /></span><span className="module-group">{completed.includes(module.id) ? <><Check size={14}/> Checked</> : module.group}</span></div>
          <h3>{module.title}</h3><p>{module.objective}</p><ArrowUpRight className="open-module" size={16} aria-hidden="true"/>
        </a>)}
      </div>
    </section>
    <section className="review-banner"><div><h2>Test your recall</h2><p>Work a mixed round, then retry the decisions you missed.</p></div><a href="#review" className="secondary-link">Open mixed review <ArrowRight size={16}/></a></section>
  </div>
}
