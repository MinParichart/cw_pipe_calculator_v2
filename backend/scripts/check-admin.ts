import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

async function checkAdminUser() {
  try {
    // Get admin user
    const adminUser = await prisma.user.findUnique({
      where: { email: 'admin@cw-pipe-calculator.com' }
    })

    if (!adminUser) {
      console.log('❌ Admin user not found')
      console.log('Creating admin user...')

      const bcrypt = require('bcryptjs')
      const hashedPassword = await bcrypt.hash('admin123', 10)

      const newAdmin = await prisma.user.create({
        data: {
          email: 'admin@cw-pipe-calculator.com',
          password: hashedPassword,
          name: 'Admin User',
          role: 'ADMIN',
        },
      })

      console.log('✅ Admin user created!')
      console.log('   Email: admin@cw-pipe-calculator.com')
      console.log('   Password: admin123')
      console.log('   User ID:', newAdmin.id)
      return
    }

    console.log('✅ Admin user found!')
    console.log('   Email:', adminUser.email)
    console.log('   Name:', adminUser.name)
    console.log('   Role:', adminUser.role)
    console.log('   User ID:', adminUser.id)
    console.log('')
    console.log('🔑 Admin credentials:')
    console.log('   Email: admin@cw-pipe-calculator.com')
    console.log('   Password: admin123')
  } catch (error: any) {
    console.error('❌ Error:', error.message)
  } finally {
    await prisma.$disconnect()
  }
}

checkAdminUser()
