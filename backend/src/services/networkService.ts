// Network Service
import prisma from '../config/database'

export class NetworkService {
  /**
   * Get all networks for a project
   */
  async getProjectNetworks(projectId: number, userId: number) {
    // Verify project ownership
    await this.verifyProjectOwnership(projectId, userId)

    const networks = await prisma.network.findMany({
      where: { projectId },
      include: {
        nodes: {
          include: {
            fixtures: true,
          },
        },
        pipes: {
          include: {
            calculations: true,
          },
        },
      },
      orderBy: { updatedAt: 'desc' },
    })

    return networks
  }

  /**
   * Get current network for a project
   */
  async getCurrentNetwork(projectId: number, userId: number) {
    // Verify project ownership
    await this.verifyProjectOwnership(projectId, userId)

    const network = await prisma.network.findFirst({
      where: {
        projectId,
        isCurrent: true,
      },
      include: {
        nodes: {
          include: {
            fixtures: true,
          },
          orderBy: { id: 'asc' },
        },
        pipes: {
          include: {
            sourceNode: true,
            targetNode: true,
            calculations: true,
          },
          orderBy: { id: 'asc' },
        },
      },
    })

    return network
  }

  /**
   * Create new network
   */
  async createNetwork(projectId: number, userId: number, data: {
    name: string
    nodes?: Array<{
      type: 'SOURCE' | 'JUNCTION' | 'FIXTURE' | 'RISER'
      x: number
      y: number
      elevation?: number
      label?: string
    }>
    pipes?: Array<{
      sourceNodeId: number
      targetNodeId: number
      length: number
      nominalSize: string
      internalDiameter: number
      material?: string
      cFactor?: number
    }>
  }) {
    // Verify project ownership
    await this.verifyProjectOwnership(projectId, userId)

    // Set existing networks to non-current
    await prisma.network.updateMany({
      where: { projectId, isCurrent: true },
      data: { isCurrent: false },
    })

    // Create network with nodes and pipes
    const network = await prisma.network.create({
      data: {
        projectId,
        name: data.name,
        isCurrent: true,
        nodes: data.nodes ? {
          create: data.nodes.map(node => ({
            type: node.type,
            x: node.x,
            y: node.y,
            elevation: node.elevation || 0,
            label: node.label,
          })),
        } : undefined,
        pipes: data.pipes ? {
          create: data.pipes.map(pipe => ({
            sourceNodeId: pipe.sourceNodeId,
            targetNodeId: pipe.targetNodeId,
            length: pipe.length,
            nominalSize: pipe.nominalSize,
            internalDiameter: pipe.internalDiameter,
            material: pipe.material || 'PVC',
            cFactor: pipe.cFactor || 150,
          })),
        } : undefined,
      },
      include: {
        nodes: {
          include: {
            fixtures: true,
          },
        },
        pipes: true,
      },
    })

    // Create audit log
    await prisma.auditLog.create({
      data: {
        projectId,
        userId,
        action: 'CREATE',
        entity: 'network',
        entityId: network.id,
      },
    })

    return network
  }

  /**
   * Update network
   */
  async updateNetwork(networkId: number, userId: number, data: {
    name?: string
    isCurrent?: boolean
  }) {
    // Verify ownership through project
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

    // If setting as current, unset others
    if (data.isCurrent) {
      await prisma.network.updateMany({
        where: {
          projectId: network.projectId,
          isCurrent: true,
        },
        data: { isCurrent: false },
      })
    }

    const updated = await prisma.network.update({
      where: { id: networkId },
      data,
      include: {
        nodes: {
          include: {
            fixtures: true,
          },
        },
        pipes: {
          include: {
            calculations: true,
          },
        },
      },
    })

    // Create audit log
    await prisma.auditLog.create({
      data: {
        projectId: network.projectId,
        userId,
        action: 'UPDATE',
        entity: 'network',
        entityId: network.id,
      },
    })

    return updated
  }

  /**
   * Delete network
   */
  async deleteNetwork(networkId: number, userId: number) {
    // Verify ownership through project
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

    await prisma.network.delete({
      where: { id: networkId },
    })

    // Create audit log
    await prisma.auditLog.create({
      data: {
        projectId: network.projectId,
        userId,
        action: 'DELETE',
        entity: 'network',
        entityId: networkId,
      },
    })

    return { success: true }
  }

  /**
   * Add node to network
   */
  async addNode(networkId: number, userId: number, data: {
    type: 'SOURCE' | 'JUNCTION' | 'FIXTURE' | 'RISER'
    x: number
    y: number
    elevation?: number
    label?: string
  }) {
    // Verify ownership
    const network = await this.verifyNetworkOwnership(networkId, userId)

    const node = await prisma.node.create({
      data: {
        networkId,
        type: data.type,
        x: data.x,
        y: data.y,
        elevation: data.elevation || 0,
        label: data.label,
      },
    })

    // Create audit log
    await prisma.auditLog.create({
      data: {
        projectId: network.projectId,
        userId,
        action: 'CREATE',
        entity: 'node',
        entityId: node.id,
      },
    })

    return node
  }

  /**
   * Update node
   */
  async updateNode(nodeId: number, userId: number, data: {
    x?: number
    y?: number
    elevation?: number
    label?: string
  }) {
    // Verify ownership
    const node = await prisma.node.findUnique({
      where: { id: nodeId },
      include: {
        network: {
          include: { project: true },
        },
      },
    })

    if (!node) {
      throw new Error('Node not found')
    }

    if (node.network.project.ownerId !== userId) {
      throw new Error('Access denied')
    }

    const updated = await prisma.node.update({
      where: { id: nodeId },
      data,
    })

    // Create audit log
    await prisma.auditLog.create({
      data: {
        projectId: node.network.projectId,
        userId,
        action: 'UPDATE',
        entity: 'node',
        entityId: nodeId,
      },
    })

    return updated
  }

  /**
   * Delete node
   */
  async deleteNode(nodeId: number, userId: number) {
    // Verify ownership
    const node = await prisma.node.findUnique({
      where: { id: nodeId },
      include: {
        network: {
          include: { project: true },
        },
      },
    })

    if (!node) {
      throw new Error('Node not found')
    }

    if (node.network.project.ownerId !== userId) {
      throw new Error('Access denied')
    }

    await prisma.node.delete({
      where: { id: nodeId },
    })

    // Create audit log
    await prisma.auditLog.create({
      data: {
        projectId: node.network.projectId,
        userId,
        action: 'DELETE',
        entity: 'node',
        entityId: nodeId,
      },
    })

    return { success: true }
  }

  /**
   * Add fixture to node
   */
  async addFixture(nodeId: number, userId: number, data: {
    type: string
    quantity?: number
  }) {
    // Verify ownership
    const node = await prisma.node.findUnique({
      where: { id: nodeId },
      include: {
        network: {
          include: { project: true },
        },
      },
    })

    if (!node) {
      throw new Error('Node not found')
    }

    if (node.network.project.ownerId !== userId) {
      throw new Error('Access denied')
    }

    const fixture = await prisma.fixture.create({
      data: {
        nodeId,
        type: data.type as any,
        quantity: data.quantity || 1,
      },
    })

    // Update network timestamp to ensure fresh data is fetched
    await prisma.network.update({
      where: { id: node.networkId },
      data: { updatedAt: new Date() },
    })

    // Create audit log
    await prisma.auditLog.create({
      data: {
        projectId: node.network.projectId,
        userId,
        action: 'CREATE',
        entity: 'fixture',
        entityId: fixture.id,
      },
    })

    return fixture
  }

  /**
   * Update fixture
   */
  async updateFixture(fixtureId: number, userId: number, data: {
    quantity?: number
  }) {
    // Verify ownership
    const fixture = await prisma.fixture.findUnique({
      where: { id: fixtureId },
      include: {
        node: {
          include: {
            network: {
              include: { project: true },
            },
          },
        },
      },
    })

    if (!fixture) {
      throw new Error('Fixture not found')
    }

    if (fixture.node.network.project.ownerId !== userId) {
      throw new Error('Access denied')
    }

    const updated = await prisma.fixture.update({
      where: { id: fixtureId },
      data,
    })

    // Update network timestamp to ensure fresh data is fetched
    await prisma.network.update({
      where: { id: fixture.node.networkId },
      data: { updatedAt: new Date() },
    })

    // Create audit log
    await prisma.auditLog.create({
      data: {
        projectId: fixture.node.network.projectId,
        userId,
        action: 'UPDATE',
        entity: 'fixture',
        entityId: fixtureId,
      },
    })

    return updated
  }

  /**
   * Delete fixture
   */
  async deleteFixture(fixtureId: number, userId: number) {
    // Verify ownership
    const fixture = await prisma.fixture.findUnique({
      where: { id: fixtureId },
      include: {
        node: {
          include: {
            network: {
              include: { project: true },
            },
          },
        },
      },
    })

    if (!fixture) {
      throw new Error('Fixture not found')
    }

    if (fixture.node.network.project.ownerId !== userId) {
      throw new Error('Access denied')
    }

    await prisma.fixture.delete({
      where: { id: fixtureId },
    })

    // Update network timestamp to ensure fresh data is fetched
    await prisma.network.update({
      where: { id: fixture.node.networkId },
      data: { updatedAt: new Date() },
    })

    // Create audit log
    await prisma.auditLog.create({
      data: {
        projectId: fixture.node.network.projectId,
        userId,
        action: 'DELETE',
        entity: 'fixture',
        entityId: fixtureId,
      },
    })

    return { success: true }
  }

  /**
   * Add pipe to network
   */
  async addPipe(networkId: number, userId: number, data: {
    sourceNodeId: number
    targetNodeId: number
    length: number
    nominalSize: string
    internalDiameter: number
    material?: string
    cFactor?: number
    cornerPoints?: string // ✅ Add cornerPoints
  }) {
    // Verify ownership
    const network = await this.verifyNetworkOwnership(networkId, userId)

    const pipe = await prisma.pipe.create({
      data: {
        networkId,
        sourceNodeId: data.sourceNodeId,
        targetNodeId: data.targetNodeId,
        length: data.length,
        nominalSize: data.nominalSize,
        internalDiameter: data.internalDiameter,
        material: data.material || 'PVC',
        cFactor: data.cFactor || 150,
        cornerPoints: data.cornerPoints || '', // ✅ Include cornerPoints
      },
    })

    // Create audit log
    await prisma.auditLog.create({
      data: {
        projectId: network.projectId,
        userId,
        action: 'CREATE',
        entity: 'pipe',
        entityId: pipe.id,
      },
    })

    return pipe
  }

  /**
   * Update pipe
   */
  async updatePipe(pipeId: number, userId: number, data: {
    length?: number
    nominalSize?: string
    internalDiameter?: number
    material?: string
    cFactor?: number
    isCriticalPath?: boolean
    cornerPoints?: string // ✅ Add cornerPoints
  }) {
    // Verify ownership
    const pipe = await prisma.pipe.findUnique({
      where: { id: pipeId },
      include: {
        network: {
          include: { project: true },
        },
      },
    })

    if (!pipe) {
      throw new Error('Pipe not found')
    }

    if (pipe.network.project.ownerId !== userId) {
      throw new Error('Access denied')
    }

    const updated = await prisma.pipe.update({
      where: { id: pipeId },
      data,
    })

    // Create audit log
    await prisma.auditLog.create({
      data: {
        projectId: pipe.network.projectId,
        userId,
        action: 'UPDATE',
        entity: 'pipe',
        entityId: pipeId,
      },
    })

    return updated
  }

  /**
   * Delete pipe
   */
  async deletePipe(pipeId: number, userId: number) {
    // Verify ownership
    const pipe = await prisma.pipe.findUnique({
      where: { id: pipeId },
      include: {
        network: {
          include: { project: true },
        },
      },
    })

    if (!pipe) {
      throw new Error('Pipe not found')
    }

    if (pipe.network.project.ownerId !== userId) {
      throw new Error('Access denied')
    }

    await prisma.pipe.delete({
      where: { id: pipeId },
    })

    // Create audit log
    await prisma.auditLog.create({
      data: {
        projectId: pipe.network.projectId,
        userId,
        action: 'DELETE',
        entity: 'pipe',
        entityId: pipeId,
      },
    })

    return { success: true }
  }

  /**
   * Find critical path in network
   */
  async findCriticalPath(networkId: number, userId: number) {
    // Verify ownership
    const network = await this.verifyNetworkOwnership(networkId, userId)

    // Get all nodes and pipes
    const nodes = await prisma.node.findMany({
      where: { networkId },
    })

    const pipes = await prisma.pipe.findMany({
      where: { networkId },
      include: {
        calculations: true,
      },
    })

    // Find source node
    const sourceNode = nodes.find(n => n.type === 'SOURCE')
    if (!sourceNode) {
      throw new Error('No source node found')
    }

    // Find all fixture nodes
    const fixtureNodes = nodes.filter(n => n.type === 'FIXTURE')

    // Build adjacency list
    const adj: Map<number, Array<{ nodeId: number; pipeId: number; length: number }>> = new Map()
    nodes.forEach(n => adj.set(n.id, []))
    pipes.forEach(p => {
      const targets = adj.get(p.sourceNodeId) || []
      targets.push({ nodeId: p.targetNodeId, pipeId: p.id, length: p.length })
      adj.set(p.sourceNodeId, targets)
    })

    // Find longest path from source to each fixture using DFS
    const findLongestPath = (startId: number, endId: number) => {
      const visited = new Set<number>()
      const dfs = (currentId: number, path: number[], totalLength: number): { path: number[]; length: number } => {
        if (currentId === endId) {
          return { path: [...path, currentId], length: totalLength }
        }

        let longest: { path: number[]; length: number } = { path: [], length: 0 }

        visited.add(currentId)
        const neighbors = adj.get(currentId) || []

        for (const neighbor of neighbors) {
          if (!visited.has(neighbor.nodeId)) {
            const result = dfs(neighbor.nodeId, [...path, currentId], totalLength + neighbor.length)
            if (result.length > longest.length) {
              longest = result
            }
          }
        }

        visited.delete(currentId)
        return longest
      }

      return dfs(startId, [], 0)
    }

    // Find longest path among all fixture endpoints
    let criticalPath: { path: number[]; length: number; pipeIds: number[] } = {
      path: [],
      length: 0,
      pipeIds: [],
    }

    console.log('=== Finding Critical Path ===')
    console.log(`Source node: ${sourceNode.id}`)
    console.log(`Fixture nodes: ${fixtureNodes.map(n => n.id).join(', ')}`)
    console.log(`Total fixtures: ${fixtureNodes.length}`)

    for (const fixtureNode of fixtureNodes) {
      const result = findLongestPath(sourceNode.id, fixtureNode.id)

      console.log(`Path to fixture ${fixtureNode.id}:`)
      console.log(`  - Nodes: [${result.path.join(', ')}]`)
      console.log(`  - Length: ${result.length.toFixed(2)}m`)
      console.log(`  - Critical path length: ${criticalPath.length.toFixed(2)}m`)

      if (result.length > criticalPath.length) {
        console.log(`  ✓ This is the NEW critical path! (${result.length.toFixed(2)}m > ${criticalPath.length.toFixed(2)}m)`)
        // Get pipe IDs for this path
        const pipeIds: number[] = []
        for (let i = 0; i < result.path.length - 1; i++) {
          const pipe = pipes.find(p =>
            p.sourceNodeId === result.path[i] &&
            p.targetNodeId === result.path[i + 1]
          )
          if (pipe) pipeIds.push(pipe.id)
        }

        criticalPath = {
          path: result.path,
          length: result.length,
          pipeIds,
        }
      }
    }

    console.log('=== Final Critical Path ===')
    console.log(`Selected path: [${criticalPath.path.join(', ')}]`)
    console.log(`Total length: ${criticalPath.length.toFixed(2)}m`)
    console.log(`Pipe IDs: [${criticalPath.pipeIds.join(', ')}]`)
    console.log(`Total pipes marked as critical: ${criticalPath.pipeIds.length}`)

    // Mark pipes in critical path
    if (criticalPath.pipeIds.length > 0) {
      await prisma.pipe.updateMany({
        where: {
          id: { in: criticalPath.pipeIds },
        },
        data: { isCriticalPath: true },
      })

      await prisma.pipe.updateMany({
        where: {
          networkId,
          id: { notIn: criticalPath.pipeIds },
        },
        data: { isCriticalPath: false },
      })
    }

    return {
      nodeIds: criticalPath.path,
      pipeIds: criticalPath.pipeIds,
      totalLength: criticalPath.length,
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

  /**
   * Helper: Verify network ownership
   */
  private async verifyNetworkOwnership(networkId: number, userId: number) {
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

    return network
  }

  /**
   * Get all nodes with fixtures for a network
   */
  async getNetworkNodes(networkId: number, userId: number) {
    // Verify ownership first
    await this.verifyNetworkOwnership(networkId, userId)

    // Get all nodes with fixtures
    const nodes = await prisma.node.findMany({
      where: { networkId },
      include: {
        fixtures: true,
      },
      orderBy: {
        id: 'asc',
      },
    })

    return nodes
  }
}

export default new NetworkService()
