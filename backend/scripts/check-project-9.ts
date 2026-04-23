import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

async function checkProject9() {
  try {
    const project = await prisma.project.findUnique({
      where: { id: 9 },
      include: {
        owner: {
          select: {
            id: true,
            email: true,
            name: true,
            role: true,
          }
        }
      }
    })

    if (!project) {
      console.log('❌ Project 9 not found')
      return
    }

    console.log('📁 Project: บ้านลาดพร้าว 2 ชั้น (ID: 9)')
    console.log('')
    console.log('👤 Owner Information:')
    console.log('   User ID:', project.owner.id)
    console.log('   Email:', project.owner.email)
    console.log('   Name:', project.owner.name)
    console.log('   Role:', project.owner.role)
    console.log('')
    console.log('🔑 Login with this account:')
    if (project.owner.email === 'demo@example.com') {
      console.log('   Email: demo@example.com')
      console.log('   Password: demo123')
    } else if (project.owner.email === 'admin@cw-pipe-calculator.com') {
      console.log('   Email: admin@cw-pipe-calculator.com')
      console.log('   Password: admin123')
    }
  } catch (error: any) {
    console.error('❌ Error:', error.message)
  } finally {
    await prisma.$disconnect()
  }
}

checkProject9()
