// Network Routes
import express from 'express'
import networkController from '../controllers/networkController'
import { authenticate } from '../middleware/auth'

const router = express.Router()

/**
 * @route   GET /api/projects/:projectId/networks
 * @desc    Get all networks for a project
 * @access  Private
 */
router.get('/projects/:projectId/networks', authenticate, networkController.getNetworks)

/**
 * @route   GET /api/projects/:projectId/networks/current
 * @desc    Get current network for a project
 * @access  Private
 */
router.get('/projects/:projectId/networks/current', authenticate, networkController.getCurrentNetwork)

/**
 * @route   POST /api/projects/:projectId/networks
 * @desc    Create new network
 * @access  Private
 */
router.post('/projects/:projectId/networks', authenticate, networkController.createNetwork)

/**
 * @route   PUT /api/networks/:networkId
 * @desc    Update network
 * @access  Private
 */
router.put('/networks/:networkId', authenticate, networkController.updateNetwork)

/**
 * @route   DELETE /api/networks/:networkId
 * @desc    Delete network
 * @access  Private
 */
router.delete('/networks/:networkId', authenticate, networkController.deleteNetwork)

/**
 * @route   POST /api/networks/:networkId/critical-path
 * @desc    Find and mark critical path
 * @access  Private
 */
router.post('/networks/:networkId/critical-path', authenticate, networkController.findCriticalPath)

/**
 * @route   GET /api/networks/:networkId/nodes
 * @desc    Get all nodes with fixtures for a network
 * @access  Private
 */
router.get('/networks/:networkId/nodes', authenticate, networkController.getNetworkNodes)

/**
 * @route   POST /api/networks/:networkId/nodes
 * @desc    Add node to network
 * @access  Private
 */
router.post('/networks/:networkId/nodes', authenticate, networkController.addNode)

/**
 * @route   PUT /api/nodes/:nodeId
 * @desc    Update node
 * @access  Private
 */
router.put('/nodes/:nodeId', authenticate, networkController.updateNode)

/**
 * @route   DELETE /api/nodes/:nodeId
 * @desc    Delete node
 * @access  Private
 */
router.delete('/nodes/:nodeId', authenticate, networkController.deleteNode)

/**
 * @route   POST /api/nodes/:nodeId/fixtures
 * @desc    Add fixture to node
 * @access  Private
 */
router.post('/nodes/:nodeId/fixtures', authenticate, networkController.addFixture)

/**
 * @route   PUT /api/fixtures/:fixtureId
 * @desc    Update fixture
 * @access  Private
 */
router.put('/fixtures/:fixtureId', authenticate, networkController.updateFixture)

/**
 * @route   DELETE /api/fixtures/:fixtureId
 * @desc    Delete fixture
 * @access  Private
 */
router.delete('/fixtures/:fixtureId', authenticate, networkController.deleteFixture)

/**
 * @route   POST /api/networks/:networkId/pipes
 * @desc    Add pipe to network
 * @access  Private
 */
router.post('/networks/:networkId/pipes', authenticate, networkController.addPipe)

/**
 * @route   PUT /api/pipes/:pipeId
 * @desc    Update pipe
 * @access  Private
 */
router.put('/pipes/:pipeId', authenticate, networkController.updatePipe)

/**
 * @route   DELETE /api/pipes/:pipeId
 * @desc    Delete pipe
 * @access  Private
 */
router.delete('/pipes/:pipeId', authenticate, networkController.deletePipe)

export default router
