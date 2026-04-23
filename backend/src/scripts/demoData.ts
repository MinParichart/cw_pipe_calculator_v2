// Demo Data: บ้านลาดพร้าว 2 ชั้น
// สำหรับทดสอบระบบคำนวณท่อน้ำดี

export const DEMO_PROJECT = {
  name: 'บ้านลาดพร้าว 2 ชั้น',
  description: 'บ้านพักอาศัย 2 ชั้น พื้นที่ 120 ตร.ม. มี 4 ห้องน้ำ ครัว และห้องซักล้าง',
  type: 'RESIDENTIAL' as const,
  status: 'ACTIVE' as const,
}

export const DEMO_CRITERIA = {
  velocityMin: 1.2,
  velocityMax: 2.4,
  velocityWarning: 3.0,
  pressureMin: 0.5, // bar
  pressureWarning: 0.3, // bar
  cFactor: 150, // PVC
  systemType: 'FLUSH_TANK' as const,
  buildingType: 'APARTMENT' as const,
  staticHead: 3.5, // เมตร
  residualPressure: 0.35, // bar (3.5 m.wg)
  blueprintUrl: null,
  blueprintScale: null,
}

// ============ VERSION 1: Initial Design (3 ห้องน้ำ) ============

export const VERSION_1_DATA = {
  name: 'Initial Design',
  description: 'แบบเริ่มต้น: 3 ห้องน้ำ (2 ชั้น 1, 1 ชั้น 2)',
  nodes: [
    // Source Node
    {
      type: 'SOURCE' as const,
      x: 100,
      y: 50,
      elevation: 0,
      label: 'Water Source (ปั๊ม)',
    },

    // Ground Floor Nodes
    {
      type: 'JUNCTION' as const,
      x: 200,
      y: 100,
      elevation: 0,
      label: 'Riser 1F',
    },
    {
      type: 'JUNCTION' as const,
      x: 350,
      y: 100,
      elevation: 0,
      label: 'J1',
    },
    {
      type: 'FIXTURE' as const,
      x: 450,
      y: 80,
      elevation: 0,
      label: 'ห้องน้ำ 1 (1F)',
      fixtures: [
        { type: 'WC_TANK', quantity: 1 }, // 3 FU
        { type: 'LAVATORY', quantity: 1 }, // 1 FU
        { type: 'SHOWER', quantity: 1 }, // 2 FU
      ],
    },
    {
      type: 'FIXTURE' as const,
      x: 450,
      y: 150,
      elevation: 0,
      label: 'ครัว (1F)',
      fixtures: [
        { type: 'KITCHEN_SINK', quantity: 1 }, // 2 FU
        { type: 'DISHWASHER', quantity: 1 }, // 1 FU
      ],
    },
    {
      type: 'FIXTURE' as const,
      x: 550,
      y: 100,
      elevation: 0,
      label: 'ห้องซักล้าง (1F)',
      fixtures: [
        { type: 'LAUNDRY_7KG', quantity: 1 }, // 4 FU
      ],
    },

    // Second Floor Nodes
    {
      type: 'RISER' as const,
      x: 200,
      y: 200,
      elevation: 3.5,
      label: 'Riser 2F',
    },
    {
      type: 'JUNCTION' as const,
      x: 350,
      y: 200,
      elevation: 3.5,
      label: 'J2',
    },
    {
      type: 'FIXTURE' as const,
      x: 450,
      y: 180,
      elevation: 3.5,
      label: 'ห้องน้ำ 2 (2F)',
      fixtures: [
        { type: 'WC_TANK', quantity: 1 }, // 3 FU
        { type: 'LAVATORY', quantity: 1 }, // 1 FU
      ],
    },
    {
      type: 'FIXTURE' as const,
      x: 450,
      y: 250,
      elevation: 3.5,
      label: 'ห้องน้ำ 3 (2F)',
      fixtures: [
        { type: 'WC_TANK', quantity: 1 }, // 3 FU
        { type: 'LAVATORY', quantity: 1 }, // 1 FU
        { type: 'BATHTUB', quantity: 1 }, // 2 FU
      ],
    },
  ],
  pipes: [
    // Main line from source
    { sourceIdx: 0, targetIdx: 1, length: 2.5, nominalSize: '40mm (1½")', internalDiameter: 0.0381, material: 'PVC' },
    { sourceIdx: 1, targetIdx: 6, length: 3.5, nominalSize: '40mm (1½")', internalDiameter: 0.0381, material: 'PVC' },

    // 1F distribution
    { sourceIdx: 1, targetIdx: 2, length: 2.0, nominalSize: '32mm (1¼")', internalDiameter: 0.0321, material: 'PVC' },
    { sourceIdx: 2, targetIdx: 3, length: 1.5, nominalSize: '25mm (1")', internalDiameter: 0.0258, material: 'PVC' },
    { sourceIdx: 2, targetIdx: 4, length: 1.8, nominalSize: '25mm (1")', internalDiameter: 0.0258, material: 'PVC' },
    { sourceIdx: 2, targetIdx: 5, length: 2.2, nominalSize: '20mm (¾")', internalDiameter: 0.0203, material: 'PVC' },

    // 2F distribution
    { sourceIdx: 6, targetIdx: 7, length: 2.0, nominalSize: '32mm (1¼")', internalDiameter: 0.0321, material: 'PVC' },
    { sourceIdx: 7, targetIdx: 8, length: 1.5, nominalSize: '25mm (1")', internalDiameter: 0.0258, material: 'PVC' },
    { sourceIdx: 7, targetIdx: 9, length: 1.8, nominalSize: '25mm (1")', internalDiameter: 0.0258, material: 'PVC' },
  ],
}

// ============ VERSION 2: Modified Design (4 ห้องน้ำ) ============

export const VERSION_2_DATA = {
  name: 'Modified Design',
  description: 'แบบปรับปรุง: เพิ่ม 1 ห้องน้ำ (รวม 4 ห้องน้ำ) และปรับขนาดท่อ',
  nodes: [
    // Source Node
    {
      type: 'SOURCE' as const,
      x: 100,
      y: 50,
      elevation: 0,
      label: 'Water Source (ปั๊ม)',
    },

    // Ground Floor Nodes
    {
      type: 'JUNCTION' as const,
      x: 200,
      y: 100,
      elevation: 0,
      label: 'Riser 1F',
    },
    {
      type: 'JUNCTION' as const,
      x: 350,
      y: 100,
      elevation: 0,
      label: 'J1',
    },
    {
      type: 'FIXTURE' as const,
      x: 450,
      y: 80,
      elevation: 0,
      label: 'ห้องน้ำ 1 (1F)',
      fixtures: [
        { type: 'WC_TANK', quantity: 1 },
        { type: 'LAVATORY', quantity: 1 },
        { type: 'SHOWER', quantity: 1 },
      ],
    },
    {
      type: 'FIXTURE' as const,
      x: 450,
      y: 150,
      elevation: 0,
      label: 'ครัว (1F)',
      fixtures: [
        { type: 'KITCHEN_SINK', quantity: 1 },
        { type: 'DISHWASHER', quantity: 1 },
      ],
    },
    {
      type: 'FIXTURE' as const,
      x: 550,
      y: 100,
      elevation: 0,
      label: 'ห้องซักล้าง (1F)',
      fixtures: [
        { type: 'LAUNDRY_7KG', quantity: 1 },
      ],
    },
    // เพิ่มห้องน้ำใหม่
    {
      type: 'FIXTURE' as const,
      x: 350,
      y: 180,
      elevation: 0,
      label: 'ห้องน้ำ 4 (1F)',
      fixtures: [
        { type: 'WC_TANK', quantity: 1 },
        { type: 'LAVATORY', quantity: 1 },
      ],
    },

    // Second Floor Nodes
    {
      type: 'RISER' as const,
      x: 200,
      y: 200,
      elevation: 3.5,
      label: 'Riser 2F',
    },
    {
      type: 'JUNCTION' as const,
      x: 350,
      y: 200,
      elevation: 3.5,
      label: 'J2',
    },
    {
      type: 'FIXTURE' as const,
      x: 450,
      y: 180,
      elevation: 3.5,
      label: 'ห้องน้ำ 2 (2F)',
      fixtures: [
        { type: 'WC_TANK', quantity: 1 },
        { type: 'LAVATORY', quantity: 1 },
      ],
    },
    {
      type: 'FIXTURE' as const,
      x: 450,
      y: 250,
      elevation: 3.5,
      label: 'ห้องน้ำ 3 (2F)',
      fixtures: [
        { type: 'WC_TANK', quantity: 1 },
        { type: 'LAVATORY', quantity: 1 },
        { type: 'BATHTUB', quantity: 1 },
      ],
    },
  ],
  pipes: [
    // Main line from source (ปรับขนาดใหญ่ขึ้น)
    { sourceIdx: 0, targetIdx: 1, length: 2.5, nominalSize: '50mm (2")', internalDiameter: 0.0508, material: 'PVC' },
    { sourceIdx: 1, targetIdx: 6, length: 3.5, nominalSize: '50mm (2")', internalDiameter: 0.0508, material: 'PVC' },

    // 1F distribution (ปรับขนาด)
    { sourceIdx: 1, targetIdx: 2, length: 2.0, nominalSize: '40mm (1½")', internalDiameter: 0.0381, material: 'PVC' },
    { sourceIdx: 2, targetIdx: 3, length: 1.5, nominalSize: '32mm (1¼")', internalDiameter: 0.0321, material: 'PVC' },
    { sourceIdx: 2, targetIdx: 4, length: 1.8, nominalSize: '32mm (1¼")', internalDiameter: 0.0321, material: 'PVC' },
    { sourceIdx: 2, targetIdx: 5, length: 2.2, nominalSize: '25mm (1")', internalDiameter: 0.0258, material: 'PVC' },
    // เพิ่มท่อใหม่
    { sourceIdx: 2, targetIdx: 10, length: 1.5, nominalSize: '25mm (1")', internalDiameter: 0.0258, material: 'PVC' },

    // 2F distribution (ปรับขนาด)
    { sourceIdx: 6, targetIdx: 7, length: 2.0, nominalSize: '40mm (1½")', internalDiameter: 0.0381, material: 'PVC' },
    { sourceIdx: 7, targetIdx: 8, length: 1.5, nominalSize: '32mm (1¼")', internalDiameter: 0.0321, material: 'PVC' },
    { sourceIdx: 7, targetIdx: 9, length: 1.8, nominalSize: '32mm (1¼")', internalDiameter: 0.0321, material: 'PVC' },
  ],
}

// ============ FIXTURE UNITS (FU Values) ============

export const FIXTURE_FU_VALUES: Record<string, { cold: number; total: number }> = {
  WC_TANK: { cold: 3, total: 3 },
  WC_VALVE: { cold: 6, total: 6 },
  LAVATORY: { cold: 1, total: 1 },
  SHOWER: { cold: 2, total: 2 },
  BATHTUB: { cold: 2, total: 2 },
  KITCHEN_SINK: { cold: 2, total: 2 },
  DISHWASHER: { cold: 0, total: 1 },
  LAUNDRY_35KG: { cold: 2, total: 2 },
  LAUNDRY_7KG: { cold: 3, total: 4 },
  HOSE_BIBB: { cold: 0, total: 0 },
}

// ============ EXPECTED CALCULATION RESULTS ============

export const EXPECTED_RESULTS = {
  version1: {
    totalFU: 26,
    flowRateGPM: 14.0, // จาก Hunter's Curve
    flowRateLPS: 0.883,
    criticalPathLength: 10.5,
    expectedTDH: 7.5, // m.wg
  },
  version2: {
    totalFU: 34,
    flowRateGPM: 17.0,
    flowRateLPS: 1.073,
    criticalPathLength: 10.5,
    expectedTDH: 9.2, // m.wg
  },
}

// ============ CRITICAL PATH INFO ============

export const CRITICAL_PATH_INFO = {
  version1: {
    description: 'Source → Riser 1F → Riser 2F → J2 → ห้องน้ำ 3 (2F)',
    reason: 'เส้นทางที่ยาวที่สุดและสูงที่สุด',
    nodeLabels: ['Water Source (ปั๊ม)', 'Riser 1F', 'Riser 2F', 'J2', 'ห้องน้ำ 3 (2F)'],
  },
  version2: {
    description: 'Source → Riser 1F → Riser 2F → J2 → ห้องน้ำ 3 (2F)',
    reason: 'เส้นทางที่ยาวที่สุดและสูงที่สุด (เหมือนเดิม)',
    nodeLabels: ['Water Source (ปั๊ม)', 'Riser 1F', 'Riser 2F', 'J2', 'ห้องน้ำ 3 (2F)'],
  },
}
