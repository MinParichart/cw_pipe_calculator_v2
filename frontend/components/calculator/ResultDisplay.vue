<template>
  <div class="space-y-6">
    <!-- Status Header -->
    <div
      class="rounded-lg p-4"
      :class="statusClasses"
    >
      <div class="flex items-center">
        <svg class="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path
            v-if="result.summary.velocityStatus === 'good'"
            stroke-linecap="round"
            stroke-linejoin="round"
            stroke-width="2"
            d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
          />
          <path
            v-else-if="result.summary.velocityStatus === 'warning'"
            stroke-linecap="round"
            stroke-linejoin="round"
            stroke-width="2"
            d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
          />
          <path
            v-else
            stroke-linecap="round"
            stroke-linejoin="round"
            stroke-width="2"
            d="M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z"
          />
        </svg>
        <div class="ml-3">
          <h3 class="text-lg font-medium">{{ statusTitle }}</h3>
          <p class="text-sm opacity-90">{{ statusMessage }}</p>
        </div>
      </div>
    </div>

    <!-- Key Results -->
    <div class="grid grid-cols-1 sm:grid-cols-2 gap-4">
      <!-- Pipe Size -->
      <div class="card">
        <div class="flex items-center justify-between">
          <div>
            <p class="text-sm text-gray-500">ขนาดท่อที่แนะนำ</p>
            <p class="mt-1 text-2xl font-bold text-gray-900">
              DN {{ result.recommendedPipeSize }}
            </p>
            <p class="text-xs text-gray-500">{{ result.recommendedPipeSize }}mm</p>
          </div>
          <svg class="h-10 w-10 text-primary-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19.428 15.428a2 2 0 00-1.022-.547l-2.387-.477a6 6 0 00-3.86.517l-.318.158a6 6 0 01-3.86.517L6.05 15.21a2 2 0 00-1.806.547M8 4h8l-1 1v5.172a2 2 0 00.586 1.414l5 5c1.26 1.26.367 3.414-1.415 3.414H4.828c-1.782 0-2.674-2.154-1.414-3.414l5-5A2 2 0 009 10.172V5L8 4z" />
          </svg>
        </div>
      </div>

      <!-- Flow Rate -->
      <div class="card">
        <div class="flex items-center justify-between">
          <div>
            <p class="text-sm text-gray-500">อัตราการไหล</p>
            <p class="mt-1 text-2xl font-bold text-gray-900">
              {{ result.flowLPS }} L/s
            </p>
            <p class="text-xs text-gray-500">{{ result.flowGPM }} GPM</p>
          </div>
          <svg class="h-10 w-10 text-primary-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 10V3L4 14h7v7l9-11h-7z" />
          </svg>
        </div>
      </div>

      <!-- Velocity -->
      <div class="card">
        <div class="flex items-center justify-between">
          <div>
            <p class="text-sm text-gray-500">ความเร็วน้ำ</p>
            <p class="mt-1 text-2xl font-bold" :class="velocityColor">
              {{ result.velocity }} m/s
            </p>
            <p class="text-xs text-gray-500">มาตรฐาน: 1.2-2.4 m/s</p>
          </div>
          <svg class="h-10 w-10" :class="velocityColor" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
          </svg>
        </div>
      </div>

      <!-- Head Loss -->
      <div class="card">
        <div class="flex items-center justify-between">
          <div>
            <p class="text-sm text-gray-500">การสูญเสียแรงดันรวม</p>
            <p class="mt-1 text-2xl font-bold text-gray-900">
              {{ result.totalHeadLoss }}
            </p>
            <p class="text-xs text-gray-500">{{ result.summary.frictionLossPer100m }} m/100m</p>
          </div>
          <svg class="h-10 w-10 text-primary-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
          </svg>
        </div>
      </div>
    </div>

    <!-- Detailed Breakdown -->
    <div class="card">
      <h3 class="text-lg font-medium text-gray-900 mb-4">รายละเอียดการคำนวณ</h3>

      <div class="space-y-4">
        <!-- Fixture Units -->
        <div class="flex justify-between items-center py-2 border-b">
          <span class="text-sm text-gray-600">Fixture Units รวม</span>
          <span class="font-medium">{{ result.totalFU }} FU</span>
        </div>

        <!-- Flow Conversion -->
        <div class="flex justify-between items-center py-2 border-b">
          <span class="text-sm text-gray-600">แปลงเป็นอัตราการไหล (Hunter's Curve)</span>
          <span class="font-medium">{{ result.flowGPM }} GPM</span>
        </div>

        <!-- Unit Conversion -->
        <div class="flex justify-between items-center py-2 border-b">
          <span class="text-sm text-gray-600">แปลงหน่วย → LPS</span>
          <span class="font-medium">{{ result.flowLPS }} L/s</span>
        </div>

        <!-- Velocity Check -->
        <div class="flex justify-between items-center py-2 border-b">
          <span class="text-sm text-gray-600">ตรวจสอบความเร็ว</span>
          <span
            class="font-medium px-2 py-1 rounded text-xs"
            :class="velocityBadgeClass"
          >
            {{ velocityLabel }}
          </span>
        </div>

        <!-- Head Loss Breakdown -->
        <div class="py-2">
          <p class="text-sm text-gray-600 mb-2">การสูญเสียแรงดัน</p>
          <div class="pl-4 space-y-1">
            <div class="flex justify-between text-sm">
              <span class="text-gray-500">Major Loss (ท่อ)</span>
              <span>{{ result.frictionLoss }} m</span>
            </div>
            <div class="flex justify-between text-sm">
              <span class="text-gray-500">Minor Loss (Fittings)</span>
              <span>{{ (result.totalHeadLoss - result.frictionLoss).toFixed(2) }} m</span>
            </div>
            <div class="flex justify-between text-sm font-medium border-t pt-1">
              <span class="text-gray-700">รวมทั้งหมด</span>
              <span>{{ result.totalHeadLoss }} m</span>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Recommendations -->
    <div v-if="result.summary.velocityStatus !== 'good'" class="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
      <h4 class="text-sm font-medium text-yellow-800 flex items-center">
        <svg class="h-4 w-4 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
        ข้อแนะนำ
      </h4>
      <ul class="mt-2 text-sm text-yellow-700 space-y-1 list-disc list-inside">
        <li v-if="result.velocity < 1.2">
          ความเร็วต่ำเกินไป อาจเกิดปัญหาตะกอนหรือการสะสมตัว
        </li>
        <li v-else-if="result.velocity > 3">
          ความเร็วสูงเกินไป เสี่ยงต่อ Water Hammer และความเสียหายต่อระบบ
        </li>
        <li v-if="result.velocity > 2.4">
          ความเร็วสูงกว่ามาตรฐาน ควรพิจารณาเพิ่มขนาดท่อ
        </li>
      </ul>
    </div>
  </div>
</template>

<script setup lang="ts">
interface CalculationResult {
  totalFU: number
  flowGPM: number
  flowLPS: number
  recommendedPipeSize: number
  velocity: number
  frictionLoss: number
  totalHeadLoss: number
  summary: {
    pipeSize: string
    velocityStatus: 'good' | 'warning' | 'bad'
    frictionLossPer100m: number
    totalHeadLoss: string
  }
}

defineProps<{
  result: CalculationResult
}>()

const statusClasses = computed(() => {
  switch (props.result?.summary.velocityStatus) {
    case 'good':
      return 'bg-success-50 border border-success-200'
    case 'warning':
      return 'bg-warning-50 border border-warning-200'
    case 'bad':
      return 'bg-danger-50 border border-danger-200'
    default:
      return 'bg-gray-50 border border-gray-200'
  }
})

const statusTitle = computed(() => {
  switch (props.result?.summary.velocityStatus) {
    case 'good':
      return 'ผ่านเกณฑ์'
    case 'warning':
      return 'ควรตรวจสอบ'
    case 'bad':
      return 'ไม่ผ่านเกณฑ์'
    default:
      return 'ไม่สามารถระบุสถานะ'
  }
})

const statusMessage = computed(() => {
  switch (props.result?.summary.velocityStatus) {
    case 'good':
      return 'ขนาดท่อและความเร็วอยู่ในช่วงมาตรฐาน'
    case 'warning':
      return 'ควรพิจารณาปรับขนาดท่อหรือตรวจสอบเพิ่มเติม'
    case 'bad':
      return 'ต้องปรับขนาดท่อให้เหมาะสม'
    default:
      return '-'
  }
})

const velocityColor = computed(() => {
  const v = props.result?.velocity || 0
  if (v < 1.2 || v > 3) return 'text-danger-600'
  if (v > 2.4) return 'text-warning-600'
  return 'text-success-600'
})

const velocityBadgeClass = computed(() => {
  switch (props.result?.summary.velocityStatus) {
    case 'good':
      return 'bg-success-100 text-success-800'
    case 'warning':
      return 'bg-warning-100 text-warning-800'
    case 'bad':
      return 'bg-danger-100 text-danger-800'
    default:
      return 'bg-gray-100 text-gray-800'
  }
})

const velocityLabel = computed(() => {
  const v = props.result?.velocity || 0
  if (v < 1.2) return 'ต่ำเกินไป'
  if (v > 3) return 'สูงเกินไป'
  if (v > 2.4) return 'สูง'
  return 'ปกติ'
})
</script>
