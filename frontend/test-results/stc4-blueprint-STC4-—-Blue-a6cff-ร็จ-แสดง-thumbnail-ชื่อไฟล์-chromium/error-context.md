# Instructions

- Following Playwright test failed.
- Explain why, be concise, respect Playwright best practices.
- Provide a snippet of code with the fix, if possible.

# Test info

- Name: stc4-blueprint.spec.ts >> STC4 — Blueprint Upload >> STC4001 — อัปโหลด .jpg สำเร็จ แสดง thumbnail/ชื่อไฟล์
- Location: frontend\tests\e2e\stc4-blueprint.spec.ts:80:3

# Error details

```
TimeoutError: page.waitForURL: Timeout 10000ms exceeded.
=========================== logs ===========================
waiting for navigation until "load"
============================================================
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
        - link "STC Blueprint Tester" [ref=e16] [cursor=pointer]:
          - /url: /profile
          - img [ref=e17]
          - generic [ref=e19]: STC Blueprint Tester
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
      - generic [ref=e52]: SB
      - generic [ref=e53]:
        - paragraph [ref=e54]: STC Blueprint Tester
        - paragraph [ref=e55]: stc4-bp-1779017099081@test.com
      - link "ตั้งค่าโปรไฟล์" [ref=e56] [cursor=pointer]:
        - /url: /profile
        - img [ref=e57]
  - main [ref=e60]:
    - generic [ref=e62]:
      - generic [ref=e63]:
        - button "ย้อนกลับ" [ref=e64] [cursor=pointer]:
          - img [ref=e65]
          - text: ย้อนกลับ
        - heading "สร้างโปรเจกต์ใหม่" [level=1] [ref=e67]
      - generic [ref=e69]:
        - generic [ref=e70]:
          - generic [ref=e71]: ชื่อโปรเจกต์ *
          - textbox "ชื่อโปรเจกต์ *" [ref=e72]:
            - /placeholder: เช่น บ้านพักอาศัย 2 ชั้น
          - paragraph [ref=e73]: กรุณากรอกชื่อโปรเจกต์
        - generic [ref=e74]:
          - generic [ref=e75]: รายละเอียด (ไม่บังคับ)
          - textbox "รายละเอียด (ไม่บังคับ)" [ref=e76]:
            - /placeholder: ระบุรายละเอียดเพิ่มเติมเกี่ยวกับโปรเจกต์...
        - generic [ref=e77]:
          - generic [ref=e78]: ประเภทอาคาร *
          - generic [ref=e79]:
            - generic [ref=e80] [cursor=pointer]:
              - radio "ที่พักอาศัย" [checked] [ref=e81]
              - generic [ref=e82]:
                - img [ref=e83]
                - generic [ref=e85]: ที่พักอาศัย
            - generic [ref=e86] [cursor=pointer]:
              - radio "สำนักงาน (ยังไม่รองรับ)" [disabled] [ref=e87]
              - generic [ref=e88]:
                - img [ref=e89]
                - generic [ref=e91]:
                  - text: สำนักงาน
                  - generic [ref=e92]: (ยังไม่รองรับ)
            - generic [ref=e93] [cursor=pointer]:
              - radio "โรงพยาบาล (ยังไม่รองรับ)" [disabled] [ref=e94]
              - generic [ref=e95]:
                - img [ref=e96]
                - generic [ref=e98]:
                  - text: โรงพยาบาล
                  - generic [ref=e99]: (ยังไม่รองรับ)
            - generic [ref=e100] [cursor=pointer]:
              - radio "โรงเรียน (ยังไม่รองรับ)" [disabled] [ref=e101]
              - generic [ref=e102]:
                - img [ref=e103]
                - generic [ref=e105]:
                  - text: โรงเรียน
                  - generic [ref=e106]: (ยังไม่รองรับ)
            - generic [ref=e107] [cursor=pointer]:
              - radio "โรงแรม (ยังไม่รองรับ)" [disabled] [ref=e108]
              - generic [ref=e109]:
                - img [ref=e110]
                - generic [ref=e112]:
                  - text: โรงแรม
                  - generic [ref=e113]: (ยังไม่รองรับ)
        - generic [ref=e114]:
          - generic [ref=e115]: จำนวนชั้น *
          - textbox "จำนวนชั้น *" [ref=e116]:
            - /placeholder: "1"
            - text: "1"
          - paragraph [ref=e117]: ระบบรองรับสูงสุด 2 ชั้น
        - generic [ref=e118]:
          - heading "เกณฑ์การออกแบบ" [level=3] [ref=e119]
          - paragraph [ref=e120]: ตั้งค่าพารามิเตอร์สำหรับการคำนวณขนาดท่อน้ำดี
        - generic [ref=e121]:
          - generic [ref=e122]: ชั้นคุณภาพท่อ PVC (PVC Class) *
          - combobox "ชั้นคุณภาพท่อ PVC (PVC Class) *" [ref=e123]:
            - option "PVC 5 (5 bar)"
            - option "PVC 7 (7 bar)" [selected]
            - option "PVC 8.5 (8.5 bar)"
            - option "PVC 10.5 (10.5 bar)"
            - option "PVC 13.5 (13.5 bar)"
          - generic [ref=e124]:
            - generic [ref=e125]:
              - img [ref=e126]
              - generic [ref=e128]:
                - strong [ref=e129]: "PVC Class:"
                - text: 7 bar
            - paragraph [ref=e130]: ท่อ PVC ชั้นคุณภาพ 7 (ความดัน 7 bar)
        - generic [ref=e131]:
          - generic [ref=e132]: Minor Loss Factor *
          - generic [ref=e133]:
            - spinbutton "Minor Loss Factor *" [ref=e134]: "15"
            - generic [ref=e135]: "%"
          - paragraph [ref=e136]: "ค่าน้ำหนักที่เสียจากข้องอ ตัวแยก วาล์ว ฯลฯ (แนะนำ: 30%)"
        - generic [ref=e137]:
          - generic [ref=e138]:
            - generic [ref=e139]: โหมดการคำนวณ Curve
            - generic [ref=e140]:
              - textbox [disabled] [ref=e141]: Hunter's Curve
              - generic [ref=e142]: 🔒 ล็อค
            - paragraph [ref=e143]: มาตรฐาน Hunter's Curve สำหรับระบบท่อน้ำดี
          - generic [ref=e144]:
            - generic [ref=e145]: ชนิดท่อ (C-Factor)
            - generic [ref=e146]:
              - textbox [disabled] [ref=e147]: PVC (150)
              - generic [ref=e148]: 🔒 ล็อค
            - paragraph [ref=e149]: ค่า C-Factor สำหรับคำนวณความสูญเสียดัน (Hazen-Williams)
          - generic [ref=e151]:
            - img [ref=e152]
            - generic [ref=e154]:
              - heading "Critical Endpoint" [level=4] [ref=e155]
              - paragraph [ref=e156]: ระบบจะระบุจุดวิกฤต (จุดที่มีความดันต่ำสุด) โดยอัตโนมัติจาก Network Diagram
        - generic [ref=e157]:
          - button "ยกเลิก" [ref=e158] [cursor=pointer]
          - button "สร้างโปรเจกต์" [active] [ref=e159] [cursor=pointer]
```

# Test source

```ts
  1   | /**
  2   |  * System Tests: Blueprint Upload
  3   |  * STC4001 - อัปโหลด Blueprint รูปภาพ (.jpg/.png) สำเร็จ
  4   |  * STC4002 - อัปโหลดไฟล์ที่ไม่รองรับ (.pdf/.dxf) → แสดง error
  5   |  */
  6   | 
  7   | import { test, expect, Page } from '@playwright/test'
  8   | import path from 'path'
  9   | import fs from 'fs'
  10  | import os from 'os'
  11  | 
  12  | const BASE = 'http://localhost:3003'
  13  | const UNIQUE = Date.now()
  14  | const USER = { email: `stc4-bp-${UNIQUE}@test.com`, password: 'Test1234!' }
  15  | 
  16  | let projectUrl = ''
  17  | 
  18  | /** สร้าง minimal JPEG file ชั่วคราว */
  19  | function createTempJpeg(): string {
  20  |   const jpegBytes = Buffer.from([
  21  |     0xFF, 0xD8, 0xFF, 0xE0, 0x00, 0x10, 0x4A, 0x46, 0x49, 0x46,
  22  |     0x00, 0x01, 0x01, 0x00, 0x00, 0x01, 0x00, 0x01, 0x00, 0x00,
  23  |     0xFF, 0xDA, 0x00, 0x08, 0x01, 0x01, 0x00, 0x00, 0x3F, 0x00,
  24  |     0xFB, 0xFF, 0xD9,
  25  |   ])
  26  |   const tmpPath = path.join(os.tmpdir(), `test_blueprint_${UNIQUE}.jpg`)
  27  |   fs.writeFileSync(tmpPath, jpegBytes)
  28  |   return tmpPath
  29  | }
  30  | 
  31  | /** สร้าง minimal PDF file ชั่วคราว */
  32  | function createTempPdf(): string {
  33  |   const pdfBytes = Buffer.from('%PDF-1.4 fake pdf content for test')
  34  |   const tmpPath = path.join(os.tmpdir(), `test_report_${UNIQUE}.pdf`)
  35  |   fs.writeFileSync(tmpPath, pdfBytes)
  36  |   return tmpPath
  37  | }
  38  | 
  39  | async function setupUser(page: Page) {
  40  |   await page.goto(`${BASE}/register`)
  41  |   await page.fill('[name="username"]', 'STC Blueprint Tester')
  42  |   await page.fill('[name="email"]', USER.email)
  43  |   await page.fill('[name="password"]', USER.password)
  44  |   await page.fill('[name="confirm-password"]', USER.password)
  45  |   await page.click('button[type="submit"]')
  46  |   await page.waitForURL(/login|dashboard|projects/, { timeout: 10_000 })
  47  |   if (page.url().includes('login')) {
  48  |     await page.fill('[name="email"]', USER.email)
  49  |     await page.fill('[name="password"]', USER.password)
  50  |     await page.click('button[type="submit"]')
  51  |     await page.waitForURL(/dashboard|projects/, { timeout: 10_000 })
  52  |   }
  53  |   await page.goto(`${BASE}/projects/new`)
  54  |   await page.fill('#name', `โครงการ STC4 ${UNIQUE}`)
  55  |   await page.click('button[type="submit"], button:has-text("สร้าง")')
> 56  |   await page.waitForURL(/\/projects\/\d+/, { timeout: 10_000 })
      |              ^ TimeoutError: page.waitForURL: Timeout 10000ms exceeded.
  57  |   projectUrl = page.url()
  58  | }
  59  | 
  60  | test.describe('STC4 — Blueprint Upload', () => {
  61  |   test.beforeAll(async ({ browser }) => {
  62  |     const page = await browser.newPage()
  63  |     await setupUser(page)
  64  |     await page.close()
  65  |   })
  66  | 
  67  |   async function gotoDocumentsPage(page: Page) {
  68  |     await page.goto(`${BASE}/login`)
  69  |     await page.fill('[name="email"]', USER.email)
  70  |     await page.fill('[name="password"]', USER.password)
  71  |     await page.click('button[type="submit"]')
  72  |     await page.waitForURL(/dashboard|projects/, { timeout: 10_000 })
  73  |     // ไปหน้า documents/blueprint ของ project
  74  |     await page.goto(projectUrl)
  75  |     const docLink = page.locator('a:has-text("Blueprint"), a:has-text("Documents"), a:has-text("แบบแปลน")')
  76  |     if (await docLink.count() > 0) await docLink.first().click()
  77  |   }
  78  | 
  79  |   // STC4001: อัปโหลดรูปภาพ
  80  |   test('STC4001 — อัปโหลด .jpg สำเร็จ แสดง thumbnail/ชื่อไฟล์', async ({ page }) => {
  81  |     await gotoDocumentsPage(page)
  82  |     const jpegPath = createTempJpeg()
  83  | 
  84  |     // หา input file
  85  |     const fileInput = page.locator('input[type="file"]')
  86  |     if (await fileInput.count() > 0) {
  87  |       await fileInput.setInputFiles(jpegPath)
  88  |       // กด Upload (ถ้ามีปุ่ม)
  89  |       const uploadBtn = page.locator('button:has-text("อัปโหลด"), button:has-text("Upload")')
  90  |       if (await uploadBtn.count() > 0) await uploadBtn.first().click()
  91  |       // ต้องไม่มี error message
  92  |       const errMsg = page.locator('[class*="error"], .text-red-500, [role="alert"]')
  93  |       await page.waitForTimeout(2_000)
  94  |       const hasError = await errMsg.count() > 0 && await errMsg.first().isVisible()
  95  |       expect(hasError).toBe(false)
  96  |     } else {
  97  |       test.skip(true, 'ไม่พบ file input ใน UI')
  98  |     }
  99  |     fs.unlinkSync(jpegPath)
  100 |   })
  101 | 
  102 |   // STC4002: อัปโหลดไฟล์ไม่รองรับ
  103 |   test('STC4002 — อัปโหลด .pdf → แสดง error "รองรับเฉพาะ JPEG/PNG/GIF"', async ({ page }) => {
  104 |     await gotoDocumentsPage(page)
  105 |     const pdfPath = createTempPdf()
  106 | 
  107 |     const fileInput = page.locator('input[type="file"]')
  108 |     if (await fileInput.count() > 0) {
  109 |       await fileInput.setInputFiles(pdfPath)
  110 |       const uploadBtn = page.locator('button:has-text("อัปโหลด"), button:has-text("Upload")')
  111 |       if (await uploadBtn.count() > 0) await uploadBtn.first().click()
  112 |       // ต้องมี error message
  113 |       await page.waitForTimeout(2_000)
  114 |       const errMsg = page.locator('[class*="error"], .text-red-500, [role="alert"], text=รูปภาพ, text=image, text=JPEG')
  115 |       await expect(errMsg.first()).toBeVisible({ timeout: 5_000 })
  116 |     } else {
  117 |       test.skip(true, 'ไม่พบ file input ใน UI')
  118 |     }
  119 |     fs.unlinkSync(pdfPath)
  120 |   })
  121 | })
  122 | 
```