import { useState } from 'react'
import { Button } from './Button'
import { Card, CardContent } from './Card'
import { LabHeader, LabPractice, LabSources, ReferenceHeading, type LabCase } from './LabPractice'

const pt = { title: 'ARUP Consult · Prolonged clotting times', url: 'https://arupconsult.com/content/prolonged-clotting-time-evaluation' }
const vwd = { title: 'ARUP Consult · von Willebrand disease', url: 'https://arupconsult.com/content/von-willebrand-disease' }
const aha = { title: 'International acquired hemophilia A recommendations · Diagnosis', url: 'https://haematologica.org/article/view/9931' }
const inhibitor = { title: 'BSH and UKHCDO · Acquired coagulation factor inhibitors', url: 'https://doi.org/10.1111/bjh.70200' }
const dic = { title: 'ARUP Consult · Disseminated intravascular coagulation', url: 'https://arupconsult.com/content/disseminated-intravascular-coagulation' }
const ist = { title: 'ISTH 2025 · DIC definition and diagnostic criteria', url: 'https://pubmed.ncbi.nlm.nih.gov/40216223/' }
const liver = { title: 'ISTH · DIC and cirrhotic coagulopathy', url: 'https://pubmed.ncbi.nlm.nih.gov/39662873/' }

const cases: LabCase[] = [
  {
    title: 'Bleeding despite normal screening times',
    history: 'A young adult has lifelong recurrent nosebleeds, heavy menstrual bleeding and prolonged bleeding after dental extraction. A parent has similar symptoms.',
    report: [['PT (reference 11–14 s)', '12 s'], ['aPTT (reference 25–35 s)', '30 s'], ['Platelets (reference 150–450 × 10⁹/L)', '245 × 10⁹/L']],
    question: 'Which initial panel best evaluates suspected von Willebrand disease?',
    options: [
      { label: 'PT and aPTT on a second sample only', feedback: 'Both screening times can be normal in von Willebrand disease. Repeating them alone leaves the suspected defect untested.' },
      { label: 'VWF antigen, platelet-dependent VWF activity and factor VIII activity', feedback: 'Antigen measures how much von Willebrand factor (VWF) is present. The activity assay assesses its platelet-binding function. VWF also stabilizes factor VIII.' },
      { label: 'D-dimer and fibrinogen only', feedback: 'These tests help assess fibrin formation and consumption. They do not measure VWF quantity or function.' },
    ], correct: 1, hint: 'Which tests assess the amount and function of the protein that supports platelet adhesion?', sources: [vwd],
  },
  {
    title: 'A mixing result changes after incubation',
    history: 'An older adult with no prior bleeding develops extensive spontaneous soft-tissue hematomas. The sample was collected peripherally. Medication and laboratory review find no anticoagulant interference.',
    report: [['PT (reference 11–14 s)', '12 s'], ['aPTT (reference 25–35 s)', '72 s'], ['1:1 mix, immediate', 'Corrects by the local laboratory criterion'], ['1:1 mix, after 2 h at 37 °C', 'Fails to correct relative to the incubated control']],
    question: 'Which next investigation addresses the urgent diagnostic concern?',
    options: [
      { label: 'Stop the investigation after the immediate mix', feedback: 'The later loss of correction matters. Factor VIII autoantibodies may take time to inhibit the factor in normal plasma.' },
      { label: 'Diagnose lupus anticoagulant from the mix alone', feedback: 'A mixing result cannot identify the inhibitor. New soft-tissue bleeding warrants evaluation for acquired hemophilia A.' },
      { label: 'Urgent factor VIII activity and factor VIII inhibitor testing', feedback: 'The clinical presentation and incubation effect suggest acquired hemophilia A. Request factor VIII activity and an appropriate inhibitor assay, such as a Nijmegen-modified Bethesda assay, with urgent specialist input.' },
    ], correct: 2, hint: 'Consider an acquired inhibitor whose effect increases during incubation.', sources: [inhibitor, aha],
  },
  {
    title: 'Serial results during septic shock',
    history: 'Over 24 hours in septic shock, a patient develops oozing at venipuncture sites. Results from the same laboratory are shown in time order.',
    report: [['Platelets (reference 150–450 × 10⁹/L)', '178 → 65 × 10⁹/L'], ['PT (reference 11–14 s)', '13 → 19 s'], ['Fibrinogen (reference 2–4 g/L)', '4.8 → 2.4 g/L'], ['D-dimer (reference <0.5 mg/L FEU)', '0.8 → 9.1 mg/L FEU']],
    question: 'Which interpretation best fits the change?',
    options: [
      { label: 'Evaluate for evolving disseminated intravascular coagulation (DIC)', feedback: 'Sepsis, falling platelets, a longer PT and rising D-dimer support consumption. Fibrinogen can remain in range as an acute-phase reactant. Use serial results and clinical criteria.' },
      { label: 'Exclude DIC because fibrinogen remains within range', feedback: 'The concentration has halved during an inflammatory illness. A single normal-range value can mask ongoing consumption.' },
      { label: 'Diagnose DIC from the high D-dimer alone', feedback: 'D-dimer can rise in several conditions, including cirrhosis. Interpret the change alongside platelet count, PT and clinical context.' },
    ], correct: 0, hint: 'Compare the two time points before deciding how much weight to give the last fibrinogen value.', sources: [ist, dic, liver],
  },
  {
    title: 'An isolated prolonged PT',
    history: 'A patient with lifelong bleeding has a reproducible isolated PT prolongation. Collection is satisfactory. Medication review, liver evaluation and vitamin K assessment are unrevealing.',
    report: [['PT (reference 11–14 s)', '21 s'], ['aPTT (reference 25–35 s)', '30 s'], ['Immediate PT mix', 'Corrects by local laboratory criteria']],
    question: 'Which factor activity is the most direct next test?',
    options: [
      { label: 'Factor VIII', feedback: 'Factor VIII affects the intrinsic pathway. An isolated prolonged aPTT would be more typical of a substantial deficiency.' },
      { label: 'Factor VII', feedback: 'Factor VII deficiency can prolong PT with a normal aPTT. Correction favors a deficiency and a factor activity assay tests it directly.' },
      { label: 'Factor XIII', feedback: 'A factor XIII deficiency can cause bleeding despite normal PT and aPTT. It would not explain the isolated PT abnormality.' },
    ], correct: 1, hint: 'Which factor is tested by PT but lies upstream of the common pathway?', sources: [pt],
  },
]

const patterns = [
  { times: 'PT normal · aPTT normal', meaning: 'Bleeding can arise from a platelet disorder, von Willebrand disease, mild factor deficiency or factor XIII deficiency.', next: 'Use the bleeding history and platelet count. For mucosal bleeding with suspected von Willebrand disease, assess VWF antigen, VWF activity and factor VIII activity.', sources: [pt, vwd] },
  { times: 'PT normal · aPTT prolonged', meaning: 'Possible causes include factor VIII, IX or XI deficiency, a factor inhibitor, lupus anticoagulant, or heparin. Factor XII deficiency can markedly prolong aPTT without a bleeding tendency.', next: 'Verify the specimen and drug history. With recent spontaneous bleeding, check for a factor VIII inhibitor. A mixing study can suggest a mechanism, but factor and inhibitor assays identify the cause.', sources: [pt, inhibitor] },
  { times: 'PT prolonged · aPTT normal', meaning: 'An isolated PT can reflect factor VII deficiency or an inhibitor. Vitamin K deficiency, warfarin and liver disease may initially give this pattern.', next: 'Review medications, nutrition, liver function and specimen quality. If an unexplained isolated prolongation persists, consider a mixing study and factor VII activity.', sources: [pt] },
  { times: 'PT prolonged · aPTT prolonged', meaning: 'Common-pathway factor abnormalities, multiple factor deficiencies, anticoagulants, liver disease and DIC can prolong both tests.', next: 'Compare serial PT, platelets, fibrinogen and D-dimer with the clinical course. Cirrhosis and DIC can overlap. An elevated D-dimer alone cannot separate them.', sources: [pt, dic, liver] },
]

export function CoagulationView() {
  const [prolongedPT, setProlongedPT] = useState(false)
  const [prolongedAPTT, setProlongedAPTT] = useState(false)
  const pattern = patterns[Number(prolongedPT) * 2 + Number(prolongedAPTT)]
  return (
    <div className="mx-auto max-w-4xl space-y-5 p-4 pb-12 sm:p-6">
      <LabHeader title="Coagulation patterns">Use prothrombin time (PT), activated partial thromboplastin time (aPTT) and the bleeding history to choose the next test.</LabHeader>
      <LabPractice module="coagulation" cases={cases} />
      <Card>
        <ReferenceHeading title="Explore a PT and aPTT pattern">Set each result relative to its laboratory reference interval.</ReferenceHeading>
        <CardContent className="space-y-4">
          <div className="grid gap-4 sm:grid-cols-2">
            <fieldset><legend className="mb-2 text-sm font-semibold">PT</legend><div className="flex gap-2">{[false, true].map((value) => <Button key={String(value)} size="sm" variant={value === prolongedPT ? 'default' : 'outline'} aria-pressed={value === prolongedPT} onClick={() => setProlongedPT(value)}>{value ? 'Prolonged' : 'Normal'}</Button>)}</div></fieldset>
            <fieldset><legend className="mb-2 text-sm font-semibold">aPTT</legend><div className="flex gap-2">{[false, true].map((value) => <Button key={String(value)} size="sm" variant={value === prolongedAPTT ? 'default' : 'outline'} aria-pressed={value === prolongedAPTT} onClick={() => setProlongedAPTT(value)}>{value ? 'Prolonged' : 'Normal'}</Button>)}</div></fieldset>
          </div>
          <div aria-live="polite" className="space-y-2 rounded-lg border bg-muted/40 p-4"><h3 className="font-semibold">{pattern.times}</h3><p className="text-sm">{pattern.meaning}</p><p className="text-sm"><strong>Next test.</strong> {pattern.next}</p><LabSources items={pattern.sources} /></div>
        </CardContent>
      </Card>
    </div>
  )
}
