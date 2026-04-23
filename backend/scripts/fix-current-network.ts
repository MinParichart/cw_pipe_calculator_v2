import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

async function fixCurrentNetwork() {
  try {
    console.log('🔍 Checking project 16...')

    // Check if project exists
    const project = await prisma.project.findUnique({
      where: { id: 16 },
    })

    if (!project) {
      console.log('❌ Project 16 not found!')
      return
    }

    console.log(`✅ Project found: ${project.name}`)

    console.log('🔍 Checking networks for project 16...')

    // Get all networks for project 16
    const networks = await prisma.network.findMany({
      where: { projectId: 16 },
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
    networks.forEach(n => {
      console.log(`  - Network ${n.id}: ${n.name} (isCurrent: ${n.isCurrent}, nodes: ${n._count.nodes}, pipes: ${n._count.pipes})`)
    })

    if (networks.length === 0) {
      console.log('⚠️  No networks found for project 16')
      console.log('🔧 Creating initial network...')

      // Create initial network
      const newNetwork = await prisma.network.create({
        data: {
          projectId: 16,
          name: 'Network 1',
          isCurrent: true,
        },
      })

      console.log(`✅ Created network ${newNetwork.id}`)

      // Return the new network
      const networkWithFixtures = await prisma.network.findUnique({
        where: { id: newNetwork.id },
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

      console.log(`📊 Network has ${networkWithFixtures?.nodes.length || 0} nodes and ${totalFixtures} fixtures`)
      return
    }

    // Find current network
    const currentNetwork = networks.find(n => n.isCurrent)

    if (currentNetwork) {
      console.log(`✅ Current network exists: ${currentNetwork.id}`)

      // Check if it has nodes with fixtures
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

      console.log(`📊 Network has ${networkWithFixtures?.nodes.length || 0} nodes and ${totalFixtures} fixtures`)
    } else {
      console.log('⚠️  No current network found!')

      // Set the first network as current
      const firstNetwork = networks[0]
      console.log(`🔧 Setting network ${firstNetwork.id} as current...`)

      await prisma.network.update({
        where: { id: firstNetwork.id },
        data: { isCurrent: true },
      })

      console.log(`✅ Network ${firstNetwork.id} is now current`)

      // Check fixtures after setting as current
      const networkWithFixtures = await prisma.network.findUnique({
        where: { id: firstNetwork.id },
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

      console.log(`📊 Network has ${networkWithFixtures?.nodes.length || 0} nodes and ${totalFixtures} fixtures`)

      // Show fixtures detail
      networkWithFixtures?.nodes.forEach(node => {
        if (node.fixtures && node.fixtures.length > 0) {
          console.log(`  Node ${node.label || node.id}:`)
          node.fixtures.forEach(f => {
            console.log(`    - ${f.type} x${f.quantity}`)
          })
        }
      })
    }
  } catch (error) {
    console.error('Error:', error)
  } finally {
    await prisma.$disconnect()
  }
}

fixCurrentNetwork()
