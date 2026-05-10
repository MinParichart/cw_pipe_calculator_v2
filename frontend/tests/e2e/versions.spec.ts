/**
 * System Tests: Version Management UI
 * STC3001 - สร้างเวอร์ชันแรกผ่าน UI
 * STC3002 - แสดงรายการเวอร์ชัน
 * STC3003 - Version 2 ไม่กระทบข้อมูลของ Version 1
 */

import { test, expect, Page } from '@playwright/test'

const EMAIL = `stc3-${Date.now()}@test.com`
const PASSWORD = 'Test1234!'
let projectUrl = ''

async function setupProjectAndLogin(page: Page) {
  await page.goto('/register')
  await page.fill('input[name="name"], input[placeholder*="ชื่อ"]', 'STC3 Version User')
  await page.fill('input[name="email"], input[type="email"]', EMAIL)
  await page.fill('input[name="password"], input[type="password"]', PASSWORD)
  const confirm = page.locator('input[name="confirmPassword"], input[name="confirm"]')
  if (await confirm.count() > 0) await confirm.fill(PASSWORD)
  await page.click('button[type="submit"]')

  if (page.url().includes('login')) {
    await page.fill('input[type="email"]', EMAIL)
    await page.fill('input[type="password"]', PASSWORD)
    await page.click('button[type="submit"]')
  }
  await page.waitForURL(/projects|dashboard/, { timeout: 10000 })

  // สร้างโครงการ
  const createBtn = page.locator('button:has-text("สร้างโครงการ"), a:has-text("สร้างโครงการ")')
  await createBtn.first().click()
  await page.fill('input[name="name"]', 'โครงการ STC3')
  await page.click('button[type="submit"]')
  await page.waitForURL(/projects\/\d+/, { timeout: 10000 })
  projectUrl = page.url()
}

// ─────────────────────────────────────────────
// STC3001: สร้างเวอร์ชันแรกผ่าน UI
// ─────────────────────────────────────────────
test('STC3001 — สร้าง Version 1 ผ่าน UI และแสดงในรายการ', async ({ page }) => {
  await setupProjectAndLogin(page)

  const createVerBtn = page.locator('button:has-text("สร้างเวอร์ชัน"), button:has-text("Version ใหม่"), a:has-text("สร้าง")')
  await createVerBtn.first().click()

  const nameField = page.locator('input[name="name"], input[placeholder*="Version"]')
  await nameField.fill('Version 1 - แบบร่างแรก')
  await page.click('button[type="submit"]')

  await expect(page.locator('text=Version 1')).toBeVisible({ timeout: 10000 })
})

// ─────────────────────────────────────────────
// STC3002: แสดงรายการเวอร์ชัน
// ─────────────────────────────────────────────
test('STC3002 — หน้า Versions แสดงรายการพร้อม versionNumber', async ({ page }) => {
  await setupProjectAndLogin(page)

  // Version list ต้องปรากฏ
  const versionItems = page.locator('[data-testid*="version"], [class*="version-card"], text=/Version \d/')
  await expect(versionItems.first()).toBeVisible({ timeout: 10000 })
})

// ─────────────────────────────────────────────
// STC3003: Version 2 ไม่กระทบข้อมูลของ Version 1
// ─────────────────────────────────────────────
test('STC3003 — สร้าง Version 2 แล้วข้อมูล Version 1 ยังครบถ้วน', async ({ page }) => {
  await setupProjectAndLogin(page)

  // สร้าง Version 1
  const createVerBtn = page.locator('button:has-text("สร้างเวอร์ชัน"), button:has-text("Version ใหม่")')
  await createVerBtn.first().click()
  await page.fill('input[name="name"]', 'Version 1 - isolation test')
  await page.click('button[type="submit"]')
  await page.waitForTimeout(1000)

  // สร้าง Version 2
  const createVerBtn2 = page.locator('button:has-text("สร้างเวอร์ชัน"), button:has-text("Version ใหม่")')
  await createVerBtn2.first().click()
  await page.fill('input[name="name"]', 'Version 2 - ใหม่')
  await page.click('button[type="submit"]')
  await page.waitForTimeout(1000)

  // Version 1 ต้องยังอยู่ในรายการ
  await expect(page.locator('text=Version 1 - isolation test')).toBeVisible({ timeout: 5000 })
})
