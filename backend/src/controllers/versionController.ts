// Version Controller
import { Request, Response } from 'express'
import versionService from '../services/versionService'

export class VersionController {
  /**
   * Get all versions for a project
   * GET /api/projects/:projectId/versions
   */
  async getVersions(req: Request, res: Response) {
    try {
      if (!req.user) {
        return res.status(401).json({
          success: false,
          error: { code: 'UNAUTHORIZED', message: 'Authentication required' },
        })
      }

      const projectId = parseInt(req.params.projectId)
      if (isNaN(projectId)) {
        return res.status(400).json({
          success: false,
          error: { code: 'VALIDATION_ERROR', message: 'Invalid project ID' },
        })
      }

      const versions = await versionService.getProjectVersions(projectId, req.user.userId)

      res.json({ success: true, data: versions })
    } catch (error: any) {
      const statusCode = error.message === 'Project not found' ? 404 :
                        error.message === 'Access denied' ? 403 : 500
      res.status(statusCode).json({
        success: false,
        error: { code: statusCode === 404 ? 'NOT_FOUND' : 'FORBIDDEN', message: error.message },
      })
    }
  }

  /**
   * Get version by ID
   * GET /api/versions/:versionId
   */
  async getVersion(req: Request, res: Response) {
    try {
      if (!req.user) {
        return res.status(401).json({
          success: false,
          error: { code: 'UNAUTHORIZED', message: 'Authentication required' },
        })
      }

      const versionId = parseInt(req.params.versionId)
      if (isNaN(versionId)) {
        return res.status(400).json({
          success: false,
          error: { code: 'VALIDATION_ERROR', message: 'Invalid version ID' },
        })
      }

      const version = await versionService.getVersionById(versionId, req.user.userId)

      res.json({ success: true, data: version })
    } catch (error: any) {
      const statusCode = error.message === 'Version not found' ? 404 :
                        error.message === 'Access denied' ? 403 : 500
      res.status(statusCode).json({
        success: false,
        error: { code: statusCode === 404 ? 'NOT_FOUND' : 'FORBIDDEN', message: error.message },
      })
    }
  }

  /**
   * Create new version
   * POST /api/projects/:projectId/versions
   */
  async createVersion(req: Request, res: Response) {
    try {
      if (!req.user) {
        return res.status(401).json({
          success: false,
          error: { code: 'UNAUTHORIZED', message: 'Authentication required' },
        })
      }

      const projectId = parseInt(req.params.projectId)
      if (isNaN(projectId)) {
        return res.status(400).json({
          success: false,
          error: { code: 'VALIDATION_ERROR', message: 'Invalid project ID' },
        })
      }

      const { name, description } = req.body

      if (!name) {
        return res.status(400).json({
          success: false,
          error: { code: 'VALIDATION_ERROR', message: 'Version name is required' },
        })
      }

      const version = await versionService.createVersion(projectId, req.user.userId, {
        name,
        description,
      })

      res.status(201).json({
        success: true,
        data: version,
        message: 'Version saved successfully',
      })
    } catch (error: any) {
      const statusCode = error.message === 'Project not found' ? 404 :
                        error.message === 'Access denied' ? 403 : 500
      res.status(statusCode).json({
        success: false,
        error: { code: statusCode === 404 ? 'NOT_FOUND' : 'FORBIDDEN', message: error.message },
      })
    }
  }

  /**
   * Update version
   * PUT /api/versions/:versionId
   */
  async updateVersion(req: Request, res: Response) {
    try {
      if (!req.user) {
        return res.status(401).json({
          success: false,
          error: { code: 'UNAUTHORIZED', message: 'Authentication required' },
        })
      }

      const versionId = parseInt(req.params.versionId)
      if (isNaN(versionId)) {
        return res.status(400).json({
          success: false,
          error: { code: 'VALIDATION_ERROR', message: 'Invalid version ID' },
        })
      }

      const { name, description, snapshotNetwork, snapshotFixtures, snapshotResults, referenceLayer } = req.body

      const version = await versionService.updateVersion(versionId, req.user.userId, {
        name,
        description,
        snapshotNetwork,
        snapshotFixtures,
        snapshotResults,
        referenceLayer,
      })

      res.json({
        success: true,
        data: version,
        message: 'Version updated successfully',
      })
    } catch (error: any) {
      const statusCode = error.message === 'Version not found' ? 404 :
                        error.message === 'Access denied' ? 403 : 500
      res.status(statusCode).json({
        success: false,
        error: { code: statusCode === 404 ? 'NOT_FOUND' : 'FORBIDDEN', message: error.message },
      })
    }
  }

  /**
   * Delete version
   * DELETE /api/versions/:versionId
   */
  async deleteVersion(req: Request, res: Response) {
    try {
      if (!req.user) {
        return res.status(401).json({
          success: false,
          error: { code: 'UNAUTHORIZED', message: 'Authentication required' },
        })
      }

      const versionId = parseInt(req.params.versionId)
      if (isNaN(versionId)) {
        return res.status(400).json({
          success: false,
          error: { code: 'VALIDATION_ERROR', message: 'Invalid version ID' },
        })
      }

      await versionService.deleteVersion(versionId, req.user.userId)

      res.json({ success: true, message: 'Version deleted successfully' })
    } catch (error: any) {
      const statusCode = error.message === 'Version not found' ? 404 :
                        error.message === 'Access denied' ? 403 : 500
      res.status(statusCode).json({
        success: false,
        error: { code: statusCode === 404 ? 'NOT_FOUND' : 'FORBIDDEN', message: error.message },
      })
    }
  }

  /**
   * Duplicate version
   * POST /api/versions/:versionId/duplicate
   */
  async duplicateVersion(req: Request, res: Response) {
    try {
      if (!req.user) {
        return res.status(401).json({
          success: false,
          error: { code: 'UNAUTHORIZED', message: 'Authentication required' },
        })
      }

      const versionId = parseInt(req.params.versionId)
      if (isNaN(versionId)) {
        return res.status(400).json({
          success: false,
          error: { code: 'VALIDATION_ERROR', message: 'Invalid version ID' },
        })
      }

      const version = await versionService.duplicateVersion(versionId, req.user.userId)

      res.status(201).json({
        success: true,
        data: version,
        message: 'Version duplicated successfully',
      })
    } catch (error: any) {
      const statusCode = error.message === 'Version not found' ? 404 :
                        error.message === 'Access denied' ? 403 : 500
      res.status(statusCode).json({
        success: false,
        error: { code: statusCode === 404 ? 'NOT_FOUND' : 'FORBIDDEN', message: error.message },
      })
    }
  }

  /**
   * Compare two versions
   * GET /api/versions/compare/:versionId1/:versionId2
   */
  async compareVersions(req: Request, res: Response) {
    try {
      if (!req.user) {
        return res.status(401).json({
          success: false,
          error: { code: 'UNAUTHORIZED', message: 'Authentication required' },
        })
      }

      const versionId1 = parseInt(req.params.versionId1)
      const versionId2 = parseInt(req.params.versionId2)

      if (isNaN(versionId1) || isNaN(versionId2)) {
        return res.status(400).json({
          success: false,
          error: { code: 'VALIDATION_ERROR', message: 'Invalid version IDs' },
        })
      }

      const comparison = await versionService.compareVersions(
        versionId1,
        versionId2,
        req.user.userId
      )

      res.json({ success: true, data: comparison })
    } catch (error: any) {
      const statusCode = error.message === 'Version not found' ? 404 :
                        error.message === 'Access denied' ? 403 : 500
      res.status(statusCode).json({
        success: false,
        error: { code: statusCode === 404 ? 'NOT_FOUND' : 'FORBIDDEN', message: error.message },
      })
    }
  }

  /**
   * Restore version
   * POST /api/versions/:versionId/restore
   */
  async restoreVersion(req: Request, res: Response) {
    try {
      if (!req.user) {
        return res.status(401).json({
          success: false,
          error: { code: 'UNAUTHORIZED', message: 'Authentication required' },
        })
      }

      const versionId = parseInt(req.params.versionId)
      if (isNaN(versionId)) {
        return res.status(400).json({
          success: false,
          error: { code: 'VALIDATION_ERROR', message: 'Invalid version ID' },
        })
      }

      const network = await versionService.restoreVersion(versionId, req.user.userId)

      res.json({
        success: true,
        data: network,
        message: 'Version restored successfully',
      })
    } catch (error: any) {
      const statusCode = error.message === 'Version not found' ? 404 :
                        error.message === 'Access denied' ? 403 : 500
      res.status(statusCode).json({
        success: false,
        error: { code: statusCode === 404 ? 'NOT_FOUND' : 'FORBIDDEN', message: error.message },
      })
    }
  }

  /**
   * Get audit logs
   * GET /api/projects/:projectId/audit
   */
  async getAuditLogs(req: Request, res: Response) {
    try {
      if (!req.user) {
        return res.status(401).json({
          success: false,
          error: { code: 'UNAUTHORIZED', message: 'Authentication required' },
        })
      }

      const projectId = parseInt(req.params.projectId)
      const limit = req.query.limit ? parseInt(req.query.limit as string) : 100

      if (isNaN(projectId)) {
        return res.status(400).json({
          success: false,
          error: { code: 'VALIDATION_ERROR', message: 'Invalid project ID' },
        })
      }

      const logs = await versionService.getAuditLogs(projectId, req.user.userId, limit)

      res.json({ success: true, data: logs })
    } catch (error: any) {
      const statusCode = error.message === 'Project not found' ? 404 :
                        error.message === 'Access denied' ? 403 : 500
      res.status(statusCode).json({
        success: false,
        error: { code: statusCode === 404 ? 'NOT_FOUND' : 'FORBIDDEN', message: error.message },
      })
    }
  }

  /**
   * Get audit logs for a specific version
   * GET /api/versions/:versionId/audit
   */
  async getVersionAuditLogs(req: Request, res: Response) {
    try {
      if (!req.user) {
        return res.status(401).json({
          success: false,
          error: { code: 'UNAUTHORIZED', message: 'Authentication required' },
        })
      }

      const versionId = parseInt(req.params.versionId)
      const limit = req.query.limit ? parseInt(req.query.limit as string) : 100

      if (isNaN(versionId)) {
        return res.status(400).json({
          success: false,
          error: { code: 'VALIDATION_ERROR', message: 'Invalid version ID' },
        })
      }

      const logs = await versionService.getVersionAuditLogs(versionId, req.user.userId, limit)

      res.json({ success: true, data: logs })
    } catch (error: any) {
      const statusCode = error.message === 'Version not found' ? 404 :
                        error.message === 'Access denied' ? 403 : 500
      res.status(statusCode).json({
        success: false,
        error: { code: statusCode === 404 ? 'NOT_FOUND' : 'FORBIDDEN', message: error.message },
      })
    }
  }

  /**
   * Upload reference layer to version
   * POST /api/versions/:versionId/reference
   */
  async uploadReference(req: Request, res: Response) {
    try {
      if (!req.user) {
        return res.status(401).json({
          success: false,
          error: { code: 'UNAUTHORIZED', message: 'Authentication required' },
        })
      }

      const versionId = parseInt(req.params.versionId)
      if (isNaN(versionId)) {
        return res.status(400).json({
          success: false,
          error: { code: 'VALIDATION_ERROR', message: 'Invalid version ID' },
        })
      }

      const { fileName, filePath, scale, floor, nodes, walls } = req.body

      if (!fileName || !filePath) {
        return res.status(400).json({
          success: false,
          error: { code: 'VALIDATION_ERROR', message: 'fileName and filePath are required' },
        })
      }

      const version = await versionService.saveReferenceLayer(versionId, req.user.userId, {
        fileName,
        filePath,
        scale,
        floor,
        nodes,
        walls,
      })

      res.json({
        success: true,
        data: version,
        message: 'Reference layer uploaded successfully',
      })
    } catch (error: any) {
      const statusCode = error.message === 'Version not found' ? 404 :
                        error.message === 'Access denied' ? 403 : 500
      res.status(statusCode).json({
        success: false,
        error: { code: statusCode === 404 ? 'NOT_FOUND' : 'FORBIDDEN', message: error.message },
      })
    }
  }

  /**
   * Get reference layer from version
   * GET /api/versions/:versionId/reference
   */
  async getReference(req: Request, res: Response) {
    try {
      if (!req.user) {
        return res.status(401).json({
          success: false,
          error: { code: 'UNAUTHORIZED', message: 'Authentication required' },
        })
      }

      const versionId = parseInt(req.params.versionId)
      if (isNaN(versionId)) {
        return res.status(400).json({
          success: false,
          error: { code: 'VALIDATION_ERROR', message: 'Invalid version ID' },
        })
      }

      const reference = await versionService.getReferenceLayer(versionId, req.user.userId)

      if (!reference) {
        return res.status(404).json({
          success: false,
          error: { code: 'NOT_FOUND', message: 'No reference layer found' },
        })
      }

      res.json({ success: true, data: reference })
    } catch (error: any) {
      const statusCode = error.message === 'Version not found' ? 404 :
                        error.message === 'Access denied' ? 403 : 500
      res.status(statusCode).json({
        success: false,
        error: { code: statusCode === 404 ? 'NOT_FOUND' : 'FORBIDDEN', message: error.message },
      })
    }
  }
}

export default new VersionController()
