import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

async function findNode230() {
  try {
    console.log('🔍 กำลังหา Node 230...')

    // 1. หา node 230
    const node230 = await prisma.node.findUnique({
      where: { id: 230 },
      include: {
        network: {
          include: {
            project: true
          }
        },
        fixtures: true
      }
    })

    if (!node230) {
      console.log('❌ Node 230 ไม่มีใน Database!')
      return
    }

    console.log('\n✅ เจอ Node 230!')
    console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━')
    console.log('📍 ตำแหน่ง:')
    console.log(`   - X: ${node230.x} px`)
    console.log(`   - Y: ${node230.y} px`)
    console.log(`   - Elevation: ${node230.elevation} m`)
    console.log('\n🏷️ ข้อมูล:')
    console.log(`   - ID: ${node230.id}`)
    console.log(`   - Label: ${node230.label || '(ไม่มีชื่อ)'}`)
    console.log(`   - Type: ${node230.type}`)
    console.log(`   - Network ID: ${node230.networkId}`)
    console.log(`   - Project: ${node230.network.project.name}`)
    console.log(`   - Fixtures: ${node230.fixtures.length} ตัว`)

    if (node230.fixtures.length > 0) {
      console.log('\n🚽 รายการสุขภัณฑ์:')
      node230.fixtures.forEach(f => {
        console.log(`   - ${f.type} x${f.quantity}`)
      })
    }

    console.log('\n━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━')

    // 2. เช็คว่าพิกัดปกติไหม
    const hasInvalidCoords = node230.x < 0 || node230.y < 0 ||
                             isNaN(node230.x) || isNaN(node230.y) ||
                             !isFinite(node230.x) || !isFinite(node230.y)

    if (hasInvalidCoords) {
      console.log('⚠️  พิกัดผิดปกติ!')
      console.log(`   - X ติดลบ: ${node230.x < 0}`)
      console.log(`   - Y ติดลบ: ${node230.y < 0}`)
      console.log(`   - X เป็น NaN: ${isNaN(node230.x)}`)
      console.log(`   - Y เป็น NaN: ${isNaN(node230.y)}`)
    } else if (node230.x > 10000 || node230.y > 10000) {
      console.log('⚠️  พิกัดอยู่ไกลมาก!')
      console.log(`   - X: ${node230.x} px (น่าจะอยู่ทางขวาไกลมาก)`)
      console.log(`   - Y: ${node230.y} px (น่าจะอยู่ด้านล่างไกลมาก)`)
    } else {
      console.log('✅ พิกัดดูปกติ')
    }

    // 3. เช็ค pipes ที่เกี่ยวข้อง
    const connectedPipes = await prisma.pipe.findMany({
      where: {
        OR: [
          { sourceNodeId: 230 },
          { targetNodeId: 230 }
        ]
      }
    })

    if (connectedPipes.length > 0) {
      console.log('\n🔗 Pipes ที่เชื่อมกับ Node 230:')
      connectedPipes.forEach(p => {
        console.log(`   - Pipe ${p.id}: ${p.sourceNodeId} → ${p.targetNodeId} (${p.nominalSize})`)
      })
    }

    // 4. เช็ค nodes ทั้งหมดใน network เดียวกัน
    const allNodes = await prisma.node.findMany({
      where: { networkId: node230.networkId },
      select: {
        id: true,
        label: true,
        x: true,
        y: true,
        type: true
      },
      orderBy: { id: 'asc' }
    })

    console.log(`\n📊 สรุป Network ${node230.networkId}:`)
    console.log(`   - ทั้งหมด: ${allNodes.length} nodes`)
    console.log(`   - Node ID น้อยสุด: ${allNodes[0]?.id}`)
    console.log(`   - Node ID มากสุด: ${allNodes[allNodes.length - 1]?.id}`)

    // หา nodes ที่มีพิกัดแปลกๆ
    const weirdNodes = allNodes.filter(n =>
      n.x < 0 || n.y < 0 ||
      n.x > 5000 || n.y > 5000 ||
      isNaN(n.x) || isNaN(n.y)
    )

    if (weirdNodes.length > 0) {
      console.log(`\n⚠️  มี ${weirdNodes.length} nodes ที่มีพิกัดแปลกๆ:`)
      weirdNodes.forEach(n => {
        console.log(`   - Node ${n.id} (${n.label || n.type}): x=${n.x}, y=${n.y}`)
      })
    }

    console.log('\n━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━')
    console.log('✅ เสร็จสิ้น!')

  } catch (error) {
    console.error('❌ Error:', error)
  } finally {
    await prisma.$disconnect()
  }
}

findNode230()
