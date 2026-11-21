import { aplSource, pvSource } from './caseWorkups'
import { evaluationSource, ironSource } from './foundationSources'

export const glossaryCategories = ['Morphology', 'Laboratory', 'Molecular', 'Clinical'] as const
type Category = (typeof glossaryCategories)[number]

interface Entry {
  term: string
  aliases?: string[]
  keywords?: string[]
  category: Category
  definition: string
  source: { title: string; url: string }
}

const flowSource = {
  title: 'Acute Myeloid Leukemia · Diagnosis and Evaluation by Flow Cytometry (2024)',
  url: 'https://pmc.ncbi.nlm.nih.gov/articles/PMC11592599/',
}
const dicSource = {
  title: 'ARUP Consult · Disseminated intravascular coagulation',
  url: 'https://arupconsult.com/content/disseminated-intravascular-coagulation',
}

export const glossaryEntries: Entry[] = [
  {
    term: 'Acute promyelocytic leukemia', aliases: ['APL'], category: 'Clinical',
    definition: 'An acute myeloid leukemia marked by abnormal promyelocytes and a risk of early fatal bleeding. Suspected APL requires urgent hematology involvement, all-trans retinoic acid, coagulation support, and rapid genetic confirmation.',
    source: aplSource,
  },
  {
    term: 'Anisocytosis', category: 'Morphology',
    definition: 'Variation in red-cell size on a blood film. An elevated red-cell distribution width (RDW) is a laboratory clue. Both very small and very large cells can be present even when their mean size is normal.',
    source: evaluationSource,
  },
  {
    term: 'Auer rod', category: 'Morphology',
    definition: 'A needle-shaped cytoplasmic inclusion formed from fused primary granules in a myeloid cell. Bundles in abnormal promyelocytes raise concern for acute promyelocytic leukemia.',
    source: { title: 'ASH Image Bank · Auer rod in a blast', url: 'https://imagebank.hematology.org/image/61328/aml--auer-rod' },
  },
  {
    term: 'BCR::ABL1', aliases: ['BCR-ABL1'], keywords: ['Philadelphia chromosome', 'CML', 'ALL'], category: 'Molecular',
    definition: 'A fusion gene usually formed by a translocation between chromosomes 9 and 22. The altered chromosome 22 is the Philadelphia chromosome. The fusion occurs in chronic myeloid leukemia and some acute leukemias.',
    source: { title: 'NCI Dictionary of Cancer Terms · BCR::ABL1 fusion gene', url: 'https://www.cancer.gov/publications/dictionaries/cancer-terms/def/bcrabl1-fusion-gene' },
  },
  {
    term: 'CD34', category: 'Laboratory',
    definition: 'A surface protein on many immature hematopoietic cells, including normal progenitors. Some acute leukemias lack CD34. Interpret it with the rest of the flow panel.',
    source: flowSource,
  },
  {
    term: 'D-dimer', keywords: ['Fibrin degradation product'], category: 'Laboratory',
    definition: 'A product of cross-linked fibrin breakdown. An elevation supports increased clot formation and breakdown but has many causes. In suspected DIC, interpret it with the platelet count, PT, fibrinogen, and clinical course.',
    source: dicSource,
  },
  {
    term: 'Disseminated intravascular coagulation', aliases: ['DIC', 'Consumptive coagulopathy'], category: 'Clinical',
    definition: 'Systemic coagulation activation complicating conditions such as sepsis, major trauma, or APL. Platelets may fall, PT may lengthen, and D-dimer may rise. Fibrinogen can remain normal early. Repeat testing helps establish the trend.',
    source: dicSource,
  },
  {
    term: 'Ferritin', aliases: ['Serum ferritin'], category: 'Laboratory',
    definition: 'An iron-storage protein measured to assess iron stores. Inflammation can raise ferritin and mask deficiency. Interpret the concentration in the context of bleeding, symptoms, and inflammatory conditions.',
    source: ironSource,
  },
  {
    term: 'FLT3-ITD', aliases: ['FLT3 internal tandem duplication'], category: 'Molecular',
    definition: 'An internal tandem duplication in the FLT3 gene found in some acute myeloid leukemias. It can guide targeted therapy. Assign risk using the full genetic profile and the classification appropriate to the treatment regimen.',
    source: { title: 'European LeukemiaNet · AML recommendations for adults (2022)', url: 'https://doi.org/10.1182/blood.2022016867' },
  },
  {
    term: 'Hematocrit', aliases: ['Hct', 'Packed cell volume'], category: 'Laboratory',
    definition: 'The fraction of whole-blood volume occupied by red cells, commonly reported as a percentage. Both red-cell volume and plasma volume influence the value.',
    source: evaluationSource,
  },
  {
    term: 'Hypersegmented neutrophil', category: 'Morphology',
    definition: 'A neutrophil with six or more nuclear lobes. It is a clue to megaloblastic anemia due to vitamin B12 or folate deficiency and can occur in other disorders.',
    source: { title: 'ASH Image Bank · Hypersegmented neutrophil', url: 'https://imagebank.hematology.org/image/60400/hypersegmented-neutrophil?type=atlas' },
  },
  {
    term: 'JAK2 V617F', category: 'Molecular',
    definition: 'An acquired activating variant found in most people with polycythemia vera and in some with essential thrombocythemia or primary myelofibrosis. Blood counts, clinical findings, and marrow morphology help distinguish these disorders.',
    source: pvSource,
  },
  {
    term: 'Mean corpuscular volume', aliases: ['MCV'], category: 'Laboratory',
    definition: 'The average volume of a red cell, reported in femtoliters. In adults, values below 80 fL are generally called microcytic and values above 100 fL macrocytic. A mean can conceal a mixture of large and small cells.',
    source: evaluationSource,
  },
  {
    term: 'Myeloperoxidase', aliases: ['MPO'], category: 'Laboratory',
    definition: 'An enzyme in myeloid-cell granules. Convincing expression in the abnormal blast population supports myeloid differentiation. Some acute myeloid leukemias lack detectable MPO.',
    source: flowSource,
  },
  {
    term: 'Panmyelosis', aliases: ['Trilineage proliferation'], category: 'Morphology',
    definition: 'Expansion of the red-cell, granulocytic, and megakaryocytic lineages in marrow. In a patient with persistent erythrocytosis and an appropriate JAK2 mutation, this pattern supports polycythemia vera.',
    source: pvSource,
  },
  {
    term: 'PML::RARA', aliases: ['PML-RARA'], keywords: ['t(15;17)'], category: 'Molecular',
    definition: 'The defining fusion in classic acute promyelocytic leukemia. Rapid genetic testing confirms the suspected subtype. The characteristic bleeding risk calls for treatment as soon as APL is suspected.',
    source: aplSource,
  },
  {
    term: 'Poikilocytosis', category: 'Morphology',
    definition: 'Variation in red-cell shape on a blood film. Naming the shapes present, such as target cells or fragments, helps narrow the differential diagnosis.',
    source: evaluationSource,
  },
  {
    term: 'Red-cell distribution width', aliases: ['RDW'], keywords: ['RDW-CV', 'RDW-SD'], category: 'Laboratory',
    definition: 'A measure of variation in red-cell size. An elevated RDW supports anisocytosis. Interpret against the reporting laboratory’s interval alongside the MCV and blood film.',
    source: evaluationSource,
  },
  {
    term: 'Reticulocyte count', aliases: ['Retic count', 'Absolute reticulocyte count'], category: 'Laboratory',
    definition: 'A measure of young circulating red cells, reported as a percentage or an absolute count. During anemia, the absolute count or a corrected measure helps assess whether marrow production is adequate for the degree of anemia.',
    source: evaluationSource,
  },
  {
    term: 'Schistocyte', aliases: ['Red-cell fragment', 'Helmet cell'], category: 'Morphology',
    definition: 'A red-cell fragment formed by mechanical injury. More than 1% schistocytes on an adult blood film raises concern for thrombotic microangiopathy. Interpret with the rest of the film, platelet count, and evidence of hemolysis.',
    source: { title: 'ICSH · Recommendations for identifying and counting schistocytes (2021)', url: 'https://www.icsh.org/2021-update-of-the-2012-icsh-recommendations-for-schistocytes' },
  },
  {
    term: 'Spherocyte', category: 'Morphology',
    definition: 'A round, dense red cell with little or no central pallor. Spherocytes occur in hereditary spherocytosis and warm autoimmune hemolytic anemia. A direct antiglobulin test helps assess an immune cause.',
    source: { title: 'MSD Manual Professional · Autoimmune hemolytic anemia', url: 'https://www.msdmanuals.com/professional/hematology/anemias-caused-by-hemolysis/autoimmune-hemolytic-anemia' },
  },
  {
    term: 'Target cell', aliases: ['Codocyte'], category: 'Morphology',
    definition: 'A red cell with a central spot of hemoglobin surrounded by pallor and an outer rim. Target cells occur in thalassemia, other hemoglobin disorders, liver disease, and after splenectomy.',
    source: evaluationSource,
  },
  {
    term: 'Thrombotic thrombocytopenic purpura', aliases: ['TTP'], keywords: ['ADAMTS13 deficiency', 'MAHA'], category: 'Clinical',
    definition: 'A thrombotic microangiopathy associated with severe ADAMTS13 deficiency. Thrombocytopenia with microangiopathic hemolytic anemia warrants urgent evaluation. ADAMTS13 activity below 10% in the appropriate clinical setting supports TTP.',
    source: { title: 'ISTH · Focused update of TTP management guidelines (2025)', url: 'https://pmc.ncbi.nlm.nih.gov/articles/PMC13470878/' },
  },
]
