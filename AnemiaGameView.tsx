import { useState } from 'react'
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from './Card'
import { Button } from './Button'
import { ArrowLeft, RotateCcw, CheckCircle } from 'lucide-react'
import { useAppStore } from './store'
import type { AnemiaPattern } from './types'

const anemiaPatterns: AnemiaPattern[] = [
  {
    mcv: 'low',
    reticulocytes: 'low',
    causes: ['Iron deficiency anemia', 'Thalassemia trait', 'Anemia of chronic disease (some)', 'Sideroblastic anemia'],
    mechanism: 'Decreased production of small RBCs',
    keyFeatures: ['Microcytic', 'Hypoproliferative', 'Check iron studies, ferritin, TIBC', 'Consider hemoglobin electrophoresis for thalassemia'],
  },
  {
    mcv: 'low',
    reticulocytes: 'high',
    causes: ['Hereditary spherocytosis (rare)', 'Microangiopathic hemolytic anemia with fragmentation'],
    mechanism: 'Destruction of small RBCs with reticulocyte response',
    keyFeatures: ['Microcytic', 'Hemolytic', 'Uncommon pattern', 'Check smear for schistocytes or spherocytes'],
  },
  {
    mcv: 'normal',
    reticulocytes: 'low',
    causes: ['Anemia of chronic disease', 'Early iron deficiency', 'Chronic kidney disease', 'Bone marrow failure', 'Aplastic anemia'],
    mechanism: 'Decreased RBC production without size change',
    keyFeatures: ['Normocytic', 'Hypoproliferative', 'Most common hospitalized patient pattern', 'Evaluate for underlying disease'],
  },
  {
    mcv: 'normal',
    reticulocytes: 'high',
    causes: ['Acute blood loss', 'Hemolytic anemia (autoimmune, G6PD deficiency, PNH)', 'Post-treatment response'],
    mechanism: 'RBC destruction or loss with appropriate marrow response',
    keyFeatures: ['Normocytic', 'Hemolytic or hemorrhagic', 'Check LDH, haptoglobin, bilirubin', 'Smear may show spherocytes, bite cells, or polychromasia'],
  },
  {
    mcv: 'high',
    reticulocytes: 'low',
    causes: ['B12 deficiency', 'Folate deficiency', 'Hypothyroidism', 'Liver disease', 'MDS', 'Medications (methotrexate, AZT)'],
    mechanism: 'Impaired DNA synthesis → megaloblastic maturation',
    keyFeatures: ['Macrocytic', 'Hypoproliferative', 'Check B12, folate, TSH', 'Smear: hypersegmented neutrophils, macro-ovalocytes'],
  },
  {
    mcv: 'high',
    reticulocytes: 'high',
    causes: ['Hemolytic anemia with brisk reticulocytosis', 'Post-hemorrhage recovery', 'Response to B12/folate therapy'],
    mechanism: 'Large reticulocytes elevate MCV',
    keyFeatures: ['Macrocytic due to reticulocytosis', 'Appropriate marrow response', 'Polychromasia on smear', 'MCV normalizes after reticulocyte correction'],
  },
]

interface QuizCase {
  mcv: 'low' | 'normal' | 'high'
  reticulocytes: 'low' | 'normal' | 'high'
  clinicalContext: string
  answer: string
}

const quizCases: QuizCase[] = [
  {
    mcv: 'low',
    reticulocytes: 'low',
    clinicalContext: 'Young woman with heavy menstrual periods, fatigue',
    answer: 'Iron deficiency anemia',
  },
  {
    mcv: 'high',
    reticulocytes: 'low',
    clinicalContext: '65yo with numbness/tingling in feet, ataxia',
    answer: 'B12 deficiency',
  },
  {
    mcv: 'normal',
    reticulocytes: 'high',
    clinicalContext: 'Jaundice, dark urine, splenomegaly',
    answer: 'Hemolytic anemia (autoimmune, G6PD deficiency, PNH)',
  },
  {
    mcv: 'normal',
    reticulocytes: 'low',
    clinicalContext: 'Chronic kidney disease, eGFR 20',
    answer: 'Anemia of chronic disease',
  },
  {
    mcv: 'low',
    reticulocytes: 'low',
    clinicalContext: 'Mediterranean ancestry, mild anemia, normal iron studies',
    answer: 'Thalassemia trait',
  },
]

export function AnemiaGameView() {
  const setCurrentView = useAppStore((state) => state.setCurrentView)
  const [selectedPattern, setSelectedPattern] = useState<AnemiaPattern | null>(null)
  const [quizMode, setQuizMode] = useState(false)
  const [currentQuiz, setCurrentQuiz] = useState(0)
  const [selectedAnswer, setSelectedAnswer] = useState<string | null>(null)

  const getMCVLabel = (mcv: 'low' | 'normal' | 'high') => {
    if (mcv === 'low') return 'Microcytic (MCV < 80 fL)'
    if (mcv === 'high') return 'Macrocytic (MCV > 100 fL)'
    return 'Normocytic (MCV 80-100 fL)'
  }

  const getReticLabel = (retic: 'low' | 'normal' | 'high') => {
    if (retic === 'low') return 'Low Retic (<0.5%)'
    if (retic === 'high') return 'High Retic (>2%)'
    return 'Normal Retic (0.5-2%)'
  }

  const nextQuiz = () => {
    setSelectedAnswer(null)
    setCurrentQuiz((prev) => (prev + 1) % quizCases.length)
  }

  return (
    <div className="space-y-4 p-4 pb-24 md:pb-6 animate-fade-in">
      <div className="flex items-center gap-4">
        <Button variant="ghost" size="sm" onClick={() => setCurrentView('home')}>
          <ArrowLeft size={16} className="mr-2" />
          Back
        </Button>
        <div className="flex-1">
          <h2 className="text-2xl font-bold">Anemia 2×2 Pattern Game</h2>
          <p className="text-sm text-muted-foreground">
            Master anemia classification using MCV and reticulocyte count
          </p>
        </div>
      </div>

      <div className="flex gap-2">
        <Button
          onClick={() => setQuizMode(false)}
          variant={!quizMode ? 'default' : 'outline'}
          size="sm"
        >
          Pattern Explorer
        </Button>
        <Button
          onClick={() => setQuizMode(true)}
          variant={quizMode ? 'default' : 'outline'}
          size="sm"
        >
          Quiz Mode
        </Button>
      </div>

      {!quizMode ? (
        <>
          <Card className="bg-blue-500/10 border-blue-500/20">
            <CardHeader>
              <CardTitle className="text-lg">2×2 Pattern Matrix</CardTitle>
              <CardDescription>
                Click on any cell to see causes and mechanisms
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="overflow-x-auto">
                <table className="w-full border-collapse">
                  <thead>
                    <tr>
                      <th className="border border-border p-2 bg-muted"></th>
                      <th className="border border-border p-2 bg-muted text-sm font-semibold">
                        Low Retic
                      </th>
                      <th className="border border-border p-2 bg-muted text-sm font-semibold">
                        High Retic
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    {['low', 'normal', 'high'].map((mcv) => (
                      <tr key={mcv}>
                        <td className="border border-border p-2 bg-muted text-sm font-semibold">
                          {getMCVLabel(mcv as any).split('(')[0]}
                        </td>
                        {['low', 'high'].map((retic) => {
                          const pattern = anemiaPatterns.find(
                            (p) => p.mcv === mcv && p.reticulocytes === retic
                          )
                          return (
                            <td
                              key={retic}
                              className={`border border-border p-2 cursor-pointer hover:bg-accent transition-colors ${
                                selectedPattern === pattern ? 'bg-primary/20' : ''
                              }`}
                              onClick={() => setSelectedPattern(pattern || null)}
                            >
                              <div className="text-xs text-muted-foreground">
                                {pattern?.causes.slice(0, 2).join(', ')}
                                {pattern && pattern.causes.length > 2 && '...'}
                              </div>
                            </td>
                          )
                        })}
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </CardContent>
          </Card>

          {selectedPattern && (
            <Card className="bg-gradient-to-r from-purple-500/10 to-blue-500/10 border-primary/20">
              <CardHeader>
                <CardTitle className="text-lg">
                  {getMCVLabel(selectedPattern.mcv)} + {getReticLabel(selectedPattern.reticulocytes)}
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
                  <span className="font-semibold text-sm">Key Features:</span>
                  <ul className="list-disc list-inside text-sm text-muted-foreground mt-1 space-y-1">
                    {selectedPattern.keyFeatures.map((feature, idx) => (
                      <li key={idx}>{feature}</li>
                    ))}
                  </ul>
                </div>
              </CardContent>
            </Card>
          )}
        </>
      ) : (
        <>
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle className="text-lg">
                  Quiz Case {currentQuiz + 1} of {quizCases.length}
                </CardTitle>
                <Button size="sm" variant="outline" onClick={nextQuiz}>
                  <RotateCcw size={16} className="mr-2" />
                  Next Case
                </Button>
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <p className="text-sm font-semibold">Clinical Context:</p>
                <p className="text-muted-foreground">
                  {quizCases[currentQuiz].clinicalContext}
                </p>
              </div>
              <div>
                <p className="text-sm font-semibold">Lab Findings:</p>
                <p className="text-muted-foreground">
                  {getMCVLabel(quizCases[currentQuiz].mcv)} •{' '}
                  {getReticLabel(quizCases[currentQuiz].reticulocytes)}
                </p>
              </div>
              <div>
                <p className="text-sm font-semibold mb-2">
                  What is the most likely diagnosis?
                </p>
                <Button
                  variant={selectedAnswer ? 'default' : 'outline'}
                  className="w-full"
                  onClick={() => setSelectedAnswer(quizCases[currentQuiz].answer)}
                >
                  {selectedAnswer ? 'Show Answer' : 'Reveal Answer'}
                </Button>
              </div>
              {selectedAnswer && (
                <Card className="bg-green-500/10 border-green-500/20">
                  <CardContent className="pt-4">
                    <div className="flex items-start gap-2">
                      <CheckCircle className="w-5 h-5 text-green-400 mt-0.5 flex-shrink-0" />
                      <div>
                        <p className="font-semibold text-sm">Answer:</p>
                        <p className="text-sm text-muted-foreground">
                          {selectedAnswer}
                        </p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              )}
            </CardContent>
          </Card>
        </>
      )}
    </div>
  )
}
