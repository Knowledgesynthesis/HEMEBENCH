import { useState } from 'react'
import { Button } from './Button'
import { Card, CardContent, CardHeader, CardTitle } from './Card'
import { LabHeader, LabPractice, LabSources, type LabCase } from './LabPractice'
import { anemiaSource, cbcSource, evaluationSource } from './foundationSources'

const reticSource = { title: 'Mayo Clinic Laboratories · Reticulocyte profile', url: 'https://www.mayocliniclabs.com/test-catalog/overview/616856/reticulocyte-profile-blood' }

const baseline = { hb: 14, mcv: 90, rdw: 13, platelets: 250, retic: 1.4, neut: 4, lymph: 2, mono: 0.50, eos: 0.20, baso: 0.05 }
type Sample = typeof baseline
type Profile = 'female' | 'male'
type Interval = [number, number]

const presets: {name: string; settings: Partial<Sample>}[] = [
  { name: 'Baseline', settings: {} },
  { name: 'Microcytic anemia', settings: { hb: 9, mcv: 71, rdw: 18, retic: 0.5, platelets: 450 } },
  { name: 'Low neutrophil count', settings: { neut: 0.7, lymph: 2.3, mono: 0.55, eos: 0.15, baso: 0.04 } },
  { name: 'High neutrophil count', settings: { neut: 12, lymph: 2.5, mono: 0.75 } },
]

const profiles: Record<Profile, { hb: Interval; rbc: Interval; hct: Interval; rdw: Interval; platelets: Interval }> = {
  male: { hb: [13.2, 16.6], rbc: [4.35, 5.65], hct: [38.3, 48.6], rdw: [11.8, 14.5], platelets: [135, 317] },
  female: { hb: [11.6, 15], rbc: [3.92, 5.13], hct: [35.5, 44.9], rdw: [12.2, 16.1], platelets: [157, 371] },
}

const differential: {key: keyof Pick<Sample, 'neut' | 'lymph' | 'mono' | 'eos' | 'baso'>; name: string; range: Interval; max: number}[] = [
  { key: 'neut', name: 'Neutrophils', range: [1.56, 6.45], max: 20 },
  { key: 'lymph', name: 'Lymphocytes', range: [0.95, 3.07], max: 12 },
  { key: 'mono', name: 'Monocytes', range: [0.26, 0.81], max: 3 },
  { key: 'eos', name: 'Eosinophils', range: [0.03, 0.48], max: 3 },
  { key: 'baso', name: 'Basophils', range: [0.01, 0.08], max: 1 },
]

const controls: {key: keyof Sample; label: string; unit: string; min: number; max: number; step: number}[] = [
  { key: 'hb', label: 'Hemoglobin', unit: 'g/dL', min: 4, max: 20, step: 0.1 },
  { key: 'mcv', label: 'MCV', unit: 'fL', min: 55, max: 130, step: 1 },
  { key: 'rdw', label: 'RDW', unit: '%', min: 9, max: 27, step: 0.1 },
  { key: 'platelets', label: 'Platelets', unit: '× 10⁹/L', min: 0, max: 900, step: 1 },
  { key: 'retic', label: 'Reticulocytes', unit: '% of red cells', min: 0, max: 12, step: 0.1 },
]

const checks: LabCase[] = [
  {
    title: 'A normal total white count', history: 'An adult has a total WBC inside the reporting laboratory interval. Neutrophils make up 20% of the differential.',
    report: [['Total WBC', '4.0 × 10⁹/L'], ['Lymphocytes', '60%'], ['Lab neutrophil interval', '1.56–6.45 × 10⁹/L'], ['Lab lymphocyte interval', '0.95–3.07 × 10⁹/L']],
    question: 'Which absolute-count abnormality is present?', correct: 1, options: [
      { label: 'Absolute lymphocytosis', feedback: 'The absolute lymphocyte count is 4.0 × 0.60 = 2.4 × 10⁹/L, within the stated interval.' },
      { label: 'Absolute neutropenia', feedback: 'The absolute neutrophil count is 4.0 × 0.20 = 0.80 × 10⁹/L. A total WBC within range can conceal a low count in one lineage.' },
      { label: 'All lineages within range', feedback: 'The total WBC combines several lineages. Calculate each relevant absolute count before interpreting it.' },
    ], hint: 'Multiply the total WBC by the fraction for each cell type.', sources: [cbcSource],
  },
  {
    title: 'An MCV of 90 fL', history: 'A patient with anemia has an MCV inside the laboratory interval and a high red cell distribution width.',
    report: [['Hemoglobin', '9.8 g/dL'], ['MCV', '90 fL'], ['RDW', '20%']],
    question: 'What can you infer from this report?', correct: 0, options: [
      {label:'A broad spread of red cell sizes',feedback:'RDW measures size variation. A normal mean can conceal populations of small and large cells. Examine the smear and review relevant iron and vitamin studies.'},
      {label:'A uniform population of normal-sized cells',feedback:'The MCV describes a mean. The high RDW indicates that individual cell sizes vary.'},
      {label:'Confirmed combined iron and B12 deficiency',feedback:'Combined deficiencies can yield this pattern. The indices alone cannot establish their cause.'},
    ], hint: 'Which measurement describes dispersion rather than the mean?', sources:[cbcSource,evaluationSource],
  },
  {
    title: 'An unexpected platelet result', history: 'A routine sample from an adult without bleeding gives a much lower platelet count than previous samples. The analyzer flags platelet clumps.',
    report: [['Platelets today', '58 × 10⁹/L'], ['Platelets last week', '240 × 10⁹/L']],
    question:'Which step helps establish whether the low count is real?',correct:2,options:[
      {label:'Diagnose immune thrombocytopenia',feedback:'An isolated low automated count cannot establish immune thrombocytopenia. The clump flag raises the possibility of an artifact.'},
      {label:'Accept the count because it is numeric',feedback:'Platelet clumps can escape counting as individual platelets. Review the specimen before assigning a cause.'},
      {label:'Check the smear for platelet clumps',feedback:'Look for aggregates and follow the laboratory procedure for confirming the platelet count, including recollection when indicated. True thrombocytopenia may coexist.'},
    ], hint:'What effect would an aggregate have on a count of individual platelets?',sources:[evaluationSource],
  },
]

interface Result {
  label: string
  value: number
  unit: string
  interval: Interval
}

const round = (value: number, dp: number) => Number(value.toFixed(dp))
const flag = ({value, interval}: Result) => value < interval[0] ? 'Low' : value > interval[1] ? 'High' : 'In range'

export function CBCPatternsView() {
  const [sample, setSample] = useState<Sample>(baseline)
  const [profile, setProfile] = useState<Profile>('female')
  const [practice, setPractice] = useState(false)
  const refs = profiles[profile]
  const wbc = round(differential.reduce((sum, d) => sum + sample[d.key], 0), 2)
  // Hold MCHC at 33.3 g/dL so editing Hb or MCV keeps the red cell indices consistent.
  const hct = sample.hb * 100 / 33.3
  const rbc = hct * 10 / sample.mcv
  const absoluteRetic = round(sample.retic * rbc * 10, 1)
  const size = sample.mcv < 80 ? 'Microcytic' : sample.mcv > 100 ? 'Macrocytic' : 'Normocytic'
  const results: Result[] = [
    {label:'Hemoglobin', value:sample.hb, unit:'g/dL', interval:refs.hb},
    {label:'Hematocrit', value:round(hct,1), unit:'%', interval:refs.hct},
    {label:'RBC', value:round(rbc,2), unit:'× 10¹²/L', interval:refs.rbc},
    {label:'MCV', value:sample.mcv, unit:'fL', interval:[78.2,97.9]},
    {label:'RDW', value:sample.rdw, unit:'%', interval:refs.rdw},
    {label:'Platelets', value:sample.platelets, unit:'× 10⁹/L', interval:refs.platelets},
    {label:'Reticulocytes', value:sample.retic, unit:'%', interval:[0.60,2.71]},
    {label:'Absolute reticulocytes', value:absoluteRetic, unit:'× 10⁹/L', interval:[30.4,110.9]},
    {label:'Total WBC', value:wbc, unit:'× 10⁹/L', interval:[3.4,9.6]},
    ...differential.map(d => ({label:d.name, value:sample[d.key], unit:'× 10⁹/L', interval:d.range})),
  ]
  const flagged = results.filter(result => flag(result) !== 'In range')
  const setValue = (key: keyof Sample, value: number) => setSample(prev => ({...prev, [key]:value}))
  return <div className="space-y-5">
    <LabHeader title="CBC patterns">Change a count and follow its effect on the rest of the report. Compare absolute counts with their laboratory intervals.</LabHeader>
    <div className="flex flex-wrap gap-2" role="group" aria-label="CBC learning mode">
      <Button size="sm" variant={practice ? 'outline' : 'default'} aria-pressed={!practice} onClick={() => setPractice(false)}>Explore counts</Button>
      <Button size="sm" variant={practice ? 'default' : 'outline'} aria-pressed={practice} onClick={() => setPractice(true)}>Interpret reports</Button>
    </div>
    <section hidden={practice} className="space-y-4">
      <Card><CardHeader><CardTitle className="text-xl">Build a specimen</CardTitle></CardHeader>
        <CardContent className="space-y-5">
          <div className="flex flex-wrap items-center gap-2" role="group" aria-label="Specimen presets">
            {presets.map(p => <Button key={p.name} size="sm" variant="outline" onClick={() => setSample({...baseline, ...p.settings})}>{p.name}</Button>)}
          </div>
          <div className="flex flex-wrap items-center gap-3"><label htmlFor="cbc-profile" className="text-sm font-semibold">Adult reference profile</label>
            <select id="cbc-profile" className="rounded-md border bg-background px-3 py-2 text-sm" value={profile} onChange={e => setProfile(e.target.value === 'male' ? 'male' : 'female')}><option value="female">Female</option><option value="male">Male</option></select>
          </div>
          <div className="grid gap-x-8 gap-y-4 sm:grid-cols-2">{controls.map(control => <div key={control.key}>
            <div className="flex justify-between gap-2"><label htmlFor={'cbc-'+control.key} className="text-sm font-medium">{control.label}</label><span className="text-sm tabular-nums">{sample[control.key]} {control.unit}</span></div>
            <input id={'cbc-'+control.key} type="range" className="w-full accent-primary" aria-valuetext={sample[control.key]+' '+control.unit} min={control.min} max={control.max} step={control.step} value={sample[control.key]} onChange={e => setValue(control.key, e.target.valueAsNumber)}/>
          </div>)}</div>
          <details><summary className="cursor-pointer text-sm font-semibold text-primary">Edit absolute white cell counts</summary>
            <p className="my-3 text-sm text-muted-foreground">Each slider gives an absolute count in × 10⁹/L. The total WBC is their sum. Each percentage uses that total.</p>
            <div className="grid gap-x-8 gap-y-4 sm:grid-cols-2">{differential.map(d => <div key={d.key}>
              <div className="flex justify-between gap-2"><label htmlFor={'cbc-'+d.key} className="text-sm font-medium">{d.name}</label><span className="text-sm tabular-nums">{sample[d.key].toFixed(2)} · {wbc > 0 ? (100 * sample[d.key] / wbc).toFixed(1)+'%' : 'no WBCs'}</span></div>
              <input id={'cbc-'+d.key} type="range" className="w-full accent-primary" aria-valuetext={sample[d.key]+' × 10⁹/L'} min={0} max={d.max} step="0.01" value={sample[d.key]} onChange={e => setValue(d.key, e.target.valueAsNumber)}/>
            </div>)}</div>
          </details>
        </CardContent>
      </Card>
      <Card><CardHeader><CardTitle className="text-xl">Specimen interpretation</CardTitle></CardHeader>
        <CardContent className="space-y-3">
          <div role="status" className="space-y-2">
            <p className="font-semibold">{sample.hb < refs.hb[0] ? size+' anemia. ' : ''}{flagged.length ? flagged.length+' measurements outside the selected intervals.' : 'All displayed measurements fall within the selected intervals.'}</p>
            {flagged.length > 0 && <p className="text-sm">{flagged.map(r => flag(r)+' '+r.label.toLowerCase()).join(' · ')}</p>}
            {sample.hb < refs.hb[0] && <p className="text-sm">{absoluteRetic > 110.9 ? 'The absolute reticulocyte count is elevated. Consider blood loss, hemolysis or recovery after treatment.' : 'The absolute reticulocyte count has not risen above the adult interval. Assess whether production is adequate for the degree and timing of anemia.'}</p>}
            {sample.rdw > refs.rdw[1] && <p className="text-sm">High RDW indicates variation in red cell size. The MCV can conceal mixed populations.</p>}
          </div>
          <div className="overflow-x-auto"><table className="w-full text-left text-sm">
            <thead className="bg-muted"><tr>{['Measurement','Result','Interval','Flag'].map(label => <th key={label} scope="col" className="p-2">{label}</th>)}</tr></thead>
            <tbody>{results.map(r => <tr key={r.label} className="border-b"><th scope="row" className="p-2 font-medium">{r.label}</th><td className="p-2 tabular-nums">{r.value} <span className="whitespace-nowrap text-xs">{r.unit}</span></td><td className="p-2">{r.interval.join('–')}</td><td className={'p-2 '+(flag(r)==='In range'?'text-muted-foreground':'font-semibold')}>{flag(r)}</td></tr>)}</tbody>
          </table></div>
          <p className="text-sm text-muted-foreground">This simulated nonpregnant adult specimen holds MCHC at 33.3 g/dL to link hemoglobin, hematocrit and RBC count. The adult MCV teaching categories use 80 and 100 fL. The laboratory flags use Mayo’s assay intervals, which can differ between laboratories.</p>
          <LabSources items={[cbcSource, reticSource, anemiaSource]} />
        </CardContent>
      </Card>
    </section>
    <section hidden={!practice} aria-label="CBC practice"><LabPractice module="cbc-patterns" cases={checks}/></section>
  </div>
}
