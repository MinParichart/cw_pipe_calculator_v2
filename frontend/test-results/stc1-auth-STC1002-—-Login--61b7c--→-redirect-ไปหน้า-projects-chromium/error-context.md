# Instructions

- Following Playwright test failed.
- Explain why, be concise, respect Playwright best practices.
- Provide a snippet of code with the fix, if possible.

# Test info

- Name: stc1-auth.spec.ts >> STC1002 — Login ด้วยข้อมูลถูกต้อง → redirect ไปหน้า /projects
- Location: frontend\tests\e2e\stc1-auth.spec.ts:46:1

# Error details

```
Error: expect(page).toHaveURL(expected) failed

Expected pattern: /\/projects/
Received string:  "http://localhost:3003/"

Call log:
  - Expect "toHaveURL" with timeout 10000ms
    10 × unexpected value "http://localhost:3003/"

```

# Test source

```ts
  1   | /**
  2   |  * System Tests: Authentication
  3   |  * STC1001 - ลงทะเบียนเพื่อเข้าใช้งาน (register)
  4   |  * STC1002 - เข้าใช้งานระบบ (login)
  5   |  * STC1003 - แสดง error เมื่อ password ไม่ถูกต้อง
  6   |  * STC1004 - เข้าถึงหน้าที่ต้อง login โดยไม่ได้ล็อกอิน → redirect
  7   |  * STC1005 - ออกจากระบบทำงานได้ถูกต้อง
  8   |  *
  9   |  * หมายเหตุ:
  10  |  * - Login page อยู่ที่ '/' (pages/index.vue) ไม่ใช่ '/login'
  11  |  * - Auth middleware redirect ไปที่ '/' เมื่อไม่ได้ login
  12  |  * - Logout มี confirmation dialog ก่อน (AppNavbar.vue: showLogoutConfirm)
  13  |  * - หลัง register/login redirect ไปที่ '/projects'
  14  |  */
  15  | 
  16  | import { test, expect } from '@playwright/test'
  17  | 
  18  | const BASE = 'http://localhost:3003'
  19  | const UNIQUE = Date.now()
  20  | const USER = {
  21  |   username: 'STCAuthTester',
  22  |   email: `stc1-auth-${UNIQUE}@test.com`,
  23  |   password: 'Test1234!',
  24  | }
  25  | 
  26  | // ─────────────────────────────────────────────
  27  | // STC1001: Register
  28  | // ─────────────────────────────────────────────
  29  | test('STC1001 — ลงทะเบียนสมาชิกสำเร็จ redirect ไปหน้า /projects', async ({ page }) => {
  30  |   await page.goto(`${BASE}/register`)
  31  | 
  32  |   // RegisterForm.vue: fields = username, email, password, confirm-password
  33  |   await page.fill('[name="username"]', USER.username)
  34  |   await page.fill('[name="email"]', USER.email)
  35  |   await page.fill('[name="password"]', USER.password)
  36  |   await page.fill('[name="confirm-password"]', USER.password)
  37  |   await page.click('button[type="submit"]')
  38  | 
  39  |   // RegisterForm.vue: router.push('/projects') on success
  40  |   await expect(page).toHaveURL(/\/projects/, { timeout: 10_000 })
  41  | })
  42  | 
  43  | // ─────────────────────────────────────────────
  44  | // STC1002: Login
  45  | // ─────────────────────────────────────────────
  46  | test('STC1002 — Login ด้วยข้อมูลถูกต้อง → redirect ไปหน้า /projects', async ({ page }) => {
  47  |   // Login page อยู่ที่ '/' (pages/index.vue)
  48  |   await page.goto(`${BASE}/`)
  49  | 
  50  |   // LoginForm.vue: fields = email, password
  51  |   await page.fill('[name="email"]', USER.email)
  52  |   await page.fill('[name="password"]', USER.password)
  53  |   await page.click('button[type="submit"]')
  54  | 
  55  |   // LoginForm.vue: router.push('/projects') on success
> 56  |   await expect(page).toHaveURL(/\/projects/, { timeout: 10_000 })
      |                      ^ Error: expect(page).toHaveURL(expected) failed
  57  | })
  58  | 
  59  | // ─────────────────────────────────────────────
  60  | // STC1003: Login ด้วย password ผิด → error
  61  | // ─────────────────────────────────────────────
  62  | test('STC1003 — Login ด้วย password ผิด → แสดง error ยังอยู่หน้าเดิม', async ({ page }) => {
  63  |   await page.goto(`${BASE}/`)
  64  | 
  65  |   await page.fill('[name="email"]', USER.email)
  66  |   await page.fill('[name="password"]', 'WrongPassword!')
  67  |   await page.click('button[type="submit"]')
  68  | 
  69  |   // ยังอยู่ที่ '/' ไม่ redirect
  70  |   await expect(page).toHaveURL(`${BASE}/`, { timeout: 5_000 })
  71  | 
  72  |   // LoginForm.vue: error แสดงใน div.bg-red-50
  73  |   const errorMsg = page.locator('.bg-red-50')
  74  |   await expect(errorMsg.first()).toBeVisible({ timeout: 5_000 })
  75  | })
  76  | 
  77  | // ─────────────────────────────────────────────
  78  | // STC1004: เข้าถึงหน้า Protected โดยไม่ login → redirect
  79  | // ─────────────────────────────────────────────
  80  | test('STC1004 — เข้า /projects โดยไม่ login → redirect ไปหน้า /', async ({ page }) => {
  81  |   // clear session ให้แน่ใจว่าไม่มี auth
  82  |   await page.context().clearCookies()
  83  |   await page.evaluate(() => localStorage.clear())
  84  | 
  85  |   await page.goto(`${BASE}/projects`)
  86  | 
  87  |   // middleware/auth.ts: navigateTo('/') เมื่อไม่ได้ login
  88  |   await expect(page).toHaveURL(`${BASE}/`, { timeout: 10_000 })
  89  | })
  90  | 
  91  | // ─────────────────────────────────────────────
  92  | // STC1005: Logout
  93  | // ─────────────────────────────────────────────
  94  | test('STC1005 — Logout → redirect กลับหน้า /', async ({ page }) => {
  95  |   // Login ก่อน
  96  |   await page.goto(`${BASE}/`)
  97  |   await page.fill('[name="email"]', USER.email)
  98  |   await page.fill('[name="password"]', USER.password)
  99  |   await page.click('button[type="submit"]')
  100 |   await expect(page).toHaveURL(/\/projects/, { timeout: 10_000 })
  101 | 
  102 |   // AppNavbar.vue: กด logout button → เปิด confirmation dialog (showLogoutConfirm = true)
  103 |   const logoutBtn = page.locator('button:has-text("ออกจากระบบ")')
  104 |   await logoutBtn.first().click()
  105 | 
  106 |   // AppNavbar.vue: กด confirm button ใน dialog (@click="confirmLogout")
  107 |   const confirmBtn = page.locator('button:has-text("ออกจากระบบ")').last()
  108 |   await confirmBtn.click()
  109 | 
  110 |   // useAuth.ts: navigateTo('/') หลัง logout
  111 |   await expect(page).toHaveURL(`${BASE}/`, { timeout: 10_000 })
  112 | })
  113 | 
```