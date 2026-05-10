/**
 * Playwright Helpers — ใช้ร่วมกันทุก spec file
 */
import { Page } from '@playwright/test'

export const TEST_USER = {
  name: 'System Test User',
  email: `stc-${Date.now()}@test.com`,
  password: 'Test1234!',
}

/** Login และรอจนกว่าจะ redirect ไป projects/dashboard */
export async function login(page: Page, email: string, password: string) {
  await page.goto('/login')
  await page.fill('input[name="email"], input[type="email"]', email)
  await page.fill('input[name="password"], input[type="password"]', password)
  await page.click('button[type="submit"]')
  await page.waitForURL(/projects|dashboard/, { timeout: 10000 })
}

/** Register ผู้ใช้ใหม่ */
export async function register(page: Page, name: string, email: string, password: string) {
  await page.goto('/register')
  await page.fill('input[name="name"], input[placeholder*="ชื่อ"]', name)
  await page.fill('input[name="email"], input[type="email"]', email)
  await page.fill('input[name="password"], input[type="password"]', password)
  const confirmField = page.locator('input[name="confirmPassword"], input[name="confirm"]')
  if (await confirmField.count() > 0) {
    await confirmField.fill(password)
  }
  await page.click('button[type="submit"]')
}
