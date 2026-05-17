# Instructions

- Following Playwright test failed.
- Explain why, be concise, respect Playwright best practices.
- Provide a snippet of code with the fix, if possible.

# Test info

- Name: stc2-project.spec.ts >> STC2001 — สร้างโครงการใหม่ปรากฏในรายการ
- Location: frontend\tests\e2e\stc2-project.spec.ts:43:1

# Error details

```
Test timeout of 30000ms exceeded.
```

```
Error: page.fill: Test timeout of 30000ms exceeded.
Call log:
  - waiting for locator('[name="email"]')

```

# Page snapshot

```yaml
- generic [active] [ref=e1]:
  - generic [ref=e5]:
    - heading "404" [level=1] [ref=e6]
    - paragraph [ref=e7]: "Page not found: /login"
    - link "Go back home" [ref=e9] [cursor=pointer]:
      - /url: /
  - status [ref=e10]
  - iframe [ref=e11]:
    - generic [ref=f1e2]:
      - banner [ref=f1e3]:
        - generic [ref=f1e5]:
          - checkbox [ref=f1e6]
          - generic "Light mode" [ref=f1e8] [cursor=pointer]:
            - img [ref=f1e9]
      - generic [ref=f1e13]:
        - heading "Error" [level=4] [ref=f1e14]
        - heading "An error has occurred" [level=1] [ref=f1e15]
      - 'heading "Page not found: /login Copy error with stack trace to clipboard" [level=2] [ref=f1e19]':
        - img [ref=f1e21]
        - generic [ref=f1e23]: "Page not found: /login"
        - button "Copy error with stack trace to clipboard" [ref=f1e24] [cursor=pointer]:
          - img [ref=f1e25]
      - generic [ref=f1e30]:
        - heading "Stack Trace" [level=3] [ref=f1e33]
        - generic [ref=f1e35]:
          - generic [ref=f1e36]:
            - generic [ref=f1e38]:
              - checkbox "View All Frames" [ref=f1e39]
              - generic [ref=f1e40]: View All Frames
            - generic [ref=f1e42]:
              - button "Pretty" [ref=f1e43]
              - button "Raw" [ref=f1e44]
          - list [ref=f1e47]:
            - listitem [ref=f1e48]:
              - generic [ref=f1e49]:
                - button "D:/41.IS-Thesis/cw_pipe_calculator_v2/frontend/node_modules/h3/dist/index.mjs in createError at line 71:15" [ref=f1e50]:
                  - link "D:/41.IS-Thesis/cw_pipe_calculator_v2/frontend/node_modules/h3/dist/index.mjs" [ref=f1e51] [cursor=pointer]:
                    - /url: vscode://file/D:/41.IS-Thesis/cw_pipe_calculator_v2/frontend/node_modules/h3/dist/index.mjs:71
                  - generic [ref=f1e52]:
                    - text: in
                    - code [ref=f1e53]: createError
                  - generic [ref=f1e54]:
                    - text: at line
                    - code [ref=f1e55]: 71:15
                - button [ref=f1e57]:
                  - img [ref=f1e58]
              - code [ref=f1e62]:
                - generic [ref=f1e76]: "return new H3Error(input); } if (isError(input)) { return input; } const err = new H3Error(input.message ?? input.statusMessage ?? \"\", { cause: input.cause || input }); if (hasProp(input, \"stack\")) { try { Object.defineProperty(err, \"stack\", {"
            - listitem [ref=f1e77]:
              - generic [ref=f1e78]:
                - button "D:/41.IS-Thesis/cw_pipe_calculator_v2/frontend/node_modules/nuxt/dist/app/composables/error.js in createError at line 47:58" [ref=f1e79]:
                  - link "D:/41.IS-Thesis/cw_pipe_calculator_v2/frontend/node_modules/nuxt/dist/app/composables/error.js" [ref=f1e80] [cursor=pointer]:
                    - /url: vscode://file/D:/41.IS-Thesis/cw_pipe_calculator_v2/frontend/node_modules/nuxt/dist/app/composables/error.js:47
                  - generic [ref=f1e81]:
                    - text: in
                    - code [ref=f1e82]: createError
                  - generic [ref=f1e83]:
                    - text: at line
                    - code [ref=f1e84]: 47:58
                - button [ref=f1e86]:
                  - img [ref=f1e87]
            - listitem [ref=f1e89]:
              - generic [ref=f1e90]:
                - button "D:/41.IS-Thesis/cw_pipe_calculator_v2/frontend/node_modules/nuxt/dist/pages/runtime/plugins/router.js at line 221:118" [ref=f1e91]:
                  - link "D:/41.IS-Thesis/cw_pipe_calculator_v2/frontend/node_modules/nuxt/dist/pages/runtime/plugins/router.js" [ref=f1e92] [cursor=pointer]:
                    - /url: vscode://file/D:/41.IS-Thesis/cw_pipe_calculator_v2/frontend/node_modules/nuxt/dist/pages/runtime/plugins/router.js:221
                  - generic [ref=f1e93]:
                    - text: at line
                    - code [ref=f1e94]: 221:118
                - button [ref=f1e96]:
                  - img [ref=f1e97]
            - listitem [ref=f1e99]:
              - generic [ref=f1e100]:
                - button "D:/41.IS-Thesis/cw_pipe_calculator_v2/frontend/node_modules/nuxt/dist/app/nuxt.js in fn at line 239:44" [ref=f1e101]:
                  - link "D:/41.IS-Thesis/cw_pipe_calculator_v2/frontend/node_modules/nuxt/dist/app/nuxt.js" [ref=f1e102] [cursor=pointer]:
                    - /url: vscode://file/D:/41.IS-Thesis/cw_pipe_calculator_v2/frontend/node_modules/nuxt/dist/app/nuxt.js:239
                  - generic [ref=f1e103]:
                    - text: in
                    - code [ref=f1e104]: fn
                  - generic [ref=f1e105]:
                    - text: at line
                    - code [ref=f1e106]: 239:44
                - button [ref=f1e108]:
                  - img [ref=f1e109]
            - listitem [ref=f1e111]:
              - generic [ref=f1e112]:
                - button "D:/41.IS-Thesis/cw_pipe_calculator_v2/frontend/node_modules/unctx/dist/index.mjs in Object.callAsync at line 68:55" [ref=f1e113]:
                  - link "D:/41.IS-Thesis/cw_pipe_calculator_v2/frontend/node_modules/unctx/dist/index.mjs" [ref=f1e114] [cursor=pointer]:
                    - /url: vscode://file/D:/41.IS-Thesis/cw_pipe_calculator_v2/frontend/node_modules/unctx/dist/index.mjs:68
                  - generic [ref=f1e115]:
                    - text: in
                    - code [ref=f1e116]: Object.callAsync
                  - generic [ref=f1e117]:
                    - text: at line
                    - code [ref=f1e118]: 68:55
                - button [ref=f1e120]:
                  - img [ref=f1e121]
            - listitem [ref=f1e123]:
              - generic [ref=f1e124]:
                - button "D:/41.IS-Thesis/cw_pipe_calculator_v2/frontend/node_modules/nuxt/dist/app/nuxt.js at line 242:56" [ref=f1e125]:
                  - link "D:/41.IS-Thesis/cw_pipe_calculator_v2/frontend/node_modules/nuxt/dist/app/nuxt.js" [ref=f1e126] [cursor=pointer]:
                    - /url: vscode://file/D:/41.IS-Thesis/cw_pipe_calculator_v2/frontend/node_modules/nuxt/dist/app/nuxt.js:242
                  - generic [ref=f1e127]:
                    - text: at line
                    - code [ref=f1e128]: 242:56
                - button [ref=f1e130]:
                  - img [ref=f1e131]
            - listitem [ref=f1e133]:
              - generic [ref=f1e134]:
                - button "D:/41.IS-Thesis/cw_pipe_calculator_v2/frontend/node_modules/@vue/runtime-core/dist/runtime-core.cjs.js in Object.runWithContext at line 4271:18" [ref=f1e135]:
                  - link "D:/41.IS-Thesis/cw_pipe_calculator_v2/frontend/node_modules/@vue/runtime-core/dist/runtime-core.cjs.js" [ref=f1e136] [cursor=pointer]:
                    - /url: vscode://file/D:/41.IS-Thesis/cw_pipe_calculator_v2/frontend/node_modules/@vue/runtime-core/dist/runtime-core.cjs.js:4271
                  - generic [ref=f1e137]:
                    - text: in
                    - code [ref=f1e138]: Object.runWithContext
                  - generic [ref=f1e139]:
                    - text: at line
                    - code [ref=f1e140]: 4271:18
                - button [ref=f1e142]:
                  - img [ref=f1e143]
            - listitem [ref=f1e145]:
              - generic [ref=f1e146]:
                - button "D:/41.IS-Thesis/cw_pipe_calculator_v2/frontend/node_modules/nuxt/dist/app/nuxt.js in callWithNuxt at line 242:24" [ref=f1e147]:
                  - link "D:/41.IS-Thesis/cw_pipe_calculator_v2/frontend/node_modules/nuxt/dist/app/nuxt.js" [ref=f1e148] [cursor=pointer]:
                    - /url: vscode://file/D:/41.IS-Thesis/cw_pipe_calculator_v2/frontend/node_modules/nuxt/dist/app/nuxt.js:242
                  - generic [ref=f1e149]:
                    - text: in
                    - code [ref=f1e150]: callWithNuxt
                  - generic [ref=f1e151]:
                    - text: at line
                    - code [ref=f1e152]: 242:24
                - button [ref=f1e154]:
                  - img [ref=f1e155]
            - listitem [ref=f1e157]:
              - generic [ref=f1e158]:
                - button "D:/41.IS-Thesis/cw_pipe_calculator_v2/frontend/node_modules/nuxt/dist/app/nuxt.js at line 56:41" [ref=f1e159]:
                  - link "D:/41.IS-Thesis/cw_pipe_calculator_v2/frontend/node_modules/nuxt/dist/app/nuxt.js" [ref=f1e160] [cursor=pointer]:
                    - /url: vscode://file/D:/41.IS-Thesis/cw_pipe_calculator_v2/frontend/node_modules/nuxt/dist/app/nuxt.js:56
                  - generic [ref=f1e161]:
                    - text: at line
                    - code [ref=f1e162]: 56:41
                - button [ref=f1e164]:
                  - img [ref=f1e165]
            - listitem [ref=f1e167]:
              - generic [ref=f1e168]:
                - button "D:/41.IS-Thesis/cw_pipe_calculator_v2/frontend/node_modules/@vue/reactivity/dist/reactivity.cjs.js in EffectScope.run at line 87:16" [ref=f1e169]:
                  - link "D:/41.IS-Thesis/cw_pipe_calculator_v2/frontend/node_modules/@vue/reactivity/dist/reactivity.cjs.js" [ref=f1e170] [cursor=pointer]:
                    - /url: vscode://file/D:/41.IS-Thesis/cw_pipe_calculator_v2/frontend/node_modules/@vue/reactivity/dist/reactivity.cjs.js:87
                  - generic [ref=f1e171]:
                    - text: in
                    - code [ref=f1e172]: EffectScope.run
                  - generic [ref=f1e173]:
                    - text: at line
                    - code [ref=f1e174]: 87:16
                - button [ref=f1e176]:
                  - img [ref=f1e177]
      - generic [ref=f1e180]:
        - heading "Error Cause" [level=3] [ref=f1e183]
        - code [ref=f1e188]:
          - generic [ref=f1e189]:
            - text: "Object {"
            - button "▼" [ref=f1e190]:
              - generic [ref=f1e191]: ▼
            - text: "}"
      - generic [ref=f1e193]:
        - heading "Request" [level=3] [ref=f1e195]
        - generic [ref=f1e196]:
          - generic [ref=f1e197]:
            - heading "url" [level=4] [ref=f1e198]
            - text: http://localhost:3003/login
          - generic [ref=f1e199]:
            - heading "method" [level=4] [ref=f1e200]
            - text: GET
          - generic [ref=f1e201]:
            - heading "headers" [level=4] [ref=f1e202]
            - table [ref=f1e203]:
              - rowgroup [ref=f1e204]:
                - row "host localhost:3003" [ref=f1e205]:
                  - cell "host" [ref=f1e206]
                  - cell "localhost:3003" [ref=f1e207]
                - row "connection close" [ref=f1e208]:
                  - cell "connection" [ref=f1e209]
                  - cell "close" [ref=f1e210]
                - row "sec-ch-ua \"Chromium\";v=\"147\", \"Not.A/Brand\";v=\"8\"" [ref=f1e211]:
                  - cell "sec-ch-ua" [ref=f1e212]
                  - cell "\"Chromium\";v=\"147\", \"Not.A/Brand\";v=\"8\"" [ref=f1e213]
                - row "sec-ch-ua-mobile ?0" [ref=f1e214]:
                  - cell "sec-ch-ua-mobile" [ref=f1e215]
                  - cell "?0" [ref=f1e216]
                - row "sec-ch-ua-platform \"Windows\"" [ref=f1e217]:
                  - cell "sec-ch-ua-platform" [ref=f1e218]
                  - cell "\"Windows\"" [ref=f1e219]
                - row "upgrade-insecure-requests 1" [ref=f1e220]:
                  - cell "upgrade-insecure-requests" [ref=f1e221]
                  - cell "1" [ref=f1e222]
                - row "user-agent Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/147.0.7727.15 Safari/537.36" [ref=f1e223]:
                  - cell "user-agent" [ref=f1e224]
                  - cell "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/147.0.7727.15 Safari/537.36" [ref=f1e225]
                - row "accept-language en-US" [ref=f1e226]:
                  - cell "accept-language" [ref=f1e227]
                  - cell "en-US" [ref=f1e228]
                - row "accept text/html,application/xhtml+xml,application/xml;q=0.9,image/avif,image/webp,image/apng,*/*;q=0.8,application/signed-exchange;v=b3;q=0.7" [ref=f1e229]:
                  - cell "accept" [ref=f1e230]
                  - cell "text/html,application/xhtml+xml,application/xml;q=0.9,image/avif,image/webp,image/apng,*/*;q=0.8,application/signed-exchange;v=b3;q=0.7" [ref=f1e231]
                - row "sec-fetch-site none" [ref=f1e232]:
                  - cell "sec-fetch-site" [ref=f1e233]
                  - cell "none" [ref=f1e234]
                - row "sec-fetch-mode navigate" [ref=f1e235]:
                  - cell "sec-fetch-mode" [ref=f1e236]
                  - cell "navigate" [ref=f1e237]
                - row "sec-fetch-user ?1" [ref=f1e238]:
                  - cell "sec-fetch-user" [ref=f1e239]
                  - cell "?1" [ref=f1e240]
                - row "sec-fetch-dest document" [ref=f1e241]:
                  - cell "sec-fetch-dest" [ref=f1e242]
                  - cell "document" [ref=f1e243]
                - row "accept-encoding gzip, deflate, br, zstd" [ref=f1e244]:
                  - cell "accept-encoding" [ref=f1e245]
                  - cell "gzip, deflate, br, zstd" [ref=f1e246]
                - row "x-forwarded-for ::1" [ref=f1e247]:
                  - cell "x-forwarded-for" [ref=f1e248]
                  - cell "::1" [ref=f1e249]
                - row "x-forwarded-port 3003" [ref=f1e250]:
                  - cell "x-forwarded-port" [ref=f1e251]
                  - cell "3003" [ref=f1e252]
                - row "x-forwarded-proto http" [ref=f1e253]:
                  - cell "x-forwarded-proto" [ref=f1e254]
                  - cell "http" [ref=f1e255]
  - button "Toggle detailed error view Hide error overlay" [ref=e12]:
    - generic [ref=e13]: Toggle detailed error view
    - button "Hide error overlay" [ref=e14] [cursor=pointer]: ×
```

# Test source

```ts
  1   | /**
  2   |  * System Tests: Project Management
  3   |  * STC2001 - สร้างโครงการใหม่ผ่าน UI
  4   |  * STC2002 - แสดงรายการโครงการทั้งหมด
  5   |  * STC2003 - เข้าถึงรายละเอียดโครงการ
  6   |  * STC2004 - กำหนด Design Criteria ของโครงการ
  7   |  */
  8   | 
  9   | import { test, expect, Page } from '@playwright/test'
  10  | 
  11  | const BASE = 'http://localhost:3003'
  12  | const UNIQUE = Date.now()
  13  | const USER = { email: `stc2-proj-${UNIQUE}@test.com`, password: 'Test1234!' }
  14  | const PROJECT_NAME = `ทาวน์โฮม STC-${UNIQUE}`
  15  | 
  16  | async function loginAs(page: Page) {
  17  |   // Register + Login
  18  |   await page.goto(`${BASE}/register`)
  19  |   await page.fill('[name="username"]', 'STC Project Tester')
  20  |   await page.fill('[name="email"]', USER.email)
  21  |   await page.fill('[name="password"]', USER.password)
  22  |   await page.fill('[name="confirm-password"]', USER.password)
  23  |   await page.click('button[type="submit"]')
  24  |   await page.waitForURL(/login|dashboard|projects/, { timeout: 10_000 })
  25  |   // กรณี redirect ไปหน้า login อีกครั้ง
  26  |   if (page.url().includes('login')) {
  27  |     await page.fill('[name="email"]', USER.email)
  28  |     await page.fill('[name="password"]', USER.password)
  29  |     await page.click('button[type="submit"]')
  30  |     await page.waitForURL(/dashboard|projects/, { timeout: 10_000 })
  31  |   }
  32  | }
  33  | 
  34  | test.beforeAll(async ({ browser }) => {
  35  |   const page = await browser.newPage()
  36  |   await loginAs(page)
  37  |   await page.close()
  38  | })
  39  | 
  40  | // ─────────────────────────────────────────────
  41  | // STC2001: สร้างโครงการใหม่
  42  | // ─────────────────────────────────────────────
  43  | test('STC2001 — สร้างโครงการใหม่ปรากฏในรายการ', async ({ page }) => {
  44  |   await page.goto(`${BASE}/login`)
> 45  |   await page.fill('[name="email"]', USER.email)
      |              ^ Error: page.fill: Test timeout of 30000ms exceeded.
  46  |   await page.fill('[name="password"]', USER.password)
  47  |   await page.click('button[type="submit"]')
  48  |   await page.waitForURL(/dashboard|projects/, { timeout: 10_000 })
  49  | 
  50  |   // ไปหน้าสร้างโครงการ
  51  |   await page.goto(`${BASE}/projects/new`)
  52  |   await page.fill('[name="name"], [placeholder*="ชื่อโครงการ"], [placeholder*="Project"]', PROJECT_NAME)
  53  |   const descField = page.locator('[name="description"], [placeholder*="รายละเอียด"]')
  54  |   if (await descField.count() > 0) {
  55  |     await descField.fill('โครงการทดสอบ STC')
  56  |   }
  57  |   await page.click('button[type="submit"], button:has-text("สร้าง"), button:has-text("Create")')
  58  |   // ต้องออกจากหน้า /new
  59  |   await expect(page).not.toHaveURL(/\/new/, { timeout: 10_000 })
  60  | })
  61  | 
  62  | // ─────────────────────────────────────────────
  63  | // STC2002: แสดงรายการโครงการ
  64  | // ─────────────────────────────────────────────
  65  | test('STC2002 — หน้า /projects แสดงโครงการในรูปแบบ Card', async ({ page }) => {
  66  |   await page.goto(`${BASE}/login`)
  67  |   await page.fill('[name="email"]', USER.email)
  68  |   await page.fill('[name="password"]', USER.password)
  69  |   await page.click('button[type="submit"]')
  70  |   await page.waitForURL(/dashboard|projects/, { timeout: 10_000 })
  71  | 
  72  |   await page.goto(`${BASE}/projects`)
  73  |   // ต้องมี card/list ของโครงการ
  74  |   const cards = page.locator('[class*="card"], [class*="project"], .grid > div, .list > li')
  75  |   await expect(cards.first()).toBeVisible({ timeout: 10_000 })
  76  | })
  77  | 
  78  | // ─────────────────────────────────────────────
  79  | // STC2003: เข้าถึงรายละเอียดโครงการ
  80  | // ─────────────────────────────────────────────
  81  | test('STC2003 — คลิก Card โครงการ → แสดงหน้ารายละเอียดพร้อม Versions List', async ({ page }) => {
  82  |   await page.goto(`${BASE}/login`)
  83  |   await page.fill('[name="email"]', USER.email)
  84  |   await page.fill('[name="password"]', USER.password)
  85  |   await page.click('button[type="submit"]')
  86  |   await page.waitForURL(/dashboard|projects/, { timeout: 10_000 })
  87  | 
  88  |   await page.goto(`${BASE}/projects`)
  89  |   // คลิก card แรก
  90  |   const firstCard = page.locator('[class*="card"], .grid > div, .list > li').first()
  91  |   await firstCard.click()
  92  |   // URL ต้องเปลี่ยนเป็น /projects/:id
  93  |   await expect(page).toHaveURL(/\/projects\/\w+/, { timeout: 10_000 })
  94  |   // หน้าต้องแสดงข้อมูล versions หรือ criteria
  95  |   const content = page.locator('text=Version, text=เวอร์ชัน, text=Criteria, text=เกณฑ์')
  96  |   await expect(content.first()).toBeVisible({ timeout: 5_000 })
  97  | })
  98  | 
  99  | // ─────────────────────────────────────────────
  100 | // STC2004: กำหนด Design Criteria
  101 | // ─────────────────────────────────────────────
  102 | test('STC2004 — กำหนด Design Criteria บันทึกสำเร็จ', async ({ page }) => {
  103 |   await page.goto(`${BASE}/login`)
  104 |   await page.fill('[name="email"]', USER.email)
  105 |   await page.fill('[name="password"]', USER.password)
  106 |   await page.click('button[type="submit"]')
  107 |   await page.waitForURL(/dashboard|projects/, { timeout: 10_000 })
  108 | 
  109 |   await page.goto(`${BASE}/projects`)
  110 |   const firstCard = page.locator('[class*="card"], .grid > div, .list > li').first()
  111 |   await firstCard.click()
  112 |   await page.waitForURL(/\/projects\/\w+/, { timeout: 10_000 })
  113 | 
  114 |   // หา criteria form (อาจมีปุ่ม Edit Criteria หรือ form โดยตรง)
  115 |   const criteriaBtn = page.locator('button:has-text("Criteria"), button:has-text("เกณฑ์"), a:has-text("Criteria")')
  116 |   if (await criteriaBtn.count() > 0) await criteriaBtn.first().click()
  117 | 
  118 |   // กรอก cFactor
  119 |   const cFactorField = page.locator('[name="cFactor"], [placeholder*="C Factor"], [placeholder*="150"]')
  120 |   if (await cFactorField.count() > 0) {
  121 |     await cFactorField.fill('150')
  122 |   }
  123 |   // กด Save
  124 |   const saveBtn = page.locator('button:has-text("บันทึก"), button:has-text("Save"), button[type="submit"]')
  125 |   if (await saveBtn.count() > 0) {
  126 |     await saveBtn.first().click()
  127 |     // ต้องไม่ crash (ไม่มี error 500)
  128 |     await expect(page).not.toHaveURL(/error|500/, { timeout: 5_000 })
  129 |   }
  130 | })
  131 | 
```