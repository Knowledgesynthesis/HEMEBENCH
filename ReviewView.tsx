import { useEffect, useRef } from 'react'
import { ArrowRight, ArrowUpRight, BookOpenCheck, Check, RotateCcw } from 'lucide-react'
import { modules } from './curriculum'
import { itemsById, useReview } from './reviewState'

export function ReviewView() {
  const { round, missed, start, answer, advance } = useReview()
  const item = round && itemsById.get(round.ids[round.index])
  const choice = round?.responses[round.index]
  const answered = choice !== undefined
  const questionHeading = useRef<HTMLHeadingElement>(null)
  const currentKey = round?.key
  const currentIndex = round?.index
  useEffect(() => {
    if (currentKey) questionHeading.current?.focus()
  }, [currentKey, currentIndex])
  const score = round?.responses.filter((response, i) => itemsById.get(round.ids[i])?.answer === response).length ?? 0

  return <div className="reading-page">
    <div className="eyebrow"><BookOpenCheck size={15}/> Retrieval practice</div>
    <h1>Mixed review</h1>
    {item && round ? <section className="exercise-card" aria-label="Current question">
      <div className="exercise-meta"><span>Question {round.index + 1} of {round.ids.length}</span><span>{modules.find(module => module.id === item.module)?.title}</span></div>
      <progress aria-label="Questions answered" value={round.responses.length} max={round.ids.length} />
      <h2 key={item.id} tabIndex={-1} ref={questionHeading}>{item.prompt}</h2>
      <div className="answer-list" role="group" aria-label="Answer choices">
        {item.options.map((option, i) => <button key={item.id + option.text} disabled={answered} onClick={() => answer(round.key, round.index, i)}
          className={'answer-option ' + (answered && i === item.answer ? 'right-choice' : answered && i === choice ? 'missed-choice' : '')}>
          <span className="option-letter">{String.fromCharCode(65 + i)}</span><span>{option.text}</span>{answered && i === item.answer && <Check size={19}/>}
        </button>)}
      </div>
      {answered && <div className="answer-note" role="status">
        <h3>{choice === item.answer ? 'Correct' : 'Review the reasoning'}</h3>
        <p>{item.options[choice].feedback}</p>
        {choice !== item.answer && <p><strong>{item.options[item.answer].text}.</strong> {item.options[item.answer].feedback}</p>}
        <a className="text-link" href={item.source.url} target="_blank" rel="noreferrer">{item.source.title} <ArrowUpRight size={14}/></a>
      </div>}
      {answered && <button className="primary-link mt-5" onClick={() => advance(round.key, round.index)}>{round.index + 1 === round.ids.length ? 'See results' : 'Next question'} <ArrowRight size={16}/></button>}
    </section> : <section className="exercise-card">
      <div className="eyebrow">{round ? 'Round complete' : 'Cross-module round'}</div>
      <h2 tabIndex={-1} ref={questionHeading}>{round ? `${score} of ${round.ids.length} correct` : 'Seven decisions across seven modules'}</h2>
      <p>{round ? 'Review each decision below or start another round.' : 'Answer a new clinical question from each module. Each answer unlocks an explanation and its source. Missed questions stay available for another attempt.'}</p>
      <div className="exercise-actions"><button className="primary-link" onClick={() => start('mixed')}>{round ? 'New mixed round' : 'Start mixed round'} <ArrowRight size={16}/></button>
      {missed.length > 0 && <button className="secondary-link" onClick={() => start('missed')}><RotateCcw size={15}/> Retry missed ({missed.length})</button>}</div>
      {round && <ul className="review-results">{round.ids.map((id, i) => {
        const q = itemsById.get(id)!
        return <li key={id}><details><summary><span className={round.responses[i] === q.answer ? 'result-hit' : 'result-miss'}>{round.responses[i] === q.answer ? 'Correct' : 'Missed'}</span> {q.prompt}</summary>
          <p><strong>{q.options[q.answer].text}.</strong> {q.options[q.answer].feedback}</p><a className="text-link" href={q.source.url} target="_blank" rel="noreferrer">{q.source.title} <ArrowUpRight size={14}/></a>
        </details></li>
      })}</ul>}
    </section>}
  </div>
}
