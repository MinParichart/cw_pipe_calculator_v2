// Version Routes
import express from 'express'
import versionController from '../controllers/versionController'
import { authenticate } from '../middleware/auth'

const router = express.Router()

/**
 * @route   GET /api/projects/:projectId/versions
 * @desc    Get all versions for a project
 * @access  Private
 */
router.get('/projects/:projectId/versions', authenticate, versionController.getVersions)

/**
 * @route   POST /api/projects/:projectId/versions
 * @desc    Create new version (snapshot)
 * @access  Private
 */
router.post('/projects/:projectId/versions', authenticate, versionController.createVersion)

/**
 * @route   GET /api/versions/:versionId
 * @desc    Get version by ID
 * @access  Private
 */
router.get('/versions/:versionId', authenticate, versionController.getVersion)

/**
 * @route   PUT /api/versions/:versionId
 * @desc    Update version
 * @access  Private
 */
router.put('/versions/:versionId', authenticate, versionController.updateVersion)

/**
 * @route   DELETE /api/versions/:versionId
 * @desc    Delete version
 * @access  Private
 */
router.delete('/versions/:versionId', authenticate, versionController.deleteVersion)

/**
 * @route   POST /api/versions/:versionId/duplicate
 * @desc    Duplicate version
 * @access  Private
 */
router.post('/versions/:versionId/duplicate', authenticate, versionController.duplicateVersion)

/**
 * @route   GET /api/versions/compare/:versionId1/:versionId2
 * @desc    Compare two versions
 * @access  Private
 */
router.get('/versions/compare/:versionId1/:versionId2', authenticate, versionController.compareVersions)

/**
 * @route   POST /api/versions/:versionId/restore
 * @desc    Restore version (create new network from snapshot)
 * @access  Private
 */
router.post('/versions/:versionId/restore', authenticate, versionController.restoreVersion)

/**
 * @route   GET /api/projects/:projectId/audit
 * @desc    Get audit logs for a project
 * @access  Private
 */
router.get('/projects/:projectId/audit', authenticate, versionController.getAuditLogs)

/**
 * @route   GET /api/versions/:versionId/audit
 * @desc    Get audit logs for a specific version
 * @access  Private
 */
router.get('/versions/:versionId/audit', authenticate, versionController.getVersionAuditLogs)

/**
 * @route   POST /api/projects/:projectId/versions/:versionId/reference
 * @desc    Upload reference layer to version
 * @access  Private
 */
router.post('/projects/:projectId/versions/:versionId/reference', authenticate, versionController.uploadReference)

/**
 * @route   GET /api/projects/:projectId/versions/:versionId/reference
 * @desc    Get reference layer from version
 * @access  Private
 */
router.get('/projects/:projectId/versions/:versionId/reference', authenticate, versionController.getReference)

export default router
