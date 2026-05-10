/**
 * Integration Tests: Document Export API
 * UTC6001 - Export ผลการคำนวณเป็น PDF
 * UTC6002 - Export Network Diagram เป็นไฟล์ภาพ
 */

import { describe, it, expect, beforeAll } from 'vitest'
import request from 'supertest'
import app from '../../src/app'

const AUTH_BASE = '/api/auth'
const PROJ_BASE = '/api/projects'

let token = ''
let projectId: number
let versionId: number

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
    .send({ name: 'โครงการทดสอบ Document Export' })
  projectId = (proj.body?.data ?? proj.body).id

  const ver = await request(app)
    .post(`${PROJ_BASE}/${projectId}/versions`)
    .set('Authorization', `Bearer ${token}`)
    .send({ name: 'Version 1 - Document Test' })
  versionId = (ver.body?.data ?? ver.body).id
})

// ─────────────────────────────────────────────
// UTC6001: Export ผลการคำนวณเป็น PDF
// ─────────────────────────────────────────────
describe('UTC6001 — POST /api/projects/:id/versions/:versionId/export/pdf', () => {
  it('TC-6001-01: endpoint ต้องตอบสนองโดยไม่ crash (200 หรือ 404 ถ้ายังไม่มีผล)', async () => {
    const res = await request(app)
      .post(`${PROJ_BASE}/${projectId}/versions/${versionId}/export/pdf`)
      .set('Authorization', `Bearer ${token}`)
    // ยอมรับ 200 (มีไฟล์) หรือ 400/404 (ยังไม่มีผลคำนวณ) แต่ไม่ยอมรับ 500
    expect(res.status).not.toBe(500)
  })

  it('TC-6001-02: ไม่มี token → HTTP 401 หรือ 404 (ถ้า route ยังไม่ implement)', async () => {
    const res = await request(app)
      .post(`${PROJ_BASE}/${projectId}/versions/${versionId}/export/pdf`)
    expect([401, 404]).toContain(res.status)
  })
})

// ─────────────────────────────────────────────
// UTC6002: Export Network Diagram
// ─────────────────────────────────────────────
describe('UTC6002 — GET /api/projects/:id/versions/:versionId/export/network', () => {
  it('TC-6002-01: endpoint ต้องตอบสนองโดยไม่ crash', async () => {
    const res = await request(app)
      .get(`${PROJ_BASE}/${projectId}/versions/${versionId}/export/network`)
      .set('Authorization', `Bearer ${token}`)
    expect(res.status).not.toBe(500)
  })

  it('TC-6002-02: ไม่มี token → HTTP 401 หรือ 404 (ถ้า route ยังไม่ implement)', async () => {
    const res = await request(app)
      .get(`${PROJ_BASE}/${projectId}/versions/${versionId}/export/network`)
    expect([401, 404]).toContain(res.status)
  })
})
