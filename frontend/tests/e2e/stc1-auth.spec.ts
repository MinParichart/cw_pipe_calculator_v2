/**
 * System Tests: Authentication
 * STC1001 - ลงทะเบียนเพื่อเข้าใช้งาน (register)
 * STC1002 - เข้าใช้งานระบบ (login)
 * STC1003 - แสดง error เมื่อ password ไม่ถูกต้อง
 * STC1004 - เข้าถึงหน้าที่ต้อง login โดยไม่ได้ล็อกอิน → redirect
 * STC1005 - ออกจากระบบทำงานได้ถูกต้อง
 *
 * หมายเหตุ:
 * - Login page อยู่ที่ '/' (pages/index.vue)
 * - Auth middleware redirect ไปที่ '/' เมื่อไม่ได้ login
 * - Logout มี confirmation dialog ก่อน (AppNavbar.vue)
 * - หลัง register/login redirect ไปที่ '/projects'
 */

import { test, expect, Browser, Page } from '@playwright/test'

const BASE = 'http://localhost:3003'
const UNIQUE = Date.now()
const USER = {
  username: 'STCAuthTester',
  email: `stc1-auth-${UNIQUE}@test.com`,
  password: 'Test1234!',
}

// register user ก่อน 1 ครั้ง ทุก test ใช้ user นี้ได้เลย
test.describe('STC1 — Authentication', () => {
  test.beforeAll(async ({ browser }) => {
    const page = await browser.newPage()
    await page.goto(`${BASE}/register`)
    await page.waitForLoadState('networkidle')
    await page.fill('[name="username"]', USER.username)
    await page.fill('[name="email"]', USER.email)
    await page.fill('[name="password"]', USER.password)
    await page.fill('[name="confirm-password"]', USER.password)
    await page.click('button[type="submit"]')
    await page.waitForURL(/\/projects/, { timeout: 10_000 })
    await page.close()
  })

  // ─────────────────────────────────────────────
  // STC1001: Register (ทดสอบซ้ำด้วย email ใหม่)
  // ─────────────────────────────────────────────
  test('STC1001 — ลงทะเบียนสมาชิกสำเร็จ redirect ไปหน้า /projects', async ({ page }) => {
    const uniqueEmail = `stc1001-${Date.now()}@test.com`

    await page.goto(`${BASE}/register`)
    await page.waitForLoadState('networkidle')
    await page.fill('[name="username"]', 'STC1001User')
    await page.fill('[name="email"]', uniqueEmail)
    await page.fill('[name="password"]', USER.password)
    await page.fill('[name="confirm-password"]', USER.password)
    await page.click('button[type="submit"]')

    // RegisterForm.vue: router.push('/projects') on success
    await expect(page).toHaveURL(/\/projects/, { timeout: 10_000 })
  })

  // ─────────────────────────────────────────────
  // STC1002: Login
  // ─────────────────────────────────────────────
  test('STC1002 — Login ด้วยข้อมูลถูกต้อง → redirect ไปหน้า /projects', async ({ page }) => {
    await page.goto(`${BASE}/`)
    await page.waitForLoadState('networkidle')
    await page.fill('[name="email"]', USER.email)
    await page.fill('[name="password"]', USER.password)
    await page.click('button[type="submit"]')

    // LoginForm.vue: router.push('/projects') on success
    await expect(page).toHaveURL(/\/projects/, { timeout: 10_000 })
  })

  // ─────────────────────────────────────────────
  // STC1003: Login ด้วย password ผิด → error
  // ─────────────────────────────────────────────
  test('STC1003 — Login ด้วย password ผิด → แสดง error ยังอยู่หน้าเดิม', async ({ page }) => {
    await page.goto(`${BASE}/`)
    await page.waitForLoadState('networkidle')
    await page.fill('[name="email"]', USER.email)
    await page.fill('[name="password"]', 'WrongPassword!') // intentionally wrong
    await page.click('button[type="submit"]')

    // ยังอยู่ที่ '/'
    await expect(page).toHaveURL(`${BASE}/`, { timeout: 5_000 })

    // LoginForm.vue: error แสดงใน div.bg-red-50
    await expect(page.locator('.bg-red-50')).toBeVisible({ timeout: 5_000 })
  })

  // ─────────────────────────────────────────────
  // STC1004: เข้าถึงหน้า Protected โดยไม่ login → redirect
  // ─────────────────────────────────────────────
  test('STC1004 — เข้า /projects โดยไม่ login → redirect ไปหน้า /', async ({ page }) => {
    // fresh browser context = ไม่มี auth token ใน localStorage อยู่แล้ว
    // ไม่ต้อง clearCookies/localStorage — เรียกได้เลย
    await page.goto(`${BASE}/projects`)

    // middleware/auth.ts: navigateTo('/') เมื่อไม่ได้ login
    await expect(page).toHaveURL(`${BASE}/`, { timeout: 10_000 })
  })

  // ─────────────────────────────────────────────
  // STC1005: Logout
  // ─────────────────────────────────────────────
  test('STC1005 — Logout → redirect กลับหน้า /', async ({ page }) => {
    // Login ก่อน
    await page.goto(`${BASE}/`)
    await page.waitForLoadState('networkidle')
    await page.fill('[name="email"]', USER.email)
    await page.fill('[name="password"]', USER.password)
    await page.click('button[type="submit"]')
    await expect(page).toHaveURL(/\/projects/, { timeout: 10_000 })

    // AppNavbar.vue: กด logout → เปิด confirmation dialog
    await page.locator('button:has-text("ออกจากระบบ")').first().click()

    // กด confirm ใน dialog
    await page.locator('button:has-text("ตกลง")').last().click()

    // useAuth.ts: navigateTo('/') หลัง logout
    await expect(page).toHaveURL(`${BASE}/`, { timeout: 10_000 })
  })
})
