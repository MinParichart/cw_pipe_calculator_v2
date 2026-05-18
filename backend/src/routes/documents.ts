// Document Routes
import express, { NextFunction, Request, Response } from 'express'
import multer from 'multer'
import { DocumentController } from '../controllers/documentController'
import { authenticate } from '../middleware/auth'

const router = express.Router()
const documentController = new DocumentController()

// Configure multer for file uploads
const storage = multer.memoryStorage()
const upload = multer({
  storage,
  limits: {
    fileSize: 10 * 1024 * 1024, // 10MB limit
  },
  fileFilter: (req, file, cb) => {
    // Accept only images (JPEG, PNG, GIF)
    // PDF cannot be used as CSS background image
    const allowedTypes = /jpeg|jpg|png|gif/
    const extname = allowedTypes.test(file.originalname.toLowerCase().split('.').pop() || '')
    const mimetype = /^image\/(jpeg|jpg|png|gif)$/.test(file.mimetype)

    if (extname || mimetype) {
      cb(null, true)
    } else {
      cb(new Error('Blueprint รองรับเฉพาะไฟล์รูปภาพ (JPEG, PNG, GIF) เท่านั้น\nกรุณาแปลง PDF เป็นรูปภาพก่อนอัปโหลด'))
    }
  },
})

// Multer error handler — returns 400 instead of 500 for file filter rejections
const multerErrorHandler = (err: any, req: Request, res: Response, next: NextFunction) => {
  if (err instanceof multer.MulterError || err?.message) {
    return res.status(400).json({ success: false, error: { code: 'INVALID_FILE', message: err.message } })
  }
  next(err)
}

/**
 * @route   GET /api/projects/:projectId/documents
 * @desc    Get all documents for a project
 */
router.get('/projects/:projectId/documents', authenticate, documentController.getDocuments.bind(documentController))

/**
 * @route   POST /api/projects/:projectId/documents
 * @desc    Upload a document
 */
router.post(
  '/projects/:projectId/documents',
  authenticate,
  upload.single('file'),
  multerErrorHandler,
  documentController.uploadDocument.bind(documentController)
)

/**
 * @route   DELETE /api/documents/:id
 * @desc    Delete a document
 */
router.delete('/documents/:id', authenticate, documentController.deleteDocument.bind(documentController))

/**
 * @route   GET /api/versions/:versionId/documents
 * @desc    Get all documents for a version (v2)
 */
router.get('/versions/:versionId/documents', authenticate, documentController.getVersionDocuments.bind(documentController))

/**
 * @route   POST /api/versions/:versionId/documents
 * @desc    Upload a document to a version (v2)
 */
router.post(
  '/versions/:versionId/documents',
  authenticate,
  upload.single('file'),
  multerErrorHandler,
  documentController.uploadVersionDocument.bind(documentController)
)

export default router
