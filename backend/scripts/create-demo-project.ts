import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

async function createDemoProject() {
  try {
    // Get demo user
    const demoUser = await prisma.user.findUnique({
      where: { email: 'demo@example.com' }
    })

    if (!demoUser) {
      console.log('❌ Demo user not found. Please create demo user first.')
      return
    }

    // Check existing projects
    const existingProjects = await prisma.project.findMany({
      where: { ownerId: demoUser.id },
      select: { id: true, name: true }
    })

    if (existingProjects.length > 0) {
      console.log('✅ Demo user already has projects:')
      existingProjects.forEach(p => {
        console.log(`   - ID: ${p.id}, Name: ${p.name}`)
      })
      return
    }

    // Create demo project
    const project = await prisma.project.create({
      data: {
        name: 'Demo Project - Test',
        description: 'Test project for demo',
        ownerId: demoUser.id,
        type: 'RESIDENTIAL',
        status: 'ACTIVE',
      },
    })

    console.log('✅ Demo project created successfully!')
    console.log('   Project ID:', project.id)
    console.log('   Name:', project.name)
    console.log('   Owner ID:', demoUser.id)
  } catch (error: any) {
    console.error('❌ Error creating demo project:', error.message)
  } finally {
    await prisma.$disconnect()
  }
}

createDemoProject()
