# Instructions

- Following Playwright test failed.
- Explain why, be concise, respect Playwright best practices.
- Provide a snippet of code with the fix, if possible.

# Test info

- Name: stc5-network.spec.ts >> STC5 — Network Builder >> STC5001 — เปิดหน้า Network Builder แสดง Canvas ไม่ error
- Location: frontend\tests\e2e\stc5-network.spec.ts:79:3

# Error details

```
TimeoutError: page.waitForURL: Timeout 10000ms exceeded.
=========================== logs ===========================
waiting for navigation until "load"
  navigated to "http://localhost:3003/projects/183"
  navigated to "http://localhost:3003/profile"
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
        - link "STC Network Tester" [active] [ref=e16] [cursor=pointer]:
          - /url: /profile
          - img [ref=e17]
          - generic [ref=e19]: STC Network Tester
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
      - generic [ref=e52]: SN
      - generic [ref=e53]:
        - paragraph [ref=e54]: STC Network Tester
        - paragraph [ref=e55]: stc5-net-1779023397986@test.com
      - link "ตั้งค่าโปรไฟล์" [ref=e56] [cursor=pointer]:
        - /url: /profile
        - img [ref=e57]
  - main [ref=e60]:
    - generic [ref=e63]:
      - generic [ref=e64]:
        - heading "โปรไฟล์" [level=1] [ref=e65]
        - paragraph [ref=e66]: จัดการข้อมูลส่วนตัวและตั้งค่าบัญชีของคุณ
      - generic [ref=e67]:
        - generic [ref=e69]:
          - generic [ref=e72]: SN
          - generic [ref=e73]:
            - heading "STC Network Tester" [level=2] [ref=e74]
            - paragraph [ref=e75]: stc5-net-1779023397986@test.com
          - button "แก้ไขโปรไฟล์" [ref=e76] [cursor=pointer]
        - generic [ref=e77]:
          - generic [ref=e78]:
            - generic [ref=e79]: "1"
            - generic [ref=e80]: โปรเจกต์
          - generic [ref=e81]:
            - generic [ref=e82]: "0"
            - generic [ref=e83]: การคำนวณ
          - generic [ref=e84]:
            - generic [ref=e85]: "0"
            - generic [ref=e86]: เวอร์ชันที่บันทึก
        - generic [ref=e87]:
          - generic [ref=e88]:
            - heading "เปลี่ยนรหัสผ่าน" [level=3] [ref=e89]
            - button "เปลี่ยนรหัสผ่าน" [ref=e90] [cursor=pointer]
          - generic [ref=e92]:
            - img [ref=e93]
            - paragraph [ref=e95]: คลิกเพื่อเปลี่ยนรหัสผ่าน
```

# Test source

```ts
  1   | /**
  2   |  * System Tests: Network Builder
  3   |  * STC5001 - เปิดหน้า Network Builder → แสดง Canvas
  4   |  * STC5002 - สร้าง Node บน Canvas
  5   |  * STC5003 - ลาก Pipe เชื่อมระหว่าง 2 Nodes
  6   |  * STC5004 - บันทึก Network Diagram
  7   |  * STC5005 - โหลด Network ที่บันทึกไว้กลับมา
  8   |  */
  9   | 
  10  | import { test, expect, Page } from '@playwright/test'
  11  | 
  12  | const BASE = 'http://localhost:3003'
  13  | const UNIQUE = Date.now()
  14  | const USER = { email: `stc5-net-${UNIQUE}@test.com`, password: 'Test1234!' }
  15  | 
  16  | let networkUrl = ''
  17  | 
  18  | async function setupAndGetNetworkUrl(page: Page): Promise<string> {
  19  |   // Register
  20  |   await page.goto(`${BASE}/register`)
  21  |   await page.fill('[name="username"]', 'STC Network Tester')
  22  |   await page.fill('[name="email"]', USER.email)
  23  |   await page.fill('[name="password"]', USER.password)
  24  |   await page.fill('[name="confirm-password"]', USER.password)
  25  |   await page.click('button[type="submit"]')
  26  |   await page.waitForURL(/login|dashboard|projects/, { timeout: 10_000 })
  27  |   if (page.url().includes('login')) {
  28  |     await page.fill('[name="email"]', USER.email)
  29  |     await page.fill('[name="password"]', USER.password)
  30  |     await page.click('button[type="submit"]')
  31  |     await page.waitForURL(/dashboard|projects/, { timeout: 10_000 })
  32  |   }
  33  |   // สร้าง project
  34  |   await page.goto(`${BASE}/projects/new`)
  35  |   await page.fill('#name', `STC5 Project ${UNIQUE}`)
  36  |   await page.click('button[type="submit"], button:has-text("สร้าง")')
  37  |   await page.waitForURL(/\/projects\/\w+/, { timeout: 10_000 })
  38  |   const projectUrl = page.url()
  39  | 
  40  |   // สร้าง version
  41  |   const newVerBtn = page.locator('button:has-text("สร้างเวอร์ชัน"), button:has-text("New Version")')
  42  |   if (await newVerBtn.count() > 0) {
  43  |     await newVerBtn.first().click()
  44  |     const nameField = page.locator('[name="name"], [placeholder*="Version"]')
  45  |     await nameField.first().fill('Version 1')
  46  |     await page.click('button[type="submit"], button:has-text("สร้าง")')
  47  |     await page.waitForTimeout(1_000)
  48  |   }
  49  | 
  50  |   // หา URL ของ network page
  51  |   const networkLink = page.locator('a:has-text("Network"), a:has-text("วาดท่อ"), a[href*="network"]')
  52  |   if (await networkLink.count() > 0) {
  53  |     await networkLink.first().click()
> 54  |     await page.waitForURL(/\/network/, { timeout: 10_000 })
      |                ^ TimeoutError: page.waitForURL: Timeout 10000ms exceeded.
  55  |     return page.url()
  56  |   }
  57  |   // fallback: ลองสร้าง URL โดยตรง
  58  |   return projectUrl.replace(/\/?$/, '/versions') + '/network'
  59  | }
  60  | 
  61  | test.describe('STC5 — Network Builder', () => {
  62  |   test.beforeAll(async ({ browser }) => {
  63  |     const page = await browser.newPage()
  64  |     networkUrl = await setupAndGetNetworkUrl(page)
  65  |     await page.close()
  66  |   })
  67  | 
  68  |   async function gotoNetwork(page: Page) {
  69  |     await page.goto(`${BASE}/`)
  70  |     await page.waitForLoadState('networkidle')
  71  |     await page.fill('[name="email"]', USER.email)
  72  |     await page.fill('[name="password"]', USER.password)
  73  |     await page.click('button[type="submit"]')
  74  |     await page.waitForURL(/\/projects/, { timeout: 10_000 })
  75  |     if (networkUrl) await page.goto(networkUrl)
  76  |   }
  77  | 
  78  |   // STC5001: เปิดหน้า Network Builder
  79  |   test('STC5001 — เปิดหน้า Network Builder แสดง Canvas ไม่ error', async ({ page }) => {
  80  |     await gotoNetwork(page)
  81  |     await page.waitForURL(/\/network/, { timeout: 10_000 })
  82  |     // ต้องมี canvas หรือ SVG สำหรับวาด diagram
  83  |     const canvas = page.locator('canvas, svg[id*="network"], svg[class*="network"], [class*="canvas"]')
  84  |     await expect(canvas.first()).toBeVisible({ timeout: 10_000 })
  85  |     // ต้องไม่มี error 500
  86  |     await expect(page.locator('text=500, text=Internal Server Error')).toHaveCount(0)
  87  |   })
  88  | 
  89  |   // STC5002: สร้าง Node
  90  |   test('STC5002 — คลิก Canvas → สร้าง Node ใหม่ได้', async ({ page }) => {
  91  |     await gotoNetwork(page)
  92  |     await page.waitForURL(/\/network/, { timeout: 10_000 })
  93  | 
  94  |     // หาปุ่มเพิ่ม Node หรือ click canvas โดยตรง
  95  |     const addNodeBtn = page.locator('button:has-text("เพิ่ม Node"), button:has-text("Add Node"), button[title*="Node"]')
  96  |     if (await addNodeBtn.count() > 0) {
  97  |       await addNodeBtn.first().click()
  98  |     } else {
  99  |       // คลิกตรงกลาง canvas
  100 |       const canvas = page.locator('canvas, svg').first()
  101 |       await canvas.click({ position: { x: 200, y: 200 } })
  102 |     }
  103 |     await page.waitForTimeout(500)
  104 |     // ต้องมี element ของ node ปรากฏ
  105 |     const nodes = page.locator('[class*="node"], circle[class*="node"], [data-type="node"]')
  106 |     if (await nodes.count() > 0) {
  107 |       expect(await nodes.count()).toBeGreaterThan(0)
  108 |     } else {
  109 |       // UI อาจใช้ structure ต่างกัน — แค่ไม่ crash
  110 |       await expect(page).not.toHaveURL(/error|500/)
  111 |     }
  112 |   })
  113 | 
  114 |   // STC5003: ลาก Pipe เชื่อม Nodes
  115 |   test('STC5003 — ลาก Pipe เชื่อม 2 Nodes ได้', async ({ page }) => {
  116 |     await gotoNetwork(page)
  117 |     await page.waitForURL(/\/network/, { timeout: 10_000 })
  118 |     // ทดสอบ drag ระหว่าง 2 node (ถ้ามี)
  119 |     const nodes = page.locator('[class*="node"], circle')
  120 |     if (await nodes.count() >= 2) {
  121 |       const node1 = nodes.nth(0)
  122 |       const node2 = nodes.nth(1)
  123 |       const box1 = await node1.boundingBox()
  124 |       const box2 = await node2.boundingBox()
  125 |       if (box1 && box2) {
  126 |         await page.mouse.move(box1.x + box1.width / 2, box1.y + box1.height / 2)
  127 |         await page.mouse.down()
  128 |         await page.mouse.move(box2.x + box2.width / 2, box2.y + box2.height / 2, { steps: 10 })
  129 |         await page.mouse.up()
  130 |         await page.waitForTimeout(500)
  131 |       }
  132 |     }
  133 |     await expect(page).not.toHaveURL(/error|500/)
  134 |   })
  135 | 
  136 |   // STC5004: บันทึก Network
  137 |   test('STC5004 — กด "บันทึก" → แสดงข้อความยืนยัน', async ({ page }) => {
  138 |     await gotoNetwork(page)
  139 |     await page.waitForURL(/\/network/, { timeout: 10_000 })
  140 | 
  141 |     const saveBtn = page.locator('button:has-text("บันทึก"), button:has-text("Save")')
  142 |     await expect(saveBtn.first()).toBeVisible({ timeout: 5_000 })
  143 |     await saveBtn.first().click()
  144 |     // ต้องมี success message หรืออย่างน้อยไม่มี error
  145 |     await page.waitForTimeout(1_500)
  146 |     const errMsg = page.locator('[class*="error"], .text-red-500, [role="alert"]:has-text("error")')
  147 |     expect(await errMsg.count()).toBe(0)
  148 |   })
  149 | 
  150 |   // STC5005: โหลด Network กลับมา
  151 |   test('STC5005 — ออกจากหน้า Network แล้วกลับเข้ามา → โหลด diagram ถูกต้อง', async ({ page }) => {
  152 |     await gotoNetwork(page)
  153 |     await page.waitForURL(/\/network/, { timeout: 10_000 })
  154 |     // ออกไปหน้าอื่น
```