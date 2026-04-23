import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

async function fixProjectOwnership() {
  try {
    // Get demo user
    const demoUser = await prisma.user.findUnique({
      where: { email: 'demo@example.com' }
    })

    if (!demoUser) {
      console.log('❌ Demo user not found')
      return
    }

    // Update project 9 to belong to demo user
    const updated = await prisma.project.update({
      where: { id: 9 },
      data: { ownerId: demoUser.id }
    })

    console.log('✅ Project 9 now belongs to Demo User!')
    console.log('   Project ID:', updated.id)
    console.log('   Name:', updated.name)
    console.log('   Owner ID:', demoUser.id)
  } catch (error: any) {
    console.error('❌ Error:', error.message)
  } finally {
    await prisma.$disconnect()
  }
}

fixProjectOwnership()
