import { useEffect, useRef, useState } from 'react'
import { create } from 'zustand'
import { ArrowLeft, ArrowRight, CheckCircle2 } from 'lucide-react'
import { Card, CardContent, CardHeader, CardTitle } from './Card'
import { Button } from './Button'
import { caseWorkups } from './caseWorkups'
import { readSaved, save, useAppStore } from './store'

function savedCases() {
  return caseWorkups.filter(item => readSaved('case.' + item.id) === true).map(item => item.id)
}

const useCaseHistory = create<{ completed: string[] }>(() => ({ completed: savedCases() }))

function updateCaseHistory(id?: string) {
  if (id) save('case.' + id, true)
  const completed = new Set([...useCaseHistory.getState().completed, ...savedCases()])
  if (id) completed.add(id)
  if (completed.size !== useCaseHistory.getState().completed.length) {
    useCaseHistory.setState({ completed: [...completed] })
  }
  const app = useAppStore.getState()
  if (completed.size === caseWorkups.length && !app.completedModules.includes('case-engine')) {
    app.markModuleComplete('case-engine')
  }
}

// Reconcile a saved final case if the previous session closed before writing the module check.
updateCaseHistory()
window.addEventListener('storage', event => {
  if (event.key === null) useCaseHistory.setState({ completed: savedCases() })
  else updateCaseHistory()
})

export function CaseEngineView() {
  const setCurrentView = useAppStore((s) => s.setCurrentView)
  const completedCases = useCaseHistory((s) => s.completed)
  const showHints = useAppStore((s) => s.showHints)
  const [caseIndex, setCaseIndex] = useState<number | null>(null)
  const [step, setStep] = useState(0)
  const [answer, setAnswer] = useState<number | null>(null)
  const questionHeading = useRef<HTMLHeadingElement>(null)
  const listHeading = useRef<HTMLHeadingElement>(null)
  const hasOpenedCase = useRef(false)
  const workup = caseIndex === null ? undefined : caseWorkups[caseIndex]
  const decision = workup?.decisions[step]
  const correct = decision !== undefined && answer === decision.correct

  useEffect(() => {
    if (caseIndex !== null) {
      questionHeading.current?.focus({ preventScroll: step === 0 })
      if (step === 0) window.scrollTo(0, 0)
    } else if (hasOpenedCase.current) {
      listHeading.current?.focus()
    }
  }, [caseIndex, step])

  function openCase(index: number | null) {
    if (index !== null) hasOpenedCase.current = true
    setStep(0)
    setAnswer(null)
    setCaseIndex(index)
  }

  function choose(index: number) {
    if (!workup || !decision || correct) return
    setAnswer(index)
    if (index === decision.correct && step === workup.decisions.length - 1) {
      updateCaseHistory(workup.id)
    }
  }

  return (
    <div className="mx-auto max-w-4xl space-y-5 p-4 md:p-6">
      <Button size="sm" variant="ghost" onClick={() => workup ? openCase(null) : setCurrentView('home')}>
        <ArrowLeft size={16} className="mr-2" /> {workup ? 'All cases' : 'Home'}
      </Button>

      {!workup ? (
        <>
          <header className="space-y-2">
            <h1 className="text-3xl font-semibold" ref={listHeading} tabIndex={-1}>Integrated cases</h1>
            <p className="text-muted-foreground">Use the patient record to make three decisions. Complete all three workups to finish this module.</p>
            <p className="text-sm font-semibold text-primary">{completedCases.length} of {caseWorkups.length} cases complete</p>
          </header>
          <div className="grid gap-3">
            {caseWorkups.map((item, index) => (
              <button
                key={item.title}
                className="flex w-full items-center justify-between gap-4 rounded-lg border bg-card p-5 text-left shadow-sm transition-colors hover:border-primary focus-visible:ring-2 focus-visible:ring-ring"
                onClick={() => openCase(index)}
              >
                <span>
                  <span className="block text-xs font-medium text-muted-foreground">{item.setting}</span>
                  <span className="mt-1 block text-lg font-semibold">{item.title}</span>
                </span>
                {completedCases.includes(item.id) && <span className="ml-auto text-xs font-semibold text-primary">Completed</span>}
                <ArrowRight size={18} className="shrink-0 text-primary" aria-hidden="true" />
              </button>
            ))}
          </div>
        </>
      ) : (
        <>
          <header className="space-y-2">
            <p className="text-sm font-medium text-muted-foreground">{workup.setting}</p>
            <h1 className="text-3xl font-semibold">{workup.title}</h1>
            <p>{workup.presentation}</p>
          </header>

          <Card>
            <CardHeader><CardTitle className="text-lg">Patient record</CardTitle></CardHeader>
            <CardContent className="space-y-4">
              <dl className="grid grid-cols-2 gap-3 sm:grid-cols-3">
                {workup.labs.map(([name, value]) => (
                  <div key={name} className="min-w-0">
                    <dt className="text-xs text-muted-foreground">{name}</dt>
                    <dd className="mt-1 text-sm font-semibold">{value}</dd>
                  </div>
                ))}
              </dl>
              <p className="border-t pt-3 text-sm"><strong>Blood film. </strong>{workup.smear}</p>
              {workup.decisions.slice(0, step + 1).map((item) => item.finding && (
                <p className="border-t pt-3 text-sm" key={item.prompt}>{item.finding}</p>
              ))}
            </CardContent>
          </Card>

          {decision ? (
            <section key={decision.prompt} className="space-y-4 rounded-lg border bg-card p-5 sm:p-6">
              <p className="text-xs font-semibold text-primary">Decision {step + 1} of {workup.decisions.length}</p>
              <h2 className="text-xl font-semibold" tabIndex={-1} ref={questionHeading}>{decision.prompt}</h2>
              {showHints && (
                <details className="text-sm text-muted-foreground">
                  <summary className="w-fit cursor-pointer font-medium text-foreground">Hint</summary>
                  <p className="mt-2">{decision.hint}</p>
                </details>
              )}
              <div className="grid gap-2">
                {decision.options.map((option, index) => (
                  <button
                    key={option.label}
                    type="button"
                    aria-pressed={index === answer}
                    disabled={correct}
                    onClick={() => choose(index)}
                    className={'rounded-md border px-4 py-3 text-left text-sm font-medium focus-visible:ring-2 focus-visible:ring-ring ' + (index === answer ? 'border-primary bg-accent' : 'bg-background enabled:hover:bg-accent')}
                  >
                    {option.label}
                  </button>
                ))}
              </div>
              <div aria-live="polite" aria-atomic="true">
                {answer !== null && (
                  <div className="space-y-2 border-l-2 border-primary pl-4 text-sm">
                    <p className="font-semibold">{correct ? 'Correct' : 'Try another answer'}</p>
                    <p>{decision.options[answer].feedback}</p>
                    <a href={decision.source.url} target="_blank" rel="noreferrer" className="inline-block text-primary underline">{decision.source.title}</a>
                  </div>
                )}
              </div>
              {correct && (
                <Button onClick={() => { setAnswer(null); setStep(step + 1) }}>
                  {step === workup.decisions.length - 1 ? 'Review case' : 'Continue workup'}
                  <ArrowRight size={16} className="ml-2" />
                </Button>
              )}
            </section>
          ) : (
            <section className="space-y-3 rounded-lg border bg-card p-6">
              <p className="flex items-center gap-2 text-sm font-semibold text-primary"><CheckCircle2 size={17} /> Case complete</p>
              <h2 className="text-xl font-semibold" ref={questionHeading} tabIndex={-1}>{workup.diagnosis}</h2>
              <p>{workup.synthesis}</p>
              <details className="text-sm">
                <summary className="w-fit cursor-pointer font-medium">Review the three decisions and sources</summary>
                <ol className="mt-3 list-decimal space-y-3 pl-5">
                  {workup.decisions.map((item) => (
                    <li key={item.prompt}>
                      <strong>{item.options[item.correct].label}.</strong> {item.options[item.correct].feedback}{' '}
                      <a href={item.source.url} target="_blank" rel="noreferrer" className="text-primary underline">{item.source.title}</a>
                    </li>
                  ))}
                </ol>
              </details>
              <div className="flex flex-wrap gap-2 pt-2">
                <Button onClick={() => openCase(null)}>Choose another case</Button>
                <Button variant="outline" onClick={() => openCase(caseIndex)}>Repeat case</Button>
              </div>
            </section>
          )}
        </>
      )}
    </div>
  )
}
