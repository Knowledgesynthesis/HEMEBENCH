import { useState } from 'react'
import { Search } from 'lucide-react'
import { Button } from './Button'
import { glossaryCategories, glossaryEntries } from './glossaryEntries'

function normalize(text: string) {
  return text.normalize('NFKD').toLowerCase().replace(/[^a-z0-9]+/g, ' ').trim()
}

export function GlossaryView() {
  const [query, setQuery] = useState('')
  const [category, setCategory] = useState('All')
  const words = normalize(query).split(' ').filter(Boolean)
  const filtered = glossaryEntries.filter(entry => {
    if (category !== 'All' && entry.category !== category) return false
    const text = normalize([entry.term, entry.definition, ...(entry.aliases ?? []), ...(entry.keywords ?? [])].join(' '))
    return words.every(word => text.includes(word))
  })

  function clearFilters() {
    setQuery('')
    setCategory('All')
  }

  return (
    <div className="reading-page space-y-5">
      <h1>Glossary</h1>
      <p className="text-muted-foreground">Look up a term, abbreviation, or blood-film finding.</p>
      <section className="space-y-3 rounded-lg border bg-card p-4" aria-label="Search and filter terms">
        <label className="block text-sm font-semibold" htmlFor="glossary-search">Search glossary</label>
        <div className="relative">
          <Search aria-hidden="true" className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" size={18} />
          <input
            id="glossary-search"
            type="search"
            placeholder="e.g. reticulocyte, BCR-ABL1, helmet cell"
            value={query}
            onChange={(event) => setQuery(event.target.value)}
            className="w-full rounded-md border bg-background py-2 pl-10 pr-3 text-sm focus-visible:ring-2 focus-visible:ring-ring"
          />
        </div>
        <div className="flex flex-wrap gap-2" aria-label="Filter by category" role="group">
          {['All', ...glossaryCategories].map(item => (
            <Button
              key={item}
              size="sm"
              variant={item === category ? 'default' : 'outline'}
              aria-pressed={item === category}
              onClick={() => setCategory(item)}
            >
              {item}
            </Button>
          ))}
        </div>
      </section>
      <p role="status" className="text-sm text-muted-foreground">{filtered.length} {filtered.length === 1 ? 'term' : 'terms'}</p>
      {filtered.length === 0 ? (
        <div className="space-y-3 rounded-lg border bg-card p-5">
          <p>No terms match these filters.</p>
          <Button variant="outline" onClick={clearFilters}>Clear filters</Button>
        </div>
      ) : (
        <div className="grid gap-3">
          {filtered.map(entry => (
            <article key={entry.term} className="space-y-2 rounded-lg border bg-card p-5">
              <div className="flex flex-wrap items-baseline justify-between gap-x-4 gap-y-1">
                <h2 className="text-lg font-semibold">{entry.term}</h2>
                <span className="text-xs font-semibold text-muted-foreground">{entry.category}</span>
              </div>
              {entry.aliases && <p className="text-sm text-muted-foreground">{entry.aliases.join(' · ')}</p>}
              <p className="text-sm">{entry.definition}</p>
              <a className="inline-block text-sm text-primary underline" href={entry.source.url} target="_blank" rel="noreferrer">{entry.source.title}</a>
            </article>
          ))}
        </div>
      )}
    </div>
  )
}
