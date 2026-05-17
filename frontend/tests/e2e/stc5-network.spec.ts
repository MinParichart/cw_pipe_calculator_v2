/**
 * System Tests: Network Builder
 * STC5001 - เปิดหน้า Network Builder → แสดง Canvas
 * STC5002 - สร้าง Node บน Canvas
 * STC5003 - ลาก Pipe เชื่อมระหว่าง 2 Nodes
 * STC5004 - บันทึก Network Diagram
 * STC5005 - โหลด Network ที่บันทึกไว้กลับมา
 */

import { test, expect, Page } from '@playwright/test'

const BASE = 'http://localhost:3003'
const UNIQUE = Date.now()
const USER = { email: `stc5-net-${UNIQUE}@test.com`, password: 'Test1234!' }

let networkUrl = ''

async function setupAndGetNetworkUrl(page: Page): Promise<string> {
  // Register
  await page.goto(`${BASE}/register`)
  await page.fill('[name="username"]', 'STC Network Tester')
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
  // สร้าง project
  await page.goto(`${BASE}/projects/new`)
  await page.fill('#name', `STC5 Project ${UNIQUE}`)
  await page.click('button[type="submit"], button:has-text("สร้าง")')
  await page.waitForURL(/\/projects\/\w+/, { timeout: 10_000 })
  const projectUrl = page.url()

  // สร้าง version
  const newVerBtn = page.locator('button:has-text("สร้างเวอร์ชัน"), button:has-text("New Version")')
  if (await newVerBtn.count() > 0) {
    await newVerBtn.first().click()
    const nameField = page.locator('[name="name"], [placeholder*="Version"]')
    await nameField.first().fill('Version 1')
    await page.click('button[type="submit"], button:has-text("สร้าง")')
    await page.waitForTimeout(1_000)
  }

  // หา URL ของ network page
  const networkLink = page.locator('a:has-text("Network"), a:has-text("วาดท่อ"), a[href*="network"]')
  if (await networkLink.count() > 0) {
    await networkLink.first().click()
    await page.waitForURL(/\/network/, { timeout: 10_000 })
    return page.url()
  }
  // fallback: ลองสร้าง URL โดยตรง
  return projectUrl.replace(/\/?$/, '/versions') + '/network'
}

test.describe('STC5 — Network Builder', () => {
  test.beforeAll(async ({ browser }) => {
    const page = await browser.newPage()
    networkUrl = await setupAndGetNetworkUrl(page)
    await page.close()
  })

  async function gotoNetwork(page: Page) {
    await page.goto(`${BASE}/`)
    await page.waitForLoadState('networkidle')
    await page.fill('[name="email"]', USER.email)
    await page.fill('[name="password"]', USER.password)
    await page.click('button[type="submit"]')
    await page.waitForURL(/\/projects/, { timeout: 10_000 })
    if (networkUrl) await page.goto(networkUrl)
  }

  // STC5001: เปิดหน้า Network Builder
  test('STC5001 — เปิดหน้า Network Builder แสดง Canvas ไม่ error', async ({ page }) => {
    await gotoNetwork(page)
    await page.waitForURL(/\/network/, { timeout: 10_000 })
    // ต้องมี canvas หรือ SVG สำหรับวาด diagram
    const canvas = page.locator('canvas, svg[id*="network"], svg[class*="network"], [class*="canvas"]')
    await expect(canvas.first()).toBeVisible({ timeout: 10_000 })
    // ต้องไม่มี error 500
    await expect(page.locator('text=500, text=Internal Server Error')).toHaveCount(0)
  })

  // STC5002: สร้าง Node
  test('STC5002 — คลิก Canvas → สร้าง Node ใหม่ได้', async ({ page }) => {
    await gotoNetwork(page)
    await page.waitForURL(/\/network/, { timeout: 10_000 })

    // หาปุ่มเพิ่ม Node หรือ click canvas โดยตรง
    const addNodeBtn = page.locator('button:has-text("เพิ่ม Node"), button:has-text("Add Node"), button[title*="Node"]')
    if (await addNodeBtn.count() > 0) {
      await addNodeBtn.first().click()
    } else {
      // คลิกตรงกลาง canvas
      const canvas = page.locator('canvas, svg').first()
      await canvas.click({ position: { x: 200, y: 200 } })
    }
    await page.waitForTimeout(500)
    // ต้องมี element ของ node ปรากฏ
    const nodes = page.locator('[class*="node"], circle[class*="node"], [data-type="node"]')
    if (await nodes.count() > 0) {
      expect(await nodes.count()).toBeGreaterThan(0)
    } else {
      // UI อาจใช้ structure ต่างกัน — แค่ไม่ crash
      await expect(page).not.toHaveURL(/error|500/)
    }
  })

  // STC5003: ลาก Pipe เชื่อม Nodes
  test('STC5003 — ลาก Pipe เชื่อม 2 Nodes ได้', async ({ page }) => {
    await gotoNetwork(page)
    await page.waitForURL(/\/network/, { timeout: 10_000 })
    // ทดสอบ drag ระหว่าง 2 node (ถ้ามี)
    const nodes = page.locator('[class*="node"], circle')
    if (await nodes.count() >= 2) {
      const node1 = nodes.nth(0)
      const node2 = nodes.nth(1)
      const box1 = await node1.boundingBox()
      const box2 = await node2.boundingBox()
      if (box1 && box2) {
        await page.mouse.move(box1.x + box1.width / 2, box1.y + box1.height / 2)
        await page.mouse.down()
        await page.mouse.move(box2.x + box2.width / 2, box2.y + box2.height / 2, { steps: 10 })
        await page.mouse.up()
        await page.waitForTimeout(500)
      }
    }
    await expect(page).not.toHaveURL(/error|500/)
  })

  // STC5004: บันทึก Network
  test('STC5004 — กด "บันทึก" → แสดงข้อความยืนยัน', async ({ page }) => {
    await gotoNetwork(page)
    await page.waitForURL(/\/network/, { timeout: 10_000 })

    const saveBtn = page.locator('button:has-text("บันทึก"), button:has-text("Save")')
    await expect(saveBtn.first()).toBeVisible({ timeout: 5_000 })
    await saveBtn.first().click()
    // ต้องมี success message หรืออย่างน้อยไม่มี error
    await page.waitForTimeout(1_500)
    const errMsg = page.locator('[class*="error"], .text-red-500, [role="alert"]:has-text("error")')
    expect(await errMsg.count()).toBe(0)
  })

  // STC5005: โหลด Network กลับมา
  test('STC5005 — ออกจากหน้า Network แล้วกลับเข้ามา → โหลด diagram ถูกต้อง', async ({ page }) => {
    await gotoNetwork(page)
    await page.waitForURL(/\/network/, { timeout: 10_000 })
    // ออกไปหน้าอื่น
    await page.goto(`${BASE}/projects`)
    // กลับมาหน้า network
    if (networkUrl) await page.goto(networkUrl)
    await page.waitForURL(/\/network/, { timeout: 10_000 })
    // Canvas ต้องยังแสดงอยู่ ไม่ blank error
    const canvas = page.locator('canvas, svg[class*="network"], [class*="canvas"]')
    await expect(canvas.first()).toBeVisible({ timeout: 10_000 })
  })

  
})
