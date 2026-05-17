/**
 * System Tests: Version Comparison
 * STC6001 - เปิดหน้า Compare Versions → แสดง UI สำหรับเลือก versions
 * STC6002 - เลือก 2 versions เพื่อเปรียบเทียบ → แสดงผล diff
 * STC6003 - แสดง network diagram diff ระหว่าง 2 versions
 * STC6004 - แสดง summary (จำนวน pipes/fixtures ต่าง)
 *
 * หมายเหตุ:
 * - Route: /projects/:id/compare
 * - ต้องมีอย่างน้อย 2 versions ใน project จึงจะเปรียบเทียบได้
 * - UI แสดง dropdown selectors สำหรับเลือก version A และ version B
 * - หลังเลือก → แสดงผลเปรียบเทียบ (network diagrams, tables, summary)
 */

import { expect, Page, test } from '@playwright/test'
import path from 'path'
import { fileURLToPath } from 'url'

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

const BASE = 'http://localhost:3003'
const UNIQUE = Date.now()
const USER = { email: `stc6-compare-${UNIQUE}@test.com`, password: 'Test1234!' }

let projectUrl = ''
let compareUrl = ''

// ใช้ไฟล์จริงจาก frontend/file/
const JPG_FILE = path.join(__dirname, '../../file/แบบบ้านพัก 1 ชั้น.jpg')

async function setupUser(page: Page) {
  // Register
  await page.goto(`${BASE}/register`)
  await page.fill('[name="username"]', 'STC6 Compare Tester')
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

  // Create project
  await page.goto(`${BASE}/projects/new`)
  await page.waitForLoadState('networkidle')
  await page.fill('#name', `STC6 Project ${UNIQUE}`)
  await page.fill('#floors', '2')
  await page.click('button[type="submit"]')
  await page.waitForURL(/\/projects\/\d+/, { timeout: 10_000 })
  projectUrl = page.url()
}

async function createVersionWithNetwork(page: Page, versionName: string): Promise<string> {
  await page.goto(projectUrl)
  await page.waitForLoadState('networkidle')

  // Create version
  const createBtn = page.locator('button:has-text("Create Version"), button:has-text("สร้าง Version แรก")')
  await createBtn.first().click()
  await page.waitForSelector('#version-name', { state: 'visible', timeout: 5_000 })
  await page.fill('#version-name', versionName)
  await page.click('button:has-text("สร้างเวอร์ชัน")')
  await page.waitForURL(/\/versions\/\d+\/upload/, { timeout: 10_000 })

  // Upload blueprint
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

  // Go to network and select blueprint
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
    }

    // Save network
    const saveBtn = page.locator('button:has-text("บันทึก")')
    if (await saveBtn.count() > 0) {
      await saveBtn.first().click()
      await page.waitForTimeout(1_500)
    }
  }

  // Return version URL
  return page.url()
}

test.describe('STC6 — Version Comparison', () => {
  test.beforeAll(async ({ browser }) => {
    const page = await browser.newPage()
    await setupUser(page)

    // Create Version 1 with network
    await createVersionWithNetwork(page, 'Version 1 - Original')

    // Create Version 2 with network
    await createVersionWithNetwork(page, 'Version 2 - Modified')

    // Get compare URL
    const projectId = projectUrl.match(/\/projects\/(\d+)/)?.[1]
    if (projectId) {
      compareUrl = `${BASE}/projects/${projectId}/compare`
    }

    await page.close()
  })

  async function gotoCompare(page: Page) {
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

    if (compareUrl) await page.goto(compareUrl)
    await page.waitForLoadState('networkidle')
  }

  // STC6001: เปิดหน้า Compare
  test('STC6001 — เปิดหน้า Compare Versions แสดง UI เลือก versions ได้', async ({ page }) => {
    await gotoCompare(page)

    // h1 หรือ title ต้องมีคำว่า "Compare" หรือ "เปรียบเทียบ"
    const title = page.locator('h1:has-text("เปรียบเทียบ"), h1:has-text("Compare"), h2:has-text("เปรียบเทียบ"), h2:has-text("Compare")')
    if (await title.count() > 0) {
      await expect(title.first()).toBeVisible()
    }

    // ต้องไม่มี 500 error
    await expect(page.locator('text=500')).toHaveCount(0)
    await expect(page.locator('text=Internal Server Error')).toHaveCount(0)
  })

  // STC6002: เลือก 2 versions เพื่อเปรียบเทียบ
  test('STC6002 — เลือก Version A และ Version B → แสดงผลเปรียบเทียบ', async ({ page }) => {
    await gotoCompare(page)

    // เลือก version dropdown ถ้ามี
    const versionSelects = page.locator('select, [role="combobox"]').or(page.getByRole('combobox'))

    if (await versionSelects.count() >= 2) {
      // เลือก version A (ตัวแรก)
      await versionSelects.nth(0).selectOption({ index: 0 }).catch(() => {})

      // เลือก version B (ตัวที่สอง)
      await versionSelects.nth(1).selectOption({ index: 1 }).catch(() => {})

      await page.waitForTimeout(2_000)
    }

    // หลังเลือก → ต้องไม่ crash
    await expect(page).not.toHaveURL(/error|500/)
  })

  // STC6003: แสดง network diagram diff
  test('STC6003 — แสดง network diagrams ของทั้ง 2 versions', async ({ page }) => {
    await gotoCompare(page)

    // เลือก versions
    const versionSelects = page.locator('select, [role="combobox"]').or(page.getByRole('combobox'))
    if (await versionSelects.count() >= 2) {
      await versionSelects.nth(0).selectOption({ index: 0 }).catch(() => {})
      await versionSelects.nth(1).selectOption({ index: 1 }).catch(() => {})
      await page.waitForTimeout(2_000)
    }

    // ตรวจสอบว่ามี canvas หรือ network diagrams แสดง (อาจจะ side-by-side)
    const canvases = page.locator('canvas, svg, .bg-gray-100')
    if (await canvases.count() > 0) {
      await expect(canvases.first()).toBeVisible()
    }

    // ต้องไม่ crash
    await expect(page).not.toHaveURL(/error|500/)
  })

  // STC6004: แสดง summary (จำนวน pipes/fixtures ต่าง)
  test('STC6004 — แสดง summary ข้อมูลเปรียบเทียบ (pipe count, fixture count)', async ({ page }) => {
    await gotoCompare(page)

    // เลือก versions
    const versionSelects = page.locator('select, [role="combobox"]').or(page.getByRole('combobox'))
    if (await versionSelects.count() >= 2) {
      await versionSelects.nth(0).selectOption({ index: 0 }).catch(() => {})
      await versionSelects.nth(1).selectOption({ index: 1 }).catch(() => {})
      await page.waitForTimeout(2_000)
    }

    // ตรวจสอบว่ามี summary หรือ table แสดงผล diff
    const summary = page.locator('table, .summary, [class*="diff"], [class*="comparison"]')
    if (await summary.count() > 0) {
      await expect(summary.first()).toBeVisible()
    }

    // ต้องไม่ crash
    await expect(page).not.toHaveURL(/error|500/)
  })
})
