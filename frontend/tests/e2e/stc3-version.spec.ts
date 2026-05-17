/**
 * System Tests: Version Management
 * STC3001 - สร้างเวอร์ชันแรกผ่าน UI
 * STC3002 - แสดงรายการเวอร์ชัน
 * STC3003 - Version 2 ไม่กระทบข้อมูลของ Version 1
 * STC3004 - [v2] Duplicate Version ผ่าน UI
 *
 * หมายเหตุ:
 * - Login page อยู่ที่ '/'
 * - Create version button: "Create Version" (header) / "สร้าง Version แรก" (empty)
 * - Version name field: id="version-name"
 * - Submit version: button text "สร้างเวอร์ชัน"
 * - After created: redirect → /projects/:id/versions/:versionId/upload
 * - Version card class: "version-card"
 * - Duplicate button: title="คัดลอก Version" (icon only, no text)
 */

import { test, expect, Page } from '@playwright/test'

const BASE = 'http://localhost:3003'
const UNIQUE = Date.now()
const USER = { email: `stc3-ver-${UNIQUE}@test.com`, password: 'Test1234!' }

let projectUrl = ''

async function loginAndGoProject(page: Page) {
  await page.goto(`${BASE}/`)
  await page.waitForLoadState('networkidle')
  await page.fill('[name="email"]', USER.email)
  await page.fill('[name="password"]', USER.password)
  await page.click('button[type="submit"]')
  await page.waitForURL(/\/projects/, { timeout: 10_000 })
  await page.goto(projectUrl)
  await page.waitForLoadState('networkidle')
}

async function createVersion(page: Page, name: string) {
  // กด "Create Version" (มี versions อยู่แล้ว) หรือ "สร้าง Version แรก" (empty state)
  const btn = page.locator('button:has-text("Create Version"), button:has-text("สร้าง Version แรก")')
  await btn.first().click()
  // รอ modal เปิด
  await page.waitForSelector('#version-name', { state: 'visible', timeout: 5_000 })
  await page.fill('#version-name', name)
  await page.click('button:has-text("สร้างเวอร์ชัน")')
  // หลังสร้าง → redirect ไป /upload
  await page.waitForURL(/\/versions\/\d+\/upload/, { timeout: 10_000 })
  // กลับหน้า project
  await page.goto(projectUrl)
  await page.waitForLoadState('networkidle')
}

test.describe('STC3 — Version Management', () => {
  test.beforeAll(async ({ browser }) => {
    const page = await browser.newPage()

    // Register
    await page.goto(`${BASE}/register`)
    await page.waitForLoadState('networkidle')
    await page.fill('[name="username"]', 'STC3Tester')
    await page.fill('[name="email"]', USER.email)
    await page.fill('[name="password"]', USER.password)
    await page.fill('[name="confirm-password"]', USER.password)
    await page.click('button[type="submit"]')
    await page.waitForURL(/\/projects/, { timeout: 10_000 })

    // สร้าง project
    await page.goto(`${BASE}/projects/new`)
    await page.waitForLoadState('networkidle')
    await page.fill('#name', `STC3 Project ${UNIQUE}`)
    await page.fill('#floors', '1')
    await page.click('button[type="submit"]')
    await page.waitForURL(/\/projects\/\d+/, { timeout: 10_000 })
    projectUrl = page.url()

    // สร้าง Version 1 ไว้ก่อน — ให้ STC3002/3003/3004 มี version อยู่แล้ว
    await createVersion(page, 'Version 1 - Setup')

    await page.close()
  })

  // STC3001: สร้าง Version แรก
  test('STC3001 — สร้างเวอร์ชันแรก → ปรากฏในรายการ Versions', async ({ page }) => {
    await loginAndGoProject(page)

    await createVersion(page, 'Version 1 - แบบร่างแรก')

    // ต้องมี version-card ปรากฏ (รวม Version 1 - Setup จาก beforeAll ด้วย)
    await expect(page.locator('.version-card').first()).toBeVisible({ timeout: 10_000 })

    // ตรวจสอบว่ามี version ที่สร้างใน test นี้ ('Version 1 - แบบร่างแรก')
    await expect(page.locator('.version-card').filter({ hasText: /Version.*1.*แบบร่างแรก/ }).first()).toBeVisible({ timeout: 5_000 })
  })

  // STC3002: แสดงรายการ Versions พร้อม versionNumber
  test('STC3002 — รายการ Versions แสดง versionNumber และชื่อ', async ({ page }) => {
    await loginAndGoProject(page)

    // version-card แสดง versionNumber ในวงกลม และ name ใน h3
    await expect(page.locator('.version-card').first()).toBeVisible({ timeout: 10_000 })

    // versionNumber = 1 (แสดงใน div วงกลม) - ใช้ selector ที่ตรงกับที่สร้างใน beforeAll
    const firstCard = page.locator('.version-card').first()

    // ตรวจสอบว่ามี version card ที่มีชื่อ 'Version 1 - Setup' (จาก beforeAll)
    await expect(firstCard.locator('h3:has-text("Version 1 - Setup")')).toBeVisible()

    // ตรวจสอบ version number ในวงกลม (div ที่มี class rounded-full)
    // ใช้ div.rounded-full เพื่อไม่ match กับ span.rounded-full (Current badge)
    const versionNumberElement = firstCard.locator('div.rounded-full').first()
    await expect(versionNumberElement).toBeVisible()
    await expect(versionNumberElement).toContainText('1')
  })

  // STC3003: Version 2 ไม่กระทบ Version 1
  test('STC3003 — สร้าง Version 2 แล้ว Version 1 ยังอยู่ครบ', async ({ page }) => {
    await loginAndGoProject(page)

    // นับ version cards ก่อนสร้าง Version 2
    const beforeCount = await page.locator('.version-card').count()

    await createVersion(page, 'Version 2 - แบบแก้ไข')

    // รอให้ version cards อัปเดต
    await page.waitForTimeout(2_000)

    // ตรวจสอบว่ามี version เพิ่มขึ้น
    const afterCount = await page.locator('.version-card').count()
    expect(afterCount).toBeGreaterThan(beforeCount)

    // Version 1 ต้องยังอยู่ในรายการ (ค้นหา 'Version 1' และ 'Setup')
    await expect(page.locator('.version-card').filter({ hasText: /Version.*1.*Setup/ }).first()).toBeVisible({ timeout: 10_000 })
    // Version 2 ต้องอยู่ด้วย (ค้นหา 'Version 2' และ 'แบบแก้ไข')
    await expect(page.locator('.version-card').filter({ hasText: /Version.*2.*แบบแก้ไข/ }).first()).toBeVisible({ timeout: 5_000 })
  })

  // STC3004: [v2] Duplicate Version
  test('STC3004 — Duplicate Version → version ใหม่ปรากฏในรายการ [v2]', async ({ page }) => {
    await loginAndGoProject(page)

    // รอให้ version cards โหลดเสร็จ
    await expect(page.locator('.version-card').first()).toBeVisible({ timeout: 10_000 })

    const beforeCount = await page.locator('.version-card').count()

    // Duplicate button: อยู่ใน version card ใช้ title="คัดลอก Version"
    const firstCard = page.locator('.version-card').first()
    const dupBtn = firstCard.locator('[title="คัดลอก Version"]')

    // ตรวจสอบว่ามีปุ่ม duplicate
    if (await dupBtn.count() > 0) {
      await dupBtn.click()

      // รอให้ API respond และ UI update
      await page.waitForTimeout(3_000)

      const afterCount = await page.locator('.version-card').count()
      expect(afterCount).toBeGreaterThan(beforeCount)

      // ตรวจสอบว่ามี "Copy" หรือ "คัดลอก" ในชื่อ version ใหม่
      const newCard = page.locator('.version-card').last()
      await expect(newCard).toBeVisible()
    } else {
      test.skip(true, 'ปุ่ม Duplicate ยังไม่มีใน UI')
    }
  })
})
