import { useState } from 'react'
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from './Card'
import { Button } from './Button'
import { ArrowLeft, Search } from 'lucide-react'
import { useAppStore } from './store'
import type { GlossaryEntry } from './types'

const glossaryEntries: GlossaryEntry[] = [
  {
    term: 'Auer Rod',
    definition: 'Azurophilic crystalline cytoplasmic inclusion formed from abnormal fusion of primary granules. Pathognomonic for myeloid lineage in acute leukemia (AML). Most prominent in APL.',
    category: 'morphology',
    relatedTerms: ['AML', 'APL', 'Myeloblast'],
  },
  {
    term: 'Anisocytosis',
    definition: 'Variation in red blood cell size. Quantified by RDW (red cell distribution width). Seen in iron deficiency, B12/folate deficiency, mixed anemias.',
    category: 'morphology',
    relatedTerms: ['RDW', 'Poikilocytosis'],
  },
  {
    term: 'Hypersegmented Neutrophil',
    definition: 'Neutrophil with >5 nuclear lobes. Classic finding in megaloblastic anemia (B12 or folate deficiency). Reflects impaired DNA synthesis.',
    category: 'morphology',
    relatedTerms: ['Megaloblastic anemia', 'B12 deficiency', 'Folate deficiency'],
  },
  {
    term: 'Schistocyte',
    definition: 'Fragmented red blood cell (helmet cell, triangle cell). Indicates microangiopathic hemolytic anemia (MAHA). Seen in DIC, TTP, HUS, mechanical heart valves.',
    category: 'morphology',
    relatedTerms: ['MAHA', 'DIC', 'TTP', 'HUS'],
  },
  {
    term: 'Spherocyte',
    definition: 'Small round RBC without central pallor. Seen in hereditary spherocytosis, autoimmune hemolytic anemia, ABO incompatibility. Loss of membrane surface area.',
    category: 'morphology',
    relatedTerms: ['Hereditary spherocytosis', 'AIHA'],
  },
  {
    term: 'Target Cell',
    definition: 'RBC with central hemoglobin density resembling a target. Seen in liver disease, thalassemia, hemoglobin C disease, post-splenectomy. Increased membrane:volume ratio.',
    category: 'morphology',
    synonyms: ['Codocyte'],
    relatedTerms: ['Thalassemia', 'Liver disease'],
  },
  {
    term: 'MCV',
    definition: 'Mean corpuscular volume. Average RBC size in femtoliters (fL). Normal: 80-100. Low (<80): microcytic. High (>100): macrocytic.',
    category: 'lab',
    relatedTerms: ['MCH', 'MCHC', 'Anemia'],
  },
  {
    term: 'RDW',
    definition: 'Red cell distribution width. Coefficient of variation of RBC size. Elevated (>14.5%) indicates anisocytosis. Helpful in differentiating anemias.',
    category: 'lab',
    relatedTerms: ['Anisocytosis', 'Iron deficiency', 'B12 deficiency'],
  },
  {
    term: 'Reticulocyte Count',
    definition: 'Percentage of young RBCs (1-2 days old). Normal: 0.5-2%. Elevated in hemolysis/blood loss. Low in bone marrow failure. Key to anemia classification.',
    category: 'lab',
    relatedTerms: ['Hemolysis', 'Bone marrow failure', 'Anemia classification'],
  },
  {
    term: 'JAK2 V617F',
    definition: 'Point mutation in JAK2 exon 14. Constitutive JAK-STAT activation. Found in >95% of polycythemia vera, ~50% of ET/PMF. Diagnostic for MPN.',
    category: 'molecular',
    relatedTerms: ['PV', 'ET', 'PMF', 'MPN'],
  },
  {
    term: 'BCR-ABL1',
    definition: 't(9;22) Philadelphia chromosome creating BCR-ABL1 fusion. Constitutive tyrosine kinase. Defines CML. Targeted by TKIs (imatinib).',
    category: 'molecular',
    synonyms: ['Philadelphia chromosome'],
    relatedTerms: ['CML', 'TKI', 'Imatinib'],
  },
  {
    term: 'FLT3-ITD',
    definition: 'Internal tandem duplication of FLT3 receptor tyrosine kinase. Found in ~30% of AML. Poor prognostic factor. Targeted by midostaurin, gilteritinib.',
    category: 'molecular',
    relatedTerms: ['AML', 'Midostaurin', 'Gilteritinib'],
  },
  {
    term: 'CD34',
    definition: 'Hematopoietic progenitor cell antigen. Expressed on stem cells and blasts. Used to identify immature cells in flow cytometry. Positive in most AML, B-ALL. Negative in APL.',
    category: 'lab',
    relatedTerms: ['Flow cytometry', 'AML', 'ALL'],
  },
  {
    term: 'MPO',
    definition: 'Myeloperoxidase. Enzyme in azurophilic granules. Defines myeloid lineage. Positive in AML. Negative in ALL. Key flow cytometry marker.',
    category: 'lab',
    synonyms: ['Myeloperoxidase'],
    relatedTerms: ['AML', 'Myeloid lineage', 'Flow cytometry'],
  },
  {
    term: 'DIC',
    definition: 'Disseminated intravascular coagulation. Consumption of clotting factors and platelets. ↑PT/PTT, ↓fibrinogen, ↑D-dimer, ↓platelets, schistocytes. Causes: sepsis, APL, trauma, malignancy.',
    category: 'clinical',
    synonyms: ['Consumptive coagulopathy'],
    relatedTerms: ['APL', 'Schistocyte', 'D-dimer'],
  },
  {
    term: 'TTP',
    definition: 'Thrombotic thrombocytopenic purpura. ADAMTS13 deficiency → vWF multimers → microthrombi. Pentad: MAHA, thrombocytopenia, neurologic changes, renal failure, fever.',
    category: 'clinical',
    relatedTerms: ['MAHA', 'ADAMTS13', 'Schistocyte'],
  },
]

export function GlossaryView() {
  const setCurrentView = useAppStore((state) => state.setCurrentView)
  const [searchTerm, setSearchTerm] = useState('')
  const [filterCategory, setFilterCategory] = useState<string>('all')

  const filteredEntries = glossaryEntries.filter((entry) => {
    const matchesSearch =
      entry.term.toLowerCase().includes(searchTerm.toLowerCase()) ||
      entry.definition.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesCategory =
      filterCategory === 'all' || entry.category === filterCategory
    return matchesSearch && matchesCategory
  })

  const categories = ['all', 'morphology', 'lab', 'molecular', 'clinical']

  return (
    <div className="space-y-4 p-4 pb-24 md:pb-6 animate-fade-in">
      <div className="flex items-center gap-4">
        <Button variant="ghost" size="sm" onClick={() => setCurrentView('home')}>
          <ArrowLeft size={16} className="mr-2" />
          Back
        </Button>
        <div>
          <h2 className="text-2xl font-bold">Glossary</h2>
          <p className="text-sm text-muted-foreground">
            Hematopathology terminology
          </p>
        </div>
      </div>

      <Card>
        <CardContent className="pt-6">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground" size={18} />
            <input
              type="text"
              placeholder="Search terms..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 bg-background border border-border rounded-md focus:outline-none focus:ring-2 focus:ring-primary"
            />
          </div>
        </CardContent>
      </Card>

      <div className="flex gap-2 overflow-x-auto pb-2">
        {categories.map((cat) => (
          <Button
            key={cat}
            size="sm"
            variant={filterCategory === cat ? 'default' : 'outline'}
            onClick={() => setFilterCategory(cat)}
          >
            {cat.charAt(0).toUpperCase() + cat.slice(1)}
          </Button>
        ))}
      </div>

      <div className="space-y-3">
        {filteredEntries.length === 0 ? (
          <Card>
            <CardContent className="py-8 text-center text-muted-foreground">
              No terms found matching your search.
            </CardContent>
          </Card>
        ) : (
          filteredEntries.map((entry) => (
            <Card key={entry.term}>
              <CardHeader>
                <div className="flex items-start justify-between gap-2">
                  <div className="flex-1">
                    <CardTitle className="text-lg">{entry.term}</CardTitle>
                    {entry.synonyms && entry.synonyms.length > 0 && (
                      <p className="text-xs text-muted-foreground mt-1">
                        Also known as: {entry.synonyms.join(', ')}
                      </p>
                    )}
                  </div>
                  <span className="text-xs px-2 py-1 bg-accent rounded shrink-0">
                    {entry.category}
                  </span>
                </div>
                <CardDescription className="mt-2">
                  {entry.definition}
                </CardDescription>
                {entry.relatedTerms && entry.relatedTerms.length > 0 && (
                  <div className="mt-3">
                    <span className="text-xs font-semibold">Related: </span>
                    <span className="text-xs text-muted-foreground">
                      {entry.relatedTerms.join(', ')}
                    </span>
                  </div>
                )}
              </CardHeader>
            </Card>
          ))
        )}
      </div>
    </div>
  )
}
