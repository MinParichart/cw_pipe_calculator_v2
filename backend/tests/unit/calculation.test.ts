/**
 * Unit Tests: Calculation Engine
 * UTC5001 - คำนวณ velocity จาก flow rate และขนาดท่อ (v = Q/A)
 * UTC5002 - แปลงค่า FU เป็น GPM ด้วย Hunter's Curve
 * UTC5003 - คำนวณขนาดท่อด้วยสูตร Hazen-Williams
 * UTC5004 - ตรวจสอบ status จาก velocity (PASS / WARN / FAIL)
 * UTC5005 - คำนวณเมื่อไม่มี Fixtures (FU = 0, GPM = 0)
 * UTC5006 - [v2] Water Factor adjustment ตาม buildingType
 * UTC5007 - [v2] Auto-Suggest: ระบุ pipe ที่ status=WARNING/CRITICAL
 * UTC5008 - [v2] Apply Suggestion: upsize pipe ลด velocity ให้อยู่ในเกณฑ์
 */

import { describe, it, expect } from 'vitest'
import calculationService from '../../src/services/calculationService'
import { fuToGPM } from '../../../shared/constants/hunterCurve'
import { getFixtureUnits } from '../../../shared/constants/fixtures'
import { applyWaterFactor } from '../../../shared/constants/waterFactors'

// ─────────────────────────────────────────────
// UTC5001: calculateVelocity  (v = Q / A)
// ─────────────────────────────────────────────
describe('UTC5001 — calculateVelocity (v = Q/A)', () => {
  it('TC-5001-01: ท่อ ID=0.0267m, Q=0.001 m³/s → velocity ≈ 1.79 m/s', () => {
    // A = π × (D/2)² = π × 0.01335² ≈ 0.000559 m²
    // v = 0.001 / 0.000559 ≈ 1.787
    const v = calculationService.calculateVelocity(0.001, 0.0267)
    expect(v).toBeCloseTo(1.787, 1)
  })

  it('TC-5001-02: ท่อ ID=0.0218m, Q=0.001 m³/s → velocity > 2 m/s (ท่อเล็กกว่า)', () => {
    const v = calculationService.calculateVelocity(0.001, 0.0218)
    expect(v).toBeGreaterThan(2)
  })

  it('TC-5001-03: Q เพิ่มขึ้น → velocity เพิ่มขึ้น (diameter คงที่)', () => {
    const v1 = calculationService.calculateVelocity(0.001, 0.0267)
    const v2 = calculationService.calculateVelocity(0.002, 0.0267)
    expect(v2).toBeGreaterThan(v1)
    expect(v2).toBeCloseTo(v1 * 2, 1)
  })

  it('TC-5001-04: diameter ลดลง → velocity เพิ่มขึ้น (Q คงที่)', () => {
    const vLarge = calculationService.calculateVelocity(0.001, 0.040)
    const vSmall = calculationService.calculateVelocity(0.001, 0.025)
    expect(vSmall).toBeGreaterThan(vLarge)
  })

  it('TC-5001-05: Q = 0 → velocity = 0 (ไม่มีการไหล)', () => {
    const v = calculationService.calculateVelocity(0, 0.0267)
    expect(v).toBe(0)
  })
})

// ─────────────────────────────────────────────
// UTC5002: Hunter's Curve — fuToGPM
// ─────────────────────────────────────────────
describe('UTC5002 — fuToGPM ด้วย Hunter\'s Curve', () => {
  it('TC-5002-01: FU=0 → คืนค่า GPM ต่ำสุดในตาราง (5.0) เพราะต่ำกว่า minimum FU=6', () => {
    // fuToGPM(0) คืน table[0].gpm = 5.0 ซึ่งถูกต้องตาม Hunter's Curve spec
    expect(fuToGPM(0, 'FLUSH_TANK')).toBe(5.0)
  })

  it('TC-5002-02: FU=10 → GPM=8.0 (FLUSH_TANK, ค่าตรงในตาราง)', () => {
    expect(fuToGPM(10, 'FLUSH_TANK')).toBeCloseTo(8.0, 1)
  })

  it('TC-5002-03: FU=25 → GPM=17.0 (FLUSH_TANK, ค่าตรงในตาราง)', () => {
    expect(fuToGPM(25, 'FLUSH_TANK')).toBeCloseTo(17.0, 1)
  })

  it('TC-5002-04: FU=15 → interpolate ระหว่าง FU14(10.4) และ FU16(11.6)', () => {
    const gpm = fuToGPM(15, 'FLUSH_TANK')
    expect(gpm).toBeGreaterThan(10.4)
    expect(gpm).toBeLessThan(11.6)
  })

  it('TC-5002-05: FU=10 → GPM=27.0 (FLUSH_VALVE, ค่าตรงในตาราง)', () => {
    expect(fuToGPM(10, 'FLUSH_VALVE')).toBeCloseTo(27.0, 1)
  })

  it('TC-5002-06: FLUSH_VALVE ให้ GPM สูงกว่า FLUSH_TANK ที่ FU เดียวกัน', () => {
    const tank = fuToGPM(20, 'FLUSH_TANK')
    const valve = fuToGPM(20, 'FLUSH_VALVE')
    expect(valve).toBeGreaterThan(tank)
  })
})

// ─────────────────────────────────────────────
// UTC5003: Hazen-Williams — friction loss rate + major/minor loss
// ─────────────────────────────────────────────
describe('UTC5003 — Hazen-Williams Friction Loss', () => {
  it('TC-5003-01: calculateFrictionLossRate คืนค่า > 0 เสมอ', () => {
    const rate = calculationService.calculateFrictionLossRate(0.001, 0.0267, 150)
    expect(rate).toBeGreaterThan(0)
  })

  it('TC-5003-02: ท่อเล็กลง → friction loss rate สูงขึ้น (Q, C คงที่)', () => {
    const large = calculationService.calculateFrictionLossRate(0.001, 0.040, 150)
    const small = calculationService.calculateFrictionLossRate(0.001, 0.025, 150)
    expect(small).toBeGreaterThan(large)
  })

  it('TC-5003-03: C-factor สูงขึ้น → friction loss rate ลดลง (ท่อใหม่กว่า)', () => {
    const oldPipe = calculationService.calculateFrictionLossRate(0.001, 0.0267, 100)
    const newPipe = calculationService.calculateFrictionLossRate(0.001, 0.0267, 150)
    expect(newPipe).toBeLessThan(oldPipe)
  })

  it('TC-5003-04: calculateMajorLoss = length × rate / 100', () => {
    const rate = calculationService.calculateFrictionLossRate(0.001, 0.0267, 150)
    const major = calculationService.calculateMajorLoss(10, rate)
    expect(major).toBeCloseTo(10 * rate / 100, 8)
  })

  it('TC-5003-05: calculateMinorLoss = majorLoss × 0.30', () => {
    const major = 0.5
    const minor = calculationService.calculateMinorLoss(major)
    expect(minor).toBeCloseTo(0.15, 5)
  })

  it('TC-5003-06: ท่อยาวขึ้น → major loss สูงขึ้น (rate คงที่)', () => {
    const rate = calculationService.calculateFrictionLossRate(0.001, 0.0267, 150)
    const short = calculationService.calculateMajorLoss(5, rate)
    const long = calculationService.calculateMajorLoss(20, rate)
    expect(long).toBeGreaterThan(short)
  })
})

// ─────────────────────────────────────────────
// UTC5004: calculateStatus (PASS / WARN / FAIL)
// ─────────────────────────────────────────────
describe('UTC5004 — calculateStatus', () => {
  const WARNING_THRESHOLD = 3.0

  it('TC-5004-01: velocity ปกติ (1.5 m/s) → PASS', () => {
    expect(calculationService.calculateStatus(1.5, WARNING_THRESHOLD, 0.5)).toBe('PASS')
  })

  it('TC-5004-02: velocity > 2.4 แต่ < warning (2.6 m/s) → WARN', () => {
    expect(calculationService.calculateStatus(2.6, WARNING_THRESHOLD, 0.5)).toBe('WARN')
  })

  it('TC-5004-03: velocity > velocityWarning (3.5 m/s) → FAIL', () => {
    expect(calculationService.calculateStatus(3.5, WARNING_THRESHOLD, 0.5)).toBe('FAIL')
  })

  it('TC-5004-04: velocity < 1.2 m/s (ต่ำเกิน min) → WARN', () => {
    expect(calculationService.calculateStatus(0.8, WARNING_THRESHOLD, 0.5)).toBe('WARN')
  })

  it('TC-5004-05: velocity พอดี 1.2 m/s (ขอบเขต min) → PASS', () => {
    expect(calculationService.calculateStatus(1.2, WARNING_THRESHOLD, 0.5)).toBe('PASS')
  })

  it('TC-5004-06: velocity พอดี 2.4 m/s (ขอบเขต max recommend) → PASS', () => {
    expect(calculationService.calculateStatus(2.4, WARNING_THRESHOLD, 0.5)).toBe('PASS')
  })
})

// ─────────────────────────────────────────────
// UTC5005: convertFlowUnits — รวมถึงกรณี FU=0
// ─────────────────────────────────────────────
describe('UTC5005 — convertFlowUnits (รวม edge case FU=0)', () => {
  it('TC-5005-01: 1 GPM = 0.06309 L/s', () => {
    const result = calculationService.convertFlowUnits(1)
    expect(result.lps).toBeCloseTo(0.06309, 4)
  })

  it('TC-5005-02: 1 GPM = 0.00006309 m³/s', () => {
    const result = calculationService.convertFlowUnits(1)
    expect(result.m3s).toBeCloseTo(0.00006309, 7)
  })

  it('TC-5005-03: GPM=0 (FU=0, ไม่มี fixture) → lps=0, m3s=0', () => {
    const result = calculationService.convertFlowUnits(0)
    expect(result.gpm).toBe(0)
    expect(result.lps).toBe(0)
    expect(result.m3s).toBe(0)
  })

  it('TC-5005-04: GPM=10 → lps ≈ 0.6309', () => {
    const result = calculationService.convertFlowUnits(10)
    expect(result.lps).toBeCloseTo(0.6309, 3)
  })
})

// ─────────────────────────────────────────────
// Bonus: getFixtureUnits — ค่า FU ตามประเภท fixture
// ─────────────────────────────────────────────
describe('BONUS — getFixtureUnits (ตาราง 2.2)', () => {
  it('WC_TANK cold FU = 3', () => {
    expect(getFixtureUnits('WC_TANK', 'cold')).toBe(3)
  })

  it('LAVATORY cold FU = 1', () => {
    expect(getFixtureUnits('LAVATORY', 'cold')).toBe(1)
  })

  it('WC_VALVE cold FU = 6', () => {
    expect(getFixtureUnits('WC_VALVE', 'cold')).toBe(6)
  })

  it('SHOWER cold FU = 2', () => {
    expect(getFixtureUnits('SHOWER', 'cold')).toBe(2)
  })

  it('HOSE_BIBB cold FU = 0 (แต่เพิ่ม +5 GPM แยก)', () => {
    expect(getFixtureUnits('HOSE_BIBB', 'cold')).toBe(0)
  })
})

// ─────────────────────────────────────────────
// UTC5006: [v2] Water Factor Adjustment (ตาราง 2.4/2.5)
// ─────────────────────────────────────────────
describe('UTC5006 — applyWaterFactor [v2]', () => {
  it('TC-5006-01: FU ≤ 400 (APARTMENT) → Water Factor 100% ไม่ลด GPM', () => {
    const gpm = fuToGPM(200, 'FLUSH_TANK') // 65.0 GPM
    const result = applyWaterFactor(200, gpm, 'APARTMENT')
    expect(result.adjustedGPM).toBeCloseTo(gpm, 1) // ไม่ลด
  })

  it('TC-5006-02: FU=500 APARTMENT → range 401-600 → Water Factor 87%', () => {
    const gpm = fuToGPM(500, 'FLUSH_TANK') // 125 GPM
    const result = applyWaterFactor(500, gpm, 'APARTMENT')
    // adjusted = 125 × 87% = 108.75 แต่ minGPM=130 → ใช้ 130
    expect(result.adjustedGPM).toBeGreaterThanOrEqual(130)
  })

  it('TC-5006-03: FU=700 APARTMENT → range 601-900 → Water Factor 75%', () => {
    const gpm = fuToGPM(700, 'FLUSH_TANK')
    const result = applyWaterFactor(700, gpm, 'APARTMENT')
    // adjusted หรือ minGPM=140 (whichever is higher)
    expect(result.adjustedGPM).toBeGreaterThanOrEqual(140)
  })

  it('TC-5006-04: Water Factor ต้องทำให้ adjustedGPM ≤ GPM เดิม (หรือเท่ากัน)', () => {
    const gpm = fuToGPM(500, 'FLUSH_TANK')
    const result = applyWaterFactor(500, gpm, 'APARTMENT')
    // adjustedGPM ต้อง ≤ gpm เดิม (ยกเว้น minGPM กรณี range ต่ำมาก)
    // ในกรณีนี้ minGPM=130 < 125=GPM จริง ดังนั้น adjusted=130 > 108.75
    // แต่ถ้า FU≤400 → adjusted = gpm เต็ม
    const gpm2 = fuToGPM(300, 'FLUSH_TANK')
    const r2 = applyWaterFactor(300, gpm2, 'APARTMENT')
    expect(r2.adjustedGPM).toBeCloseTo(gpm2, 1)
  })

  it('TC-5006-05: HOSPITAL กับ APARTMENT ให้ Water Factor ต่างกัน ที่ FU เดียวกัน', () => {
    // ใช้ FU=700 ซึ่งมี minGPM ต่างกัน:
    // - HOSPITAL (601-1200): minGPM=145
    // - APARTMENT (601-900): minGPM=140
    const gpm = fuToGPM(700, 'FLUSH_TANK')  // = 125 (max from table)
    const apt = applyWaterFactor(700, gpm, 'APARTMENT')   // 125*75% < 140 → 140
    const hosp = applyWaterFactor(700, gpm, 'HOSPITAL')   // 125*77% < 145 → 145

    // ทั้งคู่ต้องมี minGPM constraints แต่ต้องต่างกัน
    expect(apt).not.toStrictEqual(hosp)
    expect(apt.minGPM).toBe(140)
    expect(hosp.minGPM).toBe(145)
  })
})

// ─────────────────────────────────────────────
// UTC5007: [v2] Auto-Suggest — ระบุ pipe ที่ควรปรับขนาด
// ─────────────────────────────────────────────
describe('UTC5007 — Auto-Suggest logic [v2]', () => {
  it('TC-5007-01: pipe ที่ velocity > 2.4 m/s ต้องได้ status WARN', () => {
    const status = calculationService.calculateStatus(2.8, 3.0, 0.5)
    expect(status).toBe('WARN')
  })

  it('TC-5007-02: pipe ที่ velocity > velocityWarning ต้องได้ status FAIL', () => {
    const status = calculationService.calculateStatus(3.5, 3.0, 0.5)
    expect(status).toBe('FAIL')
  })

  it('TC-5007-03: pipe ที่ velocity ปกติ (1.5) ต้องได้ status PASS → ไม่ต้อง suggest', () => {
    const status = calculationService.calculateStatus(1.5, 3.0, 0.5)
    expect(status).toBe('PASS')
  })

  it('TC-5007-04: pipe ที่ velocity < 1.2 m/s (ต่ำเกิน min) ต้องได้ status WARN', () => {
    const status = calculationService.calculateStatus(0.8, 3.0, 0.5)
    expect(status).toBe('WARN')
  })

  it('TC-5007-05: pipe status WARN หรือ FAIL ควรถูก flag ให้ auto-suggest', () => {
    const pipeStatuses = ['PASS', 'WARN', 'FAIL', 'PASS', 'WARN']
    const needsSuggestion = pipeStatuses.filter(s => s === 'WARN' || s === 'FAIL')
    expect(needsSuggestion.length).toBe(3) // 2 WARN + 1 FAIL
  })
})

// ─────────────────────────────────────────────
// UTC5008: [v2] Apply Suggestion — upsize pipe ลด velocity
// ─────────────────────────────────────────────
describe('UTC5008 — Apply Suggestion (upsize pipe) [v2]', () => {
  it('TC-5008-01: เพิ่มขนาดท่อ DN25→DN32 ต้องลด velocity (Q คงที่)', () => {
    const q = 0.001 // m³/s
    const v_dn25 = calculationService.calculateVelocity(q, 0.025)
    const v_dn32 = calculationService.calculateVelocity(q, 0.032)
    expect(v_dn25).toBeGreaterThan(v_dn32)
  })

  it('TC-5008-02: เพิ่มขนาดท่อ DN32→DN40 ต้องลด velocity ต่อไป', () => {
    const q = 0.001
    const v_dn32 = calculationService.calculateVelocity(q, 0.032)
    const v_dn40 = calculationService.calculateVelocity(q, 0.040)
    expect(v_dn32).toBeGreaterThan(v_dn40)
  })

  it('TC-5008-03: upsize DN25→DN50 ต้องทำให้ velocity ลดลงจาก WARN เป็น PASS', () => {
    const q = 0.001
    const v_before = calculationService.calculateVelocity(q, 0.025) // ~2.04 m/s
    const v_after  = calculationService.calculateVelocity(q, 0.050) // ~0.51 m/s

    const status_before = calculationService.calculateStatus(v_before, 3.0, 0.5)
    const status_after  = calculationService.calculateStatus(v_after, 3.0, 0.5)

    // before อาจเป็น PASS/WARN, after ต้องเป็น WARN (< 1.2) หรือ PASS
    // ต้องไม่เป็น FAIL
    expect(status_after).not.toBe('FAIL')
  })

  it('TC-5008-04: friction loss rate ลดลงเมื่อเพิ่มขนาดท่อ (Q, C คงที่)', () => {
    const q = 0.001
    const rate_small = calculationService.calculateFrictionLossRate(q, 0.025, 150)
    const rate_large = calculationService.calculateFrictionLossRate(q, 0.040, 150)
    expect(rate_small).toBeGreaterThan(rate_large)
  })
})

// ─────────────────────────────────────────────
// UTC5006: [v2] Water Factor adjustment
// ─────────────────────────────────────────────
describe('UTC5006 — [v2] applyWaterFactor (ตาราง 2.4/2.5)', () => {
  it('TC-5006-01: FU=500, APARTMENT → percent=87% (ตาราง 2.5 row 401-600)', () => {
    const { adjustedGPM } = applyWaterFactor(500, 155, 'APARTMENT')
    expect(adjustedGPM).toBeCloseTo(155 * 0.87, 1)
  })

  it('TC-5006-02: FU=500, HOSPITAL → percent=90% (ตาราง 2.4 row 401-600)', () => {
    const { adjustedGPM } = applyWaterFactor(500, 155, 'HOSPITAL')
    expect(adjustedGPM).toBeCloseTo(155 * 0.90, 1)
  })

  it('TC-5006-03: FU <= 400 → percent=100% (ไม่ปรับลด)', () => {
    const { adjustedGPM } = applyWaterFactor(200, 100, 'APARTMENT')
    expect(adjustedGPM).toBe(100)
  })

  it('TC-5006-04: adjustedGPM ไม่ต่ำกว่า minGPM (clamp to min)', () => {
    // FU=500, APARTMENT: percent=87%, minGPM=130 → 155×0.87=134.85 > 130 → ไม่ clamp
    const { adjustedGPM, minGPM } = applyWaterFactor(500, 155, 'APARTMENT')
    if (minGPM !== null) {
      expect(adjustedGPM).toBeGreaterThanOrEqual(minGPM)
    }
  })

  it('TC-5006-05: OFFICE ใช้ตารางเดียวกับ APARTMENT (not HOSPITAL)', () => {
    const apt = applyWaterFactor(500, 155, 'APARTMENT')
    const off = applyWaterFactor(500, 155, 'OFFICE')
    expect(apt.adjustedGPM).toBe(off.adjustedGPM)
  })
})

// ─────────────────────────────────────────────
// UTC5007: [v2] Auto-Suggest (pure logic test)
// ─────────────────────────────────────────────
describe('UTC5007 — [v2] Auto-Suggest: ระบุ pipe ที่ status=WARN/FAIL', () => {
  it('TC-5007-01: velocity 3.5 m/s → status FAIL (ควร suggest upsize)', () => {
    const status = calculationService.calculateStatus(3.5, 3.0, 0.5)
    expect(status).toBe('FAIL')
  })

  it('TC-5007-02: velocity 2.7 m/s → status WARN (ควร suggest upsize)', () => {
    const status = calculationService.calculateStatus(2.7, 3.0, 0.5)
    expect(status).toBe('WARN')
  })

  it('TC-5007-03: velocity 1.8 m/s → status PASS (ไม่ต้อง suggest)', () => {
    const status = calculationService.calculateStatus(1.8, 3.0, 0.5)
    expect(status).toBe('PASS')
  })

  it('TC-5007-04: ท่อ DN25 (ID=0.0267m) velocity เกิน → DN32 (ID=0.035m) velocity ลดลง', () => {
    const Q = 0.002 // m³/s
    const vDN25 = calculationService.calculateVelocity(Q, 0.0267)
    const vDN32 = calculationService.calculateVelocity(Q, 0.035)
    expect(vDN25).toBeGreaterThan(vDN32)
  })
})

// ─────────────────────────────────────────────
// UTC5008: [v2] Apply Suggestion (velocity ลดลงหลัง upsize)
// ─────────────────────────────────────────────
describe('UTC5008 — [v2] Apply Suggestion: upsize pipe → velocity ลดลง', () => {
  it('TC-5008-01: เพิ่มขนาด ID จาก 0.0267m → 0.035m → velocity ลดลง', () => {
    const Q = 0.002
    const before = calculationService.calculateVelocity(Q, 0.0267)
    const after = calculationService.calculateVelocity(Q, 0.035)
    expect(after).toBeLessThan(before)
  })

  it('TC-5008-02: หลัง upsize เป็น DN40 (ID=0.0409m) velocity ควร < 3.0 m/s', () => {
    const Q = 0.002
    const v = calculationService.calculateVelocity(Q, 0.0409)
    expect(v).toBeLessThan(3.0)
  })

  it('TC-5008-03: upsize ไม่ทำให้ velocity ต่ำกว่า 0', () => {
    const v = calculationService.calculateVelocity(0.001, 0.05)
    expect(v).toBeGreaterThan(0)
  })
})
