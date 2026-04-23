import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

async function restoreProject9ToAdmin() {
  try {
    // Get admin user
    const adminUser = await prisma.user.findUnique({
      where: { email: 'admin@cw-pipe-calculator.com' }
    })

    if (!adminUser) {
      console.log('❌ Admin user not found')
      return
    }

    // Update project 9 back to admin
    const updated = await prisma.project.update({
      where: { id: 9 },
      data: { ownerId: adminUser.id }
    })

    console.log('✅ Project 9 (บ้านลาดพร้าว 2 ชั้น) restored to Admin!')
    console.log('')
    console.log('📁 Project:', updated.name)
    console.log('   ID:', updated.id)
    console.log('')
    console.log('👤 Owner:', adminUser.name)
    console.log('   Email:', adminUser.email)
    console.log('   User ID:', adminUser.id)
    console.log('')
    console.log('🔑 Login with admin credentials:')
    console.log('   Email: admin@cw-pipe-calculator.com')
    console.log('   Password: admin123')
  } catch (error: any) {
    console.error('❌ Error:', error.message)
  } finally {
    await prisma.$disconnect()
  }
}

restoreProject9ToAdmin()
