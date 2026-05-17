# Instructions

- Following Playwright test failed.
- Explain why, be concise, respect Playwright best practices.
- Provide a snippet of code with the fix, if possible.

# Test info

- Name: stc1-auth.spec.ts >> STC1001 — ลงทะเบียนสมาชิกสำเร็จ redirect ไปหน้า Login หรือ Dashboard
- Location: frontend\tests\e2e\stc1-auth.spec.ts:23:1

# Error details

```
Error: expect(page).not.toHaveURL(expected) failed

Expected pattern: not /\/register/
Received string: "http://localhost:3003/register"
Timeout: 10000ms

Call log:
  - Expect "not toHaveURL" with timeout 10000ms
    14 × unexpected value "http://localhost:3003/register"

```

# Page snapshot

```yaml
- generic [ref=e6] [cursor=pointer]:
  - generic [ref=e7]:
    - img [ref=e8]
    - heading "CW Pipe Calculator" [level=1] [ref=e10]
    - paragraph [ref=e11]: ลงทะเบียนเพื่อเริ่มใช้งาน
  - generic [ref=e13]:
    - generic [ref=e14]:
      - heading "ลงทะเบียน" [level=2] [ref=e15]
      - paragraph [ref=e16]:
        - text: หรือ
        - link "เข้าสู่ระบบ" [ref=e17]:
          - /url: /
    - generic [ref=e18]:
      - generic [ref=e19]:
        - generic [ref=e20]:
          - generic [ref=e21]: Username *
          - textbox "Username *" [ref=e22]:
            - /placeholder: username
            - text: STC Auth Tester
        - generic [ref=e23]:
          - generic [ref=e24]: Email *
          - textbox "Email *" [ref=e25]:
            - /placeholder: your@email.com
            - text: stc1-auth-1779013453778@test.com
        - generic [ref=e26]:
          - generic [ref=e27]: Password *
          - textbox "Password *" [ref=e28]:
            - /placeholder: ••••••••
            - text: Test1234!
          - paragraph [ref=e29]: อย่างน้อย 8 ตัวอักษร
        - generic [ref=e30]:
          - generic [ref=e31]: Confirm Password *
          - textbox "Confirm Password *" [ref=e32]:
            - /placeholder: ••••••••
          - paragraph [ref=e33]: กรุณากรอก Confirm Password
      - button "ลงทะเบียน" [active] [ref=e35]:
        - generic [ref=e36]: ลงทะเบียน
```

# Test source

```ts
  1  | /**
  2  |  * System Tests: Authentication
  3  |  * STC1001 - ลงทะเบียนเพื่อเข้าใช้งาน (register)
  4  |  * STC1002 - เข้าใช้งานระบบ (login)
  5  |  * STC1003 - แสดง error เมื่อ password ไม่ถูกต้อง
  6  |  * STC1004 - เข้าถึงหน้าที่ต้อง login โดยไม่ได้ล็อกอิน → redirect
  7  |  * STC1005 - ออกจากระบบทำงานได้ถูกต้อง
  8  |  */
  9  | 
  10 | import { test, expect } from '@playwright/test'
  11 | 
  12 | const BASE = 'http://localhost:3003'
  13 | const UNIQUE = Date.now()
  14 | const USER = {
  15 |   name: 'STC Auth Tester',
  16 |   email: `stc1-auth-${UNIQUE}@test.com`,
  17 |   password: 'Test1234!',
  18 | }
  19 | 
  20 | // ─────────────────────────────────────────────
  21 | // STC1001: Register
  22 | // ─────────────────────────────────────────────
  23 | test('STC1001 — ลงทะเบียนสมาชิกสำเร็จ redirect ไปหน้า Login หรือ Dashboard', async ({ page }) => {
  24 |   await page.goto(`${BASE}/register`)
  25 |   await page.fill('[name="name"], [placeholder*="ชื่อ"], [placeholder*="name"]', USER.name)
  26 |   await page.fill('[name="email"], [type="email"]', USER.email)
  27 |   await page.fill('[name="password"], [type="password"]', USER.password)
  28 |   
  29 |   await page.click('button[type="submit"]')
  30 |   // หลัง register ต้องเปลี่ยนหน้าออกจาก /register
> 31 |   await expect(page).not.toHaveURL(/\/register/, { timeout: 10_000 })
     |                          ^ Error: expect(page).not.toHaveURL(expected) failed
  32 | })
  33 | 
  34 | // ─────────────────────────────────────────────
  35 | // STC1002: Login
  36 | // ─────────────────────────────────────────────
  37 | test('STC1002 — Login ด้วยข้อมูลถูกต้อง → เข้าสู่ Dashboard', async ({ page }) => {
  38 |   await page.goto(`${BASE}/login`)
  39 |   await page.fill('[name="email"], [type="email"]', USER.email)
  40 |   await page.fill('[name="password"], [type="password"]', USER.password)
  41 |   await page.click('button[type="submit"]')
  42 |   // ต้องออกจากหน้า /login
  43 |   await expect(page).not.toHaveURL(/\/login/, { timeout: 10_000 })
  44 | })
  45 | 
  46 | // ─────────────────────────────────────────────
  47 | // STC1003: Login ด้วย password ผิด → error
  48 | // ─────────────────────────────────────────────
  49 | test('STC1003 — Login ด้วย password ผิด → แสดง error และอยู่ที่หน้า Login', async ({ page }) => {
  50 |   await page.goto(`${BASE}/login`)
  51 |   await page.fill('[name="email"], [type="email"]', USER.email)
  52 |   await page.fill('[name="password"], [type="password"]', 'WrongPassword!')
  53 |   await page.click('button[type="submit"]')
  54 |   // ยังอยู่ที่ /login
  55 |   await expect(page).toHaveURL(/\/login/, { timeout: 5_000 })
  56 |   // ต้องมี error message ปรากฏบนหน้า
  57 |   const errorMsg = page.locator('[class*="error"], [class*="alert"], [role="alert"], .text-red-500, .text-red-600')
  58 |   await expect(errorMsg.first()).toBeVisible({ timeout: 5_000 })
  59 | })
  60 | 
  61 | // ─────────────────────────────────────────────
  62 | // STC1004: เข้าถึงหน้า Protected โดยไม่ login → redirect
  63 | // ─────────────────────────────────────────────
  64 | test('STC1004 — เข้า /projects โดยไม่ login → redirect ไปหน้า Login', async ({ page }) => {
  65 |   // ใช้ browser ใหม่ที่ไม่มี session
  66 |   await page.context().clearCookies()
  67 |   await page.goto(`${BASE}/projects`)
  68 |   // ต้อง redirect ไปหน้า login
  69 |   await expect(page).toHaveURL(/\/login/, { timeout: 10_000 })
  70 | })
  71 | 
  72 | // ─────────────────────────────────────────────
  73 | // STC1005: Logout
  74 | // ─────────────────────────────────────────────
  75 | test('STC1005 — Logout → redirect ไปหน้า Login', async ({ page }) => {
  76 |   // Login ก่อน
  77 |   await page.goto(`${BASE}/login`)
  78 |   await page.fill('[name="email"], [type="email"]', USER.email)
  79 |   await page.fill('[name="password"], [type="password"]', USER.password)
  80 |   await page.click('button[type="submit"]')
  81 |   await expect(page).not.toHaveURL(/\/login/, { timeout: 10_000 })
  82 | 
  83 |   // กด Logout
  84 |   const logoutBtn = page.locator('button:has-text("ออกจากระบบ"), button:has-text("Logout"), a:has-text("ออกจากระบบ"), a:has-text("Logout")')
  85 |   await logoutBtn.first().click()
  86 |   // ต้อง redirect ไปหน้า login
  87 |   await expect(page).toHaveURL(/\/login/, { timeout: 10_000 })
  88 | })
  89 | 
```