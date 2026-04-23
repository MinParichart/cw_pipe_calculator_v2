// Version & Audit Types

export interface Version {
  id: string
  projectId: string
  name: string
  description?: string
  versionNumber: number
  isCurrent: boolean
  createdAt: Date
  createdBy?: string
  snapshotCriteria?: string
  snapshotNetwork?: string
  snapshotResults?: string
}

export interface CreateVersionDto {
  name: string
  description?: string
}

export interface UpdateVersionDto {
  name?: string
  description?: string
}

export interface VersionComparison {
  version1: Version
  version2: Version
  criteriaDiff: Record<string, { before: any; after: any }>
  networkDiff: Record<string, { before: any; after: any }>
  resultsDiff: Record<string, { before: any; after: any }>
  summary: {
    nodesAdded: number
    nodesRemoved: number
    pipesAdded: number
    pipesRemoved: number
    fixturesChanged: number
  }
}

export interface AuditLog {
  id: string
  projectId: string
  userId?: string
  action: AuditAction
  entity: string
  entityId?: string
  details?: string
  ipAddress?: string
  userAgent?: string
  createdAt: Date
}

export enum AuditAction {
  CREATE = 'CREATE',
  UPDATE = 'UPDATE',
  DELETE = 'DELETE',
  CALCULATE = 'CALCULATE',
  SAVE_VERSION = 'SAVE_VERSION',
  APPLY_SUGGESTION = 'APPLY_SUGGESTION',
  DUPLICATE = 'DUPLICATE',
}

export interface AuditLogFilters {
  projectId: string
  action?: AuditAction
  entity?: string
  userId?: string
  startDate?: Date
  endDate?: Date
  limit?: number
  offset?: number
}

// Snapshot Types
export interface NetworkSnapshot {
  nodes: NodeSnapshot[]
  pipes: PipeSnapshot[]
  fixtures: FixtureSnapshot[]
}

export interface NodeSnapshot {
  id: string
  type: string
  x: number
  y: number
  elevation: number
  label?: string
}

export interface PipeSnapshot {
  id: string
  sourceNodeId: string
  targetNodeId: string
  length: number
  nominalSize: string
  internalDiameter: number
  material: string
  cFactor: number
  isCriticalPath: boolean
}

export interface FixtureSnapshot {
  id: string
  nodeId: string
  type: string
  quantity: number
}

export interface CriteriaSnapshot {
  velocityMin: number
  velocityMax: number
  velocityWarning: number
  pressureMin: number
  pressureWarning: number
  cFactor: number
  systemType: string
  buildingType: string
  staticHead: number
  residualPressure: number
}

// Import FixtureType from network.types to avoid duplication
import { FixtureType } from './network.types'

export type { FixtureType }
