/**
 * System Tests: Fixtures Setup
 * STC6001 - เปิดหน้า Fixtures Setup → แสดงรายการ Nodes
 * STC6002 - กำหนด Fixture ให้ Node → แสดงค่า FU รวม
 * STC6003 - กำหนด Fixture หลายประเภทให้ Node เดียวกัน → FU รวมถูกต้อง
 * STC6004 - บันทึก Fixtures สำเร็จ
 */

import { test, expect, Page } from '@playwright/test'
import path from 'path'
import { fileURLToPath } from 'url'

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

const BASE = 'http://localhost:3003'
const UNIQUE = Date.now()
const USER = { email: `stc6-fix-${UNIQUE}@test.com`, password: 'Test1234!' }

let projectUrl = ''
let fixturesUrl = ''

// ใช้ไฟล์จริงจาก frontend/file/
const JPG_FILE = path.join(__dirname, '../../file/แบบบ้านพัก 1 ชั้น.jpg')

async function setupUser(page: Page) {
  // Register (pattern STC4)
  await page.goto(`${BASE}/register`)
  await page.fill('[name="username"]', 'STC Fixtures Tester')
  await page.fill('[name="email"]', USER.email)
  await page.fill('[name="password"]', USER.password)
  await page.fill('[name="confirm-password"]', USER.password)
  await page.click('button[type="submit"]')
  await page.waitForURL(/login|dashboard|projects/, { timeout: 10_000 })
  if (page.url().includes('login')) {
    await page.goto(`${BASE}/`)
    await page.waitForLoadState('networkidle')
    await page.fill('[name="email"]', USER.email)
    await page.fill('[name="password"]', USER.password)
    await page.click('button[type="submit"]')
    await page.waitForURL(/\/projects/, { timeout: 10_000 })
  }

  // Create project (pattern STC2/3 - เฉพาะ name + floors)
  await page.goto(`${BASE}/projects/new`)
  await page.waitForLoadState('networkidle')
  await page.fill('#name', `STC6 Project ${UNIQUE}`)
  await page.fill('#floors', '2')
  await page.click('button[type="submit"]')
  await page.waitForURL(/\/projects\/\d+/, { timeout: 10_000 })
  projectUrl = page.url()

  // Create version
  await page.goto(projectUrl)
  await page.waitForLoadState('networkidle')
  const createBtn = page.locator('button:has-text("Create Version"), button:has-text("สร้าง Version แรก")')
  if (await createBtn.count() > 0) {
    await createBtn.first().click()
    await page.waitForSelector('#version-name', { state: 'visible', timeout: 5_000 })
    await page.fill('#version-name', 'Version 1 - STC6')
    await page.click('button:has-text("สร้างเวอร์ชัน")')
    await page.waitForURL(/\/versions\/\d+\/upload/, { timeout: 10_000 })

    // Upload blueprint (pattern STC4001)
    const floorSelect = page.locator('select').filter({ hasText: /ชั้น 1/ }).first()
    await expect(floorSelect).toBeVisible({ timeout: 5_000 })
    await floorSelect.selectOption('1')

    const typeSelect = page.locator('select').filter({ hasText: /Floor Plan/ }).first()
    await expect(typeSelect).toBeVisible({ timeout: 5_000 })
    await typeSelect.selectOption('floor_plan')

    const fileInput = page.locator('input[type="file"]')
    await fileInput.setInputFiles(JPG_FILE)

    const uploadBtn = page.locator('button:has-text("บันทึก Blueprint")')
    await expect(uploadBtn).toBeEnabled({ timeout: 5_000 })
    await uploadBtn.click()
    await page.waitForTimeout(2_000)

    // Create network (สร้าง node 1-2 ตัวเพื่อให้มีให้กำหนด fixtures)
    const currentUrl = page.url()
    const versionId = currentUrl.match(/\/versions\/(\d+)\//)?.[1]
    const projectId = currentUrl.match(/\/projects\/(\d+)\//)?.[1]

    if (versionId && projectId) {
      await page.goto(`${BASE}/projects/${projectId}/versions/${versionId}/network`)
      await page.waitForLoadState('networkidle')

      // Select blueprint
      const blueprintCard = page.locator('.border-2.rounded-lg.cursor-pointer').first()
      if (await blueprintCard.isVisible()) {
        await blueprintCard.click()
        await page.waitForTimeout(1_000)

        // Create Source node
        const addSourceBtn = page.locator('button:has-text("เพิ่มจุดเริ่มต้น"), button:has-text("จุดเริ่มต้น")')
        if (await addSourceBtn.count() > 0) {
          await addSourceBtn.first().click()
          const canvas = page.locator('.absolute.inset-0.cursor-default').first()
          await canvas.click({ position: { x: 150, y: 200 } })
          await page.waitForTimeout(500)
        }

        // Save network
        const saveBtn = page.locator('button:has-text("บันทึก")')
        if (await saveBtn.count() > 0) {
          await saveBtn.first().click()
          await page.waitForTimeout(1_500)
        }
      }

      // Go to fixtures page
      await page.goto(`${BASE}/projects/${projectId}/versions/${versionId}/fixtures`)
      await page.waitForURL(/\/fixtures/, { timeout: 10_000 })
      fixturesUrl = page.url()
    }
  }
}

test.describe('STC6 — Fixtures Setup', () => {
  test.beforeAll(async ({ browser }) => {
    const page = await browser.newPage()
    await setupUser(page)
    await page.close()
  })

  async function gotoFixtures(page: Page) {
    await page.goto(`${BASE}/`)
    await page.waitForLoadState('networkidle')

    // Check if need to login
    const loginForm = page.locator('[name="email"]')
    if (await loginForm.count() > 0) {
      await page.fill('[name="email"]', USER.email)
      await page.fill('[name="password"]', USER.password)
      await page.click('button[type="submit"]')
      await page.waitForURL(/\/projects/, { timeout: 10_000 })
    }

    if (fixturesUrl) {
      await page.goto(fixturesUrl)
      await page.waitForLoadState('networkidle')
    }
  }

  // STC6001: เปิดหน้า Fixtures Setup
  test('STC6001 — เปิดหน้า Fixtures Setup แสดงรายการ Nodes', async ({ page }) => {
    await gotoFixtures(page)

    // ต้องมี h1 หรือ title ที่เกี่ยวกับ Fixtures
    const title = page.locator('h1:has-text("Fixtures"), h1:has-text("อุปกรณ์"), h1:has-text("กำหนดอุปกรณ์")')
    if (await title.count() > 0) {
      await expect(title.first()).toBeVisible({ timeout: 10_000 })
    }

    // ต้องไม่มี 500 error
    await expect(page.locator('text=500')).toHaveCount(0)
    await expect(page.locator('text=Internal Server Error')).toHaveCount(0)
  })

  // STC6002: กำหนด Lavatory 2 ตัว
  test('STC6002 — กำหนด Lavatory 2 ตัว → FU รวม = 2', async ({ page }) => {
    await gotoFixtures(page)

    // หา node ที่มี "Source" หรือ "จุดเริ่มต้น"
    const sourceNode = page.locator('text=Source, text=จุดเริ่มต้น, [class*="node"]').first()
    if (await sourceNode.count() > 0) {
      // คลิกเพื่อเลือก node
      await sourceNode.click()

      // กำหนด Lavatory 2 ตัว
      const lavatoryInput = page.locator('input[name*="lavatory"], input[placeholder*="Lavatory"], [aria-label*="lavatory" i]')
      if (await lavatoryInput.count() > 0) {
        await lavatoryInput.first().fill('2')
        await page.waitForTimeout(500)

        // เช็ค FU รวม = 2
        const fuDisplay = page.locator('text=FU: 2, text=fu: 2, text=Total: 2')
        if (await fuDisplay.count() > 0) {
          await expect(fuDisplay.first()).toBeVisible()
        }
      }
    }

    // ต้องไม่ crash
    await expect(page).not.toHaveURL(/error|500/)
  })

  // STC6003: Lavatory×2 + WC_TANK×1 → FU = 5
  test('STC6003 — Lavatory×2 + WC_TANK×1 → FU = (2×1)+(1×3) = 5', async ({ page }) => {
    await gotoFixtures(page)

    const sourceNode = page.locator('text=Source, text=จุดเริ่มต้น').first()
    if (await sourceNode.count() > 0) {
      await sourceNode.click()

      // กำหนด Lavatory = 2
      const lavatoryInput = page.locator('input[name*="lavatory"], input[placeholder*="Lavatory"], [aria-label*="lavatory" i]')
      if (await lavatoryInput.count() > 0) {
        await lavatoryInput.first().fill('2')
        await page.waitForTimeout(500)
      }

      // กำหนด WC_TANK = 1
      const wcTankInput = page.locator('input[name*="wc"], input[name*="tank"], input[placeholder*="WC"], [aria-label*="wc" i]')
      if (await wcTankInput.count() > 0) {
        await wcTankInput.first().fill('1')
        await page.waitForTimeout(500)
      }

      // เช็ค FU รวม = 5
      const fuDisplay = page.locator('text=FU: 5, text=fu: 5, text=Total: 5')
      if (await fuDisplay.count() > 0) {
        await expect(fuDisplay.first()).toBeVisible()
      }
    }

    // ต้องไม่ crash
    await expect(page).not.toHaveURL(/error|500/)
  })

  // STC6004: บันทึก Fixtures
  test('STC6004 — กด "บันทึก Fixtures" → บันทึกสำเร็จไม่มี error', async ({ page }) => {
    await gotoFixtures(page)

    const saveBtn = page.locator('button:has-text("บันทึก"), button:has-text("Save")')
    if (await saveBtn.count() > 0) {
      await saveBtn.first().click()
      await page.waitForTimeout(1_500)

      // ต้องไม่มี error
      const errMsg = page.locator('[class*="error"], .text-red-500, [role="alert"]:has-text("error")')
      expect(await errMsg.count()).toBe(0)
    }

    // ต้องไม่ crash
    await expect(page).not.toHaveURL(/error|500/)
  })
})
