<template>
  <div class="space-y-6">
    <!-- Network Layout Comparison -->
    <div>
      <h4 class="text-md font-semibold text-gray-800 mb-3">Network Layout</h4>
      <div class="overflow-x-auto">
        <table class="w-full text-sm">
          <thead>
            <tr class="bg-gray-100">
              <th class="px-4 py-2 text-left">รายการ</th>
              <th class="px-4 py-2 text-center text-purple-700">{{ version1.name }}</th>
              <th class="px-4 py-2 text-center text-blue-700">{{ version2.name }}</th>
              <th class="px-4 py-2 text-center">สถานะ</th>
            </tr>
          </thead>
          <tbody class="divide-y divide-gray-200">
            <tr>
              <td class="px-4 py-3">Nodes</td>
              <td class="px-4 py-3 text-center">{{ version1.nodeCount || 5 }}</td>
              <td class="px-4 py-3 text-center">{{ version2.nodeCount || 7 }}</td>
              <td class="px-4 py-3 text-center">
                <span class="px-2 py-1 bg-green-100 text-green-800 text-xs rounded">+2</span>
              </td>
            </tr>
            <tr>
              <td class="px-4 py-3">Risers</td>
              <td class="px-4 py-3 text-center">{{ version1.riserCount || 1 }}</td>
              <td class="px-4 py-3 text-center">{{ version2.riserCount || 2 }}</td>
              <td class="px-4 py-3 text-center">
                <span class="px-2 py-1 bg-green-100 text-green-800 text-xs rounded">+1</span>
              </td>
            </tr>
            <tr>
              <td class="px-4 py-3">Bathrooms</td>
              <td class="px-4 py-3 text-center">{{ version1.bathroomCount || 1 }}</td>
              <td class="px-4 py-3 text-center">{{ version2.bathroomCount || 2 }}</td>
              <td class="px-4 py-3 text-center">
                <span class="px-2 py-1 bg-green-100 text-green-800 text-xs rounded">+1</span>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>

    <!-- Fixtures Comparison -->
    <div>
      <h4 class="text-md font-semibold text-gray-800 mb-3">Fixtures</h4>
      <div class="overflow-x-auto">
        <table class="w-full text-sm">
          <thead>
            <tr class="bg-gray-100">
              <th class="px-4 py-2 text-left">สุขภัณฑ์</th>
              <th class="px-4 py-2 text-center text-purple-700">{{ version1.name }}</th>
              <th class="px-4 py-2 text-center text-blue-700">{{ version2.name }}</th>
              <th class="px-4 py-2 text-center">สถานะ</th>
            </tr>
          </thead>
          <tbody class="divide-y divide-gray-200">
            <tr v-for="fixture in fixtureComparison" :key="fixture.name">
              <td class="px-4 py-3">{{ fixture.name }}</td>
              <td class="px-4 py-3 text-center">{{ fixture.v1Count }}</td>
              <td class="px-4 py-3 text-center">{{ fixture.v2Count }}</td>
              <td class="px-4 py-3 text-center">
                <span
                  v-if="fixture.diff > 0"
                  class="px-2 py-1 bg-green-100 text-green-800 text-xs rounded"
                >
                  +{{ fixture.diff }}
                </span>
                <span
                  v-else-if="fixture.diff < 0"
                  class="px-2 py-1 bg-red-100 text-red-800 text-xs rounded"
                >
                  {{ fixture.diff }}
                </span>
                <span v-else class="text-gray-400">-</span>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>

    <!-- Pipe Sizes Comparison -->
    <div>
      <h4 class="text-md font-semibold text-gray-800 mb-3">Pipe Sizes</h4>
      <div class="overflow-x-auto">
        <table class="w-full text-sm">
          <thead>
            <tr class="bg-gray-100">
              <th class="px-4 py-2 text-left">ท่อ</th>
              <th class="px-4 py-2 text-center text-purple-700">{{ version1.name }}</th>
              <th class="px-4 py-2 text-center text-blue-700">{{ version2.name }}</th>
              <th class="px-4 py-2 text-center">สถานะ</th>
            </tr>
          </thead>
          <tbody class="divide-y divide-gray-200">
            <tr v-for="pipe in pipeComparison" :key="pipe.name">
              <td class="px-4 py-3">{{ pipe.name }}</td>
              <td class="px-4 py-3 text-center">{{ pipe.v1Size }}</td>
              <td class="px-4 py-3 text-center">{{ pipe.v2Size }}</td>
              <td class="px-4 py-3 text-center">
                <span
                  v-if="pipe.changed"
                  class="px-2 py-1 bg-orange-100 text-orange-800 text-xs rounded"
                >
                  เปลี่ยน
                </span>
                <span v-else class="text-gray-400">-</span>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>

    <!-- Calculations Comparison -->
    <div>
      <h4 class="text-md font-semibold text-gray-800 mb-3">Calculations</h4>
      <div class="overflow-x-auto">
        <table class="w-full text-sm">
          <thead>
            <tr class="bg-gray-100">
              <th class="px-4 py-2 text-left">พารามิเตอร์</th>
              <th class="px-4 py-2 text-center text-purple-700">{{ version1.name }}</th>
              <th class="px-4 py-2 text-center text-blue-700">{{ version2.name }}</th>
              <th class="px-4 py-2 text-center">สถานะ</th>
            </tr>
          </thead>
          <tbody class="divide-y divide-gray-200">
            <tr v-for="calc in calculationComparison" :key="calc.name">
              <td class="px-4 py-3">{{ calc.name }}</td>
              <td class="px-4 py-3 text-center">{{ calc.v1Value }}</td>
              <td class="px-4 py-3 text-center">{{ calc.v2Value }}</td>
              <td class="px-4 py-3 text-center">
                <span
                  v-if="calc.status === 'better'"
                  class="px-2 py-1 bg-green-100 text-green-800 text-xs rounded"
                >
                  ดีขึ้น
                </span>
                <span
                  v-else-if="calc.status === 'worse'"
                  class="px-2 py-1 bg-red-100 text-red-800 text-xs rounded"
                >
                  แย่ลง
                </span>
                <span
                  v-else-if="calc.status === 'changed'"
                  class="px-2 py-1 bg-orange-100 text-orange-800 text-xs rounded"
                >
                  เปลี่ยน
                </span>
                <span v-else class="text-gray-400">-</span>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
interface Version {
  id: number
  name: string
  description: string
  fixtureCount: number
  pipeCount: number
  avgPressure: number
  createdAt: Date
  nodeCount?: number
  riserCount?: number
  bathroomCount?: number
}

interface Props {
  version1: Version
  version2: Version
}

const props = defineProps<Props>()

// Mock comparison data - TODO: Calculate from actual version data
const fixtureComparison = ref([
  { name: 'WC (Flush tank)', v1Count: 2, v2Count: 3, diff: 1 },
  { name: 'Lavatory', v1Count: 2, v2Count: 3, diff: 1 },
  { name: 'Shower', v1Count: 1, v2Count: 2, diff: 1 },
  { name: 'Kitchen sink', v1Count: 1, v2Count: 1, diff: 0 },
])

const pipeComparison = ref([
  { name: 'Source → J1', v1Size: '25mm', v2Size: '25mm', changed: false },
  { name: 'J1 → Riser 1F', v1Size: '25mm', v2Size: '32mm', changed: true },
  { name: 'Riser 1F → Riser 2F', v1Size: '-', v2Size: '25mm', changed: true },
  { name: 'Riser 1F → Bath 1', v1Size: '15mm', v2Size: '15mm', changed: false },
])

const calculationComparison = ref([
  { name: 'Velocity (เฉลี่ย)', v1Value: '1.2 m/s', v2Value: '1.0 m/s', status: 'better' },
  { name: 'Friction Loss (รวม)', v1Value: '2.5 m', v2Value: '3.1 m', status: 'worse' },
  { name: 'Pressure (剩余)', v1Value: '1.8 bar', v2Value: '2.1 bar', status: 'better' },
  { name: 'Flow Rate (รวม)', v1Value: '0.8 LPS', v2Value: '1.1 LPS', status: 'changed' },
])
</script>
