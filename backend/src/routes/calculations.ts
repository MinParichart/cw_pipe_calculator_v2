// Calculation Routes
import express from 'express'
import calculationController from '../controllers/calculationController'
import { authenticate } from '../middleware/auth'

const router = express.Router()

/**
 * @route   POST /api/pipes/:pipeId/calculate
 * @desc    Calculate for a single pipe
 * @access  Private
 */
router.post('/pipes/:pipeId/calculate', authenticate, calculationController.calculatePipe)

/**
 * @route   POST /api/networks/:networkId/calculate
 * @desc    Calculate for entire network
 * @access  Private
 */
router.post('/networks/:networkId/calculate', authenticate, calculationController.calculateNetwork)

/**
 * @route   POST /api/projects/:projectId/calculation
 * @desc    Calculate for current network in project
 * @access  Private
 */
router.post('/projects/:projectId/calculation', authenticate, calculationController.calculateProject)

/**
 * @route   GET /api/projects/:projectId/tdh
 * @desc    Calculate Total Dynamic Head (TDH)
 * @access  Private
 */
router.get('/projects/:projectId/tdh', authenticate, calculationController.calculateTDH)

/**
 * @route   POST /api/networks/:networkId/apply-suggestions
 * @desc    Apply suggested pipe sizes
 * @access  Private
 */
router.post('/networks/:networkId/apply-suggestions', authenticate, calculationController.applySuggestions)

export default router
