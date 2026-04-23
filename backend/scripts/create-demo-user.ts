import { PrismaClient } from '@prisma/client'
import bcrypt from 'bcryptjs'

const prisma = new PrismaClient()

async function createDemoUser() {
  try {
    // Check if demo user exists
    const existing = await prisma.user.findUnique({
      where: { email: 'demo@example.com' }
    })

    if (existing) {
      console.log('✅ Demo user already exists')
      console.log('   Email: demo@example.com')
      console.log('   Password: demo123')
      console.log('   User ID:', existing.id)
      return
    }

    // Create demo user
    const hashedPassword = await bcrypt.hash('demo123', 10)

    const demoUser = await prisma.user.create({
      data: {
        email: 'demo@example.com',
        password: hashedPassword,
        name: 'Demo User',
        role: 'USER',
      },
    })

    console.log('✅ Demo user created successfully!')
    console.log('   Email: demo@example.com')
    console.log('   Password: demo123')
    console.log('   User ID:', demoUser.id)
  } catch (error: any) {
    console.error('❌ Error creating demo user:', error.message)
  } finally {
    await prisma.$disconnect()
  }
}

createDemoUser()
