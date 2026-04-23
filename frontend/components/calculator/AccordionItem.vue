<template>
  <div class="accordion-item">
    <!-- Accordion Header -->
    <div
      class="accordion-header"
      :class="{
        'border-orange-300 bg-orange-50': item.type === 'critical',
        'border-green-300 bg-green-50': item.type === 'branch'
      }"
      @click="toggle"
    >
      <div class="flex items-center justify-between flex-1">
        <div class="flex items-center gap-3">
          <!-- Toggle Icon -->
          <div class="toggle-icon" :class="{ 'rotate-90': isOpen }">
            <svg class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7" />
            </svg>
          </div>

          <!-- Pipe Name -->
          <div>
            <div class="font-semibold text-gray-900">
              {{ item.pipeLoad.fromNode }} → {{ item.pipeLoad.toNode }}
            </div>
            <div class="flex items-center gap-3 mt-1">
              <span class="text-sm text-gray-600">{{ item.pipeLoad.length.toFixed(1) }}m</span>
              <span
                v-if="item.type === 'critical'"
                class="px-2 py-0.5 text-xs rounded-full bg-orange-100 text-orange-800"
              >
                Critical Path
              </span>
              <span
                v-else
                class="px-2 py-0.5 text-xs rounded-full bg-green-100 text-green-800"
              >
                Branch
              </span>
            </div>
            <div class="bg-white rounded-lg p-3 border border-gray-200 shadow-sm mt-2">
              <div class="space-y-1.5">
                <!-- WC Systems (UPC Standard) -->
                <div v-if="getGPMBreakdown().flushTankFU > 0 || getGPMBreakdown().flushValveFU > 0" class="flex items-center justify-between gap-4 text-xs">
                  <span class="text-gray-600 font-medium">
                    {{ getGPMBreakdown().upcSystemType === 'FLUSH_TANK' ? '🚽 Flush Tank:' : '🚰 Mixed System (Flush Tank + Valve):' }}
                  </span>
                  <span class="text-gray-900 font-semibold">
                    {{ getGPMBreakdown().upcTotalFU }} FU → {{ (getGPMBreakdown().flushTankGPM + getGPMBreakdown().flushValveGPM).toFixed(1) }} GPM
                  </span>
                </div>
                <div v-if="getGPMBreakdown().upcSystemType === 'FLUSH_VALVE' && getGPMBreakdown().flushTankFU > 0 && getGPMBreakdown().flushValveFU > 0" class="flex items-center justify-between gap-4 text-xs text-orange-600">
                  <span class="font-medium">└─ โดย:</span>
                  <span class="font-semibold">
                    {{ getGPMBreakdown().flushTankFU }} Tank + {{ getGPMBreakdown().flushValveFU }} Valve FU
                  </span>
                </div>

                <!-- Hose Bibb -->
                <div v-if="getGPMBreakdown().hoseBibbGPM > 0" class="flex items-center justify-between gap-4 text-xs">
                  <span class="text-gray-600 font-medium">🚿 Hose Bibb:</span>
                  <span class="text-gray-900 font-semibold">{{ getGPMBreakdown().hoseBibbGPM }} GPM</span>
                </div>

                <!-- Total -->
                <div class="border-t border-gray-200 pt-2 mt-2">
                  <div class="flex items-center justify-between gap-4 text-xs">
                    <span class="text-blue-600 font-bold">Total:</span>
                    <span class="text-blue-600 font-bold text-lg">{{ getGPMBreakdown().totalGPM.toFixed(1) }} GPM</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        <!-- Quick Info (Collapsed state) -->
        <div v-if="!isOpen" class="text-xs text-gray-600">
          {{ item.pipeLoad.nodes.length }} nodes • {{ item.pipeLoad.fixtures.length }} fixtures
        </div>
      </div>
    </div>

    <!-- Accordion Content (Expanded state) -->
    <div v-if="isOpen" class="accordion-content">
      <!-- Nodes Section -->
      <div v-if="item.pipeLoad.nodes.length > 0" class="mb-4">
        <div class="text-xs font-medium text-gray-700 mb-2">Nodes ที่เชื่อมต่อ:</div>
        <div class="flex flex-wrap gap-2">
          <span
            v-for="node in item.pipeLoad.nodes"
            :key="node.id"
            class="px-3 py-1 bg-purple-100 text-purple-800 rounded-full text-xs font-medium"
          >
            {{ node.label }} ({{ node.type }})
          </span>
        </div>
      </div>

      <!-- Fixtures Section -->
      <div v-if="item.pipeLoad.fixtureGroups.length > 0">
        <div class="text-xs font-medium text-gray-700 mb-2">สุขภัณฑ์ที่จ่าย:</div>

        <!-- Grouped by Type -->
        <div class="grid grid-cols-1 md:grid-cols-2 gap-2">
          <div
            v-for="group in item.pipeLoad.fixtureGroups"
            :key="group.type"
            class="bg-white rounded-lg p-3 border border-gray-200"
          >
            <div class="flex items-center justify-between mb-2">
              <div class="flex items-center gap-2">
                <span class="text-sm font-medium text-gray-900">{{ getFixtureTypeName(group.type) }}</span>
                <span class="px-2 py-0.5 text-xs bg-blue-100 text-blue-800 rounded-full">
                  {{ group.count }} ชุด
                </span>
              </div>
              <div class="text-sm font-bold text-blue-600" v-if="group.type !== 'HOSE_BIBB'">
                {{ group.totalFU }} FU
              </div>
            </div>

            <div class="text-xs text-gray-500">
              <span v-if="group.type === 'HOSE_BIBB'">{{ getGroupGPM(group) }} GPM</span>
              <span v-else>FU: {{ getStandardFU(group.type) }} ต่อชุด</span>
            </div>
          </div>
        </div>
      </div>

      <!-- Empty State -->
      <div v-else class="text-xs text-gray-500 italic">
        ไม่มีสุขภัณฑ์เชื่อมต่อ
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { fuToGPM, calculateUPCGPM } from '../../../shared/constants/hunterCurve'

const props = defineProps<{
  item: {
    id: string
    type: 'critical' | 'branch'
    order: number
    pipe: any
    pipeLoad: {
      pipe: any
      fromNode: string
      toNode: string
      fixtures: any[]
      nodes: any[]
      fixtureGroups: any[]
      totalFU: number
      length: number
    }
  }
}>()

const isOpen = ref(false)

const toggle = () => {
  isOpen.value = !isOpen.value
}

const getFixtureTypeName = (type: string) => {
  const typeNames: Record<string, string> = {
    'WC_TANK': 'WC (Flush Tank)',
    'WC_VALVE': 'WC (Flush Valve)',
    'LAVATORY': 'Lavatory',
    'BATHTUB': 'Bathtub',
    'SHOWER': 'Shower',
    'HOSE_BIBB': 'Hose Bibb',
    'KITCHEN_SINK': 'Kitchen Sink',
    'LAUNDRY_TRAY': 'Laundry Tray',
    'DISHWASHER': 'Dishwasher',
    'WASHING_MACHINE_3_5KG': 'Washing Machine 3.5kg',
    'WASHING_MACHINE_7KG': 'Washing Machine 7kg'
  }
  return typeNames[type] || type
}

const getStandardFU = (type: string) => {
  const standardFU: Record<string, number> = {
    'WC_TANK': 3,
    'WC_VALVE': 6,
    'LAVATORY': 1,
    'BATHTUB': 2,
    'SHOWER': 2,
    'HOSE_BIBB': 0,
    'KITCHEN_SINK': 2,
    'LAUNDRY_TRAY': 3,
    'DISHWASHER': 1,
    'WASHING_MACHINE_3_5KG': 2,
    'WASHING_MACHINE_7KG': 4
  }
  return standardFU[type] || 1
}

// Get GPM value for hose bibb (constant flow rate)
const getHoseBibbGPM = () => {
  return 5
}

// Get GPM for a fixture group using Hunter's Curve
const getGroupGPM = (group: any) => {
  if (group.type === 'HOSE_BIBB') {
    // Hose bibb: 5 GPM per unit
    return group.count * 5
  } else {
    // Other fixtures: Convert FU to GPM using Hunter's Curve
    const totalFU = group.totalFU
    return fuToGPM(totalFU, 'FLUSH_TANK')
  }
}

// Calculate Total GPM for this pipe using Hunter's Curve (legacy - for display only)
const getTotalGPM = () => {
  return fuToGPM(props.item.pipeLoad.totalFU, 'FLUSH_TANK')
}

// Calculate Total GPM with proper handling of Flush Tank vs Flush Valve
const getTotalGPMWithHoseBibb = () => {
  // Separate FU for Flush Tank and Flush Valve fixtures
  let flushTankFU = 0
  let flushValveFU = 0
  let hoseBibbCount = 0

  // Count fixtures by type
  if (props.item.pipeLoad.fixtures && Array.isArray(props.item.pipeLoad.fixtures)) {
    props.item.pipeLoad.fixtures.forEach((fixture: any) => {
      if (fixture.type === 'HOSE_BIBB') {
        hoseBibbCount += fixture.quantity || 1
      } else if (fixture.type === 'WC_VALVE') {
        // WC Valve uses Flush Valve curve
        const fu = getStandardFU(fixture.type)
        flushValveFU += fu * (fixture.quantity || 1)
      } else if (fixture.type === 'WC_TANK') {
        // WC Tank uses Flush Tank curve
        const fu = getStandardFU(fixture.type)
        flushTankFU += fu * (fixture.quantity || 1)
      } else {
        // Other fixtures use Flush Tank curve
        const fu = getStandardFU(fixture.type)
        flushTankFU += fu * (fixture.quantity || 1)
      }
    })
  }

  // Calculate GPM from each curve
  const gpmFromFlushTank = fuToGPM(flushTankFU, 'FLUSH_TANK')
  const gpmFromFlushValve = fuToGPM(flushValveFU, 'FLUSH_VALVE')
  const gpmFromHoseBibb = hoseBibbCount * 5

  return gpmFromFlushTank + gpmFromFlushValve + gpmFromHoseBibb
}

// Get detailed breakdown of GPM sources
const getGPMBreakdown = () => {
  let flushTankFU = 0
  let flushValveFU = 0
  let hoseBibbCount = 0

  // Count fixtures by type
  if (props.item.pipeLoad.fixtures && Array.isArray(props.item.pipeLoad.fixtures)) {
    props.item.pipeLoad.fixtures.forEach((fixture: any) => {
      if (fixture.type === 'HOSE_BIBB') {
        hoseBibbCount += fixture.quantity || 1
      } else if (fixture.type === 'WC_VALVE') {
        const fu = getStandardFU(fixture.type)
        flushValveFU += fu * (fixture.quantity || 1)
      } else if (fixture.type === 'WC_TANK') {
        const fu = getStandardFU(fixture.type)
        flushTankFU += fu * (fixture.quantity || 1)
      } else {
        const fu = getStandardFU(fixture.type)
        flushTankFU += fu * (fixture.quantity || 1)
      }
    })
  }

  // UPC Standard: Calculate GPM for mixed systems
  const upcResult = calculateUPCGPM(flushTankFU, flushValveFU)
  const gpmFromWC = upcResult.totalGPM
  const gpmFromHoseBibb = hoseBibbCount * 5
  const totalGPM = gpmFromWC + gpmFromHoseBibb

  return {
    flushTankFU,
    flushTankGPM: upcResult.systemType === 'FLUSH_TANK' ? gpmFromWC : 0,
    flushValveFU,
    flushValveGPM: upcResult.systemType === 'FLUSH_VALVE' ? gpmFromWC : 0,
    hoseBibbGPM: gpmFromHoseBibb,
    totalGPM,
    upcSystemType: upcResult.systemType,
    upcTotalFU: upcResult.totalFU
  }
}
</script>

<style scoped>
.accordion-item {
  border: 2px solid;
  border-radius: 8px;
  margin-bottom: 8px;
  overflow: hidden;
}

.accordion-header {
  padding: 12px 16px;
  cursor: pointer;
  transition: background-color 0.2s;
}

.accordion-header:hover {
  background-color: rgba(0, 0, 0, 0.02);
}

.toggle-icon {
  transition: transform 0.2s;
}

.toggle-icon.rotate-90 {
  transform: rotate(90deg);
}

.accordion-content {
  padding: 16px;
  border-top: 2px solid;
}
</style>
