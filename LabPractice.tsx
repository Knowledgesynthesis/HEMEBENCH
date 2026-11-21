import { useId, useRef, useState, type ReactNode } from 'react'
import { ArrowRight, BookOpen, Check, RotateCcw } from 'lucide-react'
import { Button } from './Button'
import { Card, CardContent, CardHeader, CardTitle } from './Card'
import { useAppStore } from './store'

export type LabModule = 'flow-cytometry' | 'molecular-panel' | 'coagulation' | 'anemia-game' | 'normal-smear' | 'cbc-patterns'
export interface LabSource {
  title: string
  url: string
}

export interface LabCase {
  title: string
  history: string
  visual?: ReactNode
  report: [string, string][]
  question: string
  options: { label: string; feedback: string }[]
  correct: number
  hint: string
  sources: LabSource[]
}

export function LabSources({ items }: { items: LabSource[] }) {
  return (
    <div className="flex flex-wrap items-baseline gap-x-4 gap-y-1 text-sm">
      {items.map((source) => (
        <a key={source.url} href={source.url} target="_blank" rel="noreferrer" className="inline-flex items-baseline gap-1 font-medium text-primary underline underline-offset-4">
          <BookOpen size={13} aria-hidden="true" className="shrink-0 self-center" />{source.title}
        </a>
      ))}
    </div>
  )
}

export function LabPractice({ module, cases }: { module: LabModule; cases: LabCase[] }) {
  const markModuleComplete = useAppStore((state) => state.markModuleComplete)
  const showHints = useAppStore((state) => state.showHints)
  const [queue, setQueue] = useState(() => cases.map((_, i) => i))
  const [missed, setMissed] = useState<number[]>([])
  const [index, setIndex] = useState(0)
  const [selected, setSelected] = useState<number | null>(null)
  const [finished, setFinished] = useState(false)
  const [hintOpen, setHintOpen] = useState(false)
  const titleRef = useRef<HTMLHeadingElement>(null)
  const hintId = useId()
  const item = cases[queue[index]]
  const correct = selected === item.correct
  const answered = selected !== null
  const last = index === queue.length - 1

  function answer(choice: number) {
    if (answered) return
    setSelected(choice)
    if (choice !== item.correct) {
      setMissed([...missed, queue[index]])
    } else if (last && missed.length === 0) {
      markModuleComplete(module)
    }
  }

  function advance() {
    if (finished) {
      setQueue(cases.map((_, i) => i))
      setIndex(0)
      setFinished(false)
    } else if (!last) {
      setIndex(index + 1)
    } else if (missed.length > 0) {
      setQueue(missed)
      setMissed([])
      setIndex(0)
    } else {
      setFinished(true)
    }
    setSelected(null)
    setHintOpen(false)
    requestAnimationFrame(() => titleRef.current?.focus())
  }

  return (
    <Card className="overflow-hidden border-primary/30">
      <CardHeader className="bg-accent/60">
        <div className="flex items-center justify-between gap-2 text-sm text-muted-foreground">
          <span>Case practice</span>
          {!finished && <span>{index + 1} of {queue.length}</span>}
        </div>
        <h2 tabIndex={-1} ref={titleRef} className="text-xl font-semibold tracking-tight">
          {finished ? 'Practice complete' : item.title}
        </h2>
      </CardHeader>
      {finished ? (
        <CardContent className="space-y-4 pt-5">
          <p>You correctly interpreted all {cases.length} reports.</p>
          <Button variant="outline" onClick={advance}><RotateCcw size={16} className="mr-2" /> Practice again</Button>
        </CardContent>
      ) : (
        <CardContent className="space-y-5 pt-5">
          <p>{item.history}</p>
          {item.visual}
          {item.report.length > 0 && <dl className="grid gap-x-6 gap-y-3 rounded-lg border bg-muted/40 p-4 sm:grid-cols-2">
            {item.report.map(([label, value]) => (
              <div key={label}><dt className="text-xs font-medium text-muted-foreground">{label}</dt><dd className="mt-1 text-sm font-semibold">{value}</dd></div>
            ))}
          </dl>}
          <fieldset className="space-y-2">
            <legend className="mb-2 font-semibold">{item.question}</legend>
            {item.options.map((option, i) => (
              <button key={option.label} type="button" aria-disabled={answered} onClick={() => answer(i)} className={`flex w-full items-center justify-between gap-3 rounded-md border px-4 py-3 text-left text-sm focus-visible:outline-primary ${selected === i ? 'border-primary bg-accent font-semibold' : answered ? '' : 'hover:border-primary hover:bg-accent'}`}>
                {option.label}{answered && i === item.correct && <span className="inline-flex shrink-0 items-center gap-1 text-xs font-semibold"><Check size={14} /> Answer</span>}
              </button>
            ))}
          </fieldset>
          {showHints && !answered && (
            <div>
              <button type="button" aria-expanded={hintOpen} aria-controls={hintId} onClick={() => setHintOpen(!hintOpen)} className="text-sm font-semibold text-primary underline underline-offset-4">{hintOpen ? 'Hide hint' : 'Show hint'}</button>
              <p id={hintId} hidden={!hintOpen} className="mt-2 text-sm text-muted-foreground">{item.hint}</p>
            </div>
          )}
          {answered && (
            <div className="space-y-3 rounded-lg border-l-4 border-primary bg-accent/50 p-4">
              <div role="status" className="space-y-2">
                <p className="font-semibold">{correct ? 'Correct' : 'Review the finding'}</p>
                <p className="text-sm">{item.options[selected].feedback}</p>
                {!correct && <p className="text-sm"><strong>{item.options[item.correct].label}.</strong> {item.options[item.correct].feedback}</p>}
              </div>
              <LabSources items={item.sources} />
              <Button size="sm" onClick={advance}>{!last ? 'Next case' : missed.length > 0 ? `Retry missed cases (${missed.length})` : 'See results'} <ArrowRight size={15} className="ml-2" /></Button>
            </div>
          )}
        </CardContent>
      )}
    </Card>
  )
}

export function LabHeader({ title, children }: { title: string; children: string }) {
  return <header className="space-y-2"><h1 className="text-3xl font-semibold tracking-tight">{title}</h1><p className="max-w-3xl text-muted-foreground">{children}</p></header>
}

export function ReferenceHeading({ title, children }: { title: string; children: string }) {
  return <CardHeader><CardTitle className="text-xl">{title}</CardTitle><p className="text-sm text-muted-foreground">{children}</p></CardHeader>
}
