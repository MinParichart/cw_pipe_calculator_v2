# Demo Walkthrough - บ้านลาดพร้าว 2 ชั้น

## 🎯 วัตถุประสงค์
เดินทางไปทีละ step เพื่อทดสอบการทำงานของระบบคำนวณท่อน้ำดีทั้งหมด 10 workflow steps

---

## 📋 ก่อนเริ่มต้น

### เตรียมความพร้อม:
1. **รัน script สร้าง demo project**
   ```bash
   npm run create-demo
   ```
   หรือ
   ```bash
   DEMO_USER_ID=1 npx ts-node backend/src/scripts/createDemoProject.ts
   ```

2. **Login เข้าสู่ระบบ**

3. **เปิด project "บ้านลาดพร้าว 2 ชั้น"**

---

## 🚶 10 Workflow Steps

### **Step 1: Parameters** 📝
**Path**: `/projects/[id]`

**สิ่งที่ควรเห็น:**
- ✅ ชื่อโปรเจกต์: "บ้านลาดพร้าว 2 ชั้น"
- ✅ คำอธิบาย: "บ้านพักอาศัย 2 ชั้น พื้นที่ 120 ตร.ม. มี 4 ห้องน้ำ..."
- ✅ Design Criteria:
  - Velocity Min: 1.2 m/s
  - Velocity Max: 2.4 m/s
  - C-Factor: 150 (PVC)
  - System Type: Flush Tank
  - Building Type: Apartment
  - Static Head: 3.5 m
  - Residual Pressure: 0.35 bar

**ทดสอบ:**
- [ ] แก้ไข criteria ได้
- [ ] บันทึกสำเร็จ

---

### **Step 2: Documents** 📄
**Path**: `/projects/[id]/documents`

**สิ่งที่ควรเห็น:**
- ✅ Blueprint Upload section (ถ้ามี)
- ✅ Pipe Specs Catalog
  - ตารางขนาดท่อ PVC, Copper, Steel, CPVC, PEX
  - Filters และ Search ใช้งานได้

**ทดสอบ:**
- [ ] เปิด Pipe Specs Catalog ได้
- [ ] ค้นหาข้อมูลท่อได้
- [ ] Export to CSV ได้

---

### **Step 3: Network** 🕸️
**Path**: `/projects/[id]/network`

**สิ่งที่ควรเห็น:**
- ✅ NetworkBuilder (vue-flow canvas)
- ✅ Nodes ทั้งหมด:
  - Source: "Water Source (ปั๊ม)"
  - Junctions: Riser 1F, Riser 2F, J1, J2
  - Fixtures: ห้องน้ำ 1-4, ครัว, ห้องซักล้าง
- ✅ Pipes เชื่อม nodes
- ✅ ข้อมูลแต่ละ node (label, elevation, fixtures)
- ✅ ข้อมูลแต่ละ pipe (length, size, material)

**ทดสอบ:**
- [ ] Zoom in/out ได้
- [ ] Drag nodes ได้
- [ ] Click node → ดูรายละเอียดได้
- [ ] Click pipe → ดูรายละเอียดได้
- [ ] กด "Find Critical Path" → Highlight pipes สีแดง

**Critical Path ที่คาดหวัง:**
```
Water Source → Riser 1F → Riser 2F → J2 → ห้องน้ำ 3 (2F)
```

---

### **Step 4: Fixtures** 🚽
**Path**: `/projects/[id]/fixtures`

**สิ่งที่ควรเห็น:**
- ✅ Fixture Catalog (ตาราง FU values)
- ✅ รายการ fixtures ทั้งหมดแยกตาม nodes
- ✅ FU Summary ต่อ node
- ✅ Total FU ทั้งโปรเจกต์

**ทดสอบ:**
- [ ] เห็น fixtures ครบตาม nodes
- [ ] FU values ถูกต้อง:
  - WC (Flush tank): 3 FU
  - Lavatory: 1 FU
  - Shower: 2 FU
  - Bathtub: 2 FU
  - Kitchen Sink: 2 FU
  - Dishwasher: 1 FU
  - Laundry 7kg: 4 FU

**Expected Total FU:**
- Version 1: 26 FU (3 ห้องน้ำ)
- Version 2: 34 FU (4 ห้องน้ำ)

---

### **Step 5: Calculation** 🧮
**Path**: `/projects/[id]/calculation`

**สิ่งที่ควรเห็น:**
- ✅ Water Demand Calculation
  - FU → GPM (Hunter's Curve)
  - GPM → LPS → m³/s
- ✅ Auto Suggest Upsizing
  - ตารางวิเคราะห์ velocity, friction loss
  - สถานะ: OK (เขียว), WARNING (เหลือง), CRITICAL (แดง)
  - ปุ่ม Apply, Apply All
- ✅ Hybrid Pipe Sizing
  - เปรียบเทียบ Table 2.6 vs Hazen-Williams
  - แนะนำขนาดท่อ

**ทดสอบ:**
- [ ] FU → Flow คำนวณถูกต้อง
- [ ] Auto Suggest วิเคราะห์ได้
- [ ] Hybrid Sizing เปรียบเทียบได้
- [ ] กด Apply → อัปเดตขนาดท่อ

**ค่าที่คาดหวัง (Version 2 - 34 FU):**
- Flow Rate: ~17 GPM (~1.07 LPS)
- Critical Path Length: ~10.5 m

---

### **Step 6: Results** 📊
**Path**: `/projects/[id]/results`

**สิ่งที่ควรเห็น:**
- ✅ Result Display component
- ✅ Quick Summary:
  - Total FU
  - Total Flow Rate
  - Total Head Loss
  - TDH (Total Dynamic Head)
- ✅ Calculation Steps (16 ขั้นตอน)

**ทดสอบ:**
- [ ] สรุปผลลัพธ์ถูกต้อง
- [ ] TDH คำนวณถูกต้อง

**ค่าที่คาดหวัง (Version 2):**
- Total FU: 34
- Flow Rate: ~17 GPM
- TDH: ~9.2 m.wg

---

### **Step 7: Hydraulic** 💧
**Path**: `/projects/[id]/hydraulic`

**สิ่งที่ควรเห็น:**
- ✅ Velocity Check (1.2 - 2.4 m/s)
- ✅ Friction Loss Check
- ✅ Static Head Check
- ✅ Residual Pressure Check

**ทดสอบ:**
- [ ] Velocity อยู่ในช่วงที่เหมาะสม
- [ ] Friction loss ไม่เกินกำหนด
- [ ] สรุปสถานะ: PASS/WARNING/FAIL

---

### **Step 8: Suggestion** 💡
**Path**: `/projects/[id]/suggestion`

**สิ่งที่ควรเห็น:**
- ✅ Auto Suggest Upsizing (ซ้ำกับ Step 5)
- ✅ ปุ่ม Apply Suggestion
- ✅ ปุ่ม Apply All

**ทดสอบ:**
- [ ] แนะนำขนาดท่อที่เหมาะสม
- [ ] กด Apply → อัปเดตขนาดท่อ
- [ ] กด Apply All → อัปเดตทั้งหมด

---

### **Step 9: Versions** 📚
**Path**: `/projects/[id]/versions`

**สิ่งที่ควรเห็น:**
- ✅ Version History (2 versions)
  1. Version 1: "Initial Design"
  2. Version 2: "Modified Design"
- ✅ Version List:
  - Version Number
  - Name
  - Description
  - Created At
  - Is Current
- ✅ Action Buttons:
  - Duplicate
  - Delete
  - Compare
  - Restore

**ทดสอบ:**
- [ ] เห็น 2 versions
- [ ] Version 2 เป็น Current
- [ ] Duplicate version → สร้าง version ใหม่
- [ ] Delete version → ลบ version
- [ ] **Compare 2 versions → ดูความต่าง** ⭐
- [ ] Restore version → คืนค่า version เก่า

**ดูรายละเอียด Compare Versions ที่:**
📄 **[DEMO_COMPARE_VERSIONS.md](./DEMO_COMPARE_VERSIONS.md)**

---

### **Step 10: Audit** 📋
**Path**: `/projects/[id]/audit`

**สิ่งที่ควรเห็น:**
- ✅ Audit Log Table
  - ใครทำอะไร
  - เมื่อไหร่
  - Action อะไร
  - ผลลัพธ์
- ✅ Filters:
  - Action (CREATE, UPDATE, DELETE, SAVE_VERSION, etc.)
  - Entity (project, network, node, pipe, fixture, version)
  - Date Range
- ✅ Search
- ✅ Summary Stats
- ✅ Export to CSV

**ทดสอบ:**
- [ ] แสดง audit logs ทั้งหมด
- [ ] Filter ตาม Action ได้
- [ ] Filter ตาม Entity ได้
- [ ] Search ได้
- [ ] Export CSV ได้

**Audit Logs ที่ควรเห็น:**
- CREATE project
- CREATE network (2 networks)
- CREATE version (2 versions)
- CREATE nodes (10 nodes)
- CREATE pipes (9-10 pipes)

---

## ✅ สรุปการทดสอบ

หลังจากเดินทางครบทั้ง 10 steps ควร:

- ✅ ทุกฟีเจอร์ทำงานได้
- ✅ คำนวณถูกต้อง
- ✅ Workflow ลื่นไหล
- ✅ UI/UX ใช้งานง่าย

**ถ้าพบปัญหา:**
1. บันทึกลงใน `DEMO_CHECKLIST.md`
2. ระบุ step ที่มีปัญหา
3. ระบุสิ่งที่คาดหวัง vs ความจริง
4. แนบ screenshot (ถ้าจำเป็น)

---

*สร้างเมื่อ: 2026-03-31*
