import { Page } from '@playwright/test'

const BASE_URL = 'http://localhost:3003'

export const TEST_USER = {
  name: 'STC Tester',
  email: `stc-tester-${Date.now()}@test.com`,
  password: 'Test1234!',
}

/** สมัครสมาชิกและ login — คืน cookie/token state */
export async function registerAndLogin(page: Page, user = TEST_USER) {
  await page.goto(`${BASE_URL}/register`)
  await page.fill('[name="name"], [placeholder*="ชื่อ"], [placeholder*="name"]', user.name)
  await page.fill('[name="email"], [type="email"]', user.email)
  await page.fill('[name="password"], [type="password"]', user.password)
  await page.click('button[type="submit"], button:has-text("สมัคร"), button:has-text("Register")')
  await page.waitForURL(/login|dashboard|projects/, { timeout: 10_000 })
}

/** Login ด้วย user ที่มีอยู่แล้ว */
export async function login(page: Page, user = TEST_USER) {
  await page.goto(`${BASE_URL}/login`)
  await page.fill('[name="email"], [type="email"]', user.email)
  await page.fill('[name="password"], [type="password"]', user.password)
  await page.click('button[type="submit"], button:has-text("เข้าสู่ระบบ"), button:has-text("Login")')
  await page.waitForURL(/dashboard|projects/, { timeout: 10_000 })
}
