// Project Types

export interface Project {
  id: number
  name: string
  description?: string
  ownerId: number
  createdAt: Date
  updatedAt: Date
}

export interface DesignCriteria {
  id?: number
  projectId: number
  velocityMin: number          // m/s
  velocityMax: number          // m/s
  velocityWarning: number      // m/s
  pressureMin: number          // bar
  pressureWarning: number      // bar
  cFactor: number              // Hazen-Williams C-factor
  systemType: SystemType
  buildingType: BuildingType
  blueprintUrl?: string
  blueprintScale?: number      // pixels per meter
  staticHead: number           // meters
  residualPressure: number     // bar
  createdAt?: Date
  updatedAt?: Date
}

export enum SystemType {
  FLUSH_TANK = 'FLUSH_TANK',
  FLUSH_VALVE = 'FLUSH_VALVE',
}

export enum BuildingType {
  APARTMENT = 'APARTMENT',
  OFFICE = 'OFFICE',
  HOSPITAL = 'HOSPITAL',
  SCHOOL = 'SCHOOL',
  HOTEL = 'HOTEL',
}

export interface CreateProjectDto {
  name: string
  description?: string
}

export interface UpdateProjectDto {
  name?: string
  description?: string
}

export interface UpdateDesignCriteriaDto {
  velocityMin?: number
  velocityMax?: number
  velocityWarning?: number
  pressureMin?: number
  pressureWarning?: number
  cFactor?: number
  systemType?: SystemType
  buildingType?: BuildingType
  staticHead?: number
  residualPressure?: number
  blueprintUrl?: string
  blueprintScale?: number
}
