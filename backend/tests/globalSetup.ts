/**
 * Global Setup — รันครั้งเดียวก่อน test ทั้งหมด
 * ล้างข้อมูล @test.com ออกจาก dev.db
 *
 * ใช้ globalSetup แทน per-file cleanup ใน setup.ts
 * เพราะ per-file cleanup ทำให้เกิด race condition เมื่อไฟล์รัน parallel
 */

import { PrismaClient } from '@prisma/client'
import path from 'path'

export default async function setup() {
  const DB_PATH = path.resolve(__dirname, '../prisma/dev.db')
  process.env.DATABASE_URL = `file:${DB_PATH}`
  process.env.JWT_SECRET = 'test-secret-key-for-vitest'
  process.env.NODE_ENV = 'test'

  const prisma = new PrismaClient({
    datasources: { db: { url: `file:${DB_PATH}` } },
  })

  try {
    // ลบข้อมูล test ที่ค้างจาก run ก่อนหน้า
    // ใช้ PRAGMA foreign_keys = OFF เพื่อลบได้โดยไม่ติด FK constraint
    await prisma.$executeRaw`PRAGMA foreign_keys = OFF`
    await prisma.auditLog.deleteMany({})
    await prisma.calculationResult.deleteMany({})
    await prisma.fixture.deleteMany({})
    await prisma.pipe.deleteMany({})
    await prisma.node.deleteMany({})
    await prisma.network.deleteMany({})
    await prisma.version.deleteMany({})
    await prisma.designCriteria.deleteMany({})
    await prisma.document.deleteMany({})
    await prisma.project.deleteMany({})
    await prisma.user.deleteMany({ where: { email: { contains: '@test.com' } } })
    await prisma.$executeRaw`PRAGMA foreign_keys = ON`
    console.log('[GlobalSetup] Database cleaned successfully')
  } catch (e) {
    console.warn('[GlobalSetup] Cleanup warning:', e)
  } finally {
    await prisma.$disconnect()
  }
}

export async function teardown() {
  // ไม่ต้อง cleanup หลัง test — ปล่อยให้ next run ทำ
}
