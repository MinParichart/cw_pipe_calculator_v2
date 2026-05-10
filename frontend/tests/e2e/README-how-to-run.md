# วิธีรัน Tests ทั้งหมด

## 1. ติดตั้ง Dependencies

```bash
# Backend (Unit + Integration Tests)
cd cw_pipe_calculator_v2/backend
npm install

# Frontend (System Tests E2E)
cd ../frontend
npm install
npx playwright install chromium
```

## 2. Unit + Integration Tests (Vitest + Supertest)

```bash
cd backend

# รัน test ทั้งหมด
npm test

# รัน unit tests เฉพาะ (UTC5001-5005)
npm run test:unit

# รัน integration tests เฉพาะ (UTC1001-UTC6002)
npm run test:integration

# ดู coverage report
npm run test:coverage
```

## 3. System Tests (Playwright)

```bash
cd frontend

# เริ่ม backend + frontend ก่อน (terminal แยก)
# Terminal 1: cd backend && npm run dev
# Terminal 2: cd frontend && npm run dev

# รัน E2E tests ทั้งหมด
npx playwright test

# รันเฉพาะ auth tests (STC1001-1005)
npx playwright test auth.spec.ts

# ดู HTML report
npx playwright show-report
```

## 4. UAT (Manual)

- เปิดระบบที่ http://localhost:3002
- ให้วิศวกรทดสอบตาม UAT001-UAT010
- บันทึกผลใน `tests/uat/UAT-Record-Form.docx`
- ถ่าย screen recording ระหว่างทดสอบ

## โครงสร้าง Test Files

```
backend/tests/
├── setup.ts                     # Setup test DB
├── unit/
│   └── calculation.test.ts      # UTC5001-UTC5005
└── integration/
    ├── auth.test.ts             # UTC1001-UTC1008
    ├── projects.test.ts         # UTC2001-UTC2007
    ├── versions.test.ts         # UTC3001-UTC3006
    ├── network.test.ts          # UTC4001-UTC4003
    └── documents.test.ts        # UTC6001-UTC6002

frontend/tests/e2e/
├── auth.spec.ts                 # STC1001-STC1005
├── projects.spec.ts             # STC2001-STC2004
├── versions.spec.ts             # STC3001-STC3003
├── network.spec.ts              # STC4001-STC4005
└── calculation.spec.ts          # STC5001-STC5004, STC6001-STC6004, STC8001-STC8002
```
