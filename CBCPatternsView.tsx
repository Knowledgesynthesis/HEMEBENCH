import { useState } from 'react'
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from './Card'
import { Button } from './Button'
import { ArrowLeft } from 'lucide-react'
import { useAppStore } from './store'
import { formatNumber, getColorForValue } from './utils'
import type { CBCValues, CBCReferenceRanges } from './types'

const normalRanges: CBCReferenceRanges = {
  wbc: [4.5, 11.0],
  rbc: [4.5, 5.5],
  hgb: [13.5, 17.5],
  hct: [40, 50],
  mcv: [80, 100],
  mch: [27, 33],
  mchc: [32, 36],
  rdw: [11.5, 14.5],
  platelets: [150, 400],
  neutrophils: [40, 70],
  lymphocytes: [20, 40],
  monocytes: [2, 10],
  eosinophils: [1, 4],
  basophils: [0, 1],
  reticulocytes: [0.5, 2.0],
}

const initialCBC: CBCValues = {
  wbc: 7.5,
  rbc: 5.0,
  hgb: 15.0,
  hct: 45,
  mcv: 90,
  mch: 30,
  mchc: 34,
  rdw: 13.0,
  platelets: 250,
  neutrophils: 60,
  lymphocytes: 30,
  monocytes: 6,
  eosinophils: 3,
  basophils: 1,
  reticulocytes: 1.0,
}

export function CBCPatternsView() {
  const setCurrentView = useAppStore((state) => state.setCurrentView)
  const [cbc, setCBC] = useState<CBCValues>(initialCBC)

  const updateValue = (key: keyof CBCValues, delta: number) => {
    setCBC((prev) => ({
      ...prev,
      [key]: Math.max(0, Number((prev[key]! + delta).toFixed(1))),
    }))
  }

  const resetToNormal = () => setCBC(initialCBC)

  const getInterpretation = (): string => {
    const patterns: string[] = []

    // Anemia patterns
    if (cbc.hgb < normalRanges.hgb[0]) {
      if (cbc.mcv < normalRanges.mcv[0]) {
        patterns.push('Microcytic anemia (consider: iron deficiency, thalassemia, anemia of chronic disease)')
      } else if (cbc.mcv > normalRanges.mcv[1]) {
        patterns.push('Macrocytic anemia (consider: B12/folate deficiency, liver disease, reticulocytosis)')
      } else {
        patterns.push('Normocytic anemia (consider: acute blood loss, hemolysis, chronic disease, bone marrow failure)')
      }
    }

    // Leukocytosis
    if (cbc.wbc > normalRanges.wbc[1]) {
      if (cbc.neutrophils! > normalRanges.neutrophils![1]) {
        patterns.push('Neutrophilic leukocytosis (consider: infection, inflammation, stress, malignancy)')
      } else if (cbc.lymphocytes! > normalRanges.lymphocytes![1]) {
        patterns.push('Lymphocytosis (consider: viral infection, CLL, pertussis)')
      } else if (cbc.eosinophils! > normalRanges.eosinophils![1]) {
        patterns.push('Eosinophilia (consider: allergy, parasites, drug reaction, hypereosinophilic syndromes)')
      }
    }

    // Leukopenia
    if (cbc.wbc < normalRanges.wbc[0]) {
      patterns.push('Leukopenia (consider: viral infection, bone marrow failure, autoimmune, medications)')
    }

    // Thrombocytopenia
    if (cbc.platelets < normalRanges.platelets[0]) {
      patterns.push('Thrombocytopenia (consider: ITP, TTP, DIC, bone marrow failure, sequestration)')
    }

    // Thrombocytosis
    if (cbc.platelets > normalRanges.platelets[1]) {
      patterns.push('Thrombocytosis (consider: reactive vs. essential thrombocythemia, other MPNs)')
    }

    // RDW elevation
    if (cbc.rdw > normalRanges.rdw[1]) {
      patterns.push('Elevated RDW suggests mixed RBC populations or nutritional deficiency')
    }

    if (patterns.length === 0) {
      return 'Normal CBC pattern - all values within reference ranges'
    }

    return patterns.join(' | ')
  }

  return (
    <div className="space-y-4 p-4 pb-24 md:pb-6 animate-fade-in">
      <div className="flex items-center gap-4">
        <Button variant="ghost" size="sm" onClick={() => setCurrentView('home')}>
          <ArrowLeft size={16} className="mr-2" />
          Back
        </Button>
        <div>
          <h2 className="text-2xl font-bold">CBC Patterns Explorer</h2>
          <p className="text-sm text-muted-foreground">
            Adjust values to explore diagnostic patterns
          </p>
        </div>
      </div>

      <div className="flex gap-2">
        <Button onClick={resetToNormal} size="sm" variant="outline">
          Reset to Normal
        </Button>
      </div>

      <Card className="bg-gradient-to-r from-blue-500/10 to-purple-500/10 border-primary/20">
        <CardHeader>
          <CardTitle className="text-lg">Pattern Interpretation</CardTitle>
          <CardDescription className="text-base mt-2">
            {getInterpretation()}
          </CardDescription>
        </CardHeader>
      </Card>

      <div className="grid gap-4 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Complete Blood Count</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            {[
              { key: 'wbc' as const, label: 'WBC', unit: '×10⁹/L', step: 0.5 },
              { key: 'rbc' as const, label: 'RBC', unit: '×10¹²/L', step: 0.2 },
              { key: 'hgb' as const, label: 'Hemoglobin', unit: 'g/dL', step: 0.5 },
              { key: 'hct' as const, label: 'Hematocrit', unit: '%', step: 1 },
              { key: 'mcv' as const, label: 'MCV', unit: 'fL', step: 2 },
              { key: 'mch' as const, label: 'MCH', unit: 'pg', step: 0.5 },
              { key: 'mchc' as const, label: 'MCHC', unit: 'g/dL', step: 0.5 },
              { key: 'rdw' as const, label: 'RDW', unit: '%', step: 0.5 },
              { key: 'platelets' as const, label: 'Platelets', unit: '×10⁹/L', step: 10 },
            ].map(({ key, label, unit, step }) => (
              <div key={key} className="flex items-center justify-between gap-2">
                <span className="text-sm font-medium min-w-[120px]">{label}</span>
                <div className="flex items-center gap-2">
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => updateValue(key, -step)}
                  >
                    -
                  </Button>
                  <span className={`text-sm font-mono min-w-[80px] text-center ${getColorForValue(cbc[key], normalRanges[key])}`}>
                    {formatNumber(cbc[key], key === 'platelets' ? 0 : 1)} {unit}
                  </span>
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => updateValue(key, step)}
                  >
                    +
                  </Button>
                </div>
              </div>
            ))}
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Differential</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            {[
              { key: 'neutrophils' as const, label: 'Neutrophils', unit: '%', step: 5 },
              { key: 'lymphocytes' as const, label: 'Lymphocytes', unit: '%', step: 5 },
              { key: 'monocytes' as const, label: 'Monocytes', unit: '%', step: 1 },
              { key: 'eosinophils' as const, label: 'Eosinophils', unit: '%', step: 1 },
              { key: 'basophils' as const, label: 'Basophils', unit: '%', step: 0.5 },
              { key: 'reticulocytes' as const, label: 'Reticulocytes', unit: '%', step: 0.5 },
            ].map(({ key, label, unit, step }) => (
              <div key={key} className="flex items-center justify-between gap-2">
                <span className="text-sm font-medium min-w-[120px]">{label}</span>
                <div className="flex items-center gap-2">
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => updateValue(key, -step)}
                  >
                    -
                  </Button>
                  <span className={`text-sm font-mono min-w-[80px] text-center ${getColorForValue(cbc[key]!, normalRanges[key]!)}`}>
                    {formatNumber(cbc[key]!, 1)} {unit}
                  </span>
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => updateValue(key, step)}
                  >
                    +
                  </Button>
                </div>
              </div>
            ))}
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Reference Ranges</CardTitle>
          <CardDescription className="mt-2 text-sm space-y-1">
            <div className="flex gap-4 flex-wrap">
              <span className="text-green-400">● Normal range</span>
              <span className="text-blue-400">● Below normal</span>
              <span className="text-red-400">● Above normal</span>
            </div>
          </CardDescription>
        </CardHeader>
      </Card>
    </div>
  )
}
