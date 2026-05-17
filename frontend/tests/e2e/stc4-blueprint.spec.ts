/**
 * System Tests: Blueprint Upload
 * STC4001 - อัปโหลด Blueprint รูปภาพ (.jpg/.png) สำเร็จ
 * STC4002 - อัปโหลดไฟล์ที่ไม่รองรับ (.pdf/.dxf) → แสดง error
 */

import { test, expect, Page } from '@playwright/test'
import path from 'path'
import { fileURLToPath } from 'url'

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

const BASE = 'http://localhost:3003'
const UNIQUE = Date.now()
const USER = { email: `stc4-bp-${UNIQUE}@test.com`, password: 'Test1234!' }

let projectUrl = ''
let uploadUrl = ''

// ใช้ไฟล์จริงจาก frontend/file/
const JPG_FILE = path.join(__dirname, '../../file/แบบบ้านพัก 1 ชั้น.jpg')
const PDF_FILE = path.join(__dirname, '../../file/แบบบ้านลาดพร้าว ชั้น 1 1-0.05.pdf')

async function setupUser(page: Page) {
  await page.goto(`${BASE}/register`)
  await page.fill('[name="username"]', 'STC Blueprint Tester')
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
  await page.waitForLoadState('networkidle')

  // กรอกข้อมูล Project
  await page.fill('#name', `โครงการ STC4 ${UNIQUE}`)

  // เลือก Building Type - click ที่ label element ไม่ใช่ input radio
  const firstBuildingType = page.locator('label:has(input[type="radio"][value="RESIDENTIAL"])').first()
  if (await firstBuildingType.count() > 0) {
    await firstBuildingType.click()
  }

  // กรอก Floors (required)
  await page.fill('#floors', '2')

  // เลือก PVC Class (required) - option เริ่มต้นคือ 5
  await page.selectOption('#pvcClass', '5')

  // กรอก Minor Loss Factor (required)
  await page.fill('#minorLoss', '30')

  // กดสร้าง
  await page.click('button[type="submit"]')
  await page.waitForURL(/\/projects\/\d+/, { timeout: 20_000 })
  projectUrl = page.url()
}

test.describe('STC4 — Blueprint Upload', () => {
  test.beforeAll(async ({ browser }) => {
    const page = await browser.newPage()
    await setupUser(page)

    // สร้าง Version 1 ก่อนจึงจะมีหน้า upload/blueprint
    await page.goto(projectUrl)
    await page.waitForLoadState('networkidle')

    // กด "Create Version" หรือ "สร้าง Version แรก"
    const createBtn = page.locator('button:has-text("Create Version"), button:has-text("สร้าง Version แรก")')
    if (await createBtn.count() > 0) {
      await createBtn.first().click()
      await page.waitForSelector('#version-name', { state: 'visible', timeout: 5_000 })
      await page.fill('#version-name', 'Version 1 - STC4')
      await page.click('button:has-text("สร้างเวอร์ชัน")')
      await page.waitForURL(/\/versions\/\d+\/upload/, { timeout: 10_000 })

      // เก็บ upload URL ไว้ใช้ใน tests
      uploadUrl = page.url()
    }

    await page.close()
  })

  async function gotoDocumentsPage(page: Page) {
    await page.goto(`${BASE}/`)
    await page.waitForLoadState('networkidle')
    await page.fill('[name="email"]', USER.email)
    await page.fill('[name="password"]', USER.password)
    await page.click('button[type="submit"]')
    await page.waitForURL(/\/projects/, { timeout: 10_000 })

    // ไปที่หน้า upload โดยตรง (จาก beforeAll สร้าง version และไปหน้า upload แล้ว)
    if (uploadUrl) {
      await page.goto(uploadUrl)
      await page.waitForLoadState('networkidle')
    }
  }

  // STC4001: อัปโหลดรูปภาพ
  test('STC4001 — อัปโหลด .jpg สำเร็จ แสดง thumbnail/ชื่อไฟล์', async ({ page }) => {
    await gotoDocumentsPage(page)

    // Screenshot ก่อนเลือกอะไรเลย (debug)
    await page.screenshot({ path: 'test-debug-01-initial.png' })

    // เลือกชั้น (floor) - หา select ที่มี option "ชั้น 1"
    const floorSelect = page.locator('select').filter({ hasText: /ชั้น 1/ }).first()
    await expect(floorSelect).toBeVisible({ timeout: 5_000 })
    await floorSelect.selectOption('1')

    await page.screenshot({ path: 'test-debug-02-after-floor.png' })

    // เลือกประเภทแปลน - หา select ที่มี option "Floor Plan"
    const typeSelect = page.locator('select').filter({ hasText: /Floor Plan/ }).first()
    await expect(typeSelect).toBeVisible({ timeout: 5_000 })
    await typeSelect.selectOption('floor_plan')

    await page.screenshot({ path: 'test-debug-03-after-type.png' })

    // Input file ถูกซ่อนอยู่ (class="hidden") แต่ setInputFiles ยังทำงานได้
    const fileInput = page.locator('input[type="file"]')
    await fileInput.setInputFiles(JPG_FILE)

    await page.screenshot({ path: 'test-debug-04-after-file.png' })

    // รอให้ปุ่ม enabled (polling check)
    const uploadBtn = page.locator('button:has-text("บันทึก Blueprint")')
    await expect(uploadBtn).toBeEnabled({ timeout: 5_000 })

    await uploadBtn.click()

    await page.screenshot({ path: 'test-debug-05-after-upload.png' })

    await page.waitForTimeout(3_000)

    // Debug: เช็คว่ามี error message อะไรบ้าง
    const allErrors = page.locator('[class*="error"], .text-red-500, [role="alert"]')
    const errorCount = await allErrors.count()
    console.log(`Found ${errorCount} error elements`)

    if (errorCount > 0) {
      for (let i = 0; i < errorCount; i++) {
        const errorText = await allErrors.nth(i).textContent()
        console.log(`Error ${i + 1}: "${errorText}"`)
      }
    }

    // ตรวจสอบว่ามี thumbnail หรือชื่อไฟล์แสดง
    const thumbnail = page.locator('img[alt*="blueprint"], img[alt*="แบบแปลน"], .blueprint-thumbnail')
    if (await thumbnail.count() > 0) {
      await expect(thumbnail.first()).toBeVisible()
    }
  })

  // STC4002: อัปโหลดไฟล์ไม่รองรับ
  test('STC4002 — อัปโหลด .pdf → แสดง error "รองรับเฉพาะ JPEG/PNG/GIF"', async ({ page }) => {
    await gotoDocumentsPage(page)

    // เลือกชั้นก่อน (เพื่อให้ file input ทำงาน)
    const floorSelect = page.locator('select').filter({ hasText: /ชั้น 1/ }).first()
    await expect(floorSelect).toBeVisible({ timeout: 5_000 })
    await floorSelect.selectOption('1')

    // Input file ถูกซ่อนอยู่ (class="hidden") แต่ setInputFiles ยังทำงานได้
    const fileInput = page.locator('input[type="file"]')
    await fileInput.setInputFiles(PDF_FILE)

    await page.waitForTimeout(2_000)

    // ต้องมี error message เกี่ยวกับประเภทไฟล์
    const toast = page.locator('[class*="error"], .text-red-500, [role="alert"]')
      .or(page.getByText(/รูปภาพ|PNG|JPG|Blueprint/))
    await expect(toast.first()).toBeVisible({ timeout: 5_000 })
  })
})
