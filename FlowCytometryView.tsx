import { useState } from 'react'
import { Card, CardContent } from './Card'
import { Button } from './Button'
import { LabHeader, LabPractice, LabSources, ReferenceHeading, type LabCase } from './LabPractice'

const who = { title: 'WHO 5th edition, lineage criteria · Table 13', url: 'https://pmc.ncbi.nlm.nih.gov/articles/PMC9252913/#Tab13' }
const iwcll = { title: 'iwCLL diagnostic criteria · Sections 1–2', url: 'https://doi.org/10.1182/blood-2017-09-806398' }
const flow = { title: 'Flow Cytometry in the Diagnosis of Leukemias', url: 'https://exonpublications.com/index.php/exon/article/view/flow-cytometry/1246' }

const cases: LabCase[] = [
  {
    title: 'A marrow with two apparent lineages',
    history: 'In a marrow with acute leukemia, the laboratory reports one abnormal blast population. The signals below occur on the same gated cells.',
    report: [['Cytoplasmic CD3 (ε chain)', 'Strong, comparable to mature T cells'], ['CD7 and CD13', 'Both expressed'], ['Myeloperoxidase (MPO)', 'Absent'], ['Monocytic differentiation', 'No supporting markers']],
    question: 'Which lineage does this panel establish under WHO criteria for ambiguous cases?',
    options: [
      { label: 'Both T and myeloid lineages', feedback: 'CD13 can be expressed on lymphoblasts. Myeloid assignment requires qualifying MPO expression or evidence of monocytic differentiation.' },
      { label: 'T lineage', feedback: 'Strong cytoplasmic CD3 on the blasts establishes T lineage. The accompanying CD13 signal alone does not establish a second lineage.' },
      { label: 'Myeloid lineage alone', feedback: 'CD13 has limited specificity. The strong cytoplasmic CD3 finding carries greater weight for T-lineage assignment.' },
    ], correct: 1, hint: 'Find the antigen that specifically assigns T lineage on blasts.', sources: [who],
  },
  {
    title: 'Weak CD19 on marrow blasts',
    history: 'An acute leukemia panel shows weak CD19 relative to normal B-cell precursors. The laboratory is applying WHO B-lineage criteria for an ambiguous case.',
    report: [['CD19', 'Weak'], ['CD10', 'Strong'], ['CD22 and CD79a', 'Absent'], ['Cytoplasmic CD3', 'Absent']],
    question: 'What does this B-cell marker pattern support?',
    options: [
      { label: 'B-lineage criteria are met', feedback: 'One additional strong marker suffices with strong CD19. The requirement is different when CD19 is weak.' },
      { label: 'T lineage because CD19 is weak', feedback: 'Weak CD19 does not establish T lineage. T-lineage assignment requires qualifying cytoplasmic or surface CD3.' },
      { label: 'B-lineage criteria remain unmet', feedback: 'With weak CD19, at least two other qualifying B-lineage antigens must be strongly expressed. Only CD10 qualifies here.' },
    ], correct: 2, hint: 'The number of supporting B-cell markers depends on CD19 intensity.', sources: [who],
  },
  {
    title: 'A small circulating B-cell clone',
    history: 'An asymptomatic adult has a stable blood count on two visits four months apart. Examination shows no adenopathy or organ enlargement. Hemoglobin and platelets are normal.',
    report: [['Clonal B-cell count', '2.1 × 10⁹/L'], ['Gated B cells', 'CD19+, CD5+, CD23+'], ['CD20 and surface Ig', 'Dim'], ['Light chains', 'Kappa restricted']],
    question: 'Which category best fits these findings?',
    options: [
      { label: 'CLL-type monoclonal B-cell lymphocytosis (MBL)', feedback: 'The phenotype is typical of CLL, but the clonal B-cell count is below 5 × 10⁹/L. The absence of disease-related symptoms, cytopenias, or tissue enlargement supports MBL.' },
      { label: 'Chronic lymphocytic leukemia (CLL)', feedback: 'For this otherwise asymptomatic blood presentation, iwCLL requires at least 5 × 10⁹/L clonal B cells for at least three months.' },
      { label: 'Reactive polyclonal B-cell expansion', feedback: 'A discrete population with the same aberrant phenotype and light-chain restriction supports a clone.' },
    ], correct: 0, hint: 'Use the absolute clonal B-cell count together with the examination and CBC.', sources: [iwcll],
  },
  {
    title: 'A second look at the myeloid gate',
    history: 'An abnormal blast population has no detectable MPO. The laboratory tests for monocytic differentiation to assess myeloid lineage.',
    report: [['CD14', 'Expressed on blasts'], ['CD64', 'Expressed on the same blasts'], ['CD3', 'Absent'], ['CD19', 'Absent']],
    question: 'What do CD14 and CD64 together establish in this setting?',
    options: [
      { label: 'The blasts must be lymphoid because MPO is absent', feedback: 'WHO also accepts monocytic differentiation as evidence of myeloid lineage.' },
      { label: 'Monocytic differentiation supports myeloid lineage', feedback: 'Two qualifying monocytic findings meet the WHO monocytic criterion. The final leukemia classification still requires morphology and genetic studies.' },
      { label: 'A specific molecular subtype of AML', feedback: 'Monocytic markers identify differentiation. A defining genetic abnormality requires its own test.' },
    ], correct: 1, hint: 'WHO provides two routes to myeloid-lineage assignment.', sources: [who],
  },
]

const probes = [
  { group: 'Immaturity', name: 'CD34, CD117, TdT', purpose: 'Assess precursor phenotype. Normal progenitors can express these markers, and some acute leukemias lack them.' },
  { group: 'Myeloid', name: 'MPO', purpose: 'In an ambiguous acute leukemia, compare blast MPO to mature neutrophils. WHO requires intensity on part of the population above half the mature-neutrophil level.' },
  { group: 'Myeloid', name: 'CD13, CD33', purpose: 'Describe myeloid-associated antigens. Either can appear aberrantly on lymphoblasts.' },
  { group: 'Myeloid', name: 'CD14, CD64, CD11c', purpose: 'Look for monocytic differentiation. WHO counts expression of at least two among CD11c, CD14, CD64, lysozyme and nonspecific esterase.' },
  { group: 'T cell', name: 'Cytoplasmic and surface CD3', purpose: 'Assess T lineage. For ambiguous acute leukemia, WHO compares blast CD3 intensity with mature T cells and specifies the ε-chain reagent.' },
  { group: 'T cell', name: 'CD4, CD8, CD7', purpose: 'Describe T-cell maturation and subsets alongside CD3. CD7 can also be expressed in myeloid leukemia.' },
  { group: 'B cell', name: 'CD19, CD10, CD22, CD79a', purpose: 'In ambiguous acute leukemia, strong CD19 requires one other strong marker from this group. Weak CD19 requires two. CD79a cannot count toward B lineage if T lineage is under consideration.' },
  { group: 'B cell', name: 'CD5, CD23, CD20', purpose: 'On mature B cells, CD5 and CD23 with dim CD20 support a CLL phenotype. Assess morphology, clonal B-cell count and clinical findings.' },
  { group: 'B cell', name: 'Surface kappa and lambda', purpose: 'Compare light chains within the same mature B-cell gate. Restriction supports clonality. Review intensity, background cells and the rest of the phenotype.' },
  { group: 'Platelet lineage', name: 'CD41, CD61', purpose: 'Assess megakaryocytic differentiation. Platelets adhering to other cells can produce misleading surface positivity.' },
]

export function FlowCytometryView() {
  const [group, setGroup] = useState('All')
  const [selected, setSelected] = useState<string[]>([])
  const groups = ['All', ...new Set(probes.map((probe) => probe.group))]
  function toggle(name: string) {
    setSelected((current) => current.includes(name) ? current.filter((id) => id !== name) : [...current, name])
  }
  return (
    <div className="mx-auto max-w-4xl space-y-5 p-4 pb-12 sm:p-6">
      <LabHeader title="Flow cytometry">Interpret co-expression and staining intensity within a gate, the population of cells selected for analysis.</LabHeader>
      <LabPractice module="flow-cytometry" cases={cases} />
      <Card>
        <ReferenceHeading title="Build a marker panel">Select stains to compare the questions each can answer. A panel lists the tests ordered. Its interpretation requires measured results from the same cell population.</ReferenceHeading>
        <CardContent className="space-y-4">
          <div className="flex flex-wrap gap-2" role="group" aria-label="Filter stains">
            {groups.map((label) => <Button key={label} size="sm" aria-pressed={group === label} variant={group === label ? 'default' : 'outline'} onClick={() => setGroup(label)}>{label}</Button>)}
          </div>
          <div className="grid gap-2 sm:grid-cols-2">
            {probes.filter((probe) => group === 'All' || probe.group === group).map((probe) => <label key={probe.name} className="flex cursor-pointer items-center gap-2 rounded-md border p-3 text-sm"><input type="checkbox" checked={selected.includes(probe.name)} onChange={() => toggle(probe.name)} />{probe.name}</label>)}
          </div>
          {selected.length > 0 && <div className="space-y-3 border-t pt-4"><div className="flex flex-wrap items-center justify-between gap-2"><h3 className="font-semibold">Selected tests ({selected.length})</h3><Button variant="ghost" size="sm" onClick={() => setSelected([])}>Clear panel</Button></div>
            {selected.map((name) => <p key={name} className="text-sm"><strong>{name}.</strong> {probes.find((probe) => probe.name === name)?.purpose}</p>)}</div>}
          <LabSources items={[who, iwcll, flow]} />
        </CardContent>
      </Card>
    </div>
  )
}
