<template>
  <div class="min-h-screen bg-gray-50">
    <div class="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
      <div class="px-4 py-6 sm:px-0">
        <div class="mb-6">
          <h1 class="text-3xl font-bold text-gray-900">Suggestions</h1>
          <p class="mt-1 text-sm text-gray-600">ระบบแนะนำการปรับขนาดท่อ</p>
        </div>

        <div v-if="!hasCalculation" class="bg-white rounded-lg shadow-sm p-6">
          <div class="text-center py-12">
            <svg class="mx-auto h-16 w-16 text-gray-400 mb-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
            </svg>
            <h3 class="text-lg font-medium text-gray-900 mb-2">ยังไม่มีข้อมูลคำนวณ</h3>
            <p class="text-gray-600 mb-6">ไปที่หน้า Calculation เพื่อคำนวณก่อน</p>
            <button
              @click="goToCalculation"
              class="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
            >
              ไปยัง Calculation
            </button>
          </div>
        </div>

        <div v-else class="space-y-6">
          <!-- Auto Suggest Results -->
          <div class="bg-white rounded-lg shadow-sm p-6">
            <div class="flex items-center justify-between mb-4">
              <div class="flex items-center gap-2">
                <svg class="h-5 w-5 text-blue-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
                </svg>
                <h3 class="text-lg font-medium text-gray-900">Auto Suggest Upsizing</h3>
              </div>
              <span class="px-3 py-1 bg-green-100 text-green-800 rounded-full text-sm font-medium">
                {{ autoSuggestCount }} รายการ
              </span>
            </div>

            <div class="space-y-3">
              <div v-for="suggestion in autoSuggestions" :key="suggestion.id" class="border border-blue-200 rounded-lg p-4 bg-blue-50">
                <div class="flex items-start justify-between">
                  <div class="flex-1">
                    <div class="flex items-center gap-2 mb-2">
                      <h4 class="font-medium text-gray-900">{{ suggestion.location }}</h4>
                      <span class="text-sm text-gray-600">({{ suggestion.fixture }})</span>
                    </div>
                    <div class="grid grid-cols-3 gap-4 text-sm">
                      <div>
                        <span class="text-gray-600">ขนาดเดิม:</span>
                        <span class="font-medium text-gray-900 ml-1">{{ suggestion.currentSize }}</span>
                      </div>
                      <div>
                        <span class="text-gray-600">ขนาดแนะนำ:</span>
                        <span class="font-bold text-blue-600 ml-1">{{ suggestion.suggestedSize }}</span>
                      </div>
                      <div>
                        <span class="text-gray-600">เหตุผล:</span>
                        <span class="font-medium text-gray-900 ml-1">{{ suggestion.reason }}</span>
                      </div>
                    </div>
                  </div>
                  <button
                    @click="applySuggestion(suggestion)"
                    class="ml-4 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 text-sm"
                  >
                    ใช้คำแนะนำ
                  </button>
                </div>
              </div>
            </div>
          </div>

          <!-- Hybrid Sizing Results -->
          <div class="bg-white rounded-lg shadow-sm p-6">
            <div class="flex items-center justify-between mb-4">
              <div class="flex items-center gap-2">
                <svg class="h-5 w-5 text-orange-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19.428 15.428a2 2 0 00-1.022-.547l-2.387-.477a6 6 0 00-3.86.517l-.318.158a6 6 0 01-3.86.517L6.05 15.21a2 2 0 00-1.806.547M8 4h8l-1 1v5.172a2 2 0 00.586 1.414l5 5c1.26 1.26.367 3.414-1.415 3.414H4.828c-1.782 0-2.674-2.154-1.414-3.414l5-5A2 2 0 009 10.172V5L8 4z" />
                </svg>
                <h3 class="text-lg font-medium text-gray-900">Hybrid Pipe Sizing</h3>
              </div>
              <span class="px-3 py-1 bg-orange-100 text-orange-800 rounded-full text-sm font-medium">
                {{ hybridSizingCount }} รายการ
              </span>
            </div>

            <div class="space-y-3">
              <div v-for="sizing in hybridSizings" :key="sizing.id" class="border border-orange-200 rounded-lg p-4 bg-orange-50">
                <div class="flex items-start justify-between">
                  <div class="flex-1">
                    <h4 class="font-medium text-gray-900 mb-2">{{ sizing.segment }}</h4>
                    <div class="grid grid-cols-4 gap-4 text-sm">
                      <div>
                        <span class="text-gray-600">Flow Rate:</span>
                        <span class="font-medium text-gray-900 ml-1">{{ sizing.flowRate }}</span>
                      </div>
                      <div>
                        <span class="text-gray-600">Velocity:</span>
                        <span class="font-medium text-gray-900 ml-1">{{ sizing.velocity }}</span>
                      </div>
                      <div>
                        <span class="text-gray-600">ความดันลด:</span>
                        <span class="font-medium text-gray-900 ml-1">{{ sizing.headLoss }}</span>
                      </div>
                      <div>
                        <span class="text-gray-600">ขนาดท่อ:</span>
                        <span class="font-bold text-orange-600 ml-1">{{ sizing.pipeSize }}</span>
                      </div>
                    </div>
                  </div>
                  <button
                    @click="applySizing(sizing)"
                    class="ml-4 px-4 py-2 bg-orange-600 text-white rounded-lg hover:bg-orange-700 text-sm"
                  >
                    ใช้คำแนะนำ
                  </button>
                </div>
              </div>
            </div>
          </div>

          <!-- Summary Card -->
          <div class="bg-gradient-to-r from-blue-500 to-orange-500 rounded-lg shadow-sm p-6 text-white">
            <div class="flex items-center justify-between">
              <div>
                <h3 class="text-xl font-bold mb-1">สรุปคำแนะนำ</h3>
                <p class="text-blue-100">
                  มีคำแนะนำทั้งหมด {{ autoSuggestCount + hybridSizingCount }} รายการ
                  สามารถปรับปรุงระบบได้
                </p>
              </div>
              <div class="text-right">
                <div class="text-3xl font-bold">{{ autoSuggestCount + hybridSizingCount }}</div>
                <div class="text-sm text-blue-100">รายการ</div>
              </div>
            </div>
          </div>

          <!-- Save Button -->
          <div class="flex justify-between items-center">
            <BackButton @click="goToPrevStep" />
            <button
              @click="saveSuggestion"
              class="px-6 py-3 bg-orange-600 text-white rounded-lg hover:bg-orange-700 transition-colors"
            >
              บันทึกคำแนะนำ
            </button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import BackButton from '~/components/navigation/BackButton.vue'
import { calculationsApi } from '~/composables/useApi'
import { useWorkflowStore } from '~/stores/workflowStore'

const route = useRoute()
const router = useRouter()
const toast = useToast()
const workflowStore = useWorkflowStore()

const projectId = computed(() => parseInt(route.params.id as string))
const hasCalculation = ref(false)

const autoSuggestions = ref<any[]>([])
const hybridSizings = ref<any[]>([])

const autoSuggestCount = computed(() => autoSuggestions.value.length)
const hybridSizingCount = computed(() => hybridSizings.value.length)

const loadSuggestions = async () => {
  try {
    // Mock suggestions - in real app, load from API
    hasCalculation.value = true

    autoSuggestions.value = [
      {
        id: 1,
        location: 'ท่อหลัก 1',
        fixture: 'WC 2 ตัว + Lavatory 2 ตัว',
        currentSize: 'Ø15mm',
        suggestedSize: 'Ø20mm',
        reason: 'FU รวมเกินกำหนด',
      },
      {
        id: 2,
        location: 'ท่อแขนง 2',
        fixture: 'Kitchen Sink',
        currentSize: 'Ø15mm',
        suggestedSize: 'Ø20mm',
        reason: 'ระยะทางไกลเกิน 3m',
      },
    ]

    hybridSizings.value = [
      {
        id: 1,
        segment: 'Source → Meter',
        flowRate: '12 GPM',
        velocity: '1.2 m/s',
        headLoss: '0.08 m.wg/m',
        pipeSize: 'Ø25mm',
      },
      {
        id: 2,
        segment: 'Meter → Node 1',
        flowRate: '8 GPM',
        velocity: '1.5 m/s',
        headLoss: '0.12 m.wg/m',
        pipeSize: 'Ø20mm',
      },
    ]
  } catch (error) {
    hasCalculation.value = false
  }
}

const goToCalculation = () => {
  router.push(`/projects/${projectId.value}/calculation`)
}

const applySuggestion = (suggestion: any) => {
  toast.success(`ใช้คำแนะนำ ${suggestion.location} เรียบร้อย`)
}

const applySizing = (sizing: any) => {
  toast.success(`ใช้คำแนะนำ ${sizing.segment} เรียบร้อย`)
}

const saveSuggestion = () => {
  workflowStore.markStepComplete('suggestion')
  toast.success('บันทึกคำแนะนำเรียบร้อย')
}

const goToPrevStep = () => {
  router.push(`/projects/${projectId.value}/results`)
}

onMounted(async () => {
  workflowStore.setCurrentStep('suggestion')
  await loadSuggestions()
})

definePageMeta({
  layout: 'dashboard',
})
</script>
