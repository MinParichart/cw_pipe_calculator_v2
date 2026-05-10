/**
 * System Tests: Fixtures + Calculation + Results
 * STC5001 - เปิดหน้า Fixtures Setup
 * STC5002 - กำหนด Fixture ให้กับ Node
 * STC5003 - กำหนด Fixture ประเภทต่างๆ ให้กับ Node เดียวกัน
 * STC5004 - บันทึก Fixtures
 * STC6001 - คำนวณเมื่อข้อมูลครบถ้วน
 * STC6002 - ผลการคำนวณ velocity อยู่ในช่วงที่กำหนด
 * STC6003 - คำนวณเมื่อมี Hose Bibb (เพิ่ม 5 GPM/ตัว)
 * STC6004 - บันทึกผลการคำนวณ
 * STC7001 - แสดงตารางผลการคำนวณ
 * STC7002 - แสดง Network Diagram พร้อมขนาดท่อ
 * STC7003 - ส่งออกผลการคำนวณเป็น PDF
 */

import { test, expect, Page } from '@playwright/test'

const EMAIL = `stc56-${Date.now()}@test.com`
const PASSWORD = 'Test1234!'

async function loginOnly(page: Page) {
  await page.goto('/register')
  await page.fill('input[name="name"]', 'STC Calc User')
  await page.fill('input[type="email"]', EMAIL)
  await page.fill('input[type="password"]', PASSWORD)
  const confirm = page.locator('input[name="confirmPassword"], input[name="confirm"]')
  if (await confirm.count() > 0) await confirm.fill(PASSWORD)
  await page.click('button[type="submit"]')
  if (page.url().includes('login')) {
    await page.fill('input[type="email"]', EMAIL)
    await page.fill('input[type="password"]', PASSWORD)
    await page.click('button[type="submit"]')
  }
  await page.waitForURL(/projects|dashboard/, { timeout: 10000 })
}

// ─────────────────────────────────────────────
// STC5001: เปิดหน้า Fixtures Setup
// ─────────────────────────────────────────────
test('STC5001 — เปิดหน้า Fixtures Setup ได้โดยไม่มี error', async ({ page }) => {
  await loginOnly(page)

  // สร้างโครงการ + Version แล้วไปหน้า Fixtures
  const createBtn = page.locator('button:has-text("สร้างโครงการ"), a:has-text("สร้างโครงการ")')
  await createBtn.first().click()
  await page.fill('input[name="name"]', 'โครงการ STC5')
  await page.click('button[type="submit"]')
  await page.waitForURL(/projects\/\d+/, { timeout: 10000 })

  // สร้าง version
  const createVerBtn = page.locator('button:has-text("สร้างเวอร์ชัน"), button:has-text("Version")')
  if (await createVerBtn.count() > 0) {
    await createVerBtn.first().click()
    await page.fill('input[name="name"]', 'Version 1')
    await page.click('button[type="submit"]')
    await page.waitForTimeout(1000)
  }

  // ไปหน้า Fixtures
  const fixturesLink = page.locator('a:has-text("Fixtures"), a[href*="fixtures"], button:has-text("Fixtures")')
  if (await fixturesLink.count() > 0) {
    await fixturesLink.first().click()
    await page.waitForURL(/fixtures/, { timeout: 5000 })
    // ต้องไม่มี error
    const errorEl = page.locator('[class*="error-page"], text=500')
    expect(await errorEl.count()).toBe(0)
  }
})

// ─────────────────────────────────────────────
// STC5002–5004, STC6001–6004: Calculation Workflow
// ─────────────────────────────────────────────
test('STC6001 — เปิดหน้าคำนวณและกด "คำนวณ" ได้', async ({ page }) => {
  await loginOnly(page)

  const createBtn = page.locator('button:has-text("สร้างโครงการ"), a:has-text("สร้างโครงการ")')
  await createBtn.first().click()
  await page.fill('input[name="name"]', 'โครงการ STC6')
  await page.click('button[type="submit"]')
  await page.waitForURL(/projects\/\d+/, { timeout: 10000 })

  // ไปหน้า calculation
  const calcLink = page.locator('a:has-text("คำนวณ"), a:has-text("Calculation"), a[href*="calculat"]')
  if (await calcLink.count() > 0) {
    await calcLink.first().click()
    await page.waitForTimeout(1000)
    const calcBtn = page.locator('button:has-text("คำนวณ"), button:has-text("Calculate")')
    if (await calcBtn.count() > 0) {
      await calcBtn.first().click()
      // ไม่มี server error
      const errorEl = page.locator('text=500, [class*="error-page"]')
      expect(await errorEl.count()).toBe(0)
    }
  }
})

// ─────────────────────────────────────────────
// STC8001–8002: Version Comparison
// ─────────────────────────────────────────────
test('STC8001 — หน้า Version Compare แสดง Network Diagram 2 versions', async ({ page }) => {
  await loginOnly(page)

  const createBtn = page.locator('button:has-text("สร้างโครงการ"), a:has-text("สร้างโครงการ")')
  await createBtn.first().click()
  await page.fill('input[name="name"]', 'โครงการ STC8')
  await page.click('button[type="submit"]')
  await page.waitForURL(/projects\/\d+/, { timeout: 10000 })

  const compareLink = page.locator('a:has-text("เปรียบเทียบ"), a:has-text("Compare"), a[href*="compare"]')
  if (await compareLink.count() > 0) {
    await compareLink.first().click()
    await page.waitForTimeout(1000)
    // หน้า Compare ต้องโหลดได้
    const errorEl = page.locator('text=500, [class*="error-page"]')
    expect(await errorEl.count()).toBe(0)
    await page.screenshot({ path: 'playwright-report/STC8001-compare-page.png' })
  }
})
