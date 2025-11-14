import { useState } from 'react'
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from './Card'
import { Button } from './Button'
import { ArrowLeft, Plus, X } from 'lucide-react'
import { useAppStore } from './store'

interface Marker {
  cd: string
  name: string
  lineage: string[]
  significance: string
}

const commonMarkers: Marker[] = [
  { cd: 'CD34', name: 'Hematopoietic stem cell marker', lineage: ['Progenitor'], significance: 'Blast marker, MDS, AML' },
  { cd: 'CD117', name: 'c-KIT', lineage: ['Progenitor', 'Mast cell'], significance: 'Early myeloid, AML, mastocytosis' },
  { cd: 'MPO', name: 'Myeloperoxidase', lineage: ['Myeloid'], significance: 'Defines myeloid lineage' },
  { cd: 'CD13', name: 'Myeloid marker', lineage: ['Myeloid'], significance: 'AML, monocytic differentiation' },
  { cd: 'CD33', name: 'Myeloid marker', lineage: ['Myeloid'], significance: 'AML, monocytic lineage' },
  { cd: 'CD14', name: 'Monocyte marker', lineage: ['Monocytic'], significance: 'Monocytic differentiation, CMML' },
  { cd: 'CD64', name: 'Monocyte marker', lineage: ['Monocytic'], significance: 'Monocytic lineage' },
  { cd: 'CD3', name: 'T-cell marker', lineage: ['T-cell'], significance: 'Pan T-cell marker' },
  { cd: 'CD4', name: 'Helper T-cell', lineage: ['T-cell'], significance: 'Th cells, peripheral T-cell lymphomas' },
  { cd: 'CD8', name: 'Cytotoxic T-cell', lineage: ['T-cell'], significance: 'Tc cells, T-cell lymphomas' },
  { cd: 'CD19', name: 'B-cell marker', lineage: ['B-cell'], significance: 'Pan B-cell marker, ALL, CLL' },
  { cd: 'CD20', name: 'B-cell marker', lineage: ['B-cell'], significance: 'Mature B-cell lymphomas' },
  { cd: 'CD10', name: 'CALLA', lineage: ['B-cell', 'Progenitor'], significance: 'Pre-B ALL, germinal center B-cells, Burkitt' },
  { cd: 'CD5', name: 'T-cell / B-cell subset', lineage: ['T-cell', 'B-cell subset'], significance: 'CLL, mantle cell lymphoma (CD5+ B-cells)' },
  { cd: 'CD23', name: 'B-cell activation', lineage: ['B-cell'], significance: 'CLL (CD5+CD23+), distinguishes from MCL' },
  { cd: 'Kappa', name: 'Light chain', lineage: ['B-cell'], significance: 'Clonality assessment (κ:λ ratio)' },
  { cd: 'Lambda', name: 'Light chain', lineage: ['B-cell'], significance: 'Clonality assessment (κ:λ ratio)' },
  { cd: 'CD41', name: 'Platelet glycoprotein', lineage: ['Megakaryocytic'], significance: 'Acute megakaryoblastic leukemia' },
  { cd: 'CD61', name: 'Platelet glycoprotein', lineage: ['Megakaryocytic'], significance: 'Megakaryocytic lineage' },
]

export function FlowCytometryView() {
  const setCurrentView = useAppStore((state) => state.setCurrentView)
  const [selectedMarkers, setSelectedMarkers] = useState<string[]>([])
  const [filter, setFilter] = useState<string>('All')

  const toggleMarker = (cd: string) => {
    setSelectedMarkers((prev) =>
      prev.includes(cd) ? prev.filter((m) => m !== cd) : [...prev, cd]
    )
  }

  const getInterpretation = (): string => {
    if (selectedMarkers.length === 0) {
      return 'Select markers to build a panel and see interpretation'
    }

    const interpretations: string[] = []

    // AML patterns
    if (
      selectedMarkers.includes('CD34') &&
      selectedMarkers.includes('MPO') &&
      selectedMarkers.includes('CD13')
    ) {
      interpretations.push('Pattern consistent with AML (blasts positive for CD34, MPO, CD13)')
    }

    // ALL patterns
    if (
      selectedMarkers.includes('CD34') &&
      selectedMarkers.includes('CD19') &&
      selectedMarkers.includes('CD10')
    ) {
      interpretations.push('Pattern consistent with Pre-B ALL (CD34+, CD19+, CD10+)')
    }

    // CLL pattern
    if (
      selectedMarkers.includes('CD19') &&
      selectedMarkers.includes('CD5') &&
      selectedMarkers.includes('CD23')
    ) {
      interpretations.push('Pattern consistent with CLL (CD5+, CD19+, CD23+, typically dim CD20)')
    }

    // Monocytic
    if (selectedMarkers.includes('CD14') && selectedMarkers.includes('CD64')) {
      interpretations.push('Monocytic lineage differentiation')
    }

    if (interpretations.length === 0) {
      return `Selected: ${selectedMarkers.join(', ')}. Add more markers for pattern recognition.`
    }

    return interpretations.join(' | ')
  }

  const lineageTypes = ['All', 'Progenitor', 'Myeloid', 'Monocytic', 'T-cell', 'B-cell', 'Megakaryocytic']

  const filteredMarkers =
    filter === 'All'
      ? commonMarkers
      : commonMarkers.filter((m) => m.lineage.includes(filter))

  return (
    <div className="space-y-4 p-4 pb-24 md:pb-6 animate-fade-in">
      <div className="flex items-center gap-4">
        <Button variant="ghost" size="sm" onClick={() => setCurrentView('home')}>
          <ArrowLeft size={16} className="mr-2" />
          Back
        </Button>
        <div>
          <h2 className="text-2xl font-bold">Flow Cytometry Viewer</h2>
          <p className="text-sm text-muted-foreground">
            Build immunophenotyping panels
          </p>
        </div>
      </div>

      <div className="flex gap-2 overflow-x-auto pb-2">
        {lineageTypes.map((type) => (
          <Button
            key={type}
            size="sm"
            variant={filter === type ? 'default' : 'outline'}
            onClick={() => setFilter(type)}
          >
            {type}
          </Button>
        ))}
      </div>

      {selectedMarkers.length > 0 && (
        <Card className="bg-gradient-to-r from-purple-500/10 to-blue-500/10 border-primary/20">
          <CardHeader>
            <CardTitle className="text-lg">Panel Interpretation</CardTitle>
            <CardDescription className="mt-2">{getInterpretation()}</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex flex-wrap gap-2">
              {selectedMarkers.map((cd) => (
                <div
                  key={cd}
                  className="flex items-center gap-1 bg-primary/20 px-2 py-1 rounded text-sm"
                >
                  {cd}
                  <button
                    onClick={() => toggleMarker(cd)}
                    className="hover:text-destructive"
                  >
                    <X size={14} />
                  </button>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      <div className="grid gap-3 md:grid-cols-2">
        {filteredMarkers.map((marker) => (
          <Card
            key={marker.cd}
            className={`cursor-pointer transition-all hover:shadow-md ${
              selectedMarkers.includes(marker.cd) ? 'ring-2 ring-primary' : ''
            }`}
            onClick={() => toggleMarker(marker.cd)}
          >
            <CardHeader>
              <div className="flex items-start justify-between">
                <div>
                  <CardTitle className="text-base">{marker.cd}</CardTitle>
                  <CardDescription className="text-sm">{marker.name}</CardDescription>
                </div>
                {selectedMarkers.includes(marker.cd) && (
                  <div className="p-1 bg-primary rounded">
                    <Plus size={16} className="text-primary-foreground rotate-45" />
                  </div>
                )}
              </div>
            </CardHeader>
            <CardContent className="pt-0">
              <div className="space-y-1">
                <div className="flex flex-wrap gap-1">
                  {marker.lineage.map((lin) => (
                    <span
                      key={lin}
                      className="text-xs px-2 py-0.5 bg-accent rounded-full"
                    >
                      {lin}
                    </span>
                  ))}
                </div>
                <p className="text-xs text-muted-foreground mt-2">
                  {marker.significance}
                </p>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Clinical Pearls</CardTitle>
          <CardDescription className="mt-2 space-y-2 text-sm">
            <p>
              <strong>AML:</strong> CD34+, MPO+, CD13+, CD33+ (myeloid lineage)
            </p>
            <p>
              <strong>B-ALL:</strong> CD34+, CD19+, CD10+, TdT+ (precursor B)
            </p>
            <p>
              <strong>CLL:</strong> CD5+, CD19+, CD23+, dim CD20, dim sIg (mature B with aberrant CD5)
            </p>
            <p>
              <strong>Mantle Cell Lymphoma:</strong> CD5+, CD19+, CD20+, CD23- (distinguishes from CLL)
            </p>
          </CardDescription>
        </CardHeader>
      </Card>
    </div>
  )
}
