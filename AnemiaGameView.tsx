import { useState } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from './Card'
import { Button } from './Button'
import { LabHeader, LabPractice, LabSources, type LabCase } from './LabPractice'
import { anemiaSource, evaluationSource, hemolysisSource, ironSource } from './foundationSources'

const patterns = [
  {
    size: 'Microcytic', interval: '<80 fL',
    responses: [
      { label: 'Iron or globin supply', explanation: 'Small red cells with limited production suggest impaired hemoglobin synthesis. Check ferritin and interpret it with the inflammatory history. If iron studies do not explain persistent microcytosis, consider a hemoglobin disorder.', sources: [ironSource, anemiaSource] },
      { label: 'Recovery or a mixed process', explanation: 'A person with established microcytosis can develop a reticulocyte rise after iron replacement, bleeding or hemolysis. Review treatment timing and compare with earlier counts.', sources: [evaluationSource] },
    ],
  },
  {
    size: 'Normocytic', interval: '80–100 fL',
    responses: [
      { label: 'Limited marrow output', explanation: 'Kidney disease, inflammation, marrow disorders and early iron deficiency can all present with average-sized cells. Check kidney function, iron studies, the smear and the other cell lines.', sources: [anemiaSource, evaluationSource] },
      { label: 'Blood loss or hemolysis', explanation: 'Look for a bleeding history. Increased indirect bilirubin and LDH with reduced haptoglobin support hemolysis. The reticulocyte response to an acute bleed can take several days.', sources: [hemolysisSource, evaluationSource] },
    ],
  },
  {
    size: 'Macrocytic', interval: '>100 fL',
    responses: [
      { label: 'Vitamin deficiency or other causes', explanation: 'Macro-ovalocytes and hypersegmented neutrophils suggest impaired DNA synthesis. Investigate vitamin B12 and folate deficiency. Alcohol use, liver disease, medications, thyroid disease and marrow disorders can also cause macrocytosis.', sources: [anemiaSource] },
      { label: 'Large young red cells', explanation: 'Reticulocytes are larger than mature red cells. A brisk response to blood loss, hemolysis or successful treatment can raise the MCV. Compare serial counts and look for the cause of the response.', sources: [evaluationSource, anemiaSource] },
    ],
  },
]

const anemiaCases: LabCase[] = [
  {
    title: 'Fatigue and heavy menstrual bleeding', history: 'A 34-year-old has several months of fatigue and heavy periods. There is no known inflammatory illness.',
    report: [['Hemoglobin', '9.4 g/dL'], ['MCV', '71 fL'], ['Absolute reticulocytes', '24 × 10⁹/L']],
    question: 'Which test best evaluates the leading explanation?', correct: 1, options: [
      { label: 'Check a direct antiglobulin test', feedback: 'This test evaluates immune red cell destruction. Chronic blood loss with microcytosis and limited marrow output points first to iron supply.' },
      { label: 'Check ferritin', feedback: 'A low ferritin supports depleted iron stores. Heavy menstrual bleeding gives a plausible source of iron loss. Inflammation can raise ferritin and changes how the result is interpreted.' },
      { label: 'Check serum vitamin B12 first', feedback: 'B12 deficiency usually produces macrocytosis when it causes anemia. The marked microcytosis and bleeding history favor iron deficiency.' },
    ], hint: 'What does chronic blood loss remove that the marrow needs to make hemoglobin?', sources: [ironSource, anemiaSource],
  },
  {
    title: 'Unsteady gait and anemia', history: 'A 66-year-old has progressive numbness of both feet and trouble walking in the dark.',
    report: [['Hemoglobin', '8.6 g/dL'], ['MCV', '117 fL'], ['Absolute reticulocytes', '18 × 10⁹/L'], ['Smear', 'Macro-ovalocytes and hypersegmented neutrophils']],
    question: 'Which diagnosis best links the neurologic and blood findings?', correct: 0, options: [
      { label: 'Vitamin B12 deficiency', feedback: 'Macro-ovalocytes, hypersegmentation and a low reticulocyte count support megaloblastic anemia. The sensory and gait symptoms favor B12 deficiency. Measure B12 and assess for its cause.' },
      { label: 'Isolated folate deficiency', feedback: 'Folate deficiency can produce the same smear. The neurologic presentation favors vitamin B12 deficiency.' },
      { label: 'Reticulocytosis after bleeding', feedback: 'A brisk reticulocyte response can raise MCV. This patient has few circulating reticulocytes.' },
    ], hint: 'Two vitamin deficiencies can produce this smear. Which also impairs neurologic function?', sources: [{title:'ARUP Consult · Megaloblastic anemia',url:'https://arupconsult.com/content/megaloblastic-anemia'}],
  },
  {
    title: 'Falling hemoglobin with jaundice', history: 'An adult with new scleral icterus has no reported bleeding.',
    report: [['Hemoglobin and MCV', '8.9 g/dL and 99 fL'], ['Absolute reticulocytes', '245 × 10⁹/L'], ['LDH and indirect bilirubin', 'Both increased'], ['Haptoglobin', 'Below the reporting limit']],
    question: 'What is the next diagnostic direction?', correct: 2, options: [
      { label: 'Attribute the anemia to inflammation', feedback: 'Inflammatory anemia often has limited marrow output. It does not explain this combination of reticulocytosis and biochemical red cell breakdown.' },
      { label: 'Diagnose autoimmune hemolysis', feedback: 'The findings support hemolysis. Establishing an immune cause requires additional testing, including a direct antiglobulin test in context.' },
      { label: 'Investigate hemolysis', feedback: 'Reticulocytosis, increased LDH and indirect bilirubin, and low haptoglobin support red cell destruction. Examine the smear and use a direct antiglobulin test to help distinguish immune from other causes.' },
    ], hint: 'Separate evidence for red cell destruction from evidence for its specific cause.', sources: [hemolysisSource],
  },
  {
    title: 'Normocytic anemia in kidney disease', history: 'A person with advanced chronic kidney disease has gradually developed anemia. Iron stores and transferrin saturation are adequate, and there is no evidence of hemolysis or bleeding.',
    report: [['Hemoglobin', '9.0 g/dL'], ['MCV', '89 fL'], ['Absolute reticulocytes', '34 × 10⁹/L'], ['Estimated GFR', '19 mL/min/1.73 m²']],
    question: 'Which mechanism best fits the available data?', correct: 0, options: [
      { label: 'Reduced erythropoietin response in kidney disease', feedback: 'The low-normal absolute reticulocyte count is inadequate for this degree of anemia. Advanced kidney disease can limit the erythropoietin response. Iron restriction and other causes may coexist.' },
      { label: 'Brisk marrow recovery', feedback: 'A count near the lower adult reference limit is a weak response to a hemoglobin of 9.0 g/dL.' },
      { label: 'Active intravascular hemolysis', feedback: 'The case lacks biochemical evidence for hemolysis, and the reticulocyte response is small.' },
    ], hint: 'Interpret the reticulocyte count against the degree of anemia.', sources: [evaluationSource, anemiaSource],
  },
  {
    title: 'A repeat count after iron replacement', history: 'An adult with documented iron deficiency started iron replacement eight days ago. The hemoglobin has begun to rise. LDH and bilirubin are within the laboratory intervals.',
    report: [['MCV', '73 fL'], ['Absolute reticulocytes before treatment', '22 × 10⁹/L'], ['Absolute reticulocytes today', '166 × 10⁹/L']],
    question: 'What best explains the new reticulocytosis?', correct: 1, options: [
      { label: 'New folate deficiency', feedback: 'Untreated folate deficiency tends to limit effective red cell production and usually causes macrocytosis.' },
      { label: 'Renewed red cell production', feedback: 'Reticulocytes can rise after iron becomes available. Older microcytes remain in circulation, so the mean cell volume can stay low during early recovery.' },
      { label: 'Microangiopathic hemolysis', feedback: 'A rising reticulocyte count alone cannot establish red cell fragmentation. Treatment timing, rising hemoglobin and the biochemical findings favor recovery.' },
    ], hint: 'Compare the timing of the change with the treatment history.', sources: [evaluationSource, anemiaSource],
  },
]

export function AnemiaGameView() {
  const [practice, setPractice] = useState(false)
  const [row, setRow] = useState(0)
  const [column, setColumn] = useState(0)
  const selected = patterns[row].responses[column]
  return <div className="space-y-5">
    <LabHeader title="Anemia patterns">Pair mean cell volume with the marrow response. Use the history and a targeted test to distinguish causes that share a pattern.</LabHeader>
    <div role="group" aria-label="Anemia learning mode" className="flex flex-wrap gap-2">
      <Button size="sm" aria-pressed={!practice} variant={practice ? 'outline' : 'default'} onClick={() => setPractice(false)}>Pattern map</Button>
      <Button size="sm" aria-pressed={practice} variant={practice ? 'default' : 'outline'} onClick={() => setPractice(true)}>Work anemia cases</Button>
    </div>
    <section hidden={practice}>
      <Card><CardHeader><CardTitle className="text-xl">Cell size and marrow response</CardTitle></CardHeader>
        <CardContent className="space-y-4">
          <p className="text-sm">Use the absolute reticulocyte count or correct the percentage for anemia. A count inside the laboratory interval can still be inadequate for the degree of anemia.</p>
          <div className="overflow-x-auto"><table className="w-full table-fixed border-collapse text-left text-sm">
            <thead><tr className="bg-muted"><th scope="col" className="w-1/4 p-2">Adult MCV</th><th scope="col" className="p-2">Limited response</th><th scope="col" className="p-2">Brisk response</th></tr></thead>
            <tbody>{patterns.map((pattern, i) => <tr key={pattern.size}>
              <th scope="row" className="border-b p-2 font-medium">{pattern.size}<span className="block text-xs text-muted-foreground">{pattern.interval}</span></th>
              {pattern.responses.map((response, j) => <td key={response.label} className="border-b p-1">
                <button type="button" className={'w-full rounded-md border p-2 text-left text-sm ' + (row === i && column === j ? 'border-primary bg-accent font-semibold' : 'hover:bg-muted')} aria-pressed={row === i && column === j} onClick={() => {setRow(i); setColumn(j)}}>{response.label}</button>
              </td>)}
            </tr>)}</tbody>
          </table></div>
          <div aria-live="polite" className="space-y-2 rounded-lg bg-muted p-4"><h2 className="font-semibold">{patterns[row].size} anemia with a {column === 0 ? 'limited' : 'brisk'} response</h2><p className="text-sm">{selected.explanation}</p><LabSources items={selected.sources} /></div>
          <LabSources items={[anemiaSource, evaluationSource]} />
        </CardContent>
      </Card>
    </section>
    <section hidden={!practice} aria-label="Anemia practice"><LabPractice module="anemia-game" cases={anemiaCases} /></section>
  </div>
}
