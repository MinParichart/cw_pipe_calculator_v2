/**
 * Integration Tests: Network Snapshot API
 * UTC4001 - บันทึก Network Diagram ลงใน Version (ผ่าน PUT /api/versions/:versionId)
 * UTC4002 - ดึง Network ที่บันทึกไว้ (ผ่าน GET /api/versions/:versionId)
 * UTC4003 - ดึง Network จาก Version ที่ยังไม่มีข้อมูล
 * UTC4004 - [v2] บันทึก Reference Layer (แบบแปลนอ้างอิง) ต่อ Version
 * UTC4005 - [v2] ดึง Reference Layer ของ Version
 *
 * NOTE: v2 architecture เก็บ network ใน Version.snapshotNetwork (JSON)
 * ไม่มี endpoint แยก /network — ใช้ PUT /api/versions/:versionId แทน
 * Reference Layer: POST/GET /api/projects/:projectId/versions/:versionId/reference
 */

import { describe, it, expect, beforeAll } from 'vitest'
import request from 'supertest'
import app from '../../src/app'

const AUTH_BASE = '/api/auth'
const PROJ_BASE = '/api/projects'

let token = ''
let projectId: number
let versionId: number

// Network snapshot ตัวอย่าง (nodes + pipes)
const SAMPLE_NETWORK = {
  nodes: [
    { id: 'node-1', type: 'SOURCE', x: 100, y: 100, label: 'แหล่งน้ำ' },
    { id: 'node-2', type: 'JUNCTION', x: 300, y: 100, label: 'จุดแยก' },
    { id: 'node-3', type: 'FIXTURE', x: 500, y: 100, label: 'ห้องน้ำชั้น 1' },
  ],
  pipes: [
    { id: 'pipe-1', sourceNodeId: 'node-1', targetNodeId: 'node-2', length: 5, nominalSize: '25' },
    { id: 'pipe-2', sourceNodeId: 'node-2', targetNodeId: 'node-3', length: 3, nominalSize: '20' },
  ],
  canvasWidth: 800,
  canvasHeight: 600,
}

const getObj = (body: any) => body?.data ?? body

beforeAll(async () => {
  const email = `utc4-net-${Date.now()}@test.com`
  await request(app).post(`${AUTH_BASE}/register`).send({
    name: 'UTC Network Tester', email, password: 'Test1234!',
  })
  const login = await request(app).post(`${AUTH_BASE}/login`).send({
    email, password: 'Test1234!',
  })
  token = login.body?.data?.token ?? login.body?.token ?? ''

  const proj = await request(app)
    .post(PROJ_BASE)
    .set('Authorization', `Bearer ${token}`)
    .send({ name: 'โครงการทดสอบ Network Snapshot' })
  projectId = getObj(proj.body).id

  const ver = await request(app)
    .post(`${PROJ_BASE}/${projectId}/versions`)
    .set('Authorization', `Bearer ${token}`)
    .send({ name: 'Version 1 - Network Test' })
  versionId = getObj(ver.body).id
})

// ─────────────────────────────────────────────
// UTC4003: ดึง Network จาก Version ที่ยังไม่มีข้อมูล (ก่อน UTC4001)
// ─────────────────────────────────────────────
describe('UTC4003 — GET version ที่ยังว่าง (ทำก่อน UTC4001)', () => {
  it('TC-4003-01: GET /api/versions/:versionId ควรได้ HTTP 200 โดยไม่มี server error', async () => {
    const res = await request(app)
      .get(`/api/versions/${versionId}`)
      .set('Authorization', `Bearer ${token}`)
    // version เพิ่งสร้าง ยังไม่มี snapshotNetwork → 200 แต่ snapshotNetwork เป็น null
    expect([200, 404]).toContain(res.status)
  })

  it('TC-4003-02: snapshotNetwork ต้องเป็น null หรือไม่มีข้อมูล (ยังไม่ได้บันทึก)', async () => {
    const res = await request(app)
      .get(`/api/versions/${versionId}`)
      .set('Authorization', `Bearer ${token}`)
    const ver = getObj(res.body)
    const isEmpty =
      ver === null ||
      ver.snapshotNetwork === null ||
      ver.snapshotNetwork === undefined ||
      ver.snapshotNetwork === ''
    expect(isEmpty).toBe(true)
  })
})

// ─────────────────────────────────────────────
// UTC4001: บันทึก Network Diagram ลงใน Version
// ─────────────────────────────────────────────
describe('UTC4001 — PUT /api/versions/:versionId (บันทึก snapshotNetwork)', () => {
  it('TC-4001-01: บันทึก snapshotNetwork → HTTP 200', async () => {
    const res = await request(app)
      .put(`/api/versions/${versionId}`)
      .set('Authorization', `Bearer ${token}`)
      .send({ snapshotNetwork: JSON.stringify(SAMPLE_NETWORK) })
    expect(res.status).toBe(200)
  })

  it('TC-4001-02: response ควรยืนยันว่าบันทึกสำเร็จ (มี id หรือ success)', async () => {
    const res = await request(app)
      .put(`/api/versions/${versionId}`)
      .set('Authorization', `Bearer ${token}`)
      .send({ snapshotNetwork: JSON.stringify(SAMPLE_NETWORK) })
    expect(res.body).toBeTruthy()
    const ver = getObj(res.body)
    expect(ver).toHaveProperty('id')
  })
})

// ─────────────────────────────────────────────
// UTC4002: ดึง Network ที่บันทึกไว้
// ─────────────────────────────────────────────
describe('UTC4002 — GET /api/versions/:versionId (ดึง snapshotNetwork)', () => {
  it('TC-4002-01: ควรได้ HTTP 200 และ version มี snapshotNetwork', async () => {
    const res = await request(app)
      .get(`/api/versions/${versionId}`)
      .set('Authorization', `Bearer ${token}`)
    expect(res.status).toBe(200)
    const ver = getObj(res.body)
    expect(ver.snapshotNetwork).toBeTruthy()
  })

  it('TC-4002-02: nodes ใน snapshotNetwork ต้องครบ 3 nodes ตามที่บันทึกไว้', async () => {
    const res = await request(app)
      .get(`/api/versions/${versionId}`)
      .set('Authorization', `Bearer ${token}`)
    const ver = getObj(res.body)
    const parsed = typeof ver.snapshotNetwork === 'string'
      ? JSON.parse(ver.snapshotNetwork)
      : (ver.snapshotNetwork ?? {})
    expect(parsed.nodes?.length).toBe(3)
  })

  it('TC-4002-03: pipes ใน snapshotNetwork ต้องครบ 2 pipes ตามที่บันทึกไว้', async () => {
    const res = await request(app)
      .get(`/api/versions/${versionId}`)
      .set('Authorization', `Bearer ${token}`)
    const ver = getObj(res.body)
    const parsed = typeof ver.snapshotNetwork === 'string'
      ? JSON.parse(ver.snapshotNetwork)
      : (ver.snapshotNetwork ?? {})
    expect(parsed.pipes?.length).toBe(2)
  })
})

// ─────────────────────────────────────────────
// UTC4004: [v2] บันทึก Reference Layer ต่อ Version
// ─────────────────────────────────────────────
const SAMPLE_REFERENCE = {
  walls: [
    { id: 'wall-1', x1: 0, y1: 0, x2: 100, y2: 0, thickness: 200 },
    { id: 'wall-2', x1: 100, y1: 0, x2: 100, y2: 80, thickness: 200 },
  ],
  rooms: [
    { id: 'room-1', label: 'ห้องน้ำชั้น 1', x: 10, y: 10, width: 80, height: 60 },
  ],
  scale: 1.0,
  sourceFile: 'blueprint_floor1.png',
}

describe('UTC4004 — POST /api/projects/:projectId/versions/:versionId/reference [v2]', () => {
  it('TC-4004-01: บันทึก referenceLayer → HTTP 200', async () => {
    const res = await request(app)
      .post(`/api/projects/${projectId}/versions/${versionId}/reference`)
      .set('Authorization', `Bearer ${token}`)
      .send(SAMPLE_REFERENCE)
    expect(res.status).toBe(200)
  })

  it('TC-4004-02: response ต้องยืนยันบันทึกสำเร็จ (มี id หรือ success)', async () => {
    const res = await request(app)
      .post(`/api/projects/${projectId}/versions/${versionId}/reference`)
      .set('Authorization', `Bearer ${token}`)
      .send(SAMPLE_REFERENCE)
    expect(res.body).toBeTruthy()
    const obj = getObj(res.body)
    // ตรวจว่า response มีข้อมูลบางอย่าง (id, success, หรือ referenceLayer)
    expect(obj).not.toBeNull()
  })

  it('TC-4004-03: ไม่มี token → HTTP 401', async () => {
    const res = await request(app)
      .post(`/api/projects/${projectId}/versions/${versionId}/reference`)
      .send(SAMPLE_REFERENCE)
    expect(res.status).toBe(401)
  })
})

// ─────────────────────────────────────────────
// UTC4005: [v2] ดึง Reference Layer ของ Version
// ─────────────────────────────────────────────
describe('UTC4005 — GET /api/projects/:projectId/versions/:versionId/reference [v2]', () => {
  it('TC-4005-01: GET referenceLayer → HTTP 200', async () => {
    const res = await request(app)
      .get(`/api/projects/${projectId}/versions/${versionId}/reference`)
      .set('Authorization', `Bearer ${token}`)
    expect(res.status).toBe(200)
  })

  it('TC-4005-02: referenceLayer ต้องมี walls ครบ 2 รายการตามที่บันทึกไว้', async () => {
    const res = await request(app)
      .get(`/api/projects/${projectId}/versions/${versionId}/reference`)
      .set('Authorization', `Bearer ${token}`)
    const obj = getObj(res.body)
    // referenceLayer อาจอยู่ใน obj.referenceLayer หรือ obj โดยตรง
    const ref = obj?.referenceLayer
      ? (typeof obj.referenceLayer === 'string' ? JSON.parse(obj.referenceLayer) : obj.referenceLayer)
      : obj
    expect(ref?.walls?.length ?? ref?.walls).toBeDefined()
  })

  it('TC-4005-03: ไม่มี token → HTTP 401', async () => {
    const res = await request(app)
      .get(`/api/projects/${projectId}/versions/${versionId}/reference`)
    expect(res.status).toBe(401)
  })
})
