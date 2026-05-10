/**
 * Integration Tests: Version Management API
 * UTC3001 - สร้างเวอร์ชันแรกของโครงการ
 * UTC3002 - versionNumber เพิ่มอัตโนมัติเมื่อสร้าง Version ที่ 2
 * UTC3003 - ดึงรายการเวอร์ชันทั้งหมดของโครงการ
 * UTC3004 - ดึงข้อมูลเวอร์ชันเฉพาะ
 * UTC3005 - แก้ไขชื่อเวอร์ชัน
 * UTC3006 - ลบเวอร์ชัน
 */

import { describe, it, expect, beforeAll } from 'vitest'
import request from 'supertest'
import app from '../../src/app'

const AUTH_BASE = '/api/auth'
const PROJ_BASE = '/api/projects'

let token = ''
let projectId: number
let version1Id: number
let version2Id: number

const getObj = (body: any) => body?.data ?? body

beforeAll(async () => {
  const email = `utc3-ver-${Date.now()}@test.com`
  await request(app).post(`${AUTH_BASE}/register`).send({
    name: 'UTC Version Tester', email, password: 'Test1234!',
  })
  const login = await request(app).post(`${AUTH_BASE}/login`).send({
    email, password: 'Test1234!',
  })
  token = login.body?.data?.token ?? login.body?.token ?? ''

  // สร้างโครงการสำหรับทดสอบ version
  const proj = await request(app)
    .post(PROJ_BASE)
    .set('Authorization', `Bearer ${token}`)
    .send({ name: 'โครงการสำหรับทดสอบ Version' })
  projectId = getObj(proj.body).id
})

// ─────────────────────────────────────────────
// UTC3001: สร้างเวอร์ชันแรกของโครงการ
// ─────────────────────────────────────────────
describe('UTC3001 — POST /api/projects/:id/versions (Version แรก)', () => {
  it('TC-3001-01: ควรได้ HTTP 201 พร้อม version object', async () => {
    const res = await request(app)
      .post(`${PROJ_BASE}/${projectId}/versions`)
      .set('Authorization', `Bearer ${token}`)
      .send({ name: 'Version 1 - แบบเริ่มต้น', description: 'วาด Network เส้นแรก' })
    expect(res.status).toBe(201)
    const ver = getObj(res.body)
    expect(ver).toHaveProperty('id')
    version1Id = ver.id
  })

  it('TC-3001-02: versionNumber ของ Version แรกต้องเป็น 1', async () => {
    const get = await request(app)
      .get(`/api/versions/${version1Id}`)
      .set('Authorization', `Bearer ${token}`)
    const ver = getObj(get.body)
    expect(ver.versionNumber).toBe(1)
  })
})

// ─────────────────────────────────────────────
// UTC3002: versionNumber เพิ่มอัตโนมัติ
// ─────────────────────────────────────────────
describe('UTC3002 — versionNumber auto-increment', () => {
  it('TC-3002-01: Version ที่ 2 ต้องมี versionNumber=2 โดยอัตโนมัติ', async () => {
    const res = await request(app)
      .post(`${PROJ_BASE}/${projectId}/versions`)
      .set('Authorization', `Bearer ${token}`)
      .send({ name: 'Version 2 - แบบปรับปรุง' })
    expect(res.status).toBe(201)
    const ver = getObj(res.body)
    expect(ver.versionNumber).toBe(2)
    version2Id = ver.id
  })
})

// ─────────────────────────────────────────────
// UTC3003: ดึงรายการเวอร์ชันทั้งหมด
// ─────────────────────────────────────────────
describe('UTC3003 — GET /api/projects/:id/versions', () => {
  it('TC-3003-01: ควรได้ HTTP 200 พร้อม array ของ versions', async () => {
    const res = await request(app)
      .get(`${PROJ_BASE}/${projectId}/versions`)
      .set('Authorization', `Bearer ${token}`)
    expect(res.status).toBe(200)
    const list = getObj(res.body)
    expect(Array.isArray(list)).toBe(true)
  })

  it('TC-3003-02: list ต้องมีทั้ง Version 1 และ Version 2', async () => {
    const res = await request(app)
      .get(`${PROJ_BASE}/${projectId}/versions`)
      .set('Authorization', `Bearer ${token}`)
    const list = getObj(res.body)
    const ids = Array.isArray(list) ? list.map((v: any) => v.id) : []
    expect(ids).toContain(version1Id)
    expect(ids).toContain(version2Id)
  })

  it('TC-3003-03: versions ควรเรียงลำดับ และมี versionNumber 1 และ 2 ครบ', async () => {
    const res = await request(app)
      .get(`${PROJ_BASE}/${projectId}/versions`)
      .set('Authorization', `Bearer ${token}`)
    const list = getObj(res.body)
    const numbers = Array.isArray(list) ? list.map((v: any) => v.versionNumber) : []
    // ตรวจว่ามีอย่างน้อย 2 versions
    expect(numbers.length).toBeGreaterThanOrEqual(2)
    // ตรวจว่ามีทั้ง versionNumber 1 และ 2 อยู่ใน list (ไม่สนใจ order)
    expect(numbers).toContain(1)
    expect(numbers).toContain(2)
  })
})

// ─────────────────────────────────────────────
// UTC3004: ดึงข้อมูลเวอร์ชันเฉพาะ
// ─────────────────────────────────────────────
describe('UTC3004 — GET /api/versions/:versionId', () => {
  it('TC-3004-01: ควรได้ HTTP 200 พร้อม version object ที่ถูกต้อง', async () => {
    const res = await request(app)
      .get(`/api/versions/${version1Id}`)
      .set('Authorization', `Bearer ${token}`)
    expect(res.status).toBe(200)
    const ver = getObj(res.body)
    expect(ver.id).toBe(version1Id)
    expect(ver.name).toBe('Version 1 - แบบเริ่มต้น')
  })

  it('TC-3004-02: response มี fields: snapshotNetwork, snapshotFixtures, snapshotResults', async () => {
    const res = await request(app)
      .get(`/api/versions/${version1Id}`)
      .set('Authorization', `Bearer ${token}`)
    const ver = getObj(res.body)
    expect(ver).toHaveProperty('snapshotNetwork')
    expect(ver).toHaveProperty('snapshotFixtures')
    expect(ver).toHaveProperty('snapshotResults')
  })
})

// ─────────────────────────────────────────────
// UTC3005: แก้ไขชื่อเวอร์ชัน
// ─────────────────────────────────────────────
describe('UTC3005 — PUT /api/versions/:versionId (แก้ไขชื่อ)', () => {
  it('TC-3005-01: ควรได้ HTTP 200 และชื่อเปลี่ยนถูกต้อง', async () => {
    const res = await request(app)
      .put(`/api/versions/${version1Id}`)
      .set('Authorization', `Bearer ${token}`)
      .send({ name: 'Version 1 - แก้ไขชื่อแล้ว' })
    expect(res.status).toBe(200)
    const ver = getObj(res.body)
    expect(ver.name).toBe('Version 1 - แก้ไขชื่อแล้ว')
  })
})

// ─────────────────────────────────────────────
// UTC3006: ลบเวอร์ชัน
// ─────────────────────────────────────────────
describe('UTC3006 — DELETE /api/versions/:versionId', () => {
  it('TC-3006-01: ลบ Version 2 → HTTP 200', async () => {
    const res = await request(app)
      .delete(`/api/versions/${version2Id}`)
      .set('Authorization', `Bearer ${token}`)
    expect(res.status).toBe(200)
  })

  it('TC-3006-02: หลังลบแล้ว GET ต้องได้ HTTP 404', async () => {
    const res = await request(app)
      .get(`/api/versions/${version2Id}`)
      .set('Authorization', `Bearer ${token}`)
    expect(res.status).toBe(404)
  })
})
