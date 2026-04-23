// Hybrid Sizing Controller
import { Request, Response } from 'express'
import hybridSizingService from '../services/hybridSizingService'

export class HybridSizingController {
  /**
   * Perform hybrid sizing analysis for a single pipe
   * POST /api/pipes/:pipeId/hybrid-sizing
   */
  async calculateHybridSizing(req: Request, res: Response) {
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
        includeHoseBibb,
        hoseBibbGPM,
      } = req.body

      const result = await hybridSizingService.performHybridSizing(pipeId, {
        systemType: systemType || 'FLUSH_TANK',
        includeHoseBibb,
        hoseBibbGPM,
      })

      res.json({
        success: true,
        data: result,
        message: 'Hybrid sizing analysis completed successfully',
      })
    } catch (error: any) {
      const statusCode = error.message === 'Pipe not found' ? 404 : 500
      res.status(statusCode).json({
        success: false,
        error: {
          code: statusCode === 404 ? 'NOT_FOUND' : 'SERVER_ERROR',
          message: error.message
        },
      })
    }
  }

  /**
   * Perform hybrid sizing for entire network
   * POST /api/networks/:networkId/hybrid-sizing
   */
  async calculateNetworkHybridSizing(req: Request, res: Response) {
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
        includeHoseBibb,
        hoseBibbGPM,
      } = req.body

      const results = await hybridSizingService.performNetworkHybridSizing(networkId, {
        systemType: systemType || 'FLUSH_TANK',
        includeHoseBibb,
        hoseBibbGPM,
      })

      res.json({
        success: true,
        data: results,
        message: `Hybrid sizing analysis completed for ${results.length} pipe(s)`,
      })
    } catch (error: any) {
      const statusCode = error.message === 'Network not found' ? 404 : 500
      res.status(statusCode).json({
        success: false,
        error: {
          code: statusCode === 404 ? 'NOT_FOUND' : 'SERVER_ERROR',
          message: error.message
        },
      })
    }
  }
}

export default new HybridSizingController()
