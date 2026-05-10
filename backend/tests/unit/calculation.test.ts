/**
 * Unit Tests: Calculation Engine
 * UTC5001 - คำนวณ velocity จาก flow rate และขนาดท่อ (v = Q/A)
 * UTC5002 - แปลงค่า FU เป็น GPM ด้วย Hunter's Curve
 * UTC5003 - คำนวณขนาดท่อด้วยสูตร Hazen-Williams
 * UTC5004 - ตรวจสอบ status จาก velocity (PASS / WARN / FAIL)
 * UTC5005 - คำนวณเมื่อไม่มี Fixtures (FU = 0, GPM = 0)
 */

import { describe, it, expect } from 'vitest'
import calculationService from '../../src/services/calculationService'
import { fuToGPM } from '../../../shared/constants/hunterCurve'
import { getFixtureUnits } from '../../../shared/constants/fixtures'

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
})
