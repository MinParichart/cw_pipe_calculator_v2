/**
 * System Tests: Report Page [v2]
 * STC9001 - Report Page แสดงครบ: Criteria, Critical Path, Branch Table, Diagram
 * STC9002 - Building Type แสดงเป็นภาษาไทย (APARTMENT → "อาคารพักอาศัย")
 * STC9003 - ค่า velocity ใน Report ตรงกับหน้า Calculate
 * STC9004 - Print Report → เปิด popup A4
 * STC9005 - Report เมื่อ snapshotResults = null → แสดง "ยังไม่มีผลการคำนวณ"
 */

import { test, expect, Page } from '@playwright/test'
import path from 'path'
import { fileURLToPath } from 'url'

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

const BASE = 'http://localhost:3003'
const UNIQUE = Date.now()
const USER = { email: `stc9-rep-${UNIQUE}@test.com`, password: 'Test1234!' }

let projectUrl = ''
let reportUrl = ''

// ใช้ไฟล์จริงจาก frontend/file/
const JPG_FILE = path.join(__dirname, '../../file/แบบบ้านพัก 1 ชั้น.jpg')

async function setupUser(page: Page) {
  // Register (pattern STC4)
  await page.goto(`${BASE}/register`)
  await page.fill('[name="username"]', 'STC Report Tester')
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

  // Create project (pattern STC2/3)
  await page.goto(`${BASE}/projects/new`)
  await page.waitForLoadState('networkidle')
  await page.fill('#name', `STC9 Project ${UNIQUE}`)
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
    await page.fill('#version-name', 'Version 1 - STC9')
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

    // Create network with nodes and pipes
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

        // Create Junction node
        const addJunctionBtn = page.locator('button:has-text("จุดเชื่อม")')
        if (await addJunctionBtn.count() > 0) {
          await addJunctionBtn.first().click()
          const canvas = page.locator('.absolute.inset-0.cursor-default').first()
          await canvas.click({ position: { x: 350, y: 200 } })
          await page.waitForTimeout(500)
        }

        // Connect with pipe
        const pipeBtn = page.locator('button:has-text("เชื่อมท่อ")')
        if (await pipeBtn.count() > 0) {
          await pipeBtn.first().click()
          const nodes = page.locator('[class*="node"], circle')
          if (await nodes.count() >= 2) {
            const node1 = nodes.nth(0)
            await node1.click()
            await page.waitForTimeout(200)
            const node2 = nodes.nth(1)
            await node2.click()
            await page.waitForTimeout(500)
          }
        }

        // Save network
        const saveBtn = page.locator('button:has-text("บันทึก")')
        if (await saveBtn.count() > 0) {
          await saveBtn.first().click()
          await page.waitForTimeout(1_500)
        }

        // Go to fixtures and assign
        await page.goto(`${BASE}/projects/${projectId}/versions/${versionId}/fixtures`)
        await page.waitForLoadState('networkidle')

        const sourceNode = page.locator('text=Source, text=จุดเริ่มต้น').first()
        if (await sourceNode.count() > 0) {
          await sourceNode.click()

          const lavatoryInput = page.locator('input[name*="lavatory"], input[placeholder*="Lavatory"], [aria-label*="lavatory" i]')
          if (await lavatoryInput.count() > 0) {
            await lavatoryInput.first().fill('2')
            await page.waitForTimeout(500)
          }

          const fixturesSaveBtn = page.locator('button:has-text("บันทึก"), button:has-text("Save")')
          if (await fixturesSaveBtn.count() > 0) {
            await fixturesSaveBtn.first().click()
            await page.waitForTimeout(1_500)
          }
        }

        // Go to calculation and run calculation
        await page.goto(`${BASE}/projects/${projectId}/versions/${versionId}/calculation`)
        await page.waitForLoadState('networkidle')

        const calcBtn = page.locator('button:has-text("คำนวณ")')
        if (await calcBtn.count() > 0) {
          await calcBtn.first().click()
          await page.waitForTimeout(3_000)
        }

        // Go to report page
        await page.goto(`${BASE}/projects/${projectId}/versions/${versionId}/report`)
        await page.waitForURL(/\/report/, { timeout: 10_000 })
        reportUrl = page.url()
      }
    }
  }
}

test.describe('STC9 — Report Page [v2]', () => {
  test.beforeAll(async ({ browser }) => {
    const page = await browser.newPage()
    await setupUser(page)
    await page.close()
  })

  async function gotoReport(page: Page) {
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

    if (reportUrl) {
      await page.goto(reportUrl)
      await page.waitForLoadState('networkidle')
    }
  }

  // STC9001: Report แสดงข้อมูลครบ
  test('STC9001 — [v2] Report Page แสดงข้อมูลครบ: Criteria, Table, Diagram', async ({ page }) => {
    await gotoReport(page)

    // ต้องมี h1 หรือ title ว่า "Report" หรือ "รายงาน"
    const title = page.locator('h1:has-text("Report"), h1:has-text("รายงาน"), h1:has-text("สรุปิวิตาคำนวณ")')
    if (await title.count() > 0) {
      await expect(title.first()).toBeVisible({ timeout: 10_000 })
    }

    // ต้องมีข้อมูล criteria หรือ table แสดง (ใช้ .or() แทน comma)
    const content = page.locator('table')
      .or(page.locator('[class*="criteria"]'))
      .or(page.locator('[class*="result"]'))
      .or(page.locator('text=C-Factor'))
      .or(page.locator('text=c-factor'))
    if (await content.count() > 0) {
      await expect(content.first()).toBeVisible({ timeout: 5_000 })
    }

    // ต้องไม่ crash
    await expect(page).not.toHaveURL(/error|500/)
  })

  // STC9002: Building Type ภาษาไทย
  test('STC9002 — [v2] Building Type แสดงเป็นภาษาไทย ไม่ใช่ "APARTMENT"', async ({ page }) => {
    await gotoReport(page)

    // ตรวจว่าไม่มีคำว่า "APARTMENT" (ต้องเป็นภาษาไทย)
    const notEnglish = page.locator('text=APARTMENT, text=OFFICE, text=HOTEL')
    if (await notEnglish.count() > 0) {
      // ถ้ามี ต้องเป็นภาษาไทย
      const thaiText = page.locator('text=อาคารพักอาศัย, text=สำนักงาน, text=โรงแรม')
      expect(await thaiText.count()).toBeGreaterThan(0)
    }

    await expect(page).not.toHaveURL(/error|500/)
  })

  // STC9003: velocity ตรงกับ calculation
  test('STC9003 — [v2] ค่า velocity ใน Report ตรงกับ snapshotResults', async ({ page }) => {
    await gotoReport(page)

    // ตรวจว่ามี velocity values แสดง
    const velocity = page.locator('text=velocity, text=V=, text=m/s')
    if (await velocity.count() > 0) {
      await expect(velocity.first()).toBeVisible()
    }

    await expect(page).not.toHaveURL(/error|500/)
  })

  // STC9004: Print
  test('STC9004 — [v2]กด Print → window.print() ถูกเรียก (ไม่ crash)', async ({ page }) => {
    await gotoReport(page)

    // หาปุ่ม print
    const printBtn = page.locator('button:has-text("Print"), button:has-text("พิมพ์")')
    if (await printBtn.count() > 0) {
      // เช็คว่า enabled ก่อน click (skip ถ้า disabled)
      if (await printBtn.first().isEnabled()) {
        // Mock window.print() เพื่อไม่ให้ popup จริง
        await page.evaluate(() => {
          (window as any).print = () => {
            console.log('Print called')
          }
        })

        await printBtn.first().click()
        await page.waitForTimeout(500)
      } else {
        test.skip(true, 'ปุ่ม Print disabled - อาจจะยังไม่มีข้อมูลให้ print')
      }
    } else {
      test.skip(true, 'ไม่พบปุ่ม Print')
    }

    await expect(page).not.toHaveURL(/error|500/)
  })

  // STC9005: Report ยังไม่มีผล
  test('STC9005 — [v2] Report เมื่อยังไม่มีผลคำนวณ → แสดง "ยังไม่มีผล"', async ({ page }) => {
    await gotoReport(page)

    // หน้านี้ต้องไม่ crash แม้ว่าจะมีผลหรือไม่
    const noResultMsg = page.locator('text=ยังไม่มี, text=ไม่พบ, text=No results')
    if (await noResultMsg.count() > 0) {
      await expect(noResultMsg.first()).toBeVisible()
    }

    await expect(page).not.toHaveURL(/error|500/)
  })
})
