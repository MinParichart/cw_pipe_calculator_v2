// Hospital Water Factors (ตาราง 2.4)
export const WATER_FACTOR_HOSPITAL = [
  { fuRange: 'Up to 400', fuMin: 0, fuMax: 400, hunterGPM: 125, percent: 100, adjustedGPM: 125, minGPM: null },
  { fuRange: '401-600', fuMin: 401, fuMax: 600, hunterGPM: 155, percent: 90, adjustedGPM: 140, minGPM: 130 },
  { fuRange: '601-1200', fuMin: 601, fuMax: 1200, hunterGPM: 235, percent: 77, adjustedGPM: 180, minGPM: 145 },
  { fuRange: '1201-1500', fuMin: 1201, fuMax: 1500, hunterGPM: 270, percent: 74, adjustedGPM: 200, minGPM: 185 },
  { fuRange: '1501-2000', fuMin: 1501, fuMax: 2000, hunterGPM: 330, percent: 70, adjustedGPM: 230, minGPM: 205 },
  { fuRange: '2001-2500', fuMin: 2001, fuMax: 2500, hunterGPM: 385, percent: 69, adjustedGPM: 265, minGPM: 235 },
  { fuRange: '2501-3000', fuMin: 2501, fuMax: 3000, hunterGPM: 435, percent: 68, adjustedGPM: 295, minGPM: 270 },
  { fuRange: '3001-4000', fuMin: 3001, fuMax: 4000, hunterGPM: 560, percent: 65, adjustedGPM: 365, minGPM: 300 },
  { fuRange: '4001-5000', fuMin: 4001, fuMax: 5000, hunterGPM: 675, percent: 64, adjustedGPM: 430, minGPM: 370 },
  { fuRange: '5001-6000', fuMin: 5001, fuMax: 6000, hunterGPM: 775, percent: 63, adjustedGPM: 490, minGPM: 435 },
  { fuRange: '6001-8000', fuMin: 6001, fuMax: 8000, hunterGPM: 975, percent: 62, adjustedGPM: 600, minGPM: 495 },
  { fuRange: '9001-10000', fuMin: 9001, fuMax: 10000, hunterGPM: 1175, percent: 61, adjustedGPM: 720, minGPM: 605 },
  { fuRange: '10001-13000', fuMin: 10001, fuMax: 13000, hunterGPM: 1460, percent: 60, adjustedGPM: 875, minGPM: 725 },
]

// Office/School/Apartment Water Factors (ตาราง 2.5)
export const WATER_FACTOR_OFFICE_SCHOOL_APARTMENT = [
  { fuRange: 'Up to 400', fuMin: 0, fuMax: 400, hunterGPM: 125, percent: 100, adjustedGPM: 125, minGPM: null },
  { fuRange: '401-600', fuMin: 401, fuMax: 600, hunterGPM: 155, percent: 87, adjustedGPM: 135, minGPM: 130 },
  { fuRange: '601-900', fuMin: 601, fuMax: 900, hunterGPM: 195, percent: 75, adjustedGPM: 145, minGPM: 140 },
  { fuRange: '901-1200', fuMin: 901, fuMax: 1200, hunterGPM: 235, percent: 64, adjustedGPM: 150, minGPM: 150 },
  { fuRange: '1201-1500', fuMin: 1201, fuMax: 1500, hunterGPM: 270, percent: 63, adjustedGPM: 170, minGPM: 155 },
  { fuRange: '1501-2000', fuMin: 1501, fuMax: 2000, hunterGPM: 330, percent: 61, adjustedGPM: 200, minGPM: 175 },
  { fuRange: '2001-2500', fuMin: 2001, fuMax: 2500, hunterGPM: 385, percent: 60, adjustedGPM: 230, minGPM: 205 },
  { fuRange: '2501-3000', fuMin: 2501, fuMax: 3000, hunterGPM: 435, percent: 59, adjustedGPM: 255, minGPM: 235 },
  { fuRange: '3001-4000', fuMin: 3001, fuMax: 4000, hunterGPM: 550, percent: 58, adjustedGPM: 320, minGPM: 260 },
  { fuRange: '4001-5000', fuMin: 4001, fuMax: 5000, hunterGPM: 675, percent: 56, adjustedGPM: 380, minGPM: 325 },
  { fuRange: '5001-6000', fuMin: 5001, fuMax: 6000, hunterGPM: 775, percent: 56, adjustedGPM: 435, minGPM: 385 },
  { fuRange: '6001-7000', fuMin: 6001, fuMax: 7000, hunterGPM: 875, percent: 56, adjustedGPM: 490, minGPM: 440 },
  { fuRange: '7001-8000', fuMin: 7001, fuMax: 8000, hunterGPM: 975, percent: 55, adjustedGPM: 540, minGPM: 495 },
]

// Apply water factor to GPM
export function applyWaterFactor(
  fu: number,
  gpm: number,
  buildingType: 'APARTMENT' | 'OFFICE' | 'HOSPITAL' | 'SCHOOL' | 'HOTEL' = 'APARTMENT'
): { adjustedGPM: number; minGPM: number | null } {
  // Select table based on building type
  const table = ['HOSPITAL'].includes(buildingType)
    ? WATER_FACTOR_HOSPITAL
    : WATER_FACTOR_OFFICE_SCHOOL_APARTMENT

  // Find range
  const range = table.find(r => fu >= r.fuMin && fu <= r.fuMax)

  if (!range) {
    // FU is out of range, return original GPM
    return { adjustedGPM: gpm, minGPM: null }
  }

  // Calculate adjusted GPM
  const adjustedGPM = (gpm * range.percent) / 100

  // Ensure minimum GPM if specified
  const finalGPM = range.minGPM && adjustedGPM < range.minGPM ? range.minGPM : adjustedGPM

  return { adjustedGPM: finalGPM, minGPM: range.minGPM }
}

// Get water factor table by building type
export function getWaterFactorTable(buildingType: 'APARTMENT' | 'OFFICE' | 'HOSPITAL' | 'SCHOOL' | 'HOTEL') {
  return ['HOSPITAL'].includes(buildingType)
    ? WATER_FACTOR_HOSPITAL
    : WATER_FACTOR_OFFICE_SCHOOL_APARTMENT
}
