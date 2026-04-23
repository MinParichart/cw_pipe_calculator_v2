# Demo Compare Versions - บ้านลาดพร้าว 2 ชั้น

## 🎯 วัตถุประสงค์
ทดสอบฟีเจอร์ **Compare Versions** เพื่อดูความต่างระหว่าง 2 versions ของโปรเจกต์

---

## 📚 Versions ที่จะเปรียบเทียบ

### **Version 1: Initial Design**
- **ชื่อ**: Initial Design
- **คำอธิบาย**: แบบเริ่มต้น: 3 ห้องน้ำ (2 ชั้น 1, 1 ชั้น 2)
- **วันที่สร้าง**: วันที่รัน script

### **Version 2: Modified Design**
- **ชื่อ**: Modified Design
- **คำอธิบาย**: แบบปรับปรุง: เพิ่ม 1 ห้องน้ำ (รวม 4 ห้องน้ำ) และปรับขนาดท่อ
- **วันที่สร้าง**: วันที่รัน script

---

## 🚀 ขั้นตอนการใช้งาน

### **Step 1: เปิดหน้า Versions**
1. Login เข้าสู่ระบบ
2. เปิด project "บ้านลาดพร้าว 2 ชั้น"
3. ไปที่ **Step 9: Versions**
   - Path: `/projects/[id]/versions`

### **Step 2: ดู Version History**
ควรเห็น:
- ✅ Version 1: Initial Design (v1)
- ✅ Version 2: Modified Design (v2) - เป็น Current
- ✅ Action buttons:
  - View / Edit
  - Duplicate
  - Delete
  - **Compare** ⭐

### **Step 3: เปรียบเทียบ 2 Versions**
1. เลือก **Version 1** ใน dropdown "Compare From"
2. เลือก **Version 2** ใน dropdown "Compare To"
3. กดปุ่ม **Compare**

---

## 📊 ความต่างที่คาดหวัง

### **1. Criteria Differences**

| พารามิเตอร์ | Version 1 | Version 2 | เปลี่ยนแปลง? |
|--------------|-----------|-----------|-------------|
| System Type | Flush Tank | Flush Tank | ❌ ไม่เปลี่ยน |
| Building Type | Apartment | Apartment | ❌ ไม่เปลี่ยน |
| C-Factor | 150 | 150 | ❌ ไม่เปลี่ยน |
| Static Head | 3.5 m | 3.5 m | �️ ไม่เปลี่ยน |
| Residual Pressure | 0.35 bar | 0.35 bar | ❌ ไม่เปลี่ยน |

**ผล**: ✅ **Criteria เหมือนกัน** (ไม่มีการเปลี่ยนแปลง)

---

### **2. Network Differences**

#### **Nodes**

| รายการ | Version 1 | Version 2 | เปลี่ยนแปลง |
|---------|-----------|-----------|-------------|
| จำนวน Nodes | 9 | 10 | ✅ +1 Node |
| Source | 1 | 1 | ❌ เท่ากัน |
| Junctions | 4 | 4 | ❌ เท่ากัน |
| Risers | 2 | 2 | ❌ เท่ากัน |
| Fixtures | 2 (1F) + 2 (2F) | 3 (1F) + 2 (2F) | ✅ +1 Fixture node (ห้องน้ำ 4) |

**Nodes ที่เพิ่มขึ้น:**
- ✅ **ห้องน้ำ 4 (1F)** - เพิ่มใหม่

#### **Pipes**

| รายการ | Version 1 | Version 2 | เปลี่ยนแปลง |
|---------|-----------|-----------|-------------|
| จำนวน Pipes | 9 | 10 | ✅ +1 Pipe |
| Main line size | 40mm (1½") | 50mm (2") | ✅ เพิ่มขนาด |
| Distribution size | 32mm (1¼") | 40mm (1½") | ✅ เพิ่มขนาด |
| Branch size | 25mm (1") | 32mm (1¼") | ✅ เพิ่มขนาด |

**Pipes ที่เพิ่ม/เปลี่ยน:**
- ✅ Pipe → ห้องน้ำ 4 (เพิ่มใหม่)
- ✅ Main line (ปรับขนาด 40mm → 50mm)
- ✅ Distribution lines (ปรับขนาด 32mm → 40mm)
- ✅ Branch lines (ปรับขนาด 25mm → 32mm)

---

### **3. Results Differences**

#### **Fixture Units (FU)**

| หมวด | Version 1 | Version 2 | เปลี่ยนแปลง |
|------|-----------|-----------|-------------|
| Total FU | 26 | 34 | ✅ +8 FU |
| ห้องน้ำ 1 (1F) | 6 FU | 6 FU | ❌ เท่ากัน |
| ครัว (1F) | 3 FU | 3 FU | �️ เท่ากัน |
| ห้องซักล้าง (1F) | 4 FU | 4 FU | ❌ เท่ากัน |
| **ห้องน้ำ 4 (1F)** | **-** | **4 FU** | ✅ **เพิ่มใหม่** |
| ห้องน้ำ 2 (2F) | 4 FU | 4 FU | ❌ เท่ากัน |
| ห้องน้ำ 3 (2F) | 6 FU | 6 FU | �️ เท่ากัน |
| **รวม** | **26 FU** | **34 FU** | ✅ **+8 FU (+31%)** |

#### **Flow Rate**

| รายการ | Version 1 | Version 2 | เปลี่ยนแปลง |
|---------|-----------|-----------|-------------|
| Flow Rate (GPM) | ~14.0 GPM | ~17.0 GPM | ✅ +3 GPM |
| Flow Rate (LPS) | ~0.883 LPS | ~1.073 LPS | ✅ +0.19 LPS |
| Flow Rate (m³/s) | ~0.000883 | ~0.001073 | ✅ +0.00019 |

**Hunter's Curve Interpolation:**
- FU 26 → ~14 GPM
- FU 34 → ~17 GPM

#### **Head Loss & TDH**

| รายการ | Version 1 | Version 2 | เปลี่ยนแปลง |
|---------|-----------|-----------|-------------|
| Critical Path Length | ~10.5 m | ~10.5 m | ❌ เท่ากัน |
| Static Head | 3.5 m.wg | 3.5 m.wg | ❌ เท่ากัน |
| Friction Loss | ~0.5 m.wg | ~0.2 m.wg | ✅ ลดลง (เพราะขยายท่อ) |
| Total Head Loss | ~4.0 m.wg | ~5.7 m.wg | ✅ เพิ่มขึ้น |
| Residual Pressure | 3.5 m.wg | 3.5 m.wg | �️ เท่ากัน |
| **TDH** | **~7.5 m.wg** | **~9.2 m.wg** | ✅ **+1.7 m.wg** |

**หมายเหตุ**:
- TDH เพิ่มขึ้นเนื่องจาก Flow Rate เพิ่ม แม้ว่า Friction Loss จะลดลงเพราะขยายท่อ
- แต่เพิ่มห้องน้ำทำให้ Total FU และ Flow Rate เพิ่ม

---

### **4. สรุปความต่าง**

| หมวด | Version 1 | Version 2 | เปลี่ยนแปลง |
|------|-----------|-----------|-------------|
| **Nodes** | 9 | 10 | ✅ +1 |
| **Pipes** | 9 | 10 | ✅ +1 |
| **Total FU** | 26 | 34 | ✅ +8 (+31%) |
| **Flow Rate** | 14 GPM | 17 GPM | ✅ +3 (+21%) |
| **Main Pipe Size** | 40mm (1½") | 50mm (2") | ✅ เพิ่มขนาด |
| **TDH** | 7.5 m.wg | 9.2 m.wg | ✅ +1.7 (+23%) |

---

## ✅ สิ่งที่ควรเห็นในหน้า Compare

### **UI Components:**
- ✅ เลือก Version 1 (From) ได้
- ✅ เลือก Version 2 (To) ได้
- ✅ ปุ่ม Compare ใช้งานได้
- ✅ แสดงผลลัพธ์เปรียบเทียบ

### **Comparison Display:**
- ✅ **Criteria Tab**:
  - แสดงตารางเปรียบเทียบ criteria
  - Highlight ค่าที่เปลี่ยนแปลง
  - แสดง "No changes" ถ้าเท่ากัน

- ✅ **Network Tab**:
  - แสดงจำนวน nodes ที่เปลี่ยน
  - แสดงจำนวน pipes ที่เปลี่ยน
  - แสดง nodes ที่เพิ่ม/ลบ
  - แสดง pipes ที่เพิ่ม/ลบ/เปลี่ยน

- ✅ **Results Tab**:
  - แสดง Total FU ที่เปลี่ยน
  - แสดง Flow Rate ที่เปลี่ยน
  - แสดง TDH ที่เปลี่ยน
  - แสดง % change

---

## 🧪 ทดสอบฟีเจอร์อื่นๆ ในหน้า Versions

### **Duplicate Version** ☐
1. กด Duplicate บน Version 1
2. ควรสร้าง Version 3: "Initial Design (Copy)"
3. ตรวจสอบว่า:
   - [ ] Version 3 ถูกสร้าง
   - [ ] ข้อมูลเหมือนกับ Version 1
   - [ ] ไม่ใช่ Current version

### **Delete Version** ☐
1. กด Delete บน Version 3 (ที่เพิ่ง duplicate)
2. ยืนยันการลบ
3. ตรวจสอบว่า:
   - [ ] Version 3 ถูกลบ
   - [ ] Version 1, 2 ยังอยู่

### **Restore Version** ☐
1. กด Restore บน Version 1
2. ควรสร้าง network ใหม่จาก Version 1
3. ตรวจสอบว่า:
   - [ ] Network ใหม่ถูกสร้าง
   - [ ] ข้อมูลตรงกับ Version 1
   - [ ] Network เดิมถูก set เป็น non-current

---

## 🎯 สรุปการทดสอบ

### **ผลลัพธ์ที่คาดหวัง:**
- ✅ Compare feature ทำงานได้
- ✅ เห็นความต่างระหว่าง 2 versions ชัดเจน
- ✅ UI แสดงผลลัพธ์ได้ดี
- ✅ Duplicate / Delete / Restore ทำงานได้

### **สิ่งที่ควรตรวจสอบ:**
- [ ] ข้อมูลครบถ้วนตามที่คาดหวัง
- [ ] UI ใช้งานง่าย
- [ ] Highlight ความต่างชัดเจน
- [ ] Export comparison ได้ (ถ้ามีฟีเจอร์)

---

*สร้างเมื่อ: 2026-03-31*
