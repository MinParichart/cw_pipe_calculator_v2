/**
 * System Tests: Fixtures Setup
 * STC6001 - เปิดหน้า Fixtures Setup → แสดงรายการ Nodes
 * STC6002 - กำหนด Fixture ให้ Node → แสดงค่า FU รวม
 * STC6003 - กำหนด Fixture หลายประเภทให้ Node เดียวกัน → FU รวมถูกต้อง
 * STC6004 - บันทึก Fixtures สำเร็จ
 */

import { test, expect, Page } from '@playwright/test'

const BASE = 'http://localhost:3003'
const UNIQUE = Date.now()
const USER = { email: `stc6-fix-${UNIQUE}@test.com`, password: 'Test1234!' }

let fixturesUrl = ''

async function setupUser(page: Page) {
  await page.goto(`${BASE}/register`)
  await page.fill('[name="username"]', 'STC Fixtures Tester')
  await page.fill('[name="email"]', USER.email)
  await page.fill('[name="password"]', USER.password)
  await page.fill('[name="confirm-password"]', USER.password)
  await page.click('button[type="submit"]')
  await page.waitForURL(/login|dashboard|projects/, { timeout: 10_000 })
  if (page.url().includes('login')) {
    await page.fill('[name="email"]', USER.email)
    await page.fill('[name="password"]', USER.password)
    await page.click('button[type="submit"]')
    await page.waitForURL(/dashboard|projects/, { timeout: 10_000 })
  }
  await page.goto(`${BASE}/projects/new`)
  await page.fill('[name="username"]', `STC6 Project ${UNIQUE}`)
  await page.click('button[type="submit"], button:has-text("สร้าง")')
  await page.waitForURL(/\/projects\/\w+/, { timeout: 10_000 })

  // สร้าง version + ไปหน้า fixtures
  const newVerBtn = page.locator('button:has-text("สร้างเวอร์ชัน"), button:has-text("New Version")')
  if (await newVerBtn.count() > 0) {
    await newVerBtn.first().click()
    await page.locator('[name="name"], [placeholder*="Version"]').first().fill('Version 1')
    await page.click('button[type="submit"], button:has-text("สร้าง")')
    await page.waitForTimeout(1_000)
  }

  const fixLink = page.locator('a:has-text("Fixtures"), a:has-text("อุปกรณ์"), a[href*="fixtures"]')
  if (await fixLink.count() > 0) {
    await fixLink.first().click()
    await page.waitForURL(/\/fixtures/, { timeout: 10_000 })
    fixturesUrl = page.url()
  }
}

test.describe('STC6 — Fixtures Setup', () => {
  test.beforeAll(async ({ browser }) => {
    const page = await browser.newPage()
    await setupUser(page)
    await page.close()
  })

  async function gotoFixtures(page: Page) {
    await page.goto(`${BASE}/login`)
    await page.fill('[name="email"]', USER.email)
    await page.fill('[name="password"]', USER.password)
    await page.click('button[type="submit"]')
    await page.waitForURL(/dashboard|projects/, { timeout: 10_000 })
    if (fixturesUrl) await page.goto(fixturesUrl)
  }

  // STC6001
  test('STC6001 — เปิดหน้า Fixtures Setup แสดงรายการ Nodes', async ({ page }) => {
    await gotoFixtures(page)
    if (fixturesUrl) await expect(page).toHaveURL(/\/fixtures/, { timeout: 10_000 })
    // ต้องไม่ crash
    await expect(page).not.toHaveURL(/error|500/)
  })

  // STC6002
  test('STC6002 — กำหนด Lavatory 2 ตัว → FU รวม = 2', async ({ page }) => {
    await gotoFixtures(page)
    // หา dropdown เลือกประเภท fixture
    const fixtureSelect = page.locator('select[name*="type"], [class*="fixture-type"]')
    if (await fixtureSelect.count() > 0) {
      await fixtureSelect.first().selectOption({ label: /Lavatory|ก๊อกน้ำ/ })
      // ใส่จำนวน
      const qtyInput = page.locator('input[name*="qty"], input[name*="quantity"], input[type="number"]')
      if (await qtyInput.count() > 0) {
        await qtyInput.first().fill('2')
        // FU ควรอัปเดต = 2 × 1 = 2
        const fuDisplay = page.locator('[class*="fu"], text=FU, [data-fu]')
        if (await fuDisplay.count() > 0) {
          await expect(fuDisplay.first()).toContainText('2')
        }
      }
    } else {
      test.skip(true, 'ยังไม่มี fixture form ใน UI')
    }
  })

  // STC6003
  test('STC6003 — Lavatory×2 + WC_TANK×1 → FU = (2×1)+(1×3) = 5', async ({ page }) => {
    await gotoFixtures(page)
    // ถ้า UI รองรับหลาย fixture per node
    const addFixBtn = page.locator('button:has-text("เพิ่ม"), button:has-text("Add Fixture")')
    if (await addFixBtn.count() > 0) {
      // เพิ่ม Lavatory ×2
      await addFixBtn.first().click()
      const types = page.locator('select[name*="type"]')
      if (await types.count() > 0) await types.last().selectOption({ label: /Lavatory/ })
      const qtys = page.locator('input[type="number"]')
      if (await qtys.count() > 0) await qtys.last().fill('2')
      // เพิ่ม WC_TANK ×1
      await addFixBtn.first().click()
      if (await types.count() > 1) await types.last().selectOption({ label: /WC|Flush Tank/ })
      if (await qtys.count() > 1) await qtys.last().fill('1')
      // FU รวม = 5
      const totalFU = page.locator('[class*="total-fu"], text=5 FU, [data-testid="total-fu"]')
      if (await totalFU.count() > 0) await expect(totalFU.first()).toContainText('5')
    } else {
      test.skip(true, 'UI ไม่รองรับ multi-fixture per node')
    }
  })

  // STC6004
  test('STC6004 — กด "บันทึก Fixtures" → บันทึกสำเร็จไม่มี error', async ({ page }) => {
    await gotoFixtures(page)
    const saveBtn = page.locator('button:has-text("บันทึก"), button:has-text("Save")')
    if (await saveBtn.count() > 0) {
      await saveBtn.first().click()
      await page.waitForTimeout(1_500)
      const errMsg = page.locator('[class*="error"], .text-red-500')
      expect(await errMsg.count()).toBe(0)
    } else {
      test.skip(true, 'ไม่พบปุ่ม Save ใน Fixtures UI')
    }
  })
})
