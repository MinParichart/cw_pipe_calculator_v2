// Hybrid Sizing Service
import prisma from '../config/database'
import { fuToGPM as hunterCurveFuToGPM } from '../../../shared/constants/hunterCurve'
import { getFixtureUnits } from '../../../shared/constants/fixtures'
import { PIPE_SIZES, getRecommendedPipeSize } from '../../../shared/constants/pipes'

// Pipe Specs Data from TIS. 17-2532
interface PipeSpec {
  dn: number
  od: string
  pvc5?: string
  pvc7?: string
  pvc85?: string
  pvc105?: string
  pvc135?: string
}

const PVC_PIPE_SPECS: PipeSpec[] = [
  { dn: 18, od: '22±0.15', pvc5: '-', pvc7: '1.5±0.15', pvc85: '2.0±0.15', pvc105: '2.3±0.15', pvc135: '2.6±0.15' },
  { dn: 20, od: '26±0.15', pvc5: '-', pvc7: '1.5±0.15', pvc85: '2.0±0.15', pvc105: '2.3±0.15', pvc135: '2.6±0.15' },
  { dn: 25, od: '34±0.15', pvc5: '-', pvc7: '1.5±0.15', pvc85: '2.0±0.15', pvc105: '2.4±0.20', pvc135: '3.0±0.25' },
  { dn: 35, od: '42±0.15', pvc5: '1.5±0.15', pvc7: '1.8±0.15', pvc85: '2.2±0.20', pvc105: '2.6±0.20', pvc135: '3.1±0.25' },
  { dn: 40, od: '48±0.15', pvc5: '1.5±0.15', pvc7: '1.9±0.15', pvc85: '2.3±0.20', pvc105: '2.8±0.20', pvc135: '3.5±0.25' },
  { dn: 55, od: '60±0.15', pvc5: '1.8±0.20', pvc7: '2.4±0.20', pvc85: '2.9±0.25', pvc105: '3.5±0.25', pvc135: '4.3±0.30' },
  { dn: 65, od: '76±0.20', pvc5: '2.2±0.20', pvc7: '2.9±0.20', pvc85: '3.5±0.25', pvc105: '4.4±0.30', pvc135: '5.4±0.30' },
  { dn: 80, od: '89±0.20', pvc5: '2.6±0.20', pvc7: '3.5±0.25', pvc85: '4.1±0.30', pvc105: '5.2±0.35', pvc135: '6.4±0.40' },
  { dn: 100, od: '114±0.30', pvc5: '3.2±0.20', pvc7: '4.3±0.25', pvc85: '5.2±0.30', pvc105: '6.5±0.35', pvc135: '8.1±0.50' },
]

export class HybridSizingService {
  /**
   * Parse tolerance string (e.g., "34±0.15") to get base value and tolerance
   */
  private parseTolerance(value: string): { base: number; tolerance: number } {
    if (!value || value === '-') {
      return { base: 0, tolerance: 0 }
    }

    const match = value.match(/(\d+\.?\d*)±(\d+\.?\d*)/)
    if (match) {
      return {
        base: parseFloat(match[1]),
        tolerance: parseFloat(match[2])
      }
    }

    return { base: parseFloat(value), tolerance: 0 }
  }

  /**
   * Calculate internal diameter from Pipe Specs Catalog
   * Formula: Minimum ID = (OD - tolerance) - [2 × (thickness + tolerance)]
   */
  private calculateInternalDiameterFromSpecs(
    dn: number,
    pvcClass: number
  ): number {
    // Find pipe spec
    const pipeSpec = PVC_PIPE_SPECS.find(spec => spec.dn === dn)
    if (!pipeSpec) {
      // Fallback: use DN / 1000
      return dn / 1000
    }

    // Determine which PVC class to use
    let thicknessStr: string | undefined
    if (pvcClass <= 5) thicknessStr = pipeSpec.pvc5
    else if (pvcClass <= 7) thicknessStr = pipeSpec.pvc7
    else if (pvcClass <= 8.5) thicknessStr = pipeSpec.pvc85
    else if (pvcClass <= 10.5) thicknessStr = pipeSpec.pvc105
    else thicknessStr = pipeSpec.pvc135

    if (!thicknessStr || thicknessStr === '-') {
      // Fallback: use DN / 1000
      return dn / 1000
    }

    // Parse OD and thickness
    const od = this.parseTolerance(pipeSpec.od)
    const thickness = this.parseTolerance(thicknessStr)

    // Calculate Minimum ID (in mm)
    const odMin = od.base - od.tolerance
    const thicknessMax = thickness.base + thickness.tolerance
    const idMin = odMin - (2 * thicknessMax)

    // Convert to meters
    return idMin / 1000
  }
  /**
   * Calculate FU for a pipe segment
   */
  private async calculatePipeFU(pipeId: number): Promise<number> {
    const pipe = await prisma.pipe.findUnique({
      where: { id: pipeId },
      include: {
        targetNode: true,
      },
    })

    if (!pipe) {
      throw new Error('Pipe not found')
    }

    // Get fixtures at this node
    const fixtures = await prisma.fixture.findMany({
      where: { nodeId: pipe.targetNodeId },
    })

    let fu = 0
    fixtures.forEach(fixture => {
      const fixtureFU = getFixtureUnits(fixture.type as any, 'cold')
      fu += fixtureFU * fixture.quantity
    })

    // Add FU from downstream pipes (recursive)
    const downstreamPipes = await prisma.pipe.findMany({
      where: { sourceNodeId: pipe.targetNodeId },
    })

    for (const downstreamPipe of downstreamPipes) {
      fu += await this.calculatePipeFU(downstreamPipe.id)
    }

    return fu
  }

  /**
   * Convert FU to Flow Rate (GPM) using Hunter's Curve
   */
  private hunterFuToGPM(fu: number, systemType: 'FLUSH_TANK' | 'FLUSH_VALVE'): number {
    return hunterCurveFuToGPM(fu, systemType)
  }

  /**
   * Convert GPM to m³/s
   */
  private gpmToM3s(gpm: number): number {
    return gpm * 0.00006309
  }

  /**
   * Calculate velocity (v = Q/A)
   */
  private calculateVelocity(flowM3S: number, internalDiameterM: number): number {
    const area = Math.PI * Math.pow(internalDiameterM / 2, 2)
    return flowM3S / area
  }

  /**
   * Calculate Hazen-Williams friction loss rate
   * h_f = (10.583 / D^4.87) × (Q / C)^1.85 × 100
   */
  private calculateFrictionLossRate(
    flowM3S: number,
    internalDiameterM: number,
    cFactor: number
  ): number {
    const h_f = (10.583 / Math.pow(internalDiameterM, 4.87)) *
                Math.pow(flowM3S / cFactor, 1.85) * 100
    return h_f
  }

  /**
   * Method 1: Table 2.6 Sizing
   * Select pipe size based on Fixture Units using standard table
   */
  private calculateTableSizing(
    fu: number,
    systemType: 'FLUSH_TANK' | 'FLUSH_VALVE',
    pvcClass: number
  ): { mm: number; inches: string; internalDiameter: number; method: string } {
    const recommended = getRecommendedPipeSize(fu, systemType, 'average')

    // Calculate internal diameter from Pipe Specs Catalog
    const internalDiameter = this.calculateInternalDiameterFromSpecs(
      recommended.mm,
      pvcClass
    )

    return {
      mm: recommended.mm,
      inches: recommended.inches,
      internalDiameter,
      method: 'Table 2.6 (Standard)',
    }
  }

  /**
   * Method 2: Hazen-Williams Formula Sizing
   * Calculate optimal pipe size based on velocity and friction loss
   */
  private calculateFormulaSizing(
    flowGPM: number,
    cFactor: number,
    currentNominalSize: string,
    pvcClass: number
  ): { mm: number; inches: string; internalDiameter: number; method: string; velocity: number; frictionLoss: number } {
    const flowM3S = this.gpmToM3s(flowGPM)
    const currentSizeMM = parseInt(currentNominalSize)

    // Try each pipe size to find optimal fit
    let optimalSize = PIPE_SIZES[0]

    for (const pipeSize of PIPE_SIZES) {
      // Use internal diameter from Pipe Specs Catalog instead of PIPE_SIZES constant
      const internalDiameterM = this.calculateInternalDiameterFromSpecs(pipeSize.mm, pvcClass)

      const velocity = this.calculateVelocity(flowM3S, internalDiameterM)
      const frictionLoss = this.calculateFrictionLossRate(
        flowM3S,
        internalDiameterM,
        cFactor
      )

      // Check if velocity is in acceptable range (1.2 - 2.4 m/s)
      if (velocity >= 1.2 && velocity <= 2.4) {
        // Also check friction loss (should be < 5 m per 100m)
        if (frictionLoss < 5) {
          optimalSize = pipeSize
          break
        }
      }

      // If velocity is too low with this size, try larger
      if (velocity < 1.2) {
        continue
      }

      optimalSize = pipeSize
    }

    // Calculate final internal diameter from Pipe Specs
    const finalInternalDiameter = this.calculateInternalDiameterFromSpecs(optimalSize.mm, pvcClass)

    // Recalculate with optimal size
    const finalVelocity = this.calculateVelocity(flowM3S, finalInternalDiameter)
    const finalFrictionLoss = this.calculateFrictionLossRate(
      flowM3S,
      finalInternalDiameter,
      cFactor
    )

    return {
      mm: optimalSize.mm,
      inches: optimalSize.inches,
      internalDiameter: finalInternalDiameter,
      method: 'Hazen-Williams Formula',
      velocity: finalVelocity,
      frictionLoss: finalFrictionLoss,
    }
  }

  /**
   * Generate recommendation based on comparison
   */
  private generateRecommendation(
    tableSizing: any,
    formulaSizing: any,
    fu: number,
    flowGPM: number
  ): string {
    if (tableSizing.mm === formulaSizing.mm) {
      return `Both methods agree on ${tableSizing.mm}mm (${tableSizing.inches}") pipe. This is the optimal size for ${fu} FU (${flowGPM.toFixed(2)} GPM).`
    }

    if (formulaSizing.mm > tableSizing.mm) {
      return `Formula method suggests larger size (${formulaSizing.mm}mm) for better hydraulic performance. Table method recommends ${tableSizing.mm}mm. Consider using ${formulaSizing.mm}mm for long runs or high velocity concerns.`
    }

    return `Table method recommends ${tableSizing.mm}mm which is more conservative. Formula suggests ${formulaSizing.mm}mm is adequate. Use ${tableSizing.mm}mm for standard applications.`
  }

  /**
   * Get fixture branch pipes for a node
   * Returns standard pipe sizes for each fixture connected to the node
   */
  private async getFixtureBranchPipes(nodeId: number): Promise<{
    fixtures: Array<{
      id: number
      type: string
      quantity: number
      coldPipeSize: string
      hotPipeSize: string
      fu: number
    }>
    totalFixtures: number
  }> {
    console.log('[getFixtureBranchPipes] Called for nodeId:', nodeId)

    const fixtures = await prisma.fixture.findMany({
      where: { nodeId },
    })

    console.log('[getFixtureBranchPipes] Found fixtures:', fixtures.length, fixtures)

    // Standard pipe sizes for fixture branches (residential)
    const getPipeSizeForFixture = (fixtureType: string): { cold: string; hot: string } => {
      // All residential fixtures use 1/2" (15mm) branch pipes
      // This is standard for buildings ≤2 stories
      return {
        cold: '1/2" (15mm)',
        hot: ['LAVATORY', 'SHOWER', 'BATHTUB', 'KITCHEN_SINK', 'LAUNDRY_TRAY'].includes(fixtureType)
          ? '1/2" (15mm)'
          : 'N/A',
      }
    }

    const fixtureDetails = fixtures.map(fixture => {
      const fu = getFixtureUnits(fixture.type as any, 'cold')
      const pipeSizes = getPipeSizeForFixture(fixture.type)

      return {
        id: fixture.id,
        type: fixture.type,
        quantity: fixture.quantity,
        coldPipeSize: pipeSizes.cold,
        hotPipeSize: pipeSizes.hot,
        fu,
      }
    })

    console.log('[getFixtureBranchPipes] Returning fixture details:', fixtureDetails)

    return {
      fixtures: fixtureDetails,
      totalFixtures: fixtures.length,
    }
  }

  /**
   * Perform hybrid sizing analysis for a single pipe
   */
  async performHybridSizing(pipeId: number, params: {
    systemType: 'FLUSH_TANK' | 'FLUSH_VALVE'
    includeHoseBibb?: boolean
    hoseBibbGPM?: number
  }) {
    const pipe = await prisma.pipe.findUnique({
      where: { id: pipeId },
      include: {
        network: {
          include: {
            project: {
              include: {
                criteria: true
              }
            }
          }
        }
      }
    })

    if (!pipe) {
      throw new Error('Pipe not found')
    }

    // Get PVC class from project criteria
    const pvcClass = pipe.network.project.criteria?.pvcClass || 7

    // Calculate FU
    const fu = await this.calculatePipeFU(pipeId)

    // Convert FU to GPM
    let flowGPM = this.hunterFuToGPM(fu, params.systemType)

    // Add hose bibb if applicable
    if (params.includeHoseBibb && params.hoseBibbGPM) {
      flowGPM += params.hoseBibbGPM
    }

    // Method 1: Table 2.6 Sizing
    const tableSizing = this.calculateTableSizing(fu, params.systemType, pvcClass)

    // Method 2: Hazen-Williams Formula Sizing
    const formulaSizing = this.calculateFormulaSizing(
      flowGPM,
      pipe.cFactor,
      pipe.nominalSize,
      pvcClass
    )

    // Generate recommendation
    const recommendation = this.generateRecommendation(
      tableSizing,
      formulaSizing,
      fu,
      flowGPM
    )

    // Get fixture branch pipes for the target node
    const fixtureBranches = await this.getFixtureBranchPipes(pipe.targetNodeId)

    return {
      pipeId,
      currentSize: {
        mm: parseInt(pipe.nominalSize),
        internalDiameter: pipe.internalDiameter,
      },
      fixtureUnits: fu,
      flowRate: {
        gpm: flowGPM,
        lps: flowGPM * 0.06309,
        m3s: flowGPM * 0.00006309,
      },
      tableSizing: {
        ...tableSizing,
        reasoning: `Based on ${fu} FU and Table 2.6 for ${params.systemType === 'FLUSH_TANK' ? 'flush tank' : 'flush valve'} systems`,
      },
      formulaSizing: {
        ...formulaSizing,
        reasoning: `Calculated using Hazen-Williams formula with C=${pipe.cFactor}. Target velocity: 1.2-2.4 m/s, friction loss < 5m/100m`,
      },
      recommendation,
      comparison: {
        difference: formulaSizing.mm - tableSizing.mm,
        largerSize: Math.max(tableSizing.mm, formulaSizing.mm),
        smallerSize: Math.min(tableSizing.mm, formulaSizing.mm),
        agreement: tableSizing.mm === formulaSizing.mm,
      },
      fixtureBranches, // Add fixture branch pipes info
    }
  }

  /**
   * Perform hybrid sizing for all pipes in a network
   */
  async performNetworkHybridSizing(networkId: number, params: {
    systemType: 'FLUSH_TANK' | 'FLUSH_VALVE'
    includeHoseBibb?: boolean
    hoseBibbGPM?: number
  }) {
    const pipes = await prisma.pipe.findMany({
      where: { networkId },
    })

    const results = await Promise.all(
      pipes.map(pipe => this.performHybridSizing(pipe.id, params))
    )

    return results
  }
}

export default new HybridSizingService()
