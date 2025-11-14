import { useState } from 'react'
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from './Card'
import { Button } from './Button'
import { ArrowLeft, Info } from 'lucide-react'
import { useAppStore } from './store'

interface CellType {
  id: string
  name: string
  description: string
  size: string
  nucleus: string
  cytoplasm: string
  frequency: string
  keyFeatures: string[]
}

const cellTypes: CellType[] = [
  {
    id: 'rbc',
    name: 'Red Blood Cell (Erythrocyte)',
    description: 'Normal mature RBC - anucleate biconcave disc',
    size: '7-8 μm diameter',
    nucleus: 'Absent (anucleate)',
    cytoplasm: 'Salmon pink with central pallor (1/3 diameter)',
    frequency: 'Predominant cell type',
    keyFeatures: [
      'Central pallor = 1/3 of cell diameter',
      'Uniform size (normocytic)',
      'Smooth round shape',
      'No inclusions in normal state',
    ],
  },
  {
    id: 'neutrophil',
    name: 'Neutrophil (Segmented)',
    description: 'Mature granulocyte with 2-5 nuclear lobes',
    size: '12-15 μm',
    nucleus: '2-5 lobes connected by thin chromatin strands',
    cytoplasm: 'Pale pink with fine granules',
    frequency: '40-70% of WBCs',
    keyFeatures: [
      '3-5 nuclear lobes (hypersegmentation >5 lobes is abnormal)',
      'Clumped chromatin',
      'Fine pink-purple granules',
      'Most common WBC in adults',
    ],
  },
  {
    id: 'lymphocyte',
    name: 'Lymphocyte',
    description: 'Small lymphocyte - most common in circulation',
    size: '7-10 μm (small), 12-16 μm (large)',
    nucleus: 'Round, dense chromatin',
    cytoplasm: 'Scant blue cytoplasm',
    frequency: '20-40% of WBCs',
    keyFeatures: [
      'High nuclear:cytoplasmic ratio',
      'Deeply basophilic cytoplasm',
      'Clumped chromatin',
      'May have occasional azurophilic granules',
    ],
  },
  {
    id: 'monocyte',
    name: 'Monocyte',
    description: 'Largest WBC, precursor to tissue macrophages',
    size: '15-20 μm',
    nucleus: 'Kidney-bean or horseshoe shaped, folded',
    cytoplasm: 'Blue-gray, may have vacuoles and fine granules',
    frequency: '2-10% of WBCs',
    keyFeatures: [
      'Largest circulating WBC',
      'Folded/indented nucleus',
      'Ground-glass gray cytoplasm',
      'May have fine azurophilic granules and vacuoles',
    ],
  },
  {
    id: 'eosinophil',
    name: 'Eosinophil',
    description: 'Granulocyte with large orange-red granules',
    size: '12-17 μm',
    nucleus: 'Bilobed (typically 2 lobes)',
    cytoplasm: 'Packed with large orange-red granules',
    frequency: '1-4% of WBCs',
    keyFeatures: [
      'Large refractile orange-red granules',
      'Usually bilobed nucleus',
      'Granules obscure nucleus',
      'Associated with allergy and parasites',
    ],
  },
  {
    id: 'basophil',
    name: 'Basophil',
    description: 'Rarest granulocyte with dark purple granules',
    size: '10-14 μm',
    nucleus: 'Often obscured by granules',
    cytoplasm: 'Packed with large dark purple granules',
    frequency: '0-1% of WBCs',
    keyFeatures: [
      'Large dark purple/black granules',
      'Granules may overlie nucleus',
      'Least common WBC',
      'Contains histamine',
    ],
  },
  {
    id: 'platelet',
    name: 'Platelet (Thrombocyte)',
    description: 'Small anucleate cell fragments for hemostasis',
    size: '2-4 μm',
    nucleus: 'Absent (cell fragment)',
    cytoplasm: 'Light blue with purple granules (granulomere)',
    frequency: '150-400 × 10⁹/L',
    keyFeatures: [
      'Smallest formed element',
      'Central purple granules',
      'Pale blue peripheral zone',
      'Often found in clumps',
    ],
  },
]

export function NormalSmearView() {
  const setCurrentView = useAppStore((state) => state.setCurrentView)
  const [selectedCell, setSelectedCell] = useState<CellType | null>(null)

  return (
    <div className="space-y-4 p-4 pb-24 md:pb-6 animate-fade-in">
      <div className="flex items-center gap-4">
        <Button
          variant="ghost"
          size="sm"
          onClick={() => setCurrentView('home')}
        >
          <ArrowLeft size={16} className="mr-2" />
          Back
        </Button>
        <div>
          <h2 className="text-2xl font-bold">Normal Smear Foundations</h2>
          <p className="text-sm text-muted-foreground">
            Learn normal blood cell morphology
          </p>
        </div>
      </div>

      <Card className="bg-blue-500/10 border-blue-500/20">
        <CardHeader>
          <div className="flex items-start gap-2">
            <Info className="w-5 h-5 text-blue-400 mt-0.5 flex-shrink-0" />
            <div>
              <CardTitle className="text-lg">Learning Objectives</CardTitle>
              <CardDescription className="mt-2">
                • Identify normal blood cells by morphology
                <br />
                • Understand normal nuclear and cytoplasmic features
                <br />
                • Recognize normal size relationships
                <br />• Know normal differential percentages
              </CardDescription>
            </div>
          </div>
        </CardHeader>
      </Card>

      <div className="grid gap-4 md:grid-cols-2">
        {cellTypes.map((cell) => (
          <Card
            key={cell.id}
            className={`cursor-pointer transition-all hover:shadow-lg ${
              selectedCell?.id === cell.id ? 'ring-2 ring-primary' : ''
            }`}
            onClick={() =>
              setSelectedCell(selectedCell?.id === cell.id ? null : cell)
            }
          >
            <CardHeader>
              <CardTitle className="text-lg">{cell.name}</CardTitle>
              <CardDescription>{cell.description}</CardDescription>
            </CardHeader>
            {selectedCell?.id === cell.id && (
              <CardContent className="space-y-3 border-t pt-4">
                <div>
                  <span className="font-semibold text-sm">Size:</span>
                  <p className="text-sm text-muted-foreground">{cell.size}</p>
                </div>
                <div>
                  <span className="font-semibold text-sm">Nucleus:</span>
                  <p className="text-sm text-muted-foreground">
                    {cell.nucleus}
                  </p>
                </div>
                <div>
                  <span className="font-semibold text-sm">Cytoplasm:</span>
                  <p className="text-sm text-muted-foreground">
                    {cell.cytoplasm}
                  </p>
                </div>
                <div>
                  <span className="font-semibold text-sm">
                    Normal Frequency:
                  </span>
                  <p className="text-sm text-muted-foreground">
                    {cell.frequency}
                  </p>
                </div>
                <div>
                  <span className="font-semibold text-sm">Key Features:</span>
                  <ul className="list-disc list-inside text-sm text-muted-foreground space-y-1 mt-1">
                    {cell.keyFeatures.map((feature, idx) => (
                      <li key={idx}>{feature}</li>
                    ))}
                  </ul>
                </div>
              </CardContent>
            )}
          </Card>
        ))}
      </div>

      <Card className="bg-gradient-to-r from-purple-500/10 to-blue-500/10 border-primary/20">
        <CardHeader>
          <CardTitle className="text-lg">Clinical Pearls</CardTitle>
          <CardDescription className="mt-2 space-y-2">
            <p>
              <strong>Size Reference:</strong> Use RBC (7-8 μm) as your ruler.
              Small lymphocyte ≈ RBC size. Monocyte is 2× RBC size.
            </p>
            <p>
              <strong>Nuclear:Cytoplasmic Ratio:</strong> Lymphocytes have high
              N:C. Monocytes have low N:C.
            </p>
            <p>
              <strong>Chromatin Pattern:</strong> Neutrophil = clumped.
              Lymphocyte = smudged/clumped. Monocyte = lacy/reticular.
            </p>
            <p>
              <strong>Toxic Changes (Abnormal):</strong> Döhle bodies, toxic
              granulation, vacuoles indicate reactive/infectious process.
            </p>
          </CardDescription>
        </CardHeader>
      </Card>
    </div>
  )
}
