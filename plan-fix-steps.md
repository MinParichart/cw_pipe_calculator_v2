# 📋 Plan: แก้ไข 10 Workflow Steps ให้ถูกต้อง

## 🎯 เป้าหมาย

แก้ไขทุก Step ที่ยังไม่ถูกต้องให้ทำงานได้สมบูรณ์ โดยเริ่มจาก Step ที่สำคัญที่สุด

---

## 📊 สรุปสิ่งที่พบ (จากการสำรวจทั้ง 10 Steps)

### ✅ Steps ที่ทำงานได้แล้ว (5/10):
- **Step 2 - Documents**: Blueprint upload, PipeSpecsCatalog ใช้ได้
- **Step 3 - Network**: NetworkBuilder, critical path finder ใช้ได้
- **Step 5 - Calculation**: AutoSuggest, HybridSizing ใช้ได้
- **Step 9 - Versions**: VersionHistory, Compare ใช้ได้
- **Step 10 - Audit**: AuditLog component ใช้ได้

### ⚠️ Steps ที่ต้องแก้ (5/10):

| Step | ปัญหา | ความสำคัญ | วิธีแก้ |
|------|-------|-----------|---------|
| **1. Parameters** | ไม่มี input form ให้กรอกค่า Design Criteria | 🔴 วิกฤต | สร้าง CriteriaForm + Modal |
| **4. Fixtures** | editFixture() ยังไม่เปิดใช้งาน | 🟡 ปานกลาง | เพิ่ม edit functionality |
| **7. Hydraulic** | ใช้ mock data ไม่ได้จริง | 🟡 ปานกลาง | เปลี่ยน mock → API call |
| **8. Suggestion** | ใช้ mock data | 🟢 เล็กน้อย | เปลี่ยน mock → API call |
| **6. Results** | export/print ไม่เปิดใช้งาน | 🟢 เล็กน้อย | เปิด export |

---

## 🔧 แผนการแก้ไขแบบละเอียด

## **PHASE 1: Step 1 - Parameters** ⭐ (สำคัญที่สุด)

### ปัญหา:
ไฟล์: `frontend/pages/projects/[id]/index.vue`

```javascript
// บรรทัด 238-241
const editCriteria = () => {
  // TODO: Open criteria edit modal
  toast.info('ฟีเจอร์แก้ไขเกณฑ์การออกแบบยังไม่เปิดใช้งาน')
}
```

**คือไม่มี input form ให้ user กรอกค่าจริงๆ!**

### สิ่งที่ต้องทำ:

#### 1.1 สร้าง CriteriaForm Component

**ไฟล์ใหม่**: `frontend/components/criteria/CriteriaForm.vue`

มี input fields ทั้งหมด 9 อย่าง:

```vue
<template>
  <form @submit.prevent="handleSubmit">
    <!-- Velocity Settings -->
    <div class="grid grid-cols-3 gap-4">
      <div>
        <label>Velocity Min (m/s)</label>
        <input v-model.number="form.velocityMin" type="number" step="0.1" />
      </div>
      <div>
        <label>Velocity Max (m/s)</label>
        <input v-model.number="form.velocityMax" type="number" step="0.1" />
      </div>
      <div>
        <label>Velocity Warning (m/s)</label>
        <input v-model.number="form.velocityWarning" type="number" step="0.1" />
      </div>
    </div>

    <!-- Pressure Settings -->
    <div class="grid grid-cols-2 gap-4">
      <div>
        <label>Pressure Min (bar)</label>
        <input v-model.number="form.pressureMin" type="number" step="0.1" />
      </div>
      <div>
        <label>Pressure Warning (bar)</label>
        <input v-model.number="form.pressureWarning" type="number" step="0.1" />
      </div>
    </div>

    <!-- C-Factor -->
    <div>
      <label>C-Factor</label>
      <select v-model.number="form.cFactor">
        <option :value="150">150 - PVC</option>
        <option :value="130">130 - Steel</option>
        <option :value="140">140 - Copper</option>
        <option :value="150">150 - CPVC</option>
        <option :value="160">160 - PEX</option>
      </select>
    </div>

    <!-- System Type -->
    <div>
      <label>System Type</label>
      <select v-model="form.systemType">
        <option value="FLUSH_TANK">Flush Tank</option>
        <option value="FLUSH_VALVE">Flush Valve</option>
      </select>
    </div>

    <!-- Building Type -->
    <div>
      <label>Building Type</label>
      <select v-model="form.buildingType">
        <option value="APARTMENT">Apartment</option>
        <option value="OFFICE">Office</option>
        <option value="HOSPITAL">Hospital</option>
        <option value="SCHOOL">School</option>
        <option value="HOTEL">Hotel</option>
      </select>
    </div>

    <!-- Static Head -->
    <div>
      <label>Static Head (m)</label>
      <input v-model.number="form.staticHead" type="number" step="0.1" />
    </div>

    <!-- Residual Pressure -->
    <div>
      <label>Residual Pressure (bar)</label>
      <input v-model.number="form.residualPressure" type="number" step="0.1" />
    </div>

    <!-- Buttons -->
    <div class="flex gap-2 mt-4">
      <button type="submit" class="btn-primary">บันทึก</button>
      <button type="button" @click="$emit('cancel')" class="btn-secondary">ยกเลิก</button>
    </div>
  </form>
</template>

<script setup lang="ts">
const props = defineProps<{
  criteria?: any
}>()

const emit = defineEmits<{
  submit: [criteria: any]
  cancel: []
}>()

const form = ref({
  velocityMin: props.criteria?.velocityMin || 1.2,
  velocityMax: props.criteria?.velocityMax || 2.4,
  velocityWarning: props.criteria?.velocityWarning || 3.0,
  pressureMin: props.criteria?.pressureMin || 0.5,
  pressureWarning: props.criteria?.pressureWarning || 0.3,
  cFactor: props.criteria?.cFactor || 150,
  systemType: props.criteria?.systemType || 'FLUSH_TANK',
  buildingType: props.criteria?.buildingType || 'APARTMENT',
  staticHead: props.criteria?.staticHead || 3.5,
  residualPressure: props.criteria?.residualPressure || 0.35,
})

const handleSubmit = () => {
  emit('submit', form.value)
}
</script>
```

#### 1.2 แก้ไข index.vue (เพิ่ม Modal)

**ไฟล์**: `frontend/pages/projects/[id]/index.vue`

**เพิ่ม Modal component ใน template**:

```vue
<template>
  <!-- ... existing code ... -->

  <!-- Edit Criteria Modal -->
  <Modal v-if="showCriteriaModal" @close="showCriteriaModal = false">
    <CriteriaForm
      :criteria="criteria"
      @submit="saveCriteria"
      @cancel="showCriteriaModal = false"
    />
  </Modal>
</template>
```

**เพิ่มใน script**:

```typescript
import CriteriaForm from '~/components/criteria/CriteriaForm.vue'

// State
const showCriteriaModal = ref(false)

// Methods
const editCriteria = () => {
  showCriteriaModal.value = true  // เปิด modal แทน toast
}

const saveCriteria = async (newCriteria: any) => {
  try {
    await projectsApi.updateCriteria(projectId.value, newCriteria)
    criteria.value = newCriteria
    showCriteriaModal.value = false
    toast.success('บันทึกเกณฑ์การออกแบบเรียบร้อย')
  } catch (error: any) {
    toast.error(error.message || 'Failed to save criteria')
  }
}
```

#### 1.3 เช็ค Backend API

**เช็ค**: `backend/src/routes/projects.ts`

ต้องมี endpoint:
```typescript
router.put('/projects/:id/criteria', updateProjectCriteria)
```

ถ้าไม่มี: เพิ่มใน projectController

---

## **PHASE 2: Step 4 - Fixtures**

### ปัญหา:
ไฟล์: `frontend/pages/projects/[id]/fixtures.vue`

```javascript
// บรรทัด 138-139
const editFixture = (fixture: any) => {
  // TODO: Implement edit fixture
  toast.info('ฟีเจอร์แก้ไข fixture ยังไม่เปิดใช้งาน')
}
```

### สิ่งที่ต้องทำ:

#### 2.1 เปิดใช้งาน editFixture

**ไฟล์**: `frontend/pages/projects/[id]/fixtures.vue`

```typescript
const showEditModal = ref(false)
const editingFixture = ref<any>(null)

const editFixture = (fixture: any) => {
  editingFixture.value = fixture
  showEditModal.value = true  // เปิด modal แก้ไข
}

const updateFixture = async (updatedFixture: any) => {
  try {
    await fixturesApi.update(updatedFixture.id, updatedFixture)
    toast.success('แก้ไข Fixture เรียบร้อย')
    showEditModal.value = false
    loadFixtures()  // โหลด fixtures ใหม่
  } catch (error: any) {
    toast.error(error.message || 'Failed to update fixture')
  }
}
```

**เพิ่ม Modal ใน template**:

```vue
<Modal v-if="showEditModal" @close="showEditModal = false">
  <FixtureInput
    :project-id="projectId"
    :fixture="editingFixture"
    @submit="updateFixture"
    @cancel="showEditModal = false"
  />
</Modal>
```

---

## **PHASE 3: Step 7 - Hydraulic**

### ปัญหา:
ไฟล์: `frontend/pages/projects/[id]/hydraulic.vue`

```javascript
// บรรทัด 194-212
// Mock verification results
velocityChecks.value = [
  { location: 'Source - Meter', pipe: 'Ø25mm', velocity: 1.2, limit: 3.0, pass: true },
  // ... mock data ทั้งหมด
]
```

**ใช้ mock data ไม่ได้ดึงจาก API จริง!**

### สิ่งที่ต้องทำ:

#### 3.1 เช็ค/เพิ่ม Backend API

**ไฟล์**: `backend/src/routes/calculations.ts`

ต้องมี endpoint:
```typescript
router.get('/networks/:networkId/hydraulic-analysis', getHydraulicAnalysis)
```

ถ้าไม่มี: เพิ่มใน calculationController

#### 3.2 เปลี่ยน Mock → API Call

**ไฟล์**: `frontend/pages/projects/[id]/hydraulic.vue`

```typescript
const runVerification = async () => {
  verifying.value = true

  try {
    // เรียก API จริงแทน mock
    const analysis = await calculationsApi.getHydraulicAnalysis(projectId.value)

    velocityChecks.value = analysis.velocityChecks
    pressureChecks.value = analysis.pressureChecks
    frictionLossChecks.value = analysis.frictionLossChecks

    // Calculate summary
    maxVelocity.value = Math.max(...velocityChecks.value.map(c => c.velocity))
    maxHeadLoss.value = Math.max(...frictionLossChecks.value.map(c => c.loss))
    minPressure.value = Math.min(...pressureChecks.value.map(c => c.pressure))

    // Determine overall status
    const allPass = [
      ...velocityChecks.value,
      ...pressureChecks.value,
      ...frictionLossChecks.value
    ].every(check => check.pass)

    verificationStatus.value = allPass ? 'pass' : 'fail'

    toast.success('ตรวจสอบระบบเรียบร้อย')
  } catch (error: any) {
    toast.error(error.message || 'Failed to verify')
  } finally {
    verifying.value = false
  }
}
```

---

## **PHASE 4: Step 8 - Suggestion**

### ปัญหา:
ไฟล์: `frontend/pages/projects/[id]/suggestion.vue`

```javascript
// บรรทัด 179-215
// Mock suggestions - in real app, load from API
autoSuggestions.value = [
  {
    id: 1,
    location: 'ท่อหลัก 1',
    // ... mock data ทั้งหมด
  },
]
```

### สิ่งที่ต้องทำ:

#### 4.1 เปลี่ยน Mock → API Call

**ไฟล์**: `frontend/pages/projects/[id]/suggestion.vue`

```typescript
const loadSuggestions = async () => {
  try {
    // เรียก API จริงแทน mock
    const suggestions = await calculationsApi.getSuggestions(projectId.value)

    hasCalculation.value = true
    autoSuggestions.value = suggestions.autoSuggest
    hybridSizings.value = suggestions.hybridSizing
  } catch (error) {
    hasCalculation.value = false
  }
}
```

---

## **PHASE 5: Step 6 - Results (Optional)**

### ปัญหา:
ไฟล์: `frontend/pages/projects/[id]/results.vue`

```javascript
// บรรทัด 126-127
const exportResults = () => {
  toast.info('ฟีเจอร์ Export ยังไม่เปิดใช้งาน')
}
```

### สิ่งที่ต้องทำ:

#### 5.1 เปิดใช้งาน Export

**ไฟล์**: `frontend/pages/projects/[id]/results.vue`

```typescript
const exportResults = async () => {
  try {
    // Export to PDF/Excel
    const results = await calculationsApi.getResults(projectId.value)

    // สร้าง PDF หรือ Excel
    // ใช้ library อย่าง jsPDF หรือ xlsx
    const blob = await generateResultsPDF(results)

    // Download
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = `results-${projectId.value}.pdf`
    a.click()

    toast.success('Export เรียบร้อย')
  } catch (error: any) {
    toast.error(error.message || 'Failed to export')
  }
}
```

---

## **PHASE 6: ทดสอบทั้งหมด**

หลังแก้ครบทุก phase แล้ว ให้ทดสอบทีละ step:

### Checklist:

1. ✅ **Step 1 - Parameters**
   - [ ] เปิด project
   - [ ] กด "แก้ไข" ที่ Design Criteria card
   - [ ] เห็น Modal form พร้อม input fields
   - [ ] แก้ค่า Velocity Min, C-Factor, Static Head ฯลฯ
   - [ ] กดบันทึก
   - [ ] รีเฟรชหน้า ค่าควรอัปเดต

2. ✅ **Step 2 - Documents**
   - [ ] Upload blueprint ได้ (มีอยู่แล้ว)

3. ✅ **Step 3 - Network**
   - [ ] สร้าง network ได้ (มีอยู่แล้ว)
   - [ ] หา critical path ได้

4. ✅ **Step 4 - Fixtures**
   - [ ] เพิ่ม fixtures ได้ (มีอยู่แล้ว)
   - [ ] แก้ไข fixtures ได้ (เพิ่มใหม่!)

5. ✅ **Step 5 - Calculation**
   - [ ] คำนวณได้ (มีอยู่แล้ว)

6. ✅ **Step 6 - Results**
   - [ ] ดู results ได้
   - [ ] Export PDF ได้ (เพิ่มใหม่!)

7. ✅ **Step 7 - Hydraulic**
   - [ ] กด "ตรวจสอบใหม่"
   - [ ] เห็น velocity check, pressure check, friction loss check
   - [ ] ข้อมูลมาจาก API จริง (ไม่ใช่ mock!)

8. ✅ **Step 8 - Suggestion**
   - [ ] เห็น auto suggest upsizing
   - [ ] เห็น hybrid pipe sizing
   - [ ] ข้อมูลมาจาก API จริง (ไม่ใช่ mock!)

9. ✅ **Step 9 - Versions**
   - [ ] เปรียบเทียบ versions ได้ (มีอยู่แล้ว)

10. ✅ **Step 10 - Audit**
    - [ ] ดู audit logs ได้ (มีอยู่แล้ว)

---

## 📁 ไฟล์ที่ต้องแก้ทั้งหมด

### Frontend:

1. **`frontend/components/criteria/CriteriaForm.vue`** - สร้างใหม่ ⭐
2. **`frontend/pages/projects/[id]/index.vue`** - แก้ editCriteria + เพิ่ม Modal ⭐
3. **`frontend/pages/projects/[id]/fixtures.vue`** - แก้ editFixture
4. **`frontend/pages/projects/[id]/hydraulic.vue`** - เปลี่ยน mock → API
5. **`frontend/pages/projects/[id]/suggestion.vue`** - เปลี่ยน mock → API
6. **`frontend/pages/projects/[id]/results.vue`** - เปิด export (optional)

### Backend:

7. **`backend/src/routes/projects.ts`** - เช็ก criteria endpoint
8. **`backend/src/routes/calculations.ts`** - เพิ่ม hydraulic, suggestions endpoints (ถ้าจำเป็น)

---

## ✅ วิธีตรวจสอบ

### 1. Admin user จะไม่หาย:
- Email: `admin@cw-pipe-calculator.com`
- Password: `admin123`
- อยู่ใน database: `backend/prisma/dev.db`
- แก้ code ไม่กระทบ database

### 2. Demo project:
- Project "บ้านลาดพร้าว 2 ชั้น" (ID: 8)
- ยังอยู่ใน database
- จะไม่หาย

### 3. ถ้ากลัว:
- Backup database: `backend/prisma/dev.db`
- Copy ไปไว้ที่อื่นก่อน

---

## 🎯 ลำดับการทำงาน

```
Phase 1 (Step 1) → Phase 2 (Step 4) → Phase 3 (Step 7)
     ↓                    ↓                    ↓
  สำคัญที่สุด       ปานกลาง            ปานกลาง

Phase 4 (Step 8) → Phase 5 (Step 6) → Phase 6 (ทดสอบ)
     ↓                    ↓                    ↓
  เล็กน้อย        เล็กน้อย          ทดสอบทั้งหมด
```

---

## 🚀 เริ่มทำได้เลย!

ถ้าอนุมัติ plan นี้:
1. เริ่มที่ Phase 1 (Step 1 - Parameters) ก่อน
2. สร้าง CriteriaForm component
3. แก้ editCriteria() ให้เปิด Modal
4. ทดสอบ Step 1
5. ไล่ Phase ถัดไปเรื่อยๆ
6. ทดสอบทั้งหมด 10 steps ท้ายสุด

---

*สร้างเมื่อ: 2026-03-31*
*อัปเดตล่าสุด: หลังสำรวจทั้ง 10 steps*
