import type { ModuleId } from './curriculum'

export interface ReviewItem {
  id: string
  module: ModuleId
  prompt: string
  options: { text: string; feedback: string }[]
  answer: number
  source: { title: string; url: string }
}

const anemiaEvaluation = {
  title: 'MSD Manual Professional · Evaluation of anemia',
  url: 'https://www.msdmanuals.com/professional/hematology/approach-to-the-patient-with-anemia/evaluation-of-anemia',
}

export const reviewItems: ReviewItem[] = [
  {
    id: 'smear-granules',
    module: 'normal-smear',
    prompt: 'On an adult blood film, a white cell has two connected nuclear lobes and coarse orange-pink granules. Which cell is it?',
    options: [
      { text: 'Basophil', feedback: 'Basophil granules stain deep purple and can obscure the nucleus. The orange-pink granules point to an eosinophil.' },
      { text: 'Eosinophil', feedback: 'The combination of a bilobed nucleus and coarse orange-pink granules identifies an eosinophil.' },
      { text: 'Segmented neutrophil', feedback: 'A neutrophil may have two lobes, but its fine pale granules look different from the coarse granules in this cell.' },
    ],
    answer: 1,
    source: { title: 'ASH Image Bank · Eosinophils and lymphocyte', url: 'https://imagebank.hematology.org/image/63365/eosinophils-and-lymphocyte?type=atlas' },
  },
  {
    id: 'smear-platelet-clumps',
    module: 'normal-smear',
    prompt: 'A preoperative count in an EDTA tube reports platelets of 28 × 10⁹/L. The film shows platelet clumps. A citrate specimen has no clumps and a dilution-corrected count of 182 × 10⁹/L. What explains the discrepancy?',
    options: [
      { text: 'Rapid recovery of platelet production', feedback: 'Marrow production cannot explain the difference between samples drawn at the same visit. The discrepancy follows the collection tube.' },
      { text: 'Immune platelet destruction', feedback: 'Immune destruction lowers circulating platelets. A normal count on the fresh, unclumped sample points to an artifact in the EDTA tube.' },
      { text: 'Clumping in the EDTA sample', feedback: 'The analyzer undercounted platelets that aggregated in the tube. The film and repeat count demonstrate pseudothrombocytopenia.' },
    ],
    answer: 2,
    source: { title: 'ASH Image Bank · EDTA-induced pseudothrombocytopenia', url: 'https://imagebank.hematology.org/image/65070/edtainduced-pseudothrombocytopenia-with-citrate-correction' },
  },
  {
    id: 'cbc-absolute-neutrophils',
    module: 'cbc-patterns',
    prompt: 'After chemotherapy, an adult has a WBC count of 1.6 × 10⁹/L, 48% segmented neutrophils and 2% bands. What is the absolute neutrophil count?',
    options: [
      { text: '0.80 × 10⁹/L', feedback: 'Segmented neutrophils and bands together account for half the white cells. Multiplying 1.6 by 0.50 gives 0.80 × 10⁹/L.' },
      { text: '0.50 × 10⁹/L', feedback: '0.50 is the fraction of white cells that are neutrophils. Multiply that fraction by the total white count to get the absolute count.' },
      { text: '1.60 × 10⁹/L', feedback: '1.60 × 10⁹/L counts all white cells. Only 50% of these cells are segmented neutrophils or bands.' },
    ],
    answer: 0,
    source: { title: 'Merck Manual Professional · Neutropenia', url: 'https://www.merckmanuals.com/professional/hematology/leukopenias/neutropenia' },
  },
  {
    id: 'cbc-mixed-sizes',
    module: 'cbc-patterns',
    prompt: 'Hemoglobin is 9.1 g/dL, MCV 89 fL and RDW 23% (local upper limit 15%). The smear shows many small cells and many large cells. How can the MCV fall within the reference interval?',
    options: [
      { text: 'The RDW measures cell number', feedback: 'RDW describes variation in red cell size. Here, the two size groups account for its elevation.' },
      { text: 'Small and large cells can average to 89 fL', feedback: 'MCV is a mean. Look at RDW and the film to recognize two cell populations and investigate mixed causes of anemia.' },
      { text: 'A hemoglobin below 10 g/dL makes the MCV invalid', feedback: 'The degree of anemia does not invalidate MCV. The distribution of cell sizes explains this result.' },
    ],
    answer: 1,
    source: anemiaEvaluation,
  },
  {
    id: 'anemia-retic-denominator',
    module: 'anemia-game',
    prompt: 'An adult with hemoglobin 7.4 g/dL has an RBC count of 2.5 × 10¹²/L and 2% reticulocytes. The local adult absolute reticulocyte interval is 25–100 × 10⁹/L. What does the marrow response show?',
    options: [
      { text: 'A brisk response because the raw percentage is 2%', feedback: 'The percentage uses the reduced red cell count as its denominator. Compute the absolute count and consider the severity of anemia.' },
      { text: 'A depleted absolute count of 5 × 10⁹/L', feedback: 'Two percent is 0.02. Multiplying 2.5 × 10¹²/L by 0.02 gives 0.05 × 10¹²/L, or 50 × 10⁹/L.' },
      { text: 'An absolute count of 50 × 10⁹/L, inadequate for this degree of anemia', feedback: 'The count is within the adult reference interval. With marked anemia, an intact marrow response would usually raise it above baseline.' },
    ],
    answer: 2,
    source: anemiaEvaluation,
  },
  {
    id: 'anemia-iron-recovery',
    module: 'anemia-game',
    prompt: 'An adult with confirmed iron deficiency starts iron replacement. A week later the absolute reticulocyte count has risen, hemoglobin is starting to rise and bilirubin is stable. What best explains the reticulocytosis?',
    options: [
      { text: 'New red cell production during recovery', feedback: 'Iron repletion allows the marrow to release more young red cells. Reticulocytes can rise while the patient is still anemic.' },
      { text: 'A new episode of hemolysis', feedback: 'Hemolysis can raise reticulocytes, but the rise in hemoglobin after iron replacement and stable bilirubin favor recovery.' },
      { text: 'Persistent suppression of red cell production', feedback: 'An increasing absolute reticulocyte count is evidence of current marrow output. Persistent suppression would give a weak response.' },
    ],
    answer: 0,
    source: anemiaEvaluation,
  },
  {
    id: 'coag-contact-factor',
    module: 'coagulation',
    prompt: 'An adult with no personal or family bleeding history has a prolonged aPTT before surgery. PT is normal. A mixing study corrects, and factor XII activity is markedly reduced. Which interpretation fits?',
    options: [
      { text: 'Factor XII deficiency usually causes spontaneous muscle bleeding', feedback: 'Deep muscle bleeding suggests another cause, such as factor VIII or IX deficiency. Factor XII deficiency can prolong aPTT substantially without that bleeding tendency.' },
      { text: 'Factor XII deficiency can prolong the laboratory aPTT without causing a bleeding tendency', feedback: 'Factor XII participates in contact activation in the aPTT assay. Its deficiency generally does not cause clinical bleeding. Assess procedural risk using the whole history.' },
      { text: 'Factor XII deficiency primarily prolongs PT', feedback: 'PT evaluates factor VII and the common pathway. Factor XII deficiency affects aPTT.' },
    ],
    answer: 1,
    source: { title: 'ARUP Consult · Prolonged clotting time evaluation', url: 'https://arupconsult.com/content/prolonged-clotting-time-evaluation' },
  },
  {
    id: 'coag-vwf-acute-phase',
    module: 'coagulation',
    prompt: 'An adult with lifelong mucosal bleeding had normal von Willebrand factor (VWF) antigen and activity during a febrile illness. Suspicion for von Willebrand disease remains high. How should the team interpret the result?',
    options: [
      { text: 'Exclude von Willebrand disease because both assays were normal', feedback: 'Acute illness can increase VWF into the reference interval. One result during illness can miss a baseline deficiency.' },
      { text: 'Use platelet count alone to decide whether VWF should be retested', feedback: 'Platelet count does not measure VWF quantity or function. A normal platelet count can coexist with von Willebrand disease.' },
      { text: 'Repeat the VWF evaluation after recovery, at baseline health', feedback: 'VWF rises with inflammation and stress. Repeating antigen, activity and factor VIII at baseline can clarify a result obtained during acute illness.' },
    ],
    answer: 2,
    source: { title: 'ARUP Consult · Von Willebrand disease', url: 'https://arupconsult.com/content/von-willebrand-disease' },
  },
  {
    id: 'flow-lymph-node-clone',
    module: 'flow-cytometry',
    prompt: 'A 66-year-old has enlarged lymph nodes and 2.4 × 10⁹/L circulating clonal B cells. A node biopsy confirms a typical CLL/SLL infiltrate. Hemoglobin and platelets are normal. Which classification fits?',
    options: [
      { text: 'Small lymphocytic lymphoma (SLL)', feedback: 'Biopsy establishes tissue involvement. With fewer than 5 × 10⁹/L circulating clonal B cells and no marrow-related cytopenias, this is SLL.' },
      { text: 'CLL-type monoclonal B-cell lymphocytosis', feedback: 'This category requires absence of lymphadenopathy attributable to the clone. The node contains the same neoplastic population.' },
      { text: 'Blood-defined chronic lymphocytic leukemia', feedback: 'The count is below the blood diagnostic threshold of 5 × 10⁹/L clonal B cells. Proven nodal involvement supports the SLL presentation of the same disease.' },
    ],
    answer: 0,
    source: { title: 'iwCLL guidelines · Diagnosis of CLL and monoclonal B-cell lymphocytosis', url: 'https://ashpublications.org/blood/article/131/25/2745/37141/iwCLL-guidelines-for-diagnosis-indications-for' },
  },
  {
    id: 'flow-regenerating-marrow',
    module: 'flow-cytometry',
    prompt: 'In a regenerating adult marrow after chemotherapy, CD19-positive precursors show progressive loss of CD34 and CD10 and acquisition of CD20. No separate aberrant cluster is seen. Which interpretation best fits this population?',
    options: [
      { text: 'Residual B-cell acute lymphoblastic leukemia', feedback: 'Early normal precursors share several markers with B lymphoblasts. The orderly spectrum of marker changes favors maturation. Residual disease requires assessment for an aberrant population.' },
      { text: 'Normal maturing B-cell precursors (hematogones)', feedback: 'Hematogones can expand during marrow recovery. Their changing antigen expression reflects successive stages of B-cell development.' },
      { text: 'A mature B-cell clone', feedback: 'The population includes CD34-positive precursors transitioning to CD20-positive cells. The findings describe maturation and supply no evidence of mature B-cell clonality.' },
    ],
    answer: 1,
    source: { title: 'International Clinical Cytometry Society · Hematogones and B lymphoblasts', url: 'https://www.cytometry.org/web/q_view.php?id=4' },
  },
  {
    id: 'molecular-aml-risk',
    module: 'molecular-panel',
    prompt: 'An adult starting intensive induction for AML has mutated NPM1, no FLT3-ITD and monosomy 7. What is the baseline ELN 2022 genetic risk group?',
    options: [
      { text: 'Favorable', feedback: 'NPM1 mutation without FLT3-ITD would usually favor this group, but monosomy 7 is an adverse-risk cytogenetic finding.' },
      { text: 'Intermediate', feedback: 'Monosomy 7 has a specific adverse-risk assignment. It does not fall into the residual intermediate category.' },
      { text: 'Adverse', feedback: 'Under ELN 2022, adverse-risk cytogenetics place NPM1-mutated AML in the adverse group. Interpret the karyotype alongside the sequencing panel.' },
    ],
    answer: 2,
    source: { title: 'European LeukemiaNet · Adult AML recommendations, Table 6', url: 'https://ashpublications.org/blood/article/140/12/1345/485817/Diagnosis-and-management-of-AML-in-adults-2022' },
  },
  {
    id: 'molecular-hairy-cell',
    module: 'molecular-panel',
    prompt: 'An adult with splenomegaly and cytopenias has marrow morphology and flow findings suggestive of classic hairy cell leukemia. A sensitive assay on an adequate sample finds no BRAF V600E. What follows?',
    options: [
      { text: 'Reassess the phenotype and differential, allowing for rare BRAF V600E-negative classic cases', feedback: 'BRAF V600E is present in more than 95% of classic cases. Its absence warrants review of morphology, immunophenotype and other molecular findings.' },
      { text: 'Exclude classic hairy cell leukemia entirely', feedback: 'A minority of classic cases lack BRAF V600E. The negative result weighs against the common genotype but cannot exclude the diagnosis.' },
      { text: 'Diagnose hairy cell leukemia variant from this test alone', feedback: 'Absence of the common mutation can occur in several disorders. A variant diagnosis requires its own morphologic and immunophenotypic evidence.' },
    ],
    answer: 0,
    source: { title: 'Hairy Cell Leukemia Foundation · Updated international consensus (2026)', url: 'https://ashpublications.org/blood/article/148/1/31/567757/Updated-consensus-guidelines-for-the-diagnosis-and' },
  },
  {
    id: 'cases-apl-differentiation',
    module: 'case-engine',
    prompt: 'An adult receiving all-trans retinoic acid for acute promyelocytic leukemia develops abrupt weight gain, hypoxemia and new bilateral lung infiltrates. Alongside assessment for infection and other causes, which treatment complication needs urgent action?',
    options: [
      { text: 'Iron overload from transfusions', feedback: 'Transfusional iron overload develops with cumulative exposure. The rapid onset of weight gain and respiratory compromise during induction raises concern for differentiation syndrome.' },
      { text: 'Differentiation syndrome', feedback: 'The combination of fluid retention and pulmonary findings during induction raises concern for differentiation syndrome. ELN recommends immediate dexamethasone at clinical suspicion while other causes are evaluated.' },
      { text: 'Molecular relapse', feedback: 'Acute respiratory compromise alone does not establish relapse. The timing during differentiating therapy and rapid fluid accumulation point to differentiation syndrome.' },
    ],
    answer: 1,
    source: { title: 'European LeukemiaNet · Management of acute promyelocytic leukemia', url: 'https://pmc.ncbi.nlm.nih.gov/articles/PMC6509567/' },
  },
  {
    id: 'cases-pv-thrombosis-history',
    module: 'case-engine',
    prompt: 'A 48-year-old with confirmed polycythemia vera has a hematocrit of 44% on phlebotomy. She had a documented venous thrombosis last year. Which feature determines her standard thrombosis-risk category?',
    options: [
      { text: 'Age under 60 places her in the low-risk group', feedback: 'Low risk requires both younger age and no prior thrombosis. Her thrombotic event changes the classification.' },
      { text: 'A hematocrit below 45% returns her to the low-risk group', feedback: 'Hematocrit control reduces risk but does not erase the prognostic significance of prior thrombosis.' },
      { text: 'Prior thrombosis places her in the high-risk group', feedback: 'A thrombotic history is a high-risk feature at any adult age. This affects the discussion of cytoreductive therapy even when hematocrit is controlled.' },
    ],
    answer: 2,
    source: { title: 'Tefferi and Barbui · Polycythemia vera, 2024 update', url: 'https://pubmed.ncbi.nlm.nih.gov/37357958/' },
  },
]
