import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

async function checkProjects() {
  try {
    console.log('🔍 Checking all projects...')

    const projects = await prisma.project.findMany({
      include: {
        _count: {
          select: {
            networks: true,
          },
        },
      },
      orderBy: { id: 'desc' },
      take: 10,
    })

    console.log(`Found ${projects.length} recent projects:`)
    projects.forEach((p: any) => {
      console.log(`  - Project ${p.id}: ${p.name} (${p._count.networks} networks)`)
    })

    if (projects.length > 0) {
      const latestProject = projects[0]
      console.log(`\n🔍 Checking networks for project ${latestProject.id} (${latestProject.name})...`)

      const networks = await prisma.network.findMany({
        where: { projectId: latestProject.id },
        include: {
          _count: {
            select: {
              nodes: true,
              pipes: true,
            },
          },
        },
      })

      console.log(`Found ${networks.length} networks:`)
      networks.forEach((n: any) => {
        console.log(`  - Network ${n.id}: ${n.name} (isCurrent: ${n.isCurrent}, nodes: ${n._count.nodes}, pipes: ${n._count.pipes})`)
      })

      if (networks.length > 0) {
        const currentNetwork = networks.find((n: any) => n.isCurrent)
        if (!currentNetwork && networks.length > 0) {
          console.log('\n⚠️  No current network! Setting first network as current...')
          await prisma.network.update({
            where: { id: networks[0].id },
            data: { isCurrent: true },
          })
          console.log('✅ Done!')
        } else if (currentNetwork) {
          console.log(`\n✅ Current network: ${currentNetwork.id} (${currentNetwork.name})`)

          // Check fixtures
          const networkWithFixtures = await prisma.network.findUnique({
            where: { id: currentNetwork.id },
            include: {
              nodes: {
                include: {
                  fixtures: true,
                },
              },
            },
          })

          const totalFixtures = networkWithFixtures?.nodes.reduce((sum, node) =>
            sum + (node.fixtures?.length || 0), 0) || 0

          console.log(`📊 Nodes: ${networkWithFixtures?.nodes.length || 0}, Fixtures: ${totalFixtures}`)

          networkWithFixtures?.nodes.forEach(node => {
            if (node.fixtures && node.fixtures.length > 0) {
              console.log(`  Node ${node.label || node.id} (${node.type}):`)
              node.fixtures.forEach(f => {
                console.log(`    - ${f.type} x${f.quantity}`)
              })
            }
          })
        }
      } else {
        console.log('\n⚠️  No networks found! Creating initial network...')
        const newNetwork = await prisma.network.create({
          data: {
            projectId: latestProject.id,
            name: 'Network 1',
            isCurrent: true,
          },
        })
        console.log(`✅ Created network ${newNetwork.id}`)
      }
    }
  } catch (error) {
    console.error('Error:', error)
  } finally {
    await prisma.$disconnect()
  }
}

checkProjects()
