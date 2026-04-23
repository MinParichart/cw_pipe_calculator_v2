// Hybrid Sizing Routes
import express from 'express'
import hybridSizingController from '../controllers/hybridSizingController'
import { authenticate } from '../middleware/auth'

const router = express.Router()

/**
 * @route   POST /api/pipes/:pipeId/hybrid-sizing
 * @desc    Perform hybrid sizing analysis (Table 2.6 vs Hazen-Williams)
 * @access  Private
 */
router.post('/pipes/:pipeId/hybrid-sizing', authenticate, hybridSizingController.calculateHybridSizing)

/**
 * @route   POST /api/networks/:networkId/hybrid-sizing
 * @desc    Perform hybrid sizing for all pipes in network
 * @access  Private
 */
router.post('/networks/:networkId/hybrid-sizing', authenticate, hybridSizingController.calculateNetworkHybridSizing)

export default router
