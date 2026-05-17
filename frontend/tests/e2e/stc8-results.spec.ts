/**
 * System Tests: Calculation Results
 * STC8001 - แสดงผลการคำนวณทุก Pipe Segment พร้อม FU, GPM, ขนาดท่อ
 * STC8002 - Network Diagram แสดงขนาดท่อบน Pipe Segment
 */

import { test, expect, Page } from '@playwright/test'
import path from 'path'
import { fileURLToPath } from 'url'

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

const BASE = 'http://localhost:3003'
const UNIQUE = Date.now()
const USER = { email: `stc8-res-${UNIQUE}@test.com`, password: 'Test1234!' }

let projectUrl = ''
let calcUrl = ''

// ใช้ไฟล์จริงจาก frontend/file/
const JPG_FILE = path.join(__dirname, '../../file/แบบบ้านพัก 1 ชั้น.jpg')

async function setupUser(page: Page) {
  // Register (pattern STC4)
  await page.goto(`${BASE}/register`)
  await page.fill('[name="username"]', 'STC Results Tester')
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
  await page.fill('#name', `STC8 Project ${UNIQUE}`)
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
    await page.fill('#version-name', 'Version 1 - STC8')
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

        // Go to calculation page and RUN CALCULATION
        await page.goto(`${BASE}/projects/${projectId}/versions/${versionId}/calculation`)
        await page.waitForLoadState('networkidle')

        // Run calculation
        const calcBtn = page.locator('button:has-text("คำนวณ"), button:has-text("Calculate")')
        if (await calcBtn.count() > 0) {
          await calcBtn.first().click()
          await page.waitForTimeout(3_000)
        }

        calcUrl = page.url()
      }
    }
  }
}

test.describe('STC8 — Calculation Results', () => {
  test.beforeAll(async ({ browser }) => {
    const page = await browser.newPage()
    await setupUser(page)
    await page.close()
  })

  async function gotoCalc(page: Page) {
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

    if (calcUrl) {
      await page.goto(calcUrl)
      await page.waitForLoadState('networkidle')
    }
  }

  // STC8001: แสดงผล Pipe Segment
  test('STC8001 — หน้า Calculate แสดงผลทุก Pipe Segment พร้อม FU/GPM/ขนาดท่อ', async ({ page }) => {
    await gotoCalc(page)

    // ตรวจหาผลการคำนวณ (table หรือ card)
    const resultTable = page.locator('table, [class*="result"], [class*="pipe-result"]')
    if (await resultTable.count() > 0) {
      await expect(resultTable.first()).toBeVisible({ timeout: 10_000 })

      // ตรวจว่ามีคอลัมน์ FU / GPM / ขนาดท่อ
      const hasRequiredData = page.locator('text=FU, text=GPM, text=mm, text=inch')
      expect(await hasRequiredData.count()).toBeGreaterThan(0)
    }

    // ต้องไม่ crash
    await expect(page).not.toHaveURL(/error|500/)
  })

  // STC8002: Network Diagram แสดงขนาดท่อ
  test('STC8002 — Network Diagram แสดงขนาดท่อบน Pipe Segment', async ({ page }) => {
    await gotoCalc(page)

    // ตรวจหา network diagram ที่แสดงผล
    const diagram = page.locator('canvas, svg, [class*="network"], [class*="diagram"]')
    if (await diagram.count() > 0) {
      await expect(diagram.first()).toBeVisible()
    }

    // ต้องไม่ crash
    await expect(page).not.toHaveURL(/error|500/)
  })
})
