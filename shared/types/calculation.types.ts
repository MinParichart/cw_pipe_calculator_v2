// Calculation Types

export interface CalculationResult {
  id: string
  pipeId: string
  versionId?: string
  fixtureUnitsTotal: number
  flowRateGPM: number
  flowRateLPS: number
  flowRateM3S: number
  velocity: number
  velocityHead: number
  frictionLossRate: number
  majorLoss: number
  minorLoss: number
  totalLoss: number
  suggestedSize?: string
  status: CalculationStatus
  warnings?: string
  createdAt: Date
}

export enum CalculationStatus {
  PASS = 'PASS',
  WARN = 'WARN',
  FAIL = 'FAIL',
}

export interface CalculationInput {
  projectId: string
  networkId?: string
}

export interface CalculationOutput {
  results: CalculationResult[]
  tdh: TDHResult
  criticalPath: PathResult
  summary: CalculationSummary
}

export interface TDHResult {
  totalHeadLoss: number        // m.wg
  staticHead: number           // m.wg
  residualPressure: number     // bar
  tdhMeters: number            // m.wg
  tdhBar: number               // bar
  tdhPSI: number               // PSI
}

export interface PathResult {
  nodes: string[]
  pipes: string[]
  totalLength: number
  totalElevation: number
}

export interface CalculationSummary {
  totalPipes: number
  criticalPathPipes: number
  maxVelocity: number
  maxHeadLoss: number
  passCount: number
  warnCount: number
  failCount: number
}

export interface SuggestionResult {
  pipeId: string
  currentSize: string
  suggestedSize: string
  reason: string
  estimatedImprovement: {
    velocity?: number
    headLoss?: number
  }
}

export interface FUSummary {
  nodeId: string
  nodeLabel?: string
  nodeType: string
  fixtures: {
    type: FixtureType
    quantity: number
    fu: number
  }[]
  totalFU: number
  cumulativeFU: number
}

// Hazen-Williams Calculation Types
export interface HazenWilliamsInput {
  diameter: number             // meters
  flow: number                 // m³/s
  length: number               // meters
  cFactor: number
}

export interface HazenWilliamsOutput {
  frictionLossRate: number     // m/100m
  majorLoss: number            // m.wg
  minorLoss: number            // m.wg (30% of major)
  totalLoss: number            // m.wg
}

// Velocity Calculation Types
export interface VelocityInput {
  flow: number                 // m³/s
  diameter: number             // meters
}

export interface VelocityOutput {
  velocity: number             // m/s
  velocityHead: number         // m.wg
  area: number                 // m²
}

// Unit Conversion Types
export interface UnitConversion {
  gpm?: number
  lps?: number
  m3s?: number
  bar?: number
  mwg?: number
  psi?: number
}

// Validation Types
export interface ValidationResult {
  isValid: boolean
  status: CalculationStatus
  warnings: string[]
  errors: string[]
}

export interface VelocityValidation {
  isValid: boolean
  status: CalculationStatus
  velocity: number
  minVelocity: number
  maxVelocity: number
  warningVelocity: number
}

export interface PressureValidation {
  isValid: boolean
  status: CalculationStatus
  pressure: number
  minPressure: number
  warningPressure: number
}
