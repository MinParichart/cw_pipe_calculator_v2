/**
 * Integration Tests: Authentication API
 * UTC1001 - สมัครสมาชิกด้วยข้อมูลครบถ้วน
 * UTC1002 - สมัครสมาชิกด้วย email ซ้ำ
 * UTC1003 - เข้าสู่ระบบด้วยข้อมูลถูกต้อง
 * UTC1004 - เข้าสู่ระบบด้วยรหัสผ่านที่ไม่ถูกต้อง
 * UTC1005 - เข้าสู่ระบบโดยไม่กรอกข้อมูล
 * UTC1006 - ดึงข้อมูลผู้ใช้ปัจจุบันด้วย token ถูกต้อง
 * UTC1007 - เข้าถึง Protected Route โดยไม่มี token
 * UTC1008 - ออกจากระบบ
 *
 * NOTE: API response structure = { success: true, data: { token, user } }
 */

import { describe, it, expect } from 'vitest'
import request from 'supertest'
import app from '../../src/app'

const BASE = '/api/auth'
const TEST_USER = {
  name: 'UTC Auth Tester',
  email: `utc1-auth-${Date.now()}@test.com`,
  password: 'Test1234!',
}
let authToken = ''

// helper: ดึง token จาก response ที่อาจอยู่ใน .data หรือ root
const getToken = (body: any): string =>
  body?.data?.token ?? body?.token ?? ''

const getUser = (body: any): any =>
  body?.data?.user ?? body?.user ?? body?.data ?? {}

// ─────────────────────────────────────────────
// UTC1001: สมัครสมาชิกด้วยข้อมูลครบถ้วน
// ─────────────────────────────────────────────
describe('UTC1001 — POST /api/auth/register (ข้อมูลครบถ้วน)', () => {
  it('TC-1001-01: ควรได้ HTTP 201 พร้อม token', async () => {
    const res = await request(app).post(`${BASE}/register`).send(TEST_USER)
    expect(res.status).toBe(201)
    const token = getToken(res.body)
    expect(token).toBeTruthy()
    expect(typeof token).toBe('string')
    authToken = token
  })

  it('TC-1001-02: response ควรมี user object พร้อม email', async () => {
    const res = await request(app).post(`${BASE}/register`).send({
      name: 'UTC Extra',
      email: `utc1-extra-${Date.now()}@test.com`,
      password: 'Test1234!',
    })
    const user = getUser(res.body)
    expect(user).toBeTruthy()
    expect(user.email ?? res.body?.data?.email).toBeDefined()
  })
})

// ─────────────────────────────────────────────
// UTC1002: สมัครสมาชิกด้วย email ซ้ำ
// ─────────────────────────────────────────────
describe('UTC1002 — POST /api/auth/register (email ซ้ำ)', () => {
  it('TC-1002-01: ควรได้ HTTP 400 หรือ 409', async () => {
    const res = await request(app).post(`${BASE}/register`).send(TEST_USER)
    expect([400, 409]).toContain(res.status)
  })

  it('TC-1002-02: body ควรมี error message', async () => {
    const res = await request(app).post(`${BASE}/register`).send(TEST_USER)
    const hasError = res.body.error || res.body.message || res.body.errors ||
                     res.body?.data?.message
    expect(hasError).toBeTruthy()
  })
})

// ─────────────────────────────────────────────
// UTC1003: เข้าสู่ระบบด้วยข้อมูลถูกต้อง
// ─────────────────────────────────────────────
describe('UTC1003 — POST /api/auth/login (ข้อมูลถูกต้อง)', () => {
  it('TC-1003-01: ควรได้ HTTP 200 พร้อม JWT token', async () => {
    const res = await request(app).post(`${BASE}/login`).send({
      email: TEST_USER.email,
      password: TEST_USER.password,
    })
    expect(res.status).toBe(200)
    const token = getToken(res.body)
    expect(token).toBeTruthy()
    authToken = token
  })

  it('TC-1003-02: token ควรเป็น JWT string (3 ส่วนคั่นด้วย .)', async () => {
    const res = await request(app).post(`${BASE}/login`).send({
      email: TEST_USER.email,
      password: TEST_USER.password,
    })
    const token = getToken(res.body)
    const parts = token.split('.')
    expect(parts.length).toBe(3)
  })
})

// ─────────────────────────────────────────────
// UTC1004: เข้าสู่ระบบด้วยรหัสผ่านที่ไม่ถูกต้อง
// ─────────────────────────────────────────────
describe('UTC1004 — POST /api/auth/login (password ผิด)', () => {
  it('TC-1004-01: ควรได้ HTTP 401', async () => {
    const res = await request(app).post(`${BASE}/login`).send({
      email: TEST_USER.email,
      password: 'WrongPassword123!',
    })
    expect(res.status).toBe(401)
  })

  it('TC-1004-02: ควรไม่มี token ใน response', async () => {
    const res = await request(app).post(`${BASE}/login`).send({
      email: TEST_USER.email,
      password: 'WrongPassword123!',
    })
    const token = getToken(res.body)
    expect(token).toBeFalsy()
  })
})

// ─────────────────────────────────────────────
// UTC1005: เข้าสู่ระบบโดยไม่กรอกข้อมูล
// ─────────────────────────────────────────────
describe('UTC1005 — POST /api/auth/login (ไม่กรอกข้อมูล)', () => {
  it('TC-1005-01: ส่ง body ว่าง → HTTP 400', async () => {
    const res = await request(app).post(`${BASE}/login`).send({})
    expect(res.status).toBe(400)
  })

  it('TC-1005-02: ส่งแค่ email ไม่มี password → HTTP 400', async () => {
    const res = await request(app).post(`${BASE}/login`).send({
      email: TEST_USER.email,
    })
    expect(res.status).toBe(400)
  })

  it('TC-1005-03: ส่งแค่ password ไม่มี email → HTTP 400', async () => {
    const res = await request(app).post(`${BASE}/login`).send({
      password: TEST_USER.password,
    })
    expect(res.status).toBe(400)
  })
})

// ─────────────────────────────────────────────
// UTC1006: ดึงข้อมูลผู้ใช้ปัจจุบันด้วย token ถูกต้อง
// ─────────────────────────────────────────────
describe('UTC1006 — GET /api/auth/me (token ถูกต้อง)', () => {
  it('TC-1006-01: ควรได้ HTTP 200 พร้อม user object', async () => {
    // login ใหม่เพื่อให้ได้ token สด
    const login = await request(app).post(`${BASE}/login`).send({
      email: TEST_USER.email,
      password: TEST_USER.password,
    })
    const token = getToken(login.body)
    const res = await request(app)
      .get(`${BASE}/me`)
      .set('Authorization', `Bearer ${token}`)
    expect(res.status).toBe(200)
    // email อาจอยู่ใน res.body หรือ res.body.data
    const email = res.body?.email ?? res.body?.data?.email
    expect(email).toBe(TEST_USER.email)
  })

  it('TC-1006-02: ไม่ควรมี password ใน response', async () => {
    const login = await request(app).post(`${BASE}/login`).send({
      email: TEST_USER.email,
      password: TEST_USER.password,
    })
    const token = getToken(login.body)
    const res = await request(app)
      .get(`${BASE}/me`)
      .set('Authorization', `Bearer ${token}`)
    const password = res.body?.password ?? res.body?.data?.password
    expect(password).toBeUndefined()
  })
})

// ─────────────────────────────────────────────
// UTC1007: เข้าถึง Protected Route โดยไม่มี token
// ─────────────────────────────────────────────
describe('UTC1007 — GET /api/auth/me (ไม่มี token)', () => {
  it('TC-1007-01: ไม่มี Authorization header → HTTP 401', async () => {
    const res = await request(app).get(`${BASE}/me`)
    expect(res.status).toBe(401)
  })

  it('TC-1007-02: token ผิดรูปแบบ → HTTP 401', async () => {
    const res = await request(app)
      .get(`${BASE}/me`)
      .set('Authorization', 'Bearer invalid.token.here')
    expect(res.status).toBe(401)
  })
})

// ─────────────────────────────────────────────
// UTC1008: ออกจากระบบ
// ─────────────────────────────────────────────
describe('UTC1008 — POST /api/auth/logout', () => {
  it('TC-1008-01: ออกจากระบบพร้อม token ถูกต้อง → HTTP 200', async () => {
    const login = await request(app).post(`${BASE}/login`).send({
      email: TEST_USER.email,
      password: TEST_USER.password,
    })
    const token = getToken(login.body)
    const res = await request(app)
      .post(`${BASE}/logout`)
      .set('Authorization', `Bearer ${token}`)
    expect(res.status).toBe(200)
  })
})
