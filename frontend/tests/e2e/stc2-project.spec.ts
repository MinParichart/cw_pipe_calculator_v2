/**
 * System Tests: Project Management
 * STC2001 - สร้างโครงการใหม่ผ่าน UI
 * STC2002 - แสดงรายการโครงการทั้งหมด
 * STC2003 - เข้าถึงรายละเอียดโครงการ
 * STC2004 - กำหนด Design Criteria ของโครงการ
 *
 * หมายเหตุ:
 * - Login page อยู่ที่ '/' (ไม่ใช่ '/login')
 * - /projects/new: fields = id="name", id="floors", id="pvcClass", id="minorLoss"
 * - C-Factor ถูก lock ไว้ที่ PVC(150) — ไม่สามารถแก้ไขได้
 * - หลังสร้างโปรเจกต์ redirect ไปที่ /projects/:id
 * - ProjectCard ใช้ class "card"
 */

import { test, expect, Page } from '@playwright/test'

const BASE = 'http://localhost:3003'
const UNIQUE = Date.now()
const USER = { email: `stc2-proj-${UNIQUE}@test.com`, password: 'Test1234!' }
const PROJECT_NAME = `ทาวน์โฮม STC2-${UNIQUE}`

async function loginAs(page: Page) {
  await page.goto(`${BASE}/`)
  await page.waitForLoadState('networkidle')
  await page.fill('[name="email"]', USER.email)
  await page.fill('[name="password"]', USER.password)
  await page.click('button[type="submit"]')
  await page.waitForURL(/\/projects/, { timeout: 10_000 })
}

test.describe('STC2 — Project Management', () => {
  test.beforeAll(async ({ browser }) => {
    const page = await browser.newPage()

    // Register user
    await page.goto(`${BASE}/register`)
    await page.waitForLoadState('networkidle')
    await page.fill('[name="username"]', 'STC2Tester')
    await page.fill('[name="email"]', USER.email)
    await page.fill('[name="password"]', USER.password)
    await page.fill('[name="confirm-password"]', USER.password)
    await page.click('button[type="submit"]')
    await page.waitForURL(/\/projects/, { timeout: 10_000 })

    // สร้าง 1 project ไว้ก่อน ให้ STC2002/2003 มี card ให้เจอ
    await page.goto(`${BASE}/projects/new`)
    await page.waitForLoadState('networkidle')
    await page.fill('#name', `Setup Project ${UNIQUE}`)
    await page.fill('#floors', '1')
    await page.click('button[type="submit"]')
    await page.waitForURL(/\/projects\/\d+/, { timeout: 10_000 })

    await page.close()
  })

  // ─────────────────────────────────────────────
  // STC2001: สร้างโครงการใหม่
  // ─────────────────────────────────────────────
  test('STC2001 — สร้างโครงการใหม่ → redirect ไปหน้า /projects/:id', async ({ page }) => {
    await loginAs(page)

    await page.goto(`${BASE}/projects/new`)
    await page.waitForLoadState('networkidle')

    // new.vue: id="name", id="floors", default buildingType = APARTMENT (selected)
    await page.fill('#name', PROJECT_NAME)
    await page.fill('#floors', '2')

    // submit button text = "สร้างโปรเจกต์"
    await page.click('button[type="submit"]')

    // handleCreate: router.push('/projects/${newProject.id}')
    await expect(page).toHaveURL(/\/projects\/\d+/, { timeout: 10_000 })
  })

  // ─────────────────────────────────────────────
  // STC2002: แสดงรายการโครงการ
  // ─────────────────────────────────────────────
  test('STC2002 — หน้า /projects แสดงโครงการในรูปแบบ Card', async ({ page }) => {
    await loginAs(page)

    await page.goto(`${BASE}/projects`)
    await page.waitForLoadState('networkidle')

    // ProjectCard มี class "card" (projects/index.vue: grid ของ ProjectCard)
    const cards = page.locator('.card')
    await expect(cards.first()).toBeVisible({ timeout: 10_000 })

    // card ต้องแสดงชื่อโปรเจกต์ใน h3
    await expect(page.locator('h3').first()).toBeVisible({ timeout: 5_000 })
  })

  // ─────────────────────────────────────────────
  // STC2003: คลิก Card → รายละเอียดโครงการ
  // ─────────────────────────────────────────────
  test('STC2003 — คลิก Card → URL เปลี่ยนเป็น /projects/:id', async ({ page }) => {
    await loginAs(page)

    await page.goto(`${BASE}/projects`)
    await page.waitForLoadState('networkidle')

    // ProjectCard: @click="$emit('click', project.id)" → openProject(id) → router.push('/projects/${id}')
    const firstCard = page.locator('.card').first()
    await firstCard.click()

    await expect(page).toHaveURL(/\/projects\/\d+/, { timeout: 10_000 })
  })

  // ─────────────────────────────────────────────
  // STC2004: กำหนด Design Criteria ตอนสร้างโปรเจกต์
  // ─────────────────────────────────────────────
  test('STC2004 — กำหนด Design Criteria (minorLoss, pvcClass) → สร้างสำเร็จ', async ({ page }) => {
    await loginAs(page)

    await page.goto(`${BASE}/projects/new`)
    await page.waitForLoadState('networkidle')

    await page.fill('#name', `Criteria Test ${UNIQUE}`)
    await page.fill('#floors', '1')

    // id="pvcClass" → select
    await page.selectOption('#pvcClass', { value: '8.5' })

    // id="minorLoss" → number input (new.vue: v-model.number="form.minorLossFactor")
    await page.fill('#minorLoss', '30')

    await page.click('button[type="submit"]')

    // ต้องสร้างสำเร็จ redirect ไป /projects/:id ไม่ crash
    await expect(page).toHaveURL(/\/projects\/\d+/, { timeout: 10_000 })
  })
})
