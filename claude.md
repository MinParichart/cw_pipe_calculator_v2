# CW Pipe Calculator v2

## 📋 วัตถุประสงค์

**ปัญหาของ v1:**
- Network ผูกติดกับ Project (1:1)
- ทำให้ Version ต่างๆ ไม่สามารถมี Network Diagram ที่แตกต่างกันได้
- Version ไม่มีเอกลัดของตัวเอง → เปรียบเทียบได้ยาก

**วัตถุประสงค์ของ v2:**
- ✅ **Version-Centric Architecture** - แต่ละ Version มี Network, Fixtures, Calculation Results เป็นของตัวเอง
- ✅ **Snapshot System** - เก็บสถานะของ Network ทุกจุดเปลี่ยน
- ✅ **Version Comparison** - เปรียบเทียบ Network Diagram, Fixtures, Calculation ระหว่าง 2 Versions ได้
- ✅ **Auto-Versioning** - สร้าง Version อัตโนมัติเมื่อทำงานที่แต่ละ Step เสร็จ

---

## 🔄 สิ่งที่เปลี่ยนจาก v1

### **Database Architecture**

#### **v1 (Project-Centric)**
```
Project (1)
└── Network (1)
    └── Version (N) ❌
```

#### **v2 (Version-Centric)**
```
Project (1)
├── Criteria (1:1)
│   └── ใช้ร่วมกันทุก Version
│
└── Version (N)
    ├── SnapshotNetwork (JSON) ✅
    ├── SnapshotFixtures (JSON) ✅
    ├── SnapshotResults (JSON) ✅
    └── ReferenceLayer (JSON) ✅
```

### **Workflow ใหม่**

#### **v1 Workflow**
```
Step 1: Parameters → เก็บที่ Project
Step 2: Upload
Step 3: Network Builder → เก็บที่ Project.Network
Step 4: Fixtures → เก็บที่ Project.Network
Step 5: Calculate → เก็บที่ Project.Network
Step 6: Versions → User กด save version เอง
```

#### **v2 Workflow**
```
1. Create Project
2. Set Design Criteria (ระดับ Project - ใช้ร่วมกันทุก Version)

3. Create Version (empty) → Version 1
4. Upload File (reference สำหรับ Version 1)
5. Network Builder → วาด diagram → Save to Version 1
6. Fixtures Setup → Save to Version 1
7. Calculate → Save results to Version 1

8. Create Version (empty) → Version 2
9. Upload File (reference สำหรับ Version 2)
10. Network Builder → วาด diagram แบบใหม่ → Save to Version 2
11. Fixtures Setup → Save to Version 2
12. Calculate → Save results to Version 2

13. Compare Versions (Step 8 ใหม่)
    - เลือก Version 1 vs Version 2
    - แสดง Network Diagram side-by-side
    - แสดง Fixtures diff
    - แสดง Calculation results diff
```

---

## 🗂️ Database Schema Changes

### **Prisma Schema (v2)**

```prisma
model Project {
  id          String   @id @default(uuid())
  name        String
  description String?
  criteria    Criteria? @relation(fields: [criteriaId], references: [id])
  criteriaId  String?  @unique

  // ✅ v2: One-to-Many relationship
  versions    Version[]

  // ❌ v1: เอาออก (ไม่มี Network ตรงๆ)
  // networks    Network[]
}

model Criteria {
  id              String   @id @default(uuid())
  projectId       String   @unique
  project         Project  @relation(fields: [projectId], references: [id])

  cFactor         Int
  velocityMin     Float
  velocityMax     Float
  velocityRec     Float
  systemType      String
  buildingType    String
  staticHead      Float
  minorLossFactor Float
  pvcClass        Int

  createdAt       DateTime @default(now())
  updatedAt       DateTime @updatedAt
}

// ✅ v2: New Model
model Version {
  id                String   @id @default(uuid())
  projectId         String
  project           Project  @relation(fields: [projectId], references: [id], onDelete: Cascade)

  versionNumber     Int
  name              String
  description       String?
  isCurrent         Boolean  @default(false)

  // ✅ v2: Snapshot Data (JSON)
  snapshotNetwork    String?  // JSON: Network diagram data
  snapshotFixtures   String?  // JSON: Fixtures data
  snapshotResults    String?  // JSON: Calculation results
  referenceLayer     String?  // JSON: Reference nodes/walls from DXF

  createdBy         String?
  createdAt         DateTime @default(now())
  updatedAt         DateTime @updatedAt

  // Relations
  auditLogs         AuditLog[]
}

// ❌ v1: เอาออก (Network ผูกกับ Project)
// model Network {
//   id       String
//   projectId String
//   project  Project @relation(...)
// }

model AuditLog {
  id          String   @id @default(uuid())
  projectId   String
  versionId   String?  // ✅ v2: Link to Version
  version     Version? @relation(fields: [versionId], references: [id])

  userId      String
  action      String   // CREATE_VERSION, UPDATE_NETWORK, etc.
  entity      String   // VERSION, NETWORK, FIXTURE
  details     String?

  ipAddress   String?
  userAgent   String?
  createdAt   DateTime @default(now())
}
```

---

## 📐 Implementation Phases

### **Phase 1: Database Schema Migration**
- [ ] Create `Version` model
- [ ] Update `Project` model (remove Network)
- [ ] Update `Criteria` model (add to Project)
- [ ] Update `AuditLog` model (add versionId)
- [ ] Write migration script
- [ ] Backup data from v1
- [ ] Migrate to v2 schema

### **Phase 2: Backend API Changes**
- [ ] Create `versionsApi` endpoints
  - `POST /projects/:id/versions` - Create version
  - `GET /projects/:id/versions` - List all versions
  - `GET /projects/:id/versions/:versionId` - Get version
  - `PUT /projects/:id/versions/:versionId` - Update version
  - `DELETE /projects/:id/versions/:versionId` - Delete version
  - `POST /projects/:id/versions/:versionId/restore` - Restore version

- [ ] Update network endpoints (add versionId)
  - `POST /projects/:id/versions/:versionId/network` - Save network
  - `GET /projects/:id/versions/:versionId/network` - Get network

- [ ] Update fixtures endpoints (add versionId)
  - `POST /projects/:id/versions/:versionId/fixtures` - Save fixtures
  - `GET /projects/:id/versions/:versionId/fixtures` - Get fixtures

- [ ] Update calculation endpoints (add versionId)
  - `POST /projects/:id/versions/:versionId/calculate` - Calculate

### **Phase 3: Frontend Changes**

#### **3.1 Update Routes**
```typescript
// pages/projects/[id]/
├── index.vue              // Set criteria + list versions
├── versions/
│   ├── create.vue         // Create new version
│   └── [versionId]/
│       ├── upload.vue      // Upload reference file
│       ├── network.vue     // Network builder (per version)
│       ├── fixtures.vue    // Fixtures setup (per version)
│       ├── calculation.vue // Calculate (per version)
│       └── index.vue       // Version detail
└── compare/
    └── [id].vue           // Compare 2 versions
```

#### **3.2 Components**
- [ ] `VersionSelector.vue` - Dropdown เลือก version ที่จะทำงาน
- [ ] `VersionCard.vue` - Card แสดง version list
- [ ] `NetworkBuilder.vue` - Update รองรับ versionId
- [ ] `VersionComparison.vue` - Compare 2 versions
- [ ] `VersionSwitcher.vue` - Switch ระหว่าง versions

### **Phase 4: Frontend State Management**
```typescript
// stores/versionStore.ts
export const useVersionStore = defineStore('version', {
  state: () => ({
    currentVersionId: ref<string | null>(null),
    versions: ref<Version[]>([]),
  })),

  actions: {
    async createVersion(projectId: string, name: string) { ... },
    async loadVersions(projectId: string) { ... },
    async setCurrentVersion(versionId: string) { ... },
    async saveNetwork(versionId: string, network: any) { ... },
    async saveFixtures(versionId: string, fixtures: any) { ... },
    async saveResults(versionId: string, results: any) { ... },
  }
})
```

---

## 🚀 New Features in v2

### **1. Version Management**
- ✅ Create multiple versions per project
- ✅ Clone existing version
- ✅ Delete version
- ✅ Set current version
- ✅ Switch between versions

### **2. Snapshot System**
- ✅ Auto-save network diagram after each change
- ✅ Auto-save fixtures after each change
- ✅ Auto-save calculation results
- ✅ Manually save checkpoint

### **3. Version Comparison**
- ✅ Select 2 versions to compare
- ✅ Side-by-side network diagram
- ✅ Diff fixtures (added/removed/changed)
- ✅ Diff calculation results
- ✅ Diff summary (total pipes, total fixtures, etc.)

### **4. Reference File per Version**
- ✅ แต่ละ Version มี reference file (DXF) เป็นของตัวเอง
- ✅ Upload reference หลายไฟล์ต่อ version
- ✅ Import reference ใหม่เมื่อ clone version

---

## 📝 Workflow Detail

### **User Journey**

```
1. Create Project
   ↓
2. Set Criteria (velocity, c-factor, etc.) → Save to Project.Criteria
   ↓
3. Create Version 1 (name: "ทาวน์โฮม 2 ชั้น - แบบที่ 1")
   ↓
4. Upload Reference (DXF) → Save to Version 1.ReferenceLayer
   ↓
5. Network Builder (วาดท่อ) → Save to Version 1.SnapshotNetwork
   ↓
6. Add Fixtures → Save to Version 1.SnapshotFixtures
   ↓
7. Calculate → Save to Version 1.SnapshotResults
   ↓
8. Create Version 2 (name: "ทาวน์โฮม 2 ชั้น - แบบที่ 2")
   ↓
9. Upload Reference (อาจจะอัปโหลดไฟล์เดิม) → Save to Version 2.ReferenceLayer
   ↓
10. Network Builder (วาดท่อแบบใหม่) → Save to Version 2.SnapshotNetwork
    ↓
11. Add Fixtures → Save to Version 2.SnapshotFixtures
    ↓
12. Calculate → Save to Version 2.SnapshotResults
    ↓
13. Compare Versions (เลือก Version 1 vs Version 2)
    - Show network diagrams side-by-side
    - Show fixtures diff
    - Show calculation results diff
    - Show summary (pipe count difference, fixture count difference, etc.)
```

---

## 🎯 Key Decisions

### **Decision 1: Snapshot Format**
- **Store as JSON** (not binary)
- **Pros:** ง่ายต่อการ migrate, query, แก้ไข
- **Cons:** ไฟล์ใหญ่ถ้า network ใหญ่มาก

### **Decision 2: Auto-Versioning**
- **Optional auto-save** ทุก step หรือ **manual save**?
- **Recommendation:** Manual save เท่าน เพราะ:
  - User ควบคุมได้ว่าจะ save version เมื่อไหร่
  - ไม่สร้าง version ซ้ำซ้อนที่ไม่จำเป็น
  - ประหยัด database space

### **Decision 3: Reference File**
- **Per-version reference** หรือ **shared reference**?
- **Decision:** Per-version reference (Version.ReferenceLayer)
- **Why:** แต่ละ version มี reference เป็นของตัวเองเต็มที่

---

## 🔧 Port Configuration

เพื่อกันชนกับ v1:

```env
# v1
DATABASE_URL=file:../backend/prisma/dev.db
FRONTEND_PORT=3000
BACKEND_PORT=3001

# v2 (ใช้ port อื่น)
DATABASE_URL=file:../backend_v2/prisma/dev.db
FRONTEND_PORT=3002
BACKEND_PORT=3003
```

---

## 📅 Timeline Estimation

- Phase 1: Database Schema - 2-3 วัน
- Phase 2: Backend API - 4-5 วัน
- Phase 3: Frontend UI - 5-7 วัน
- Phase 4: Testing & Bug Fix - 3-5 วัน

**รวมทั้งสิ้น: 14-20 วัน**

---

## 📚 Reference Documents

- `pipe_calculator_system.md` - ระบบคำนวณขนาดท่อ
- `FlowRefer Modify.csv` - ตารางค่าคงที่
- `Flow1RoomFull Modify.csv` - ตัวอย่างการคำนวณ
- Memory files in `.claude/projects/D--41-IS-Thesis-cw-pipe-calculator/memory/`

---

## ⚠️ Notes

1. **v1 ยังคงใช้ได้** - ไม่ต้องลบ
2. **v2 เป็น development branch** - ทดลองก่อนใช้จริง
3. **Data Migration** - ต้องมี script migrate data จาก v1 → v2
4. **Testing** - ทดสอบทุก feature ใหม่ละเอียด
5. **Rollback Plan** - ถ้า v2 มีปัญหา ต้อง rollback ได้

---

## 🤖 AI Assistant Context

คุณคือ **Claude Code** - AI Programming Assistant

เป้าหมายของคุณ:
- ช่วยออกแบบ database schema
- ช่วยเขียน API endpoints
- ช่วยสร้าง frontend components
- ช่วย debug และ fix issues
- ช่วย optimize performance

**คำถาม:**
- ระบบ version control ทำงานอย่างไร?
- อยากเปรียบเทียบ version อย่างไร?
- มี bug ตรงไหน ช่วยดูหน่อย
- อยากเพิ่ม feature อะไร บอกมา

---

**Last Updated:** 2026-04-23
**Version:** 2.0.0-alpha
**Status:** Development Phase
