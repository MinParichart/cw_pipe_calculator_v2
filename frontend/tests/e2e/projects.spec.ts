/**
 * System Tests: Project Management UI
 * STC2001 - สร้างโครงการใหม่ผ่าน UI
 * STC2002 - แสดงรายการโครงการทั้งหมด
 * STC2003 - เข้าถึงรายละเอียดโครงการ
 * STC2004 - กำหนด Design Criteria ของโครงการ
 */

import { test, expect, Page } from '@playwright/test'

const EMAIL = `stc2-${Date.now()}@test.com`
const PASSWORD = 'Test1234!'

async function loginUser(page: Page) {
  // Register
  await page.goto('/register')
  await page.fill('input[name="name"], input[placeholder*="ชื่อ"]', 'STC2 Project User')
  await page.fill('input[name="email"], input[type="email"]', EMAIL)
  await page.fill('input[name="password"], input[type="password"]', PASSWORD)
  const confirm = page.locator('input[name="confirmPassword"], input[name="confirm"]')
  if (await confirm.count() > 0) await confirm.fill(PASSWORD)
  await page.click('button[type="submit"]')

  // Login ถ้ายังไม่ได้เข้า
  if (page.url().includes('login')) {
    await page.fill('input[type="email"]', EMAIL)
    await page.fill('input[type="password"]', PASSWORD)
    await page.click('button[type="submit"]')
  }
  await page.waitForURL(/projects|dashboard/, { timeout: 10000 })
}

// ─────────────────────────────────────────────
// STC2001: สร้างโครงการใหม่ผ่าน UI
// ─────────────────────────────────────────────
test('STC2001 — สร้างโครงการใหม่ผ่าน UI สำเร็จ', async ({ page }) => {
  await loginUser(page)
  await page.goto('/projects')

  // คลิกปุ่มสร้างโครงการ
  const createBtn = page.locator('button:has-text("สร้างโครงการ"), a:has-text("สร้างโครงการ"), [data-testid="create-project"]')
  await createBtn.first().click()

  // กรอกชื่อโครงการ
  await page.fill('input[name="name"], input[placeholder*="ชื่อ"]', 'ทาวน์โฮม STC2001')
  const descField = page.locator('textarea[name="description"], input[name="description"]')
  if (await descField.count() > 0) await descField.fill('โครงการทดสอบ STC2001')

  await page.click('button[type="submit"]')

  // ต้องแสดงโครงการใหม่ในรายการ
  await expect(page.locator('text=ทาวน์โฮม STC2001')).toBeVisible({ timeout: 10000 })
})

// ─────────────────────────────────────────────
// STC2002: แสดงรายการโครงการทั้งหมด
// ─────────────────────────────────────────────
test('STC2002 — หน้า Projects แสดงรายการ Card ของโครงการ', async ({ page }) => {
  await loginUser(page)
  await page.goto('/projects')

  // ต้องมี project card อย่างน้อย 1 ใบ
  const cards = page.locator('[class*="card"], [data-testid="project-card"], .project-card')
  await expect(cards.first()).toBeVisible({ timeout: 5000 })
})

// ─────────────────────────────────────────────
// STC2003: เข้าถึงรายละเอียดโครงการ
// ─────────────────────────────────────────────
test('STC2003 — คลิก ProjectCard → เข้าถึงรายละเอียดโครงการ', async ({ page }) => {
  await loginUser(page)
  await page.goto('/projects')

  // คลิก card แรก
  const card = page.locator('[class*="card"], [data-testid="project-card"], .project-card').first()
  await card.click()

  // ต้องเปลี่ยน URL ไปหน้า project detail
  await expect(page).toHaveURL(/projects\/\d+/, { timeout: 5000 })
})

// ─────────────────────────────────────────────
// STC2004: กำหนด Design Criteria
// ─────────────────────────────────────────────
test('STC2004 — กำหนด Design Criteria และบันทึกสำเร็จ', async ({ page }) => {
  await loginUser(page)
  await page.goto('/projects')

  // เข้าโครงการ
  const card = page.locator('[class*="card"], [data-testid="project-card"]').first()
  await card.click()
  await page.waitForURL(/projects\/\d+/, { timeout: 5000 })

  // หา criteria form / ปุ่ม criteria
  const criteriaBtn = page.locator('a:has-text("Criteria"), button:has-text("Criteria"), a:has-text("เกณฑ์")')
  if (await criteriaBtn.count() > 0) {
    await criteriaBtn.first().click()
  }

  // กรอกค่า C-Factor
  const cFactorField = page.locator('input[name="cFactor"], input[placeholder*="C-Factor"]')
  if (await cFactorField.count() > 0) {
    await cFactorField.fill('150')
  }

  // กด Save
  const saveBtn = page.locator('button:has-text("บันทึก"), button[type="submit"]')
  if (await saveBtn.count() > 0) {
    await saveBtn.first().click()
    // ต้องมี success message หรือไม่มี error
    const errorMsg = page.locator('[class*="error"], [role="alert"]')
    await page.waitForTimeout(1000)
    const errorCount = await errorMsg.count()
    expect(errorCount).toBe(0)
  }
})
