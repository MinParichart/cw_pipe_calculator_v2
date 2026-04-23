// Auto Suggest Routes
import express from 'express'
import autoSuggestController from '../controllers/autoSuggestController'
import { authenticate } from '../middleware/auth'

const router = express.Router()

/**
 * @route   GET /api/networks/:networkId/auto-suggest
 * @desc    Get auto-suggest analysis for all pipes in network
 * @access  Private
 */
router.get('/networks/:networkId/auto-suggest', authenticate, autoSuggestController.getAutoSuggest)

/**
 * @route   POST /api/networks/:networkId/auto-suggest/:pipeId/apply
 * @desc    Apply suggested size for a single pipe
 * @access  Private
 */
router.post('/networks/:networkId/auto-suggest/:pipeId/apply', authenticate, autoSuggestController.applySingleSuggestion)

/**
 * @route   POST /api/networks/:networkId/auto-suggest/apply-all
 * @desc    Apply suggested sizes for all pipes in network
 * @access  Private
 */
router.post('/networks/:networkId/auto-suggest/apply-all', authenticate, autoSuggestController.applyAllSuggestions)

export default router
