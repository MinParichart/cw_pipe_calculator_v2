// Fixture Units (FU) - Private (ตาราง 2.2)
export const FIXTURE_UNITS = {
  WC_TANK: { cold: 3, hot: 0, total: 3, name: 'WC (Flush Tank)', nameTh: 'โถส้วมุอ้วก' },
  WC_VALVE: { cold: 6, hot: 0, total: 6, name: 'WC (Flush Valve)', nameTh: 'โถส้วมลูกสูบ' },
  LAVATORY: { cold: 0.5, hot: 0.5, total: 1, name: 'Lavatory Basin', nameTh: 'อ่างล้างหน้า' },
  BATHTUB: { cold: 1, hot: 1, total: 2, name: 'Bathtub', nameTh: 'อ่างอาบน้ำ' },
  SHOWER: { cold: 1, hot: 1, total: 2, name: 'Shower', nameTh: 'ฝักบัวอาบน้ำ' },
  KITCHEN_SINK: { cold: 1, hot: 1, total: 2, name: 'Kitchen Sink', nameTh: 'อ่างล้างจาน' },
  LAUNDRY_TRAY: { cold: 1.5, hot: 1.5, total: 3, name: 'Laundry Tray', nameTh: 'อ่างล้างผ้า' },
  DISHWASHER: { cold: 0, hot: 1, total: 1, name: 'Dishwasher', nameTh: 'เครื่องล้างจาน' },
  WASHING_MACHINE_3_5KG: { cold: 1, hot: 1, total: 2, name: 'Washing Machine 3.5kg', nameTh: 'เครื่องซักผ้า 3.5 กก.' },
  WASHING_MACHINE_7KG: { cold: 1.5, hot: 2.5, total: 4, name: 'Washing Machine 7kg', nameTh: 'เครื่องซักผ้า 7 กก.' },
  HOSE_BIBB: { cold: 2.5, hot: 0, total: 2.5, name: 'Hose Bibb (External Tap)', nameTh: 'ก๊อกน้ำกลางแจ้ง' },
  DRINKING_FOUNTAIN: { cold: null, hot: null, total: 0, name: 'Drinking Fountain', nameTh: 'เครื่องดื่มน้ำดื่ม' },
  URINAL_VALVE: { cold: 5, hot: 0, total: 5, name: 'Urinal (Flush Valve)', nameTh: 'สุขา' },
  SERVICE_SINK: { cold: 2, hot: 2, total: 3, name: 'Service Sink', nameTh: 'อ่างล้างขนาดใหญ่' },
} as const

// Hunter's Curve - FU to GPM (ตาราง 2.3)
// ใช้ Newton's Divided Difference Interpolation
const hunterCurveFlushTank = [
  { fu: 0, gpm: 0 },
  { fu: 2, gpm: 6 },
  { fu: 4, gpm: 10 },
  { fu: 8, gpm: 16 },
  { fu: 15, gpm: 24 },
  { fu: 30, gpm: 38 },
  { fu: 50, gpm: 52 },
  { fu: 80, gpm: 72 },
  { fu: 120, gpm: 96 },
  { fu: 180, gpm: 128 },
  { fu: 300, gpm: 192 },
]

// แปลง FU → GPM ด้วย Linear Interpolation
function interpolateGPM(fu: number, curve: typeof hunterCurveFlushTank): number {
  if (fu <= 0) return 0
  if (fu >= curve[curve.length - 1].fu) return curve[curve.length - 1].gpm

  for (let i = 0; i < curve.length - 1; i++) {
    const p1 = curve[i]
    const p2 = curve[i + 1]

    if (fu >= p1.fu && fu <= p2.fu) {
      const ratio = (fu - p1.fu) / (p2.fu - p1.fu)
      return p1.gpm + ratio * (p2.gpm - p1.gpm)
    }
  }

  return 0
}

// Pipe Sizes - mm (ตาราง 2.6)
export const PIPE_SIZES = [15, 20, 25, 32, 40, 50, 65, 80, 100] as const

// ความยาวรวมของท่อที่เกิดจากอุปกรณ์ต่างๆ (Equivalent Length)
export const FITTING_LENGTHS = {
  ELVE_90: 1.5,      // ศอก 90 องศา
  ELVE_45: 0.8,      // ศอก 45 องศา
  TEE_RUN: 0.6,      // ที ผ่าน
  TEE_BRANCH: 1.2,   // ที แยก
  VALVE: 0.4,        // วาล์ว
} as const

// สัมประสิทธิ์ความหยาบ (C-Factor)
export const C_FACTORS = {
  PVC: 150,
  STEEL: 100,
  COPPER: 140,
  PE: 140,
} as const

// แปลงหน่วย
export const CONVERSION = {
  GPM_TO_LPS: 0.06309,
  GPM_TO_M3S: 0.00006309,
  LPS_TO_M3S: 0.001,
  PSI_TO_BAR: 0.06895,
  BAR_TO_MWG: 10.197, // เมตรน้ำ
} as const

interface FixtureInput {
  wcTank: number
  wcValve: number
  lavatory: number
  bathtub: number
  shower: number
  kitchenSink: number
  laundryTray: number
  dishwasher: number
  washingMachine35: number
  washingMachine7: number
  hoseBibb: number
  drinkingFountain: number
  urinalValve: number
  serviceSink: number
}

interface CalculationParams {
  fixtures: FixtureInput
  pipeLength: number // เมตร
  pipeMaterial: keyof typeof C_FACTORS
  numberOf90Elbows: number
  numberOf45Elbows: number
  numberOfTees: number
  numberOfValves: number
}

interface CalculationResult {
  totalFU: number
  flowGPM: number
  flowLPS: number
  recommendedPipeSize: number
  velocity: number // m/s
  frictionLoss: number // เมตรน้ำ
  totalHeadLoss: number // เมตรน้ำ (รวม minor loss)
  summary: {
    pipeSize: string
    velocityStatus: 'good' | 'warning' | 'bad'
    frictionLossPer100m: number
    totalHeadLoss: string
  }
}

export const usePipeCalculator = () => {
  const calculateTotalFU = (fixtures: FixtureInput): number => {
    const mapping = {
      wcTank: FIXTURE_UNITS.WC_TANK.total,
      wcValve: FIXTURE_UNITS.WC_VALVE.total,
      lavatory: FIXTURE_UNITS.LAVATORY.total,
      bathtub: FIXTURE_UNITS.BATHTUB.total,
      shower: FIXTURE_UNITS.SHOWER.total,
      kitchenSink: FIXTURE_UNITS.KITCHEN_SINK.total,
      laundryTray: FIXTURE_UNITS.LAUNDRY_TRAY.total,
      dishwasher: FIXTURE_UNITS.DISHWASHER.total,
      washingMachine35: FIXTURE_UNITS.WASHING_MACHINE_3_5KG.total,
      washingMachine7: FIXTURE_UNITS.WASHING_MACHINE_7KG.total,
      hoseBibb: FIXTURE_UNITS.HOSE_BIBB.total,
      drinkingFountain: FIXTURE_UNITS.DRINKING_FOUNTAIN.total,
      urinalValve: FIXTURE_UNITS.URINAL_VALVE.total,
      serviceSink: FIXTURE_UNITS.SERVICE_SINK.total,
    }

    return Object.entries(fixtures).reduce((total, [key, value]) => {
      return total + (value * (mapping[key as keyof FixtureInput] || 0))
    }, 0)
  }

  const calculateFlow = (totalFU: number): number => {
    return interpolateGPM(totalFU, hunterCurveFlushTank)
  }

  const selectPipeSize = (flowGPM: number): number => {
    const flowLPS = flowGPM * CONVERSION.GPM_TO_LPS

    // คำนวณขนาดท่อขั้นต่ำที่ velocity ไม่เกิน 3 m/s
    // A = Q / v_max
    // A = π * (D/2)²
    // D = 2 * sqrt(Q / (π * v_max))
    const v_max = 2.4 // ใช้ 2.4 m/s (กลางๆ ช่วง 1.2-2.4)
    const areaRequired = flowLPS / v_max
    const diameterRequired = 2 * Math.sqrt(areaRequired / Math.PI) // เมตร
    const diameterMM = diameterRequired * 1000

    // เลือกขนาดท่อมาตรฐานที่ใกล้เคียงที่สุด (ปัดขึ้น)
    for (const size of PIPE_SIZES) {
      if (size >= diameterMM) return size
    }

    return PIPE_SIZES[PIPE_SIZES.length - 1]
  }

  const calculateVelocity = (flowLPS: number, pipeDiameterMM: number): number => {
    const diameterM = pipeDiameterMM / 1000
    const area = Math.PI * Math.pow(diameterM / 2, 2)
    return flowLPS / area // m/s
  }

  const calculateFrictionLoss = (
    flowLPS: number,
    pipeDiameterMM: number,
    pipeLength: number,
    cFactor: number
  ): number => {
    // Hazen-Williams Formula (หน่วย SI)
    // hf = (10.583/D^4.87) × L × (Q/C)^1.85
    const D = pipeDiameterMM / 1000 // เปลี่ยนเป็นเมตร
    const Q = flowLPS / 1000 // เปลี่ยน LPS เป็น m³/s
    const L = pipeLength

    const hf = (10.583 / Math.pow(D, 4.87)) * L * Math.pow(Q / cFactor, 1.85)

    return hf // เมตรน้ำ
  }

  const calculateMinorLoss = (
    fittings: {
      elbows90: number
      elbows45: number
      tees: number
      valves: number
    }
  ): number => {
    // คำนวณความยาวสมมูลของ fitting ทั้งหมด
    const equivalentLength =
      (fittings.elbows90 * FITTING_LENGTHS.ELVE_90) +
      (fittings.elbows45 * FITTING_LENGTHS.ELVE_45) +
      (fittings.tees * FITTING_LENGTHS.TEE_BRANCH) +
      (fittings.valves * FITTING_LENGTHS.VALVE)

    return equivalentLength
  }

  const calculate = (params: CalculationParams): CalculationResult => {
    // 1. คำนวณ FU รวม
    const totalFU = calculateTotalFU(params.fixtures)

    // 2. แปลง FU → Flow (GPM)
    const flowGPM = calculateFlow(totalFU)

    // 3. แปลงหน่วย: GPM → LPS
    const flowLPS = flowGPM * CONVERSION.GPM_TO_LPS

    // 4. เลือกขนาดท่อ
    const recommendedPipeSize = selectPipeSize(flowGPM)

    // 5. คำนวณความเร็ว
    const velocity = calculateVelocity(flowLPS, recommendedPipeSize)

    // 6. คำนวณ Friction Loss (Major Loss)
    const cFactor = C_FACTORS[params.pipeMaterial]
    const frictionLoss = calculateFrictionLoss(
      flowLPS,
      recommendedPipeSize,
      params.pipeLength,
      cFactor
    )

    // 7. คำนวณ Minor Loss (จาก Fittings)
    const minorLossLength = calculateMinorLoss({
      elbows90: params.numberOf90Elbows,
      elbows45: params.numberOf45Elbows,
      tees: params.numberOfTees,
      valves: params.numberOfValves,
    })

    // คำนวณ friction loss จากความยาวสมมูลของ fittings
    const minorLoss = calculateFrictionLoss(
      flowLPS,
      recommendedPipeSize,
      minorLossLength,
      cFactor
    )

    // 8. รวม Head Loss
    const totalHeadLoss = frictionLoss + minorLoss

    // 9. สถานะ Velocity
    let velocityStatus: 'good' | 'warning' | 'bad'
    if (velocity < 0.6) {
      velocityStatus = 'bad' // ต่ำเกินไป อาจเกิดการตุ้ม/ตะกอน
    } else if (velocity < 1.2) {
      velocityStatus = 'warning' // ต่ำ แต่ยังใช้ได้
    } else if (velocity <= 2.4) {
      velocityStatus = 'good' // ปกติดี
    } else if (velocity <= 3.0) {
      velocityStatus = 'warning' // สูง แต่ยังอยู่ในขอบเขต
    } else {
      velocityStatus = 'bad' // สูงเกินไป เกิด water hammer
    }

    // 10. Friction Loss per 100m
    const frictionLossPer100m = (frictionLoss / params.pipeLength) * 100

    return {
      totalFU: Math.round(totalFU * 10) / 10,
      flowGPM: Math.round(flowGPM * 10) / 10,
      flowLPS: Math.round(flowLPS * 100) / 100,
      recommendedPipeSize,
      velocity: Math.round(velocity * 100) / 100,
      frictionLoss: Math.round(frictionLoss * 100) / 100,
      totalHeadLoss: Math.round(totalHeadLoss * 100) / 100,
      summary: {
        pipeSize: `DN ${recommendedPipeSize} (${recommendedPipeSize}mm)`,
        velocityStatus,
        frictionLossPer100m: Math.round(frictionLossPer100m * 100) / 100,
        totalHeadLoss: `${Math.round(totalHeadLoss * 100) / 100} เมตรน้ำ`,
      },
    }
  }

  return {
    calculate,
    FIXTURE_UNITS,
    PIPE_SIZES,
    C_FACTORS,
  }
}
