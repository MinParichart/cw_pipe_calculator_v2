// Calculation Controller
import { Request, Response } from 'express'
import calculationService from '../services/calculationService'

export class CalculationController {
  /**
   * Calculate for a single pipe
   * POST /api/pipes/:pipeId/calculate
   */
  async calculatePipe(req: Request, res: Response) {
    try {
      if (!req.user) {
        return res.status(401).json({
          success: false,
          error: { code: 'UNAUTHORIZED', message: 'Authentication required' },
        })
      }

      const pipeId = parseInt(req.params.pipeId)
      if (isNaN(pipeId)) {
        return res.status(400).json({
          success: false,
          error: { code: 'VALIDATION_ERROR', message: 'Invalid pipe ID' },
        })
      }

      const {
        systemType,
        velocityWarning,
        includeHoseBibb,
        hoseBibbGPM,
        waterFactorAdjustment,
      } = req.body

      const result = await calculationService.calculatePipe(pipeId, {
        systemType: systemType || 'FLUSH_TANK',
        velocityWarning: velocityWarning || 3.0,
        includeHoseBibb,
        hoseBibbGPM,
        waterFactorAdjustment,
      })

      res.json({
        success: true,
        data: result,
        message: 'Calculation completed successfully',
      })
    } catch (error: any) {
      const statusCode = error.message === 'Pipe not found' ? 404 : 500
      res.status(statusCode).json({
        success: false,
        error: { code: statusCode === 404 ? 'NOT_FOUND' : 'SERVER_ERROR', message: error.message },
      })
    }
  }

  /**
   * Calculate for entire network
   * POST /api/networks/:networkId/calculate
   */
  async calculateNetwork(req: Request, res: Response) {
    try {
      if (!req.user) {
        return res.status(401).json({
          success: false,
          error: { code: 'UNAUTHORIZED', message: 'Authentication required' },
        })
      }

      const networkId = parseInt(req.params.networkId)
      if (isNaN(networkId)) {
        return res.status(400).json({
          success: false,
          error: { code: 'VALIDATION_ERROR', message: 'Invalid network ID' },
        })
      }

      const {
        systemType,
        velocityWarning,
        includeHoseBibb,
        hoseBibbGPM,
        waterFactorAdjustment,
      } = req.body

      const results = await calculationService.calculateNetwork(networkId, {
        systemType: systemType || 'FLUSH_TANK',
        velocityWarning: velocityWarning || 3.0,
        includeHoseBibb,
        hoseBibbGPM,
        waterFactorAdjustment,
      })

      res.json({
        success: true,
        data: results,
        message: 'Network calculation completed successfully',
      })
    } catch (error: any) {
      const statusCode = error.message === 'Network not found' ? 404 : 500
      res.status(statusCode).json({
        success: false,
        error: { code: statusCode === 404 ? 'NOT_FOUND' : 'SERVER_ERROR', message: error.message },
      })
    }
  }

  /**
   * Calculate for current network in project
   * POST /api/projects/:projectId/calculation
   */
  async calculateProject(req: Request, res: Response) {
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

      // Import networkService to get current network
      const networkService = (await import('../services/networkService')).default

      // Get current network for this project
      const network = await networkService.getCurrentNetwork(projectId, req.user.userId)

      if (!network) {
        return res.status(404).json({
          success: false,
          error: { code: 'NOT_FOUND', message: 'No network found for this project' },
        })
      }

      const {
        systemType,
        velocityWarning,
        includeHoseBibb,
        hoseBibbGPM,
        waterFactorAdjustment,
      } = req.body

      // Calculate using the current network
      const results = await calculationService.calculateNetwork(network.id, {
        systemType: systemType || 'FLUSH_TANK',
        velocityWarning: velocityWarning || 3.0,
        includeHoseBibb,
        hoseBibbGPM,
        waterFactorAdjustment,
      })

      res.json({
        success: true,
        data: results,
        message: 'Project calculation completed successfully',
      })
    } catch (error: any) {
      const statusCode = error.message === 'Network not found' ? 404 :
                        error.message === 'Access denied' ? 403 : 500
      res.status(statusCode).json({
        success: false,
        error: { code: statusCode === 404 ? 'NOT_FOUND' : statusCode === 403 ? 'FORBIDDEN' : 'SERVER_ERROR', message: error.message },
      })
    }
  }

  /**
   * Calculate Total Dynamic Head (TDH)
   * GET /api/projects/:projectId/tdh
   */
  async calculateTDH(req: Request, res: Response) {
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

      const tdh = await calculationService.calculateTDH(projectId, req.user.userId)

      res.json({ success: true, data: tdh })
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
   * Apply suggested pipe sizes
   * POST /api/networks/:networkId/apply-suggestions
   */
  async applySuggestions(req: Request, res: Response) {
    try {
      if (!req.user) {
        return res.status(401).json({
          success: false,
          error: { code: 'UNAUTHORIZED', message: 'Authentication required' },
        })
      }

      const networkId = parseInt(req.params.networkId)
      if (isNaN(networkId)) {
        return res.status(400).json({
          success: false,
          error: { code: 'VALIDATION_ERROR', message: 'Invalid network ID' },
        })
      }

      const updatedPipes = await calculationService.applySuggestions(networkId, req.user.userId)

      res.json({
        success: true,
        data: updatedPipes,
        message: `Updated ${updatedPipes.length} pipe(s) to suggested sizes`,
      })
    } catch (error: any) {
      const statusCode = error.message === 'Network not found' ? 404 :
                        error.message === 'Access denied' ? 403 : 500
      res.status(statusCode).json({
        success: false,
        error: { code: statusCode === 404 ? 'NOT_FOUND' : 'FORBIDDEN', message: error.message },
      })
    }
  }
}

export default new CalculationController()
