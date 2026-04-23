// Main Routes Index
import express from 'express'
import authRoutes from './auth'
import projectRoutes from './projects'
import networkRoutes from './networks'
import versionRoutes from './versions'
import calculationRoutes from './calculations'
import hybridSizingRoutes from './hybridSizing'
import autoSuggestRoutes from './autoSuggest'
import documentRoutes from './documents'

const router = express.Router()

// Mount routes - ORDER MATTERS!
router.use('/auth', authRoutes)
router.use('/projects', projectRoutes) // MUST be first - matches /projects and /projects/:id
router.use('/', networkRoutes) // Network routes
router.use('/', versionRoutes) // Version routes include /projects prefix
router.use('/', calculationRoutes) // Calculation routes include /projects, /networks prefix
router.use('/', hybridSizingRoutes) // Hybrid sizing routes
router.use('/', autoSuggestRoutes) // Auto suggest routes
router.use('/', documentRoutes) // Document routes

// Health check
router.get('/health', (req, res) => {
  res.json({ status: 'ok', timestamp: new Date().toISOString() })
})

export default router
