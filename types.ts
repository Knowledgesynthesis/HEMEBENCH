// Core data types for HemeBench

export interface CBCValues {
  wbc: number // x10^9/L
  rbc: number // x10^12/L
  hgb: number // g/dL
  hct: number // %
  mcv: number // fL
  mch: number // pg
  mchc: number // g/dL
  rdw: number // %
  platelets: number // x10^9/L
  neutrophils?: number // %
  lymphocytes?: number // %
  monocytes?: number // %
  eosinophils?: number // %
  basophils?: number // %
  reticulocytes?: number // %
}

export interface CBCReferenceRanges {
  wbc: [number, number]
  rbc: [number, number]
  hgb: [number, number]
  hct: [number, number]
  mcv: [number, number]
  mch: [number, number]
  mchc: [number, number]
  rdw: [number, number]
  platelets: [number, number]
  neutrophils: [number, number]
  lymphocytes: [number, number]
  monocytes: [number, number]
  eosinophils: [number, number]
  basophils: [number, number]
  reticulocytes: [number, number]
}

export interface CoagulationPanel {
  pt: number // seconds
  ptt: number // seconds
  inr: number
  fibrinogen: number // mg/dL
  dDimer: number // ng/mL FEU
  plateletCount: number // x10^9/L
}

export interface FlowMarker {
  name: string
  cd: string
  positive: boolean
  intensity?: 'dim' | 'moderate' | 'bright'
  pattern?: string
}

export interface FlowPanel {
  markers: FlowMarker[]
  lineage: 'myeloid' | 'lymphoid' | 'erythroid' | 'megakaryocytic' | 'mixed'
  clonality?: 'monoclonal' | 'polyclonal' | 'oligoclonal'
  maturation?: string
}

export interface MolecularMarker {
  gene: string
  mutation: string
  vaf?: number // Variant allele frequency %
  classification: 'driver' | 'secondary' | 'germline' | 'uncertain'
  significance: string
}

export interface CellMorphology {
  cellType: string
  size: 'small' | 'normal' | 'large'
  cytoplasm: {
    color: string
    amount: 'scant' | 'moderate' | 'abundant'
    features: string[]
  }
  nucleus: {
    shape: string
    chromatin: string
    nucleoli: number
    features: string[]
  }
  specialFeatures: string[]
  classification: 'normal' | 'reactive' | 'dysplastic' | 'neoplastic'
}

export interface SmearFindings {
  rbcMorphology: string[]
  wbcMorphology: string[]
  plateletMorphology: string[]
  overallImpression: string
  keyFindings: string[]
}

export interface DiagnosticCase {
  id: string
  title: string
  clinicalContext: string
  age: number
  sex: 'M' | 'F'
  presentation: string
  cbc: CBCValues
  smear: SmearFindings
  coagulation?: CoagulationPanel
  flow?: FlowPanel
  molecular?: MolecularMarker[]
  diagnosis: string
  mechanism: string
  keyFeatures: string[]
  differentialDx: string[]
  managementPoints: string[]
  educationalLevel: 'MS2' | 'MS3' | 'MS4' | 'Resident' | 'Fellow' | 'Attending'
}

export interface LearningModule {
  id: string
  title: string
  category: 'rbc' | 'wbc' | 'platelet' | 'coagulation' | 'flow' | 'molecular' | 'integrated'
  level: 'foundational' | 'intermediate' | 'advanced'
  objectives: string[]
  content: string
  keyPoints: string[]
  clinicalPearls: string[]
  pitfalls: string[]
  references: string[]
}

export interface GlossaryEntry {
  term: string
  definition: string
  category: 'morphology' | 'lab' | 'molecular' | 'clinical'
  synonyms?: string[]
  relatedTerms?: string[]
}

export interface AnemiaPattern {
  mcv: 'low' | 'normal' | 'high'
  reticulocytes: 'low' | 'normal' | 'high'
  causes: string[]
  mechanism: string
  keyFeatures: string[]
}

export interface LeukemiaClassification {
  lineage: 'AML' | 'ALL' | 'CML' | 'CLL' | 'Other'
  subtype: string
  morphology: string[]
  flowPattern: string[]
  cytogenetics: string[]
  molecularMarkers: string[]
  prognosis: 'favorable' | 'intermediate' | 'poor'
  treatment: string[]
}

export type NavigationView =
  | 'home'
  | 'normal-smear'
  | 'cbc-patterns'
  | 'anemia-game'
  | 'flow-cytometry'
  | 'molecular-panel'
  | 'coagulation'
  | 'case-engine'
  | 'glossary'
  | 'settings'
