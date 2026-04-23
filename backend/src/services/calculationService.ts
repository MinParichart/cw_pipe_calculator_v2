// Calculation Service
import prisma from '../config/database'

// Import constants from shared
import { fuToGPM as hunterCurveFuToGPM } from '../../../shared/constants/hunterCurve'
import { getFixtureUnits } from '../../../shared/constants/fixtures'
import { PIPE_SIZES } from '../../../shared/constants/pipes'

export class CalculationService {
  /**
   * Calculate FU for a node (sum of all fixtures)
   */
  async calculateNodeFU(nodeId: number): Promise<number> {
    const fixtures = await prisma.fixture.findMany({
      where: { nodeId },
    })

    let totalFU = 0

    fixtures.forEach(fixture => {
      // Use helper function to get cold or total FU
      const fu = getFixtureUnits(fixture.type as any, 'cold')
      totalFU += fu * fixture.quantity
    })

    return totalFU
  }

  /**
   * Calculate accumulated FU for a pipe segment
   * (sum of all fixtures downstream from the source node)
   */
  async calculatePipeFU(pipeId: number): Promise<number> {
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
      // Use helper function to get cold or total FU
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
   * Count hose bibbs in a pipe segment
   * (count all hose bibbs downstream from the source node)
   */
  async countHoseBibbs(pipeId: number): Promise<number> {
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

    let hoseBibbCount = 0
    fixtures.forEach(fixture => {
      // Count hose bibbs
      if (fixture.type === 'HOSE_BIBB') {
        hoseBibbCount += fixture.quantity
      }
    })

    // Add hose bibbs from downstream pipes (recursive)
    const downstreamPipes = await prisma.pipe.findMany({
      where: { sourceNodeId: pipe.targetNodeId },
    })

    for (const downstreamPipe of downstreamPipes) {
      hoseBibbCount += await this.countHoseBibbs(downstreamPipe.id)
    }

    return hoseBibbCount
  }

  /**
   * Convert FU to Flow Rate (GPM) using Hunter's Curve
   * Uses the shared helper function
   */
  private hunterFuToGPM(fu: number, systemType: 'FLUSH_TANK' | 'FLUSH_VALVE'): number {
    return hunterCurveFuToGPM(fu, systemType)
  }

  /**
   * Convert GPM to other units
   */
  convertFlowUnits(gpm: number) {
    const lps = gpm * 0.06309
    const m3s = gpm * 0.00006309

    return {
      gpm,
      lps,
      m3s,
    }
  }

  /**
   * Calculate velocity (v = Q/A)
   */
  calculateVelocity(flowM3S: number, internalDiameterM: number): number {
    const area = Math.PI * Math.pow(internalDiameterM / 2, 2)
    return flowM3S / area
  }

  /**
   * Calculate Hazen-Williams friction loss rate
   * h_f = (10.583 / D^4.87) × (Q / C)^1.85 × 100
   */
  calculateFrictionLossRate(
    flowM3S: number,
    internalDiameterM: number,
    cFactor: number
  ): number {
    const h_f = (10.583 / Math.pow(internalDiameterM, 4.87)) *
                Math.pow(flowM3S / cFactor, 1.85) * 100
    return h_f
  }

  /**
   * Calculate major loss (h_l = L × h_f / 100)
   */
  calculateMajorLoss(lengthM: number, frictionLossRate: number): number {
    return lengthM * (frictionLossRate / 100)
  }

  /**
   * Calculate minor loss (30% of major loss)
   */
  calculateMinorLoss(majorLoss: number): number {
    return majorLoss * 0.3
  }

  /**
   * Get suggested pipe size based on FU and Table 2.6
   */
  getSuggestedPipeSize(fu: number, currentSize: string): string | null {
    const currentSizeMM = parseInt(currentSize)

    // Find the next larger pipe size that can handle the FU
    const suggestedPipe = PIPE_SIZES.find(p => p.mm > currentSizeMM && p.averageDemand >= fu)

    return suggestedPipe ? String(suggestedPipe.mm) : null
  }

  /**
   * Calculate status based on velocity and limits
   */
  calculateStatus(
    velocity: number,
    velocityWarning: number,
    totalLoss: number,
    maxTotalLoss?: number
  ): 'PASS' | 'WARN' | 'FAIL' {
    if (velocity > velocityWarning) {
      return 'FAIL'
    }

    if (velocity > 2.4 || velocity < 1.2) {
      return 'WARN'
    }

    if (maxTotalLoss && totalLoss > maxTotalLoss) {
      return 'FAIL'
    }

    return 'PASS'
  }

  /**
   * Run full calculation for a pipe
   */
  async calculatePipe(pipeId: number, params: {
    systemType: 'FLUSH_TANK' | 'FLUSH_VALVE'
    velocityWarning: number
    includeHoseBibb?: boolean
    hoseBibbGPM?: number
    waterFactorAdjustment?: number // percentage (e.g., 55 for 55%)
  }) {
    const pipe = await prisma.pipe.findUnique({
      where: { id: pipeId },
      include: {
        calculations: true,
      },
    })

    if (!pipe) {
      throw new Error('Pipe not found')
    }

    // Step 1: Calculate FU
    const fu = await this.calculatePipeFU(pipeId)

    // Step 2: Count hose bibbs and add their flow (5 GPM each)
    const hoseBibbCount = await this.countHoseBibbs(pipeId)
    const hoseBibbFlow = hoseBibbCount * 5 // 5 GPM per hose bibb

    // Step 3: Convert FU to GPM
    let flowGPM = this.hunterFuToGPM(fu, params.systemType)

    // Step 4: Apply water factor adjustment if specified
    if (params.waterFactorAdjustment !== undefined) {
      flowGPM = flowGPM * (params.waterFactorAdjustment / 100)
    }

    // Step 5: Add hose bibb flow (automatic detection)
    flowGPM += hoseBibbFlow

    // Step 6: Legacy support - also add from params if specified (for backward compatibility)
    if (params.includeHoseBibb && params.hoseBibbGPM) {
      flowGPM += params.hoseBibbGPM
    }

    // Step 5: Convert to other units
    const flow = this.convertFlowUnits(flowGPM)

    // Step 6: Calculate velocity
    const velocity = this.calculateVelocity(flow.m3s, pipe.internalDiameter)

    // Step 7: Calculate velocity head
    const velocityHead = Math.pow(velocity, 2) / (2 * 9.81)

    // Step 8: Calculate friction loss rate
    const frictionLossRate = this.calculateFrictionLossRate(
      flow.m3s,
      pipe.internalDiameter,
      pipe.cFactor
    )

    // Step 9: Calculate major loss
    const majorLoss = this.calculateMajorLoss(pipe.length, frictionLossRate)

    // Step 10: Calculate minor loss
    const minorLoss = this.calculateMinorLoss(majorLoss)

    // Step 11: Calculate static head (elevation difference)
    // Get elevation from source and target nodes
    const sourceNode = await prisma.node.findUnique({
      where: { id: pipe.sourceNodeId },
      select: { elevation: true }
    })
    const targetNode = await prisma.node.findUnique({
      where: { id: pipe.targetNodeId },
      select: { elevation: true }
    })

    // Static head = elevation difference (target - source)
    // Note: This is the static head for THIS pipe segment only
    // For total system static head, you'd calculate from pump to highest fixture
    const staticHead = (targetNode?.elevation || 0) - (sourceNode?.elevation || 0)

    // Step 12: Calculate total loss (major + minor + static)
    const totalLoss = majorLoss + minorLoss + staticHead

    // Step 13: Get suggested pipe size
    const suggestedSize = this.getSuggestedPipeSize(fu, pipe.nominalSize)

    // Step 14: Calculate status
    const status = this.calculateStatus(velocity, params.velocityWarning, totalLoss)

    // Step 15: Generate warnings
    const warnings: string[] = []

    if (velocity < 1.2) {
      warnings.push('Velocity is below minimum recommended (1.2 m/s)')
    } else if (velocity > 2.4 && velocity <= params.velocityWarning) {
      warnings.push('Velocity is above maximum recommended (2.4 m/s)')
    }

    if (velocity > params.velocityWarning) {
      warnings.push(`Velocity exceeds warning threshold (${params.velocityWarning} m/s)`)
    }

    // Delete existing calculations
    await prisma.calculationResult.deleteMany({
      where: { pipeId },
    })

    // Create new calculation result
    const result = await prisma.calculationResult.create({
      data: {
        pipeId,
        fixtureUnitsTotal: fu,
        flowRateGPM: flow.gpm,
        flowRateLPS: flow.lps,
        flowRateM3S: flow.m3s,
        velocity,
        velocityHead,
        frictionLossRate,
        majorLoss,
        minorLoss,
        staticHead,
        totalLoss,
        suggestedSize,
        status,
        warnings: warnings.length > 0 ? JSON.stringify(warnings) : null,
      },
    })

    return result
  }

  /**
   * Run calculations for all pipes in a network
   */
  async calculateNetwork(networkId: number, params: {
    systemType: 'FLUSH_TANK' | 'FLUSH_VALVE'
    velocityWarning: number
    includeHoseBibb?: boolean
    hoseBibbGPM?: number
    waterFactorAdjustment?: number
  }) {
    const pipes = await prisma.pipe.findMany({
      where: { networkId },
    })

    const results = await Promise.all(
      pipes.map(async (pipe) => {
        // Count hose bibbs for this specific pipe
        const hoseBibbCount = await this.countHoseBibbs(pipe.id)
        const hoseBibbFlow = hoseBibbCount * 5

        // Calculate with automatic hose bibb detection
        return await this.calculatePipe(pipe.id, {
          ...params,
          includeHoseBibb: true,
          hoseBibbGPM: hoseBibbFlow
        })
      })
    )

    return results
  }

  /**
   * Calculate Total Dynamic Head (TDH) for a project
   */
  async calculateTDH(projectId: number, userId: number) {
    // Verify ownership
    const project = await prisma.project.findUnique({
      where: { id: projectId },
      include: { criteria: true },
    })

    if (!project) {
      throw new Error('Project not found')
    }

    if (project.ownerId !== userId) {
      throw new Error('Access denied')
    }

    // Get current network
    const network = await prisma.network.findFirst({
      where: { projectId, isCurrent: true },
      include: {
        pipes: {
          include: { calculations: true },
        },
      },
    })

    if (!network) {
      throw new Error('No network found for this project')
    }

    // Find pipes in critical path
    const criticalPathPipes = network.pipes.filter(p => p.isCriticalPath)

    // Sum up total losses for critical path
    let totalMajorLoss = 0
    let totalMinorLoss = 0

    criticalPathPipes.forEach(pipe => {
      if (pipe.calculations.length > 0) {
        const calc = pipe.calculations[0]
        totalMajorLoss += calc.majorLoss
        totalMinorLoss += calc.minorLoss
      }
    })

    const totalHeadLoss = totalMajorLoss + totalMinorLoss

    // Add static head
    const staticHead = project.criteria?.staticHead || 0

    // Add residual pressure
    const residualPressureM = (project.criteria?.residualPressure || 0.35) * 10.197

    // Calculate TDH
    const tdhMeters = totalHeadLoss + staticHead + residualPressureM
    const tdhBar = tdhMeters / 10.197
    const tdhPSI = tdhBar * 14.5

    return {
      totalMajorLoss,
      totalMinorLoss,
      totalHeadLoss,
      staticHead,
      residualPressure: residualPressureM,
      tdh: {
        meters: tdhMeters,
        bar: tdhBar,
        psi: tdhPSI,
      },
    }
  }

  /**
   * Apply suggested pipe sizes for pipes that failed
   */
  async applySuggestions(networkId: number, userId: number) {
    // Verify ownership
    const network = await prisma.network.findUnique({
      where: { id: networkId },
      include: { project: true },
    })

    if (!network) {
      throw new Error('Network not found')
    }

    if (network.project.ownerId !== userId) {
      throw new Error('Access denied')
    }

    // Get all pipes with calculations that need upsizing
    const pipes = await prisma.pipe.findMany({
      where: {
        networkId,
        calculations: {
          some: {
            status: { in: ['WARN', 'FAIL'] },
            suggestedSize: { not: null },
          },
        },
      },
      include: {
        calculations: true,
      },
    })

    const updatedPipes = []

    for (const pipe of pipes) {
      const calc = pipe.calculations[0]
      if (calc.suggestedSize) {
        // Get pipe specs for suggested size
        const pipeSpec = PIPE_SIZES.find(p => p.mm === parseInt(calc.suggestedSize!))
        if (pipeSpec) {
          const updated = await prisma.pipe.update({
            where: { id: pipe.id },
            data: {
              nominalSize: calc.suggestedSize,
              internalDiameter: pipeSpec.internalDiameterM,
            },
          })
          updatedPipes.push(updated)
        }
      }
    }

    // Create audit log
    await prisma.auditLog.create({
      data: {
        projectId: network.projectId,
        userId,
        action: 'APPLY_SUGGESTION',
        entity: 'network',
        entityId: networkId,
        details: JSON.stringify({ updatedPipesCount: updatedPipes.length }),
      },
    })

    return updatedPipes
  }
}

export default new CalculationService()
