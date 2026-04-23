// Pipe Sizes (ตาราง 2.6)
export const PIPE_SIZES: any[] = [
  { mm: 15, inches: '1/2', internalDiameterM: 0.0127, averageDemand: 1, percent100Demand: 1 },
  { mm: 20, inches: '3/4', internalDiameterM: 0.0191, averageDemand: 4, percent100Demand: 3 },
  { mm: 25, inches: '1', internalDiameterM: 0.0254, averageDemand: 10, percent100Demand: 6 },
  { mm: 32, inches: '1¼', internalDiameterM: 0.0318, averageDemand: 20, percent100Demand: 12 },
  { mm: 40, inches: '1½', internalDiameterM: 0.0381, averageDemand: 30, percent100Demand: 20 },
  { mm: 50, inches: '2', internalDiameterM: 0.0508, averageDemand: 50, percent100Demand: 35 },
  { mm: 65, inches: '2½', internalDiameterM: 0.0635, averageDemand: 90, percent100Demand: 60 },
  { mm: 80, inches: '3', internalDiameterM: 0.0762, averageDemand: 125, percent100Demand: 85 },
  { mm: 100, inches: '4', internalDiameterM: 0.1016, averageDemand: 225, percent100Demand: 150 },
]

// Pipe Sizes for Flush Valves (ตาราง 2.7)
export const PIPE_SIZES_FLUSH_VALVE: any[] = [
  { mm: 30, inches: '1¼', connections: 1 },
  { mm: 40, inches: '1½', connections: 4 },
  { mm: 50, inches: '2', connections: 12 },
  { mm: 65, inches: '2½', connections: 25 },
]

// C-Factor Table
export const C_FACTORS: any[] = [
  { material: 'PVC', cRange: '160 - 150', cAverage: 155, cRecommended: 150 },
  { material: 'Copper_Brass_Lead_Glass', cRange: '150 - 120', cAverage: 140, cRecommended: 130 },
  { material: 'Cement_Lined_Iron_Steel', cRange: '160 - 130', cAverage: 148, cRecommended: 140 },
  { material: 'Steel_New', cRange: '150 - 80', cAverage: 130, cRecommended: 100 },
  { material: 'Cast_Iron_New', cRange: '150 - 80', cAverage: 130, cRecommended: 100 },
  { material: 'Concrete', cRange: '152 - 85', cAverage: 120, cRecommended: 100 },
]

// Get pipe by nominal size (mm)
export function getPipeBySize(mm: number) {
  return PIPE_SIZES.find((p: any) => p.mm === mm)
}

// Get pipe by inch size
export function getPipeByInch(inches: string) {
  return PIPE_SIZES.find((p: any) => p.inches === inches)
}

// Get internal diameter in meters
export function getInternalDiameter(mm: number): number {
  const pipe = getPipeBySize(mm)
  return pipe?.internalDiameterM || 0
}

// Get recommended pipe size based on fixture units (from Table 2.6)
export function getRecommendedPipeSize(
  fixtureUnits: number,
  systemType: 'FLUSH_TANK' | 'FLUSH_VALVE' = 'FLUSH_TANK',
  demandType: 'average' | '100percent' = 'average'
): { mm: number; inches: string } {
  if (systemType === 'FLUSH_VALVE') {
    const table = PIPE_SIZES_FLUSH_VALVE
    const pipe = table.find((p: any) => p.connections >= fixtureUnits)
    return pipe ? { mm: pipe.mm, inches: pipe.inches } : { mm: 65, inches: '2½' }
  }

  const demandKey = demandType === 'average' ? 'averageDemand' : 'percent100Demand'
  const pipe = (PIPE_SIZES as any[]).slice().reverse().find((p: any) => p[demandKey] >= fixtureUnits)

  return pipe ? { mm: pipe.mm, inches: pipe.inches } : { mm: 15, inches: '1/2' }
}

// Get C-factor for material
export function getCFactor(material: string = 'PVC', useRecommended: boolean = true): number {
  const cFactor = C_FACTORS.find((c: any) => c.material.toLowerCase().includes(material.toLowerCase()))
  return useRecommended ? cFactor?.cRecommended || 150 : cFactor?.cAverage || 150
}

// Get all pipe materials
export function getPipeMaterials(): string[] {
  return C_FACTORS.map((c: any) => c.material)
}

// Calculate pipe cross-sectional area (m²)
export function calculatePipeArea(diameterM: number): number {
  return Math.PI * Math.pow(diameterM / 2, 2)
}

// Unit conversion constants
export const UNIT_CONVERSIONS = {
  GPM_TO_LPS: 0.06309,
  GPM_TO_M3S: 0.00006309,
  LPS_TO_GPM: 15.85,
  LPS_TO_M3S: 0.001,
  M3S_TO_GPM: 15850,
  M3S_TO_LPS: 1000,
  BAR_TO_MWG: 10.197,
  MWG_TO_BAR: 0.0981,
  BAR_TO_PSI: 14.5,
  PSI_TO_BAR: 0.06895,
  INCH_TO_MM: 25.4,
}

// Convert GPM to LPS
export function gpmToLps(gpm: number): number {
  return gpm * UNIT_CONVERSIONS.GPM_TO_LPS
}

// Convert GPM to m³/s
export function gpmToM3s(gpm: number): number {
  return gpm * UNIT_CONVERSIONS.GPM_TO_M3S
}

// Convert LPS to m³/s
export function lpsToM3s(lps: number): number {
  return lps * UNIT_CONVERSIONS.LPS_TO_M3S
}

// Convert bar to m.wg
export function barToMwg(bar: number): number {
  return bar * UNIT_CONVERSIONS.BAR_TO_MWG
}

// Convert m.wg to bar
export function mwgToBar(mwg: number): number {
  return mwg * UNIT_CONVERSIONS.MWG_TO_BAR
}

// Convert bar to PSI
export function barToPsi(bar: number): number {
  return bar * UNIT_CONVERSIONS.BAR_TO_PSI
}

// PVC Pipe Specifications (TIS. 17-2532)
// OD = Outside Diameter (mm) ± tolerance, wall thickness varies by pressure class
export const PVC_PIPES_SPECS: any[] = [
  { dn: 18, od: '22±0.15', pvc5: null, pvc7: '1.5±0.15', pvc85: '2.0±0.15', pvc105: '2.3±0.15', pvc135: '2.6±0.15' },
  { dn: 20, od: '26±0.15', pvc5: null, pvc7: '1.5±0.15', pvc85: '2.0±0.15', pvc105: '2.3±0.15', pvc135: '2.6±0.15' },
  { dn: 25, od: '34±0.15', pvc5: null, pvc7: '1.5±0.15', pvc85: '2.0±0.15', pvc105: '2.4±0.20', pvc135: '3.0±0.25' },
  { dn: 35, od: '42±0.15', pvc5: '1.5±0.15', pvc7: '1.8±0.15', pvc85: '2.2±0.20', pvc105: '2.6±0.20', pvc135: '3.1±0.25' },
  { dn: 40, od: '48±0.15', pvc5: '1.5±0.15', pvc7: '1.9±0.15', pvc85: '2.3±0.20', pvc105: '2.8±0.20', pvc135: '3.5±0.25' },
  { dn: 55, od: '60±0.20', pvc5: '1.8±0.20', pvc7: '2.4±0.20', pvc85: '2.9±0.25', pvc105: '3.5±0.25', pvc135: '4.3±0.30' },
  { dn: 65, od: '76±0.20', pvc5: '2.2±0.20', pvc7: '2.9±0.20', pvc85: '3.5±0.25', pvc105: '4.4±0.30', pvc135: '5.4±0.30' },
  { dn: 80, od: '89±0.20', pvc5: '2.6±0.20', pvc7: '3.5±0.25', pvc85: '4.1±0.30', pvc105: '5.2±0.35', pvc135: '6.4±0.40' },
  { dn: 100, od: '114±0.20', pvc5: '3.2±0.20', pvc7: '4.3±0.25', pvc85: '5.2±0.30', pvc105: '6.5±0.35', pvc135: '8.1±0.50' },
  { dn: 125, od: '140±0.25', pvc5: '3.9±0.25', pvc7: '5.3±0.30', pvc85: '6.4±0.40', pvc105: '8.0±0.45', pvc135: '9.9±0.55' },
  { dn: 150, od: '165±0.25', pvc5: '4.6±0.25', pvc7: '6.2±0.35', pvc85: '7.5±0.45', pvc105: '9.4±0.50', pvc135: '11.7±0.65' },
  { dn: 200, od: '216±0.35', pvc5: '5.4±0.35', pvc7: '7.3±0.40', pvc85: '8.8±0.50', pvc105: '11.1±0.60', pvc135: '13.7±0.70' },
  { dn: 225, od: '251±0.40', pvc5: '6.3±0.40', pvc7: '8.4±0.40', pvc85: '10.2±0.55', pvc105: '12.8±0.60', pvc135: '15.9±0.80' },
  { dn: 250, od: '267±0.40', pvc5: '6.7±0.40', pvc7: '8.9±0.40', pvc85: '10.9±0.60', pvc105: '13.6±0.65', pvc135: '16.9±0.85' },
  { dn: 275, od: '281±0.40', pvc5: '7.0±0.40', pvc7: '9.4±0.45', pvc85: '11.4±0.60', pvc105: '14.4±0.75', pvc135: '17.8±0.90' },
  { dn: 300, od: '318±0.45', pvc5: '7.9±0.45', pvc7: '10.7±0.55', pvc85: '12.9±0.65', pvc105: '16.2±0.75', pvc135: '20.1±1.00' },
  { dn: 325, od: '356±0.45', pvc5: '8.8±0.45', pvc7: '11.9±0.55', pvc85: '14.4±0.70', pvc105: '18.1±0.80', pvc135: '22.5±1.10' },
  { dn: 350, od: '370±0.50', pvc5: '9.2±0.50', pvc7: '12.5±0.70', pvc85: '15.0±0.75', pvc105: '18.9±0.95', pvc135: '23.4±1.15' },
  { dn: 375, od: '401±0.50', pvc5: '9.9±0.50', pvc7: '13.5±0.70', pvc85: '16.2±0.80', pvc105: '20.4±0.95', pvc135: '25.3±1.20' },
  { dn: 400, od: '420±0.55', pvc5: '10.4±0.55', pvc7: '14.2±0.80', pvc85: '17.0±0.85', pvc105: '21.5±1.10', pvc135: '26.5±1.25' },
  { dn: 425, od: '452±0.60', pvc5: '11.2±0.60', pvc7: '15.2±0.80', pvc85: '18.3±0.90', pvc105: '23.1±1.15', pvc135: '28.5±1.35' },
  { dn: 450, od: '470±0.60', pvc5: '11.6±0.60', pvc7: '15.9±0.90', pvc85: '19.0±0.95', pvc105: '24.0±1.20', pvc135: '29.7±1.45' },
  { dn: 475, od: '502±0.70', pvc5: '12.5±0.70', pvc7: '16.9±0.90', pvc85: '20.3±1.00', pvc105: '25.6±1.25', pvc135: '31.6±1.45' },
  { dn: 500, od: '520±0.70', pvc5: '12.9±0.70', pvc7: '17.6±1.00', pvc85: '21.0±1.00', pvc105: '26.6±1.35', pvc135: '32.8±1.55' },
  { dn: 550, od: '562±0.75', pvc5: '13.9±0.75', pvc7: '18.9±1.00', pvc85: '22.7±1.10', pvc105: '28.6±1.35', pvc135: '35.4±1.65' },
  { dn: 600, od: '630±0.75', pvc5: '15.5±0.75', pvc7: '21.2±1.10', pvc85: '25.4±1.20', pvc105: '32.0±1.45', pvc135: '39.7±1.85' },
  { dn: 700, od: '712±0.90', pvc5: '17.6±0.90', pvc7: '23.8±1.10', pvc85: '28.6±1.25', pvc105: '36.0±1.45', pvc135: null },
  { dn: 800, od: '802±1.00', pvc5: '19.8±1.00', pvc7: '26.7±1.15', pvc85: '32.2±1.40', pvc105: null, pvc135: null },
  { dn: 900, od: '902±1.10', pvc5: '22.2±1.10', pvc7: '30.1±1.35', pvc85: '36.1±1.45', pvc105: null, pvc135: null },
  { dn: 1000, od: '1002±1.15', pvc5: '24.6±1.15', pvc7: '33.3±1.40', pvc85: null, pvc105: null, pvc135: null },
]

// Parse wall thickness string (e.g., "2.3±0.15" → 2.3)
function parseWallThickness(wallStr: string | null): number {
  if (!wallStr) return 0
  const match = wallStr.match(/^([\d.]+)±/)
  return match ? parseFloat(match[1]) : 0
}

// Parse tolerance from string (e.g., "2.3±0.15" → 0.15)
function parseTolerance(valueStr: string | null): number {
  if (!valueStr) return 0
  const match = valueStr.match(/±([\d.]+)/)
  return match ? parseFloat(match[1]) : 0
}

// Parse OD string (e.g., "22±0.15" → { avg: 22, tol: 0.15 })
function parseOD(odStr: string): { avg: number; tol: number } {
  return {
    avg: parseFloat(odStr.split('±')[0]),
    tol: parseTolerance(odStr)
  }
}

// Calculate PVC Internal Diameter using worst-case formula
// ID = (OD_avg - OD_tol) - [2 × (Wall_avg + Wall_tol)]
// Result in meters
export function calculatePVCInternalDiameterWorstCase(dn: number, pvcClass: number): number {
  let pvcSpec = PVC_PIPES_SPECS.find(p => p.dn === dn)

  // If exact DN not found, find nearest available size
  if (!pvcSpec) {
    const sortedSizes = PVC_PIPES_SPECS.map(p => p.dn).sort((a, b) => a - b)
    let nearestSize = sortedSizes[0]
    let minDiff = Math.abs(dn - nearestSize)

    for (const size of sortedSizes) {
      const diff = Math.abs(dn - size)
      if (diff < minDiff) {
        minDiff = diff
        nearestSize = size
      }
    }

    pvcSpec = PVC_PIPES_SPECS.find(p => p.dn === nearestSize)
    if (!pvcSpec) return 0

    console.log(`⚠️ DN ${dn}mm not found in PVC specs, using nearest size ${nearestSize}mm`)
  }

  // Parse OD value (string "XX±YY")
  const odStr = String(pvcSpec.od)
  const od = parseOD(odStr)

  // 🔥 FIX 1: ตัดจุดทศนิยมออกเพื่อให้ตรงกับ Key ในตาราง (เช่น 13.5 -> "135")
  const sanitizedClass = pvcClass.toString().replace('.', '')
  const classKey = `pvc${sanitizedClass}` as keyof typeof pvcSpec
  const wallThicknessStr = pvcSpec[classKey] as string | null

  if (!wallThicknessStr || wallThicknessStr === '-' || wallThicknessStr === null) {
    // If this size doesn't support this class, try the nearest available class
    const availableClasses = [5, 7, 8.5, 10.5, 13.5].filter(cls => {
      // 🔥 FIX 2: ตัดจุดทศนิยมตอนหาคลาสสำรองด้วย
      const sCls = cls.toString().replace('.', '')
      const key = `pvc${sCls}` as keyof typeof pvcSpec
      const val = pvcSpec[key] as string | null
      return val && val !== '-' && val !== null
    })
    const nearestClass = availableClasses.length > 0 ? availableClasses[0] : 7
    
    // 🔥 FIX 3: เรียกคีย์ที่ถูกต้องมาใช้งาน
    const sNearest = nearestClass.toString().replace('.', '')
    const nearestKey = `pvc${sNearest}` as keyof typeof pvcSpec
    const wallStr = pvcSpec[nearestKey] as string | null
    
    const wallAvg = parseWallThickness(wallStr)
    const wallTol = parseTolerance(wallStr)

    // Calculate worst-case ID
    const idMM = (od.avg - od.tol) - (2 * (wallAvg + wallTol))
    return idMM / 1000 // Convert mm to meters
  }

  const wallAvg = parseWallThickness(wallThicknessStr)
  const wallTol = parseTolerance(wallThicknessStr)

  // Calculate worst-case ID: (OD_avg - OD_tol) - [2 × (Wall_avg + Wall_tol)]
  const idMM = (od.avg - od.tol) - (2 * (wallAvg + wallTol))
  return idMM / 1000 // Convert mm to meters
}
// Legacy function (non-worst case, for backward compatibility)
function parseWallThicknessLegacy(wallStr: string | null): number {
  if (!wallStr) return 0
  const match = wallStr.match(/^([\d.]+)±/)
  return match ? parseFloat(match[1]) : 0
}

// Calculate PVC Internal Diameter from OD and wall thickness
// ID = OD - (wallThickness × 2), result in meters
// Calculate PVC Internal Diameter from OD and wall thickness
// ID = OD - (wallThickness × 2), result in meters
export function calculatePVCInternalDiameter(dn: number, pvcClass: number): number {
  const pvcSpec = PVC_PIPES_SPECS.find(p => p.dn === dn)
  if (!pvcSpec) return 0

  // 🔥 FIX: ลบจุดทศนิยมเพื่อให้ตรงกับชื่อ Key
  const sanitizedClass = pvcClass.toString().replace('.', '')
  const classKey = `pvc${sanitizedClass}` as keyof typeof pvcSpec
  const wallThicknessStr = pvcSpec[classKey] as string | null

  if (!wallThicknessStr || wallThicknessStr === '-') {
    const availableClasses = [5, 7, 8.5, 10.5, 13.5].filter(cls => {
      const sCls = cls.toString().replace('.', '')
      const key = `pvc${sCls}` as keyof typeof pvcSpec
      const val = pvcSpec[key] as string | null
      return val && val !== '-'
    })
    const nearestClass = availableClasses.length > 0 ? availableClasses[0] : 7
    
    const sNearest = nearestClass.toString().replace('.', '')
    const nearestKey = `pvc${sNearest}` as keyof typeof pvcSpec
    const wallStr = pvcSpec[nearestKey] as string | null
    
    const wallThickness = parseWallThickness(wallStr)
    return (pvcSpec.od - (wallThickness * 2)) / 1000 // Convert mm to meters
  }

  const wallThickness = parseWallThickness(wallThicknessStr)
  const internalDiameterMM = pvcSpec.od - (wallThickness * 2)
  return internalDiameterMM / 1000 // Convert mm to meters
}

// Get PVC pipe specs by DN
export function getPVCPipeSpecs(dn: number) {
  return PVC_PIPES_SPECS.find(p => p.dn === dn)
}
