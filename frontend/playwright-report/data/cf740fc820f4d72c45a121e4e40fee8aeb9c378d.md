# Instructions

- Following Playwright test failed.
- Explain why, be concise, respect Playwright best practices.
- Provide a snippet of code with the fix, if possible.

# Test info

- Name: stc3-version.spec.ts >> STC3 — Version Management >> STC3002 — รายการ Versions แสดง versionNumber และชื่อ
- Location: tests\e2e\stc3-version.spec.ts:95:3

# Error details

```
Error: expect(locator).toContainText(expected) failed

Locator: locator('.version-card').first().locator('div.rounded-full').first()
Expected substring: "1"
Received string:    "2"
Timeout: 5000ms

Call log:
  - Expect "toContainText" with timeout 5000ms
  - waiting for locator('.version-card').first().locator('div.rounded-full').first()
    9 × locator resolved to <div class="flex items-center justify-center w-10 h-10 rounded-full bg-gradient-to-br from-blue-500 to-green-500 text-white font-bold shadow-md">2</div>
      - unexpected value "2"

```

# Page snapshot

```yaml
- generic [ref=e4]:
  - navigation [ref=e5]:
    - generic [ref=e6]:
      - generic [ref=e7]:
        - button "เปิด/ปิดเมนู" [ref=e8] [cursor=pointer]:
          - img [ref=e9]
        - generic [ref=e11]:
          - img [ref=e12]
          - generic [ref=e14]: CW Pipe Calculator
      - generic [ref=e15]:
        - link "STC3Tester" [ref=e16] [cursor=pointer]:
          - /url: /profile
          - img [ref=e17]
          - generic [ref=e19]: STC3Tester
        - button "ออกจากระบบ" [ref=e20] [cursor=pointer]:
          - img [ref=e21]
          - generic [ref=e23]: ออกจากระบบ
  - generic [ref=e24]:
    - generic [ref=e26]:
      - img [ref=e27]
      - generic [ref=e29]: CW Pipe Calc
    - generic [ref=e30]:
      - generic [ref=e32]:
        - generic [ref=e33]:
          - img [ref=e34]
          - button "โปรเจกต์ []" [ref=e36] [cursor=pointer]
        - generic [ref=e37]:
          - link "+new" [ref=e38] [cursor=pointer]:
            - /url: /projects/new
          - button [ref=e39] [cursor=pointer]:
            - img [ref=e40]
      - generic [ref=e42]:
        - paragraph [ref=e43]: เครื่องมือ
        - navigation [ref=e44]:
          - link "ตารางอ้างอิง" [ref=e45] [cursor=pointer]:
            - /url: /reference
            - img [ref=e46]
            - generic [ref=e48]: ตารางอ้างอิง
    - generic [ref=e50]:
      - generic [ref=e52]: S
      - generic [ref=e53]:
        - paragraph [ref=e54]: STC3Tester
        - paragraph [ref=e55]: stc3-ver-1779037934137@test.com
      - link "ตั้งค่าโปรไฟล์" [ref=e56] [cursor=pointer]:
        - /url: /profile
        - img [ref=e57]
  - main [ref=e60]:
    - generic [ref=e64]:
      - generic [ref=e65]:
        - button "ย้อนกลับ" [ref=e66] [cursor=pointer]:
          - img [ref=e67]
          - text: ย้อนกลับ
        - generic [ref=e69]:
          - heading "STC3 Project 1779037934137" [level=1] [ref=e70]
          - paragraph
      - generic [ref=e72]:
        - generic [ref=e73]:
          - generic [ref=e74]:
            - img [ref=e76]
            - generic [ref=e78]:
              - heading "Versions" [level=2] [ref=e79]
              - paragraph [ref=e80]: 2 versions
          - button "Create Version" [ref=e81] [cursor=pointer]:
            - img [ref=e82]
            - text: Create Version
        - generic [ref=e84]:
          - generic [ref=e85]:
            - generic [ref=e87]:
              - generic [ref=e88]:
                - generic [ref=e89]: "2"
                - heading "Version 1 - แบบร่างแรก" [level=3] [ref=e91]
              - generic [ref=e92]:
                - generic [ref=e93]: ✓ Current
                - button "แก้ยชื่อ Version" [ref=e94] [cursor=pointer]:
                  - img [ref=e95]
            - generic [ref=e97]:
              - paragraph [ref=e98]: ไม่มีรายละเอียด
              - generic [ref=e99]:
                - generic [ref=e100]:
                  - img [ref=e101]
                  - generic [ref=e103]: "Created: Just now"
                - generic [ref=e104]:
                  - img [ref=e105]
                  - generic [ref=e107]: "Updated: Just now"
              - generic [ref=e109]: ยังไม่มีข้อมูล
            - generic [ref=e110]:
              - 'button "Step 2: Documents →" [ref=e111] [cursor=pointer]'
              - button "คัดลอก Version" [ref=e112] [cursor=pointer]:
                - img [ref=e113]
              - button "ดู Audit Log" [ref=e115] [cursor=pointer]:
                - img [ref=e116]
              - button "ลบ Version" [ref=e118] [cursor=pointer]:
                - img [ref=e119]
          - generic [ref=e121]:
            - generic [ref=e123]:
              - generic [ref=e124]:
                - generic [ref=e125]: "1"
                - heading "Version 1 - Setup" [level=3] [ref=e127]
              - button "แก้ยชื่อ Version" [ref=e129] [cursor=pointer]:
                - img [ref=e130]
            - generic [ref=e132]:
              - paragraph [ref=e133]: ไม่มีรายละเอียด
              - generic [ref=e134]:
                - generic [ref=e135]:
                  - img [ref=e136]
                  - generic [ref=e138]: "Created: Just now"
                - generic [ref=e139]:
                  - img [ref=e140]
                  - generic [ref=e142]: "Updated: Just now"
              - generic [ref=e144]: ยังไม่มีข้อมูล
            - generic [ref=e145]:
              - 'button "Step 2: Documents →" [ref=e146] [cursor=pointer]'
              - button "คัดลอก Version" [ref=e147] [cursor=pointer]:
                - img [ref=e148]
              - button "ดู Audit Log" [ref=e150] [cursor=pointer]:
                - img [ref=e151]
              - button "ลบ Version" [ref=e153] [cursor=pointer]:
                - img [ref=e154]
      - generic [ref=e156]:
        - generic [ref=e159]:
          - img [ref=e161]
          - generic [ref=e163]:
            - heading "ข้อมูลโปรเจกต์และเกณฑ์การออกแบบ" [level=3] [ref=e164]
            - paragraph [ref=e165]: Project Information & Design Criteria
        - generic [ref=e167]:
          - generic [ref=e168]:
            - generic [ref=e169]:
              - heading "1 รายละเอียดโปรเจกต์" [level=4] [ref=e170]:
                - generic [ref=e171]: "1"
                - text: รายละเอียดโปรเจกต์
              - button "แก้ไข" [ref=e172] [cursor=pointer]:
                - img [ref=e173]
                - text: แก้ไข
            - generic [ref=e175]:
              - generic [ref=e177]:
                - img [ref=e178]
                - heading "Project Details" [level=5] [ref=e180]
              - generic [ref=e181]:
                - generic [ref=e182]:
                  - generic [ref=e183]: ชื่อโปรเจกต์
                  - paragraph [ref=e184]: STC3 Project 1779037934137
                - generic [ref=e185]:
                  - generic [ref=e186]: รายละเอียด
                  - paragraph [ref=e187]: "-"
                - generic [ref=e188]:
                  - generic [ref=e189]:
                    - generic [ref=e190]: ประเภทอาคาร
                    - paragraph [ref=e191]: อาคารพักอาศัย/คอนโด
                  - generic [ref=e192]:
                    - generic [ref=e193]: จำนวนชั้น
                    - paragraph [ref=e194]: 1 ชั้น
          - generic [ref=e195]:
            - generic [ref=e196]:
              - heading "2 เกณฑ์การออกแบบ" [level=4] [ref=e197]:
                - generic [ref=e198]: "2"
                - text: เกณฑ์การออกแบบ
              - button "แก้ไข" [ref=e199] [cursor=pointer]:
                - img [ref=e200]
                - text: แก้ไข
            - generic [ref=e202]:
              - generic [ref=e203]:
                - generic [ref=e205]:
                  - img [ref=e206]
                  - heading "Velocity Ranges" [level=5] [ref=e208]
                - generic [ref=e209]:
                  - generic [ref=e210]:
                    - generic [ref=e211]:
                      - generic [ref=e212]: ❌
                      - generic [ref=e213]: Critical
                      - generic [ref=e214]: < 0.6
                    - generic [ref=e215]:
                      - generic [ref=e216]: ⚠️
                      - generic [ref=e217]: Warning
                      - generic [ref=e218]: 0.6-1.2
                    - generic [ref=e219]:
                      - generic [ref=e220]: ✅
                      - generic [ref=e221]: OK
                      - generic [ref=e222]: 1.2-2.4
                  - generic [ref=e223]:
                    - generic [ref=e224]:
                      - generic [ref=e225]: ⚠️
                      - generic [ref=e226]: Warning
                      - generic [ref=e227]: 2.4-3
                    - generic [ref=e228]:
                      - generic [ref=e229]: ❌
                      - generic [ref=e230]: Critical
                      - generic [ref=e231]: "> 3"
              - generic [ref=e232]:
                - generic [ref=e234]:
                  - img [ref=e235]
                  - heading "Calculation Settings" [level=5] [ref=e237]
                - generic [ref=e239]:
                  - generic [ref=e240]:
                    - generic [ref=e241]: Curve
                    - text: Hunter's
                  - generic [ref=e242]:
                    - generic [ref=e243]: C-Factor
                    - text: "150"
                  - generic [ref=e244]:
                    - generic [ref=e245]: PVC Class
                    - generic [ref=e246]: 7 bar
                  - generic [ref=e247]:
                    - generic [ref=e248]: Minor Loss
                    - text: 15%
      - generic [ref=e249]:
        - generic [ref=e250]:
          - heading "การจัดการ" [level=3] [ref=e251]
          - img [ref=e252]
        - generic [ref=e254]:
          - button "ย้อนกลับ" [ref=e255] [cursor=pointer]:
            - img [ref=e256]
            - generic [ref=e258]: ย้อนกลับ
          - button "เปรียบเทียบ Version" [ref=e259] [cursor=pointer]:
            - img [ref=e260]
            - text: เปรียบเทียบ Version
```

# Test source

```ts
  12  |  * - Submit version: button text "สร้างเวอร์ชัน"
  13  |  * - After created: redirect → /projects/:id/versions/:versionId/upload
  14  |  * - Version card class: "version-card"
  15  |  * - Duplicate button: title="คัดลอก Version" (icon only, no text)
  16  |  */
  17  | 
  18  | import { test, expect, Page } from '@playwright/test'
  19  | 
  20  | const BASE = 'http://localhost:3003'
  21  | const UNIQUE = Date.now()
  22  | const USER = { email: `stc3-ver-${UNIQUE}@test.com`, password: 'Test1234!' }
  23  | 
  24  | let projectUrl = ''
  25  | 
  26  | async function loginAndGoProject(page: Page) {
  27  |   await page.goto(`${BASE}/`)
  28  |   await page.waitForLoadState('networkidle')
  29  |   await page.fill('[name="email"]', USER.email)
  30  |   await page.fill('[name="password"]', USER.password)
  31  |   await page.click('button[type="submit"]')
  32  |   await page.waitForURL(/\/projects/, { timeout: 10_000 })
  33  |   await page.goto(projectUrl)
  34  |   await page.waitForLoadState('networkidle')
  35  | }
  36  | 
  37  | async function createVersion(page: Page, name: string) {
  38  |   // กด "Create Version" (มี versions อยู่แล้ว) หรือ "สร้าง Version แรก" (empty state)
  39  |   const btn = page.locator('button:has-text("Create Version"), button:has-text("สร้าง Version แรก")')
  40  |   await btn.first().click()
  41  |   // รอ modal เปิด
  42  |   await page.waitForSelector('#version-name', { state: 'visible', timeout: 5_000 })
  43  |   await page.fill('#version-name', name)
  44  |   await page.click('button:has-text("สร้างเวอร์ชัน")')
  45  |   // หลังสร้าง → redirect ไป /upload
  46  |   await page.waitForURL(/\/versions\/\d+\/upload/, { timeout: 10_000 })
  47  |   // กลับหน้า project
  48  |   await page.goto(projectUrl)
  49  |   await page.waitForLoadState('networkidle')
  50  | }
  51  | 
  52  | test.describe('STC3 — Version Management', () => {
  53  |   test.beforeAll(async ({ browser }) => {
  54  |     const page = await browser.newPage()
  55  | 
  56  |     // Register
  57  |     await page.goto(`${BASE}/register`)
  58  |     await page.waitForLoadState('networkidle')
  59  |     await page.fill('[name="username"]', 'STC3Tester')
  60  |     await page.fill('[name="email"]', USER.email)
  61  |     await page.fill('[name="password"]', USER.password)
  62  |     await page.fill('[name="confirm-password"]', USER.password)
  63  |     await page.click('button[type="submit"]')
  64  |     await page.waitForURL(/\/projects/, { timeout: 10_000 })
  65  | 
  66  |     // สร้าง project
  67  |     await page.goto(`${BASE}/projects/new`)
  68  |     await page.waitForLoadState('networkidle')
  69  |     await page.fill('#name', `STC3 Project ${UNIQUE}`)
  70  |     await page.fill('#floors', '1')
  71  |     await page.click('button[type="submit"]')
  72  |     await page.waitForURL(/\/projects\/\d+/, { timeout: 10_000 })
  73  |     projectUrl = page.url()
  74  | 
  75  |     // สร้าง Version 1 ไว้ก่อน — ให้ STC3002/3003/3004 มี version อยู่แล้ว
  76  |     await createVersion(page, 'Version 1 - Setup')
  77  | 
  78  |     await page.close()
  79  |   })
  80  | 
  81  |   // STC3001: สร้าง Version แรก
  82  |   test('STC3001 — สร้างเวอร์ชันแรก → ปรากฏในรายการ Versions', async ({ page }) => {
  83  |     await loginAndGoProject(page)
  84  | 
  85  |     await createVersion(page, 'Version 1 - แบบร่างแรก')
  86  | 
  87  |     // ต้องมี version-card ปรากฏ (รวม Version 1 - Setup จาก beforeAll ด้วย)
  88  |     await expect(page.locator('.version-card').first()).toBeVisible({ timeout: 10_000 })
  89  | 
  90  |     // ตรวจสอบว่ามี version ที่สร้างใน test นี้ ('Version 1 - แบบร่างแรก')
  91  |     await expect(page.locator('.version-card').filter({ hasText: /Version.*1.*แบบร่างแรก/ }).first()).toBeVisible({ timeout: 5_000 })
  92  |   })
  93  | 
  94  |   // STC3002: แสดงรายการ Versions พร้อม versionNumber
  95  |   test('STC3002 — รายการ Versions แสดง versionNumber และชื่อ', async ({ page }) => {
  96  |     await loginAndGoProject(page)
  97  | 
  98  |     // version-card แสดง versionNumber ในวงกลม และ name ใน h3
  99  |     await expect(page.locator('.version-card').first()).toBeVisible({ timeout: 10_000 })
  100 | 
  101 |     // versionNumber = 1 (แสดงใน div วงกลม) - ใช้ selector ที่ตรงกับที่สร้างใน beforeAll
  102 |     const firstCard = page.locator('.version-card').first()
  103 | 
  104 |     // ตรวจสอบว่ามี h3 แสดงชื่อ version (flexible matching)
  105 |     const h3Element = firstCard.locator('h3').first()
  106 |     await expect(h3Element).toBeVisible({ timeout: 5_000 })
  107 | 
  108 |     // ตรวจสอบ version number ในวงกลม (div ที่มี class rounded-full)
  109 |     // ใช้ div.rounded-full เพื่อไม่ match กับ span.rounded-full (Current badge)
  110 |     const versionNumberElement = firstCard.locator('div.rounded-full').first()
  111 |     await expect(versionNumberElement).toBeVisible()
> 112 |     await expect(versionNumberElement).toContainText('1')
      |                                        ^ Error: expect(locator).toContainText(expected) failed
  113 |   })
  114 | 
  115 |   // STC3003: Version 2 ไม่กระทบ Version 1
  116 |   test('STC3003 — สร้าง Version 2 แล้ว Version 1 ยังอยู่ครบ', async ({ page }) => {
  117 |     await loginAndGoProject(page)
  118 | 
  119 |     // นับ version cards ก่อนสร้าง Version 2
  120 |     const beforeCount = await page.locator('.version-card').count()
  121 | 
  122 |     await createVersion(page, 'Version 2 - แบบแก้ไข')
  123 | 
  124 |     // รอให้ version cards อัปเดต
  125 |     await page.waitForTimeout(2_000)
  126 | 
  127 |     // ตรวจสอบว่ามี version เพิ่มขึ้น
  128 |     const afterCount = await page.locator('.version-card').count()
  129 |     expect(afterCount).toBeGreaterThan(beforeCount)
  130 | 
  131 |     // Version 1 ต้องยังอยู่ในรายการ (ค้นหา 'Version 1' และ 'Setup')
  132 |     await expect(page.locator('.version-card').filter({ hasText: /Version.*1.*Setup/ }).first()).toBeVisible({ timeout: 10_000 })
  133 |     // Version 2 ต้องอยู่ด้วย (ค้นหา 'Version 2' และ 'แบบแก้ไข')
  134 |     await expect(page.locator('.version-card').filter({ hasText: /Version.*2.*แบบแก้ไข/ }).first()).toBeVisible({ timeout: 5_000 })
  135 |   })
  136 | 
  137 |   // STC3004: [v2] Duplicate Version
  138 |   test('STC3004 — Duplicate Version → version ใหม่ปรากฏในรายการ [v2]', async ({ page }) => {
  139 |     await loginAndGoProject(page)
  140 | 
  141 |     // รอให้ version cards โหลดเสร็จ
  142 |     await expect(page.locator('.version-card').first()).toBeVisible({ timeout: 10_000 })
  143 | 
  144 |     const beforeCount = await page.locator('.version-card').count()
  145 | 
  146 |     // Duplicate button: อยู่ใน version card ใช้ title="คัดลอก Version"
  147 |     const firstCard = page.locator('.version-card').first()
  148 |     const dupBtn = firstCard.locator('[title="คัดลอก Version"]')
  149 | 
  150 |     // ตรวจสอบว่ามีปุ่ม duplicate
  151 |     if (await dupBtn.count() > 0) {
  152 |       await dupBtn.click()
  153 | 
  154 |       // รอให้ API respond และ UI update
  155 |       await page.waitForTimeout(3_000)
  156 | 
  157 |       const afterCount = await page.locator('.version-card').count()
  158 |       expect(afterCount).toBeGreaterThan(beforeCount)
  159 | 
  160 |       // ตรวจสอบว่ามี "Copy" หรือ "คัดลอก" ในชื่อ version ใหม่
  161 |       const newCard = page.locator('.version-card').last()
  162 |       await expect(newCard).toBeVisible()
  163 |     } else {
  164 |       test.skip(true, 'ปุ่ม Duplicate ยังไม่มีใน UI')
  165 |     }
  166 |   })
  167 | })
  168 | 
```