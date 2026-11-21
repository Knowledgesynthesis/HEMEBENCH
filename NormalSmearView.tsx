import { useState } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from './Card'
import { Button } from './Button'
import { LabHeader, LabPractice, LabSources, type LabCase } from './LabPractice'

const bloodSource = {
  title: 'OpenStax · Leukocytes and platelets',
  url: 'https://openstax.org/books/anatomy-and-physiology-2e/pages/18-4-leukocytes-and-platelets',
}
const redCellSource = {
  title: 'OpenStax · Erythrocytes',
  url: 'https://openstax.org/books/anatomy-and-physiology-2e/pages/18-3-erythrocytes',
}

type Target = [x: number, y: number, diameter: number]
interface Field {
  file: string
  target: Target
}
interface Cell {
  name: string
  appearance: string
  clue: string
  contrast: string
  atlas: Field
  challenge: Field
}

const cells: Cell[] = [
  {
    name: 'Erythrocyte',
    appearance: 'A rounded pink disc with a pale center and no visible nucleus.',
    clue: 'The thin center of a biconcave red cell transmits more light than its hemoglobin-rich rim.',
    contrast: 'A platelet is usually much smaller than an erythrocyte and contains stained granules.',
    atlas: { file: 'LY_112097', target: [77, 40, 24] },
    challenge: { file: 'SNE_108753', target: [79, 52, 23] },
  },
  {
    name: 'Neutrophil',
    appearance: 'Several dark nuclear lobes are linked by narrow strands. The pale cytoplasm has fine granules.',
    clue: 'Follow the contour of the segmented nucleus. Mature neutrophils often have two to five lobes.',
    contrast: 'Eosinophils usually have two lobes and conspicuous coarse granules.',
    atlas: { file: 'SNE_107907', target: [50, 50, 46] },
    challenge: { file: 'SNE_102049', target: [50, 50, 46] },
  },
  {
    name: 'Small lymphocyte',
    appearance: 'A round, densely stained nucleus occupies most of the cell. Only a narrow rim of blue cytoplasm is visible.',
    clue: 'Compare the small amount of cytoplasm with the area occupied by the nucleus.',
    contrast: 'A monocyte typically has a folded nucleus and a wider rim of gray-blue cytoplasm.',
    atlas: { file: 'LY_104129', target: [50, 50, 42] },
    challenge: { file: 'LY_112097', target: [50, 50, 40] },
  },
  {
    name: 'Monocyte',
    appearance: 'A large cell with a folded or indented nucleus and abundant gray-blue cytoplasm.',
    clue: 'Look for a fold in a single nucleus and an irregular cytoplasmic margin. Vacuoles can be visible.',
    contrast: 'Segmented neutrophils have discrete nuclear lobes linked by thin strands.',
    atlas: { file: 'MO_114341', target: [50, 50, 67] },
    challenge: { file: 'MO_120253', target: [50, 50, 57] },
  },
  {
    name: 'Eosinophil',
    appearance: 'Two prominent nuclear lobes sit in cytoplasm filled with coarse pink-orange granules.',
    clue: 'Inspect the granules alongside the lobe count. Their exact hue varies with staining.',
    contrast: 'Basophils have much darker blue-purple granules that may hide parts of the nucleus.',
    atlas: { file: 'EO_109766', target: [50, 50, 44] },
    challenge: { file: 'EO_110481', target: [50, 51, 44] },
  },
  {
    name: 'Basophil',
    appearance: 'Coarse dark purple granules overlap the nucleus and make its outline hard to trace.',
    clue: 'Look for densely stained granules scattered across both the cytoplasm and nucleus.',
    contrast: 'In eosinophils, the granules are typically red-orange and the lobes remain easy to see.',
    atlas: { file: 'BA_101611', target: [50, 50, 43] },
    challenge: { file: 'BA_102039', target: [50, 50, 50] },
  },
  {
    name: 'Platelet',
    appearance: 'A small purple granular fragment, much smaller than the surrounding pink discs.',
    clue: 'Use a neighboring red cell as a size reference. Platelets are fragments of megakaryocyte cytoplasm.',
    contrast: 'A small lymphocyte still has a dense nucleus and is closer in size to a red cell.',
    atlas: { file: 'LY_112097', target: [15, 47, 12] },
    challenge: { file: 'SNE_108753', target: [87, 42, 12] },
  },
]

function Micrograph({ field, description }: { field: Field; description: string }) {
  const [x, y, diameter] = field.target
  return <figure className="mx-auto w-full max-w-[340px]">
    <div className="relative overflow-hidden rounded-lg border bg-muted">
      <img src={'/smears/' + field.file + '.jpg'} width={360} height={363} className="block h-auto w-full" alt={description} />
      <span aria-hidden="true" className="pointer-events-none absolute -translate-x-1/2 -translate-y-1/2 rounded-full border-2 border-white"
        style={{ left: x + '%', top: y + '%', width: diameter + '%', aspectRatio: '1', boxShadow: '0 0 0 1.5px #373339' }} />
    </div>
    <figcaption className="mt-2 text-xs text-muted-foreground">
      Blood film · <a className="underline" href="https://doi.org/10.17632/snkd93bnjr.1" target="_blank" rel="noreferrer">Acevedo et al.</a>
      {' · '}<a className="underline" href="https://creativecommons.org/licenses/by/4.0/" target="_blank" rel="noreferrer">CC BY 4.0</a> · target ring added
    </figcaption>
  </figure>
}

// Each set includes the target and two plausible look-alikes in a fixed, varied order.
const challenges = [
  { target: 1, options: [4, 1, 3] },
  { target: 6, options: [6, 2, 0] },
  { target: 4, options: [5, 1, 4] },
  { target: 3, options: [2, 3, 1] },
  { target: 0, options: [6, 0, 2] },
  { target: 5, options: [5, 4, 1] },
  { target: 2, options: [6, 3, 2] },
]

const practice: LabCase[] = challenges.map(({ target, options }, index) => {
  const cell = cells[target]
  return {
    title: 'Unknown blood film ' + (index + 1),
    history: 'Identify the circled structure. Compare its size with the nearby red cells.',
    visual: <Micrograph field={cell.challenge} description={'Circled structure in a blood film. ' + cell.appearance} />,
    report: [], question: 'What is the circled structure?', correct: options.indexOf(target),
    options: options.map(i => ({ label: cells[i].name, feedback: i === target ? cell.appearance + ' ' + cell.clue : cells[i].appearance })),
    hint: cell.clue, sources: [target === 0 ? redCellSource : bloodSource],
  }
})

export function NormalSmearView() {
  const [section, setSection] = useState<'atlas' | 'practice'>('atlas')
  const [selected, setSelected] = useState(0)
  const cell = cells[selected]
  return <div className="space-y-5">
    <LabHeader title="Peripheral smear">Use a red cell as a size reference, then examine the nucleus and the granules. Identify seven structures in a second set of blood films.</LabHeader>
    <div role="group" aria-label="Smear learning mode" className="flex flex-wrap gap-2">
      <Button size="sm" variant={section === 'atlas' ? 'default' : 'outline'} aria-pressed={section === 'atlas'} onClick={() => setSection('atlas')}>Cell atlas</Button>
      <Button size="sm" variant={section === 'practice' ? 'default' : 'outline'} aria-pressed={section === 'practice'} onClick={() => setSection('practice')}>Identify unknowns</Button>
    </div>
    <section hidden={section !== 'atlas'}>
      <Card><CardHeader><CardTitle className="text-xl">Compare seven structures</CardTitle></CardHeader>
        <CardContent className="space-y-5">
          <div className="flex flex-wrap gap-2" role="group" aria-label="Atlas structure">
            {cells.map((item, i) => <Button size="sm" key={item.name} aria-pressed={i === selected} variant={i === selected ? 'default' : 'outline'} onClick={() => setSelected(i)}>{item.name}</Button>)}
          </div>
          <div className="grid items-center gap-6 md:grid-cols-2">
            <Micrograph field={cell.atlas} description={cell.name + '. ' + cell.appearance} />
            <div className="space-y-3" aria-live="polite">
              <h2 className="text-xl font-semibold">{cell.name}</h2><p>{cell.appearance}</p>
              <p className="text-sm">{cell.clue}</p><p className="text-sm text-muted-foreground">{cell.contrast}</p>
              <LabSources items={[selected === 0 ? redCellSource : bloodSource]} />
            </div>
          </div>
        </CardContent>
      </Card>
    </section>
    <section hidden={section !== 'practice'} aria-label="Smear practice"><LabPractice module="normal-smear" cases={practice} /></section>
  </div>
}
