import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

async function createHouse2Stories() {
  console.log('🏠 Creating 2-Story House Project...')

  // 1. Find or create user
  let user = await prisma.user.findFirst({
    where: { email: 'demo@example.com' }
  })

  if (!user) {
    const bcrypt = await import('bcryptjs')
    const hashedPassword = await bcrypt.hash('demo123', 10)
    user = await prisma.user.create({
      data: {
        email: 'demo@example.com',
        password: hashedPassword,
        name: 'Demo User',
        role: 'USER',
      },
    })
  }

  // 2. Create project
  const project = await prisma.project.create({
    data: {
      name: 'บ้านพักอาศัย 2 ชั้น',
      description: 'บ้านเดี่ยว 2 ชั้น พร้อมห้องน้ำ 3 ห้อง ครัว 1 ห้อง',
      type: 'RESIDENTIAL',
      status: 'ACTIVE',
      ownerId: user.id,
      criteria: {
        create: {
          velocityMin: 1.2,
          velocityMax: 2.4,
          velocityWarning: 3.0,
          pressureMin: 0.5,
          pressureWarning: 1.0,
          cFactor: 150,
          systemType: 'FLUSH_TANK',
          buildingType: 'APARTMENT',
          staticHead: 6.0,
          residualPressure: 0.35,
        },
      },
    },
  })

  console.log(`✅ Project created: ${project.name} (ID: ${project.id})`)

  // 3. Create network
  const network = await prisma.network.create({
    data: {
      projectId: project.id,
      name: 'Main Plumbing Network',
      isCurrent: true,
      nodes: {
        create: [
          { type: 'SOURCE', x: 50, y: 400, elevation: 0, label: 'ประปาหลัก' },
          { type: 'JUNCTION', x: 200, y: 400, elevation: 0, label: 'แยกชั้น 1' },
          { type: 'JUNCTION', x: 200, y: 200, elevation: 3.0, label: 'แยกชั้น 2' },
          {
            type: 'FIXTURE',
            x: 400,
            y: 350,
            elevation: 0,
            label: 'ห้องน้ำชั้น 1',
            fixtures: { create: [
              { type: 'WC_TANK', quantity: 1 },
              { type: 'LAVATORY', quantity: 1 },
              { type: 'SHOWER', quantity: 1 },
            ]},
          },
          {
            type: 'FIXTURE',
            x: 400,
            y: 150,
            elevation: 3.0,
            label: 'ห้องน้ำชั้น 2',
            fixtures: { create: [
              { type: 'WC_TANK', quantity: 1 },
              { type: 'LAVATORY', quantity: 1 },
              { type: 'BATHTUB', quantity: 1 },
            ]},
          },
        ],
      },
    },
    include: { nodes: true },
  })

  console.log(`✅ Network created with ${network.nodes.length} nodes`)

  // 4. Create pipes
  await prisma.pipe.createMany({
    data: [
      { networkId: network.id, sourceNodeId: 1, targetNodeId: 2, length: 2.0, nominalSize: '25', internalDiameter: 0.0254, material: 'PVC', cFactor: 150, isCriticalPath: true },
      { networkId: network.id, sourceNodeId: 2, targetNodeId: 3, length: 3.5, nominalSize: '25', internalDiameter: 0.0254, material: 'PVC', cFactor: 150, isCriticalPath: true },
      { networkId: network.id, sourceNodeId: 2, targetNodeId: 4, length: 3.0, nominalSize: '20', internalDiameter: 0.0191, material: 'PVC', cFactor: 150, isCriticalPath: true },
      { networkId: network.id, sourceNodeId: 3, targetNodeId: 5, length: 3.0, nominalSize: '20', internalDiameter: 0.0191, material: 'PVC', cFactor: 150, isCriticalPath: true },
    ],
  })

  console.log('✅ Created 4 pipes')

  console.log('\n✨ 2-Story House Project Created Successfully!')
  console.log('\n🔐 Login Credentials:')
  console.log('   Email: demo@example.com')
  console.log('   Password: demo123')
  console.log('\n📍 Access at: http://localhost:3002/dashboard')
}

createHouse2Stories()
  .catch((e) => {
    console.error('❌ Error:', e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })
