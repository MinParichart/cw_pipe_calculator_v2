# CW Pipe Calculator - Figma Workflow Adaptation (Combination Plan)

## 🎯 วัตถุประสงค์
**Combination** เอาข้อดีของทั้ง 2 มารวมกัน:
- **Hydraulic Calculation App (Figma)** - Workflow 10 ขั้นตอน
- **CW Pipe Calculator (Project)** - Feature ครบถ้วนตาม requirement
- **ต้องตรงตาม requirement** ใน `pipe_calculator_system.md` (23 ฟีเจอร์)

---

## 📊 เปรียบเทียบ: Figma vs Project vs Requirement

### ✅ Feature ที่ทั้งคู่มี (ใช้ของใครก็ได้)

| Feature | Figma | Project | เลือกใช้ |
|---------|-------|---------|-----------|
| Login/Logout | ✅ | ✅ | Project |
| Project CRUD | ✅ | ✅ | Project |
| Design Criteria | ✅ | ✅ | Project |
| NetworkBuilder | ✅ | ✅ | **Project (vue-flow)** |
| Fixtures | ✅ | ✅ | Project |
| Calculation | ✅ | ✅ | Project |
| Results | ✅ | ✅ | Project |
| Version History | ✅ | ✅ | **Project (มี Compare)** |
| Audit Log | ✅ | ✅ | Project |

### 🔄 Feature ที่ Figma มีแต่ Project ไม่มี

| Feature | Figma | Project | การดำเนินการ |
|---------|-------|---------|----------------|
| **Workflow 10 Steps UI** | ✅ | ❌ | ✅ **เพิ่ม** |
| ProjectSteps Component | ✅ | ❌ | ✅ **สร้างใหม่** |
| แยกเป็น 10 หน้า | ✅ | ❌ | ✅ **สร้างใหม่** |
| Visual Progress | ✅ | ❌ | ✅ **เพิ่ม** |

### ⭐ Feature ที่ Project มีแต่ Figma ไม่มี (ต้องเก็บ!)

| Feature | Project | Figma | ความสำคัญ |
|---------|---------|-------|-----------|
| **NetworkBuilder (@vue-flow)** | ✅ | ❌ | **จำเป็น** (Figma แค่หน้าว่าง) |
| **AutoSuggestUpsizing** | ✅ | ❌ | **จำเป็น** (Requirement #21) |
| **HybridPipeSizing** | ✅ | ❌ | **จำเป็น** (Requirement #19) |
| **PipeSpecsCatalog** | ✅ | ❌ | **จำเป็น** (Requirement #16) |
| **Compare Versions** | ✅ | ❌ | **จำเป็น** (Requirement #9) |
| **Duplicate Version** | ✅ | ❌ | **จำเป็น** (Requirement #6) |
| **Delete Version** | ✅ | ❌ | **จำเป็น** (Requirement #6) |
| **Backend API (NestJS)** | ✅ | ❌ | **จำเป็น** (Figma ใช้ mock) |
| **Login/Register จริง** | ✅ | ❌ | **จำเป็น** (Figma แค่ UI) |

### 🚫 Feature ที่ทั้งคู่ไม่มี (ต้องสร้างใหม่!)

| Feature | Requirement | การดำเนินการ |
|---------|-------------|----------------|
| **Blueprint Upload** | #11 Blueprint Calibration | ✅ **สร้างใหม่** (Step 2: Documents) |
| **Manual Note/Label** | - | ✅ **สร้างใหม่** (Step 2: Documents) |
| **Smart Pathfinding** | #14 Pathfinding & Critical Path | ✅ **สร้างใหม่** (เพิ่มใน NetworkBuilder) |
| **Critical Endpoint Selector** | #14 Pathfinding & Critical Path | ✅ **สร้างใหม่** (เพิ่มใน NetworkBuilder) |

---

## 📋 ตรวจสอบตาม Requirement (23 ฟีเจอร์)

| # | Feature | Figma | Project | แผน |
|---|---------|-------|---------|------|
| A) **Account & Security** | | | |
| 1 | Authentication | ✅ | ✅ | ใช้ Project |
| 2 | Authorization | ✅ | ✅ | ใช้ Project |
| B) **Project & Workspace Setup** | | | |
| 3 | Project CRUD | ✅ | ✅ | ใช้ Project |
| 4 | Design Criteria | ✅ | ✅ | ใช้ Project |
| 5 | Reference Data | ❌ | ✅ | ใช้ Project (PipeSpecsCatalog) |
| C) **Versioning & Traceability** | | | |
| 6 | Version CRUD | ✅ | ✅ | ใช้ Project (มี Duplicate/Delete) |
| 7 | Save Version | ✅ | ✅ | ใช้ Project |
| 8 | View Version History | ✅ | ✅ | ใช้ Project |
| 9 | **Compare Versions** | ❌ | ✅ | ใช้ Project (เด็ด!) |
| 10 | Audit Log | ✅ | ✅ | ใช้ Project |
| D) **Interactive Network Builder** | | | |
| 11 | **Blueprint Calibration** | ❌ | ❌ | ⭐ **สร้างใหม่** |
| 12 | Visual Node Builder | ✅ | ✅ | ใช้ Project (vue-flow) |
| 13 | Smart Pipe Drawing | ✅ | ✅ | ใช้ Project (vue-flow) |
| 14 | **Pathfinding & Critical Path** | ❌ | ❌ | ⭐ **สร้างใหม่** |
| E) **Fixtures & Engineering Catalogs** | | | |
| 15 | Smart Fixture Mapping | ✅ | ✅ | ใช้ Project |
| 16 | **Pipe Specs Catalog** | ❌ | ✅ | ใช้ Project |
| 17 | FU Summary | ✅ | ✅ | ใช้ Project |
| 18 | Hunter's Curve Engine | ✅ | ✅ | ใช้ Project |
| F) **Hydraulic Sizing & Verification** | | | |
| 19 | **Hybrid Pipe Sizing** | ❌ | ✅ | ใช้ Project |
| 20 | Hydraulic Verification | ✅ | ✅ | ใช้ Project |
| G) **Optimization & Results** | | | |
| 21 | **Auto-Suggest Upsizing** | ❌ | ✅ | ใช้ Project |
| 22 | Apply Suggestion | ✅ | ✅ | ใช้ Project |
| 23 | Results Dashboard | ✅ | ✅ | ใช้ Project |

---

## 🔄 10 Steps Workflow (Combination Version)

| Step | Path | Page | Feature | ที่มา |
|------|------|------|---------|-------|
| 1 | `/projects/[id]` | index.vue | **Parameters** - Project details, Design Criteria | Project |
| 2 | `/projects/[id]/documents` | documents.vue | **Documents** - ⭐ **Blueprint Upload** + Reference Data | **Figma UI + Project Ref** |
| 3 | `/projects/[id]/network` | network.vue | **Network** - NetworkBuilder + ⭐ **Critical Path Selector** | Project + **ใหม่** |
| 4 | `/projects/[id]/fixtures` | fixtures.vue | **Fixtures** - Fixture Catalog + FU Summary | Project |
| 5 | `/projects/[id]/calculation` | calculation.vue | **Calculate** - ⭐ **Auto-Suggest + Hybrid Sizing** | **Project (เด็ด!)** |
| 6 | `/projects/[id]/results` | results.vue | **Results** - Result Display | Project |
| 7 | `/projects/[id]/hydraulic` | hydraulic.vue | **Hydraulic** - Velocity, Head Loss, Residual Check | Project |
| 8 | `/projects/[id]/suggestion` | suggestion.vue | **Suggest** - Apply Suggestion | Project |
| 9 | `/projects/[id]/versions` | versions.vue | **Version** - ⭐ **Compare/Duplicate/Delete** | **Project (เด็ด!)** |
| 10 | `/projects/[id]/audit` | audit.vue | **Audit** - Audit Log | Project |

---

## 🆕 Feature ใหม่ที่ต้องสร้าง

### **Step 2: Documents** - Blueprint Calibration
```vue
<template>
  <div class="grid grid-cols-2 gap-6">
    <!-- Blueprint Upload (ใหม่) -->
    <div class="card">
      <h3>Blueprint Upload</h3>
      <input type="file" @change="uploadBlueprint" accept="image/*" />
      <input v-model="blueprintScale" placeholder="สเกล (เช่น 1:100)" />
    </div>

    <!-- Reference Data (จาก Project) -->
    <div class="card">
      <PipeSpecsCatalog />
    </div>
  </div>
</template>
```

### **Step 3: Network** - Critical Path Selector
```vue
<template>
  <!-- NetworkBuilder (จาก Project) -->
  <NetworkBuilder
    :project-id="projectId"
    :blueprint-url="blueprintUrl"
    :blueprint-scale="blueprintScale"
  />

  <!-- Critical Endpoint Selector (ใหม่) -->
  <div class="card">
    <h3>เลือก Critical Endpoint</h3>
    <select v-model="criticalEndpoint">
      <option v-for="fixture in fixtures" :value="fixture.id">
        {{ fixture.name }} ({{ fixture.distance }}m)
      </option>
    </select>
    <button @click="findCriticalPath">หา Critical Path อัตโนมัติ</button>
  </div>
</template>
```

---

## 📁 โครงสร้าง Files (หลังจากทำ)

```
frontend/
├── stores/
│   └── workflowStore.ts                    ← + สร้างใหม่ (Figma concept)
├── components/
│   ├── workflow/
│   │   └── ProjectSteps.vue               ← + สร้างใหม่ (Figma concept)
│   ├── network/
│   │   └── NetworkBuilder.vue             ← ✅ มีแล้ว (Project)
│   ├── calculator/
│   │   ├── AutoSuggestUpsizing.vue        ← ✅ มีแล้ว (Project)
│   │   ├── HybridPipeSizing.vue           ← ✅ มีแล้ว (Project)
│   │   └── ResultDisplay.vue              ← ✅ มีแล้ว (Project)
│   ├── version/
│   │   └── VersionHistory.vue             ← ✅ มีแล้ว (Project - Compare)
│   ├── audit/
│   │   └── AuditLog.vue                   ← ✅ มีแล้ว (Project)
│   └── reference/
│       └── PipeSpecsCatalog.vue           ← ✅ มีแล้ว (Project)
├── pages/
│   └── projects/
│       ├── [id].vue                         ← ✏️ แก้: redirect ไป index.vue
│       ├── [id]/
│       │   ├── index.vue                   ← + สร้างใหม่ (Parameters)
│       │   ├── documents.vue               ← + สร้างใหม่ (Blueprint + Ref)
│       │   ├── network.vue                 ← + สร้างใหม่ (NetworkBuilder)
│       │   ├── fixtures.vue                ← + สร้างใหม่
│       │   ├── calculation.vue             ← + สร้างใหม่ (AutoSuggest + Hybrid)
│       │   ├── results.vue                 ← + สร้างใหม่
│       │   ├── hydraulic.vue               ← + สร้างใหม่
│       │   ├── suggestion.vue              ← + สร้างใหม่
│       │   ├── versions.vue                ← + สร้างใหม่ (VersionHistory + Compare)
│       │   └── audit.vue                   ← + สร้างใหม่ (AuditLog)
│       ├── index.vue
│       └── new.vue
└── layouts/
    └── dashboard.vue                        ← ✏️ แก้: เพิ่ม ProjectSteps
```

---

## 🛠️ แผนการทำ (7 Steps)

### **Step 1: สร้าง Workflow State Management**
ไฟล์: `frontend/stores/workflowStore.ts`

```typescript
import { defineStore } from 'pinia'

export type ProjectStep =
  | 'parameters'
  | 'documents'
  | 'network'
  | 'fixtures'
  | 'calculation'
  | 'results'
  | 'hydraulic'
  | 'suggestion'
  | 'versions'
  | 'audit'

export const useWorkflowStore = defineStore('workflow', {
  state: () => ({
    currentStep: 'parameters' as ProjectStep,
    completedSteps: [] as ProjectStep[],
  }),

  actions: {
    setCurrentStep(step: ProjectStep) {
      this.currentStep = step
    },

    markStepComplete(step: ProjectStep) {
      if (!this.completedSteps.includes(step)) {
        this.completedSteps.push(step)
      }
    },

    reset() {
      this.currentStep = 'parameters'
      this.completedSteps = []
    },
  },
})
```

### **Step 2: สร้าง ProjectSteps Component**
ไฟล์: `frontend/components/workflow/ProjectSteps.vue`
- ใช้ concept จาก Figma
- 10 วงกลม + เส้นเชื่อม
- Click → navigate
- สี: เขียว (completed), ส้ม (current), เทา (pending)

### **Step 3: สร้าง 10 Pages**
สร้างไฟล์ใน `frontend/pages/projects/[id]/`:

1. **index.vue** (Parameters)
   - ย้าย project details จาก `[id].vue` เดิม
   - Design Criteria settings

2. **documents.vue** (Documents) ⭐ **ใหม่ - Combination**
   - Blueprint Upload (ใหม่)
   - Blueprint Scale input (ใหม่)
   - Manual Note/Label (ใหม่)
   - **PipeSpecsCatalog** (จาก Project)

3. **network.vue** (Network) ⭐ **ใหม่ - Project + Enhancement**
   - **NetworkBuilder** (จาก Project - vue-flow)
   - Blueprint background (ใหม่)
   - Critical Endpoint selector (ใหม่)
   - Auto-find Critical Path (ใหม่)

4. **fixtures.vue** (Fixtures)
   - Fixture Catalog
   - FU Summary

5. **calculation.vue** (Calculation) ⭐ **ใหม่ - Project (เด็ด!)**
   - Water Demand Calculation
   - **AutoSuggestUpsizing** (จาก Project)
   - **HybridPipeSizing** (จาก Project)

6. **results.vue** (Results)
   - **ResultDisplay** (จาก Project)

7. **hydraulic.vue** (Hydraulic)
   - Velocity Check
   - Head Loss Check
   - Static Head
   - Residual Pressure

8. **suggestion.vue** (Suggestion)
   - Apply Suggestion

9. **versions.vue** (Version) ⭐ **ใหม่ - Project (เด็ด!)**
   - **VersionHistory** (จาก Project)
   - **Compare Versions** (จาก Project - เด็ด!)
   - **Duplicate Version** (จาก Project)
   - **Delete Version** (จาก Project)

10. **audit.vue** (Audit)
    - **AuditLog** (จาก Project)

### **Step 4: อัปเดต Layout**
ไฟล์: `frontend/layouts/dashboard.vue`
- เพิ่ม `<ProjectSteps />` ใต้ Navbar
- แสดงเฉพาะใน `/projects/[id]/*`

### **Step 5: อัปเดต [id].vue เดิม**
ไฟล์: `frontend/pages/projects/[id].vue`
- Redirect ไป `/projects/[id]` (index.vue)
- หรือทำเป็น overview page

### **Step 6: สร้าง Feature ใหม่**
- Blueprint Upload UI
- Critical Endpoint Selector
- Auto-find Critical Path logic

### **Step 7: เชื่อม Workflow State**
- แต่ละหน้าอัปเดต `currentStep`
- เมื่อ save → `markStepComplete()`

---

## 🔗 การทำงานของระบบ

```
User login → Dashboard → เลือก Project
    ↓
เข้า /projects/1 → workflowStore.currentStep = 'parameters'
    ↓
แสดง ProjectSteps:
    ● ส้ม (1) ─ ─ ○ เทา (2) ─ ─ ○ เทา (3) ...
    ↓
Step 1: Parameters
├─ กรอก project details
├─ ตั้งค่า Design Criteria (v, Pressure, C-Factor)
└─ Save → markStepComplete('parameters')

Step 2: Documents ⭐ **Combination**
├─ Upload Blueprint (ใหม่)
├─ ใส่ Scale (ใหม่)
├─ Manual Note (ใหม่)
└─ View PipeSpecsCatalog (จาก Project)

Step 3: Network ⭐ **Project + Enhancement**
├─ NetworkBuilder (vue-flow from Project)
├─ Blueprint background (ใหม่)
├─ วาด Nodes/Pipes
├─ เลือก Critical Endpoint (ใหม่)
└─ Auto-find Critical Path (ใหม่)

Step 4: Fixtures
├─ เพิ่ม Fixtures
└─ ดู FU Summary

Step 5: Calculation ⭐ **Project (เด็ด!)**
├─ FU → Flow (Hunter's Curve)
├─ AutoSuggestUpsizing (Project)
├─ HybridPipeSizing (Project)
└─ แนะนำขนาดท่อ

Step 6: Results
└─ ResultDisplay (Project)

Step 7: Hydraulic
├─ Velocity Check
├─ Head Loss Check
└─ Residual Pressure Check

Step 8: Suggestion
└─ Apply Suggestion

Step 9: Versions ⭐ **Project (เด็ด!)**
├─ VersionHistory (Project)
├─ Compare Versions ⭐ (Project - เด็ด!)
├─ Duplicate Version (Project)
└─ Delete Version (Project)

Step 10: Audit
└─ AuditLog (Project)
```

---

## ⚠️ ข้อควรระวัง

1. **อย่าลืม import components** - NetworkBuilder, VersionHistory, AuditLog ฯลฯ
2. **Backend API ต้องต่อเหมือนเดิม** - ใช้ `composables/useApi`
3. **ตรรกะคำนวณต้องอยู่** - Hunter's Curve, Hazen-Williams
4. **Feature เด็ดของ Project ต้องอยู่**:
   - Compare Versions (Step 9)
   - AutoSuggestUpsizing, HybridPipeSizing (Step 5)
   - PipeSpecsCatalog (Step 2)
5. **Feature ใหม่ที่ต้องสร้าง**:
   - Blueprint Upload (Step 2)
   - Critical Endpoint Selector (Step 3)
   - Auto-find Critical Path (Step 3)

---

## ✅ Checklist หลังทำเสร็จ

### **Figma UI/UX**
- [ ] ProjectSteps แสดง 10 steps
- [ ] Click step → navigate ถูกต้อง
- [ ] สีเปลี่ยนตาม completed/current/pending
- [ ] Visual progress ชัดเจน

### **Project Features (ต้องอยู่)**
- [ ] NetworkBuilder (vue-flow) ทำงานได้
- [ ] AutoSuggestUpsizing ทำงานได้
- [ ] HybridPipeSizing ทำงานได้
- [ ] PipeSpecsCatalog แสดงได้
- [ ] Compare Versions ทำงานได้ ⭐
- [ ] Duplicate Version ทำงานได้
- [ ] Delete Version ทำงานได้
- [ ] AuditLog แสดงได้

### **New Features (ต้องสร้าง)**
- [ ] Blueprint Upload ทำงานได้
- [ ] Blueprint Calibration ทำงานได้
- [ ] Critical Endpoint Selector ทำงานได้
- [ ] Auto-find Critical Path ทำงานได้

### **Backend & Logic**
- [ ] Backend API ต่ออยู่
- [ ] Login/Register ได้
- [ ] Hunter's Curve ถูกต้อง
- [ ] Hazen-Williams ถูกต้อง

---

## 📝 Notes

- **ไม่แก้ backend** - ทำเฉพาะ frontend
- **ไม่แก้ logic คำนวณ** - แค่ย้าย UI
- **ใช้ Nuxt 3 file-based routing** - ตามที่คุณใช้อยู่
- **ใช้ Pinia store** - ตามที่คุณใช้อยู่
- **Tech stack เดิมทั้งหมด** - Nuxt + Vue + Tailwind
- **Combination concept** - Figma UI + Project Features
- **ตรงตาม requirement** - 23 ฟีเจอร์ใน pipe_calculator_system.md

---

## 🎯 สรุปภาพรวม

**แนวคิดหลัก:**
1. **ใช้ Workflow UI จาก Figma** - 10 steps, ProjectSteps component
2. **ใช้ Features จาก Project** - NetworkBuilder, AutoSuggest, Hybrid, Compare, etc.
3. **สร้าง Feature ใหม่** - Blueprint Upload, Critical Path Selector
4. **ตรงตาม Requirement** - 23 ฟีเจอร์ใน pipe_calculator_system.md

**ผลลัพธ์:**
- ได้ UX ที่ดีเหมือน Figma (10 steps workflow)
- ได้ Features ที่ครบถ้วนเหมือน Project (Compare, AutoSuggest, etc.)
- ได้ Features ใหม่ที่ตรงตาม requirement (Blueprint, Critical Path)
- ไม่เสีย feature ที่มีอยู่
- Tech stack เดิมทั้งหมด
