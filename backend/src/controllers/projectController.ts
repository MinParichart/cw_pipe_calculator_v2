// Project Controller
import { Request, Response } from 'express'
import projectService from '../services/projectService'

export class ProjectController {
  /**
   * Get all projects for authenticated user
   * GET /api/projects
   */
  async getProjects(req: Request, res: Response) {
    try {
      if (!req.user) {
        return res.status(401).json({
          success: false,
          error: {
            code: 'UNAUTHORIZED',
            message: 'Authentication required',
          },
        })
      }

      const projects = await projectService.getUserProjects(req.user.userId)

      res.json({
        success: true,
        data: projects,
      })
    } catch (error: any) {
      res.status(500).json({
        success: false,
        error: {
          code: 'SERVER_ERROR',
          message: error.message || 'Failed to fetch projects',
        },
      })
    }
  }

  /**
   * Get single project by ID
   * GET /api/projects/:id
   */
  async getProject(req: Request, res: Response) {
    try {
      if (!req.user) {
        return res.status(401).json({
          success: false,
          error: {
            code: 'UNAUTHORIZED',
            message: 'Authentication required',
          },
        })
      }

      const projectId = parseInt(req.params.id)
      if (isNaN(projectId)) {
        return res.status(400).json({
          success: false,
          error: {
            code: 'VALIDATION_ERROR',
            message: 'Invalid project ID',
          },
        })
      }

      const project = await projectService.getProjectById(projectId, req.user.userId)

      res.json({
        success: true,
        data: project,
      })
    } catch (error: any) {
      const statusCode = error.message === 'Project not found' ? 404 : 403
      res.status(statusCode).json({
        success: false,
        error: {
          code: statusCode === 404 ? 'NOT_FOUND' : 'FORBIDDEN',
          message: error.message || 'Failed to fetch project',
        },
      })
    }
  }

  /**
   * Create new project
   * POST /api/projects
   */
  async createProject(req: Request, res: Response) {
    try {
      if (!req.user) {
        return res.status(401).json({
          success: false,
          error: {
            code: 'UNAUTHORIZED',
            message: 'Authentication required',
          },
        })
      }

      const { name, description, criteria } = req.body

      // Validation
      if (!name || name.trim().length === 0) {
        return res.status(400).json({
          success: false,
          error: {
            code: 'VALIDATION_ERROR',
            message: 'Project name is required',
          },
        })
      }

      if (name.length > 100) {
        return res.status(400).json({
          success: false,
          error: {
            code: 'VALIDATION_ERROR',
            message: 'Project name must not exceed 100 characters',
          },
        })
      }

      const project = await projectService.createProject(req.user.userId, {
        name: name.trim(),
        description,
        criteria,
      })

      res.status(201).json({
        success: true,
        data: project,
        message: 'Project created successfully',
      })
    } catch (error: any) {
      res.status(500).json({
        success: false,
        error: {
          code: 'SERVER_ERROR',
          message: error.message || 'Failed to create project',
        },
      })
    }
  }

  /**
   * Update project
   * PUT /api/projects/:id
   */
  async updateProject(req: Request, res: Response) {
    try {
      if (!req.user) {
        return res.status(401).json({
          success: false,
          error: {
            code: 'UNAUTHORIZED',
            message: 'Authentication required',
          },
        })
      }

      const projectId = parseInt(req.params.id)
      if (isNaN(projectId)) {
        return res.status(400).json({
          success: false,
          error: {
            code: 'VALIDATION_ERROR',
            message: 'Invalid project ID',
          },
        })
      }

      const { name, description } = req.body

      // Validation
      if (name && name.trim().length === 0) {
        return res.status(400).json({
          success: false,
          error: {
            code: 'VALIDATION_ERROR',
            message: 'Project name cannot be empty',
          },
        })
      }

      if (name && name.length > 100) {
        return res.status(400).json({
          success: false,
          error: {
            code: 'VALIDATION_ERROR',
            message: 'Project name must not exceed 100 characters',
          },
        })
      }

      const project = await projectService.updateProject(projectId, req.user.userId, {
        name: name?.trim(),
        description,
      })

      res.json({
        success: true,
        data: project,
        message: 'Project updated successfully',
      })
    } catch (error: any) {
      const statusCode = error.message === 'Project not found' ? 404 : 403
      res.status(statusCode).json({
        success: false,
        error: {
          code: statusCode === 404 ? 'NOT_FOUND' : 'FORBIDDEN',
          message: error.message || 'Failed to update project',
        },
      })
    }
  }

  /**
   * Delete project
   * DELETE /api/projects/:id
   */
  async deleteProject(req: Request, res: Response) {
    try {
      if (!req.user) {
        return res.status(401).json({
          success: false,
          error: {
            code: 'UNAUTHORIZED',
            message: 'Authentication required',
          },
        })
      }

      const projectId = parseInt(req.params.id)
      if (isNaN(projectId)) {
        return res.status(400).json({
          success: false,
          error: {
            code: 'VALIDATION_ERROR',
            message: 'Invalid project ID',
          },
        })
      }

      await projectService.deleteProject(projectId, req.user.userId)

      res.json({
        success: true,
        message: 'Project deleted successfully',
      })
    } catch (error: any) {
      const statusCode = error.message === 'Project not found' ? 404 : 403
      res.status(statusCode).json({
        success: false,
        error: {
          code: statusCode === 404 ? 'NOT_FOUND' : 'FORBIDDEN',
          message: error.message || 'Failed to delete project',
        },
      })
    }
  }

  /**
   * Duplicate project
   * POST /api/projects/:id/duplicate
   */
  async duplicateProject(req: Request, res: Response) {
    try {
      if (!req.user) {
        return res.status(401).json({
          success: false,
          error: {
            code: 'UNAUTHORIZED',
            message: 'Authentication required',
          },
        })
      }

      const projectId = parseInt(req.params.id)
      if (isNaN(projectId)) {
        return res.status(400).json({
          success: false,
          error: {
            code: 'VALIDATION_ERROR',
            message: 'Invalid project ID',
          },
        })
      }

      const newProject = await projectService.duplicateProject(projectId, req.user.userId)

      res.status(201).json({
        success: true,
        data: newProject,
        message: 'Project duplicated successfully',
      })
    } catch (error: any) {
      const statusCode = error.message === 'Project not found' ? 404 : 403
      res.status(statusCode).json({
        success: false,
        error: {
          code: statusCode === 404 ? 'NOT_FOUND' : 'FORBIDDEN',
          message: error.message || 'Failed to duplicate project',
        },
      })
    }
  }

  /**
   * Update design criteria
   * PUT /api/projects/:id/criteria
   */
  async updateCriteria(req: Request, res: Response) {
    try {
      if (!req.user) {
        return res.status(401).json({
          success: false,
          error: {
            code: 'UNAUTHORIZED',
            message: 'Authentication required',
          },
        })
      }

      const projectId = parseInt(req.params.id)
      if (isNaN(projectId)) {
        return res.status(400).json({
          success: false,
          error: {
            code: 'VALIDATION_ERROR',
            message: 'Invalid project ID',
          },
        })
      }

      const criteria = await projectService.updateDesignCriteria(
        projectId,
        req.user.userId,
        req.body
      )

      res.json({
        success: true,
        data: criteria,
        message: 'Design criteria updated successfully',
      })
    } catch (error: any) {
      const statusCode = error.message === 'Project not found' ? 404 : 403
      res.status(statusCode).json({
        success: false,
        error: {
          code: statusCode === 404 ? 'NOT_FOUND' : 'FORBIDDEN',
          message: error.message || 'Failed to update design criteria',
        },
      })
    }
  }

  /**
   * Get design criteria
   * GET /api/projects/:id/criteria
   */
  async getCriteria(req: Request, res: Response) {
    try {
      if (!req.user) {
        return res.status(401).json({
          success: false,
          error: {
            code: 'UNAUTHORIZED',
            message: 'Authentication required',
          },
        })
      }

      const projectId = parseInt(req.params.id)
      if (isNaN(projectId)) {
        return res.status(400).json({
          success: false,
          error: {
            code: 'VALIDATION_ERROR',
            message: 'Invalid project ID',
          },
        })
      }

      const criteria = await projectService.getDesignCriteria(projectId, req.user.userId)

      res.json({
        success: true,
        data: criteria,
      })
    } catch (error: any) {
      const statusCode = error.message === 'Project not found' ? 404 : 403
      res.status(statusCode).json({
        success: false,
        error: {
          code: statusCode === 404 ? 'NOT_FOUND' : 'FORBIDDEN',
          message: error.message || 'Failed to fetch design criteria',
        },
      })
    }
  }
}

export default new ProjectController()
