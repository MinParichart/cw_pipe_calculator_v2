import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

async function checkUsers() {
  const users = await prisma.user.findMany()
  console.log('Users in database:')
  console.log(JSON.stringify(users, null, 2))

  if (users.length === 0) {
    console.log('\n❌ No users found! Need to run seed.')
  } else {
    console.log(`\n✅ Found ${users.length} user(s)`)
  }

  await prisma.$disconnect()
}

checkUsers().catch(console.error)
