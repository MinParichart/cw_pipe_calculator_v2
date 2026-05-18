# Unit Test Cases (UTC) - CW Pipe Calculator v2

## 📋 Overview

Unit tests สำหรับ CW Pipe Calculator v2 แบ่งเป็น 4 หมวดหลัก:
1. **UTC-1xx**: Utility Functions (คำนวณ, conversion)
2. **UTC-2xx**: Store/State Management (Pinia stores)
3. **UTC-3xx**: Vue Components (UI components)
4. **UTC-4xx**: API Services (backend integration)

---

## UTC-1xx: Utility Functions

### UTC-101: calculateFU() - คำนวณ Fixture Units
**File:** `utils/calculateFU.ts`

**Test Cases:**
- UTC-101.01: Lavatory × 1 → FU = 1
- UTC-101.02: Lavatory × 5 → FU = 5
- UTC-101.03: WC_TANK × 1 → FU = 3
- UTC-101.04: WC_TANK × 2 → FU = 6
- UTC-101.05: Lavatory × 2 + WC_TANK × 1 → FU = 5
- UTC-101.06: Kitchen Sink × 1 → FU = 2
- UTC-101.07: Hose Bibb × 1 → FU = 0 (special case)
- UTC-101.08: Shower × 1 → FU = 2
- UTC-101.09: Multiple fixtures → FU รวมถูกต้อง
- UTC-101.10: Empty fixtures → FU = 0
- UTC-101.11: Invalid fixture type → throw error
- UTC-101.12: Negative quantity → throw error

### UTC-102: calculateGPM() - แปลง FU เป็น GPM
**File:** `utils/calculateGPM.ts`

**Test Cases:**
- UTC-102.01: FU = 1 → GPM ≈ 3.0 (use Hunter's Curve)
- UTC-102.02: FU = 5 → GPM ≈ 8.0
- UTC-102.03: FU = 10 → GPM ≈ 12.0
- UTC-102.04: FU = 100 → GPM ≈ 48.0
- UTC-102.05: FU = 0 → GPM = 0
- UTC-102.06: Negative FU → throw error
- UTC-102.07: Non-integer FU → handle decimal

### UTC-103: calculateVelocity() - คำนวณความเร็วน้ำ
**File:** `utils/calculateVelocity.ts`

**Test Cases:**
- UTC-103.01: GPM=10, Diameter=25mm → velocity ≈ 0.6 m/s
- UTC-103.02: GPM=20, Diameter=25mm → velocity ≈ 1.2 m/s
- UTC-103.03: GPM=30, Diameter=50mm → velocity ≈ 0.8 m/s
- UTC-103.04: GPM=0 → velocity = 0
- UTC-103.05: Diameter=0 → throw error
- UTC-103.06: Check velocity bounds (0.6 - 3.0 m/s)

### UTC-104: getPipeSize() - หาขนาดท่อที่เหมาะสม
**File:** `utils/getPipeSize.ts`

**Test Cases:**
- UTC-104.01: GPM=5 → Pipe = 15mm (1/2")
- UTC-104.02: GPM=12 → Pipe = 20mm (3/4")
- UTC-104.03: GPM=20 → Pipe = 25mm (1")
- UTC-104.04: GPM=40 → Pipe = 32mm (1.25")
- UTC-104.05: GPM=70 → Pipe = 40mm (1.5")
- UTC-104.06: GPM=120 → Pipe = 50mm (2")
- UTC-104.07: GPM=0 → throw error
- UTC-104.08: Very high GPM → largest pipe

### UTC-105: getCFactor() - ดึงค่า C-Factor ตาม PVC Class
**File:** `utils/getCFactor.ts`

**Test Cases:**
- UTC-105.01: PVC Class 10 → C = 130
- UTC-105.02: PVC Class 15 → C = 140
- UTC-105.03: PVC Class 20 → C = 150
- UTC-105.04: Invalid class → throw error
- UTC-105.05: Non-integer class → throw error

### UTC-106: formatVelocity() - จัดรูปแบบ velocity
**File:** `utils/formatVelocity.ts`

**Test Cases:**
- UTC-106.01: 1.23456 → "1.23 m/s"
- UTC-106.02: 0.6 → "0.60 m/s" (min threshold)
- UTC-106.03: 3.0 → "3.00 m/s" (max threshold)
- UTC-106.04: 0.5 → "0.50 m/s ⚠️ LOW"
- UTC-106.05: 3.5 → "3.50 m/s ⚠️ HIGH"
- UTC-106.06: 0 → "0.00 m/s"

### UTC-107: parseDXF() - อ่านไฟล์ DXF
**File:** `utils/parseDXF.ts`

**Test Cases:**
- UTC-107.01: Valid DXF file → parse successfully
- UTC-107.02: DXF with walls → extract wall coordinates
- UTC-107.03: DXF with layers → extract layer data
- UTC-107.04: Invalid DXF format → throw error
- UTC-107.05: Empty DXF → return empty object

---

## UTC-2xx: Store/State Management

### UTC-201: Project Store - จัดการ Project state
**File:** `stores/projectStore.ts`

**Test Cases:**
- UTC-201.01: Initial state → projects = []
- UTC-201.02: fetchProjects() → load projects from API
- UTC-201.03: createProject() → add to state
- UTC-201.04: updateProject() → update in state
- UTC-201.05: deleteProject() → remove from state
- UTC-201.06: setCurrentProject() → update currentProject
- UTC-201.07: API error → handle gracefully
- UTC-201.08: Loading state → loading = true/false

### UTC-202: Version Store - จัดการ Version state
**File:** `stores/versionStore.ts`

**Test Cases:**
- UTC-202.01: Initial state → versions = []
- UTC-202.02: fetchVersions(projectId) → load versions
- UTC-202.03: createVersion() → add to state
- UTC-202.04: updateVersion() → update in state
- UTC-202.05: deleteVersion() → remove from state
- UTC-202.06: setCurrentVersion() → update currentVersion
- UTC-202.07: compareVersions(v1, v2) → set comparison data
- UTC-202.08: Duplicate version → clone with new ID

### UTC-203: Network Store - จัดการ Network diagram
**File:** `stores/networkStore.ts`

**Test Cases:**
- UTC-203.01: Initial state → nodes = [], pipes = []
- UTC-203.02: addNode() → add to nodes array
- UTC-203.03: updateNode() → update node in array
- UTC-203.04: deleteNode() → remove from array
- UTC-203.05: addPipe() → add to pipes array
- UTC-203.06: updatePipe() → update pipe in array
- UTC-203.07: deletePipe() → remove from array
- UTC-203.08: clearNetwork() → reset all arrays
- UTC-203.09: saveNetwork() → serialize to JSON
- UTC-203.10: loadNetwork() → deserialize from JSON

### UTC-204: Fixture Store - จัดการ Fixtures
**File:** `stores/fixtureStore.ts`

**Test Cases:**
- UTC-204.01: Initial state → fixtures = {}
- UTC-204.02: assignFixture(nodeId, fixture) → add to fixtures
- UTC-204.03: removeFixture(nodeId, type) → remove from fixtures
- UTC-204.04: getFixturesByNode(nodeId) → return node fixtures
- UTC-204.05: calculateTotalFU(nodeId) → sum FU
- UTC-204.06: clearAllFixtures() → reset state
- UTC-204.07: Duplicate fixture → update quantity

### UTC-205: Calculation Store - จัดการ Calculation results
**File:** `stores/calculationStore.ts`

**Test Cases:**
- UTC-205.01: Initial state → results = null
- UTC-205.02: runCalculation() → execute calc engine
- UTC-205.03: saveResults() → store in snapshotResults
- UTC-205.04: clearResults() → reset state
- UTC-205.05: getSuggestedSize() → return pipe suggestion
- UTC-205.06: applySuggestion() → update pipe size
- UTC-205.07: isVelocityCritical() → check threshold
- UTC-205.08: Calculation error → handle gracefully

### UTC-206: Auth Store - จัดการ Authentication
**File:** `stores/authStore.ts`

**Test Cases:**
- UTC-206.01: Initial state → user = null, token = null
- UTC-206.02: login(email, password) → set user and token
- UTC-206.03: logout() → clear user and token
- UTC-206.04: register() → create new user
- UTC-206.05: isAuthenticated → return boolean
- UTC-206.06: Login error → handle gracefully
- UTC-206.07: Token persistence → save to localStorage

---

## UTC-3xx: Vue Components

### UTC-301: ProjectCard Component
**File:** `components/ProjectCard.vue`

**Test Cases:**
- UTC-301.01: Render project name
- UTC-301.02: Render project description
- UTC-301.03: Click card → emit select event
- UTC-301.04: Delete button → emit delete event
- UTC-301.05: Show version count
- UTC-301.06: Show creation date

### UTC-302: VersionCard Component
**File:** `components/VersionCard.vue`

**Test Cases:**
- UTC-302.01: Render version number
- UTC-302.02: Render version name
- UTC-302.03: Show "Current" badge if isCurrent
- UTC-302.04: Click card → emit select event
- UTC-302.05: Delete button → emit delete event
- UTC-302.06: Duplicate button → emit duplicate event

### UTC-303: NetworkBuilder Component
**File:** `components/NetworkBuilder.vue`

**Test Cases:**
- UTC-303.01: Render canvas
- UTC-303.02: Add Source button → emit addSource event
- UTC-303.03: Add Junction button → emit addJunction event
- UTC-303.04: Add Pipe button → emit addPipe event
- UTC-303.05: Save button → emit save event
- UTC-303.06: Undo button → emit undo event
- UTC-303.07: Redo button → emit redo event
- UTC-303.08: Delete button → emit delete event
- UTC-303.09: Zoom in/out → update scale
- UTC-303.10: Pan canvas → update offset

### UTC-304: FixtureForm Component
**File:** `components/FixtureForm.vue`

**Test Cases:**
- UTC-304.01: Render all fixture inputs
- UTC-304.02: Update quantity → update value
- UTC-304.03: Calculate total FU → display correct sum
- UTC-304.04: Save button → emit save event
- UTC-304.05: Cancel button → emit cancel event
- UTC-304.06: Invalid input → show error
- UTC-304.07: Load fixtures → populate form

### UTC-305: CalculationResult Component
**File:** `components/CalculationResult.vue`

**Test Cases:**
- UTC-305.01: Render pipe table
- UTC-305.02: Show FU column
- UTC-305.03: Show GPM column
- UTC-305.04: Show velocity column
- UTC-305.05: Show pipe size column
- UTC-305.06: Highlight critical velocity (red)
- UTC-305.07: Show suggestion button
- UTC-305.08: Apply suggestion → update pipe size
- UTC-305.09: Export button → emit export event

### UTC-306: ReportViewer Component
**File:** `components/ReportViewer.vue`

**Test Cases:**
- UTC-306.01: Render report title
- UTC-306.02: Show criteria section
- UTC-306.03: Show critical path table
- UTC-306.04: Show branch pipe table
- UTC-306.05: Print button → call window.print()
- UTC-306.06: Export PDF button → emit export event
- UTC-306.07: No results → show "ยังไม่มีผลการคำนวณ"

### UTC-307: VersionComparison Component
**File:** `components/VersionComparison.vue`

**Test Cases:**
- UTC-307.01: Render version selectors
- UTC-307.02: Select version 1 and 2
- UTC-307.03: Show diff table
- UTC-307.04: Highlight changed values
- UTC-307.05: Show added fixtures (+)
- UTC-307.06: Show removed fixtures (-)
- UTC-307.07: Network diagram side-by-side

### UTC-308: BlueprintUpload Component
**File:** `components/BlueprintUpload.vue`

**Test Cases:**
- UTC-308.01: Select file input
- UTC-308.02: Upload JPEG → show preview
- UTC-308.03: Upload PNG → show preview
- UTC-308.04: Upload PDF → show error
- UTC-308.05: Upload button → emit upload event
- UTC-308.06: Delete button → emit delete event
- UTC-308.07: Show file name
- UTC-308.08: Show file size

### UTC-309: CriteriaForm Component
**File:** `components/CriteriaForm.vue`

**Test Cases:**
- UTC-309.01: Render all criteria inputs
- UTC-309.02: C-factor input → validate range
- UTC-309.03: Velocity min/max → validate range
- UTC-309.04: Building type selector
- UTC-309.05: System type selector
- UTC-309.06: Save button → emit save event
- UTC-309.07: Invalid input → show error

### UTC-310: LoginForm Component
**File:** `components/LoginForm.vue`

**Test Cases:**
- UTC-310.01: Render email and password inputs
- UTC-310.02: Submit with valid credentials → emit login event
- UTC-310.03: Submit with invalid credentials → show error
- UTC-310.04: Empty email → show validation error
- UTC-310.05: Empty password → show validation error
- UTC-310.06: "Remember me" checkbox → toggle state
- UTC-310.07: "Forgot password" link → emit forgot event

---

## UTC-4xx: API Services

### UTC-401: Project API
**File:** `services/projectApi.ts`

**Test Cases:**
- UTC-401.01: GET /projects → return project list
- UTC-401.02: GET /projects/:id → return single project
- UTC-401.03: POST /projects → create new project
- UTC-401.04: PUT /projects/:id → update project
- UTC-401.05: DELETE /projects/:id → delete project
- UTC-401.06: 404 error → handle gracefully
- UTC-401.07: Network error → retry logic
- UTC-401.08: Authentication error → redirect to login

### UTC-402: Version API
**File:** `services/versionApi.ts`

**Test Cases:**
- UTC-402.01: GET /projects/:id/versions → return version list
- UTC-402.02: GET /projects/:id/versions/:versionId → return single version
- UTC-402.03: POST /projects/:id/versions → create version
- UTC-402.04: PUT /projects/:id/versions/:versionId → update version
- UTC-402.05: DELETE /projects/:id/versions/:versionId → delete version
- UTC-402.06: POST /projects/:id/versions/:versionId/duplicate → clone version

### UTC-403: Network API
**File:** `services/networkApi.ts`

**Test Cases:**
- UTC-403.01: GET /projects/:id/versions/:versionId/network → return network JSON
- UTC-403.02: POST /projects/:id/versions/:versionId/network → save network
- UTC-403.03: Invalid network JSON → return 400 error
- UTC-403.04: Large network → handle payload size

### UTC-404: Fixture API
**File:** `services/fixtureApi.ts`

**Test Cases:**
- UTC-404.01: GET /projects/:id/versions/:versionId/fixtures → return fixtures
- UTC-404.02: POST /projects/:id/versions/:versionId/fixtures → save fixtures
- UTC-404.03: Invalid fixture data → return 400 error
- UTC-404.04: Calculate FU endpoint → return FU sum

### UTC-405: Calculation API
**File:** `services/calculationApi.ts`

**Test Cases:**
- UTC-405.01: POST /projects/:id/versions/:versionId/calculate → run calculation
- UTC-405.02: Return pipe results with FU, GPM, velocity
- UTC-405.03: Return suggestions for critical pipes
- UTC-405.04: Save results to snapshotResults
- UTC-405.05: Invalid network → return 400 error
- UTC-405.06: Calculation timeout → handle gracefully

### UTC-406: Auth API
**File:** `services/authApi.ts`

**Test Cases:**
- UTC-406.01: POST /auth/register → create user
- UTC-406.02: POST /auth/login → return token
- UTC-406.03: POST /auth/logout → clear token
- UTC-406.04: GET /auth/me → return current user
- UTC-406.05: Invalid credentials → return 401 error
- UTC-406.06: Duplicate email → return 409 error

### UTC-407: File Upload API
**File:** `services/fileApi.ts`

**Test Cases:**
- UTC-407.01: POST /upload → upload file
- UTC-407.02: Upload JPEG → return file URL
- UTC-407.03: Upload PNG → return file URL
- UTC-407.04: Upload PDF → return error
- UTC-407.05: File too large → return 413 error
- UTC-407.06: Invalid file type → return 400 error

### UTC-408: Report API
**File:** `services/reportApi.ts`

**Test Cases:**
- UTC-408.01: GET /projects/:id/versions/:versionId/report → return report data
- UTC-408.02: Include criteria in report
- UTC-408.03: Include critical path in report
- UTC-408.04: Include branch pipes in report
- UTC-408.05: Export PDF endpoint → return PDF buffer

---

## 📊 Summary

**Total Test Cases:**
- UTC-1xx (Utilities): 50+ tests
- UTC-2xx (Stores): 40+ tests
- UTC-3xx (Components): 60+ tests
- UTC-4xx (APIs): 40+ tests

**Grand Total: 190+ unit tests**

---

## 🎯 Priority Order

**Phase 1 (High Priority):**
1. UTC-1xx: Utilities (คำนวณสำคัญที่สุด)
2. UTC-2xx: Stores (state management)

**Phase 2 (Medium Priority):**
3. UTC-4xx: API Services (backend integration)
4. UTC-3xx: Components (UI testing)

---

## 📝 Notes

- Utilities tests ควรทำก่อนเพราะเป็นพื้นฐานการคำนวณ
- Store tests สำคัญเพราะ manage state ทั้งระบบ
- Component tests ใช้ Vue Test Utils + Vitest
- API tests ใช้ MSW (Mock Service Worker) หรือ Nock
- ทุก test ควรมี coverage > 80%
