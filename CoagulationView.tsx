import { useState } from 'react'
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from './Card'
import { Button } from './Button'
import { ArrowLeft } from 'lucide-react'
import { useAppStore } from './store'

interface CoagPattern {
  pt: 'Normal' | 'Prolonged'
  ptt: 'Normal' | 'Prolonged'
  causes: string[]
  mechanism: string
  clinicalContext: string
}

const coagPatterns: CoagPattern[] = [
  {
    pt: 'Normal',
    ptt: 'Normal',
    causes: ['Normal coagulation', 'vWF disease (sometimes)', 'Factor XIII deficiency', 'Platelet disorders', 'Mild factor deficiencies'],
    mechanism: 'Normal extrinsic and intrinsic pathways',
    clinicalContext: 'If bleeding: consider platelet dysfunction, vWD, factor XIII, or vascular causes',
  },
  {
    pt: 'Prolonged',
    ptt: 'Normal',
    causes: ['Factor VII deficiency', 'Early warfarin', 'Early vitamin K deficiency', 'Mild liver disease'],
    mechanism: 'Extrinsic pathway (VII) affected',
    clinicalContext: 'PT most sensitive to warfarin and vitamin K deficiency',
  },
  {
    pt: 'Normal',
    ptt: 'Prolonged',
    causes: ['Hemophilia A (VIII deficiency)', 'Hemophilia B (IX deficiency)', 'Factor XI deficiency', 'Heparin', 'Lupus anticoagulant', 'vWF disease'],
    mechanism: 'Intrinsic pathway (VIII, IX, XI, XII) affected',
    clinicalContext: 'Distinguish bleeding (hemophilia) from thrombosis (lupus anticoagulant) by mixing study',
  },
  {
    pt: 'Prolonged',
    ptt: 'Prolonged',
    causes: ['DIC', 'Severe liver disease', 'Warfarin overdose', 'Vitamin K deficiency', 'Factor II, V, or X deficiency', 'Direct thrombin inhibitors'],
    mechanism: 'Common pathway or multiple factors affected',
    clinicalContext: 'DIC: ↓fibrinogen, ↑D-dimer, ↓platelets, schistocytes. Liver disease: ↓synthesis of factors.',
  },
]

export function CoagulationView() {
  const setCurrentView = useAppStore((state) => state.setCurrentView)
  const [selectedPattern, setSelectedPattern] = useState<CoagPattern | null>(null)

  return (
    <div className="space-y-4 p-4 pb-24 md:pb-6 animate-fade-in">
      <div className="flex items-center gap-4">
        <Button variant="ghost" size="sm" onClick={() => setCurrentView('home')}>
          <ArrowLeft size={16} className="mr-2" />
          Back
        </Button>
        <div>
          <h2 className="text-2xl font-bold">Coagulation Patterns</h2>
          <p className="text-sm text-muted-foreground">
            Master PT/PTT interpretation
          </p>
        </div>
      </div>

      <Card className="bg-blue-500/10 border-blue-500/20">
        <CardHeader>
          <CardTitle className="text-lg">PT/PTT Pattern Matrix</CardTitle>
          <CardDescription className="mt-2">
            Click on any pattern to see causes and mechanisms
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <table className="w-full border-collapse">
              <thead>
                <tr>
                  <th className="border border-border p-3 bg-muted"></th>
                  <th className="border border-border p-3 bg-muted font-semibold">
                    PTT Normal
                  </th>
                  <th className="border border-border p-3 bg-muted font-semibold">
                    PTT Prolonged
                  </th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td className="border border-border p-3 bg-muted font-semibold">
                    PT Normal
                  </td>
                  <td
                    className={`border border-border p-4 cursor-pointer hover:bg-accent transition-colors ${
                      selectedPattern?.pt === 'Normal' &&
                      selectedPattern?.ptt === 'Normal'
                        ? 'bg-primary/20'
                        : ''
                    }`}
                    onClick={() =>
                      setSelectedPattern(
                        coagPatterns.find(
                          (p) => p.pt === 'Normal' && p.ptt === 'Normal'
                        )!
                      )
                    }
                  >
                    <p className="text-sm font-medium">Normal Coagulation</p>
                    <p className="text-xs text-muted-foreground mt-1">
                      Platelet/vWD/Factor XIII
                    </p>
                  </td>
                  <td
                    className={`border border-border p-4 cursor-pointer hover:bg-accent transition-colors ${
                      selectedPattern?.pt === 'Normal' &&
                      selectedPattern?.ptt === 'Prolonged'
                        ? 'bg-primary/20'
                        : ''
                    }`}
                    onClick={() =>
                      setSelectedPattern(
                        coagPatterns.find(
                          (p) => p.pt === 'Normal' && p.ptt === 'Prolonged'
                        )!
                      )
                    }
                  >
                    <p className="text-sm font-medium">Intrinsic Pathway</p>
                    <p className="text-xs text-muted-foreground mt-1">
                      Hemophilia, Heparin, Lupus AC
                    </p>
                  </td>
                </tr>
                <tr>
                  <td className="border border-border p-3 bg-muted font-semibold">
                    PT Prolonged
                  </td>
                  <td
                    className={`border border-border p-4 cursor-pointer hover:bg-accent transition-colors ${
                      selectedPattern?.pt === 'Prolonged' &&
                      selectedPattern?.ptt === 'Normal'
                        ? 'bg-primary/20'
                        : ''
                    }`}
                    onClick={() =>
                      setSelectedPattern(
                        coagPatterns.find(
                          (p) => p.pt === 'Prolonged' && p.ptt === 'Normal'
                        )!
                      )
                    }
                  >
                    <p className="text-sm font-medium">Extrinsic Pathway</p>
                    <p className="text-xs text-muted-foreground mt-1">
                      Factor VII, Early warfarin
                    </p>
                  </td>
                  <td
                    className={`border border-border p-4 cursor-pointer hover:bg-accent transition-colors ${
                      selectedPattern?.pt === 'Prolonged' &&
                      selectedPattern?.ptt === 'Prolonged'
                        ? 'bg-primary/20'
                        : ''
                    }`}
                    onClick={() =>
                      setSelectedPattern(
                        coagPatterns.find(
                          (p) => p.pt === 'Prolonged' && p.ptt === 'Prolonged'
                        )!
                      )
                    }
                  >
                    <p className="text-sm font-medium">Common/Multiple</p>
                    <p className="text-xs text-muted-foreground mt-1">
                      DIC, Liver disease, Warfarin
                    </p>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>

      {selectedPattern && (
        <Card className="bg-gradient-to-r from-purple-500/10 to-blue-500/10 border-primary/20">
          <CardHeader>
            <CardTitle className="text-lg">
              PT {selectedPattern.pt} • PTT {selectedPattern.ptt}
            </CardTitle>
            <CardDescription className="mt-2">
              <strong>Mechanism:</strong> {selectedPattern.mechanism}
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-3">
            <div>
              <span className="font-semibold text-sm">Common Causes:</span>
              <ul className="list-disc list-inside text-sm text-muted-foreground mt-1 space-y-1">
                {selectedPattern.causes.map((cause, idx) => (
                  <li key={idx}>{cause}</li>
                ))}
              </ul>
            </div>
            <div>
              <span className="font-semibold text-sm">Clinical Context:</span>
              <p className="text-sm text-muted-foreground">
                {selectedPattern.clinicalContext}
              </p>
            </div>
          </CardContent>
        </Card>
      )}

      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Coagulation Cascade Review</CardTitle>
          <CardDescription className="mt-2 space-y-2 text-sm">
            <p>
              <strong>PT (Extrinsic):</strong> Factor VII → Tissue factor pathway
            </p>
            <p>
              <strong>PTT (Intrinsic):</strong> Factors XII, XI, IX, VIII → Contact activation
            </p>
            <p>
              <strong>Common Pathway:</strong> Factors X, V, II (prothrombin), I (fibrinogen)
            </p>
            <p>
              <strong>Mixing Study:</strong> Corrects = factor deficiency. Does not correct = inhibitor (lupus anticoagulant, factor VIII inhibitor)
            </p>
          </CardDescription>
        </CardHeader>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="text-lg">DIC vs Liver Disease</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b">
                  <th className="text-left p-2">Test</th>
                  <th className="text-left p-2">DIC</th>
                  <th className="text-left p-2">Liver Disease</th>
                </tr>
              </thead>
              <tbody className="text-muted-foreground">
                <tr className="border-b">
                  <td className="p-2">PT/PTT</td>
                  <td className="p-2">Both ↑</td>
                  <td className="p-2">Both ↑</td>
                </tr>
                <tr className="border-b">
                  <td className="p-2">Fibrinogen</td>
                  <td className="p-2">↓↓</td>
                  <td className="p-2">Normal or ↓</td>
                </tr>
                <tr className="border-b">
                  <td className="p-2">D-dimer</td>
                  <td className="p-2">↑↑</td>
                  <td className="p-2">Normal</td>
                </tr>
                <tr className="border-b">
                  <td className="p-2">Platelets</td>
                  <td className="p-2">↓↓</td>
                  <td className="p-2">Normal or ↓</td>
                </tr>
                <tr>
                  <td className="p-2">Smear</td>
                  <td className="p-2">Schistocytes</td>
                  <td className="p-2">Target cells</td>
                </tr>
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
