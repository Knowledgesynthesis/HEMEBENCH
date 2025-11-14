import { useState } from 'react'
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from './Card'
import { Button } from './Button'
import { ArrowLeft, ChevronRight, CheckCircle } from 'lucide-react'
import { useAppStore } from './store'
import type { DiagnosticCase } from './types'

const sampleCases: DiagnosticCase[] = [
  {
    id: 'case1',
    title: 'Iron Deficiency Anemia',
    clinicalContext: 'Outpatient clinic',
    age: 32,
    sex: 'F',
    presentation: '32yo woman with fatigue, heavy menstrual periods. Craves ice.',
    cbc: {
      wbc: 7.2,
      rbc: 3.8,
      hgb: 9.5,
      hct: 30,
      mcv: 72,
      mch: 24,
      mchc: 31,
      rdw: 18,
      platelets: 420,
      neutrophils: 65,
      lymphocytes: 28,
      monocytes: 5,
      eosinophils: 2,
      basophils: 0,
      reticulocytes: 0.8,
    },
    smear: {
      rbcMorphology: ['Microcytosis', 'Hypochromia', 'Anisopoikilocytosis', 'Occasional pencil cells'],
      wbcMorphology: ['Normal'],
      plateletMorphology: ['Mild thrombocytosis'],
      overallImpression: 'Microcytic hypochromic anemia',
      keyFindings: ['Microcytosis', 'Elevated RDW', 'Thrombocytosis'],
    },
    diagnosis: 'Iron deficiency anemia',
    mechanism: 'Chronic blood loss (menorrhagia) → iron depletion → impaired hemoglobin synthesis → microcytic anemia',
    keyFeatures: [
      'Microcytic hypochromic anemia (MCV <80, low MCHC)',
      'Elevated RDW (anisocytosis)',
      'Thrombocytosis (reactive)',
      'Low reticulocyte count (hypoproliferative)',
    ],
    differentialDx: [
      'Thalassemia trait (RBC count usually normal/high, RDW normal)',
      'Anemia of chronic disease (ferritin elevated, TIBC normal/low)',
      'Sideroblastic anemia (ring sideroblasts on marrow)',
    ],
    managementPoints: [
      'Check iron studies: ↓ferritin, ↓serum iron, ↑TIBC, ↓saturation',
      'Investigate source of bleeding (GI evaluation if not explained by menses)',
      'Oral iron supplementation',
      'Recheck CBC in 2-3 months',
    ],
    educationalLevel: 'MS3',
  },
  {
    id: 'case2',
    title: 'Acute Promyelocytic Leukemia (APL)',
    clinicalContext: 'Emergency department',
    age: 45,
    sex: 'M',
    presentation: '45yo man with gingival bleeding, bruising, fatigue. DIC labs abnormal.',
    cbc: {
      wbc: 3.2,
      rbc: 2.5,
      hgb: 7.8,
      hct: 24,
      mcv: 88,
      mch: 30,
      mchc: 33,
      rdw: 14,
      platelets: 22,
      neutrophils: 15,
      lymphocytes: 20,
      monocytes: 5,
      eosinophils: 1,
      basophils: 0,
      reticulocytes: 1.2,
    },
    smear: {
      rbcMorphology: ['Normocytic'],
      wbcMorphology: ['Abnormal promyelocytes with heavy granulation', 'Auer rods (bundles)', 'Bilobed nuclei'],
      plateletMorphology: ['Severe thrombocytopenia'],
      overallImpression: 'Abnormal promyelocytes consistent with APL',
      keyFindings: ['Auer rods', 'Heavy granulation', 'DIC', 'Pancytopenia'],
    },
    coagulation: {
      pt: 18,
      ptt: 45,
      inr: 1.8,
      fibrinogen: 95,
      dDimer: 8500,
      plateletCount: 22,
    },
    flow: {
      markers: [
        { name: 'CD34', cd: 'CD34', positive: false },
        { name: 'CD33', cd: 'CD33', positive: true, intensity: 'bright' },
        { name: 'MPO', cd: 'MPO', positive: true, intensity: 'bright' },
        { name: 'CD117', cd: 'CD117', positive: false },
      ],
      lineage: 'myeloid',
      maturation: 'Promyelocytic',
    },
    molecular: [
      {
        gene: 'PML-RARA',
        mutation: 't(15;17)',
        classification: 'driver',
        significance: 'Diagnostic for APL. Responsive to ATRA.',
      },
    ],
    diagnosis: 'Acute Promyelocytic Leukemia (APL, AML-M3)',
    mechanism: 't(15;17) PML-RARA → maturation block at promyelocyte stage → release of procoagulant granules → DIC',
    keyFeatures: [
      'Abnormal promyelocytes with Auer rods',
      'DIC (↓fibrinogen, ↑D-dimer, ↓platelets)',
      't(15;17) PML-RARA',
      'CD34 negative (unlike most AML)',
    ],
    differentialDx: [
      'AML M2 (Auer rods but mature myeloblasts)',
      'AML M4/M5 (monocytic features)',
    ],
    managementPoints: [
      'MEDICAL EMERGENCY - high risk of fatal bleeding',
      'Start ATRA immediately (even before confirmation)',
      'Add arsenic trioxide (ATO)',
      'Support with platelets, cryoprecipitate',
      'Monitor for differentiation syndrome',
    ],
    educationalLevel: 'Fellow',
  },
  {
    id: 'case3',
    title: 'Polycythemia Vera',
    clinicalContext: 'Hematology clinic',
    age: 58,
    sex: 'M',
    presentation: '58yo man with headaches, pruritus after hot showers, plethora. Incidental elevated Hgb.',
    cbc: {
      wbc: 12.5,
      rbc: 6.8,
      hgb: 19.2,
      hct: 58,
      mcv: 86,
      mch: 28,
      mchc: 33,
      rdw: 13,
      platelets: 520,
      neutrophils: 70,
      lymphocytes: 22,
      monocytes: 6,
      eosinophils: 2,
      basophils: 0,
    },
    smear: {
      rbcMorphology: ['Polychromasia'],
      wbcMorphology: ['Mild leukocytosis', 'Left shift'],
      plateletMorphology: ['Thrombocytosis'],
      overallImpression: 'Erythrocytosis with thrombocytosis',
      keyFindings: ['Elevated RBC mass', 'Thrombocytosis', 'Leukocytosis'],
    },
    molecular: [
      {
        gene: 'JAK2',
        mutation: 'V617F',
        vaf: 52,
        classification: 'driver',
        significance: 'Diagnostic for myeloproliferative neoplasm. Found in >95% of PV.',
      },
    ],
    diagnosis: 'Polycythemia Vera',
    mechanism: 'JAK2 V617F mutation → constitutive JAK-STAT activation → erythropoietin-independent erythropoiesis',
    keyFeatures: [
      'Elevated Hgb/Hct (Hgb >16.5 in men, >16 in women)',
      'JAK2 V617F mutation (>95%)',
      'Trilineage proliferation (RBC, WBC, platelets)',
      'Pruritus (histamine from basophils)',
    ],
    differentialDx: [
      'Secondary erythrocytosis (↑EPO, normal spleen, no JAK2)',
      'Essential thrombocythemia (platelets predominate)',
      'Relative polycythemia (dehydration)',
    ],
    managementPoints: [
      'Phlebotomy to keep Hct <45% (men) or <42% (women)',
      'Low-dose aspirin (if no contraindication)',
      'Hydroxyurea for high-risk patients',
      'Ruxolitinib if refractory',
      'Monitor for thrombosis and transformation to MF/AML',
    ],
    educationalLevel: 'Resident',
  },
]

export function CaseEngineView() {
  const setCurrentView = useAppStore((state) => state.setCurrentView)
  const [selectedCase, setSelectedCase] = useState<DiagnosticCase | null>(null)
  const [revealedSections, setRevealedSections] = useState<Set<string>>(new Set())

  const revealSection = (section: string) => {
    setRevealedSections((prev) => new Set(prev).add(section))
  }

  const resetCase = () => {
    setRevealedSections(new Set())
  }

  return (
    <div className="space-y-4 p-4 pb-24 md:pb-6 animate-fade-in">
      <div className="flex items-center gap-4">
        <Button variant="ghost" size="sm" onClick={() => setCurrentView('home')}>
          <ArrowLeft size={16} className="mr-2" />
          Back
        </Button>
        <div>
          <h2 className="text-2xl font-bold">Integrated Case Engine</h2>
          <p className="text-sm text-muted-foreground">
            Full diagnostic workups
          </p>
        </div>
      </div>

      {!selectedCase ? (
        <div className="grid gap-4">
          {sampleCases.map((caseItem) => (
            <Card
              key={caseItem.id}
              className="cursor-pointer hover:shadow-lg transition-shadow"
              onClick={() => setSelectedCase(caseItem)}
            >
              <CardHeader>
                <div className="flex items-start justify-between">
                  <div>
                    <CardTitle className="text-lg">{caseItem.title}</CardTitle>
                    <CardDescription className="mt-1">
                      {caseItem.presentation}
                    </CardDescription>
                  </div>
                  <div className="flex flex-col items-end gap-1">
                    <span className="text-xs px-2 py-1 bg-accent rounded">
                      {caseItem.educationalLevel}
                    </span>
                    <ChevronRight size={20} className="text-muted-foreground" />
                  </div>
                </div>
              </CardHeader>
            </Card>
          ))}
        </div>
      ) : (
        <div className="space-y-4">
          <div className="flex gap-2">
            <Button
              size="sm"
              variant="outline"
              onClick={() => {
                setSelectedCase(null)
                resetCase()
              }}
            >
              ← Back to Cases
            </Button>
            <Button size="sm" variant="outline" onClick={resetCase}>
              Reset Case
            </Button>
          </div>

          <Card>
            <CardHeader>
              <CardTitle>{selectedCase.title}</CardTitle>
              <CardDescription>
                {selectedCase.age}yo {selectedCase.sex === 'M' ? 'Male' : 'Female'} • {selectedCase.clinicalContext}
              </CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-sm">{selectedCase.presentation}</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="text-lg">CBC Results</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 md:grid-cols-3 gap-2 text-sm">
                <div>WBC: {selectedCase.cbc.wbc}</div>
                <div>RBC: {selectedCase.cbc.rbc}</div>
                <div>Hgb: {selectedCase.cbc.hgb}</div>
                <div>Hct: {selectedCase.cbc.hct}</div>
                <div>MCV: {selectedCase.cbc.mcv}</div>
                <div>RDW: {selectedCase.cbc.rdw}</div>
                <div>Platelets: {selectedCase.cbc.platelets}</div>
                <div>Retic: {selectedCase.cbc.reticulocytes}</div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Smear Findings</CardTitle>
            </CardHeader>
            <CardContent className="space-y-2 text-sm">
              <div>
                <strong>RBC:</strong> {selectedCase.smear.rbcMorphology.join(', ')}
              </div>
              <div>
                <strong>WBC:</strong> {selectedCase.smear.wbcMorphology.join(', ')}
              </div>
              <div>
                <strong>Platelets:</strong> {selectedCase.smear.plateletMorphology.join(', ')}
              </div>
            </CardContent>
          </Card>

          {selectedCase.coagulation && (
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Coagulation Panel</CardTitle>
              </CardHeader>
              <CardContent className="grid grid-cols-2 gap-2 text-sm">
                <div>PT: {selectedCase.coagulation.pt}s</div>
                <div>PTT: {selectedCase.coagulation.ptt}s</div>
                <div>Fibrinogen: {selectedCase.coagulation.fibrinogen}</div>
                <div>D-dimer: {selectedCase.coagulation.dDimer}</div>
              </CardContent>
            </Card>
          )}

          {selectedCase.molecular && (
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Molecular Testing</CardTitle>
              </CardHeader>
              <CardContent className="space-y-2 text-sm">
                {selectedCase.molecular.map((m) => (
                  <div key={m.gene}>
                    <strong>{m.gene}:</strong> {m.mutation} - {m.significance}
                  </div>
                ))}
              </CardContent>
            </Card>
          )}

          {!revealedSections.has('diagnosis') ? (
            <Button
              onClick={() => revealSection('diagnosis')}
              className="w-full"
            >
              Reveal Diagnosis
            </Button>
          ) : (
            <Card className="bg-gradient-to-r from-green-500/10 to-blue-500/10 border-primary/20">
              <CardHeader>
                <div className="flex items-center gap-2">
                  <CheckCircle className="w-6 h-6 text-green-400" />
                  <CardTitle className="text-lg">Diagnosis</CardTitle>
                </div>
              </CardHeader>
              <CardContent className="space-y-3">
                <div>
                  <strong className="text-base">{selectedCase.diagnosis}</strong>
                </div>
                <div>
                  <strong className="text-sm">Mechanism:</strong>
                  <p className="text-sm text-muted-foreground">{selectedCase.mechanism}</p>
                </div>
                <div>
                  <strong className="text-sm">Key Features:</strong>
                  <ul className="list-disc list-inside text-sm text-muted-foreground space-y-1">
                    {selectedCase.keyFeatures.map((f, i) => (
                      <li key={i}>{f}</li>
                    ))}
                  </ul>
                </div>
                <div>
                  <strong className="text-sm">Differential:</strong>
                  <ul className="list-disc list-inside text-sm text-muted-foreground space-y-1">
                    {selectedCase.differentialDx.map((d, i) => (
                      <li key={i}>{d}</li>
                    ))}
                  </ul>
                </div>
                <div>
                  <strong className="text-sm">Management:</strong>
                  <ul className="list-disc list-inside text-sm text-muted-foreground space-y-1">
                    {selectedCase.managementPoints.map((m, i) => (
                      <li key={i}>{m}</li>
                    ))}
                  </ul>
                </div>
              </CardContent>
            </Card>
          )}
        </div>
      )}
    </div>
  )
}
