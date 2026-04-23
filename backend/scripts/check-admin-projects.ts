import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

async function checkAdminProjects() {
  try {
    // Get admin user
    const adminUser = await prisma.user.findUnique({
      where: { email: 'admin@cw-pipe-calculator.com' }
    })

    if (!adminUser) {
      console.log('❌ Admin user not found')
      return
    }

    console.log('👤 Admin User ID:', adminUser.id)
    console.log('')

    // Get admin's projects
    const adminProjects = await prisma.project.findMany({
      where: { ownerId: adminUser.id },
      select: {
        id: true,
        name: true,
        description: true,
        status: true,
        type: true,
      },
      orderBy: { id: 'asc' }
    })

    if (adminProjects.length === 0) {
      console.log('📁 Admin has no projects. Creating one...')

      const newProject = await prisma.project.create({
        data: {
          name: 'Admin Demo Project',
          description: 'Demo project for admin user',
          ownerId: adminUser.id,
          type: 'RESIDENTIAL',
          status: 'ACTIVE',
        },
      })

      console.log('✅ Created project for admin:')
      console.log('   ID:', newProject.id)
      console.log('   Name:', newProject.name)
      return
    }

    console.log(`📁 Admin has ${adminProjects.length} project(s):`)
    adminProjects.forEach(p => {
      console.log(`   ID: ${p.id}`)
      console.log(`   Name: ${p.name}`)
      console.log(`   Description: ${p.description || 'N/A'}`)
      console.log(`   Status: ${p.status} | Type: ${p.type}`)
      console.log('')
    })
  } catch (error: any) {
    console.error('❌ Error:', error.message)
  } finally {
    await prisma.$disconnect()
  }
}

checkAdminProjects()
