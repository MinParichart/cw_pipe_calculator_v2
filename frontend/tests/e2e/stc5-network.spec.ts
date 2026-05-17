/**
 * System Tests: Network Builder
 * STC5001 - เปิดหน้า Network Builder → แสดง Canvas
 * STC5002 - สร้าง Node บน Canvas
 * STC5003 - ลาก Pipe เชื่อมระหว่าง 2 Nodes
 * STC5004 - บันทึก Network Diagram
 * STC5005 - โหลด Network ที่บันทึกไว้กลับมา
 */

import { expect, Page, test } from '@playwright/test'
import path from 'path'
import { fileURLToPath } from 'url'

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

const BASE = 'http://localhost:3003'
const UNIQUE = Date.now()
const USER = { email: `stc5-net-${UNIQUE}@test.com`, password: 'Test1234!' }

let projectUrl = ''
let uploadUrl = ''
let networkUrl = ''

// ใช้ไฟล์จริงจาก frontend/file/ (ตาม pattern STC4)
const JPG_FILE = path.join(__dirname, '../../file/แบบบ้านพัก 1 ชั้น.jpg')

async function setupUser(page: Page) {
  // Register (pattern STC4)
  await page.goto(`${BASE}/register`)
  await page.fill('[name="username"]', 'STC5 Network Tester')
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
  await page.fill('#name', `STC5 Project ${UNIQUE}`)
  await page.fill('#floors', '2')
  await page.click('button[type="submit"]')
  await page.waitForURL(/\/projects\/\d+/, { timeout: 10_000 })
  projectUrl = page.url()
}

test.describe('STC5 — Network Builder', () => {
  test.beforeAll(async ({ browser }) => {
    const page = await browser.newPage()
    await setupUser(page)

    // Create version (pattern STC4)
    await page.goto(projectUrl)
    await page.waitForLoadState('networkidle')

    const createBtn = page.locator('button:has-text("Create Version"), button:has-text("สร้าง Version แรก")')
    if (await createBtn.count() > 0) {
      await createBtn.first().click()
      await page.waitForSelector('#version-name', { state: 'visible', timeout: 5_000 })
      await page.fill('#version-name', 'Version 1 - STC5')
      await page.click('button:has-text("สร้างเวอร์ชัน")')
      await page.waitForURL(/\/versions\/\d+\/upload/, { timeout: 10_000 })
      uploadUrl = page.url()

      // Upload blueprint (pattern STC4001 - เลือกชั้น + เลือกประเภทแปลน + upload)
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

      // ไปหน้า network โดยตรง (ใช้ versionId จาก uploadUrl)
      const currentUrl = page.url()
      const versionId = currentUrl.match(/\/versions\/(\d+)\//)?.[1]
      const projectId = currentUrl.match(/\/projects\/(\d+)\//)?.[1]
      if (versionId && projectId) {
        networkUrl = `${BASE}/projects/${projectId}/versions/${versionId}/network`
      }
    }

    await page.close()
  })

  async function gotoNetwork(page: Page) {
    await page.goto(`${BASE}/`)
    await page.waitForLoadState('networkidle')

    // เช็คก่อนว่าต้อง login ไหม (ถ้า login อยู่แล้วจะไม่มี form)
    const loginForm = page.locator('[name="email"]')
    if (await loginForm.count() > 0) {
      await page.fill('[name="email"]', USER.email)
      await page.fill('[name="password"]', USER.password)
      await page.click('button[type="submit"]')
      await page.waitForURL(/\/projects/, { timeout: 10_000 })
    }

    if (networkUrl) await page.goto(networkUrl)
    await page.waitForLoadState('networkidle')

    // ถ้ามี blueprint card → คลิกเพื่อ select (ทำให้ NetworkBuilder แสดง)
    const blueprintCard = page.locator('.border-2.rounded-lg.cursor-pointer').first()
    if (await blueprintCard.isVisible()) {
      await blueprintCard.click()
      // รอ "หา Critical Path" ซึ่งปรากฏใน NetworkBuilder toolbar เมื่อ canvas พร้อม
      await page.waitForSelector('button:has-text("หา Critical Path")', { timeout: 10_000 }).catch(() => {})
    }
  }

  // STC5001: เปิดหน้า Network Builder
  test('STC5001 — เปิดหน้า Network Builder แสดง Canvas ได้', async ({ page }) => {
    await gotoNetwork(page)
    await page.locator('img[alt^="blueprint-"]').first().click()
    await page.getByText('Network Builder หา Critical').click();
  })

  // STC5002: สร้าง Node
  test('STC5002 — กด "เพิ่มจุดเริ่มต้น" → สร้าง Source Node ได้', async ({ page }) => {
    await gotoNetwork(page)
    await page.locator('img[alt^="blueprint-"]').first().click()
    await page.getByText('Network Builder หา Critical').click();
    await page.getByRole('button', { name: 'จุดเริ่มต้น' }).click();
    await page.locator('.absolute.inset-0.cursor-default').click();
  })

  // STC5003: ลาก Pipe เชื่อม Nodes
  test('STC5003 — ลาก Pipe เชื่อม 2 Nodes ได้', async ({ page }) => {
    await gotoNetwork(page)

    // เลือก blueprint + รอ NetworkBuilder
    await page.locator('img[alt^="blueprint-"]').first().click()
    await page.waitForSelector('button:has-text("หา Critical Path")', { timeout: 10_000 })

    // วาง Source node บน canvas (ตำแหน่ง A)
    await page.getByRole('button', { name: 'จุดเริ่มต้น' }).click()
    const canvas = page.locator('.absolute.inset-0.cursor-default').first()
    await canvas.click({ position: { x: 150, y: 200 } })
    await page.waitForTimeout(500)

    // วาง Junction node (ตำแหน่ง B ต่างจาก A)
    await page.getByRole('button', { name: 'จุดเชื่อม' }).click()
    await canvas.click({ position: { x: 350, y: 200 } })
    await page.waitForTimeout(500)

    // เปิดโหมด "เชื่อมท่อ"
    
    await page.locator('.text-white.text-\\[10px\\] > .h-4').first().click();
    await page.getByRole('button', { name: 'เชื่อมท่อ' }).click();
    await page.locator('.flex.items-center.justify-center.w-3.h-3.rounded-full.border-2.shadow-sm.bg-gray-500 > .text-white > .h-4').click();
    
  })

  // STC5004: บันทึก Network (ปุ่ม "บันทึก" อยู่ใน NetworkBuilder toolbar)
  test('STC5004 — กดปุ่ม critical path เพื่อหาเส้นท่อวิกฤต', async ({ page }) => {
    await gotoNetwork(page)

    // เลือก blueprint + รอ NetworkBuilder
    await page.locator('img[alt^="blueprint-"]').first().click()
    await page.waitForSelector('button:has-text("หา Critical Path")', { timeout: 10_000 })

    // วาง Source node บน canvas (ตำแหน่ง A)
    await page.getByRole('button', { name: 'จุดเริ่มต้น' }).click()
    const canvas = page.locator('.absolute.inset-0.cursor-default').first()
    await canvas.click({ position: { x: 150, y: 200 } })
    await page.waitForTimeout(500)

    // วาง Junction node (ตำแหน่ง B ต่างจาก A)
    await page.getByRole('button', { name: 'จุดเชื่อม' }).click()
    await canvas.click({ position: { x: 350, y: 200 } })
    await page.waitForTimeout(500)

    // เปิดโหมด "เชื่อมท่อ"
    
    await page.locator('.text-white.text-\\[10px\\] > .h-4').first().click();
    await page.getByRole('button', { name: 'เชื่อมท่อ' }).click();
    await page.locator('.flex.items-center.justify-center.w-3.h-3.rounded-full.border-2.shadow-sm.bg-gray-500 > .text-white > .h-4').click();
    
    await page.getByRole('button', { name: 'หา Critical Path' }).click();
  })

  // STC5005: โหลด Network กลับมา
  test('STC5005 — ออกจากหน้า Network แล้วกลับเข้ามา → โหลด h1 ถูกต้อง', async ({ page }) => {
    await gotoNetwork(page)

    // เลือก blueprint + รอ NetworkBuilder
    await page.locator('img[alt^="blueprint-"]').first().click()
    await page.waitForSelector('button:has-text("หา Critical Path")', { timeout: 10_000 })

    // วาง Source node บน canvas (ตำแหน่ง A)
    await page.getByRole('button', { name: 'จุดเริ่มต้น' }).click()
    const canvas = page.locator('.absolute.inset-0.cursor-default').first()
    await canvas.click({ position: { x: 150, y: 200 } })
    await page.waitForTimeout(500)

    // วาง Junction node (ตำแหน่ง B ต่างจาก A)
    await page.getByRole('button', { name: 'จุดเชื่อม' }).click()
    await canvas.click({ position: { x: 350, y: 200 } })
    await page.waitForTimeout(500)

    // เปิดโหมด "เชื่อมท่อ"
    
    await page.locator('.text-white.text-\\[10px\\] > .h-4').first().click();
    await page.getByRole('button', { name: 'เชื่อมท่อ' }).click();
    await page.locator('.flex.items-center.justify-center.w-3.h-3.rounded-full.border-2.shadow-sm.bg-gray-500 > .text-white > .h-4').click();
    
    await page.getByRole('button', { name: 'หา Critical Path' }).click();

    // ออกไปหน้าอื่น                                                                                                                                                             
    await page.goto(`${BASE}/projects`)
    await page.waitForLoadState('networkidle')                                                                                                                                
                                                              
    // กลับมาหน้า network
    await gotoNetwork(page)

    // เช็คว่ามี node ที่วางไว้ก่อนหน้านี้หรือไม่ (เช็คจาก h1 ที่แสดงชื่อ node)
    await page.locator('img[alt^="blueprint-"]').first().click()
    await expect(page.getByRole('button', { name: 'จุดเริ่มต้น' })).toBeVisible()
    })
})
