// Hunter's Curve Data for Private Use
// Based on National Standard Plumbing Code

interface HunterCurvePoint {
  fu: number;
  gpm: number;
}

// Hunter's Curve Table (Flush Tank)
export const HUNTER_CURVE_FLUSH_TANK: HunterCurvePoint[] = [
  { fu: 6, gpm: 5.0 },
  { fu: 8, gpm: 6.5 },
  { fu: 10, gpm: 8.0 },
  { fu: 12, gpm: 9.2 },
  { fu: 14, gpm: 10.4 },
  { fu: 16, gpm: 11.6 },
  { fu: 18, gpm: 12.8 },
  { fu: 20, gpm: 14.0 },
  { fu: 25, gpm: 17.0 },
  { fu: 30, gpm: 20.0 },
  { fu: 35, gpm: 22.5 },
  { fu: 40, gpm: 24.8 },
  { fu: 45, gpm: 27.0 },
  { fu: 50, gpm: 29.0 },
  { fu: 60, gpm: 32.0 },
  { fu: 70, gpm: 35.0 },
  { fu: 80, gpm: 38.0 },
  { fu: 90, gpm: 41.0 },
  { fu: 100, gpm: 43.5 },
  { fu: 120, gpm: 48.0 },
  { fu: 140, gpm: 52.5 },
  { fu: 160, gpm: 57.0 },
  { fu: 180, gpm: 61.0 },
  { fu: 200, gpm: 65.0 },
  { fu: 250, gpm: 75.0 },
  { fu: 300, gpm: 85.0 },
  { fu: 400, gpm: 105.0 },
  { fu: 500, gpm: 125.0 }

];

// Hunter's Curve Table (Flush Valve)
export const HUNTER_CURVE_FLUSH_VALVE: HunterCurvePoint[] = [
  { fu: 10, gpm: 27.0 },
  { fu: 12, gpm: 28.6 },
  { fu: 14, gpm: 30.2 },
  { fu: 16, gpm: 31.8 },
  { fu: 18, gpm: 33.4 },
  { fu: 20, gpm: 35.0 },
  { fu: 25, gpm: 38.0 },
  { fu: 30, gpm: 41.0 },
  { fu: 35, gpm: 43.5 },
  { fu: 40, gpm: 46.5 },
  { fu: 45, gpm: 49.0 },
  { fu: 50, gpm: 51.5 },
  { fu: 60, gpm: 55.0 },
  { fu: 100, gpm: 67.5 },
  { fu: 120, gpm: 72.5 },
  { fu: 140, gpm: 77.5 },
  { fu: 160, gpm: 82.5 },
  { fu: 180, gpm: 87.0 },
  { fu: 200, gpm: 91.5 },
  { fu: 250, gpm: 101.0 },
  { fu: 300, gpm: 110.0 },
  { fu: 400, gpm: 126.0 },
  { fu: 500, gpm: 142.0 },
  { fu: 750, gpm: 178.0 },
  { fu: 1000, gpm: 208.0 }
];

/**
 * Convert Fixture Units to GPM using Hunter's Curve
 * @param fu - Fixture Units
 * @param systemType - 'FLUSH_TANK' or 'FLUSH_VALVE'
 * @returns GPM
 */
// Interpolate FU to GPM
export function fuToGPM(fu: number, systemType: 'FLUSH_TANK' | 'FLUSH_VALVE' = 'FLUSH_TANK'): number {
  // 🔥 ดักเคส FU เป็น 0 หรือติดลบ ให้คืนค่า 0 GPM ทันที
  if (fu <= 0) {
    return 0;
  }

  const table = systemType === 'FLUSH_TANK' ? HUNTER_CURVE_FLUSH_TANK : HUNTER_CURVE_FLUSH_VALVE

  // Find surrounding points
  const lower = table.filter(p => p.fu <= fu).pop()
  const upper = table.find(p => p.fu >= fu)

  // 🔥 FIX: กรณีค่า FU น้อยกว่าค่าต่ำสุดในตาราง (ใช้สมการ Linear Extrapolation ของคุณ)
  if (!lower) {
    // ดึงจุด 2 จุดแรกของตารางมาใช้เป็นอ้างอิง
    const p1 = table[0];
    const p2 = table[1];

    // หาความชัน (Slope) = (y2 - y1) / (x2 - x1)
    const slope = (p2.gpm - p1.gpm) / (p2.fu - p1.fu);

    // เทียบบัญญัติไตรยางศ์ย้อนกลับ y = y1 + (x - x1) * slope
    const extrapolatedGPM = p1.gpm + (fu - p1.fu) * slope;

    // ป้องกันค่าติดลบ และปัดทศนิยม 1 ตำแหน่ง
    return Math.max(0, Number(extrapolatedGPM.toFixed(1)));
  }

  if (!upper) {
    // FU มากกว่าค่าสูงสุดในตาราง ให้ใช้ค่าตัวสุดท้าย
    return table[table.length - 1].gpm
  }

  if (lower.fu === upper.fu) {
    return lower.gpm
  }

  // Interpolate (กรณีปกติที่ค่าอยู่ในช่วงของตาราง)
  const interpolatedGPM = lower.gpm + (fu - lower.fu) * ((upper.gpm - lower.gpm) / (upper.fu - lower.fu));
  return Number(interpolatedGPM.toFixed(1));
}

/**
 * Calculate UPC Mixed System GPM
 * When both Flush Tank and Flush Valve fixtures are present
 * @param flushTankFU - Total FU from flush tank fixtures
 * @param flushValveFU - Total FU from flush valve fixtures
 * @returns Object with totalGPM and systemType
 */

export function calculateUPCGPM(flushTankFU: number, flushValveFU: number): {
  totalFU: number
  totalGPM: number
  systemType: 'FLUSH_TANK' | 'FLUSH_VALVE'
} {
  const totalFU = flushTankFU + flushValveFU

  // 🔥 FIX: ถ้าไม่มี FU เลย ให้ส่งคืน 0 ไปเลย ไม่ต้องไปเปิดตาราง
  if (totalFU <= 0) {
    return {
      totalFU: 0,
      totalGPM: 0,
      systemType: 'FLUSH_TANK'
    }
  }

  // UPC Standard: ถ้ามี Flush Valve แม้ตัวเดียว ให้ใช้ Flush Valve curve
  if (flushValveFU > 0) {
    return {
      totalFU,
      totalGPM: fuToGPM(totalFU, 'FLUSH_VALVE'),
      systemType: 'FLUSH_VALVE'
    }
  }

  // มีแต่ Flush Tank
  return {
    totalFU,
    totalGPM: fuToGPM(totalFU, 'FLUSH_TANK'),
    systemType: 'FLUSH_TANK'
  }
}
