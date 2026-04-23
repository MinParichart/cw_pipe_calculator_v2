// Project Service
import prisma from '../config/database'

export class ProjectService {
  /**
   * Get all projects for a user
   */
  async getUserProjects(userId: number) {
    const projects = await prisma.project.findMany({
      where: { ownerId: userId },
      include: {
        criteria: {
          select: {
            velocityMin: true,
            velocityMax: true,
            cFactor: true,
            systemType: true,
            buildingType: true,
          },
        },
        _count: {
          select: {
            networks: true,
            versions: true,
          },
        },
      },
      orderBy: { updatedAt: 'desc' },
    })

    return projects.map(project => ({
      id: project.id,
      name: project.name,
      description: project.description,
      createdAt: project.createdAt,
      updatedAt: project.updatedAt,
      criteria: project.criteria,
      networksCount: project._count.networks,
      versionsCount: project._count.versions,
    }))
  }

  /**
   * Get project by ID
   */
  async getProjectById(projectId: number, userId: number) {
    const project = await prisma.project.findUnique({
      where: { id: projectId },
      include: {
        criteria: true,
        networks: {
          where: { isCurrent: true },
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
        },
        versions: {
          orderBy: { versionNumber: 'desc' },
          take: 10,
        },
      },
    })

    if (!project) {
      throw new Error('Project not found')
    }

    // Check ownership
    if (project.ownerId !== userId) {
      throw new Error('Access denied')
    }

    return project
  }

  /**
   * Create new project
   */
  async createProject(userId: number, data: {
    name: string
    description?: string
    type?: 'RESIDENTIAL' | 'COMMERCIAL' | 'INDUSTRIAL'
    status?: 'DRAFT' | 'ACTIVE' | 'COMPLETED' | 'ARCHIVED'
    criteria?: {
      velocityMin?: number
      velocityMax?: number
      velocityWarning?: number
      pressureMin?: number
      pressureWarning?: number
      cFactor?: number
      systemType?: 'FLUSH_TANK' | 'FLUSH_VALVE'
      buildingType?: 'APARTMENT' | 'OFFICE' | 'HOSPITAL' | 'SCHOOL' | 'HOTEL'
      staticHead?: number
      residualPressure?: number
    }
  }) {
    const project = await prisma.project.create({
      data: {
        name: data.name,
        description: data.description,
        type: data.type || 'RESIDENTIAL',
        status: data.status || 'DRAFT',
        ownerId: userId,
        criteria: data.criteria ? {
          create: data.criteria,
        } : undefined,
      },
      include: {
        criteria: true,
      },
    })

    // Create audit log
    await prisma.auditLog.create({
      data: {
        projectId: project.id,
        userId,
        action: 'CREATE',
        entity: 'project',
        entityId: project.id,
      },
    })

    return project
  }

  /**
   * Update project
   */
  async updateProject(projectId: number, userId: number, data: {
    name?: string
    description?: string
  }) {
    // Check ownership
    const existing = await prisma.project.findUnique({
      where: { id: projectId },
    })

    if (!existing) {
      throw new Error('Project not found')
    }

    if (existing.ownerId !== userId) {
      throw new Error('Access denied')
    }

    const project = await prisma.project.update({
      where: { id: projectId },
      data: {
        ...(data.name && { name: data.name }),
        ...(data.description !== undefined && { description: data.description }),
      },
      include: {
        criteria: true,
      },
    })

    // Create audit log
    await prisma.auditLog.create({
      data: {
        projectId: project.id,
        userId,
        action: 'UPDATE',
        entity: 'project',
        entityId: project.id,
      },
    })

    return project
  }

  /**
   * Delete project
   */
  async deleteProject(projectId: number, userId: number) {
    // Check ownership
    const existing = await prisma.project.findUnique({
      where: { id: projectId },
    })

    if (!existing) {
      throw new Error('Project not found')
    }

    if (existing.ownerId !== userId) {
      throw new Error('Access denied')
    }

    await prisma.project.delete({
      where: { id: projectId },
    })

    return { success: true }
  }

  /**
   * Duplicate project
   */
  async duplicateProject(projectId: number, userId: number) {
    // Get original project
    const original = await this.getProjectById(projectId, userId)

    // Create new project
    const newProject = await prisma.project.create({
      data: {
        name: `${original.name} (Copy)`,
        description: original.description,
        ownerId: userId,
        criteria: original.criteria ? {
          create: {
            velocityMin: original.criteria.velocityMin,
            velocityMax: original.criteria.velocityMax,
            velocityWarning: original.criteria.velocityWarning,
            pressureMin: original.criteria.pressureMin,
            pressureWarning: original.criteria.pressureWarning,
            cFactor: original.criteria.cFactor,
            systemType: original.criteria.systemType,
            buildingType: original.criteria.buildingType,
            blueprintUrl: original.criteria.blueprintUrl,
            blueprintScale: original.criteria.blueprintScale,
            staticHead: original.criteria.staticHead,
            residualPressure: original.criteria.residualPressure,
          },
        } : undefined,
      },
      include: {
        criteria: true,
      },
    })

    // Create audit log
    await prisma.auditLog.create({
      data: {
        projectId: newProject.id,
        userId,
        action: 'DUPLICATE',
        entity: 'project',
        entityId: newProject.id,
        details: JSON.stringify({ originalProjectId: projectId }),
      },
    })

    return newProject
  }

  /**
   * Update design criteria
   */
  async updateDesignCriteria(projectId: number, userId: number, data: any) {
    // Check ownership
    const project = await prisma.project.findUnique({
      where: { id: projectId },
    })

    if (!project) {
      throw new Error('Project not found')
    }

    if (project.ownerId !== userId) {
      throw new Error('Access denied')
    }

    // Map frontend field names to database fields
    const updateData: any = {}

    // Map fields directly
    if (data.velocityMinimum !== undefined) updateData.velocityMin = data.velocityMinimum
    if (data.velocityRecommended !== undefined) updateData.velocityRecommended = data.velocityRecommended
    if (data.velocityMaximum !== undefined) updateData.velocityMax = data.velocityMaximum
    if (data.demandMode !== undefined) updateData.demandMode = data.demandMode
    if (data.minorLossFactor !== undefined) updateData.minorLossFactor = data.minorLossFactor
    if (data.buildingType !== undefined) updateData.buildingType = data.buildingType
    if (data.floors !== undefined) updateData.floors = data.floors

    // Legacy fields support
    if (data.velocityMin !== undefined && data.velocityMinimum === undefined) updateData.velocityMin = data.velocityMin
    if (data.velocityMax !== undefined && data.velocityMaximum === undefined) updateData.velocityMax = data.velocityMax
    if (data.cFactor !== undefined) updateData.cFactor = data.cFactor
    if (data.pvcClass !== undefined) updateData.pvcClass = data.pvcClass
    if (data.systemType !== undefined) updateData.systemType = data.systemType
    if (data.pressureMin !== undefined) updateData.pressureMin = data.pressureMin
    if (data.staticHead !== undefined) updateData.staticHead = data.staticHead

    // Upsert criteria
    const criteria = await prisma.designCriteria.upsert({
      where: { projectId },
      create: {
        projectId,
        ...updateData,
      },
      update: updateData,
    })

    // Create audit log
    await prisma.auditLog.create({
      data: {
        projectId,
        userId,
        action: 'UPDATE',
        entity: 'criteria',
      },
    })

    // Map database fields to frontend field names
    return {
      id: criteria.id,
      projectId: criteria.projectId,
      velocityMinimum: criteria.velocityMin,
      velocityRecommended: criteria.velocityRecommended,
      velocityMaximum: criteria.velocityMax,
      demandMode: criteria.demandMode,
      minorLossFactor: criteria.minorLossFactor,
      buildingType: criteria.buildingType,
      floors: criteria.floors,
      // Legacy fields
      velocityMin: criteria.velocityMin,
      velocityMax: criteria.velocityMax,
      cFactor: criteria.cFactor,
      pvcClass: criteria.pvcClass,
      systemType: criteria.systemType,
      pressureMin: criteria.pressureMin,
      pressureWarning: criteria.pressureWarning,
      staticHead: criteria.staticHead,
      residualPressure: criteria.residualPressure,
    }
  }

  /**
   * Get design criteria
   */
  async getDesignCriteria(projectId: number, userId: number) {
    const project = await prisma.project.findUnique({
      where: { id: projectId },
      include: {
        criteria: true,
      },
    })

    if (!project) {
      throw new Error('Project not found')
    }

    if (project.ownerId !== userId) {
      throw new Error('Access denied')
    }

    if (!project.criteria) {
      return null
    }

    // Map database fields to frontend field names
    return {
      id: project.criteria.id,
      projectId: project.criteria.projectId,
      velocityMinimum: project.criteria.velocityMin,
      velocityRecommended: project.criteria.velocityRecommended,
      velocityMaximum: project.criteria.velocityMax,
      demandMode: project.criteria.demandMode,
      minorLossFactor: project.criteria.minorLossFactor,
      buildingType: project.criteria.buildingType,
      floors: project.criteria.floors,
      // Legacy fields
      velocityMin: project.criteria.velocityMin,
      velocityMax: project.criteria.velocityMax,
      cFactor: project.criteria.cFactor,
      pvcClass: project.criteria.pvcClass,
      systemType: project.criteria.systemType,
      pressureMin: project.criteria.pressureMin,
      pressureWarning: project.criteria.pressureWarning,
      staticHead: project.criteria.staticHead,
      residualPressure: project.criteria.residualPressure,
    }
  }
}

export default new ProjectService()
