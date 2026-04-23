# Demo Checklist - บ้านลาดพร้าว 2 ชั้น

## 🎯 วัตถุประสงค์
ตรวจสอบความถูกต้องของการคำนวณ 16 ขั้นตอน (Critical Path) และ 10 Workflow Steps

---

## 📋 ข้อมูลโปรเจกต์

| ข้อมูล | ค่า |
|---------|-----|
| ชื่อโปรเจกต์ | บ้านลาดพร้าว 2 ชั้น |
| ประเภท | RESIDENTIAL |
| จำนวนชั้น | 2 ชั้น |
| พื้นที่ | 120 ตร.ม. |
| จำนวนห้องน้ำ | 4 ห้อง (Version 2) |

---

## 🔧 Design Criteria

| พารามิเตอร์ | ค่าที่ตั้ง | ตรวจสอบ |
|--------------|-----------|---------|
| System Type | Flush Tank | ☐ |
| Building Type | Apartment | ☐ |
| C-Factor | 150 (PVC) | ☐ |
| Velocity Min | 1.2 m/s | ☐ |
| Velocity Max | 2.4 m/s | ☐ |
| Static Head | 3.5 m | ☐ |
| Residual Pressure | 0.35 bar (3.5 m.wg) | ☐ |

---

## 🚽 Fixtures Summary

### Version 1: Initial Design (3 ห้องน้ำ)

| ห้อง/สถานที่ | Fixtures | FU (each) | FU (total) | ☐ |
|-------------|----------|-----------|-----------|---|
| ห้องน้ำ 1 (1F) | WC + Lavatory + Shower | 3+1+2 | 6 | ☐ |
| ครัว (1F) | Kitchen Sink + Dishwasher | 2+1 | 3 | ☐ |
| ห้องซักล้าง (1F) | Laundry 7kg | 4 | 4 | ☐ |
| ห้องน้ำ 2 (2F) | WC + Lavatory | 3+1 | 4 | ☐ |
| ห้องน้ำ 3 (2F) | WC + Lavatory + Bathtub | 3+1+2 | 6 | ☐ |
| **รวมทั้งหมด** | | | **26 FU** | ☐ |

### Version 2: Modified Design (4 ห้องน้ำ)

| ห้อง/สถานที่ | Fixtures | FU (each) | FU (total) | ☐ |
|-------------|----------|-----------|-----------|---|
| ห้องน้ำ 1 (1F) | WC + Lavatory + Shower | 3+1+2 | 6 | ☐ |
| ครัว (1F) | Kitchen Sink + Dishwasher | 2+1 | 3 | ☐ |
| ห้องซักล้าง (1F) | Laundry 7kg | 4 | 4 | ☐ |
| ห้องน้ำ 4 (1F) ⭐ | WC + Lavatory | 3+1 | 4 | ☐ |
| ห้องน้ำ 2 (2F) | WC + Lavatory | 3+1 | 4 | ☐ |
| ห้องน้ำ 3 (2F) | WC + Lavatory + Bathtub | 3+1+2 | 6 | ☐ |
| **รวมทั้งหมด** | | | **34 FU** | ☐ |

---

## 🧮 16 ขั้นตอนการคำนวณ Critical Path

### Step 1: กำหนด Critical Path ☐
- **ความยาวรวม**: ~10.5 m
- **ความสูงสูงสุด**: 3.5 m (ชั้น 2)
- **เส้นทาง**: Source → Riser 1F → Riser 2F → J2 → ห้องน้ำ 3 (2F)
- **เหตุผล**: เส้นทางที่ยาวที่สุดและสูงที่สุด

### Step 1.1: กำหนด Nodes และ Pipe Segments ☐
- **จำนวน Nodes**: 10 nodes (Version 2)
- **จำนวน Pipes**: 10 pipes (Version 2)

### Step 1.2: นับค่า Fixture Units (FU) ☐
- **Version 1**: 26 FU
- **Version 2**: 34 FU

### Step 1.3: แปลงค่า FU → Flow Rate (GPM) ☐
ใช้ Hunter's Curve (Flush Tank System)

| FU | Expected GPM | Actual GPM | ☐ |
|----|--------------|-----------|---|
| 26 | ~14.0 | | ☐ |
| 34 | ~17.0 | | ☐ |

### Step 1.4: ปรับค่าอัตราการไหลด้วย Water Factor ☐
- **Building Type**: Apartment
- **Adjustment**: (ไม่ใช้ residential ล้วน แต่ใช้ค่าจาก Hunter's Curve โดยตรง)

### Step 1.5: บวกเพิ่มอัตราการไหลของ Hose Bibb ☐
- **Hose Bibb Flow**: ไม่มีใน demo นี้
- **Total Flow**: เท่ากับค่าจาก Hunter's Curve

### Step 1.6: แปลงหน่วย GPM → LPS → m³/s ☐

| Version | GPM | LPS (GPM × 0.06309) | m³/s (GPM × 0.00006309) | ☐ |
|---------|-----|--------------------|----------------------|---|
| 1 | 14.0 | ~0.883 | ~0.000883 | ☐ |
| 2 | 17.0 | ~1.073 | ~0.001073 | ☐ |

### Step 1.7: กำหนดขนาดท่อเบื้องต้น (Table 2.6) ☐

| Pipe Segment | FU | Expected Size | Actual Size | ☐ |
|-------------|----|---------------|-------------|---|
| Main (Source→Riser) | 34 | 50mm (2") | | ☐ |
| Distribution (Riser→J) | 34 | 40mm (1½") | | ☐ |
| Branch (ห้องน้ำ) | 6 | 25mm (1") | | ☐ |

### Step 1.8: คำนวณความเร็วการไหล (v = Q/A) ☐
- **เกณฑ์**: 1.2 - 2.4 m/s
- **สูงสุด**: ไม่เกิน 3 m/s

| Pipe | D (m) | A (m²) | Q (m³/s) | v (m/s) | Status | ☐ |
|------|-------|--------|----------|---------|--------|---|
| Main | 0.0508 | 0.00203 | 0.001073 | ~0.53 | ✅ ต่ำไป | ☐ |
| Branch | 0.0258 | 0.00052 | 0.000107 | ~0.21 | ⚠️ ต่ำมาก | ☐ |

**หมายเหตุ**: ความเร็วต่ำเนื่องจากใช้ขนาดท่อใหญ่กว่าที่จำเป็น (เพื่อความปลอดภัย)

### Step 1.9: กรอกความยาวท่อจริง (L) และค่า C ☐
- **Material**: PVC
- **C-Factor**: 150

### Step 1.10: คำนวณ Friction Loss Rate (h_f) ☐
สูตร: `h_f = (10.583 / D^4.87) × (Q / C)^1.85 × 100`

| Pipe | D (m) | Q (m³/s) | C | h_f (m/100m) | ☐ |
|------|-------|----------|---|--------------|---|
| Main | 0.0508 | 0.001073 | 150 | | ☐ |
| Branch | 0.0258 | 0.000107 | 150 | | ☐ |

### Step 1.11: คำนวณ Major Loss (h_l = L × h_f / 100) ☐

| Pipe | L (m) | h_f (m/100m) | h_l (m.wg) | ☐ |
|------|-------|--------------|-----------|---|
| Main | 2.5 | | | ☐ |
| Riser | 3.5 | | | ☐ |

### Step 1.12: คำนวณ Minor Loss ☐
- **สูตร**: Minor Loss = Major Loss × 30%

| Pipe | Major Loss | Minor Loss (30%) | ☐ |
|------|-----------|-----------------|---|
| Main | | | ☐ |
| Riser | | | ☐ |

### Step 1.13: คำนวณ Static Head ☐
- **ความสูง**: 3.5 m
- **Static Head**: **3.5 m.wg** ☐

### Step 1.14: รวมความดันสูญเสียทั้งหมด (Total Head Loss) ☐

สูตร: `Total Head Loss = (Major Loss + Minor Loss) + Static Head`

| Version | Major Loss | Minor Loss | Static Head | Total | ☐ |
|---------|-----------|-----------|-------------|-------|---|
| 1 | | | 3.5 | | ☐ |
| 2 | | | 3.5 | | ☐ |

### Step 1.15: กำหนดความดันใช้งานที่ปลายทาง (Residual Pressure) ☐
- **Residual Pressure**: **0.35 bar = 3.5 m.wg** ☐

### Step 1.16: สรุปแรงดันที่ปั๊มต้องทำได้ (TDH) ☐

สูตร: `TDH = Total Head Loss + Residual Pressure`

| Version | Total Head Loss | Residual | TDH (m.wg) | TDH (bar) | ☐ |
|---------|----------------|----------|-----------|-----------|---|
| 1 | ~4.0 | 3.5 | **~7.5** | ~0.74 | ☐ |
| 2 | ~5.7 | 3.5 | **~9.2** | ~0.90 | ☐ |

---

## 📊 10 Workflow Steps Checklist

| Step | Name | Status | Notes |
|------|------|--------|-------|
| 1 | Parameters | ☐ | |
| 2 | Documents | ☐ | |
| 3 | Network | ☐ | |
| 4 | Fixtures | ☐ | |
| 5 | Calculation | ☐ | |
| 6 | Results | ☐ | |
| 7 | Hydraulic | ☐ | |
| 8 | Suggestion | ☐ | |
| 9 | Versions | ☐ | |
| 10 | Audit | ☐ | |

---

## 🔄 Compare Versions Checklist

ดูรายละเอียดที่: **[DEMO_COMPARE_VERSIONS.md](./DEMO_COMPARE_VERSIONS.md)**

| ตรวจสอบ | Version 1 | Version 2 | ☐ |
|----------|-----------|-----------|---|
| ชื่อ | Initial Design | Modified Design | ☐ |
| คำอธิบาย | 3 ห้องน้ำ | 4 ห้องน้ำ | ☐ |
| Nodes | 9 | 10 | ☐ |
| Pipes | 9 | 10 | ☐ |
| Total FU | 26 | 34 | ☐ |
| Flow Rate | ~14 GPM | ~17 GPM | ☐ |
| TDH | ~7.5 m.wg | ~9.2 m.wg | ☐ |

---

## 🐛 Bug Report

### พบปัญหา:
| Step | ปัญหา | คาดหวัง | จริง | ความสำคัญ |
|------|-------|---------|------|----------|
| | | | | |

### ข้อเสนอแนะ:
|

---

## ✅ สรุป

### ผลการทดสอบ:
- **ทดสอบโดย**: ____________________
- **วันที่**: ____________________
- **เวลา**: ____________________

### สถานะโดยรวม:
- [ ] ✅ ผ่านทั้งหมด
- [ ] ⚠️ ผ่านแต่มีคำเตือน
- [ ] ❌ ไม่ผ่าน

### หมายเหตุ:
|

---

*สร้างเมื่อ: 2026-03-31*
