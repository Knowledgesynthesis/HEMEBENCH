import { useState } from 'react'
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from './Card'
import { Button } from './Button'
import { ArrowLeft, AlertCircle } from 'lucide-react'
import { useAppStore } from './store'

interface Mutation {
  gene: string
  fullName: string
  disease: string[]
  pathway: string
  prognostic: 'Favorable' | 'Intermediate' | 'Poor' | 'Variable'
  clinicalSignificance: string
  treatmentImplications: string
}

const mutations: Mutation[] = [
  {
    gene: 'JAK2 V617F',
    fullName: 'JAK2 exon 14 mutation',
    disease: ['Polycythemia vera (95%)', 'Essential thrombocythemia (50%)', 'Primary myelofibrosis (50%)'],
    pathway: 'JAK-STAT signaling',
    prognostic: 'Variable',
    clinicalSignificance: 'Diagnostic for myeloproliferative neoplasms. Near-universal in PV.',
    treatmentImplications: 'Ruxolitinib (JAK1/2 inhibitor) for high-risk MPN',
  },
  {
    gene: 'BCR-ABL1',
    fullName: 't(9;22) Philadelphia chromosome',
    disease: ['Chronic myeloid leukemia (95%)', 'B-ALL (20-30%)', 'AML (rare)'],
    pathway: 'Tyrosine kinase activation',
    prognostic: 'Poor',
    clinicalSignificance: 'Defines CML. Constitutive tyrosine kinase activity.',
    treatmentImplications: 'Imatinib, dasatinib, nilotinib (TKIs)',
  },
  {
    gene: 'FLT3-ITD',
    fullName: 'FLT3 internal tandem duplication',
    disease: ['AML (25-30%)'],
    pathway: 'Receptor tyrosine kinase',
    prognostic: 'Poor',
    clinicalSignificance: 'Associated with leukocytosis, normal karyotype AML. Poor prognosis, high relapse.',
    treatmentImplications: 'Midostaurin, gilteritinib (FLT3 inhibitors)',
  },
  {
    gene: 'NPM1',
    fullName: 'Nucleophosmin 1',
    disease: ['AML (30%)'],
    pathway: 'Nucleocytoplasmic transport',
    prognostic: 'Favorable',
    clinicalSignificance: 'Most common AML mutation. Normal karyotype. Favorable if isolated.',
    treatmentImplications: 'Standard chemotherapy; good response',
  },
  {
    gene: 'CALR',
    fullName: 'Calreticulin',
    disease: ['Essential thrombocythemia (25%)', 'Primary myelofibrosis (25%)'],
    pathway: 'ER chaperone, JAK-STAT activation',
    prognostic: 'Favorable',
    clinicalSignificance: 'Mutually exclusive with JAK2. Better prognosis than JAK2 in ET/PMF.',
    treatmentImplications: 'Standard MPN management',
  },
  {
    gene: 'MPL',
    fullName: 'Thrombopoietin receptor',
    disease: ['Essential thrombocythemia (5%)', 'Primary myelofibrosis (10%)'],
    pathway: 'JAK-STAT signaling',
    prognostic: 'Variable',
    clinicalSignificance: 'Activates JAK-STAT. Rare in MPNs.',
    treatmentImplications: 'Standard MPN management',
  },
  {
    gene: 'TP53',
    fullName: 'Tumor protein p53',
    disease: ['AML', 'MDS', 'ALL', 'Many solid tumors'],
    pathway: 'Cell cycle checkpoint, apoptosis',
    prognostic: 'Poor',
    clinicalSignificance: 'Therapy-related AML/MDS. Complex karyotype. Very poor prognosis.',
    treatmentImplications: 'Often chemo-resistant; consider allogeneic transplant',
  },
  {
    gene: 'MYD88 L265P',
    fullName: 'Myeloid differentiation primary response 88',
    disease: ['Waldenström macroglobulinemia (>90%)', 'ABC-DLBCL'],
    pathway: 'NF-κB signaling',
    prognostic: 'Variable',
    clinicalSignificance: 'Diagnostic for Waldenström. Activates NF-κB.',
    treatmentImplications: 'BTK inhibitors (ibrutinib)',
  },
  {
    gene: 'BRAF V600E',
    fullName: 'B-Raf proto-oncogene',
    disease: ['Hairy cell leukemia (100%)', 'Melanoma', 'Langerhans cell histiocytosis'],
    pathway: 'MAPK/ERK signaling',
    prognostic: 'Variable',
    clinicalSignificance: 'Diagnostic for hairy cell leukemia.',
    treatmentImplications: 'Vemurafenib (BRAF inhibitor)',
  },
  {
    gene: 'SF3B1',
    fullName: 'Splicing factor 3B subunit 1',
    disease: ['MDS with ring sideroblasts', 'CLL'],
    pathway: 'RNA splicing',
    prognostic: 'Favorable',
    clinicalSignificance: 'Associated with ring sideroblasts. Better prognosis in MDS.',
    treatmentImplications: 'Luspatercept for MDS with ring sideroblasts',
  },
]

export function MolecularPanelView() {
  const setCurrentView = useAppStore((state) => state.setCurrentView)
  const [selectedMutation, setSelectedMutation] = useState<Mutation | null>(null)
  const [filterDisease, setFilterDisease] = useState<string>('All')

  const diseaseCategories = [
    'All',
    'AML',
    'MPN',
    'MDS',
    'CML',
    'ALL',
    'Lymphoma',
  ]

  const filteredMutations =
    filterDisease === 'All'
      ? mutations
      : mutations.filter((m) =>
          m.disease.some((d) => d.toLowerCase().includes(filterDisease.toLowerCase()))
        )

  const getPrognosticColor = (prog: string) => {
    if (prog === 'Favorable') return 'text-green-400'
    if (prog === 'Poor') return 'text-red-400'
    return 'text-yellow-400'
  }

  return (
    <div className="space-y-4 p-4 pb-24 md:pb-6 animate-fade-in">
      <div className="flex items-center gap-4">
        <Button variant="ghost" size="sm" onClick={() => setCurrentView('home')}>
          <ArrowLeft size={16} className="mr-2" />
          Back
        </Button>
        <div>
          <h2 className="text-2xl font-bold">Molecular Panel Explorer</h2>
          <p className="text-sm text-muted-foreground">
            Key mutations in hematologic malignancies
          </p>
        </div>
      </div>

      <div className="flex gap-2 overflow-x-auto pb-2">
        {diseaseCategories.map((cat) => (
          <Button
            key={cat}
            size="sm"
            variant={filterDisease === cat ? 'default' : 'outline'}
            onClick={() => setFilterDisease(cat)}
          >
            {cat}
          </Button>
        ))}
      </div>

      <div className="grid gap-3 md:grid-cols-2">
        {filteredMutations.map((mutation) => (
          <Card
            key={mutation.gene}
            className={`cursor-pointer transition-all hover:shadow-md ${
              selectedMutation?.gene === mutation.gene ? 'ring-2 ring-primary' : ''
            }`}
            onClick={() =>
              setSelectedMutation(
                selectedMutation?.gene === mutation.gene ? null : mutation
              )
            }
          >
            <CardHeader>
              <div className="flex items-start justify-between">
                <div>
                  <CardTitle className="text-base">{mutation.gene}</CardTitle>
                  <CardDescription className="text-xs">
                    {mutation.fullName}
                  </CardDescription>
                </div>
                <span
                  className={`text-xs px-2 py-1 rounded ${getPrognosticColor(
                    mutation.prognostic
                  )} bg-accent`}
                >
                  {mutation.prognostic}
                </span>
              </div>
            </CardHeader>
            {selectedMutation?.gene === mutation.gene && (
              <CardContent className="space-y-3 border-t pt-4">
                <div>
                  <span className="font-semibold text-sm">Associated Diseases:</span>
                  <ul className="list-disc list-inside text-sm text-muted-foreground mt-1">
                    {mutation.disease.map((d, idx) => (
                      <li key={idx}>{d}</li>
                    ))}
                  </ul>
                </div>
                <div>
                  <span className="font-semibold text-sm">Pathway:</span>
                  <p className="text-sm text-muted-foreground">{mutation.pathway}</p>
                </div>
                <div>
                  <span className="font-semibold text-sm">Clinical Significance:</span>
                  <p className="text-sm text-muted-foreground">
                    {mutation.clinicalSignificance}
                  </p>
                </div>
                <div>
                  <span className="font-semibold text-sm">
                    Treatment Implications:
                  </span>
                  <p className="text-sm text-muted-foreground">
                    {mutation.treatmentImplications}
                  </p>
                </div>
              </CardContent>
            )}
          </Card>
        ))}
      </div>

      <Card className="bg-blue-500/10 border-blue-500/20">
        <CardHeader>
          <div className="flex items-start gap-2">
            <AlertCircle className="w-5 h-5 text-blue-400 mt-0.5 flex-shrink-0" />
            <div>
              <CardTitle className="text-lg">Clinical Integration</CardTitle>
              <CardDescription className="mt-2 space-y-2 text-sm">
                <p>
                  <strong>MPN Triple-Negative:</strong> ~10-15% of ET/PMF lack JAK2, CALR, MPL. Consider other diagnoses.
                </p>
                <p>
                  <strong>AML Risk Stratification:</strong> Favorable (NPM1+/FLT3-ITD-, core binding factor), Intermediate, Poor (FLT3-ITD, TP53, complex karyotype)
                </p>
                <p>
                  <strong>Targeted Therapy Era:</strong> Many mutations now have specific inhibitors (BCR-ABL→TKI, FLT3→midostaurin, BRAF→vemurafenib)
                </p>
              </CardDescription>
            </div>
          </div>
        </CardHeader>
      </Card>
    </div>
  )
}
