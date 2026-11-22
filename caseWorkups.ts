import { ironSource } from './foundationSources'

export interface WorkupDecision {
  prompt: string
  finding?: string
  hint: string
  options: { label: string; feedback: string }[]
  correct: number
  source: { title: string; url: string }
}

interface Workup {
  id: string
  setting: string
  title: string
  presentation: string
  labs: [string, string][]
  smear: string
  diagnosis: string
  synthesis: string
  decisions: WorkupDecision[]
}

const ironManagement = {
  title: 'British Society of Gastroenterology guideline on iron deficiency in adults (2021)',
  url: 'https://pmc.ncbi.nlm.nih.gov/articles/PMC8515119/',
}
export const aplSource = {
  title: 'Brazilian Association of Hematology consensus on APL (2024)',
  url: 'https://pmc.ncbi.nlm.nih.gov/articles/PMC11451342/',
}
export const pvSource = {
  title: 'Tremblay et al., Diagnosis and Treatment of Polycythemia Vera, JAMA (2025)',
  url: 'https://pmc.ncbi.nlm.nih.gov/articles/PMC11921015/',
}

export const caseWorkups: Workup[] = [
  {
    id: 'iron-deficiency',
    setting: 'Primary care',
    title: 'Fatigue and heavy periods',
    presentation: 'A 32-year-old woman reports fatigue, ice cravings, and several months of heavy menstrual bleeding. She is hemodynamically stable and is not pregnant.',
    labs: [['Hemoglobin', '9.5 g/dL'], ['MCV', '72 fL'], ['RDW', '18%'], ['Platelets', '380 × 10⁹/L']],
    smear: 'Small, pale red cells vary in size. Some are pencil-shaped.',
    diagnosis: 'Iron-deficiency anemia',
    synthesis: 'Heavy menstrual bleeding increases iron loss. Microcytosis prompted iron studies. Her ferritin and low transferrin saturation supported iron deficiency in the setting of ongoing blood loss. Assessing the cause of bleeding is part of treatment.',
    decisions: [
      {
        prompt: 'Which initial blood test would best assess her iron stores?',
        hint: 'Choose a marker of stored iron. Red-cell size can also fall in thalassemia.',
        options: [
          { label: 'Hemoglobin electrophoresis', feedback: 'Electrophoresis can help investigate a hemoglobin disorder. It does not measure iron stores, and blood loss makes iron deficiency likely here.' },
          { label: 'Serum ferritin', feedback: 'Ferritin is the initial test for iron stores. Its interpretation depends on symptoms, bleeding risk, and inflammation.' },
          { label: 'Serum iron alone', feedback: 'Serum iron measures circulating iron and fluctuates. A ferritin measurement provides a more useful starting point for assessing stores.' },
        ],
        correct: 1,
        source: ironSource,
      },
      {
        finding: 'Ferritin is 38 ng/mL and transferrin saturation is 9%. C-reactive protein is within the laboratory interval.',
        prompt: 'How should the iron studies change your interpretation?',
        hint: 'Heavy menstrual bleeding affects the threshold used to interpret ferritin.',
        options: [
          { label: 'Iron deficiency is likely', feedback: 'ASH considers a ferritin threshold of 50 ng/mL or lower appropriate in people with heavy menstrual bleeding. Her low transferrin saturation and history support the diagnosis.' },
          { label: 'Ferritin above 15 ng/mL excludes iron deficiency', feedback: 'A 15 ng/mL cutoff misses cases. Use the threshold for the patient’s risk group and interpret it with the clinical findings.' },
          { label: 'The small red cells establish thalassemia trait', feedback: 'Iron deficiency also causes microcytosis. The bleeding history and iron studies favor deficiency. Persistent microcytosis after repletion merits reassessment.' },
        ],
        correct: 0,
        source: ironSource,
      },
      {
        finding: 'She can take oral iron. Her clinician arranges assessment of the bleeding and starts iron replacement.',
        prompt: 'How should the initial response to oral iron be assessed?',
        hint: 'An early blood count can identify ongoing loss, poor absorption, or difficulty taking iron.',
        options: [
          { label: 'Use the change in MCV after two days', feedback: 'Circulating red cells reflect several months of production. An early hemoglobin trend is more informative than a two-day change in MCV.' },
          { label: 'Wait until the next annual blood count', feedback: 'A long interval can miss continued bleeding or failure to absorb or tolerate treatment.' },
          { label: 'Check hemoglobin within the first four weeks', feedback: 'The BSG recommends checking the hemoglobin response within four weeks. If it fails to rise, revisit adherence, bleeding, absorption, and the working diagnosis.' },
        ],
        correct: 2,
        source: ironManagement,
      },
    ],
  },
  {
    id: 'apl',
    setting: 'Emergency department',
    title: 'New bruising and gum bleeding',
    presentation: 'A 45-year-old man presents with spontaneous bruising and gingival bleeding. The laboratory telephones with an urgent blood-film result.',
    labs: [['White cells', '3.2 × 10⁹/L'], ['Hemoglobin', '7.8 g/dL'], ['Platelets', '22 × 10⁹/L'], ['PT', '18 s (local interval 11–14)'], ['Fibrinogen', '95 mg/dL (local interval 200–400)'], ['D-dimer', '8,500 ng/mL FEU (local cutoff 500)']],
    smear: 'Abnormal, heavily granulated promyelocytes are present. Several contain bundles of Auer rods.',
    diagnosis: 'Acute promyelocytic leukemia with PML::RARA',
    synthesis: 'Abnormal promyelocytes with a bleeding coagulopathy triggered emergency treatment for suspected APL. Flow supported the suspicion. Detection of PML::RARA confirmed the subtype.',
    decisions: [
      {
        prompt: 'What should the emergency team do while genetic results are pending?',
        hint: 'Fatal hemorrhage can occur early. The smear and coagulation findings are enough to act.',
        options: [
          { label: 'Wait for the final karyotype before starting leukemia care', feedback: 'Waiting risks fatal bleeding. Suspected acute promyelocytic leukemia requires an immediate response while confirmation is underway.' },
          { label: 'Treat as isolated immune thrombocytopenia', feedback: 'Immune thrombocytopenia does not explain the abnormal promyelocytes, prolonged PT, and low fibrinogen together.' },
          { label: 'Call hematology, start all-trans retinoic acid (ATRA), and support coagulation', feedback: 'Suspected APL is a medical emergency. Begin ATRA and blood-product support with hematology while sending urgent genetic testing. Monitor coagulation closely.' },
        ],
        correct: 2,
        source: aplSource,
      },
      {
        finding: 'Flow cytometry identifies abnormal myeloid cells with strong myeloperoxidase and CD33 expression. CD34 and HLA-DR are absent.',
        prompt: 'Which urgent test most directly confirms the suspected subtype?',
        hint: 'Several acute myeloid leukemias share this flow pattern. Look for the defining fusion.',
        options: [
          { label: 'Rapid PML::RARA testing by RT-PCR or FISH', feedback: 'Testing for the PML::RARA fusion can confirm classic APL. Morphology and flow raise suspicion but can overlap with other myeloid leukemias.' },
          { label: 'Repeat CD34 and HLA-DR alone', feedback: 'Absent CD34 and HLA-DR can occur in other acute myeloid leukemias, including some with an NPM1 mutation.' },
          { label: 'JAK2 V617F testing', feedback: 'JAK2 V617F is associated with several myeloproliferative neoplasms. It does not confirm classic APL.' },
        ],
        correct: 0,
        source: aplSource,
      },
      {
        finding: 'RT-PCR detects the PML::RARA fusion. The pretreatment white-cell count was 3.2 × 10⁹/L.',
        prompt: 'How should the confirmed fusion and presenting count guide definitive therapy?',
        hint: 'The presenting white-cell count helps select an APL induction regimen.',
        options: [
          { label: 'Stop supporting coagulation after the first ATRA dose', feedback: 'Bleeding risk persists during early induction. Continue close monitoring and blood-product support as indicated.' },
          { label: 'Use a non-high-risk APL regimen with ATRA and arsenic trioxide', feedback: 'PML::RARA confirms classic APL. With a presenting white-cell count at or below 10 × 10⁹/L, ATRA plus arsenic trioxide is a standard induction regimen. Continue hematology-led monitoring and supportive care.' },
          { label: 'Choose therapy based on absent CD34 alone', feedback: 'CD34 is a marker of immaturity. The defining fusion and presenting white-cell count guide APL-specific therapy.' },
        ],
        correct: 1,
        source: aplSource,
      },
    ],
  },
  {
    id: 'polycythemia-vera',
    setting: 'Hematology clinic',
    title: 'Persistent high hematocrit',
    presentation: 'A 58-year-old man reports itching after hot showers. His hematocrit remains elevated on repeat testing while well hydrated.',
    labs: [['Hemoglobin', '19.2 g/dL'], ['Hematocrit', '58%'], ['White cells', '12.5 × 10⁹/L'], ['Platelets', '520 × 10⁹/L']],
    smear: 'The film shows increased platelets and predominantly mature white cells.',
    diagnosis: 'Polycythemia vera',
    synthesis: 'Persistent erythrocytosis, JAK2 V617F, and marrow panmyelosis support polycythemia vera. A low erythropoietin level adds support. Hematocrit control reduces the risk of major thrombosis and cardiovascular death.',
    decisions: [
      {
        prompt: 'Which workup best distinguishes clonal from secondary erythrocytosis?',
        hint: 'Consider the signal driving red-cell production and whether there is a clonal marker.',
        options: [
          { label: 'Use the itching after hot showers as the diagnostic test', feedback: 'Aquagenic pruritus is a clue. Establish why the hematocrit remains elevated using laboratory findings and clinical history.' },
          { label: 'Assess secondary causes and obtain serum erythropoietin and JAK2 testing', feedback: 'Review hypoxia, smoking, and drugs such as testosterone. Serum erythropoietin and JAK2 testing help assess the possibility of a myeloproliferative neoplasm.' },
          { label: 'Classify the raised platelet count as essential thrombocythemia', feedback: 'Polycythemia vera can also raise the platelet count. The sustained erythrocytosis needs its own explanation.' },
        ],
        correct: 1,
        source: pvSource,
      },
      {
        finding: 'Erythropoietin is below the laboratory interval. JAK2 V617F is detected. Marrow is hypercellular for age with expansion of erythroid, granulocytic, and megakaryocytic lineages (panmyelosis).',
        prompt: 'Which diagnosis best fits all of the findings?',
        hint: 'Integrate erythrocytosis and the three expanded marrow lineages with the molecular result.',
        options: [
          { label: 'Relative erythrocytosis from dehydration', feedback: 'Volume contraction can elevate hematocrit transiently. It does not account for persistent erythrocytosis with panmyelosis and a JAK2 variant.' },
          { label: 'Essential thrombocythemia', feedback: 'JAK2 V617F also occurs in essential thrombocythemia, but prominent erythrocytosis with trilineage marrow expansion favors polycythemia vera.' },
          { label: 'Polycythemia vera', feedback: 'The high hemoglobin and hematocrit, marrow panmyelosis, and JAK2 mutation fit polycythemia vera. A low erythropoietin level is supportive. JAK2 alone cannot assign the subtype.' },
        ],
        correct: 2,
        source: pvSource,
      },
      {
        finding: 'Polycythemia vera is confirmed. The team plans hematocrit control to lower thrombotic risk.',
        prompt: 'Which hematocrit target has randomized trial evidence in adults with polycythemia vera?',
        hint: 'CYTO-PV compared a target below 45% with a target of 45–50%.',
        options: [
          { label: 'Below 45%', feedback: 'In CYTO-PV, cardiovascular death or major thrombosis occurred in 5 of 182 adults assigned to a hematocrit below 45%, compared with 18 of 183 assigned to 45–50%, over a median of 31 months.' },
          { label: '45–50%', feedback: 'This was the higher-target arm in CYTO-PV. More patients experienced cardiovascular death or major thrombosis in this arm.' },
          { label: 'Within the local laboratory reference interval', feedback: 'A diagnostic reference interval describes a population. CYTO-PV tested treatment targets against clinical outcomes.' },
        ],
        correct: 0,
        source: { title: 'Marchioli et al., CYTO-PV randomized trial, NEJM (2013)', url: 'https://pubmed.ncbi.nlm.nih.gov/23216616/' },
      },
    ],
  },
]
