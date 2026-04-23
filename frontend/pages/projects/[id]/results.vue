<template>
  <div class="min-h-screen bg-gray-50">
    <div class="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
      <div class="px-4 py-6 sm:px-0">
        <div class="mb-6">
          <h1 class="text-3xl font-bold text-gray-900">Results</h1>
          <p class="mt-1 text-sm text-gray-600">สรุปผลการคำนวณและสเปคปั๊ม</p>
        </div>

        <!-- Result Display Component -->
        <div class="mb-6">
          <ResultDisplay
            v-if="hasResults"
            :project-id="projectId"
          />
          <div v-else class="bg-white rounded-lg shadow-sm p-8 text-center">
            <svg class="mx-auto h-16 w-16 text-gray-400 mb-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 17v-2m3 2v-4m3 4v-6m2 10h7a2 2 0 002-2V9a2 2 0 00-2-2H9a2 2 0 00-2 2v6a2 2 0 002 2zm9-2h.01M9 3v1m6 0h-6m3 0h-6" />
            </svg>
            <h3 class="text-lg font-medium text-gray-900 mb-2">ยังไม่มีผลการคำนวณ</h3>
            <p class="text-gray-600 mb-4">ไปที่หน้า Calculation เพื่อคำนวณก่อน</p>
            <button
              @click="goToCalculation"
              class="px-6 py-3 bg-orange-600 text-white rounded-lg hover:bg-orange-700 transition-colors"
            >
              ไปยัง Calculation
            </button>
          </div>
        </div>

        <!-- Pump Specification -->
        <div v-if="hasResults" class="bg-white rounded-lg shadow-sm p-6">
          <div class="flex items-center justify-between mb-4">
            <h3 class="text-lg font-medium text-gray-900">สเปคปั๊ม (Pump Specification)</h3>
            <div class="flex gap-2">
              <button
                @click="exportResults"
                class="px-4 py-2 border border-gray-300 rounded-lg text-sm font-medium text-gray-700 bg-white hover:bg-gray-50"
              >
                Export
              </button>
              <button
                @click="printResults"
                class="px-4 py-2 border border-gray-300 rounded-lg text-sm font-medium text-gray-700 bg-white hover:bg-gray-50"
              >
                Print
              </button>
            </div>
          </div>

          <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <div class="bg-blue-50 rounded-lg p-4">
              <p class="text-xs text-blue-700 mb-1">Total Dynamic Head (TDH)</p>
              <p class="text-2xl font-bold text-blue-900">{{ pumpSpec.tdh }} m.wg</p>
              <p class="text-xs text-blue-600 mt-1">{{ pumpSpec.tdhBar }} bar</p>
            </div>
            <div class="bg-green-50 rounded-lg p-4">
              <p class="text-xs text-green-700 mb-1">Flow Rate</p>
              <p class="text-2xl font-bold text-green-900">{{ pumpSpec.flowRate }} GPM</p>
              <p class="text-xs text-green-600 mt-1">{{ pumpSpec.flowRateLPS }} LPS</p>
            </div>
            <div class="bg-orange-50 rounded-lg p-4">
              <p class="text-xs text-orange-700 mb-1">Inlet Pressure</p>
              <p class="text-2xl font-bold text-orange-900">{{ pumpSpec.inletPressure }} bar</p>
            </div>
            <div class="bg-purple-50 rounded-lg p-4">
              <p class="text-xs text-purple-700 mb-1">Residual Pressure</p>
              <p class="text-2xl font-bold text-purple-900">{{ pumpSpec.residualPressure }} bar</p>
            </div>
          </div>

          <div class="mt-6 flex justify-between items-center">
            <div class="flex gap-3">
              <BackButton @click="goToPrevStep" />
              <NextStepButton @click="goToNextStep" :disabled="!hasResults" />
            </div>
            <button
              @click="saveResults"
              class="px-6 py-3 bg-orange-600 text-white rounded-lg hover:bg-orange-700 transition-colors"
            >
              บันทึกผลลัพธ์
            </button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import ResultDisplay from '~/components/calculator/ResultDisplay.vue'
import NextStepButton from '~/components/navigation/NextStepButton.vue'
import BackButton from '~/components/navigation/BackButton.vue'
import { calculationsApi } from '~/composables/useApi'
import { useWorkflowStore } from '~/stores/workflowStore'

const route = useRoute()
const router = useRouter()
const toast = useToast()
const workflowStore = useWorkflowStore()

// State
const projectId = computed(() => parseInt(route.params.id as string))
const hasResults = ref(false)
const pumpSpec = ref<any>({
  tdh: 0,
  tdhBar: 0,
  flowRate: 0,
  flowRateLPS: 0,
  inletPressure: 0,
  residualPressure: 0
})

// Methods
const loadResults = async () => {
  try {
    const results = await calculationsApi.getResults(projectId.value)
    if (results && results.pumpSpec) {
      pumpSpec.value = results.pumpSpec
      hasResults.value = true
    }
  } catch (error) {
    hasResults.value = false
  }
}

const goToCalculation = () => {
  router.push(`/projects/${projectId.value}/calculation`)
}

const exportResults = () => {
  toast.info('ฟีเจอร์ Export ยังไม่เปิดใช้งาน')
}

const printResults = () => {
  window.print()
}

const saveResults = () => {
  workflowStore.markStepComplete('results')
  toast.success('บันทึกผลลัพธ์เรียบร้อย')
}

const goToNextStep = () => {
  router.push(`/projects/${route.params.id}/suggestion`)
}

const goToPrevStep = () => {
  router.push(`/projects/${route.params.id}/calculation`)
}

// Load results on mount
onMounted(async () => {
  await loadResults()
  workflowStore.setCurrentStep('results')
})

definePageMeta({
  layout: 'dashboard',
})
</script>
