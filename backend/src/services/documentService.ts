// Document Service
import prisma from '../config/database'
import fs from 'fs/promises'
import path from 'path'

export class DocumentService {
  /**
   * Get all documents for a project
   */
  async getProjectDocuments(projectId: number) {
    const documents = await prisma.document.findMany({
      where: { projectId },
      orderBy: { createdAt: 'desc' },
    })

    return documents.map(doc => ({
      id: doc.id,
      fileName: doc.fileName,
      url: `/uploads/${doc.fileName}`,
      floor: doc.floor,
      type: doc.type,
      scale: doc.scale,
      floorText: this.getFloorText(doc.floor),
      typeText: this.getTypeText(doc.type),
    }))
  }

  /**
   * Upload a document
   */
  async uploadDocument(projectId: number, file: any, metadata: {
    floor: string
    type: string
    scale: string
  }) {
    // Generate unique filename
    const timestamp = Date.now()
    const random = Math.floor(Math.random() * 1000000000)
    const ext = path.extname(file.originalname || file.name)
    const fileName = `blueprint-${timestamp}-${random}${ext}`

    // Save file to uploads directory
    const uploadsDir = path.join(__dirname, '../../uploads')
    await fs.mkdir(uploadsDir, { recursive: true })

    const filePath = path.join(uploadsDir, fileName)

    // Handle both multer file and base64
    if (file.buffer) {
      await fs.writeFile(filePath, file.buffer)
    } else if (file.data) {
      // Base64 string
      const base64Data = file.data.replace(/^data:image\/\w+;base64,/, '')
      await fs.writeFile(filePath, Buffer.from(base64Data, 'base64'))
    }

    // Save to database
    const document = await prisma.document.create({
      data: {
        projectId,
        fileName,
        filePath: `/uploads/${fileName}`,
        floor: metadata.floor,
        type: metadata.type,
        scale: metadata.scale,
      },
    })

    return {
      id: document.id,
      fileName: document.fileName,
      url: document.filePath,
      floor: document.floor,
      type: document.type,
      scale: document.scale,
      floorText: this.getFloorText(document.floor),
      typeText: this.getTypeText(document.type),
    }
  }

  /**
   * Delete a document
   */
  async deleteDocument(documentId: number) {
    const document = await prisma.document.findUnique({
      where: { id: documentId },
    })

    if (!document) {
      throw new Error('Document not found')
    }

    // Delete file from disk
    const filePath = path.join(__dirname, '../../uploads', document.fileName)
    try {
      await fs.unlink(filePath)
    } catch (error) {
      console.warn('Failed to delete file:', error)
    }

    // Delete from database
    await prisma.document.delete({
      where: { id: documentId },
    })

    return { success: true }
  }

  /**
   * Helper: Get floor display text
   */
  private getFloorText(floor: string): string {
    const floorMap: Record<string, string> = {
      '1': 'ชั้น 1',
      '2': 'ชั้น 2',
      '3': 'ชั้น 3',
      'roof': 'ดาดฟ้า',
      'site': 'ไซต์',
      'ground': 'ชั้น 1',
    }
    return floorMap[floor] || floor
  }

  /**
   * Helper: Get type display text
   */
  private getTypeText(type: string): string {
    const typeMap: Record<string, string> = {
      'floor_plan': 'Floor Plan',
      'site_plan': 'Site Plan',
      'elevation': 'Elevation',
      'section': 'Section',
    }
    return typeMap[type] || type
  }
}
