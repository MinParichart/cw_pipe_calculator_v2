// Create Demo Project Script
// สร้าง Demo Project "บ้านลาดพร้าว 2 ชั้น" พร้อม 2 Versions

import prisma from '../config/database'
import { DEMO_PROJECT, DEMO_CRITERIA, VERSION_1_DATA, VERSION_2_DATA, FIXTURE_FU_VALUES } from './demoData'

// Helper: Get Fixture FU values
function getFixtureFU(type: string) {
  const fuMap: Record<string, { cold: number; total: number }> = {
    WC_TANK: { cold: 3, total: 3 },
    WC_VALVE: { cold: 6, total: 6 },
    LAVATORY: { cold: 1, total: 1 },
    SHOWER: { cold: 2, total: 2 },
    BATHTUB: { cold: 2, total: 2 },
    KITCHEN_SINK: { cold: 2, total: 2 },
    DISHWASHER: { cold: 0, total: 1 },
    LAUNDRY_35KG: { cold: 2, total: 2 },
    LAUNDRY_7KG: { cold: 3, total: 4 },
    HOSE_BIBB: { cold: 0, total: 0 },
  }

  return fuMap[type] || { cold: 0, total: 0 }
}

// Helper: Calculate Hunter's Curve GPM
function hunterCurveGPM(fu: number): number {
  // Flush Tank System Table (simplified interpolation)
  const table: [number, number][] = [
    [6, 5.0], [8, 6.5], [10, 8.0], [12, 9.2], [14, 10.4],
    [16, 11.6], [18, 12.8], [20, 14.0], [25, 17.0], [30, 20.0],
    [35, 22.5], [40, 24.8], [45, 27.0], [50, 29.0],
  ]

  // Find surrounding values
  for (let i = 0; i < table.length - 1; i++) {
    const [fu1, gpm1] = table[i]
    const [fu2, gpm2] = table[i + 1]

    if (fu >= fu1 && fu <= fu2) {
      // Interpolate
      const ratio = (fu - fu1) / (fu2 - fu1)
      return gpm1 + ratio * (gpm2 - gpm1)
    }
  }

  // Extrapolate for values > 50
  if (fu > 50) {
    const [fu1, gpm1] = table[table.length - 1]
    return gpm1 + (fu - fu1) * 0.1
  }

  return 5.0 // Default minimum
}

// Helper: Calculate pipe calculations
function calculatePipeParams(
  fu: number,
  length: number,
  internalDiameter: number,
  cFactor: number
) {
  // 1. Convert FU to GPM
  const flowRateGPM = hunterCurveGPM(fu)

  // 2. Convert to LPS and m³/s
  const flowRateLPS = flowRateGPM * 0.06309
  const flowRateM3S = flowRateGPM * 0.00006309

  // 3. Calculate velocity
  const area = Math.PI * Math.pow(internalDiameter / 2, 2)
  const velocity = flowRateM3S / area

  // 4. Calculate friction loss (Hazen-Williams)
  const hf = (10.583 / Math.pow(internalDiameter, 4.87)) * Math.pow(flowRateM3S / cFactor, 1.85) * 100
  const majorLoss = length * (hf / 100)

  // 5. Minor loss (30% of major)
  const minorLoss = majorLoss * 0.3

  // 6. Total loss
  const totalLoss = majorLoss + minorLoss

  // 7. Suggested size based on FU (Table 2.6)
  let suggestedSize = '15mm (1/2")'
  if (fu > 200) suggestedSize = '100mm (4")'
  else if (fu > 125) suggestedSize = '80mm (3")'
  else if (fu > 90) suggestedSize = '65mm (2½")'
  else if (fu > 50) suggestedSize = '50mm (2")'
  else if (fu > 30) suggestedSize = '40mm (1½")'
  else if (fu > 20) suggestedSize = '32mm (1¼")'
  else if (fu > 10) suggestedSize = '25mm (1")'
  else if (fu > 4) suggestedSize = '20mm (¾")'

  // 8. Status check
  const warnings: string[] = []
  let status = 'PASS'

  if (velocity > 3.0) {
    status = 'FAIL'
    warnings.push('ความเร็วเกินกำหนด (3 m/s)')
  } else if (velocity > 2.4) {
    status = 'WARNING'
    warnings.push('ความเร็วสูงเกินไป')
  } else if (velocity < 1.2 && velocity > 0) {
    warnings.push('ความเร็วต่ำเกินไป')
  }

  if (hf > 5.0) {
    warnings.push('Friction loss สูง')
  }

  return {
    fixtureUnitsTotal: fu,
    flowRateGPM,
    flowRateLPS,
    flowRateM3S,
    velocity,
    velocityHead: Math.pow(velocity, 2) / (2 * 9.81),
    frictionLossRate: hf,
    majorLoss,
    minorLoss,
    totalLoss,
    suggestedSize,
    status,
    warnings: warnings.length > 0 ? warnings.join(', ') : null,
  }
}

// Helper: Create network with nodes, pipes, fixtures, and calculations
async function createNetworkWithCalculations(
  projectId: number,
  networkName: string,
  data: typeof VERSION_1_DATA,
  userId: number
) {
  // Set existing networks to non-current
  await prisma.network.updateMany({
    where: { projectId, isCurrent: true },
    data: { isCurrent: false },
  })

  // Create network
  const network = await prisma.network.create({
    data: {
      projectId,
      name: networkName,
      isCurrent: true,
      nodes: {
        create: data.nodes.map((node, idx) => ({
          type: node.type,
          x: node.x,
          y: node.y,
          elevation: node.elevation || 0,
          label: node.label,
          fixtures: node.fixtures
            ? {
                create: node.fixtures.map((f) => ({
                  type: f.type as any,
                  quantity: f.quantity,
                })),
              }
            : undefined,
        })),
      },
    },
  })

  // Get created nodes with fixtures
  const nodes = await prisma.node.findMany({
    where: { networkId: network.id },
    include: {
      fixtures: true,
    },
    orderBy: { id: 'asc' },
  })

  // Create pipes with calculations
  for (const pipeData of data.pipes) {
    const sourceNode = nodes[pipeData.sourceIdx]
    const targetNode = nodes[pipeData.targetIdx]

    if (!sourceNode || !targetNode) {
      console.error(`Invalid pipe indices: ${pipeData.sourceIdx} -> ${pipeData.targetIdx}`)
      continue
    }

    // Calculate accumulated FU for this pipe segment
    let accumulatedFU = 0

    // Simple accumulation: count all fixtures downstream
    // (This is simplified - real implementation would traverse the network)
    const calculateDownstreamFU = (nodeId: number, visited = new Set<number>()): number => {
      if (visited.has(nodeId)) return 0
      visited.add(nodeId)

      const node = nodes.find((n) => n.id === nodeId)
      if (!node) return 0

      // Count fixtures at this node
      let fu = 0
      if (node.fixtures && node.fixtures.length > 0) {
        for (const fixture of node.fixtures) {
          const fixtureFU = getFixtureFU(fixture.type)
          fu += fixtureFU.total * fixture.quantity
        }
      }

      // Find downstream nodes (pipes where this node is source)
      const downstreamPipes = data.pipes.filter((p) => p.sourceIdx === nodes.indexOf(node))
      for (const pipe of downstreamPipes) {
        const targetNodeIdx = pipe.targetIdx
        fu += calculateDownstreamFU(nodes[targetNodeIdx].id, visited)
      }

      return fu
    }

    accumulatedFU = calculateDownstreamFU(targetNode.id)

    // Calculate pipe parameters
    const calculations = calculatePipeParams(
      accumulatedFU,
      pipeData.length,
      pipeData.internalDiameter,
      DEMO_CRITERIA.cFactor || 150
    )

    // Create pipe with calculations
    await prisma.pipe.create({
      data: {
        networkId: network.id,
        sourceNodeId: sourceNode.id,
        targetNodeId: targetNode.id,
        length: pipeData.length,
        nominalSize: pipeData.nominalSize,
        internalDiameter: pipeData.internalDiameter,
        material: pipeData.material || 'PVC',
        cFactor: DEMO_CRITERIA.cFactor || 150,
        calculations: {
          create: calculations,
        },
      },
    })
  }

  // Create audit log
  await prisma.auditLog.create({
    data: {
      projectId,
      userId,
      action: 'CREATE',
      entity: 'network',
      entityId: network.id,
    },
  })

  return network
}

// Main function: Create demo project
export async function createDemoProject(userId: number) {
  console.log('🏠 Creating Demo Project: บ้านลาดพร้าว 2 ชั้น')
  console.log('=' .repeat(60))

  try {
    // 1. Check if demo project already exists
    const existing = await prisma.project.findFirst({
      where: {
        name: DEMO_PROJECT.name,
        ownerId: userId,
      },
    })

    if (existing) {
      console.log('⚠️  Demo project already exists!')
      console.log(`   Project ID: ${existing.id}`)
      console.log('   Deleting old project...')

      await prisma.project.delete({
        where: { id: existing.id },
      })

      console.log('✅ Old project deleted')
    }

    // 2. Create project with criteria
    console.log('📝 Creating project with criteria...')
    const project = await prisma.project.create({
      data: {
        name: DEMO_PROJECT.name,
        description: DEMO_PROJECT.description,
        type: DEMO_PROJECT.type,
        status: DEMO_PROJECT.status,
        ownerId: userId,
        criteria: {
          create: DEMO_CRITERIA,
        },
      },
      include: {
        criteria: true,
      },
    })

    console.log(`✅ Project created (ID: ${project.id})`)

    // 3. Create Version 1: Initial Design
    console.log('\n🔧 Creating Version 1: Initial Design (3 bathrooms)...')
    const network1 = await createNetworkWithCalculations(
      project.id,
      'Network - Initial Design',
      VERSION_1_DATA,
      userId
    )

    const version1 = await prisma.version.create({
      data: {
        projectId: project.id,
        name: VERSION_1_DATA.name,
        description: VERSION_1_DATA.description,
        versionNumber: 1,
        isCurrent: true,
        createdBy: userId,
        snapshotCriteria: JSON.stringify(DEMO_CRITERIA),
        snapshotNetwork: JSON.stringify({
          nodes: await prisma.node.findMany({
            where: { networkId: network1.id },
            include: { fixtures: true },
          }),
          pipes: await prisma.pipe.findMany({
            where: { networkId: network1.id },
            include: { calculations: true },
          }),
        }),
      },
    })

    console.log(`✅ Version 1 created (ID: ${version1.id})`)
    console.log(`   - Nodes: ${VERSION_1_DATA.nodes.length}`)
    console.log(`   - Pipes: ${VERSION_1_DATA.pipes.length}`)

    // 4. Create Version 2: Modified Design
    console.log('\n🔧 Creating Version 2: Modified Design (4 bathrooms)...')

    // Set version 1 to non-current
    await prisma.version.update({
      where: { id: version1.id },
      data: { isCurrent: false },
    })

    const network2 = await createNetworkWithCalculations(
      project.id,
      'Network - Modified Design',
      VERSION_2_DATA,
      userId
    )

    const version2 = await prisma.version.create({
      data: {
        projectId: project.id,
        name: VERSION_2_DATA.name,
        description: VERSION_2_DATA.description,
        versionNumber: 2,
        isCurrent: true,
        createdBy: userId,
        snapshotCriteria: JSON.stringify(DEMO_CRITERIA),
        snapshotNetwork: JSON.stringify({
          nodes: await prisma.node.findMany({
            where: { networkId: network2.id },
            include: { fixtures: true },
          }),
          pipes: await prisma.pipe.findMany({
            where: { networkId: network2.id },
            include: { calculations: true },
          }),
        }),
      },
    })

    console.log(`✅ Version 2 created (ID: ${version2.id})`)
    console.log(`   - Nodes: ${VERSION_2_DATA.nodes.length}`)
    console.log(`   - Pipes: ${VERSION_2_DATA.pipes.length}`)

    // 5. Create audit log for project creation
    await prisma.auditLog.create({
      data: {
        projectId: project.id,
        userId,
        action: 'CREATE',
        entity: 'project',
        entityId: project.id,
        details: JSON.stringify({
          note: 'Demo project created via script',
          versions: [version1.id, version2.id],
        }),
      },
    })

    // 6. Summary
    console.log('\n' + '='.repeat(60))
    console.log('🎉 Demo project created successfully!')
    console.log('=' .repeat(60))
    console.log(`📊 Project: ${project.name}`)
    console.log(`   ID: ${project.id}`)
    console.log(`   Description: ${project.description}`)
    console.log(`\n📋 Versions:`)
    console.log(`   1. ${version1.name} (v${version1.versionNumber})`)
    console.log(`      ${version1.description}`)
    console.log(`   2. ${version2.name} (v${version2.versionNumber})`)
    console.log(`      ${version2.description}`)
    console.log(`\n🔧 Design Criteria:`)
    console.log(`   System Type: ${DEMO_CRITERIA.systemType}`)
    console.log(`   Building Type: ${DEMO_CRITERIA.buildingType}`)
    console.log(`   C-Factor: ${DEMO_CRITERIA.cFactor}`)
    console.log(`   Static Head: ${DEMO_CRITERIA.staticHead} m`)
    console.log(`   Residual Pressure: ${DEMO_CRITERIA.residualPressure} bar`)
    console.log('\n' + '='.repeat(60))
    console.log('✅ Ready to use! Login and open the project to start testing.')
    console.log('='.repeat(60))

    return {
      success: true,
      project,
      versions: [version1, version2],
    }
  } catch (error) {
    console.error('❌ Error creating demo project:', error)
    throw error
  }
}

// Run if called directly
if (require.main === module) {
  const userId = process.env.DEMO_USER_ID ? parseInt(process.env.DEMO_USER_ID) : 1

  if (!userId) {
    console.error('❌ Please provide DEMO_USER_ID environment variable')
    process.exit(1)
  }

  createDemoProject(userId)
    .then(() => {
      console.log('\n✅ Done!')
      process.exit(0)
    })
    .catch((error) => {
      console.error('\n❌ Failed:', error)
      process.exit(1)
    })
}

export default createDemoProject
