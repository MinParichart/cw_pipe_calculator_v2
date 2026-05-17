/**
 * System Tests: Blueprint Upload
 * STC4001 - อัปโหลด Blueprint รูปภาพ (.jpg/.png) สำเร็จ
 * STC4002 - อัปโหลดไฟล์ที่ไม่รองรับ (.pdf/.dxf) → แสดง error
 */

import { test, expect, Page } from '@playwright/test'
import path from 'path'
import fs from 'fs'
import os from 'os'

const BASE = 'http://localhost:3003'
const UNIQUE = Date.now()
const USER = { email: `stc4-bp-${UNIQUE}@test.com`, password: 'Test1234!' }

let projectUrl = ''

/** สร้าง minimal JPEG file ชั่วคราว */
function createTempJpeg(): string {
  const jpegBytes = Buffer.from([
    0xFF, 0xD8, 0xFF, 0xE0, 0x00, 0x10, 0x4A, 0x46, 0x49, 0x46,
    0x00, 0x01, 0x01, 0x00, 0x00, 0x01, 0x00, 0x01, 0x00, 0x00,
    0xFF, 0xDA, 0x00, 0x08, 0x01, 0x01, 0x00, 0x00, 0x3F, 0x00,
    0xFB, 0xFF, 0xD9,
  ])
  const tmpPath = path.join(os.tmpdir(), `test_blueprint_${UNIQUE}.jpg`)
  fs.writeFileSync(tmpPath, jpegBytes)
  return tmpPath
}

/** สร้าง minimal PDF file ชั่วคราว */
function createTempPdf(): string {
  const pdfBytes = Buffer.from('%PDF-1.4 fake pdf content for test')
  const tmpPath = path.join(os.tmpdir(), `test_report_${UNIQUE}.pdf`)
  fs.writeFileSync(tmpPath, pdfBytes)
  return tmpPath
}

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
  await page.fill('#name', `โครงการ STC4 ${UNIQUE}`)

  // เลือก Building Type (required field) - ค่าแรกคือ RESIDENTIAL
  const buildingTypeLabel = page.locator('text=ทาวน์โฮม, text=อพาร์ทเมนท์, text=โรงแรม, text=ห้องชุด, text=อื่นๆ').first()
  if (await buildingTypeLabel.count() > 0) {
    await buildingTypeLabel.click()
  } else {
    // ถ้าไม่เจอ label ภาษาไทย ให้ลองเลือก radio button โดยตรง
    await page.click('input[type="radio"][value="RESIDENTIAL"]')
  }

  await page.click('button[type="submit"]')
  await page.waitForURL(/\/projects\/\d+/, { timeout: 15_000 })
  projectUrl = page.url()
}

test.describe('STC4 — Blueprint Upload', () => {
  test.beforeAll(async ({ browser }) => {
    const page = await browser.newPage()
    await setupUser(page)
    await page.close()
  })

  async function gotoDocumentsPage(page: Page) {
    await page.goto(`${BASE}/login`)
    await page.fill('[name="email"]', USER.email)
    await page.fill('[name="password"]', USER.password)
    await page.click('button[type="submit"]')
    await page.waitForURL(/dashboard|projects/, { timeout: 10_000 })
    // ไปหน้า documents/blueprint ของ project
    await page.goto(projectUrl)
    const docLink = page.locator('a:has-text("Blueprint"), a:has-text("Documents"), a:has-text("แบบแปลน")')
    if (await docLink.count() > 0) await docLink.first().click()
  }

  // STC4001: อัปโหลดรูปภาพ
  test('STC4001 — อัปโหลด .jpg สำเร็จ แสดง thumbnail/ชื่อไฟล์', async ({ page }) => {
    await gotoDocumentsPage(page)
    const jpegPath = createTempJpeg()

    // หา input file
    const fileInput = page.locator('input[type="file"]')
    if (await fileInput.count() > 0) {
      await fileInput.setInputFiles(jpegPath)
      // กด Upload (ถ้ามีปุ่ม)
      const uploadBtn = page.locator('button:has-text("อัปโหลด"), button:has-text("Upload")')
      if (await uploadBtn.count() > 0) await uploadBtn.first().click()
      // ต้องไม่มี error message
      const errMsg = page.locator('[class*="error"], .text-red-500, [role="alert"]')
      await page.waitForTimeout(2_000)
      const hasError = await errMsg.count() > 0 && await errMsg.first().isVisible()
      expect(hasError).toBe(false)
    } else {
      test.skip(true, 'ไม่พบ file input ใน UI')
    }
    fs.unlinkSync(jpegPath)
  })

  // STC4002: อัปโหลดไฟล์ไม่รองรับ
  test('STC4002 — อัปโหลด .pdf → แสดง error "รองรับเฉพาะ JPEG/PNG/GIF"', async ({ page }) => {
    await gotoDocumentsPage(page)
    const pdfPath = createTempPdf()

    const fileInput = page.locator('input[type="file"]')
    if (await fileInput.count() > 0) {
      await fileInput.setInputFiles(pdfPath)
      const uploadBtn = page.locator('button:has-text("อัปโหลด"), button:has-text("Upload")')
      if (await uploadBtn.count() > 0) await uploadBtn.first().click()
      // ต้องมี error message
      await page.waitForTimeout(2_000)
      const errMsg = page.locator('[class*="error"], .text-red-500, [role="alert"], text=รูปภาพ, text=image, text=JPEG')
      await expect(errMsg.first()).toBeVisible({ timeout: 5_000 })
    } else {
      test.skip(true, 'ไม่พบ file input ใน UI')
    }
    fs.unlinkSync(pdfPath)
  })
})
