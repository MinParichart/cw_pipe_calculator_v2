import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

async function clearCriticalPaths() {
  try {
    // Reset all critical path flags
    await prisma.pipe.updateMany({
      data: { isCriticalPath: false }
    })
    
    console.log('✅ Cleared all critical path flags')
  } catch (error: any) {
    console.error('❌ Error:', error.message)
  } finally {
    await prisma.$disconnect()
  }
}

clearCriticalPaths()
