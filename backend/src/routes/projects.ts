// Project Routes
import express from 'express'
import projectController from '../controllers/projectController'
import { authenticate } from '../middleware/auth'

const router = express.Router()

/**
 * @route   GET /api/projects
 * @desc    Get all projects for authenticated user
 * @access  Private
 */
router.get('/', authenticate, projectController.getProjects)

/**
 * @route   POST /api/projects
 * @desc    Create new project
 * @access  Private
 */
router.post('/', authenticate, projectController.createProject)

/**
 * @route   GET /api/projects/:id
 * @desc    Get single project by ID
 * @access  Private
 */
router.get('/:id', authenticate, projectController.getProject)

/**
 * @route   PUT /api/projects/:id
 * @desc    Update project
 * @access  Private
 */
router.put('/:id', authenticate, projectController.updateProject)

/**
 * @route   DELETE /api/projects/:id
 * @desc    Delete project
 * @access  Private
 */
router.delete('/:id', authenticate, projectController.deleteProject)

/**
 * @route   POST /api/projects/:id/duplicate
 * @desc    Duplicate project
 * @access  Private
 */
router.post('/:id/duplicate', authenticate, projectController.duplicateProject)

/**
 * @route   GET /api/projects/:id/criteria
 * @desc    Get design criteria
 * @access  Private
 */
router.get('/:id/criteria', authenticate, projectController.getCriteria)

/**
 * @route   PUT /api/projects/:id/criteria
 * @desc    Update design criteria
 * @access  Private
 */
router.put('/:id/criteria', authenticate, projectController.updateCriteria)

export default router
