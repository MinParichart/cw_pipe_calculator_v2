// Network & Node Types

export interface Network {
  id: string
  projectId: string
  name: string
  versionId?: string
  isCurrent: boolean
  createdAt: Date
  updatedAt: Date
  nodes?: Node[]
  pipes?: Pipe[]
}

export interface Node {
  id: string
  networkId: string
  type: NodeType
  x: number                     // Canvas X position
  y: number                     // Canvas Y position
  elevation: number             // Height in meters
  label?: string
  createdAt: Date
  updatedAt: Date
  fixtures?: Fixture[]
  pipesAsSource?: Pipe[]
  pipesAsTarget?: Pipe[]
}

export enum NodeType {
  SOURCE = 'SOURCE',
  JUNCTION = 'JUNCTION',
  FIXTURE = 'FIXTURE',
  RISER = 'RISER',
}

export interface Fixture {
  id: string
  nodeId: string
  type: FixtureType
  quantity: number
  createdAt: Date
  updatedAt: Date
}

export enum FixtureType {
  WC_TANK = 'WC_TANK',
  WC_VALVE = 'WC_VALVE',
  LAVATORY = 'LAVATORY',
  BATHTUB = 'BATHTUB',
  SHOWER = 'SHOWER',
  KITCHEN_SINK = 'KITCHEN_SINK',
  LAUNDRY_TRAYS = 'LAUNDRY_TRAYS',
  DISHWASHER = 'DISHWASHER',
  LAUNDRY_35KG = 'LAUNDRY_35KG',
  LAUNDRY_7KG = 'LAUNDRY_7KG',
  HOSE_BIBB = 'HOSE_BIBB',
  DRINKING_FOUNTAIN = 'DRINKING_FOUNTAIN',
  URINAL_VALVE = 'URINAL_VALVE',
  SERVICE_SINK = 'SERVICE_SINK',
}

export interface Pipe {
  id: string
  networkId: string
  sourceNodeId: string
  targetNodeId: string
  length: number                // meters
  nominalSize: string           // e.g., "15", "20", "25" (mm)
  internalDiameter: number      // meters
  material: string
  cFactor: number
  isCriticalPath: boolean
  createdAt: Date
  updatedAt: Date
}

// Vue Flow Types
export interface FlowNode {
  id: string
  type: string
  position: { x: number; y: number }
  data: {
    label?: string
    nodeType: NodeType
    elevation: number
    fixtures?: Fixture[]
  }
}

export interface FlowEdge {
  id: string
  source: string
  target: string
  type: string
  data?: {
    length: number
    pipeId?: string
  }
}

// DTOs
export interface CreateNodeDto {
  type: NodeType
  x: number
  y: number
  elevation: number
  label?: string
}

export interface UpdateNodeDto {
  x?: number
  y?: number
  elevation?: number
  label?: string
}

export interface CreateFixtureDto {
  nodeId: string
  type: FixtureType
  quantity: number
}

export interface UpdateFixtureDto {
  type?: FixtureType
  quantity?: number
}

export interface CreatePipeDto {
  sourceNodeId: string
  targetNodeId: string
  length: number
  nominalSize: string
  material?: string
  cFactor?: number
}

export interface UpdatePipeDto {
  length?: number
  nominalSize?: string
  internalDiameter?: number
  material?: string
  cFactor?: number
}

// Pathfinding Types
export interface Path {
  nodes: Node[]
  pipes: Pipe[]
  totalLength: number
  totalElevation: number
  score: number
}
