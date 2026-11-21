import { useState } from 'react'
import { Card, CardContent } from './Card'
import { Button } from './Button'
import { LabHeader, LabPractice, LabSources, ReferenceHeading, type LabCase, type LabSource } from './LabPractice'

const eln = { title: 'ELN 2022 AML recommendations · Table 6', url: 'https://doi.org/10.1182/blood.2022016867' }
const lessIntensive = { title: 'ELN 2024 less-intensive AML framework', url: 'https://pubmed.ncbi.nlm.nih.gov/39133932/' }
const mpn = { title: 'ICC · Myeloproliferative neoplasms', url: 'https://pmc.ncbi.nlm.nih.gov/articles/PMC9852206/' }
const who = { title: 'WHO 5th edition · Myeloid neoplasms', url: 'https://pmc.ncbi.nlm.nih.gov/articles/PMC9252913/' }
const wm = { title: 'Waldenström macroglobulinemia · Diagnostic update', url: 'https://pmc.ncbi.nlm.nih.gov/articles/PMC10249724/' }
const hcl = { title: 'Hairy cell leukemia · 2026 consensus', url: 'https://ashpublications.org/blood/article/148/1/31/567757/Updated-consensus-guidelines-for-the-diagnosis-and' }
const cml = { title: 'ELN 2025 CML recommendations', url: 'https://doi.org/10.1038/s41375-025-02664-w' }

const cases: LabCase[] = [
  {
    title: 'Two variants in newly diagnosed AML',
    history: 'An adult with newly diagnosed acute myeloid leukemia (AML) will receive intensive induction. The team requests the baseline genetic risk group under ELN 2022.',
    report: [['NPM1', 'Pathogenic mutation detected'], ['FLT3', 'Internal tandem duplication (ITD) detected'], ['Karyotype', 'Normal'], ['Remaining panel', 'No adverse-risk abnormalities']],
    question: 'Which ELN 2022 group fits this genotype?',
    options: [
      { label: 'Favorable', feedback: 'NPM1-mutated AML can fall in the favorable group when FLT3-ITD is absent and there are no adverse-risk cytogenetic abnormalities.' },
      { label: 'Adverse', feedback: 'FLT3-ITD alone does not assign ELN 2022 adverse risk. Check the rest of the genetic profile.' },
      { label: 'Intermediate', feedback: 'NPM1 mutation with FLT3-ITD fits the intermediate group here, regardless of FLT3-ITD allelic ratio. ELN published a separate framework for less-intensive therapy.' },
    ], correct: 2, hint: 'Read the NPM1 and FLT3 results together, then check cytogenetics and the intended treatment.', sources: [eln, lessIntensive],
  },
  {
    title: 'A driver mutation with thrombocytosis',
    history: 'An adult has sustained thrombocytosis and no evident reactive cause. Essential thrombocythemia (ET) and prefibrotic primary myelofibrosis (pre-PMF) are under consideration.',
    report: [['Platelets', '745 × 10⁹/L'], ['JAK2 V617F', 'Detected'], ['BCR::ABL1', 'Absent']],
    question: 'Which finding best helps distinguish ET from pre-PMF?',
    options: [
      { label: 'Marrow morphology, including megakaryocyte architecture', feedback: 'Both diseases can carry JAK2 V617F. Review megakaryocyte atypia and clustering, cellularity, granulocytic proliferation and fibrosis together with the clinical findings.' },
      { label: 'The presence of JAK2 V617F by itself', feedback: 'The same driver occurs in ET, pre-PMF and polycythemia vera. Its presence does not select a subtype.' },
      { label: 'A platelet count above 450 × 10⁹/L by itself', feedback: 'This count meets the platelet criterion for ET, but both ET and pre-PMF can cause sustained thrombocytosis.' },
    ], correct: 0, hint: 'Look for a test that can distinguish two diseases sharing the same driver.', sources: [mpn],
  },
  {
    title: 'An IgM monoclonal protein',
    history: 'Serum immunofixation identifies a monoclonal IgM. A molecular test detects MYD88 L265P, and the marrow has yet to be examined.',
    report: [['Serum', 'Monoclonal IgM kappa'], ['MYD88 L265P', 'Detected'], ['Marrow morphology', 'Pending']],
    question: 'Which interpretation can the laboratory support?',
    options: [
      { label: 'The mutation confirms Waldenström macroglobulinemia', feedback: 'MYD88 L265P also occurs in IgM monoclonal gammopathy of undetermined significance (MGUS) and other B-cell disorders.' },
      { label: 'Assess for marrow lymphoplasmacytic lymphoma', feedback: 'The mutation supports the possibility of lymphoplasmacytic lymphoma. Marrow findings together with monoclonal IgM help distinguish Waldenström macroglobulinemia from IgM MGUS.' },
      { label: 'The patient has symptomatic disease requiring treatment', feedback: 'A molecular result alone establishes neither symptom attribution nor an indication for treatment.' },
    ], correct: 1, hint: 'Which result would establish the underlying tissue diagnosis?', sources: [wm],
  },
  {
    title: 'Following a CML clone during therapy',
    history: 'An adult with chronic-phase chronic myeloid leukemia (CML) starts a BCR::ABL1 tyrosine kinase inhibitor. The diagnostic sample expressed a standard e14a2 transcript.',
    report: [['Diagnostic fusion', 'BCR::ABL1 e14a2'], ['Follow-up CBC', 'Counts within reference intervals']],
    question: 'Which test measures the depth of molecular response?',
    options: [
      { label: 'A repeat CBC alone', feedback: 'Counts measure hematologic response. Detectable fusion transcripts may persist after counts normalize.' },
      { label: 'A qualitative fusion result reported as present or absent', feedback: 'A qualitative result does not give the level needed to assess molecular response milestones.' },
      { label: 'Quantitative BCR::ABL1 on the International Scale', feedback: 'For a standard transcript, a validated quantitative assay on peripheral blood tracks BCR::ABL1 over time. The baseline transcript type guides assay selection.' },
    ], correct: 2, hint: 'The monitoring test must quantify the same transcript identified at diagnosis.', sources: [cml],
  },
]

interface Variant {
  gene: string
  categories: string[]
  meaning: string
  next: string
  sources: LabSource[]
}
const variants: Variant[] = [
  { gene: 'JAK2 V617F', categories: ['MPN'], meaning: 'This driver occurs in polycythemia vera, essential thrombocythemia and primary myelofibrosis.', next: 'Use the blood-count pattern, marrow morphology and disease-specific criteria to classify the neoplasm.', sources: [mpn] },
  { gene: 'CALR', categories: ['MPN'], meaning: 'A pathogenic CALR exon 9 frameshift supports clonality in essential thrombocythemia or primary myelofibrosis.', next: 'Compare marrow megakaryocytes and fibrosis with the CBC and clinical findings to distinguish the subtypes.', sources: [mpn] },
  { gene: 'MPL', categories: ['MPN'], meaning: 'An activating MPL variant can support a clonal myeloproliferative neoplasm in persistent thrombocytosis.', next: 'Check the precise variant and integrate the marrow findings. Essential thrombocythemia and primary myelofibrosis can share this driver.', sources: [mpn] },
  { gene: 'BCR::ABL1', categories: ['CML', 'ALL', 'AML'], meaning: 'This fusion is the hallmark of CML. It also occurs in B-lymphoblastic leukemia and rarely in AML.', next: 'Use clinical history, blast lineage and cytogenetics to classify the disease. In CML, record the transcript type for molecular monitoring.', sources: [cml, eln] },
  { gene: 'FLT3-ITD', categories: ['AML'], meaning: 'An internal tandem duplication can affect AML genetic risk and eligibility for FLT3-directed therapy.', next: 'Specify FLT3-ITD, coexisting lesions and the applicable treatment framework. In ELN 2022, NPM1-mutated AML with FLT3-ITD and no adverse cytogenetics is intermediate risk.', sources: [eln, lessIntensive] },
  { gene: 'NPM1', categories: ['AML'], meaning: 'A pathogenic NPM1 mutation can define an AML entity. In intensively treated AML, baseline risk also depends on FLT3-ITD and adverse cytogenetics.', next: 'Read the full karyotype and FLT3 result together. NPM1-mutated AML with adverse cytogenetics is adverse risk under ELN 2022.', sources: [who, eln] },
  { gene: 'TP53', categories: ['AML', 'MDS'], meaning: 'TP53 abnormalities carry different diagnostic criteria across AML and myelodysplastic neoplasms (MDS). WHO recognizes MDS with biallelic TP53 inactivation.', next: 'Review pathogenicity, variant allele fraction, copy-number status and karyotype. A single reported variant does not establish biallelic inactivation.', sources: [who, eln] },
  { gene: 'SF3B1', categories: ['MDS'], meaning: 'WHO recognizes MDS with low blasts and SF3B1 mutation. Ring sideroblasts are a common morphologic clue.', next: 'Check persistent cytopenia, blast count, cytogenetic exclusions and competing defining lesions before assigning this subtype.', sources: [who] },
  { gene: 'MYD88 L265P', categories: ['Mature B cell'], meaning: 'This variant commonly occurs in lymphoplasmacytic lymphoma and can also occur in IgM MGUS.', next: 'Correlate marrow histology and immunophenotype with serum studies. A positive result alone cannot establish Waldenström macroglobulinemia.', sources: [wm] },
  { gene: 'BRAF V600E', categories: ['Mature B cell'], meaning: 'More than 95% of classic hairy cell leukemias carry this variant in the 2026 consensus. Rare classic cases lack it.', next: 'Interpret the result with blood or marrow morphology and immunophenotype. Reassess the differential diagnosis when the findings disagree.', sources: [hcl] },
]
const categories = ['All', 'AML', 'MPN', 'MDS', 'CML', 'ALL', 'Mature B cell']

export function MolecularPanelView() {
  const [category, setCategory] = useState('All')
  return (
    <div className="mx-auto max-w-4xl space-y-5 p-4 pb-12 sm:p-6">
      <LabHeader title="Molecular panels">Use the variant, disease context and treatment setting to decide what a molecular report can support.</LabHeader>
      <LabPractice module="molecular-panel" cases={cases} />
      <Card>
        <ReferenceHeading title="Variant reference">Filter by disease group and open a result to see how it changes the diagnostic workup.</ReferenceHeading>
        <CardContent className="space-y-4">
          <div role="group" aria-label="Disease group" className="flex flex-wrap gap-2">{categories.map((label) => <Button key={label} size="sm" variant={category === label ? 'default' : 'outline'} aria-pressed={category === label} onClick={() => setCategory(label)}>{label}</Button>)}</div>
          <div className="divide-y rounded-lg border px-4">{variants.filter((variant) => category === 'All' || variant.categories.includes(category)).map((variant) => (
            <details key={variant.gene} className="py-3"><summary className="cursor-pointer font-semibold">{variant.gene}</summary><div className="mt-3 space-y-3 text-sm"><p>{variant.meaning}</p><p><strong>Interpretation.</strong> {variant.next}</p><LabSources items={variant.sources} /></div></details>
          ))}</div>
        </CardContent>
      </Card>
    </div>
  )
}
