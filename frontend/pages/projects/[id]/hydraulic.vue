<template>
  <div class="min-h-screen bg-gray-50">
    <div class="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
      <div class="px-4 py-6 sm:px-0">
        <div class="mb-6">
          <h1 class="text-3xl font-bold text-gray-900">Hydraulic Verification</h1>
          <p class="mt-1 text-sm text-gray-600">ตรวจสอบความเร็ว ความดันลด และแรงดันน้ำ</p>
        </div>

        <!-- Verification Summary -->
        <div class="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
          <div class="bg-white rounded-lg shadow-sm p-4">
            <div class="flex items-center justify-between mb-2">
              <span class="text-sm text-gray-600">Status</span>
              <svg class="h-5 w-5" :class="verificationStatus === 'pass' ? 'text-green-500' : 'text-red-500'" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path v-if="verificationStatus === 'pass'" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                <path v-else stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
              </svg>
            </div>
            <p class="text-2xl font-bold" :class="verificationStatus === 'pass' ? 'text-green-600' : 'text-red-600'">
              {{ verificationStatus === 'pass' ? 'ผ่าน' : 'ไม่ผ่าน' }}
            </p>
          </div>

          <div class="bg-white rounded-lg shadow-sm p-4">
            <div class="flex items-center justify-between mb-2">
              <span class="text-sm text-gray-600">Max Velocity</span>
              <svg class="h-5 w-5 text-blue-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 10V3L4 14h7v7l9-11h-7z" />
              </svg>
            </div>
            <p class="text-2xl font-bold text-gray-900">{{ maxVelocity }} m/s</p>
            <p class="text-xs text-gray-500 mt-1">สูงสุด: 3.0 m/s</p>
          </div>

          <div class="bg-white rounded-lg shadow-sm p-4">
            <div class="flex items-center justify-between mb-2">
              <span class="text-sm text-gray-600">Max Head Loss</span>
              <svg class="h-5 w-5 text-orange-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 14l-7 7m0 0l-7-7m7 7V3" />
              </svg>
            </div>
            <p class="text-2xl font-bold text-gray-900">{{ maxHeadLoss }} m.wg</p>
            <p class="text-xs text-gray-500 mt-1">ต่อ 100m</p>
          </div>

          <div class="bg-white rounded-lg shadow-sm p-4">
            <div class="flex items-center justify-between mb-2">
              <span class="text-sm text-gray-600">Min Pressure</span>
              <svg class="h-5 w-5 text-purple-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
              </svg>
            </div>
            <p class="text-2xl font-bold text-gray-900">{{ minPressure }} bar</p>
            <p class="text-xs text-gray-500 mt-1">ต่ำสุด: 1.0 bar</p>
          </div>
        </div>

        <!-- Detailed Results -->
        <div class="bg-white rounded-lg shadow-sm p-6 mb-6">
          <div class="flex items-center justify-between mb-4">
            <h3 class="text-lg font-medium text-gray-900">ผลการตรวจสอบรายระบบ</h3>
            <button
              @click="runVerification"
              :disabled="verifying"
              class="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors text-sm disabled:opacity-50"
            >
              <span v-if="verifying">กำลังตรวจสอบ...</span>
              <span v-else>ตรวจสอบใหม่</span>
            </button>
          </div>

          <!-- Velocity Checks -->
          <div class="mb-6">
            <h4 class="text-md font-semibold text-gray-900 mb-3">ตรวจสอบความเร็วน้ำ (Velocity Check)</h4>
            <div class="space-y-2">
              <div v-for="check in velocityChecks" :key="check.location" class="flex items-center justify-between p-3 rounded-lg" :class="check.pass ? 'bg-green-50' : 'bg-red-50'">
                <div>
                  <span class="font-medium text-gray-900">{{ check.location }}</span>
                  <span class="text-sm text-gray-600 ml-2">{{ check.pipe }}</span>
                </div>
                <div class="flex items-center gap-4">
                  <div class="text-right">
                    <div class="text-sm font-medium" :class="check.pass ? 'text-green-700' : 'text-red-700'">
                      {{ check.velocity }} m/s
                    </div>
                    <div class="text-xs text-gray-500">
                      ขีดจำกัด: ≤ {{ check.limit }} m/s
                    </div>
                  </div>
                  <svg class="h-5 w-5" :class="check.pass ? 'text-green-500' : 'text-red-500'" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path v-if="check.pass" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7" />
                    <path v-else stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </div>
              </div>
            </div>
          </div>

          <!-- Pressure Checks -->
          <div class="mb-6">
            <h4 class="text-md font-semibold text-gray-900 mb-3">ตรวจสอบแรงดันน้ำ (Pressure Check)</h4>
            <div class="space-y-2">
              <div v-for="check in pressureChecks" :key="check.location" class="flex items-center justify-between p-3 rounded-lg" :class="check.pass ? 'bg-green-50' : 'bg-red-50'">
                <div>
                  <span class="font-medium text-gray-900">{{ check.location }}</span>
                </div>
                <div class="flex items-center gap-4">
                  <div class="text-right">
                    <div class="text-sm font-medium" :class="check.pass ? 'text-green-700' : 'text-red-700'">
                      {{ check.pressure }} bar
                    </div>
                    <div class="text-xs text-gray-500">
                      ขีดจำกัด: ≥ {{ check.limit }} bar
                    </div>
                  </div>
                  <svg class="h-5 w-5" :class="check.pass ? 'text-green-500' : 'text-red-500'" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path v-if="check.pass" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7" />
                    <path v-else stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </div>
              </div>
            </div>
          </div>

          <!-- Friction Loss Checks -->
          <div>
            <h4 class="text-md font-semibold text-gray-900 mb-3">ตรวจสอบความดันลด (Friction Loss Check)</h4>
            <div class="space-y-2">
              <div v-for="check in frictionLossChecks" :key="check.location" class="flex items-center justify-between p-3 rounded-lg" :class="check.pass ? 'bg-green-50' : 'bg-red-50'">
                <div>
                  <span class="font-medium text-gray-900">{{ check.location }}</span>
                  <span class="text-sm text-gray-600 ml-2">{{ check.length }}m</span>
                </div>
                <div class="flex items-center gap-4">
                  <div class="text-right">
                    <div class="text-sm font-medium" :class="check.pass ? 'text-green-700' : 'text-red-700'">
                      {{ check.loss }} m.wg/m
                    </div>
                    <div class="text-xs text-gray-500">
                      ขีดจำกัด: ≤ {{ check.limit }} m.wg/m
                    </div>
                  </div>
                  <svg class="h-5 w-5" :class="check.pass ? 'text-green-500' : 'text-red-500'" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path v-if="check.pass" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7" />
                    <path v-else stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </div>
              </div>
            </div>
          </div>
        </div>

        <!-- Action Buttons -->
        <div class="flex justify-between items-center">
          <div class="flex gap-3">
            <BackButton @click="goToPrevStep" />
            <NextStepButton @click="goToNextStep" :disabled="verificationStatus === 'none'" />
          </div>
          <button
            @click="saveHydraulic"
            class="px-6 py-3 bg-orange-600 text-white rounded-lg hover:bg-orange-700 transition-colors"
          >
            บันทึกผลการตรวจสอบ
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import NextStepButton from '~/components/navigation/NextStepButton.vue'
import BackButton from '~/components/navigation/BackButton.vue'
import { calculationsApi } from '~/composables/useApi'
import { useWorkflowStore } from '~/stores/workflowStore'

const route = useRoute()
const router = useRouter()
const toast = useToast()
const workflowStore = useWorkflowStore()

const projectId = computed(() => parseInt(route.params.id as string))
const verifying = ref(false)
const verificationStatus = ref<'pass' | 'fail' | 'none'>('none')
const maxVelocity = ref(0)
const maxHeadLoss = ref(0)
const minPressure = ref(0)

const velocityChecks = ref<any[]>([])
const pressureChecks = ref<any[]>([])
const frictionLossChecks = ref<any[]>([])

const runVerification = async () => {
  verifying.value = true

  try {
    await new Promise(resolve => setTimeout(resolve, 1500))

    // Mock verification results
    velocityChecks.value = [
      { location: 'Source - Meter', pipe: 'Ø25mm', velocity: 1.2, limit: 3.0, pass: true },
      { location: 'Meter - Node 1', pipe: 'Ø20mm', velocity: 1.8, limit: 3.0, pass: true },
      { location: 'Node 1 - Node 2', pipe: 'Ø15mm', velocity: 2.1, limit: 3.0, pass: true },
      { location: 'Node 2 - Fixture 1', pipe: 'Ø15mm', velocity: 2.4, limit: 3.0, pass: true },
    ]

    pressureChecks.value = [
      { location: 'ที่ Source', pressure: 3.5, limit: 2.0, pass: true },
      { location: 'หน้า Meter', pressure: 3.2, limit: 2.0, pass: true },
      { location: 'ที่ Fixture ไกลสุด', pressure: 1.8, limit: 1.0, pass: true },
    ]

    frictionLossChecks.value = [
      { location: 'ท่อหลัก 1', length: 10, loss: 0.08, limit: 0.15, pass: true },
      { location: 'ท่อหลัก 2', length: 8, loss: 0.12, limit: 0.15, pass: true },
      { location: 'ท่อแขนง 1', length: 3, loss: 0.14, limit: 0.15, pass: true },
      { location: 'ท่อแขนง 2', length: 3, loss: 0.13, limit: 0.15, pass: true },
    ]

    // Calculate summary
    maxVelocity.value = Math.max(...velocityChecks.value.map(c => c.velocity))
    maxHeadLoss.value = Math.max(...frictionLossChecks.value.map(c => c.loss))
    minPressure.value = Math.min(...pressureChecks.value.map(c => c.pressure))

    // Determine overall status
    const allPass = [
      ...velocityChecks.value,
      ...pressureChecks.value,
      ...frictionLossChecks.value
    ].every(check => check.pass)

    verificationStatus.value = allPass ? 'pass' : 'fail'

    toast.success('ตรวจสอบระบบเรียบร้อย')
  } catch (error: any) {
    toast.error(error.message || 'Failed to verify')
  } finally {
    verifying.value = false
  }
}

const saveHydraulic = () => {
  if (verificationStatus.value === 'none') {
    toast.error('กรุณาตรวจสอบระบบก่อนบันทึก')
    return
  }

  workflowStore.markStepComplete('hydraulic')
  toast.success('บันทึกผลการตรวจสอบเรียบร้อย')
}

const goToNextStep = () => {
  router.push(`/projects/${route.params.id}/calculation`)
}

const goToPrevStep = () => {
  router.push(`/projects/${route.params.id}/fixtures`)
}

onMounted(async () => {
  workflowStore.setCurrentStep('hydraulic')
  await runVerification()
})

definePageMeta({
  layout: 'dashboard',
})
</script>
