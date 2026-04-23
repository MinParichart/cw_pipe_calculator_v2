// Network Controller
import { Request, Response } from 'express'
import networkService from '../services/networkService'

export class NetworkController {
  /**
   * Get all networks for a project
   * GET /api/projects/:projectId/networks
   */
  async getNetworks(req: Request, res: Response) {
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

      const networks = await networkService.getProjectNetworks(projectId, req.user.userId)

      res.json({ success: true, data: networks })
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
   * Get current network
   * GET /api/projects/:projectId/networks/current
   */
  async getCurrentNetwork(req: Request, res: Response) {
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

      const network = await networkService.getCurrentNetwork(projectId, req.user.userId)

      res.json({ success: true, data: network })
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
   * Create new network
   * POST /api/projects/:projectId/networks
   */
  async createNetwork(req: Request, res: Response) {
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

      const { name, nodes, pipes } = req.body

      if (!name) {
        return res.status(400).json({
          success: false,
          error: { code: 'VALIDATION_ERROR', message: 'Network name is required' },
        })
      }

      const network = await networkService.createNetwork(projectId, req.user.userId, {
        name,
        nodes,
        pipes,
      })

      res.status(201).json({
        success: true,
        data: network,
        message: 'Network created successfully',
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
   * Update network
   * PUT /api/networks/:networkId
   */
  async updateNetwork(req: Request, res: Response) {
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

      const { name, isCurrent } = req.body

      const network = await networkService.updateNetwork(networkId, req.user.userId, {
        name,
        isCurrent,
      })

      res.json({
        success: true,
        data: network,
        message: 'Network updated successfully',
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

  /**
   * Delete network
   * DELETE /api/networks/:networkId
   */
  async deleteNetwork(req: Request, res: Response) {
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

      await networkService.deleteNetwork(networkId, req.user.userId)

      res.json({ success: true, message: 'Network deleted successfully' })
    } catch (error: any) {
      const statusCode = error.message === 'Network not found' ? 404 :
                        error.message === 'Access denied' ? 403 : 500
      res.status(statusCode).json({
        success: false,
        error: { code: statusCode === 404 ? 'NOT_FOUND' : 'FORBIDDEN', message: error.message },
      })
    }
  }

  /**
   * Add node to network
   * POST /api/networks/:networkId/nodes
   */
  async addNode(req: Request, res: Response) {
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

      const { type, x, y, elevation, label } = req.body

      if (!type || x === undefined || y === undefined) {
        return res.status(400).json({
          success: false,
          error: { code: 'VALIDATION_ERROR', message: 'Type, x, and y are required' },
        })
      }

      const node = await networkService.addNode(networkId, req.user.userId, {
        type,
        x,
        y,
        elevation,
        label,
      })

      res.status(201).json({ success: true, data: node })
    } catch (error: any) {
      const statusCode = error.message === 'Network not found' ? 404 :
                        error.message === 'Access denied' ? 403 : 500
      res.status(statusCode).json({
        success: false,
        error: { code: statusCode === 404 ? 'NOT_FOUND' : 'FORBIDDEN', message: error.message },
      })
    }
  }

  /**
   * Update node
   * PUT /api/nodes/:nodeId
   */
  async updateNode(req: Request, res: Response) {
    try {
      if (!req.user) {
        return res.status(401).json({
          success: false,
          error: { code: 'UNAUTHORIZED', message: 'Authentication required' },
        })
      }

      const nodeId = parseInt(req.params.nodeId)
      if (isNaN(nodeId)) {
        return res.status(400).json({
          success: false,
          error: { code: 'VALIDATION_ERROR', message: 'Invalid node ID' },
        })
      }

      const { x, y, elevation, label } = req.body

      const node = await networkService.updateNode(nodeId, req.user.userId, {
        x,
        y,
        elevation,
        label,
      })

      res.json({ success: true, data: node })
    } catch (error: any) {
      const statusCode = error.message === 'Node not found' ? 404 :
                        error.message === 'Access denied' ? 403 : 500
      res.status(statusCode).json({
        success: false,
        error: { code: statusCode === 404 ? 'NOT_FOUND' : 'FORBIDDEN', message: error.message },
      })
    }
  }

  /**
   * Delete node
   * DELETE /api/nodes/:nodeId
   */
  async deleteNode(req: Request, res: Response) {
    try {
      if (!req.user) {
        return res.status(401).json({
          success: false,
          error: { code: 'UNAUTHORIZED', message: 'Authentication required' },
        })
      }

      const nodeId = parseInt(req.params.nodeId)
      if (isNaN(nodeId)) {
        return res.status(400).json({
          success: false,
          error: { code: 'VALIDATION_ERROR', message: 'Invalid node ID' },
        })
      }

      await networkService.deleteNode(nodeId, req.user.userId)

      res.json({ success: true, message: 'Node deleted successfully' })
    } catch (error: any) {
      const statusCode = error.message === 'Node not found' ? 404 :
                        error.message === 'Access denied' ? 403 : 500
      res.status(statusCode).json({
        success: false,
        error: { code: statusCode === 404 ? 'NOT_FOUND' : 'FORBIDDEN', message: error.message },
      })
    }
  }

  /**
   * Add fixture to node
   * POST /api/nodes/:nodeId/fixtures
   */
  async addFixture(req: Request, res: Response) {
    try {
      if (!req.user) {
        return res.status(401).json({
          success: false,
          error: { code: 'UNAUTHORIZED', message: 'Authentication required' },
        })
      }

      const nodeId = parseInt(req.params.nodeId)
      if (isNaN(nodeId)) {
        return res.status(400).json({
          success: false,
          error: { code: 'VALIDATION_ERROR', message: 'Invalid node ID' },
        })
      }

      const { type, quantity } = req.body

      if (!type) {
        return res.status(400).json({
          success: false,
          error: { code: 'VALIDATION_ERROR', message: 'Fixture type is required' },
        })
      }

      const fixture = await networkService.addFixture(nodeId, req.user.userId, {
        type,
        quantity,
      })

      res.status(201).json({ success: true, data: fixture })
    } catch (error: any) {
      const statusCode = error.message === 'Node not found' ? 404 :
                        error.message === 'Access denied' ? 403 : 500
      res.status(statusCode).json({
        success: false,
        error: { code: statusCode === 404 ? 'NOT_FOUND' : 'FORBIDDEN', message: error.message },
      })
    }
  }

  /**
   * Update fixture
   * PUT /api/fixtures/:fixtureId
   */
  async updateFixture(req: Request, res: Response) {
    try {
      if (!req.user) {
        return res.status(401).json({
          success: false,
          error: { code: 'UNAUTHORIZED', message: 'Authentication required' },
        })
      }

      const fixtureId = parseInt(req.params.fixtureId)
      if (isNaN(fixtureId)) {
        return res.status(400).json({
          success: false,
          error: { code: 'VALIDATION_ERROR', message: 'Invalid fixture ID' },
        })
      }

      const { quantity } = req.body

      const fixture = await networkService.updateFixture(fixtureId, req.user.userId, {
        quantity,
      })

      res.json({ success: true, data: fixture })
    } catch (error: any) {
      const statusCode = error.message === 'Fixture not found' ? 404 :
                        error.message === 'Access denied' ? 403 : 500
      res.status(statusCode).json({
        success: false,
        error: { code: statusCode === 404 ? 'NOT_FOUND' : 'FORBIDDEN', message: error.message },
      })
    }
  }

  /**
   * Delete fixture
   * DELETE /api/fixtures/:fixtureId
   */
  async deleteFixture(req: Request, res: Response) {
    try {
      if (!req.user) {
        return res.status(401).json({
          success: false,
          error: { code: 'UNAUTHORIZED', message: 'Authentication required' },
        })
      }

      const fixtureId = parseInt(req.params.fixtureId)
      if (isNaN(fixtureId)) {
        return res.status(400).json({
          success: false,
          error: { code: 'VALIDATION_ERROR', message: 'Invalid fixture ID' },
        })
      }

      await networkService.deleteFixture(fixtureId, req.user.userId)

      res.json({ success: true, message: 'Fixture deleted successfully' })
    } catch (error: any) {
      const statusCode = error.message === 'Fixture not found' ? 404 :
                        error.message === 'Access denied' ? 403 : 500
      res.status(statusCode).json({
        success: false,
        error: { code: statusCode === 404 ? 'NOT_FOUND' : 'FORBIDDEN', message: error.message },
      })
    }
  }

  /**
   * Add pipe to network
   * POST /api/networks/:networkId/pipes
   */
  async addPipe(req: Request, res: Response) {
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

      const { sourceNodeId, targetNodeId, length, nominalSize, internalDiameter, material, cFactor, cornerPoints } = req.body

      if (!sourceNodeId || !targetNodeId || !length || !nominalSize || !internalDiameter) {
        return res.status(400).json({
          success: false,
          error: {
            code: 'VALIDATION_ERROR',
            message: 'sourceNodeId, targetNodeId, length, nominalSize, and internalDiameter are required',
          },
        })
      }

      const pipe = await networkService.addPipe(networkId, req.user.userId, {
        sourceNodeId,
        targetNodeId,
        length,
        nominalSize,
        internalDiameter,
        material,
        cFactor,
        cornerPoints, // ✅ Include cornerPoints
      })

      res.status(201).json({ success: true, data: pipe })
    } catch (error: any) {
      const statusCode = error.message === 'Network not found' ? 404 :
                        error.message === 'Access denied' ? 403 : 500
      res.status(statusCode).json({
        success: false,
        error: { code: statusCode === 404 ? 'NOT_FOUND' : 'FORBIDDEN', message: error.message },
      })
    }
  }

  /**
   * Update pipe
   * PUT /api/pipes/:pipeId
   */
  async updatePipe(req: Request, res: Response) {
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

      const { length, nominalSize, internalDiameter, material, cFactor, isCriticalPath, cornerPoints } = req.body

      const pipe = await networkService.updatePipe(pipeId, req.user.userId, {
        length,
        nominalSize,
        internalDiameter,
        material,
        cFactor,
        isCriticalPath,
        cornerPoints, // ✅ Include cornerPoints
      })

      res.json({ success: true, data: pipe })
    } catch (error: any) {
      const statusCode = error.message === 'Pipe not found' ? 404 :
                        error.message === 'Access denied' ? 403 : 500
      res.status(statusCode).json({
        success: false,
        error: { code: statusCode === 404 ? 'NOT_FOUND' : 'FORBIDDEN', message: error.message },
      })
    }
  }

  /**
   * Delete pipe
   * DELETE /api/pipes/:pipeId
   */
  async deletePipe(req: Request, res: Response) {
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

      await networkService.deletePipe(pipeId, req.user.userId)

      res.json({ success: true, message: 'Pipe deleted successfully' })
    } catch (error: any) {
      const statusCode = error.message === 'Pipe not found' ? 404 :
                        error.message === 'Access denied' ? 403 : 500
      res.status(statusCode).json({
        success: false,
        error: { code: statusCode === 404 ? 'NOT_FOUND' : 'FORBIDDEN', message: error.message },
      })
    }
  }

  /**
   * Find critical path in network
   * POST /api/networks/:networkId/critical-path
   */
  async findCriticalPath(req: Request, res: Response) {
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

      const result = await networkService.findCriticalPath(networkId, req.user.userId)

      res.json({
        success: true,
        data: result,
        message: 'Critical path calculated successfully',
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

  /**
   * Get all nodes with fixtures for a network
   * GET /api/networks/:networkId/nodes
   */
  async getNetworkNodes(req: Request, res: Response) {
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

      const nodes = await networkService.getNetworkNodes(networkId, req.user.userId)

      res.json({
        success: true,
        data: nodes,
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

export default new NetworkController()
