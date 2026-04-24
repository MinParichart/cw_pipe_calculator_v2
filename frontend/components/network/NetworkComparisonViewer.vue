<template>
  <div class="flex-1 relative overflow-auto h-full w-full">
    <!-- Canvas Container -->
    <div
      ref="canvasContainerRef"
      class="flex-1 bg-gray-100 relative h-full w-full"
    >
      <!-- Zoom Wrapper -->
      <div
        class="absolute inset-0 origin-top-left"
        :style="{
          transform: `scale(${zoom})`,
          transformOrigin: 'top left'
        }"
      >
        <!-- Background Layer: Blueprint (z-index: 0) -->
        <div
          v-if="networkData && blueprints.length > 0"
          class="absolute inset-0"
          style="z-index: 0; pointer-events: none"
        >
          <!-- Single Blueprint -->
          <div
            v-if="blueprints.length === 1"
            class="absolute inset-0 opacity-60"
            :style="{
              backgroundImage: `url(${blueprints[0].url})`,
              backgroundSize: 'contain',
              backgroundPosition: 'center',
              backgroundRepeat: 'no-repeat'
            }"
          ></div>

          <!-- Split Blueprints (2 floors) -->
          <div
            v-else-if="blueprints.length === 2"
            class="absolute inset-0 flex"
            style="opacity: 0.6"
          >
            <div
              class="flex-1 border-r"
              :style="{
                backgroundImage: `url(${blueprints[0].url})`,
                backgroundSize: 'contain',
                backgroundPosition: 'center',
                backgroundRepeat: 'no-repeat'
              }"
            ></div>
            <div
              class="flex-1"
              :style="{
                backgroundImage: `url(${blueprints[1].url})`,
                backgroundSize: 'contain',
                backgroundPosition: 'center',
                backgroundRepeat: 'no-repeat'
              }"
            ></div>
          </div>
        </div>

        <!-- Blueprint Labels -->
        <div
          v-if="blueprints.length > 0"
          style="z-index: 5; pointer-events: none"
        >
          <div v-if="blueprints.length === 1" class="absolute top-2 left-2">
            <div
              class="bg-white bg-opacity-90 px-2 py-1 rounded text-xs font-medium shadow-sm"
              :style="{ borderLeft: `3px solid ${getLayerColor(0)}` }"
            >
              {{ blueprints[0].floorText }}
            </div>
          </div>
          <template v-else>
            <div class="absolute top-2 left-2">
              <div
                class="bg-white bg-opacity-90 px-2 py-1 rounded text-xs font-medium shadow-sm"
                :style="{ borderLeft: `3px solid ${getLayerColor(0)}` }"
              >
                {{ blueprints[0].floorText }}
              </div>
            </div>
            <div class="absolute top-2 right-2">
              <div
                class="bg-white bg-opacity-90 px-2 py-1 rounded text-xs font-medium shadow-sm"
                :style="{ borderLeft: `3px solid ${getLayerColor(1)}` }"
              >
                {{ blueprints[1].floorText }}
              </div>
            </div>
          </template>
        </div>

        <!-- Pipes Layer (z-index: 1) -->
        <svg
          v-if="networkData?.pipes"
          class="absolute inset-0 w-full h-full pointer-events-none"
          style="z-index: 1"
          overflow="visible"
        >
          <g
            v-for="pipe in networkData.pipes"
            :key="pipe.id"
            class="cursor-pointer"
            :style="{ pointerEvents: 'auto' }"
          >
            <polyline
              :points="getOrthogonalPathPoints(pipe)"
              fill="none"
              :stroke="pipeColor"
              :stroke-width="pipeStrokeWidth"
              stroke-dasharray="5,5"
              stroke-linecap="round"
              stroke-linejoin="round"
            />

            <!-- Arrow indicator -->
            <g
              :transform="`translate(${getOrthogonalMidpoint(pipe).x}, ${getOrthogonalMidpoint(pipe).y}) rotate(${getPipeAngle(pipe)})`"
            >
              <polygon
                points="-6,-5 8,0 -6,5"
                :fill="pipeColor"
              />
            </g>

            <!-- Length label -->
            <text
              v-if="showPipeLabels"
              :x="getOrthogonalMidpoint(pipe).x"
              :y="getOrthogonalMidpoint(pipe).y - 12"
              class="text-xs fill-gray-600 font-medium"
              text-anchor="middle"
            >
              {{ (pipe.length || 0).toFixed(1) }}m
            </text>

            <!-- Pipe size label -->
            <text
              v-if="showPipeLabels && pipe.nominalSize"
              :x="getOrthogonalMidpoint(pipe).x"
              :y="getOrthogonalMidpoint(pipe).y + 20"
              class="text-xs font-bold"
              :fill="pipeColor"
              text-anchor="middle"
              style="text-shadow: 1px 1px 0px white, -1px -1px 0px white, 1px -1px 0px white, -1px 1px 0px white;"
            >
              {{ formatPipeSize(pipe.nominalSize) }}
            </text>
          </g>
        </svg>

        <!-- Nodes Layer (z-index: 10) -->
        <div
          v-if="networkData?.nodes"
          class="absolute inset-0"
          style="z-index: 10"
        >
          <div
            v-for="node in networkData.nodes"
            :key="node.id"
            class="absolute transform -translate-x-1/2 -translate-y-1/2 transition-shadow"
            :style="{
              left: `${node.x}px`,
              top: `${node.y}px`,
              zIndex: 10,
              pointerEvents: 'auto'
            }"
          >
            <!-- Node circle -->
            <div
              class="flex items-center justify-center rounded-full border-2 shadow-sm"
              :class="getNodeClass(node)"
              :style="{
                width: '24px',
                height: '24px'
              }"
            >
              <span
                v-html="getNodeIcon(node.type)"
                class="text-white text-sm"
              ></span>
            </div>

            <!-- Node label -->
            <div
              v-if="node.label && showNodeLabels"
              class="absolute top-full mt-1 text-xs font-medium text-gray-700 whitespace-nowrap bg-white px-1 rounded"
            >
              {{ node.label }}
            </div>

            <!-- Fixture count badge -->
            <div
              v-if="getNodeFixtureCount(node) > 0"
              class="absolute -top-1 -right-1 w-4 h-4 text-white text-xs rounded-full flex items-center justify-center font-bold"
              :style="{ backgroundColor: pipeColor }"
            >
              {{ getNodeFixtureCount(node) }}
            </div>
          </div>
        </div>

        <!-- Scale indicator -->
        <div
          v-if="networkScale"
          class="absolute bottom-2 left-2 text-xs text-gray-500 bg-white px-2 py-1 rounded shadow-sm"
          style="pointer-events: none"
        >
          Scale: {{ networkScale }} px/m
        </div>

        <!-- Stats -->
        <div
          class="absolute top-2 right-2 text-xs text-gray-600 bg-white bg-opacity-90 px-2 py-1 rounded shadow-sm"
          style="pointer-events: none"
        >
          {{ networkData?.nodes?.length || 0 }} nodes,
          {{ networkData?.pipes?.length || 0 }} pipes
        </div>
      </div>

      <!-- Zoom controls -->
      <div class="absolute bottom-4 right-4 flex flex-col gap-2 z-50">
        <button
          @click="zoomIn"
          class="p-2 bg-white rounded-lg shadow-md hover:bg-gray-50 border border-gray-200"
          title="ซูมเข้า"
        >
          <svg class="w-5 h-5 text-gray-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
          </svg>
        </button>
        <button
          @click="zoomOut"
          class="p-2 bg-white rounded-lg shadow-md hover:bg-gray-50 border border-gray-200"
          title="ซูมออก"
        >
          <svg class="w-5 h-5 text-gray-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M20 12H4" />
          </svg>
        </button>
        <button
          @click="resetView"
          class="p-2 bg-white rounded-lg shadow-md hover:bg-gray-50 border border-gray-200"
          title="รีเซ็ตมุมมอง"
        >
          <svg class="w-5 h-5 text-gray-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
          </svg>
        </button>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'

const props = defineProps<{
  networkData?: any
  blueprints?: any[]
  scale?: number
  canvasWidth?: number
  canvasHeight?: number
  color?: 'blue' | 'orange'
}>()

const canvasContainerRef = ref<HTMLElement>()
const zoom = ref(1)
const networkScale = ref(props.scale || 50) // Scale from NetworkBuilder (pixels per meter)
const showNodeLabels = ref(true)
const showPipeLabels = ref(true)

// Canvas dimensions from NetworkBuilder (if saved)
const savedCanvasWidth = ref(props.canvasWidth)
const savedCanvasHeight = ref(props.canvasHeight)

// Computed colors
const pipeColor = computed(() => {
  return props.color === 'orange' ? '#f97316' : '#3b82f6'
})

const pipeStrokeWidth = computed(() => {
  return 2
})

// Methods
const getLayerColor = (layerIndex: number) => {
  const colors = ['#ef4444', '#3b82f6', '#10b981', '#f59e0b']
  return colors[layerIndex % colors.length]
}

const getNodeClass = (node: any) => {
  const typeClasses: Record<string, string> = {
    source: 'bg-green-500 border-green-600',
    endpoint: 'bg-red-500 border-red-600',
    junction: 'bg-blue-500 border-blue-600',
    fixture: 'bg-yellow-500 border-yellow-600',
    default: 'bg-white border-gray-400'
  }
  return typeClasses[node.type] || typeClasses.default
}

const getNodeIcon = (nodeType: string) => {
  const icons: Record<string, string> = {
    source: `<svg class="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 10V3L4 14h7v7l9-11h-7z" /></svg>`,
    endpoint: `<svg class="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>`,
    junction: `<svg class="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 14v6m-3-3h6M6 10h2a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v2a2 2 0 002 2zm10 0h2a2 2 0 002-2V6a2 2 0 00-2-2h-2a2 2 0 00-2 2v2a2 2 0 002 2zM6 20h2a2 2 0 002-2v-2a2 2 0 00-2-2H6a2 2 0 00-2 2v2a2 2 0 002 2z" /></svg>`,
    fixture: `<svg class="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" /></svg>`
  }
  return icons[nodeType] || icons.junction
}

const getNodeFixtureCount = (node: any) => {
  return node.fixtures?.length || 0
}

const getOrthogonalPathPoints = (pipe: any) => {
  // Get node positions
  const fromNode = props.networkData?.nodes?.find((n: any) => n.id === pipe.fromNode)
  const toNode = props.networkData?.nodes?.find((n: any) => n.id === pipe.toNode)

  if (!fromNode || !toNode) return ''

  const x1 = fromNode.x || 0
  const y1 = fromNode.y || 0
  const x2 = toNode.x || 0
  const y2 = toNode.y || 0

  // Create orthogonal path (horizontal → vertical or vertical → horizontal)
  const midX = (x1 + x2) / 2
  const midY = (y1 + y2) / 2

  // Choose path based on direction
  if (Math.abs(x2 - x1) > Math.abs(y2 - y1)) {
    // Horizontal first, then vertical
    return `${x1},${y1} ${midX},${y1} ${midX},${y2} ${x2},${y2}`
  } else {
    // Vertical first, then horizontal
    return `${x1},${y1} ${x1},${midY} ${x2},${midY} ${x2},${y2}`
  }
}

const getOrthogonalMidpoint = (pipe: any) => {
  const fromNode = props.networkData?.nodes?.find((n: any) => n.id === pipe.fromNode)
  const toNode = props.networkData?.nodes?.find((n: any) => n.id === pipe.toNode)

  if (!fromNode || !toNode) return { x: 0, y: 0 }

  const x1 = fromNode.x || 0
  const y1 = fromNode.y || 0
  const x2 = toNode.x || 0
  const y2 = toNode.y || 0

  return {
    x: (x1 + x2) / 2,
    y: (y1 + y2) / 2
  }
}

const getPipeAngle = (pipe: any) => {
  const fromNode = props.networkData?.nodes?.find((n: any) => n.id === pipe.fromNode)
  const toNode = props.networkData?.nodes?.find((n: any) => n.id === pipe.toNode)

  if (!fromNode || !toNode) return 0

  const x1 = fromNode.x || 0
  const y1 = fromNode.y || 0
  const x2 = toNode.x || 0
  const y2 = toNode.y || 0

  const angle = Math.atan2(y2 - y1, x2 - x1) * 180 / Math.PI
  return angle
}

const formatPipeSize = (size: number) => {
  if (!size) return '-'
  const inches = (size / 25.4).toFixed(2)
  return `${size}mm (${inches}")`
}

const zoomIn = () => {
  zoom.value = Math.min(3, zoom.value + 0.2)
}

const zoomOut = () => {
  zoom.value = Math.max(0.1, zoom.value - 0.2)
}

const resetView = () => {
  zoom.value = 1
}

// Auto-fit network on mount
onMounted(() => {
  console.log('[NetworkComparisonViewer] onMounted')
  console.log('[NetworkComparisonViewer] props.networkData:', props.networkData)
  console.log('[NetworkComparisonViewer] props.blueprints:', props.blueprints)
  console.log('[NetworkComparisonViewer] props.color:', props.color)

  if (props.networkData?.nodes && props.networkData.nodes.length > 0) {
    // Calculate bounding box
    const xs = props.networkData.nodes.map((n: any) => n.x || 0)
    const ys = props.networkData.nodes.map((n: any) => n.y || 0)
    const minX = Math.min(...xs)
    const maxX = Math.max(...xs)
    const minY = Math.min(...ys)
    const maxY = Math.max(...ys)

    // Get container size
    const container = canvasContainerRef.value
    if (container) {
      const containerWidth = container.clientWidth
      const containerHeight = container.clientHeight

      const networkWidth = maxX - minX + 100
      const networkHeight = maxY - minY + 100

      // Calculate zoom to fit
      const zoomX = containerWidth / networkWidth
      const zoomY = containerHeight / networkHeight
      zoom.value = Math.min(zoomX, zoomY, 1) // Don't zoom in more than 1x
    }
  }
})
</script>

<style scoped>
/* Prevent text selection during drag */
div {
  user-select: none;
}
</style>
