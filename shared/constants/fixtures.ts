// Fixture Units (ตาราง 2.2)
// Using plain object for flexibility across frontend/backend

export const FIXTURE_UNITS: any = {
  // Private Use
  WC_TANK: { cold: 3, total: 3, label: 'Water Closet (Flush Tank)', minSizeMM: 15, minSizeIn: '1/2' },
  WC_VALVE: { cold: 6, total: 6, label: 'Water Closet (Flush Valve)', minSizeMM: 25, minSizeIn: '1' },
  LAVATORY: { hot: 1, cold: 1, total: 1, label: 'Lavatory', minSizeMM: 15, minSizeIn: '1/2' },
  BATHTUB: { hot: 2, cold: 2, total: 2, label: 'Bathtub', minSizeMM: 15, minSizeIn: '1/2' },
  SHOWER: { hot: 2, cold: 2, total: 2, label: 'Shower', minSizeMM: 15, minSizeIn: '1/2' },
  KITCHEN_SINK: { hot: 2, cold: 2, total: 2, label: 'Kitchen Sink', minSizeMM: 15, minSizeIn: '1/2' },
  LAUNDRY_TRAY: { hot: 2, cold: 2, total: 3, label: 'Laundry Tray', minSizeMM: null, minSizeIn: null },
  DISHWASHER: { hot: 1, total: 1, label: 'Dishwasher', minSizeMM: 15, minSizeIn: '1/2' },
  WASHING_MACHINE_3_5KG: { hot: 2, cold: 2, total: 2, label: 'Washing Machine 3.5kg', minSizeMM: null, minSizeIn: null },
  WASHING_MACHINE_7KG: { hot: 2, cold: 3, total: 4, label: 'Washing Machine 7kg', minSizeMM: null, minSizeIn: null },
  HOSE_BIBB: { total: 0, label: 'Hose Bibb', minSizeMM: 15, minSizeIn: '1/2', flowRateGPM: 5 },
  DRINKING_FOUNTAIN: { total: 0, label: 'Drinking Fountain', minSizeMM: 10, minSizeIn: '3/8' },
  URINAL_VALVE: { cold: 5, total: 5, label: 'Urinal (Flush Valve)', minSizeMM: 20, minSizeIn: '3/4' },
  SERVICE_SINK: { hot: 2, cold: 2, total: 3, label: 'Service Sink', minSizeMM: 20, minSizeIn: '3/4' },
}

// Fixture Types Enum
export enum FixtureType {
  WC_TANK = 'WC_TANK',
  WC_VALVE = 'WC_VALVE',
  LAVATORY = 'LAVATORY',
  BATHTUB = 'BATHTUB',
  SHOWER = 'SHOWER',
  KITCHEN_SINK = 'KITCHEN_SINK',
  LAUNDRY_TRAY = 'LAUNDRY_TRAY',
  DISHWASHER = 'DISHWASHER',
  WASHING_MACHINE_3_5KG = 'WASHING_MACHINE_3_5KG',
  WASHING_MACHINE_7KG = 'WASHING_MACHINE_7KG',
  HOSE_BIBB = 'HOSE_BIBB',
  DRINKING_FOUNTAIN = 'DRINKING_FOUNTAIN',
  URINAL_VALVE = 'URINAL_VALVE',
  SERVICE_SINK = 'SERVICE_SINK',
}

// Get fixture units by type
export function getFixtureUnits(type: FixtureType | string, supplyType: 'hot' | 'cold' | 'total' = 'total'): number {
  const fixture = FIXTURE_UNITS[type]
  if (!fixture) return 0

  if (supplyType === 'hot') {
    return fixture.hot || 0
  }
  if (supplyType === 'cold') {
    return fixture.cold || fixture.total || 0
  }
  return fixture.total || 0
}

// Get fixture label
export function getFixtureLabel(type: FixtureType | string): string {
  const fixture = FIXTURE_UNITS[type]
  return fixture?.label || type
}

// Get minimum pipe size for fixture
export function getFixtureMinSize(type: FixtureType | string): { mm: number | null; inches: string | null } {
  const fixture = FIXTURE_UNITS[type]
  return {
    mm: fixture?.minSizeMM || null,
    inches: fixture?.minSizeIn || null,
  }
}

// Check if fixture has hot water supply
export function hasHotWater(type: FixtureType | string): boolean {
  const fixture = FIXTURE_UNITS[type]
  return typeof fixture?.hot === 'number' && fixture.hot > 0
}

// Check if fixture has cold water supply
export function hasColdWater(type: FixtureType | string): boolean {
  const fixture = FIXTURE_UNITS[type]
  return typeof fixture?.cold === 'number' && fixture.cold > 0
}

// Get all fixture types for catalog
export function getAllFixtureTypes() {
  return Object.entries(FIXTURE_UNITS).map(([key, value]: [string, any]) => ({
    type: key,
    label: value.label,
    cold: value.cold || 0,
    hot: value.hot || 0,
    total: value.total || 0,
    minSizeMM: value.minSizeMM,
    minSizeIn: value.minSizeIn,
    flowRateGPM: value.flowRateGPM,
  }))
}
