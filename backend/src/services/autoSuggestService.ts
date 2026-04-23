// Auto Suggest Service
import prisma from '../config/database'
import { fuToGPM as hunterCurveFuToGPM } from '../../../shared/constants/hunterCurve'
import { getFixtureUnits } from '../../../shared/constants/fixtures'
import { PIPE_SIZES } from '../../../shared/constants/pipes'

export interface PipeSuggestion {
  pipeId: number
  currentSize: {
    mm: number
    inches: string
    internalDiameter: number
  }
  status: 'OK' | 'WARNING' | 'CRITICAL'
  velocity: number
  frictionLoss: number
  majorLoss: number
  minorLoss: number
  staticHead: number
  totalLoss: number
  fixtureUnits: number
  flowRate: {
    gpm: number
    lps: number
    m3s: number
  }
  suggestedSize?: {
    mm: number
    inches: string
    internalDiameter: number
  }
  reason: string
  warnings: string[]
  isCriticalPath: boolean
  sourceNode?: {
    id: number
    label: string
  } | null
  targetNode?: {
    id: number
    label: string
  } | null
}

export class AutoSuggestService {
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
   * Determine pipe status based on velocity and friction loss
   */
  private determineStatus(
    velocity: number,
    frictionLoss: number
  ): 'OK' | 'WARNING' | 'CRITICAL' {
    // Critical conditions
    if (velocity > 3.0 || velocity < 0.6 || frictionLoss > 10) {
      return 'CRITICAL'
    }

    // Warning conditions
    if (velocity > 2.4 || velocity < 1.2 || frictionLoss > 5) {
      return 'WARNING'
    }

    return 'OK'
  }

  /**
   * Suggest appropriate pipe size
   */
  private suggestSize(
    currentVelocity: number,
    currentFrictionLoss: number,
    currentSizeMM: number,
    flowM3S: number,
    cFactor: number
  ): { mm: number; inches: string; internalDiameter: number } | null {
    // If current size is OK, no suggestion needed
    const status = this.determineStatus(currentVelocity, currentFrictionLoss)
    if (status === 'OK') {
      return null
    }

    // Find optimal size
    let suggestedSize = null

    for (const pipeSize of PIPE_SIZES) {
      // Skip smaller sizes
      if (pipeSize.mm <= currentSizeMM) {
        continue
      }

      // Calculate velocity with this size
      const velocity = this.calculateVelocity(flowM3S, pipeSize.internalDiameterM)
      const frictionLoss = this.calculateFrictionLossRate(
        flowM3S,
        pipeSize.internalDiameterM,
        cFactor
      )

      // Check if this size works
      const newStatus = this.determineStatus(velocity, frictionLoss)
      if (newStatus === 'OK' || newStatus === 'WARNING') {
        suggestedSize = {
          mm: pipeSize.mm,
          inches: pipeSize.inches,
          internalDiameter: pipeSize.internalDiameterM,
        }
        break
      }
    }

    return suggestedSize
  }

  /**
   * Generate reason for suggestion
   */
  private generateReason(
    status: 'OK' | 'WARNING' | 'CRITICAL',
    velocity: number,
    frictionLoss: number,
    hasSuggestion: boolean
  ): string {
    const reasons: string[] = []

    if (velocity < 1.2) {
      reasons.push(`velocity too low (${velocity.toFixed(2)} m/s, minimum 1.2 m/s)`)
    } else if (velocity > 2.4) {
      reasons.push(`velocity too high (${velocity.toFixed(2)} m/s, maximum 2.4 m/s)`)
    }

    if (frictionLoss > 5) {
      reasons.push(`friction loss excessive (${frictionLoss.toFixed(2)} m/100m, maximum 5 m/100m)`)
    }

    if (reasons.length === 0) {
      return 'All parameters within acceptable range'
    }

    if (!hasSuggestion) {
      if (status === 'OK') {
        return 'All parameters within acceptable range'
      }
      return 'Issue detected: ' + reasons.join(', ')
    }

    return 'Suggest upsizing due to: ' + reasons.join(', ')
  }

  /**
   * Generate warnings
   */
  private generateWarnings(
    status: 'OK' | 'WARNING' | 'CRITICAL',
    velocity: number,
    frictionLoss: number
  ): string[] {
    const warnings: string[] = []

    if (velocity < 0.6) {
      warnings.push('CRITICAL: Velocity extremely low - risk of sedimentation')
    } else if (velocity < 1.2) {
      warnings.push('WARNING: Velocity below minimum - may cause sedimentation')
    } else if (velocity > 3.0) {
      warnings.push('CRITICAL: Velocity extremely high - risk of water hammer and erosion')
    } else if (velocity > 2.4) {
      warnings.push('WARNING: Velocity above maximum - may cause noise and erosion')
    }

    if (frictionLoss > 10) {
      warnings.push('CRITICAL: Friction loss extremely high - pressure drop excessive')
    } else if (frictionLoss > 5) {
      warnings.push('WARNING: Friction loss above recommended - consider larger pipe')
    }

    return warnings
  }

  /**
   * Calculate FU and Hose Bibb count for a pipe segment
   * 🔥 FIX: Only count fixtures directly attached to this pipe's target node
   * Don't trace downstream to avoid double-counting fixtures
   */
  private async calculatePipeFUAndHB(pipeId: number): Promise<{ fu: number; hoseBibbGPM: number }> {
    const pipe = await prisma.pipe.findUnique({
      where: { id: pipeId },
      include: {
        targetNode: true,
      },
    })

    if (!pipe) {
      throw new Error('Pipe not found')
    }

    // Get fixtures at this node ONLY (don't trace downstream)
    const fixtures = await prisma.fixture.findMany({
      where: { nodeId: pipe.targetNodeId },
    })

    let fu = 0
    let hoseBibbCount = 0

    fixtures.forEach(fixture => {
      const fixtureFU = getFixtureUnits(fixture.type as any, 'cold')
      fu += fixtureFU * fixture.quantity

      // Count hose bibbs (they don't add FU but contribute to flow rate)
      if (fixture.type === 'HOSE_BIBB') {
        hoseBibbCount += fixture.quantity || 1
      }
    })

    // 🔥 FIX: Don't trace downstream anymore - each pipe counts only its own fixtures
    // This prevents double-counting fixtures from child pipes

    // Convert HB count to GPM (5 GPM per HB)
    const hoseBibbGPM = hoseBibbCount * 5

    console.log(`[AutoSuggest] Pipe ${pipeId}: Direct fixtures only - FU=${fu}, HB=${hoseBibbCount}×5=${hoseBibbGPM} GPM`)

    return { fu, hoseBibbGPM }
  }

  /**
   * Analyze single pipe and provide suggestion
   */
  async analyzePipe(pipeId: number, params: {
    systemType: 'FLUSH_TANK' | 'FLUSH_VALVE'
  }): Promise<PipeSuggestion> {
    const pipe = await prisma.pipe.findUnique({
      where: { id: pipeId },
      include: {
        sourceNode: true,
        targetNode: true,
      },
    })

    if (!pipe) {
      throw new Error('Pipe not found')
    }

    // Calculate FU and Hose Bibb GPM
    const { fu, hoseBibbGPM } = await this.calculatePipeFUAndHB(pipeId)

    // Convert FU to GPM using Hunter's Curve
    let flowGPM = this.hunterFuToGPM(fu, params.systemType)

    // Add hose bibb GPM (calculated from fixtures)
    flowGPM += hoseBibbGPM

    console.log(`[AutoSuggest] Pipe ${pipeId}: FU=${fu}, HB GPM=${hoseBibbGPM}, Total GPM=${flowGPM}`)

    const flowM3S = this.gpmToM3s(flowGPM)

    // Calculate velocity
    const velocity = this.calculateVelocity(flowM3S, pipe.internalDiameter)

    // Calculate friction loss rate (m/100m)
    const frictionLossRate = this.calculateFrictionLossRate(
      flowM3S,
      pipe.internalDiameter,
      pipe.cFactor
    )

    // Calculate major loss (m.wg)
    const majorLoss = pipe.length * (frictionLossRate / 100)

    // Calculate minor loss (30% of major loss)
    const minorLoss = majorLoss * 0.3

    // Calculate static head (elevation difference)
    const sourceNode = await prisma.node.findUnique({
      where: { id: pipe.sourceNodeId },
      select: { elevation: true }
    })
    const targetNode = await prisma.node.findUnique({
      where: { id: pipe.targetNodeId },
      select: { elevation: true }
    })
    const staticHead = (targetNode?.elevation || 0) - (sourceNode?.elevation || 0)

    // Calculate total loss (m.wg)
    const totalLoss = majorLoss + minorLoss + staticHead

    // Determine status (use frictionLossRate for status check)
    const status = this.determineStatus(velocity, frictionLossRate)

    // Suggest size if needed
    const suggestedSizeRaw = this.suggestSize(
      velocity,
      frictionLossRate,
      parseInt(pipe.nominalSize),
      flowM3S,
      pipe.cFactor
    )

    // Generate reason and warnings
    const reason = this.generateReason(status, velocity, frictionLossRate, !!suggestedSizeRaw)
    const warnings = this.generateWarnings(status, velocity, frictionLossRate)

    // Get pipe size info for display
    const currentPipeSize = PIPE_SIZES.find(p => p.mm === parseInt(pipe.nominalSize))

    return {
      pipeId,
      currentSize: {
        mm: parseInt(pipe.nominalSize),
        inches: currentPipeSize?.inches || 'N/A',
        internalDiameter: pipe.internalDiameter,
      },
      status,
      velocity,
      frictionLoss: frictionLossRate,
      majorLoss,
      minorLoss,
      staticHead,
      totalLoss,
      fixtureUnits: fu,
      flowRate: {
        gpm: flowGPM,
        lps: flowGPM * 0.06309,
        m3s: flowM3S,
      },
      suggestedSize: suggestedSizeRaw || undefined,
      reason,
      warnings,
      sourceNode: pipe.sourceNode ? {
        id: pipe.sourceNode.id,
        label: pipe.sourceNode.label || 'J?',
      } : null,
      targetNode: pipe.targetNode ? {
        id: pipe.targetNode.id,
        label: pipe.targetNode.label || 'ห้องน้ำ',
      } : null,
      isCriticalPath: pipe.isCriticalPath || false,
    }
  }

  /**
   * Analyze all pipes in network
   */
  async analyzeNetwork(networkId: number, params: {
    systemType: 'FLUSH_TANK' | 'FLUSH_VALVE'
  }): Promise<PipeSuggestion[]> {
    const pipes = await prisma.pipe.findMany({
      where: { networkId },
      include: {
        sourceNode: true,
        targetNode: true,
      },
    })

    console.log(`[AutoSuggestService] Found ${pipes.length} pipes for network ${networkId}`)

    const results = await Promise.all(
      pipes.map(pipe => this.analyzePipe(pipe.id, params))
    )

    console.log(`[AutoSuggestService] Analyzed ${results.length} pipes`)

    return results
  }

  /**
   * Apply suggestion for a single pipe
   * @param customSizeMM - Optional custom size in mm (for manual selection from simulation)
   */
  async applySuggestion(
    networkId: number,
    pipeId: number,
    userId: number,
    customSizeMM?: number
  ): Promise<any> {
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

    const pipe = await prisma.pipe.findUnique({
      where: { id: pipeId },
    })

    if (!pipe) {
      throw new Error('Pipe not found')
    }

    // Determine which size to apply
    let sizeToApply: { mm: number; internalDiameter: number }

    if (customSizeMM !== undefined) {
      // User manually selected a size from simulation
      const customPipeSize = PIPE_SIZES.find(p => p.mm === customSizeMM)
      if (!customPipeSize) {
        throw new Error(`Invalid custom size: ${customSizeMM}mm`)
      }

      // Calculate internal diameter for custom size (use existing cFactor)
      const flowM3S = this.gpmToM3s(1) // Dummy flow for velocity calc
      const velocity = this.calculateVelocity(flowM3S, customPipeSize.internalDiameterM)
      const frictionLoss = this.calculateFrictionLossRate(
        flowM3S,
        customPipeSize.internalDiameterM,
        pipe.cFactor
      )

      sizeToApply = {
        mm: customSizeMM,
        internalDiameter: customPipeSize.internalDiameterM,
      }

      console.log(`[AutoSuggest] Applying custom size: ${customSizeMM}mm for pipe ${pipeId}`)
    } else {
      // Use backend-calculated suggestion
      const suggestion = await this.analyzePipe(pipeId, {
        systemType: 'FLUSH_TANK',
      })

      if (!suggestion.suggestedSize) {
        throw new Error('No suggestion available for this pipe')
      }

      sizeToApply = {
        mm: suggestion.suggestedSize.mm,
        internalDiameter: suggestion.suggestedSize.internalDiameter,
      }

      console.log(`[AutoSuggest] Applying suggested size: ${suggestion.suggestedSize.mm}mm for pipe ${pipeId}`)
    }

    // Apply the size
    const updatedPipe = await prisma.pipe.update({
      where: { id: pipeId },
      data: {
        nominalSize: String(sizeToApply.mm),
        internalDiameter: sizeToApply.internalDiameter,
      },
    })

    // Create audit log
    await prisma.auditLog.create({
      data: {
        projectId: network.projectId,
        userId,
        action: customSizeMM !== undefined ? 'APPLY_CUSTOM_SIZE' : 'APPLY_SUGGESTION',
        entity: 'pipe',
        entityId: pipeId,
        details: JSON.stringify({
          oldSize: pipe.nominalSize,
          newSize: sizeToApply.mm,
          source: customSizeMM !== undefined ? 'manual' : 'suggestion',
        }),
      },
    })

    return updatedPipe
  }

  /**
   * Apply all suggestions in network
   */
  async applyAllSuggestions(networkId: number, userId: number): Promise<any[]> {
    // Get all suggestions
    const suggestions = await this.analyzeNetwork(networkId, {
      systemType: 'FLUSH_TANK',
    })

    // Filter only those that need upsizing
    const pipesToUpsize = suggestions.filter(s => s.suggestedSize !== undefined)

    const updatedPipes = []

    for (const suggestion of pipesToUpsize) {
      try {
        const updated = await this.applySuggestion(networkId, suggestion.pipeId, userId)
        updatedPipes.push(updated)
      } catch (error: any) {
        console.error(`Failed to apply suggestion for pipe ${suggestion.pipeId}:`, error.message)
      }
    }

    return updatedPipes
  }
}

export default new AutoSuggestService()
