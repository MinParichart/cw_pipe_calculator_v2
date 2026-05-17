# Instructions

- Following Playwright test failed.
- Explain why, be concise, respect Playwright best practices.
- Provide a snippet of code with the fix, if possible.

# Test info

- Name: stc6-fixtures.spec.ts >> STC6 — Fixtures Setup >> STC6001 — เปิดหน้า Fixtures Setup แสดงรายการ Nodes
- Location: frontend\tests\e2e\stc6-fixtures.spec.ts:70:3

# Error details

```
"beforeAll" hook timeout of 30000ms exceeded.
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
        - link "STC Fixtures Tester" [ref=e16] [cursor=pointer]:
          - /url: /profile
          - img [ref=e17]
          - generic [ref=e19]: STC Fixtures Tester
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
      - generic [ref=e52]: SF
      - generic [ref=e53]:
        - paragraph [ref=e54]: STC Fixtures Tester
        - paragraph [ref=e55]: stc6-fix-1779033403025@test.com
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
        - generic [ref=e73]:
          - generic [ref=e74]: รายละเอียด (ไม่บังคับ)
          - textbox "รายละเอียด (ไม่บังคับ)" [ref=e75]:
            - /placeholder: ระบุรายละเอียดเพิ่มเติมเกี่ยวกับโปรเจกต์...
        - generic [ref=e76]:
          - generic [ref=e77]: ประเภทอาคาร *
          - generic [ref=e78]:
            - generic [ref=e79] [cursor=pointer]:
              - radio "ที่พักอาศัย" [checked] [ref=e80]
              - generic [ref=e81]:
                - img [ref=e82]
                - generic [ref=e84]: ที่พักอาศัย
            - generic [ref=e85] [cursor=pointer]:
              - radio "สำนักงาน (ยังไม่รองรับ)" [disabled] [ref=e86]
              - generic [ref=e87]:
                - img [ref=e88]
                - generic [ref=e90]:
                  - text: สำนักงาน
                  - generic [ref=e91]: (ยังไม่รองรับ)
            - generic [ref=e92] [cursor=pointer]:
              - radio "โรงพยาบาล (ยังไม่รองรับ)" [disabled] [ref=e93]
              - generic [ref=e94]:
                - img [ref=e95]
                - generic [ref=e97]:
                  - text: โรงพยาบาล
                  - generic [ref=e98]: (ยังไม่รองรับ)
            - generic [ref=e99] [cursor=pointer]:
              - radio "โรงเรียน (ยังไม่รองรับ)" [disabled] [ref=e100]
              - generic [ref=e101]:
                - img [ref=e102]
                - generic [ref=e104]:
                  - text: โรงเรียน
                  - generic [ref=e105]: (ยังไม่รองรับ)
            - generic [ref=e106] [cursor=pointer]:
              - radio "โรงแรม (ยังไม่รองรับ)" [disabled] [ref=e107]
              - generic [ref=e108]:
                - img [ref=e109]
                - generic [ref=e111]:
                  - text: โรงแรม
                  - generic [ref=e112]: (ยังไม่รองรับ)
        - generic [ref=e113]:
          - generic [ref=e114]: จำนวนชั้น *
          - textbox "จำนวนชั้น *" [ref=e115]:
            - /placeholder: "1"
            - text: "1"
          - paragraph [ref=e116]: ระบบรองรับสูงสุด 2 ชั้น
        - generic [ref=e117]:
          - heading "เกณฑ์การออกแบบ" [level=3] [ref=e118]
          - paragraph [ref=e119]: ตั้งค่าพารามิเตอร์สำหรับการคำนวณขนาดท่อน้ำดี
        - generic [ref=e120]:
          - generic [ref=e121]: ชั้นคุณภาพท่อ PVC (PVC Class) *
          - combobox "ชั้นคุณภาพท่อ PVC (PVC Class) *" [ref=e122]:
            - option "PVC 5 (5 bar)"
            - option "PVC 7 (7 bar)" [selected]
            - option "PVC 8.5 (8.5 bar)"
            - option "PVC 10.5 (10.5 bar)"
            - option "PVC 13.5 (13.5 bar)"
          - generic [ref=e123]:
            - generic [ref=e124]:
              - img [ref=e125]
              - generic [ref=e127]:
                - strong [ref=e128]: "PVC Class:"
                - text: 7 bar
            - paragraph [ref=e129]: ท่อ PVC ชั้นคุณภาพ 7 (ความดัน 7 bar)
        - generic [ref=e130]:
          - generic [ref=e131]: Minor Loss Factor *
          - generic [ref=e132]:
            - spinbutton "Minor Loss Factor *" [ref=e133]: "15"
            - generic [ref=e134]: "%"
          - paragraph [ref=e135]: "ค่าน้ำหนักที่เสียจากข้องอ ตัวแยก วาล์ว ฯลฯ (แนะนำ: 30%)"
        - generic [ref=e136]:
          - generic [ref=e137]:
            - generic [ref=e138]: โหมดการคำนวณ Curve
            - generic [ref=e139]:
              - textbox [disabled] [ref=e140]: Hunter's Curve
              - generic [ref=e141]: 🔒 ล็อค
            - paragraph [ref=e142]: มาตรฐาน Hunter's Curve สำหรับระบบท่อน้ำดี
          - generic [ref=e143]:
            - generic [ref=e144]: ชนิดท่อ (C-Factor)
            - generic [ref=e145]:
              - textbox [disabled] [ref=e146]: PVC (150)
              - generic [ref=e147]: 🔒 ล็อค
            - paragraph [ref=e148]: ค่า C-Factor สำหรับคำนวณความสูญเสียดัน (Hazen-Williams)
          - generic [ref=e150]:
            - img [ref=e151]
            - generic [ref=e153]:
              - heading "Critical Endpoint" [level=4] [ref=e154]
              - paragraph [ref=e155]: ระบบจะระบุจุดวิกฤต (จุดที่มีความดันต่ำสุด) โดยอัตโนมัติจาก Network Diagram
        - generic [ref=e156]:
          - button "ยกเลิก" [ref=e157] [cursor=pointer]
          - button "สร้างโปรเจกต์" [ref=e158] [cursor=pointer]
```

# Test source

```ts
  1   | /**
  2   |  * System Tests: Fixtures Setup
  3   |  * STC6001 - เปิดหน้า Fixtures Setup → แสดงรายการ Nodes
  4   |  * STC6002 - กำหนด Fixture ให้ Node → แสดงค่า FU รวม
  5   |  * STC6003 - กำหนด Fixture หลายประเภทให้ Node เดียวกัน → FU รวมถูกต้อง
  6   |  * STC6004 - บันทึก Fixtures สำเร็จ
  7   |  */
  8   | 
  9   | import { test, expect, Page } from '@playwright/test'
  10  | 
  11  | const BASE = 'http://localhost:3003'
  12  | const UNIQUE = Date.now()
  13  | const USER = { email: `stc6-fix-${UNIQUE}@test.com`, password: 'Test1234!' }
  14  | 
  15  | let fixturesUrl = ''
  16  | 
  17  | async function setupUser(page: Page) {
  18  |   await page.goto(`${BASE}/register`)
  19  |   await page.fill('[name="username"]', 'STC Fixtures Tester')
  20  |   await page.fill('[name="email"]', USER.email)
  21  |   await page.fill('[name="password"]', USER.password)
  22  |   await page.fill('[name="confirm-password"]', USER.password)
  23  |   await page.click('button[type="submit"]')
  24  |   await page.waitForURL(/login|dashboard|projects/, { timeout: 10_000 })
  25  |   if (page.url().includes('login')) {
  26  |     await page.fill('[name="email"]', USER.email)
  27  |     await page.fill('[name="password"]', USER.password)
  28  |     await page.click('button[type="submit"]')
  29  |     await page.waitForURL(/dashboard|projects/, { timeout: 10_000 })
  30  |   }
  31  |   await page.goto(`${BASE}/projects/new`)
  32  |   await page.fill('[name="username"]', `STC6 Project ${UNIQUE}`)
  33  |   await page.click('button[type="submit"], button:has-text("สร้าง")')
  34  |   await page.waitForURL(/\/projects\/\w+/, { timeout: 10_000 })
  35  | 
  36  |   // สร้าง version + ไปหน้า fixtures
  37  |   const newVerBtn = page.locator('button:has-text("สร้างเวอร์ชัน"), button:has-text("New Version")')
  38  |   if (await newVerBtn.count() > 0) {
  39  |     await newVerBtn.first().click()
  40  |     await page.locator('[name="name"], [placeholder*="Version"]').first().fill('Version 1')
  41  |     await page.click('button[type="submit"], button:has-text("สร้าง")')
  42  |     await page.waitForTimeout(1_000)
  43  |   }
  44  | 
  45  |   const fixLink = page.locator('a:has-text("Fixtures"), a:has-text("อุปกรณ์"), a[href*="fixtures"]')
  46  |   if (await fixLink.count() > 0) {
  47  |     await fixLink.first().click()
  48  |     await page.waitForURL(/\/fixtures/, { timeout: 10_000 })
  49  |     fixturesUrl = page.url()
  50  |   }
  51  | }
  52  | 
  53  | test.describe('STC6 — Fixtures Setup', () => {
> 54  |   test.beforeAll(async ({ browser }) => {
      |        ^ "beforeAll" hook timeout of 30000ms exceeded.
  55  |     const page = await browser.newPage()
  56  |     await setupUser(page)
  57  |     await page.close()
  58  |   })
  59  | 
  60  |   async function gotoFixtures(page: Page) {
  61  |     await page.goto(`${BASE}/login`)
  62  |     await page.fill('[name="email"]', USER.email)
  63  |     await page.fill('[name="password"]', USER.password)
  64  |     await page.click('button[type="submit"]')
  65  |     await page.waitForURL(/dashboard|projects/, { timeout: 10_000 })
  66  |     if (fixturesUrl) await page.goto(fixturesUrl)
  67  |   }
  68  | 
  69  |   // STC6001
  70  |   test('STC6001 — เปิดหน้า Fixtures Setup แสดงรายการ Nodes', async ({ page }) => {
  71  |     await gotoFixtures(page)
  72  |     if (fixturesUrl) await expect(page).toHaveURL(/\/fixtures/, { timeout: 10_000 })
  73  |     // ต้องไม่ crash
  74  |     await expect(page).not.toHaveURL(/error|500/)
  75  |   })
  76  | 
  77  |   // STC6002
  78  |   test('STC6002 — กำหนด Lavatory 2 ตัว → FU รวม = 2', async ({ page }) => {
  79  |     await gotoFixtures(page)
  80  |     // หา dropdown เลือกประเภท fixture
  81  |     const fixtureSelect = page.locator('select[name*="type"], [class*="fixture-type"]')
  82  |     if (await fixtureSelect.count() > 0) {
  83  |       await fixtureSelect.first().selectOption({ label: /Lavatory|ก๊อกน้ำ/ })
  84  |       // ใส่จำนวน
  85  |       const qtyInput = page.locator('input[name*="qty"], input[name*="quantity"], input[type="number"]')
  86  |       if (await qtyInput.count() > 0) {
  87  |         await qtyInput.first().fill('2')
  88  |         // FU ควรอัปเดต = 2 × 1 = 2
  89  |         const fuDisplay = page.locator('[class*="fu"], text=FU, [data-fu]')
  90  |         if (await fuDisplay.count() > 0) {
  91  |           await expect(fuDisplay.first()).toContainText('2')
  92  |         }
  93  |       }
  94  |     } else {
  95  |       test.skip(true, 'ยังไม่มี fixture form ใน UI')
  96  |     }
  97  |   })
  98  | 
  99  |   // STC6003
  100 |   test('STC6003 — Lavatory×2 + WC_TANK×1 → FU = (2×1)+(1×3) = 5', async ({ page }) => {
  101 |     await gotoFixtures(page)
  102 |     // ถ้า UI รองรับหลาย fixture per node
  103 |     const addFixBtn = page.locator('button:has-text("เพิ่ม"), button:has-text("Add Fixture")')
  104 |     if (await addFixBtn.count() > 0) {
  105 |       // เพิ่ม Lavatory ×2
  106 |       await addFixBtn.first().click()
  107 |       const types = page.locator('select[name*="type"]')
  108 |       if (await types.count() > 0) await types.last().selectOption({ label: /Lavatory/ })
  109 |       const qtys = page.locator('input[type="number"]')
  110 |       if (await qtys.count() > 0) await qtys.last().fill('2')
  111 |       // เพิ่ม WC_TANK ×1
  112 |       await addFixBtn.first().click()
  113 |       if (await types.count() > 1) await types.last().selectOption({ label: /WC|Flush Tank/ })
  114 |       if (await qtys.count() > 1) await qtys.last().fill('1')
  115 |       // FU รวม = 5
  116 |       const totalFU = page.locator('[class*="total-fu"], text=5 FU, [data-testid="total-fu"]')
  117 |       if (await totalFU.count() > 0) await expect(totalFU.first()).toContainText('5')
  118 |     } else {
  119 |       test.skip(true, 'UI ไม่รองรับ multi-fixture per node')
  120 |     }
  121 |   })
  122 | 
  123 |   // STC6004
  124 |   test('STC6004 — กด "บันทึก Fixtures" → บันทึกสำเร็จไม่มี error', async ({ page }) => {
  125 |     await gotoFixtures(page)
  126 |     const saveBtn = page.locator('button:has-text("บันทึก"), button:has-text("Save")')
  127 |     if (await saveBtn.count() > 0) {
  128 |       await saveBtn.first().click()
  129 |       await page.waitForTimeout(1_500)
  130 |       const errMsg = page.locator('[class*="error"], .text-red-500')
  131 |       expect(await errMsg.count()).toBe(0)
  132 |     } else {
  133 |       test.skip(true, 'ไม่พบปุ่ม Save ใน Fixtures UI')
  134 |     }
  135 |   })
  136 | })
  137 | 
```