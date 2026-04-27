# CW Pipe Calculator v2 - Refactoring Plan

## 📊 Current State Analysis

### **Architecture Overview**
```
Frontend: Nuxt.js 3 (Vue 3 + TypeScript + Tailwind CSS)
Backend:  Node.js + Express + Prisma ORM + PostgreSQL
State: Pinia Stores
API: RESTful endpoints
```

### **Codebase Statistics**

#### **Frontend (Vue Components)**
| File | Lines | Priority | Issues |
|------|-------|----------|---------|
| `NetworkBuilder.vue` | 5,134 | 🔴 **HIGH** | ใหญ่มาก, handle state + logic + UI |
| `AutoSuggestUpsizing.vue` | 3,138 | 🔴 **HIGH** | ซับซ้อนมาก, calculation + UI |
| `VersionAuditLog.vue` | 775 | 🟡 MEDIUM | Pagination + format details |
| `VersionHistory.vue` | 413 | 🟢 LOW | Visualization logic |
| `VersionList.vue` | 672 | 🟢 LOW | List + filter |
| `AuditLog.vue` | 647 | 🟢 LOW | Legacy (v1) |

#### **Backend (Services)**
| File | Lines | Priority | Issues |
|------|-------|----------|---------|
| `networkService.ts` | 857 | 🔴 **HIGH** | Network CRUD + calculation |
| `versionService.ts` | 844 | 🔴 **HIGH** | Version CRUD + audit logic |
| `autoSuggestService.ts` | 567 | 🟡 MEDIUM | Optimization logic |
| `calculationService.ts` | 513 | 🟡 MEDIUM | Pipe calculations |

**Total Code:** ~35,000+ lines

---

## 🔴 Critical Issues

### **1. God Components**
- **NetworkBuilder.vue** (5,134 lines)
  - รับผิดชอบ: Network state, Drag & Drop, Canvas rendering, Snapshots
  - ผสม: Difficult to test, hard to maintain, cognitive overload

- **AutoSuggestUpsizing.vue** (3,138 lines)
  - รับผิดชอบ: Algorithm optimization, UI rendering, State management
  - ผสม: Performance issues, logic tangled with UI

### **2. Business Logic in Components**
```typescript
// ❌ WRONG: Logic in component
components/calculator/AutoSuggestUpsizing.vue:
  - calculateVelocity() // Should be in service
  - calculateFrictionLoss() // Should be in service
  - PIPE_SIZES constant // Should be in utils/constants
```

### **3. Code Duplication**
- `calculateVelocity()` ซ้ำกันใน 3 ไฟล์
- `PIPE_SIZES` constant ประกาศใน 3 ที่
- Audit log rendering logic ซ้ำใน 2 components

### **4. State Management Chaos**
```typescript
// ❌ WRONG: State scattered everywhere
components/network/NetworkBuilder.vue:
  const networkData = ref({}) // Component state
  const selectedNodeId = ref(null) // Component state

stores/workflowStore.ts:
  const currentStep = ref('') // Workflow state
  const networkData = ref({}) // DUPLICATE!
```

### **5. Type Safety Issues**
```typescript
// ❌ WRONG: `any` everywhere
const pipe = ref<any>(null)
const network = ref<any>({})
```

---

## 🎯 Refactoring Strategy: Strangler Fig Pattern + Test-Driven Refactoring

### **Core Principles**

#### **1. Strangler Fig Pattern**
> "ค่อยๆ ย้ายระบบเก่าไปสู่ระบบใหม่ ทีละส่วน จนระบบใหม่ครอบคลุมทั้งหมด"

- ไม่ลบ code เดิมทันที
- สร้าง code ใหม่ขนานกับ code เดิม
- ทดสอบให้มั่นใจว่าให้ผลลัพธ์เหมือนกัน
- ค่อยๆ switch จากเดิม → ใหม่
- ลบ code เดิมเมื่อมั่นใจ 100%

#### **2. Test-Driven Refactoring**
> "เขียน test ก่อนแก้ code เพื่อใช้เป็น safety net"

- เขียน test จาก code เดิม (Golden Master Testing)
- Extract business logic → ทดสอบด้วย test เดิม
- แก้ไข code → รัน test ทุกครั้ง
- ถ้า test fail → แก้ทันที ห้าม push

---

## 📅 Implementation Timeline

### **Phase 0: Testing Foundation (Pre-requisite) 🚨**

#### **เป้าหมาย: สร้าง Safety Net ก่อนเริ่ม Refactor**

**Why Phase 0 first?**
- ป้องกัน regression bug
- มั่นใจว่าการ refactor ไม่ทำให้ระบบเสีย
- ใช้ test เป็นเกณฑ์ว่า code ใหม่ทำงานเหมือนเดิม

#### **0.1 Extract Calculator Service (Week 1-2)**

```
frontend/services/calculator/
  ├── velocityCalculator.ts      // Pure functions for velocity
  ├── frictionLossCalculator.ts  // Pure functions for friction loss
  ├── pipeSizer.ts               // Pipe sizing logic
  └── index.ts                   // Barrel export
```

**Step-by-Step:**

**Step 1: Extract `calculateVelocity()`**
```typescript
// ✅ NEW: frontend/services/calculator/velocityCalculator.ts
/**
 * Calculate water velocity in a pipe
 *
 * @param flowRateM3S - Flow rate in cubic meters per second
 * @param internalDiameterM - Internal diameter in meters
 * @returns Velocity in meters per second
 * @throws Error if diameter <= 0
 *
 * @example
 * ```ts
 * const velocity = calculateVelocity(0.001, 0.015)
 * // Returns: 5.66
 * ```
 */
export function calculateVelocity(
  flowRateM3S: number,
  internalDiameterM: number
): number {
  if (internalDiameterM <= 0) {
    throw new Error('Diameter must be positive')
  }
  const area = Math.PI * Math.pow(internalDiameterM / 2, 2)
  return flowRateM3S / area
}
```

**Step 2: Write Unit Test (Golden Master)**
```typescript
// tests/unit/velocityCalculator.spec.ts
import { describe, it, expect } from 'vitest'
import { calculateVelocity } from '~/services/calculator/velocityCalculator'

describe('calculateVelocity', () => {
  it('should calculate velocity correctly for normal flow', () => {
    // Golden Master: ค่าที่รู้ว่าถูกต้องจาก code เดิม
    expect(calculateVelocity(0.001, 0.015)).toBeCloseTo(5.66, 2)
  })

  it('should throw error for zero diameter', () => {
    expect(() => calculateVelocity(0.001, 0)).toThrow('Diameter must be positive')
  })

  it('should throw error for negative diameter', () => {
    expect(() => calculateVelocity(0.001, -0.015)).toThrow()
  })

  it('should handle very small flow rates', () => {
    expect(calculateVelocity(0.0001, 0.015)).toBeCloseTo(0.566, 3)
  })
})
```

**Step 3: Replace Old Code (Strangler Fig)**
```typescript
// ❌ OLD: In AutoSuggestUpsizing.vue
const calculateVelocity = (flowRate: number, diameter: number) => {
  const area = Math.PI * Math.pow(diameter / 2, 2)
  return flowRate / area
}

// ✅ NEW: Import from service
import { calculateVelocity } from '~/services/calculator/velocityCalculator'

// Use imported function (same behavior, now tested)
const velocity = calculateVelocity(flowRate, diameter)
```

**Step 4: Run Tests**
```bash
npm run test:unit
```

**✅ Success Criteria:**
- All tests pass
- No UI behavior changes
- Code is now type-safe and reusable

#### **0.2 Extract Constants (Week 2)**

```
frontend/shared/constants/
  ├── pipes.ts         // PIPE_SIZES, MATERIALS
  ├── physics.ts        // VELOCITY_LIMITS, FRICTION_COEFFICIENTS
  └── huntingCurve.ts   // HUNTER_CURVE_DATA
```

**Before (Duplicated in 3 files):**
```typescript
// ❌ Duplicated in AutoSuggestUpsizing.vue, HybridPipeSizing.vue, NetworkBuilder.vue
const PIPE_SIZES = [
  { mm: 15, inches: 0.5, internalDiameterM: 0.0136 },
  { mm: 20, inches: 0.75, internalDiameterM: 0.0200 },
  // ... 50+ lines
]
```

**After (Single source of truth):**
```typescript
// ✅ NEW: frontend/shared/constants/pipes.ts
export const PIPE_SIZES = [
  { mm: 15, inches: 0.5, internalDiameterM: 0.0136 },
  { mm: 20, inches: 0.75, internalDiameterM: 0.0200 },
  // ... 50+ lines
] as const

export type PipeSize = typeof PIPE_SIZES[number]
```

**Usage:**
```typescript
// ✅ In components
import { PIPE_SIZES, type PipeSize } from '~/shared/constants/pipes'

const selectedSize: PipeSize = PIPE_SIZES[0]
```

**Test:**
```typescript
// tests/unit/constants/pipes.spec.ts
import { describe, it, expect } from 'vitest'
import { PIPE_SIZES } from '~/shared/constants/pipes'

describe('PIPE_SIZES', () => {
  it('should have at least 10 sizes', () => {
    expect(PIPE_SIZES.length).toBeGreaterThanOrEqual(10)
  })

  it('should have unique mm values', () => {
    const mmValues = PIPE_SIZES.map(s => s.mm)
    const uniqueMmValues = new Set(mmValues)
    expect(uniqueMmValues.size).toBe(mmValues.length)
  })

  it('should have positive internal diameters', () => {
    PIPE_SIZES.forEach(size => {
      expect(size.internalDiameterM).toBeGreaterThan(0)
    })
  })
})
```

#### **0.3 Extract Friction Loss Calculator (Week 2-3)**

```typescript
// ✅ NEW: frontend/services/calculator/frictionLossCalculator.ts
/**
 * Calculate friction loss using Hazen-Williams equation
 *
 * @param flowRateLPM - Flow rate in liters per minute
 * @param pipeLengthM - Pipe length in meters
 * @param internalDiameterM - Internal diameter in meters
 * @param cFactor - Hazen-Williams C-factor
 * @returns Friction loss in bar
 */
export function calculateFrictionLoss(
  flowRateLPM: number,
  pipeLengthM: number,
  internalDiameterM: number,
  cFactor: number
): number {
  if (internalDiameterM <= 0) {
    throw new Error('Diameter must be positive')
  }
  if (cFactor <= 0) {
    throw new Error('C-factor must be positive')
  }

  // Convert LPM to m3/s
  const flowRateM3S = flowRateLPM / 60000

  // Hazen-Williams equation (SI units)
  const frictionLoss = (10.67 * pipeLengthM * Math.pow(flowRateM3S, 1.852))
    / (Math.pow(cFactor, 1.852) * Math.pow(internalDiameterM, 4.87))

  // Convert m to bar (1 bar = 10.197 m of water head)
  return frictionLoss / 10.197
}
```

**Test:**
```typescript
// tests/unit/frictionLossCalculator.spec.ts
import { describe, it, expect } from 'vitest'
import { calculateFrictionLoss } from '~/services/calculator/frictionLossCalculator'

describe('calculateFrictionLoss', () => {
  it('should calculate friction loss correctly', () => {
    // Golden Master values from existing calculations
    const result = calculateFrictionLoss(100, 10, 0.015, 150)
    expect(result).toBeCloseTo(0.5, 1) // Example value
  })

  it('should throw error for invalid C-factor', () => {
    expect(() => calculateFrictionLoss(100, 10, 0.015, 0)).toThrow()
  })

  it('should increase with longer pipes', () => {
    const loss1 = calculateFrictionLoss(100, 10, 0.015, 150)
    const loss2 = calculateFrictionLoss(100, 20, 0.015, 150)
    expect(loss2).toBeGreaterThan(loss1)
  })
})
```

---

### **Phase 1: Split Large Components (Month 2)**

> **Prerequisite:** Phase 0 complete (Calculator service + Tests pass)

#### **1.1 Break Down NetworkBuilder.vue**

```
components/network/
  ├── NetworkBuilder.vue          (500 lines) - Orchestrator
  ├── NetworkCanvas.vue            (400 lines) - Canvas rendering
  ├── NetworkDragDrop.vue          (300 lines) - Drag & drop logic
  ├── NetworkSnapshots.vue         (200 lines) - Save/load state
  ├── NodeRenderer.vue             (150 lines) - Node display
  ├── PipeRenderer.vue             (150 lines) - Pipe display
  ├── composables/
  │   ├── useNetworkBuilder.ts     (200 lines) - Core state management
  │   ├── useNetworkDragDrop.ts    (150 lines) - Drag & drop logic
  │   ├── useNetworkCanvas.ts      (150 lines) - Canvas rendering
  │   └── useNetworkSnapshots.ts   (100 lines) - Save/load operations
  └── utils/
      └── networkHelpers.ts        (100 lines) - Pure helper functions
```

**⚠️ CRITICAL: Avoid "God Composable"**

> **Warning:** Don't make `useNetworkBuilder.ts` a 800-line dumping ground!

If the composable grows beyond 300 lines, split it further by responsibility:

```typescript
// ❌ WRONG: One giant composable
export function useNetworkBuilder() {
  // 800 lines of mixed logic...
}

// ✅ RIGHT: Split into focused composables
composables/
  ├── useNetworkBuilder.ts      // Core CRUD operations
  ├── useNetworkDragDrop.ts     // Drag & drop specific logic
  ├── useNetworkCanvas.ts       // Canvas rendering logic
  └── useNetworkSnapshots.ts    // Snapshot persistence
```

**Example: NetworkBuilder.vue using multiple composables**
```vue
<script setup lang="ts">
// Compose multiple small composables
const { networkData, addNode, deleteNode } = useNetworkBuilder()
const { handleDragStart, handleDrop } = useNetworkDragDrop(networkData)
const { renderCanvas, clearCanvas } = useNetworkCanvas(networkData)
const { saveSnapshot, loadSnapshot } = useNetworkSnapshots(versionId)
</script>
```

**Step-by-Step (Strangler Fig):**

**Step 1: Create focused composables**

```typescript
// ✅ NEW: composables/useNetworkState.ts (Core CRUD operations)
export function useNetworkState(initialState: NetworkState) {
  const networkData = ref<NetworkState>(initialState)
  const selectedNodeId = ref<string | null>(null)

  const addNode = (node: Node) => {
    networkData.value.nodes.push(node)
  }

  const deleteNode = (id: string) => {
    const index = networkData.value.nodes.findIndex(n => n.id === id)
    if (index >= 0) {
      networkData.value.nodes.splice(index, 1)
    }
  }

  const updatePipe = (id: string, data: Partial<Pipe>) => {
    const pipe = networkData.value.pipes.find(p => p.id === id)
    if (pipe) {
      Object.assign(pipe, data)
    }
  }

  return {
    networkData,
    selectedNodeId,
    addNode,
    deleteNode,
    updatePipe
  }
}
```

```typescript
// ✅ NEW: composables/useNetworkDragDrop.ts (Drag & drop logic)
export function useNetworkDragDrop(networkData: Ref<NetworkState>) {
  const draggedNodeId = ref<string | null>(null)
  const dragPosition = ref({ x: 0, y: 0 })

  const handleDragStart = (nodeId: string) => {
    draggedNodeId.value = nodeId
  }

  const handleDragMove = (x: number, y: number) => {
    if (draggedNodeId.value) {
      const node = networkData.value.nodes.find(n => n.id === draggedNodeId.value)
      if (node) {
        node.x = x
        node.y = y
      }
    }
  }

  const handleDragEnd = () => {
    draggedNodeId.value = null
  }

  return {
    draggedNodeId,
    dragPosition,
    handleDragStart,
    handleDragMove,
    handleDragEnd
  }
}
```

```typescript
// ✅ NEW: composables/useNetworkCanvas.ts (Canvas rendering)
export function useNetworkCanvas(
  canvasRef: Ref<HTMLCanvasElement | null>,
  networkData: Ref<NetworkState>
) {
  const ctx = ref<CanvasRenderingContext2D | null>(null)

  const renderCanvas = () => {
    if (!canvasRef.value || !ctx.value) return

    // Clear canvas
    ctx.value.clearRect(0, 0, canvasRef.value.width, canvasRef.value.height)

    // Draw pipes
    networkData.value.pipes.forEach(pipe => {
      // ... draw pipe logic
    })

    // Draw nodes
    networkData.value.nodes.forEach(node => {
      // ... draw node logic
    })
  }

  const initCanvas = () => {
    if (canvasRef.value) {
      ctx.value = canvasRef.value.getContext('2d')
      renderCanvas()
    }
  }

  return {
    ctx,
    renderCanvas,
    initCanvas
  }
}
```

**Step 2: Create component tests**
```typescript
// tests/component/useNetworkBuilder.spec.ts
import { describe, it, expect } from 'vitest'
import { useNetworkBuilder } from '~/components/network/useNetworkBuilder'

describe('useNetworkBuilder', () => {
  it('should initialize empty network', () => {
    const { networkData } = useNetworkBuilder(1, 1)
    expect(networkData.value.nodes).toEqual([])
    expect(networkData.value.pipes).toEqual([])
  })

  it('should add node to network', () => {
    const { networkData, addNode } = useNetworkBuilder(1, 1)
    addNode({ id: 'n1', type: 'SOURCE', x: 100, y: 100, label: 'Source' })
    expect(networkData.value.nodes).toHaveLength(1)
  })
})
```

**Step 3: Refactor NetworkBuilder.vue (Compose multiple composables)**
```vue
<!-- ✅ NEW: Simplified NetworkBuilder.vue -->
<script setup lang="ts">
import { ref, onMounted, onBeforeUnmount } from 'vue'
import { useNetworkState } from '~/components/network/composables/useNetworkState'
import { useNetworkDragDrop } from '~/components/network/composables/useNetworkDragDrop'
import { useNetworkCanvas } from '~/components/network/composables/useNetworkCanvas'
import { useNetworkSnapshots } from '~/components/network/composables/useNetworkSnapshots'

const props = defineProps<{
  projectId: number
  versionId: number
  networkData: any
}>()

const emit = defineEmits(['network-change'])

// Canvas reference
const canvasRef = ref<HTMLCanvasElement | null>(null)

// Compose multiple focused composables
const {
  networkData,
  selectedNodeId,
  addNode,
  deleteNode,
  updatePipe
} = useNetworkState(props.networkData)

const {
  draggedNodeId,
  dragPosition,
  handleDragStart,
  handleDragMove,
  handleDragEnd
} = useNetworkDragDrop(networkData)

const {
  renderCanvas,
  initCanvas
} = useNetworkCanvas(canvasRef, networkData)

const {
  saveSnapshot,
  loadSnapshot
} = useNetworkSnapshots(props.versionId)

// Lifecycle
onMounted(() => {
  initCanvas()
  loadSnapshot()
})

onBeforeUnmount(() => {
  saveSnapshot()
})
</script>

<template>
  <div class="network-builder">
    <canvas
      ref="canvasRef"
      @mousedown="handleDragStart"
      @mousemove="handleDragMove"
      @mouseup="handleDragEnd"
    />
  </div>
</template>
```

**Benefits of this approach:**
- ✅ Each composable < 300 lines
- ✅ Easy to test each composable independently
- ✅ Reusable across different components
- ✅ Clear separation of concerns
- ✅ Easy to understand and maintain

**Step 4: Run tests + Manual testing**
```bash
npm run test:unit
npm run test:component
# Manual: Create network, add nodes, save - verify everything works
```

#### **1.2 Break Down AutoSuggestUpsizing.vue**

```
components/calculator/
  ├── AutoSuggestUpsizing.vue     (400 lines) - Main container
  ├── PipeOptimizationList.vue    (300 lines) - Results list
  ├── PipeSizeRecommendation.vue  (200 lines) - Suggestion card
  ├── OptimizationSummary.vue     (150 lines) - Stats
  └── usePipeOptimizer.ts         (600 lines) - Composable
```

**Step-by-Step:**

**Step 1: Extract optimization logic to `usePipeOptimizer.ts`**
```typescript
// ✅ NEW: composable for pipe optimization
export function usePipeOptimizer(networkData: Ref<NetworkState>) {
  const suggestions = ref<PipeSuggestion[]>([])
  const summary = ref<OptimizationSummary | null>(null)

  const calculateOptimizations = () => {
    // Use calculator service from Phase 0
    suggestions.value = networkData.value.pipes.map(pipe => {
      const velocity = calculateVelocity(pipe.flowRate, pipe.internalDiameterM)
      const isAcceptable = velocity <= VELOCITY_LIMITS.max

      return {
        pipeId: pipe.id,
        currentSize: pipe.nominalSize,
        recommendedSize: isAcceptable ? pipe.nominalSize : getNextSize(pipe.nominalSize),
        reason: isAcceptable ? 'OK' : 'Velocity too high',
        currentVelocity: velocity
      }
    })
  }

  return {
    suggestions,
    summary,
    calculateOptimizations
  }
}
```

**Step 2: Create tests**
```typescript
// tests/component/usePipeOptimizer.spec.ts
import { describe, it, expect } from 'vitest'
import { usePipeOptimizer } from '~/components/calculator/usePipeOptimizer'

describe('usePipeOptimizer', () => {
  it('should detect high velocity pipes', () => {
    const networkData = ref({
      pipes: [
        { id: 'p1', flowRate: 0.01, internalDiameterM: 0.015, nominalSize: 15 }
      ]
    })
    const { suggestions, calculateOptimizations } = usePipeOptimizer(networkData)

    calculateOptimizations()

    expect(suggestions.value[0].reason).toBe('Velocity too high')
  })
})
```

**Step 3: Refactor AutoSuggestUpsizing.vue**
```vue
<!-- ✅ NEW: Simplified AutoSuggestUpsizing.vue -->
<script setup lang="ts">
import { usePipeOptimizer } from './usePipeOptimizer'
import { calculateVelocity } from '~/services/calculator/velocityCalculator'

const props = defineProps<{
  networkData: any
  versionId: number
}>()

// Use composable (logic extracted)
const {
  suggestions,
  summary,
  calculateOptimizations
} = usePipeOptimizer(computed(() => props.networkData))
</script>
```

---

### **Phase 2: Centralize State Management (Month 2-3)**

> **Prerequisite:** Phase 1 complete (Components split + Tests pass)

#### **2.1 Create Dedicated Stores**

```
stores/
  ├── networkStore.ts             // Network state (CRUD, snapshots)
  ├── versionStore.ts             // Version state (CRUD, audit)
  ├── calculatorStore.ts          // Calculator state (results, optimization)
  └── uiStore.ts                  // UI state (modals, panels)
```

**Example: `networkStore.ts`**
```typescript
// ✅ NEW: Centralized network state
export const useNetworkStore = defineStore('network', () => {
  // State
  const networks = ref<Map<string, NetworkState>>(new Map())
  const currentNetworkId = ref<string | null>(null)

  // Getters
  const currentNetwork = computed(() => {
    if (!currentNetworkId.value) return null
    return networks.value.get(currentNetworkId.value) || null
  })

  // Actions
  const setNetwork = (id: string, data: NetworkState) => {
    networks.value.set(id, data)
    currentNetworkId.value = id
  }

  const updateNetwork = (id: string, updates: Partial<NetworkState>) => {
    const network = networks.value.get(id)
    if (network) {
      networks.value.set(id, { ...network, ...updates })
    }
  }

  const deleteNetwork = (id: string) => {
    networks.value.delete(id)
    if (currentNetworkId.value === id) {
      currentNetworkId.value = null
    }
  }

  return {
    networks,
    currentNetworkId,
    currentNetwork,
    setNetwork,
    updateNetwork,
    deleteNetwork
  }
})
```

**Before (State scattered):**
```typescript
// ❌ WRONG: Duplicate state in multiple places
const networkData = ref({}) // In NetworkBuilder.vue
const networkData = ref({}) // In workflowStore.ts (DUPLICATE!)
```

**After (Centralized):**
```typescript
// ✅ RIGHT: Single source of truth
import { useNetworkStore } from '~/stores/networkStore'
const networkStore = useNetworkStore()
const { currentNetwork, updateNetwork } = networkStore
```

---

### **Phase 3: Improve Type Safety (Month 3)**

> **Prerequisite:** Phase 2 complete (State centralized)

#### **3.1 Define Strict Types**

```typescript
// ✅ NEW: types/network.ts
export interface Node {
  id: string
  type: 'SOURCE' | 'JUNCTION' | 'FIXTURE'
  x: number
  y: number
  elevation?: number
  label: string
  fixtures: Fixture[]
}

export interface Pipe {
  id: string
  sourceNodeId: string
  targetNodeId: string
  length: number
  nominalSize: number
  material: string
  cFactor: number
  flowRate?: number
  velocity?: number
}

export interface NetworkState {
  nodes: Node[]
  pipes: Pipe[]
  metadata?: {
    createdAt: string
    updatedAt: string
  }
}

export interface Fixture {
  type: string
  quantity: number
  wsfu: number
}
```

#### **3.2 Remove `any` Types**

**Before:**
```typescript
// ❌ WRONG
const network = ref<any>({})
const pipe = ref<any>(null)
```

**After:**
```typescript
// ✅ RIGHT
import type { NetworkState, Pipe } from '~/types/network'
const network = ref<NetworkState>({
  nodes: [],
  pipes: []
})
const pipe = ref<Pipe | null>(null)
```

**ESLint Rule:**
```json
// .eslintrc.json
{
  "rules": {
    "@typescript-eslint/no-explicit-any": "error",
    "@typescript-eslint/explicit-function-return-type": "warn",
    "vue/component-name-in-template-casing": "error"
  }
}
```

---

### **Phase 4: Code Quality Improvements (Month 3-4)**

> **Prerequisite:** Phase 3 complete (Type-safe)

#### **4.1 Add Component Testing**

```typescript
// tests/component/NetworkBuilder.spec.ts
import { describe, it, expect } from 'vitest'
import { mount } from '@vue/test-utils'
import NetworkBuilder from '~/components/network/NetworkBuilder.vue'

describe('NetworkBuilder', () => {
  it('should render canvas', () => {
    const wrapper = mount(NetworkBuilder, {
      props: {
        projectId: 1,
        versionId: 1,
        networkData: { nodes: [], pipes: [] }
      }
    })
    expect(wrapper.find('canvas').exists()).toBe(true)
  })

  it('should add node on double-click', async () => {
    const wrapper = mount(NetworkBuilder, {
      props: {
        projectId: 1,
        versionId: 1,
        networkData: { nodes: [], pipes: [] }
      }
    })

    const canvas = wrapper.find('canvas')
    await canvas.trigger('dblclick', { offsetX: 100, offsetY: 100 })

    expect(wrapper.emitted('network-change')).toBeTruthy()
  })
})
```

#### **4.2 Add E2E Testing**

```typescript
// tests/e2e/calculator-workflow.spec.ts
import { test, expect } from '@playwright/test'

test.describe('Calculator Workflow', () => {
  test('should complete full calculation flow', async ({ page }) => {
    await page.goto('/projects/1/versions/1/calculation')

    // Step 1: Click calculate button
    await page.click('button:has-text("คำนวณ")')

    // Step 2: Wait for results
    await page.waitForSelector('text=สรุปขนาดท่อ')

    // Step 3: Verify results displayed
    await expect(page.locator('text=Critical Path')).toBeVisible()
    await expect(page.locator('text=Branch Pipes')).toBeVisible()
  })

  test('should save calculation snapshot', async ({ page }) => {
    await page.goto('/projects/1/versions/1/calculation')

    await page.click('button:has-text("คำนวณ")')
    await page.waitForTimeout(1000)

    // Reload page - results should persist
    await page.reload()
    await expect(page.locator('text=สรุปขนาดท่อ')).toBeVisible()
  })
})
```

#### **4.3 Add Documentation**

```typescript
/**
 * Calculate water velocity in a pipe
 *
 * @param flowRateM3S - Flow rate in cubic meters per second
 * @param internalDiameterM - Internal diameter in meters
 * @returns Velocity in meters per second
 * @throws Error if diameter <= 0
 *
 * @example
 * ```ts
 * const velocity = calculateVelocity(0.001, 0.015)
 * // Returns: 5.66
 * ```
 */
export function calculateVelocity(
  flowRateM3S: number,
  internalDiameterM: number
): number {
  // ... implementation
}
```

---

## 🎯 Success Metrics

### **Code Quality**
- ✅ Reduce component size by 60% (5,134 → 2,000 lines)
- ✅ Zero `any` types
- ✅ 80% test coverage for critical functions

### **Maintainability**
- ✅ Component complexity < 10 (Cyclomatic Complexity)
- ✅ Code duplication < 5%
- ✅ File length < 500 lines (95% of files)

### **Performance**
- ✅ Lighthouse score > 90
- ✅ First Contentful Paint < 2s
- ✅ Time to Interactive < 3s

---

## ⚠️ CRITICAL IMPLEMENTATION GUIDELINES

> **จากประสบการณ์จริง** - รอยรั่วที่ทำให้โปรเจกต์ refactoring ล้มเหลว

### **1. ระวัง "God Composable" 🚨**

**ปัญหา:** เมื่อสกัด logic จาก Vue Component ไปใส่ Composable, มักกลายเป็นไฟล์ยักษ์ 800+ บรรทัด

**วิธีแก้:** แยก Composable ตามหน้าที่ (Single Responsibility Principle)

```typescript
// ❌ WRONG: One composable to rule them all
composables/
  └── useNetworkBuilder.ts  (800 lines)  // God Composable!

// ✅ RIGHT: Split by concern
composables/
  ├── useNetworkState.ts      (200 lines)  // Core state + CRUD
  ├── useNetworkDragDrop.ts   (150 lines)  // Drag & drop logic
  ├── useNetworkCanvas.ts     (150 lines)  // Canvas rendering
  └── useNetworkSnapshots.ts  (100 lines)  // Persistence
```

**เกณฑ์:**
- Composable ไม่ควรเกิน 300 บรรทัด
- ถ้าเกิน → แยกเป็น 2-3 composables เลย
- ให้ Vue component รวม composables เข้าด้วยกัน (Composition API)

---

### **2. หลีกเลี่ยง Long-lived Branches 🌿**

**ปัญหา:** รอให้ทำเสร็จทั้ง Phase ค่อย Merge → Merge Conflict นรกแตก!

**วิธีแก้:** Continuous Integration (ทยอย Merge ทุกวัน)

```bash
# ❌ WRONG: Wait for Phase completion
feature/refactor-phase-1-network (2 weeks old) → นรกแตกตอน merge!

# ✅ RIGHT: Small, frequent merges
day 1:  feat/extract-velocity-calculator     → merge ✅
day 2:  feat/extract-pipe-constants          → merge ✅
day 3:  refactor/use-velocity-calculator     → merge ✅
day 4:  test/add-velocity-calculator-tests   → merge ✅
```

**Strangler Fig Pattern จริงๆ:**
- อย่ารอให้เสร็จสมบูรณ์
- ทยอย Push code ใหม่เข้า main/develop
- แม้ยังไม่มีใครเรียกใช้ก็ช่างมัน มันอยู่ใน codebase แล้ว
- ทีละนิด ทีละหน่อย แต่ทุกวัน

**ตัวอย่าง Workflow:**

```bash
# Day 1: Create calculator service (ยังไม่มีใครใช้)
git checkout -b feat/velocity-calculator
# Write code...
git commit -m "feat: add velocity calculator service"
git push origin feat/velocity-calculator
# Create PR → Review → Merge to develop ✅

# Day 2: Write tests (ยังไม่มีใครใช้)
git checkout -b test/velocity-calculator
# Write tests...
git commit -m "test: add velocity calculator tests"
git push origin test/velocity-calculator
# Create PR → Review → Merge to develop ✅

# Day 3: Replace in component (เริ่มใช้จริง)
git checkout -b refactor/use-velocity-calculator
# Update AutoSuggestUpsizing.vue...
git commit -m "refactor: use velocity calculator in AutoSuggestUpsizing"
git push origin refactor/use-velocity-calculator
# Create PR → Review → Merge to develop ✅
```

**ประโยชน์:**
- ✅ ป้องกัน Merge Conflict รุนแรง
- ✅ Code review ง่าย (PR เล็กๆ)
- ✅ ถ้ามีปัญหา Rollback ได้ง่าย
- ✅ Team เห็น Progress ทุกวัน

---

### **3. บังคับ Test ด้วย CI/CD 🤖**

**ปัญหา:** คนลืมรัน test → Push code พัง → Production พัง 💥

**วิธีแก้:** ให้ CI/CD รัน test อัตโนมัติทุกครั้งที่ Push

#### **GitHub Actions Setup**

```yaml
# .github/workflows/test.yml
name: Test Suite

on:
  push:
    branches: [ main, develop ]
  pull_request:
    branches: [ main, develop ]

jobs:
  test:
    runs-on: ubuntu-latest

    steps:
      - uses: actions/checkout@v3

      - name: Setup Node.js
        uses: actions/setup-node@v3
        with:
          node-version: '18'

      - name: Install dependencies
        run: npm ci

      - name: Run Lint
        run: npm run lint

      - name: Run Unit Tests
        run: npm run test:unit

      - name: Run Component Tests
        run: npm run test:component

      - name: Build Project
        run: npm run build
```

#### **GitLab CI Setup**

```yaml
# .gitlab-ci.yml
stages:
  - test
  - build

unit-tests:
  stage: test
  script:
    - npm ci
    - npm run test:unit
  only:
    - merge_requests
    - main
    - develop

lint:
  stage: test
  script:
    - npm run lint
  only:
    - merge_requests
    - main
    - develop

build:
  stage: build
  script:
    - npm run build
  only:
    - merge_requests
    - main
    - develop
```

#### **Branch Protection Rules (GitHub)**

```json
{
  "required_status_checks": {
    "strict": true,
    "contexts": [
      "Test Suite / Run Lint",
      "Test Suite / Run Unit Tests",
      "Test Suite / Run Component Tests",
      "Test Suite / Build Project"
    ]
  },
  "enforce_admins": true,
  "require_pull_request_reviews": true,
  "required_approving_review_count": 1
}
```

**ผลลัพธ์:**
- ✅ Test ล้มเหลว → ห้าม Merge
- ✅ Lint เจอ issue → ห้าม Merge
- ✅ Build ล้มเหลว → ห้าม Merge
- ✅ Code review ก่อน merge

**ตัวอย่างการทำงาน:**

```bash
# Developer A พยายาม push code พัง
git push origin feat/broken-code

# GitHub Actions รัน test...
❌ Test failed: 5 tests failed

# PR ไม่สามารถ merge ได้ (blocked by CI)
🔒 Cannot merge: Required status check "Test Suite / Run Unit Tests" is failing

# Developer A ต้องแก้ code ก่อน
# แก้ code → รัน test ในเครื่อง → push ใหม่
✅ Test passed → Merge ได้
```

---

### **4. เช็คลิสรอยรั่ว (Weekly Review) 📋**

ทุกสัปดาห์ต้องมี:

**Code Quality:**
- [ ] No `any` types added (ESLint check)
- [ ] Test coverage ไม่ต่ำกว่าเดิม
- [ ] File length < 500 lines (95% of files)
- [ ] No console.log left in code

**Process:**
- [ ] Tests pass ทุกตัว (`npm run test`)
- [ ] CI/CD ผ่านหมด
- [ ] Code review complete
- [ ] Documentation updated
- [ ] Demo to stakeholder (optional)

**Team:**
- [ ] Knowledge sharing session (15 min/week)
- [ ] Pair programming (2 hours/week)
- [ ] Progress tracking vs timeline

---

**สรุปแนวทาง:**

1. **Composable ไม่เกิน 300 บรรทัด** → แยกถ้าเกิน
2. **ทยอย Merge ทุกวัน** → อย่ารอเสร็จทั้ง Phase
3. **CI/CD บังคับ Test** → Test fail ไม่ให้ Merge
4. **Weekly Review** → เช็คทุกรอยรั่ว

---

## ⚠️ Risks & Mitigation

### **Risk 1: Breaking Changes**
- **Mitigation:**
  - Feature flags
  - A/B testing
  - Gradual rollout
  - **Tests as safety net** (Phase 0)

### **Risk 2: Time Overrun**
- **Mitigation:**
  - Prioritize high-impact items
  - Defer low-priority
  - **Focus on Phase 0 first** (foundation)

### **Risk 3: Team Resistance**
- **Mitigation:**
  - Training sessions
  - Clear documentation
  - Pair programming
  - **Demonstrate value early** (Phase 0 wins)

---

## 📚 Resources

### **Tools**
- **ESLint** - Code quality
- **Prettier** - Code formatting
- **Vitest** - Unit testing
- **Vue Test Utils** - Component testing
- **Playwright** - E2E testing
- **SonarQube** - Code analysis

### **References**
- [Vue 3 Style Guide](https://vuejs.org/style-guide/)
- [Nuxt 3 Best Practices](https://nuxt.com/docs/getting-started/installation)
- [Clean Code principles](https://github.com/ryanmcdermott/clean-code-javascript)
- [Strangler Fig Pattern](https://martinfowler.com/bliki/StranglerFigApplication.html)
- [Test-Driven Development](https://martinfowler.com/bliki/TestDrivenDevelopment.html)

---

## 🚀 Next Steps

### **Preparation Week: Setup CI/CD Foundation**

**ก่อนเริ่ม Phase 0:** ตั้งค่าพื้นฐานก่อน (ใช้เวลา 2-3 วัน)

1. ✅ Setup GitHub Actions หรือ GitLab CI
   - Create `.github/workflows/test.yml`
   - หรือ create `.gitlab-ci.yml`

2. ✅ Configure Branch Protection Rules
   - กำหนด required status checks (lint, test, build)
   - บังคับ code review ก่อน merge

3. ✅ Setup Test Scripts (ถ้ายังไม่มี)
   ```json
   // package.json
   {
     "scripts": {
       "test": "vitest",
       "test:unit": "vitest run --coverage",
       "test:component": "vitest run --config vitest.component.config.ts",
       "lint": "eslint . --ext .vue,.ts",
       "lint:fix": "eslint . --ext .vue,.ts --fix"
     }
   }
   ```

4. ✅ Test CI/CD Pipeline
   - Push test commit → ดูว่า CI รันไหม
   - Check ว่า test fail ปิดการ merge ไหม

---

### **Week 1-2: Phase 0.1 (Calculator Service) - Continuous Integration Style**

**Day 1-2:** Extract velocity calculator
```bash
git checkout -b feat/velocity-calculator
# Create velocityCalculator.ts
git commit -m "feat: add velocity calculator service"
git push origin feat/velocity-calculator
# Create PR → CI runs → Merge ✅ (ยังไม่มีใครใช้)
```

**Day 3-4:** Write tests
```bash
git checkout -b test/velocity-calculator
# Create velocityCalculator.spec.ts
git commit -m "test: add velocity calculator tests"
git push origin test/velocity-calculator
# Create PR → CI runs → Merge ✅
```

**Day 5:** Replace in component
```bash
git checkout -b refactor/use-velocity-calculator
# Update AutoSuggestUpsizing.vue
git commit -m "refactor: use velocity calculator in AutoSuggestUpsizing"
git push origin refactor/use-velocity-calculator
# Create PR → CI runs → Manual test → Merge ✅
```

**✅ Success Criteria:**
- All PRs merged ทีละนิด (small batches)
- CI/CD รันผ่านทุกครั้ง
- No merge conflicts (เพราะ merge บ่อยๆ)

---

### **Week 2: Phase 0.2 (Constants) - Continuous Integration Style**

**Day 1:** Extract constants
```bash
git checkout -b refactor/extract-pipe-constants
# Create shared/constants/pipes.ts
git commit -m "refactor: extract pipe constants"
git push origin refactor/extract-pipe-constants
# Create PR → CI runs → Merge ✅
```

**Day 2:** Write tests
```bash
git checkout -b test/pipe-constants
# Create constants/pipes.spec.ts
git commit -m "test: add pipe constants tests"
git push origin test/pipe-constants
# Create PR → CI runs → Merge ✅
```

**Day 3-5:** Replace in components (ทีละไฟล์)
```bash
# Day 3: AutoSuggestUpsizing.vue
git checkout -b refactor/use-pipe-constants-autosuggest
git commit -m "refactor: use pipe constants in AutoSuggestUpsizing"
# Merge ✅

# Day 4: HybridPipeSizing.vue
git checkout -b refactor/use-pipe-constants-hybrid
git commit -m "refactor: use pipe constants in HybridPipeSizing"
# Merge ✅

# Day 5: NetworkBuilder.vue
git checkout -b refactor/use-pipe-constants-network
git commit -m "refactor: use pipe constants in NetworkBuilder"
# Merge ✅
```

---

### **Week 2-3: Phase 0.3 (Friction Loss) - Continuous Integration Style**

**Day 1:** Extract friction loss calculator
```bash
git checkout -b feat/friction-loss-calculator
# Create frictionLossCalculator.ts
git commit -m "feat: add friction loss calculator service"
# Merge ✅
```

**Day 2:** Write tests
```bash
git checkout -b test/friction-loss-calculator
# Create frictionLossCalculator.spec.ts
git commit -m "test: add friction loss calculator tests"
# Merge ✅
```

**Day 3-4:** Replace in components (ทีละไฟล์)
```bash
# ทยอย replace ในทุก component ที่ใช้ friction loss
# ทีละ PR → ทีละ merge
```

---

### **Month 2: Phase 1 (Split Components) - Continuous Integration Style**

**Week 1-2: NetworkBuilder.vue**

```
Day 1:   feat/create-network-composable           → Merge ✅
Day 2:   test/network-composable                  → Merge ✅
Day 3:   refactor/use-network-composable          → Merge ✅
Day 4:   feat/create-network-dragdrop-composable  → Merge ✅
Day 5:   test/network-dragdrop-composable         → Merge ✅
Day 6:   refactor/use-network-dragdrop            → Merge ✅
Day 7:   feat/create-network-canvas-composable    → Merge ✅
Day 8:   test/network-canvas-composable           → Merge ✅
Day 9:   refactor/use-network-canvas              → Merge ✅
Day 10:  refactor/split-network-builder-vue       → Merge ✅
```

**Week 3-4: AutoSuggestUpsizing.vue**

```
Day 1-2:  feat/pipe-optimizer-composable          → Merge ✅
Day 3:    test/pipe-optimizer-composable          → Merge ✅
Day 4-6:  refactor/split-autosuggest-components   → Merge ✅
```

---

### **Month 3: Phase 2-3 (State + Types)**

**Week 1-2:** Centralize state
- Create `networkStore.ts` → Merge
- Create `versionStore.ts` → Merge
- Create `calculatorStore.ts` → Merge
- Replace component state one by one → Merge

**Week 3-4:** Type safety
- Define `types/network.ts` → Merge
- Remove `any` types component by component → Merge
- Enable ESLint `no-explicit-any` rule → Merge

---

### **Month 4: Phase 4 (Polish)**

**Week 1-2:** Testing
- Add component tests → Merge
- Add E2E tests → Merge
- Achieve 80% coverage → Merge

**Week 3-4:** Documentation
- Add JSDoc comments → Merge
- Update README → Merge
- Create architecture docs → Merge

---

## 📋 Weekly Review Checklist (Updated)

ทุกสัปดาห์ต้องมี:

### **Code Quality**
- [ ] No `any` types added (check with `grep -r "any" src/`)
- [ ] Test coverage ไม่ต่ำกว่าเดิม
- [ ] File length < 500 lines (95% of files)
- [ ] No console.log left in code

### **CI/CD Health**
- [ ] CI/CD pipeline ผ่านหมดทุก build
- [ ] No failing tests (0 test failures)
- [ ] No lint errors
- [ ] All PRs merged (ไม่มี stale branches > 3 days)

### **Process**
- [ ] Code review completed (ทุก PR)
- [ ] Documentation updated (ถ้ามีการเปลี่ยน API)
- [ ] Measure progress vs timeline metrics
- [ ] Update refactor plan (ถ้ามีการเปลี่ยนแผน)

### **Team**
- [ ] Knowledge sharing session (15 min/week)
  - แชร์สิ่งที่เรียนรู้
  - อภิปรายปัญหาที่เจอ
  - แลกเปลี่ยนความคิดเห็น

- [ ] Pair programming (2 hours/week)
  - จับคู่โค้ดด้วยกัน
  - Review code จริงเวลาเขียน
  - ลด bug จากความเข้าใจผิด

- [ ] Demo to stakeholder (optional, ขึ้นกับความต้องการ)

---

**สรุปแนวทางการทำงาน:**

1. **ทยอย Merge ทุกวัน** (Small batches)
   - อย่ารอให้เสร็จทั้ง feature
   - แยกเป็น PR เล็กๆ
   - Merge เข้า develop ทุกวัน

2. **CI/CD เป็นตัวบังคับ** (Automated enforcement)
   - Test fail → ไม่ให้ merge
   - Lint error → ไม่ให้ merge
   - Build fail → ไม่ให้ merge

3. **Code Review ทุก PR** (Human oversight)
   - อย่ามั่วใส่ main
   - Review อย่างน้อย 1 คน
   - Pair programming บ่อยๆ

4. **เช็คสุขภาพทุกสัปดาห์** (Weekly review)
   - ดู metrics
   - ปรับ timeline ถ้าจำเป็น
   - แก้ปัญหาทันทีที่พบ

---

**Last Updated:** 2026-04-27
**Status:** Ready for Implementation
**Approach:** Strangler Fig Pattern + Test-Driven Refactoring + Continuous Integration
**First Phase:** Phase 0 - Testing Foundation (Calculator Service Extraction)

---

## 📌 Summary of Key Improvements (v2.1)

**เพิ่มเติมจาก feedback ประสบการณ์จริง:**

1. **⚠️ CRITICAL IMPLEMENTATION GUIDELINES section added**
   - ระวัง "God Composable" (composable ไม่เกิน 300 บรรทัด)
   - หลีกเลี่ยง Long-lived Branches (ทยอย merge ทุกวัน)
   - บังคับ Test ด้วย CI/CD (automated enforcement)

2. **CI/CD Pipeline Setup**
   - GitHub Actions / GitLab CI configuration examples
   - Branch Protection Rules (block merge if test fails)
   - Automated testing on every push

3. **Continuous Integration Workflow**
   - แก้ "Next Steps" เป็นแบบ day-by-day (small batches)
   - ทยอย merge ทุกวัน ไม่รอเสร็จทั้ง feature
   - ตัวอย่าง git branch/commit workflow ที่ชัดเจน

4. **Improved Composable Structure**
   - แยก `useNetworkBuilder.ts` 800 บรรทัด → 4 composables เล็กๆ
   - `useNetworkState.ts` (200 lines)
   - `useNetworkDragDrop.ts` (150 lines)
   - `useNetworkCanvas.ts` (150 lines)
   - `useNetworkSnapshots.ts` (100 lines)

5. **Enhanced Weekly Review Checklist**
   - เพิ่ม CI/CD Health checks
   - เพิ่ม Team development activities (pair programming, knowledge sharing)
   - เพิ่ม Code Quality metrics (no any types, file length limits)

**สิ่งที่ไม่เปลี่ยน:**
- ✅ Phase 0 ยังคงเป็นจุดเริ่มต้น (Testing Foundation)
- ✅ Strangler Fig Pattern ยังคงเป็นแกนหลัก
- ✅ Test-Driven Refactoring ยังคงเป็นวิธีหลัก
- ✅ 3-month timeline ยังคงเดิม

**สิ่งที่ปรับปรุง:**
- ✅ เพิ่มคำแนะนำระดับปฏิบัติจากประสบการณ์จริง
- ✅ เน้น Continuous Integration (ทยอย merge บ่อยๆ)
- ✅ เน้น Automation (CI/CD บังคับ test)
- ✅ ตัวอย่าง workflow ที่ชัดเจนและนำไปใช้ได้จริง

**Ready to present to stakeholders for approval! 🚀**
