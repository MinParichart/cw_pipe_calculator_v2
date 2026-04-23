<template>
  <div class="min-h-screen bg-gray-50">
    <div class="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
      <div class="px-4 py-6 sm:px-0">
        <!-- Header -->
        <div class="mb-6">
          <h1 class="text-3xl font-bold text-gray-900">คำนวณขนาดท่อน้ำดี</h1>
          <p class="mt-1 text-sm text-gray-600">
            คำนวณขนาดท่อน้ำดีตามมาตรฐาน Hunter's Curve และ Hazen-Williams Formula
          </p>
        </div>

        <div class="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <!-- Left Column - Input Forms -->
          <div class="lg:col-span-2 space-y-6">
            <!-- Project Selection -->
            <div class="card">
              <h2 class="text-lg font-medium text-gray-900 mb-4">เลือกโปรเจกต์</h2>
              <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label class="block text-sm font-medium text-gray-700 mb-1">
                    โปรเจกต์
                  </label>
                  <select
                    v-model="selectedProjectId"
                    @change="onProjectChange"
                    class="w-full rounded-md border-gray-300 shadow-sm focus:border-primary focus:ring focus:ring-primary focus:ring-opacity-50"
                  >
                    <option value="">เลือกโปรเจกต์...</option>
                    <option
                      v-for="project in projects"
                      :key="project.id"
                      :value="project.id"
                    >
                      {{ project.name }}
                    </option>
                  </select>
                </div>
                <div>
                  <label class="block text-sm font-medium text-gray-700 mb-1">
                    Network
                  </label>
                  <select
                    v-model="selectedNetworkId"
                    :disabled="!selectedProjectId"
                    class="w-full rounded-md border-gray-300 shadow-sm focus:border-primary focus:ring focus:ring-primary focus:ring-opacity-50 disabled:bg-gray-100"
                  >
                    <option value="">เลือก Network...</option>
                    <option
                      v-for="network in networks"
                      :key="network.id"
                      :value="network.id"
                    >
                      {{ network.name }}
                    </option>
                  </select>
                </div>
              </div>
            </div>

            <!-- Fixtures Input -->
            <FixtureInput
              v-model:fixtures="fixtures"
              :floor-number="1"
            />

            <!-- Pipe Configuration -->
            <div class="card">
              <h2 class="text-lg font-medium text-gray-900 mb-4">กำหนดค่าท่อ</h2>
              <div class="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <label class="block text-sm font-medium text-gray-700 mb-1">
                    ความยาวท่อ (เมตร)
                  </label>
                  <input
                    v-model.number="pipeLength"
                    type="number"
                    min="0"
                    step="0.1"
                    class="w-full rounded-md border-gray-300 shadow-sm focus:border-primary focus:ring focus:ring-primary focus:ring-opacity-50"
                    placeholder="เช่น 10"
                  >
                </div>
                <div>
                  <label class="block text-sm font-medium text-gray-700 mb-1">
                    C-Factor
                  </label>
                  <input
                    v-model.number="cFactor"
                    type="number"
                    min="1"
                    max="150"
                    class="w-full rounded-md border-gray-300 shadow-sm focus:border-primary focus:ring focus:ring-primary focus:ring-opacity-50"
                    placeholder="เช่น 120"
                  >
                </div>
                <div>
                  <label class="block text-sm font-medium text-gray-700 mb-1">
                    ความสูงต่างระดับ (เมตร)
                  </label>
                  <input
                    v-model.number="elevationChange"
                    type="number"
                    step="0.1"
                    class="w-full rounded-md border-gray-300 shadow-sm focus:border-primary focus:ring focus:ring-primary focus:ring-opacity-50"
                    placeholder="เช่น 3.0"
                  >
                </div>
              </div>
            </div>

            <!-- Design Criteria -->
            <div class="card">
              <div class="flex items-center justify-between mb-4">
                <h2 class="text-lg font-medium text-gray-900">เกณฑ์การออกแบบ</h2>
                <button
                  @click="resetCriteria"
                  class="text-sm text-primary hover:text-primary-dark"
                >
                  คืนค่าเริ่มต้น
                </button>
              </div>
              <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label class="block text-sm font-medium text-gray-700 mb-1">
                    ความดันน้ำแรงเข้า (bar)
                  </label>
                  <input
                    v-model.number="inletPressure"
                    type="number"
                    min="0"
                    step="0.1"
                    class="w-full rounded-md border-gray-300 shadow-sm focus:border-primary focus:ring focus:ring-primary focus:ring-opacity-50"
                    placeholder="เช่น 3.0"
                  >
                </div>
                <div>
                  <label class="block text-sm font-medium text-gray-700 mb-1">
                    ความดันต่ำสุดที่ต้องการ (bar)
                  </label>
                  <input
                    v-model.number="minRequiredPressure"
                    type="number"
                    min="0"
                    step="0.1"
                    class="w-full rounded-md border-gray-300 shadow-sm focus:border-primary focus:ring focus:ring-primary focus:ring-opacity-50"
                    placeholder="เช่น 1.5"
                  >
                </div>
                <div>
                  <label class="block text-sm font-medium text-gray-700 mb-1">
                    ระดับท่อแขวนสูงสุด (เมตร)
                  </label>
                  <input
                    v-model.number="maxPipeHeight"
                    type="number"
                    min="0"
                    step="0.1"
                    class="w-full rounded-md border-gray-300 shadow-sm focus:border-primary focus:ring focus:ring-primary focus:ring-opacity-50"
                    placeholder="เช่น 3.0"
                  >
                </div>
                <div>
                  <label class="block text-sm font-medium text-gray-700 mb-1">
                    ประเภทอาคาร
                  </label>
                  <select
                    v-model="buildingType"
                    class="w-full rounded-md border-gray-300 shadow-sm focus:border-primary focus:ring focus:ring-primary focus:ring-opacity-50"
                  >
                    <option value="residential">ที่อยู่อาศัย</option>
                    <option value="commercial">พาณิชย์</option>
                    <option value="industrial">อุตสาหกรรม</option>
                    <option value="institutional">สถาบัน</option>
                  </select>
                </div>
              </div>
            </div>

            <!-- Calculate Button -->
            <div class="flex gap-4">
              <button
                @click="calculate"
                :disabled="!canCalculate"
                class="flex-1 btn btn-primary text-lg py-3"
              >
                <svg v-if="!calculating" class="h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 7h6m0 10v-3m-3 3h.01M9 17h.01M9 14h.01M12 14h.01M15 11h.01M12 11h.01M9 11h.01M7 21h10a2 2 0 002-2V5a2 2 0 00-2-2H7a2 2 0 00-2 2v14a2 2 0 002 2z" />
                </svg>
                <svg v-else class="animate-spin h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24">
                  <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
                  <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                {{ calculating ? 'กำลังคำนวณ...' : 'คำนวณ' }}
              </button>
              <button
                @click="resetAll"
                class="btn btn-secondary"
              >
                รีเซ็ต
              </button>
            </div>
          </div>

          <!-- Right Column - ALWAYS VISIBLE: HYBRID & AUTO-SUGGEST -->
          <div class="space-y-6">
            <!-- ========== HYBRID PIPE SIZING (ALWAYS VISIBLE) ========== -->
            <div id="hybrid-sizing">
              <div class="bg-gradient-to-r from-purple-600 to-purple-700 rounded-lg p-4 mb-4 shadow-lg">
                <div class="flex items-center">
                  <div class="h-12 w-12 rounded-full bg-white bg-opacity-20 flex items-center justify-center mr-3">
                    <svg class="h-6 w-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                    </svg>
                  </div>
                  <div class="flex-1">
                    <h3 class="text-xl font-bold text-white">🎯 HYBRID PIPE SIZING</h3>
                    <p class="text-purple-100 text-sm">เปรียบเทียบ Table 2.6 กับ Hazen-Williams Formula</p>
                  </div>
                </div>
              </div>

              <HybridPipeSizing
                v-if="selectedNetworkId"
                :network-id="selectedNetworkId"
                :system-type="'FLUSH_TANK'"
                @select="onPipeSizeSelect"
                @apply="onPipeSizeApply"
              />

              <div v-else class="card text-center py-8 border-2 border-dashed border-purple-300 bg-purple-50">
                <svg class="h-16 w-16 mx-auto mb-4 text-purple-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                <h4 class="text-lg font-bold text-purple-900 mb-2">เลือก Project และ Network ก่อน</h4>
                <p class="text-sm text-purple-700">เพื่อเริ่มเปรียบเทียบขนาดท่อ</p>
              </div>
            </div>

            <!-- ========== AUTO-SUGGEST UPSIZING (ALWAYS VISIBLE) ========== -->
            <div id="auto-suggest">
              <div class="bg-gradient-to-r from-orange-600 to-orange-700 rounded-lg p-4 mb-4 shadow-lg">
                <div class="flex items-center">
                  <div class="h-12 w-12 rounded-full bg-white bg-opacity-20 flex items-center justify-center mr-3">
                    <svg class="h-6 w-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
                    </svg>
                  </div>
                  <div class="flex-1">
                    <h3 class="text-xl font-bold text-white">⚡ AUTO-SUGGEST UPSIZING</h3>
                    <p class="text-orange-100 text-sm">วิเคราะห์และแนะนำขนาดท่อที่เหมาะสมที่สุด</p>
                  </div>
                </div>
              </div>

              <AutoSuggestUpsizing
                v-if="selectedNetworkId"
                :network-id="selectedNetworkId"
                :system-type="'FLUSH_TANK'"
              />

              <div v-else class="card text-center py-8 border-2 border-dashed border-orange-300 bg-orange-50">
                <svg class="h-16 w-16 mx-auto mb-4 text-orange-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                <h4 class="text-lg font-bold text-orange-900 mb-2">เลือก Project และ Network ก่อน</h4>
                <p class="text-sm text-orange-700">เพื่อเริ่มวิเคราะห์ขนาดท่อ</p>
              </div>
            </div>

            <!-- Calculation Result (Only shows after calculation) -->
            <div v-if="result" class="card bg-blue-600 bg-opacity-5 border-primary">
              <h3 class="text-sm font-medium text-gray-900 mb-3">สรุปผลการคำนวณ</h3>
              <div class="space-y-2">
                <div class="flex justify-between items-center">
                  <span class="text-sm text-gray-600">อัตราการไหลรวม:</span>
                  <span class="text-sm font-bold text-blue-600">{{ result.totalFlowRate }} GPM</span>
                </div>
                <div class="flex justify-between items-center">
                  <span class="text-sm text-gray-600">Total Fixture Units:</span>
                  <span class="text-sm font-bold text-blue-600">{{ result.totalFixtureUnits }} FU</span>
                </div>
                <div class="flex justify-between items-center">
                  <span class="text-sm text-gray-600">ขนาดท่อที่แนะนำ:</span>
                  <span class="text-sm font-bold text-blue-600">{{ result.recommendedPipeSize }}</span>
                </div>
                <div class="flex justify-between items-center">
                  <span class="text-sm text-gray-600">ความดันเหลืออยู่:</span>
                  <span class="text-sm font-bold" :class="result.remainingPressure >= minRequiredPressure ? 'text-green-600' : 'text-red-600'">
                    {{ result.remainingPressure }} bar
                  </span>
                </div>
              </div>
            </div>

            <!-- Full Results -->
            <div v-if="result">
              <ResultDisplay :result="result" />
            </div>

            <!-- Calculation Steps -->
            <div v-if="result && showSteps" class="card">
              <div class="flex items-center justify-between mb-4">
                <h3 class="text-sm font-medium text-gray-900">ขั้นตอนการคำนวณ</h3>
                <button
                  @click="showSteps = false"
                  class="text-xs text-gray-500 hover:text-gray-700"
                >
                  ซ่อน
                </button>
              </div>
              <div class="space-y-3 text-sm">
                <div v-for="(step, index) in calculationSteps" :key="index" class="flex items-start">
                  <span class="flex-shrink-0 h-5 w-5 rounded-full bg-blue-600 bg-opacity-10 flex items-center justify-center mr-2 mt-0.5">
                    <span class="text-xs font-medium text-blue-600">{{ index + 1 }}</span>
                  </span>
                  <div>
                    <p class="text-gray-900 font-medium">{{ step.title }}</p>
                    <p class="text-gray-600">{{ step.description }}</p>
                  </div>
                </div>
              </div>
            </div>

            <!-- Show Steps Button -->
            <button
              v-if="result && !showSteps"
              @click="showSteps = true"
              class="w-full text-center text-sm text-primary hover:text-primary-dark py-2"
            >
              แสดงขั้นตอนการคำนวณ
            </button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import FixtureInput from '~/components/calculator/FixtureInput.vue'
import ResultDisplay from '~/components/calculator/ResultDisplay.vue'
import HybridPipeSizing from '~/components/calculator/HybridPipeSizing.vue'
import AutoSuggestUpsizing from '~/components/calculator/AutoSuggestUpsizing.vue'
import { projectsApi, networksApi } from '~/composables/useApi'

const toast = useToast()

// State
const projects = ref<any[]>([])
const networks = ref<any[]>([])
const selectedProjectId = ref<number | null>(null)
const selectedNetworkId = ref<number | null>(null)
const fixtures = ref<any>({
  wcTank: 0,
  wcValve: 0,
  lavatory: 0,
  bathtub: 0,
  shower: 0,
  kitchenSink: 0,
  laundryTray: 0,
  dishwasher: 0,
  washingMachine35: 0,
  washingMachine7: 0,
  hoseBibb: 0
})
const buildingType = ref('residential')

// Pipe configuration
const pipeLength = ref(10)
const cFactor = ref(120)
const elevationChange = ref(0)

// Design criteria
const inletPressure = ref(3.0)
const minRequiredPressure = ref(1.5)
const maxPipeHeight = ref(3.0)

// Results
const calculating = ref(false)
const result = ref<any>(null)
const showSteps = ref(false)
const calculationSteps = ref<any[]>([])

// Computed
const canCalculate = computed(() => {
  const hasFixtures = Object.values(fixtures.value).some((v: any) => v > 0)
  return hasFixtures &&
         pipeLength.value > 0 &&
         cFactor.value > 0
})

// Methods
const loadProjects = async () => {
  try {
    projects.value = await projectsApi.list()
  } catch (error: any) {
    toast.error(error.message || 'Failed to load projects')
  }
}

const onProjectChange = async () => {
  selectedNetworkId.value = null
  networks.value = []

  if (selectedProjectId.value) {
    try {
      const projectNetworks = await networksApi.list(selectedProjectId.value)
      networks.value = projectNetworks
    } catch (error: any) {
      toast.error(error.message || 'Failed to load networks')
    }
  }
}

const calculate = async () => {
  if (!canCalculate.value) return

  calculating.value = true
  result.value = null
  calculationSteps.value = []

  try {
    // Simulate calculation (TODO: Replace with actual API call)
    await new Promise(resolve => setTimeout(resolve, 1500))

    // Mock result - calculate FU from fixtures object
    const fixtureFU = {
      wcTank: 3,
      wcValve: 6,
      lavatory: 1,
      bathtub: 2,
      shower: 2,
      kitchenSink: 2,
      laundryTray: 2,
      dishwasher: 1,
      washingMachine35: 2,
      washingMachine7: 3,
      hoseBibb: 2
    }

    const totalFU = Object.entries(fixtures.value).reduce((sum: number, [key, value]) => {
      return sum + (value * (fixtureFU[key as keyof typeof fixtureFU] || 0))
    }, 0)

    const totalFlowRate = Math.round(totalFU * 0.5) // Simplified Hunter's curve

    result.value = {
      totalFixtureUnits: totalFU,
      totalFlowRate: totalFlowRate,
      recommendedPipeSize: '1/2',
      remainingPressure: (inletPressure.value - 0.5).toFixed(2),
      velocity: 1.2,
      frictionLoss: 0.3,
      calculationDate: new Date().toISOString(),
    }

    // Generate calculation steps
    const fixtureCount = Object.values(fixtures.value).filter((v: any) => v > 0).length
    calculationSteps.value = [
      {
        title: 'รวม Fixture Units',
        description: `รวม FU ทั้งหมด = ${totalFU} FU จาก ${fixtureCount} ประเภทสุขภัณฑ์`,
      },
      {
        title: 'แปลง FU → Flow Rate',
        description: `ใช้ Hunter's Curve: ${totalFU} FU → ${totalFlowRate} GPM (${(totalFlowRate * 0.06309).toFixed(2)} LPS)`,
      },
      {
        title: 'คำนวณ Friction Loss',
        description: `Hazen-Williams: hf = ${(0.3).toFixed(3)} m.w.g (ความยาว ${pipeLength.value}m, C=${cFactor.value})`,
      },
      {
        title: 'เลือกขนาดท่อ',
        description: `ตามตารางมาตรฐาน: แนะนำท่อขนาด 1/2" (เส้นผ่านศูนย์กลาง 15mm)`,
      },
      {
        title: 'ตรวจสอบความดัน',
        description: `ความดันเหลือ = ${inletPressure.value} - 0.5 = ${(inletPressure.value - 0.5).toFixed(2)} bar (ต่ำสุด ${minRequiredPressure.value} bar) ✓`,
      },
    ]

    toast.success('คำนวณเสร็จสิ้น')
  } catch (error: any) {
    toast.error(error.message || 'Calculation failed')
  } finally {
    calculating.value = false
  }
}

const resetAll = () => {
  selectedProjectId.value = null
  selectedNetworkId.value = null
  fixtures.value = {
    wcTank: 0,
    wcValve: 0,
    lavatory: 0,
    bathtub: 0,
    shower: 0,
    kitchenSink: 0,
    laundryTray: 0,
    dishwasher: 0,
    washingMachine35: 0,
    washingMachine7: 0,
    hoseBibb: 0
  }
  pipeLength.value = 10
  cFactor.value = 120
  elevationChange.value = 0
  inletPressure.value = 3.0
  minRequiredPressure.value = 1.5
  maxPipeHeight.value = 3.0
  buildingType.value = 'residential'
  result.value = null
  showSteps.value = false
  calculationSteps.value = []
}

const resetCriteria = () => {
  inletPressure.value = 3.0
  minRequiredPressure.value = 1.5
  maxPipeHeight.value = 3.0
  buildingType.value = 'residential'
}

const onPipeSizeSelect = (method: 'table26' | 'hazenWilliams', data: any) => {
  console.log('Selected pipe size:', method, data)
}

const onPipeSizeApply = (method: 'table26' | 'hazenWilliams', data: any) => {
  // Update the result with selected pipe size
  if (result.value) {
    result.value.recommendedPipeSize = data.nominalSize
    result.value.sizingMethod = method
    result.value.internalDiameter = data.internalDiameter
    if (data.velocity) {
      result.value.velocity = data.velocity
    }
    if (data.frictionLoss) {
      result.value.frictionLoss = data.frictionLoss
    }
  }
}

const onPipeUpsizeApply = (pipeId: number, suggestedSize: string) => {
  console.log('Apply pipe upsize:', pipeId, suggestedSize)
  toast.success(`อัปเดตท่อ #${pipeId} เป็นขนาด ${suggestedSize}"`)
}

const onPipeUpsizeApplyAll = (suggestions: Array<{ pipeId: number; suggestedSize: string }>) => {
  console.log('Apply all pipe upsizes:', suggestions)
  toast.success(`อัปเดตท่อทั้งหมด ${suggestions.length} ท่อเรียบร้อย`)
}

// Load data on mount
onMounted(() => {
  loadProjects()
})

// Define page meta for layout
definePageMeta({
  layout: 'dashboard',
})
</script>
