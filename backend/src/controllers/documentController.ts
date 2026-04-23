// Document Controller
import { Request, Response } from 'express'
import { DocumentService } from '../services/documentService'

const documentService = new DocumentService()

export class DocumentController {
  /**
   * Get all documents for a project
   */
  async getDocuments(req: Request, res: Response) {
    try {
      const projectId = parseInt(req.params.projectId)
      const userId = (req as any).user?.id

      if (!projectId) {
        return res.status(400).json({
          error: { message: 'Project ID is required', status: 400 }
        })
      }

      // TODO: Check project ownership
      const documents = await documentService.getProjectDocuments(projectId)

      res.json(documents)
    } catch (error: any) {
      console.error('Error fetching documents:', error)
      res.status(500).json({
        error: { message: error.message || 'Failed to fetch documents', status: 500 }
      })
    }
  }

  /**
   * Upload a document
   */
  async uploadDocument(req: Request, res: Response) {
    try {
      console.log('📤 UPLOAD RECEIVED')
      console.log('📤 Params:', req.params)
      console.log('📤 Body:', req.body)
      console.log('📤 File:', req.file ? `${req.file.originalname} (${req.file.size} bytes)` : 'NO FILE')

      const projectId = parseInt(req.params.projectId)

      if (!projectId) {
        console.log('❌ Missing projectId')
        return res.status(400).json({
          error: { message: 'Project ID is required', status: 400 }
        })
      }

      if (!req.file) {
        console.log('❌ No file in request')
        return res.status(400).json({
          error: { message: 'No file uploaded', status: 400 }
        })
      }

      const metadata = {
        floor: req.body.floor || '1',
        type: req.body.type || 'floor_plan',
        scale: req.body.scale || '1:100',
      }

      console.log('📤 Metadata:', metadata)

      const document = await documentService.uploadDocument(
        projectId,
        req.file,
        metadata
      )

      console.log('✅ Upload successful:', document)
      res.status(201).json(document)
    } catch (error: any) {
      console.error('❌ Error uploading document:', error)
      res.status(500).json({
        error: { message: error.message || 'Failed to upload document', status: 500 }
      })
    }
  }

  /**
   * Delete a document
   */
  async deleteDocument(req: Request, res: Response) {
    try {
      const documentId = parseInt(req.params.id)

      if (!documentId) {
        return res.status(400).json({
          error: { message: 'Document ID is required', status: 400 }
        })
      }

      const result = await documentService.deleteDocument(documentId)

      res.json(result)
    } catch (error: any) {
      console.error('Error deleting document:', error)
      res.status(500).json({
        error: { message: error.message || 'Failed to delete document', status: 500 }
      })
    }
  }

  /**
   * Get all documents for a version (v2)
   */
  async getVersionDocuments(req: Request, res: Response) {
    try {
      const versionId = parseInt(req.params.versionId)

      if (!versionId) {
        return res.status(400).json({
          error: { message: 'Version ID is required', status: 400 }
        })
      }

      const documents = await documentService.getVersionDocuments(versionId)

      res.json(documents)
    } catch (error: any) {
      console.error('Error fetching version documents:', error)
      res.status(500).json({
        error: { message: error.message || 'Failed to fetch version documents', status: 500 }
      })
    }
  }

  /**
   * Upload a document to a version (v2)
   */
  async uploadVersionDocument(req: Request, res: Response) {
    try {
      console.log('📤 VERSION UPLOAD RECEIVED')
      console.log('📤 Params:', req.params)
      console.log('📤 Body:', req.body)
      console.log('📤 File:', req.file ? `${req.file.originalname} (${req.file.size} bytes)` : 'NO FILE')

      const versionId = parseInt(req.params.versionId)

      if (!versionId) {
        console.log('❌ Missing versionId')
        return res.status(400).json({
          error: { message: 'Version ID is required', status: 400 }
        })
      }

      if (!req.file) {
        console.log('❌ No file in request')
        return res.status(400).json({
          error: { message: 'No file uploaded', status: 400 }
        })
      }

      const metadata = {
        floor: req.body.floor || '1',
        type: req.body.type || 'floor_plan',
        scale: req.body.scale || '1:100',
      }

      console.log('📤 Metadata:', metadata)

      const document = await documentService.uploadVersionDocument(
        versionId,
        req.file,
        metadata
      )

      console.log('✅ Version upload successful:', document)
      res.status(201).json(document)
    } catch (error: any) {
      console.error('❌ Error uploading version document:', error)
      res.status(500).json({
        error: { message: error.message || 'Failed to upload version document', status: 500 }
      })
    }
  }
}
