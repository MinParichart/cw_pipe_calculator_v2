// Auto Suggest Controller
import { Request, Response } from 'express'
import autoSuggestService from '../services/autoSuggestService'

export class AutoSuggestController {
  /**
   * Get auto-suggest analysis for a network
   * GET /api/networks/:networkId/auto-suggest
   */
  async getAutoSuggest(req: Request, res: Response) {
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

      const { systemType } = req.query

      const suggestions = await autoSuggestService.analyzeNetwork(networkId, {
        systemType: (systemType as any) || 'FLUSH_TANK',
      })

      // Count by status
      const summary = {
        total: suggestions.length,
        ok: suggestions.filter(s => s.status === 'OK').length,
        warning: suggestions.filter(s => s.status === 'WARNING').length,
        critical: suggestions.filter(s => s.status === 'CRITICAL').length,
        needsUpsizing: suggestions.filter(s => s.suggestedSize !== undefined).length,
      }

      res.json({
        success: true,
        data: {
          suggestions,
          summary,
        },
        message: `Auto-suggest analysis completed for ${suggestions.length} pipe(s)`,
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

  /**
   * Apply suggestion for a single pipe
   * POST /api/networks/:networkId/auto-suggest/:pipeId/apply
   * @body customSizeMM - Optional custom size in mm (for manual selection from simulation)
   */
  async applySingleSuggestion(req: Request, res: Response) {
    try {
      if (!req.user) {
        return res.status(401).json({
          success: false,
          error: { code: 'UNAUTHORIZED', message: 'Authentication required' },
        })
      }

      const networkId = parseInt(req.params.networkId)
      const pipeId = parseInt(req.params.pipeId)

      if (isNaN(networkId) || isNaN(pipeId)) {
        return res.status(400).json({
          success: false,
          error: { code: 'VALIDATION_ERROR', message: 'Invalid network ID or pipe ID' },
        })
      }

      // Get custom size from request body (optional)
      const { customSizeMM } = req.body

      const updatedPipe = await autoSuggestService.applySuggestion(
        networkId,
        pipeId,
        req.user.userId,
        customSizeMM
      )

      const message = customSizeMM
        ? `Successfully updated pipe ${pipeId} to custom size ${customSizeMM}mm`
        : `Successfully updated pipe ${pipeId} to suggested size`

      res.json({
        success: true,
        data: updatedPipe,
        message,
      })
    } catch (error: any) {
      const statusCode = error.message === 'Network not found' ||
                        error.message === 'Pipe not found' ||
                        error.message === 'No suggestion available for this pipe' ? 404 :
                        error.message === 'Access denied' ? 403 : 500

      const errorCode = statusCode === 404 ? 'NOT_FOUND' :
                       statusCode === 403 ? 'FORBIDDEN' : 'SERVER_ERROR'

      res.status(statusCode).json({
        success: false,
        error: { code: errorCode, message: error.message },
      })
    }
  }

  /**
   * Apply all suggestions in network
   * POST /api/networks/:networkId/auto-suggest/apply-all
   */
  async applyAllSuggestions(req: Request, res: Response) {
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

      const updatedPipes = await autoSuggestService.applyAllSuggestions(
        networkId,
        req.user.userId
      )

      res.json({
        success: true,
        data: updatedPipes,
        message: `Successfully updated ${updatedPipes.length} pipe(s) to suggested sizes`,
      })
    } catch (error: any) {
      const statusCode = error.message === 'Network not found' ? 404 :
                        error.message === 'Access denied' ? 403 : 500

      const errorCode = statusCode === 404 ? 'NOT_FOUND' :
                       statusCode === 403 ? 'FORBIDDEN' : 'SERVER_ERROR'

      res.status(statusCode).json({
        success: false,
        error: { code: errorCode, message: error.message },
      })
    }
  }
}

export default new AutoSuggestController()

