<template>
  <div class="flex-1 relative overflow-auto h-full w-full bg-gray-100">
    <!-- Canvas Container -->
    <div
      ref="canvasContainerRef"
      class="flex-1 bg-gray-100 relative h-full w-full"
    >
      <!-- Zoom Wrapper - หุ้ม Blueprint, Pipes, Nodes ทั้งหมด -->
      <div
        class="absolute inset-0 origin-top-left"
        :style="{
          transform: `scale(${zoom})`,
          transformOrigin: 'top left'
        }"
      >
      <!-- Background Layer: Blueprints (z-index: 0) -->
      <div
        v-if="blueprints && blueprints.length > 0"
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
        v-if="blueprints && blueprints.length > 0"
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

      <!-- Pipes Layer (z-index: 1) - SVG polylines -->
      <svg
        v-if="networkData?.pipes"
        class="absolute inset-0 w-full h-full pointer-events-none"
        style="z-index: 1"
        overflow="visible"
        shape-rendering="crispEdges"
      >
        <g
          v-for="pipe in networkData.pipes"
          :key="pipe.id"
          class="cursor-pointer"
          :style="{ pointerEvents: 'auto' }"
        >
          <!-- Polyline -->
          <polyline
            :points="getOrthogonalPathPoints(pipe)"
            fill="none"
            :stroke="isCriticalPath(pipe) ? '#F59E0B' : pipeColor"
            :stroke-width="isCriticalPath(pipe) ? 3 : 2"
            stroke-dasharray="5,5"
          />

          <!-- Arrow -->
          <g
            :transform="`translate(${getOrthogonalMidpoint(pipe).x}, ${getOrthogonalMidpoint(pipe).y}) rotate(${getPipeAngle(pipe)})`"
          >
            <polygon
              points="-6,-5 8,0 -6,5"
              :fill="isCriticalPath(pipe) ? '#F59E0B' : pipeColor"
            />
          </g>

          <!-- Length label -->
<text
  :x="getOrthogonalMidpoint(pipe).x"
  :y="getOrthogonalMidpoint(pipe).y - 12"
  class="text-xs fill-gray-600 font-medium"
  text-anchor="middle"
>
  {{ Number(pipe.length || 0).toFixed(1) }}m
</text>

          <!-- Pipe size label -->
          <text
            v-if="pipe.nominalSize"
            :x="getOrthogonalMidpoint(pipe).x"
            :y="getOrthogonalMidpoint(pipe).y + 20"
            class="text-xs fill-blue-600 font-bold"
            text-anchor="middle"
            style="text-shadow: 1px 1px 0px white, -1px -1px 0px white, 1px -1px 0px white, -1px 1px 0px white;"
          >
            {{ formatPipeSize(pipe.nominalSize) }}
          </text>

          <!-- Critical Path Badge -->
          <text
            v-if="isCriticalPath(pipe)"
            :x="getOrthogonalMidpoint(pipe).x"
            :y="getOrthogonalMidpoint(pipe).y + 35"
            class="text-[10px] font-bold"
            fill="#F59E0B"
            text-anchor="middle"
          >
            Critical
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
            class="flex items-center justify-center w-6 h-6 rounded-full border-2 shadow-sm"
            :class="getNodeClass(node)"
          >
            <span
              v-html="getNodeIcon(node.type)"
              class="text-white text-xs"
            ></span>
          </div>

          <!-- Node label -->
          <div
            v-if="node.label"
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
        v-if="networkData?.scale"
        class="absolute bottom-2 left-2 text-xs text-gray-500 bg-white px-2 py-1 rounded shadow-sm"
        style="pointer-events: none"
      >
        Scale: {{ networkData.scale }} px/m
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
</template>

<script setup lang="ts">
import { ref, computed, onMounted, watch } from 'vue'

const props = defineProps<{
  networkData?: any
  blueprints?: any[]
}>()

const zoom = ref(1)

// Watch networkData changes
watch(() => props.networkData, (newData) => {
  console.log('[NetworkComparisonViewer] networkData changed:', newData)
  if (newData?.pipes) {
    console.log('[NetworkComparisonViewer] Total pipes:', newData.pipes.length)
    newData.pipes.forEach((pipe: any, index: number) => {
      console.log(`[NetworkComparisonViewer] Pipe ${index}:`, {
        id: pipe.id,
        sourceNodeId: pipe.sourceNodeId,
        targetNodeId: pipe.targetNodeId
      })
    })
  }
}, { immediate: true, deep: true })

// Computed colors
const pipeColor = computed(() => {
  return '#3b82f6'
})

// Methods
const getLayerColor = (layerIndex: number) => {
  const colors = ['#ef4444', '#3b82f6', '#10b981', '#f59e0b']
  return colors[layerIndex % colors.length]
}

const getNodeClass = (node: any) => {
  const nodeType = (node.type || 'default').toLowerCase()
  const typeClasses: Record<string, string> = {
    source: 'bg-green-500 border-green-600',
    endpoint: 'bg-red-500 border-red-600',
    junction: 'bg-blue-500 border-blue-600',
    fixture: 'bg-yellow-500 border-yellow-600',
    default: 'bg-white border-gray-400'
  }
  return typeClasses[nodeType] || typeClasses.default
}

const getNodeIcon = (nodeType: string) => {
  const type = (nodeType || 'junction').toLowerCase()
  const icons: Record<string, string> = {
    source: `<svg class="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 10V3L4 14h7v7l9-11h-7z" /></svg>`,
    endpoint: `<svg class="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>`,
    junction: `<svg class="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 14v6m-3-3h6M6 10h2a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v2a2 2 0 002 2zm10 0h2a2 2 0 002-2V6a2 2 0 00-2-2h-2a2 2 0 00-2 2v2a2 2 0 002 2zM6 20h2a2 2 0 002-2v-2a2 2 0 00-2-2H6a2 2 0 00-2 2v2a2 2 0 002 2z" /></svg>`,
    fixture: `<svg class="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" /></svg>`
  }
  return icons[type] || icons.junction
}

const getNodeFixtureCount = (node: any) => {
  return node.fixtures?.length || 0
}

const isCriticalPath = (pipe: any) => {
  return pipe.isCriticalPath === true || pipe.isCriticalPath === 'true'
}

const getFromNode = (pipe: any) => {
  const node = props.networkData?.nodes?.find((n: any) => n.id === pipe.sourceNodeId)
  if (!node) {
    console.warn('[getFromNode] Node not found for pipe:', {
      pipeId: pipe.id,
      sourceNodeId: pipe.sourceNodeId,
      availableNodes: props.networkData?.nodes?.map((n: any) => n.id)
    })
  }
  return node
}

const getToNode = (pipe: any) => {
  const node = props.networkData?.nodes?.find((n: any) => n.id === pipe.targetNodeId)
  if (!node) {
    console.warn('[getToNode] Node not found for pipe:', {
      pipeId: pipe.id,
      targetNodeId: pipe.targetNodeId,
      availableNodes: props.networkData?.nodes?.map((n: any) => n.id)
    })
  }
  return node
}

const getOrthogonalPathPoints = (pipe: any) => {
  const fromNode = getFromNode(pipe)
  const toNode = getToNode(pipe)

  if (!fromNode || !toNode) return ''

  // ครอบ Number() ให้หมดเพื่อป้องกัน String Concatenation
  const x1 = Number(fromNode.x) || 0
  const y1 = Number(fromNode.y) || 0
  const x2 = Number(toNode.x) || 0
  const y2 = Number(toNode.y) || 0

  const midX = (x1 + x2) / 2
  const midY = (y1 + y2) / 2

  if (Math.abs(x2 - x1) > Math.abs(y2 - y1)) {
    return `${x1},${y1} ${midX},${y1} ${midX},${y2} ${x2},${y2}`
  } else {
    return `${x1},${y1} ${x1},${midY} ${x2},${midY} ${x2},${y2}`
  }
}

const getOrthogonalMidpoint = (pipe: any) => {
  const fromNode = getFromNode(pipe)
  const toNode = getToNode(pipe)

  if (!fromNode || !toNode) return { x: 0, y: 0 }

  const x1 = Number(fromNode.x) || 0
  const y1 = Number(fromNode.y) || 0
  const x2 = Number(toNode.x) || 0
  const y2 = Number(toNode.y) || 0

  const midX = (x1 + x2) / 2
  const midY = (y1 + y2) / 2

  if (Math.abs(x2 - x1) > Math.abs(y2 - y1)) {
    // วางลูกศรไว้กึ่งกลางของ "ท่อนแรก" (แนวนอน)
    return { x: (x1 + midX) / 2, y: y1 }
  } else {
    // วางลูกศรไว้กึ่งกลางของ "ท่อนแรก" (แนวตั้ง)
    return { x: x1, y: (y1 + midY) / 2 }
  }
}

const getPipeAngle = (pipe: any) => {
  const fromNode = getFromNode(pipe)
  const toNode = getToNode(pipe)

  if (!fromNode || !toNode) return 0

  const x1 = Number(fromNode.x) || 0
  const y1 = Number(fromNode.y) || 0
  const x2 = Number(toNode.x) || 0
  const y2 = Number(toNode.y) || 0

  const dx = x2 - x1
  const dy = y2 - y1

  if (Math.abs(dx) > Math.abs(dy)) {
    return dx > 0 ? 0 : 180
  } else {
    return dy > 0 ? 90 : -90
  }
}

const formatPipeSize = (size: any) => {
  if (!size) return '-'

  const strSize = String(size).trim();

  // 1. ถ้ารูปแบบถูกส่งมาเป็นแบบมี นิ้ว และ วงเล็บมิลลิเมตรอยู่แล้ว ให้คืนค่าเลย
  if (strSize.includes('"') && strSize.includes('(')) {
    return strSize;
  }

  // 2. ดึงเฉพาะตัวเลขออกมา เผื่อฐานข้อมูลส่งมาเป็น "15", "15mm" หรือ 15
  const mmMatch = strSize.match(/^[\d.]+/);
  if (!mmMatch) return strSize; // ถ้าหาตัวเลขไม่เจอเลย ให้แสดงค่าเดิมที่ส่งมา

  const numSize = parseFloat(mmMatch[0]);

  // 3. ตารางแปลงมิลลิเมตร (Nominal Size) เป็นขนาดนิ้วมาตรฐานท่อประปา
  const sizeMap: Record<number, string> = {
    15: '1/2"',
    20: '3/4"',
    25: '1"',
    32: '1 1/4"',
    40: '1 1/2"',
    50: '2"',
    65: '2 1/2"',
    80: '3"',
    100: '4"',
    150: '6"',
    200: '8"'
  };

  // 4. จัดรูปแบบการแสดงผล: ขนาดนิ้ว" (ขนาดมิลลิเมตรmm)
  if (sizeMap[numSize]) {
    return `${sizeMap[numSize]} (${numSize}mm)`;
  }

  // 5. กรณีตัวเลขไม่อยู่ในตารางมาตรฐาน ให้คำนวณหาร 25.4 เอง
  const inches = (numSize / 25.4).toFixed(2);
  // ตัด .00 ออกถ้าเป็นจำนวนเต็มเป๊ะๆ เพื่อความสวยงาม
  return `${inches.replace(/\.00$/, '')}" (${numSize}mm)`;
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

// Auto-fit on mount
onMounted(() => {
  console.log('[NetworkComparisonViewer] onMounted')
  console.log('[NetworkComparisonViewer] networkData:', props.networkData)
  console.log('[NetworkComparisonViewer] blueprints:', props.blueprints)

  if (props.networkData) {
    console.log('[NetworkComparisonViewer] nodes:', props.networkData.nodes?.length || 0)
    console.log('[NetworkComparisonViewer] pipes:', props.networkData.pipes?.length || 0)

    if (props.networkData.pipes && props.networkData.pipes.length > 0) {
      console.log('[NetworkComparisonViewer] Sample pipe:', props.networkData.pipes[0])
    }
  }

  if (props.networkData?.nodes && props.networkData.nodes.length > 0) {
    // Calculate bounding box
    const xs = props.networkData.nodes.map((n: any) => n.x || 0)
    const ys = props.networkData.nodes.map((n: any) => n.y || 0)
    const minX = Math.min(...xs)
    const maxX = Math.max(...xs)
    const minY = Math.min(...ys)
    const maxY = Math.max(...ys)

    console.log('[NetworkComparisonViewer] Bounding box:', { minX, maxX, minY, maxY })

    // Auto-fit zoom
    const container = document.querySelector('.network-comparison-viewer') || document.querySelector('.relative.overflow-auto')
    if (container) {
      const containerWidth = container.clientWidth
      const containerHeight = container.clientHeight

      const networkWidth = maxX - minX + 100
      const networkHeight = maxY - minY + 100

      const zoomX = containerWidth / networkWidth
      const zoomY = containerHeight / networkHeight
      zoom.value = Math.min(zoomX, zoomY, 1)

      console.log('[NetworkComparisonViewer] Auto-fit zoom:', zoom.value)
    }
  }
})
</script>

<style scoped>
.network-comparison-viewer {
  height: 100%;
  width: 100%;
}
</style>
