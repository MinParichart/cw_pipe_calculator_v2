/**
 * Integration Tests: Project Management API
 * UTC2001 - สร้างโครงการใหม่ด้วยข้อมูลครบถ้วน
 * UTC2002 - สร้างโครงการโดยไม่กรอกชื่อ
 * UTC2003 - ดึงรายการโครงการทั้งหมด
 * UTC2004 - ดึงข้อมูลโครงการด้วย id ที่ถูกต้อง
 * UTC2005 - ดึงข้อมูลโครงการด้วย id ที่ไม่มีในระบบ
 * UTC2006 - แก้ไขชื่อโครงการ
 * UTC2007 - ลบโครงการ
 */

import { describe, it, expect, beforeAll } from 'vitest'
import request from 'supertest'
import app from '../../src/app'

const AUTH_BASE = '/api/auth'
const PROJ_BASE = '/api/projects'

let token = ''
let projectId: number

// Login ก่อนทดสอบทุก test
beforeAll(async () => {
  const email = `utc2-proj-${Date.now()}@test.com`
  await request(app).post(`${AUTH_BASE}/register`).send({
    name: 'UTC Project Tester', email, password: 'Test1234!',
  })
  const login = await request(app).post(`${AUTH_BASE}/login`).send({
    email, password: 'Test1234!',
  })
  // API response: { success: true, data: { token, user } }
  token = login.body?.data?.token ?? login.body?.token ?? ''
})

// ─────────────────────────────────────────────
// UTC2001: สร้างโครงการใหม่ด้วยข้อมูลครบถ้วน
// ─────────────────────────────────────────────
// helper ดึง project object จาก response
const getProject = (body: any) => body?.data ?? body

describe('UTC2001 — POST /api/projects (ข้อมูลครบถ้วน)', () => {
  it('TC-2001-01: ควรได้ HTTP 201 พร้อม project object ที่มี id', async () => {
    const res = await request(app)
      .post(PROJ_BASE)
      .set('Authorization', `Bearer ${token}`)
      .send({ name: 'ทาวน์โฮม A', description: 'โครงการทดสอบ UTC2001' })
    expect(res.status).toBe(201)
    const proj = getProject(res.body)
    expect(proj).toHaveProperty('id')
    expect(proj.name).toBe('ทาวน์โฮม A')
    projectId = proj.id
  })

  it('TC-2001-02: project ที่สร้างต้องมี status = DRAFT โดย default', async () => {
    const res = await request(app)
      .post(PROJ_BASE)
      .set('Authorization', `Bearer ${token}`)
      .send({ name: 'Test Default Status' })
    const proj = getProject(res.body)
    expect(proj.status).toBe('DRAFT')
  })
})

// ─────────────────────────────────────────────
// UTC2002: สร้างโครงการโดยไม่กรอกชื่อ
// ─────────────────────────────────────────────
describe('UTC2002 — POST /api/projects (ไม่มีชื่อ)', () => {
  it('TC-2002-01: ส่ง body ที่ไม่มี name → HTTP 400', async () => {
    const res = await request(app)
      .post(PROJ_BASE)
      .set('Authorization', `Bearer ${token}`)
      .send({ description: 'ไม่มีชื่อโครงการ' })
    expect(res.status).toBe(400)
  })

  it('TC-2002-02: response ต้องมี error เกี่ยวกับ name', async () => {
    const res = await request(app)
      .post(PROJ_BASE)
      .set('Authorization', `Bearer ${token}`)
      .send({ description: 'ไม่มีชื่อโครงการ' })
    const body = JSON.stringify(res.body).toLowerCase()
    expect(body).toMatch(/name|required/)
  })
})

// ─────────────────────────────────────────────
// UTC2003: ดึงรายการโครงการทั้งหมด
// ─────────────────────────────────────────────
describe('UTC2003 — GET /api/projects', () => {
  it('TC-2003-01: ควรได้ HTTP 200 พร้อม array', async () => {
    const res = await request(app)
      .get(PROJ_BASE)
      .set('Authorization', `Bearer ${token}`)
    expect(res.status).toBe(200)
    const list = res.body?.data ?? res.body
    expect(Array.isArray(list)).toBe(true)
  })

  it('TC-2003-02: รายการควรมีโครงการที่เพิ่งสร้างไป', async () => {
    const res = await request(app)
      .get(PROJ_BASE)
      .set('Authorization', `Bearer ${token}`)
    const list = res.body?.data ?? res.body
    const found = Array.isArray(list) ? list.find((p: any) => p.id === projectId) : undefined
    expect(found).toBeDefined()
  })

  it('TC-2003-03: ไม่มี token → HTTP 401', async () => {
    const res = await request(app).get(PROJ_BASE)
    expect(res.status).toBe(401)
  })
})

// ─────────────────────────────────────────────
// UTC2004: ดึงข้อมูลโครงการด้วย id ที่ถูกต้อง
// ─────────────────────────────────────────────
describe('UTC2004 — GET /api/projects/:id (id ถูกต้อง)', () => {
  it('TC-2004-01: ควรได้ HTTP 200 พร้อม project object', async () => {
    const res = await request(app)
      .get(`${PROJ_BASE}/${projectId}`)
      .set('Authorization', `Bearer ${token}`)
    expect(res.status).toBe(200)
    const proj = getProject(res.body)
    expect(proj.id).toBe(projectId)
  })
})

// ─────────────────────────────────────────────
// UTC2005: ดึงข้อมูลโครงการด้วย id ที่ไม่มีในระบบ
// ─────────────────────────────────────────────
describe('UTC2005 — GET /api/projects/:id (id ไม่มีในระบบ)', () => {
  it('TC-2005-01: id ที่ไม่มีในระบบ → HTTP 404', async () => {
    const res = await request(app)
      .get(`${PROJ_BASE}/999999`)
      .set('Authorization', `Bearer ${token}`)
    expect(res.status).toBe(404)
  })
})

// ─────────────────────────────────────────────
// UTC2006: แก้ไขชื่อโครงการ
// ─────────────────────────────────────────────
describe('UTC2006 — PUT /api/projects/:id (แก้ไขชื่อ)', () => {
  it('TC-2006-01: ควรได้ HTTP 200 และชื่อเปลี่ยนถูกต้อง', async () => {
    const res = await request(app)
      .put(`${PROJ_BASE}/${projectId}`)
      .set('Authorization', `Bearer ${token}`)
      .send({ name: 'ทาวน์โฮม A (แก้ไขแล้ว)' })
    expect(res.status).toBe(200)
    const proj = getProject(res.body)
    expect(proj.name).toBe('ทาวน์โฮม A (แก้ไขแล้ว)')
  })
})

// ─────────────────────────────────────────────
// UTC2007: ลบโครงการ
// ─────────────────────────────────────────────
describe('UTC2007 — DELETE /api/projects/:id', () => {
  it('TC-2007-01: ควรได้ HTTP 200 และลบโครงการสำเร็จ', async () => {
    // สร้างโครงการใหม่เพื่อลบ (ไม่กระทบ projectId หลัก)
    const create = await request(app)
      .post(PROJ_BASE)
      .set('Authorization', `Bearer ${token}`)
      .send({ name: 'โครงการที่จะลบ' })
    const idToDelete = getProject(create.body).id

    const res = await request(app)
      .delete(`${PROJ_BASE}/${idToDelete}`)
      .set('Authorization', `Bearer ${token}`)
    expect(res.status).toBe(200)
  })

  it('TC-2007-02: หลังลบแล้ว GET ต้องได้ HTTP 404', async () => {
    const create = await request(app)
      .post(PROJ_BASE)
      .set('Authorization', `Bearer ${token}`)
      .send({ name: 'โครงการที่จะลบ 2' })
    const idToDelete = getProject(create.body).id

    await request(app)
      .delete(`${PROJ_BASE}/${idToDelete}`)
      .set('Authorization', `Bearer ${token}`)

    const res = await request(app)
      .get(`${PROJ_BASE}/${idToDelete}`)
      .set('Authorization', `Bearer ${token}`)
    expect(res.status).toBe(404)
  })
})
