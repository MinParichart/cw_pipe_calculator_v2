const { PrismaClient } = require('@prisma/client')
const prisma = new PrismaClient()

async function main() {
  const projects = await prisma.project.findMany({
    include: {
      owner: true,
      networks: true,
    },
  })

  console.log('📊 Projects in Database:', projects.length)
  projects.forEach(p => {
    console.log(`\n🏠 ID: ${p.id}`)
    console.log(`   Name: ${p.name}`)
    console.log(`   Owner: ${p.owner?.email}`)
    console.log(`   Type: ${p.type}`)
    console.log(`   Networks: ${p.networks.length}`)
  })
}

main()
  .catch(console.error)
  .finally(() => prisma.$disconnect())
