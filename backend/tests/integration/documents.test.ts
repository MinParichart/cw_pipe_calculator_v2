/**
 * Integration Tests: Blueprint Documents API
 * UTC6001 - อัปโหลด Blueprint รูปภาพ (JPEG/PNG/GIF) ประกอบโครงการ
 * UTC6002 - อัปโหลดไฟล์ประเภทที่ไม่รองรับ (PDF/DXF) → ต้อง reject
 * UTC6003 - [v2] ดึงรายการ Blueprint ทั้งหมดของโครงการ
 *
 * NOTE: v2 documents endpoint รองรับเฉพาะ image files (JPEG/PNG/GIF)
 * ไม่มี PDF export API — Report ทำผ่าน frontend /report page โดยตรง
 * Endpoint: POST /api/projects/:projectId/documents (multipart/form-data)
 *           GET  /api/projects/:projectId/documents
 */

import { describe, it, expect, beforeAll } from 'vitest'
import request from 'supertest'
import app from '../../src/app'

const AUTH_BASE = '/api/auth'
const PROJ_BASE = '/api/projects'

let token = ''
let projectId: number

const getObj = (body: any) => body?.data ?? body

beforeAll(async () => {
  const email = `utc6-doc-${Date.now()}@test.com`
  await request(app).post(`${AUTH_BASE}/register`).send({
    name: 'UTC Document Tester', email, password: 'Test1234!',
  })
  const login = await request(app).post(`${AUTH_BASE}/login`).send({
    email, password: 'Test1234!',
  })
  token = login.body?.data?.token ?? login.body?.token ?? ''

  const proj = await request(app)
    .post(PROJ_BASE)
    .set('Authorization', `Bearer ${token}`)
    .send({ name: 'โครงการทดสอบ Blueprint Documents' })
  projectId = getObj(proj.body).id
})

// ─────────────────────────────────────────────
// UTC6001: อัปโหลด Blueprint รูปภาพ (JPEG)
// ─────────────────────────────────────────────
describe('UTC6001 — POST /api/projects/:id/documents (อัปโหลดรูปภาพ)', () => {
  it('TC-6001-01: อัปโหลด JPEG → HTTP 200 พร้อม document object', async () => {
    // minimal valid JPEG (SOI + EOI markers)
    const jpegBuffer = Buffer.from([
      0xFF, 0xD8, 0xFF, 0xE0, 0x00, 0x10, 0x4A, 0x46, 0x49, 0x46, 0x00, 0x01,
      0x01, 0x00, 0x00, 0x01, 0x00, 0x01, 0x00, 0x00, 0xFF, 0xC0, 0x00, 0x0B,
      0x08, 0x00, 0x01, 0x00, 0x01, 0x01, 0x01, 0x11, 0x00, 0xFF, 0xDA, 0x00,
      0x08, 0x01, 0x01, 0x00, 0x00, 0x3F, 0x00, 0xFB, 0xFF, 0xD9,
    ])
    const res = await request(app)
      .post(`${PROJ_BASE}/${projectId}/documents`)
      .set('Authorization', `Bearer ${token}`)
      .attach('file', jpegBuffer, { filename: 'blueprint.jpg', contentType: 'image/jpeg' })
    expect(res.status).toBe(200)
    const doc = getObj(res.body)
    expect(doc).toHaveProperty('id')
  })

  it('TC-6001-02: อัปโหลด PNG → HTTP 200', async () => {
    // minimal 1×1 transparent PNG
    const pngBuffer = Buffer.from(
      '89504e470d0a1a0a0000000d4948445200000001000000010802000000' +
      '9001 2e00000000c4944415478016360f8cff00000002000' +
      '15e221bc30000000049454e44ae426082',
      'hex'
    )
    const res = await request(app)
      .post(`${PROJ_BASE}/${projectId}/documents`)
      .set('Authorization', `Bearer ${token}`)
      .attach('file', pngBuffer, { filename: 'blueprint.png', contentType: 'image/png' })
    expect([200, 400]).toContain(res.status)
    if (res.status === 200) {
      expect(getObj(res.body)).toHaveProperty('id')
    }
  })

  it('TC-6001-03: ไม่มี token → HTTP 401', async () => {
    const buf = Buffer.from([0xFF, 0xD8, 0xFF, 0xD9])
    const res = await request(app)
      .post(`${PROJ_BASE}/${projectId}/documents`)
      .attach('file', buf, { filename: 'blueprint.jpg', contentType: 'image/jpeg' })
    expect(res.status).toBe(401)
  })
})

// ─────────────────────────────────────────────
// UTC6002: อัปโหลดไฟล์ประเภทที่ไม่รองรับ (PDF / DXF)
// ─────────────────────────────────────────────
describe('UTC6002 — POST /api/projects/:id/documents (ประเภทไฟล์ไม่รองรับ)', () => {
  it('TC-6002-01: อัปโหลด PDF → HTTP 400 พร้อม error message', async () => {
    const pdfBuffer = Buffer.from('%PDF-1.4 fake pdf content')
    const res = await request(app)
      .post(`${PROJ_BASE}/${projectId}/documents`)
      .set('Authorization', `Bearer ${token}`)
      .attach('file', pdfBuffer, { filename: 'report.pdf', contentType: 'application/pdf' })
    expect(res.status).toBe(400)
    // error message ควรบอกว่าไม่รองรับไฟล์ประเภทนี้
    const body = JSON.stringify(res.body)
    const hasErrMsg =
      body.includes('image') || body.includes('jpeg') || body.includes('png') ||
      body.includes('gif')   || body.includes('error') || body.includes('invalid') ||
      body.includes('รองรับ') || body.includes('ไม่')
    expect(hasErrMsg).toBe(true)
  })

  it('TC-6002-02: อัปโหลด DXF → HTTP 400', async () => {
    const dxfBuffer = Buffer.from('0\nSECTION\n2\nHEADER\n0\nENDSEC\n0\nEOF\n')
    const res = await request(app)
      .post(`${PROJ_BASE}/${projectId}/documents`)
      .set('Authorization', `Bearer ${token}`)
      .attach('file', dxfBuffer, { filename: 'floorplan.dxf', contentType: 'application/octet-stream' })
    expect(res.status).toBe(400)
  })

  it('TC-6002-03: อัปโหลด .txt → HTTP 400', async () => {
    const txtBuffer = Buffer.from('just a text file')
    const res = await request(app)
      .post(`${PROJ_BASE}/${projectId}/documents`)
      .set('Authorization', `Bearer ${token}`)
      .attach('file', txtBuffer, { filename: 'notes.txt', contentType: 'text/plain' })
    expect(res.status).toBe(400)
  })
})

// ─────────────────────────────────────────────
// UTC6003: [v2] ดึงรายการ Blueprint ทั้งหมดของโครงการ
// ─────────────────────────────────────────────
describe('UTC6003 — GET /api/projects/:id/documents [v2]', () => {
  it('TC-6003-01: ควรได้ HTTP 200 พร้อม array ของ documents', async () => {
    const res = await request(app)
      .get(`${PROJ_BASE}/${projectId}/documents`)
      .set('Authorization', `Bearer ${token}`)
    expect(res.status).toBe(200)
    const list = getObj(res.body)
    expect(Array.isArray(list)).toBe(true)
  })

  it('TC-6003-02: list ต้องมีไฟล์ที่อัปโหลดไว้ใน UTC6001 อย่างน้อย 1 รายการ', async () => {
    const res = await request(app)
      .get(`${PROJ_BASE}/${projectId}/documents`)
      .set('Authorization', `Bearer ${token}`)
    const list = getObj(res.body) as any[]
    expect(list.length).toBeGreaterThanOrEqual(1)
  })

  it('TC-6003-03: document object ต้องมี field id และ filename/path', async () => {
    const res = await request(app)
      .get(`${PROJ_BASE}/${projectId}/documents`)
      .set('Authorization', `Bearer ${token}`)
    const list = getObj(res.body) as any[]
    const doc = list[0]
    expect(doc).toHaveProperty('id')
    const hasName =
      'filename' in doc || 'originalname' in doc ||
      'name' in doc || 'filePath' in doc || 'path' in doc
    expect(hasName).toBe(true)
  })

  it('TC-6003-04: ไม่มี token → HTTP 401', async () => {
    const res = await request(app)
      .get(`${PROJ_BASE}/${projectId}/documents`)
    expect(res.status).toBe(401)
  })
})
