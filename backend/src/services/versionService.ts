// Version Service
import prisma from '../config/database'

export class VersionService {
  /**
   * Get all versions for a project
   */
  async getProjectVersions(projectId: number, userId: number) {
    // Verify ownership
    await this.verifyProjectOwnership(projectId, userId)

    const versions = await prisma.version.findMany({
      where: { projectId },
      orderBy: [{ versionNumber: 'desc' }, { createdAt: 'desc' }],
    })

    return versions
  }

  /**
   * Get version by ID
   */
  async getVersionById(versionId: number, userId: number) {
    const version = await prisma.version.findUnique({
      where: { id: versionId },
      include: {
        project: true,
      },
    })

    if (!version) {
      throw new Error('Version not found')
    }

    if (version.project.ownerId !== userId) {
      throw new Error('Access denied')
    }

    return version
  }

  /**
   * Create new version (snapshot)
   */
  async createVersion(projectId: number, userId: number, data: {
    name: string
    description?: string
  }) {
    // Verify ownership
    await this.verifyProjectOwnership(projectId, userId)

    // Get current network with fresh data (no cache)
    const currentNetwork = await prisma.network.findFirst({
      where: {
        projectId,
        isCurrent: true,
      },
      include: {
        nodes: {
          include: {
            fixtures: {
              // Ensure we get the latest fixture data
              orderBy: { updatedAt: 'desc' },
            },
          },
        },
        pipes: {
          include: {
            calculations: {
              // Ensure we get the latest calculation data
              orderBy: { createdAt: 'desc' },
            },
          },
        },
      },
    })

    // Verify network data is fresh
    if (!currentNetwork) {
      throw new Error('No current network found. Please create a network first.')
    }

    // Verify network has nodes and fixtures
    // Count fixtures by quantity (not just records)
    const totalFixturesByRecords = currentNetwork.nodes?.reduce((sum, node) =>
      sum + (node.fixtures?.length || 0), 0) || 0

    const totalFixturesByQuantity = currentNetwork.nodes?.reduce((sum, node) =>
      sum + (node.fixtures?.reduce((fSum, f) => fSum + (f.quantity || 1), 0) || 0), 0) || 0

    console.log(`[VersionService] Creating version for project ${projectId}`)
    console.log(`[VersionService] Total nodes: ${currentNetwork.nodes?.length || 0}`)
    console.log(`[VersionService] Total fixtures (by records): ${totalFixturesByRecords}`)
    console.log(`[VersionService] Total fixtures (by quantity): ${totalFixturesByQuantity} ✅`)
    console.log(`[VersionService] Total pipes: ${currentNetwork.pipes?.length || 0}`)

    // Get design criteria
    const criteria = await prisma.designCriteria.findUnique({
      where: { projectId },
    })

    // Get latest version number
    const latestVersion = await prisma.version.findFirst({
      where: { projectId },
      orderBy: { versionNumber: 'desc' },
    })

    const newVersionNumber = (latestVersion?.versionNumber || 0) + 1

    // Set previous versions to non-current
    await prisma.version.updateMany({
      where: { projectId, isCurrent: true },
      data: { isCurrent: false },
    })

    // Create version with snapshot
    // Ensure we're capturing the complete network state with all fixtures
    const networkSnapshot = {
      ...currentNetwork,
      nodes: currentNetwork.nodes?.map(node => ({
        ...node,
        fixtures: node.fixtures || [], // Explicitly include fixtures
      })) || [],
      pipes: currentNetwork.pipes?.map(pipe => ({
        ...pipe,
        calculations: pipe.calculations || [], // Explicitly include calculations
      })) || [],
    }

    // Debug: Log snapshot details
    const snapshotFixturesByRecords = networkSnapshot.nodes?.reduce((sum, n) => sum + (n.fixtures?.length || 0), 0) || 0
    const snapshotFixturesByQuantity = networkSnapshot.nodes?.reduce((sum, n) =>
      sum + (n.fixtures?.reduce((fSum, f) => fSum + (f.quantity || 1), 0) || 0), 0) || 0

    console.log(`[VersionService] Creating snapshot with ${networkSnapshot.nodes?.length || 0} nodes`)
    console.log(`[VersionService] Snapshot fixtures (by records): ${snapshotFixturesByRecords}`)
    console.log(`[VersionService] Snapshot fixtures (by quantity): ${snapshotFixturesByQuantity} ✅`)
    console.log(`[VersionService] Snapshot pipes count: ${networkSnapshot.pipes?.length || 0}`)

    // Check for duplicate pipe IDs in snapshot
    const snapshotPipeIds = networkSnapshot.pipes?.map((p: any) => p.id) || []
    const uniqueSnapshotPipeIds = new Set(snapshotPipeIds)
    if (snapshotPipeIds.length !== uniqueSnapshotPipeIds.size) {
      console.log(`[VersionService] ⚠️ DUPLICATE PIPE IDS IN SNAPSHOT!`)
      console.log(`[VersionService]   Total pipes: ${snapshotPipeIds.length}`)
      console.log(`[VersionService]   Unique pipes: ${uniqueSnapshotPipeIds.size}`)
      console.log(`[VersionService]   Duplicates: ${snapshotPipeIds.length - uniqueSnapshotPipeIds.size}`)

      // Show which IDs are duplicated
      const duplicatePipeIds = snapshotPipeIds.filter((id, index) => snapshotPipeIds.indexOf(id) !== index)
      console.log(`[VersionService]   Duplicate pipe IDs:`, [...new Set(duplicatePipeIds)])
    }

    // Log pipes in snapshot
    networkSnapshot.pipes?.forEach((pipe: any) => {
      console.log(`[VersionService]   Pipe ${pipe.id}: ${pipe.sourceNodeId} → ${pipe.targetNodeId} (${pipe.nominalSize})`)
    })

    // Log fixtures per node in snapshot
    networkSnapshot.nodes?.forEach((node: any) => {
      if (node.fixtures && node.fixtures.length > 0) {
        const nodeFixtureCount = node.fixtures.reduce((sum: number, f: any) => sum + (f.quantity || 1), 0)
        console.log(`[VersionService]   Node "${node.label || node.id}" (${node.type}): ${nodeFixtureCount} fixtures (${node.fixtures.length} records)`)
        node.fixtures?.forEach((f: any) => {
          console.log(`[VersionService]     • ${f.type} x${f.quantity || 1}`)
        })
      }
    })

    const version = await prisma.version.create({
      data: {
        projectId,
        name: data.name,
        description: data.description,
        versionNumber: newVersionNumber,
        isCurrent: true,
        createdBy: userId,
        snapshotCriteria: criteria ? JSON.stringify(criteria) : null,
        snapshotNetwork: JSON.stringify(networkSnapshot),
        snapshotResults: currentNetwork ? JSON.stringify(
          currentNetwork.pipes.flatMap(p => p.calculations)
        ) : null,
      },
    })

    // Create audit log
    await prisma.auditLog.create({
      data: {
        projectId,
        userId,
        action: 'SAVE_VERSION',
        entity: 'version',
        entityId: version.id,
      },
    })

    return version
  }

  /**
   * Update version
   */
  async updateVersion(versionId: number, userId: number, data: {
    name?: string
    description?: string
  }) {
    const version = await prisma.version.findUnique({
      where: { id: versionId },
      include: { project: true },
    })

    if (!version) {
      throw new Error('Version not found')
    }

    if (version.project.ownerId !== userId) {
      throw new Error('Access denied')
    }

    const updated = await prisma.version.update({
      where: { id: versionId },
      data,
    })

    // Create audit log
    await prisma.auditLog.create({
      data: {
        projectId: version.projectId,
        userId,
        action: 'UPDATE',
        entity: 'version',
        entityId: versionId,
      },
    })

    return updated
  }

  /**
   * Delete version
   */
  async deleteVersion(versionId: number, userId: number) {
    const version = await prisma.version.findUnique({
      where: { id: versionId },
      include: { project: true },
    })

    if (!version) {
      throw new Error('Version not found')
    }

    if (version.project.ownerId !== userId) {
      throw new Error('Access denied')
    }

    await prisma.version.delete({
      where: { id: versionId },
    })

    // Create audit log
    await prisma.auditLog.create({
      data: {
        projectId: version.projectId,
        userId,
        action: 'DELETE',
        entity: 'version',
        entityId: versionId,
      },
    })

    return { success: true }
  }

  /**
   * Duplicate version
   */
  async duplicateVersion(versionId: number, userId: number) {
    const original = await this.getVersionById(versionId, userId)

    const latestVersion = await prisma.version.findFirst({
      where: { projectId: original.projectId },
      orderBy: { versionNumber: 'desc' },
    })

    const newVersionNumber = (latestVersion?.versionNumber || 0) + 1

    const duplicated = await prisma.version.create({
      data: {
        projectId: original.projectId,
        name: `${original.name} (Copy)`,
        description: original.description,
        versionNumber: newVersionNumber,
        isCurrent: false,
        createdBy: userId,
        snapshotCriteria: original.snapshotCriteria,
        snapshotNetwork: original.snapshotNetwork,
        snapshotResults: original.snapshotResults,
      },
    })

    // Create audit log
    await prisma.auditLog.create({
      data: {
        projectId: original.projectId,
        userId,
        action: 'DUPLICATE',
        entity: 'version',
        entityId: duplicated.id,
        details: JSON.stringify({ originalVersionId: versionId }),
      },
    })

    return duplicated
  }

  /**
   * Compare two versions
   */
  async compareVersions(versionId1: number, versionId2: number, userId: number) {
    const [version1, version2] = await Promise.all([
      this.getVersionById(versionId1, userId),
      this.getVersionById(versionId2, userId),
    ])

    // Verify both versions belong to same project
    if (version1.projectId !== version2.projectId) {
      throw new Error('Versions must belong to the same project')
    }

    // Parse snapshots
    const criteria1 = version1.snapshotCriteria ? JSON.parse(version1.snapshotCriteria) : null
    const criteria2 = version2.snapshotCriteria ? JSON.parse(version2.snapshotCriteria) : null
    const network1 = version1.snapshotNetwork ? JSON.parse(version1.snapshotNetwork) : null
    const network2 = version2.snapshotNetwork ? JSON.parse(version2.snapshotNetwork) : null
    const results1 = version1.snapshotResults ? JSON.parse(version1.snapshotResults) : null
    const results2 = version2.snapshotResults ? JSON.parse(version2.snapshotResults) : null

    // Calculate differences
    const differences = {
      criteria: this.compareObjects(criteria1, criteria2),
      network: this.compareObjects(network1, network2),
      results: this.compareObjects(results1, results2),
    }

    return {
      version1: {
        id: version1.id,
        name: version1.name,
        versionNumber: version1.versionNumber,
        createdAt: version1.createdAt,
      },
      version2: {
        id: version2.id,
        name: version2.name,
        versionNumber: version2.versionNumber,
        createdAt: version2.createdAt,
      },
      differences,
    }
  }

  /**
   * Restore version (create new network from version snapshot)
   */
  async restoreVersion(versionId: number, userId: number) {
    const version = await this.getVersionById(versionId, userId)

    if (!version.snapshotNetwork) {
      throw new Error('No network data found in this version')
    }

    const networkData = JSON.parse(version.snapshotNetwork)

    // Set existing networks to non-current
    await prisma.network.updateMany({
      where: { projectId: version.projectId, isCurrent: true },
      data: { isCurrent: false },
    })

    // Create new network from snapshot
    const restoredNetwork = await prisma.network.create({
      data: {
        projectId: version.projectId,
        name: `${version.name} (Restored)`,
        isCurrent: true,
        versionId: version.id,
        nodes: {
          create: networkData.nodes?.map((node: any) => ({
            type: node.type,
            x: node.x,
            y: node.y,
            elevation: node.elevation,
            label: node.label,
            fixtures: {
              create: node.fixtures?.map((f: any) => ({
                type: f.type,
                quantity: f.quantity,
              })) || [],
            },
          })) || [],
        },
        pipes: {
          create: networkData.pipes?.map((pipe: any) => ({
            sourceNodeId: pipe.sourceNodeId,
            targetNodeId: pipe.targetNodeId,
            length: pipe.length,
            nominalSize: pipe.nominalSize,
            internalDiameter: pipe.internalDiameter,
            material: pipe.material,
            cFactor: pipe.cFactor,
            isCriticalPath: pipe.isCriticalPath,
            calculations: {
              create: pipe.calculations?.map((c: any) => ({
                fixtureUnitsTotal: c.fixtureUnitsTotal,
                flowRateGPM: c.flowRateGPM,
                flowRateLPS: c.flowRateLPS,
                flowRateM3S: c.flowRateM3S,
                velocity: c.velocity,
                velocityHead: c.velocityHead,
                frictionLossRate: c.frictionLossRate,
                majorLoss: c.majorLoss,
                minorLoss: c.minorLoss,
                totalLoss: c.totalLoss,
                suggestedSize: c.suggestedSize,
                status: c.status,
                warnings: c.warnings,
              })) || [],
            },
          })) || [],
        },
      },
      include: {
        nodes: {
          include: { fixtures: true },
        },
        pipes: {
          include: { calculations: true },
        },
      },
    })

    // Create audit log
    await prisma.auditLog.create({
      data: {
        projectId: version.projectId,
        userId,
        action: 'UPDATE',
        entity: 'network',
        entityId: restoredNetwork.id,
        details: JSON.stringify({ restoredFromVersionId: versionId }),
      },
    })

    return restoredNetwork
  }

  /**
   * Get audit logs for a project
   */
  async getAuditLogs(projectId: number, userId: number, limit = 100) {
    // Verify ownership
    await this.verifyProjectOwnership(projectId, userId)

    const logs = await prisma.auditLog.findMany({
      where: { projectId },
      include: {
        user: {
          select: {
            id: true,
            email: true,
            name: true,
          },
        },
      },
      orderBy: { createdAt: 'desc' },
      take: limit,
    })

    return logs
  }

  /**
   * Helper: Compare two objects and return differences
   */
  private compareObjects(obj1: any, obj2: any) {
    if (!obj1 || !obj2) {
      return { hasChanges: obj1 !== obj2, changes: [] }
    }

    const changes: Array<{ path: string; oldValue: any; newValue: any }> = []
    const keys = new Set([...Object.keys(obj1 || {}), ...Object.keys(obj2 || {})])

    keys.forEach(key => {
      if (JSON.stringify(obj1[key]) !== JSON.stringify(obj2[key])) {
        changes.push({
          path: key,
          oldValue: obj1?.[key],
          newValue: obj2?.[key],
        })
      }
    })

    return {
      hasChanges: changes.length > 0,
      changes,
    }
  }

  /**
   * Helper: Verify project ownership
   */
  private async verifyProjectOwnership(projectId: number, userId: number) {
    const project = await prisma.project.findUnique({
      where: { id: projectId },
    })

    if (!project) {
      throw new Error('Project not found')
    }

    if (project.ownerId !== userId) {
      throw new Error('Access denied')
    }

    return project
  }
}

export default new VersionService()
