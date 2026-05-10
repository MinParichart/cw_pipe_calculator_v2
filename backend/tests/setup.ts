/**
 * Per-file setup — รันต่อ 1 test file
 * แค่ set environment variables เท่านั้น
 * การ cleanup ทำใน globalSetup.ts (รันครั้งเดียวก่อน test ทั้งหมด)
 */

import { afterAll } from 'vitest'
import { PrismaClient } from '@prisma/client'
import path from 'path'

const DB_PATH = path.resolve(__dirname, '../prisma/dev.db')
process.env.DATABASE_URL = `file:${DB_PATH}`
process.env.JWT_SECRET = 'test-secret-key-for-vitest'
process.env.NODE_ENV = 'test'

export const prisma = new PrismaClient({
  datasources: { db: { url: `file:${DB_PATH}` } },
})

afterAll(async () => {
  await prisma.$disconnect()
})
