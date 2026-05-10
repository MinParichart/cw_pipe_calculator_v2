/**
 * System Tests: Authentication UI
 * STC1001 - สมัครสมาชิกผ่าน UI
 * STC1002 - เข้าสู่ระบบด้วยข้อมูลถูกต้อง
 * STC1003 - เข้าสู่ระบบด้วย password ผิด
 * STC1004 - เข้า /dashboard โดยไม่ login → redirect ไป /login
 * STC1005 - ออกจากระบบ
 */

import { test, expect } from '@playwright/test'

const EMAIL = `stc1-${Date.now()}@test.com`
const PASSWORD = 'Test1234!'
const NAME = 'STC Auth User'

// ─────────────────────────────────────────────
// STC1001: สมัครสมาชิกผ่าน UI
// ─────────────────────────────────────────────
test('STC1001 — สมัครสมาชิกผ่าน UI สำเร็จ', async ({ page }) => {
  await page.goto('/register')
  await page.fill('input[name="name"], input[placeholder*="ชื่อ"]', NAME)
  await page.fill('input[name="email"], input[type="email"]', EMAIL)
  await page.fill('input[name="password"], input[type="password"]', PASSWORD)

  const confirmField = page.locator('input[name="confirmPassword"], input[name="confirm"]')
  if (await confirmField.count() > 0) await confirmField.fill(PASSWORD)

  await page.click('button[type="submit"]')

  // ระบบต้องเปลี่ยนหน้าไป dashboard หรือ login หลังสมัครสำเร็จ
  await expect(page).toHaveURL(/projects|dashboard|login/, { timeout: 10000 })
})

// ─────────────────────────────────────────────
// STC1002: เข้าสู่ระบบด้วยข้อมูลถูกต้อง
// ─────────────────────────────────────────────
test('STC1002 — เข้าสู่ระบบด้วยข้อมูลถูกต้อง', async ({ page }) => {
  await page.goto('/login')
  await page.fill('input[name="email"], input[type="email"]', EMAIL)
  await page.fill('input[name="password"], input[type="password"]', PASSWORD)
  await page.click('button[type="submit"]')

  // ต้องเปลี่ยนหน้าไป projects/dashboard
  await expect(page).toHaveURL(/projects|dashboard/, { timeout: 10000 })
})

// ─────────────────────────────────────────────
// STC1003: เข้าสู่ระบบด้วย password ผิด
// ─────────────────────────────────────────────
test('STC1003 — เข้าสู่ระบบด้วย password ผิด → แสดง error', async ({ page }) => {
  await page.goto('/login')
  await page.fill('input[name="email"], input[type="email"]', EMAIL)
  await page.fill('input[name="password"], input[type="password"]', 'WrongPassword!')
  await page.click('button[type="submit"]')

  // ต้องยังอยู่หน้า login และมี error message
  await expect(page).toHaveURL(/login/, { timeout: 5000 })
  const errorMsg = page.locator('[class*="error"], [class*="alert"], [role="alert"], .text-red-500, .text-danger')
  await expect(errorMsg.first()).toBeVisible({ timeout: 5000 })
})

// ─────────────────────────────────────────────
// STC1004: เข้า /dashboard โดยไม่ login → redirect
// ─────────────────────────────────────────────
test('STC1004 — เข้า protected page โดยไม่ login → redirect ไป /login', async ({ page }) => {
  await page.goto('/projects')
  await expect(page).toHaveURL(/login/, { timeout: 5000 })
})

// ─────────────────────────────────────────────
// STC1005: ออกจากระบบ
// ─────────────────────────────────────────────
test('STC1005 — ออกจากระบบสำเร็จ → กลับหน้า login', async ({ page }) => {
  // Login ก่อน
  await page.goto('/login')
  await page.fill('input[name="email"], input[type="email"]', EMAIL)
  await page.fill('input[name="password"], input[type="password"]', PASSWORD)
  await page.click('button[type="submit"]')
  await page.waitForURL(/projects|dashboard/, { timeout: 10000 })

  // Logout
  const logoutBtn = page.locator('button:has-text("ออกจากระบบ"), button:has-text("Logout"), [data-testid="logout"]')
  await logoutBtn.first().click()
  await expect(page).toHaveURL(/login/, { timeout: 5000 })
})
