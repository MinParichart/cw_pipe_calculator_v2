import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

async function createHouse2Stories() {
  console.log('🏠 Creating 2-Story House Project...')

  // 1. Find or create user
  let user = await prisma.user.findFirst({
    where: { email: 'demo@example.com' }
  })

  if (!user) {
    console.log('Creating demo user...')
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
  console.log('Creating project...')
  const project = await prisma.project.create({
    data: {
      name: 'บ้านพักอาศัย 2 ชั้น',
      description: 'บ้านเดี่ยว 2 ชั้น พร้อมห้องน้ำ 3 ห้อง ครัว 1 ห้อง และระเบียง',
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
  console.log('Creating network...')
  const network = await prisma.network.create({
    data: {
      projectId: project.id,
      name: 'Main Plumbing Network',
      isCurrent: true,
      nodes: {
        create: [
          // Source node (water meter/pump)
          {
            type: 'SOURCE',
            x: 50,
            y: 400,
            elevation: 0,
            label: 'ประปาหลัก (Water Meter)',
          },

          // Ground floor junction
          {
            type: 'JUNCTION',
            x: 200,
            y: 400,
            elevation: 0,
            label: 'แยกชั้น 1 (1F Junction)',
          },

          // 1st floor junction (upstairs)
          {
            type: 'JUNCTION',
            x: 200,
            y: 200,
            elevation: 3.0,
            label: 'แยกชั้น 2 (2F Junction)',
          },

          // Ground floor master bathroom
          {
            type: 'FIXTURE',
            x: 400,
            y: 350,
            elevation: 0,
            label: 'ห้องน้ำชั้น 1 (Master Bath)',
            fixtures: {
              create: [
                { type: 'WC_TANK', quantity: 1 },
                { type: 'LAVATORY', quantity: 1 },
                { type: 'SHOWER', quantity: 1 },
              ],
            },
          },

          // Ground floor guest bathroom
          {
            type: 'FIXTURE',
            x: 400,
            y: 450,
            elevation: 0,
            label: 'ห้องน้ำเก็บของชั้น 1 (Guest Bath)',
            fixtures: {
              create: [
                { type: 'WC_TANK', quantity: 1 },
                { type: 'LAVATORY', quantity: 1 },
              ],
            },
          },

          // Ground floor kitchen
          {
            type: 'FIXTURE',
            x: 400,
            y: 550,
            elevation: 0,
            label: 'ครัวชั้น 1 (Kitchen)',
            fixtures: {
              create: [
                { type: 'KITCHEN_SINK', quantity: 1 },
              ],
            },
          },

          // 2nd floor master bathroom
          {
            type: 'FIXTURE',
            x: 400,
            y: 150,
            elevation: 3.0,
            label: 'ห้องน้ำใหญ่ชั้น 2 (Master Bath 2F)',
            fixtures: {
              create: [
                { type: 'WC_TANK', quantity: 1 },
                { type: 'LAVATORY', quantity: 1 },
                { type: 'BATHTUB', quantity: 1 },
              ],
            },
          },

          // 2nd floor bathroom
          {
            type: 'FIXTURE',
            x: 400,
            y: 250,
            elevation: 3.0,
            label: 'ห้องน้ำชั้น 2 (Bath 2F)',
            fixtures: {
              create: [
                { type: 'WC_TANK', quantity: 1 },
                { type: 'SHOWER', quantity: 1 },
              ],
            },
          },

          // 2nd floor laundry area
          {
            type: 'FIXTURE',
            x: 550,
            y: 200,
            elevation: 3.0,
            label: 'ห้องซักผ้า (Laundry)',
            fixtures: {
              create: [
                { type: 'LAUNDRY_35KG', quantity: 1 },
                { type: 'LAUNDRY_TRAYS', quantity: 1 },
              ],
            },
          },
        ],
      },
    },
  })

  console.log(`✅ Network created: ${network.name} (ID: ${network.id})`)
  console.log(`   Created ${network.nodes.length} nodes`)

  // 4. Create pipes connecting all nodes
  console.log('Creating pipes...')
  const pipes = await prisma.pipe.createMany({
    data: [
      // Main line from source to 1F junction
      {
        networkId: network.id,
        sourceNodeId: 1, // Water meter
        targetNodeId: 2, // 1F junction
        length: 2.0,
        nominalSize: '25',
        internalDiameter: 0.0254,
        material: 'PVC',
        cFactor: 150,
        isCriticalPath: true,
      },

      // Riser from 1F to 2F
      {
        networkId: network.id,
        sourceNodeId: 2, // 1F junction
        targetNodeId: 3, // 2F junction
        length: 3.5,
        nominalSize: '25',
        internalDiameter: 0.0254,
        material: 'PVC',
        cFactor: 150,
        isCriticalPath: true,
      },

      // 1F Master bathroom
      {
        networkId: network.id,
        sourceNodeId: 2, // 1F junction
        targetNodeId: 4, // Master bath 1F
        length: 3.0,
        nominalSize: '20',
        internalDiameter: 0.0191,
        material: 'PVC',
        cFactor: 150,
        isCriticalPath: true,
      },

      // 1F Guest bathroom
      {
        networkId: network.id,
        sourceNodeId: 2, // 1F junction
        targetNodeId: 5, // Guest bath 1F
        length: 2.5,
        nominalSize: '15',
        internalDiameter: 0.0127,
        material: 'PVC',
        cFactor: 150,
        isCriticalPath: false,
      },

      // 1F Kitchen
      {
        networkId: network.id,
        sourceNodeId: 2, // 1F junction
        targetNodeId: 6, // Kitchen 1F
        length: 2.0,
        nominalSize: '15',
        internalDiameter: 0.0127,
        material: 'PVC',
        cFactor: 150,
        isCriticalPath: false,
      },

      // 2F Master bathroom
      {
        networkId: network.id,
        sourceNodeId: 3, // 2F junction
        targetNodeId: 7, // Master bath 2F
        length: 3.0,
        nominalSize: '20',
        internalDiameter: 0.0191,
        material: 'PVC',
        cFactor: 150,
        isCriticalPath: true,
      },

      // 2F Bathroom
      {
        networkId: network.id,
        sourceNodeId: 3, // 2F junction
        targetNodeId: 8, // Bath 2F
        length: 2.5,
        nominalSize: '15',
        internalDiameter: 0.0127,
        material: 'PVC',
        cFactor: 150,
        isCriticalPath: false,
      },

      // 2F Laundry
      {
        networkId: network.id,
        sourceNodeId: 3, // 2F junction
        targetNodeId: 9, // Laundry
        length: 4.0,
        nominalSize: '15',
        internalDiameter: 0.0127,
        material: 'PVC',
        cFactor: 150,
        isCriticalPath: false,
      },
    ],
  })

  console.log(`✅ Created ${pipes.count} pipes`)

  // 5. Calculate total fixtures
  const totalNodes = await prisma.node.findMany({
    where: { networkId: network.id, type: 'FIXTURE' },
    include: { fixtures: true },
  })

  let totalWC = 0
  let totalLavatory = 0
  let totalShower = 0
  let totalBathtub = 0
  let totalKitchen = 0
  let totalLaundry = 0

  totalNodes.forEach(node => {
    node.fixtures.forEach(fixture => {
      if (fixture.type === 'WC_TANK') totalWC += fixture.quantity
      if (fixture.type === 'LAVATORY') totalLavatory += fixture.quantity
      if (fixture.type === 'SHOWER') totalShower += fixture.quantity
      if (fixture.type === 'BATHTUB') totalBathtub += fixture.quantity
      if (fixture.type === 'KITCHEN_SINK') totalKitchen += fixture.quantity
      if (fixture.type === 'LAUNDRY_35KG' || fixture.type === 'LAUNDRY_TRAYS') totalLaundry += fixture.quantity
    })
  })

  console.log('\n📊 Project Summary:')
  console.log('   ├─ Water Closets (Flush Tank):', totalWC)
  console.log('   ├─ Lavatories:', totalLavatory)
  console.log('   ├─ Showers:', totalShower)
  console.log('   ├─ Bathtubs:', totalBathtub)
  console.log('   ├─ Kitchen Sinks:', totalKitchen)
  console.log('   └─ Laundry Fixtures:', totalLaundry)

  console.log('\n✨ 2-Story House Project Created Successfully!')
  console.log('\n🔐 Login Credentials:')
  console.log('   Email: demo@example.com')
  console.log('   Password: demo123')
  console.log('\n📍 Access the project at:')
  console.log(`   http://localhost:3002/dashboard`)
  console.log(`   → Select project: "${project.name}"`)
  console.log(`   → Go to Network Builder or Calculator`)

  return { project, network }
}

createHouse2Stories()
  .catch((e) => {
    console.error('❌ Error creating project:', e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })
