import { PrismaClient } from '@prisma/client'
import bcrypt from 'bcryptjs'

const prisma = new PrismaClient()

// Type definitions (since we use strings now)
type UserRole = 'ADMIN' | 'USER'
type SystemType = 'FLUSH_TANK' | 'FLUSH_VALVE'
type BuildingType = 'APARTMENT' | 'OFFICE' | 'HOSPITAL' | 'SCHOOL' | 'HOTEL'
type NodeType = 'SOURCE' | 'JUNCTION' | 'FIXTURE' | 'RISER'
type FixtureType = 'WC_TANK' | 'WC_VALVE' | 'LAVATORY' | 'BATHTUB' | 'SHOWER' | 'KITCHEN_SINK' | 'LAUNDRY_TRAYS' | 'DISHWASHER' | 'LAUNDRY_35KG' | 'LAUNDRY_7KG' | 'HOSE_BIBB' | 'DRINKING_FOUNTAIN' | 'URINAL_VALVE' | 'SERVICE_SINK'
type ProjectType = 'RESIDENTIAL' | 'COMMERCIAL' | 'INDUSTRIAL'
type ProjectStatus = 'DRAFT' | 'ACTIVE' | 'COMPLETED' | 'ARCHIVED'

async function main() {
  console.log('🌱 Starting seed...')

  // 1. Create admin user
  console.log('👤 Creating admin user...')
  const adminPassword = await bcrypt.hash('admin123', 10)
  const admin = await prisma.user.upsert({
    where: { id: 1 },
    update: {},
    create: {
      id: 1,
      email: 'admin@cw-pipe-calculator.com',
      password: adminPassword,
      name: 'System Administrator',
      role: 'ADMIN' as UserRole,
    },
  })
  console.log(`✅ Admin user created: ${admin.email}`)

  // 2. Create demo user
  console.log('👤 Creating demo user...')
  const demoPassword = await bcrypt.hash('demo123', 10)
  const demoUser = await prisma.user.upsert({
    where: { id: 2 },
    update: {},
    create: {
      id: 2,
      email: 'demo@example.com',
      password: demoPassword,
      name: 'Demo User',
      role: 'USER' as UserRole,
    },
  })
  console.log(`✅ Demo user created: ${demoUser.email}`)

  // 3. Create demo project
  console.log('📁 Creating demo project...')
  const project = await prisma.project.upsert({
    where: { id: 1 },
    update: {},
    create: {
      id: 1,
      name: 'Demo Project - Single Room',
      description: 'Example calculation for a single room with bathroom fixtures',
      type: 'RESIDENTIAL' as ProjectType,
      status: 'ACTIVE' as ProjectStatus,
      ownerId: demoUser.id,
      criteria: {
        create: {
          velocityMin: 1.2,
          velocityMax: 2.4,
          velocityWarning: 3.0,
          pressureMin: 0.5,
          pressureWarning: 1.0,
          cFactor: 150,
          systemType: 'FLUSH_TANK' as SystemType,
          buildingType: 'APARTMENT' as BuildingType,
          staticHead: 3.0,
          residualPressure: 0.35,
        },
      },
    },
  })
  console.log(`✅ Demo project created: ${project.name}`)

  // 4. Create demo network (check if exists first)
  console.log('🕸️  Creating demo network...')
  const existingNetwork = await prisma.network.findFirst({
    where: { projectId: project.id, isCurrent: true }
  })

  let network
  if (existingNetwork) {
    console.log('ℹ️  Demo network already exists, skipping...')
    network = existingNetwork
  } else {
    network = await prisma.network.create({
    data: {
      id: 1,
      projectId: project.id,
      name: 'Main Network',
      isCurrent: true,
      nodes: {
        create: [
          // Source node (pump)
          {
            id: 1,
            type: 'SOURCE' as NodeType,
            x: 100,
            y: 300,
            elevation: 0,
            label: 'Water Source (Pump)',
          },
          // Junction node
          {
            id: 2,
            type: 'JUNCTION' as NodeType,
            x: 300,
            y: 300,
            elevation: 0,
            label: 'Junction A',
          },
          // Bathroom fixture node
          {
            id: 3,
            type: 'FIXTURE' as NodeType,
            x: 500,
            y: 200,
            elevation: 3.0,
            label: 'Master Bathroom',
            fixtures: {
              create: [
                { id: 1, type: 'WC_TANK' as FixtureType, quantity: 1 },
                { id: 2, type: 'LAVATORY' as FixtureType, quantity: 1 },
                { id: 3, type: 'SHOWER' as FixtureType, quantity: 1 },
              ],
            },
          },
          // Kitchen fixture node
          {
            id: 4,
            type: 'FIXTURE' as NodeType,
            x: 500,
            y: 400,
            elevation: 0,
            label: 'Kitchen',
            fixtures: {
              create: [
                { id: 4, type: 'KITCHEN_SINK' as FixtureType, quantity: 1 },
              ],
            },
          },
        ],
      },
    },
    include: {
      nodes: true,
    },
  })
  console.log(`✅ Demo network created with ${network.nodes.length} nodes`)
  }

  // 5. Create pipes connecting nodes (check if exists)
  console.log('🔗 Creating pipes...')
  const existingPipes = await prisma.pipe.findMany({ where: { networkId: network.id } })
  if (existingPipes.length === 0) {
  const pipes = await prisma.pipe.createMany({
    data: [
      {
        id: 1,
        networkId: network.id,
        sourceNodeId: 1, // Source
        targetNodeId: 2, // Junction A
        length: 2.0,
        nominalSize: '25',
        internalDiameter: 0.0254,
        material: 'PVC',
        cFactor: 150,
        isCriticalPath: true,
      },
      {
        id: 2,
        networkId: network.id,
        sourceNodeId: 2, // Junction A
        targetNodeId: 3, // Bathroom
        length: 3.5,
        nominalSize: '20',
        internalDiameter: 0.0191,
        material: 'PVC',
        cFactor: 150,
        isCriticalPath: true,
      },
      {
        id: 3,
        networkId: network.id,
        sourceNodeId: 2, // Junction A
        targetNodeId: 4, // Kitchen
        length: 2.5,
        nominalSize: '15',
        internalDiameter: 0.0127,
        material: 'PVC',
        cFactor: 150,
        isCriticalPath: false,
      },
    ],
  })
  console.log(`✅ Created ${pipes.count} pipes`)
  } else {
    console.log('ℹ️  Pipes already exist, skipping...')
  }

  // 6. Create audit log entries (check if exists)
  console.log('📝 Creating audit logs...')
  const existingLogs = await prisma.auditLog.findMany({ where: { projectId: project.id } })
  if (existingLogs.length === 0) {
  await prisma.auditLog.createMany({
    data: [
      {
        id: 1,
        projectId: project.id,
        userId: demoUser.id,
        action: 'CREATE',
        entity: 'project',
        entityId: project.id,
        details: JSON.stringify({ message: 'Project created' }),
      },
      {
        id: 2,
        projectId: project.id,
        userId: demoUser.id,
        action: 'CREATE',
        entity: 'network',
        entityId: network.id,
        details: JSON.stringify({ message: 'Network created with demo data' }),
      },
    ],
  })
  console.log('✅ Audit logs created')
  } else {
    console.log('ℹ️  Audit logs already exist, skipping...')
  }

  console.log('✨ Seed completed successfully!')
  console.log('')
  console.log('📧 Demo credentials:')
  console.log('   Email: demo@example.com')
  console.log('   Password: demo123')
  console.log('')
  console.log('🔑 Admin credentials:')
  console.log('   Email: admin@cw-pipe-calculator.com')
  console.log('   Password: admin123')
}

main()
  .catch((e) => {
    console.error('❌ Seed failed:', e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })
