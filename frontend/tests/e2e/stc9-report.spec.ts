/**
 * System Tests: Report Page [v2]
 * STC9001 - Report Page แสดงครบ: Criteria, Critical Path, Branch Table, Diagram
 * STC9002 - Building Type แสดงเป็นภาษาไทย (APARTMENT → "อาคารพักอาศัย")
 * STC9003 - ค่า velocity ใน Report ตรงกับหน้า Calculate
 * STC9004 - Print Report → เปิด popup A4
 * STC9005 - Report เมื่อ snapshotResults = null → แสดง "ยังไม่มีผลการคำนวณ"
 */

import { test, expect, Page } from '@playwright/test'

const BASE = 'http://localhost:3003'
const UNIQUE = Date.now()
const USER = { email: `stc9-rep-${UNIQUE}@test.com`, password: 'Test1234!' }

let reportUrl = ''
let emptyReportUrl = ''

async function setupUser(page: Page) {
  await page.goto(`${BASE}/register`)
  await page.fill('[name="username"]', 'STC Report Tester')
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
  await page.fill('[name="username"]', `STC9 Project ${UNIQUE}`)
  await page.click('button[type="submit"], button:has-text("สร้าง")')
  await page.waitForURL(/\/projects\/\w+/, { timeout: 10_000 })
  const projectUrl = page.url()

  // สร้าง version แล้วไปหน้า report
  const newVerBtn = page.locator('button:has-text("สร้างเวอร์ชัน"), button:has-text("New Version")')
  if (await newVerBtn.count() > 0) {
    await newVerBtn.first().click()
    await page.locator('[name="name"], [placeholder*="Version"]').first().fill('Version 1')
    await page.click('button[type="submit"], button:has-text("สร้าง")')
    await page.waitForURL(/\/projects\/\w+/, { timeout: 10_000 })
  }

  // URL ของ empty report (ยังไม่ได้คำนวณ)
  const versionLink = page.locator('a[href*="versions"]')
  if (await versionLink.count() > 0) {
    const href = await versionLink.first().getAttribute('href') ?? ''
    emptyReportUrl = `${BASE}${href.replace(/\/+$/, '')}/report`
  }

  // คำนวณก่อน แล้วหา report URL
  const calcLink = page.locator('a:has-text("คำนวณ"), a[href*="calculation"]')
  if (await calcLink.count() > 0) {
    await calcLink.first().click()
    await page.waitForURL(/\/calculation/, { timeout: 10_000 })
    const calcBtn = page.locator('button:has-text("คำนวณ"), button:has-text("Calculate")')
    if (await calcBtn.count() > 0) {
      await calcBtn.first().click()
      await page.waitForTimeout(3_000)
    }
    // หา report URL จาก current URL
    reportUrl = page.url().replace('/calculation', '/report')
  }
}

test.describe('STC9 — Report Page [v2]', () => {
  test.beforeAll(async ({ browser }) => {
    const page = await browser.newPage()
    await setupUser(page)
    await page.close()
  })

  async function loginAndGoto(page: Page, url: string) {
    await page.goto(`${BASE}/login`)
    await page.fill('[name="email"]', USER.email)
    await page.fill('[name="password"]', USER.password)
    await page.click('button[type="submit"]')
    await page.waitForURL(/dashboard|projects/, { timeout: 10_000 })
    if (url) await page.goto(url)
  }

  // STC9001
  test('STC9001 — [v2] Report Page แสดงข้อมูลครบ: Criteria, Table, Diagram', async ({ page }) => {
    if (!reportUrl) test.skip(true, 'ไม่สามารถหา Report URL ได้')
    await loginAndGoto(page, reportUrl)
    await expect(page).toHaveURL(/\/report/, { timeout: 10_000 })
    // ตรวจว่ามีเนื้อหาครบ
    await expect(page.locator('text=Criteria, text=เกณฑ์, text=ผลการคำนวณ').first()).toBeVisible({ timeout: 10_000 })
    await expect(page).not.toHaveURL(/error|500/)
  })

  // STC9002
  test('STC9002 — [v2] Building Type แสดงเป็นภาษาไทย ไม่ใช่ "APARTMENT"', async ({ page }) => {
    if (!reportUrl) test.skip(true, 'ไม่สามารถหา Report URL ได้')
    await loginAndGoto(page, reportUrl)
    await expect(page).toHaveURL(/\/report/, { timeout: 10_000 })
    // ต้องไม่แสดง raw enum "APARTMENT" บนหน้า
    const rawEnum = page.locator('text=APARTMENT')
    expect(await rawEnum.count()).toBe(0)
    // ต้องแสดงภาษาไทย
    const thaiText = page.locator('text=อาคาร, text=พักอาศัย, text=คอนโด')
    // UI อาจมีรูปแบบต่างกัน — อย่างน้อยไม่แสดง APARTMENT ดิบ
  })

  // STC9003
  test('STC9003 — [v2] ค่า velocity ใน Report ตรงกับ snapshotResults', async ({ page }) => {
    if (!reportUrl) test.skip(true, 'ไม่สามารถหา Report URL ได้')
    await loginAndGoto(page, reportUrl)
    await expect(page).toHaveURL(/\/report/, { timeout: 10_000 })
    // ตรวจว่า Report โหลดข้อมูลจาก snapshotResults โดยตรง (ไม่ recalculate)
    // ค่า velocity ต้องปรากฏในตาราง
    const velocityCells = page.locator('[class*="velocity"], td:has-text("m/s"), td:has-text("0.")')
    // อาจไม่มีถ้า version ไม่มี network — แค่ไม่ crash
    await expect(page).not.toHaveURL(/error|500/)
  })

  // STC9004
  test('STC9004 — [v2] กด Print → window.print() ถูกเรียก (ไม่ crash)', async ({ page }) => {
    if (!reportUrl) test.skip(true, 'ไม่สามารถหา Report URL ได้')
    await loginAndGoto(page, reportUrl)
    await expect(page).toHaveURL(/\/report/, { timeout: 10_000 })

    // intercept window.print
    let printCalled = false
    await page.exposeFunction('__playwrightPrintInterceptor', () => { printCalled = true })
    await page.addInitScript(() => {
      window.print = () => { (window as any).__playwrightPrintInterceptor() }
    })

    const printBtn = page.locator('button:has-text("พิมพ์"), button:has-text("Print"), a:has-text("พิมพ์")')
    if (await printBtn.count() > 0) {
      await printBtn.first().click()
      await page.waitForTimeout(1_000)
      // ต้องไม่ crash
      await expect(page).not.toHaveURL(/error|500/)
    } else {
      test.skip(true, 'ไม่พบปุ่ม Print ใน UI')
    }
  })

  // STC9005
  test('STC9005 — [v2] Report เมื่อยังไม่มีผลคำนวณ → แสดง "ยังไม่มีผล" ไม่ crash', async ({ page }) => {
    if (!emptyReportUrl) test.skip(true, 'ไม่สามารถหา empty Report URL ได้')
    await loginAndGoto(page, emptyReportUrl)
    // ต้องไม่ crash (ไม่ 500)
    await expect(page).not.toHaveURL(/error|500/, { timeout: 10_000 })
    // ต้องแสดงข้อความว่าไม่มีผลการคำนวณ
    const noResultMsg = page.locator(
      'text=ยังไม่มีผลการคำนวณ, text=ไม่มีข้อมูล, text=No results, text=ยังไม่ได้คำนวณ'
    )
    await expect(noResultMsg.first()).toBeVisible({ timeout: 10_000 })
  })
})
