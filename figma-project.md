# Figma Hydraulic Calculation App

## ภาพรวม
แอปพลิเคชันคำนวณระบบท่อน้ำดี (Hydraulic Calculation) ที่ออกแบบใน Figma และพัฒนาด้วย React

## Tech Stack
- **Framework**: React 18 + Vite 6
- **Styling**: Tailwind CSS 4
- **UI Components**: Radix UI (ตัวช่วยสร้าง UI components ครบชุด)
- **Routing**: React Router v7
- **Icons**: Lucide React
- **Charts**: Recharts

## Workflow 10 ขั้นตอน (Project Steps)

### 1. Parameters
ตั้งค่าพารามิเตอร์โปรเจกต์

### 2. Documents
จัดการเอกสารที่เกี่ยวข้อง

### 3. Network
สร้าง network diagram ด้วย NetworkBuilderPageV2

### 4. Fixtures
เพิ่ม/แก้ไข fixtures (อุปกรณ์สุขภัณฑ์)

### 5. Calculate
คำนวณ

### 6. Results
ดูผลลัพธ์

### 7. Hydraulic
ตรวจสอบแรงดันน้ำ (Hydraulic Check)

### 8. Suggest
ระบบแนะนำ (Suggestion System)

### 9. Version
จัดการประวัติเวอร์ชัน

### 10. Audit
บันทึก audit log

## โครงสร้างแอปพลิเคชัน

### Pages
- `LoginPage` - หน้า login
- `DashboardLayout` - layout หลัก
- `DashboardPage` - dashboard
- `ProjectListPage` - รายการโปรเจกต์
- `ProjectDetailPage` - รายละเอียดโปรเจกต์
- `DocumentsPage`, `NetworkBuilderPageV2`, `FixturesPage`, `CalculationPage`
- `ResultsPage`, `HydraulicCheckPage`, `SuggestionPage`
- `VersionHistoryPage`, `AuditLogPage`

### Components
- UI components จาก Radix UI (accordion, alert, dialog, etc.)
- `ProjectSteps.tsx` - stepper component แสดง 10 ขั้นตอน

## คุณสมบัติ
- Navigation ผ่าน 10 steps ด้วย visual stepper
- Mock data storage ผ่าน `initializeMockData()`
- Toast notifications ผ่าน Sonner
- Full responsive design

## Source
Original Figma: https://www.figma.com/design/pFNUja1o9TUFbTcsghtxv1/Hydraulic-Calculation-App
