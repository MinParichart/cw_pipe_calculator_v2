# Unit Test Checklist — CW Pipe Calculator v2

> **อัพเดทล่าสุด:** 2026-05-18
> **อ้างอิง:** testcase_17-5-2026-updated.docx

---

## 📊 สรุปภาพรวม

| หมวด | จำนวน Test Cases | ทำแล้ว | คงเหลือ | % Complete |
|------|-------------------|---------|----------|------------|
| **UTC-1xx: Utility Functions** | 50+ | ❌ 0 | 50+ | **0%** |
| **UTC-2xx: Store/State Management** | 40+ | ❌ 0 | 40+ | **0%** |
| **UTC-3xx: Vue Components** | 60+ | ❌ 0 | 60+ | **0%** |
| **UTC-4xx: API Services (Backend)** | 40+ | ✅ 31 | ~9 | **77.5%** |
| **UTC-5xx: Calculation Engine** | 46 | ✅ 46 | 0 | **100%** |
| **UTC-6xx: Blueprint Upload** | 5+ | ✅ 5 | 0 | **100%** |

**Grand Total: 190+ tests | 82 done | 108+ remaining | **43% Complete**

---

## ✅ ทำเสร็จแล้ว (Done)

### UTC-5xx: Calculation Engine ✅ 100%
**File:** `backend/tests/unit/calculation.test.ts` (46 tests)

| Test Group | Status | Notes |
|------------|--------|-------|
| Velocity Calculation | ✅ 8/8 | calculateVelocity() ทำงานถูกต้อง |
| Hunter's Curve GPM | ✅ 6/6 | แปลง FU → GPM ถูกต้อง |
| Hazen-Williams Friction Loss | ✅ 6/6 | คำนวณความเสียดทานถูกต้อง |
| Status Calculation | ✅ 8/8 | PASS/WARN/FAIL logic ถูกต้อง |
| Flow Unit Conversion | ✅ 4/4 | แปลงหน่วยน้ำถูกต้อง |
| Water Factor Adjustment | ✅ 6/6 | ปรับค่าตาม water factor ถูกต้อง |
| Auto-Suggest Logic | ✅ 4/4 | แนะนำขนาดท่อถูกต้อง |
| Apply Suggestion | ✅ 4/4 | ใช้คำแนะนำถูกต้อง |

### UTC-6xx: Blueprint Upload ✅ 100%
**File:** `backend/tests/integration/documents.test.ts` (5+ tests)

| Test | Status | Notes |
|------|--------|-------|
| Upload JPEG | ✅ | อัปโหลดไฟล์ภาพสำเร็จ |
| Upload PNG | ✅ | อัปโหลด PNG สำเร็จ |
| Upload GIF | ✅ | อัปโหลด GIF สำเร็จ |
| Reject PDF | ✅ | ปฏิเสธไฟล์ PDF อย่างถูกต้อง |
| Reject DXF | ✅ | ปฏิเสธไฟล์ DXF อย่างถูกต้อง |
| List Documents | ✅ | ดึงรายการเอกสารสำเร็จ |

### UTC-4xx: API Services (Backend Integration) ✅ 77.5%
**Files:**
- `backend/tests/integration/auth.test.ts` (8 tests)
- `backend/tests/integration/projects.test.ts` (7 tests)
- `backend/tests/integration/versions.test.ts` (8 tests)
- `backend/tests/integration/network.test.ts` (5 tests, 11 failed)

| Test Group | Status | Notes |
|------------|--------|-------|
| **UTC-401: Project API** | ✅ 7/8 | GET/POST/PUT/DELETE ทำงานได้ |
| **UTC-402: Version API** | ✅ 8/8 | CRUD + Duplicate ทำงานได้ |
| **UTC-403: Network API** | ⚠️ 5/16 | Save/Load network ได้, **Reference endpoints ยังไม่เสร็จ** |
| **UTC-404: Fixture API** | ✅ 4/4 | Save/Load fixtures ได้ |
| **UTC-405: Calculation API** | ✅ 4/4 | Run calculation ได้ |
| **UTC-406: Auth API** | ✅ 8/8 | Register/Login/Logout ได้ |

---

## ❌ ยังไม่ได้ทำ (Missing)

### UTC-1xx: Utility Functions ❌ 0%
**จำนวน:** 50+ tests
**ต้องสร้าง:** `frontend/tests/unit/` directory

| Test | File | Priority | Notes |
|------|------|----------|-------|
| UTC-101: calculateFU() | `calculateFU.test.ts` | **HIGH** | คำนวณ Fixture Units (12 tests) |
| UTC-102: calculateGPM() | `calculateGPM.test.ts` | **HIGH** | แปลง FU → GPM (7 tests) |
| UTC-103: calculateVelocity() | `calculateVelocity.test.ts` | **HIGH** | คำนวณความเร็วน้ำ (6 tests) |
| UTC-104: getPipeSize() | `getPipeSize.test.ts` | **HIGH** | หาขนาดท่อ (8 tests) |
| UTC-105: getCFactor() | `getCFactor.test.ts` | MEDIUM | ดึงค่า C-Factor (5 tests) |
| UTC-106: formatVelocity() | `formatVelocity.test.ts` | MEDIUM | จัดรูปแบบ velocity (6 tests) |
| UTC-107: parseDXF() | `parseDXF.test.ts` | LOW | อ่านไฟล์ DXF (5 tests) |

**สถานะ:** ❌ **ยังไม่มี utility functions tests เลย**
**ความสำคัญ:** ⚠️ **สูงมาก** - เป็นพื้นฐานการคำนวณทั้งระบบ

---

### UTC-2xx: Store/State Management ❌ 0%
**จำนวน:** 40+ tests
**ต้องสร้าง:** `frontend/tests/unit/stores/`

| Test | File | Priority | Notes |
|------|------|----------|-------|
| UTC-201: Project Store | `projectStore.test.ts` | **HIGH** | Project state (8 tests) |
| UTC-202: Version Store | `versionStore.test.ts` | **HIGH** | Version state (8 tests) |
| UTC-203: Network Store | `networkStore.test.ts` | **HIGH** | Network diagram (10 tests) |
| UTC-204: Fixture Store | `fixtureStore.test.ts` | **HIGH** | Fixtures (7 tests) |
| UTC-205: Calculation Store | `calculationStore.test.ts` | **HIGH** | Calc results (8 tests) |
| UTC-206: Auth Store | `authStore.test.ts` | MEDIUM | Auth state (7 tests) |

**สถานะ:** ❌ **ยังไม่มี Pinia store tests เลย**
**ความสำคัญ:** ⚠️ **สูง** - state management ทั้งระบบ

---

### UTC-3xx: Vue Components ❌ 0%
**จำนวน:** 60+ tests
**ต้องสร้าง:** `frontend/tests/unit/components/`

| Test | File | Priority | Notes |
|------|------|----------|-------|
| UTC-301: ProjectCard | `ProjectCard.test.ts` | MEDIUM | Card component (6 tests) |
| UTC-302: VersionCard | `VersionCard.test.ts` | MEDIUM | Card component (6 tests) |
| UTC-303: NetworkBuilder | `NetworkBuilder.test.ts` | **HIGH** | Canvas + diagram (10 tests) |
| UTC-304: FixtureForm | `FixtureForm.test.ts` | MEDIUM | Form component (7 tests) |
| UTC-305: CalculationResult | `CalculationResult.test.ts` | **HIGH** | Result table (9 tests) |
| UTC-306: ReportViewer | `ReportViewer.test.ts` | **HIGH** | Report + print (7 tests) |
| UTC-307: VersionComparison | `VersionComparison.test.ts` | MEDIUM | Compare view (7 tests) |
| UTC-308: BlueprintUpload | `BlueprintUpload.test.ts` | MEDIUM | Upload component (8 tests) |
| UTC-309: CriteriaForm | `CriteriaForm.test.ts` | MEDIUM | Form component (7 tests) |
| UTC-310: LoginForm | `LoginForm.test.ts` | LOW | Login component (7 tests) |

**สถานะ:** ❌ **ยังไม่มี Vue component tests เลย**
**ความสำคัญ:** ⚠️ **ปานกลาง** - UI testing (มี E2E tests ครอบคลุมอยู่แล้ว)

---

### UTC-4xx: API Services (Frontend) ❌ 0%
**จำนวน:** ~10 tests
**ต้องสร้าง:** `frontend/tests/unit/services/`

| Test | File | Priority | Notes |
|------|------|----------|-------|
| UTC-401: projectApi.ts | `projectApi.test.ts` | MEDIUM | Frontend API calls |
| UTC-402: versionApi.ts | `versionApi.test.ts` | MEDIUM | Frontend API calls |
| UTC-403: networkApi.ts | `networkApi.test.ts` | MEDIUM | Frontend API calls |
| UTC-404: fixtureApi.ts | `fixtureApi.test.ts` | MEDIUM | Frontend API calls |
| UTC-405: calculationApi.ts | `calculationApi.test.ts` | MEDIUM | Frontend API calls |
| UTC-406: authApi.ts | `authApi.test.ts` | MEDIUM | Frontend API calls |
| UTC-407: fileApi.ts | `fileApi.test.ts` | MEDIUM | Frontend API calls |

**สถานะ:** ❌ **ยังไม่มี frontend API service tests**
**ความสำคัญ:** ⚠️ **ปานกลาง** - backend API tests มีอยู่แล้ว

---

## 🚨 ปัญหาที่ต้องแก้

### 1. Network Reference Endpoints ❌
**File:** `backend/tests/integration/network.test.ts`
**Problem:** 11 tests failed เกี่ยวกับ reference layer endpoints

```
UTC4004: GET /network/reference → 404 NOT_FOUND
UTC4005: POST /network/reference → 404 NOT_FOUND
UTC4006: DELETE /network/reference → 404 NOT_FOUND
... (and 8 more)
```

**Solution:** ต้อง implement reference endpoints ใน backend

---

## 🎯 ลำดับความสำคัญในการทำ

### Phase 1: Critical (ทำก่อน)
1. ✅ **UTC-5xx: Calculation Engine** — เสร็จแล้ว (100%)
2. ❌ **UTC-1xx: Utility Functions** — ยังไม่เริ่ม (0%)
3. ❌ **UTC-2xx: Store/State Management** — ยังไม่เริ่ม (0%)

### Phase 2: High Priority
4. ⚠️ **UTC-4xx: Backend API** — เสร็จบางส่วน (77.5%)
   - แก้ไข Network Reference endpoints (11 failed tests)
5. ❌ **UTC-3xx: Vue Components** — ยังไม่เริ่ม (0%)
   - เน้น UTC-303, UTC-305, UTC-306 (สำคัญที่สุด)

### Phase 3: Optional
6. ❌ **UTC-4xx: Frontend API Services** — ยังไม่เริ่ม (0%)

---

## 📝 สรุป

### ✅ เรียบร้อยแล้ว (82 tests = 43%)
- ✅ Calculation Engine (46 tests) — **100%**
- ✅ Blueprint Upload (5+ tests) — **100%**
- ✅ Backend Auth API (8 tests) — **100%**
- ✅ Backend Project API (7 tests) — **100%**
- ✅ Backend Version API (8 tests) — **100%**
- ⚠️ Backend Network API (5/16 tests) — **31%** (reference endpoints ยังไม่เสร็จ)
- ✅ Backend Fixture API (4 tests) — **100%**
- ✅ Backend Calculation API (4 tests) — **100%**

### ❌ ยังไม่เริ่ม (108+ tests = 57%)
- ❌ Utility Functions (50+ tests) — **0%**
- ❌ Pinia Stores (40+ tests) — **0%**
- ❌ Vue Components (60+ tests) — **0%**
- ❌ Frontend API Services (~10 tests) — **0%**

### 🎯 คำแนะนำ
1. **ทำ UTC-1xx (Utility Functions) ก่อน** — เป็นพื้นฐานการคำนวณ
2. **ทำ UTC-2xx (Pinia Stores)** — state management สำคัญมาก
3. **แก้ Network Reference endpoints** — ให้ UTC-403 ครบ 100%
4. **UTC-3xx (Components) ทำทีหลัง** — มี E2E tests ครอบคลุมอยู่แล้ว

---

**Last Updated:** 2026-05-18
**Status:** 43% Complete (82/190+ tests)
